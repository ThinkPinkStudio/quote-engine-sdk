import { defineConfig } from 'tsup'

export default defineConfig([
  // Core (framework-agnostic)
  {
    entry: ['src/core/index.ts'],
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
  },
  // React
  {
    entry: ['src/react/index.ts'],
    outDir: 'dist/react',
    format: ['cjs', 'esm'],
    dts: true,
    external: ['react', 'react-dom'],
    sourcemap: true,
  },
  // Next.js
  {
    entry: ['src/nextjs/index.tsx'],
    outDir: 'dist/nextjs',
    format: ['cjs', 'esm'],
    dts: true,
    external: ['react', 'react-dom', 'next'],
    sourcemap: true,
  },
  // Vue
  {
    entry: ['src/vue/index.ts'],
    outDir: 'dist/vue',
    format: ['cjs', 'esm'],
    dts: true,
    external: ['vue'],
    sourcemap: true,
  },
  // Angular
  {
    entry: ['src/angular/index.ts'],
    outDir: 'dist/angular',
    format: ['cjs', 'esm'],
    dts: true,
    external: ['@angular/core', '@angular/common', 'rxjs'],
    sourcemap: true,
  },
  // Svelte
  {
    entry: ['src/svelte/index.ts'],
    outDir: 'dist/svelte',
    format: ['cjs', 'esm'],
    dts: true,
    external: ['svelte', 'svelte/store'],
    sourcemap: true,
  },
  // Astro
  {
    entry: ['src/astro/index.ts'],
    outDir: 'dist/astro',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
  // React Native
  {
    entry: ['src/react-native/index.ts'],
    outDir: 'dist/react-native',
    format: ['cjs', 'esm'],
    dts: true,
    external: ['react', 'react-native', '@react-native-async-storage/async-storage', '@react-native-community/netinfo'],
    sourcemap: true,
  },
  // Electron
  {
    entry: ['src/electron/index.ts'],
    outDir: 'dist/electron',
    format: ['cjs', 'esm'],
    dts: true,
    external: ['electron'],
    sourcemap: true,
  },
  // Vanilla JS
  {
    entry: ['src/vanilla/index.ts'],
    outDir: 'dist/vanilla',
    format: ['cjs', 'esm', 'iife'],
    dts: true,
    globalName: 'QuoteEngine',
    sourcemap: true,
  },
])
