import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
// devtools is used for Redux DevTools tracking
// persist is used to save to localStorage
import { loginUser, registerUser } from '../services/authApi.js'
import useLikesStore from './useLikesStore.js'

const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null, // user object with id and FirstName
        token: null,
        isLoading: false,
        error: null,

        login: async (credentials) => {
          set({ isLoading: true, error: null })
          try {
            const currentUser = await loginUser(credentials)
            set({
              user: currentUser,
              token: currentUser.accessToken,
              isLoading: false,
              error: null,
            })
            // load liked loppis for this user
            const { loadLikedLoppis } = useLikesStore.getState()
            console.log('Loading liked loppis for user: ', currentUser.id)
            await loadLikedLoppis(currentUser.id, currentUser.accessToken)
          } catch (err) {
            set({
              error: err.message || "Inloggningen misslyckades",
              isLoading: false,
            })
            throw err // so component can catch if needed
          }
        },

        register: async (userData) => {
          set({ isLoading: true, error: null })
          try {
            const newUser = await registerUser(userData)
            set({
              user: newUser,
              token: newUser.accessToken,
              isLoading: false,
              error: null,
            })
          } catch (err) {
            set({
              error: err.message || "Registreringen misslyckades",
              isLoading: false,
            })
            throw err // so component can catch if needed
          }
        },

        logout: () => {
          set({ user: null, token: null })
          localStorage.removeItem('token')
        },

        clearError: () => set({ error: null })
      }),
      {
        name: 'auth-storage', // localStorage key
      }
    ),
    {
      name: 'AuthStore', // name shown in Redux DevTools
    }
  )
)

export default useAuthStore