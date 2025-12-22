import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        new_property: resolve(__dirname, 'new-property.html'),
        property_detail: resolve(__dirname, 'property-detail.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
});