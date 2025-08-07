import { create } from 'zustand'

const useModalStore = create((set) => ({
  loginModalOpen: false,
  openLoginModal: () => set({ loginModalOpen: true }),
  closeLoginModal: () => set({ loginModalOpen: false })
}))

export default useModalStore