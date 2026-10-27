/* 平台核心：数据存储、弹窗/抽屉、导航外壳、登录、通用列表与通知
 *
 * 本文件包含以下代码段（搜索「─── 名称」可直接跳转）：
 *   core                               
 *   storage-codec                      Lossless storage interning; decoding creates independent snapshot objects.
 *   demo-content                       
 *   platform-render                    每次重绘后刷新平台外壳
 *   ui-copy                            Shared navigation copy. Keep IDs stable; edit labels in this file.
 *   platform-shell                     Platform navigation: product tasks and shared report/configuration centers.
 *   data-display                       Shared presentation primitives. Values always come from the owning product.
 *   platform-notifications             Notifications reflect persisted task lifecycles and triggered risk events.
 *   entry-management                   One delete action and confirmation contract for user-owned platform resources.
 *   platform-presentation-copy         Remove legacy sample badges from product surfaces; retain data provenance in storage/exports.
 *   structured-lists                   Presentation only: one named metric per column, with existing detail/actions.
 *   interaction-stability              Keep unchanged DOM nodes alive during filtering and background updates.
 *   list-presentation                  Shared by the platform and the embedded scan application.
 *   list-consistency                   Creation metadata and shared list presentation; existing actions remain authoritative.
 *   finish                             Restore the default dataset through the normal initialization path. (function(){ 'use strict'; const A=window.
 *   standalone                         
 *
 * 每段登记为 AppParts['core/名称']，执行顺序统一在 src/boot.js 中维护。
 */
window.AppParts = window.AppParts || {};

// ─── core ──────────────────────────────────────────────────────────────────
AppParts['core/core'] = function () {
(function(){
'use strict';
const key='zhian-standalone-attack';
const paths={shield:'M12 3 4.5 6v5c0 4.8 3 8.2 7.5 10 4.5-1.8 7.5-5.2 7.5-10V6L12 3Z M8.8 11.8l2.2 2.2 4.5-4.5',activity:'M3 12h4l3-8 4 16 3-8h4',check:'m5 12 4 4L19 6',close:'m6 6 12 12M6 18 18 6',search:'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.5-2 5 5',arrow:'M4 12h15m-6-6 6 6-6 6',chevron:'m9 5 7 7-7 7',plus:'M12 5v14M5 12h14',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',filter:'M4 6h16M7 12h10M10 18h4',play:'m8 4 12 8-12 8V4Z',pause:'M8 5v14M16 5v14',file:'M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-2c0-3 3.5-5 8-5s8 2 8 5v2',clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',alert:'m12 3 10 18H2L12 3Zm0 6v5m0 3v1',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',code:'m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',link:'m9 15 6-6M7 17l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M17 7l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',copy:'M8 8h13v13H8V8ZM4 16H2V2h14v2',grid:'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',spark:'m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z',terminal:'M3 4h18v16H3V4Zm4 4 4 4-4 4m6 0h4',logout:'M9 3H3v18h6M9 12h12m-5-5 5 5-5 5',help:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v1',layers:'m12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5M3 17l9 5 9-5',bell:'M5 16h14l-2-4V8a5 5 0 0 0-10 0v4l-2 4Zm5 4h4',box:'M12 3 3 7.5v9L12 21l9-4.5v-9L12 3ZM3 7.5l9 4.5 9-4.5M12 12v9',zap:'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',edit:'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',trash:'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6'};
let stored={};try{stored=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
const A=window.App={
  data:stored,
  modules:{},
  page:'workspace',
  storageOK:true,
  escape:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  icon:(n,s=18)=>`<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.shield}"/></svg>`,
  badge:(t,tone='gray')=>`<span class="badge ${tone}">${A.escape(t)}</span>`,
  save(){try{localStorage.setItem(key,JSON.stringify(A.data))}catch(e){A.storageOK=false;A.toast('浏览器存储不可用，本次修改仅在当前页面保留')}},
  toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(A.toastTimer);A.toastTimer=setTimeout(()=>el.classList.remove('show'),3200)},
  download(name,text,mime='text/plain;charset=utf-8'){const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);A.toast('文件已生成并下载')},
  modal(title,body,footer,opts={}){A.focusReturn=document.activeElement;const overlay=document.getElementById('modal');overlay.innerHTML=`<section class="modal-panel ${opts.wide?'wide':''} ${opts.plain?'plain':''}" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button class="close-btn" aria-label="关闭弹窗" onclick="App.closeModal()">${A.icon('close',20)}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</section>`;overlay.classList.add('open');document.body.style.overflow='hidden';overlay.querySelector('button')?.focus()},
  closeModal(){document.getElementById('modal').classList.remove('open');document.body.style.overflow=document.querySelector('.overlay.open')?'hidden':'';A.focusReturn?.focus?.()},
  drawer(title,body,footer){A.focusReturn=document.activeElement;const overlay=document.getElementById('drawer');overlay.innerHTML=`<section class="modal-panel drawer-panel" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button class="close-btn" aria-label="关闭详情" onclick="App.closeDrawer()">${A.icon('close',20)}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</section>`;overlay.classList.add('open');document.body.style.overflow='hidden';overlay.querySelector('button')?.focus()},
  closeDrawer(){document.getElementById('drawer').classList.remove('open');document.body.style.overflow=document.querySelector('.overlay.open')?'hidden':'';A.focusReturn?.focus?.()},
  // 只负责画内容区；顶栏、侧边栏、文档标题由 platform-render 段在每次重绘后统一刷新。
  render(){if(!A.session)return;const host=document.getElementById('view'),html=A.modules[A.page].render();if(A.updateHTML)A.updateHTML(host,html);else if(host.innerHTML!==html)host.innerHTML=html;A.modules[A.page].afterRender?.()},
  heading(eye,title,desc,actions=''){return `<div class="page-heading"><div><div class="eyebrow">${eye}</div><h1>${title}</h1>${desc?`<p class="page-desc">${desc}</p>`:''}</div><div class="page-actions">${actions}</div></div>`},
  start(){Object.values(A.modules).forEach(m=>m.init?.());A.save();if(A.session)A.showApp();document.addEventListener('keydown',e=>{if(e.key==='Escape'){A.closeModal();A.closeDrawer()}if(e.key==='Tab'){const ov=document.querySelector('.overlay.open');if(!ov)return;const els=[...ov.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')].filter(x=>!x.disabled&&x.offsetParent!==null);const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}});window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(A.modules[page]&&A.session){A.page=page;A.render()}});setInterval(()=>{if(!A.session)return;let changed=false;for(const [name,m] of Object.entries(A.modules)){if(m.tick?.()){changed=true;if(name===A.page&&(!A.platform||A.platform.state.section==='workspace'||A.platform.state.section==='evaluation'&&['attack','scan'].includes(A.platform.state.item))&&m.shouldRenderTick?.()!==false&&!(A.page==='attack'&&A.attack.tab==='create')&&!document.querySelector('.overlay.open')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))A.render()}}if(changed)A.save()},1800)}
};
})();
};

// ─── storage-codec ─────────────────────────────────────────────────────────
AppParts['core/storage-codec'] = function () {
/* Lossless storage interning; decoding creates independent snapshot objects. */
(function(){
'use strict';
const A=window.App,format='zhian-packed-v2';
const C=A.storageCodec={
 encode(data){
  const nodes=[],seen=new Map(),shapes=[],shapeIds=new Map();
  const visit=value=>{
   if(value===null||typeof value!=='object'&&typeof value!=='string')return value;
   if(typeof value==='string'&&value.length<20)return value;
   let encoded;
   if(typeof value==='string')encoded=value;
   else if(Array.isArray(value))encoded=['a',...value.map(v=>visit(v===undefined?null:v))];
   else{
    const entries=Object.entries(value).filter(([,v])=>v!==undefined&&typeof v!=='function'),keys=entries.map(([k])=>k),signature=JSON.stringify(keys);
    let id=shapeIds.get(signature);if(id===undefined){id=shapes.length;shapes.push(keys);shapeIds.set(signature,id);}
    encoded=['o',id,...entries.map(([,v])=>visit(v))];
   }
   const key=JSON.stringify(encoded);
   if(key.length<40&&typeof encoded!=='string')return encoded;
   if(seen.has(key))return ['r',seen.get(key)];
   const id=nodes.length;nodes.push(encoded);seen.set(key,id);return ['r',id];
  };
  const root=visit(data);return {format,root,nodes,shapes};
 },
 decode(data){
  if(![format,'zhian-packed-v1'].includes(data?.format))return data;
  const visit=(value,depth=0)=>{
   if(depth>200)throw Error('Invalid stored data nesting');
   if(Array.isArray(value)){
    if(value[0]==='r'){
     if(!Number.isInteger(value[1])||value[1]<0||value[1]>=data.nodes.length)throw Error('Invalid stored data reference');
     return visit(data.nodes[value[1]],depth+1);
    }
    if(value[0]==='o'&&data.format===format){
     const keys=data.shapes?.[value[1]];
     if(!Array.isArray(keys)||keys.length!==value.length-2||keys.some(k=>typeof k!=='string'))throw Error('Invalid stored object shape');
     return Object.fromEntries(keys.map((key,i)=>[key,visit(value[i+2],depth+1)]));
    }
    if(value[0]!=='a')throw Error('Invalid stored array');
    return value.slice(1).map(v=>visit(v,depth+1));
   }
   if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,visit(v,depth+1)]));
   return value;
  };
  return visit(data.root);
 }
};
try{A.data=C.decode(A.data);}catch(error){A.storageOK=false;}
A.save=function(){try{localStorage.setItem('zhian-standalone-attack',JSON.stringify(C.encode(A.data)));A.storageOK=true;}catch(error){A.storageOK=false;A.toast('浏览器存储不可用，本次修改仅在当前页面保留');}};
})();
};

// ─── demo-content ──────────────────────────────────────────────────────────
AppParts['core/demo-content'] = function () {
(function(){
'use strict';
const A=window.App;
const replacements={"warehouse-edge-gateway.tar.gz": "sample-service.tar.gz", "https://logistics.example.com": "https://app.example.com", "shipment-service-v2.4.zip": "sample-app.zip", "src/shipment/search.ts": "src/api/search.ts", "config/partners.yml": "config/service.yml", "carrier.example.com": "api.example.com", "\u6b63\u5728\u6838\u9a8c\u8fd0\u5355\u67e5\u8be2\u4e0e\u9644\u4ef6\u8bbf\u95ee\u7684\u8bc1\u636e\u94fe": "\u6b63\u5728\u6838\u9a8c\u67e5\u8be2\u63a5\u53e3\u4e0e\u8bbf\u95ee\u63a7\u5236\u7684\u8bc1\u636e\u94fe", "\u8fd0\u5355\u67e5\u8be2\u5b58\u5728 SQL \u6ce8\u5165\u98ce\u9669": "\u67e5\u8be2\u63a5\u53e3\u5b58\u5728 SQL \u6ce8\u5165\u98ce\u9669", "searchShipments": "searchRecords", "CARRIER_API_KEY": "EXTERNAL_API_KEY", "\u7269\u6d41\u5ba2\u670d \u00b7 \u4e0a\u7ebf\u524d\u5b89\u5168\u8bc4\u6d4b": "\u6a21\u578b\u5b89\u5168\u57fa\u7ebf\u8bc4\u6d4b", "\u4f9b\u5e94\u94fe\u52a9\u624b \u00b7 \u5b89\u5168\u57fa\u7ebf\u68c0\u67e5": "\u6587\u672c\u5b89\u5168\u57fa\u7ebf\u68c0\u67e5", "\u7269\u6d41\u5ba2\u670d \u00b7 \u53d1\u5e03\u524d\u5b89\u5168\u8bc4\u6d4b": "\u6a21\u578b\u53d1\u5e03\u524d\u5b89\u5168\u8bc4\u6d4b", "\u667a\u80fd\u5355\u636e \u00b7 \u56fe\u7247\u98ce\u9669\u9a8c\u8bc1": "\u56fe\u50cf\u8f93\u5165\u5b89\u5168\u8bc4\u6d4b", "\u5ba2\u670d\u52a9\u624b \u00b7 \u591a\u8f6e\u5bf9\u8bdd\u56de\u5f52": "\u591a\u8f6e\u5bf9\u8bdd\u56de\u5f52\u8bc4\u6d4b", "\u8de8\u5883\u7269\u6d41 \u00b7 \u591a\u8bed\u8a00\u670d\u52a1": "\u901a\u7528\u95ee\u7b54 \u00b7 \u591a\u8bed\u8a00\u8f93\u5165", "\u5ba2\u670d\u52a9\u624b \u00b7 \u53d1\u5e03\u524d\u9a8c\u8bc1": "\u6a21\u578b\u53d1\u5e03\u524d\u9a8c\u8bc1", "[\u8fd0\u5355\u4e0e\u5ba2\u6237\u5b57\u6bb5\u5df2\u8131\u654f]": "[\u53d7\u9650\u5b57\u6bb5\u5df2\u8131\u654f]", "\u5ba2\u670d\u95ee\u7b54 \u00b7 \u901a\u7528\u52a9\u624b": "\u901a\u7528\u95ee\u7b54 \u00b7 \u6587\u672c\u6a21\u578b", "\u591a\u8f6e\u5ba2\u670d \u00b7 \u4e1a\u52a1\u52a9\u624b": "\u8fde\u7eed\u5bf9\u8bdd \u00b7 \u667a\u80fd\u4f53", "\u5355\u636e\u8bc6\u522b \u00b7 \u56fe\u6587\u95ee\u7b54": "\u56fe\u50cf\u7406\u89e3 \u00b7 \u56fe\u6587\u95ee\u7b54", "\u5408\u4f5c\u65b9\u63a5\u53e3\u5bc6\u94a5\u660e\u6587\u5b58\u50a8": "\u63a5\u53e3\u5bc6\u94a5\u660e\u6587\u5b58\u50a8", "carrier_api": "external_api", "\u5ba2\u6237\u54a8\u8be2\u4e0e\u8fd0\u5355\u67e5\u8be2": "\u901a\u7528\u6587\u672c\u5bf9\u8bdd\u80fd\u529b", "\u4f9b\u5e94\u94fe\u4e1a\u52a1\u77e5\u8bc6\u95ee\u7b54": "\u901a\u7528\u5bf9\u8bdd\u4e0e\u4efb\u52a1\u6267\u884c", "\u7269\u6d41\u5355\u636e\u4e0e\u56fe\u6587\u7406\u89e3": "\u56fe\u50cf\u8f93\u5165\u4e0e\u6587\u672c\u56de\u7b54", "\u8fd0\u5355\u670d\u52a1\u4e0a\u7ebf\u524d\u68c0\u67e5": "\u5e94\u7528\u4e0a\u7ebf\u524d\u5b89\u5168\u68c0\u67e5", "shipments": "records", "partners:": "services:", "\u4e2a\u4eba\u4fe1\u606f\u4e0e\u8fd0\u5355\u5f52\u5c5e": "\u4e2a\u4eba\u4fe1\u606f\u4e0e\u8d44\u6e90\u8bbf\u95ee\u6743\u9650", "\u8eab\u4efd\u548c\u8fd0\u5355\u5f52\u5c5e\u6821\u9a8c": "\u8eab\u4efd\u548c\u8bbf\u95ee\u6743\u9650\u6821\u9a8c", "\u8fd0\u5355\u670d\u52a1 API": "\u793a\u4f8b\u5e94\u7528 API", "\u8fd0\u5355\u670d\u52a1\u53d1\u5e03\u68c0\u67e5": "\u5e94\u7528\u53d1\u5e03\u68c0\u67e5", "\u4ed3\u50a8\u7f51\u5173\u5b89\u5168\u68c0\u67e5": "\u670d\u52a1\u7a0b\u5e8f\u5b89\u5168\u68c0\u67e5", "\u7269\u6d41\u95e8\u6237\u57fa\u7ebf\u68c0\u67e5": "\u7f51\u7ad9\u57fa\u7ebf\u68c0\u67e5", "\u4f9b\u5e94\u94fe\u77e5\u8bc6\u52a9\u624b": "\u667a\u80fd\u4f53\u793a\u4f8b", "\u7b2c\u4e09\u65b9\u7269\u6d41\u63a5\u53e3": "\u5916\u90e8\u670d\u52a1\u63a5\u53e3", "\u5408\u4f5c\u65b9\u6570\u636e\u67e5\u8be2": "\u5916\u90e8\u670d\u52a1\u8c03\u7528", "\u4ed3\u50a8\u7ec8\u7aef\u5b89\u88c5\u5305": "\u670d\u52a1\u7a0b\u5e8f\u5b89\u88c5\u5305", "\u7269\u6d41\u5ba2\u670d\u52a9\u624b": "\u901a\u7528\u5bf9\u8bdd\u6a21\u578b", "\u667a\u80fd\u5355\u636e\u8bc6\u522b": "\u56fe\u6587\u7406\u89e3\u6a21\u578b", "\u8de8\u5883\u7269\u6d41\u5ba2\u670d": "\u901a\u7528 AI \u5e94\u7528", "\u4ed3\u50a8\u8fb9\u7f18\u7f51\u5173": "\u793a\u4f8b\u670d\u52a1\u7a0b\u5e8f", "\u5ba2\u6237\u670d\u52a1\u95e8\u6237": "\u793a\u4f8b\u7f51\u7ad9", "\u53d7\u9650\u4e1a\u52a1\u4fe1\u606f": "\u53d7\u9650\u4fe1\u606f", "\u8fd0\u5355\u540c\u6b65": "\u6570\u636e\u540c\u6b65", "\u8fd0\u5355\u67e5\u8be2": "\u6570\u636e\u67e5\u8be2", "\u7269\u6d41\u5ba2\u670d": "\u901a\u7528\u5bf9\u8bdd\u6a21\u578b", "\u4f9b\u5e94\u94fe": "\u901a\u7528\u5e94\u7528", "\u6536\u4ef6\u4eba": "\u76f8\u5173\u4eba\u5458", "\u8fd0\u5355": "\u8d44\u6e90", "\u7269\u6d41": "\u901a\u7528", "\u4ed3\u50a8": "\u5e94\u7528", "\u5355\u636e": "\u56fe\u50cf", "\u8de8\u5883": "\u8de8\u8bed\u8a00", "\u5ba2\u670d": "\u5e94\u7528\u652f\u6301", "\u8fd0\u8f93": "\u5185\u5bb9\u751f\u6210", "\u5305\u88f9": "\u6750\u6599", "\u8ba2\u5355": "\u8bb0\u5f55", "\u914d\u9001": "\u5904\u7406", "\u8865\u8d27": "\u5904\u7406", "\u627f\u8fd0": "\u4f7f\u7528", "\u8d27\u7269": "\u5185\u5bb9"};
A.genericExampleText=function walk(value){
 if(typeof value==='string'){for(const [from,to] of Object.entries(replacements))value=value.split(from).join(to);return value;}
 if(Array.isArray(value))return value.map(walk);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,walk(v)]));
 return value;
};
const attackInit=A.modules.attack.init;
A.modules.attack.init=function(){
 attackInit();const d=A.data.attack;if(d.contentVersion===2)return;
 d.archivedExamples ||= {tasks:[]};
 const retired=['EV-260915-008','EV-260915-006'];
 d.archivedExamples.tasks.push(...d.tasks.filter(t=>retired.includes(t.id)));
 d.tasks=d.tasks.filter(t=>!retired.includes(t.id));
 d.models=d.models.map(m=>['m1','m2','m3'].includes(m.id)&&m.sample?A.genericExampleText(m):m);
 const agent=d.models.find(m=>m.id==='m2'&&m.sample);if(agent){agent.kind='agent';agent.model='agent-endpoint';agent.name='智能体示例';}
 d.tasks=d.tasks.map(t=>['EV-260916-001','EV-260914-003'].includes(t.id)?A.genericExampleText(t):t);
 d.contentVersion=2;
};

})();
};

