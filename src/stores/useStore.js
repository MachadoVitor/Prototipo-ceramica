import { create } from 'zustand'
import * as db from '../lib/db'
import { convert, areUnitsCompatible } from '../lib/units'

// Converte a quantidade da receita para a unidade do estoque.
// Ex: receita pede 200g, estoque está em kg → converte 200g para 0.2kg
function recipeQtyInStockUnit(recipeQty, recipeUnit, stockUnit) {
  if (recipeUnit === stockUnit) return recipeQty
  const converted = convert(recipeQty, recipeUnit, stockUnit)
  return converted ?? null
}

export const useStore = create((set, get) => ({
  materials: [],
  recipes: [],
  loading: true,

  loadAll: async () => {
    set({ loading: true })
    const [materials, recipes] = await Promise.all([
      db.getAllMaterials(),
      db.getAllRecipes(),
    ])
    set({ materials, recipes, loading: false })
  },

  // --- Materiais ---

  addMaterial: async (material) => {
    const id = await db.addMaterial(material)
    const saved = await db.getMaterial(id)
    set((s) => ({ materials: [...s.materials, saved] }))
  },

  updateMaterial: async (material) => {
    await db.updateMaterial(material)
    set((s) => ({
      materials: s.materials.map((m) => (m.id === material.id ? material : m)),
    }))
  },

  deleteMaterial: async (id) => {
    await db.deleteMaterial(id)
    set((s) => ({ materials: s.materials.filter((m) => m.id !== id) }))
  },

  // --- Receitas ---

  addRecipe: async (recipe) => {
    const id = await db.addRecipe(recipe)
    const saved = await db.getRecipe(id)
    set((s) => ({ recipes: [...s.recipes, saved] }))
  },

  updateRecipe: async (recipe) => {
    await db.updateRecipe(recipe)
    set((s) => ({
      recipes: s.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
    }))
  },

  deleteRecipe: async (id) => {
    await db.deleteRecipe(id)
    set((s) => ({ recipes: s.recipes.filter((r) => r.id !== id) }))
  },

  // --- Produção ---

  getMaxProduction: (recipeId) => {
    const { recipes, materials } = get()
    const recipe = recipes.find((r) => r.id === recipeId)
    if (!recipe || !recipe.materials?.length) return 0

    let max = Infinity
    for (const rm of recipe.materials) {
      const mat = materials.find((m) => m.id === rm.materialId)
      if (!mat) return 0

      // Converte quantidade da receita para a unidade do estoque
      const needed = recipeQtyInStockUnit(rm.quantity, rm.unit || mat.unit, mat.unit)
      if (needed === null || needed <= 0) return 0

      const possible = Math.floor(mat.quantity / needed)
      if (possible < max) max = possible
    }
    return max === Infinity ? 0 : max
  },

  produce: async (recipeId, qty = 1) => {
    const { recipes, materials } = get()
    const recipe = recipes.find((r) => r.id === recipeId)
    if (!recipe) throw new Error('Receita não encontrada')

    // Verifica estoque com conversão de unidades
    for (const rm of recipe.materials) {
      const mat = materials.find((m) => m.id === rm.materialId)
      const needed = recipeQtyInStockUnit(rm.quantity, rm.unit || mat.unit, mat.unit)
      if (!mat || needed === null || mat.quantity < needed * qty) {
        throw new Error(`Material "${mat?.name || 'desconhecido'}" insuficiente`)
      }
    }

    // Deduz materiais
    const updatedMaterials = [...materials]
    for (const rm of recipe.materials) {
      const idx = updatedMaterials.findIndex((m) => m.id === rm.materialId)
      const mat = updatedMaterials[idx]
      const needed = recipeQtyInStockUnit(rm.quantity, rm.unit || mat.unit, mat.unit)
      const updated = {
        ...mat,
        quantity: +(mat.quantity - needed * qty).toFixed(4),
      }
      updatedMaterials[idx] = updated
      await db.updateMaterial(updated)
    }

    await db.addProductionLog({
      recipeId,
      recipeName: recipe.name,
      quantity: qty,
    })

    set({ materials: updatedMaterials })
  },

  // Materiais com estoque baixo
  // O threshold é comparado na mesma unidade do material
  getLowStockMaterials: () => {
    const { materials } = get()
    return materials.filter((m) => {
      const threshold = m.lowStockThreshold ?? 1
      const thresholdUnit = m.lowStockThresholdUnit || m.unit

      // Converte threshold para a unidade do material se necessário
      let thresholdInMatUnit = threshold
      if (thresholdUnit !== m.unit) {
        const converted = convert(threshold, thresholdUnit, m.unit)
        if (converted !== null) thresholdInMatUnit = converted
      }

      return m.quantity <= thresholdInMatUnit
    })
  },
}))
