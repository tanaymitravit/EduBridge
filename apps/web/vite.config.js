import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  // Set the root directory to the current directory
  const root = process.cwd();
  console.log('Vite root directory:', root);
  console.log('Environment:', { NODE_ENV: process.env.NODE_ENV, mode });

  return {
    plugins: [
      react(),
      isProduction && visualizer({
        open: false,
        filename: 'bundle-analyzer-report.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),

    // Set root directory to the web app directory
    root: path.resolve(__dirname, './'),
    
    // Base public path when served in production
    base: isProduction ? '/' : '/',

    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: isProduction ? 'hidden' : true,
      rollupOptions: {
        input: {
          main: 'index.html'
        }
      },
      minify: isProduction ? 'terser' : 'esbuild',
      chunkSizeWarningLimit: 1000, // in kbs
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            utils: ['date-fns', 'lodash', 'axios'],
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },

    // Resolve configuration
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // Server configuration
    server: {
      port: 3000,
      strictPort: true,
      open: !process.env.CI,
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


