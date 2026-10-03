import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

let outputDirectory: string

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'exclude-source-artwork',
      configResolved(config) {
        outputDirectory = resolve(config.root, config.build.outDir)
      },
      // Raw Figma exports remain available for reprocessing, outside the shipped bundle.
      closeBundle: async () => {
        const { rm } = await import('node:fs/promises')
        await rm(resolve(outputDirectory, 'images'), {
          recursive: true,
          force: true,
        })
        // Never embed browser-distributed installers inside another desktop installer.
        if (process.env.TAURI_ENV_PLATFORM) {
          await rm(resolve(outputDirectory, 'downloads'), {
            recursive: true,
            force: true,
          })
        }
      },
    },
  ],
  clearScreen: false,
  server: { watch: { ignored: ['**/src-tauri/**'] } },
  build: {
    target: ['es2022', 'chrome105', 'safari15'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return
          if (/\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor'
          if (id.includes('/@radix-ui/') || id.includes('/radix-ui/')) return 'radix-vendor'
          if (id.includes('/zod/')) return 'validation'
        },
      },
    },
  },
})
