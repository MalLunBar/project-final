import { create } from 'zustand'

const useModalStore = create((set) => ({
  loginModalOpen: false,
  loginMessage: '',
  openLoginModal: (message = '') =>
    set({ loginModalOpen: true, loginMessage: message }),
  closeLoginModal: () =>
    set({ loginModalOpen: false, loginMessage: '' })
}))

export default useModalStore