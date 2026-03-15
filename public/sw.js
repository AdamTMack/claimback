// ClaimBack Service Worker
// Provides offline support for the fully static app.

const CACHE_NAME = "claimback-v1";

// Core pages to precache on install.
// These ensure the app shell is available offline immediately.
const PRECACHE_URLS = [
  "/",
  "/about/",
  "/bill-fighter/",
  "/bill-fighter/itemized-bill/",
  "/bill-fighter/charity-care/",
  "/bill-fighter/no-surprises-act/",
  "/bill-fighter/debt-validation/",
  "/playbook/",
  "/playbook/itemized-bills-101/",
  "/playbook/charity-care/",
  "/playbook/no-surprises-act/",
  "/playbook/dealing-with-collectors/",
  "/playbook/insurance-appeals/",
  "/playbook/when-to-get-a-lawyer/",
];

// Install: precache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, network-first for navigation
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) return;

  // Navigation requests: network-first (so updates are picked up)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Static assets (JS, CSS, images): cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
