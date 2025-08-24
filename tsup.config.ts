import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false, // Desabilite minify durante desenvolvimento para debug
  splitting: false,
  outDir: 'dist',
  target: 'esnext',
  shims: true,
  // Força preservação dos named exports
  treeshake: false,
  // Configuração específica para ESM
  platform: 'node',
  // Evita problemas com imports dinâmicos
  noExternal: [],
});