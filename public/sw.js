// VORTAMAX Global — service worker.
//
// Caching strategy:
//   · Precache: offline page + app icons (available from first load).
//   · Navigations (HTML): network-first with a cached copy per page, so
//     previously visited pages open instantly offline; unseen pages fall
//     back to the branded offline screen.
//   · Hashed build assets (/_next/static) and icons: cache-first (immutable).
//   · Everything else same-origin GET (fonts CSS, images): stale-while-revalidate.
//   · Never cached: /api/*, non-GET requests, cross-origin requests — dynamic
//     content (projects, matches, messages) is always fresh from the network.

const VERSION = "vmx-v2";
const STATIC_CACHE = `${VERSION}-static`;
const PAGES_CACHE = `${VERSION}-pages`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const OFFLINE_URL = "/offline.html";
const PRECACHE = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/apple-touch-icon.png",
];

const PAGES_MAX_ENTRIES = 60;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    return trimCache(cacheName, maxEntries);
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // cross-origin: browser default
  if (url.pathname.startsWith("/api/")) return; // dynamic data: always network
  if (url.pathname.startsWith("/videos/")) return; // hero clips: HTTP cache only

  // Page navigations — network-first, cached page fallback, offline screen last.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(PAGES_CACHE);
            cache.put(request, response.clone());
            trimCache(PAGES_CACHE, PAGES_MAX_ENTRIES);
          }
          return response;
        } catch {
          const cached = await caches.match(request, { cacheName: PAGES_CACHE });
          return cached ?? (await caches.match(OFFLINE_URL));
        }
      })()
    );
    return;
  }

  // Hashed build assets & icons — immutable, cache-first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/apple-touch-icon.png"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // Other same-origin GETs — stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cached = await caches.match(request, { cacheName: RUNTIME_CACHE });
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => undefined);
      return cached ?? (await network) ?? (await caches.match(OFFLINE_URL));
    })()
  );
});
