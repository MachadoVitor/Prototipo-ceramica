import { create } from 'zustand'
import { registerUser, verifyLogin, setLastLoggedInEmail } from '../lib/auth'

const STORAGE_KEY = 'clayplus-auth'

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveAuth(auth) {
  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export const useAuthStore = create((set) => ({
  user: loadAuth(),

  // Cria conta no registry e seta sessão ativa
  signup: async ({ name, email, password, plan }) => {
    if (password) {
      await registerUser({ name, email, password })
    }
    setLastLoggedInEmail(email)
    const user = {
      name,
      email: email.toLowerCase().trim(),
      photo: null,
      plan: plan || 'free',
      createdAt: new Date().toISOString(),
    }
    saveAuth(user)
    set({ user })
  },

  // Seta sessão sem registrar (usado pelo login e biometria)
  setSession: (userData) => {
    const user = {
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      photo: loadAuth()?.photo || null,
      plan: userData.plan || 'free',
      createdAt: userData.createdAt || new Date().toISOString(),
    }
    setLastLoggedInEmail(userData.email)
    saveAuth(user)
    set({ user })
  },

  // Login com e-mail e senha
  login: async (email, password) => {
    const result = await verifyLogin(email, password)
    return result
  },

  updateUser: (data) => {
    const current = loadAuth()
    const updated = { ...current, ...data }
    saveAuth(updated)
    set({ user: updated })
  },

  logout: () => {
    saveAuth(null)
    set({ user: null })
  },
}))
