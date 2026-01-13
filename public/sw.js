const CACHE_NAME = 'fatside-v4'
const BASE = '/fatside/'
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'app.js'
]

// Clear old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// Network first, then cache (better for development)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
    })
  )
})