// ─── platform-render ───────────────────────────────────────────────────────
// 每次重绘内容后刷新平台外壳（顶栏 + 侧边栏）。外壳实现见本文件 platform-shell。
AppParts['core/platform-render'] = function () {
(function(){
'use strict';
const A=window.App;
const render=A.render;
A.render=function(){render();if(A.session&&A.platform)A.platform.renderChrome();};
})();
};

// ─── ui-copy ───────────────────────────────────────────────────────────────
AppParts['core/ui-copy'] = function () {
/* Shared navigation copy. Keep IDs stable; edit labels in this file. */
(function(){
'use strict';
const sections=[['workspace','安全态势','grid'],['evaluation','安全评估','file'],['protection','安全防护','shield'],['policy','策略中心','settings'],['assets','资产中心','box'],['risk','风险中心','alert'],['management','平台管理','settings']];
const menus={workspace:[],evaluation:[['scan','漏洞检测','search'],['attack','模型演练','shield'],['reports','评估报告','file'],['compare','结果对比','file']],protection:[['overview','防护总览','shield'],['records','防护记录','file'],['reports','防护报告','file']],policy:[['policies','攻击策略配置','layers'],['defense','防护策略配置','shield']],assets:[['applications','AI 应用','layers'],['models','模型','box'],['code','代码','code'],['packages','二进制/软件包','box'],['web','Web','link']],risk:[['events','风险事件','alert'],['rules','触发规则','settings']]};
const attackTabs=[['arena','演练场'],['tasks','任务管理']],scanTabs=[['code-scan','代码检测'],['app-scan','二进制／软件包检测'],['web-scan','Web 检测']],policyTabs=[['strategies','策略配置'],['methods','攻击方法'],['content','攻击题库']];
window.PlatformUI={sections,menus,attackTabs,scanTabs,policyTabs};
})();
};

