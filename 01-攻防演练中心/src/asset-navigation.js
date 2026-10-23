/* Pick connected assets by taxonomy, retaining the connection ID as the task identity. */
(function(){
'use strict';
const A=window.App,C=A.connections,X=A.attack,B=A.banks,E=A.escape,I=A.icon;
const collator=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
const sorted=values=>[...new Set(values)].sort(collator.compare);
// Normalize old seeded display categories only; never infer a checkpoint revision.
const assetIdentity=C.identity;
C.identity=function(m){const v=assetIdentity(m);if(m?.comparisonGroup)return v;const family=m?.model?.toLowerCase()==='deepseek-v3.2'?'DeepSeek-V3':C.seriesPresets.find(f=>f.toLowerCase()===v.family?.toLowerCase())||v.family;return {...v,family};};
const developer=m=>C.developerOf(m)||'其他厂商';
const family=m=>C.identity(m).family||'未分组';
C.assetTaxonomy=m=>({developer:developer(m),family:family(m)});
C.assetCandidates=role=>C.eligible(role).filter(m=>m.kind!=='agent'&&!m.presetPending&&!m.systemGuard&&C.connState(m).ok);
C.assetPickers={};
const fieldFor=role=>role==='target'?'model':role;
C.pickerState=function(role,id,value){
  let s=C.assetPickers[id];
  if(!s||s.value!==value){const m=C.db.find(m=>m.id===value);s=C.assetPickers[id]={role,value,open:false,developer:m?developer(m):'',family:m?family(m):''};}
  return s;
};
C.assetPickerContent=function(s,id){
 const models=C.assetCandidates(s.role).filter(m=>m.kind!=='agent').sort((a,b)=>collator.compare(a.name||a.model,b.name||b.model)),chosen=models.find(m=>m.id===s.value);s.models=models;
 return `<button type="button" id="${id}" class="series-trigger ${chosen?'has-value':''}" aria-expanded="${s.open}" aria-controls="${id}-panel" onclick="App.connections.toggleAssetPicker('${id}')"><span>${E(chosen?.name||chosen?.model||'请选择模型')}</span><span aria-hidden="true">⌄</span></button><div class="asset-picker-panel" id="${id}-panel" ${s.open?'':'hidden'}><div style="width:100%;max-height:280px;overflow:auto" class="series-options">${models.map((m,i)=>`<button type="button" aria-pressed="${m.id===s.value}" onclick="App.connections.chooseAsset('${id}',${i})">${E(m.name||m.model)}</button>`).join('')||'<p class="series-empty">暂无可用模型</p>'}</div></div>`;
};
C.assetPicker=function(role,value,id){return `<div class="asset-picker" id="${id}-picker">${C.assetPickerContent(C.pickerState(role,id,value),id)}</div>`;};
C.positionAssetPicker=function(id){const host=document.getElementById(id+'-picker'),panel=document.getElementById(id+'-panel'),bounds=host?.getBoundingClientRect?.(),card=host?.closest?.('.creation-page')?.getBoundingClientRect?.();if(!panel||!Number.isFinite(bounds?.left))return;const left=Math.max(16,(card?.left||0)+16),right=Math.min(window.innerWidth-16,(card?.right||window.innerWidth)-16),width=Math.min(360,right-left),x=Math.max(left,Math.min(bounds.left,right-width));panel.style.width=width+'px';panel.style.maxWidth='none';panel.style.left=(x-bounds.left)+'px';panel.style.right='auto';const above=window.innerHeight-bounds.bottom<230&&bounds.top-Math.max(0,card?.top||0)>230;panel.style.top=above?'auto':'calc(100% + 6px)';panel.style.bottom=above?'calc(100% + 6px)':'auto';};
C.renderAssetPicker=function(id){const host=document.getElementById(id+'-picker'),s=C.assetPickers[id];if(host&&s){host.innerHTML=C.assetPickerContent(s,id);if(s.open)C.positionAssetPicker(id);}};
C.closeAssetPickers=function(focus=false){for(const [id,s] of Object.entries(C.assetPickers)){if(!s.open)continue;s.open=false;document.getElementById(id+'-panel')?.setAttribute('hidden','');document.getElementById(id)?.setAttribute('aria-expanded','false');if(focus)document.getElementById(id)?.focus();}};
C.toggleAssetPicker=function(id){const s=C.assetPickers[id];if(!s)return;const open=!s.open;C.closeAssetPickers();s.open=open;C.renderAssetPicker(id);document.getElementById(id)?.focus();};
C.browseAsset=function(id,key,index){const s=C.assetPickers[id];if(!s||!['developer','family'].includes(key))return;const value=(key==='developer'?s.developers:s.families)[index];if(value===undefined)return;s[key]=value;if(key==='developer')s.family='';C.renderAssetPicker(id);document.querySelector(`#${id}-panel .series-column:nth-child(${key==='developer'?1:2}) button[aria-pressed="true"]`)?.focus();};
C.chooseAsset=function(id,index){const s=C.assetPickers[id],m=s?.models[index];if(!m||!C.assetCandidates(s.role).some(x=>x.id===m.id))return;X.wizard[fieldFor(s.role)]=m.id;s.value=m.id;s.open=false;if(s.role==='target')X.wizard.targetKind='model';C.renderAssetPicker(id);document.getElementById(id)?.focus();};
document.addEventListener('click',e=>{if(!e.composedPath().some(node=>node.classList?.contains('asset-picker')))C.closeAssetPickers();});
document.addEventListener('focusin',e=>{if(!e.target.closest?.('.asset-picker'))C.closeAssetPickers();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&Object.values(C.assetPickers).some(s=>s.open)){e.preventDefault();C.closeAssetPickers(true);}});
const roleSelect=C.roleSelect;
C.roleSelect=function(role,value,id,onchange){return /^task-(attacker|judge)$/.test(id)?C.assetPicker(role,value,id):roleSelect.call(C,role,value,id,onchange);};
C.taskTargetPicker=function(w){
  w.targetKind='model';
  return `<div class="field">${C.assetPicker('target',w.model,'task-model')}</div>`;
};
C.changeTargetKind=function(kind){if(!['model','agent'].includes(kind)||!X.wizard)return;C.closeAssetPickers();X.wizard.targetKind=kind;X.wizard.model='';delete C.assetPickers['task-model'];X.wizardModal();};
const newTask=X.newTask;
X.newTask=function(){C.assetPickers={};newTask.apply(X,arguments);const w=X.wizard;for(const role of ['attacker','judge']){const items=C.assetCandidates(role);if(!items.some(m=>m.id===w[role]))w[role]=items[0]?.id||'';}};
const validation=X.taskValidation;
X.taskValidation=function(w){const message=validation.call(X,w);if(message)return message;if(!C.assetCandidates('target').some(m=>m.id===w.model))return '请选择已连通的靶标';if(w.step===3){for(const role of ['judge',...(X.requirements(w.methods).attacker?['attacker']:[])])if(!C.assetCandidates(role).some(m=>m.id===w[role]))return role==='judge'?'请选择已连通的裁判模型':'请选择已连通的攻击模型';}return '';};

X.assetFilters={developer:'',family:''};
X.assetFilterChoices=function(){const models=C.db.filter(m=>m.kind!=='agent'),s=X.assetFilters;return {developers:sorted(models.map(developer)),families:sorted(models.filter(m=>!s.developer||developer(m)===s.developer).map(family))};};
X.filterAssets=function(key,value){if(!['developer','family'].includes(key))return;X.assetFilters[key]=value;if(key==='developer')X.assetFilters.family='';A.render();};
X.assetRows=function(){return C.db.filter(m=>(m.kind||'model')===(X.connectionKind||'model'));};
X.models=function(){
  const kind='model',s=X.assetFilters,options=X.assetFilterChoices();X.connectionKind=kind;const items=X.assetRows();
  const optionsHTML=(values,selected)=>values.map(v=>`<option value="${E(v)}" ${v===selected?'selected':''}>${E(v)}</option>`).join('');
  return `<div class="setup-page-head"><span class="muted">共 ${items.length} 个模型</span><button class="btn primary" onclick="App.connections.open()">${I('plus',14)}接入模型</button></div><div class="attack-model-grid">${items.map(m=>{const st=C.connState(m),vendor=C.developerOf(m)||m.vendor||'';return `<article class="card attack-model-card"><div class="attack-model-head"><span class="model-mark">${I('box',19)}</span><div class="attack-model-title"><strong>${E(m.name||m.model)}</strong></div><span class="badge ${st.tone} connection-state${st.testing?' testing':''}">${E(st.label)}</span></div><div class="attack-model-actions"><button class="model-action" title="编辑" aria-label="编辑 ${E(m.name)}" data-id="${E(m.id)}" onclick="App.connections.open(this.dataset.id)">${I('edit',16)}</button><button class="model-action" title="测试连接" aria-label="测试 ${E(m.name)}" data-id="${E(m.id)}" onclick="App.connections.test(this.dataset.id)">${I('zap',16)}</button>${m.systemGuard?'':`<button class="entry-delete" title="删除" aria-label="删除 ${E(m.name)}" data-id="${E(m.id)}" onclick="App.connections.remove(this.dataset.id)" type="button">${A.icon('trash',16)}</button>`}</div><div class="ar-model-links">${A.applicationAssets?.inline('models',m.id)||''}<button class="link-btn" data-key="${E('models:'+m.id)}" onclick="App.applicationAssets.editAsset(this.dataset.key)">关联应用</button></div></article>`;}).join('')||'<div class="empty">暂无符合条件的资产</div>'}</div>`;
};

B.industryField=function(d){
  d.industryMode ||= d.industry&&d.industry!=='通用'?'custom':'general';
  return `<div class="bank-industry-fields"><div class="field"><label for="bank-industry-mode">行业</label><select id="bank-industry-mode" onchange="App.banks.changeIndustry(this.value)"><option value="general" ${d.industryMode==='general'?'selected':''}>通用</option><option value="custom" ${d.industryMode==='custom'?'selected':''}>自定义</option></select></div>${d.industryMode==='custom'?`<div class="field"><label for="bank-industry">自定义行业 *</label><input id="bank-industry" maxlength="32" value="${E(d.industry==='通用'?'':d.industry||'')}" placeholder="输入自定义行业，如：金融、医疗、供应链" autocomplete="off" oninput="App.banks.draft.industry=this.value;App.banks.draft.industryTouched=true"></div>`:''}</div>`;
};
B.changeIndustry=function(mode){const d=B.draft;if(!d||!['general','custom'].includes(mode))return;if(d.industryMode==='custom')d.customIndustry=d.industry;d.industryMode=mode;d.industryTouched=true;d.industry=mode==='general'?'通用':d.customIndustry||'';d.message='';B.edit();if(mode==='custom')document.getElementById('bank-industry')?.focus();};
})();
