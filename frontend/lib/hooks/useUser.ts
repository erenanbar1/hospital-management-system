import { create } from 'zustand'

interface UserState {
  userId: string | null
  userName: string | null
  userRole: string | null
  setUser: (userId: string, userName: string, userRole: string) => void
  clearUser: () => void
}

export const useUser = create<UserState>((set) => ({
  userId: null,
  userName: null,
  userRole: null,
  setUser: (userId, userName, userRole) => set({ userId, userName, userRole }),
  clearUser: () => set({ userId: null, userName: null, userRole: null })
}))