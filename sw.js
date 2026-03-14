var CACHE='bilalaman-v5';
var STATIC=['/','index.html','icon-192.png','icon-512.png','f104.jpg','manifest.json'];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(STATIC);
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
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(res){
      if(res.ok){
        var clone=res.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,clone);});
      }
      return res;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
