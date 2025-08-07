import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
// devtools is used for Redux DevTools tracking
// persist is used to save to localStorage

const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        login: (user, token) => set({ user, token }),
        logout: () => set({ user: null, token: null })
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