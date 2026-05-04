import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service worker — registra apenas em produção, no path do build (BASE_URL)
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      const swPath = `${import.meta.env.BASE_URL}sw.js`
      navigator.serviceWorker
        .register(swPath, { scope: import.meta.env.BASE_URL })
        .catch(() => {})
    })
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => r.unregister())
    })
    caches.keys().then((keys) => {
      keys.forEach((k) => caches.delete(k))
    })
  }
}
