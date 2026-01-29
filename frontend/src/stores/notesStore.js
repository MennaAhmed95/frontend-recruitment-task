import { create } from 'zustand'

import { createNote, deleteNote, fetchNotes } from '@/services/notesService.js'
import { useProjectsStore } from '@/stores/projectsStore'

export const useNotesStore = create((set) => ({
  items: [],
  loading: false,

  actions: {
    async loadNotesForActiveProject() {
      const projectId = useProjectsStore.getState().activeId
      if (!projectId) {
        set(() => ({ items: [], loading: false }))
        return
      }

      set(() => ({ loading: true }))
      try {
        const items = await fetchNotes(projectId)
        set(() => ({ items, loading: false }))
      } catch (e) {
        console.error(e)
        set(() => ({ loading: false }))
      }
    },

    async addNote(text) {
      const projectId = useProjectsStore.getState().activeId
      if (!projectId) return

      try {
        const created = await createNote({ projectId, text })
        set((s) => ({ items: [created, ...s.items] }))
      } catch (e) {
        console.error(e)
      }
    },

    async deleteNote(id) {
      try {
        await deleteNote(id)
        set((s) => ({ items: s.items.filter((n) => n.id !== id) }))
      } catch (e) {
        console.error(e)
      }
    },
  },
}))

