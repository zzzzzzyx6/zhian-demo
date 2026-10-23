/* Policy editing, complete-bank selection and navigation back from model setup. */
(function(){
'use strict';
const A=window.App,P=A.policies,B=A.banks,C=A.connections,X=A.attack,N=A.platform,D=A.defensePolicies,R=A.safetyRules,E=A.escape;
const copy=v=>JSON.parse(JSON.stringify(v)),U=A.policyUsability={pendingPolicy:null,pendingTask:null};
const schema=id=>P.parameterSchema?.(id)||A.attackCatalogue.schemas[id]||[];

B.industryLabel=value=>!value||['通用','安全通用'].includes(value)?'安全通用':String(value).trim();
const presetIndustries=['安全通用','金融','医疗','供应链'];
B.industries=()=>[...new Set([...presetIndustries,...(A.data.bankIndustries||[]),...(A.data.banks||[]).map(b=>B.industryLabel(b.industry))])];
B.industryField=function(d){
 d.industry=B.industryLabel(d.industry);d.industryMode=d.industry==='安全通用'?'general':'custom';
 const custom=!presetIndustries.includes(d.industry);
 return `<div class="bank-industry-fields"><div class="field"><label for="bank-industry-mode">行业</label><div class="pu-industry-select"><select id="bank-industry-mode" onchange="App.banks.changeIndustry(this.value)">${B.industries().map(v=>`<option value="${E(v)}" ${!d.addingIndustry&&d.industry===v?'selected':''}>${E(v)}</option>`).join('')}<option value="__other__" ${d.addingIndustry?'selected':''}>其他行业</option></select>${custom&&!d.addingIndustry?A.entryManagement.button('industry',d.industry):''}</div></div>${d.addingIndustry?`<div class="field"><label for="bank-industry">其他行业名称 *</label><div class="pu-industry-create"><input id="bank-industry" maxlength="32" autocomplete="off" value="${E(d.newIndustry||'')}" placeholder="输入行业名称" oninput="App.banks.draft.newIndustry=this.value"><button class="btn" type="button" onclick="App.banks.confirmIndustry()">确认添加</button></div></div>`:''}</div>`;
};
B.changeIndustry=function(value){const d=B.draft;if(!d)return;if(value==='__other__'){d.addingIndustry=true;d.newIndustry='';}else if(B.industries().includes(value)){d.industry=value;d.industryMode=value==='安全通用'?'general':'custom';d.addingIndustry=false;}else return;d.industryTouched=true;d.message='';B.edit();if(d.addingIndustry)document.getElementById('bank-industry')?.focus();};
B.confirmIndustry=function(){const d=B.draft;if(!d?.addingIndustry)return false;const name=String(d.newIndustry||'').trim();if(!name||name.length>32||name==='其他行业'){d.message='请填写 1–32 个字符的行业名称';B.edit();return false;}A.data.bankIndustries=[...new Set([...(A.data.bankIndustries||[]),name])];d.industry=name;d.industryMode='custom';d.industryTouched=true;d.addingIndustry=false;d.newIndustry='';d.message='';A.save();B.edit();return true;};
const saveBank=B.saveDraft;
B.saveDraft=function(){if(B.draft?.addingIndustry){B.draft.message='请先确认添加行业，或选择已有行业';B.edit();return false;}return saveBank.apply(B,arguments);};
// A question bank is populated from uploaded files only.
B.pickTasks=B.extractStart=B.extractConfirm=B.extractRender=B.extractSave=function(){A.toast('请通过上传 JSON 文件添加题目');return false;};
B.catalogTable=function(){return B.catalogRows().map(b=>`<tr><td><button class="link-btn" data-bank="${E(b.id)}" onclick="App.banks.open(this.dataset.bank)">${E(b.name)}</button></td><td><span class="bank-source ${b.builtin?'builtin':'custom'}">${b.builtin?'系统':'自建'}</span></td><td>${E(B.industryLabel(b.industry))}</td><td>${b.items.length.toLocaleString()}</td><td><div class="lo-actions">${b.builtin?'':`<button class="link-btn" data-bank="${E(b.id)}" onclick="App.banks.create(this.dataset.bank)">编辑</button>`}<button class="link-btn" data-bank="${E(b.id)}" onclick="App.banks.export(this.dataset.bank)">导出</button>${A.entryManagement.button('bank',b.id)}</div></td></tr>`).join('')||'<tr><td colspan="5" class="empty">没有符合条件的攻击题库</td></tr>';};

P.parameterFor=function(entry){
 const fields=schema(entry.id),method=P.method(entry.id);
 if(!fields.length)return `<p class="pu-method-default">${method?.kind==='template'?'已设定文本模板，无需填写额外参数。':'已设定默认配置，无需填写额外参数。'}</p>`;
 return '<div class="policy-param-grid">'+fields.map(f=>{
  const value=entry.parameters?.[f.key]??f.value,id='param-'+entry.id+'-'+f.key,attrs=`data-method="${E(entry.id)}" data-key="${E(f.key)}"`,action='App.policies.setParameter(this.dataset.method,this.dataset.key,this.value)';
  const input=f.type==='textarea'?`<textarea id="${E(id)}" rows="2" ${attrs} oninput="${action}">${E(value)}</textarea>`:f.type==='select'?`<select id="${E(id)}" ${attrs} onchange="${action}">${f.options.map(o=>`<option value="${E(String(o.value))}" ${o.value===value?'selected':''}>${E(o.label)}</option>`).join('')}</select>`:`<input id="${E(id)}" type="${f.type}" value="${E(String(value))}" ${f.type==='number'?`min="${f.min}" max="${f.max}" step="${f.step||1}"`:'maxlength="200"'} ${attrs} oninput="${action}">`;
  return `<div class="field ${f.type==='textarea'?'full':''}"><label for="${E(id)}">${E(f.label)}</label>${input}</div>`;
 }).join('')+'</div>';
};
P.methodChoicesHTML=function(){
 const d=P.draft,methods=[...P.methods(),...d.methods.filter(m=>!P.methods().some(v=>v.id===m.id)).map(m=>({...P.method(m.id),id:m.id,name:(P.method(m.id)?.name||m.id)+' · 原配置'}))];
 return methods.map(m=>{const entry=d.methods.find(v=>v.id===m.id);return `<section id="policy-choice-${E(m.id)}" class="pu-method-choice ${entry?'selected':''}"><label><input type="checkbox" ${entry?'checked':''} data-method="${E(m.id)}" onchange="App.policies.toggleMethod(this.dataset.method,this.checked)"><span>${E(m.name)}</span></label><div class="pu-method-parameters" id="policy-parameters-${E(m.id)}" ${entry?'':'hidden'}>${entry?P.parameterFor(entry):''}</div></section>`;}).join('');
};
P.toggleMethod=function(id,checked){
 const d=P.draft;if(!d||!P.method(id))return;
 if(checked&&!d.methods.some(m=>m.id===id))d.methods.push({id,parameters:P.defaults(id)});
 if(!checked)d.methods=d.methods.filter(m=>m.id!==id);
 const host=document.getElementById('policy-choice-'+id),fields=document.getElementById('policy-parameters-'+id),entry=d.methods.find(m=>m.id===id);
 host?.classList.toggle('selected',!!entry);if(fields){fields.hidden=!entry;fields.innerHTML=entry?P.parameterFor(entry):'';}
};
P.bankQuery='';P.bankIndustry='';
P.bankChoicesHTML=function(){const q=P.bankQuery.trim().toLowerCase(),rows=B.db.filter(b=>(!q||b.name.toLowerCase().includes(q))&&(!P.bankIndustry||B.industryLabel(b.industry)===P.bankIndustry));return rows.map(b=>`<label><input type="checkbox" ${P.draft.bankIds.includes(b.id)?'checked':''} data-bank="${E(b.id)}" onchange="App.policies.toggleBank(this.dataset.bank,this.checked)"><span>${E(b.name)}</span><small>${b.items.length} 题</small></label>`).join('')||'<p class="series-empty">暂无匹配题库</p>';};
P.filterBanks=function(key,value){if(!['bankQuery','bankIndustry'].includes(key))return;P[key]=value;const host=document.getElementById('policy-bank-choices');if(host)host.innerHTML=P.bankChoicesHTML();};
const edit=P.edit;
P.edit=function(){P.bankQuery='';P.bankIndustry='';return edit.apply(P,arguments);};
P.editor=function(){
 const d=P.draft;if(!d)return;d.judgement=P.judgementFor(d);d.selectionMode='all';delete d.sampleLimit;const j=d.judgement;
 const body=`<div class="policy-editor"><div class="field"><label for="policy-name">策略名称 *</label><input id="policy-name" maxlength="100" value="${E(d.name)}" oninput="App.policies.draft.name=this.value"></div><div class="field"><label for="policy-description">策略说明</label><input id="policy-description" maxlength="300" value="${E(d.description||'')}" oninput="App.policies.draft.description=this.value"></div>
 <section class="policy-editor-section"><div class="policy-section-title"><h3>攻击方法 *</h3></div>${P.selectionHTML('methods')}<div id="policy-method-parameters">${P.selectedMethodsHTML()}</div></section>
 <section class="policy-editor-section"><div class="policy-section-title"><h3>攻击题库 *</h3></div>${P.selectionHTML('banks')}<div class="ps-selected-banks" id="policy-selected-banks">${P.selectedBanksHTML()}</div></section>
 <p id="policy-editor-error" class="error-message" role="alert"></p></div>`;
 A.modal(d.id?'编辑攻击策略':'新建攻击策略',body,`<button class="btn" onclick="${P.taskPolicyReturn?.draft===d?'App.policies.returnToTask()':'App.closeModal()'}">取消</button><button class="btn primary" onclick="App.policies.save(true)">保存策略</button>`,{wide:true});
};
// Complete banks may be large: do not report a published revision if persistence fails.
P.save=function(){
 const publish=true;
 const d=P.draft;if(!d)return false;d.judgement=A.openrtJudge.fixedJudgement(d);const error=P.validate(d,publish),message=document.getElementById('policy-editor-error');
 if(error){if(message)message.textContent=error;return false;}
 const policy=copy(d);policy.id ||= 'policy-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);policy.name=policy.name.trim();policy.description=(policy.description||'').trim();policy.selectionMode='all';delete policy.sampleLimit;policy.judgement=P.judgementFor(policy);delete policy.judgeConfig;for(const m of policy.methods){delete m.modelBindings;delete m.modelSnapshots;}policy.revisions ||= [];policy.hasDraft=!publish;
 if(publish)policy.revisions.push(P.freeze(policy,(policy.revisions.at(-1)?.version||0)+1));
 const list=P.db.slice(),at=list.findIndex(p=>p.id===policy.id);if(at<0)list.push(policy);else list[at]=policy;
 try{localStorage.setItem('zhian-standalone-attack',JSON.stringify(A.storageCodec?A.storageCodec.encode({...A.data,attackPolicies:list}):{...A.data,attackPolicies:list}));}catch(e){if(message)message.textContent='浏览器存储空间不足或不可用，策略尚未保存。请清理不再使用的本地记录后重试。';return false;}
 A.data.attackPolicies=list;A.storageOK=true;A.platformNotifications?.sync();A.closeModal();if(P.taskPolicyReturn?.draft===d)P.returnToTask(policy);else P.redraw();A.toast('策略已保存，可在攻防任务中选择');return policy;
};

// Model setup is available inside every opened picker; the in-progress form is retained.
C.assetPickerContent=function(s,id){
 const models=C.assetCandidates(s.role).filter(m=>m.kind!=='agent').sort((a,b)=>String(a.name||a.model).localeCompare(String(b.name||b.model),'en',{numeric:true}));s.models=models;const chosen=models.find(m=>m.id===s.value),role=A.modelRoles.roles[s.role]||'所选用途';
 return `<button type="button" id="${E(id)}" class="series-trigger ${chosen?'has-value':''}" aria-label="${id==='task-model'?'演练靶标':role+'模型'}" aria-expanded="${s.open}" aria-controls="${E(id)}-panel" data-picker="${E(id)}" onclick="App.connections.toggleAssetPicker(this.dataset.picker)"><span>${E(chosen?.name||chosen?.model||(id==='task-model'?'请选择演练靶标':'请选择模型'))}</span><span aria-hidden="true">⌄</span></button><div class="asset-picker-panel" id="${E(id)}-panel" ${s.open?'':'hidden'}><div class="series-options pu-picker-options">${models.map((m,i)=>`<button type="button" aria-pressed="${m.id===s.value}" data-picker="${E(id)}" onclick="App.connections.chooseAsset(this.dataset.picker,${i})">${E(m.name||m.model)}</button>`).join('')||`<p class="series-empty">暂无可用${E(role)}模型。请在平台管理 → 模型配置中配置${E(role)}用途；尚未接入的模型请先到资产中心接入。</p>`}</div><div class="pu-picker-footer"><span>在平台管理中配置模型用途</span><button type="button" class="link-btn" data-picker="${E(id)}" onclick="App.policyUsability.configureModels(this.dataset.picker)">配置用途 →</button></div></div>`;
};
C.assetPicker=function(role,value,id){return `<div class="asset-picker" id="${E(id)}-picker">${C.assetPickerContent(C.pickerState(role,id,value),id)}</div>`;};
U.configureModels=function(id){U.pendingPolicy=null;U.pendingTask=null;C.closeAssetPickers();Object.assign(A.modelRoles.filter,{query:'',type:'',role:'',state:'',capability:''});N.go('management','model-roles');};
U.resumePolicy=U.resumeTask=()=>false;
const renderModels=A.modelRoles.render;
U.modelContinuation=()=>'';
A.modelRoles.render=function(){return U.modelContinuation()+renderModels.apply(this,arguments);};

const renderDefense=A.contentPolicies.render;
U.defenseTabs=()=>`<div class="tabs dp-tabs">${[['policies','防护策略'],['replies','代答库'],['rules','规则库']].map(([id,name])=>`<button class="tab ${D.tab===id?'active':''}" data-tab="${id}" onclick="App.defensePolicies.filter('tab',this.dataset.tab)">${name}</button>`).join('')}</div>`;
A.contentPolicies.render=function(){
 if(D.tab!=='rules')return renderDefense.apply(this,arguments);
 R.libraryTab='rules';const rendered=R.render(),start=rendered.indexOf('<section class="card">');
 return `<div class="defense-product lean-operations">${A.heading('','防护策略','',`<button class="btn primary" onclick="App.safetyRules.edit()">＋ 新建规则</button>`)}${U.defenseTabs()}${start>=0?rendered.slice(start):''}</div>`;
};
const filterDefense=D.filter;
D.filter=function(key,value){if(key==='tab'&&['policies','replies','rules'].includes(value)){N.go('policy','defense',value);return;}return filterDefense.apply(D,arguments);};
})();
