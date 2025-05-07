import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@lib': resolve(__dirname, './lib'),
        },
    }
})
