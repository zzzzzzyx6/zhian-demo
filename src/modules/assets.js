/* 资产与风险中心：AI 应用、模型、代码/软件包/Web 资产，风险事件与规则
 *
 * 本文件包含以下代码段（搜索「─── 名称」可直接跳转）：
 *   platform-governance                Shared asset registry and evidence-based risk events.
 *   application-assets                 Business applications group reusable technical assets through optional references.
 *   lean-data                          A small initial dataset. Only identifiable bundled fixtures are archived.
 *   lean-assets                        Asset inventory and model access share one center; managed guard services stay read-only.
 *   lean-operations                    A concise operational surface; configuration, runtime evidence and user alerts stay distinct.
 *   lean-platform                      A lean product surface. Execution records remain in their original workbenches.
 *   risk-demo                          Three explicit demonstration scenarios; original assessment evidence is immutable.
 *   model-intake-refinement            Model inventory: one model identity, verified API intake, and independent platform roles.
 *   application-links-refinement       Application-owned technical asset links, with direct navigation to completed reports.
 *   risk-classification                Operational risk categories and versioned response priorities, independent of CVSS.
 *   risk-tags                          
 *
 * 每段登记为 AppParts['assets/名称']，执行顺序统一在 src/boot.js 中维护。
 */
window.AppParts = window.AppParts || {};

// ─── platform-governance ───────────────────────────────────────────────────
AppParts['assets/platform-governance'] = function () {
/* Shared asset registry and evidence-based risk events. */
(function(){
'use strict';
const A=window.App,E=A.escape,clone=v=>JSON.parse(JSON.stringify(v));
const now=()=>new Date().toISOString(),uid=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
const domains={evaluation:'评估风险',protection:'防护风险'};
const sources={attack:'攻防演练',scan:'漏洞扫描',content:'运行时防护'};
const metrics={
 'attack-asr':{domain:'evaluation',source:'attack',label:'攻防演练·ASR',unit:'%'},
 'scan-confirmed-high':{domain:'evaluation',source:'scan',label:'漏洞扫描·高危漏洞数',fixedThreshold:1},
 'runtime-unsafe-input':{domain:'protection',source:'content',label:'Unsafe 输入请求数'},
 'runtime-unsafe-output':{domain:'protection',source:'content',label:'Unsafe 输出请求数'},
 'runtime-pending-review':{domain:'protection',source:'content',label:'待人工复核数'},
 'runtime-user-unsafe':{domain:'protection',source:'content',label:'应用用户不安全行为次数'}
};
const legacyMetrics={'attack-breach':{domain:'evaluation',source:'attack',label:'演练攻破记录数'},'runtime-unsafe':{domain:'protection',source:'content',label:'不安全请求数'},'runtime-blocked':{domain:'protection',source:'content',label:'不安全内容阻断数'},'runtime-error':{domain:'protection',source:'content',label:'检测故障请求数'}};
const defaultMetric={attack:'attack-asr',scan:'scan-confirmed-high',content:'runtime-unsafe-input'};
const severity={critical:'严重',high:'高危',medium:'中危',low:'低危'},states={open:'待处理',acknowledged:'已确认',closed:'已关闭'};
const assetTypes={model:'模型',application:'AI 应用',code:'代码',package:'软件包',web:'Web'};
const stamp=v=>{const n=typeof v==='number'?v:Date.parse(v||'');return Number.isFinite(n)?n:null;};
const firstStamp=(...values)=>values.map(stamp).find(v=>v!==null)??null;
const displayTime=v=>v?new Date(v).toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'):'—';
const timeWindow=r=>r.windowHours<24?'近 '+r.windowHours+' 小时':'近 '+(r.windowHours/24)+' 天';
const metricId=r=>r.metric||defaultMetric[r.source];
const metricInfo=r=>metrics[metricId(r)]||legacyMetrics[metricId(r)];
const ruleDomain=r=>r.domain||metricInfo(r)?.domain||'evaluation';
const condition=r=>(ruleDomain(r)==='evaluation'&&r.scope!=='asset-window'?'单任务完成后':timeWindow(r))+' · '+(r.metricLabel||metricInfo(r)?.label||sources[r.source])+' ≥ '+r.threshold+(r.metricUnit||metricInfo(r)?.unit||'');
const auditLabel=key=>({'risk.trigger':'触发风险事件','risk.rule.save':'保存触发规则','risk.event.closed':'关闭风险事件','risk.event.acknowledged':'确认风险事件','asset.create':'登记资产','asset.update':'更新资产','model.roles.update':'配置模型用途','binding.update':'更新防护绑定','binding.model-role-migration':'更新防护模型绑定','request.detect':'执行内容检测','sample.classify':'归档治理样本','application.save':'保存应用资产','review.complete':'完成人工复核','config.block-response':'更新阻断响应','rule.update':'更新检测规则','rule.create':'新增检测规则','policy.publish':'发布防护策略','policy.draft':'保存策略草稿'}[key]||key);
const ruleSnapshot=r=>({id:r.id,name:r.name,domain:ruleDomain(r),metric:metricId(r),metricLabel:metricInfo(r)?.label,metricUnit:metricInfo(r)?.unit||'',source:r.source,scope:r.scope||(ruleDomain(r)==='evaluation'?'task':'application-window'),windowHours:ruleDomain(r)==='protection'?r.windowHours:null,threshold:r.threshold,enabled:true,version:r.version,publishedAt:r.publishedAt});
const emptyFilter=()=>({domain:'',metric:'',source:'',state:'',severity:'',query:'',assetId:'',assetType:''});
const G=A.platformGovernance={domains,sources,metrics,severity,states,filter:emptyFilter(),logQuery:'',ruleDraft:null,assetDraft:null};
G.condition=condition;
G.ruleSnapshot=ruleSnapshot;
G.metricValue=function(rule,evidence){if(metricId(rule)!=='attack-asr')return evidence.length;const valid=evidence.reduce((n,r)=>n+(Number(r.valid)||0),0),breach=evidence.reduce((n,r)=>n+(Number(r.breach)||0),0);return valid?100*breach/valid:0;};
G.metricSnapshot=function(rule,evidence){const result={count:evidence.length,value:G.metricValue(rule,evidence)};if(metricId(rule)==='attack-asr'){result.valid=evidence.reduce((n,r)=>n+(Number(r.valid)||0),0);result.breach=evidence.reduce((n,r)=>n+(Number(r.breach)||0),0);}return result;};
G.observedLabel=function(event){if(metricId(event)!=='attack-asr')return (event.lastWindow?.value??event.lastWindow?.count??event.count)+(metricId(event)==='scan-confirmed-high'?' 项高危漏洞':metricId(event)==='runtime-pending-review'?' 项待人工复核':' 条请求');const fallback=G.metricSnapshot(event,event.evidence||[]),window=event.lastWindow||{},valid=window.valid??fallback.valid,breach=window.breach??fallback.breach,value=window.value??fallback.value;return 'ASR '+Number(value).toFixed(1)+'% · '+breach+' / '+valid+' 次有效判定';};
G.migrateRules=function(){
 const db=G.db;if(db.taskRuleSchema>=1)return false;
 const audit=A.contentSafety?.db?.audit||[],changedByUser=r=>audit.some(a=>(a.kind||a.action)==='risk.rule.save'&&(a.entity===r.id||a.ruleId===r.id));
 db.ruleMigrationArchive ||= [];
 for(const r of db.rules.slice()){
  r.metric ||= defaultMetric[r.source];
  const original=clone(r),defaultAttack=r.id==='risk-attack'&&r.metric==='attack-breach'&&r.name==='模型演练攻破集中出现'&&r.threshold===10&&!changedByUser(r),defaultContent=r.id==='risk-content'&&r.metric==='runtime-unsafe'&&r.name==='应用不安全内容集中出现'&&[3,5].includes(r.threshold)&&!changedByUser(r);
  if(defaultAttack){r.metric='attack-asr';r.name='模型演练 ASR 超阈值';}
  if(defaultContent){r.metric='runtime-unsafe-input';r.name='Unsafe 输入请求数超阈值';r.threshold=2;}
  if(!metrics[r.metric]){
   // Preserve obsolete custom definitions verbatim rather than reinterpret a count as a percentage.
   (db.legacyRules ||= []).push(original);db.rules.splice(db.rules.indexOf(r),1);continue;
  }
  const info=metrics[r.metric];r.domain=info.domain;r.source=info.source;r.scope=info.domain==='evaluation'?'task':'application-window';r.enabled=true;
  r.windowHours=info.domain==='evaluation'?null:([1,24,168,720].includes(r.windowHours)?r.windowHours:24);
  if(info.fixedThreshold)r.threshold=info.fixedThreshold;
  delete r.severity;
  if(JSON.stringify(original)!==JSON.stringify(r)){db.ruleMigrationArchive.push(original);r.version=(r.version||0)+1;r.publishedAt=now();r.revisions ||= [];r.revisions.push(ruleSnapshot(r));}
 }
 // Old event snapshots keep their original aggregation semantics and evidence.
 for(const e of db.events){if(e.ruleSnapshot&&!e.ruleSnapshot.scope)e.ruleSnapshot.scope=ruleDomain(e.ruleSnapshot)==='evaluation'?'asset-window':'application-window';}
 db.taskRuleSchema=1;return true;
};
G.init=function(){
 A.scanProduct?.init();
 A.data.businessAssets ||= {code:[],web:[]};for(const kind of ['code','web'])if(!Array.isArray(A.data.businessAssets[kind]))A.data.businessAssets[kind]=[];
 A.data.platformRisk ||= {schemaVersion:3,rules:[],events:[],seeded:false};G.db=A.data.platformRisk;
 if(!Array.isArray(G.db.rules))G.db.rules=[];if(!Array.isArray(G.db.events))G.db.events=[];
 if(!G.db.seeded){const presets=[['risk-attack','模型演练 ASR 超阈值','attack',null,10],['risk-scan','扫描确认高危漏洞','scan',null,1],['risk-content','Unsafe 输入请求数超阈值','content',24,2]];for(const [id,name,source,windowHours,threshold] of presets)if(!G.db.rules.some(r=>r.id===id)){const r={id,name,domain:metrics[defaultMetric[source]].domain,metric:defaultMetric[source],source,scope:source==='content'?'application-window':'task',windowHours,threshold,enabled:true,version:1,publishedAt:now()};r.revisions=[ruleSnapshot(r)];G.db.rules.push(r);}G.db.seeded=true;}
 for(const r of G.db.rules){r.metric ||= defaultMetric[r.source];r.domain ||= metricInfo(r)?.domain;r.revisions ||= [ruleSnapshot(r)];}
 for(const e of G.db.events){e.metric ||= e.ruleSnapshot?.metric||({attack:'attack-breach',scan:'scan-confirmed-high',content:'runtime-unsafe'}[e.source]);e.domain ||= metricInfo(e)?.domain;e.ruleSnapshot ||= clone(G.db.rules.find(r=>r.id===e.ruleId)||e);e.ruleSnapshot.metric ||= e.metric;e.ruleSnapshot.domain ||= e.domain;e.evidence ||= [];}
 const migrated=G.migrateRules();G.db.schemaVersion=3;if(migrated)A.save();return G;
};
G.audit=function(action,entity,detail,context={}){if(A.contentSafety?.db?.audit)A.contentSafety.audit(action,entity,detail,context);};
G.runtimeRecords=function(){return A.guardrail?.records?.()||(A.data.contentSafety?.requests||[]).filter(r=>!['test','console'].includes(r.scope));};
G.scanConfirmed=function(t,f){
 if(t.deletedAt||t.status!=='done'||t.resultSaved===false||!['critical','high'].includes(f.severity)||f.confirmed===false||f.verified===false)return false;
 const excluded=['candidate','pending','failed','error','unknown','unverified','false-positive','false_positive','dismissed','rejected'];
 if(excluded.includes(f.status)||excluded.includes(f.verificationStatus))return false;
 return f.confirmed===true||f.verified===true||['confirmed','verified'].includes(f.verificationStatus)||['confirmed','verified'].includes(f.status);
};
G.contentRecord=function(r,selected){
 if(selected==='runtime-user-unsafe'){
  const user=r.user_id||r.userId||r.accountId||r.user?.id||r.metadata?.user_id,verdict=String(r.original?.safety||r.machineVerdict||r.safety||'').toLowerCase();
  if(!user||verdict!=='unsafe'||r.detectionComplete===false||r.error||r.detectionStatus==='error')return null;
  const at=firstStamp(r.createdAt);if(at===null)return null;
  return {key:'user-unsafe:'+r.id,source:'content',metric:selected,assetId:r.appId,assetType:'application',assetName:A.data.aiApplications?.find(a=>a.id===r.appId)?.name||'历史应用',userId:String(user),recordId:r.id,at:new Date(at).toISOString(),title:'用户 '+user+' · 不安全行为',summary:'应用用户不安全行为触发阈值',originalVerdict:verdict};
 }
 const verdict=r.original?.safety||r.machineVerdict||r.safety,action=A.guardrail?.effectiveAction?.(r)||r.effectiveAction||r.original?.action||r.action,valid=r.detectionComplete!==false&&!r.error&&r.detectionStatus!=='error';
 const reviews=(A.contentSafety?.pendingReviews?.()||(A.data.contentSafety?.reviews||[]).filter(v=>['pending','reviewing'].includes(v.status)&&A.contentSafety?.reviewEligible?.(v))).filter(v=>v.requestId===r.id),pending=reviews.length>0;
 const match=selected==='runtime-pending-review'?pending:selected==='runtime-unsafe-input'?valid&&verdict==='Unsafe'&&r.stage==='input':selected==='runtime-unsafe-output'?valid&&verdict==='Unsafe'&&r.stage==='output':false;
 if(!match)return null;
 const at=firstStamp(selected==='runtime-pending-review'?reviews[0]?.createdAt:null,r.createdAt);if(at===null)return null;
 return {key:'content:'+r.id,source:'content',metric:selected,assetId:r.appId||'',assetType:'application',assetName:A.data.aiApplications?.find(a=>a.id===r.appId)?.name||'历史应用',recordId:r.id,stage:r.stage,title:(r.stage==='output'?'输出':'输入')+'检测 · '+(selected==='runtime-pending-review'?'待人工复核':'Unsafe'),at:new Date(at).toISOString(),summary:selected==='runtime-pending-review'?'等待人工复核':((r.original?.categories||r.categories||[]).join('、')||'原始判定 Unsafe')+' · '+({block:'已阻断',allow:'已放行',log:'放行',review:'待人工复核'}[action]||'已记录'),originalVerdict:verdict,action};
};
G.sourceRecords=function(source,selectedMetric){
 const selected=selectedMetric||defaultMetric[source],records=[];
 if(source==='attack'&&selected==='attack-asr')for(const t of A.attack?.db?.tasks||[]){
  if(t.deletedAt||t.status!=='done')continue;
  const judged=(t.units||[]).filter(u=>['breach','defended'].includes(u.result)),valid=judged.length,breach=judged.filter(u=>u.result==='breach').length,at=firstStamp(t.finishedAt,t.finished,...judged.map(u=>u.finished||u.finishedAt),t.created);if(!valid||at===null)continue;
  records.push({key:'attack-asr:'+t.id,source,metric:selected,assetId:t.model||t.targetSnapshot?.id||'',assetType:'model',assetName:t.targetSnapshot?.name||A.attack.model(t.model)?.name||'历史模型',taskId:t.id,title:t.name,at:new Date(at).toISOString(),valid,breach,summary:'ASR '+(100*breach/valid).toFixed(1)+'% · '+breach+' 次攻破 / '+valid+' 次有效判定'});
 }
 if(source==='scan'&&selected==='scan-confirmed-high')for(const t of A.scanProduct?.tasks?.()||[]){for(const f of t.findings||[]){
  if(!G.scanConfirmed(t,f))continue;const at=firstStamp(t.finishedAt,t.finished,f.verifiedAt,f.createdAt,t.created);if(at===null)continue;
  records.push({key:'scan:'+t.id+':'+f.id,source,metric:selected,assetId:t.targetId||'',assetType:t.type==='app-scan'?'package':t.type==='web-scan'?'web':'code',assetName:t.targetName||'历史资产',taskId:t.id,recordId:f.id,title:t.name||t.targetName,at:new Date(at).toISOString(),summary:f.title+' · '+(severity[f.severity]||'')+' · '+(f.location||f.category||'自动验证通过')});
 }}
 if(source==='content')for(const r of G.runtimeRecords()){const record=G.contentRecord(r,selected);if(record)records.push(record);}
 return [...new Map(records.filter(r=>r.assetId).map(r=>[r.key,r])).values()];
};
G.refresh=function(at=Date.now()){
 G.init();const time=stamp(at);if(time===null)return clone(G.db.events);let changed=false;const sourceCache={};
 for(const rule of G.db.rules.filter(r=>r.enabled&&metrics[metricId(r)])){
  const evaluation=ruleDomain(rule)==='evaluation',records=sourceCache[rule.metric] ||= G.sourceRecords(rule.source,rule.metric),start=evaluation?null:time-rule.windowHours*3600000,grouped=new Map();
  for(const r of records){
   const t=stamp(r.at);if(t===null||t>time||!evaluation&&t<start||evaluation&&!r.taskId)continue;
   const key=evaluation?'task:'+r.taskId:r.assetType+':'+r.assetId+(rule.metric==='runtime-user-unsafe'?'#user:'+r.userId:'')+(r.demoScenario?'#demo:'+r.demoScenario:'');
   if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(r);
  }
  for(const [recordGroup,items] of grouped){
   const evidence=[...new Map(items.map(r=>[r.key,r])).values()],first=evidence[0],assetKey=first.assetType+':'+first.assetId,key=rule.id+'@'+rule.version+':'+recordGroup;
   const related=G.db.events.filter(e=>e.ruleId===rule.id&&e.metric===rule.metric&&e.assetType+':'+e.assetId===assetKey&&(rule.metric!=='runtime-user-unsafe'||e.evidence?.[0]?.userId===first.userId));
   // A completed assessment produces at most one event for each rule, across rule revisions.
   if(evaluation&&related.some(e=>e.taskId===first.taskId||(e.evidence||[]).some(r=>r.taskId===first.taskId)))continue;
   const prior=new Set(related.flatMap(e=>(e.evidence||[]).map(r=>r.key))),fresh=evidence.filter(r=>!prior.has(r.key));
   if(!fresh.length)continue;
   const current=!evaluation&&related.find(e=>e.groupKey===key&&stamp(e.lastTriggeredAt)>=start);
   if(current){if(G.metricValue(rule,evidence)>=rule.threshold){current.evidence.push(...clone(fresh));current.count=current.evidence.length;current.lastTriggeredAt=new Date(time).toISOString();current.lastWindow={start:new Date(start).toISOString(),end:new Date(time).toISOString(),...G.metricSnapshot(rule,evidence)};changed=true;}continue;}
   const triggerEvidence=evaluation?evidence:fresh;if(G.metricValue(rule,triggerEvidence)<rule.threshold)continue;
   const triggerAt=evaluation?new Date(Math.max(...evidence.map(r=>stamp(r.at)))).toISOString():new Date(time).toISOString();
   const event={id:uid('risk-event'),groupKey:key,ruleId:rule.id,ruleVersion:rule.version,ruleSnapshot:clone(ruleSnapshot(rule)),domain:rule.domain,metric:rule.metric,source:rule.source,assetId:first.assetId,assetType:first.assetType,assetName:first.assetName,...(evaluation?{taskId:first.taskId}:{}),count:triggerEvidence.length,evidence:clone(triggerEvidence),createdAt:triggerAt,lastTriggeredAt:triggerAt,lastWindow:{start:evaluation?null:new Date(start).toISOString(),end:triggerAt,...G.metricSnapshot(rule,triggerEvidence)}};
   G.db.events.unshift(event);G.audit('risk.trigger',event.id,'触发风险事件：'+rule.name,{riskEventId:event.id,assetId:event.assetId,ruleId:rule.id,ruleVersion:rule.version});changed=true;
  }
 }
 if(changed)A.save();return clone(G.db.events);
};
G.events=function(){return G.refresh().sort((a,b)=>stamp(b.lastTriggeredAt)-stamp(a.lastTriggeredAt));};
G.rule=function(id){G.init();return G.db.rules.find(r=>r.id===id);};
G.editRule=function(id){G.init();G.ruleDraft=clone(G.rule(id)||{id:'',name:'',domain:'evaluation',metric:'attack-asr',source:'attack',scope:'task',windowHours:null,threshold:10,enabled:true});G.ruleForm();};
G.changeRuleDomain=function(value){if(!domains[value])return;G.ruleDraft.domain=value;G.ruleDraft.metric=Object.keys(metrics).find(id=>metrics[id].domain===value);G.ruleDraft.source=metrics[G.ruleDraft.metric].source;G.ruleDraft.threshold=value==='evaluation'?10:1;G.ruleDraft.windowHours=value==='protection'?24:null;G.ruleForm();};
G.changeRuleMetric=function(value){if(!metrics[value]||metrics[value].domain!==G.ruleDraft.domain)return;G.ruleDraft.metric=value;G.ruleDraft.source=metrics[value].source;G.ruleDraft.threshold=metrics[value].fixedThreshold||(value==='attack-asr'?10:Math.max(1,Math.round(G.ruleDraft.threshold||1)));G.ruleForm();};
G.ruleForm=function(){const d=G.ruleDraft;if(!d)return;const info=metricInfo(d),evaluation=d.domain==='evaluation',fixed=!!info.fixedThreshold;A.modal(d.id?'编辑触发规则':'新建触发规则',`
 <div class="field"><label for="pg-rule-name">规则名称 *</label><input id="pg-rule-name" maxlength="80" value="${E(d.name)}" oninput="App.platformGovernance.ruleDraft.name=this.value"></div>
 <div class="field"><label>风险域 *</label><div class="pg-domain-picker">${Object.entries(domains).map(([id,n])=>`<button class="${d.domain===id?'active':''}" onclick="App.platformGovernance.changeRuleDomain('${id}')"><strong>${n}</strong></button>`).join('')}</div></div>
 <div class="field"><label for="pg-rule-metric">触发指标 *</label><select id="pg-rule-metric" onchange="App.platformGovernance.changeRuleMetric(this.value)">${Object.entries(metrics).filter(([,v])=>v.domain===d.domain).map(([id,v])=>`<option value="${id}" ${d.metric===id?'selected':''}>${v.label}</option>`).join('')}</select></div>
 <div class="form-grid">${evaluation?'':`<div class="field"><label for="pg-rule-window">统计时间窗 *</label><select id="pg-rule-window" onchange="App.platformGovernance.ruleDraft.windowHours=Number(this.value)">${[[1,'近 1 小时'],[24,'近 24 小时'],[168,'近 7 天'],[720,'近 30 天']].map(([v,n])=>`<option value="${v}" ${d.windowHours===v?'selected':''}>${n}</option>`).join('')}</select></div>`}<div class="field"><label for="pg-rule-threshold">${fixed?'触发条件':'触发阈值 *'}</label><div class="pg-threshold-control ${fixed?'is-fixed':''}"><span aria-hidden="true">≥</span><input id="pg-rule-threshold" aria-label="大于等于阈值" type="number" min="${info.unit==='%'?'0.1':'1'}" max="${info.unit==='%'?'100':'10000'}" step="${info.unit==='%'?'0.1':'1'}" value="${fixed?1:d.threshold}" ${fixed?'readonly aria-readonly="true"':'oninput="App.platformGovernance.ruleDraft.threshold=Number(this.value)"'}>${info.unit?`<span>${info.unit}</span>`:fixed?'<span>项高危漏洞</span>':''}</div></div></div>
 <p id="pg-rule-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.platformGovernance.saveRule()">保存规则</button>`);};
G.validateRule=function(d){if(!d||!String(d.name||'').trim()||d.name.length>80)return '请填写 1–80 字的规则名称';const m=metrics[metricId(d)];if(!m||(d.domain&&d.domain!==m.domain)||(d.source&&d.source!==m.source))return '请选择匹配的风险域和触发指标';if(m.domain==='protection'&&![1,24,168,720].includes(d.windowHours))return '请选择统计时间窗';if(m.fixedThreshold&&d.threshold!==1)return '出现高危漏洞即触发，阈值固定为 1';if(m.unit==='%'){if(!Number.isFinite(d.threshold)||d.threshold<=0||d.threshold>100)return 'ASR 阈值须大于 0 且不超过 100%';}else if(!Number.isSafeInteger(d.threshold)||d.threshold<1||d.threshold>10000)return '阈值须为 1–10000 的整数';if(G.db.rules.some(r=>r.id!==d.id&&r.name.toLowerCase()===d.name.trim().toLowerCase()))return '规则名称已存在';return '';};
G.saveRule=function(value){G.init();const d=clone(value||G.ruleDraft),error=G.validateRule(d);if(error){const el=document.getElementById('pg-rule-error');if(el)el.textContent=error;return false;}const old=G.rule(d.id),m=metrics[metricId(d)],r={id:old?.id||uid('risk-rule'),name:d.name.trim(),domain:m.domain,metric:metricId(d),source:m.source,scope:m.domain==='evaluation'?'task':'application-window',windowHours:m.domain==='protection'?d.windowHours:null,threshold:m.fixedThreshold||d.threshold,enabled:true,version:(old?.version||0)+1,publishedAt:now(),revisions:clone(old?.revisions||[])};r.revisions.push(ruleSnapshot(r));if(old)G.db.rules.splice(G.db.rules.indexOf(old),1,r);else G.db.rules.push(r);G.audit('risk.rule.save',r.id,'保存触发规则：'+r.name,{ruleId:r.id,version:r.version});A.save();if(!value){A.closeModal();A.render();A.toast('触发规则已保存');}return clone(r);};
// Kept as a no-op for previously saved links; rules apply as soon as they are saved.
G.toggleRule=function(){return false;};
G.ruleHTML=function(){G.init();return A.heading('','触发规则','按评估风险与防护风险分别定义触发条件。',`<button class="btn primary" onclick="App.platformGovernance.editRule()">${A.icon('plus',14)}新建规则</button>`)+`<section class="card"><div class="table-wrap"><table class="pg-rules-table"><thead><tr><th>规则名称</th><th>风险域</th><th>触发条件</th><th>事件等级</th><th>状态</th><th>操作</th></tr></thead><tbody>${G.db.rules.map(r=>`<tr><td><strong>${E(r.name)}</strong><small>v${r.version} · 按资产聚合</small></td><td>${A.badge(domains[r.domain],r.domain==='evaluation'?'blue':'orange')}<small>${E(sources[r.source])}</small></td><td>${E(metricInfo(r)?.label)} ≥ ${r.threshold}${E(metricInfo(r)?.unit||'')}<small>${timeWindow(r)}</small></td><td>${A.badge(severity[r.severity],['high','critical'].includes(r.severity)?'red':'orange')}</td><td>${A.badge(r.enabled?'已启用':'已停用',r.enabled?'green':'gray')}</td><td><div class="pg-actions"><button class="link-btn" data-id="${E(r.id)}" onclick="App.platformGovernance.editRule(this.dataset.id)">编辑</button><button class="link-btn" data-id="${E(r.id)}" onclick="App.platformGovernance.toggleRule(this.dataset.id)">${r.enabled?'停用':'启用'}</button></div></td></tr>`).join('')||'<tr><td colspan="6" class="empty">暂无触发规则</td></tr>'}</tbody></table></div></section><p class="pg-footnote">触发规则汇总已发生的记录，不执行请求拦截。应用的检测与处置条件在策略中心配置。</p>`;};
G.filterBy=function(key,value){if(!Object.hasOwn(G.filter,key))return;G.filter[key]=value;if(key==='domain')G.filter.metric='';A.render();};
G.showEvents=function(options={}){G.filter={...emptyFilter(),...options};A.platform.go('risk','events');};
G.eventHTML=function(){const rows=G.events(),f=G.filter,filtered=rows.filter(e=>(!f.domain||e.domain===f.domain)&&(!f.metric||e.metric===f.metric)&&(!f.source||e.source===f.source)&&(!f.state||(f.state==='active'?e.status!=='closed':e.status===f.state))&&(!f.severity||(f.severity==='urgent'?['high','critical'].includes(e.severity):e.severity===f.severity))&&(!f.assetId||e.assetId===f.assetId)&&(!f.assetType||e.assetType===f.assetType)&&(!f.query||[e.assetName,e.ruleSnapshot.name,e.id].join(' ').toLowerCase().includes(f.query.trim().toLowerCase()))),active=rows.filter(e=>e.status!=='closed'),select=(key,label,options)=>`<select aria-label="${label}" onchange="App.platformGovernance.filterBy('${key}',this.value)"><option value="">${label}</option>${Object.entries(options).map(([id,n])=>`<option value="${id}" ${f[key]===id?'selected':''}>${n}</option>`).join('')}</select>`;return A.heading('','风险事件','查看已触发事件的证据、关联资产与跟进状态。',`<button class="btn" onclick="App.platformGovernance.refresh();App.render()">更新事件</button>`)+`<div class="pg-risk-stats">${[['评估未关闭',active.filter(e=>e.domain==='evaluation').length],['防护未关闭',active.filter(e=>e.domain==='protection').length],['涉及资产',new Set(active.map(e=>e.assetType+':'+e.assetId)).size],['已关闭',rows.filter(e=>e.status==='closed').length]].map(([label,value])=>`<section class="card"><span>${label}</span><strong>${value}</strong></section>`).join('')}</div><section class="card"><div class="toolbar pg-toolbar">${select('domain','全部风险域',domains)}${select('metric','全部指标',Object.fromEntries(Object.entries(metrics).filter(([,m])=>!f.domain||m.domain===f.domain).map(([id,m])=>[id,m.label])))}${select('state','全部状态',{active:'未关闭',...states})}${select('severity','全部等级',{urgent:'高危及严重',...severity})}<input type="search" aria-label="搜索风险事件" placeholder="搜索资产、规则或事件编号" value="${E(f.query)}" onchange="App.platformGovernance.filterBy('query',this.value)"></div>${f.assetId?`<div class="pg-filter-context"><span>资产：${E(rows.find(e=>e.assetId===f.assetId&&(!f.assetType||e.assetType===f.assetType))?.assetName||f.assetId)}</span><button class="link-btn" onclick="App.platformGovernance.showEvents({state:'active'})">查看全部资产</button></div>`:''}<div class="table-wrap"><table class="pg-events-table"><thead><tr><th>事件 / 资产</th><th>风险域 / 触发依据</th><th>等级</th><th>状态</th><th>最近触发</th><th>操作</th></tr></thead><tbody>${filtered.map(e=>`<tr><td><button class="link-btn" data-id="${E(e.id)}" onclick="App.platformGovernance.eventDetail(this.dataset.id)">${E(e.ruleSnapshot.name)}</button><small>${assetTypes[e.assetType]} · ${E(e.assetName)}</small></td><td>${A.badge(domains[e.domain],e.domain==='evaluation'?'blue':'orange')}<small>${E(metricInfo(e)?.label)} · ${e.count} 条证据</small><small>${E(condition(e.ruleSnapshot))} · v${e.ruleVersion}</small></td><td>${A.badge(severity[e.severity],['critical','high'].includes(e.severity)?'red':'orange')}</td><td>${A.badge(states[e.status],e.status==='closed'?'gray':e.status==='acknowledged'?'blue':'orange')}</td><td>${E(displayTime(e.lastTriggeredAt))}</td><td>${G.eventActions(e)}</td></tr>`).join('')||'<tr><td colspan="6" class="empty">暂无符合条件的风险事件</td></tr>'}</tbody></table></div><div class="table-foot">${filtered.length} 个已触发事件</div></section>`;};
G.eventActions=()=>'';
G.eventDetail=function(id){G.init();const e=G.db.events.find(e=>e.id===id);if(!e)return;const r=e.ruleSnapshot,evaluation=e.domain==='evaluation',evidence=e.evidence||[],links=evaluation?[...new Map(evidence.map((v,index)=>[v.taskId||v.key,{...v,index}])).values()]:evidence.map((v,index)=>({...v,index})),notes=[...new Set(evidence.filter(v=>v.demo&&v.originNote).map(v=>v.originNote))];A.drawer('风险事件详情',`<div class="pg-event-detail"><div class="pg-detail-tags">${A.badge(domains[e.domain],e.domain==='evaluation'?'blue':'orange')}</div><h2>${E(r.name)}</h2><dl class="pg-detail-kv"><div><dt>风险对象</dt><dd>${assetTypes[e.assetType]||''} · ${E(e.assetName)}</dd></div><div><dt>触发条件</dt><dd>${E(condition(r))}</dd></div><div><dt>触发结果</dt><dd>${E(G.observedLabel(e))}</dd></div><div><dt>触发时间</dt><dd>${E(displayTime(e.lastTriggeredAt||e.createdAt))}</dd></div>${!evaluation?`<div><dt>统计时间窗</dt><dd>${E(displayTime(e.lastWindow?.start))} 至 ${E(displayTime(e.lastWindow?.end))}</dd></div>`:''}</dl>${notes.length?`<div class="pg-demo-evidence-note">${notes.map(note=>`<p>${E(note)}</p>`).join('')}</div>`:''}<h3>关联证据</h3><div class="pg-evidence-list">${links.map(v=>`<button data-id="${E(e.id)}" data-index="${v.index}" onclick="App.platformGovernance.openEvidence(this.dataset.id,Number(this.dataset.index))"><strong>${E(v.title)}</strong><small>${E(v.summary)}</small><span>${evaluation?'查看任务详情':'查看检测记录'} →</span></button>`).join('')||'<p class="muted">暂无关联证据</p>'}</div></div>`,'');};
G.openEvidence=function(id,index){const e=G.db?.events.find(e=>e.id===id),r=e?.evidence[index];if(!r)return;A.closeDrawer();if(r.source==='content'){const live=A.data.contentSafety?.requests.find(v=>v.id===r.recordId);if(live){A.platform.go('protection','records');A.contentSafety.detail(r.recordId);return;}}if(r.source==='scan'){if(A.scanProduct.tasks().some(t=>t.id===r.taskId)){A.scanProduct.open(r.taskId);return;}}if(r.source==='attack'){const t=A.attack.db.tasks.find(t=>t.id===r.taskId&&!t.deletedAt);if(t){A.evaluation.openTask(t.id);return;}}A.drawer('触发证据快照',`<h3>${E(r.title)}</h3><p>${E(r.summary)}</p><p class="hint">原始记录已移除，仍保留触发时的证据摘要。</p>`,'');};
G.setEventState=()=>false;
G.closeEvent=()=>false;
G.confirmClose=()=>false;
G.renderRisk=item=>item==='rules'?G.ruleHTML():G.eventHTML();
G.assetsHTML=function(item){G.init();const kind=item==='web'?'web':'code',list=A.data.businessAssets[kind],label=kind==='code'?'代码资产':'Web 资产';return A.heading('',label,kind==='code'?'登记需要进行代码安全评估的仓库或代码包。':'登记需要进行 Web 安全评估的网站与服务地址。',`<button class="btn primary" onclick="App.platformGovernance.editAsset('${kind}')">${A.icon('plus',14)}登记资产</button>`)+`<section class="card"><div class="table-wrap"><table class="pg-assets-table"><thead><tr><th>资产名称</th><th>${kind==='code'?'仓库 / 代码标识':'访问地址'}</th>${kind==='code'?'<th>分支 / 版本</th>':''}<th>登记时间</th><th>操作</th></tr></thead><tbody>${list.map(a=>`<tr><td><strong>${E(a.name)}</strong></td><td class="pg-wrap">${E(kind==='code'?a.repository:a.url)}</td>${kind==='code'?`<td>${E(a.revision||'—')}</td>`:''}<td>${displayTime(a.createdAt)}</td><td><button class="link-btn" data-id="${E(a.id)}" onclick="App.platformGovernance.editAsset('${kind}',this.dataset.id)">编辑</button></td></tr>`).join('')||`<tr><td colspan="${kind==='code'?5:4}" class="empty">暂无${label}，登记后可发起对应的安全扫描。</td></tr>`}</tbody></table></div></section>`;};
G.editAsset=function(kind,id){G.init();if(!['code','web'].includes(kind))return;G.assetDraft={kind,...clone(A.data.businessAssets[kind].find(a=>a.id===id)||{id:'',name:'',repository:'',revision:'',url:'',owner:''})};const d=G.assetDraft;A.modal(d.id?'编辑资产':'登记资产',`<div class="field"><label for="pg-asset-name">资产名称 *</label><input id="pg-asset-name" maxlength="80" value="${E(d.name)}" oninput="App.platformGovernance.assetDraft.name=this.value"></div><div class="field"><label for="pg-asset-source">${kind==='code'?'仓库 / 代码标识':'访问地址'} *</label><input id="pg-asset-source" maxlength="500" value="${E(kind==='code'?d.repository:d.url)}" placeholder="${kind==='code'?'如：team/service-repository':'如：https://service.example.com'}" oninput="App.platformGovernance.assetDraft.${kind==='code'?'repository':'url'}=this.value"></div>${kind==='code'?`<div class="field"><label for="pg-asset-revision">分支 / 版本</label><input id="pg-asset-revision" maxlength="100" value="${E(d.revision||'')}" placeholder="如：main 或 release-1.0" oninput="App.platformGovernance.assetDraft.revision=this.value"></div>`:''}<p id="pg-asset-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.platformGovernance.saveAsset()">保存资产</button>`);};
G.validateAsset=function(d){if(!['code','web'].includes(d?.kind))return '请选择资产类型';if(!String(d.name||'').trim()||d.name.length>80)return '请填写资产名称，不超过 80 字';const source=String(d.kind==='code'?d.repository||'':d.url||'').trim();if(!source||source.length>500)return '请填写不超过 500 字的资产地址或代码标识';if(d.kind==='web'){try{const u=new URL(source);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)return '请输入不含用户名和密码的 HTTP(S) 地址';}catch(e){return '请输入有效的 HTTP(S) 地址';}}if(A.data.businessAssets[d.kind].some(a=>a.id!==d.id&&a.name.toLowerCase()===d.name.trim().toLowerCase()))return '该类型下已存在同名资产';return '';};
G.saveAsset=function(value){G.init();const d=clone(value||G.assetDraft),error=G.validateAsset(d);if(error){const el=document.getElementById('pg-asset-error');if(el)el.textContent=error;return false;}const list=A.data.businessAssets[d.kind],old=list.find(a=>a.id===d.id),a={...(old||{}),id:old?.id||uid('asset-'+d.kind),name:d.name.trim(),createdAt:old?.createdAt||now(),updatedAt:now(),...(d.kind==='code'?{repository:d.repository.trim(),revision:String(d.revision||'').trim()}:{url:d.url.trim()})};if(old&&(old.repository!==a.repository||old.revision!==a.revision||old.url!==a.url))delete a.fixtureType;if(old)list.splice(list.indexOf(old),1,a);else list.push(a);G.audit('asset.'+(old?'update':'create'),a.id,(old?'更新':'登记')+(d.kind==='code'?'代码':'Web')+'资产：'+a.name,{assetId:a.id,assetType:d.kind});A.save();if(!value){A.closeModal();A.render();A.toast('资产已保存');}return clone(a);};
G.renderManagement=function(){return A.modelRoles.renderManagement();};
})();



};

