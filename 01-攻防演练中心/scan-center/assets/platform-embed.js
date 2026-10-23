(function(){
'use strict';
function sync(){parent.postMessage({type:'scan-center-route',route:location.hash.slice(1)||'/'},'*');}
window.addEventListener('hashchange',sync);
window.addEventListener('message',function(e){if(e.source!==parent||e.data?.type!=='platform-scan-navigate')return;const r=String(e.data.route||'/');if(/^\/(?:$|targets(?:\/|$)|scan\/(?:code|app|web|new)$|models$|projects\/)/.test(r))location.hash=r;});
sync();
})();
