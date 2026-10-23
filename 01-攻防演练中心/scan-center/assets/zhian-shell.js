(function(){
function send(type){if(window.parent!==window){window.parent.postMessage({type},location.protocol==='file:'?'*':location.origin);return true;}return false;}
window.zhianHome=()=>{if(!send('zhian-home'))location.href='../index.html';};
window.zhianLogout=()=>{if(!send('zhian-logout')){try{sessionStorage.removeItem('shoujie-session')}catch(e){}location.href='../index.html';}};
window.zhianToggle=()=>{document.body.classList.toggle('zhian-collapsed');sync();};
function sync(){const b=document.querySelector('.zhian-collapse');if(b){const collapsed=document.body.classList.contains('zhian-collapsed');b.setAttribute('aria-label',collapsed?'展开侧边栏':'收起侧边栏');b.setAttribute('aria-expanded',String(!collapsed));}}
new MutationObserver(sync).observe(document.getElementById('root'),{childList:true});sync();
})();

function hideLogout(){document.querySelectorAll('button,a').forEach(el=>{if(el.textContent.trim()==='退出登录')el.style.display='none';});}new MutationObserver(hideLogout).observe(document.getElementById('root'),{childList:true,subtree:true});hideLogout();
