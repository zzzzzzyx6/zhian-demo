/* Result-only model versions, derived from actual task targets. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const settings=()=>{
  const s=X.resultFilters ||= {};
  s.query ??= '';s.family ??= 'all';
  if(!['asc','desc'].includes(s.timeSort))s.timeSort='desc';
  if(![10,20,50].includes(s.pageSize))s.pageSize=10;
  if(!Number.isInteger(s.page)||s.page<1)s.page=1;
  delete s.sort;
  return s;
};
const stateText=t=>({running:'进行中',paused:'已暂停',done:'已完成',stopped:'手动结束',error:'任务异常'}[t.status]||'等待中');
const timestamp=t=>Date.parse(t.created||t.finished||'')||0;
const newestFirst=(a,b)=>timestamp(b)-timestamp(a)||String(b.id).localeCompare(String(a.id));
const version=t=>String(t.targetMeta?.version||'').trim()||'未标注版本';
const family=t=>String(t.targetMeta?.family||'').trim()||'未分组';
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().filter(k=>v[k]!==undefined).map(k=>[k,canonical(v[k])])):v;
const score=t=>{const m=X.metrics(t);return m.valid?100*m.defended/m.valid:null;};
const timeLabel=t=>{const raw=t.finished||t.created;if(!raw)return '--';const date=new Date(raw);return Number.isNaN(date.getTime())?raw:date.toLocaleString('sv-SE').slice(0,16);};
const stateBadge=t=>X.status(t);
const asrHint='攻击成功率 = 已攻破 ÷ 有效判定 × 100；执行异常不计入分母。';
const asrCell=t=>{const m=X.metrics(t);return `<span>${t.status==='done'&&m.valid?m.asr+'%':'--'}</span>`;};
const taskLink=(t,report=false)=>`data-task="${E(t.id)}" onclick="App.closeModal();App.attack.openResultTask(this.dataset.task,${report})"`;
X.openResultTask=function(id,report=false){X.open(id);if(report){X.detailTab='report';A.render();}};
X.resultPlanKey=function(t){
  const e=t.engine,items=t.bankSnapshot?.items;
  if(!items?.length||!t.units?.length||!e?.evaluationVersion||!e.roles?.judge?.model||!e.reference||!t.defense)return null;
  const questions=new Map(items.map(q=>[q.id,q]));
  if(t.units.some(u=>!questions.get(u.questionId)?.prompt||!u.method||!Number.isFinite(u.rounds)))return null;
  const runs=t.units.map(u=>({question:questions.get(u.questionId),method:u.method,rounds:u.rounds})).map(v=>JSON.stringify(canonical(v))).sort();
  return JSON.stringify(canonical({runs,engine:e,defense:t.defense,simulated:t.simulated===true}));
};
X.modelResultRows=function(tasks=X.db.tasks){
  const groups=new Map();
  for(const t of tasks){
    if(!t.model&&!t.targetSnapshot?.id)continue;
    const target=X.targetFor(t),key=JSON.stringify([t.model||target.id,target.model||'',family(t),version(t)]);
    if(!groups.has(key))groups.set(key,[]);groups.get(key).push(t);
  }
  const rows=[...groups.entries()].map(([key,runs])=>{
    runs.sort(newestFirst);const completed=runs.filter(t=>t.status==='done'),task=runs[0],metric=X.metrics(task);
    const eligible=task.status==='done'&&metric.total>0&&metric.valid===metric.total;
    return {key,tasks:runs,task,latest:runs[0],completed:completed.length,family:family(task),version:version(task),target:X.targetFor(task),metric,score:score(task),partial:task.status!=='done',plan:eligible?X.resultPlanKey(task):null,rank:null,cohortSize:0};
  });
  const cohorts=new Map();
  for(const row of rows)if(row.plan){if(!cohorts.has(row.plan))cohorts.set(row.plan,[]);cohorts.get(row.plan).push(row);}
  for(const group of cohorts.values()){
    if(group.length<2)continue;group.sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key));
    for(let i=0;i<group.length;i++){group[i].rank=i&&Math.abs(group[i].score-group[i-1].score)<1e-9?group[i-1].rank:i+1;group[i].cohortSize=group.length;}
  }
  return rows;
};
X.visibleResultRows=function(){
  const s=settings(),query=s.query.trim().toLocaleLowerCase();
  return X.modelResultRows().filter(r=>(s.family==='all'||r.family===s.family)&&(!query||[r.target.name,r.target.model,r.family,r.version].join(' ').toLocaleLowerCase().includes(query))).sort((a,b)=>(s.timeSort==='asc'?-1:1)*newestFirst(a.task,b.task));
};
X.searchSeries=function(v){Object.assign(settings(),{query:v,page:1});A.render();const el=document.getElementById('series-search');el?.focus();el?.setSelectionRange?.(v.length,v.length);};
X.selectSeries=function(v){Object.assign(settings(),{family:v,page:1});A.render();};
X.filterSeries=function(field,v){if(field==='family'){X.selectSeries(v);return;}if(field==='timeSort'&&['asc','desc'].includes(v)){Object.assign(settings(),{timeSort:v,page:1});A.render();}};
X.resetSeriesFilters=function(){Object.assign(settings(),{query:'',family:'all',timeSort:'desc',page:1});A.render();};
X.toggleResultTimeSort=function(){const s=settings();s.timeSort=s.timeSort==='asc'?'desc':'asc';s.page=1;A.render();};
X.pageSeries=function(page){const s=settings(),last=Math.max(1,Math.ceil(X.visibleResultRows().length/s.pageSize));s.page=Math.min(last,Math.max(1,Number(page)||1));A.render();};
X.sizeSeries=function(size){size=Number(size);if(![10,20,50].includes(size))return;Object.assign(settings(),{pageSize:size,page:1});A.render();};
function resultRow(r){
  const {task:t}=r,hasNewerRun=r.latest.id!==t.id&&['running','paused'].includes(r.latest.status);
  return `<tr data-task="${E(t.id)}"><td class="result-model-cell"><button class="link-btn result-model-name" data-model-key="${E(r.key)}" onclick="App.attack.seriesHistory(this.dataset.modelKey)">${E(r.target.name||r.target.model)}</button></td><td class="result-asr-cell" title="${asrHint}">${asrCell(t)}</td><td class="result-task-cell"><button class="link-btn" ${taskLink(t)} title="${E(t.name)}">${E(t.name)}</button><div class="result-task-status">${stateBadge(t)}</div></td><td class="result-time-cell">${E(timeLabel(t))}<small>${t.finished?'完成时间':'创建时间'}</small></td><td class="result-actions"><button class="link-btn" data-model-key="${E(r.key)}" onclick="App.attack.seriesHistory(this.dataset.modelKey)">演练记录 (${r.tasks.length})</button></td></tr>`;
}
X.seriesHistory=function(key,query=''){
  const row=X.modelResultRows().find(r=>r.key===key);if(!row)return;X.resultHistoryKey=key;
  const q=query.trim().toLocaleLowerCase(),runs=row.tasks.filter(t=>!q||t.name.toLocaleLowerCase().includes(q));
  A.modal(`${E(row.target.name||row.target.model)} · 演练记录`,`<div class="result-history-head"><input class="input" id="series-history-query" aria-label="搜索本模型演练记录" placeholder="搜索任务名称" value="${E(query)}" oninput="if(!event.isComposing)App.attack.searchSeriesHistory(this.value)"><span>共 ${runs.length} 条</span></div><div class="table-wrap result-history-table"><table><thead><tr><th>任务名称</th><th>任务状态</th><th title="${asrHint}">最终 ASR</th><th>演练时间</th><th>操作</th></tr></thead><tbody>${runs.map(t=>`<tr data-task="${E(t.id)}"><td class="result-history-task"><button class="link-btn" ${taskLink(t)}>${E(t.name)}</button></td><td>${stateBadge(t)}</td><td class="result-asr-cell" title="${asrHint}">${asrCell(t)}</td><td>${E(timeLabel(t))}<small>${t.finished?'完成时间':'创建时间'}</small></td><td><button class="link-btn" ${taskLink(t,true)}>${t.status==='done'?'查看报告':'阶段报告'}</button></td></tr>`).join('')||'<tr><td colspan="5"><div class="empty">没有符合条件的演练记录</div></td></tr>'}</tbody></table></div>`,`<button class="btn" onclick="App.closeModal()">关闭</button>`,{wide:true});
};
X.searchSeriesHistory=function(v){X.seriesHistory(X.resultHistoryKey,v);const el=document.getElementById('series-history-query');el?.focus();el?.setSelectionRange?.(v.length,v.length);};
X.seriesHTML=function(){
  const all=X.modelResultRows(),rows=X.visibleResultRows(),s=settings(),families=[...new Set(all.map(r=>r.family))].sort();
  const maxPage=Math.max(1,Math.ceil(rows.length/s.pageSize));s.page=Math.min(s.page,maxPage);
  const current=rows.slice((s.page-1)*s.pageSize,s.page*s.pageSize),ascending=s.timeSort==='asc',sortHint=`最近演练时间：当前${ascending?'最早优先':'最新优先'}，点击切换`;
  return `<div class="model-results-page"><section class="card model-results-list"><div class="toolbar result-toolbar"><div class="result-search">${I('search',15)}<input id="series-search" aria-label="搜索模型、系列或版本" placeholder="搜索模型、系列或版本" value="${E(s.query)}" oninput="if(!event.isComposing)App.attack.searchSeries(this.value)"></div><select aria-label="筛选模型系列" onchange="App.attack.selectSeries(this.value)"><option value="all">全部系列</option>${families.map(f=>`<option value="${E(f)}" ${s.family===f?'selected':''}>${E(f)}</option>`).join('')}</select>${s.query||s.family!=='all'?'<button class="link-btn result-reset" onclick="App.attack.resetSeriesFilters()">重置</button>':''}</div>
    <div class="table-wrap result-table-wrap" role="region" aria-label="模型版本结果" tabindex="0"><table class="model-results-table"><thead><tr><th>模型版本</th><th title="${asrHint}">最终 ASR</th><th>最近演练任务</th><th aria-sort="${ascending?'ascending':'descending'}"><button class="table-sort" title="${sortHint}" aria-label="${sortHint}" onclick="App.attack.toggleResultTimeSort()"><span>最近演练时间</span><svg class="time-sort-icon" viewBox="0 0 12 18" aria-hidden="true"><path class="${ascending?'active':''}" d="M6 2 11 7H1Z"/><path class="${ascending?'':'active'}" d="m6 16 5-5H1Z"/></svg></button></th><th>操作</th></tr></thead><tbody>${current.map(resultRow).join('')||`<tr><td colspan="5"><div class="empty">${all.length?'没有符合条件的模型版本':'暂无演练结果'}${all.length?'<button class="link-btn" onclick="App.attack.resetSeriesFilters()">清除筛选</button>':'<button class="btn primary" onclick="App.attack.newTask()">新建攻防任务</button>'}</div></td></tr>`}</tbody></table></div>
    <div class="table-foot result-table-foot"><span>共 ${rows.length} 条</span><div class="pagination"><select aria-label="每页显示条数" onchange="App.attack.sizeSeries(this.value)">${[10,20,50].map(n=>`<option value="${n}" ${s.pageSize===n?'selected':''}>${n} 条 / 页</option>`).join('')}</select><button class="btn small" aria-label="上一页" ${s.page<=1?'disabled':''} onclick="App.attack.pageSeries(${s.page-1})">‹</button><span class="page-number" aria-live="polite">${s.page} / ${maxPage}</span><button class="btn small" aria-label="下一页" ${s.page>=maxPage?'disabled':''} onclick="App.attack.pageSeries(${s.page+1})">›</button></div></div></section></div>`;
};
const overview=X.overview;
X.overview=function(){return X.tab==='series'?A.heading('','版本管理','')+X.seriesHTML():overview.apply(this,arguments);};
})();
