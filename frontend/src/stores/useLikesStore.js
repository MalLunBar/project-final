import { create } from 'zustand'
import { fetchLikedLoppis, toggleLikeLoppis } from '../services/likesApi.js'

const useLikesStore = create((set, get) => ({
  likedLoppisIds: [],

  // load liked loppis on app start or login
  loadLikedLoppis: async (token) => {
    try {
      const likedLoppis = await fetchLikedLoppis(token)
      set({ likedLoppisIds: likedLoppis.map(l => l._id) })
    } catch (error) {
      console.error('Failed to load liked loppis:', error.message)
      set({ likedLoppisIds: [] })
    }
  },

  // toggle like/unlike for a loppis
  toggleLike: async (loppisId, token) => {
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
      const { action, loppis } = await toggleLikeLoppis(loppisId, token)
      if (action === 'unliked') {
        set(state => ({
          likedLoppisIds: state.likedLoppisIds.filter(id => id !== loppis._id)
        }))
      } else if (action === 'liked') {
        set(state => ({
          likedLoppisIds: [...state.likedLoppisIds, loppis._id]
        }))
      } else {
        throw new Error('Unexpected action response from server')
      }
    } catch (error) {
      console.error('Failed to update like status:', error.message)
      // rollback optimistic update if API call fails
      set(state => ({
        likedLoppisIds: isLiked
          ? state.likedLoppisIds // rollback to previous state if unlike failed
          : state.likedLoppisIds.filter(id => id !== loppisId) // remove the newly added loppis if like failed
      }))
    }
  }
}))

export default useLikesStore