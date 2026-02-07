import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path'; // Using the node: prefix is best practice in 2026

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    base: '/dt/',
    define: {
      // It is safer to map these to a specific object or prefix
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // Use process.cwd() if __dirname still gives you trouble in ESM
        '@': path.resolve(process.cwd(), './src'), 
      },
    },
  };
});