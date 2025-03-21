import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      cors: true,
      proxy: {
        // Proxy Firebase auth requests - helps with CORS issues during development
        '/__/auth': {
          target: `https://${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
          changeOrigin: true,
          secure: true,
        }
      }
    }
  }
})