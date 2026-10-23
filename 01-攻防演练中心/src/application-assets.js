/* Business applications group reusable technical assets through optional references. */
(function(){
'use strict';
const A=window.App,Q=A.assessment,V=A.evaluation,S=A.scanProduct,E=A.escape;
const kinds={models:'模型',code:'代码',packages:'软件包',web:'Web 站点'};
const arr=v=>Array.isArray(v)?v:[],time=v=>v?new Date(v).toLocaleString('zh-CN',{hour12:false}):'—';
const R=A.applicationAssets={kinds,query:'',draft:null};
R.apps=()=>arr(A.data.aiApplications);
R.assets=()=>Object.keys(kinds).flatMap(kind=>Q.assetRows(kind).filter(a=>kind!=='models'||(a.kind||'model')==='model').map(asset=>({key:kind+':'+asset.id,kind,asset})));
R.records=()=>arr(A.data.applicationAssetLinks);
R.links=function(){
 const apps=new Set(R.apps().map(a=>a.id)),assets=new Set(R.assets().map(a=>a.key)),seen=new Set();
 return R.records().filter(r=>{const key=JSON.stringify([r.appId,r.assetKey]);if(!apps.has(r.appId)||!assets.has(r.assetKey)||seen.has(key))return false;seen.add(key);return true;});
};
R.applicationsFor=key=>{const ids=new Set(R.links().filter(r=>r.assetKey===key).map(r=>r.appId));return R.apps().filter(a=>ids.has(a.id));};
R.assetsFor=id=>{const keys=new Set(R.links().filter(r=>r.appId===id).map(r=>r.assetKey));return R.assets().filter(a=>keys.has(a.key));};
R.replace=function(scope,id,selection){
 const keys=[...new Set(arr(selection))],apps=new Set(R.apps().map(a=>a.id)),assets=new Set(R.assets().map(a=>a.key));
 if(!['application','asset'].includes(scope))return {ok:false,error:'请选择关联对象。'};
 if(scope==='application'?!apps.has(id)||keys.some(k=>!assets.has(k)):!assets.has(id)||keys.some(k=>!apps.has(k)))return {ok:false,error:'所选应用或资产已不存在，请重新选择。'};
 const field=scope==='application'?'appId':'assetKey',old=R.records(),createdAt=new Date().toISOString();
 const next=keys.map(key=>{const appId=scope==='application'?id:key,assetKey=scope==='application'?key:id;return old.find(r=>r.appId===appId&&r.assetKey===assetKey)||{appId,assetKey,createdAt};});
 A.data.applicationAssetLinks=[...old.filter(r=>r[field]!==id),...next];
 A.platformGovernance.audit('asset.update',id,'更新应用与技术资产关联',{scope,relatedCount:next.length});A.save();return {ok:true};
};
R.attach=function(appId,key){if(!appId)return {ok:true};return R.replace('asset',key,[...R.applicationsFor(key).map(a=>a.id),appId]);};
R.open=id=>A.platform.go('assets','applications',id);
R.inline=function(kind,id){const apps=R.applicationsFor(kind+':'+id);return apps.length?`<div class="ar-tags">${apps.map(a=>`<button class="ar-tag" data-id="${E(a.id)}" onclick="App.applicationAssets.open(this.dataset.id)">${E(a.name)}</button>`).join('')}</div>`:'<span class="muted ar-unlinked">未关联应用</span>';};
R.assetSection=(kind,id)=>`<section class="ar-asset-links"><div class="ar-section-head"><h3>关联业务应用</h3><button class="link-btn" data-key="${E(kind+':'+id)}" onclick="App.applicationAssets.editAsset(this.dataset.key)">管理关联</button></div>${R.inline(kind,id)}<p class="hint">同一技术资产可被多个应用共用，版本和评估记录随资产保存。</p></section>`;
R.editApplication=function(id){if(!R.apps().some(a=>a.id===id))return;R.draft={scope:'application',id,selection:R.assetsFor(id).map(a=>a.key),query:''};A.closeDrawer();R.editor();};
R.editAsset=function(key){if(!R.assets().some(a=>a.key===key))return;R.draft={scope:'asset',id:key,selection:R.applicationsFor(key).map(a=>a.id),query:''};A.closeDrawer();R.editor();};
R.search=function(value){if(R.draft){R.draft.query=value;R.editor();const input=document.getElementById('ar-search');input?.focus();input?.setSelectionRange?.(value.length,value.length);}};
R.toggle=function(key,on){const d=R.draft;if(!d)return;d.selection=on?[...new Set([...d.selection,key])]:d.selection.filter(k=>k!==key);const n=document.getElementById('ar-selected');if(n)n.textContent=d.selection.length;};
R.editor=function(){
 const d=R.draft;if(!d)return;const application=d.scope==='application',subject=application?R.apps().find(a=>a.id===d.id):R.assets().find(a=>a.key===d.id)?.asset;
 if(!subject)return;const query=d.query.trim().toLowerCase();
 const rows=application?R.assets().map(a=>({id:a.key,name:a.asset.name,kind:a.kind,detail:a.asset.repository||a.asset.url||a.asset.model||a.asset.id})):R.apps().map(a=>({id:a.id,name:a.name,kind:'applications',detail:[a.scene,a.owner].filter(Boolean).join(' · ')}));
 const filtered=rows.filter(r=>!query||[r.name,r.detail].join(' ').toLowerCase().includes(query));
 const groups=application?Object.entries(kinds):[['applications','业务应用']];
 const body=`<p class="ar-editor-subject">${E(subject.name)}</p><p class="hint">${application?'选择该应用使用的技术资产，可按需多选。':'选择使用该技术资产的业务应用，可按需多选。'}取消勾选会解除关联，资产及其版本、任务记录继续保留。</p><input class="input" id="ar-search" type="search" aria-label="搜索可关联对象" value="${E(d.query)}" placeholder="搜索名称或标识" onchange="App.applicationAssets.search(this.value)"><div class="ar-options">${groups.map(([kind,label])=>{const items=filtered.filter(r=>r.kind===kind);return items.length?`<fieldset><legend>${label} · ${items.length}</legend>${items.map(r=>`<label class="ar-choice"><input type="checkbox" data-key="${E(r.id)}" ${d.selection.includes(r.id)?'checked':''} onchange="App.applicationAssets.toggle(this.dataset.key,this.checked)"><span><strong>${E(r.name)}</strong><small>${E(r.detail)}</small></span></label>`).join('')}</fieldset>`:'';}).join('')||'<p class="empty">暂无可关联对象，可先在资产中心登记。</p>'}</div><p class="hint">已选 <b id="ar-selected">${d.selection.length}</b> 项</p><p id="ar-error" class="error-message" role="alert"></p>`;
 A.modal(application?'关联技术资产':'关联业务应用',body,`<button class="btn" onclick="App.applicationAssets.cancel()">取消</button><button class="btn primary" onclick="App.applicationAssets.save()">保存关联</button>`,{wide:true});
};
R.cancel=function(){R.draft=null;A.closeModal();};
R.save=function(){const d=R.draft;if(!d)return false;const result=R.replace(d.scope,d.id,d.selection);if(!result.ok){document.getElementById('ar-error').textContent=result.error;return false;}R.draft=null;A.closeModal();A.render();A.toast('资产关联已保存');return true;};
R.summary=function(id){
 const assets=R.assetsFor(id),index=new Map(Q.objects().map(o=>[o.key,o]));
 const rows=assets.map(a=>{const object=index.get(a.key),tasks=object?.tasks||[],resultTask=tasks.find(t=>V.reportReady(t)&&Q.taskResult(t).value!==null);return {...a,tasks,resultTask,result:resultTask?Q.taskResult(resultTask):null};});
 const tasks=[...new Map(rows.flatMap(r=>r.tasks).map(t=>[t.id,t])).values()];
 return {rows,tasks,evaluated:rows.filter(r=>r.result).length};
};
R.resultTable=function(rows){return `<section class="card aq-table"><div class="ec-panel-head"><h2>关联资产评估结果</h2><span>各资产最近一次有效结果</span></div><div class="table-wrap"><table><thead><tr><th>技术资产</th><th>类型</th><th>最近结果</th><th>来源任务 / 版本</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="link-btn" data-key="${E(r.key)}" onclick="App.assessment.openAssetKey(this.dataset.key)">${E(r.asset.name)}</button></td><td>${kinds[r.kind]}</td><td>${r.result?`<strong>${E(r.result.main)}</strong><small>${E(r.result.sub)}</small>`:'<span class="muted">暂无有效评估结果</span>'}</td><td>${r.resultTask?`<button class="link-btn" data-id="${E(r.resultTask.id)}" onclick="App.evaluation.openReport(this.dataset.id)">${E(r.resultTask.name)}</button><small>${E(r.resultTask.targetMaterial?.version||r.resultTask.targetSnapshot?.versionLabel||'版本未记录')} · ${time(r.resultTask.created)}</small>`:r.tasks.length?'已有任务，尚无有效结果':'尚未评估'}</td><td><button class="link-btn" data-key="${E(r.key)}" onclick="App.assessment.openObject(this.dataset.key)">结果分析</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">先关联技术资产，即可在这里查看各自的评估结果。</td></tr>'}</tbody></table></div><p class="aq-footnote">按当前关联关系展示资产历史结果。模型 ASR 与漏洞数分别保留；具体结论以来源任务的版本和配置为准。</p></section>`;};
R.applicationHTML=function(id,report=false){
 const app=R.apps().find(a=>a.id===id);if(!app)return A.heading('','应用不存在','请返回应用列表选择。',`<button class="btn" onclick="App.platform.go('assets','applications')">返回应用列表</button>`);
 const s=R.summary(id),counts=Object.entries(kinds).map(([kind,n])=>[n,s.rows.filter(a=>a.kind===kind).length]);
 const actions=`<button class="btn" onclick="App.platform.go('assets','applications')">返回应用列表</button><button class="btn" data-id="${E(id)}" onclick="App.contentSafety.applicationForm(this.dataset.id)">编辑应用</button><button class="btn primary" data-id="${E(id)}" onclick="App.applicationAssets.editApplication(this.dataset.id)">关联技术资产</button>`;
 return A.heading('',E(app.name),'业务应用 · '+E(app.scene||'未填写业务场景')+' · '+E(app.environment||'未指定环境'),actions)+(report?Q.reportNav():'')+`<section class="card ar-app-profile"><div><span>负责人</span><strong>${E(app.owner||'未指定')}</strong></div><div><span>应用状态</span>${A.badge(app.status==='online'?'在线':'下线',app.status==='online'?'green':'gray')}</div><div><span>已评估技术资产</span><strong>${s.evaluated} / ${s.rows.length}</strong></div><div><span>关联资产任务</span><strong>${s.tasks.length}</strong></div></section><div class="aq-stats">${counts.map(([n,v])=>`<section class="card"><span>${n}</span><strong>${v}</strong></section>`).join('')}</div>`+R.resultTable(s.rows)+`<div class="ar-app-footer"><span>应用防护与策略绑定</span><button class="btn" data-id="${E(id)}" onclick="App.contentSafety.bindingForm(this.dataset.id)">防护策略绑定</button></div>`;
};
R.listHTML=function(){
 const query=R.query.trim().toLowerCase(),apps=R.apps().filter(a=>!query||[a.name,a.scene,a.owner].join(' ').toLowerCase().includes(query));
 return A.heading('','AI 应用','业务应用汇总关联资产的评估结果；技术资产在各自分类中维护。',`<button class="btn primary" onclick="App.contentSafety.applicationForm()">${A.icon('plus',14)}登记应用</button>`)+`<section class="card aq-table"><div class="toolbar"><input class="input" aria-label="搜索应用" value="${E(R.query)}" placeholder="搜索应用、业务场景或负责人" onchange="App.applicationAssets.query=this.value;App.render()"></div><div class="table-wrap"><table><thead><tr><th>应用名称 / 业务场景</th><th>负责人 / 环境</th><th>关联技术资产</th><th>已评估资产</th><th>应用状态</th><th>操作</th></tr></thead><tbody>${apps.map(app=>{const s=R.summary(app.id);return `<tr><td><button class="link-btn" data-id="${E(app.id)}" onclick="App.applicationAssets.open(this.dataset.id)">${E(app.name)}</button><small>${E(app.scene||'未填写业务场景')}</small></td><td>${E(app.owner||'未指定')}<small>${E(app.environment||'—')}</small></td><td>${s.rows.length?Object.entries(kinds).filter(([k])=>s.rows.some(r=>r.kind===k)).map(([k,n])=>n+' '+s.rows.filter(r=>r.kind===k).length).join(' · '):'尚未关联'}</td><td>${s.evaluated} / ${s.rows.length}</td><td>${A.badge(app.status==='online'?'在线':'下线',app.status==='online'?'green':'gray')}</td><td><div class="ec-row-actions"><button class="link-btn" data-id="${E(app.id)}" onclick="App.applicationAssets.editApplication(this.dataset.id)">关联资产</button><button class="link-btn" data-key="${E('applications:'+app.id)}" onclick="App.assessment.openObject(this.dataset.key)">结果分析</button><button class="link-btn" data-id="${E(app.id)}" onclick="App.contentSafety.applicationForm(this.dataset.id)">编辑</button></div></td></tr>`;}).join('')||'<tr><td colspan="6" class="empty">暂无应用，可先登记业务应用，再关联已有技术资产。</td></tr>'}</tbody></table></div></section>`;
};
A.contentSafety.assetHTML=function(){A.contentSafety.init();return A.platform.applicationId?R.applicationHTML(A.platform.applicationId):R.listHTML();};
const detail=Q.assetDetail;
Q.assetDetail=function(kind,id){if(kind==='applications')return R.open(id);return detail.apply(Q,arguments);};
const results=Q.objectResultsHTML;
Q.objectResultsHTML=function(){if(Q.selectedObject?.startsWith('applications:'))return R.applicationHTML(Q.selectedObject.slice('applications:'.length),true);return results.apply(Q,arguments);};
R.scanField=function(d){
 if(d.targetId!=='new')return '';
 return `<div class="field"><label for="ar-scan-app">关联业务应用（选填）</label><select id="ar-scan-app" onchange="App.scanProduct.draft.applicationId=this.value"><option value="">暂不关联</option>${R.apps().map(a=>`<option value="${E(a.id)}" ${d.applicationId===a.id?'selected':''}>${E(a.name)}</option>`).join('')}</select><small>新建的技术资产会关联到该应用，后续可在资产中心调整。</small></div>`;
};
})();
