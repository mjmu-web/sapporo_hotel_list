const CACHE_NAME = 'hotel-list-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/bbs.html',
  '/manual_entry_form.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/service-worker.js',
  '/data/hotels.csv',
  '/data/news.json',
  '/data/bbs.json'
];

// ===== インストール時にキャッシュ =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  console.log('[ServiceWorker] Installed & cached');
});

// ===== フェッチ時にキャッシュ利用 =====
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返し、なければネットから取得
      return response || fetch(event.request);
    })
  );
});

// ===== 新バージョンがあれば古いキャッシュ削除 =====
self.addEventListener('activate', event => {
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (!whitelist.includes(key)) {
          console.log('[ServiceWorker] Deleting old cache:', key);
          return caches.delete(key);
        }
      }))
    )
  );
});