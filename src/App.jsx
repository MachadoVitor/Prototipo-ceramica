import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './stores/useStore'
import { useAuthStore } from './stores/useAuthStore'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Materials from './pages/Materials'
import Recipes from './pages/Recipes'
import Produce from './pages/Produce'
import Profile from './pages/Profile'
import MapStores from './pages/MapStores'

export default function App() {
  const loadAll = useStore((s) => s.loadAll)
  const user = useAuthStore((s) => s.user)
  const ensureLocalUser = useAuthStore((s) => s.ensureLocalUser)

  // Cria sessão local automática (sem login) na primeira abertura
  useEffect(() => {
    if (!user) ensureLocalUser()
  }, [user, ensureLocalUser])

  useEffect(() => {
    if (user) loadAll()
  }, [user, loadAll])

  if (!user) return null

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-full max-w-lg mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materiais" element={<Materials />} />
          <Route path="/receitas" element={<Recipes />} />
          <Route path="/produzir" element={<Produce />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mapa" element={<MapStores />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
