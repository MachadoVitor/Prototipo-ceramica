// ========================================
// Clay+ — Utilitários de autenticação
// ========================================

const USERS_REGISTRY_KEY = 'clayplus-users'
const LAST_EMAIL_KEY = 'clayplus-last-email'

// --- Validação ---

const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]+$/

export function validateName(name) {
  const trimmed = name.trim()
  if (!trimmed) return 'Digite seu nome'
  if (trimmed.length < 2) return 'Nome deve ter pelo menos 2 caracteres'
  if (!NAME_REGEX.test(trimmed)) return 'Nome não pode conter números ou caracteres especiais'
  return null
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email) {
  if (!email.trim()) return 'Digite seu e-mail'
  if (!EMAIL_REGEX.test(email.trim())) return 'Digite um e-mail válido'
  return null
}

// --- Registry de usuários (localStorage) ---

export function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_REGISTRY_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users))
}

export function isEmailRegistered(email) {
  return getRegisteredUsers().some(
    (u) => u.email === email.toLowerCase().trim()
  )
}

// --- Hash de senha (SHA-256 via SubtleCrypto) ---

export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// --- Registro de usuário ---

export async function registerUser({ name, email, password }) {
  const users = getRegisteredUsers()
  const passwordHash = await hashPassword(password)
  users.push({
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
    biometricEnabled: false,
    biometricCredentialId: null,
  })
  saveRegisteredUsers(users)
}

// --- Verificação de login ---

export async function verifyLogin(email, password) {
  const users = getRegisteredUsers()
  const user = users.find((u) => u.email === email.toLowerCase().trim())
  if (!user) return { ok: false, error: 'E-mail não encontrado' }

  const hash = await hashPassword(password)
  if (hash !== user.passwordHash) return { ok: false, error: 'Senha incorreta' }

  return { ok: true, user }
}

// --- Último e-mail logado (para biometria) ---

export function getLastLoggedInEmail() {
  try {
    return localStorage.getItem(LAST_EMAIL_KEY) || null
  } catch {
    return null
  }
}

export function setLastLoggedInEmail(email) {
  localStorage.setItem(LAST_EMAIL_KEY, email.toLowerCase().trim())
}

// --- Biometria (WebAuthn) ---

export function isBiometricAvailable() {
  return !!(window.PublicKeyCredential && navigator.credentials)
}

export async function isBiometricPlatformAvailable() {
  if (!isBiometricAvailable()) return false
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

export function isBiometricEnabledForEmail(email) {
  const users = getRegisteredUsers()
  const user = users.find((u) => u.email === email.toLowerCase().trim())
  return !!user?.biometricEnabled
}

export async function registerBiometric(email) {
  const challenge = crypto.getRandomValues(new Uint8Array(32))
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'Clay+', id: location.hostname },
      user: {
        id: new TextEncoder().encode(email),
        name: email,
        displayName: email,
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
    },
  })

  const users = getRegisteredUsers()
  const user = users.find((u) => u.email === email.toLowerCase().trim())
  if (user) {
    user.biometricEnabled = true
    user.biometricCredentialId = Array.from(new Uint8Array(credential.rawId))
    saveRegisteredUsers(users)
  }

  return credential
}

export async function authenticateBiometric(email) {
  const users = getRegisteredUsers()
  const user = users.find((u) => u.email === email.toLowerCase().trim())
  if (!user?.biometricEnabled || !user.biometricCredentialId) {
    throw new Error('Biometria não configurada')
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32))
  const credentialId = new Uint8Array(user.biometricCredentialId)

  await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [
        { id: credentialId, type: 'public-key', transports: ['internal'] },
      ],
      userVerification: 'required',
      timeout: 60000,
    },
  })

  return { ok: true, user }
}

export function disableBiometric(email) {
  const users = getRegisteredUsers()
  const user = users.find((u) => u.email === email.toLowerCase().trim())
  if (user) {
    user.biometricEnabled = false
    user.biometricCredentialId = null
    saveRegisteredUsers(users)
  }
}