// ─── platform-shell ────────────────────────────────────────────────────────
AppParts['core/platform-shell'] = function () {
/* Platform navigation: product tasks and shared report/configuration centers. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const {sections,menus,attackTabs,scanTabs,policyTabs}=window.PlatformUI;
const P=A.platform={state:{section:'workspace',item:'home'},lastAttackTab:'tasks',scanTab:'code-scan',scanOpen:true,attackOpen:true,policyOpen:true,defenseOpen:true,sections,menus};
menus.management=[['model-roles','模型配置','settings']];
P.title=()=>P.state.section==='workspace'?'安全态势':menus[P.state.section]?.find(row=>row[0]===P.state.item)?.[1]||'安全态势';
P.selectState=function(section,item,tab,id){
 if(section==='evaluation'&&item==='attack'&&(!tab||tab==='arena')){tab='tasks';id=undefined;}
 if(section==='risk'&&['rules','grading'].includes(item))section='management';
 if(section==='evaluation'&&item==='compare'){item='reports';tab=tab==='objects'?'objects':'compare';}
 if(section==='evaluation'&&item==='tasks'){item='attack';id=tab;tab='tasks';}
 if(section==='evaluation'&&(!item||['home','operations'].includes(item))){item='scan';tab='code-scan';id=undefined;}
 if(section==='evaluation'&&item==='attack'&&tab==='series'){item='reports';tab='compare';}
 if(section==='evaluation'&&item==='attack'&&tab==='banks'){section='policy';item='policies';tab='content';}
 if(section==='evaluation'&&item==='attack'&&tab==='details'){tab='tasks';id=A.evaluationRecords?.state.task!=='all'?A.evaluationRecords?.state.task:undefined;}
 if(section==='policy'&&['methods','judges','templates'].includes(item)){tab=item==='methods'?'methods':'strategies';item='policies';}
 if(section==='protection'){
  if(item==='content')item=({requests:'records',samples:'records'}[tab]||tab||'applications');
  if(item==='requests'||item==='samples'){tab=item;item='records';}
  if(['review','settings','applications'].includes(item))item='overview';
 }
 if(section==='policy'&&item==='rules'){item='defense';tab='rules';}
 if(section==='risk'&&['overview','records'].includes(item))item='events';
 if(section==='management'&&(!item||['home','models','roles'].includes(item)))item='model-roles';
 if(section==='workspace')item='home';
 if(!sections.some(s=>s[0]===section)||(section!=='workspace'&&!menus[section].some(row=>row[0]===item)))return false;
 // Page changes discard unfinished forms; saved policies and task snapshots are unaffected.
 if(!A.scanRestoration?.formNavigation){
  X.wizard=null;A.policies.draft=null;A.policies.taskPolicyReturn=null;A.connections.draft=null;A.connections.assetPickers={};
  if(A.scanProduct)A.scanProduct.draft=null;
  if(A.policyUsability){A.policyUsability.pendingPolicy=null;A.policyUsability.pendingTask=null;}
  if(A.assessment)A.assessment.pendingScanDraft=null;
  if(A.policyKnowledge)A.policyKnowledge.pendingDraft=null;
  if(A.modelRoles){A.modelRoles.draft?.capabilityController?.abort();A.modelRoles.draft=null;}
 }
 P.state={section,item};P.applicationId=section==='assets'&&item==='applications'?(tab||null):null;X.selected=null;X.rangePreview=false;X.tab='platform';
 if(A.evaluation)A.evaluation.scanReportId=null;
 if(section==='evaluation'&&item==='attack'){
  X.tab=attackTabs.some(t=>t[0]===tab)?tab:P.lastAttackTab;P.attackOpen=true;X.detailTab='board';
  if(id&&X.db.tasks.some(t=>t.id===id&&!t.deletedAt)){if(X.tab==='arena')X.arena={taskId:id,unitId:null,replay:null};else{X.selected=id;X.tab='tasks';}}
 }else if(section==='evaluation'&&item==='scan'){
  P.scanTab=scanTabs.some(t=>t[0]===tab)?tab:P.scanTab;P.scanOpen=true;if(A.scanProduct)A.scanProduct.selected=id||null;
 }else if(section==='evaluation'&&item==='reports'){
  if(A.evaluation){A.evaluation.reportTab=['compare','objects'].includes(tab)?tab:'list';if(A.assessment)A.assessment.selectedObject=tab==='objects'?id||null:null;if(tab==='scan'&&id)A.evaluation.scanReportId=id;}
  const task=X.db.tasks.find(t=>t.id===tab&&!t.deletedAt);
  if(task&&A.evaluation?.reportReady(task)){X.selected=task.id;X.tab='tasks';X.detailTab='report';}
 }else if(section==='assets'&&item==='models'){X.tab='models';X.connectionKind='model';}
 else if(section==='policy'&&item==='policies'){A.policies.section=policyTabs.some(t=>t[0]===tab)?tab:'strategies';P.policyOpen=true;}
 else if(section==='policy'&&item==='defense'){A.defensePolicies.tab=['configurations','basics','rules','knowledge'].includes(tab)?tab:tab==='policies'?'basics':'configurations';}
 else if(section==='protection'&&item==='records'&&A.contentProduct){A.contentProduct.recordsTab=tab==='samples'?'samples':'requests';}
 return true;
};
P.go=function(section,item,tab,id){section=sections.some(s=>s[0]===section)?section:'workspace';item ||= section==='workspace'?'home':menus[section][0][0];if(!P.selectState(section,item,tab,id))return;A.closeModal();A.closeDrawer();A.render();window.scrollTo({top:0,behavior:'instant'});};
P.navigate=page=>({attack:()=>P.go('evaluation','attack'),workspace:()=>P.go('workspace','home'),models:()=>P.go('assets','models'),review:()=>P.go('protection','overview'),scan:()=>P.go('evaluation','scan')})[page]?.();
P.attackTab=tab=>P.go('evaluation','attack',tab);P.scanPage=(tab,id)=>P.go('evaluation','scan',tab,id);
P.sync=function(){
 if(X.tab==='models'){P.state={section:'assets',item:'models'};X.connectionKind='model';}
 else if(X.tab==='banks'){P.state={section:'policy',item:'policies'};X.tab='platform';A.policies.section='content';}
 else if(X.selected||['tasks','create'].includes(X.tab)){
  const report=X.selected&&X.detailTab==='report'&&A.evaluation?.reportReady(X.task);
  if(X.selected&&X.detailTab==='report'&&!report)X.detailTab='board';
  P.state={section:'evaluation',item:report?'reports':'attack'};if(!report)P.lastAttackTab='tasks';
 }else if(X.tab==='series'){P.state={section:'evaluation',item:'reports'};if(A.evaluation)A.evaluation.reportTab='compare';X.tab='platform';}
 else if(X.tab==='arena'){X.tab='tasks';X.selected=null;P.state={section:'evaluation',item:'attack'};P.lastAttackTab='tasks';}
 else if(X.tab==='details'){X.tab='tasks';P.state={section:'evaluation',item:'attack'};P.lastAttackTab='tasks';}
};
P.restoreRoute=function(){const p=location.hash.slice(1).split('/').map(v=>{try{return decodeURIComponent(v);}catch(e){return v;}});if(p[0]==='attack')P.selectState('evaluation','attack','arena');else if(!p[0])P.selectState('workspace','home');else if(!P.selectState(p[0],p[1]||'home',p[2],p[3]))P.selectState('workspace','home');};
P.empty=title=>A.heading('',title,'')+'<section class="platform-empty card"><div class="platform-empty-symbol">'+I('layers',32)+'</div><p>暂无内容</p></section>';
P.header=function(){return '<button class="platform-brand" onclick="App.platform.go(\'workspace\',\'home\')" aria-label="AI安全平台安全态势"><strong>AI安全平台</strong></button><nav class="platform-top-nav" aria-label="平台主导航">'+sections.filter(([id])=>id!=='management').map(([id,label])=>'<button class="'+(P.state.section===id?'active':'')+'" onclick="App.platform.go(\''+id+'\')">'+label+'</button>').join('')+'</nav><div class="platform-header-actions"><button class="platform-icon-button" aria-label="平台设置" title="平台设置" onclick="App.platform.go(\'management\',\'model-roles\')">'+I('settings',20)+'</button>'+(A.platformNotifications?.buttonHTML()||'<button class="platform-icon-button" aria-label="消息通知" onclick="App.platformNotifications.open()">'+I('bell',20)+'</button>')+'<button class="platform-account" aria-label="账号与退出登录" title="账号与退出登录" onclick="App.account()"><span class="avatar">'+I('user',17)+'</span><span class="account-name">'+E(A.session?.user||'安全管理员')+'</span></button></div>';};
P.sidebar=function(){
 const section=P.state.section;if(['workspace','risk'].includes(section))return '';const def=sections.find(s=>s[0]===section);
 const child=(label,action,active)=>'<button class="platform-subitem '+(active?'active':'')+'" onclick="'+action+'">'+label+'</button>';
 return '<div class="platform-side-title"><strong>'+def[1]+'</strong><button id="center-toggle" class="platform-collapse" aria-controls="center-navigation" aria-expanded="'+!A.data.ui?.sidebarCollapsed+'" aria-label="'+(A.data.ui?.sidebarCollapsed?'展开':'收起')+'侧边栏" title="'+(A.data.ui?.sidebarCollapsed?'展开':'收起')+'侧边栏" onclick="App.platform.toggleSidebar()">'+I('chevron',15)+'</button></div><nav id="center-navigation" aria-label="'+def[1]+'侧边栏">'+menus[section].map(([id,label,icon])=>{
  const comparing=section==='evaluation'&&['compare','objects'].includes(A.evaluation?.reportTab)&&!X.selected&&!A.evaluation?.scanReportId;
  const active=section==='evaluation'&&id==='compare'?P.state.item==='reports'&&comparing:section==='evaluation'&&id==='reports'?P.state.item==='reports'&&!comparing:P.state.item===id,group=section==='evaluation'&&id==='scan'?'scan':section==='policy'&&id==='policies'?'policy':section==='policy'&&id==='defense'?'defense':null,expanded=group?P[group+'Open']:false;
  const action=group?"App.platform.toggleGroup('"+group+"')":"App.platform.go('"+section+"','"+id+"')";
  let html='<button class="platform-side-item '+(active?'active':'')+'" aria-label="'+label+'" title="'+label+'" '+(group?'aria-expanded="'+expanded+'"':'')+' onclick="'+action+'"><span>'+label+'</span>'+(group?'<i class="platform-menu-chevron '+(expanded?'open':'')+'">'+I('chevron',13)+'</i>':'')+'</button>';
  if(group==='policy'||group==='defense'){
   const tab=group==='policy'?'strategies':'configurations',selected=active&&(group==='policy'?A.policies.section:A.defensePolicies.tab)===tab;
   html='<div class="platform-nav-parent"><button class="platform-side-item '+(selected?'active':'')+'" onclick="App.platform.go(\'policy\',\''+id+'\',\''+tab+'\')"><span>'+label+'</span></button><button class="platform-group-toggle" aria-label="'+(expanded?'收起':'展开')+label+'资源" aria-expanded="'+expanded+'" onclick="App.platform.toggleResources(\''+group+'\')"><i class="platform-menu-chevron '+(expanded?'open':'')+'">'+I('chevron',13)+'</i></button></div>';
  }
  if(group==='attack'&&expanded)html+='<div class="platform-subnav">'+attackTabs.map(([tab,name])=>child(name,"App.platform.attackTab('"+tab+"')",active&&P.lastAttackTab===tab)).join('')+'</div>';
  if(group==='scan'&&expanded)html+='<div class="platform-subnav">'+scanTabs.map(([tab,name])=>child(name,"App.platform.scanPage('"+tab+"')",active&&P.scanTab===tab)).join('')+'</div>';
  if(group==='policy'&&expanded)html+='<div class="platform-subnav">'+policyTabs.filter(t=>t[0]!=='strategies').map(([tab,name])=>child(name,"App.platform.go('policy','policies','"+tab+"')",active&&A.policies.section===tab)).join('')+'</div>';
  if(group==='defense'&&expanded)html+='<div class="platform-subnav">'+[['basics','基础策略'],['rules','规则库'],['knowledge','词库']].map(([tab,name])=>child(name,"App.platform.go('policy','defense','"+tab+"')",active&&A.defensePolicies.tab===tab)).join('')+'</div>';
  return (section==='assets'&&['applications','models'].includes(id)?'<div class="platform-asset-group">'+(id==='applications'?'业务应用':'技术资产')+'</div>':'')+html;
 }).join('')+'</nav><div class="platform-side-footer"><span>AI 安全平台</span></div>';
};
P.toggleGroup=function(group){const section=['policy','defense'].includes(group)?'policy':'evaluation',item=group==='policy'?'policies':group;if(P.state.section===section&&P.state.item===item){P[group+'Open']=!P[group+'Open'];P.renderChrome();}else{P[group+'Open']=true;P.go(section,item);}};
P.toggleResources=function(group){if(!['policy','defense'].includes(group))return;P[group+'Open']=!P[group+'Open'];P.renderChrome();};
P.toggleScan=()=>P.toggleGroup('scan');P.toggleAttack=()=>P.toggleGroup('attack');P.account=()=>A.account();
// 侧边栏折叠：唯一入口，侧边栏与内容区共用同一状态
P.toggleSidebar=function(){A.data.ui ||= {};A.data.ui.sidebarCollapsed=!A.data.ui.sidebarCollapsed;A.save();P.renderChrome();document.getElementById('center-toggle')?.focus();};
P.renderChrome=function(){
 P.sync();const app=document.getElementById('app'),dashboard=['workspace','risk'].includes(P.state.section);app.classList.add('platform-shell');app.classList.toggle('has-center-nav',!dashboard);app.classList.toggle('dashboard-layout',dashboard);app.classList.toggle('nav-collapsed',!dashboard&&!!A.data.ui?.sidebarCollapsed);
 for(const [id,html] of [['platform-header',P.header()],['center-sidebar',P.sidebar()]]){const host=document.getElementById(id);if(A.updateHTML)A.updateHTML(host,html);else if(host.innerHTML!==html)host.innerHTML=html;}document.getElementById('center-sidebar').hidden=dashboard;
 let leaf=P.title(),hash=P.state.section+'/'+P.state.item;
 if(P.state.section==='evaluation'&&P.state.item==='attack'){leaf=X.tab==='create'?'新建演练任务':X.selected?'演练任务详情':attackTabs.find(t=>t[0]===P.lastAttackTab)?.[1];hash='evaluation/attack/'+P.lastAttackTab+(X.selected?'/'+encodeURIComponent(X.selected):X.tab==='create'?'/create':X.tab==='arena'&&X.arena.taskId&&X.db.tasks.some(t=>t.id===X.arena.taskId&&!t.deletedAt)?'/'+encodeURIComponent(X.arena.taskId):'');}
 if(P.state.section==='evaluation'&&P.state.item==='scan'){leaf=scanTabs.find(t=>t[0]===P.scanTab)?.[1]||'漏洞扫描';hash='evaluation/scan/'+P.scanTab+(A.scanProduct?.selected?'/'+encodeURIComponent(A.scanProduct.selected):'');}
 if(P.state.section==='evaluation'&&P.state.item==='reports'){leaf=X.selected||A.evaluation?.scanReportId?'评估报告':A.evaluation?.reportTab==='objects'?'结果对比':A.evaluation?.reportTab==='compare'?'结果对比':'评估报告';hash='evaluation/reports'+(X.selected?'/'+encodeURIComponent(X.selected):A.evaluation?.scanReportId?'/scan/'+encodeURIComponent(A.evaluation.scanReportId):A.evaluation?.reportTab==='objects'?'/objects'+(A.assessment?.selectedObject?'/'+encodeURIComponent(A.assessment.selectedObject):''):A.evaluation?.reportTab==='compare'?'/compare':'');}
 if(P.state.section==='assets'&&P.state.item==='applications'&&P.applicationId){leaf='应用详情';hash='assets/applications/'+encodeURIComponent(P.applicationId);}
 if(P.state.section==='policy'&&P.state.item==='policies'){leaf=A.policies.section==='strategies'?'攻击策略配置':policyTabs.find(t=>t[0]===A.policies.section)?.[1];hash='policy/policies/'+A.policies.section;}
 if(P.state.section==='policy'&&P.state.item==='defense'){leaf=({configurations:'防护策略配置',basics:'基础策略',rules:'规则库',knowledge:'词库'})[A.defensePolicies.tab]||'策略配置';hash='policy/defense/'+A.defensePolicies.tab;}
 const sectionName=sections.find(s=>s[0]===P.state.section)?.[1];document.title=leaf+' · AI安全平台';app.dataset.section=X.tab;app.dataset.platformSection=P.state.section;
 if(location.hash.slice(1)!==hash)history.replaceState(null,'','#'+hash);
};
const render=A.modules.attack.render;
A.modules.attack.render=function(){
 P.sync();const {section,item}=P.state;
 if(section==='workspace')return A.platformHome?.render()||P.empty('安全态势');
 if(section==='management'&&item==='model-roles')return A.modelRoles.renderManagement();
 if(section==='assets'&&item==='models')return A.modelRoles?.render()||P.empty(P.title());
 if(section==='assets'&&item==='applications')return A.contentSafety.assetHTML();
 if(section==='assets')return A.platformGovernance?.assetsHTML(item)||P.empty(P.title());
 if(section==='evaluation'&&item==='attack'){
  if(X.tab==='create')return render.apply(this,arguments);if(X.selected)return A.evaluation.taskDetailHTML(X.task);if(X.tab==='tasks')return A.evaluation.tasksHTML();
  return A.heading('','攻防演练场','观察自动执行链路与当前任务进度。','<button class="btn primary" onclick="App.attack.newTask()">'+I('plus',14)+'新建演练任务</button>')+X.arenaHTML();
 }
 if(section==='evaluation'&&item==='scan')return A.scanProduct?.render(P.scanTab)||P.empty('漏洞扫描');
 if(section==='evaluation'&&item==='reports')return A.evaluation.scanReportId?A.scanProduct?.reportHTML(A.evaluation.scanReportId):X.selected?A.evaluation.reportDetailHTML(X.task):A.evaluation.reportsHTML();
 if(section==='policy'&&item==='policies')return A.policies.renderWorkspace();if(section==='policy'&&item==='defense')return A.contentPolicies.render();if(section==='policy'&&item==='rules')return A.safetyRules.render();
 if(section==='protection')return A.contentProduct?A.contentProduct.render(item):A.contentSafety.render(item==='records'?'requests':item);
 if(section==='risk')return A.platformGovernance?.renderRisk(item)||P.empty(P.title());
 return P.empty(P.title());
};
X.back=()=>P.go('evaluation','attack','tasks');
X.openResultTask=function(id,report=false){if(report&&A.evaluation?.reportReady(X.db.tasks.find(t=>t.id===id)))A.evaluation.openReport(id);else X.open(id);};
if(A.evaluationRecords)A.evaluationRecords.open=function(id){if(id&&X.db.tasks.some(t=>t.id===id)){A.evaluationRecords.setScope(id);X.open(id);X.detailTab='samples';A.render();}else P.go('evaluation','attack','tasks');};
P.render=()=>A.render();window.addEventListener('hashchange',()=>{if(A.session){P.restoreRoute();A.closeModal();A.closeDrawer();A.render();}});
})();
};

// ─── data-display ──────────────────────────────────────────────────────────
AppParts['core/data-display'] = function () {
/* Shared presentation primitives. Values always come from the owning product. */
(function(){
'use strict';
const A=window.App,E=A.escape;
const D=A.dataDisplay={colors:{blue:'#4779b5',teal:'#348875',amber:'#d59a38',red:'#c45568',gray:'#a6b2c1'}};
D.states=[['running','进行中',D.colors.blue],['done','已完成',D.colors.teal],['error','执行异常','#d76a42'],['stopped','已终止',D.colors.amber],['pending','待执行',D.colors.gray]];
D.counts=tasks=>D.states.map(([id,label,color])=>({id,label,color,value:tasks.filter(t=>(D.states.some(s=>s[0]===t.status)?t.status:'pending')===id).length}));
D.ring=function(rows,{value,label,description='',className=''}={}){
 const total=rows.reduce((n,r)=>n+Math.max(0,Number(r.value)||0),0);let offset=0;
 const arcs=rows.filter(r=>r.value>0).map(r=>{const size=r.value/total*100,html=`<circle cx="90" cy="90" r="72" pathLength="100" fill="none" stroke="${r.color}" stroke-width="17" stroke-dasharray="${size} ${100-size}" stroke-dashoffset="${-offset}" transform="rotate(-90 90 90)"><title>${E(r.label)}：${r.value}</title></circle>`;offset+=size;return html;}).join('');
 return `<div class="ds-ring ${className}" role="img" aria-label="${E((description||label)+'：'+rows.map(r=>r.label+' '+r.value).join('，'))}"><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="72" fill="none" stroke="#edf1f6" stroke-width="17"/>${arcs}</svg><div><strong>${E(value??total)}</strong><span>${E(label||'总数')}</span></div></div>`;
};
D.legend=(rows,action)=>`<div class="ds-legend">${rows.map(r=>{const content=`<i style="background:${r.color}"></i><span>${E(r.label)}</span><strong>${r.value}</strong>`;return action?`<button type="button" onclick="${action(r)}">${content}</button>`:`<div>${content}</div>`;}).join('')}</div>`;
D.facts=rows=>`<dl class="ds-facts">${rows.map(([label,value])=>`<div><dt>${E(label)}</dt><dd>${E(value)}</dd></div>`).join('')}</dl>`;
D.progress=function(done,total,state='running'){const pct=total?Math.max(0,Math.min(100,Math.round(done/total*100))):0,tone=D.states.find(s=>s[0]===state)?.[2]||D.colors.blue;return `<span class="ds-progress is-${A.escape(state)}" style="--progress-color:${tone}" role="progressbar" aria-label="已处理 ${done} / ${total}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><span><i style="width:${pct}%"></i></span><b>${done} / ${total}</b></span>`;};
D.table=function(columns,rows,empty='暂无匹配记录',className=''){
 return `<div class="table-wrap ds-table-wrap"><table class="ds-table ${className}"><thead><tr>${columns.map(c=>`<th scope="col" class="${c.number?'ds-number':''}">${E(c.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${columns.map(c=>`<td class="${c.number?'ds-number':''} ${c.className||''}">${c.cell(r)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${columns.length}" class="empty">${E(empty)}</td></tr>`}</tbody></table></div>`;
};
})();
};

// ─── platform-notifications ────────────────────────────────────────────────
AppParts['core/platform-notifications'] = function () {
/* Notifications reflect persisted task lifecycles and triggered risk events. */
(function(){
'use strict';
const A=window.App,E=A.escape,I=A.icon,rows=v=>Array.isArray(v)?v:[];
const N=A.platformNotifications={filter:'all',opened:false,signature:''};
const stamp=value=>{const parsed=typeof value==='number'?(value<1e12?value*1000:value):Date.parse(value||'');return Number.isFinite(parsed)?parsed:0;};
const time=value=>{const at=stamp(value);return at?new Date(at).toLocaleString('sv-SE').slice(0,16):'时间未记录';};
N.rows=function(){
 const messages=[];
 for(const [source,tasks] of [['attack',A.data.attack?.tasks],['scan',A.data.scanProduct?.tasks]]){
  for(const t of rows(tasks).filter(t=>!t.deletedAt)){
   const base={source,targetId:t.id,name:t.name||t.id,taskType:source==='attack'?'攻防演练':A.scanProduct?.typeName(t.type)||'漏洞扫描'};
   const started=t.startedAt||t.started||t.createdAt||t.created;
   if(started&&['running','done','error','failed','stopped','completed'].includes(t.status))messages.push({...base,id:source+':'+t.id+':started',kind:'task',title:'任务已开启',state:'started',icon:'play',at:started});
   const state=['done','completed'].includes(t.status)?'done':['error','failed'].includes(t.status)?'error':t.status==='stopped'?'stopped':null;
   if(state){const at=t.finishedAt||t.finished||t.completedAt||rows(t.stageHistory).at(-1)?.time||t.createdAt||t.created;messages.push({...base,id:source+':'+t.id+':'+state,kind:'task',title:state==='done'?'任务已完成':state==='error'?'任务执行异常':'任务已终止',state,icon:state==='done'?'check':state==='error'?'alert':'clock',at});}
  }
 }
 for(const event of rows(A.data.platformRisk?.events).filter(e=>!e.deletedAt))messages.push({id:'risk:'+event.id,kind:'risk',source:'risk',targetId:event.id,title:'风险已触发',name:event.ruleSnapshot?.name||event.ruleName||'风险告警',assetName:event.assetName||'',state:'risk',icon:'bell',at:event.createdAt||event.lastTriggeredAt});
 return messages.sort((a,b)=>stamp(b.at)-stamp(a.at)||(a.state==='started'?1:b.state==='started'?-1:a.id.localeCompare(b.id)));
};
N.userKey=()=>String(A.session?.user||'安全管理员');
N.readIds=function(){return rows(rows(A.data.platformNotificationReads).find(v=>v.user===N.userKey())?.ids);};
N.unread=function(){const read=new Set(N.readIds());return N.rows().filter(v=>!read.has(v.id)).length;};
N.buttonHTML=function(){const count=N.unread();return `<button id="platform-notification-button" class="platform-icon-button pn-bell" aria-label="消息通知${count?'，'+count+' 条未读':''}" title="消息通知" aria-haspopup="dialog" aria-expanded="${N.opened}" onclick="App.platformNotifications.open()">${I('bell',20)}<span id="platform-notification-count" class="pn-count" ${count?'':'hidden'}>${count>99?'99+':count}</span></button>`;};
N.setRead=function(ids){A.data.platformNotificationReads=rows(A.data.platformNotificationReads);let state=A.data.platformNotificationReads.find(v=>v.user===N.userKey());if(!state){state={user:N.userKey(),ids:[]};A.data.platformNotificationReads.push(state);}state.ids=[...new Set([...rows(state.ids),...ids])];A.save();};
N.html=function(){
 const all=N.rows(),read=new Set(N.readIds()),unread=all.filter(v=>!read.has(v.id)).length,visible=N.filter==='unread'?all.filter(v=>!read.has(v.id)):all;
 return `<div id="platform-notification-panel" class="pn-panel"><div class="pn-toolbar"><div class="pn-tabs" role="group" aria-label="通知筛选"><button class="${N.filter==='all'?'active':''}" onclick="App.platformNotifications.setFilter('all')">全部 <span>${all.length}</span></button><button class="${N.filter==='unread'?'active':''}" onclick="App.platformNotifications.setFilter('unread')">未读 <span>${unread}</span></button></div><button class="link-btn" ${unread?'':'disabled'} onclick="App.platformNotifications.markAllRead()">全部已读</button></div><div class="pn-list">${visible.map(v=>`<button class="pn-item ${read.has(v.id)?'':'unread'}" data-notification="${E(v.id)}" onclick="App.platformNotifications.openItem(this.dataset.notification)"><span class="pn-symbol ${v.state}">${I(v.icon,18)}</span><span class="pn-copy"><span class="pn-title">${E(v.title)}${read.has(v.id)?'':'<i class="pn-unread" aria-label="未读"></i>'}</span><strong>${E(v.name)}</strong><span class="pn-meta">${E(v.kind==='risk'?v.assetName:v.taskType)}<time>${E(time(v.at))}</time></span></span>${I('chevron',14)}</button>`).join('')||`<div class="pn-empty">${I('bell',30)}<p>${N.filter==='unread'?'暂无未读消息':'暂无消息通知'}</p></div>`}</div></div>`;
};
N.open=function(){if(!A.session)return;N.filter='all';A.closeModal();A.drawer('消息通知',N.html());N.opened=true;document.getElementById('drawer')?.querySelector('.drawer-panel')?.classList.add('pn-drawer');N.sync(true);};
N.setFilter=function(value){N.filter=value==='unread'?'unread':'all';N.sync(true);};
N.markAllRead=function(){N.setRead(N.rows().map(v=>v.id));N.sync(true);};
N.openItem=function(id){
 const message=N.rows().find(v=>v.id===id);if(!message){A.toast('这条消息对应的记录已移除');N.sync(true);return false;}
 N.setRead([id]);A.closeDrawer();
 if(message.source==='risk'){A.platformGovernance.showEvents({});A.platformGovernance.eventDetail(message.targetId);}
 else if(message.source==='attack')A.platform.go('evaluation','attack','tasks',message.targetId);
 else {const task=rows(A.data.scanProduct?.tasks).find(t=>t.id===message.targetId);A.platform.go('evaluation','scan',task?.type||'code-scan',message.targetId);}
 return true;
};
N.sync=function(force=false){
 if(!A.session)return;const messages=N.rows(),read=new Set(N.readIds()),count=messages.filter(v=>!read.has(v.id)).length,signature=JSON.stringify([N.userKey(),N.filter,messages.map(v=>[v.id,v.at,v.name]),[...read]]);
 const button=document.getElementById('platform-notification-button'),badge=document.getElementById('platform-notification-count');
 if(button){button.setAttribute('aria-label','消息通知'+(count?'，'+count+' 条未读':''));button.setAttribute('aria-expanded',String(N.opened));}if(badge){badge.textContent=count>99?'99+':String(count);badge.hidden=!count;}
 if(!force&&signature===N.signature)return;N.signature=signature;
 if(N.opened&&document.getElementById('drawer')?.classList.contains('open')){const body=document.getElementById('drawer').querySelector('.modal-body');if(body){const focused=document.activeElement,notification=focused?.dataset?.notification,filter=focused?.closest?.('.pn-tabs')?N.filter:null;body.innerHTML=N.html();if(notification)Array.from(body.querySelectorAll('[data-notification]')).find(el=>el.dataset.notification===notification)?.focus();else if(filter)body.querySelector('.pn-tabs .active')?.focus();}}
};
const save=A.save;A.save=function(){const result=save.apply(A,arguments);N.sync();return result;};
const drawer=A.drawer;A.drawer=function(){N.opened=false;const result=drawer.apply(A,arguments);N.sync();return result;};
const closeDrawer=A.closeDrawer;A.closeDrawer=function(){N.opened=false;const result=closeDrawer.apply(A,arguments);N.sync();return result;};
// The existing application timer also runs outside the risk center. Refreshing here
// creates completed-task alerts before a user has to open their destination page.
const tick=A.attack.tick;A.attack.tick=function(){
 const changed=tick.apply(this,arguments),riskVersion=()=>rows(A.data.platformRisk?.events).map(e=>[e.id,e.lastTriggeredAt,e.count].join(':')).join('|'),before=riskVersion();
 if(!N.refreshing){N.refreshing=true;try{A.platformGovernance?.refresh();}finally{N.refreshing=false;}}
 N.sync();return changed||before!==riskVersion();
};
})();
};

// ─── entry-management ──────────────────────────────────────────────────────
AppParts['core/entry-management'] = function () {
/* One delete action and confirmation contract for user-owned platform resources. */
(function(){
'use strict';
const A=window.App,X=A.attack,V=A.evaluation,S=A.scanProduct,C=A.connections,P=A.policies,B=A.banks,D=A.defensePolicies,CP=A.contentPolicies,R=A.safetyRules,G=A.platformGovernance,E=A.escape;
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString();
const EM=A.entryManagement={};
const remove=(list,id)=>{const at=list.findIndex(v=>v.id===id);if(at>=0)list.splice(at,1);};
const terminal=t=>['done','stopped','error','failed'].includes(t.status);
const busy=t=>!t.deletedAt&&!terminal(t);
const policies=()=>CP.db.filter(p=>!p.archived);
const usesRule=(p,id)=>arr(p.ruleIds).includes(id)||arr(p.customRules).some(r=>arr(r.assetIds).includes(id)||arr(r.groups).some(g=>arr(g.assetIds).includes(id)));
const usesReply=(p,id)=>p.replyTemplateId===id||p.reviewReplyTemplateId===id;
const runtimeTasks=()=>[...arr(X.db.tasks),...arr(S.db?.tasks)];
const definitions={
 'attack-task':{label:'演练任务',list:()=>X.db.tasks,reason:t=>terminal(t)?'':'请先停止任务，再删除任务记录',note:'任务将移至回收记录，配置、攻防记录与报告一并保留。',commit:t=>deleteAttack(t.id,true)},
 'scan-task':{label:'扫描任务',list:()=>S.db?.tasks||[],reason:t=>terminal(t)?'':'请先停止任务，再删除任务记录',note:'任务将移至回收记录，扫描配置和结果继续保留。',commit:t=>scanAction(t.id,'delete',true)},
 models:{label:'模型',list:()=>C.db,protected:m=>A.leanAssets.isManaged(m)||m.systemGuard||m._serviceType,reason:m=>A.modelIntake?.blockers?.(m.id)?.length?'该模型正被未完成任务使用，请先结束相关任务':A.contentSafety.apps.some(a=>A.protectionOps.active(a.id)&&A.protectionOps.policies(a.id).some(p=>p.embeddingModelId===m.id||p.detectorModelId===m.id))?'该模型正被运行中的应用防护使用，请先结束防护轮次':'',note:'应用关联与平台用途将同步移除，历史任务和报告继续保留。',commit:m=>deleteModel(m.id)},
 applications:{label:'应用',list:()=>A.data.aiApplications||[],reason:a=>A.protectionOps.active(a.id)?'该应用正在运行防护，请先结束当前防护轮次':'',note:'应用绑定和资产关联将移除，历史检测、风险事件与报告继续保留。',remove:a=>{
  (A.data.removedApplicationNames||={})[a.id]=a.name;
  if(A.contentSafety.db)A.contentSafety.db.bindings=arr(A.contentSafety.db.bindings).filter(b=>b.appId!==a.id);
  A.data.applicationAssetLinks=arr(A.data.applicationAssetLinks).filter(r=>r.appId!==a.id);
  remove(A.data.aiApplications,a.id);if(A.platform.applicationId===a.id)A.platform.applicationId=null;
 }},
 'attack-policy':{label:'攻击策略',list:()=>P.db,note:'策略将从可选列表移除，历史任务保存的策略版本和评估结果继续保留。',remove:p=>{remove(P.db,p.id);if(P.draft?.id===p.id)P.draft=null;if(A.policyUsability.pendingPolicy?.id===p.id)A.policyUsability.pendingPolicy=null;}},
 bank:{label:'攻击题库',list:()=>B.db,protected:b=>b.builtin===true,note:'策略草稿将移除该题库引用；已发布策略和历史任务保留原有题目快照。',remove:b=>{
  remove(A.data.banks||[],b.id);
  for(const p of P.db)if(p.bankIds?.includes(b.id)){p.bankIds=p.bankIds.filter(id=>id!==b.id);p.hasDraft=true;}
  for(const d of [P.draft,A.policyUsability.pendingPolicy])if(d?.bankIds)d.bankIds=d.bankIds.filter(id=>id!==b.id);
  for(const key of Object.keys(A.data.sceneAnnotations||{})){try{if(JSON.parse(key)[0]===b.id)delete A.data.sceneAnnotations[key];}catch(e){/* Unrelated legacy annotation. */}}
 }},
 template:{label:'自定义攻击模板',list:()=>P.templates,note:'策略草稿将移除该模板；已发布策略与历史任务继续使用各自保存的模板。',remove:t=>{
  const retained=P.db.some(p=>arr(p.revisions).some(r=>arr(r.methods).some(m=>m.id===t.id)))||arr(X.db.tasks).some(task=>arr(task.policySnapshot?.methods).some(m=>m.id===t.id));
  if(retained){A.data.retiredAttackMethodTemplates||=[];if(!A.data.retiredAttackMethodTemplates.some(m=>m.id===t.id))A.data.retiredAttackMethodTemplates.push(copy(t));}
  remove(P.templates,t.id);for(const p of P.db)if(p.methods.some(m=>m.id===t.id)){p.methods=p.methods.filter(m=>m.id!==t.id);p.hasDraft=true;}
  for(const d of [P.draft,A.policyUsability.pendingPolicy])if(d?.methods)d.methods=d.methods.filter(m=>m.id!==t.id);
 }},
 'defense-configuration':{label:'防护策略配置',list:()=>A.defenseConfigurations?.rows()||[],protected:p=>p.builtin===true,reason:p=>A.defenseConfigurations.bound(p.id).length?'该策略配置仍被应用绑定，请先切换应用绑定的策略':'',note:'历史防护轮次、检测与报告保留策略快照。',remove:p=>remove(A.defenseConfigurations.rows(),p.id)},
 'defense-policy':{label:'基础策略',list:()=>CP.db,protected:p=>p.isStandard===true||p.builtin===true||['cs-policy-input','cs-policy-output'].includes(p.id),reason:p=>D.references(p.id).length||(A.defenseConfigurations?.rows()||[]).some(c=>arr(c.basics).some(l=>l.policyId===p.id))?'该基础策略仍被应用或策略配置引用，请先移除引用':'',note:'历史任务和检测记录中的策略快照继续保留。',remove:p=>remove(CP.db,p.id)},
 reply:{label:'代答模板',list:()=>A.data.guardReplyTemplates||[],protected:t=>t.builtin===true||['reply-general','reply-pii','reply-context'].includes(t.id),reason:t=>policies().some(p=>usesReply(p,t.id)||arr(p.revisions).some(r=>usesReply(r,t.id)))||runtimeTasks().filter(busy).some(task=>[task.defense?.inputPolicySnapshot,task.defense?.outputPolicySnapshot].filter(Boolean).some(p=>usesReply(p,t.id)))?'该代答仍被策略或其发布版本引用，请先删除相关自定义策略或更换代答配置':'',note:'删除后，该代答将从策略的可选模板中移除。',remove:t=>remove(A.data.guardReplyTemplates,t.id)},
 'safety-rule':{label:'检测规则',list:()=>R.db,protected:r=>r.builtin===true||['cs-rule-prompt','cs-rule-pii','cs-rule-semantic'].includes(r.id),reason:r=>policies().some(p=>usesRule(p,r.id))||(A.defenseConfigurations?.rows()||[]).some(c=>arr(c.rules).some(l=>l.ruleId===r.id))?'该规则仍被防护策略引用，请先在策略配置中移除引用':'',note:'已发布策略和历史检测记录保留原规则快照。',remove:r=>remove(R.db,r.id)},
 'alert-rule':{label:'触发规则',list:()=>G.db?.rules||[],protected:r=>r.builtin===true||['risk-attack','risk-scan','risk-content'].includes(r.id),note:'删除后不再触发新事件，已产生的风险事件和触发证据继续保留。',remove:r=>remove(G.db.rules,r.id)},
 industry:{label:'行业',list:()=>arr(A.data.bankIndustries).map(name=>({id:name,name})),protected:r=>['安全通用','通用','金融','医疗','供应链'].includes(r.id),reason:r=>arr(A.data.banks).some(b=>B.industryLabel(b.industry)===r.id)?'该行业仍被题库使用，请先修改或删除相关题库':'',note:'该行业将从新建题库的选项中移除。',remove:r=>{A.data.bankIndustries=arr(A.data.bankIndustries).filter(name=>name!==r.id);if(B.draft?.industry===r.id){B.draft.industry='安全通用';B.draft.industryMode='general';}}}
};
for(const kind of ['code','packages','web'])definitions[kind]={label:{code:'代码',packages:'二进制/软件包',web:'Web'}[kind],list:()=>A.data.businessAssets?.[kind]||[],note:'应用关联将同步移除，历史任务、版本快照和报告继续保留。',reason:a=>V.allTasks().some(t=>busy(t)&&A.assessment.objectKey(t)===kind+':'+a.id)?'该资产正被未完成任务使用，请先结束相关任务':'',remove:a=>{
 for(const t of V.allTasks())if(A.assessment.objectKey(t)===kind+':'+a.id&&!t.targetSnapshot)t.targetSnapshot=copy(a);
 A.data.applicationAssetLinks=arr(A.data.applicationAssetLinks).filter(r=>r.assetKey!==kind+':'+a.id);remove(A.data.businessAssets[kind],a.id);
}};
EM.get=(kind,id)=>definitions[kind]?.list().find(v=>v.id===id&&!v.deletedAt);
EM.issue=function(kind,id){const def=definitions[kind],record=EM.get(kind,id);if(!def||!record)return '该条目已不存在';if(def.protected?.(record))return '平台内置条目不可删除';return def.reason?.(record)||'';};
EM.button=function(kind,id){const record=EM.get(kind,id),def=definitions[kind];if(!record||def.protected?.(record))return '';const issue=EM.issue(kind,id),label='删除'+def.label+' '+(record.name||record.model||id),taskBlocked=kind.endsWith('-task')&&!!issue;return `<button type="button" class="entry-delete" data-entry-kind="${E(kind)}" data-entry-id="${E(id)}" ${taskBlocked?'disabled title="运行中不可删除，请先停止任务"':`title="${E(issue||'删除')}"`} aria-label="${E(label)}" onclick="App.entryManagement.request(this.dataset.entryKind,this.dataset.entryId)">${A.icon('trash',16)}</button>`;};
EM.request=function(kind,id){
 const record=EM.get(kind,id),def=definitions[kind],issue=EM.issue(kind,id);if(issue){A.toast(issue);return false;}
 A.modal('删除'+def.label,`<p>确定删除「${E(record.name||record.model||id)}」？</p><p class="hint">${def.note}</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button type="button" class="entry-delete" data-entry-kind="${E(kind)}" data-entry-id="${E(id)}" onclick="App.entryManagement.confirm(this.dataset.entryKind,this.dataset.entryId)" aria-label="删除" title="删除">${A.icon('trash',16)}</button>`,{plain:true});return true;
};
EM.confirm=function(kind,id){
 const def=definitions[kind],record=EM.get(kind,id),issue=EM.issue(kind,id);if(issue){A.closeModal();A.toast(issue);return false;}
 if(def.commit)return def.commit(record);
 def.remove(record);G.audit('entry.delete',id,'删除'+def.label+'：'+(record.name||id),{entryType:kind});
 A.save();A.closeModal();A.closeDrawer();A.render();if(kind==='industry'&&B.draft)B.edit();A.toast(def.label+'已删除');return true;
};

// Keep existing task recycling and credential cleanup as the underlying mutations.
const deleteAttack=V.deleteTask,scanAction=S.action,deleteModel=C.removeConfirm;
V.deleteTask=function(id,confirmed=false){if(confirmed)return deleteAttack.call(V,id,true);EM.request('attack-task',id);return false;};
S.action=function(id,action,confirmed=false){if(action==='delete'&&!confirmed){EM.request('scan-task',id);return false;}return scanAction.apply(S,arguments);};
C.remove=id=>EM.request('models',id);
const appName=A.contentSafety.appName;
A.contentSafety.appName=function(id){return A.contentSafety.app(id)?.name||A.data.removedApplicationNames?.[id]||appName.call(this,id);};
// Retired templates stay resolvable only for frozen revisions and historical retests.
for(const template of arr(A.data.retiredAttackMethodTemplates))P.registerTemplate(template);
const method=P.method;
P.method=function(id){return method.call(P,id)||arr(A.data.retiredAttackMethodTemplates).find(m=>m.id===id);};
const validate=P.validate;
P.validate=function(d,publishing=true){const error=validate.call(P,d,publishing);if(error||!publishing)return error;if(d.methods.some(m=>!P.methods().some(live=>live.id===m.id)))return '所选攻击方法已删除，请重新选择';return '';};
const methodDetail=P.methodDetail;
P.methodDetail=function(id){const draw=A.drawer;A.drawer=function(title,body,footer,options){return draw.call(A,title,body,(footer||'')+EM.button('template',id),options);};try{return methodDetail.apply(P,arguments);}finally{A.drawer=draw;}};
const bankOpen=B.open;
B.open=function(id){const draw=A.drawer;A.drawer=function(title,body,footer,options){return draw.call(A,title,body,(footer||'')+EM.button('bank',id),options);};try{return bankOpen.apply(B,arguments);}finally{A.drawer=draw;}};
})();
};

// ─── platform-presentation-copy ────────────────────────────────────────────
AppParts['core/platform-presentation-copy'] = function () {
/* Remove legacy sample badges from product surfaces; retain data provenance in storage/exports. */
(function(){
'use strict';
const A=window.App;
const clean=html=>typeof html!=='string'?html:html
 .replace(/<span class="lo-demo-label">[\s\S]*?<\/span>/g,'')
 .replace(/<small class="lo-origin">演示记录<\/small>/g,'')
 .replace(/<div class="lp-example-note">[\s\S]*?<\/div>/g,'')
 .replace(/演示输入：|演示输出：/g,'')
 .replace(/演示数据|演示记录|示例结果|演示场景/g,'本地记录')
 .replace(/平台演示|预置演示样例/g,'本地流程')
 .replace(/演示运行/g,'暂无检测结论')
 .replace(/演示已开启|开启演示/g,'开启防护')
 .replace(/演示已结束|结束演示|结束防护演示/g,'关闭防护')
 .replace(/演示进行中/g,'运行中')
 .replace(/演示接入/g,'API 接入')
 .replace(/当前为本地演示/g,'等待应用接入')
 .replace(/首次演示交付|已演示交付/g,'首次交付记录')
 .replace(/复核正常 · 演示放行|演示放行/g,'放行记录')
 .replace(/等待执行回执|待执行回执/g,'未确认执行')
 .replace(/报告与结果分析/g,'报告与分析')
 .replace(/源码/g,'代码');
A.presentationCopy={clean};
for(const name of ['modal','drawer']){const previous=A[name];A[name]=function(title,body,footer,options){return previous.call(A,clean(title),clean(body),clean(footer),options);};}
const toast=A.toast;A.toast=function(message){return toast.call(A,clean(message));};
const render=A.modules.attack.render;A.modules.attack.render=function(){return clean(render.apply(this,arguments));};
const detail=A.contentSafety.detailHTML;A.contentSafety.detailHTML=function(){return clean(detail.apply(this,arguments));};
const document=A.evaluation.taskReportDocument;A.evaluation.taskReportDocument=function(){return clean(document.apply(this,arguments));};
const report=A.attack.reportHTML;A.attack.reportHTML=function(){return clean(report.apply(this,arguments));};
})();
};

// ─── structured-lists ──────────────────────────────────────────────────────
AppParts['core/structured-lists'] = function () {
/* Presentation only: one named metric per column, with existing detail/actions. */
(function(){
'use strict';
const A=window.App,K=A.dataDisplay,E=A.escape,V=A.evaluation,Q=A.assessment,X=A.attack,L=A.leanPlatform,R=A.applicationAssets,S=A.contentSafety,G=A.guardrail,O=A.protectionOps,C=A.contentProduct,U=A.unifiedGuard;
const arr=v=>Array.isArray(v)?v:[],stamp=v=>Date.parse(v||'')||0,sort=rows=>rows.slice().sort((a,b)=>stamp(b.created)-stamp(a.created));
const target=t=>t.targetName||t.targetSnapshot?.name||X.targetFor(t)?.name||'历史对象';
const date=v=>A.listConsistency.time(v);
const link=(label,id,action)=>`<button class="link-btn ds-name" data-id="${E(id)}" onclick="${action}(this.dataset.id)">${E(label)}</button>`;
const options=(rows,value)=>rows.map(([id,label])=>`<option value="${E(id)}" ${id===value?'selected':''}>${E(label)}</option>`).join('');
const result=t=>t?Q.taskResult(t):null;
const metricColumns=function(tasks,get=t=>t,fallback='both'){
 const types=new Set(tasks.filter(Boolean).map(V.type)),attack=types.has('attack')||!types.size&&fallback!=='scan',scan=types.has('scan')||!types.size&&fallback!=='attack';
 const number=(label,kind,read)=>({label,number:true,cell:row=>{const t=get(row),r=result(t);return t&&V.type(t)===kind&&r?.value!==null?E(read(t,r)):'—';}});
 return [...(attack?[number('ASR','attack',(t,r)=>r.value.toFixed(1)+'%'),number('攻破次数','attack',(t,r)=>r.breach),number('有效判定','attack',(t,r)=>r.valid)]:[]),...(scan?[number('已确认漏洞','scan',(t,r)=>r.value),number('候选问题','scan',t=>t.candidateCount||0)]:[])];
};
K.resultColumns=metricColumns;
const taskColumns=tasks=>[
 {label:'任务名称',cell:t=>link(t.name,t.id,'App.evaluation.openTask')+`<small>${E(t.bankSnapshot?.name||'—')} · ${t.bankSnapshot?.items?.length||0} 题 · ${new Set((t.units||[]).map(u=>u.method)).size} 种方法</small>`},
 {label:'评估类型',cell:t=>E(Q.taskName(t))},
 {label:'评估对象',cell:t=>E(target(t))},
 ...(tasks.some(t=>t.targetMaterial?.version||t.targetSnapshot?.versionLabel)?[{label:'对象版本',cell:t=>E(t.targetMaterial?.version||t.targetSnapshot?.versionLabel||'—')}]:[]),
 {label:'执行状态',cell:Q.taskStatus},
 {label:'完成进度',cell:t=>{const m=V.metrics(t);return K.progress(m.done,m.total,t.status);}},
 ...metricColumns(tasks),{label:'创建时间',className:'ds-date',cell:t=>date(t.created)}
];
L.resultHTML=t=>`<strong class="lp-result">${E(Q.taskResult(t).main)}</strong>`;
L.statusHTML=Q.taskStatus;
L.taskTable=(tasks,toolbar='')=>`<section class="card lp-table">${toolbar}${K.table(taskColumns(tasks),tasks,'暂无匹配任务')}</section>`;
V.tasksHTML=function(){const f=V.taskFilters;if(f.status==='pending')f.status='all';if(f.status==='error')f.status='stopped';const rows=V.tasks(),targets=[...new Map(X.db.tasks.filter(t=>!t.deletedAt&&V.type(t)==='attack').map(t=>[String(t.model),target(t)])).entries()],columns=[{label:'任务名称',cell:t=>link(t.name,t.id,'App.evaluation.openTask')},{label:'靶标模型',cell:t=>E(target(t))},{label:'执行状态',cell:Q.taskStatus},{label:'完成进度',cell:t=>{const m=V.metrics(t);return K.progress(m.done,m.total,t.status);}},...metricColumns(rows,t=>t,'attack').filter(c=>c.label==='ASR'),{label:'创建时间',className:'ds-date',cell:t=>date(t.created)},{label:'操作',cell:t=>`<div class="ec-row-actions">${t.status==='running'?`<button class="link-btn" data-id="${E(t.id)}" onclick="App.attack.taskAction(this.dataset.id,'stop')">终止</button>`:link('复测',t.id,'App.attack.quickRetest')+A.entryManagement.button('attack-task',t.id)}</div>`}];return `<div class="lp-page">${A.heading('','任务管理','',`<button class="btn" onclick="App.evaluation.recycle()">回收记录</button><button class="btn primary" onclick="App.attack.newTask()">＋ 新建演练任务</button>`)}<section class="card lp-table"><div class="toolbar lp-toolbar"><input class="input" id="ec-tasks-query" type="search" aria-label="搜索演练任务" placeholder="搜索任务或模型" value="${E(f.query)}" onchange="App.evaluation.filter('tasks','query',this.value)"><select aria-label="演练状态" onchange="App.evaluation.filter('tasks','status',this.value)">${options([['all','全部状态'],...K.states.filter(([id])=>!['pending','error'].includes(id)).map(([id,label])=>[id,label])],f.status)}</select><select aria-label="靶标筛选" onchange="App.evaluation.filter('tasks','target',this.value)">${options([['all','全部靶标'],...targets],f.target)}</select><button class="btn small" aria-label="${f.sort==='desc'?'按创建时间升序':'按创建时间降序'}" title="${f.sort==='desc'?'最新创建优先；点击切换升序':'最早创建优先；点击切换降序'}" onclick="App.evaluation.filter('tasks','sort','${f.sort==='desc'?'asc':'desc'}')">创建时间 ${f.sort==='desc'?'↓':'↑'}</button></div>${K.table(columns,rows,'暂无演练任务')}</section></div>`;};
V.reportsHTML=function(){if(['objects','compare'].includes(V.reportTab))return Q.objectResultsHTML();const f=V.reportFilters,rows=V.reports(),columns=[{label:'任务报告',cell:t=>link(t.name,t.id,'App.evaluation.openReport')},{label:'评估类型',cell:t=>E(V.typeName(t))},{label:'评估对象',cell:t=>E(target(t))},{label:'生成时间',className:'ds-date',cell:t=>date(t.reportGeneratedAt||t.completedAt||t.finishedAt||t.finished)}];return `<div class="lp-page">${A.heading('','评估报告','')}<section class="card lp-table"><div class="toolbar lp-toolbar"><select aria-label="报告类型" onchange="App.evaluation.filter('reports','type',this.value)">${options([['all','全部评估类型'],['attack','攻防演练'],['scan','漏洞检测']],f.type)}</select><input type="search" class="input" id="ec-reports-query" aria-label="搜索报告" placeholder="搜索任务或对象" value="${E(f.query)}" onchange="App.evaluation.filter('reports','query',this.value)"></div>${K.table(columns,rows,'暂无已成功完成的评估报告')}</section></div>`;};
Q.objectResultsHTML=function(){
 if(Q.selectedObject?.startsWith('applications:'))return L.applicationResultHTML(Q.selectedObject.slice(13));
 const objects=L.objects();if(Q.selectedObject){const o=objects.find(o=>o.key===Q.selectedObject);if(o)return Q.objectDetailHTML(o);}
 const apps=R.apps().map(a=>({key:'applications:'+a.id,kind:'applications',name:a.name,asset:a,summary:R.summary(a.id)})).filter(a=>a.summary.tasks.length),rows=[...objects,...apps].filter(o=>(Q.objectKind==='all'||o.kind===Q.objectKind)&&(!Q.objectQuery||o.name.toLowerCase().includes(Q.objectQuery.toLowerCase())));
 const columns=[{label:'评估对象',cell:o=>link(o.name,o.key,'App.assessment.openObject')},{label:'对象类型',cell:o=>E(Q.kinds[o.kind])},{label:'评估次数',number:true,cell:o=>(o.tasks||o.summary.tasks).length},...(rows.some(o=>o.summary)?[{label:'有结果的关联资产',number:true,cell:o=>o.summary?o.summary.evaluated:'—'}]:[]),{label:'最近评估',className:'ds-date',cell:o=>date(o.latest?.created||sort(o.summary?.tasks||[])[0]?.created)}];
 return `<div class="lp-page">${A.heading('','结果对比','选择对象，查看历次结果和原始报告。')}<section class="card lp-table"><div class="toolbar lp-toolbar"><input type="search" class="input" aria-label="搜索评估对象" placeholder="搜索已评估对象" value="${E(Q.objectQuery)}" onchange="App.assessment.change('objectQuery',this.value)"><select aria-label="对象类型" onchange="App.assessment.change('objectKind',this.value)">${options([['all','全部对象类型'],...Object.entries(Q.kinds).filter(([k])=>k!=='applications'||apps.length)],Q.objectKind)}</select></div>${K.table(columns,rows,'暂无匹配的评估对象',`object-results-table${rows.some(o=>o.summary)?' has-related-assets':''}`)}</section></div>`;
};
// Model history uses explicit configuration columns for task-to-task comparison.
L.comparisonTaskTable=function(tasks){
 const snapshot=t=>t.runSnapshot?.policySnapshot||t.runSnapshot?.policy||t.policySnapshot||{};
 const columns=[
  {label:'任务名称',cell:t=>link(t.name,t.id,'App.evaluation.openTask')},
  {label:'评估类型',cell:t=>E(Q.taskName(t))},
  {label:'评估对象',cell:t=>E(target(t))},
  {label:'攻击题库',cell:t=>E(snapshot(t).bankSnapshot?.name||t.runSnapshot?.bankSnapshot?.name||t.bankSnapshot?.name||'未记录')},
  {label:'攻击方法',cell:t=>{const methods=snapshot(t).methods||t.engine?.bindings||[];const names=methods.length?methods.map(m=>m.name||m.label||X.methodDependencies?.[m.id||m.method]?.label||m.id||m.method):arr(t.units).map(u=>X.methodDependencies?.[u.method]?.label||u.method);return E([...new Set(names.filter(Boolean))].join('、')||'未记录');}},
  {label:'护栏配置',cell:t=>{const flow=X.guardFlow(t);return flow.input&&flow.output?'输入及输出护栏':flow.input?'输入护栏':flow.output?'输出护栏':'无';}},
  {label:'执行状态',cell:Q.taskStatus},
  {label:'完成进度',cell:t=>{const m=V.metrics(t);return K.progress(m.done,m.total,t.status);}},
  ...metricColumns(tasks,t=>t,'attack').filter(c=>['ASR','攻破次数','有效判定'].includes(c.label)),
  {label:'创建时间',className:'ds-date',cell:t=>date(t.created)}
 ];
 return `<section class="card lp-table object-task-comparison">${K.table(columns,tasks,'暂无评估历史')}</section>`;
};
Q.objectDetailHTML=function(o){const t=o.latest,model=o.kind==='models',r=result(t),stats=model?[['最近 ASR',r?.value==null?'—':r.value.toFixed(1)+'%'],['攻破次数',r?.breach??'—'],['有效判定',r?.valid??'—']]:[['最近确认漏洞',r?.value??'—'],['候选问题',t?.candidateCount??'—']];return `<div class="lp-page">${A.heading('',E(o.name),Q.kinds[o.kind],'<button class="btn" onclick="App.platform.go(\'evaluation\',\'reports\',\'objects\')">返回对象列表</button>')}${A.objectAnalysis.render(o)}<section class="lp-section-heading"><h2>评估历史</h2></section>${model?L.comparisonTaskTable(sort(o.tasks)):L.taskTable(sort(o.tasks))}</div>`;};
L.applicationResultHTML=function(id){const app=R.apps().find(a=>a.id===id);if(!app)return A.heading('','应用不存在','');const s=R.summary(id),columns=[{label:'技术资产',cell:r=>link(r.asset.name,r.key,'App.assessment.openObject')},{label:'类型',cell:r=>E(Q.kinds[r.kind])},...metricColumns(s.rows.map(r=>r.resultTask),r=>r.resultTask),{label:'来源任务',cell:r=>r.resultTask?link(r.resultTask.name,r.resultTask.id,'App.evaluation.openReport'):'暂无有效结果'},{label:'对象版本',cell:r=>E(r.resultTask?.targetMaterial?.version||'—')}];return `<div class="lp-page">${A.heading('',E(app.name),'关联技术资产的独立评估结果。','<button class="btn" onclick="App.platform.go(\'evaluation\',\'reports\',\'objects\')">返回对象列表</button>')}<section class="card lp-table"><div class="lp-panel-head"><h2>关联资产评估结果</h2><span>${s.evaluated} / ${s.rows.length} 项有结果</span></div>${K.table(columns,s.rows,'暂无关联资产结果')}</section></div>`;};
L.historyChart=function(o){const model=o.kind==='models',tasks=sort(o.tasks).reverse().filter(t=>V.reportReady(t)&&result(t).value!==null),max=model?100:Math.max(5,Math.ceil(Math.max(0,...tasks.map(t=>Math.max(result(t).value,t.candidateCount||0)))/5)*5);if(!tasks.length)return '<div class="ev-empty">暂无有效结果</div>';return `<div class="ds-history-scroll"><div class="ds-history ${model?'model':'scan'}" role="group" aria-label="${model?'历次 ASR':'历次确认漏洞与候选数量'}"><div class="ds-history-head"><span>评估时间</span><div class="ds-history-scale"><span>0${model?'%':''}</span><span>${max/2}${model?'%':''}</span><span>${max}${model?'%':''}</span></div><span>${model?'ASR':'已确认'}</span><span>${model?'攻破':'候选'}</span>${model?'<span>有效判定</span>':''}</div>${tasks.map(t=>{const r=result(t);return `<button class="ds-history-row" data-id="${E(t.id)}" title="${E(t.name)}${t.targetMaterial?.version?' · '+E(t.targetMaterial.version):''}" onclick="App.evaluation.openReport(this.dataset.id)"><span class="ds-history-date">${date(t.created)}</span><span class="lp-chart-plot">${model?`<i class="lp-asr-dot" style="left:${Math.max(0,Math.min(100,r.value))}%"></i>`:`<i class="lp-finding-bar" style="width:${r.value/max*100}%"></i><i class="lp-candidate-bar" style="width:${(t.candidateCount||0)/max*100}%"></i>`}</span><strong>${model?r.value.toFixed(1)+'%':r.value}</strong><span>${model?r.breach:t.candidateCount||0}</span>${model?`<span>${r.valid}</span>`:''}</button>`;}).join('')}</div></div>`;};

// Review queues are scoped to an application and preserve the original delivery evidence.
O.reviewScope={appId:'',state:'pending'};
O.reviewCount=id=>S.pendingReviews().filter(v=>S.db.requests.find(r=>r.id===v.requestId)?.appId===id).length;
O.reviewItems=function(){
 const {appId,state}=O.reviewScope,requests=new Map(G.records().map(r=>[r.id,r]));
 return S.db.reviews.filter(v=>{const r=requests.get(v.requestId);return r&&(!appId||r.appId===appId)&&(state==='complete'?v.status==='complete':['pending','reviewing'].includes(v.status)&&S.reviewEligible(v));}).map(v=>({v,r:requests.get(v.requestId)})).reverse();
};
O.openReviews=function(id=''){if(id&&!S.app(id))return;O.reviewScope={appId:id,state:'pending'};O.renderReviews();};
O.filterReviews=function(key,value){if(!Object.hasOwn(O.reviewScope,key))return;O.reviewScope[key]=value;O.renderReviews();};
O.renderReviews=function(){
 const f=O.reviewScope,columns=[{label:'内容摘要',cell:({r})=>`<button class="link-btn ds-excerpt" data-id="${E(r.id)}" title="${E(r.text||r.imageRef||r.id)}" onclick="App.protectionOps.reviewRecord(this.dataset.id)">${E(r.text||r.imageRef||r.id)}</button>`},...(!f.appId?[{label:'应用',cell:({r})=>E(S.appName(r.appId))}]:[]),{label:'机器判定',cell:({r})=>S.recordRiskBadge(r)},{label:'人工结论',cell:({v})=>E(v.status==='complete'?v.conclusion:'待复核')},{label:'操作',cell:({v,r})=>link(v.status==='complete'?'查看记录':'复核',v.status==='complete'?r.id:v.id,v.status==='complete'?'App.protectionOps.reviewRecord':'App.contentSafety.reviewForm')}];
 const body=`<div class="ds-review-workspace" data-review-workspace><div class="toolbar"><select aria-label="复核应用" onchange="App.protectionOps.filterReviews('appId',this.value)">${options([['','全部应用'],...S.apps.map(a=>[a.id,a.name])],f.appId)}</select><div class="tabs"><button class="tab ${f.state==='pending'?'active':''}" onclick="App.protectionOps.filterReviews('state','pending')">待复核</button><button class="tab ${f.state==='complete'?'active':''}" onclick="App.protectionOps.filterReviews('state','complete')">已完成</button></div></div>${K.table(columns,O.reviewItems(),f.state==='complete'?'暂无已完成的复核记录':'当前应用暂无待复核记录')}<p class="hint">人工确认为安全或不安全，并记录判定依据。标注用于后续分析与策略改进，不自动训练模型，也不改变当时的放行或阻断。</p></div>`;
 A.drawer('人工复核与标注',body,'<button class="btn" onclick="App.closeDrawer()">关闭</button>');
};
O.reviewRecord=function(id){const r=S.db.requests.find(r=>r.id===id);if(!r)return;const v=S.db.reviews.find(v=>v.requestId===id);A.modal('复核记录',S.detailHTML(r),'<button class="btn" onclick="App.closeModal()">返回列表</button>'+(v&&v.status!=='complete'?`<button class="btn primary" data-id="${E(v.id)}" onclick="App.contentSafety.reviewForm(this.dataset.id)">人工复核</button>`:''),{wide:true});};
const submitReview=S.submitReview;
S.submitReview=function(){const result=submitReview.apply(S,arguments),drawer=document.getElementById('drawer');if(result&&drawer?.classList.contains('open')&&drawer.innerHTML.includes('data-review-workspace'))O.renderReviews();return result;};
// Application protection shows policy coverage and live status without a mode selector.
const coverage=(p,stage)=>{const v=p&&U.coverage(p).find(v=>v.stage===stage);return v?[v.text?'文本':'',v.image?'图片':''].filter(Boolean).join(' + ')||'未启用':'—';};
const appRows=()=>S.apps.map(a=>{const p=S.binding(a.id)?.defenseConfigurationSnapshot,records=G.records().filter(r=>r.appId===a.id);return {a,p,records,summary:U.summary(records),mode:U.mode(a.id)};});
A.leanOperations.appTable=function(){const columns=[{label:'应用名称',cell:r=>`<button class="link-btn ds-name" data-id="${E(r.a.id)}" onclick="App.platform.go('assets','applications',this.dataset.id)">${E(r.a.name)}</button>`},{label:'防护策略',cell:r=>r.p?link(r.p.name,r.p.id,'App.defenseConfigurations.detail'):'未绑定'},{label:'输入检测',cell:r=>coverage(r.p,'input')},{label:'输出检测',cell:r=>coverage(r.p,'output')},{label:'防护状态',cell:r=>E(G.connection(r.a.id))},{label:'累计检测',number:true,cell:r=>r.summary.n},{label:'已阻断',number:true,cell:r=>r.summary.blocked},{label:'待复核',number:true,cell:r=>`<button class="ds-count-link" data-id="${E(r.a.id)}" aria-label="${E(r.a.name)}：${O.reviewCount(r.a.id)} 条待复核，查看人工复核与标注" onclick="App.protectionOps.openReviews(this.dataset.id)">${O.reviewCount(r.a.id)}</button>`},{label:'操作',cell:r=>`<div class="lo-actions">${link('配置防护',r.a.id,'App.protectionOps.config')}<button class="link-btn" data-id="${E(r.a.id)}" ${r.records.length?'':'disabled'} onclick="App.unifiedGuard.reportForm(this.dataset.id)">生成报告</button>${A.entryManagement.button('applications',r.a.id)}</div>`}];return `<section class="card lo-apps pr-apps"><div class="card-head"><h2 class="card-title">应用防护</h2></div>${K.table(columns,appRows(),'接入应用并绑定防护策略')}</section>`;};
O.appTable=A.leanOperations.appTable;
C.overview=function(){G.appFilter='';const records=G.records(),s=U.summary(records),checked=records.filter(r=>r.detectionStatus!=='skipped'),rows=[['Safe','安全',K.colors.teal],['Controversial','待确认',K.colors.amber],['Unsafe','不安全',K.colors.red],['Unknown','检测异常',K.colors.gray]].map(([id,label,color])=>({label,color,value:checked.filter(r=>(r.detectionComplete===false?'Unknown':r.safety||r.original?.safety||'Unknown')===id).length})),modes=Object.entries(U.modes).map(([id,label])=>[label,S.apps.filter(a=>U.mode(a.id)===id).length+' 个']);return A.heading('','防护总览','统一接口接入应用，按策略检测文本与图片；由应用执行处置。','<button class="btn primary" onclick="App.guardrail.addApplication()">＋ 接入应用</button>')+`<section class="card ds-protection-summary"><div class="ds-protection-chart"><div class="ds-section-title"><h2>检测结果</h2><button class="link-btn" onclick="App.protectionOps.openRecords()">防护记录 →</button></div><div class="ds-chart-pair">${K.ring(rows,{label:'累计检测',value:s.n})}${K.legend(rows)}</div></div><div class="ds-protection-facts"><div class="ds-section-title"><h2>执行与接入</h2></div>${K.facts([['已执行阻断',s.blocked],['已执行放行',s.allowed],['未确认执行',s.unconfirmed],['未检测',s.skipped]])}<div class="ds-mode-counts">${modes.map(([label,n])=>`<span>${label}<b>${n}</b></span>`).join('')}</div><p class="ds-caption">未检测不计入安全结论；处置数据以应用执行回执为准。</p></div></section>`+A.leanOperations.appTable();};
C.applications=C.overview;S.overview=C.overview;S.applications=C.overview;
C.reports=function(){const rows=S.db.protectionReports.filter(r=>!G.reportApp||r.appId===G.reportApp).slice().sort((a,b)=>stamp(b.generatedAt)-stamp(a.generatedAt)),columns=[{label:'报告编号',cell:r=>link(r.id,r.id,'App.protectionOps.reportDetail')},{label:'应用名称',cell:r=>E(r.appName)},{label:'范围开始',className:'ds-date',cell:r=>S.time(r.from)},{label:'范围结束',className:'ds-date',cell:r=>S.time(r.to)},{label:'检测次数',number:true,cell:r=>U.summary(arr(r.requests)).n},{label:'已阻断',number:true,cell:r=>U.summary(arr(r.requests)).blocked},{label:'生成时间',className:'ds-date',cell:r=>S.time(r.generatedAt)},{label:'操作',cell:r=>link('导出报告',r.id,'App.guardrail.exportReport')}];return A.heading('','防护报告','按已有记录生成报告快照，防护可持续运行。','<button class="btn primary" onclick="App.unifiedGuard.reportForm()">＋ 生成报告</button>')+`<section class="card"><div class="toolbar"><select aria-label="报告应用" onchange="App.guardrail.reportApp=this.value;App.render()">${options([['','全部应用'],...S.apps.map(a=>[a.id,a.name])],G.reportApp)}</select></div>${K.table(columns,rows,'暂无报告，可按已有防护记录生成')}</section>`;};
S.requestTable=function(rows){const content=r=>String(r.text||r.imageRef||arr(r.images).map(v=>v.url).join('；')||'—').replace(/演示输入：|演示输出：/g,''),actual=r=>r.enforcementAck?({allow:'放行',log:'放行',block:'阻断'}[r.effectiveAction||r.action]||'未确认执行'):'未确认执行',columns=[{label:'请求 ID',cell:r=>link(r.id,r.id,'App.contentSafety.detail')},{label:'内容',className:'ds-excerpt-cell',cell:r=>`<span class="ds-excerpt" title="${E(content(r))}">${E(content(r))}</span>`},{label:'应用',cell:r=>E(S.appName(r.appId))},{label:'阶段',cell:r=>r.stage==='input'?'输入':'输出'},{label:'内容类型',cell:r=>r.contentType==='mixed'?'文本 + '+arr(r.images).length+' 张图片':r.contentType==='image'?'图片':'文本'},{label:'检测判定',cell:r=>S.riskBadge(r.detectionStatus==='skipped'?'Skipped':r.detectionComplete===false?'Unknown':r.safety||r.original?.safety||'Unknown')},{label:'实际处置',cell:r=>A.badge(actual(r),r.enforcementAck&&(r.effectiveAction||r.action)==='block'?'red':'gray')},{label:'人工标签',cell:r=>{const v=S.db.reviews.find(v=>v.requestId===r.id);return E(v?.status==='complete'?v.conclusion:v?'待复核':'—');}},{label:'检测时间',className:'ds-date',cell:r=>S.time(r.createdAt)}];return K.table(columns,rows,'暂无符合条件的防护记录','po-record-table');};
const F=A.defenseConfigurations,N=A.policyKnowledge;
F.table=function(){const rows=F.rows().filter(p=>!F.query||p.name.toLowerCase().includes(F.query.toLowerCase())).map(p=>({p,v:F.latest(p.id),updates:N.updates(p.id),bindings:F.bound(p.id)})),columns=[{label:'策略名称',cell:r=>link(r.p.name,r.p.id,'App.defenseConfigurations.detail')},{label:'检测位置',cell:r=>F.positions(r.v)},{label:'基础策略',number:true,cell:r=>r.v.basics.length},{label:'规则',number:true,cell:r=>r.v.rules.length},{label:'安全回复',cell:r=>E(r.v.replyTemplateSnapshot?.name||'策略安全提示')},{label:'资源同步',cell:r=>r.updates.length?'<span class="pk-pending">待同步资源</span>':'已同步'},{label:'引用应用',number:true,cell:r=>r.bindings.length},...(rows.some(r=>r.bindings.some(b=>b.defenseConfigurationVersion!==r.v.version))?[{label:'待更新绑定',number:true,cell:r=>r.bindings.filter(b=>b.defenseConfigurationVersion!==r.v.version).length}]:[]),{label:'操作',cell:r=>`<div class="lo-actions">${link('修改配置',r.p.id,'App.defenseConfigurations.edit')}${link('引用应用',r.p.id,'App.policyKnowledge.applications')}${A.entryManagement.button('defense-configuration',r.p.id)}</div>`}];return `<section class="card"><div class="toolbar"><input type="search" aria-label="搜索策略配置" placeholder="搜索策略名称" value="${E(F.query)}" onchange="App.defenseConfigurations.query=this.value;App.render()"><button class="link-btn" onclick="App.policyKnowledge.open()">共用知识库 →</button></div>${K.table(columns,rows,'暂无策略配置')}</section>`;};
})();
};

// ─── interaction-stability ─────────────────────────────────────────────────
AppParts['core/interaction-stability'] = function () {
/* Keep unchanged DOM nodes alive during filtering and background updates. */
(function(){
'use strict';
const A=window.App;
const identity=n=>n.nodeType===1?(n.id?'id:'+n.id:n.getAttribute('data-id')?'data:'+n.tagName+':'+n.getAttribute('data-id')+':'+(n.getAttribute('onclick')||''):null):null;
const compatible=(a,b)=>a&&b&&a.nodeType===b.nodeType&&(a.nodeType!==1||a.tagName===b.tagName)&&identity(a)===identity(b);
function patch(a,b){
 if(a.nodeType!==1){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;return;}
 if(a.isEqualNode(b))return;
 const active=a===document.activeElement,details=a.tagName==='DETAILS',opened=details&&a.open;
 const oldValue=a.value,selection=active&&typeof a.selectionStart==='number'?[a.selectionStart,a.selectionEnd]:null;
 for(const at of Array.from(a.attributes))if(!b.hasAttribute(at.name)&&!(details&&at.name==='open'))a.removeAttribute(at.name);
 for(const at of Array.from(b.attributes))if(a.getAttribute(at.name)!==at.value&&!(details&&at.name==='open'))a.setAttribute(at.name,at.value);
 if(a.tagName!=='IFRAME'&&a.tagName!=='TEXTAREA')children(a,b);
 if(a.tagName==='INPUT'){
  if(!active&&a.type!=='file'&&a.value!==b.value)a.value=b.value;
  if(a.type==='checkbox'||a.type==='radio')a.checked=b.checked;
 }else if(a.tagName==='TEXTAREA'){
  if(a.defaultValue!==b.defaultValue)a.defaultValue=b.defaultValue;
  a.value=active?oldValue:b.value;
 }else if(a.tagName==='SELECT')a.value=b.value;
 if(details)a.open=opened;
 if(selection)try{a.setSelectionRange(...selection);}catch(e){/* Not every input supports a selection. */}
}
function children(a,b){
 let cursor=a.firstChild;
 for(const next of Array.from(b.childNodes)){
  let found=cursor;
  if(!compatible(found,next)){
   const key=identity(next);
   found=key?Array.from(a.childNodes).find(n=>identity(n)===key&&compatible(n,next)):null;
   if(found)a.insertBefore(found,cursor);
   else{a.insertBefore(next.cloneNode(true),cursor);continue;}
  }
  patch(found,next);cursor=found.nextSibling;
 }
 while(cursor){const next=cursor.nextSibling;a.removeChild(cursor);cursor=next;}
}
A.updateHTML=function(host,html){
 if(!host)return;
 // The minimal command-line test DOM has no parser; browsers use incremental updates.
 if(typeof host.cloneNode!=='function'||typeof document.createRange!=='function'){host.innerHTML=html;return;}
 const range=document.createRange();range.selectNodeContents(host);
 const fragment=range.createContextualFragment(String(html));children(host,fragment);
};
const modal=A.modal,drawer=A.drawer;
A.modal=function(title,body,footer,opts){const el=document.getElementById('modal'),open=el.classList.contains('open');if(!open)return modal.apply(A,arguments);const y=el.querySelector('.modal-body')?.scrollTop||0;const template=document.createElement('div');template.innerHTML=`<section class="modal-panel ${opts?.wide?'wide':''} ${opts?.plain?'plain':''}" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button type="button" class="close-btn" aria-label="关闭弹窗" onclick="App.closeModal()">${A.icon('close',20)}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</section>`;A.updateHTML(el,template.innerHTML);const panel=el.querySelector('.modal-body');if(panel)panel.scrollTop=y;};
A.drawer=function(title,body,footer){const el=document.getElementById('drawer');if(!el.classList.contains('open'))return drawer.apply(A,arguments);const y=el.querySelector('.modal-body')?.scrollTop||0;A.updateHTML(el,`<section class="modal-panel drawer-panel" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button type="button" class="close-btn" aria-label="关闭详情" onclick="App.closeDrawer()">${A.icon('close',20)}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</section>`);const panel=el.querySelector('.modal-body');if(panel)panel.scrollTop=y;};
// Plain buttons inside configuration forms must never submit the document.
document.addEventListener('click',event=>{const button=event.target.closest?.('button');if(button&&!button.hasAttribute('type')&&button.closest('form'))button.type='button';},true);
})();
};

// ─── list-presentation ─────────────────────────────────────────────────────
AppParts['core/list-presentation'] = function () {
/* Shared by the platform and the embedded scan application. */
(function(){
'use strict';
const P=window.ListPresentation={};
P.time=function(value){
 if(value===undefined||value===null||value==='')return '未记录';
 let input=value;
 // Legacy dates without an offset were entered as Beijing wall-clock time.
 if(typeof input==='string'&&/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?$/.test(input))input=input.length===10?input+'T00:00:00+08:00':input.replace(' ','T')+'+08:00';
 const date=new Date(input);if(!Number.isFinite(date.getTime()))return '未记录';
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const p=Object.fromEntries(parts.map(v=>[v.type,v.value]));return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
};
P.html=function(html){
 if(typeof html!=='string')return html;
 return html.replace(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/g,(all,tag,attrs,body)=>{
  if(!/class="[^"]*\b(?:btn|link-btn|entry-delete|mi-icon-action|model-action)\b/.test(attrs)||/data-np-close|modal-close|drawer-close/.test(attrs))return all;
  const clean=body.replace(/<svg\b[\s\S]*?<\/svg>/g,'');
  let visible=clean.replace(/<[^>]+>/g,'').trim();
  if(!visible){visible=['title','aria-label'].map(key=>attrs.match(new RegExp(key+'="([^"]+)"'))?.[1]?.match(/^(确认删除|删除|编辑|测试连接|测试|刷新|导出|复制|返回)/)?.[1]).find(Boolean);if(!visible&&/\bentry-delete\b/.test(attrs))visible='删除';if(!visible)return all;return `<${tag}${attrs}>${visible}</${tag}>`;}
  return `<${tag}${attrs}>${clean.replace(/^\s*[＋+]\s*/,'').replace(/\s*→\s*$/,'')}</${tag}>`;
 }).replace(/<th([^>]*)>(创建时间|生成时间|更新时间|任务创建时间|提交时间|检测时间)<\/th>/g,(all,attrs,label)=>/\btitle=/.test(attrs)?all:`<th${attrs} title="北京时间（UTC+8）">${label}</th>`);
};
})();
};

// ─── list-consistency ──────────────────────────────────────────────────────
AppParts['core/list-consistency'] = function () {
/* Creation metadata and shared list presentation; existing actions remain authoritative. */
(function(){
'use strict';
const A=window.App,P=window.ListPresentation,E=A.escape,arr=v=>Array.isArray(v)?v:[];
const T=A.listConsistency={time:P.time,created:r=>r?.createdAt||r?.created||r?.created_at,generated:r=>r?.reportGeneratedAt||r?.generatedAt||r?.completedAt||r?.finishedAt||r?.finished};
T.cell=value=>`<td class="lc-time" title="北京时间（UTC+8）">${P.time(value)}</td>`;
// Track persistent resource identities, not render time. Existing undated records stay undated.
let ready=false;const known=new Map();
function collections(){const d=A.data;return {
 models:A.connections.db,applications:d.aiApplications,banks:d.banks,policies:d.attackPolicies,
 basics:d.contentSafetyPolicies,rules:d.safetyRules,configurations:d.defenseConfigurations,
 members:d.enterpriseManagement?.members,templates:d.attackMethodTemplates,
 tasks:d.attack?.tasks,scans:A.scanProduct.db?.tasks,
 ...Object.fromEntries(['code','packages','web'].map(k=>['assets-'+k,d.businessAssets?.[k]]))
 };}
T.recordTimes=function(baseline=false){
 for(const [kind,rows] of Object.entries(collections()))for(const r of arr(rows)){
  if(!r?.id)continue;const key=kind+':'+r.id,previous=known.get(key);
  if(!baseline&&ready){
   if(!known.has(key)&&!T.created(r))r.createdAt=new Date().toISOString();
   else if(previous&&!T.created(r))r.createdAt=previous;
  }
  known.set(key,T.created(r)||null);
 }
};
const encode=A.storageCodec.encode;
A.storageCodec.encode=function(data){if(data===A.data&&ready)T.recordTimes();return encode.apply(this,arguments);};
const copyPolicy=A.policies.copy;A.policies.copy=function(){const result=copyPolicy.apply(this,arguments);if(A.policies.draft&&!A.policies.draft.id)for(const key of ['createdAt','created','created_at','updatedAt'])delete A.policies.draft[key];return result;};
const start=A.start;A.start=function(){const result=start.apply(this,arguments);T.recordTimes(true);ready=true;return result;};
// Add one column before actions to explicitly registered resource tables.
T.tableTimes=function(html,rows,label='创建时间',get=T.created){
 return html.replace(/<table\b[^>]*>[\s\S]*?<\/table>/g,table=>{
  if(!/<th[^>]*>操作<\/th>/.test(table)||table.includes('data-lc-time'))return table;
  const head=table.match(/<thead>[\s\S]*?<\/thead>/)?.[0]||'';
  if(head.includes('>'+label+'</th>'))return table;
  table=table.replace(/<th([^>]*)>操作<\/th>/,`<th class="lc-time" data-lc-time title="北京时间（UTC+8）">${label}</th><th$1>操作</th>`);
  return table.replace(/(<tbody[^>]*>)([\s\S]*?)(<\/tbody>)/,(all,open,body,close)=>open+T.rowTimes(body,rows,get)+close);
 });
};
T.rowTimes=function(body,rows,get=T.created){return body.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/g,row=>{
 if(/colspan="\d+"/.test(row))return row.replace(/colspan="(\d+)"/,(_,n)=>`colspan="${Number(n)+1}"`);
 const first=row.match(/<td\b[^>]*>[\s\S]*?<\/td>/)?.[0]||'',id=(first.match(/data-id="([^"]+)"/)||row.match(/data-id="([^"]+)"/))?.[1];
 const record=arr(rows).find(r=>id?E(r.id)===id:first.includes("('"+E(r.id)+"')")||first.includes('>'+E(r.name)+'</'));
 return row.replace(/(<td\b[^>]*>(?:(?!<td\b)[\s\S])*?<\/td>)\s*<\/tr>$/,T.cell(get(record))+'$1</tr>');
 });};
function wrap(object,name,rows,label,get){const original=object?.[name];if(typeof original!=='function')return;object[name]=function(){return P.html(T.tableTimes(original.apply(this,arguments),typeof rows==='function'?rows.apply(this,arguments):rows,label,get));};}
wrap(A.modelRoles,'render',()=>A.connections.db);
wrap(A.leanAssets,'list',kind=>A.leanAssets.rows(kind));
wrap(A.defenseConfigurations,'table',()=>A.defenseConfigurations.rows());
wrap(A.defenseConfigurations,'basicTable',()=>A.defensePolicies.policyRows());
wrap(A.safetyRules,'render',()=>A.safetyRules.db);
wrap(A.protectionMvp,'knowledge',()=>A.safetyRules.db);
wrap(A.policies,'renderPolicies',()=>A.policies.db);
wrap(A.policyManagement,'identityHTML',()=>A.data.enterpriseManagement?.members);
wrap(A.leanOperations,'appTable',()=>A.contentSafety.apps);
A.protectionOps.appTable=A.leanOperations.appTable;
wrap(A.octoberRefinement,'results',()=>[...A.attack.db.tasks,...A.scanProduct.tasks()]);
// Catalog search updates only tbody; keep its header and row renderer in sync.
const catalog=A.banks.catalogTable;A.banks.catalogTable=function(){return P.html(T.rowTimes(catalog.apply(this,arguments),A.banks.catalogRows()));};
for(const [object,name] of [[A.banks,'render'],[A.policies,'renderContent']]){const old=object[name];object[name]=function(){return P.html(old.apply(this,arguments).replace('<th>操作</th>','<th class="lc-time" title="北京时间（UTC+8）">创建时间</th><th>操作</th>'));};}
const profile=A.leanAssets.profile;A.leanAssets.profile=function(kind,record){return profile.apply(this,arguments).replace('<dl class="la-facts">',`<dl class="la-facts"><div><dt>创建时间（北京时间）</dt><dd>${P.time(T.created(record))}</dd></div>`);};
const render=A.modules.attack.render;A.modules.attack.render=function(){return P.html(render.apply(this,arguments));};
for(const name of ['modal','drawer']){const old=A[name];A[name]=function(title,body,footer,...rest){return old.call(this,title,P.html(body),P.html(footer),...rest);};}
const update=A.updateHTML;if(update)A.updateHTML=function(id,html,...rest){return update.call(this,id,P.html(html),...rest);};
const deleteButton=A.entryManagement.button;A.entryManagement.button=function(){return P.html(deleteButton.apply(this,arguments));};
A.contentSafety.time=P.time;
})();
};

// ─── finish ────────────────────────────────────────────────────────────────
AppParts['core/finish'] = function () {
// Restore the default dataset through the normal initialization path.
(function(){
'use strict';
const A=window.App,key='zhian-standalone-attack';
A.resetDemo=function(){
 A.modal('恢复初始数据','<p>将清除手动新增和修改的任务、模型、应用、资产、题库、策略、记录及报告，恢复平台默认数据。</p><p class="hint">此操作无法撤销。</p>','<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" onclick="App.confirmResetDemo()">确认恢复</button>',{plain:true});
};
const reloadDefaults=function(){
 if(A.initialDataResetting)return;
 A.initialDataResetting=true;
 // Pending requests and timers must not write the old dataset after removal.
 A.save=function(){};
 A.connections?.clearSecrets();
 history.replaceState(null,'','#workspace/home');
 location.reload();
};
A.confirmResetDemo=function(){
 try{localStorage.removeItem(key);}catch(e){A.toast('无法清理本地数据，请检查浏览器存储权限后重试');return false;}
 reloadDefaults();return true;
};
window.addEventListener('storage',event=>{if(event.key===key&&event.newValue===null&&event.oldValue!==null)reloadDefaults();});
})();
};

// ─── 启动 ──────────────────────────────────────────────────────────────────
// demo 没有登录：以固定的本地演示账号直接进入平台，账号弹窗只做展示、不提供退出。
// 这一段放在 order 的最后，此时其余代码段都已登记完毕，因此在这里调用 A.start()。
AppParts['core/startup'] = function () {
(function(){
'use strict';
const A=App;
A.page='attack';
A.session={user:'安全管理员',role:'安全管理员',mode:'local-demo'};
A.navigate=page=>{if(A.platform)return A.platform.navigate(page);};
A.account=function(){
 if(!A.session)return;A.closeDrawer();
 A.modal('账号信息',`<div class="platform-account-profile"><span class="avatar">${A.icon('user',22)}</span><div><h3>${A.escape(A.session.user)}</h3><p>本地账号</p></div></div><dl class="platform-account-info"><div><dt>账号角色</dt><dd>安全管理员</dd></div><div><dt>登录方式</dt><dd>本地演示</dd></div></dl>`,`<button class="btn" onclick="App.closeModal()">关闭</button>`);
};
// A.start() 内部会调用 showApp() 完成首屏：按地址栏路由恢复页面，再画外壳与内容。
A.showApp=function(){
 A.page='attack';
 if(A.platform)A.platform.restoreRoute();else history.replaceState(null,'','#attack');
 A.render();
};
A.start();
})();
};
