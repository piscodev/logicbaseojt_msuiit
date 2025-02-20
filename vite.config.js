import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    api:{
      file:'./src/api/api.js',
      prefix: '/api',
      bodyLimit: '1mb',
      proxy: false,
      bodyParser: false,
    },
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5173', // your API server
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  }
})
