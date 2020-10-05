self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v2').then(function (cache) {
            return cache.addAll([
                '/scss/all.min.css',
                '/offline.html'
            ]).catch(function (error) {
              console.log("Cache failed", error)  
            });
        })
    );
});
self.addEventListener('fetch', function (event) {
    event.respondWith(
        // Try the cache
        caches.open('v2').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                if (!response)
                // Fall back to network
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(function () {
                // If both fail, show a generic fallback:
                return caches.match('/offline.html');
                // However, in reality you'd have many different
                // fallbacks, depending on URL & headers.
                // Eg, a fallback silhouette image for avatars.
            })
        })
    );
  });
