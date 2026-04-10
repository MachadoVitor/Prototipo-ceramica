import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'

export default function VerifyCode({ email, onBack, onVerified }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [generatedCode] = useState(() => {
    const c = String(Math.floor(100000 + Math.random() * 900000))
    // Em produção, enviaria por e-mail. No MVP, mostra no console.
    console.log(`[Clay+] Código de verificação para ${email}: ${c}`)
    return c
  })
  const inputs = useRef([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError('')

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }

    const full = newCode.join('')
    if (full.length === 6) {
      if (full === generatedCode) {
        onVerified()
      } else {
        setError('Código incorreto. Tente novamente.')
        setCode(['', '', '', '', '', ''])
        setTimeout(() => inputs.current[0]?.focus(), 100)
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newCode = pasted.split('')
      setCode(newCode)
      if (pasted === generatedCode) {
        onVerified()
      } else {
        setError('Código incorreto')
      }
    }
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

      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <div className="w-16 h-16 bg-clay-100 rounded-2xl flex items-center justify-center mb-5">
          <Mail size={32} className="text-clay-600" />
        </div>

        <h1 className="text-2xl font-extrabold text-clay-900 mb-1">Verifique seu e-mail</h1>
        <p className="text-sm text-clay-400 font-medium text-center mb-2">
          Enviamos um código de 6 dígitos para
        </p>
        <p className="text-sm font-bold text-clay-700 mb-8">{email}</p>

        {/* Inputs do código */}
        <div className="flex gap-2.5 mb-4" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-2xl font-extrabold rounded-2xl border-2 focus:outline-none transition-colors ${
                error
                  ? 'border-red-300 text-red-600 bg-red-50'
                  : digit
                    ? 'border-clay-500 text-clay-900 bg-white'
                    : 'border-clay-200 text-clay-900 bg-clay-50/50'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>
        )}

        <p className="text-xs text-clay-400 font-medium mt-4">
          No MVP, o código aparece no console do navegador (F12)
        </p>
      </div>
    </div>
  )
}
