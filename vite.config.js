import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    glsl({
      include: [
        '**/*.glsl',
        '**/*.vert',
        '**/*.frag',
      ],
      defaultExtension: 'glsl',
      warnDuplicatedImports: true,
      compress: true
    })
  ],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'AiAnimation',
      fileName: (format) => `ai-animation.${format}.js`,
      formats: ['umd']
    },
    sourcemap: true,
    minify: 'terser'
  }
});