// ─── application-assets ────────────────────────────────────────────────────
AppParts['assets/application-assets'] = function () {
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
};

// ─── lean-data ─────────────────────────────────────────────────────────────
AppParts['assets/lean-data'] = function () {
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
};

// ─── lean-assets ───────────────────────────────────────────────────────────
AppParts['assets/lean-assets'] = function () {
/* Asset inventory and model access share one center; managed guard services stay read-only. */
(function(){
'use strict';
const A=window.App,Q=A.assessment,R=A.applicationAssets,C=A.connections,M=A.modelRoles,X=A.attack,E=A.escape;
const arr=value=>Array.isArray(value)?value:[];
const kinds={applications:{name:'AI应用',single:'应用',icon:'layers'},models:{name:'模型',single:'模型',icon:'box'},code:{name:'代码',single:'代码',icon:'code'},packages:{name:'二进制/软件包',single:'二进制/软件包',icon:'box'},web:{name:'Web',single:'Web 站点',icon:'link'}};
const L=A.leanAssets={query:{},filters:{},kinds,connectionOrigin:false};
const display=value=>E(value||'—');
const date=value=>A.listConsistency.time(value);
const attr=(kind,id)=>`data-kind="${E(kind)}" data-id="${E(id)}"`;
const status=(text,tone='neutral')=>`<span class="la-state la-state-${tone}"><i></i>${E(text)}</span>`;
const nameTags=names=>names.length?`<div class="la-tags">${names.map(name=>`<span>${E(name)}</span>`).join('')}</div>`:'<span class="muted">—</span>';
const safeEndpoint=value=>{try{const u=new URL(value);if(!['http:','https:'].includes(u.protocol))return '—';return u.origin+u.pathname.replace(/\/$/,'');}catch(e){return '—';}};
const serviceRows=()=>Object.entries(A.data.defenseServices||{}).map(([type,s])=>({...s,_serviceType:type}));
const serviceReady=s=>A.leanOperations?.serviceReady?A.leanOperations.serviceReady(s):s.status==='configured';
L.isManaged=m=>!!(A.managedGuards?.isManaged?.(m)||m?.managed||m?.platformManaged);
L.modelState=function(m){return m._serviceType?(serviceReady(m)?'ready':'unassigned'):M.state(m);};
L.needsConfiguration=m=>!L.isManaged(m)&&!m._serviceType&&(!M.connected(m)||M.state(m)!=='ready');
L.pendingModels=()=>L.rows('models').filter(L.needsConfiguration);
L.rows=function(kind){
 if(kind==='models'){const services=serviceRows(),ids=new Set(services.map(s=>s.id));return [...C.db.filter(m=>(m.kind||'model')==='model'&&!ids.has(m.id)),...services];}
 if(kind==='applications')return arr(A.data.aiApplications);
 return arr(A.data.businessAssets?.[kind]);
};
L.appNames=(kind,id)=>R.applicationsFor(kind+':'+id).map(a=>a.name);
L.assetNames=id=>R.assetsFor(id).map(r=>r.asset.name);
L.connectionState=function(m){
 if(L.isManaged(m))return status(serviceReady(m)?'已就绪':'服务异常',serviceReady(m)?'ready':'attention');
 if(m._serviceType)return status(serviceReady(m)?'已配置':'未配置',serviceReady(m)?'ready':'neutral');
 if(m.sample||m.simulated||m.demoConfigured)return status('演示接入','neutral');
 if(m.connectStatus==='testing')return status('校验中','active');
 if(m.presetPending||!m.model||!m.endpoint)return status('未配置','neutral');
 if(['fail','failed'].includes(m.connectStatus)||m.configurationCheck?.valid===false)return status('校验未通过','attention');
 return status(m.connectStatus==='ok'?'已配置 · 未验证':'待校验','neutral');
};
L.endpoint=m=>L.isManaged(m)?'平台托管':m._serviceType&&!serviceReady(m)?'—':safeEndpoint(m.endpoint);
L.purposes=function(m){
 if(L.isManaged(m))return nameTags(['内容防护']);
 if(m._serviceType)return serviceReady(m)?nameTags(['护栏']):'<span class="muted">未配置</span>';
 const d=M.get(m.id);return d?.confirmed&&d.roles?.length?nameTags(d.roles.map(r=>M.roles[r]||r)):'<span class="muted">未配置</span>';
};
L.identity=function(kind,a){
 if(kind==='models')return a.model||a.id;
 if(kind==='applications')return a.scene||a.description||'—';
 if(kind==='web')return safeEndpoint(a.url);
 if(kind==='code')return a.repository||'本地代码';
 return arr(a.versions).at(-1)?.fileName||arr(a.versions).at(-1)?.name||'二进制 / 软件包';
};
L.filter=function(kind,value){L.query[kind]=value;A.render();};
L.filterBy=function(kind,key,value){if(!['owner','environment'].includes(key))return;(L.filters[kind]||=( {owner:'',environment:''}))[key]=value;A.render();};
L.empty=function(kind,search){
 const note=search?'调整筛选条件或搜索名称。':({applications:'在安全防护中接入应用后显示。',models:'完成模型接入后显示。',code:'创建代码检测任务后记录对象与版本信息。',packages:'创建二进制/软件包检测任务后记录对象信息。',web:'创建 Web 检测任务后记录站点信息。'})[kind];
 return `<div class="la-empty"><span>${A.icon(kinds[kind].icon,26)}</span><strong>${search?'未找到匹配资产':'暂无'+kinds[kind].single}</strong><p>${note}</p></div>`;
};
L.list=function(kind){
 if(kind==='models')return M.render();
 A.scanProduct.init();M.init();
 const query=(L.query[kind]||'').trim().toLowerCase(),all=L.rows(kind),f=L.filters[kind]||{owner:'',environment:''},app=kind==='applications';
 const matches=(value,filter)=>!filter||(filter==='__unset__'?!String(value||'').trim():String(value||'').trim()===filter);
 const rows=all.filter(a=>(!query||String(a.name||'').toLowerCase().includes(query))&&matches(a.owner,f.owner)&&(!app||matches(a.environment,f.environment)));
 const choices=(key,label)=>{const values=[...new Set(all.map(a=>String(a[key]||'').trim()).filter(Boolean))].sort();return `<select aria-label="${label}筛选" onchange="App.leanAssets.filterBy('${kind}','${key}',this.value)"><option value="">全部${label}</option>${values.map(v=>`<option value="${E(v)}" ${f[key]===v?'selected':''}>${E(v)}</option>`).join('')}${all.some(a=>!String(a[key]||'').trim())?`<option value="__unset__" ${f[key]==='__unset__'?'selected':''}>未指定${label}</option>`:''}</select>`;};
 const columns=app?['应用名称','负责人','环境','操作']:['资产名称',...(kind==='code'?['版本数量']:[]),'负责人','更新时间','操作'];
 const body=rows.map(a=>{
  const title=`<button class="la-name" ${attr(kind,a.id)} onclick="App.leanAssets.open(this.dataset.kind,this.dataset.id)"><strong>${E(a.name||a.id)}</strong></button>`;
  const cells=app?[title,display(a.owner),display(a.environment),A.entryManagement.button('applications',a.id)]:[title,...(kind==='code'?[`<span class="la-version-count">${arr(a.versions).length}</span>`]:[]),display(a.owner),date(a.updatedAt||a.createdAt),A.entryManagement.button(kind,a.id)];
  return `<tr>${cells.map((cell,i)=>`<td${app&&i===cells.length-1?' class="la-row-end"':''}>${cell}</td>`).join('')}</tr>`;
 }).join('');
 return `<div class="la-page la-inventory-page">${A.heading('',kinds[kind].name,'')}<section class="card la-inventory"><div class="la-list-toolbar"><div class="la-inventory-filters">${choices('owner','负责人')}${app?choices('environment','环境'):''}</div><label class="la-search">${A.icon('search',16)}<input type="search" aria-label="${app?'搜索应用名称':'搜索资产名称'}" placeholder="${app?'搜索应用名称':'搜索资产名称'}" value="${E(L.query[kind]||'')}" onchange="App.leanAssets.filter('${kind}',this.value)"></label></div><div class="table-wrap"><table><thead><tr>${columns.map((c,i)=>`<th${app&&i===columns.length-1?' class="la-row-end"':''}>${c}</th>`).join('')}</tr></thead><tbody>${body||`<tr><td colspan="${columns.length}" class="la-empty-cell">${L.empty(kind,!!query||!!f.owner||!!f.environment)}</td></tr>`}</tbody></table></div></section></div>`;
};
const kv=(label,value)=>`<div><dt>${label}</dt><dd>${value}</dd></div>`;
L.profile=function(kind,a){
 const app=kind==='applications',model=kind==='models',versions=arr(a.versions),latest=versions.at(-1),format=v=>String(v?.fileName||v?.name||v?.path||'').match(/\.(tar\.gz|[a-z0-9]+)$/i)?.[1]?.toUpperCase()||'未记录';
 const facts=app?[['负责人',display(a.owner)],['环境',display(a.environment)],...(a.scene?[['业务场景',display(a.scene)]]:[])]:model?[['接入方式',L.isManaged(a)?'平台内置':'API 接入'],['服务地址',display(L.endpoint(a))],['连接状态',L.connectionState(a)],['平台用途',L.purposes(a)]]:[['负责人',display(a.owner)],['更新时间',date(a.updatedAt||a.createdAt)],...(kind==='web'?[['站点地址',display(a.url)]]:kind==='packages'?[['文件格式',format(latest)],['文件说明',display(a.description||latest?.note)]]:[])];
 let html=`<div class="la-profile"><div class="la-profile-head"><span class="la-profile-icon">${A.icon(kinds[kind].icon,25)}</span><div><span>${kinds[kind].single}</span><h3>${E((model?a.model||a.name:a.name)||a.id)}</h3></div></div><dl class="la-facts">${facts.map(([label,value])=>kv(label,value)).join('')}</dl>`;
 if(app&&a.description)html+=`<section class="la-detail-section"><h3>业务说明</h3><p>${E(a.description)}</p></section>`;
 if(['code','packages'].includes(kind))html+=`<section class="la-detail-section"><div class="la-section-label"><h3>版本记录</h3></div><div class="table-wrap"><table><thead><tr><th>版本名称</th>${kind==='packages'?'<th>文件格式</th>':''}<th>更新时间</th></tr></thead><tbody>${versions.slice().reverse().map(v=>`<tr><td><strong>${E(v.label||'版本未记录')}</strong></td>${kind==='packages'?`<td>${E(format(v))}</td>`:''}<td>${date(v.updatedAt||v.createdAt)}</td></tr>`).join('')||`<tr><td colspan="${kind==='packages'?3:2}" class="empty">暂无版本记录</td></tr>`}</tbody></table></div></section>`;
 return html+'</div>';
};
L.open=function(kind,id){const a=L.rows(kind).find(a=>a.id===id);if(!a)return;A.drawer(kinds[kind].single+'信息',L.profile(kind,a),'');};
L.applicationPage=function(id){const a=L.rows('applications').find(a=>a.id===id);return a?`<div class="la-page">${A.heading('',E(a.name),'应用档案',`<button class="btn" onclick="App.platform.go('assets','applications')">返回目录</button>`)}<section class="card la-profile-page">${L.profile('applications',a)}</section></div>`:L.list('applications');};
Q.assetDetail=L.open;
Q.assetsHTML=L.list;
A.platformGovernance.assetsHTML=L.list;
R.inline=(kind,id)=>nameTags(L.appNames(kind,id));
R.assetSection=(kind,id)=>{const names=L.appNames(kind,id);return names.length?`<section class="la-detail-section"><h3>关联应用</h3>${nameTags(names)}</section>`:'';};
R.listHTML=()=>L.list('applications');
R.open=id=>L.open('applications',id);
A.contentSafety.assetHTML=()=>A.platform.applicationId?L.applicationPage(A.platform.applicationId):L.list('applications');
R.scanField=()=>'';

L.connect=function(id){
 const asset=id&&L.rows('models').find(m=>m.id===id);if(asset&&L.isManaged(asset)){L.open('models',id);return;}
 L.connectionOrigin=true;X.connectionKind='model';const model=C.db.find(m=>m.id===id);C.open(id||'');
 // Editing a listed demonstration connection updates that identity rather than making a duplicate.
 if(model&&C.draft&&C.draft.id!==model.id){Object.assign(C.draft,{id:model.id,name:model.name,endpoint:model.endpoint||'',sample:false});C.form();}
};
// This standalone demo checks fields locally and never asserts network connectivity.
C.accessTestHTML=function(d){
 if(!d.testing&&!d.tested)return '';
 return `<p class="la-validation-state" role="status">${d.testing?'正在校验配置…':'配置格式校验通过 · 未验证服务连接'}</p>`;
};
C.renderAccessTest=function(){
 const d=C.draft;if(!d)return;const button=document.getElementById('c-test-btn'),steps=document.getElementById('connection-test-steps'),save=document.getElementById('c-save-btn');
 if(button){button.disabled=!!d.testing;button.classList.toggle('ok',!!d.tested);button.innerHTML=d.testing?'校验中…':d.tested?'✓ 配置校验通过':'配置校验';}
 if(steps)steps.innerHTML=C.accessTestHTML(d);if(save)save.disabled=!d.tested;
};
C.testDraft=function(){
 C.capture();const d=C.draft;if(!d)return false;const issue=(C.validateComparison?C.validateComparison(d):'')||C.validate(d),error=document.getElementById('connection-error');if(error)error.textContent=issue;
 C.markDirty();if(issue)return false;d.tested=true;d.testing=false;d.testProgress=3;d.testFingerprint=C.testFingerprint(d);d.validationMode='local-format';C.renderAccessTest();return true;
};
C.test=function(id){
 const m=C.db.find(m=>m.id===id);if(!m)return false;const draft={...m,key:C.secrets.get(id)||'',useSavedKey:true};
 const issue=m.presetPending?'请先补全接入配置':C.validate(draft);m.configurationCheck={valid:!issue,checkedAt:new Date().toISOString(),mode:'local-format'};m.connectStatus=issue?'fail':'ok';A.save();A.render();A.toast(issue?'配置校验未通过：'+issue:'配置格式校验通过；尚未验证服务连接');return !issue;
};
const connectionForm=C.form;
C.form=function(){const modal=A.modal;A.modal=function(title,body,footer,options){return modal.call(A,title,body.replace(/测试连接/g,'配置校验').replace(/<p class="call-id-help">[\s\S]*?<\/p>/,'<p class="call-id-help">仅校验配置格式，不调用模型服务。</p>'),String(footer||'').replace(/测试连接/g,'配置校验'),options);};try{return connectionForm.apply(C,arguments);}finally{A.modal=modal;}};
const saveConnection=C.save;
C.save=function(){const fromAssets=L.connectionOrigin&&A.platform.state.section==='assets',draft=C.draft,result=saveConnection.apply(C,arguments);if(fromAssets&&draft&&!C.draft){const saved=C.db.find(m=>m.id===draft.id);if(saved){delete saved.simulated;delete saved.demoConfigured;saved.sample=false;A.save();}L.connectionOrigin=false;X.tab='models';A.platform.state={section:'assets',item:'models'};A.render();}return result;};
M.render=function(){
 M.init();const f=M.filter,q=f.query.trim().toLowerCase(),all=L.rows('models'),rows=all.filter(m=>{const state=L.modelState(m),d=m._serviceType?{roles:serviceReady(m)?['guard']:[]}:M.get(m.id);return (!q||[m.name,m.model,m.endpoint].join(' ').toLowerCase().includes(q))&&(!f.state||(f.state==='pending'?L.needsConfiguration(m):state===f.state))&&(!f.role||d?.roles.includes(f.role));});
 const continuation=Q.pendingScanDraft?'<div class="aq-return-draft"><span>检测任务草稿已保留</span><button class="btn" onclick="App.assessment.resumeScanDraft()">继续创建任务</button></div>':'';
 const body=rows.map(m=>{const managed=L.isManaged(m),state=L.modelState(m),label=managed?(serviceReady(m)?'已就绪':'服务异常'):m._serviceType?(serviceReady(m)?'已配置':'未配置'):M.stateLabel(m);return `<tr><td><button class="la-name" data-id="${E(m.id)}" onclick="App.leanAssets.open('models',this.dataset.id)"><span class="la-asset-symbol">${A.icon(managed?'shield':'box',17)}</span><span><strong>${E(m.name||m.model)}</strong><small class="la-model-id">${E(m.model||'—')}</small></span></button></td><td>${managed?'<span class="la-source-tag">平台内置</span>':'外部接入'}</td><td class="la-endpoint">${display(L.endpoint(m))}${managed?'':`<small>${L.connectionState(m)}</small>`}</td><td>${L.purposes(m)}</td><td>${status(label,state==='ready'?'ready':state==='changed'?'attention':'neutral')}</td><td><div class="la-management-actions">${managed?`<button class="link-btn" data-id="${E(m.id)}" onclick="App.leanAssets.open('models',this.dataset.id)">查看</button>`:m._serviceType?`<button class="link-btn" data-type="${E(m._serviceType)}" onclick="App.defensePolicies.serviceEdit(this.dataset.type)">配置服务</button>`:`<button class="link-btn" data-id="${E(m.id)}" onclick="App.leanAssets.connect(this.dataset.id)">编辑连接</button><button class="link-btn" data-id="${E(m.id)}" ${C.connState(m).testing?'disabled':''} onclick="App.connections.test(this.dataset.id)">配置校验</button><button class="link-btn" data-id="${E(m.id)}" onclick="App.modelRoles.edit(this.dataset.id)">配置用途</button>`}</div></td></tr>`;}).join('');
 return `<div class="la-page la-management">${continuation}${A.heading('','模型资产','统一管理模型接入、服务连接与平台用途。',`<button class="btn primary" onclick="App.leanAssets.connect()">${A.icon('plus',14)}接入模型</button>`)}<section class="card la-inventory"><div class="la-list-toolbar"><div class="la-management-filters"><span class="la-model-total"><strong>${all.length}</strong> 项模型</span><select aria-label="用途筛选" onchange="App.modelRoles.filterBy('role',this.value)"><option value="">全部用途</option>${Object.entries(M.roles).map(([value,label])=>`<option value="${value}" ${f.role===value?'selected':''}>${label}</option>`).join('')}</select><select aria-label="配置状态筛选" onchange="App.modelRoles.filterBy('state',this.value)"><option value="">全部状态</option>${Object.entries({pending:'待配置',unassigned:'未配置用途',ready:'已配置',changed:'需重新确认',disabled:'未启用用途',offline:'连接不可用'}).map(([value,label])=>`<option value="${value}" ${f.state===value?'selected':''}>${label}</option>`).join('')}</select></div><label class="la-search">${A.icon('search',16)}<input type="search" aria-label="搜索模型" placeholder="搜索名称或模型标识" value="${E(f.query)}" onchange="App.modelRoles.filterBy('query',this.value)"></label></div><div class="table-wrap"><table><thead><tr><th>模型</th><th>接入方式</th><th>服务连接</th><th>平台用途</th><th>配置状态</th><th>操作</th></tr></thead><tbody>${body||'<tr><td colspan="6" class="empty">暂无匹配模型</td></tr>'}</tbody></table></div><div class="la-table-note">未配置用途的模型不可用于新任务。平台内置模型由平台维护。</div></section></div>`;
};

const contracts={basic:['chat'],safety:['chat','qwen3guard'],embedding:['embeddings'],multimodal:['multimodal-chat']};
const compatible={chat:['target','attacker','judge','scanner'],'multimodal-chat':['target','attacker','judge','scanner'],qwen3guard:['guard'],embeddings:['embedding']};
const supported=d=>(compatible[d.outputProtocol]||[]).filter(r=>d.type!=='safety'||r!=='attacker');
M.edit=function(id){const asset=L.rows('models').find(v=>v.id===id);if(asset&&L.isManaged(asset)){L.open('models',id);return;}const m=C.db.find(v=>v.id===id);if(!m)return;M.draft=M.get(id);if(m.systemGuard||id==='system-qwen3guard'){M.draft.type='safety';M.draft.outputProtocol='qwen3guard';}else if(M.draft.outputProtocol==='unconfigured')M.draft.outputProtocol=contracts[M.draft.type][0];M.editor();};
M.editor=function(){
 const d=M.draft,m=C.db.find(v=>v.id===d?.modelId);if(!m)return;const fixed=!!m.systemGuard||m.id==='system-qwen3guard';
 const body=`<div class="la-role-editor"><p class="la-edit-subject">${E(m.name||m.model)}</p><div class="form-grid"><div class="field"><label for="mr-type">模型类型</label><select id="mr-type" ${fixed?'disabled':''} onchange="App.modelRoles.changeType(this.value)">${Object.entries(M.types).map(([id,label])=>`<option value="${id}" ${d.type===id?'selected':''}>${label}</option>`).join('')}</select></div><div class="field"><label for="mr-protocol">输出能力</label><select id="mr-protocol" ${fixed?'disabled':''} onchange="App.modelRoles.changeProtocol(this.value)">${contracts[d.type].filter(id=>fixed||id!=='qwen3guard').map(id=>`<option value="${id}" ${d.outputProtocol===id?'selected':''}>${M.protocols[id]}</option>`).join('')}</select></div></div><fieldset class="mr-role-choices"><legend>平台用途 <span>可多选</span></legend>${Object.entries(M.roles).map(([id,label])=>{const enabled=supported(d).includes(id);return `<label class="${enabled?'':'disabled'}"><input type="checkbox" ${d.roles.includes(id)?'checked':''} ${enabled?'':'disabled'} onchange="App.modelRoles.toggleRole('${id}',this.checked)"><span>${label}</span></label>`;}).join('')}</fieldset><p class="hint">清空用途后，该模型不再供新任务选用。</p>${M.state(m)==='changed'?'<p class="error-message">连接已变更，请重新确认用途。</p>':''}<p id="mr-error" class="error-message" role="alert"></p></div>`;
 A.modal('配置模型用途',body,'<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.modelRoles.save()">保存</button>');
};
X.guardConnectionHint='护栏未就绪，请在资产中心 → 模型查看检测服务。';
const render=A.modules.attack.render;
A.modules.attack.render=function(){A.platform.sync();const {section,item}=A.platform.state;if(section==='assets'&&item==='models')return M.render();if(section==='assets'&&kinds[item])return item==='applications'&&A.platform.applicationId?L.applicationPage(A.platform.applicationId):L.list(item);return render.apply(this,arguments);};
})();
};

