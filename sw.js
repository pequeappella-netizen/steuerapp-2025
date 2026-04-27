const CACHE_NAME = 'steuerapp-2025-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/i18n.js',
    '/js/steuerrechner.js',
    '/js/ocr/lohnsteuerErkenner.js',
    '/js/ocr/scannerUI.js',
    '/js/elster/xmlGenerator.js',
    '/js/elster/ericClient.js',
    '/js/storage/steuerDatenbank.js',
    '/js/storage/syncManager.js',
    '/js/pruefung/steuerOptimierer.js',
    '/js/pdf/steuerPdfGenerator.js',
    '/workers/steuerWorker.js',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cached) => cached || fetch(event.request))
            .catch(() => caches.match('/index.html'))
    );
});