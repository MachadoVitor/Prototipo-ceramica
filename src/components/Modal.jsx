import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Fundo escuro */}
      <div
        className="absolute inset-0 bg-clay-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Conteudo */}
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
        {/* Barra de arraste visual */}
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 bg-clay-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-clay-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-clay-100 active:bg-clay-200 transition-colors"
          >
            <X size={20} className="text-clay-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
