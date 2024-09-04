import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // Forzar Vite a usar el puerto 3000
    host: true, // Asegura que sea accesible externamente, útil cuando se ejecuta en contenedores
  },
})
