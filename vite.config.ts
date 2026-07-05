/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'projet_gestion_des_finance-API';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${repoName}/` : './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
