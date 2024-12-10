import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@/assets/scss/abstract/functions' as *;
        @use '@/assets/scss/abstract/mixins' as *;
        @use '@/assets/scss/abstract/variables' as *;
        @use '@/assets/scss/base/base' as *;`,
      },
    },
  },
})
