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
