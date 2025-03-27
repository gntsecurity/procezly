const CACHE_NAME = "procezly-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/icon-76x76.png",
  "/icon-120x120.png",
  "/icon-152x152.png",
  "/icon-180x180.png",
  "/icon-192x192.png",
  "/icon-512x512.png"
];

// Install: pre-cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          return caches.match("/");
        })
      );
    })
  );
});
