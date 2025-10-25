import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Portfolio-Website/',
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin', '**/*.obj', '**/*.mtl'],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? '';
          const extension = name.split('.').pop()?.toLowerCase();
          const preserve = ['gltf', 'glb', 'bin', 'obj', 'mtl'];
          if (extension && preserve.includes(extension)) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});
