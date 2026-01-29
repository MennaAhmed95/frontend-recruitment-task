import { create } from 'zustand'
import * as R from 'ramda'

/**
 * Timeline data model (matches ARCHITECTURE.md)
 *
 * Track: { id, type, name, clips: Clip[] }
 * Clip:  { id, startTime, endTime, data: { name, ... } }
 */

export const useTimelineStore = create((set, get) => ({
  duration: 60,
  playhead: 10,
  zoom: 1, // timeline scale
  tracks: demoTracks(),
  activeClipId: null,
  selectedClipIds: [],

  actions: {
    hasSelection() {
      const s = get()
      return s.selectedClipIds.length > 0
    },
    setPlayhead(time) {
      set((s) => ({ playhead: clamp(time, 0, s.duration) }))
    },
    setZoom(zoom) {
      set(() => ({ zoom: clamp(zoom, 0.25, 4) }))
    },
    selectClip(clipId) {
      set(() => ({ selectedClipIds: [clipId] }))
    },
    activateClip(clipId) {
      set(() => ({ activeClipId: clipId, selectedClipIds: [clipId] }))
    },
    loadFromEditor(editor) {
      if (!editor) return
      set(() => ({
        duration: editor.duration ?? 60,
        playhead: editor.playhead ?? 0,
        zoom: editor.zoom ?? editor.scale ?? 1,
        tracks: editor.tracks ?? demoTracks(),
        activeClipId: editor.activeClipId ?? null,
        selectedClipIds: editor.selectedClipIds ?? [],
      }))
    },
    toEditor() {
      const s = get()
      return {
        duration: s.duration,
        playhead: s.playhead,
        zoom: s.zoom,
        tracks: s.tracks,
        activeClipId: s.activeClipId,
        selectedClipIds: s.selectedClipIds,
      }
    },
    splitSelectedClipAtMidpoint() {
      const s = get()
      const clipId = s.selectedClipIds[0]
      if (!clipId) return

      const clipPath = findClipPath(s.tracks, clipId)
      if (!clipPath) return

      const { trackIndex, clipIndex, clip } = clipPath
      const mid = (clip.startTime + clip.endTime) / 2
      if (mid <= clip.startTime || mid >= clip.endTime) return

      const left = { ...clip, endTime: mid }
      const right = {
        ...clip,
        id: crypto.randomUUID(),
        startTime: mid,
        data: { ...(clip.data || {}), name: `${clip.data?.name || 'Clip'} (2)` },
      }

      set((state) => {
        const newTracks = R.over(
          R.lensPath([trackIndex, 'clips']),
          (clips) => [
            ...clips.slice(0, clipIndex),
            left,
            right,
            ...clips.slice(clipIndex + 1),
          ],
          state.tracks,
        )
        return {
          tracks: newTracks,
          activeClipId: right.id,
          selectedClipIds: [right.id],
        }
      })
    },
    addClipToFirstTrack() {
      const s = get()
      const firstTrack = s.tracks[0]
      if (!firstTrack) return

      const id = crypto.randomUUID()
      const startTime = Math.max(0, s.playhead)
      const clipLen = 8
      const endTime = startTime + clipLen
      const newDuration = Math.max(s.duration, endTime)
      const clip = {
        id,
        startTime,
        endTime,
        data: { name: `New clip (${firstTrack.name})` },
      }

      set((state) => ({
        duration: newDuration,
        tracks: state.tracks.map((t) =>
          t.id === firstTrack.id ? { ...t, clips: [...t.clips, clip] } : t,
        ),
        activeClipId: id,
        selectedClipIds: [id],
      }))
    },
    addTrack(type = 'video') {
      set((s) => {
        const index = s.tracks.length + 1
        const id = crypto.randomUUID()
        const name = `Track ${index}`
        const track = { id, type, name, clips: [] }
        return { tracks: [...s.tracks, track] }
      })
    },
    addClipToTrack(trackId) {
      const s = get()
      const trackIndex = s.tracks.findIndex((t) => t.id === trackId)
      if (trackIndex === -1) return

      const id = crypto.randomUUID()
      const startTime = Math.max(0, s.playhead)
      const clipLen = 8
      const endTime = startTime + clipLen
      const newDuration = Math.max(s.duration, endTime)
      const clip = {
        id,
        startTime,
        endTime,
        data: { name: `New clip` },
      }

      set((state) => {
        const newTracks = R.over(
          R.lensPath([trackIndex, 'clips']),
          (clips) => [...clips, clip],
          state.tracks,
        )
        return {
          duration: newDuration,
          tracks: newTracks,
          activeClipId: id,
          selectedClipIds: [id],
        }
      })
    },
    deleteTrack(trackId) {
      const s = get()
      set(() => ({
        tracks: s.tracks.filter((t) => t.id !== trackId),
        activeClipId:
          s.activeClipId &&
          s.tracks.some(
            (t) =>
              t.id !== trackId &&
              t.clips.some((c) => c.id === s.activeClipId),
          )
            ? s.activeClipId
            : null,
        selectedClipIds: [],
      }))
    },
    deleteSelectedClip() {
      const s = get()
      const clipId = s.selectedClipIds[0]
      if (!clipId) return

      const clipPath = findClipPath(s.tracks, clipId)
      if (!clipPath) return

      const { trackIndex, clipIndex } = clipPath
      set((state) => {
        const newTracks = R.over(
          R.lensPath([trackIndex, 'clips']),
          (clips) => [
            ...clips.slice(0, clipIndex),
            ...clips.slice(clipIndex + 1),
          ],
          state.tracks,
        )
        return {
          tracks: newTracks,
          activeClipId: null,
          selectedClipIds: [],
        }
      })
    },
    moveClip(trackId, clipId, newStartTime) {
      set((s) => {
        const trackIndex = s.tracks.findIndex((t) => t.id === trackId)
        if (trackIndex === -1) return s

        const track = s.tracks[trackIndex]
        const clipIndex = track.clips.findIndex((c) => c.id === clipId)
        if (clipIndex === -1) return s

        const clip = track.clips[clipIndex]
        const duration = clip.endTime - clip.startTime
        const clampedStart = clamp(newStartTime, 0, s.duration - duration)
        const updated = {
          ...clip,
          startTime: clampedStart,
          endTime: clampedStart + duration,
        }

        const newTracks = R.over(
          R.lensPath([trackIndex, 'clips']),
          (clips) => clips.map((c) => (c.id === clipId ? updated : c)),
          s.tracks,
        )

        return { tracks: newTracks }
      })
    },
  },
}))

