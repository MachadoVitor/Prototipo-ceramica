import { useEffect, useState, useRef } from 'react'
import { Camera, Award, BookOpen, Crown, Package, Pencil, Check } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import { useStore } from '../stores/useStore'
import PageHeader from '../components/PageHeader'
import * as db from '../lib/db'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const { materials, recipes } = useStore()
  const [totalProduced, setTotalProduced] = useState(0)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(user?.name || '')
  const fileInput = useRef(null)

  useEffect(() => {
    db.getAllProductionLogs().then((logs) => {
      const total = logs.reduce((sum, l) => sum + (l.quantity || 0), 0)
      setTotalProduced(total)
    })
  }, [])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      updateUser({ photo: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const startEditName = () => {
    setNameDraft(user?.name || '')
    setEditingName(true)
  }

  const saveName = () => {
    const trimmed = nameDraft.trim()
    if (trimmed) updateUser({ name: trimmed })
    setEditingName(false)
  }

  if (!user) return null

  const isPremium = user.plan === 'premium'

  return (
    <div className="bg-sand-texture min-h-full pb-24">
      <PageHeader title="Perfil" />

      <div className="px-5">
        {/* Avatar com upload de foto */}
        <div className="card p-6 flex flex-col items-center mb-4">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg shadow-clay-600/20 ring-4 ring-white">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-clay-500 to-clay-700 flex items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInput.current?.click()}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-clay-700 rounded-full flex items-center justify-center shadow-md active:bg-clay-800 transition-colors"
            >
              <Camera size={16} className="text-white" />
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {editingName ? (
            <div className="flex items-center gap-2 w-full max-w-xs">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                autoFocus
                className="flex-1 border-2 border-clay-200 rounded-xl px-3 py-2 text-base font-bold text-clay-900 focus:outline-none focus:border-clay-500"
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
              />
              <button
                onClick={saveName}
                className="w-10 h-10 bg-clay-700 rounded-xl flex items-center justify-center active:bg-clay-800"
              >
                <Check size={18} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={startEditName}
              className="flex items-center gap-2 active:opacity-70"
            >
              <h2 className="text-xl font-extrabold text-clay-900">{user.name}</h2>
              <Pencil size={14} className="text-clay-400" />
            </button>
          )}

          <div className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isPremium
              ? 'bg-gradient-to-r from-clay-600 to-clay-700 text-white'
              : 'bg-clay-100 text-clay-600'
          }`}>
            {isPremium ? <Crown size={14} /> : null}
            {isPremium ? 'Premium' : 'Plano Gratuito'}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="card p-3 text-center">
            <Award size={20} className="text-clay-500 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-clay-800">{totalProduced}</p>
            <p className="text-[10px] text-clay-400 font-semibold leading-tight">Produzidas</p>
          </div>
          <div className="card p-3 text-center">
            <BookOpen size={20} className="text-clay-500 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-clay-800">{recipes.length}</p>
            <p className="text-[10px] text-clay-400 font-semibold leading-tight">Receitas</p>
          </div>
          <div className="card p-3 text-center">
            <Package size={20} className="text-clay-500 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-clay-800">{materials.length}</p>
            <p className="text-[10px] text-clay-400 font-semibold leading-tight">Materiais</p>
          </div>
        </div>

        {/* Upgrade Premium */}
        {!isPremium && (
          <div className="card p-4 mb-4 bg-clay-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-clay-600 to-clay-800 rounded-xl flex items-center justify-center shrink-0">
                <Crown size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-clay-800">Desbloquear Premium</p>
                <p className="text-xs text-clay-400 font-medium">
                  Materiais e receitas ilimitados por R$9,90/mês
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Membro desde */}
        <div className="card p-4 mb-4">
          <p className="text-sm text-clay-400 font-medium">Usando o Clay+ desde</p>
          <p className="text-base font-bold text-clay-800">
            {new Date(user.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <p className="text-xs text-clay-400 font-medium text-center mt-6">
          Seus dados ficam salvos neste dispositivo.
        </p>
      </div>
    </div>
  )
}
