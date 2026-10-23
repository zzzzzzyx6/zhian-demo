/* Model capabilities are independent of the platform roles assigned to a service. */
(function(){
'use strict';
const A=window.App,M=A.modelRoles,C=A.connections,L=A.leanAssets,E=A.escape;
const copy=v=>JSON.parse(JSON.stringify(v)),rows=()=>C.db,revision=m=>Number(m?.configurationRevision)||1;
const labels=M.capabilities={chat:'文本对话',vision:'图片理解',embeddings:'向量输出',qwen3guard:'Guard 安全分类'};
const compatibility={chat:['target','attacker','judge','scanner'],vision:['target','attacker','judge','scanner'],embeddings:['embedding'],qwen3guard:['guard']};
const legacy={chat:['chat'],'multimodal-chat':['chat','vision'],embeddings:['embeddings'],qwen3guard:['qwen3guard'],unconfigured:[]};
M.displayName=m=>{const managed=L.isManaged(m)||m?._serviceType,name=String(managed?m?.model||m?.name||'':m?.name||m?.model||'');return managed?name.split('/').at(-1):name;};
const fixed=m=>!!m?.systemGuard||m?.id==='system-qwen3guard';
M.normalizeCapabilities=function(value){
 const d=copy(value||{});
 d.capabilities=Array.isArray(d.capabilities)?[...new Set(d.capabilities)]:[...(legacy[d.outputProtocol]||[])];
 const saved=A.data.modelRoleAssignments?.[d.modelId];
 if(saved&&d.outputProtocol!==saved.outputProtocol&&legacy[d.outputProtocol])d.capabilities=[...legacy[d.outputProtocol]];
 d.roles=Array.isArray(d.roles)?d.roles:[];
 return d;
};
M.supportedRoles=d=>[...new Set(M.normalizeCapabilities(d).capabilities.flatMap(c=>compatibility[c]||[]))];
M.requiredProtocols=d=>[...(d.capabilities.some(c=>['chat','vision'].includes(c))?['chat']:[]),...(d.capabilities.includes('embeddings')?['embeddings']:[])];
M.capabilityIssue=function(m,d){
 if(fixed(m))return '';
 for(const protocol of M.requiredProtocols(d))if(protocol!==(m.probeProtocol||'chat')&&!(m.capabilityChecks?.[protocol]?.valid===true&&m.capabilityChecks[protocol].assetRevision===revision(m)))return protocol==='embeddings'?'请先验证向量接口，再配置向量输出和语义检索用途':'请先验证对话接口，再配置文本对话用途';
 return '';
};
const get=M.get;
M.get=function(id){const d=get.call(M,id);return d?M.normalizeCapabilities(d):null;};
M.hasCapability=function(model,capability){const id=typeof model==='string'?model:model?.id,m=rows().find(v=>v.id===id),d=M.get(id);return !!m&&M.configured(m,d)&&d.capabilities.includes(capability);};
M.configured=function(m,value=M.get(m?.id)){const d=M.normalizeCapabilities(value);return !!m&&!!d.confirmed&&d.assetRevision===revision(m)&&M.supportedRoles(d).length>0&&!M.capabilityIssue(m,d);};
const allows=M.allows;
M.allows=function(model,role){const id=typeof model==='string'?model:model?.id;if(Object.values(A.data.defenseServices||{}).some(s=>s.id===id))return allows.call(M,model,role);const m=rows().find(v=>v.id===id),d=M.get(id);return !!m&&(m.kind||'model')==='model'&&m.accessType!=='weights'&&M.configured(m,d)&&d.roles.includes(role)&&M.supportedRoles(d).includes(role);};
M.edit=function(id){
 M.draft?.capabilityController?.abort();
 const asset=L.rows('models').find(v=>v.id===id);if(asset&&L.isManaged(asset)){L.open('models',id);return;}
 const m=rows().find(v=>v.id===id);if(!m)return;
 if(A.platform.state.section!=='management')A.platform.go('management','model-roles');
 M.draft=M.get(id);if(fixed(m))M.draft.capabilities=['qwen3guard'];
 else if(!M.draft.capabilities.length)M.draft.capabilities=m.probeProtocol==='embeddings'?['embeddings']:['chat'];
 M.editor();
};
M.editor=function(){
 const d=M.draft,m=rows().find(v=>v.id===d?.modelId);if(!m)return;
 const locked=fixed(m),supported=M.supportedRoles(d);
 const body=`<div class="la-role-editor mc-editor"><p class="la-edit-subject">${E(M.displayName(m))}</p>
 <fieldset class="mr-role-choices mc-capabilities"><legend>服务能力 <span>可多选</span></legend>${Object.entries(labels).filter(([id])=>locked?id==='qwen3guard':id!=='qwen3guard').map(([id,label])=>`<label><input type="checkbox" ${d.capabilities.includes(id)?'checked':''} ${locked?'disabled':''} onchange="App.modelRoles.toggleCapability('${id}',this.checked)"><span>${label}</span></label>`).join('')}</fieldset>
 <p class="hint">按当前模型服务实际支持的能力勾选。图片理解同时支持文本对话；向量输出需要该模型支持 Embeddings 接口。连接测试不替代模型效果评估。</p>${!locked&&M.capabilityIssue(m,d)?`<div class="mc-probe"><span>${E(M.capabilityIssue(m,d))}</span><button type="button" class="btn" ${d.capabilityTesting?'disabled':''} onclick="App.modelRoles.testCapabilities()">${d.capabilityTesting?'验证中…':'验证所选接口'}</button></div><p class="hint">验证会向已接入地址发送所需接口的最小请求，不保存 API Key。</p>`:''}
 <fieldset class="mr-role-choices"><legend>平台用途 <span>可多选</span></legend>${Object.entries(M.roles).map(([id,label])=>`<label class="${supported.includes(id)?'':'disabled'}"><input type="checkbox" ${d.roles.includes(id)?'checked':''} ${supported.includes(id)?'':'disabled'} onchange="App.modelRoles.toggleRole('${id}',this.checked)"><span>${label}</span></label>`).join('')}</fieldset>
 ${M.state(m)==='changed'?'<p class="error-message">连接已变更，请重新确认服务能力与用途。</p>':''}<p id="mr-error" class="error-message" role="alert"></p></div>`;
 A.modal('配置模型用途',body,'<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.modelRoles.save()">保存</button>');
};
M.toggleCapability=function(capability,on){
 const d=M.draft,m=rows().find(v=>v.id===d?.modelId);if(!d||fixed(m)||!labels[capability]||capability==='qwen3guard')return;
 d.capabilityController?.abort();delete d.capabilityController;delete d.capabilityTesting;
 const caps=new Set(d.capabilities);on?caps.add(capability):caps.delete(capability);
 if(capability==='vision'&&on)caps.add('chat');if(capability==='chat'&&!on)caps.delete('vision');
 d.capabilities=[...caps];d.roles=d.roles.filter(r=>M.supportedRoles(d).includes(r));M.editor();
};
M.toggleRole=function(role,on){const d=M.draft;if(!d||!M.supportedRoles(d).includes(role))return;d.roles=on?[...new Set([...d.roles,role])]:d.roles.filter(r=>r!==role);};
// Compatibility for older integrations; the editor itself uses capability checkboxes.
M.changeProtocol=function(protocol){if(!legacy[protocol]||!M.draft)return;M.draft.outputProtocol=protocol;M.draft.capabilities=[...legacy[protocol]];M.draft.roles=M.draft.roles.filter(r=>M.supportedRoles(M.draft).includes(r));M.editor();};
M.changeType=function(type){const protocol={basic:'chat',safety:'chat',embedding:'embeddings',multimodal:'multimodal-chat'}[type];if(protocol)M.changeProtocol(protocol);};
M.validate=function(value){
 const d=M.normalizeCapabilities(value),m=rows().find(v=>v.id===d.modelId);
 if(!m||(m.kind||'model')!=='model')return '模型不存在，请重新选择';
 if(d.capabilities.some(c=>!labels[c]))return '请选择有效的服务能力';
 if(d.capabilities.includes('vision')&&!d.capabilities.includes('chat'))return '图片理解需要同时配置文本对话';
 if(fixed(m)&&(d.capabilities.length!==1||d.capabilities[0]!=='qwen3guard'))return '该系统模型使用 Guard 安全分类接口';
 if(!fixed(m)&&d.capabilities.includes('qwen3guard'))return '护栏分类由平台 Guard 服务提供，请勿将普通对话模型标为护栏';
 if(d.roles.some(r=>!M.supportedRoles(d).includes(r)))return '所选用途与服务能力不匹配';
 const issue=M.capabilityIssue(m,d);if(issue)return issue;
 return '';
};
M.testCapabilities=async function(){
 const d=M.draft,m=rows().find(v=>v.id===d?.modelId);if(!m||d.capabilityTesting)return false;
 if(!M.connected(m)){document.getElementById('mr-error').textContent='请先在资产中心 → 模型完成连接测试，再验证所选接口';return false;}
 const fingerprint=JSON.stringify([m.model,m.endpoint,revision(m),d.capabilities]),controller=new AbortController();d.capabilityTesting=true;d.capabilityController=controller;M.editor();
 let error='';
 for(const protocol of M.requiredProtocols(d)){
  if(protocol===(m.probeProtocol||'chat'))continue;
  const result=await A.modelIntake.probe({...m,probeProtocol:protocol,useSavedKey:true},controller);
  if(M.draft!==d||controller.signal.aborted||fingerprint!==JSON.stringify([m.model,m.endpoint,revision(m),d.capabilities])){if(d.capabilityController===controller){delete d.capabilityTesting;delete d.capabilityController;if(M.draft===d)M.editor();}return false;}
  if(!result.ok){error=result.error;break;}
  (m.capabilityChecks||={})[protocol]={valid:true,assetRevision:revision(m),checkedAt:result.checkedAt};
 }
 delete d.capabilityTesting;delete d.capabilityController;A.save();M.editor();if(error)document.getElementById('mr-error').textContent=error;return !error;
};
const closeModal=A.closeModal;
A.closeModal=function(){M.draft?.capabilityController?.abort();if(M.draft){delete M.draft.capabilityTesting;delete M.draft.capabilityController;}return closeModal.apply(A,arguments);};
M.save=function(value){
 const d=M.normalizeCapabilities(value||M.draft),error=M.validate(d);
 if(error){const el=document.getElementById('mr-error');if(el)el.textContent=error;return false;}
 const m=rows().find(v=>v.id===d.modelId),old=M.get(m.id),caps=d.capabilities;
 const outputProtocol=caps.includes('qwen3guard')?'qwen3guard':caps.includes('vision')?'multimodal-chat':caps.includes('chat')?'chat':caps.includes('embeddings')?'embeddings':'unconfigured';
 const type=outputProtocol==='qwen3guard'?'safety':outputProtocol==='multimodal-chat'?'multimodal':outputProtocol==='embeddings'?'embedding':'basic';
 const record={modelId:m.id,capabilities:[...caps],type,outputProtocol,roles:[...new Set(d.roles)],confirmed:true,assetRevision:revision(m),revision:(old?.revision||0)+1,source:'user',updatedAt:new Date().toISOString(),schemaVersion:2};
 A.data.modelRoleAssignments[m.id]=record;
 A.contentSafety?.audit?.('model.roles.update',m.id,'配置模型用途：'+(m.model||m.name),{modelId:m.id,previous:old,current:copy(record),revision:record.revision});
 A.save();if(!value){A.closeModal();A.render();A.toast('模型用途已保存');}return copy(record);
};
// Role management has its own route and filters; asset intake keeps connection ownership.
M.filter.capability='';
M.managementCapabilities=m=>m._serviceType==='image'?['image-guard']:L.isManaged(m)||m._serviceType?['qwen3guard']:M.get(m.id)?.capabilities||[];
M.managementState=m=>L.isManaged(m)||m._serviceType?'ready':M.configured(m)&&M.get(m.id)?.roles.length?'ready':'unassigned';
M.managementRows=function(){
 const f=M.filter,q=f.query.trim().toLowerCase();
 return L.rows('models').filter(m=>{
  const roles=L.isManaged(m)||m._serviceType?['guard']:M.get(m.id)?.roles||[];
  return (!q||(m.model||m.name||'').toLowerCase().includes(q))&&(!f.role||roles.includes(f.role))&&(!f.capability||M.managementCapabilities(m).includes(f.capability))&&(!f.state||(f.state==='pending'?L.needsConfiguration(m):M.managementState(m)===f.state));
 });
};
M.openAssets=function(){Object.assign(A.modelIntake.filter,{query:'',state:''});A.platform.go('assets','models');};
M.renderManagement=function(){
 M.init();if(!['','ready','unassigned'].includes(M.filter.state))M.filter.state='';const f=M.filter,capabilities={...labels,'image-guard':'图片安全分类'},states={unassigned:'未配置',ready:'已配置'};
 const select=(key,label,values)=>`<select aria-label="${label}" onchange="App.modelRoles.filterBy('${key}',this.value)"><option value="">${label}</option>${Object.entries(values).map(([id,name])=>`<option value="${id}" ${f[key]===id?'selected':''}>${E(name)}</option>`).join('')}</select>`;
 const tags=values=>values.length?`<div class="mr-use-tags">${values.map(v=>A.badge(v,'blue')).join('')}</div>`:'<span class="muted">未配置</span>';
 const body=M.managementRows().map(m=>{
  const managed=L.isManaged(m)||!!m._serviceType,state=M.managementState(m);
  return `<tr><td><button class="link-btn" data-id="${E(m.id)}" onclick="App.leanAssets.open('models',this.dataset.id)">${E(M.displayName(m))}</button></td><td>${tags(M.managementCapabilities(m).map(c=>capabilities[c]||c))}</td><td>${managed?tags(['护栏']):L.purposes(m)}</td><td>${A.badge(states[state],state==='ready'?'green':state==='disabled'?'gray':'orange')}</td><td>${managed?'<span class="muted">平台维护</span>':`<button class="link-btn" data-id="${E(m.id)}" onclick="App.modelRoles.edit(this.dataset.id)">配置用途</button>`}</td></tr>`;
 }).join('');
 return `<div class="la-page mr-management">${A.policyUsability.modelContinuation()}${A.heading('','模型配置','为已接入模型配置服务能力与平台用途，同一模型可承担多种用途。','<button class="btn" onclick="App.modelRoles.openAssets()">接入与连接管理</button>')}<section class="card mr-model-list"><div class="toolbar mr-toolbar">${select('capability','全部服务能力',capabilities)}${select('role','全部用途',M.roles)}${select('state','全部配置状态',states)}<input type="search" aria-label="搜索模型名称" placeholder="搜索模型名称" value="${E(f.query)}" onchange="App.modelRoles.filterBy('query',this.value)"></div><div class="table-wrap"><table><thead><tr><th>模型名称</th><th>服务能力</th><th>平台用途</th><th>配置状态</th><th>操作</th></tr></thead><tbody>${body||'<tr><td colspan="5" class="empty">暂无符合条件的模型</td></tr>'}</tbody></table></div></section></div>`;
};
})();
