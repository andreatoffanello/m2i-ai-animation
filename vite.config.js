import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // Configurazione per la build della libreria
    lib: {
      entry: resolve(__dirname, 'src/AiAnimation.js'), // Il file principale della libreria
      name: 'M2IAnimation',
      fileName: (format) => `m2i-animation.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Esternalizziamo three.js
      external: ['three'],
      output: {
        globals: {
          three: 'THREE'
        }
      }
    }
  }
});
