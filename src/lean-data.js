/* A small initial dataset. Only identifiable bundled fixtures are archived. */
(function(){
'use strict';
const A=window.App,X=A.attack,S=A.contentSafety,G=A.platformGovernance;
const copy=v=>JSON.parse(JSON.stringify(v)),rows=v=>Array.isArray(v)?v:[];
const catalogIds=new Set(['EV-260920-101','EV-260919-077','EV-260918-210','EV-260910-033']);
const rankIds=new Set(['EV-DEMO-RANK-m1','EV-DEMO-RANK-qwen25-32b','EV-DEMO-RANK-qwen25-7b','EV-DEMO-RANK-llama31-8b','EV-DEMO-RANK-llama31-70b','EV-DEMO-RANK-llama31-405b']);
const originalIds=new Set(['EV-260916-001','EV-260914-003','EV-260915-008','EV-260915-006']);
const sampleId='EV-260918-210';
const L=A.leanData={version:1,sampleId};
L.isPresetTask=t=>!!t&&(catalogIds.has(t.id)&&t.simulated===true&&['task-catalog-v1','task-catalog-v2'].includes(t.demoPreset)||rankIds.has(t.id)&&t.demoPreset==='model-results-v1'||originalIds.has(t.id));
const catalogDefaults={
 'EV-260920-101':['Qwen2.5-72B-Instruct 对话越狱持续监测','m1',8,'Direct|PAIR|DeepInception',4,4,24,'existing'],
 'EV-260919-077':['Qwen2.5-32B-Instruct 多轮对话安全演练','qwen25-32b',12,'PAIR',4,1,24,'guard'],
 'EV-260918-210':['Qwen2.5-72B-Instruct 对话指令安全评估','m1',8,'Direct|PAIR|DeepInception',1,4,24,'guard'],
 'EV-260910-033':['Qwen2.5-7B-Instruct 发布前安全回归','qwen25-7b',8,'Direct|PAIR|DeepInception|CipherChat|FlipAttack',4,4,56,'guard']
};
const rankNames={m1:'Qwen2.5-72B-Instruct','qwen25-32b':'Qwen2.5-32B-Instruct','qwen25-7b':'Qwen2.5-7B-Instruct','llama31-8b':'Llama-3.1-8B-Instruct','llama31-70b':'Llama-3.1-70B-Instruct','llama31-405b':'Llama-3.1-405B-Instruct'};
L.isUntouchedPresetTask=function(t){
 if(!L.isPresetTask(t)||t.deletedAt||t.updatedAt||t.editedAt||t.modifiedAt||t.userModified||t.userEdited||t.terminationReason==='用户终止')return false;
 if(rows(S.db?.audit).some(a=>(a.entity===t.id||a.taskId===t.id)&&!String(a.kind||a.action).startsWith('risk.')&&/(?:rename|edit|update|stop|delete|restore)/.test(a.kind||a.action||'')))return false;
 let expected=catalogDefaults[t.id];
 if(rankIds.has(t.id)){const id=t.id.slice('EV-DEMO-RANK-'.length);expected=[rankNames[id]+' 通用安全演练',id,30,'Direct|DeepInception',1,4,60,'existing'];}
 // Older fixtures without an exact current signature are kept conservatively.
 if(!expected)return false;
 const actual=[t.name,t.model,t.sampleCount,rows(t.engine?.methods).join('|'),t.engine?.maxRounds,t.engine?.concurrency,rows(t.units).length,t.defense?.mode];
 return JSON.stringify(actual)===JSON.stringify(expected);
};
L.isPresetRequest=r=>!!r&&(r.seedFixture===true||r.source==='fixture'&&r.metadata?.account==='fixture-user'&&r.metadata?.channel==='演示样例'&&['cs-app-service','cs-app-office'].includes(r.appId));
L.counts=()=>({attack:rows(A.data.attack?.tasks).filter(t=>!t.deletedAt).length,scan:rows(A.data.scanProduct?.tasks).filter(t=>!t.deletedAt).length,models:rows(A.data.attack?.models).length,applications:rows(A.data.aiApplications).length,code:rows(A.data.businessAssets?.code).length,packages:rows(A.data.businessAssets?.packages).length,web:rows(A.data.businessAssets?.web).length,requests:rows(S.db?.requests).length,sessions:rows(S.db?.protectionSessions).length,reports:rows(S.db?.protectionReports).length,riskEvents:rows(A.data.platformRisk?.events).length});
function collectStrings(value,out){if(typeof value==='string')out.add(value);else if(Array.isArray(value))value.forEach(v=>collectStrings(v,out));else if(value&&typeof value==='object')Object.values(value).forEach(v=>collectStrings(v,out));return out;}
function archive(list,predicate,backup,key){if(!Array.isArray(list))return [];const selected=list.filter(predicate);if(!selected.length)return [];backup[key]=[...rows(backup[key]),...copy(selected)];for(let i=list.length-1;i>=0;i--)if(selected.includes(list[i]))list.splice(i,1);return selected;}
function modelIsUntouchedPreset(m){
 if((m.configurationRevision||1)>1||m.seriesSchema>=4||m.updatedAt||A.data.modelRoleAssignments?.[m.id]?.source==='user')return false;
 const defaults={
  'agent-dify':['','https://api.dify.ai/v1/chat-messages'],
  'agent-coze':['','https://api.coze.cn/v3/chat'],
  'qwen25-7b':['Qwen2.5-7B-Instruct','https://model.example/qwen25-7b'],
  'qwen25-32b':['Qwen2.5-32B-Instruct','https://model.example/qwen25-32b'],
  'llama31-8b':['Llama-3.1-8B-Instruct','https://model.example/llama31-8b'],
  'llama31-70b':['Llama-3.1-70B-Instruct','https://model.example/llama31-70b'],
  'llama31-405b':['Llama-3.1-405B-Instruct','https://model.example/llama31-405b']
 };
 const expected=defaults[m.id];return !!expected&&m.model===expected[0]&&m.endpoint===expected[1]&&(!m.id.startsWith('agent-')||m.presetPending===true&&!m.botId&&m.userId==='security-demo');
}
L.migrate=function(){
 if(L.migrating||!A.data.attack||!S.db||!A.data.scanProduct)return false;
 if(A.data.leanInitialDataset?.version>=L.version)return false;
 L.migrating=true;
 try{
  const state=A.data.leanInitialDataset={version:0,migratedAt:new Date().toISOString(),before:L.counts(),archive:{}};
  const backup=state.archive,audit=rows(S.db.audit),links=rows(A.data.applicationAssetLinks);
  const presetTasks=rows(X.db.tasks).filter(L.isPresetTask),presetTaskIds=new Set(presetTasks.map(t=>t.id));
  const removedTasks=archive(X.db.tasks,t=>L.isUntouchedPresetTask(t)&&t.id!==sampleId,backup,'attackTasks');
  const sample=X.db.tasks.find(t=>t.id===sampleId&&L.isPresetTask(t));
  if(sample){backup.sampleBefore=copy(sample);if(L.isUntouchedPresetTask(sample)){sample.name='模型安全评估 · 示例';sample.description='用于体验评估流程的固定示例，非实际模型测评结果。';sample.demoHold=true;}sample.example=true;sample.resultSource='example';}
  if(removedTasks.some(t=>t.id===X.selected))X.selected=null;
  if(removedTasks.some(t=>t.id===X.arena?.taskId)){X.arena.taskId=null;X.arena.unitId=null;X.arena.replay=null;}

  // Fixtures must never become evidence that an application sent live traffic.
  const requestBefore=rows(S.db.requests).slice(),presetRequestIds=new Set(requestBefore.filter(L.isPresetRequest).map(r=>r.id));
  const retiredSessions=archive(S.db.protectionSessions,s=>{
   const requests=requestBefore.filter(r=>r.sessionId===s.id);
   const userOperation=audit.some(a=>['protection.start','protection.stop'].includes(a.kind||a.action)&&a.entity===s.id);
   return !userOperation&&requests.length>0&&requests.every(r=>presetRequestIds.has(r.id));
  },backup,'protectionSessions');
  const retiredSessionIds=new Set(retiredSessions.map(s=>s.id));
  archive(S.db.protectionReports,r=>retiredSessionIds.has(r.sessionId)||rows(r.requests).length>0&&r.requests.every(v=>presetRequestIds.has(typeof v==='string'?v:v.id)),backup,'protectionReports');
  archive(S.db.reviews,r=>presetRequestIds.has(r.requestId),backup,'reviews');
  archive(S.db.samples,r=>presetRequestIds.has(r.requestId),backup,'samples');
  archive(S.db.requests,r=>presetRequestIds.has(r.id),backup,'requests');
  for(const b of rows(S.db.bindings)){
   const hadSeedSession=retiredSessions.some(s=>s.appId===b.appId),hasActive=rows(S.db.protectionSessions).some(s=>s.appId===b.appId&&s.state==='active');
   if(hadSeedSession&&!hasActive){(backup.bindings ||= []).push(copy(b));b.enabled=false;b.protectionState='off';if(b.runtime){b.runtime.inputMode='off';b.runtime.outputMode='off';}}
  }

  const eventSeed=e=>presetTaskIds.has(e.taskId)||presetRequestIds.has(e.recordId);
  archive(A.data.platformRisk?.events,e=>rows(e.evidence).length>0&&e.evidence.every(eventSeed),backup,'riskEvents');
  // A mixed event is recomputed from its genuine evidence; its original snapshot stays archived.
  for(const e of rows(A.data.platformRisk?.events)){
   if(!rows(e.evidence).some(eventSeed))continue;
   (backup.mixedRiskEvents ||= []).push(copy(e));e.evidence=e.evidence.filter(v=>!eventSeed(v));e.count=e.evidence.length;
   if(e.lastWindow)e.lastWindow.count=e.evidence.length;
   e.fixtureEvidenceRemoved=true;
  }
  archive(A.data.platformRisk?.events,e=>e.fixtureEvidenceRemoved&&e.count<(e.ruleSnapshot?.threshold||1),backup,'riskEvents');
  const retiredRiskIds=new Set(rows(backup.riskEvents).map(e=>e.id));
  archive(S.db.audit,a=>((a.kind||a.action)==='risk.trigger'&&retiredRiskIds.has(a.riskEventId||a.entity))||presetRequestIds.has(a.requestId),backup,'fixtureAudit');

  // Keep configured assets and every dependency used by a surviving task, policy or application.
  const references=collectStrings([X.db.tasks,A.data.attackPolicies,A.data.contentSafetyPolicies,A.data.scanProduct.tasks,links,S.db.requests,S.db.protectionReports,S.db.protectionSessions],new Set());
  const removedModels=archive(X.db.models,m=>modelIsUntouchedPreset(m)&&!references.has(m.id)&&!references.has('models:'+m.id),backup,'models');
  for(const m of removedModels)if(A.data.modelRoleAssignments?.[m.id]){(backup.modelRoles ||= {})[m.id]=copy(A.data.modelRoleAssignments[m.id]);delete A.data.modelRoleAssignments[m.id];}
  const userAppChange=id=>audit.some(a=>(a.appId===id||a.entity===id)&&['application.save','asset.update','binding.configure','binding.update','protection.start','protection.stop'].includes(a.kind||a.action));
  const appReferenced=id=>links.some(l=>l.appId===id)||rows(S.db.requests).some(r=>r.appId===id)||rows(S.db.protectionSessions).some(r=>r.appId===id)||rows(S.db.protectionReports).some(r=>r.appId===id)||rows(A.data.scanProduct.tasks).some(t=>t.targetId===id||t.applicationId===id);
  const removedApps=archive(A.data.aiApplications,a=>a.id==='cs-app-office'&&a.name==='内部知识助手'&&a.scene==='办公问答'&&a.owner==='企业信息中心'&&a.environment==='测试环境'&&a.description==='为员工提供知识问答。'&&!a.updatedAt&&!rows(a.versions).length&&rows(a.scanMaterials).every(m=>m.id==='cs-app-office-source'&&m.fixtureType==='app-scan')&&!userAppChange(a.id)&&!appReferenced(a.id),backup,'applications');
  const retiredAppIds=new Set(removedApps.map(a=>a.id));
  archive(S.db.bindings,b=>retiredAppIds.has(b.appId),backup,'bindings');
  for(const a of rows(A.data.aiApplications)){
   if(!['cs-app-service','cs-app-office'].includes(a.id))continue;
   if(!a.updatedAt&&!userAppChange(a.id))a.example=true;
   archive(a.scanMaterials,m=>m.fixtureType==='app-scan'&&[a.id+'-source'].includes(m.id)&&!rows(A.data.scanProduct.tasks).some(t=>t.targetMaterial?.id===m.id),backup,'applicationMaterials');
  }
  const webUsed=id=>links.some(l=>l.assetKey==='web:'+id)||rows(A.data.scanProduct.tasks).some(t=>t.targetId===id)||audit.some(a=>(a.assetId===id||a.entity===id)&&['asset.update','asset.create'].includes(a.kind||a.action));
  archive(A.data.businessAssets?.web,a=>a.id==='asset-web-portal'&&a.fixtureType==='web-scan'&&a.name==='企业服务门户'&&a.url==='https://portal.example.com'&&!a.updatedAt&&!webUsed(a.id),backup,'webAssets');

  for(const type of ['text','image']){
   const service=A.data.defenseServices?.[type];if(!service)continue;
   const preset=type==='text'?service.id==='system-qwen3guard':service.id==='dedicated-singguard';
   const userConfigured=audit.some(a=>(a.kind||a.action)==='detector.configure'&&a.entity===service.id);
   if(preset&&service.version===1&&service.status==='ready'&&!userConfigured){(backup.defenseServices ||= {})[type]=copy(service);service.status='unconfigured';service.example=true;}
  }
  S.apps=A.data.aiApplications;
  A.modelRoles?.init();
  state.version=L.version;state.after=L.counts();A.save();return true;
 }finally{L.migrating=false;}
};

// A displayed example never triggers operational risk rules, even after rule edits.
const sourceRecords=G.sourceRecords;
G.sourceRecords=function(source,metric){
 const result=sourceRecords.apply(G,arguments);
 if(source==='attack'){const excluded=new Set(rows(X.db?.tasks).filter(t=>L.isPresetTask(t)||t.resultSource==='example'||t.example===true).map(t=>t.id));return result.filter(r=>!excluded.has(r.taskId));}
 if(source==='content'){const excluded=new Set(rows(S.db?.requests).filter(L.isPresetRequest).map(r=>r.id));return result.filter(r=>!excluded.has(r.recordId));}
 return result;
};

// Older records may distribute different questions to each method. The current
// executor repeats every selected method over one shared question set.
L.legacyRetestMismatch=function(task){
 if(!task)return false;
 const saved=[task.runSnapshot?.policy,task.policySnapshot].filter(Boolean);
 if(saved.some(p=>p.legacy!==true&&p.policyId&&rows(p.methods).length&&rows(p.bankSnapshot?.items).length))return false;
 const policy=saved[0]||A.policies.legacy(task),methods=rows(policy.methods).map(m=>m.id),items=rows(policy.bankSnapshot?.items),questions=items.map(q=>q.id),units=rows(task.units);
 if(!methods.length||!questions.length||new Set(methods).size!==methods.length||new Set(questions).size!==questions.length||units.length!==methods.length*questions.length)return true;
 const methodSet=new Set(methods),questionSet=new Set(questions),pairs=new Set();
 for(const u of units){if(!methodSet.has(u.method)||!questionSet.has(u.questionId))return true;pairs.add(JSON.stringify([u.method,u.questionId]));}
 return pairs.size!==units.length;
};
const quickRetest=X.quickRetest,startQuickRetest=X.startQuickRetest,repeatTask=X.repeatTask;
X.quickRetest=function(id){
 const task=X.db.tasks.find(t=>t.id===id);if(!L.legacyRetestMismatch(task))return quickRetest.apply(X,arguments);
 A.modal('调整后复测','<p>该历史记录无法直接还原同配置复测。请重新选择已发布策略，原评估记录会保留。</p>',`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" data-task="${A.escape(id)}" onclick="App.closeModal();App.attack.repeatTask(this.dataset.task,true)">调整后复测</button>`);
 return false;
};
X.startQuickRetest=function(id){const task=X.db.tasks.find(t=>t.id===id);if(L.legacyRetestMismatch(task)){X.quickRetest(id);return false;}return startQuickRetest.apply(X,arguments);};
X.repeatTask=function(id){
 const result=repeatTask.apply(X,arguments),task=X.db.tasks.find(t=>t.id===id);
 if(L.legacyRetestMismatch(task)&&X.wizard){Object.assign(X.wizard,{policySnapshot:null,policyRef:'',lockExecution:false,executionSnapshot:null,judge:'',step:2});A.policies.applyTaskPolicy(X.wizard);X.wizardModal();}
 return result;
};
const start=A.start;
A.start=function(){const result=start.apply(A,arguments);L.migrate();return result;};
})();
