import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // TODO: 请改成你的 Gitee 仓库名路径，例如 '/bati/' 或 '/你的仓库名/'
  base: '/bati/',
  build: {
    outDir: 'dist'
  }
});
