// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        exclude: ['**/dist/**', '**/esm/**', '**/node_modules/**', '**/e2e/**'],
        timeout: 100 * 1000,
        threads: false,
    },
})
