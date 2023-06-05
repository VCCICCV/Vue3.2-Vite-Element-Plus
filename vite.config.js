import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    // 开启$ref
    template: {
      // 开启$ref
      refTransform: true
    },
    script: {
      reactivityTransform: true
    }
  }),
],
base:'./'// 打包相对路径
})
