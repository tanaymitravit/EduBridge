import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],

    // Set root directory to the web app directory
    root: path.resolve(__dirname, './'),
    publicDir: 'public',
    
    // Base public path when served in production
    base: '/',
    
    // Build configuration
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: isProduction,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        input: 'index.html',
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        }
      }
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    
    // Server configuration
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy API requests in development
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:10000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Preview configuration
    preview: {
      port: 3000,
      strictPort: true,
    },

    // Environment variables
    define: {
      'process.env': {},
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});
