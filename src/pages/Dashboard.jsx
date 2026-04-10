import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, BookOpen, Play, MapPin, AlertTriangle, ChevronRight, TrendingUp, Award } from 'lucide-react'
import { useStore } from '../stores/useStore'
import { useAuthStore } from '../stores/useAuthStore'
import * as db from '../lib/db'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Dashboard() {
  const { materials, recipes, getLowStockMaterials, loading, loadAll } = useStore()
  const { user } = useAuthStore()
  const lowStock = getLowStockMaterials()
  const [totalProduced, setTotalProduced] = useState(0)
  const [recentLogs, setRecentLogs] = useState([])

  useEffect(() => {
    loadAll()
    db.getAllProductionLogs().then((logs) => {
      const total = logs.reduce((sum, l) => sum + (l.quantity || 0), 0)
      setTotalProduced(total)
      setRecentLogs(logs.slice(-3).reverse())
    })
  }, [loadAll])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-sand-texture">
        <div className="text-clay-400 text-lg font-medium">Carregando...</div>
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0]

  return (
    <div className="bg-sand-texture min-h-full pb-24">
      {/* Header com saudação */}
      <div className="px-5 pt-8 pb-2">
        <p className="text-sm text-clay-400 font-semibold">{getGreeting()}{firstName ? ',' : ''}</p>
        <h1 className="text-2xl font-extrabold text-clay-900 tracking-tight">
          {firstName || 'Clay'}<span className="text-clay-400">+</span>
        </h1>
      </div>

      {/* Resumo rápido — 3 cards em linha */}
      <div className="px-5 py-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center">
            <Package size={20} className="text-clay-500 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-clay-800">{materials.length}</p>
            <p className="text-[10px] text-clay-400 font-semibold leading-tight">Materiais</p>
          </div>
          <div className="card p-3 text-center">
            <BookOpen size={20} className="text-clay-500 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-clay-800">{recipes.length}</p>
            <p className="text-[10px] text-clay-400 font-semibold leading-tight">Receitas</p>
          </div>
          <div className="card p-3 text-center">
            <Award size={20} className="text-clay-500 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-clay-800">{totalProduced}</p>
            <p className="text-[10px] text-clay-400 font-semibold leading-tight">Produzidas</p>
          </div>
        </div>
      </div>

      {/* Botão de Produzir — destaque */}
      <div className="px-5 mb-4">
        <Link to="/produzir" className="block">
          <div className="card bg-gradient-to-r from-clay-700 to-clay-800 p-5 flex items-center justify-between shadow-lg shadow-clay-800/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <Play size={28} className="text-clay-800 fill-clay-800" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">Produzir Peça</h2>
                <p className="text-clay-300 text-sm font-medium">Iniciar produção</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-white/50" />
          </div>
        </Link>
      </div>

      {/* Alerta de estoque baixo */}
      {lowStock.length > 0 && (
        <div className="px-5 mb-4">
          <div className="card bg-red-50 ring-1 ring-red-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-700 mb-1">Estoque baixo</p>
                {lowStock.map((m) => (
                  <p key={m.id} className="text-sm text-red-600 font-medium">
                    {m.name} — <span className="font-bold">{m.quantity} {m.unit}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estoque atual */}
      {materials.length > 0 && (
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-bold text-clay-800">Estoque Atual</h2>
            <Link to="/materiais" className="text-sm text-clay-500 font-semibold">
              Ver tudo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {materials.slice(0, 4).map((mat) => {
              const isLow = mat.quantity <= (mat.lowStockThreshold ?? 1)
              return (
                <div
                  key={mat.id}
                  className={`card p-3 flex items-center gap-3 ${isLow ? 'ring-1 ring-red-200' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isLow ? 'bg-red-100' : 'bg-clay-100'
                  }`}>
                    <Package size={18} className={isLow ? 'text-red-500' : 'text-clay-600'} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-clay-700 truncate">{mat.name}</p>
                    <p className={`text-lg font-extrabold leading-tight ${isLow ? 'text-red-500' : 'text-clay-800'}`}>
                      {mat.quantity}<span className="text-[10px] font-medium text-clay-400 ml-0.5">{mat.unit}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Últimas produções */}
      {recentLogs.length > 0 && (
        <div className="px-5 mb-4">
          <h2 className="text-base font-bold text-clay-800 mb-2.5">Atividade Recente</h2>
          <div className="card divide-y divide-clay-100">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-clay-800 truncate">{log.recipeName}</p>
                  <p className="text-xs text-clay-400 font-medium">
                    {new Date(log.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-green-600">
                  +{log.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="px-5 mb-4">
        <h2 className="text-base font-bold text-clay-800 mb-2.5">Ações Rápidas</h2>
        <div className="flex flex-col gap-2">
          <Link to="/materiais" className="block">
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-clay-100 rounded-xl flex items-center justify-center">
                <Package size={20} className="text-clay-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-clay-800">Gerenciar Estoque</p>
                <p className="text-xs text-clay-400 font-medium">Adicionar ou editar materiais</p>
              </div>
              <ChevronRight size={18} className="text-clay-300" />
            </div>
          </Link>

          <Link to="/receitas" className="block">
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-clay-100 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-clay-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-clay-800">Criar Receita</p>
                <p className="text-xs text-clay-400 font-medium">Nova peça com materiais</p>
              </div>
              <ChevronRight size={18} className="text-clay-300" />
            </div>
          </Link>

          <Link to="/mapa" className="block">
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-clay-100 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-clay-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-clay-800">Encontrar Materiais</p>
                <p className="text-xs text-clay-400 font-medium">Lojas de cerâmica no mapa</p>
              </div>
              <ChevronRight size={18} className="text-clay-300" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
