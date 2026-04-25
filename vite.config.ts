import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // Cloudflare Pages 通常使用根路径部署
  base: '/',
  build: {
    outDir: 'dist'
  }
});
