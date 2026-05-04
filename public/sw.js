// Bump CACHE_NAME a cada deploy para invalidar cache antigo
const CACHE_NAME = 'clayplus-v2'

// Resolve o scope (ex.: '/Prototipo-ceramica/' no GitHub Pages, '/' em dev)
const SCOPE = new URL(self.registration ? self.registration.scope : './', self.location).pathname

const CORE_ASSETS = [
  SCOPE,
  SCOPE + 'index.html',
  SCOPE + 'manifest.json',
  SCOPE + 'favicon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Estratégia: network-first para HTML/navegação (sempre pega versão nova quando online),
// cache-first para assets estáticos (rápido). Fallback para cache quando offline.
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  if (!req.url.startsWith(self.location.origin)) return

  const isNavigation = req.mode === 'navigate'

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(req, clone))
          return res
        })
        .catch(() => caches.match(req).then((m) => m || caches.match(SCOPE + 'index.html')))
    )
    return
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(req, clone))
          return res
        })
        .catch(() => cached)
    })
  )
})