// ─── lean-operations ───────────────────────────────────────────────────────
AppParts['assets/lean-operations'] = function () {
/* A concise operational surface; configuration, runtime evidence and user alerts stay distinct. */
(function(){
'use strict';
const A=window.App,S=A.contentSafety,G=A.guardrail,C=A.contentProduct,O=A.protectionOps,D=A.defensePolicies,P=A.contentPolicies,M=A.modelRoles,R=A.platformGovernance,E=A.escape;
if(!S||!G||!O||!D||!R)return;
const L=A.leanOperations={},copy=v=>JSON.parse(JSON.stringify(v));
const stageNames={input:'输入',output:'输出'},actionNames={allow:'放行',log:'放行',block:'阻断',pending:'待执行回执'};
const badge=(name,tone='gray')=>A.badge(name,tone);
const pick=(value,handler,items,label)=>`<select aria-label="${label}" onchange="${handler}"><option value="">${label}</option>${items.map(([id,name])=>`<option value="${E(id)}" ${value===id?'selected':''}>${E(name)}</option>`).join('')}</select>`;
const isSample=r=>!!(r.seedFixture||r.fixture||r.simulation||r.demo||['fixture','local-rule-test','console'].includes(r.source)||['test','console','evaluation'].includes(r.scope));
L.isSample=isSample;
L.serviceReady=function(service){
 if(typeof service==='string')service=D.service(service);
 if(!service||!['configured','verified'].includes(service.status)||!String(service.model||'').trim())return false;
 try{const u=new URL(service.endpoint);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password;}catch(e){return false;}
};
L.serviceRecord=service=>({...copy(service),kind:'model',systemGuard:true,accessType:'api',protocol:'openai',connectStatus:L.serviceReady(service)?'configured':'pending',uses:L.serviceReady(service)?['guard']:[],caps:service.protocol==='singguard'?['text','vision']:['text'],configurationRevision:service.version});
const oldModelRecord=P.modelRecord,oldCandidates=P.modelCandidates,oldAllows=M.allows,oldRoleCandidates=M.candidates;
const serviceById=id=>Object.values(A.data.defenseServices||{}).find(s=>s.id===id);
P.modelRecord=function(id){const service=serviceById(id);return service?L.serviceRecord(service):oldModelRecord.call(P,id);};
M.allows=function(model,role){const service=serviceById(typeof model==='string'?model:model?.id);return service?role==='guard'&&L.serviceReady(service):oldAllows.call(M,model,role);};
M.candidates=function(role){const ordinary=oldRoleCandidates.call(M,role).filter(m=>!serviceById(m.id));return role==='guard'?[...ordinary,...Object.values(A.data.defenseServices||{}).filter(L.serviceReady).map(L.serviceRecord)]:ordinary;};
P.modelCandidates=function(role='guard'){return role==='guard'?M.candidates('guard'):oldCandidates.call(P,role);};
D.services=function(){A.closeDrawer();A.platform.go('assets','models');};
D.serviceEdit=function(type){const service=D.service(type);if(!service)return;D.serviceDraft={...copy(service),type};const d=D.serviceDraft;A.modal('配置检测服务',`<div class="lo-service-id"><strong>${E(d.name)}</strong>${badge('护栏专用','blue')}</div><div class="field"><label for="dp-service-model">模型标识 *</label><input id="dp-service-model" value="${E(d.model||'')}" oninput="App.defensePolicies.serviceDraft.model=this.value"></div><div class="field"><label for="dp-service-url">推理服务地址 *</label><input id="dp-service-url" value="${L.serviceReady(d)?E(d.endpoint):''}" placeholder="https://your-service.example.com/v1" oninput="App.defensePolicies.serviceDraft.endpoint=this.value"></div><p class="field-help">保存接入配置后可供防护策略使用。当前 Demo 不执行服务连接验证。</p><p id="dp-service-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.defensePolicies.serviceSave()">保存配置</button>`);if(!L.serviceReady(d))D.serviceDraft.endpoint='';};
D.serviceSave=function(){const d=D.serviceDraft,service={...copy(d||{}),status:'configured'};if(!L.serviceReady(service)){const el=document.getElementById('dp-service-error');if(el)el.textContent='请填写模型标识与不含账号密码的 HTTP(S) 地址';return false;}A.data.defenseServices[d.type]={...service,version:(Number(d.version)||0)+1,source:'user'};for(const p of D.policyRows().filter(p=>p.modelEnabled&&p.detectorModelId===d.id))D.store(p,false);S.audit('detector.configure',d.id,'保存检测服务配置：'+d.name);A.save();A.closeModal();A.render();A.toast('检测服务配置已保存');return true;};
L.policyIssue=function(p){
 if(!p?.enabled)return '策略已停用';
 if(p.policyType==='custom')return D.hasSemantic(p)&&!P.modelCandidates('embedding').some(m=>m.id===p.embeddingModelId)?'语义模型未配置':'';
 if(p.modelEnabled===false)return '';
 const service=serviceById(p.detectorModelId);if(service){if(!L.serviceReady(service))return '检测服务未配置';if(p.modelSnapshot&&(p.modelSnapshot.endpoint!==service.endpoint||p.modelSnapshot.model!==service.model))return '策略版本待更新';return '';}return M.candidates('guard').some(m=>m.id===p.detectorModelId)?'':'检测模型未配置';
};
L.appIssue=function(id){if(S.app(id)?.status!=='online')return '应用已停用';const policies=O.policies(id);if(!policies.length)return '待绑定策略';return policies.map(L.policyIssue).find(Boolean)||'';};
L.ready=id=>!L.appIssue(id);
G.connection=function(id){const issue=L.appIssue(id);if(issue)return issue;return O.active(id)?'演示已开启':'配置就绪';};
S.bindingStatus=G.connection;
const oldReceipt=G.receipt;
G.receipt=function(id,stage){const r=oldReceipt.call(G,id,stage);return r&&!isSample(r)&&r.externalVerified===true?r:undefined;};
S.stageReady=(id,stage)=>!!(L.ready(id)&&O.active(id)&&O.policies(id,stage).length&&G.receipt(id,stage));
G.configReady=(id,stage)=>!!(L.ready(id)&&O.policies(id,stage).length);
const oldStart=O.start,oldIngest=G.ingest;
O.start=function(id){const issue=L.appIssue(id);if(issue)return {error:issue==='检测服务未配置'||issue==='检测模型未配置'?'请先在资产中心配置检测模型':issue};const session=oldStart.call(O,id);if(session&&!session.error){session.simulation=true;A.save();}return session;};
O.toggle=function(id){const result=O.active(id)?O.stop(id):O.start(id);if(result?.error){A.toast(result.error);return false;}A.render();A.toast(result?.kind==='session'?'演示已结束，本轮记录已保存':'演示已开启，尚未接收真实业务流量');return result;};
G.ingest=function(input,opts={}){if(O.active(input.appId)){const issue=L.appIssue(input.appId);if(issue)return {error:issue};}const result=oldIngest.call(G,input,opts);if(result?.id){result.simulation=opts.externalVerified!==true;result.externalVerified=opts.externalVerified===true;A.save();}return result;};
S.run=(input,opts={})=>G.ingest(input,{...opts,scope:opts.scope||'console'});
const validateBlue=A.attack.validateBlue;
A.attack.guardReady=()=>L.serviceReady(D.service('text'));
A.attack.guardConnectionHint='平台内置 Qwen3Guard 检测服务暂不可用。';
A.attack.validateBlue=function(w){if(w.defenseMode==='qwen3guard'&&!L.serviceReady(D.service('text')))return A.attack.guardConnectionHint;return validateBlue.call(A.attack,w);};
const retestError=A.policies.retestError;
A.policies.retestError=function(snapshot){const model=snapshot?.defense?.model;if(model?.detectorServiceVersion&&!L.serviceReady(serviceById(model.id)))return '检测服务暂不可用，请联系平台运维确认部署配置';return retestError.call(A.policies,snapshot);};
R.runtimeRecords=()=>G.records().filter(r=>!isSample(r)&&r.externalVerified===true);
const sourceRecords=R.sourceRecords;
R.sourceRecords=function(source,metric){return sourceRecords.call(R,source,metric).filter(r=>{if(source!=='attack')return true;const t=A.attack.db.tasks.find(t=>t.id===r.taskId);return !(t?.simulation||t?.simulated||t?.resultSource==='simulation'||t?.runSnapshot?.simulated||t?.executionSnapshot?.simulated);});};

S.applicationForm=function(id){S.init();const a=S.app(id)||{name:'',applicationType:'application',scene:'',owner:'',environment:'测试环境',description:'',status:'online'};S.appDraft={...copy(a),applicationType:'application'};G.newApplication=false;A.modal(id?'编辑应用':'接入应用',`<div class="form-grid"><div class="field"><label for="cs-app-name">应用名称 *</label><input id="cs-app-name" maxlength="80" value="${E(a.name)}" oninput="App.contentSafety.appDraft.name=this.value"></div><div class="field"><label for="cs-app-scene">业务场景 *</label><input id="cs-app-scene" maxlength="80" value="${E(a.scene||'')}" placeholder="如：智能客服、办公助手" oninput="App.contentSafety.appDraft.scene=this.value"></div><div class="field"><label for="cs-app-owner">负责人 *</label><input id="cs-app-owner" maxlength="80" value="${E(a.owner||'')}" oninput="App.contentSafety.appDraft.owner=this.value"></div><div class="field"><label for="cs-app-env">部署环境</label><select id="cs-app-env" onchange="App.contentSafety.appDraft.environment=this.value">${['测试环境','预发环境','生产环境'].map(v=>`<option ${a.environment===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label for="cs-app-state">应用状态</label><select id="cs-app-state" onchange="App.contentSafety.appDraft.status=this.value"><option value="online" ${a.status==='online'?'selected':''}>已部署</option><option value="offline" ${a.status!=='online'?'selected':''}>已停用</option></select></div></div><div class="field"><label for="cs-app-description">说明</label><textarea id="cs-app-description" maxlength="300" rows="2" oninput="App.contentSafety.appDraft.description=this.value">${E(a.description||'')}</textarea></div><p class="field-help">登记后配置输入、输出防护。Agent 工具调用需要另行接入检查点。</p><p id="cs-app-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.contentSafety.saveApplication()">${id?'保存':'继续配置'}</button>`);};
G.addApplication=function(){S.applicationForm();G.newApplication=true;};
L.editAppInfo=function(id){L.returnConfig=copy(O.draft);const modal=A.modal;A.modal=function(title,body,footer,options){return modal.call(A,title,body,footer.replace('onclick="App.closeModal()"','onclick="App.leanOperations.returnToConfig()"'),options);};try{A.closeDrawer();S.applicationForm(id);document.getElementById('modal')?.querySelector('.close-btn')?.setAttribute('onclick','App.leanOperations.returnToConfig()');}finally{A.modal=modal;}};
L.returnToConfig=function(){A.closeModal();if(L.returnConfig){O.draft=L.returnConfig;L.returnConfig=null;O.configForm();}};
const saveApplication=S.saveApplication;
S.saveApplication=function(){const result=saveApplication.apply(S,arguments);if(result&&L.returnConfig)L.returnToConfig();return result;};
if(A.applicationAssets){const links=A.applicationAssets,saveLinks=links.save,cancelLinks=links.cancel;L.editRelations=function(id){L.returnConfig=copy(O.draft);links.editApplication(id);document.getElementById('modal')?.querySelector('.close-btn')?.setAttribute('onclick','App.applicationAssets.cancel()');};links.save=function(){const result=saveLinks.apply(links,arguments);if(result&&L.returnConfig)L.returnToConfig();return result;};links.cancel=function(){const result=cancelLinks.apply(links,arguments);if(L.returnConfig)L.returnToConfig();return result;};}
const appFilter=()=>pick(G.appFilter,'App.guardrail.appFilter=this.value;App.render()',S.apps.map(a=>[a.id,a.name]),'全部应用');
L.recordSummary=function(rows){const all=rows.length,counts={Safe:0,Controversial:0,Unsafe:0,Unknown:0};for(const r of rows){const verdict=r.detectionComplete===false||r.error?'Unknown':r.safety||r.original?.safety;counts[Object.hasOwn(counts,verdict)?verdict:'Unknown']++;}return {all,counts,real:rows.filter(r=>!isSample(r)&&r.externalVerified).length};};
L.bar=function(items,total,aria){return `<div class="lo-stack" role="img" aria-label="${E(aria)}">${items.filter(i=>i[1]>0).map(([label,n,color])=>`<span style="width:${total?n/total*100:0}%;--segment:${color}" title="${E(label)} ${n}"></span>`).join('')}</div><div class="lo-legend">${items.map(([label,n,color])=>`<span><i style="--segment:${color}"></i>${E(label)}<strong>${n}</strong></span>`).join('')}</div>`;};
L.empty=()=>`<div class="lo-empty-traffic"><div class="lo-path" aria-hidden="true"><span>输入检测</span><i></i><strong>应用 / Agent</strong><i></i><span>输出检测</span></div><h3>尚无检测流量</h3><p>完成接入后，这里展示输入与输出的检测结论和实际处置。</p></div>`;
L.appTable=function(){const apps=S.apps.filter(a=>!G.appFilter||a.id===G.appFilter);return `<section class="card lo-apps"><div class="card-head"><h2 class="card-title">应用防护</h2><span class="muted">${apps.length} 个应用</span></div><div class="table-wrap"><table><thead><tr><th>应用</th><th>输入防护</th><th>输出防护</th><th>当前状态</th><th>操作</th></tr></thead><tbody>${apps.map(a=>{const active=O.active(a.id),connected=L.connected?.(a.id),issue=L.appIssue(a.id),state=G.connection(a.id);return `<tr><td><strong>${E(a.name)}</strong><small>AI 应用 · ${E(a.environment||'未标注环境')}</small></td>${['input','output'].map(stage=>{const policies=O.policies(a.id,stage);return `<td><span>${policies.length?policies.length+' 条策略':'未绑定'}</span><small>${policies.map(p=>E(p.name)).join('、')||'—'}</small></td>`;}).join('')}<td>${badge(state,issue?'gray':active?'blue':'green')}<small>${active?.demoScenario?'演示接入':connected?'应用输入与输出防护':active?'当前为本地演示':issue?'完善配置后可开启':'尚未接入业务流量'}</small></td><td><div class="lo-actions"><button class="link-btn" data-id="${E(a.id)}" onclick="App.protectionOps.config(this.dataset.id)">配置</button>${active?`<button class="link-btn" data-id="${E(a.id)}" onclick="App.protectionOps.toggle(this.dataset.id)">结束演示</button>`:!issue?`<button class="link-btn" data-id="${E(a.id)}" onclick="App.protectionOps.toggle(this.dataset.id)">开启演示</button>`:''}</div></td></tr>`;}).join('')||'<tr><td colspan="5" class="empty">接入第一个应用，配置输入与输出防护。</td></tr>'}</tbody></table></div></section>`;};
O.appTable=L.appTable;
C.overview=function(){const rows=G.scope(),summary=L.recordSummary(rows),apps=S.apps.filter(a=>!G.appFilter||a.id===G.appFilter),connected=apps.filter(a=>L.connected?.(a.id)).length,review=O.pending().length;return A.heading('','防护概览','为应用与 Agent 配置输入、输出检测。',`<button class="btn primary" onclick="App.guardrail.addApplication()">＋ 接入应用</button>`)+`<div class="lo-toolbar">${appFilter()}${S.timeFilter()}${rows.some(isSample)?'<span class="lo-demo-label">演示数据</span>':''}</div><div class="lo-readiness"><div><strong>${connected}<small> / ${apps.length}</small></strong><span>已接入防护</span></div><p>${connected?'按应用绑定输入与输出策略，汇总检测结果与处置。':'为应用绑定策略并完成防护接入。'}</p></div>`+L.appTable()+`<section class="card lo-detection"><div class="card-head"><h2 class="card-title">检测与处置</h2>${rows.length?`<button class="link-btn" onclick="App.protectionOps.openRecords()">查看记录</button>`:''}</div>${rows.length?`<div class="lo-results"><div><span class="lo-caption">${summary.real===summary.all?'检测记录':'演示检测记录'} · ${summary.all} 条</span>${L.bar([['安全',summary.counts.Safe,'#4d9d94'],['待确认',summary.counts.Controversial,'#d8a249'],['不安全',summary.counts.Unsafe,'#cf6d75'],['检测异常',summary.counts.Unknown,'#9ba5b3']],summary.all,'检测结论分布')}</div><div class="lo-execution"><div><strong>${rows.filter(r=>r.enforcementAck&&(r.effectiveAction||r.action)==='block').length}</strong><span>已执行阻断</span></div><div><strong>${rows.filter(r=>!r.enforcementAck).length}</strong><span>待执行回执</span></div><div><strong>${review}</strong><span>待人工复核</span></div></div></div>`:L.empty()}</section>`+(review||G.reviewTab==='complete'?G.reviewHTML():'');};
C.applications=C.overview;S.overview=C.overview;S.applications=C.overview;
S.riskBadge=value=>badge({Safe:'安全',Controversial:'待确认',Unsafe:'不安全',Unknown:'检测异常'}[value]||'未判定',{Safe:'green',Controversial:'orange',Unsafe:'red'}[value]||'gray');
const oldTable=S.requestTable;
S.requestTable=function(rows){return oldTable.call(S,rows).replace(/未命中所选风险/g,'未命中检测类别').replace(/(<small class="mono">)([^<]+)(<\/small>)/g,(match,start,id,end)=>start+id+end+(rows.some(r=>r.id===id&&isSample(r))?'<small class="lo-origin">演示记录</small>':''));};
const oldRecords=C.records;
C.records=function(){return oldRecords.call(C).replace('查看所有放行与阻断记录，关联自动判定、实际处置和人工标签。','保留检测结论、实际处置与人工复核。').replace(/Safe · 安全/g,'安全').replace(/Controversial · 有风险/g,'待确认').replace(/Unsafe · 不安全/g,'不安全').replace(/<p class="dp-footer-note">[\s\S]*?<\/p>/,'');};
const oldReports=C.reports;
C.reports=function(){return oldReports.call(C).replace(/运行中/g,'演示进行中').replace('每次开启到关闭形成一轮报告；运行中可查看当前统计。','按防护轮次查看记录与复核结论。').replace(/暂无防护轮次，开启应用防护后开始统计。/g,'暂无防护报告。结束一轮防护演示后，可查看本轮记录。').replace(/<p class="dp-footer-note">[\s\S]*?<\/p>/,'');};
const reportDetail=O.reportDetail;
O.reportDetail=function(id){const drawer=A.drawer;A.drawer=function(title,body,footer,options){return drawer.call(A,title,body.replace(/风险检出/g,'不安全 / 待确认').replace(/运行中/g,'演示进行中').replace(/关闭应用防护/g,'结束防护演示'),footer,options);};try{return reportDetail.call(O,id);}finally{A.drawer=drawer;}};

P.render=function(){C.init();const rows=D.policyRows().filter(p=>!D.query||(p.name+' '+p.description).includes(D.query));return `<div class="defense-product lean-operations">${A.heading('','防护策略','定义检测内容与处置动作，在安全防护中按应用绑定。',`<button class="btn primary" onclick="App.defensePolicies.${D.tab==='replies'?'replyEdit()':'edit()'}">＋ ${D.tab==='replies'?'新建代答':'自定义策略'}</button>`)}<div class="tabs dp-tabs">${[['policies','防护策略'],['replies','代答库'],['rules','规则库']].map(([id,name])=>`<button class="tab ${D.tab===id?'active':''}" onclick="App.defensePolicies.filter('tab','${id}')">${name}</button>`).join('')}</div>${D.tab==='replies'?D.repliesHTML():`<section class="card"><div class="toolbar"><input aria-label="搜索防护策略" value="${E(D.query)}" placeholder="搜索策略" onchange="App.defensePolicies.filter('query',this.value)"><span class="muted">${rows.length} 条策略</span></div><div class="table-wrap"><table><thead><tr><th>策略</th><th>检测方式</th><th>待确认 / 不安全时</th><th>配置状态</th><th>操作</th></tr></thead><tbody>${rows.map(p=>{const latest=P.latest(p.id),issue=L.policyIssue(latest||p);return `<tr><td><strong>${E(p.name)}</strong><small>${D.stages[p.stage]} · V${latest?.version||1}</small></td><td>${E(D.kinds[p.policyType].model)}<small>${p.policyType==='custom'?(p.customRules||[]).length+' 条规则':(p.modelCategories||[]).length+' 类检测'}</small></td><td>${E(D.actions[p.controversialAction])}<small>${E(D.actions[p.unsafeAction])}</small></td><td>${badge(issue||'已就绪',issue?'gray':'green')}</td><td><div class="lo-actions"><button class="link-btn" data-id="${E(p.id)}" onclick="App.defensePolicies.detail(this.dataset.id)">详情</button><button class="link-btn" data-id="${E(p.id)}" onclick="App.defensePolicies.edit(this.dataset.id)">配置</button>${A.entryManagement.button('defense-policy',p.id)}</div></td></tr>`;}).join('')||'<tr><td colspan="5" class="empty">暂无匹配策略</td></tr>'}</tbody></table></div></section>`}</div>`;};
const oldForm=D.form;
D.form=function(){const modal=A.modal;A.modal=function(title,body,footer,options){body=body.replace(/Controversial · 有风险/g,'Controversial · 待确认').replace(/专属检测服务/g,'护栏检测服务').replace('可用于新绑定','允许绑定');return modal.call(A,title,body,footer,options);};try{return oldForm.call(D);}finally{A.modal=modal;}};
const configForm=O.configForm;
O.configForm=function(){const drawer=A.drawer;A.drawer=function(title,body,footer,options){const id=O.draft?.appId,issue=L.appIssue(id),app=S.app(id);body=body.replace('规则、风险等级与处置方式由策略中心统一制定。','检测内容与处置动作由策略定义。').replace(/<button class="link-btn" onclick="App.closeDrawer\(\);App.defensePolicies.go\(\)">查看策略中心 →<\/button>/,'');if(issue==='检测服务未配置'||issue==='检测模型未配置')body=body.replace('<h3>绑定防护策略</h3>','<h3>绑定防护策略</h3><p class="lo-config-note">检测模型尚未配置。可先保存策略绑定，模型在资产中心配置。</p>');if(issue==='策略版本待更新')body=body.replace('<h3>绑定防护策略</h3>','<h3>绑定防护策略</h3><p class="lo-config-note">检测服务配置已更新，请将下方策略更新至最新版本并保存。</p>');body=body.replace('<section><h3>应用接入</h3>',`<details class="lo-app-information"><summary>应用信息</summary><p>${E(app?.scene||'未填写场景')} · ${E(app?.owner||'未指定负责人')}</p><div class="lo-actions"><button class="link-btn" data-id="${E(id)}" onclick="App.leanOperations.editAppInfo(this.dataset.id)">编辑应用信息</button></div></details><section><h3>应用接入</h3>`);return drawer.call(A,title,body,footer,options);};try{return configForm.call(O);}finally{A.drawer=drawer;}};
G.configForm=O.configForm;

const AP=A.policies;
L.attackPolicyIssue=function(policy){const v=policy?.revisions?.at(-1)||policy;if(!v?.version)return '未发布';return A.openrtJudge?.validate(AP.judgementFor(v))||'';};
AP.renderPolicies=function(){const rows=AP.db.filter(p=>(p.name+' '+p.description).toLowerCase().includes(AP.policyQuery.toLowerCase()));return `<div class="policy-page lean-operations"><section class="card"><div class="toolbar policy-toolbar"><input class="input" aria-label="搜索攻击策略" placeholder="搜索策略名称" value="${E(AP.policyQuery)}" oninput="App.policies.searchPolicies(this.value)"><button class="btn primary" onclick="App.policies.edit()">＋ 新建策略</button></div><div class="table-wrap"><table><thead><tr><th>策略名称</th><th>攻击方法</th><th>攻击题库</th><th>配置状态</th><th>操作</th></tr></thead><tbody>${rows.map(p=>{const v=p.revisions.at(-1),issue=L.attackPolicyIssue(p);return `<tr><td><button class="link-btn" data-id="${E(p.id)}" onclick="App.policies.detail(this.dataset.id)">${E(p.name)}</button></td><td>${p.methods.length} 种方法</td><td>${p.bankIds.length} 套题库</td><td>${badge(issue||'已完成',issue?'gray':'green')}${p.hasDraft?'<small>有未发布修改</small>':''}</td><td><div class="lo-actions"><button class="link-btn" data-id="${E(p.id)}" onclick="App.policies.edit(this.dataset.id)">编辑</button>${A.entryManagement.button('attack-policy',p.id)}</div></td></tr>`;}).join('')||'<tr><td colspan="5" class="empty">暂无攻击策略</td></tr>'}</tbody></table></div></section></div>`;};

const riskTime=value=>{const date=new Date(value||'');return Number.isFinite(date.getTime())?date.toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'):'—';};
const riskSearch=(value,placeholder,handler)=>`<label class="lo-risk-search">${A.icon('search',16)}<input type="search" aria-label="${placeholder}" placeholder="${placeholder}" value="${E(value||'')}" onchange="${handler}"></label>`;
L.clearRiskScope=function(){R.showEvents({domain:R.filter.domain,query:R.filter.query});};
R.ruleFilter ||= {domain:'',query:''};
R.filterRules=function(key,value){if(!['domain','query'].includes(key))return;R.ruleFilter[key]=value;A.render();};
R.eventHTML=function(){
 const rows=R.events(),f=R.filter,query=String(f.query||'').trim().toLowerCase();
 const filtered=rows.filter(e=>(!f.domain||e.domain===f.domain)&&(!f.metric||e.metric===f.metric)&&(!f.source||e.source===f.source)&&(!f.assetId||e.assetId===f.assetId)&&(!f.assetType||e.assetType===f.assetType)&&(!query||[e.assetName,e.ruleSnapshot?.name].join(' ').toLowerCase().includes(query)));
 const scope=[f.assetId?(rows.find(e=>e.assetId===f.assetId&&(!f.assetType||e.assetType===f.assetType))?.assetName||f.assetId):'',f.metric?R.metrics[f.metric]?.label||f.metric:'',f.source?R.sources[f.source]||f.source:''].filter(Boolean);
 return `<div class="lean-operations">${A.heading('','风险事件','')}<section class="card lo-risk-list"><div class="toolbar lo-risk-filters">${pick(f.domain,"App.platformGovernance.filterBy('domain',this.value)",Object.entries(R.domains),'全部风险域')}${scope.length?`<button class="lo-risk-scope" onclick="App.leanOperations.clearRiskScope()" title="清除限定范围">${E(scope.join(' · '))}<span aria-hidden="true">×</span></button>`:''}${riskSearch(f.query,'搜索事件或对象',"App.platformGovernance.filterBy('query',this.value)")}</div><div class="table-wrap"><table><thead><tr><th>风险事件</th><th>风险对象</th><th>风险域</th><th>触发时间</th></tr></thead><tbody>${filtered.map(e=>`<tr><td><button class="link-btn" data-id="${E(e.id)}" onclick="App.platformGovernance.eventDetail(this.dataset.id)">${E(e.ruleSnapshot?.name||e.name||'风险事件')}</button></td><td>${E(e.assetName||'—')}</td><td>${badge(R.domains[e.domain]||'—',e.domain==='evaluation'?'blue':'orange')}</td><td class="lo-risk-time">${E(riskTime(e.lastTriggeredAt||e.createdAt))}</td></tr>`).join('')||`<tr><td colspan="4" class="empty">${rows.length?'暂无匹配的风险事件':'暂无风险事件'}</td></tr>`}</tbody></table></div></section></div>`;
};
R.ruleHTML=function(){
 R.init();const f=R.ruleFilter,query=String(f.query||'').trim().toLowerCase(),rows=R.db.rules.filter(r=>(!f.domain||r.domain===f.domain)&&(!query||String(r.name||'').toLowerCase().includes(query)));
 return `<div class="lean-operations">${A.heading('','触发规则','',`<button class="btn primary" onclick="App.platformGovernance.editRule()">${A.icon('plus',14)}新建规则</button>`)}<section class="card lo-risk-list"><div class="toolbar lo-risk-filters">${pick(f.domain,"App.platformGovernance.filterRules('domain',this.value)",Object.entries(R.domains),'全部风险域')}${riskSearch(f.query,'搜索规则名称',"App.platformGovernance.filterRules('query',this.value)")}</div><div class="table-wrap"><table><thead><tr><th>规则名称</th><th>风险域</th><th class="lo-risk-row-end">操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>${E(r.name)}</strong></td><td>${badge(R.domains[r.domain]||'—',r.domain==='evaluation'?'blue':'orange')}</td><td class="lo-risk-row-end"><button class="link-btn" data-id="${E(r.id)}" onclick="App.platformGovernance.editRule(this.dataset.id)">编辑</button>${A.entryManagement.button('alert-rule',r.id)}</td></tr>`).join('')||'<tr><td colspan="3" class="empty">暂无匹配的触发规则</td></tr>'}</tbody></table></div></section></div>`;
};
})();
};

// ─── lean-platform ─────────────────────────────────────────────────────────
AppParts['assets/lean-platform'] = function () {
/* A lean product surface. Execution records remain in their original workbenches. */
(function(){
'use strict';
const A=window.App,X=A.attack,V=A.evaluation,Q=A.assessment,S=A.scanProduct,P=A.platform,H=A.platformHome,R=A.applicationAssets,E=A.escape,I=A.icon;
const L=A.leanPlatform={},arr=v=>Array.isArray(v)?v:[],stamp=v=>Date.parse(v||'')||0;
const types=[['attack','攻防演练'],['code-scan','代码检测'],['app-scan','二进制／软件包检测'],['web-scan','Web 检测']];
const states=[['running','进行中','#4b78b5'],['done','已结束','#669b90'],['stopped','已终止','#c7a36b'],['error','执行异常','#c8777e'],['pending','待执行','#aab6c5']];
const date=v=>stamp(v)?new Date(v).toLocaleDateString('sv-SE'):'—';
const time=v=>stamp(v)?new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}):'—';
const opts=(items,value)=>items.map(([id,name])=>`<option value="${E(id)}" ${id===value?'selected':''}>${E(name)}</option>`).join('');
const ref=t=>`data-id="${E(t.id)}"`;
const target=t=>t.targetName||t.targetSnapshot?.name||X.targetFor(t)?.name||'历史对象';
const sorted=tasks=>tasks.slice().sort((a,b)=>stamp(b.created)-stamp(a.created));
const newButton=()=>`<button class="btn primary" onclick="App.evaluation.newTask()">${I('plus',15)}新建评估任务</button>`;
const source=t=>t.snapshotId?'历史快照':'';
const empty=(title,description)=>`<div class="lp-empty"><span>${I('file',28)}</span><h3>${E(title)}</h3>${description?`<p>${E(description)}</p>`:''}</div>`;
const head=(title,extra='')=>`<div class="lp-panel-head"><h2>${title}</h2>${extra}</div>`;
L.resultHTML=function(t){const r=Q.taskResult(t);return `<strong class="lp-result">${E(r.main)}</strong><small>${E(r.sub)}</small>`;};
L.statusHTML=function(t){const running=t.status==='running',pct=V.metrics(t).pct;return `${Q.taskStatus(t)}${running?`<div class="lp-progress" role="progressbar" aria-label="任务进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>`:''}`;};
L.originHTML=t=>source(t)?`<span class="lp-origin ${t.snapshotId?'historical':''}">${source(t)}</span>`:'';
Q.taskRows=function(tasks){return tasks.map(t=>`<tr><td><button class="link-btn lp-task-name" ${ref(t)} onclick="App.evaluation.openTask(this.dataset.id)">${E(t.name)}</button><small>${L.originHTML(t)}${t.parentId?' · 复测':''}</small></td><td><span class="lp-type">${E(Q.taskName(t))}</span></td><td>${E(target(t))}<small>${E(t.targetMaterial?.version||t.targetSnapshot?.versionLabel||'')}</small></td><td>${L.statusHTML(t)}</td><td>${L.resultHTML(t)}</td><td class="lp-date" title="${E(t.created||'')}">${date(t.created)}<small>${time(t.created).split(' ').at(-1)}</small></td></tr>`).join('');};
L.taskTable=(tasks,toolbar='')=>`<section class="card lp-table">${toolbar}<div class="table-wrap"><table><thead><tr><th>任务名称</th><th>评估类型</th><th>评估对象 / 版本</th><th>执行状态</th><th>评估结果</th><th>创建时间</th></tr></thead><tbody>${Q.taskRows(tasks)||'<tr><td colspan="6">'+empty('暂无匹配任务','调整筛选条件，或新建一次评估。')+'</td></tr>'}</tbody></table></div></section>`;
L.executionHTML=function(tasks){
 const n=tasks.length,counts=states.map(([id,label,color])=>({id,label,color,n:tasks.filter(t=>(states.some(s=>s[0]===t.status)?t.status:'pending')===id).length}));let offset=0;
 const circles=counts.filter(s=>s.n).map(s=>{const size=s.n/Math.max(n,1)*100,html=`<circle cx="72" cy="72" r="56" pathLength="100" fill="none" stroke="${s.color}" stroke-width="13" stroke-dasharray="${size} ${100-size}" stroke-dashoffset="${-offset}" transform="rotate(-90 72 72)"/>`;offset+=size;return html;}).join('');
 return `<div class="lp-execution"><div class="lp-donut" role="img" aria-label="${E(counts.map(s=>s.label+' '+s.n+' 个').join('，'))}"><svg viewBox="0 0 144 144" aria-hidden="true"><circle cx="72" cy="72" r="56" fill="none" stroke="#eef2f7" stroke-width="13"/>${circles}</svg><div><strong>${n}</strong><span>评估任务</span></div></div><div class="lp-state-legend">${counts.filter(s=>s.id!=='pending'||s.n).map(s=>`<div><i style="background:${s.color}"></i><span>${s.label}</span><strong>${s.n}</strong></div>`).join('')}</div></div>`;
};
L.objects=()=>Q.objects().filter(o=>o.kind!=='applications'&&o.tasks.length);
L.latestHTML=function(){const objects=L.objects().filter(o=>o.tasks.some(V.reportReady)).sort((a,b)=>stamp(b.latest?.created)-stamp(a.latest?.created)).slice(0,3);return `<div class="lp-latest">${objects.map(o=>`<button data-key="${E(o.key)}" onclick="App.assessment.openObject(this.dataset.key)"><span class="lp-object-icon">${I(o.kind==='models'?'box':'code',20)}</span><span><strong>${E(o.name)}</strong><small>${E(Q.kinds[o.kind])} · ${o.tasks.length} 次评估${source(o.latest)?' · '+source(o.latest):''}</small></span><b>${E(Q.taskResult(o.latest).main)}</b></button>`).join('')||empty('尚无评估结果','任务产生有效记录后，查看对象指标。')}</div>`;};
L.readinessHTML=function(){const apps=arr(A.data.aiApplications),ready=apps.filter(a=>A.leanOperations.ready(a.id)).length,receipts=A.platformGovernance.runtimeRecords(),unassigned=A.connections.db.filter(m=>(m.kind||'model')==='model'&&!Object.values(A.data.defenseServices||{}).some(s=>s.id===m.id)&&A.modelRoles.state(m)==='unassigned').length;return `<section class="card lp-readiness">${head('防护接入',`<button class="link-btn" onclick="App.platform.go('protection','overview')">查看应用 ${I('chevron',13)}</button>`)}<div class="lp-readiness-title"><span class="lp-readiness-icon">${I('shield',26)}</span><div><h3>${receipts.length?'已有接入记录':ready?'等待业务接入':'完善防护配置'}</h3><p>${ready} / ${apps.length} 个应用配置就绪${receipts.length?' · '+receipts.length+' 条业务检测记录':' · 尚无业务检测记录'}</p></div></div><div class="lp-steps"><div class="${Object.values(A.data.defenseServices||{}).some(A.leanOperations.serviceReady)?'complete':''}"><i>1</i><span>检测服务</span></div><b></b><div class="${ready?'complete':''}"><i>2</i><span>应用与策略</span></div><b></b><div class="${receipts.length?'complete':''}"><i>3</i><span>业务接入</span></div></div>${unassigned?`<div class="lp-setup-note"><span>${unassigned} 个模型尚未配置用途</span><button class="link-btn" onclick="App.platform.go('management','model-roles')">配置用途</button></div>`:''}</section>`;};
V.homeHTML=function(){const tasks=V.allTasks(),rows=sorted(tasks).filter(t=>(Q.filter==='all'||(Q.filter==='attack'?V.type(t)==='attack':t.type===Q.filter))&&(Q.status==='all'||t.status===Q.status)&&(!Q.query||[t.name,t.id,target(t)].join(' ').toLowerCase().includes(Q.query.trim().toLowerCase())));const toolbar=`${head('评估任务',`<span>${rows.length} 个任务</span>`)}<div class="toolbar lp-toolbar"><input class="input" aria-label="搜索评估任务" placeholder="搜索任务或对象" value="${E(Q.query)}" onchange="App.assessment.change('query',this.value)"><select aria-label="评估类型" onchange="App.assessment.change('filter',this.value)">${opts([['all','全部评估类型'],...types],Q.filter)}</select><select aria-label="执行状态" onchange="App.assessment.change('status',this.value)">${opts([['all','全部状态'],...states.filter(s=>s[0]!=='pending')],Q.status)}</select></div>`;return `<div class="lp-page">${A.heading('','评估总览','统一查看评估任务与对象结果。',newButton())}<div class="lp-overview-grid"><section class="card">${head('任务执行',`<span>全部 ${tasks.length} 个任务</span>`)}${L.executionHTML(tasks)}</section><section class="card">${head('最近对象结果',`<button class="link-btn" onclick="App.platform.go('evaluation','reports','objects')">结果分析 ${I('chevron',13)}</button>`)}${L.latestHTML()}</section></div>${L.taskTable(rows,toolbar)}</div>`;};

// Task lists use the same vocabulary; detailed scanner screens are deliberately preserved.
S.render=function(tab='code-scan'){S.init();S.tab=types.some(t=>t[0]===tab)&&tab!=='attack'?tab:'code-scan';const selected=S.tasks().find(t=>t.id===S.selected&&t.type===S.tab);if(selected)return S.detailHTML(selected);const rows=sorted(S.tasks()).filter(t=>t.type===S.tab&&(S.filter==='all'||S.filter===t.status)&&(!S.query||[t.name,t.id,target(t)].join(' ').toLowerCase().includes(S.query.toLowerCase())));return `<div class="lp-page">${A.heading('',S.typeName(S.tab),'',`<button class="btn" onclick="App.scanProduct.recycle()">回收记录</button><button class="btn primary" onclick="App.scanProduct.newTask()">${I('plus',15)}新建检测任务</button>`)}<section class="card lp-table"><div class="toolbar lp-toolbar"><input id="scan-query" class="input" aria-label="搜索检测任务" placeholder="搜索任务或对象" value="${E(S.query)}" onchange="App.scanProduct.filterBy('query',this.value)"><select aria-label="检测状态" onchange="App.scanProduct.filterBy('filter',this.value)">${opts([['all','全部状态'],...states.filter(s=>s[0]!=='pending')],S.filter)}</select><span class="lp-count">${rows.length} 个任务</span></div><div class="table-wrap"><table><thead><tr><th>任务名称</th><th>评估对象 / 版本</th><th>执行状态</th><th>检测结果</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${rows.map(t=>`<tr><td><button class="link-btn lp-task-name" ${ref(t)} onclick="App.scanProduct.open(this.dataset.id)">${E(t.name)}</button><small>${L.originHTML(t)}</small></td><td>${E(target(t))}<small>${E(t.targetMaterial?.version||'')}</small></td><td>${L.statusHTML(t)}</td><td>${L.resultHTML(t)}</td><td class="lp-date">${date(t.created)}<small>${time(t.created).split(' ').at(-1)}</small></td><td>${S.actions(t)}</td></tr>`).join('')||`<tr><td colspan="6">${empty('暂无'+S.typeName(S.tab)+'任务','创建检测任务后，运行记录会显示在这里。')}</td></tr>`}</tbody></table></div></section></div>`;};
V.tasksHTML=function(){const rows=V.tasks(),f=V.taskFilters;return `<div class="lp-page">${A.heading('','任务管理','',`<button class="btn" onclick="App.evaluation.recycle()">回收记录</button><button class="btn primary" onclick="App.attack.newTask()">${I('plus',15)}新建演练任务</button>`)}<section class="card lp-table"><div class="toolbar lp-toolbar"><input class="input" id="ec-tasks-query" aria-label="搜索演练任务" placeholder="搜索任务或模型" value="${E(f.query)}" onchange="App.evaluation.filter('tasks','query',this.value)"><select aria-label="演练状态" onchange="App.evaluation.filter('tasks','status',this.value)">${opts([['all','全部状态'],...states.filter(s=>s[0]!=='pending')],f.status)}</select><span class="lp-count">${rows.length} 个任务</span></div><div class="table-wrap"><table><thead><tr><th>任务名称</th><th>靶标模型</th><th>执行状态</th><th>评估结果</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${rows.map(t=>`<tr><td><button class="link-btn lp-task-name" ${ref(t)} onclick="App.evaluation.openTask(this.dataset.id)">${E(t.name)}</button><small>${L.originHTML(t)}${t.parentId?' · 复测':''}</small></td><td>${E(target(t))}</td><td>${L.statusHTML(t)}</td><td>${L.resultHTML(t)}</td><td class="lp-date">${date(t.created)}</td><td><div class="ec-row-actions"><button class="link-btn" ${ref(t)} onclick="App.attack.showArena(this.dataset.id)">演练场</button>${t.status==='running'?`<button class="link-btn" ${ref(t)} onclick="App.attack.taskAction(this.dataset.id,'stop')">终止</button>`:`<button class="link-btn" ${ref(t)} onclick="App.attack.quickRetest(this.dataset.id)">复测</button>${A.entryManagement.button('attack-task',t.id)}`}</div></td></tr>`).join('')||`<tr><td colspan="6">${empty('暂无演练任务','配置靶标模型和攻击策略后开始评估。')}</td></tr>`}</tbody></table></div></section></div>`;};
V.enterProduct=id=>P.go('evaluation',id==='attack'?'attack':'scan',id==='attack'?'arena':id);
// The arena is an execution view of the same tasks, with an explicit, stable selection.
X.workspaceTasks=()=>X.db.tasks.filter(t=>!t.deletedAt).slice().sort((a,b)=>Number(b.status==='running')-Number(a.status==='running')||stamp(b.created)-stamp(a.created));
X.arenaHTML=function(){
 const tasks=X.workspaceTasks();
 if(!tasks.length)return `<section class="card arena-empty"><h2>还没有攻防任务</h2><p>新建任务后，在这里观察红队、蓝队、靶标与裁判的执行过程。</p><button class="btn primary" onclick="App.attack.newTask()">新建演练任务</button></section>`;
 if(!tasks.some(t=>t.id===X.arena.taskId)){X.arena={taskId:tasks[0].id,unitId:null,replay:null};X.focusNode=null;}
 const t=X.exerciseTask(),running=tasks.filter(t=>t.status==='running').length;
 return `<div class="arena-switcher"><div><span>演练任务</span><strong>${tasks.length}</strong><span>${running?'进行中 '+running:'暂无运行中任务'}</span>${L.originHTML(t)}</div><select aria-label="切换演练任务" onchange="App.attack.switchLive(this.value)">${tasks.map(row=>`<option value="${E(row.id)}" ${row.id===t.id?'selected':''}>${E(row.name)} · ${E(X.statusLabel(row))}</option>`).join('')}</select></div>${X.battleBoardHTML(t,false)}`;
};
// Application associations are maintained in the application asset list.
R.scanField=()=>'';
V.newTask=function(){A.modal('新建评估任务',`<div class="lp-task-choices">${[['attack','shield','攻防演练','测试模型对攻击的响应，查看 ASR 与判定记录。'],['code-scan','code','代码检测','分析代码，查看候选问题与验证证据。'],['app-scan','box','二进制／软件包检测','指定二进制或软件包，体验任务流程。'],['web-scan','link','Web 检测','指定站点与范围，体验任务流程。']].map(([id,icon,name,description])=>`<button data-type="${id}" onclick="App.assessment.startTask(this.dataset.type)"><span>${I(icon,22)}</span><strong>${name}</strong><p>${description}</p>${I('chevron',16)}</button>`).join('')}</div><p class="lp-form-note">新建任务使用本地流程；实际检测需对接执行服务。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button>`,{wide:true});};

const comparable=()=>L.objects().filter(o=>o.kind==='models'&&o.tasks.some(t=>V.reportReady(t)&&Q.taskResult(t).value!==null)).length>=2;
Q.reportNav=()=>`<div class="tabs ec-tabs lp-report-tabs">${[['list','任务报告'],['objects','对象评估历史'],...(comparable()?[['compare','模型结果对比']]:[])].map(([id,name])=>`<button class="tab ${V.reportTab===id?'active':''}" onclick="App.platform.go('evaluation','reports','${id==='list'?'':id}')">${name}</button>`).join('')}</div>`;
const partial=t=>t.status!=='done'||t.verificationComplete===false||t.resultSource==='simulation'||V.metrics(t).errors>0||V.metrics(t).done<V.metrics(t).total;
V.reportsHTML=function(){if(V.reportTab==='objects')return Q.objectResultsHTML();const heading=A.heading('','报告与分析','');if(V.reportTab==='compare')return `<div class="lp-page">${heading}${Q.reportNav()}${comparable()?X.seriesHTML():`<section class="card">${empty('暂无可比较结果','至少需要两个模型的可比结果。')}</section>`}</div>`;const rows=V.reports(),f=V.reportFilters;return `<div class="lp-page">${heading}${Q.reportNav()}<section class="card lp-table"><div class="toolbar lp-toolbar"><input class="input" id="ec-reports-query" aria-label="搜索报告" placeholder="搜索任务或对象" value="${E(f.query)}" onchange="App.evaluation.filter('reports','query',this.value)"><select aria-label="报告类型" onchange="App.evaluation.filter('reports','type',this.value)">${opts([['all','全部评估类型'],['attack','攻防演练'],['scan','漏洞扫描']],f.type)}</select><select aria-label="结果范围" onchange="App.evaluation.filter('reports','scope',this.value)">${opts([['all','全部结果范围'],['complete','完整结果'],['partial','部分结果']],f.scope)}</select><span class="lp-count">${rows.length} 份报告</span></div><div class="table-wrap"><table><thead><tr><th>任务报告</th><th>评估对象</th><th>评估结果</th><th>结果范围</th><th>创建时间</th></tr></thead><tbody>${rows.map(t=>`<tr><td><button class="link-btn lp-task-name" ${ref(t)} onclick="App.evaluation.openReport(this.dataset.id)">${E(t.name)}</button><small>${E(Q.taskName(t))} · ${L.originHTML(t)||'评估记录'}</small></td><td>${E(target(t))}<small>${E(t.targetMaterial?.version||'')}</small></td><td>${L.resultHTML(t)}</td><td>${A.badge(t.resultSource==='simulation'?'演示记录':partial(t)?'部分结果':'完整结果',partial(t)?'orange':'gray')}<small>${t.verificationComplete===false?'候选验证未完成':''}</small></td><td class="lp-date">${date(t.created)}</td></tr>`).join('')||`<tr><td colspan="5">${empty('暂无匹配报告','任务结束且产生记录后，报告自动归档。')}</td></tr>`}</tbody></table></div></section></div>`;};
Q.objectResultsHTML=function(){if(Q.selectedObject?.startsWith('applications:'))return L.applicationResultHTML(Q.selectedObject.slice(13));const objects=L.objects();if(Q.selectedObject){const o=objects.find(o=>o.key===Q.selectedObject);if(o)return Q.objectDetailHTML(o);}const apps=R.apps().map(a=>({key:'applications:'+a.id,kind:'applications',name:a.name,asset:a,summary:R.summary(a.id)})).filter(a=>a.summary.tasks.length);const rows=[...objects,...apps].filter(o=>(Q.objectKind==='all'||o.kind===Q.objectKind)&&(!Q.objectQuery||o.name.toLowerCase().includes(Q.objectQuery.toLowerCase())));return `<div class="lp-page">${A.heading('','报告与分析','')}${Q.reportNav()}<section class="card lp-table"><div class="toolbar lp-toolbar"><input class="input" aria-label="搜索评估对象" placeholder="搜索已评估对象" value="${E(Q.objectQuery)}" onchange="App.assessment.change('objectQuery',this.value)"><select aria-label="对象类型" onchange="App.assessment.change('objectKind',this.value)">${opts([['all','全部对象类型'],...Object.entries(Q.kinds).filter(([k])=>k!=='applications'||apps.length)],Q.objectKind)}</select><span class="lp-count">${rows.length} 个对象</span></div><div class="table-wrap"><table><thead><tr><th>评估对象</th><th>类型</th><th>评估次数</th><th>最近结果</th><th>最近评估</th></tr></thead><tbody>${rows.map(o=>`<tr><td><button class="link-btn lp-task-name" data-key="${E(o.key)}" onclick="App.assessment.openObject(this.dataset.key)">${E(o.name)}</button></td><td>${Q.kinds[o.kind]}</td><td>${(o.tasks||o.summary.tasks).length}</td><td>${o.summary?o.summary.evaluated+' 项资产有结果':L.resultHTML(o.latest)+'<small>'+L.originHTML(o.latest)+'</small>'}</td><td class="lp-date">${date(o.latest?.created||sorted(o.summary?.tasks||[])[0]?.created)}</td></tr>`).join('')||`<tr><td colspan="5">${empty('暂无匹配的评估对象','完成评估后，在这里查看指标与历史。')}</td></tr>`}</tbody></table></div></section></div>`;};
L.historyChart=function(o){
 const model=o.kind==='models',tasks=sorted(o.tasks).reverse().filter(t=>V.reportReady(t)&&Q.taskResult(t).value!==null),max=model?100:Math.max(5,Math.ceil(Math.max(0,...tasks.map(t=>Math.max(Q.taskResult(t).value,t.candidateCount||0)))/5)*5);
 if(!tasks.length)return empty('暂无有效结果','暂无有效检测指标。');
 return `<div class="lp-history-chart ${model?'model':'scan'}" role="group" aria-label="${model?'历次 ASR':'历次确认漏洞与候选数量'}"><div class="lp-chart-axis"><span></span><div><span>0${model?'%':''}</span><span>${max/2}${model?'%':''}</span><span>${max}${model?'%':''}</span></div><span></span></div>${tasks.map(t=>{const r=Q.taskResult(t);return `<button class="lp-chart-row" ${ref(t)} onclick="App.evaluation.openReport(this.dataset.id)"><span class="lp-chart-label"><strong>${date(t.created)}</strong><small>${E(t.targetMaterial?.version||source(t)||'评估记录')}</small></span><span class="lp-chart-plot">${model?`<i class="lp-asr-dot" style="left:${Math.max(0,Math.min(100,r.value))}%"></i>`:`<i class="lp-finding-bar" style="width:${r.value/max*100}%"></i><i class="lp-candidate-bar" style="width:${(t.candidateCount||0)/max*100}%"></i>`}</span><span class="lp-chart-value">${model?`<strong>${r.value.toFixed(1)}%</strong><small>${r.breach} / ${r.valid} 次</small>`:`<strong>${r.value} 已确认</strong><small>${t.candidateCount||0} 个候选</small>`}</span></button>`;}).join('')}</div>`;
};
Q.objectDetailHTML=function(o){const t=o.latest,model=o.kind==='models',r=t?Q.taskResult(t):null;return `<div class="lp-page">${A.heading('',E(o.name),Q.kinds[o.kind],`<button class="btn" onclick="App.platform.go('evaluation','reports','objects')">返回对象列表</button>`)}<section class="card lp-object-summary"><div><span>${model?'最近 ASR':'最近已确认漏洞'}</span><strong>${r?.value===null||r?.value===undefined?'—':model?r.value.toFixed(1)+'<small>%</small>':r.value+'<small>个</small>'}</strong></div><p>${r?E(r.sub):'暂无结果'}<small>${date(t?.created)}${t&&source(t)?' · '+source(t):''}</small></p><div class="lp-history-count"><strong>${o.tasks.length}</strong><span>次评估</span></div></section><section class="card lp-history">${head(model?'历次 ASR':'漏洞确认情况',model?'<span>攻破次数 / 有效判定</span>':'<div class="lp-chart-legend"><span><i></i>已确认</span><span><i class="candidate"></i>候选</span></div>')}${L.historyChart(o)}<p class="lp-chart-note">${model?'ASR 按有效判定计算。不同策略与配置的记录独立展示。':'候选未验证不计入确认漏洞；0 个确认漏洞不代表完成全部验证。'}</p></section><section class="lp-section-heading"><h2>评估历史</h2><span>点击任务查看原始记录</span></section>${L.taskTable(sorted(o.tasks))}</div>`;};
L.applicationResultHTML=function(id){const app=R.apps().find(a=>a.id===id),s=R.summary(id);if(!app)return A.heading('','应用不存在','',`<button class="btn" onclick="App.platform.go('evaluation','reports','objects')">返回对象列表</button>`);return `<div class="lp-page">${A.heading('',E(app.name),'关联技术资产的独立评估结果。',`<button class="btn" onclick="App.platform.go('evaluation','reports','objects')">返回对象列表</button>`)}${Q.reportNav()}<section class="card lp-table">${head('关联资产评估结果',`<span>${s.evaluated} / ${s.rows.length} 项有结果</span>`)}<div class="table-wrap"><table><thead><tr><th>技术资产</th><th>类型</th><th>最近结果</th><th>来源任务</th></tr></thead><tbody>${s.rows.map(r=>`<tr><td><button class="link-btn" data-key="${E(r.key)}" onclick="App.assessment.openObject(this.dataset.key)">${E(r.asset.name)}</button></td><td>${Q.kinds[r.kind]}</td><td>${r.resultTask?L.resultHTML(r.resultTask)+'<small>'+L.originHTML(r.resultTask)+'</small>':'暂无有效结果'}</td><td>${r.resultTask?`<button class="link-btn" ${ref(r.resultTask)} onclick="App.evaluation.openReport(this.dataset.id)">${E(r.resultTask.name)}</button><small>${E(r.resultTask.targetMaterial?.version||date(r.resultTask.created))}</small>`:'—'}</td></tr>`).join('')||`<tr><td colspan="4">${empty('暂无关联资产结果','')}</td></tr>`}</tbody></table></div><p class="lp-chart-note">按当前关联关系展示，结论以来源任务的版本与配置为准。</p></section></div>`;};
const applicationHTML=R.applicationHTML;
R.applicationHTML=function(id,report=false){return report?L.applicationResultHTML(id):applicationHTML.call(R,id,false);};
const relationEditor=R.editor;
R.editor=function(){const modal=A.modal;A.modal=function(title,body,footer,options){return modal.call(A,title,body.replace('暂无可关联对象，可先在资产中心登记。','暂无匹配对象。模型接入或创建检测任务后，相关资产会自动登记。'),footer,options);};try{return relationEditor.apply(R,arguments);}finally{A.modal=modal;}};
// Keep method variants available without letting one family fill the catalogue.
const AP=A.policies,B=A.banks;
AP.renderMethods=function(){
 const all=AP.methods(),rows=all.filter(m=>(AP.methodCategory==='all'||m.category===AP.methodCategory)&&[m.name,m.label,m.description].join(' ').toLowerCase().includes(AP.methodQuery.toLowerCase())),base=rows.filter(m=>!m.variant),variants=rows.filter(m=>m.variant);
 const table=items=>`<div class="table-wrap"><table><thead><tr><th>攻击方法</th><th>用途</th><th>分类</th></tr></thead><tbody>${items.map(m=>`<tr><td><button class="link-btn" data-id="${E(m.id)}" onclick="App.policies.methodDetail(this.dataset.id)">${E(m.name)}</button><small>${m.kind==='template'?'自定义模板':m.variant?'JailBroken 变体':'OpenRT'}</small></td><td>${E(m.label||m.description)}</td><td>${E(m.category)}</td></tr>`).join('')}</tbody></table></div>`;
 return `<section class="card lp-table lp-methods"><div class="toolbar lp-toolbar"><input class="input" id="policy-method-search" aria-label="搜索攻击方法" placeholder="搜索方法名称或用途" value="${E(AP.methodQuery)}" onchange="App.policies.searchMethods(this.value)"><select aria-label="攻击方法分类" onchange="App.policies.methodCategory=this.value;App.policies.redraw()">${opts([['all','全部分类'],...[...new Set(all.map(m=>m.category))].map(v=>[v,v])],AP.methodCategory)}</select><span class="lp-count">${rows.length} 个方法 / 变体</span></div>${base.length?table(base):''}${variants.length?`<details class="lp-method-family" ${AP.methodQuery||AP.methodCategory!=='all'?'open':''}><summary><span>JailBroken 文本变体</span><small>${variants.length} 项</small></summary>${table(variants)}</details>`:''}${!rows.length?empty('暂无匹配方法',''):''}</section>`;
};
AP.renderContent=function(){return `<section class="card lp-table"><div class="toolbar lp-toolbar"><input id="bank-catalog-search" class="input" aria-label="搜索题库名称" placeholder="搜索题库名称" value="${E(B.catalog.query)}" oninput="App.banks.searchCatalog(this.value)"><select aria-label="筛选题库来源" onchange="App.banks.filterCatalog(this.value)">${opts([['all','全部来源'],['builtin','系统'],['custom','自建']],B.catalog.source)}</select><span class="lp-count" id="bank-catalog-count">共 ${B.catalogRows().length} 个题库</span></div><div class="table-wrap"><table><thead><tr><th>题库名称</th><th>来源</th><th>行业</th><th>题目数量</th><th>操作</th></tr></thead><tbody id="bank-catalog-rows">${B.catalogTable()}</tbody></table></div></section>`;};
AP.renderWorkspace=function(){const kind=AP.section,methods=kind==='methods',content=kind==='content',title=methods?'攻击方法':content?'攻击题库':'攻击策略',description=methods?'选择方法，在攻击策略中配置参数。':content?'维护评估题目，发布策略时固定所用内容。':'固定攻击方法、题目与判定配置，供任务引用。',actions=methods?'<button class="btn primary" onclick="App.policies.newTemplate()">＋ 自定义模板</button>':content?'<button class="btn primary" onclick="App.banks.create()">＋ 新建题库</button>':'';return `<div class="lp-page">${A.heading('',title,description,actions)}${methods?AP.renderMethods():content?AP.renderContent():AP.renderPolicies()}</div>`;};
// Identify synthetic evidence in deep-linked reports as well as list rows.
for(const name of ['taskDetailHTML','reportDetailHTML']){const render=V[name];V[name]=function(t){const html=render.apply(V,arguments);return t&&V.type(t)==='attack'&&source(t)?`<div class="lp-example-note">${I('file',15)}${source(t)} · 用于体验评估流程，不代表真实模型测评结果</div>`+html:html;};}
})();
};

// ─── risk-demo ─────────────────────────────────────────────────────────────
AppParts['assets/risk-demo'] = function () {
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
};

// ─── model-intake-refinement ───────────────────────────────────────────────
AppParts['assets/model-intake-refinement'] = function () {
/* Model inventory: one model identity, verified API intake, and independent platform roles. */
(function(){
'use strict';
const A=window.App,C=A.connections,M=A.modelRoles,L=A.leanAssets,X=A.attack,E=A.escape;
if(!C||!M||!L)return;
const N=A.modelIntake={pending:new Map(),timeoutMs:15000};
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString();
const normalized=v=>String(v||'').trim().replace(/\/+$/,'');
const title=m=>{const name=String(managed(m)?m?.model||m?.name||'':m?.name||m?.model||'').trim();return managed(m)?name.split('/').at(-1):name;};
const managed=m=>L.isManaged(m);
const apiMode=d=>d.probeProtocol==='embeddings'?'embeddings':'chat';
const keyFor=d=>d.auth==='none'?'':String(d.key||'').trim()||(C.hasSavedKey(d)?C.secrets.get(d.id):'')||'';
const config=d=>JSON.stringify([normalized(d.endpoint),String(d.model||'').trim(),d.auth==='none'?'none':'bearer',apiMode(d)]);
const storedCheck=m=>m?.connectionCheck?.mode==='network'&&m.connectionCheck.valid===true&&m.connectionCheck.configuration===config(m);
const preset=m=>m?.connectionCheck?.mode==='preset'&&m.connectionCheck.valid===true&&m.connectionCheck.configuration===config(m);
const fixtureSignatures={m1:['Qwen2.5-72B-Instruct','https://model.example/v1'], 'deepseek-v3':['deepseek-v3.2','https://api.deepseek.com'], 'deepseek-judge':['gpt-4o-mini','https://api.openai.com/v1']};
N.isUntouchedFixture=function(m){const signature=fixtureSignatures[m.id];return !!signature&&m.model===signature[0]&&normalized(m.endpoint)===signature[1]&&(m.configurationRevision||1)===1&&!m.updatedAt&&!m.configurationCheck&&!m.connectionCheck&&(m.sample===true||m.demoConfigured===true||m.id!=='m1'&&X.db.referenceModelsVersion===1&&m.auth==='none'&&m.connectStatus==='ok');};
const status=(text,tone='neutral')=>`<span class="la-state la-state-${tone}"><i></i>${E(text)}</span>`;
const fieldError=text=>{const node=document.getElementById('connection-error');if(node)node.textContent=text||'';};

N.normalize=function(){
 for(const m of C.db||[]){
  if((m.kind||'model')!=='model')continue;
  m.name ||= title(m);m.probeProtocol ||= M.get?.(m.id)?.outputProtocol==='embeddings'?'embeddings':'chat';
  // Existing fixed catalogue entries carry a local preset, never a network verification claim.
  if(N.isUntouchedFixture(m)){m.connectionCheck={mode:'preset',valid:true,configuration:config(m),externalVerified:false};m.connectStatus='ok';}
 }
};
const init=C.init;
C.init=function(){const result=init.apply(C,arguments);N.normalize();return result;};
const moduleInit=A.modules.attack.init;
A.modules.attack.init=function(){const result=moduleInit.apply(this,arguments);N.normalize();return result;};
const assetRows=L.rows;
L.rows=function(kind){const values=assetRows.call(L,kind);return kind==='models'?values.map(m=>managed(m)?{...m,name:title(m)}:m):values;};

C.hasSavedKey=function(d){const old=C.db.find(m=>m.id===d?.id);return !!old&&d.useSavedKey!==false&&C.secrets.has(d.id)&&old.auth!=='none'&&normalized(old.endpoint)===normalized(d.endpoint);};
C.connState=function(m){
 if(!m)return {label:'未连通',tone:'gray',ok:false};
 if(managed(m)){const service=Object.values(A.data.defenseServices||{}).find(s=>s.id===m.id)||m;const ok=A.leanOperations?.serviceReady?.(service)===true;return {label:ok?'已连通':'连接异常',tone:ok?'green':'orange',ok};}
 if(N.pending.has(m.id))return {label:'测试中',tone:'blue',ok:false,testing:true};
 if(['fail','failed','disconnected'].includes(m.connectStatus))return {label:'连接失败',tone:'orange',ok:false};
 if(preset(m))return {label:'已连通',tone:'green',ok:true,preset:true};
 if(storedCheck(m)){if(m.auth!=='none'&&!C.secrets.has(m.id))return {label:'待补充密钥',tone:'orange',ok:false};return {label:'已连通',tone:'green',ok:true};}
 return {label:'待测试',tone:'gray',ok:false};
};
M.connected=m=>!!C.connState(m).ok;
const roleValidate=M.validate;
M.validate=function(d){const issue=roleValidate.call(M,d);if(issue)return issue;const model=C.db.find(m=>m.id===d?.modelId);if(!model||managed(model))return '';return apiMode(model)==='embeddings'&&d.outputProtocol!=='embeddings'?'该模型已验证为向量接口，请选择 Embedding 模型与向量输出':apiMode(model)==='chat'&&d.outputProtocol==='embeddings'?'请先将连接改为向量接口并通过测试，再配置语义检索用途':'';};
L.connectionState=function(m){const s=C.connState(m);return status(s.label,s.ok?'ready':s.testing?'active':s.tone==='orange'?'attention':'neutral');};
const purposes=L.purposes;
L.purposes=function(m){return !managed(m)&&M.state(m)==='changed'?'<span class="mi-purpose-pending">待重新确认</span>':purposes.call(L,m);};
L.needsConfiguration=m=>!managed(m)&&!m._serviceType&&(!M.configured(m)||!M.get(m.id)?.roles?.length);
L.pendingModels=()=>L.rows('models').filter(L.needsConfiguration);
L.connect=function(id){const m=id&&L.rows('models').find(v=>v.id===id);if(m&&managed(m)){L.open('models',id);return;}L.connectionOrigin=true;X.connectionKind='model';C.open(id||'');};

N.abortDraft=function(){const d=C.draft;if(d?.testController)d.testController.abort();if(d){delete d.testController;delete d.testToken;d.testing=false;}};
N.abortRow=function(id){const request=N.pending.get(id);if(request){N.pending.delete(id);request.controller.abort();}};
C.open=function(id='',role='target',suggestion='',returnTo=null){
 const m=C.db.find(v=>v.id===id),asset=L.rows('models').find(v=>v.id===id);if(asset&&managed(asset)){L.open('models',id);return;}
 if(m&&(m.kind||'model')!=='model'||!id&&X.connectionKind==='agent'){A.toast('请在 AI应用 中管理 Agent 接入');A.platform.go('assets','applications');return;}
 N.abortDraft();if(id)N.abortRow(id);C.returnTo=returnTo;C.role=role;
 C.draft={...(m||{}),id:m?.id||'',name:title(m),model:title(m),endpoint:m?.endpoint||'',kind:'model',protocol:'openai',accessType:'api',auth:m?.auth==='none'?'none':'bearer',key:'',useSavedKey:true,probeProtocol:apiMode(m||{}),tested:false,testing:false};
 C.form();
};
C.capture=function(){const d=C.draft;if(!d)return;for(const key of ['model','endpoint','key','auth','probeProtocol']){const node=document.getElementById('c-'+key);if(node)d[key]=node.value;}d.name=String(d.model||'').trim();d.protocol='openai';};
C.validate=function(d){
 if(!String(d?.model||'').trim())return '请填写模型全称';
 if(String(d.model).trim().length>200||/[\r\n\t]/.test(d.model))return '模型名称需在 200 个字符以内，且不能包含换行';
 try{const url=new URL(String(d.endpoint||'').trim());if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw Error();}catch(e){return '请填写有效的 HTTP(S) API 地址，不含账号、查询参数或片段';}
 if(!['chat','embeddings'].includes(d.probeProtocol))return '请选择接口类型';
 if(d.auth!=='none'&&!keyFor(d))return '请填写 API Key';
 if(C.db.some(m=>m.id!==d.id&&String(m.model||'').trim()===String(d.model).trim()&&normalized(m.endpoint)===normalized(d.endpoint)))return '该服务已接入此模型，请编辑已有连接';
 return '';
};
C.validateComparison=d=>C.validate(d);
C.testFingerprint=d=>JSON.stringify([config(d),keyFor(d)]);
C.markDirty=function(){const d=C.draft;if(!d)return;N.abortDraft();d.tested=false;delete d.testFingerprint;delete d.testResult;fieldError('');C.renderAccessTest();};
C.syncAuth=function(){const d=C.draft,row=document.getElementById('c-key-field'),input=document.getElementById('c-key');if(!d||!row||!input)return;row.hidden=d.auth==='none';input.disabled=d.auth==='none';input.required=d.auth!=='none'&&!C.hasSavedKey(d);input.placeholder=C.hasSavedKey(d)?'留空使用本次会话密钥':'填写 API Key';};
C.accessInput=C.accessChange=C.identityInput=function(){C.capture();C.markDirty();C.syncAuth();};
C.accessTestHTML=function(d){return d.testing?'<p class="mi-test-state" role="status">正在验证 API 响应…</p>':d.tested?'<p class="mi-test-state success" role="status">连接成功</p>':'';};
C.renderAccessTest=function(){const d=C.draft;if(!d)return;const btn=document.getElementById('c-test-btn'),steps=document.getElementById('connection-test-steps'),save=document.getElementById('c-save-btn');if(btn){btn.disabled=!!d.testing;btn.classList.toggle('ok',!!d.tested);btn.innerHTML=d.testing?'测试中…':d.tested?'✓ 连接成功':A.icon('zap',14)+'测试连接';}if(steps)steps.innerHTML=C.accessTestHTML(d);if(save)save.disabled=!d.tested||!!d.testing;};
C.form=function(){
 const d=C.draft;if(!d)return;
 A.modal(d.id?'编辑模型':'接入模型',`<form id="connection-form" class="mi-intake-form" onsubmit="return false"><div class="field"><label for="c-model">模型名称 *</label><input id="c-model" maxlength="200" autocomplete="off" required value="${E(d.model)}" placeholder="填写服务中的模型全称，如 Qwen2.5-72B-Instruct" oninput="App.connections.accessInput()"><p class="hint">该名称将作为 API 请求的 model 参数。</p></div><div class="field"><label for="c-endpoint">API 地址 *</label><input id="c-endpoint" type="url" autocomplete="off" required value="${E(d.endpoint)}" placeholder="https://api.example.com/v1" oninput="App.connections.accessInput()"></div><div class="form-grid"><div class="field"><label for="c-probeProtocol">接口类型</label><select id="c-probeProtocol" onchange="App.connections.accessChange()"><option value="chat" ${apiMode(d)==='chat'?'selected':''}>OpenAI 兼容对话接口</option><option value="embeddings" ${apiMode(d)==='embeddings'?'selected':''}>OpenAI 兼容向量接口</option></select></div><div class="field"><label for="c-auth">鉴权方式</label><select id="c-auth" onchange="App.connections.accessChange()"><option value="bearer" ${d.auth!=='none'?'selected':''}>API Key</option><option value="none" ${d.auth==='none'?'selected':''}>无需 API Key</option></select></div></div><div class="field" id="c-key-field" ${d.auth==='none'?'hidden':''}><label for="c-key">API Key *</label><input id="c-key" type="password" autocomplete="off" value="" ${d.auth==='none'?'disabled':''} placeholder="${C.hasSavedKey(d)?'留空使用本次会话密钥':'填写 API Key'}" oninput="App.connections.accessInput()"></div><p class="mi-test-note">测试会向该地址发送一次最小请求。API Key 仅在本次页面会话中使用。</p><div id="connection-test-steps" aria-live="polite">${C.accessTestHTML(d)}</div><p id="connection-error" class="error-message" role="alert"></p></form>`,`<button class="btn compact-test-button" id="c-test-btn" type="button" onclick="App.connections.testDraft()">${A.icon('zap',14)}测试连接</button><button class="btn" onclick="App.connections.cancel()">取消</button><button class="btn primary" id="c-save-btn" ${d.tested?'':'disabled'} onclick="App.connections.save()">${d.id?'保存修改':'接入模型'}</button>`);
 C.syncAuth();C.renderAccessTest();
};
N.probe=async function(d,controller){
 const embedding=apiMode(d)==='embeddings',path=embedding?'embeddings':'chat/completions',base=normalized(d.endpoint),url=base.endsWith('/'+path)?base:base+'/'+path;
 const headers={'Content-Type':'application/json'},secret=keyFor(d);if(d.auth!=='none')headers.Authorization='Bearer '+secret;
 const body=embedding?{model:String(d.model).trim(),input:'connection test'}:{model:String(d.model).trim(),messages:[{role:'user',content:'Hi'}],max_tokens:1,stream:false};
 let timedOut=false;const timer=setTimeout(()=>{timedOut=true;controller.abort();},N.timeoutMs);
 try{
  const response=await fetch(url,{method:'POST',mode:'cors',credentials:'omit',redirect:'error',cache:'no-store',referrerPolicy:'no-referrer',headers,body:JSON.stringify(body),signal:controller.signal});
  if(!response.ok){const messages={401:'API Key 无效或已过期',403:'该凭据没有访问此模型的权限',404:'未找到接口或模型，请检查 API 地址与模型名称',429:'服务限流或调用额度不足'};return {ok:false,error:messages[response.status]||`服务返回 HTTP ${response.status}，请检查服务状态`};}
  let payload;try{payload=await response.json();}catch(e){return {ok:false,error:'服务返回的内容不是有效 JSON'};}
  const msg=payload?.choices?.[0]?.message,valid=embedding?Array.isArray(payload?.data?.[0]?.embedding)&&payload.data[0].embedding.length>0&&payload.data[0].embedding.every(Number.isFinite):!!msg&&(typeof msg.content==='string'||typeof msg.refusal==='string'||Array.isArray(msg.tool_calls));
  if(!valid||payload?.error)return {ok:false,error:embedding?'服务未返回有效向量，请确认接口类型':'服务未返回有效对话响应，请确认接口类型'};
  return {ok:true,checkedAt:now(),configuration:config(d),mode:'network',externalVerified:true};
 }catch(error){return {ok:false,cancelled:controller.signal.aborted&&!timedOut,error:timedOut?'连接测试超时，请检查服务响应速度':controller.signal.aborted?'连接测试已取消':'无法连接服务，请检查地址、网络或服务的 CORS 跨域配置'};}
 finally{clearTimeout(timer);}
};
C.testDraft=async function(){
 C.capture();const d=C.draft;if(!d)return false;C.markDirty();const issue=C.validate(d);fieldError(issue);if(issue)return false;
 const fingerprint=C.testFingerprint(d),controller=new AbortController(),token={};d.testing=true;d.testController=controller;d.testToken=token;C.renderAccessTest();
 const result=await N.probe({...d},controller);
 if(C.draft!==d||d.testToken!==token||controller.signal.aborted&&result.cancelled||fingerprint!==C.testFingerprint(d))return false;
 delete d.testController;delete d.testToken;d.testing=false;d.tested=result.ok===true;d.testResult=result;if(d.tested)d.testFingerprint=fingerprint;else delete d.testFingerprint;
 fieldError(result.ok?'':result.error);C.renderAccessTest();return result.ok;
};
C.save=function(){
 C.capture();const d=C.draft;if(!d)return false;const error=C.validate(d)||(!d.tested||d.testResult?.mode!=='network'||!d.testResult.ok||d.testFingerprint!==C.testFingerprint(d)?'请先测试当前配置，连接成功后再保存':'');if(error){fieldError(error);return false;}
 const old=C.db.find(m=>m.id===d.id),id=old?.id||'conn-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),changed=old&&(config(old)!==config(d)||keyFor(d)!==(C.secrets.get(id)||''));
 if(old)for(const task of arr(X.db.tasks))if(task.model===old.id&&!task.targetSnapshot)task.targetSnapshot=copy(X.connectionSnapshot(old));
 const record={id,name:String(d.model).trim(),model:String(d.model).trim(),kind:'model',accessType:'api',schema:3,seriesSchema:4,protocol:'openai',probeProtocol:apiMode(d),auth:d.auth==='none'?'none':'bearer',endpoint:normalized(d.endpoint),hosting:/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?=[:/]|$)/i.test(d.endpoint)?'local':'cloud',sample:false,presetPending:false,connectStatus:'ok',caps:apiMode(d)==='embeddings'?['embeddings']:['text','chat'],uses:[],timeout:60,configurationRevision:(old?.configurationRevision||1)+(changed?1:0),connectionCheck:{mode:'network',valid:true,checkedAt:d.testResult.checkedAt,configuration:config(d),externalVerified:true},updatedAt:now()};
 if(record.auth==='none')C.secrets.delete(id);else C.secrets.set(id,keyFor(d));
 if(old){Object.assign(old,record);delete old.simulated;delete old.demoConfigured;delete old.configurationCheck;delete old.apiKey;delete old.key;delete old.token;}else C.db.push(record);
 M.init();if(apiMode(d)==='embeddings'&&!M.get(id)?.confirmed)Object.assign(A.data.modelRoleAssignments[id],{type:'embedding',outputProtocol:'embeddings'});
 const returnTo=C.returnTo,role=C.role;C.draft=null;L.connectionOrigin=false;const input=document.getElementById('c-key');if(input)input.value='';A.save();A.closeModal();
 if(returnTo==='wizard'&&X.wizard){X.wizard[role==='target'?'model':role]=id;X.wizardModal();}else if(returnTo==='settings'&&X.settingsDraft){X.settingsDraft[role]=id;X.tab='settings';A.render();}else{A.platform.go('assets','models');}
 A.toast(old?(changed?'连接已更新，请到平台管理 → 模型配置重新确认用途':'模型连接已更新'):'模型已接入，请到平台管理 → 模型配置分配用途');return record;
};
C.test=async function(id){
 const m=C.db.find(v=>v.id===id);if(!m)return false;if(managed(m)){A.toast('内置模型由平台维护');return false;}if(N.pending.has(id))return false;
 const d={...m,key:'',useSavedKey:true,probeProtocol:apiMode(m)},issue=C.validate(d);if(issue){L.connect(id);fieldError(issue);return false;}
 const controller=new AbortController(),request={controller,fingerprint:C.testFingerprint(d)};N.pending.set(id,request);A.render();const result=await N.probe(d,controller);
 if(N.pending.get(id)!==request||!C.db.includes(m)||request.fingerprint!==C.testFingerprint({...m,key:'',useSavedKey:true}))return false;
 N.pending.delete(id);if(result.cancelled){A.render();return false;}m.connectStatus=result.ok?'ok':'fail';m.connectionCheck={mode:'network',valid:result.ok===true,checkedAt:result.checkedAt||now(),configuration:config(m),externalVerified:result.ok===true};
 A.save();A.render();A.toast(result.ok?'连接测试成功':result.error);return result.ok;
};
const closeModal=A.closeModal;
A.closeModal=function(){if(C.draft){N.abortDraft();C.draft.key='';C.draft=null;const node=document.getElementById('c-key');if(node)node.value='';}return closeModal.apply(A,arguments);};
C.cancel=function(){const returnTo=C.returnTo;A.closeModal();if(returnTo==='wizard'&&X.wizard)X.wizardModal();};
const clearSecrets=C.clearSecrets;
C.clearSecrets=function(){N.abortDraft();for(const id of N.pending.keys())N.abortRow(id);return clearSecrets.apply(C,arguments);};

N.references=function(t,id){return [t.model,t.targetSnapshot?.id,t.config?.modelSnapshot?.id,t.defense?.model?.id,t.policySnapshot?.attacker?.id,t.policySnapshot?.judgement?.modelId,t.policySnapshot?.judgement?.model?.id,...Object.values(t.engine?.roles||{}).map(v=>v?.id),...arr(t.engine?.bindings).flatMap(v=>[v.generator,v.judge])].includes(id);};
N.blockers=id=>[...arr(X.db?.tasks),...arr(A.scanProduct?.db?.tasks)].filter(t=>!t.deletedAt&&['running','pending','queued','paused','stopping'].includes(t.status)&&N.references(t,id));
C.remove=function(id){const m=C.db.find(v=>v.id===id);if(!m)return false;if(managed(m)){A.toast('平台内置模型不可删除');return false;}const busy=N.blockers(id);if(busy.length){A.toast('该模型正被未完成任务使用，请先结束相关任务');return false;}A.modal('删除模型',`<p>删除「${E(title(m))}」？</p><p class="hint">应用关联与平台用途将同步移除，历史任务和报告继续保留。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="entry-delete" data-id="${E(id)}" onclick="App.connections.removeConfirm(this.dataset.id)" aria-label="删除" title="删除" type="button">${A.icon('trash',16)}</button>`,{plain:true});return true;};
C.removeConfirm=function(id){
 const m=C.db.find(v=>v.id===id);if(!m||managed(m))return false;if(N.blockers(id).length){A.closeModal();A.toast('该模型正被未完成任务使用，暂时无法删除');return false;}
 // Retain immutable identity for older completed records that predate snapshots.
 for(const t of arr(X.db.tasks))if(t.model===id&&!t.targetSnapshot)t.targetSnapshot=copy(X.connectionSnapshot(m));
 N.abortRow(id);C.db.splice(C.db.indexOf(m),1);C.secrets.delete(id);delete A.data.modelRoleAssignments?.[id];A.data.applicationAssetLinks=arr(A.data.applicationAssetLinks).filter(r=>r.assetKey!=='models:'+id);
 for(const role of ['attacker','judge','process'])if(X.db.defaults?.[role]===id)X.db.defaults[role]='';
 A.save();A.closeModal();A.render();A.toast('模型已删除');return true;
};
N.filter={state:'',query:''};
N.filterBy=function(key,value){if(!Object.hasOwn(N.filter,key))return;N.filter[key]=value;A.render();};
M.render=function(){
 const f=N.filter,q=String(f.query||'').trim().toLowerCase(),items=L.rows('models').filter(m=>!managed(m)).filter(m=>{const state=C.connState(m);return (!q||title(m).toLowerCase().includes(q))&&(!f.state||(f.state==='connected'?state.ok:!state.ok));});
 const button=(m,action,label,icon,extra='')=>`<button class="mi-icon-action" title="${label}" aria-label="${label} ${E(title(m))}" data-id="${E(m.id)}" ${extra} onclick="${action==='connect'?'App.leanAssets':'App.connections'}.${action}(this.dataset.id)">${E(label)}</button>`;
 const body=items.map(m=>`<tr><td><button class="la-name mi-model-name" data-id="${E(m.id)}" onclick="App.leanAssets.open('models',this.dataset.id)"><strong>${E(title(m))}</strong></button></td><td>${managed(m)?'<span class="la-source-tag">系统</span>':'API 接入'}</td><td>${L.connectionState(m)}</td><td><div class="mi-model-actions">${managed(m)?'<span class="muted mi-managed">平台维护</span>':button(m,'connect','编辑','edit')+button(m,'test','测试连接','zap',N.pending.has(m.id)?'disabled':'')+A.entryManagement.button('models',m.id)}</div></td></tr>`).join('');
 return `<div class="la-page la-management mi-model-inventory">${A.heading('','模型','',`<button class="btn primary" onclick="App.leanAssets.connect()">${A.icon('plus',14)}接入模型</button><button class="btn" onclick="App.platform.go('management','model-roles')">配置模型用途</button>`)}<section class="card la-inventory"><div class="la-list-toolbar"><div class="la-management-filters"><select aria-label="连接状态筛选" onchange="App.modelIntake.filterBy('state',this.value)"><option value="">全部连接状态</option>${[['connected','已连通'],['disconnected','未连通']].map(([value,label])=>`<option value="${value}" ${f.state===value?'selected':''}>${label}</option>`).join('')}</select></div><label class="la-search">${A.icon('search',16)}<input type="search" aria-label="搜索模型名称" placeholder="搜索模型名称" value="${E(f.query||'')}" onchange="App.modelIntake.filterBy('query',this.value)"></label></div><div class="table-wrap"><table><thead><tr><th>模型名称</th><th>接入方式</th><th>连接状态</th><th>操作</th></tr></thead><tbody>${body||'<tr><td colspan="4" class="empty">暂无匹配模型</td></tr>'}</tbody></table></div></section></div>`;
};
X.guardConnectionHint='请在资产中心 → 模型查看护栏服务。';
})();
};

