const cacheVersion = 'sw-cache-techniques';

/* Checking ETag header to update cache if necessary */
const updateCache = (request, response) => {
    return caches.open(cacheVersion).then(cache => {
        return cache.match(request).then(matched => {
            if(matched && (matched.headers.get("ETag") !== response.headers.get('ETag'))) {
                return cache
                    .put(request, response.clone())
                    .then(() => response);
            }

            return response;
        });
    });
};

/* SW TECHNIQUES */
const networkOnly = request => fetch(request);
const networkFirst = (request, forceUpdate = true) => {
    return fetch(request)
        .then(response => forceUpdate ? updateCache(request, response) : response)
        .catch(() => caches.match(request))
};
const cacheOnly = request => caches.match(request);
const cacheFirst = (request, forceUpdate = true) => {
    return caches.match(request).then(cache => {
        return cache || fetch(request)
            .then(response => forceUpdate ? updateCache(request, response) : response)
    })
};
/* SW TECHNIQUES */

const pages = [
    '/',
    // '/index.html',
];
const scripts = [
    '/js/main.js',
    '/js/sw-register.js',
];
const styles = [
    '/css/styles.css',
];
const images = [
    "/img/icon-512x512.png",
    "/img/icon-152x152.png",
    "/img/icon-167x167.png",
    "/img/icon-180x180.png",
    "/img/favicon.svg",
];
const resources = [
    '/manifest.json',
    '/browserconfig.xml',
];

let firstInstallation = false;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheVersion).then(cache => {
            return cache.keys().then(cacheKeys => {
                return cache.addAll([
                    ...pages,
                    ...scripts,
                    ...styles,
                    // ...images,
                    ...resources,
                ]).then(response => {
                    if(cacheKeys.length === 0) firstInstallation = true;
                    return response;
                });
            });
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheKeys => Promise.all(
            cacheKeys.map(cacheKey => {
                if(cacheKey !== cacheVersion) return caches.delete(cacheKey);
            })
        )).then(() => {
            if(!firstInstallation) return;

            self.clients.claim().then(() => {
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => client.postMessage("INSTALLED"));
                });
            });
        })
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;

    switch(event.request.destination) {
        case 'style':
        case 'image':
        case 'script':
        case 'manifest':
        case 'document':
            return event.respondWith(networkFirst(request));
        case 'font':
            return event.respondWith(cacheFirst(request));
        default:
            return event.respondWith(networkOnly(request));
    }
});
