import { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen, Lock } from 'lucide-react'
import { useStore } from '../stores/useStore'
import { useAuthStore } from '../stores/useAuthStore'
import { areUnitsCompatible } from '../lib/units'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'

const ALL_UNITS = ['kg', 'g', 'ml', 'L', 'unidade']

const DIFFICULTIES = [
  { value: 'facil', label: 'Fácil' },
  { value: 'medio', label: 'Médio' },
  { value: 'dificil', label: 'Difícil' },
  { value: 'expert', label: 'Expert' },
]

const DIFFICULTY_COLORS = {
  facil: 'bg-green-100 text-green-700',
  medio: 'bg-amber-100 text-amber-700',
  dificil: 'bg-orange-100 text-orange-700',
  expert: 'bg-red-100 text-red-700',
}

function RecipeForm({ initial, materials, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'facil')
  const [notes, setNotes] = useState(initial?.notes || '')
  const [recipeMaterials, setRecipeMaterials] = useState(
    initial?.materials || []
  )

  const addRecipeMaterial = () => {
    if (materials.length === 0) return
    const firstMat = materials[0]
    setRecipeMaterials([
      ...recipeMaterials,
      { materialId: firstMat.id, quantity: 0, unit: firstMat.unit },
    ])
  }

  const updateRecipeMaterial = (index, field, value) => {
    const updated = [...recipeMaterials]
    if (field === 'quantity') {
      updated[index] = { ...updated[index], quantity: parseFloat(value) || 0 }
    } else if (field === 'materialId') {
      const matId = parseInt(value)
      const mat = materials.find((m) => m.id === matId)
      // Ao trocar material, se a unidade atual não for compatível, reseta
      const currentUnit = updated[index].unit
      const newUnit = (mat && areUnitsCompatible(currentUnit, mat.unit)) ? currentUnit : mat?.unit
      updated[index] = { ...updated[index], materialId: matId, unit: newUnit || currentUnit }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setRecipeMaterials(updated)
  }

  const removeRecipeMaterial = (index) => {
    setRecipeMaterials(recipeMaterials.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      ...initial,
      name: name.trim(),
      difficulty,
      notes: notes.trim(),
      materials: recipeMaterials.filter((rm) => rm.quantity > 0),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-bold text-clay-700 mb-1.5">
          Nome da peça
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Vaso Pequeno"
          className="w-full border-2 border-clay-200 rounded-2xl px-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none bg-clay-50/50"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-clay-700 mb-1.5">
          Dificuldade
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                difficulty === d.value
                  ? 'border-clay-700 bg-clay-700 text-white scale-105'
                  : 'border-clay-200 text-clay-500 bg-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-clay-700 mb-1.5">
          Anotações (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dicas, observações..."
          rows={2}
          className="w-full border-2 border-clay-200 rounded-2xl px-4 py-3.5 text-base font-medium text-clay-900 placeholder:text-clay-300 focus:border-clay-500 focus:outline-none resize-none bg-clay-50/50"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-clay-700">
            Materiais usados
          </label>
          <button
            type="button"
            onClick={addRecipeMaterial}
            disabled={materials.length === 0}
            className="text-sm text-clay-600 font-bold flex items-center gap-1 disabled:opacity-30 active:text-clay-800"
          >
            <Plus size={16} strokeWidth={2.5} /> Adicionar
          </button>
        </div>

        {materials.length === 0 && (
          <div className="card p-4 bg-clay-50 text-center">
            <p className="text-sm text-clay-400 font-medium">Cadastre materiais primeiro</p>
          </div>
        )}

        {recipeMaterials.map((rm, i) => {
          const selectedMat = materials.find((m) => m.id === rm.materialId)
          const compatUnits = selectedMat
            ? ALL_UNITS.filter((u) => areUnitsCompatible(u, selectedMat.unit))
            : [rm.unit || 'g']

          return (
            <div key={i} className="flex gap-1.5 items-center mb-2">
              <select
                value={rm.materialId}
                onChange={(e) => updateRecipeMaterial(i, 'materialId', e.target.value)}
                className="flex-1 border-2 border-clay-200 rounded-xl px-2 py-2.5 text-sm font-medium text-clay-900 focus:border-clay-500 focus:outline-none bg-white min-w-0"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <input
                type="number"
                step="any"
                min="0"
                value={rm.quantity || ''}
                onChange={(e) => updateRecipeMaterial(i, 'quantity', e.target.value)}
                placeholder="Qtd"
                className="w-16 border-2 border-clay-200 rounded-xl px-2 py-2.5 text-sm font-medium text-clay-900 focus:border-clay-500 focus:outline-none bg-white"
              />
              <select
                value={rm.unit || selectedMat?.unit || 'g'}
                onChange={(e) => updateRecipeMaterial(i, 'unit', e.target.value)}
                className="w-16 border-2 border-clay-200 rounded-xl px-1 py-2.5 text-sm font-medium text-clay-900 focus:border-clay-500 focus:outline-none bg-white"
              >
                {compatUnits.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeRecipeMaterial(i)}
                className="p-2 rounded-xl text-red-400 active:bg-red-50 shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>

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

export default function Recipes() {
  const { recipes, materials, addRecipe, updateRecipe, deleteRecipe } = useStore()
  const { user } = useAuthStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const FREE_LIMIT = 10
  const isLimited = user?.plan !== 'premium' && recipes.length >= FREE_LIMIT

  const handleSave = async (data) => {
    if (data.id) {
      await updateRecipe(data)
    } else {
      await addRecipe(data)
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    await deleteRecipe(id)
    setConfirmDelete(null)
  }

  const getMaterialName = (id) => {
    const m = materials.find((m) => m.id === id)
    return m ? m.name : 'Removido'
  }

  const getMaterialUnit = (id) => {
    const m = materials.find((m) => m.id === id)
    return m?.unit || ''
  }

  return (
    <div className="bg-sand-texture min-h-full pb-24">
      <PageHeader
        title="Receitas"
        subtitle={`${recipes.length} cadastrada${recipes.length !== 1 ? 's' : ''}`}
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

      {recipes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          message="Nenhuma receita cadastrada ainda"
          actionLabel="Criar Receita"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-clay-900">{recipe.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty] || ''}`}>
                      {DIFFICULTIES.find((d) => d.value === recipe.difficulty)?.label}
                    </span>
                  </div>
                  {recipe.notes && (
                    <p className="text-sm text-clay-400 mt-1 line-clamp-2">{recipe.notes}</p>
                  )}
                </div>
                <div className="flex gap-1.5 ml-3">
                  <button
                    onClick={() => { setEditing(recipe); setModalOpen(true) }}
                    className="p-2.5 rounded-xl bg-clay-100 active:bg-clay-200 transition-colors"
                  >
                    <Pencil size={16} className="text-clay-600" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(recipe)}
                    className="p-2.5 rounded-xl bg-red-50 active:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              {recipe.materials?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-clay-100">
                  {recipe.materials.map((rm, i) => (
                    <span
                      key={i}
                      className="text-xs bg-clay-100 text-clay-700 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {getMaterialName(rm.materialId)}: {rm.quantity} {rm.unit || getMaterialUnit(rm.materialId)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Editar Receita' : 'Nova Receita'}
      >
        <RecipeForm
          initial={editing}
          materials={materials}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Excluir Receita?"
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
