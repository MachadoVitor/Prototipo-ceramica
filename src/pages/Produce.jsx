import { useState } from 'react'
import { Play, AlertTriangle, CheckCircle, Minus, Plus } from 'lucide-react'
import { useStore } from '../stores/useStore'
import { convert } from '../lib/units'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'

export default function Produce() {
  const { recipes, materials, getMaxProduction, produce } = useStore()
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [qty, setQty] = useState(1)
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleProduce = async () => {
    try {
      await produce(selectedRecipe.id, qty)
      setResult('success')
    } catch (err) {
      setErrorMsg(err.message)
      setResult('error')
    }
  }

  const closeResult = () => {
    setResult(null)
    setErrorMsg('')
    setSelectedRecipe(null)
    setQty(1)
  }

  const getMaterialInfo = (rm) => {
    const mat = materials.find((m) => m.id === rm.materialId)
    if (!mat) return { name: '???', available: 0, needed: rm.quantity, unit: '', recipeUnit: '' }
    // Converte o que a receita pede para a unidade do estoque
    const recipeUnit = rm.unit || mat.unit
    const neededInStock = convert(rm.quantity, recipeUnit, mat.unit) ?? rm.quantity
    return {
      name: mat.name,
      available: mat.quantity,
      needed: neededInStock,
      unit: mat.unit,
      recipeQty: rm.quantity,
      recipeUnit,
    }
  }

  return (
    <div className="bg-sand-texture min-h-full pb-24">
      <PageHeader
        title="Produzir"
        subtitle="Selecione uma peça"
      />

      {recipes.length === 0 ? (
        <EmptyState
          icon={Play}
          message="Crie receitas primeiro para poder produzir"
        />
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {recipes.map((recipe) => {
            const maxQty = getMaxProduction(recipe.id)
            const canProduce = maxQty > 0

            return (
              <button
                key={recipe.id}
                onClick={() => { setSelectedRecipe(recipe); setQty(1) }}
                className={`w-full text-left card p-4 transition-all ${
                  !canProduce ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    canProduce
                      ? 'bg-gradient-to-br from-clay-600 to-clay-700'
                      : 'bg-gray-200'
                  }`}>
                    <Play size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-clay-900">{recipe.name}</h3>
                    <p className={`text-sm font-semibold mt-0.5 ${canProduce ? 'text-green-600' : 'text-red-500'}`}>
                      {canProduce
                        ? `Até ${maxQty} unidade${maxQty !== 1 ? 's' : ''}`
                        : 'Material insuficiente'}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Modal de produção */}
      <Modal
        open={!!selectedRecipe && !result}
        onClose={() => { setSelectedRecipe(null); setQty(1) }}
        title={`Produzir: ${selectedRecipe?.name}`}
      >
        {selectedRecipe && (() => {
          const maxQty = getMaxProduction(selectedRecipe.id)
          const canProduce = maxQty >= qty

          return (
            <div>
              <div className="mb-5">
                <h3 className="text-sm font-bold text-clay-700 mb-2">
                  Materiais necessários:
                </h3>
                <div className="flex flex-col gap-1.5">
                  {selectedRecipe.materials?.map((rm, i) => {
                    const info = getMaterialInfo(rm)
                    const enough = info.available >= info.needed * qty
                    return (
                      <div
                        key={i}
                        className={`card flex justify-between items-center py-3 px-4 ${
                          enough ? 'bg-green-50' : 'bg-red-50 ring-1 ring-red-200'
                        }`}
                      >
                        <span className="text-sm font-semibold text-clay-800">
                          {info.name}
                        </span>
                        <span className={`text-sm font-bold ${enough ? 'text-green-600' : 'text-red-500'}`}>
                          {info.needed * qty} / {info.available} {info.unit}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Seletor de quantidade */}
              <div className="flex items-center justify-center gap-5 mb-6">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-14 h-14 rounded-2xl bg-clay-100 flex items-center justify-center active:bg-clay-200 transition-colors"
                >
                  <Minus size={24} className="text-clay-700" strokeWidth={2.5} />
                </button>
                <span className="text-5xl font-extrabold text-clay-900 min-w-[80px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(maxQty, qty + 1))}
                  disabled={qty >= maxQty}
                  className="w-14 h-14 rounded-2xl bg-clay-100 flex items-center justify-center active:bg-clay-200 disabled:opacity-30 transition-colors"
                >
                  <Plus size={24} className="text-clay-700" strokeWidth={2.5} />
                </button>
              </div>

              {!canProduce && (
                <div className="card flex items-center gap-3 bg-red-50 ring-1 ring-red-200 p-4 mb-4">
                  <AlertTriangle size={22} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-600 font-medium">Material insuficiente para esta quantidade</p>
                </div>
              )}

              <button
                onClick={handleProduce}
                disabled={!canProduce}
                className="w-full bg-gradient-to-r from-clay-700 to-clay-800 text-white py-4 rounded-2xl text-xl font-extrabold active:from-clay-800 active:to-clay-900 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 transition-all shadow-lg shadow-clay-700/30"
              >
                Produzir {qty} unidade{qty !== 1 ? 's' : ''}
              </button>
            </div>
          )
        })()}
      </Modal>

      {/* Sucesso */}
      <Modal open={result === 'success'} onClose={closeResult} title="Pronto!">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={44} className="text-green-500" />
          </div>
          <p className="text-xl font-extrabold text-clay-900 mb-1">
            Produção realizada!
          </p>
          <p className="text-clay-500 font-medium">
            {qty} unidade{qty !== 1 ? 's' : ''} de {selectedRecipe?.name}
          </p>
          <p className="text-sm text-clay-400 mt-2">
            Materiais descontados do estoque
          </p>
          <button
            onClick={closeResult}
            className="mt-8 bg-clay-700 text-white px-10 py-3.5 rounded-2xl text-base font-bold active:bg-clay-800 shadow-lg shadow-clay-700/20"
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Erro */}
      <Modal open={result === 'error'} onClose={closeResult} title="Erro">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={44} className="text-red-500" />
          </div>
          <p className="text-xl font-extrabold text-red-700 mb-2">
            Não foi possível produzir
          </p>
          <p className="text-clay-500 font-medium">{errorMsg}</p>
          <button
            onClick={closeResult}
            className="mt-8 border-2 border-clay-200 text-clay-700 px-10 py-3.5 rounded-2xl text-base font-bold active:bg-clay-50"
          >
            Entendi
          </button>
        </div>
      </Modal>
    </div>
  )
}