// ─── application-links-refinement ──────────────────────────────────────────
AppParts['assets/application-links-refinement'] = function () {
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
};

// ─── risk-classification ───────────────────────────────────────────────────
AppParts['assets/risk-classification'] = function () {
/* Operational risk categories and versioned response priorities, independent of CVSS. */
(function(){
'use strict';
const A=window.App,G=A.platformGovernance,P=A.platform,E=A.escape;
const copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString(),arr=v=>Array.isArray(v)?v:[];
const N=A.riskClassification={draft:null};
N.categories={robustness:'模型抗攻击风险',vulnerability:'漏洞暴露风险',input:'输入内容风险',output:'输出内容风险',review:'复核积压风险',other:'其他风险'};
N.metricCategory={'attack-asr':'robustness','scan-confirmed-high':'vulnerability','runtime-unsafe-input':'input','runtime-unsafe-output':'output','runtime-pending-review':'review'};
N.defaults=()=>({version:1,publishedAt:now(),levels:{R1:{name:'紧急',guidance:'立即核查影响范围，优先采取阻断、隔离或修复措施，并复测确认。'},R2:{name:'重要',guidance:'尽快明确责任人和处理计划，完成修复或策略调整后复测。'},R3:{name:'一般',guidance:'纳入常规处理计划，持续跟踪；风险扩大或反复出现时升级处置。'}},metrics:{'attack-asr':{r1:30,r2:10},'scan-confirmed-high':{r1:3,r2:1},'runtime-unsafe-input':{r1:20,r2:5},'runtime-unsafe-output':{r1:5,r2:1},'runtime-pending-review':{r1:10,r2:3}}});
const legacyLevels={R1:{name:'重点',guidance:'优先核查证据与影响范围，及时处理并安排复测。'},R2:{name:'关注',guidance:'安排责任人跟进，结合业务影响评估修复或策略调整。'},R3:{name:'提示',guidance:'记录并持续观察，关注是否反复出现。'}};
// Refresh untouched preset wording only; preserve custom text and all grading evidence.
N.refreshPresetLabels=function(levels){let changed=false;const current=N.defaults().levels;for(const [id,old] of Object.entries(legacyLevels)){const level=levels?.[id];if(level?.name===old.name&&level.guidance===old.guidance){Object.assign(level,current[id]);changed=true;}}return changed;};
N.standard=()=>G.db.gradingStandard;
N.value=e=>{const value=e.lastWindow?.value??G.metricSnapshot(e.ruleSnapshot||e,arr(e.evidence)).value;return Number.isFinite(Number(value))?Number(value):0;};
N.pick=(value,rule)=>!rule?'R3':value>=rule.r1?'R1':value>=rule.r2?'R2':'R3';
N.grade=function(e){
 const s=N.standard();if(!s)return false;let changed=false;
 if(!e.classification){const category=N.metricCategory[e.metric]||'other';e.classification={category,categoryName:N.categories[category],standardVersion:s.version,levels:copy(s.levels),thresholds:copy(s.metrics[e.metric]||null),assignedAt:now()};changed=true;}
 const c=e.classification,value=N.value(e),priority=N.pick(value,c.thresholds);
 if(c.evidenceCount!==undefined&&arr(e.evidence).length>c.evidenceCount&&e.status==='closed'){(e.followups||=[]).push({from:'closed',to:'open',label:'新增证据，重新跟进',note:'原事件收到新的触发证据，请重新核查。',at:now()});e.status='open';changed=true;}
 if(c.evidenceCount!==arr(e.evidence).length){c.evidenceCount=arr(e.evidence).length;changed=true;}
 if(c.value!==value||c.priority!==priority){if(c.priority&&c.priority!==priority)(e.priorityHistory||=[]).push({from:c.priority,to:priority,at:now(),reason:'新增证据达到事件固化分级阈值'});c.value=value;c.priority=priority;changed=true;}
 if(!e.status){e.status='open';changed=true;}return changed;
};
N.ensure=function(){if(!G.db)return;let changed=false;if(!G.db.gradingStandard){G.db.gradingStandard=N.defaults();G.db.gradingHistory=[copy(G.db.gradingStandard)];changed=true;}for(const s of [G.db.gradingStandard,...arr(G.db.gradingHistory),...G.db.events.map(e=>e.classification)])changed=N.refreshPresetLabels(s?.levels)||changed;for(const e of G.db.events)changed=N.grade(e)||changed;if(changed)A.save();};
const init=G.init;G.init=function(){const result=init.apply(G,arguments);N.ensure();return result;};
const refresh=G.refresh;G.refresh=function(){const result=refresh.apply(G,arguments);N.ensure();return copy(G.db?.events||result);};
P.menus.risk.push(['grading','风险分级','settings']);
const render=G.renderRisk;G.renderRisk=item=>item==='grading'?N.render():render(item);
N.badge=function(e){const c=e.classification||{},id=c.priority||'R3',name=c.levels?.[id]?.name||N.standard()?.levels[id]?.name||'一般';return `<span class="rc-priority rc-${id.toLowerCase()}" title="事件处置等级，与漏洞严重性独立">${E(name)}</span>`;};
N.filter=function(key,value){G.filter[key]=value;A.render();};
N.clear=function(){G.showEvents({});};
const option=(rows,value)=>Object.entries(rows).map(([id,label])=>`<option value="${E(id)}" ${id===value?'selected':''}>${E(label)}</option>`).join('');
N.match=function(e,f){const query=String(f.query||'').trim().toLowerCase();return (!f.domain||e.domain===f.domain)&&(!f.category||e.classification?.category===f.category)&&(!f.priority||e.classification?.priority===f.priority)&&(!f.state||(f.state==='active'?e.status!=='closed':e.status===f.state))&&(!f.metric||e.metric===f.metric)&&(!f.source||e.source===f.source)&&(!f.assetId||e.assetId===f.assetId)&&(!f.assetType||e.assetType===f.assetType)&&(!query||[e.assetName,e.ruleSnapshot?.name,e.id,e.classification?.categoryName].join(' ').toLowerCase().includes(query));};
G.eventHTML=function(){const all=G.events(),f=G.filter,rows=all.filter(e=>N.match(e,f)),select=(key,label,values)=>`<select aria-label="${label}" onchange="App.riskClassification.filter('${key}',this.value)"><option value="">${label}</option>${option(values,f[key])}</select>`,scope=[f.assetId?all.find(e=>e.assetId===f.assetId)?.assetName||f.assetId:'',f.metric?G.metrics[f.metric]?.label||f.metric:'',f.source?G.sources[f.source]: ''].filter(Boolean);
 return `<div class="lean-operations rc-page">${A.heading('','风险事件','按风险类别和处置等级跟进，点击事件查看证据与处理记录。','<button class="btn" onclick="App.platform.go(\'risk\',\'grading\')">分级标准</button>')}<section class="card"><div class="toolbar rc-filters">${select('domain','全部风险域',G.domains)}${select('category','全部风险类别',N.categories)}${select('priority','全部处置等级',Object.fromEntries(Object.entries(N.standard().levels).map(([id,l])=>[id,l.name])))}${select('state','全部处理状态',{active:'未关闭',...G.states})}<input type="search" aria-label="搜索风险事件或对象" placeholder="搜索事件、对象或编号" value="${E(f.query||'')}" onchange="App.riskClassification.filter('query',this.value)"><button class="link-btn" onclick="App.riskClassification.clear()">重置</button></div>${scope.length?`<div class="rc-scope">当前范围：${E(scope.join(' · '))}<button class="link-btn" onclick="App.riskClassification.clear()">清除范围</button></div>`:''}<div class="table-wrap"><table class="rc-events"><thead><tr><th>风险事件</th><th>风险域</th><th>风险类别</th><th>处置等级</th><th>风险对象</th><th>处理状态</th><th>最近触发</th></tr></thead><tbody>${rows.map(e=>`<tr><td><button class="link-btn" data-id="${E(e.id)}" onclick="App.platformGovernance.eventDetail(this.dataset.id)">${E(e.ruleSnapshot?.name||'风险事件')}</button></td><td>${E(G.domains[e.domain])}</td><td>${E(e.classification.categoryName)}</td><td>${N.badge(e)}</td><td>${E(e.assetName||'—')}</td><td>${A.badge(G.states[e.status]||'待处理',e.status==='closed'?'gray':e.status==='acknowledged'?'blue':'gray')}</td><td>${E(A.contentSafety.time(e.lastTriggeredAt||e.createdAt))}</td></tr>`).join('')||'<tr><td colspan="7" class="empty">暂无匹配的风险事件</td></tr>'}</tbody></table></div></section></div>`;
};
const detail=G.eventDetail;
G.eventDetail=function(id){G.init();const e=G.db.events.find(e=>e.id===id);if(!e)return;const drawer=A.drawer;A.drawer=function(title,body,footer,options){const c=e.classification,rule=c.thresholds,unit=G.metrics[e.metric]?.unit||' 项';const thresholds=rule?` ${c.levels.R1.name} ≥ ${rule.r1}${unit}；${c.levels.R2.name} ≥ ${rule.r2}${unit}；其余已触发事件为${c.levels.R3.name}`:'按一般等级跟进';const panel=`<section class="rc-detail-summary"><div>${N.badge(e)}<strong>${E(c.categoryName)}</strong></div><p>分级依据：${E(G.observedLabel(e))}</p><p class="hint">标准 V${c.standardVersion} · ${E(thresholds)}</p><p>${E(c.levels[c.priority].guidance)}</p></section>`;const history=`<section class="rc-followup"><h3>处理记录</h3>${arr(e.followups).map(n=>`<div><strong>${E(n.label)}</strong><time>${E(A.contentSafety.time(n.at))}</time><p>${E(n.note)}</p></div>`).join('')||'<p class="hint">尚未记录处理情况。</p>'}<label for="rc-note">处理说明${e.status==='closed'?'（重新跟进原因）':''}</label><textarea id="rc-note" maxlength="500" rows="3" placeholder="记录影响判断、处理措施或复测结果"></textarea><p id="rc-error" role="alert" class="error-message"></p></section>`;return drawer.call(A,title,panel+body+history,`<button class="btn" onclick="App.closeDrawer()">关闭</button>${e.status==='open'?`<button class="btn" data-id="${E(id)}" onclick="App.riskClassification.setState(this.dataset.id,'acknowledged')">确认并跟进</button>`:''}<button class="btn primary" data-id="${E(id)}" onclick="App.riskClassification.setState(this.dataset.id,'${e.status==='closed'?'open':'closed'}')">${e.status==='closed'?'重新跟进':'标记已处理'}</button>`,options);};try{return detail.call(G,id);}finally{A.drawer=drawer;}};
N.setState=function(id,state,note){G.init();const e=G.db.events.find(e=>e.id===id);if(!e||!['open','acknowledged','closed'].includes(state))return false;const text=String(note??document.getElementById('rc-note')?.value??'').trim();if(!text||text.length>500){document.getElementById('rc-error').textContent='请填写 1–500 字的处理说明';return false;}if(e.status===state)return false;const label={open:'重新跟进',acknowledged:'确认并跟进',closed:'标记已处理'}[state];(e.followups||=[]).push({from:e.status,to:state,label,note:text,at:now()});e.status=state;G.audit('risk.event.'+state,id,label,{note:text});A.save();A.render();G.eventDetail(id);return true;};
N.render=function(){G.init();const s=N.standard();return `<div class="rc-page">${A.heading('','风险分级','触发规则决定是否触发事件，分级标准决定触发后的处置等级。','<button class="btn primary" onclick="App.riskClassification.edit()">调整分级标准</button>')}<div class="rc-levels">${Object.entries(s.levels).map(([id,l])=>`<section class="card">${N.badge({classification:{priority:id,levels:s.levels}})}<p>${E(l.guidance)}</p></section>`).join('')}</div><section class="card"><div class="rc-standard-title"><h2>指标分级标准</h2><span>V${s.version} · ${E(A.contentSafety.time(s.publishedAt))}</span></div><div class="table-wrap"><table><thead><tr><th>风险类别</th><th>触发指标</th><th>${E(s.levels.R1.name)}</th><th>${E(s.levels.R2.name)}</th><th>${E(s.levels.R3.name)}</th></tr></thead><tbody>${Object.entries(s.metrics).map(([id,r])=>{const unit=G.metrics[id]?.unit||' 项';return `<tr><td>${N.categories[N.metricCategory[id]]}</td><td>${E(G.metrics[id]?.label||id)}</td><td>≥ ${r.r1}${unit}</td><td>≥ ${r.r2}${unit} 且 &lt; ${r.r1}${unit}</td><td>已触发且 &lt; ${r.r2}${unit}</td></tr>`;}).join('')}</tbody></table></div><p class="rc-footnote">这是平台预置的运营分级标准，可按业务调整，不等同于漏洞严重性或外部合规标准。新版本仅用于新事件；已有事件沿用触发时的分级标准，后续证据按该版本更新等级。</p></section></div>`;};
N.edit=function(){G.init();N.draft=copy(N.standard());const d=N.draft;A.modal('调整风险分级标准',`<div class="rc-standard-editor"><h3>等级名称与处理建议</h3>${Object.entries(d.levels).map(([id,l])=>`<div class="rc-level-edit"><label>等级名称<input aria-label="${E(l.name)} 等级名称" maxlength="8" value="${E(l.name)}" oninput="App.riskClassification.draft.levels.${id}.name=this.value"></label><label>处理建议<input aria-label="${E(l.name)} 处理建议" maxlength="160" value="${E(l.guidance)}" oninput="App.riskClassification.draft.levels.${id}.guidance=this.value"></label></div>`).join('')}<h3>分级阈值</h3><p class="hint">${E(d.levels.R1.name)}阈值必须高于${E(d.levels.R2.name)}；仅对已触发事件分级。评估按单次完成任务，防护按触发规则的时间窗统计。</p>${Object.entries(d.metrics).map(([id,r])=>`<div class="rc-threshold-edit"><strong>${E(G.metrics[id].label)}</strong>${['r1','r2'].map(k=>`<label>${E(d.levels[k.toUpperCase()].name)} ≥ <input type="number" min="${id==='attack-asr'?0.1:1}" max="${id==='attack-asr'?100:10000}" step="${id==='attack-asr'?0.1:1}" aria-label="${E(G.metrics[id].label)} ${E(d.levels[k.toUpperCase()].name)} 阈值" value="${r[k]}" data-metric="${id}" oninput="App.riskClassification.draft.metrics[this.dataset.metric].${k}=Number(this.value)">${G.metrics[id].unit||'项'}</label>`).join('')}</div>`).join('')}<p id="rc-standard-error" role="alert" class="error-message"></p></div>`, '<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.riskClassification.save()">保存为新版本</button>',{wide:true});};
N.validate=function(d){if(!d?.levels||!d?.metrics)return '分级配置不完整';const names=[];for(const id of ['R1','R2','R3']){const l=d.levels[id];if(!l||!String(l.name).trim()||l.name.length>8||!String(l.guidance).trim()||l.guidance.length>160)return '请填写等级名称（1–8 字）和处理建议（1–160 字）';names.push(l.name.trim());}if(new Set(names).size!==3)return '等级名称不能重复';for(const id of Object.keys(N.defaults().metrics)){const r=d.metrics[id],percent=id==='attack-asr',max=percent?100:10000;if(!r||!Number.isFinite(r.r1)||!Number.isFinite(r.r2)||r.r2<(percent?0.1:1)||r.r1<=r.r2||r.r1>max||!percent&&(!Number.isInteger(r.r1)||!Number.isInteger(r.r2)))return G.metrics[id].label+'：'+d.levels.R1.name+'阈值须高于'+d.levels.R2.name+'，百分比不超过 100，数量须为 1–10000 的整数';}return '';};
N.save=function(value){G.init();const d=copy(value||N.draft),error=N.validate(d);if(error){if(!value)document.getElementById('rc-standard-error').textContent=error;return {error};}const s={...d,version:N.standard().version+1,publishedAt:now()};for(const l of Object.values(s.levels)){l.name=l.name.trim();l.guidance=l.guidance.trim();}G.db.gradingStandard=s;(G.db.gradingHistory||=[]).push(copy(s));G.audit('risk.grading.save','grading','发布风险分级标准 V'+s.version);A.save();if(!value){A.closeModal();A.render();A.toast('分级标准已保存，应用于新触发事件');}return s;};
const ruleForm=G.ruleForm;G.ruleForm=function(){const modal=A.modal;A.modal=function(title,body,footer,options){const d=G.ruleDraft,c=N.categories[N.metricCategory[d.metric]];body+=`<div class="rc-rule-context">风险类别：${E(c||'其他风险')}<p>事件处置等级按风险分级标准计算；本规则只设置触发条件。</p></div>`;return modal.call(A,title,body,footer,options);};try{return ruleForm.apply(G,arguments);}finally{A.modal=modal;}};
G.ruleHTML=function(){G.init();const f=G.ruleFilter,query=String(f.query||'').trim().toLowerCase(),rows=G.db.rules.filter(r=>(!f.domain||r.domain===f.domain)&&(!query||r.name.toLowerCase().includes(query)));return `<div class="rc-page">${A.heading('','触发规则','设置事件的触发条件；风险类别由指标确定，处置等级由分级标准计算。','<button class="btn primary" onclick="App.platformGovernance.editRule()">＋ 新建规则</button>')}<section class="card"><div class="toolbar rc-filters"><select aria-label="全部风险域" onchange="App.platformGovernance.filterRules('domain',this.value)"><option value="">全部风险域</option>${option(G.domains,f.domain)}</select><input type="search" aria-label="搜索规则名称" placeholder="搜索规则名称" value="${E(f.query||'')}" onchange="App.platformGovernance.filterRules('query',this.value)"><button class="link-btn" onclick="App.platform.go('risk','grading')">分级标准 →</button></div><div class="table-wrap"><table><thead><tr><th>规则名称</th><th>风险类别</th><th>触发条件</th><th>风险域</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="link-btn" data-id="${E(r.id)}" onclick="App.platformGovernance.editRule(this.dataset.id)">${E(r.name)}</button></td><td>${E(N.categories[N.metricCategory[r.metric]]||'其他风险')}</td><td>${E(G.condition(r))}</td><td>${E(G.domains[r.domain])}</td><td><button class="link-btn" data-id="${E(r.id)}" onclick="App.platformGovernance.editRule(this.dataset.id)">修改配置</button>${A.entryManagement.button('alert-rule',r.id)}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">暂无匹配的触发规则</td></tr>'}</tbody></table></div></section></div>`;};
})();
};