function demoTracks() {
  return [
    {
      id: 'track-bg',
      type: 'background',
      name: 'Background',
      clips: [
        {
          id: 'c-bg',
          startTime: 0,
          endTime: 55,
          data: { name: 'Background' },
        },
      ],
    },
    {
      id: 'track-v1',
      type: 'video',
      name: 'Video Track 1 (Text: VIDEO)',
      clips: [
        { id: 'c-v1', startTime: 0, endTime: 55, data: { name: 'VIDEO' } },
      ],
    },
    {
      id: 'track-v2',
      type: 'video',
      name: 'Video Track 2 (icons)',
      clips: [
        { id: 'c-v2', startTime: 0, endTime: 55, data: { name: 'icons' } },
      ],
    },
    {
      id: 'track-a1',
      type: 'audio',
      name: 'Audio Track 1 (Intro)',
      clips: [
        {
          id: 'c-a1',
          startTime: 0,
          endTime: 55,
          data: { name: 'Intro - Artist' },
        },
      ],
    },
    {
      id: 'track-a2',
      type: 'audio',
      name: 'Audio Track 2 (Outro.mp3)',
      clips: [
        { id: 'c-a2', startTime: 18, endTime: 38, data: { name: 'Outro.mp3' } },
      ],
    },
  ]
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function findClipPath(tracks, clipId) {
  for (let ti = 0; ti < tracks.length; ti++) {
    const clips = tracks[ti].clips
    for (let ci = 0; ci < clips.length; ci++) {
      if (clips[ci].id === clipId) {
        return { trackIndex: ti, clipIndex: ci, clip: clips[ci] }
      }
    }
  }
  return null
}

