// Sistema de conversão de unidades do Clay+
//
// Grupos compatíveis:
//   peso:   kg ↔ g     (1 kg = 1000 g)
//   volume: L  ↔ ml    (1 L  = 1000 ml)
//   avulso: unidade    (sem conversão)

const BASE_UNITS = {
  kg: { group: 'peso', toBase: 1000 },    // base = g
  g: { group: 'peso', toBase: 1 },
  L: { group: 'volume', toBase: 1000 },   // base = ml
  ml: { group: 'volume', toBase: 1 },
  unidade: { group: 'unidade', toBase: 1 },
}

// Converte um valor de uma unidade para outra (dentro do mesmo grupo)
// Retorna null se as unidades não forem compatíveis
export function convert(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  const from = BASE_UNITS[fromUnit]
  const to = BASE_UNITS[toUnit]
  if (!from || !to || from.group !== to.group) return null

  const baseValue = value * from.toBase
  return baseValue / to.toBase
}

// Verifica se duas unidades são compatíveis (podem ser convertidas)
export function areUnitsCompatible(unitA, unitB) {
  if (unitA === unitB) return true
  const a = BASE_UNITS[unitA]
  const b = BASE_UNITS[unitB]
  return !!(a && b && a.group === b.group)
}

// Converte um valor para a unidade de destino.
// Se as unidades são iguais, retorna o valor.
// Se são compatíveis (ex: g → kg), converte.
// Se não são compatíveis, retorna null.
export function convertToUnit(value, fromUnit, toUnit) {
  return convert(value, fromUnit, toUnit)
}

// Formata um valor com unidade de forma legível
export function formatQuantity(value, unit) {
  if (Number.isInteger(value)) return `${value} ${unit}`
  return `${parseFloat(value.toFixed(4))} ${unit}`
}
