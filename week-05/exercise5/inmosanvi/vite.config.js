import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
//Need to resolve paths
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
	// Important for Vite to process both HTML files
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        newProperty: resolve(__dirname, 'new_property.html'), // Asegúrate del nombre exacto
      }
    }
  }
})