const CACHE = 'roadmap-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(['./','./index.html'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k =>
        k !== CACHE ? caches.delete(k) : null
      ))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached ||
      fetch(e.request)
        .then(res => {
          caches.open(CACHE).then(c =>
            c.put(e.request, res.clone())
          );
          return res;
        })
        .catch(() => caches.match('./index.html'))
    )
  );
});
