/* Platform roles reference model assets; credentials and historical run snapshots stay in their owners. */
(function(){
'use strict';
const A=window.App,C=A.connections,X=A.attack,E=A.escape;
const copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString();
const types={basic:'基础模型',safety:'安全模型',embedding:'Embedding 模型',multimodal:'多模态模型'};
const roles={target:'靶标',attacker:'攻击生成',judge:'裁判',scanner:'漏洞分析',guard:'护栏',embedding:'语义检索'};
const protocols={chat:'对话生成',qwen3guard:'Qwen3Guard 安全分类',embeddings:'向量输出','multimodal-chat':'多模态对话'};
const contracts={basic:['chat'],safety:['chat','qwen3guard'],embedding:['embeddings'],multimodal:['multimodal-chat']};
const compatible={chat:['target','attacker','judge','scanner'],'multimodal-chat':['target','attacker','judge','scanner'],qwen3guard:['guard'],embeddings:['embedding']};
const guardId='system-qwen3guard';
const visibleRoles=()=>roles;
const rows=()=>A.data.attack?.models||[];
const revision=m=>Number(m?.configurationRevision)||1;
const modelName=m=>m?.name||m?.model||'未命名模型';
const supported=d=>(contracts[d.type]||[]).includes(d.outputProtocol)?(compatible[d.outputProtocol]||[]).filter(r=>d.type!=='safety'||r!=='attacker'):[];
const M=A.modelRoles={types,roles,protocols,filter:{type:'',role:'',state:'',query:''},draft:null};
M.init=function(){
 if(!A.data.attack)return;
 if(!A.data.modelRoleAssignments||typeof A.data.modelRoleAssignments!=='object'||Array.isArray(A.data.modelRoleAssignments))A.data.modelRoleAssignments={};
 const db=A.data.modelRoleAssignments;
 for(const m of rows().filter(m=>(m.kind||'model')==='model')){
  if(['user','unassigned'].includes(db[m.id]?.source))continue;
  const guard=!!m.systemGuard||m.id===guardId;
  const type=guard?'safety':m.caps?.includes('vision')?'multimodal':'basic';
  db[m.id]={modelId:m.id,type,outputProtocol:'unconfigured',roles:[],confirmed:false,assetRevision:revision(m),revision:1,source:'unassigned',updatedAt:now()};
 }
};
M.get=function(id){M.init();const d=A.data.modelRoleAssignments?.[typeof id==='object'?id.id:id];return d?copy(d):null;};
M.configured=function(m,d=M.get(m?.id)){return !!m&&!!d?.confirmed&&d.assetRevision===revision(m)&&supported(d).length>0;};
M.allows=function(model,role){const id=typeof model==='string'?model:model?.id,m=rows().find(v=>v.id===id),d=M.get(m?.id);return !!m&&(m.kind||'model')==='model'&&m.accessType!=='weights'&&M.configured(m,d)&&d.roles.includes(role)&&supported(d).includes(role);};
M.connected=function(m){return !!m&&!m.presetPending&&!['pending','testing','fail','failed','disconnected'].includes(m.connectStatus)&&!!C.connState(m).ok;};
M.candidates=function(role){M.init();return rows().filter(m=>M.connected(m)&&M.allows(m,role)).sort((a,b)=>modelName(a).localeCompare(modelName(b),'en',{numeric:true,sensitivity:'base'})||a.id.localeCompare(b.id));};
M.state=function(m){const d=M.get(m?.id);return !d?.confirmed?'unassigned':d.assetRevision!==revision(m)?'changed':!d.roles.length?'disabled':!M.connected(m)?'offline':'ready';};
M.stateLabel=function(m){return {unassigned:'未配置',changed:'需重新确认',disabled:'未启用用途',offline:'连接不可用',ready:'已配置'}[M.state(m)];};
M.filterBy=function(key,value){if(!Object.hasOwn(M.filter,key))return;M.filter[key]=value;A.render();};
M.filtered=function(){const f=M.filter,q=f.query.trim().toLowerCase();return rows().filter(m=>(m.kind||'model')==='model').filter(m=>{const d=M.get(m.id);return (!f.type||d?.type===f.type)&&(!f.role||d?.roles.includes(f.role))&&(!f.state||M.state(m)===f.state)&&(!q||[m.name,m.model].join(' ').toLowerCase().includes(q));});};
M.render=function(){
 M.init();const f=M.filter,models=M.filtered(),select=(key,label,values)=>`<select aria-label="${label}" onchange="App.modelRoles.filterBy('${key}',this.value)"><option value="">${label}</option>${Object.entries(values).map(([v,n])=>`<option value="${v}" ${f[key]===v?'selected':''}>${n}</option>`).join('')}</select>`;
 return A.heading('','模型资产','接入的模型默认未配置用途。配置用途且连接可用后，才能用于新的任务与策略。',`<button class="btn" onclick="App.platform.go('assets','models')">接入与连接管理</button>`)+
 `<section class="card mr-model-list"><div class="toolbar mr-toolbar">${select('type','全部模型类型',types)}${select('role','全部用途',visibleRoles())}${select('state','全部配置状态',{ready:'已配置',unassigned:'未配置',changed:'需重新确认',disabled:'未启用用途',offline:'连接不可用'})}<input type="search" aria-label="搜索模型" placeholder="搜索模型名称" value="${E(f.query)}" onchange="App.modelRoles.filterBy('query',this.value)"></div><div class="table-wrap"><table><thead><tr><th>模型</th><th>模型类型</th><th>输出能力</th><th>平台用途</th><th>配置状态</th><th>操作</th></tr></thead><tbody>${models.map(m=>{const d=M.get(m.id),state=M.state(m);return `<tr><td><strong>${E(modelName(m))}</strong></td><td>${types[d.type]||'待配置'}</td><td>${protocols[d.outputProtocol]||'待确认'}</td><td><div class="mr-use-tags">${d.roles.map(r=>A.badge(roles[r]||r,'blue')).join('')||'<span class="muted">未配置</span>'}</div></td><td>${A.badge(M.stateLabel(m),state==='ready'?'green':state==='disabled'?'gray':'orange')}</td><td><button class="link-btn" data-id="${E(m.id)}" onclick="App.modelRoles.edit(this.dataset.id)">配置用途</button></td></tr>`;}).join('')||'<tr><td colspan="6" class="empty">暂无符合条件的模型</td></tr>'}</tbody></table></div></section>`+
 `<div class="mr-role-help"><strong>类型描述模型能力，用途决定在哪里可选。</strong><p>裁判使用可按评判规则生成评分与理由的对话模型；Qwen3Guard 输出安全分类结果，通过专用适配用于护栏。Embedding 模型用于语义检索；漏洞分析模型用于扫描中的发现、验证和报告。已有任务与已发布策略保留原模型快照，角色调整在后续发起任务时检查。</p></div>`;
};
M.edit=function(id){const m=rows().find(v=>v.id===id);if(!m)return;M.draft=M.get(id);if(M.draft.outputProtocol==='unconfigured')M.draft.outputProtocol=contracts[M.draft.type][0];M.editor();};
M.editor=function(){
 const d=M.draft,m=rows().find(v=>v.id===d?.modelId);if(!m)return;
 const fixed=!!m.systemGuard||m.id===guardId;
 const body=`<div class="mr-editor"><p class="mr-edit-model">${E(modelName(m))}</p><div class="form-grid"><div class="field"><label for="mr-type">模型类型 *</label><select id="mr-type" ${fixed?'disabled':''} onchange="App.modelRoles.changeType(this.value)">${Object.entries(types).map(([id,name])=>`<option value="${id}" ${d.type===id?'selected':''}>${name}</option>`).join('')}</select></div><div class="field"><label for="mr-protocol">输出能力 *</label><select id="mr-protocol" ${fixed?'disabled':''} onchange="App.modelRoles.changeProtocol(this.value)">${contracts[d.type].filter(id=>fixed||id!=='qwen3guard').map(id=>`<option value="${id}" ${d.outputProtocol===id?'selected':''}>${protocols[id]}</option>`).join('')}</select></div></div><fieldset class="mr-role-choices"><legend>平台用途 <span>可多选</span></legend>${Object.entries(visibleRoles()).map(([id,name])=>{const enabled=supported(d).includes(id);return `<label class="${enabled?'':'disabled'}"><input type="checkbox" ${d.roles.includes(id)?'checked':''} ${enabled?'':'disabled'} onchange="App.modelRoles.toggleRole('${id}',this.checked)"><span>${name}</span></label>`;}).join('')}</fieldset><div class="mr-editor-help">${d.outputProtocol==='qwen3guard'?'安全分类服务返回 Safe、Controversial、Unsafe 等标签。当前通过 Qwen3Guard 适配用于护栏，不承担攻击任务的评分裁判。':d.outputProtocol==='embeddings'?'向量服务返回数值向量，供语义检索使用，不产生对话回答或安全结论。':'对话模型可根据评判规则生成评分与理由；作为裁判前应使用标注样本验证判定效果。'}</div><p class="hint">请按实际服务能力配置。清空所有用途可停止该模型被新任务与新策略选用，连接仍由模型资产统一维护。</p>${M.state(m)==='changed'?'<p class="error-message">模型连接已变更，请重新确认输出能力与平台用途。</p>':''}<p id="mr-error" class="error-message" role="alert"></p></div>`;
 A.modal('配置模型用途',body,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.modelRoles.save()">保存配置</button>`,{wide:false});
};
M.changeType=function(type){const d=M.draft;if(!types[type])return;d.type=type;d.outputProtocol=contracts[type][0];d.roles=d.roles.filter(r=>supported(d).includes(r));M.editor();};
M.changeProtocol=function(protocol){const d=M.draft;if(!contracts[d.type]?.includes(protocol))return;d.outputProtocol=protocol;d.roles=d.roles.filter(r=>supported(d).includes(r));M.editor();};
M.toggleRole=function(role,on){const d=M.draft;if(!supported(d).includes(role))return;d.roles=on?[...new Set([...d.roles,role])]:d.roles.filter(r=>r!==role);};
M.validate=function(d){const m=rows().find(v=>v.id===d?.modelId);if(!m||(m.kind||'model')!=='model')return '模型资产不存在，请重新选择';if(!types[d.type]||!contracts[d.type]?.includes(d.outputProtocol))return '请选择匹配的模型类型与输出能力';if((m.systemGuard||m.id===guardId)&&(d.type!=='safety'||d.outputProtocol!=='qwen3guard'))return '该系统模型使用 Qwen3Guard 安全分类输出';if(!Array.isArray(d.roles)||d.roles.some(r=>!supported(d).includes(r)))return '所选用途与模型输出能力不匹配';return '';};
M.save=function(value){
 const d=copy(value||M.draft),error=M.validate(d);if(error){const el=document.getElementById('mr-error');if(el)el.textContent=error;return false;}
 const m=rows().find(v=>v.id===d.modelId),old=M.get(d.modelId),record={modelId:m.id,type:d.type,outputProtocol:d.outputProtocol,roles:[...new Set(d.roles)],confirmed:true,assetRevision:revision(m),revision:(old?.revision||0)+1,source:'user',updatedAt:now()};
 A.data.modelRoleAssignments[m.id]=record;
 if(A.contentSafety?.db?.audit&&A.contentSafety?.audit)A.contentSafety.audit('model.roles.update',m.id,'配置模型用途：'+modelName(m),{modelId:m.id,previous:old?{type:old.type,outputProtocol:old.outputProtocol,roles:old.roles}:null,current:{type:record.type,outputProtocol:record.outputProtocol,roles:record.roles},revision:record.revision});
 A.save();if(!value){A.closeModal();A.render();A.toast('模型用途已保存');}return copy(record);
};
// Enforce roles wherever existing task and strategy pickers obtain their options.
C.assetCandidates=role=>M.candidates(role);
C.eligible=role=>M.candidates(role||'target');
const assetPicker=C.assetPicker;
C.assetPicker=function(role,value,id){const html=assetPicker.apply(C,arguments);return html+(!M.candidates(role).length?`<p class="hint">暂无可用${roles[role]||'角色'}模型，请在平台管理 → 模型配置中配置用途。</p>`:'');};
const taskValidate=X.taskValidation;
X.taskValidation=function(w){
 if(w.model&&!M.allows(w.model,'target'))return '靶标模型未配置对应用途，请到平台管理 → 模型配置检查';
 if(w.step===3){const judge=w.judge;if(judge&&!M.allows(judge,'judge'))return '裁判模型未配置裁判用途，请在任务中重新选择或到平台管理配置用途';if(X.requirements(w.methods||[]).attacker&&w.attacker&&!M.allows(w.attacker,'attacker'))return '攻击模型未配置攻击生成用途，请到平台管理 → 模型配置检查';}
 return taskValidate.apply(X,arguments);
};
const guardReady=X.guardReady;
X.guardReady=function(){return guardReady.apply(X,arguments)&&M.candidates('guard').some(m=>m.id===guardId);};
X.guardConnectionHint='护栏不可用，请在资产中心 → 模型查看 Qwen3Guard 服务，在平台管理 → 模型配置查看用途。';
const retestError=A.policies.retestError;
A.policies.retestError=function(s){const error=retestError.apply(this,arguments);if(error)return error;for(const [role,model] of [['target',s?.target],['attacker',s?.attacker],['judge',s?.judgement?.model],['guard',s?.defense?.model]]){if(model&&!M.allows(model.id,role))return (roles[role]||role)+'模型的用途已调整：'+modelName(model);}for(const entry of Object.values(s?.methodModels||{}))for(const [key,model] of Object.entries(entry.modelSnapshots||{})){const role=entry.roles?.[key]||'embedding';if(model&&!M.allows(model.id,role))return '方法辅助模型的用途已调整：'+modelName(model);}return '';};
const saveConnection=C.save;
C.save=function(){const draft=C.draft,before=new Set(rows().map(m=>m.id)),result=saveConnection.apply(C,arguments);M.init();if(draft&&!C.draft){A.save();const added=rows().find(m=>!before.has(m.id));if(added&&!M.get(added.id)?.confirmed)A.toast('接入成功，请到平台管理 → 模型配置分配用途');else if(draft.id&&M.state(rows().find(m=>m.id===draft.id))==='changed')A.toast('连接已更新，请到平台管理 → 模型配置重新确认用途');}return result;};
const init=X.init;
X.init=function(){const result=init.apply(X,arguments);M.init();return result;};
})();
