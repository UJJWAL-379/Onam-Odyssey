const CACHE='onam-ascent-v13';
const CORE=['./','./index.html','./manifest.json','./icon.svg'];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));

self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('onam-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));

function patchGame(text){
  let out=text;
  out=out.replace('function roadY(z){return 170+Math.pow(1-z,1.65)*320}function roadHalf(z){return 85+Math.pow(1-z,1.45)*410}',
    'function roadY(z){z=Math.max(0,Math.min(1,z));return 170+Math.pow(1-z,1.65)*320}function roadHalf(z){z=Math.max(0,Math.min(1,z));return 85+Math.pow(1-z,1.45)*410}');
  out=out.replace('46*Math.cos(ang)', 'Math.abs(46*Math.cos(ang))');
  if(!out.includes('__onamSafeEllipse')){
    const patch=`<script>(function(){if(window.CanvasRenderingContext2D){const p=CanvasRenderingContext2D.prototype;if(!p.__onamSafeEllipse){const e=p.ellipse;p.ellipse=function(x,y,rx,ry,rot,sa,ea,ccw){return e.call(this,x,y,Number.isFinite(rx)?Math.abs(rx):0,Number.isFinite(ry)?Math.abs(ry):0,rot,sa,ea,ccw)};p.__onamSafeEllipse=true}}})();</script>`;
    out=out.replace('</head>',patch+'</head>');
  }
  return out;
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(async response=>{
    if(!response.ok)return response;
    let out=response;
    if(event.request.destination==='document'||event.request.url.endsWith('/index.html')){
      try{
        const text=await response.clone().text();
        out=new Response(patchGame(text),{status:response.status,statusText:response.statusText,headers:response.headers});
      }catch(e){}
    }
    const copy=out.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
    return out;
  }).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))));
});