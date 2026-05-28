import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
}))