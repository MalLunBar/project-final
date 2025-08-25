// src/stores/useErrorStore.js
import { create } from 'zustand'

const useErrorStore = create((set) => ({
  // Globalt felobjekt (null = inget fel)
  error: null, // { message: string, type: 'error' | 'warning' | 'info' | 'success', ts: number }

  // Sätt globalt fel
  setError: (message, type = 'error') =>
    set({ error: { message, type, ts: Date.now() } }),

  // Rensa fel
  clearError: () => set({ error: null }),
}))

export default useErrorStore
