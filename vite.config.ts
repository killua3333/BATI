import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [vue(), cloudflare()],
  // Cloudflare Pages 通常使用根路径部署
  base: '/',
  build: {
    outDir: 'dist'
  }
});