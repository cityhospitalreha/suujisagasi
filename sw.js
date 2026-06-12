// このアプリのキャッシュ名（バージョン管理用）
// 内容を更新したら、末尾の数字（v1, v2...）を増やすとキャッシュが更新されます
const CACHE_NAME = "tanaku-training-v1";

// オフラインでも使えるようにキャッシュしておくファイル一覧
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

// ① インストール時：必要なファイルをキャッシュに保存
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ② 有効化時：古いバージョンのキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ③ リクエスト時：キャッシュにあればそれを返し、なければネットワークから取得
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
