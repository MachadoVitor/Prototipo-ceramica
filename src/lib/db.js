import { openDB } from 'idb'

const DB_NAME = 'clayplus'
const DB_VERSION = 1

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Materiais
      if (!db.objectStoreNames.contains('materials')) {
        const materials = db.createObjectStore('materials', {
          keyPath: 'id',
          autoIncrement: true,
        })
        materials.createIndex('name', 'name')
      }

      // Receitas
      if (!db.objectStoreNames.contains('recipes')) {
        db.createObjectStore('recipes', {
          keyPath: 'id',
          autoIncrement: true,
        })
      }

      // Logs de producao
      if (!db.objectStoreNames.contains('productionLogs')) {
        const logs = db.createObjectStore('productionLogs', {
          keyPath: 'id',
          autoIncrement: true,
        })
        logs.createIndex('recipeId', 'recipeId')
        logs.createIndex('date', 'date')
      }
    },
  })
}

// --- Materials ---

export async function getAllMaterials() {
  const db = await getDB()
  return db.getAll('materials')
}

export async function getMaterial(id) {
  const db = await getDB()
  return db.get('materials', id)
}

export async function addMaterial(material) {
  const db = await getDB()
  return db.add('materials', {
    ...material,
    createdAt: new Date().toISOString(),
  })
}

export async function updateMaterial(material) {
  const db = await getDB()
  return db.put('materials', material)
}

export async function deleteMaterial(id) {
  const db = await getDB()
  return db.delete('materials', id)
}

// --- Recipes ---

// Cada receita tem formato:
// { id, name, difficulty, notes, materials: [{ materialId, quantity }] }

export async function getAllRecipes() {
  const db = await getDB()
  return db.getAll('recipes')
}

export async function getRecipe(id) {
  const db = await getDB()
  return db.get('recipes', id)
}

export async function addRecipe(recipe) {
  const db = await getDB()
  return db.add('recipes', {
    ...recipe,
    createdAt: new Date().toISOString(),
  })
}

export async function updateRecipe(recipe) {
  const db = await getDB()
  return db.put('recipes', recipe)
}

export async function deleteRecipe(id) {
  const db = await getDB()
  return db.delete('recipes', id)
}

// --- Production ---

export async function addProductionLog(log) {
  const db = await getDB()
  return db.add('productionLogs', {
    ...log,
    date: new Date().toISOString(),
  })
}

export async function getAllProductionLogs() {
  const db = await getDB()
  return db.getAll('productionLogs')
}
