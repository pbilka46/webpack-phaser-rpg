const cacheName = 'phaser-v1';
const filesToCache = [
  '/',
  '/app.bundle.js',
  '/index.html',
  '/bg2.png',
  '/tile.png',
  '/tile-col.json',
  '/bogo_sprite.png',
  '/keg.png',
];

self.addEventListener('install', function(event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('sw caching files');
      console.log(cache);
      return cache.addAll(filesToCache);
    }).catch(function(err) {
      console.log(err);
    })
  );
});


self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});
