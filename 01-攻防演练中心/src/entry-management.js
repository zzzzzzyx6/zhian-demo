/* One delete action and confirmation contract for user-owned platform resources. */
(function(){
'use strict';
const A=window.App,X=A.attack,V=A.evaluation,S=A.scanProduct,C=A.connections,P=A.policies,B=A.banks,D=A.defensePolicies,CP=A.contentPolicies,R=A.safetyRules,G=A.platformGovernance,E=A.escape;
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString();
const EM=A.entryManagement={};
const remove=(list,id)=>{const at=list.findIndex(v=>v.id===id);if(at>=0)list.splice(at,1);};
const terminal=t=>['done','stopped','error','failed'].includes(t.status);
const busy=t=>!t.deletedAt&&!terminal(t);
const policies=()=>CP.db.filter(p=>!p.archived);
const usesRule=(p,id)=>arr(p.ruleIds).includes(id)||arr(p.customRules).some(r=>arr(r.assetIds).includes(id)||arr(r.groups).some(g=>arr(g.assetIds).includes(id)));
const usesReply=(p,id)=>p.replyTemplateId===id||p.reviewReplyTemplateId===id;
const runtimeTasks=()=>[...arr(X.db.tasks),...arr(S.db?.tasks)];
const definitions={
 'attack-task':{label:'演练任务',list:()=>X.db.tasks,reason:t=>terminal(t)?'':'请先停止任务，再删除任务记录',note:'任务将移至回收记录，配置、攻防记录与报告一并保留。',commit:t=>deleteAttack(t.id,true)},
 'scan-task':{label:'扫描任务',list:()=>S.db?.tasks||[],reason:t=>terminal(t)?'':'请先停止任务，再删除任务记录',note:'任务将移至回收记录，扫描配置和结果继续保留。',commit:t=>scanAction(t.id,'delete',true)},
 models:{label:'模型',list:()=>C.db,protected:m=>A.leanAssets.isManaged(m)||m.systemGuard||m._serviceType,reason:m=>A.modelIntake?.blockers?.(m.id)?.length?'该模型正被未完成任务使用，请先结束相关任务':A.contentSafety.apps.some(a=>A.protectionOps.active(a.id)&&A.protectionOps.policies(a.id).some(p=>p.embeddingModelId===m.id||p.detectorModelId===m.id))?'该模型正被运行中的应用防护使用，请先结束防护轮次':'',note:'应用关联与平台用途将同步移除，历史任务和报告继续保留。',commit:m=>deleteModel(m.id)},
 applications:{label:'应用',list:()=>A.data.aiApplications||[],reason:a=>A.protectionOps.active(a.id)?'该应用正在运行防护，请先结束当前防护轮次':'',note:'应用绑定和资产关联将移除，历史检测、风险事件与报告继续保留。',remove:a=>{
  (A.data.removedApplicationNames||={})[a.id]=a.name;
  if(A.contentSafety.db)A.contentSafety.db.bindings=arr(A.contentSafety.db.bindings).filter(b=>b.appId!==a.id);
  A.data.applicationAssetLinks=arr(A.data.applicationAssetLinks).filter(r=>r.appId!==a.id);
  remove(A.data.aiApplications,a.id);if(A.platform.applicationId===a.id)A.platform.applicationId=null;
 }},
 'attack-policy':{label:'攻击策略',list:()=>P.db,note:'策略将从可选列表移除，历史任务保存的策略版本和评估结果继续保留。',remove:p=>{remove(P.db,p.id);if(P.draft?.id===p.id)P.draft=null;if(A.policyUsability.pendingPolicy?.id===p.id)A.policyUsability.pendingPolicy=null;}},
 bank:{label:'攻击题库',list:()=>B.db,protected:b=>b.builtin===true,note:'策略草稿将移除该题库引用；已发布策略和历史任务保留原有题目快照。',remove:b=>{
  remove(A.data.banks||[],b.id);
  for(const p of P.db)if(p.bankIds?.includes(b.id)){p.bankIds=p.bankIds.filter(id=>id!==b.id);p.hasDraft=true;}
  for(const d of [P.draft,A.policyUsability.pendingPolicy])if(d?.bankIds)d.bankIds=d.bankIds.filter(id=>id!==b.id);
  for(const key of Object.keys(A.data.sceneAnnotations||{})){try{if(JSON.parse(key)[0]===b.id)delete A.data.sceneAnnotations[key];}catch(e){/* Unrelated legacy annotation. */}}
 }},
 template:{label:'自定义攻击模板',list:()=>P.templates,note:'策略草稿将移除该模板；已发布策略与历史任务继续使用各自保存的模板。',remove:t=>{
  const retained=P.db.some(p=>arr(p.revisions).some(r=>arr(r.methods).some(m=>m.id===t.id)))||arr(X.db.tasks).some(task=>arr(task.policySnapshot?.methods).some(m=>m.id===t.id));
  if(retained){A.data.retiredAttackMethodTemplates||=[];if(!A.data.retiredAttackMethodTemplates.some(m=>m.id===t.id))A.data.retiredAttackMethodTemplates.push(copy(t));}
  remove(P.templates,t.id);for(const p of P.db)if(p.methods.some(m=>m.id===t.id)){p.methods=p.methods.filter(m=>m.id!==t.id);p.hasDraft=true;}
  for(const d of [P.draft,A.policyUsability.pendingPolicy])if(d?.methods)d.methods=d.methods.filter(m=>m.id!==t.id);
 }},
 'defense-configuration':{label:'防护策略配置',list:()=>A.defenseConfigurations?.rows()||[],protected:p=>p.builtin===true,reason:p=>A.defenseConfigurations.bound(p.id).length?'该策略配置仍被应用绑定，请先切换应用绑定的策略':'',note:'历史防护轮次、检测与报告保留策略快照。',remove:p=>remove(A.defenseConfigurations.rows(),p.id)},
 'defense-policy':{label:'基础策略',list:()=>CP.db,protected:p=>p.isStandard===true||p.builtin===true||['cs-policy-input','cs-policy-output'].includes(p.id),reason:p=>D.references(p.id).length||(A.defenseConfigurations?.rows()||[]).some(c=>arr(c.basics).some(l=>l.policyId===p.id))?'该基础策略仍被应用或策略配置引用，请先移除引用':'',note:'历史任务和检测记录中的策略快照继续保留。',remove:p=>remove(CP.db,p.id)},
 reply:{label:'代答模板',list:()=>A.data.guardReplyTemplates||[],protected:t=>t.builtin===true||['reply-general','reply-pii','reply-context'].includes(t.id),reason:t=>policies().some(p=>usesReply(p,t.id)||arr(p.revisions).some(r=>usesReply(r,t.id)))||runtimeTasks().filter(busy).some(task=>[task.defense?.inputPolicySnapshot,task.defense?.outputPolicySnapshot].filter(Boolean).some(p=>usesReply(p,t.id)))?'该代答仍被策略或其发布版本引用，请先删除相关自定义策略或更换代答配置':'',note:'删除后，该代答将从策略的可选模板中移除。',remove:t=>remove(A.data.guardReplyTemplates,t.id)},
 'safety-rule':{label:'检测规则',list:()=>R.db,protected:r=>r.builtin===true||['cs-rule-prompt','cs-rule-pii','cs-rule-semantic'].includes(r.id),reason:r=>policies().some(p=>usesRule(p,r.id))||(A.defenseConfigurations?.rows()||[]).some(c=>arr(c.rules).some(l=>l.ruleId===r.id))?'该规则仍被防护策略引用，请先在策略配置中移除引用':'',note:'已发布策略和历史检测记录保留原规则快照。',remove:r=>remove(R.db,r.id)},
 'alert-rule':{label:'触发规则',list:()=>G.db?.rules||[],protected:r=>r.builtin===true||['risk-attack','risk-scan','risk-content'].includes(r.id),note:'删除后不再触发新事件，已产生的风险事件和触发证据继续保留。',remove:r=>remove(G.db.rules,r.id)},
 industry:{label:'行业',list:()=>arr(A.data.bankIndustries).map(name=>({id:name,name})),protected:r=>['安全通用','通用','金融','医疗','供应链'].includes(r.id),reason:r=>arr(A.data.banks).some(b=>B.industryLabel(b.industry)===r.id)?'该行业仍被题库使用，请先修改或删除相关题库':'',note:'该行业将从新建题库的选项中移除。',remove:r=>{A.data.bankIndustries=arr(A.data.bankIndustries).filter(name=>name!==r.id);if(B.draft?.industry===r.id){B.draft.industry='安全通用';B.draft.industryMode='general';}}}
};
for(const kind of ['code','packages','web'])definitions[kind]={label:{code:'代码',packages:'二进制/软件包',web:'Web'}[kind],list:()=>A.data.businessAssets?.[kind]||[],note:'应用关联将同步移除，历史任务、版本快照和报告继续保留。',reason:a=>V.allTasks().some(t=>busy(t)&&A.assessment.objectKey(t)===kind+':'+a.id)?'该资产正被未完成任务使用，请先结束相关任务':'',remove:a=>{
 for(const t of V.allTasks())if(A.assessment.objectKey(t)===kind+':'+a.id&&!t.targetSnapshot)t.targetSnapshot=copy(a);
 A.data.applicationAssetLinks=arr(A.data.applicationAssetLinks).filter(r=>r.assetKey!==kind+':'+a.id);remove(A.data.businessAssets[kind],a.id);
}};
EM.get=(kind,id)=>definitions[kind]?.list().find(v=>v.id===id&&!v.deletedAt);
EM.issue=function(kind,id){const def=definitions[kind],record=EM.get(kind,id);if(!def||!record)return '该条目已不存在';if(def.protected?.(record))return '平台内置条目不可删除';return def.reason?.(record)||'';};
EM.button=function(kind,id){const record=EM.get(kind,id),def=definitions[kind];if(!record||def.protected?.(record))return '';const issue=EM.issue(kind,id),label='删除'+def.label+' '+(record.name||record.model||id),taskBlocked=kind.endsWith('-task')&&!!issue;return `<button type="button" class="entry-delete" data-entry-kind="${E(kind)}" data-entry-id="${E(id)}" ${taskBlocked?'disabled title="运行中不可删除，请先停止任务"':`title="${E(issue||'删除')}"`} aria-label="${E(label)}" onclick="App.entryManagement.request(this.dataset.entryKind,this.dataset.entryId)">${A.icon('trash',16)}</button>`;};
EM.request=function(kind,id){
 const record=EM.get(kind,id),def=definitions[kind],issue=EM.issue(kind,id);if(issue){A.toast(issue);return false;}
 A.modal('删除'+def.label,`<p>确定删除「${E(record.name||record.model||id)}」？</p><p class="hint">${def.note}</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button type="button" class="entry-delete" data-entry-kind="${E(kind)}" data-entry-id="${E(id)}" onclick="App.entryManagement.confirm(this.dataset.entryKind,this.dataset.entryId)" aria-label="删除" title="删除">${A.icon('trash',16)}</button>`,{plain:true});return true;
};
EM.confirm=function(kind,id){
 const def=definitions[kind],record=EM.get(kind,id),issue=EM.issue(kind,id);if(issue){A.closeModal();A.toast(issue);return false;}
 if(def.commit)return def.commit(record);
 def.remove(record);G.audit('entry.delete',id,'删除'+def.label+'：'+(record.name||id),{entryType:kind});
 A.save();A.closeModal();A.closeDrawer();A.render();if(kind==='industry'&&B.draft)B.edit();A.toast(def.label+'已删除');return true;
};

// Keep existing task recycling and credential cleanup as the underlying mutations.
const deleteAttack=V.deleteTask,scanAction=S.action,deleteModel=C.removeConfirm;
V.deleteTask=function(id,confirmed=false){if(confirmed)return deleteAttack.call(V,id,true);EM.request('attack-task',id);return false;};
S.action=function(id,action,confirmed=false){if(action==='delete'&&!confirmed){EM.request('scan-task',id);return false;}return scanAction.apply(S,arguments);};
C.remove=id=>EM.request('models',id);
const appName=A.contentSafety.appName;
A.contentSafety.appName=function(id){return A.contentSafety.app(id)?.name||A.data.removedApplicationNames?.[id]||appName.call(this,id);};
// Retired templates stay resolvable only for frozen revisions and historical retests.
for(const template of arr(A.data.retiredAttackMethodTemplates))P.registerTemplate(template);
const method=P.method;
P.method=function(id){return method.call(P,id)||arr(A.data.retiredAttackMethodTemplates).find(m=>m.id===id);};
const validate=P.validate;
P.validate=function(d,publishing=true){const error=validate.call(P,d,publishing);if(error||!publishing)return error;if(d.methods.some(m=>!P.methods().some(live=>live.id===m.id)))return '所选攻击方法已删除，请重新选择';return '';};
const methodDetail=P.methodDetail;
P.methodDetail=function(id){const draw=A.drawer;A.drawer=function(title,body,footer,options){return draw.call(A,title,body,(footer||'')+EM.button('template',id),options);};try{return methodDetail.apply(P,arguments);}finally{A.drawer=draw;}};
const bankOpen=B.open;
B.open=function(id){const draw=A.drawer;A.drawer=function(title,body,footer,options){return draw.call(A,title,body,(footer||'')+EM.button('bank',id),options);};try{return bankOpen.apply(B,arguments);}finally{A.drawer=draw;}};
})();
