import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// O base path precisa bater com o nome do repositório no GitHub Pages
// (https://machadovitor.github.io/Prototipo-ceramica/).
// Em dev (npm run dev) o base é '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Prototipo-ceramica/' : '/',
  plugins: [react(), tailwindcss()],
}))
