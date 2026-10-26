/* Platform-managed guard services and one explicit, persisted protection demonstration. */
(function(){
'use strict';
const A=window.App,D=A.defensePolicies,P=A.contentPolicies,S=A.contentSafety,G=A.guardrail,O=A.protectionOps,L=A.leanOperations,M=A.modelRoles,E=A.escape;
if(!D||!L||!A.leanData)return;
const T=A.managedGuards={},copy=v=>JSON.parse(JSON.stringify(v));
const ids=new Set(['system-qwen3guard','dedicated-singguard']),scenario='dashboard-20261015';
T.isManaged=m=>ids.has(typeof m==='string'?m:m?.id);
T.serviceRecord=service=>L.serviceRecord(service);
T.demoRecords=()=>G.records().filter(r=>r.demoScenario===scenario&&r.source==='demo-runtime');
T.demoAppId=()=>A.data.managedGuardDemo?.appId||'';
const serviceReady=L.serviceReady;
L.serviceReady=function(service){if(typeof service==='string')service=D.service(service);return T.isManaged(service)&&service?.deploymentManaged===true?['ready','configured','verified'].includes(service.status)&&!!service.model:serviceReady(service);};
const record=L.serviceRecord;
L.serviceRecord=function(service){const result=record(service);return T.isManaged(service)?{...result,managed:true,deploymentManaged:true,uses:['guard'],connectStatus:L.serviceReady(service)?'configured':'pending'}:result;};
const newDraft=D.newDraft,store=D.store,set=D.set,save=D.save;
D.newDraft=function(){return {...newDraft.apply(D,arguments),enabled:true};};
D.store=function(value,audit=true){return store.call(D,{...value,enabled:true},audit);};
D.save=function(value){if(value)return save.call(D,{...value,enabled:true});if(D.draft)D.draft.enabled=true;return save.call(D);};
D.set=function(key,value){if(key==='enabled')return;return set.call(D,key,value);};
D.toggle=function(){A.toast('策略保存后即可绑定；在应用防护中管理生效位置。');return false;};
const form=D.form;
D.form=function(){if(D.draft)D.draft.enabled=true;const modal=A.modal;A.modal=function(title,body,footer,options){body=body.replace(/<label class="cs-checkbox"><input aria-label="(?:可用于新绑定|允许绑定)"[\s\S]*?<\/label>/,'').replace(/专属检测服务|护栏检测服务/g,'平台内置').replace(/平台管理的模型角色/g,'平台管理 → 模型配置');return modal.call(A,title,body,footer,options);};try{return form.apply(D,arguments);}finally{A.modal=modal;}};
const embeddingField=D.embeddingField;
D.embeddingField=function(d){return embeddingField.call(D,d).replace(/平台管理的模型角色/g,'平台管理 → 模型配置');};
D.services=function(){A.closeDrawer();A.platform.go('assets','models');};
D.serviceEdit=function(type){const service=D.service(type);if(!service)return;A.drawer(service.name,`<div class="gr-config"><div class="cs-detail-summary">${A.badge('平台内置','blue')}${A.badge('已就绪','green')}</div><div class="kv"><span>模型标识</span><strong>${E(service.model)}</strong></div><div class="kv"><span>平台用途</span><strong>内容防护</strong></div><div class="kv"><span>输出格式</span><strong>${E((service.labels||[]).join(' / '))}</strong></div><p class="field-help">推理地址与服务凭据由平台部署配置维护。应用只需绑定策略并完成防护接入。</p></div>`,`<button class="btn" onclick="App.closeDrawer()">关闭</button>`);};
D.serviceSave=function(){A.toast('内置服务由平台部署配置维护。');return false;};
const policyIssue=L.policyIssue;
L.policyIssue=function(p){return policyIssue.call(L,p).replace('策略已停用','策略版本待更新');};
const connection=G.connection;
T.protectionConnected=function(id,stage){if(!L.ready(id)||!O.active(id))return false;if(stage&&!O.policies(id,stage).length)return false;const real=stage?G.receipt(id,stage):['input','output'].some(s=>G.receipt(id,s));if(real)return true;const session=O.active(id);return session.demoScenario===scenario&&T.demoRecords().some(r=>r.appId===id&&r.sessionId===session.id&&(!stage||r.stage===stage)&&r.enforcementAck===true);};
T.connectedApps=()=>S.apps.filter(a=>T.protectionConnected(a.id));
L.connected=T.protectionConnected;
S.stageReady=(id,stage)=>T.protectionConnected(id,stage);
G.connection=function(id){return T.protectionConnected(id)?'已接入防护':connection.call(G,id);};
S.bindingStatus=G.connection;
A.attack.guardConnectionHint='平台内置 Qwen3Guard 检测服务暂不可用。';

T.migrate=function(){
 if(T.migrating||!S.db||!A.data.leanInitialDataset?.version)return false;
 if(A.data.managedGuardsVersion===1)return false;
 T.migrating=true;
 try{
  const backup=A.data.managedGuardsBackup||={services:{},policies:[]};
  for(const type of ['text','image']){
   const service=D.service(type);if(!T.isManaged(service))continue;
   backup.services[type] ||= copy(service);
   Object.assign(service,{managed:true,deploymentManaged:true,status:'ready',source:'platform-deployment'});
   if(!service.endpoint)service.endpoint=type==='image'?'http://image-guard:8000/v1':'http://guard-inference:8000/v1';
   delete service.example;
  }
  for(const policy of D.policyRows())if(!policy.enabled||!P.latest(policy.id)?.enabled){backup.policies.push(copy(policy));D.store({...policy,enabled:true},false);}
  // Preserve existing application bindings and all historical evidence. Only the untouched catalogue example receives demo traffic.
  const app=S.apps.find(a=>a.example===true&&a.status==='online'&&!G.records().some(r=>r.appId===a.id)&&!O.sessions().some(s=>s.appId===a.id));
  if(app&&!A.data.managedGuardDemo){
   const session=O.start(app.id);
   if(session&&!session.error){
    session.demoScenario=scenario;session.simulation=true;session.source='demo-runtime';
    const at=Date.now(),base=at-5*60000;
    session.startedAt=new Date(base).toISOString();
    A.data.managedGuardDemo={version:1,appId:app.id,sessionId:session.id,createdAt:new Date(at).toISOString()};
    const samples=[
     {stage:'input',text:'演示输入：请求覆盖应用的安全指令。',safety:'Unsafe',categories:['Jailbreak']},
     {stage:'input',text:'演示输入：请求返回受保护的个人信息。',safety:'Unsafe',categories:['PII']},
     {stage:'output',text:'演示输出：内容合规检测命中不当内容。',safety:'Unsafe',categories:['Unethical Acts']},
     {stage:'input',text:'请介绍产品保修范围。',safety:'Safe',categories:[]},
     {stage:'output',text:'产品保修范围以购买时的服务条款为准。',safety:'Safe',categories:[]}
    ];
    samples.forEach((sample,index)=>{
     const r=G.ingest({id:'DEMO-GUARD-20261015-'+(index+1),appId:app.id,stage:sample.stage,text:sample.text},{scope:'runtime',detectorResult:{safety:sample.safety,categories:sample.categories},enforcementAck:true,createdAt:new Date(base+index*60000).toISOString(),durationMs:160+index*13});
     if(r?.id){Object.assign(r,{source:'demo-runtime',demoScenario:scenario,simulation:true,externalVerified:false});r.metadata={...r.metadata,origin:'演示场景'};r.audit.unshift({event:'演示数据',actor:'平台演示',time:r.createdAt,detail:'用于展示应用接入、检测与风险告警流程；非真实业务流量。'});}
    });
   }
  }
  A.data.managedGuardsVersion=1;A.save();return true;
 }finally{T.migrating=false;}
};
const migrate=A.leanData.migrate;
A.leanData.migrate=function(){const result=migrate.apply(A.leanData,arguments);return T.migrate()||result;};
})();
