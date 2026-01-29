import { create } from 'zustand'

import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from '@/services/projectsService.js'
import { useTimelineStore } from '@/stores/timelineStore'
import { useHistoryStore } from '@/stores/historyStore'

export const useProjectsStore = create((set, get) => ({
  items: [],
  activeId: null,
  loading: false,
  saving: false,

  selectors: {
    activeProject() {
      const s = get()
      return s.items.find((p) => p.id === s.activeId) || null
    },
  },

  actions: {
    async loadProjects() {
      set(() => ({ loading: true }))
      try {
        const items = await fetchProjects()
        set(() => ({ items, loading: false }))
      } catch (e) {
        console.error(e)
        set(() => ({ loading: false }))
      }
    },

    async createProject(name) {
      try {
        const editor = useTimelineStore.getState().actions.toEditor()
        const created = await createProject({ name, editor })
        set((s) => ({ items: [created, ...s.items] }))
      } catch (e) {
        console.error(e)
      }
    },

    async deleteProject(id) {
      try {
        await deleteProject(id)
        set((s) => ({
          items: s.items.filter((p) => p.id !== id),
          activeId: s.activeId === id ? null : s.activeId,
        }))
      } catch (e) {
        console.error(e)
      }
    },

    setActiveProject(id) {
      const prevSnapshot = snapshotForHistory()
      useHistoryStore.getState().actions.push(prevSnapshot)

      set(() => ({ activeId: id }))

      const p = get().items.find((x) => x.id === id) || null
      useTimelineStore.getState().actions.loadFromEditor(p?.data?.editor)
    },

    async saveActiveProject() {
      const p = get().selectors.activeProject()
      if (!p) return

      set(() => ({ saving: true }))
      try {
        const editor = useTimelineStore.getState().actions.toEditor()
        const payload = { ...(p.data || {}), editor }
        const updated = await updateProject(p.id, payload)
        set((s) => ({
          saving: false,
          items: s.items.map((x) => (x.id === updated.id ? updated : x)),
        }))
      } catch (e) {
        console.error(e)
        set(() => ({ saving: false }))
      }
    },
  },
}))

export function snapshotForHistory() {
  const timeline = useTimelineStore.getState().actions.toEditor()
  const activeId = useProjectsStore.getState().activeId
  return { timeline, activeId }
}

