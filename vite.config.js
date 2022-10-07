import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  esbuild: {
    minifySyntax: true,
    minifyIdentifiers: false,
    minifyWhitespace: true
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'Styra Run React SDK',
      fileName: 'styra-run-sdk-react'
    },
    rollupOptions: {
      external: ['react', 'prop-types'],
      output: {
        globals: {
          react: 'React',
          'prop-types': 'PropTypes'
        }
      }
    }
  },
  plugins: [react()]
})
