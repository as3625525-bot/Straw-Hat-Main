const CACHE_NAME = 'progress-pro-v3';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './category.html',
  './css/base.css',
  './css/components.css',
  './css/animations.css',
  './css/pages.css',
  './js/store.js',
  './js/utils.js',
  './js/toast.js',
  './js/animations.js',
  './js/home.js',
  './js/category.js',
  './manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('./index.html'))
  );
});
