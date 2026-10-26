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
