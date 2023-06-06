import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy:{
      '/user':{
        target:"http://127.0.0.1:3004/",
      }
    }
  },
  base: './',// 打包相对路径
})
