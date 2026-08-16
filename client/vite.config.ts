import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  // Read VITE_API_URL from .env (fallback to localhost for dev)
  const env = loadEnv(mode, process.cwd(), '')
  const BACKEND = env.VITE_API_URL || 'http://127.0.0.1:5454'

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['logo2.png', 'favicon.ico'],
        manifest: {
          name: 'Annadata Market',
          short_name: 'Annadata',
          description: 'Multivendor Agricultural Marketplace — Kisan se Grahak Tak',
          theme_color: '#16a34a',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          lang: 'hi',
          icons: [
            {
              src: '/logo2.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/logo2.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/logo2.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          categories: ['shopping', 'food', 'agriculture'],
          screenshots: [
            {
              src: '/seller-banner.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,woff2}'],
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              // API calls — Network First
              urlPattern: /^https?:\/\/.+\/(?:api|auth|sellers|seller|delivery|admin|home|ai)\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'annadata-api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Google Fonts — Cache First
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                }
              }
            },
            {
              // Images — Cache First
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'annadata-images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        }
      })
    ],
    server: {
      proxy: {
        // All backend API routes proxied to Spring Boot
        '/api':      { target: BACKEND, changeOrigin: true },
        '/auth':     { target: BACKEND, changeOrigin: true },
        '/sellers':  { target: BACKEND, changeOrigin: true },
        '/seller':   { target: BACKEND, changeOrigin: true },
        '/delivery': { target: BACKEND, changeOrigin: true },
        '/admin':    { target: BACKEND, changeOrigin: true },
        '/home':     { target: BACKEND, changeOrigin: true },
        '/ai':       { target: BACKEND, changeOrigin: true },
      }
    }
  }
})
