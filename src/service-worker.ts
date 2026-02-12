const CACHE = 'doggo-cache-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/main.js',
  '/styles.css'
];

self.addEventListener('install', (ev: ExtendableEvent) => {
  ev.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => (self as any).skipWaiting())
  );
});

self.addEventListener('activate', (ev: ExtendableEvent) => {
  ev.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    (self as any).clients.claim();
  })());
});

self.addEventListener('fetch', (ev: FetchEvent) => {
  if (ev.request.method !== 'GET') return;
  ev.respondWith(
    caches.match(ev.request).then(cached => cached || fetch(ev.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(ev.request, copy));
      return resp;
    }).catch(() => caches.match('/icons/icon-192.svg')))
  );
});

self.addEventListener('message', (ev: ExtendableMessageEvent) => {
  if (ev.data && ev.data.type === 'SKIP_WAITING') (self as any).skipWaiting();
});
