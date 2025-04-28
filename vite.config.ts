import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/data/*',  // Copies files from the public/data folder
          dest: 'data',          // To the /data folder in the final build output
        },
      ],
    }),
  ],
  server: {
    proxy: {
      '/api/agency/openapi_agency_api.json': {
        target: 'https://emunvendors.ws.emuncloud.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
