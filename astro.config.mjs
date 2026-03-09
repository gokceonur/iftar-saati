// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://iftarsaati.gokceonur.com',
  vite: {
    json: {
      // Import full JSON objects rather than named exports
      namedExports: false,
      stringify: false,
    },
  },
});
