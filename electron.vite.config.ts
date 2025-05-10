import { resolve } from 'node:path'
import { defineConfig, defineViteConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    envPrefix: ['VITE_'],
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: defineViteConfig(() => {
     return {
      server: {
        port: 2214
      },
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@assets': resolve('src/renderer/src/assets')
        }
      },
      plugins: [react(), tailwindcss()]
     }
    })
})
