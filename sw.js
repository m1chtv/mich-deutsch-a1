/* Service worker – cache-first so the app works offline.
   Bump CACHE when you change any file. */
const CACHE = 'deutsch-a1-v2';
const ASSETS = ['./', 'assets/vendor/bootstrap-icons/bootstrap-icons.min.css', 'assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2', 'assets/vendor/bootstrap.rtl.min.css', 'assets/vendor/fonts/baloo-bhaijaan-2-arabic-400-normal.woff2', 'assets/vendor/fonts/baloo-bhaijaan-2-arabic-600-normal.woff2', 'assets/vendor/fonts/baloo-bhaijaan-2-arabic-800-normal.woff2', 'assets/vendor/fonts/baloo-bhaijaan-2-latin-400-normal.woff2', 'assets/vendor/fonts/baloo-bhaijaan-2-latin-600-normal.woff2', 'assets/vendor/fonts/baloo-bhaijaan-2-latin-800-normal.woff2', 'assets/vendor/fonts/fonts.css', 'css/app.css', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon.svg', 'index.html', 'js/app.js', 'js/data.js', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    })).catch(() => caches.match('index.html'))
  );
});
