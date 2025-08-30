import { create } from "zustand"

// Store to manage updating state for loppis items (images)

const useLoppisUpdateStore = create((set) => ({
  updating: {},
  setUpdating: (id, flag) =>
    set((s) => ({ updating: { ...s.updating, [id]: flag } })),
}))

export default useLoppisUpdateStore
