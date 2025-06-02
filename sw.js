// sw.js

// Choose a cache name, include a version number for easy updates
const CACHE_NAME = 'igfap-cache-v9'; 

// List of URLs to cache when the service worker is installed.
// For your app, since everything is in index.html, this is the main file.
// If your GitHub Pages site is at the root of your-username.github.io/your-repo/,
// then '/your-repo/' and '/your-repo/index.html' would be key.
// If it's at the root of a custom domain or your-username.github.io, then '/' and '/index.html'.
// For simplicity and broader compatibility, let's assume the app might be in a subdirectory.
// We'll cache the root path relative to the service worker's scope.
const urlsToCache = [
  './', // The root path (often resolves to index.html)
  './index.html' // Explicitly cache index.html
  // If you had separate CSS, JS, or image files, you'd list them here too.
  // e.g., './style.css', './app.js', './images/logo.png' 
];

// Install event: opens the cache and adds files to it.
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] All specified URLs have been cached.');
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache addAll failed:', error);
      })
  );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients.');
      // Ensure that the service worker takes control of the page immediately.
      return self.clients.claim();
    })
  );
});

// Fetch event: serves assets from cache or network.
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // For navigation requests (e.g., loading index.html itself),
  // try cache first, then network. This is a common "Cache falling back to Network" strategy.
  if (event.request.mode === 'navigate' || urlsToCache.includes(requestUrl.pathname.substring(requestUrl.pathname.lastIndexOf('/') + 1)) || requestUrl.pathname.endsWith('/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('[Service Worker] Serving from cache:', event.request.url);
            return response;
          }
          console.log('[Service Worker] Fetching from network:', event.request.url);
          return fetch(event.request).then(networkResponse => {
            // Optionally, you could cache new successful GET requests here if they are for your app shell assets
            // For example, if index.html wasn't cached but is fetched successfully.
            // Be careful not to cache API responses from Cloud Functions unless intended.
            return networkResponse;
          });
        })
        .catch(error => {
          console.error('[Service Worker] Fetch failed; returning offline page or error:', error);
          // Optionally, return a generic offline fallback page if one is cached:
          // return caches.match('./offline.html'); 
        })
    );
  } else {
    // For non-navigation requests (like API calls to Cloud Functions, external scripts/styles not in urlsToCache),
    // usually go network-first or network-only.
    // This default behavior is to let the browser handle it (network).
    // If you wanted a network-first strategy for these, you'd implement it here.
    // For API calls, you generally don't want to cache them with this simple service worker.
    // console.log('[Service Worker] Letting browser handle fetch (likely API call):', event.request.url);
    return; // Let the browser handle the request as usual
  }
});
