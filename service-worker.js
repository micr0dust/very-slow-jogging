const CACHE_NAME = 'pwa-cache-v2'; // 更新 Cache 名稱
const urlsToCache = [
    './',
    './index.html',
    './animation.css',
    './script.js',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@10',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://use.fontawesome.com/releases/v5.7.0/css/all.css',
    './spritesheet.png',
    './woodblock.mp3',
    './achieve.mp3',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .catch(error => {
            console.error('Failed to activate:', error);
        })
    );
});