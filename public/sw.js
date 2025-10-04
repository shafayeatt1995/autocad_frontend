self.addEventListener("install", (event) => {
  console.log("SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("SW activated");
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Optional: Offline cache logic এখানে দিতে পারেন
});
