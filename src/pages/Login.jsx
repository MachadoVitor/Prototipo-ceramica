import { useState } from 'react'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login({ onBack, onSubmit, externalError }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const displayError = externalError || error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !email.includes('@')) return setError('Digite um e-mail válido')
    if (!password) return setError('Digite sua senha')

    setLoading(true)
    await onSubmit({ email: email.trim(), password })
    setLoading(false)
  }

  return (
    <div className="bg-sand-texture min-h-full flex flex-col">
      <div className="px-5 pt-6 pb-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl active:bg-clay-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-clay-700" />
        </button>
      </div>

      <div className="px-6 pb-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-clay-800/20 ring-3 ring-white/80 bg-gradient-to-br from-clay-200 to-clay-300">
            <img src="/claypot.avif" alt="Clay+" className="w-full h-full object-cover" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-clay-900 mb-1 text-center">Bem-vindo de volta</h1>
        <p className="text-sm text-clay-400 font-medium mb-6 text-center">
          Entre com seus dados
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-clay-600 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full border-2 border-clay-200 rounded-2xl pl-11 pr-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-clay-600 mb-1.5">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full border-2 border-clay-200 rounded-2xl pl-11 pr-12 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-clay-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {displayError && (
            <p className="text-red-500 text-sm font-semibold text-center bg-red-50 rounded-xl py-2">
              {displayError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-clay-700 to-clay-800 text-white py-4 rounded-2xl text-lg font-extrabold active:from-clay-800 active:to-clay-900 shadow-lg shadow-clay-800/30 transition-all mt-2 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
