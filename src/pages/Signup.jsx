import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { validateName, validateEmail, isEmailRegistered } from '../lib/auth'

export default function Signup({ onBack, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const nameErr = validateName(name)
    if (nameErr) return setError(nameErr)

    const emailErr = validateEmail(email)
    if (emailErr) return setError(emailErr)

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      return setError('Os e-mails não conferem')
    }

    if (isEmailRegistered(email)) {
      return setError('Este e-mail já está em uso')
    }

    if (password.length < 6) return setError('Senha deve ter no mínimo 6 caracteres')
    if (password !== confirmPassword) return setError('As senhas não conferem')

    onSubmit({ name: name.trim(), email: email.trim(), password })
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
        <h1 className="text-2xl font-extrabold text-clay-900 mb-1">Criar conta</h1>
        <p className="text-sm text-clay-400 font-medium mb-6">
          Preencha seus dados para começar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-bold text-clay-600 mb-1.5">Nome</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full border-2 border-clay-200 rounded-2xl pl-11 pr-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
              />
            </div>
          </div>

          {/* E-mail */}
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

          {/* Confirmar e-mail */}
          <div>
            <label className="block text-sm font-bold text-clay-600 mb-1.5">Confirmar e-mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-400" />
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                placeholder="Repita seu e-mail"
                className="w-full border-2 border-clay-200 rounded-2xl pl-11 pr-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-bold text-clay-600 mb-1.5">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
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

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm font-bold text-clay-600 mb-1.5">Confirmar senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full border-2 border-clay-200 rounded-2xl pl-11 pr-12 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-clay-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-semibold text-center bg-red-50 rounded-xl py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-clay-700 to-clay-800 text-white py-4 rounded-2xl text-lg font-extrabold active:from-clay-800 active:to-clay-900 shadow-lg shadow-clay-800/30 transition-all mt-2"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}
