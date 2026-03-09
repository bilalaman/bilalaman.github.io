var CACHE='bilalaman-v4';

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){return caches.delete(k);}));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  e.respondWith(
    fetch(e.request).then(function(res){
      return res;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
