import { create } from 'zustand'
import { getUserLikes } from '../services/usersApi.js'
import { toggleLikeLoppis } from '../services/loppisApi.js'

const useLikesStore = create((set, get) => ({
  likedLoppisData: [],
  likedLoppisIds: [],

  // load liked loppis on app start or login
  loadLikedLoppis: async (userId, token) => {
    try {
      const data = await getUserLikes(userId, token)
      const ids = data.map((l) => l._id)
      set({ likedLoppisData: data, likedLoppisIds: ids })
    } catch (error) {
      console.error('Failed to load liked loppis:', error.message)
      set({ likedLoppisData: [], likedLoppisIds: [] })
    }
  },

  // toggle like/unlike for a loppis
  toggleLike: async (loppisId, userId, token) => {
    // optimistic update
    const { likedLoppisIds } = get()
    const isLiked = likedLoppisIds.includes(loppisId)
    set({
      likedLoppisIds: isLiked
        ? likedLoppisIds.filter(id => id !== loppisId) //unlike
        : [...likedLoppisIds, loppisId] //like
    })

    // make API call
    try {
      await toggleLikeLoppis(loppisId, token)
      // reload liked loppis after successful API call to ensure state is consistent
      get().loadLikedLoppis(userId, token)
    } catch (error) {
      console.error('Failed to update like status:', error.message)
      // rollback optimistic update if API call fails
      set({
        likedLoppisIds: isLiked
          ? [...likedLoppisIds, loppisId] // rollback unlike
          : likedLoppisIds.filter(id => id !== loppisId) // rollback like
      })
    }
  },

  clearLikes: () => set({ likedLoppisData: [], likedLoppisIds: [] }),
}))

export default useLikesStore