/* Product review: independent work areas, focused task presentation and review queue. */
(function(){
'use strict';
const A=window.App,P=A.platform,X=A.attack,V=A.evaluation,H=A.platformHome,D=A.demoPresentation,E=A.escape;
const R=A.octoberRefinement={domain:'exercise',view:'',reviewIds:null,reviewFilter:{status:'pending',days:'7',app:'',query:'',page:1}};
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v)),opt=(v,label,current)=>`<option value="${E(v)}" ${v===current?'selected':''}>${E(label)}</option>`;
const state=t=>({running:'运行中',done:'已完成',error:'异常终止',stopped:'已终止',queued:'等待中',pending:'等待中'}[t?.status]||'暂无任务');
const btn=(label,action,cls='link-btn')=>`<button type="button" class="${cls}" onclick="${action}">${label}</button>`;
const link=(label,id,action)=>`<button type="button" class="link-btn" data-id="${E(id)}" onclick="${action}(this.dataset.id)">${E(label)}</button>`;
const go=P.go,select=P.selectState,sync=P.sync,header=P.header,sidebar=P.sidebar,chrome=P.renderChrome,render=A.modules.attack.render;
const areas=[['workspace','安全态势'],['scan','安全扫描'],['exercise','模型演练'],['protection','安全防护'],['policy','策略中心'],['assets','资产中心'],['risk','风险中心']];
R.enter=function(section,item,tab,id){
 R.view='';
 if(section==='scan'||section==='exercise'){
  if(R.domain!==section)V.reportFilters={type:'all',scope:'all',query:'',sort:'desc'};
  R.domain=section;
  if(['results','datasets'].includes(item)){
   select.call(P,'evaluation',section==='scan'?'scan':'attack',section==='scan'?'code-scan':'tasks');
   R.view=item;X.selected=null;X.tab='platform';return true;
  }
  if(item==='reports')return select.call(P,'evaluation','reports',tab,id);
  return select.call(P,'evaluation',section==='scan'?'scan':'attack',section==='scan'?(tab||'code-scan'):'tasks',id|| (section==='exercise'?tab:undefined));
 }
 if(section==='evaluation'){
  if(item==='scan'||tab==='scan')R.domain='scan';
  else if(['attack','tasks'].includes(item)||item==='reports'&&tab&&X.db.tasks.some(t=>t.id===tab))R.domain='exercise';
 }
 if(section==='protection'&&item==='review'){
  select.call(P,'protection','overview');P.state={section:'protection',item:'review'};R.reviewIds=null;return true;
 }
 return select.call(P,section,item,tab,id);
};
P.selectState=R.enter;
P.go=function(section,item,tab,id){
 if(['scan','exercise'].includes(section)||section==='protection'&&item==='review'){
  if(!R.enter(section,item,tab,id))return;A.closeModal();A.closeDrawer();A.render();window.scrollTo({top:0,behavior:'instant'});return;
 }
 return go.apply(P,arguments);
};
P.sync=function(){sync.call(P);if(P.state.section==='evaluation'&&!R.view){if(P.state.item==='scan'||V.scanReportId)R.domain='scan';else if(P.state.item==='attack'||X.selected)R.domain='exercise';}};
P.header=function(){
 const active=P.state.section==='evaluation'?R.domain:P.state.section;
 return header.call(P).replace(/<nav class="platform-top-nav"[\s\S]*?<\/nav>/,`<nav class="platform-top-nav" aria-label="平台主导航">${areas.map(([id,name])=>btn(name,`App.platform.go('${id}')`,active===id?'active':'')).join('')}</nav>`);
};
P.menus.protection.splice(2,0,['review','复核工作台','file']);
P.sidebar=function(){
 if(P.state.section!=='evaluation')return sidebar.call(P);
 const scan=R.domain==='scan',current=R.view|| (P.state.item==='reports'?'reports':'tasks'),items=scan?[['tasks','扫描任务'],['reports','扫描报告'],['results','扫描结果']]:[['tasks','演练任务'],['reports','演练报告'],['results','演练结果'],['datasets','评测数据集']];
 return `<div class="platform-side-title"><strong>${scan?'安全扫描':'模型演练'}</strong>${btn(A.icon('chevron',15),'App.centers.toggle()','platform-collapse')}</div><nav id="center-navigation" aria-label="${scan?'安全扫描':'模型演练'}侧边栏">${items.map(([id,name])=>btn(name,`App.platform.go('${R.domain}','${id}')`,'platform-side-item '+(current===id?'active':''))).join('')}${scan&&current==='tasks'?`<div class="platform-subnav">${[['code-scan','代码扫描'],['app-scan','软件包扫描'],['web-scan','Web 扫描']].map(([id,name])=>btn(name,`App.platform.go('scan','tasks','${id}')`,'platform-subitem '+(P.scanTab===id?'active':''))).join('')}</div>`:''}</nav><div class="platform-side-footer">AI 安全平台</div>`;
};
P.renderChrome=function(){
 chrome.call(P);
 if(P.state.section==='evaluation'){
  let hash=R.domain+'/'+(R.view|| (P.state.item==='reports'?'reports':'tasks'));
  if(!R.view){if(P.state.item==='scan')hash+='/'+P.scanTab+(A.scanProduct.selected?'/'+encodeURIComponent(A.scanProduct.selected):'');else if(X.selected)hash+='/'+encodeURIComponent(X.selected);else if(V.scanReportId)hash+='/scan/'+encodeURIComponent(V.scanReportId);}
  if(location.hash.slice(1)!==hash)history.replaceState(null,'','#'+hash);
  document.getElementById('current-crumb').textContent=(R.domain==='scan'?'安全扫描':'模型演练')+' / '+({results:'结果分析',datasets:'评测数据集'}[R.view]|| (P.state.item==='reports'?'报告':'任务'));
 }
};
A.centers.render=P.renderChrome;
for(const [owner,key,domain] of [[X,'open','exercise'],[A.scanProduct,'open','scan']]){
 const original=owner[key];owner[key]=function(){R.view='';R.domain=domain;return original.apply(this,arguments);};
}
const openReport=V.openReport;
V.openReport=function(id){R.view='';const task=V.allTasks().find(t=>t.id===id);if(task)R.domain=V.type(task)==='scan'?'scan':'exercise';return openReport.apply(V,arguments);};
const reportList=V.openReportList;
V.openReportList=function(id){if(id){const t=V.allTasks().find(t=>t.id===id);if(t)R.domain=V.type(t)==='scan'?'scan':'exercise';}R.view='';return reportList.apply(V,arguments);};
const reports=V.reports;
V.reports=function(){return reports.apply(V,arguments).filter(t=>(V.type(t)==='scan')===(R.domain==='scan'));};
V.reportsHTML=function(){
 const scan=R.domain==='scan',rows=V.reports();
 return A.heading('',scan?'扫描报告':'演练报告','',`<input type="search" aria-label="搜索报告" placeholder="搜索任务名称" value="${E(V.reportFilters.query||'')}" onchange="App.evaluation.reportFilters.query=this.value;App.render()">`)+`<section class="card"><div class="table-wrap"><table><thead><tr><th>报告名称</th><th>任务状态</th><th>任务创建时间</th><th>生成时间</th><th>操作</th></tr></thead><tbody>${rows.map(t=>`<tr><td>${link(t.name,t.id,'App.evaluation.openReport')}</td><td>${state(t)}</td>${A.listConsistency.cell(A.listConsistency.created(t))}${A.listConsistency.cell(A.listConsistency.generated(t))}<td>${link('查看报告',t.id,'App.evaluation.openReport')} ${link('删除',t.id,'App.reviewPolish.removeEvaluation')}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">暂无报告，任务产生有效结果后可在这里查看。</td></tr>'}</tbody></table></div></section>`;
};
R.results=function(){
 const scan=R.domain==='scan',tasks=(scan?A.scanProduct.tasks():X.db.tasks).filter(t=>!t.deletedAt&&(scan||V.type(t)==='attack'));
 const completed=tasks.filter(t=>V.reportReady(t)),total=tasks.length;
 return A.heading('',scan?'扫描结果':'演练结果','按任务查看结果与对应证据。')+`<div class="or-metrics">${[['全部任务',total],['已有报告',completed.length],['进行中',tasks.filter(t=>t.status==='running').length]].map(([name,n])=>`<div><span>${name}</span><strong>${n}</strong></div>`).join('')}</div><section class="card"><div class="table-wrap"><table><thead><tr><th>任务</th><th>对象</th><th>状态</th><th>结果</th><th>操作</th></tr></thead><tbody>${tasks.map(t=>{const a=scan?null:X.taskAnalysis(t);return `<tr><td>${link(t.name,t.id,scan?'App.scanProduct.open':'App.attack.open')}</td><td>${E(scan?t.targetName||t.target||'扫描对象':X.targetFor(t)?.name||'未记录')}</td><td>${state(t)}</td><td>${scan?(V.reportReady(t)?'已生成扫描报告':'等待扫描结果'):(a.valid?`${a.breach} / ${a.valid} 个有效测试攻破`:'尚无有效判定')}</td><td>${V.reportReady(t)?link('查看报告',t.id,'App.evaluation.openReport'):'—'}</td></tr>`;}).join('')||'<tr><td colspan="5" class="empty">尚无任务结果</td></tr>'}</tbody></table></div></section>`;
};
A.modules.attack.render=function(){
 P.sync();
 if(P.state.section==='evaluation'&&R.view==='datasets')return A.evaluationDatasets.render();
 if(P.state.section==='evaluation'&&R.view==='results')return R.results();
 if(P.state.section==='protection'&&P.state.item==='review')return R.reviewHTML();
 let html=render.apply(this,arguments);
 if(P.state.section==='evaluation'&&P.state.item==='reports')html=html.replaceAll('评估报告',R.domain==='scan'?'扫描报告':'演练报告');
 return html;
};
// One live task, or the most recently created task when no run is active.
R.latestTask=()=>X.db.tasks.filter(t=>!t.deletedAt&&V.type(t)==='attack').slice().sort((a,b)=>(b.status==='running')-(a.status==='running')||String(b.created||'').localeCompare(String(a.created||'')))[0];
D.scanPanel=()=>`<section class="runtime-panel runtime-scan or-scan-empty" aria-label="安全扫描预留区域"><header><div><h3>安全扫描</h3></div><span class="or-live-status">待接入</span></header><div class="wb-scan-reserved"><div class="wb-scan-reserved-orbit" aria-hidden="true"><i></i><span></span></div><strong>扫描任务进度</strong><p>预留区域</p></div><footer><button type="button" class="link-btn" onclick="App.platform.go('scan','tasks')">扫描任务 <span aria-hidden="true">→</span></button></footer></section>`;
D.attackPanel=function(){
 const t=R.latestTask(),live=t?.status==='running',a=t?X.taskAnalysis(t):{total:0,done:0,valid:0,breach:0},progress=a.total?Math.round(a.done/a.total*100):0;
 const unit=t?.units?.find(u=>u.result==='pending'&&u.events?.length)||t?.units?.find(u=>u.result==='pending')||t?.units?.at(-1),guard=t?X.guardFlow(t):{};
 const raw=unit?.events?.at(-1)?.phase,phase=unit?.eventSchema===5?raw:raw===0?1:raw===1?2:raw===2?4:-1;
 const labels=['红队构造','输入防护','目标模型','输出防护','裁判判定'],icons=['zap','shield','box','shield','check'];
 const question=t&&unit?A.taskReports.question(t,unit)?.prompt||unit.seedPrompt||unit.attackPrompt||unit.roundHistory?.at(-1)?.prompt||'题目内容未保存':'创建模型演练任务后，在这里查看执行进程。';
 const displayQuestion=String(question).replace(/^(?:\s*\[[^\]\r\n]*\]\s*)+/,'');
 return `<section class="runtime-panel runtime-exercise or-arena ${live?'is-live':''}" aria-label="模型演练运行面板"><header><div><h3>模型演练</h3></div><span class="or-live-status"><i></i>${state(t)}</span></header><div class="or-arena-stage"><div class="or-stage-grid"></div><div class="or-flow-track"></div><div class="or-flow-nodes">${labels.map((name,i)=>{const skipped=i===1&&!guard.input||i===3&&!guard.output,active=live&&i===phase&&!skipped;return `<div class="or-flow-node ${active?'active':''} ${skipped?'skipped':''}"><div class="or-node-symbol">${A.icon(icons[i],i===2?28:20)}</div><strong>${name}</strong><span>${!t?'待任务':skipped?'未配置':active?'执行中':t.status==='done'?'已完成':live?'等待调度':'已结束'}</span></div>`;}).join('')}</div></div><div class="or-progress-caption"><span>测试进度 <b>${a.done.toLocaleString()} / ${a.total.toLocaleString()}</b></span><strong>${progress}%</strong></div><div class="or-progress"><i style="width:${progress}%"></i></div><div class="or-current-question"><span>${live?'当前攻击题目':'最近攻击题目'}</span><p title="${E(displayQuestion)}">${E(displayQuestion)}</p></div><footer>${btn('演练任务 <span aria-hidden="true">→</span>',"App.platform.go('exercise','tasks')")}</footer></section>`;
};
R.performance=function(title,rows){
 return `<section class="card or-performance"><header><h2>${title}</h2><span>攻击成功率</span></header><div class="or-performance-rows">${rows.length?rows.map(row=>{const value=row.valid?row.breach/row.valid*100:null;return `<div class="or-performance-row"><div><strong title="${E(row.label||row.name||row.id)}">${E(row.label||row.name||row.id)}</strong><b>${value===null?'—':value.toFixed(1)+'%'}</b></div><div class="or-bar ${value===null?'no-result':''}"><i style="width:${value||0}%"></i></div><small>${row.valid?`${row.breach} 次攻破 / ${row.valid} 次有效判定`:`等待判定 · ${row.total||0} 个测试单元`}</small></div>`;}).join(''):'<div class="or-chart-empty"><span>等待测试结果</span><i></i><i></i><i></i><small>任务执行后自动汇总，暂无数据不计为 0%。</small></div>'}</div></section>`;
};
const taskDetail=V.taskDetailHTML;
V.taskDetailHTML=function(t){
 if(!t||t.deletedAt||V.type(t)==='scan')return taskDetail.call(V,t);
 const a=X.taskAnalysis(t),j=A.taskReports.judgement(t),target=X.targetFor(t),methods=a.methods.map(m=>m.label).join('、'),original=taskDetail.call(V,t),heading=original.slice(0,original.indexOf('<section class="card task-config-detail'));
 const tiles=[['靶标模型',target?.name||'未记录',t.targetMeta?.version||t.targetMeta?.environment||'评测对象'],['攻击策略',t.runSnapshot?.policy?.name||t.policySnapshot?.name||'自定义配置',methods||'未配置方法'],['测试范围',t.bankSnapshot?.name||'未记录题库',`${t.bankSnapshot?.items?.length||0} 道题目 · ${a.total} 个测试单元`],['防护方案',X.blueLabel(t.defense),X.guardFlow(t).input||X.guardFlow(t).output?'独立安全防护':'模型原生能力']];
 return heading+`<section class="card or-task-information"><header><h2>任务信息</h2><span>${E(t.created||'创建时间未记录')}</span></header>${t.description?`<p class="or-task-description">${E(t.description)}</p>`:''}<div class="or-info-grid">${tiles.map(([label,value,sub],i)=>`<div><span class="or-info-icon">${A.icon(['box','zap','layers','shield'][i],19)}</span><span>${label}</span><strong>${E(value)}</strong><small>${E(sub)}</small></div>`).join('')}</div><div class="or-task-meta"><span>红队 <b>${E(t.engine?.roles?.attacker?.name||t.engine?.attacker||'本地模板')}</b></span><span>裁判 <b>${E(t.engine?.roles?.judge?.name||t.engine?.judge||'未记录')}</b></span><span>并发 <b>${E(t.engine?.concurrency||1)}</b></span></div><details class="or-config-details"><summary>查看完整配置与判定规则</summary>${A.reportLayout.configHTML(t,a)}<h3>判定规则</h3><p>${E(j.safetyRules||j.rule||t.engine?.judgeRule||'未保存规则正文')}</p></details></section><div class="or-performance-grid">${R.performance('场景表现',a.relatedScenes)}${R.performance('攻击方法表现',a.methods)}</div>`;
};
// Reference parameters stay visible in the catalogue; actual overrides belong to a policy.
const PP=A.policies;
PP.renderMethods=function(){
 const query=PP.methodQuery.trim().toLowerCase(),rows=PP.methods().filter(m=>(PP.methodCategory==='all'||m.family===PP.methodCategory)&&(!PP.methodTurns||m.turns===PP.methodTurns)&&[m.name,m.description,m.family].join(' ').toLowerCase().includes(query));
 return `<section class="card or-methods"><div class="toolbar"><input aria-label="搜索攻击方法" placeholder="搜索方法或说明" value="${E(PP.methodQuery)}" onchange="App.policies.searchMethods(this.value)"><select aria-label="技术路线筛选" onchange="App.policies.methodCategory=this.value;App.render()">${opt('all','全部技术路线',PP.methodCategory)}${PP.methodFamilies.map(f=>opt(f,f,PP.methodCategory)).join('')}</select><select aria-label="交互轮次筛选" onchange="App.policies.methodTurns=this.value;App.render()">${opt('','全部轮次',PP.methodTurns)}${['单轮','多轮'].map(f=>opt(f,f,PP.methodTurns)).join('')}</select></div><div class="table-wrap"><table><thead><tr><th>攻击方法 / 说明</th><th>技术路线</th><th>交互轮次</th><th>参数参考值</th></tr></thead><tbody>${rows.map(m=>{const values=PP.defaults(m.id),schema=PP.parameterSchema(m.id),parameters=schema.filter(f=>f.type!=='textarea').map(f=>[f.label,f.type==='select'?(f.options.find(o=>o.value===(values[f.key]??f.value))?.label??values[f.key]??f.value):values[f.key]??f.value,f.key]);return `<tr><td>${link(m.name,m.id,'App.policies.methodDetail')}<p>${E(m.description||m.label||'查看方法定义')}</p></td><td>${E(m.family||m.category)}</td><td>${E(m.turns||'单轮')}</td><td><dl>${parameters.length?parameters.map(([name,value,key])=>`<div><dt title="${E(key)}">${E(name)}</dt><dd>${E(typeof value==='object'?JSON.stringify(value):String(value))}</dd></div>`).join(''):'<div><dt>执行方式</dt><dd>固定模板 / 默认配置</dd></div>'}</dl></td></tr>`;}).join('')||'<tr><td colspan="4" class="empty">暂无匹配方法</td></tr>'}</tbody></table></div><p class="or-table-note">表中展示方法参考值；任务实际参数以攻击策略中保存的配置为准。</p></section>`;
};
const B=A.banks,bankRender=B.render;
R.bankTags=function(b){const tags=new Map();for(const q of arr(b.items))for(const id of A.sceneTags.resolve(q))tags.set(id,A.sceneTags.label(id,q));return [...tags.values()];};
B.catalogTable=function(){return B.catalogRows().map(b=>{const tags=R.bankTags(b);return `<tr><td>${link(b.name,b.id,'App.banks.open')}<small>${E(b.description||b.sourceName||'')}</small></td><td><span class="bank-source ${b.builtin?'builtin':'custom'}">${b.builtin?'系统':'自建'}</span></td><td>${E(B.industryLabel?.(b.industry)||b.industry||'通用')}</td><td class="or-bank-tags"><div>${tags.slice(0,4).map(s=>`<span>${E(s)}</span>`).join('')||'<span>未标注场景</span>'}</div>${tags.length>4?`<details><summary>其余 ${tags.length-4} 个标签</summary><div>${tags.slice(4).map(s=>`<span>${E(s)}</span>`).join('')}</div></details>`:''}</td><td>${b.items.length.toLocaleString()}</td><td>${link('查看题目',b.id,'App.banks.open')} ${!b.builtin?link('编辑',b.id,'App.banks.create'):''} ${link('导出',b.id,'App.banks.export')} ${A.entryManagement.button('bank',b.id)}</td></tr>`;}).join('')||'<tr><td colspan="6" class="empty">暂无题库</td></tr>';};
B.render=function(){return bankRender.apply(B,arguments).replace(/(<th[^>]*>)(题目数|题目数量|数量)(<\/th>)/,'<th>场景标签</th>$1$2$3');};
const content=PP.renderContent;
PP.renderContent=function(){return content.apply(PP,arguments).replace('<th>题目数量</th>','<th>场景标签</th><th>题目数量</th>');};
// Fixed queue membership prevents incoming traffic from moving the user's current page.
const S=A.contentSafety;
R.refreshReviews=function(){R.reviewIds=S.db.reviews.map(v=>v.id);R.reviewFilter.page=1;A.render();};
R.reviewRows=function(){
 if(R.reviewIds===null)R.reviewIds=S.db.reviews.map(v=>v.id);
 const f=R.reviewFilter,ids=new Set(R.reviewIds),cutoff=f.days?Date.now()-Number(f.days)*86400000:0;
 return S.db.reviews.filter(v=>ids.has(v.id)).map(v=>({v,r:S.db.requests.find(r=>r.id===v.requestId)})).filter(({v,r})=>r&&(!f.app||r.appId===f.app)&&(!f.status||(f.status==='pending'?['pending','reviewing'].includes(v.status):v.status===f.status))&&(!cutoff||Date.parse(v.createdAt||r.createdAt)>=cutoff)&&(!f.query||[v.requestId,r.text,S.appName(r.appId)].join(' ').toLowerCase().includes(f.query.toLowerCase()))).sort((a,b)=>String(b.v.createdAt).localeCompare(String(a.v.createdAt)));
};
R.reviewFilterBy=function(key,value){if(Object.hasOwn(R.reviewFilter,key)){R.reviewFilter[key]=value;R.reviewFilter.page=1;A.render();}};
R.reviewHTML=function(){
 const rows=R.reviewRows(),f=R.reviewFilter,size=15,pages=Math.max(1,Math.ceil(rows.length/size));f.page=Math.min(f.page,pages);const newCount=S.db.reviews.filter(v=>!R.reviewIds.includes(v.id)).length;
 return A.heading('','复核工作台','集中处理需人工判断的内容；复核结论与原始检测记录分别保留。',btn('刷新队列'+(newCount?' · '+newCount+' 条新事项':''),'App.octoberRefinement.refreshReviews()','btn'))+`<section class="card"><div class="toolbar or-review-filters">${[['status','复核状态',[['pending','待处理'],['complete','已复核'],['','全部状态']]],['days','复核时间范围',[['1','近24小时'],['7','近7天'],['30','近30天'],['','全部时间']]],['app','复核应用',[['','全部应用'],...S.apps.map(a=>[a.id,a.name])]]].map(([key,label,values])=>`<select aria-label="${label}" onchange="App.octoberRefinement.reviewFilterBy('${key}',this.value)">${values.map(([v,n])=>opt(v,n,f[key])).join('')}</select>`).join('')}<input aria-label="搜索复核内容" placeholder="请求 ID / 内容" value="${E(f.query)}" onchange="App.octoberRefinement.reviewFilterBy('query',this.value)"></div><div class="or-queue-note">当前队列已固定 · 新事项点击“刷新队列”后载入</div><div class="table-wrap"><table><thead><tr><th>请求 / 内容</th><th>所属应用</th><th>提交时间</th><th>复核状态</th><th>人工结论</th><th>操作</th></tr></thead><tbody>${rows.slice((f.page-1)*size,f.page*size).map(({v,r})=>`<tr><td>${link(r.id,r.id,'App.contentSafety.detail')}<p class="or-review-excerpt">${E(r.text||'图片内容')}</p></td><td>${E(S.appName(r.appId))}</td><td>${S.time(v.createdAt||r.createdAt)}</td><td>${v.status==='complete'?'已复核':'待处理'}</td><td>${E(v.conclusion||'—')}</td><td>${v.status==='complete'?link('查看记录',r.id,'App.contentSafety.detail'):link('开始复核',v.id,'App.contentSafety.reviewForm')}</td></tr>`).join('')||'<tr><td colspan="6" class="empty">当前范围内没有复核事项</td></tr>'}</tbody></table></div><div class="table-foot"><span>共 ${rows.length} 条 · ${f.page} / ${pages} 页</span><div><button class="btn small" ${f.page<=1?'disabled':''} onclick="App.octoberRefinement.reviewFilter.page--;App.render()">上一页</button><button class="btn small" ${f.page>=pages?'disabled':''} onclick="App.octoberRefinement.reviewFilter.page++;App.render()">下一页</button></div></div></section>`;
};
const safetyGo=S.go;
S.go=function(page){if(page==='review')return P.go('protection','review');return safetyGo.apply(S,arguments);};
H.openReviews=()=>P.go('protection','review');
H.openAppReviews=function(id){R.reviewFilter={...R.reviewFilter,app:id,status:'pending',page:1};P.go('protection','review');};
const overview=A.contentProduct.overview;
A.contentProduct.overview=function(){return overview.apply(this,arguments).replace('<div class="pd-overview-grid">',`<div class="or-review-entry"><span>人工复核 <strong>${S.pendingReviews().length}</strong> 项待处理</span>${btn('进入复核工作台 →',"App.platform.go('protection','review')")}</div><div class="pd-overview-grid">`);};
})();
