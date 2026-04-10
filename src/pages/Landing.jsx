export default function Landing({ onNavigate }) {
  return (
    <div className="bg-sand-texture min-h-full flex flex-col">
      {/* Parte superior — logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12">
        <div className="w-36 h-36 rounded-full overflow-hidden shadow-2xl shadow-clay-800/30 mb-6 ring-4 ring-white/80 bg-gradient-to-br from-clay-200 to-clay-300">
          <img
            src="/claypot.avif"
            alt="Clay+"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-clay-900 tracking-tight">
          Clay<span className="text-clay-500">+</span>
        </h1>
        <p className="text-clay-400 text-base font-medium mt-2 text-center">
          Seu assistente de cerâmica
        </p>
      </div>

      {/* Parte inferior — botões */}
      <div className="px-6 pb-12 pt-8">
        <button
          onClick={() => onNavigate('signup')}
          className="w-full bg-gradient-to-r from-clay-700 to-clay-800 text-white py-4 rounded-2xl text-lg font-extrabold active:from-clay-800 active:to-clay-900 shadow-lg shadow-clay-800/30 transition-all mb-3"
        >
          Criar conta
        </button>
        <button
          onClick={() => onNavigate('login')}
          className="w-full border-2 border-clay-300 text-clay-700 py-4 rounded-2xl text-lg font-bold active:bg-clay-100 transition-colors"
        >
          Já possuo uma conta
        </button>
      </div>
    </div>
  )
}
