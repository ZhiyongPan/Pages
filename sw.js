self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {

      console.log('PZY --- install cache');
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      console.log('PZY --- fetch has : ' + event.request);
      return response;
    } else {
      return fetch(new Request(event.request.url, {mode : 'cors'})).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        console.log('PZY --- fetch response : ' + event.request);
        return response;
      }).catch(function () {
        console.log('PZY --- fetch fail : ' + event.request);
        // return caches.match('/sw-test/gallery/myLittleVader.jpg');
        return fetch(new Request(event.request.url, {mode : 'cors'}));
      });
    }
  }));
});
