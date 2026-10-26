/* The home dashboard projects the existing centers; it does not create findings or tasks. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const H=A.platformHome={days:30},arr=v=>Array.isArray(v)?v:[];
const colors={blue:'#527da8',teal:'#5a9a8b',amber:'#c09a64',red:'#bf7780',gray:'#a8b4c2'};
const inventory=[['models','模型',colors.blue],['code','代码',colors.teal],['packages','软件包','#95a5c3'],['web','Web',colors.amber]];
const stateNames=[['running','进行中',colors.blue],['done','已结束',colors.teal],['stopped','已停止',colors.amber],['error','执行异常',colors.red],['pending','待执行',colors.gray]];
const assetNames={model:'模型',application:'AI应用',code:'代码',package:'软件包',web:'Web'};
const ratio=(n,total)=>total?Math.min(100,n/total*100):0;
const synthetic=t=>!!(t.example||t.simulation||t.simulated||['example','simulation'].includes(t.resultSource)||t.runSnapshot?.simulated||t.executionSnapshot?.simulated);
const link=(label,action)=>`<button class="link-btn" onclick="${action}">${label} ${I('chevron',13)}</button>`;
const cardHead=(title,action='')=>`<div class="card-head"><h2 class="card-title">${title}</h2>${action}</div>`;

H.snapshot=function(){
 const V=A.evaluation,Q=A.assessment,S=A.contentSafety,G=A.platformGovernance;
 const groups=Object.fromEntries(['applications',...inventory.map(v=>v[0])].map(kind=>[kind,A.leanAssets.rows(kind)]));
 const assets=Object.entries(groups).flatMap(([kind,rows])=>rows.map(a=>({...a,kind,key:kind+':'+a.id})));
 const technical=assets.filter(a=>a.kind!=='applications');
 const services=new Set(Object.values(A.data.defenseServices||{}).map(s=>s.id));
 const evaluableAssets=technical.filter(a=>a.kind!=='models'||(!services.has(a.id)&&!a.systemGuard));
 const eligible=new Set(evaluableAssets.map(a=>a.key)),tasks=V.allTasks();
 const resultTasks=tasks.filter(t=>V.reportReady(t)&&Q.taskResult(t).value!==null);
 const covered=[...new Set([...resultTasks.filter(t=>!synthetic(t)).map(Q.objectKey),...arr(A.riskDemo?.coveredKeys?.())])].filter(key=>eligible.has(key));
 const attacks=tasks.filter(t=>V.type(t)==='attack'),scans=tasks.filter(t=>V.type(t)==='scan');
 const apps=groups.applications,protectedApps=A.managedGuards?.connectedApps?.()||apps.filter(a=>S.stageReady(a.id,'input')||S.stageReady(a.id,'output'));
 const requests=A.guardrail.records(),runtimeRecords=G.runtimeRecords(),recordSummary=A.leanOperations.recordSummary(requests);
 const alerts=G.events(),riskMap=new Map();
 for(const e of alerts){
  const key=e.assetType+':'+e.assetId;
  const row=riskMap.get(key)||{key,id:e.assetId,name:e.assetName||e.assetId||'未命名资产',assetType:e.assetType,kind:assetNames[e.assetType]||'资产',count:0,evaluation:0,protection:0,riskLabels:[]};
  const label=e.ruleSnapshot?.name||G.metrics[e.metric]?.label||'风险事件';if(!row.riskLabels.includes(label))row.riskLabels.push(label);
  row.count++;row[e.domain==='protection'?'protection':'evaluation']++;riskMap.set(key,row);
 }
 const riskAssets=[...riskMap.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
 return {assets,apps,models:groups.models,code:groups.code,packages:groups.packages,web:groups.web,technical,evaluableAssets,
  tasks,attacks,scans,resultTasks,covered,protectedApps,requests,runtimeRecords,recordSummary,alerts,riskAssets,
  completedTasks:tasks.filter(t=>t.status==='done'),pendingModels:A.leanAssets.pendingModels?.()||[],enabledRules:arr(G.db?.rules).filter(r=>r.enabled),
  pendingAlerts:alerts.filter(e=>e.status!=='closed'),pendingReviews:S.pendingReviews(),exceptions:tasks.filter(t=>t.status==='error'&&!t.deletedAt),readyApps:apps.filter(a=>A.leanOperations.ready(a.id)),
  blocked:requests.filter(r=>r.enforcementAck===true&&(r.effectiveAction||r.action)==='block').length,
  exampleTasks:tasks.filter(t=>t.example||t.resultSource==='example').length,
  simulationTasks:tasks.filter(t=>synthetic(t)&&!t.example&&t.resultSource!=='example').length};
};
H.strategies=function(){
 const attack=arr(A.policies.db).filter(p=>arr(p.revisions).length&&!p.archived);
 const defense=A.defensePolicies.policyRows().filter(p=>arr(p.revisions).length);
 const methods=A.policies.methods(),banks=A.banks.db,methodIds=methods.map(m=>m.id);
 const used=[...new Set(X.db.tasks.filter(t=>!t.deletedAt).flatMap(t=>(t.policySnapshot?.methods||[]).map(m=>m.id)))];
 const featuredMethods=used.map(id=>methods.find(m=>m.id===id)).filter(Boolean).slice(0,3);
 for(const m of methods){if(featuredMethods.length>=3)break;if(!featuredMethods.some(row=>row.id===m.id))featuredMethods.push(m);}
 const types=['compliance','pii','prompt','image','custom'].map(type=>{
  const rows=defense.filter(p=>A.contentPolicies.latest(p.id)?.policyType===type);
  return {type,name:A.defensePolicies.names[type]||'自定义规则',rows,enabled:rows.filter(p=>A.contentPolicies.latest(p.id)?.enabled).length};
 });
 return {attack,defense,methods,banks,methodIds,featuredMethods,types,enabled:defense.filter(p=>A.contentPolicies.latest(p.id)?.enabled).length};
};

// Each summary opens its complete source list, independent of the previous visit's filters.
H.openAsset=function(kind='models'){A.leanAssets.query[kind]='';if(A.leanAssets.filters)A.leanAssets.filters[kind]={owner:'',environment:''};if(kind==='models')Object.assign(A.modelIntake.filter,{query:'',state:''});A.platform.go('assets',kind);};
H.openPendingModels=function(){Object.assign(A.modelRoles.filter,{query:'',type:'',capability:'',role:'',state:'pending'});A.platform.go('management','model-roles');};
H.openEvaluation=function(){Object.assign(A.assessment,{filter:'all',status:'all',query:''});A.platform.go('evaluation','scan');};
H.openProtection=function(){A.guardrail.appFilter='';A.contentSafety.filter.days='';A.platform.go('protection','overview');};
H.openAttackPolicies=function(){A.policies.policyQuery='';A.platform.go('policy','policies','strategies');};
H.openMethod=function(id){A.policies.methodQuery='';A.policies.methodCategory='all';A.platform.go('policy','policies','methods');if(id)A.policies.methodDetail(id);};
H.openBanks=function(){Object.assign(A.banks.catalog,{query:'',source:'all'});A.platform.go('policy','policies','content');};
H.openDefense=function(id){A.defensePolicies.tab='policies';A.defensePolicies.query='';A.defensePolicies.kindFilter='';A.platform.go('policy','defense');if(id)A.contentPolicies.detail(id);};
H.openRisk=function(assetId='',assetType=''){A.platformGovernance.showEvents({assetId,assetType});};
H.openDimension=function(metric){const m=A.platformGovernance.metrics[metric];if(m)A.platformGovernance.showEvents({domain:m.domain,metric});};
H.openRiskRules=function(id){Object.assign(A.platformGovernance.ruleFilter||{}, {domain:'',query:''});A.platform.go('risk','rules');if(id)A.platformGovernance.editRule(id);};
H.openReviews=function(){H.openProtection();A.protectionOps.openReviews();};
H.openPendingRisk=function(priority=''){A.platformGovernance.showEvents({state:'active',priority:['R1','R2','R3'].includes(priority)?priority:''});};
H.openExceptions=function(){const rows=H.snapshot().exceptions;A.modal('异常评估任务',`<div class="ph-queue-errors">${rows.map(t=>`<button data-id="${E(t.id)}" onclick="App.closeModal();App.evaluation.openTask(this.dataset.id)"><span><strong>${E(t.name||t.id)}</strong><small>${E(A.evaluation.typeName(t))}</small></span><span>查看任务 →</span></button>`).join('')||'<p class="empty">暂无执行异常的评估任务</p>'}</div>`,'<button class="btn" onclick="App.closeModal()">关闭</button>');};
H.queueHTML=function(s){
 const pending=s.alerts.filter(e=>e.status!=='closed'),standard=A.riskClassification.standard(),levels=['R1','R2','R3'].map(id=>({id,name:standard.levels[id].name,n:pending.filter(e=>(e.classification?.priority||'R3')===id).length}));let offset=0;
 const arcs=levels.filter(r=>r.n).map(r=>{const size=ratio(r.n,pending.length),arc=`<circle class="${'rc-'+r.id.toLowerCase()}" cx="56" cy="56" r="42" pathLength="100" fill="none" style="stroke:var(--rc-bg)" stroke-width="13" stroke-dasharray="${size} ${100-size}" stroke-dashoffset="${-offset}" transform="rotate(-90 56 56)" role="button" tabindex="0" data-priority="${r.id}" aria-label="${E(r.name+'，'+r.n+' 个未关闭风险，查看事件')}" onclick="App.platformHome.openPendingRisk(this.dataset.priority)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();App.platformHome.openPendingRisk(this.dataset.priority)}"><title>${E(r.name+' · '+r.n+' 个')}</title></circle>`;offset+=size;return arc;}).join('');
 const action=(label,note,n,handler)=>`<button class="ph-queue-action" onclick="${handler}"><span><strong title="${note}">${label}</strong></span><b>${n}</b><em>→</em></button>`;
 return `<section class="card ph-todos ph-operation-card">${cardHead('待办事项',link('风险事件',"App.platformHome.openPendingRisk()"))}<div class="ph-queue-chart"><div class="ph-queue-ring"><svg viewBox="0 0 112 112" role="group" aria-label="未关闭风险等级分布"><circle cx="56" cy="56" r="42" fill="none" stroke="#edf2f7" stroke-width="13"/>${arcs}</svg><button onclick="App.platformHome.openPendingRisk()" aria-label="查看全部 ${pending.length} 个未关闭风险"><strong>${pending.length}</strong><span>未关闭风险</span></button></div><div class="ph-queue-levels">${levels.map(r=>`<button class="ph-queue-level" data-priority="${r.id}" onclick="App.platformHome.openPendingRisk(this.dataset.priority)" aria-label="${E(r.name+'，'+r.n+' 个未关闭风险')}"><span class="rc-priority ${'rc-'+r.id.toLowerCase()}"><span title="${E(r.name)}">${E(r.name)}</span></span><strong>${r.n}</strong></button>`).join('')}</div></div><p class="ph-queue-note">${pending.length?'按风险等级优先处理，已关闭事件不计入待办。':'当前没有未关闭风险事件。'}</p><div class="ph-queue-actions">${action('异常任务','漏洞检测与攻防演练',s.exceptions.length,'App.platformHome.openExceptions()')}${action('记录待复核','人工确认防护检测结论',s.pendingReviews.length,'App.platformHome.openReviews()')}</div></section>`;
};

H.assetChart=function(rows,total){
 let offset=0;
 const arcs=rows.filter(r=>r.n).map(r=>{const size=ratio(r.n,total),arc=`<circle cx="56" cy="56" r="43" pathLength="100" fill="none" stroke="${r.color}" stroke-width="12" stroke-dasharray="${size} ${100-size}" stroke-dashoffset="${-offset}" transform="rotate(-90 56 56)"><title>${E(r.name)} ${r.n} 项</title></circle>`;offset+=size;return arc;}).join('');
 return `<div class="ph-donut" role="img" aria-label="技术资产分布：${E(rows.map(r=>r.name+' '+r.n+' 项').join('，'))}"><svg viewBox="0 0 112 112" aria-hidden="true"><circle cx="56" cy="56" r="43" fill="none" stroke="#edf2f7" stroke-width="12"/>${arcs}</svg><div><strong>${total}</strong><span>技术资产</span></div></div>`;
};
H.assetCount=(label,n,unit,icon,action)=>`<button class="ph-asset-count" onclick="${action}"><span class="ph-count-icon">${I(icon,16)}</span><span>${label}</span><strong>${n}<small>${unit}</small></strong>${I('chevron',13)}</button>`;
H.stack=function(items,total,label){return `<div class="ph-stacked" role="img" aria-label="${E(label+'：'+items.map(v=>v.name+' '+v.n).join('，'))}">${items.filter(v=>v.n).map(v=>`<span style="width:${ratio(v.n,total)}%;background:${v.color}" title="${E(v.name)} ${v.n}"></span>`).join('')}</div><div class="ph-chart-legend">${items.map(v=>`<span><i style="background:${v.color}"></i>${E(v.name)}<b>${v.n}</b></span>`).join('')}</div>`;};
H.small=(label,value)=>`<div><span>${label}</span><strong>${value}</strong></div>`;

H.render=function(){
 const s=H.snapshot(),p=H.strategies(),K=A.dataDisplay,stateCounts=K.counts(s.tasks);
 const resourceCount=(label,n,action)=>`<button onclick="${action}"><span>${label}</span><strong>${n}</strong></button>`;
 const catalog=(label,n,action)=>`<button onclick="${action}"><span>${label}</span><b>${n}</b></button>`;
 const assets=`<section class="ph-resource-card"><div class="ph-resource-heading"><h2>应用与资产</h2>${link('资产中心',"App.platformHome.openAsset()")}</div><div class="ph-resource-main">${resourceCount('AI 应用',s.apps.length,"App.platformHome.openAsset('applications')")}${resourceCount('技术资产',s.technical.length,"App.platformHome.openAsset()")}</div><div class="ph-resource-catalog">${inventory.map(([kind,name])=>catalog(name,s[kind].length,`App.platformHome.openAsset('${kind}')`)).join('')}</div><div class="ph-resource-foot">${catalog('已有评估覆盖',s.covered.length,'App.platformHome.openEvaluation()')}${catalog('待配置模型',s.pendingModels.length,'App.platformHome.openPendingModels()')}</div></section>`;
 const policies=`<section class="ph-resource-card"><div class="ph-resource-heading"><h2>策略资源</h2>${link('策略中心',"App.platformHome.openAttackPolicies()")}</div><div class="ph-resource-main">${resourceCount('已发布攻击策略',p.attack.length,'App.platformHome.openAttackPolicies()')}${resourceCount('已发布防护策略',p.defense.length,'App.platformHome.openDefense()')}</div><div class="ph-resource-catalog ph-policy-resources">${catalog('攻击方法',p.methods.length,'App.platformHome.openMethod()')}${catalog('攻击题库',p.banks.length,'App.platformHome.openBanks()')}</div><div class="ph-resource-foot">${catalog('已启用触发规则',s.enabledRules.length,'App.platformHome.openRiskRules()')}</div></section>`;
 const taskTypes=[['attack','攻防演练'],['code-scan','代码检测'],['app-scan','二进制 / 软件包'],['web-scan','Web 检测']].map(([type,name])=>({type,name,n:s.tasks.filter(t=>type==='attack'?A.evaluation.type(t)==='attack':t.type===type).length}));
 const evaluation=`<section class="card ph-evaluation ph-operation-card">${cardHead('安全评估',link('进入评估',"App.platformHome.openEvaluation()"))}<div class="ph-operation-summary">${K.facts([['评估任务',s.tasks.length],['完整报告',s.resultTasks.length]])}</div><div class="ph-status-chart"><div class="ph-subtitle"><span>任务执行状态</span></div>${H.stack(stateCounts.map(r=>({name:r.label,n:r.value,color:r.color})),s.tasks.length,'评估任务状态')}</div><div class="ph-data-list ph-task-types">${taskTypes.map(t=>`<button data-type="${t.type}" onclick="App.evaluationOverview.taskList(this.dataset.type==='attack'?'attack':'scan','all',this.dataset.type==='attack'?undefined:this.dataset.type)"><span>${t.name}</span><strong>${t.n}</strong></button>`).join('')}</div></section>`;
 const verdicts=[['Safe','安全',K.colors.teal],['Controversial','待确认',K.colors.amber],['Unsafe','不安全',K.colors.red],['Unknown','检测异常',K.colors.gray]].map(([id,name,color])=>({id,name,color,n:s.recordSummary.counts[id]||0})),checked=verdicts.reduce((n,r)=>n+r.n,0),largest=Math.max(1,...verdicts.map(v=>v.n));
 const protection=`<section class="card ph-protection ph-operation-card">${cardHead('安全防护',link('防护总览',"App.platformHome.openProtection()"))}<div class="ph-operation-summary">${K.facts([['累计检测',checked],['已执行阻断',s.blocked]])}</div><div class="ph-verdict-chart" role="img" aria-label="${E(verdicts.map(v=>v.name+' '+v.n+' 次').join('，'))}">${verdicts.map(v=>`<div><strong>${v.n}</strong><span class="ph-verdict-track"><i style="height:${v.n/largest*100}%;background:${v.color}"></i></span><span>${v.name}</span></div>`).join('')}</div><div class="ph-data-list"><button onclick="App.platformHome.openProtection()"><span>已接入防护</span><strong>${s.protectedApps.length} / ${s.apps.length}</strong></button><button onclick="App.protectionOps.openRecords()"><span>查看全部防护记录</span><span>→</span></button></div></section>`;
 return `<div class="platform-dashboard ph-clean-dashboard">${A.heading('','仪表盘','','<button class="btn" onclick="App.resetDemo()">恢复初始数据</button>')}<div class="ph-resource-grid">${assets}${policies}</div><div class="ph-grid ph-clean-grid">${evaluation}${protection}${H.queueHTML(s)}</div></div>`;
};

const init=X.init;
X.init=function(){const result=init.apply(X,arguments);A.safetyRules?.init();A.contentPolicies?.init();A.contentSafety?.init();A.scanProduct?.init();A.modelRoles?.init();A.contentProduct?.init();A.platformGovernance?.init();const fixture=X.db.tasks.find(t=>t.id==='EV-260919-077'&&t.simulated&&t.name.includes('智能体策略复核'));if(fixture){fixture.name=fixture.name.replace('智能体策略复核','多轮对话安全演练');A.save();}return result;};
})();