// ─── risk-tags ─────────────────────────────────────────────────────────────
AppParts['assets/risk-tags'] = function () {
(function(){
'use strict';
const A=window.App,S=A.contentSafety,P=A.platform,D=A.evaluationDatasets,E=A.escape,copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString(),time=v=>A.listConsistency.time(v);
const btn=(text,action)=>`<button class="link-btn" onclick="${action}">${text}</button>`;
const R=A.accountRisk={query:'',app:'',days:'',mode:'records',page:1};
R.db=()=>A.data.accountRiskNotes|| (A.data.accountRiskNotes={});
R.identity=r=>String(r.userId??r.user_id??r.accountId??'').trim();
R.key=r=>JSON.stringify([r.appId,R.identity(r)]);
R.risky=r=>['Unsafe','Controversial'].includes(r.safety)||r.action==='block'||r.original?.safety==='Unsafe';
R.examples=()=>Array.from({length:6},(_,i)=>({id:'account-demo-'+i,appId:'sample-app',userId:i<3?'user_1024':i<5?'user_2086':'user_3051',createdAt:new Date(Date.now()-(i+1)*3600000).toISOString(),text:['尝试诱导输出受限内容','连续提交相似违规请求','请求获取他人个人信息'][i%3],safety:'Unsafe',action:'block',sample:true}));
R.records=()=>R.mode==='sample'?R.examples():S.db.requests.filter(r=>R.identity(r)&&R.risky(r));
R.rows=function(){const map=new Map(),cut=R.days?Date.now()-Number(R.days)*86400000:0;for(const r of R.records()){
 if((R.app&&r.appId!==R.app)||(cut&&Date.parse(r.createdAt)<cut))continue;
 const key=R.key(r);if(!map.has(key))map.set(key,{key,user:R.identity(r),appId:r.appId,records:[],sample:!!r.sample});map.get(key).records.push(r);
 }return [...map.values()].map(r=>({...r,note:R.db()[(r.sample?'sample:':'')+r.key]||{},latest:r.records.map(v=>v.createdAt).sort().at(-1)})).filter(r=>!R.query||[r.user,r.appId,r.note.mark].join(' ').toLowerCase().includes(R.query.toLowerCase())).sort((a,b)=>b.latest.localeCompare(a.latest));};
R.change=function(key,value){if(['query','app','days','mode'].includes(key)){R[key]=value;R.page=1;if(key==='mode')R.app='';A.render();}};
R.name=id=>id==='sample-app'?'示例 · 智能客服':S.appName(id);
R.open=function(index){const r=R.rows()[index];if(!r)return;R.current=r;const n=r.note;A.drawer('账号风险 · '+E(r.user),`<p class="hint">${E(R.name(r.appId))} · ${r.sample?'独立示例数据':'应用用户账号'} · ${r.records.length} 条关联风险记录</p><div class="rt-detail-grid"><div class="field"><label>风险标记</label><select id="ar-mark">${['待观察','重点关注','已排除'].map(v=>`<option ${v===(n.mark||'待观察')?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>处置记录</label><select id="ar-action">${['持续观察','已联系核实','已通知应用侧处理','已完成处理'].map(v=>`<option>${v}</option>`).join('')}</select></div></div><div class="field"><label>备注</label><textarea id="ar-note" maxlength="500" placeholder="填写核实结论或处理说明"></textarea></div><p class="hint">此处记录处置进展；账号限制由业务应用执行。</p><p id="ar-error" class="error-message"></p><h3>关联违规记录</h3><div class="rt-evidence">${r.records.slice().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,50).map(v=>`<article><div>${r.sample?E(v.id):`<button class="link-btn" data-id="${E(v.id)}" onclick="App.contentSafety.detail(this.dataset.id)">${E(v.id)}</button>`}<time>${time(v.createdAt)}</time></div><p>${E(v.text||'图片内容')}</p>${S.riskBadge(v.safety)}</article>`).join('')}</div>${r.records.length>50?'<p class="hint">展示最近 50 条，请缩小时间范围查看。</p>':''}<h3>处置历史</h3><div class="rt-evidence">${(n.history||[]).slice().reverse().map(h=>`<article><div><strong>${E(h.mark)} · ${E(h.action)}</strong><time>${time(h.at)}</time></div><p>${E(h.note||'无备注')} · ${E(h.actor)}</p></article>`).join('')||'<p class="hint">暂无处置记录</p>'}</div>`,`<button class="btn primary" onclick="App.accountRisk.save()">保存处置记录</button>`);};
R.save=function(){const r=R.current;if(!r)return false;const mark=document.getElementById('ar-mark').value,action=document.getElementById('ar-action').value,note=document.getElementById('ar-note').value.trim();if(!['待观察','重点关注','已排除'].includes(mark)||!['持续观察','已联系核实','已通知应用侧处理','已完成处理'].includes(action))return false;const before=copy(R.db()),key=(r.sample?'sample:':'')+r.key,old=R.db()[key]||{},at=now();R.db()[key]={mark,action,updatedAt:at,history:[...(old.history||[]),{mark,action,note,at,actor:A.session?.user||'安全管理员'}]};A.save();if(A.storageOK===false){A.data.accountRiskNotes=before;document.getElementById('ar-error').textContent='保存失败，请重试';return false;}A.closeDrawer();A.render();return true;};
R.render=function(){const rows=R.rows(),start=(R.page-1)*15,pages=Math.max(1,Math.ceil(rows.length/15));R.page=Math.min(R.page,pages);const apps=R.mode==='sample'?[['sample-app','示例 · 智能客服']]:S.apps.map(a=>[a.id,a.name]);return A.heading('','账号风险','按应用用户账号归集风险，查看违规证据并记录处置。')+`<div class="rt-summary"><span>风险账号 <b>${rows.length}</b></span><span>重点关注 <b>${rows.filter(r=>r.note.mark==='重点关注').length}</b></span><span>关联记录 <b>${rows.reduce((n,r)=>n+r.records.length,0)}</b></span></div><section class="card"><div class="toolbar"><select aria-label="数据来源" onchange="App.accountRisk.change('mode',this.value)"><option value="records" ${R.mode==='records'?'selected':''}>防护记录</option><option value="sample" ${R.mode==='sample'?'selected':''}>查看示例</option></select><input placeholder="搜索用户标识或标记" aria-label="搜索账号" value="${E(R.query)}" onchange="App.accountRisk.change('query',this.value)"><select aria-label="应用筛选" onchange="App.accountRisk.change('app',this.value)"><option value="">全部应用</option>${apps.map(([id,name])=>`<option value="${E(id)}" ${id===R.app?'selected':''}>${E(name)}</option>`).join('')}</select><select aria-label="时间范围" onchange="App.accountRisk.change('days',this.value)">${[['','全部时间'],['1','近24小时'],['7','近7天'],['30','近30天']].map(([v,n])=>`<option value="${v}" ${v===R.days?'selected':''}>${n}</option>`).join('')}</select></div>${R.mode==='sample'?'<p class="rt-note">示例数据 · 用于预览账号归集与处置流程</p>':''}<div class="table-wrap"><table><thead><tr><th>用户标识</th><th>所属应用</th><th>关联违规</th><th>风险标记</th><th>最近触发时间</th><th>处置进展</th><th>操作</th></tr></thead><tbody>${rows.slice(start,start+15).map((r,i)=>`<tr><td>${E(r.user)}</td><td>${E(R.name(r.appId))}</td><td>${r.records.length}</td><td>${A.badge(r.note.mark||'待观察',r.note.mark==='重点关注'?'red':r.note.mark==='已排除'?'gray':'orange')}</td><td class="lc-time">${time(r.latest)}</td><td>${E(r.note.action||'待处置')}</td><td>${btn('查看与处置',`App.accountRisk.open(${start+i})`)}</td></tr>`).join('')||'<tr><td colspan="7" class="empty">暂无带用户标识的风险记录。应用请求传入 user_id 后自动归集，可切换“查看示例”预览。</td></tr>'}</tbody></table></div><div class="table-foot"><span>共 ${rows.length} 个账号</span><div>${btn('上一页',`App.accountRisk.page=Math.max(1,App.accountRisk.page-1);App.render()`)} ${R.page} / ${pages} ${btn('下一页',`App.accountRisk.page=Math.min(${pages},App.accountRisk.page+1);App.render()`)}</div></div></section>`;};
P.menus.protection.splice(3,0,['accounts','账号风险','user']);
const render=A.modules.attack.render;A.modules.attack.render=function(){if(P.state.section==='protection'&&P.state.item==='accounts')return R.render();return render.apply(this,arguments);};
// Preserve an application-scoped user identifier when new detection records are accepted.

const G=A.guardrail,oldIngest=G.ingest;G.ingest=function(input,...args){const result=oldIngest.call(this,input,...args),id=R.identity(input);if(result?.id&&id&&!R.identity(result)){result.userId=id.slice(0,128);A.save();}return result;};
const T=A.datasetTags={};T.catalog=()=>D.db().tagCatalog||(D.db().tagCatalog=[]);
T.rows=()=>[...new Set([...T.catalog().map(t=>t.name),...D.rows(false).flatMap(r=>D.annotation(r).tags)])].sort().map(name=>({name,count:D.rows(false).filter(r=>D.annotation(r).tags.includes(name)).length,createdAt:T.catalog().find(t=>t.name===name)?.createdAt}));
T.open=function(){const rows=T.rows();A.modal('标签管理',`<p class="hint">场景、攻击方法、判定结果自动生成；下方维护人工标签，便于筛选复用和训练样本。</p><div class="toolbar"><input id="tag-new" maxlength="30" aria-label="新标签名称" placeholder="例如：训练候选、业务重点"><button class="btn primary" onclick="App.datasetTags.create()">新建标签</button></div><p id="tag-error" class="error-message"></p><div class="table-wrap"><table><thead><tr><th>人工标签</th><th>关联样本</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${E(r.name)}</td><td>${r.count}</td><td class="lc-time">${time(r.createdAt)}</td><td>${btn('查看样本',`App.datasetTags.view(${i})`)} ${btn('重命名',`App.datasetTags.edit(${i})`)}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">暂无人工标签，新建后可在样本列表批量添加。</td></tr>'}</tbody></table></div>`, '<button class="btn" onclick="App.closeModal()">关闭</button>',{wide:true});};
T.create=function(){const name=document.getElementById('tag-new').value.trim();if(!name||name.length>30||/[,，\n]/.test(name)||T.rows().some(t=>t.name===name)){document.getElementById('tag-error').textContent='请输入不重复的标签名称，最多 30 字，不含逗号';return false;}const before=copy(D.db());T.catalog().push({name,createdAt:now()});if(!D.persist(before,'tag-error'))return false;T.open();return true;};
T.view=function(i){const r=T.rows()[i];if(!r)return;D.filter={query:'',scene:'',method:'',result:'',tag:r.name,kind:'',task:''};D.tab='records';D.page=1;A.closeModal();A.render();};
T.edit=function(i){const r=T.rows()[i];if(!r)return;T.old=r.name;A.modal('重命名标签',`<p>同步更新 ${r.count} 条样本的人工标签。已冻结的数据集版本保留原标签。</p><input id="tag-rename" maxlength="30" aria-label="标签名称" value="${E(r.name)}"><p id="tag-error" class="error-message"></p>`,`<button class="btn" onclick="App.datasetTags.open()">取消</button><button class="btn primary" onclick="App.datasetTags.rename()">保存</button>`);};
T.rename=function(){const name=document.getElementById('tag-rename').value.trim(),old=T.old;if(!name||name.length>30||/[,，\n]/.test(name)||T.rows().some(t=>t.name===name&&name!==old)){document.getElementById('tag-error').textContent='名称为空、重复或格式不正确';return false;}const before=copy(D.db());for(const a of Object.values(D.db().annotations))if(a.tags.includes(old)){a.tags=a.tags.map(t=>t===old?name:t);a.history.push({action:'rename-tag',from:old,to:name,at:now(),actor:A.session?.user||'安全管理员'});}const entry=T.catalog().find(t=>t.name===old);if(entry)entry.name=name;else T.catalog().push({name,createdAt:null});if(!D.persist(before,'tag-error'))return false;if(D.filter.tag===old)D.filter.tag=name;A.render();T.open();return true;};
const datasetRender=D.render;D.render=function(){return datasetRender.apply(this,arguments).replace('<div class="tabs">',`<div class="rt-tag-entry"><span>自动标签：场景 / 方法 / 结果　人工标签：整理与复用</span>${btn('管理人工标签','App.datasetTags.open()')}</div><div class="tabs">`);};
D.tagsForm=function(){const rows=D.selection();if(!rows.length)return A.toast('请先选择评测记录');D.tagDraft={value:'',mode:'add'};A.modal('批量标签',`<p>已选择 ${rows.length} 条样本</p><div class="field"><label for="dataset-tags">选择或输入人工标签</label><input id="dataset-tags" list="dataset-tag-options" maxlength="300" placeholder="多个标签用逗号分隔" oninput="App.evaluationDatasets.tagDraft.value=this.value"><datalist id="dataset-tag-options">${T.rows().map(r=>`<option value="${E(r.name)}"></option>`).join('')}</datalist></div><div class="field"><label for="dataset-tag-mode">操作</label><select id="dataset-tag-mode" onchange="App.evaluationDatasets.tagDraft.mode=this.value"><option value="add">添加标签</option><option value="remove">移除标签</option></select></div><p id="dataset-tag-error" class="error-message"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.evaluationDatasets.saveTags()">保存</button>`);};
})();
};
