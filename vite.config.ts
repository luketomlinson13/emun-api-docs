import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
