import { Check, Crown, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function PlanSelect({ onSelect }) {
  const [selected, setSelected] = useState('free')

  return (
    <div className="bg-sand-texture min-h-full flex flex-col">
      <div className="px-6 pt-10 pb-4 text-center">
        <h1 className="text-2xl font-extrabold text-clay-900 mb-1">Escolha seu plano</h1>
        <p className="text-sm text-clay-400 font-medium">
          Você pode mudar a qualquer momento
        </p>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-4">
        {/* Free */}
        <button
          onClick={() => setSelected('free')}
          className={`card p-5 text-left transition-all ${
            selected === 'free'
              ? 'ring-2 ring-clay-600 shadow-lg'
              : 'opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-clay-100 rounded-xl flex items-center justify-center">
                <Sparkles size={22} className="text-clay-600" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-clay-900">Gratuito</h2>
                <p className="text-sm text-clay-400 font-medium">Para começar</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selected === 'free' ? 'bg-clay-700 border-clay-700' : 'border-clay-300'
            }`}>
              {selected === 'free' && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-14">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-clay-700 font-medium">Até 4 materiais</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-clay-700 font-medium">Até 10 receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-clay-700 font-medium">Produção ilimitada</span>
            </div>
          </div>
        </button>

        {/* Premium */}
        <button
          onClick={() => setSelected('premium')}
          className={`card p-5 text-left transition-all relative overflow-hidden ${
            selected === 'premium'
              ? 'ring-2 ring-clay-600 shadow-lg'
              : 'opacity-70'
          }`}
        >
          {/* Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-clay-600 to-clay-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            RECOMENDADO
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-gradient-to-br from-clay-600 to-clay-800 rounded-xl flex items-center justify-center">
              <Crown size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-clay-900">Premium</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-clay-700">R$9,90</span>
                <span className="text-xs text-clay-400 font-medium">/mês</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-14">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-clay-700 font-medium">Materiais ilimitados</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-clay-700 font-medium">Receitas ilimitadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-clay-700 font-medium">Produção ilimitada</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-clay-700 font-medium">Backup e sincronização (em breve)</span>
            </div>
          </div>

          <p className="text-xs text-clay-400 font-medium mt-3 ml-14">
            ou R$89,90/ano (economia de 25%)
          </p>
        </button>
      </div>

      {/* Botão de confirmação */}
      <div className="px-6 py-8">
        <button
          onClick={() => onSelect(selected)}
          className="w-full bg-gradient-to-r from-clay-700 to-clay-800 text-white py-4 rounded-2xl text-lg font-extrabold active:from-clay-800 active:to-clay-900 shadow-lg shadow-clay-800/30 transition-all"
        >
          {selected === 'premium' ? 'Assinar Premium' : 'Começar Grátis'}
        </button>
      </div>
    </div>
  )
}
