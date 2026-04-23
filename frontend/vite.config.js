import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/** Default dev port — avoids clashing with other Vite apps on 5173. Override with DEV_SERVER_PORT in `.env`. */
const DEFAULT_DEV_PORT = 5280;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const parsed = Number(env.DEV_SERVER_PORT);
  const port = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DEV_PORT;

  return {
    plugins: [react()],
    base: '/',
    server: {
      port,
      strictPort: false
    }
  };
});
