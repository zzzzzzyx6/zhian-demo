/* A workspace page built exclusively from task target labels and task results. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const newestFirst=(a,b)=>String(b.created||'').localeCompare(String(a.created||''));
const taskState=t=>({running:'进行中',paused:'已暂停',done:'已完成',stopped:'已结束',error:'任务异常'}[t.status]||'等待中');
const openTask=t=>`data-task="${E(t.id)}" onclick="App.attack.open(this.dataset.task)"`;
const partial=(t,m)=>m.done<m.total||['running','paused'].includes(t.status);

function families(){
  const groups=new Map();
  for(const task of X.db.tasks){
    const name=String(task.targetMeta?.family||'').trim();
    if(!name)continue;
    if(!groups.has(name))groups.set(name,[]);
    groups.get(name).push(task);
  }
  return [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0],'zh-CN'));
}

function versions(tasks){
  const groups=new Map();
  for(const task of [...tasks].sort(newestFirst)){
    const version=String(task.targetMeta?.version||'').trim()||'未标注版本';
    if(!groups.has(version))groups.set(version,[]);
    groups.get(version).push(task);
  }
  return [...groups.entries()].map(([name,rows])=>{
    const latest=rows.find(task=>task.status==='done')||rows[0];
    return {name,tasks:rows,latest,metric:X.metrics(latest)};
  });
}

function protocol(task){
  const bank=task.bankSnapshot||{},engine=task.engine||{},defense=task.defense||{mode:'existing'};
  return JSON.stringify({
    banks:(bank.bankIds||[bank.id||'']).slice().sort(),
    samples:(bank.items||[]).map(item=>[item.id,item.prompt||item.question||item.text||'']).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))),
    methods:[...new Set(engine.methods||task.units.map(unit=>unit.method))].sort(),
    rounds:engine.maxRounds||1,
    count:task.units.length,
    attacker:engine.roles?.attacker?.model||engine.attacker||'',
    judge:engine.roles?.judge?.model||engine.judge||'',
    evaluation:engine.evaluationVersion||'',
    defense
  });
}

function versionChart(row){
  const t=row.latest,m=row.metric,isPartial=partial(t,m),value=m.valid?Math.max(0,Math.min(100,Number(m.asr)||0)):0;
  return `<div class="model-series-bar-row"><div class="model-series-bar-label"><strong>${E(row.name)}</strong><small>${E(X.targetFor(t).name)}</small></div><div class="model-series-bar-cell"><div class="model-series-bar-track"><span style="width:${value}%" class="${isPartial?'partial':''}"></span></div><div class="model-series-bar-meta"><span>${m.valid} 个有效判定</span><span>${isPartial?'阶段结果':m.valid?'完整结果':'暂无有效判定'}</span></div></div><strong class="model-series-asr">${m.valid?E(m.asr)+'<small>%</small>':'—'}</strong><button class="link-btn model-series-source" title="${E(t.name)}" ${openTask(t)}>对应任务 ${I('arrow',12)}</button></div>`;
}

function taskTable(row){
  return `<tbody><tr class="model-series-version-row"><th colspan="6"><span>${E(row.name)}</span><small>${row.tasks.length} 个关联任务</small></th></tr>${row.tasks.map(t=>{
    const m=X.metrics(t);
    return `<tr><td><button class="link-btn model-series-task-name" ${openTask(t)}>${E(t.name)}</button><small>${E(t.id)}</small></td><td>${E(X.targetFor(t).name)}</td><td><span class="model-series-state ${E(t.status)}">${taskState(t)}</span><small>${m.done} / ${m.total} 已完成</small></td><td><strong>${m.valid?E(m.asr)+'%':'—'}</strong><small>${partial(t,m)?'阶段结果':m.valid?'完整结果':'暂无有效判定'}</small></td><td>${E(t.created||'—')}</td><td><button class="btn small" ${openTask(t)}>详情</button></td></tr>`;
  }).join('')}</tbody>`;
}

X.selectSeries=function(name){X.seriesFamily=name;A.render();};
X.seriesHTML=function(){
  const groups=families();
  if(!groups.length)return `<section class="card model-series-empty">${I('layers',32)}<h2>还没有模型系列</h2><p>创建任务时，为被测模型填写系列名称和版本标签，演练结果将自动归集到这里。</p><button class="btn primary" onclick="App.attack.newTask()">新建攻防任务</button></section>`;
  const selected=groups.find(([name])=>name===X.seriesFamily)||groups[0],family=selected[0],tasks=selected[1],rows=versions(tasks),completed=tasks.filter(t=>t.status==='done').length;
  X.seriesFamily=family;
  const comparable=new Set(rows.map(row=>protocol(row.latest))).size<=1;
  return `<div class="model-series-page"><div class="model-series-toolbar"><div class="model-series-picker"><label for="model-series-select">系列名称</label><select id="model-series-select" onchange="App.attack.selectSeries(this.value)">${groups.map(([name,items])=>`<option value="${E(name)}" ${name===family?'selected':''}>${E(name)} · ${items.length} 个任务</option>`).join('')}</select></div><p>查看各版本模型的演练结果与关联任务</p></div><section class="model-series-summary"><div><span>当前系列</span><h2>${E(family)}</h2></div><div class="model-series-totals"><div><strong>${rows.length}</strong><span>版本标签</span></div><div><strong>${tasks.length}</strong><span>关联任务</span></div><div><strong>${completed}</strong><span>已完成任务</span></div></div></section><section class="card model-series-chart"><header><div><h3>各版本演练结果</h3><p>攻击成功率 ASR · 攻破数 / 有效判定数</p></div><span class="model-series-comparison-note ${!comparable?'mixed':''}">${rows.length===1?'优先展示最近已完成任务':comparable?'同一演练配置':'题库或攻防配置不同，结果分别展示'}</span></header><div class="model-series-bars">${rows.map(versionChart).join('')}</div><footer>优先展示各版本最近已完成的任务；尚无完整结果时展示最近任务的阶段结果。异常不计入 ASR。</footer></section><section class="card model-series-tasks"><header><div><h3>关联任务</h3><p>按版本查看全部演练记录</p></div><span>${tasks.length} 个任务</span></header><div class="table-wrap"><table><thead><tr><th>任务名称</th><th>被测模型</th><th>任务状态</th><th>攻击成功率</th><th>创建时间</th><th>操作</th></tr></thead>${rows.map(taskTable).join('')}</table></div></section></div>`;
};

const overview=X.overview;
X.overview=function(){if(X.tab==='series')return A.heading('','模型系列','')+X.seriesHTML();return overview.apply(this,arguments);};
})();
