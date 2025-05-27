import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      manifest: {
        "id": "/#/",
        "start_url": "/#/",
        "scope": "/",
        "name": "Dicoding Story App",
        "short_name": "Dicoding Story",
        "description": "Aplikasi membuat cerita berdasarkan lokasi dan waktu yang ditentukan oleh pengguna. Dengan aplikasi ini, pengguna dapat membuat cerita yang menarik dan berkesan.",
        "display": "standalone",
        "background_color": "#FFFFFF",
        "theme_color": "#87cefa",
        "icons": [
          {
            "src": "images/icons/icon-x144.png",
            "type": "image/png",
            "sizes": "144x144",
            "purpose": "any"
          },
          {
            "src": "images/icons/maskable-icon-x48.png",
            "type": "image/png",
            "sizes": "48x48",
            "purpose": "maskable"
          },
          {
            "src": "images/icons/maskable-icon-x96.png",
            "type": "image/png",
            "sizes": "96x96",
            "purpose": "maskable"
          },
          {
            "src": "images/icons/maskable-icon-x192.png",
            "type": "image/png",
            "sizes": "192x192",
            "purpose": "maskable"
          },
          {
            "src": "images/icons/maskable-icon-x384.png",
            "type": "image/png",
            "sizes": "384x384",
            "purpose": "maskable"
          },
          {
            "src": "images/icons/maskable-icon-x512.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "maskable"
          }
        ],
        "screenshots": [
          {
            "src": "images/screenshots/DicodingStoryApp_001.png",
            "sizes": "1891x943",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "images/screenshots/DicodingStoryApp_002.png",
            "sizes": "1891x943",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "images/screenshots/DicodingStoryApp_003.png",
            "sizes": "1891x943",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "images/screenshots/DicodingStoryApp_004.png",
            "sizes": "361x805",
            "type": "image/png",
            "form_factor": "narrow"
          },
          {
            "src": "images/screenshots/DicodingStoryApp_005.png",
            "sizes": "361x805",
            "type": "image/png",
            "form_factor": "narrow"
          },
          {
            "src": "images/screenshots/DicodingStoryApp_006.png",
            "sizes": "361x805",
            "type": "image/png",
            "form_factor": "narrow"
          }
        ],
        "shortcuts": [
          {
            "name": "Cerita Baru",
            "short_name": "Baru",
            "description": "Membuat cerita pengalaman baru.",
            "url": "/?source=pwa#/add",
            "icons": [
              {
                "src": "images/icons/add-x512.png",
                "type": "image/png",
                "sizes": "512x512"
              }
            ]
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dicoding-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ],
        sourcemap: true,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true
      }
    }),
  ],
});
