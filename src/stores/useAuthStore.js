import { create } from 'zustand'

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

function defaultUser() {
  return {
    name: 'Meu Ateliê',
    email: '',
    photo: null,
    plan: 'free',
    createdAt: new Date().toISOString(),
  }
}

export const useAuthStore = create((set) => ({
  user: loadAuth(),

  // Garante que existe um usuário local para o app abrir direto no menu
  ensureLocalUser: () => {
    const existing = loadAuth()
    if (existing) {
      set({ user: existing })
      return
    }
    const user = defaultUser()
    saveAuth(user)
    set({ user })
  },

  updateUser: (data) => {
    const current = loadAuth() || defaultUser()
    const updated = { ...current, ...data }
    saveAuth(updated)
    set({ user: updated })
  },

  // Reset apenas dos dados de perfil, mantém estoque/receitas no IndexedDB
  resetProfile: () => {
    const fresh = defaultUser()
    saveAuth(fresh)
    set({ user: fresh })
  },
}))
