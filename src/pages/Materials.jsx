import { useState } from 'react'
import { Plus, Pencil, Trash2, Package, Lock } from 'lucide-react'
import { useStore } from '../stores/useStore'
import { useAuthStore } from '../stores/useAuthStore'
import { areUnitsCompatible } from '../lib/units'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'

const UNITS = ['kg', 'g', 'ml', 'L', 'unidade']

// Unidades compatíveis para o alerta de estoque
function getCompatibleUnits(unit) {
  return UNITS.filter((u) => areUnitsCompatible(u, unit))
}

function MaterialForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [quantity, setQuantity] = useState(initial?.quantity?.toString() || '')
  const [unit, setUnit] = useState(initial?.unit || 'kg')
  const [lowStockThreshold, setLowStockThreshold] = useState(
    initial?.lowStockThreshold?.toString() || '1'
  )
  const [lowStockThresholdUnit, setLowStockThresholdUnit] = useState(
    initial?.lowStockThresholdUnit || initial?.unit || 'kg'
  )
  const [error, setError] = useState('')

  // Atualiza unidade do alerta quando muda a unidade principal
  const handleUnitChange = (newUnit) => {
    const oldUnit = unit
    setUnit(newUnit)
    // Se a unidade do alerta era a mesma que a antiga, atualiza junto
    if (lowStockThresholdUnit === oldUnit) {
      setLowStockThresholdUnit(newUnit)
    }
    // Se a unidade do alerta não é compatível com a nova, reseta
    if (!areUnitsCompatible(lowStockThresholdUnit, newUnit)) {
      setLowStockThresholdUnit(newUnit)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      return setError('Digite o nome do material')
    }

    const qtyValue = quantity === '' ? null : parseFloat(quantity)
    if (qtyValue === null || isNaN(qtyValue)) {
      return setError('Digite a quantidade')
    }
    if (qtyValue < 0) {
      return setError('Quantidade não pode ser negativa')
    }

    const thresholdValue = parseFloat(lowStockThreshold)
    if (isNaN(thresholdValue) || thresholdValue <= 0) {
      return setError('Alerta de estoque deve ser maior que zero')
    }

    onSave({
      ...initial,
      name: name.trim(),
      quantity: qtyValue,
      unit,
      lowStockThreshold: thresholdValue,
      lowStockThresholdUnit,
    })
  }

  const compatibleAlertUnits = getCompatibleUnits(unit)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-bold text-clay-700 mb-1.5">
          Nome do material
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Argila Branca"
          className="w-full border-2 border-clay-200 rounded-2xl px-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-bold text-clay-700 mb-1.5">
            Quantidade
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ex: 5"
            className="w-full border-2 border-clay-200 rounded-2xl px-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
          />
        </div>
        <div className="w-28">
          <label className="block text-sm font-bold text-clay-700 mb-1.5">
            Unidade
          </label>
          <select
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="w-full border-2 border-clay-200 rounded-2xl px-3 py-3.5 text-base font-medium text-clay-900 focus:border-clay-500 focus:outline-none bg-white"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-clay-700 mb-1.5">
          Alerta de estoque baixo
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            step="any"
            min="0.01"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
            placeholder="Ex: 0.8"
            className="flex-1 border-2 border-clay-200 rounded-2xl px-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
          />
          {compatibleAlertUnits.length > 1 && (
            <select
              value={lowStockThresholdUnit}
              onChange={(e) => setLowStockThresholdUnit(e.target.value)}
              className="w-24 border-2 border-clay-200 rounded-2xl px-3 py-3.5 text-base font-medium text-clay-900 focus:border-clay-500 focus:outline-none bg-white"
            >
              {compatibleAlertUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
        </div>
        <p className="text-xs text-clay-400 mt-1.5 font-medium">
          Avisa quando ficar igual ou abaixo deste valor
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-semibold text-center bg-red-50 rounded-xl py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border-2 border-clay-200 text-clay-600 py-3.5 rounded-2xl text-base font-bold active:bg-clay-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-clay-700 text-white py-3.5 rounded-2xl text-base font-bold active:bg-clay-800 shadow-lg shadow-clay-700/20 transition-colors"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}

export default function Materials() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useStore()
  const { user } = useAuthStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const FREE_LIMIT = 4
  const isLimited = user?.plan !== 'premium' && materials.length >= FREE_LIMIT

  const handleSave = async (data) => {
    if (data.id) {
      await updateMaterial(data)
    } else {
      await addMaterial(data)
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    await deleteMaterial(id)
    setConfirmDelete(null)
  }

  return (
    <div className="bg-sand-texture min-h-full pb-24">
      <PageHeader
        title="Materiais"
        subtitle={`${materials.length} cadastrado${materials.length !== 1 ? 's' : ''}`}
        action={
          <button
            onClick={() => {
              if (isLimited && !editing) return
              setEditing(null)
              setModalOpen(true)
            }}
            className={`p-3 rounded-2xl transition-colors shadow-lg ${
              isLimited
                ? 'bg-gray-300 shadow-gray-300/20'
                : 'bg-clay-700 text-white active:bg-clay-800 shadow-clay-700/20'
            }`}
          >
            {isLimited ? <Lock size={22} className="text-gray-500" strokeWidth={2.5} /> : <Plus size={22} strokeWidth={2.5} />}
          </button>
        }
      />

      {materials.length === 0 ? (
        <EmptyState
          icon={Package}
          message="Nenhum material cadastrado ainda"
          actionLabel="Adicionar Material"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {materials.map((mat) => {
            const isLow = mat.quantity <= (mat.lowStockThreshold ?? 1)
            return (
              <div
                key={mat.id}
                className={`card p-4 ${isLow ? 'ring-2 ring-red-300 bg-red-50/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isLow ? 'bg-red-100' : 'bg-clay-100'
                  }`}>
                    <Package size={22} className={isLow ? 'text-red-500' : 'text-clay-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-clay-900 truncate">{mat.name}</h3>
                    <p className={`text-2xl font-extrabold leading-tight ${isLow ? 'text-red-500' : 'text-clay-700'}`}>
                      {mat.quantity} <span className="text-sm font-medium text-clay-400">{mat.unit}</span>
                    </p>
                    {isLow && (
                      <p className="text-xs text-red-500 font-bold mt-0.5">Estoque baixo!</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(mat); setModalOpen(true) }}
                      className="p-2.5 rounded-xl bg-clay-100 active:bg-clay-200 transition-colors"
                    >
                      <Pencil size={18} className="text-clay-600" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(mat)}
                      className="p-2.5 rounded-xl bg-red-50 active:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Editar Material' : 'Novo Material'}
      >
        <MaterialForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Excluir Material?"
      >
        <p className="text-clay-500 mb-6 text-base font-medium">
          Tem certeza que deseja excluir <strong className="text-clay-800">{confirmDelete?.name}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="flex-1 border-2 border-clay-200 text-clay-600 py-3.5 rounded-2xl text-base font-bold active:bg-clay-50"
          >
            Não
          </button>
          <button
            onClick={() => handleDelete(confirmDelete.id)}
            className="flex-1 bg-red-500 text-white py-3.5 rounded-2xl text-base font-bold active:bg-red-600 shadow-lg shadow-red-500/20"
          >
            Sim, excluir
          </button>
        </div>
      </Modal>
    </div>
  )
}
