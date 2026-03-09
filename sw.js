var CACHE='bilalaman-v2';
var ASSETS=['/','index.html'];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ASSETS);
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
  // Network first for API calls, cache first for static assets
  if(e.request.url.includes('api.')||e.request.url.includes('rss')||e.request.url.includes('proxy')){
    e.respondWith(fetch(e.request).catch(function(){return caches.match(e.request);}));
  }else{
    e.respondWith(
      caches.match(e.request).then(function(r){
        return r||fetch(e.request).then(function(res){
          var clone=res.clone();
          caches.open(CACHE).then(function(cache){cache.put(e.request,clone);});
          return res;
        });
      })
    );
  }
});
