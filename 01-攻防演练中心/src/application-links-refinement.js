/* Application-owned technical asset links, with direct navigation to completed reports. */
(function(){
'use strict';
const A=window.App,R=A.applicationAssets,Q=A.assessment,V=A.evaluation,E=A.escape;
if(!R||!Q||!V)return;
const arr=value=>Array.isArray(value)?value:[];
const kinds={models:'模型',code:'代码',packages:'二进制/软件包',web:'Web'};
const stamp=value=>{const time=new Date(value||0).getTime();return Number.isFinite(time)?time:0;};
const taskTime=t=>stamp(t.finishedAt||t.completedAt||t.finished||t.created);
const managed=m=>!!(A.managedGuards?.isManaged?.(m)||m.managed||m.platformManaged||m.deploymentManaged||m.systemGuard||m._serviceType);
R.kinds=kinds;
R.assets=function(){
 return Object.keys(kinds).flatMap(kind=>{
  const rows=A.leanAssets?.rows?A.leanAssets.rows(kind):Q.assetRows(kind);
  return arr(rows).filter(a=>kind!=='models'||((a.kind||'model')==='model'&&!managed(a))).map(asset=>({key:kind+':'+asset.id,kind,asset}));
 });
};
R.latestReport=function(key){
 if(!R.assets().some(a=>a.key===key))return null;
 return V.allTasks().filter(t=>!t.deletedAt&&t.status==='done'&&Q.objectKey(t)===key&&V.reportReady(t)&&Q.taskResult(t).value!==null).sort((a,b)=>taskTime(b)-taskTime(a)||stamp(b.created)-stamp(a.created))[0]||null;
};
R.openLinkedReport=function(key){
 const task=R.latestReport(key);
 if(!task){A.toast('该资产暂无已完成的评估结果');return false;}
 A.closeDrawer();A.closeModal();return V.openReport(task.id);
};
R.linkedAssetsHTML=function(appId,options={}){
 const assets=R.assetsFor(appId);
 if(!assets.length)return '<span class="muted ar-no-links">未关联资产</span>';
 const rows=assets.map(r=>({...r,task:R.latestReport(r.key)}));
 const chip=r=>`<button class="ar-linked-chip${r.task?'':' unavailable'}" data-key="${E(r.key)}" ${r.task?'onclick="App.applicationAssets.openLinkedReport(this.dataset.key)"':'disabled'} title="${E(r.task?'查看最新评估报告':'暂无已完成的评估结果')}" aria-label="${E(r.asset.name+(r.task?'，查看最新评估报告':'，暂无评估结果'))}">${E(r.asset.name)}</button>`;
 if(options.compact)return `<div class="ar-linked-tags">${rows.map(chip).join('')}</div>`;
 return `<div class="ar-linked-groups">${Object.entries(kinds).map(([kind,label])=>{const items=rows.filter(r=>r.kind===kind);return items.length?`<div class="ar-linked-group"><h4>${label}</h4><div>${items.map(r=>`<div class="ar-linked-result">${chip(r)}<span>${E(r.task?Q.taskResult(r.task).main:'暂无评估结果')}</span></div>`).join('')}</div></div>`:'';}).join('')}</div>`;
};
// AI applications no longer offer technical-asset associations.
R.editApplication=function(){return false;};
R.editAsset=function(){return false;};
R.search=function(value){
 if(!R.draft)return;R.draft.query=value;R.editor();
 const input=document.getElementById('ar-search');input?.focus();input?.setSelectionRange?.(value.length,value.length);
};
R.filterKind=function(value){if(R.draft){R.draft.kind=Object.hasOwn(kinds,value)?value:'';R.editor();}};
R.toggle=function(key,on){
 const d=R.draft;if(!d||!R.assets().some(a=>a.key===key))return;
 d.selection=on?[...new Set([...d.selection,key])]:d.selection.filter(k=>k!==key);
 const count=document.getElementById('ar-selected');if(count)count.textContent=d.selection.length;
};
R.editor=function(){
 const d=R.draft,app=d&&R.apps().find(a=>a.id===d.id);if(!app)return;
 const query=d.query.trim().toLowerCase(),rows=R.assets().filter(r=>(!d.kind||r.kind===d.kind)&&(!query||String(r.asset.name||'').toLowerCase().includes(query)));
 const body=`<div class="ar-link-editor"><p class="ar-editor-subject">${E(app.name)}</p><div class="ar-link-toolbar"><select aria-label="资产类型" onchange="App.applicationAssets.filterKind(this.value)"><option value="">全部资产类型</option>${Object.entries(kinds).map(([value,label])=>`<option value="${value}" ${d.kind===value?'selected':''}>${label}</option>`).join('')}</select><label class="ar-link-search">${A.icon('search',16)}<input id="ar-search" type="search" value="${E(d.query)}" placeholder="搜索资产名称" aria-label="搜索资产名称" oninput="if(!event.isComposing)App.applicationAssets.search(this.value)" oncompositionend="App.applicationAssets.search(this.value)"></label></div><div class="ar-link-options"><table><thead><tr><th class="ar-choice-column"></th><th>资产名称</th><th>类型</th></tr></thead><tbody>${rows.map(r=>`<tr><td><input type="checkbox" id="ar-check-${E(r.key)}" aria-label="关联 ${E(r.asset.name)}" data-key="${E(r.key)}" ${d.selection.includes(r.key)?'checked':''} onchange="App.applicationAssets.toggle(this.dataset.key,this.checked)"></td><td><label for="ar-check-${E(r.key)}">${E(r.asset.name)}</label></td><td>${kinds[r.kind]}</td></tr>`).join('')||'<tr><td colspan="3" class="empty">暂无匹配资产</td></tr>'}</tbody></table></div><p id="ar-error" class="error-message" role="alert"></p></div>`;
 A.modal('关联资产',body,`<span class="ar-selected-count">已选 <b id="ar-selected">${d.selection.length}</b> 项</span><button class="btn" onclick="App.applicationAssets.cancel()">取消</button><button class="btn primary" onclick="App.applicationAssets.save()">保存</button>`,{wide:true});
 document.getElementById('modal')?.querySelector('.close-btn')?.setAttribute('onclick','App.applicationAssets.cancel()');
};
R.cancel=function(){R.draft=null;A.closeModal();};
R.save=function(){
 const d=R.draft;if(!d||d.scope!=='application')return false;
 const result=R.replace('application',d.id,d.selection);
 if(!result.ok){const error=document.getElementById('ar-error');if(error)error.textContent=result.error;return false;}
 R.draft=null;A.closeModal();A.render();A.toast('资产关联已保存');return true;
};
// Historical application result pages use the same completion rule as the inventory.
R.summary=function(id){
 const rows=R.assetsFor(id).map(r=>{const tasks=V.allTasks().filter(t=>!t.deletedAt&&Q.objectKey(t)===r.key),resultTask=R.latestReport(r.key);return {...r,tasks,resultTask,result:resultTask?Q.taskResult(resultTask):null};});
 return {rows,tasks:[...new Map(rows.flatMap(r=>r.tasks).map(t=>[t.id,t])).values()],evaluated:rows.filter(r=>r.result).length};
};
})();
