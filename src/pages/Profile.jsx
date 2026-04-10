import { useEffect, useState, useRef } from 'react'
import { Camera, Award, BookOpen, LogOut, Crown, Package, Fingerprint } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import { useStore } from '../stores/useStore'
import {
  isBiometricPlatformAvailable,
  isBiometricEnabledForEmail,
  registerBiometric,
  disableBiometric,
} from '../lib/auth'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import * as db from '../lib/db'

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore()
  const { materials, recipes } = useStore()
  const [totalProduced, setTotalProduced] = useState(0)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const fileInput = useRef(null)

  useEffect(() => {
    db.getAllProductionLogs().then((logs) => {
      const total = logs.reduce((sum, l) => sum + (l.quantity || 0), 0)
      setTotalProduced(total)
    })

    // Verifica suporte a biometria
    isBiometricPlatformAvailable().then((available) => {
      setBiometricAvailable(available)
      if (available && user?.email) {
        setBiometricEnabled(isBiometricEnabledForEmail(user.email))
      }
    })
  }, [user?.email])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      updateUser({ photo: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const handleToggleBiometric = async () => {
    if (!user?.email) return
    setBiometricLoading(true)

    try {
      if (biometricEnabled) {
        disableBiometric(user.email)
        setBiometricEnabled(false)
      } else {
        await registerBiometric(user.email)
        setBiometricEnabled(true)
      }
    } catch {
      // Cancelou ou falhou
    }

    setBiometricLoading(false)
  }

  const handleLogout = () => {
    logout()
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

          <h2 className="text-xl font-extrabold text-clay-900">{user.name}</h2>
          <p className="text-sm text-clay-400 font-medium mt-0.5">{user.email}</p>

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

        {/* Biometria */}
        {biometricAvailable && (
          <div className="card p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-clay-100 rounded-xl flex items-center justify-center shrink-0">
                  <Fingerprint size={20} className="text-clay-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-clay-800">Login por biometria</p>
                  <p className="text-xs text-clay-400 font-medium">
                    {biometricEnabled ? 'Ativado' : 'Desativado'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleBiometric}
                disabled={biometricLoading}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  biometricEnabled ? 'bg-green-500' : 'bg-clay-300'
                } ${biometricLoading ? 'opacity-50' : ''}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${
                    biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Membro desde */}
        <div className="card p-4 mb-4">
          <p className="text-sm text-clay-400 font-medium">Membro desde</p>
          <p className="text-base font-bold text-clay-800">
            {new Date(user.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={() => setConfirmLogout(true)}
          className="w-full card p-4 flex items-center justify-center gap-2 text-red-500 font-bold active:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Sair da conta
        </button>
      </div>

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Sair da conta?"
      >
        <p className="text-clay-500 mb-6 text-base font-medium">
          Seus dados ficarão salvos no dispositivo.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmLogout(false)}
            className="flex-1 border-2 border-clay-200 text-clay-600 py-3.5 rounded-2xl text-base font-bold active:bg-clay-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-500 text-white py-3.5 rounded-2xl text-base font-bold active:bg-red-600 shadow-lg shadow-red-500/20"
          >
            Sair
          </button>
        </div>
      </Modal>
    </div>
  )
}
