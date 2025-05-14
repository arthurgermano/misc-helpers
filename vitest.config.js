// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.js'),
      name: 'misc-helpers',
      fileName: (format) => `misc-helpers.${format}.js`,
      formats: ['es', 'cjs']
    },
    outDir: 'dist',
  },
});
