if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let l={};const o=e=>i(e,t),c={module:{uri:t},exports:l,require:o};s[t]=Promise.all(n.map((e=>c[e]||o(e)))).then((e=>(r(...e),l)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/GameOverView-37b6091f.js",revision:null},{url:"assets/GameOverView-7390dcab.css",revision:null},{url:"assets/index-7325d93e.css",revision:null},{url:"assets/index-c1601262.js",revision:null},{url:"assets/MainView-4c20ff4f.css",revision:null},{url:"assets/MainView-746539e9.js",revision:null},{url:"index.html",revision:"1d58e433876e8ab058f75453b3382c1b"},{url:"registerSW.js",revision:"9d04e9b7178099b649a3f932b36ff9c9"},{url:"manifest.webmanifest",revision:"13c342b212cd0cb766eebc45ec6c938c"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
