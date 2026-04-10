import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './stores/useStore'
import { useAuthStore } from './stores/useAuthStore'
import {
  registerUser,
  verifyLogin,
  setLastLoggedInEmail,
  getLastLoggedInEmail,
  isBiometricEnabledForEmail,
  isBiometricPlatformAvailable,
  authenticateBiometric,
  registerBiometric,
  getRegisteredUsers,
} from './lib/auth'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Materials from './pages/Materials'
import Recipes from './pages/Recipes'
import Produce from './pages/Produce'
import Profile from './pages/Profile'
import MapStores from './pages/MapStores'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyCode from './pages/VerifyCode'
import PlanSelect from './pages/PlanSelect'
import { Fingerprint, KeyRound } from 'lucide-react'

// Tela de biometria automática
function BiometricScreen({ onFallback }) {
  return (
    <div className="bg-sand-texture min-h-full flex flex-col items-center justify-center px-8">
      <div className="w-20 h-20 bg-clay-100 rounded-3xl flex items-center justify-center mb-6">
        <Fingerprint size={44} className="text-clay-600" />
      </div>
      <h1 className="text-2xl font-extrabold text-clay-900 mb-2 text-center">
        Autenticando...
      </h1>
      <p className="text-clay-400 font-medium text-center mb-8">
        Use sua biometria para entrar
      </p>
      <button
        onClick={onFallback}
        className="flex items-center gap-2 text-clay-600 font-bold active:text-clay-800"
      >
        <KeyRound size={18} />
        Usar senha
      </button>
    </div>
  )
}

// Tela de configuração de biometria (pós-login/signup)
function BiometricSetup({ email, onDone }) {
  const [enabling, setEnabling] = useState(false)

  const handleEnable = async () => {
    setEnabling(true)
    try {
      await registerBiometric(email)
    } catch {
      // Dispositivo cancelou ou falhou — prossegue sem biometria
    }
    setEnabling(false)
    onDone()
  }

  return (
    <div className="bg-sand-texture min-h-full flex flex-col items-center justify-center px-8">
      <div className="w-20 h-20 bg-clay-100 rounded-3xl flex items-center justify-center mb-6">
        <Fingerprint size={44} className="text-clay-600" />
      </div>
      <h1 className="text-2xl font-extrabold text-clay-900 mb-2 text-center">
        Login rápido
      </h1>
      <p className="text-clay-400 font-medium text-center mb-8">
        Deseja ativar o login por biometria para entrar mais rápido?
      </p>
      <button
        onClick={handleEnable}
        disabled={enabling}
        className="w-full max-w-xs bg-gradient-to-r from-clay-700 to-clay-800 text-white py-4 rounded-2xl text-lg font-extrabold shadow-lg shadow-clay-800/30 transition-all mb-3 disabled:opacity-60"
      >
        {enabling ? 'Ativando...' : 'Ativar biometria'}
      </button>
      <button
        onClick={onDone}
        className="text-clay-500 font-bold text-base active:text-clay-700"
      >
        Agora não
      </button>
    </div>
  )
}

function AuthFlow() {
  const { signup, setSession } = useAuthStore()
  const [screen, setScreen] = useState('loading')
  const [signupData, setSignupData] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [pendingSession, setPendingSession] = useState(null)

  // Verifica biometria ao montar
  useEffect(() => {
    (async () => {
      const lastEmail = getLastLoggedInEmail()
      if (lastEmail && isBiometricEnabledForEmail(lastEmail)) {
        const available = await isBiometricPlatformAvailable()
        if (available) {
          setScreen('biometric')
          try {
            const result = await authenticateBiometric(lastEmail)
            if (result.ok) {
              setSession({
                name: result.user.name,
                email: result.user.email,
                plan: result.user.plan || 'free',
                createdAt: result.user.createdAt,
              })
              return
            }
          } catch {
            // Biometria falhou/cancelou
          }
        }
      }
      setScreen('landing')
    })()
  }, [setSession])

  const handleSignup = (data) => {
    setSignupData(data)
    setScreen('verify')
  }

  const handleLogin = async (data) => {
    setLoginError('')
    const result = await verifyLogin(data.email, data.password)
    if (result.ok) {
      setLastLoggedInEmail(data.email)
      // Verifica se biometria disponível e não configurada
      const bioAvailable = await isBiometricPlatformAvailable()
      const bioEnabled = isBiometricEnabledForEmail(data.email)
      if (bioAvailable && !bioEnabled) {
        setPendingSession({
          name: result.user.name,
          email: result.user.email,
          plan: result.user.plan || 'free',
          createdAt: result.user.createdAt,
        })
        setScreen('biometric-setup')
      } else {
        setSession({
          name: result.user.name,
          email: result.user.email,
          plan: result.user.plan || 'free',
          createdAt: result.user.createdAt,
        })
      }
    } else {
      setLoginError(result.error)
    }
  }

  const handleVerified = () => {
    setScreen('plan')
  }

  const handlePlanSelect = async (plan) => {
    await registerUser({
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
    })
    setLastLoggedInEmail(signupData.email)

    const bioAvailable = await isBiometricPlatformAvailable()
    if (bioAvailable) {
      setPendingSession({
        name: signupData.name,
        email: signupData.email,
        plan,
      })
      setScreen('biometric-setup')
    } else {
      const user = {
        name: signupData.name,
        email: signupData.email.toLowerCase().trim(),
        photo: null,
        plan,
        createdAt: new Date().toISOString(),
      }
      // Seta sessão diretamente sem chamar signup (já registrou)
      useAuthStore.getState().updateUser(user)
      useAuthStore.setState({ user })
      localStorage.setItem('clayplus-auth', JSON.stringify(user))
    }
  }

  const handleBiometricDone = () => {
    if (pendingSession) {
      setSession(pendingSession)
      setPendingSession(null)
    }
  }

  if (screen === 'loading') {
    return (
      <div className="bg-sand-texture min-h-full flex items-center justify-center">
        <div className="text-clay-400 text-lg font-medium">Carregando...</div>
      </div>
    )
  }

  switch (screen) {
    case 'landing':
      return <Landing onNavigate={setScreen} />
    case 'signup':
      return <Signup onBack={() => setScreen('landing')} onSubmit={handleSignup} />
    case 'login':
      return (
        <Login
          onBack={() => { setScreen('landing'); setLoginError('') }}
          onSubmit={handleLogin}
          externalError={loginError}
        />
      )
    case 'verify':
      return (
        <VerifyCode
          email={signupData?.email}
          onBack={() => setScreen('signup')}
          onVerified={handleVerified}
        />
      )
    case 'plan':
      return <PlanSelect onSelect={handlePlanSelect} />
    case 'biometric':
      return <BiometricScreen onFallback={() => setScreen('landing')} />
    case 'biometric-setup':
      return <BiometricSetup email={pendingSession?.email} onDone={handleBiometricDone} />
    default:
      return <Landing onNavigate={setScreen} />
  }
}

export default function App() {
  const loadAll = useStore((s) => s.loadAll)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (user) loadAll()
  }, [user, loadAll])

  if (!user) {
    return (
      <div className="min-h-full max-w-lg mx-auto">
        <AuthFlow />
      </div>
    )
  }

  return (
    <BrowserRouter>
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
