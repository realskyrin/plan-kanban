if(!self.define){let e,s={};const n=(n,t)=>(n=new URL(n+".js",t).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let c={};const r=e=>n(e,a),o={module:{uri:a},exports:c,require:r};s[a]=Promise.all(t.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"f73d74e91842b652abc662c94d4fdab7"},{url:"/_next/static/ZM6PKUJaVX00JtAbXQyCE/_buildManifest.js",revision:"a1b7599199e2e8c82f2c6bcf8d8aca61"},{url:"/_next/static/ZM6PKUJaVX00JtAbXQyCE/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/16-74a0ac56362c5f94.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/250-fc30f1fd65ea00c9.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/329-ae6c13451594e088.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/575-cbde4f84815c66f6.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/602dbae6-3404127055761c0c.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/621-b76f3dba97e8d9ab.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/718-2cf86af263e55d65.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/743-6a6b730873f2a569.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/938-fdc2b03e70649168.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/app/error-7e3c9e334fccde4d.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/app/layout-cf505f522e6a8d95.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/app/loading-9bc002f4a9be4cc9.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/app/not-found-e182f7370e06d1fd.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/app/page-fef718129ec23d26.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/app/project/%5Bid%5D/page-4597a0c504325583.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/fd9d1056-f375362fb438b439.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/framework-c5181c9431ddc45b.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/main-5b84ceef11cf269f.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/main-app-162bdae59b503f5e.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/pages/_app-98cb51ec6f9f135f.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/pages/_error-e87e5963ec1b8011.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-056fb57a68441a3d.js",revision:"ZM6PKUJaVX00JtAbXQyCE"},{url:"/_next/static/css/6b43c3b978e66293.css",revision:"6b43c3b978e66293"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/icons/icon-128x128.png",revision:"403bf665e51d142d0be80f356d6190b3"},{url:"/icons/icon-144x144.png",revision:"e3dc57d83ad8ad036a327dc6ddb9af75"},{url:"/icons/icon-152x152.png",revision:"dddd14ff858aafe7d5f4e6c505a3d2d2"},{url:"/icons/icon-192x192.png",revision:"04ae14f826b06328827d124b44c30a09"},{url:"/icons/icon-384x384.png",revision:"4df8ae8cb97d2f708eee8d7195cf080b"},{url:"/icons/icon-512x512.png",revision:"5d921ce2b0e851237c3bfb8f89088d80"},{url:"/icons/icon-72x72.png",revision:"576180cdf67ef83f96fbe30e34ca1909"},{url:"/icons/icon-96x96.png",revision:"eb63de63201fef3f26a2c6ef4a579424"},{url:"/manifest.json",revision:"7f936ee1b87361c521e35ff56b8590e7"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
