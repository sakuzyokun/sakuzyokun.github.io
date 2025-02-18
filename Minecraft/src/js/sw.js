const cacheName = "thingmaker-minekhan-v1";
const assets = [
  "/",
  "/index.html",
  "/favicon.ico",
  "src/js/maps.json",
  "src/js/minecraft.ttf"
];

function canCache(url) {
  return url.startsWith("https://data.thingmaker.repl.co/");
}

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      let url = event.request.url;
      return fetch(
        event.request
      ) /*.then(fetchRes => {
        if (canCache(url)) {
					cache.put(event.request, fetchRes.clone())
				}
        return fetchRes
      })*/
        .catch(() => res);
    })
  );
});
