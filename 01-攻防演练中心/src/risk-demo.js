/* Three explicit demonstration scenarios; original assessment evidence is immutable. */
(function(){
'use strict';
const A=window.App,G=A.platformGovernance,clone=v=>JSON.parse(JSON.stringify(v));
const rows=v=>Array.isArray(v)?v:[],scenario='dashboard-20261015';
const D=A.riskDemo={version:2,scenario};
const isScenario=r=>r.demoScenario===scenario;
const findTask=id=>A.evaluation?.allTasks?.().find(t=>t.id===id&&!t.deletedAt);
D.migrateRules=()=>G.migrateRules();
D.runtimeEvidence=function(metric){
 return rows(A.managedGuards?.demoRecords?.()).filter(r=>isScenario(r)&&r.source==='demo-runtime'&&r.scope==='runtime').map(r=>{
  const record=G.contentRecord(r,metric);if(!record)return null;
  return {...record,key:'demo:'+scenario+':content:'+r.id,demoScenario:scenario,demo:true,originNote:'应用接入演示记录，按输入、输出或待复核数量分别计算告警阈值。'};
 }).filter(Boolean);
};
D.migrateEvents=function(){
 const db=G.db;if(db.demoTaskEventsVersion>=D.version)return false;let changed=false;
 for(const e of db.events){
  if(!e.evidence?.length||!e.evidence.every(isScenario))continue;
  const rule=db.rules.find(r=>r.id===e.ruleId);if(!rule)continue;
  const evaluation=e.domain==='evaluation',taskIds=new Set(e.evidence.map(r=>r.taskId));
  if(evaluation&&(taskIds.size!==1||!e.evidence[0].taskId))continue;
  if(e.metric==='runtime-unsafe'&&rule.metric==='runtime-unsafe-input'){
   const matches=new Set(e.evidence.map(r=>r.recordId)),current=D.runtimeEvidence('runtime-unsafe-input').filter(r=>matches.has(r.recordId));
   if(current.length<rule.threshold)continue;
   (db.demoEventArchive ||= []).push(clone(e));e.metric=rule.metric;e.evidence=current;e.count=current.length;e.ruleSnapshot=G.ruleSnapshot(rule);e.ruleVersion=rule.version;
   e.lastWindow={...e.lastWindow,...G.metricSnapshot(rule,current)};e.groupKey=rule.id+'@'+rule.version+':'+e.assetType+':'+e.assetId+'#demo:'+scenario;changed=true;
  }else if(evaluation){
   (db.demoEventArchive ||= []).push(clone(e));e.taskId=e.evidence[0].taskId;e.ruleSnapshot={...e.ruleSnapshot,scope:'task',windowHours:null,metricLabel:G.metrics[e.metric]?.label};if(e.lastWindow)e.lastWindow.start=null;
   e.groupKey=rule.id+'@'+e.ruleVersion+':task:'+e.taskId;changed=true;
  }
 }
 db.demoTaskEventsVersion=D.version;return changed;
};
D.ensure=function(){
 if(D.initializing||!G.db||!A.data.leanInitialDataset?.version)return;
 D.initializing=true;
 try{
  let state=A.data.riskDemo,changed=false;
  if(!state){
   const at=new Date(Date.now()-60000).toISOString(),evidence=[];
   const t=rows(A.attack?.db?.tasks).find(t=>t.id===A.leanData?.sampleId&&!t.deletedAt&&t.status==='done'),judged=rows(t?.units).filter(u=>['breach','defended'].includes(u.result));
   if(t&&judged.length){
    const valid=judged.length,breach=judged.filter(u=>u.result==='breach').length;
    evidence.push({key:'demo:'+scenario+':attack:'+t.id,source:'attack',metric:'attack-asr',assetId:t.model||t.targetSnapshot?.id,assetType:'model',assetName:t.targetSnapshot?.name||A.attack.model(t.model)?.name||'历史模型',taskId:t.id,title:'模型安全评估 · ASR 超阈值',at,valid,breach,summary:'ASR '+(100*breach/valid).toFixed(1)+'% · '+breach+' 次攻破 / '+valid+' 次有效判定',demoScenario:scenario,demo:true,originNote:'演示场景引用已完成示例任务的有效判定，按单次任务结果计算 ASR。'});
   }
   const scan=rows(A.scanProduct?.tasks?.()).filter(t=>t.snapshotId&&t.status==='done'&&/OpenRT/i.test(t.targetName||t.name)).sort((a,b)=>Date.parse(a.created)-Date.parse(b.created))[0];
   if(scan)evidence.push({key:'demo:'+scenario+':scan:'+scan.id,source:'scan',metric:'scan-confirmed-high',assetId:scan.targetId,assetType:'code',assetName:scan.targetName,taskId:scan.id,title:'OpenRT 首次扫描 · 高危漏洞',at,summary:'演示设定：已验证高危漏洞 1 项',severity:'high',demoScenario:scenario,demo:true,originNote:'高危告警场景演示。关联扫描原始快照为 0 项已确认、16 项待验证候选，本场景未修改原始扫描结果。'});
   state=A.data.riskDemo={version:D.version,scenario,createdAt:at,evidence};changed=true;
  }
  D.state=state;
  const priorVersion=G.db.demoTaskEventsVersion;if(D.migrateEvents()||priorVersion!==G.db.demoTaskEventsVersion)changed=true;
  if(state.version<D.version){state.version=D.version;changed=true;}
  if(changed)A.save();
 }finally{D.initializing=false;}
};
D.coveredKeys=function(){D.ensure();return [...new Set(rows(D.state?.evidence).filter(r=>!r.taskId||findTask(r.taskId)).map(r=>(r.assetType==='model'?'models':r.assetType)+':'+r.assetId))];};
D.evidence=function(source,metric){
 D.ensure();
 if(source==='content')return D.runtimeEvidence(metric);
 return clone(rows(D.state?.evidence).filter(r=>r.source===source&&r.metric===metric&&findTask(r.taskId)?.status==='done'));
};
const init=G.init;
G.init=function(){const result=init.apply(G,arguments);D.ensure();return result;};
const sourceRecords=G.sourceRecords;
G.sourceRecords=function(source,metric){const selected=metric||(source==='attack'?'attack-asr':source==='scan'?'scan-confirmed-high':'runtime-unsafe-input'),demo=D.evidence(source,selected),demoTasks=new Set(demo.map(r=>r.taskId).filter(Boolean)),records=sourceRecords.call(G,source,selected).filter(r=>!r.taskId||!demoTasks.has(r.taskId));return [...records,...demo];};
D.ruleLabel=r=>G.condition(r);
D.enabledRules=()=>{G.init();return G.db.rules.filter(r=>r.enabled);};
const start=A.start;
A.start=function(){const result=start.apply(A,arguments);D.ensure();G.refresh();return result;};
})();
