/**
 * Service worker mínimo — solo cachea el "shell" de la app (HTML, manifest,
 * íconos) para que abra rápido y funcione offline en modo degradado.
 * IMPORTANTE: nunca cachea llamadas a dominios externos (USGS, NGL, tu
 * proxy GNSS, tiles del mapa) — esos SIEMPRE deben ir a la red para que
 * los datos sean reales y actuales, no una foto vieja.
 */
const CACHE_NAME = 'sismoalert-shell-v1';
const SHELL_FILES = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Solo intervenimos en archivos propios del shell. Todo lo demás
  // (USGS, NGL, proxy GNSS, tiles de mapa, fuentes, CDN de Leaflet)
  // pasa directo a la red, sin cachear, para no servir datos viejos.
  if (!isSameOrigin){
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response && response.ok){
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
