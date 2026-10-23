import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths working whether the site lives at jakestahl.github.io or in a repo subfolder
export default defineConfig({ plugins: [react()], base: './' })
