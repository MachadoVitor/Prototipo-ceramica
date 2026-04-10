import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, WifiOff, Search, ExternalLink, Store } from 'lucide-react'

const SEARCHES = [
  { label: 'Lojas de cerâmica', query: 'loja+de+ceramica' },
  { label: 'Argilas e esmaltes', query: 'argila+esmalte+ceramica' },
  { label: 'Artesanato', query: 'loja+artesanato' },
  { label: 'Tintas especiais', query: 'tinta+ceramica' },
]

const ONLINE_STORES = [
  {
    name: 'Casa do Ceramista',
    description: 'Tudo para cerâmica artística e utilitária',
    url: 'https://www.casadoceramista.com.br/',
  },
  {
    name: 'Zeramics',
    description: 'Materiais e ferramentas para ceramistas',
    url: 'https://www.zeramics.com.br',
  },
]

export default function MapStores() {
  const navigate = useNavigate()
  const [activeSearch, setActiveSearch] = useState(SEARCHES[0])
  const [isOnline] = useState(navigator.onLine)

  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${activeSearch.query}+perto+de+mim&zoom=13&language=pt-BR`

  if (!isOnline) {
    return (
      <div className="bg-sand-texture min-h-full flex flex-col">
        <div className="px-5 pt-6 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl active:bg-clay-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-clay-700" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 bg-clay-100 rounded-3xl flex items-center justify-center mb-5">
            <WifiOff size={40} className="text-clay-400" />
          </div>
          <h2 className="text-xl font-extrabold text-clay-900 mb-2">Sem conexão</h2>
          <p className="text-clay-400 font-medium">
            O mapa precisa de internet para funcionar. Conecte-se e tente novamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-sand-texture min-h-full flex flex-col pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl active:bg-clay-100 transition-colors shrink-0"
        >
          <ArrowLeft size={24} className="text-clay-700" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-clay-900">Encontrar Materiais</h1>
          <p className="text-xs text-clay-400 font-medium">Lojas próximas a você</p>
        </div>
      </div>

      {/* Filtros de busca */}
      <div className="px-5 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {SEARCHES.map((s) => (
            <button
              key={s.query}
              onClick={() => setActiveSearch(s)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-all ${
                activeSearch.query === s.query
                  ? 'bg-clay-700 text-white shadow-md shadow-clay-700/20'
                  : 'bg-white text-clay-600 border border-clay-200'
              }`}
            >
              <Search size={14} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mapa embutido */}
      <div className="flex-1 mx-5 mb-4 rounded-2xl overflow-hidden shadow-lg shadow-clay-800/10 border border-clay-200 min-h-[400px]">
        <iframe
          title="Mapa de lojas"
          src={mapUrl}
          className="w-full h-full min-h-[400px]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        />
      </div>

      {/* Lojas Online */}
      <div className="px-5 mb-4">
        <h2 className="text-base font-bold text-clay-800 mb-2.5">Lojas Online</h2>
        <div className="flex flex-col gap-2">
          {ONLINE_STORES.map((store) => (
            <a
              key={store.url}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-clay-100 rounded-xl flex items-center justify-center shrink-0">
                <Store size={20} className="text-clay-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-clay-800">{store.name}</p>
                <p className="text-xs text-clay-400 font-medium truncate">{store.description}</p>
              </div>
              <ExternalLink size={16} className="text-clay-300 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
