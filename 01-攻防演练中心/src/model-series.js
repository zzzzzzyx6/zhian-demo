/* Task-backed family search, version comparison, and on-demand run history. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const newestFirst=(a,b)=>String(b.created||'').localeCompare(String(a.created||''));
const stateText=t=>({running:'进行中',paused:'已暂停',done:'已完成',stopped:'已结束',error:'任务异常'}[t.status]||'等待中');
const taskLink=t=>`data-task="${E(t.id)}" onclick="App.closeModal();App.attack.open(this.dataset.task)"`;
const settings=()=>X.seriesFilters ||= {query:'',version:'all',status:'all',compared:null,choices:{},runChoices:null};
const versionName=t=>String(t.targetMeta?.version||'').trim()||'未标注版本';
const isPartial=(t,m)=>m.done<m.total||['running','paused'].includes(t.status);
const keyFor=(family,version)=>JSON.stringify([family,version]);
function families(){
  const groups=new Map();
  for(const task of X.db.tasks){const name=String(task.targetMeta?.family||'').trim();if(!name)continue;if(!groups.has(name))groups.set(name,[]);groups.get(name).push(task);}
  return [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0],'zh-CN'));
}
function versionGroups(tasks){
  const groups=new Map();
  for(const task of [...tasks].sort(newestFirst)){const name=versionName(task);if(!groups.has(name))groups.set(name,[]);groups.get(name).push(task);}
  return [...groups.entries()].map(([name,rows])=>({name,tasks:rows}));
}
function context(){
  const s=settings(),query=s.query.trim().toLocaleLowerCase(),all=families();
  const matches=all.filter(([name,tasks])=>!query||name.toLocaleLowerCase().includes(query)||tasks.some(t=>(X.targetFor(t).name||'').toLocaleLowerCase().includes(query)));
  const selected=matches.find(([name])=>name===X.seriesFamily)||matches[0];
  if(!selected)return {all,matches,family:'',tasks:[],versions:[],rows:[]};
  const [family,tasks]=selected;X.seriesFamily=family;
  const candidates=tasks.filter(t=>(!query||family.toLocaleLowerCase().includes(query)||(X.targetFor(t).name||'').toLocaleLowerCase().includes(query)));
  const versions=versionGroups(candidates);
  const filtered=candidates.filter(t=>(s.version==='all'||versionName(t)===s.version)&&(s.status==='all'||t.status===s.status));
  const rows=versionGroups(filtered).map(row=>{
    const chosen=s.choices[keyFor(family,row.name)],task=row.tasks.find(t=>t.id===chosen)||row.tasks.find(t=>t.status==='done')||row.tasks[0];
    return {...row,task,metric:X.metrics(task),allCount:tasks.filter(t=>versionName(t)===row.name).length};
  });
  return {all,matches,family,tasks,versions,rows};
}
function selection(rows){const s=settings();return s.compared===null?rows.slice(0,4).map(row=>row.name):s.compared;}
function renderSearch(){A.render();const input=document.getElementById('series-search');input?.focus();input?.setSelectionRange?.(input.value.length,input.value.length);}
X.searchSeries=function(value){const s=settings();s.query=value;s.version='all';s.compared=null;s.runChoices=null;renderSearch();};
X.selectSeries=function(name){X.seriesFamily=name;const s=settings();s.version='all';s.status='all';s.compared=null;s.runChoices=null;A.render();};
X.filterSeries=function(field,value){if(!['version','status'].includes(field))return;settings()[field]=value;settings().compared=null;settings().runChoices=null;A.render();};
X.toggleSeriesVersion=function(name){settings().runChoices=null;const c=context(),selected=[...selection(c.rows)],index=selected.indexOf(name);if(index>=0)selected.splice(index,1);else{if(selected.length>=4){A.toast('最多同时对比 4 个版本');return;}selected.push(name);}settings().compared=selected;A.render();};
X.chooseSeriesTask=function(version,id,index){
  const c=context(),s=settings(),task=c.tasks.find(t=>t.id===id&&versionName(t)===version);if(!task)return;
  if(s.runChoices&&Number.isInteger(index)){if(s.runChoices.some((chosen,i)=>i!==index&&chosen===id)){A.toast('这次演练已在对比中');A.render();return;}s.runChoices[index]=id;}
  else {s.runChoices=null;const selected=[...selection(c.rows)];if(!selected.includes(version)){if(selected.length>=4){A.toast('请先取消一个版本，最多同时对比 4 个');return;}selected.push(version);}s.compared=selected;s.choices[keyFor(c.family,version)]=id;}
  if(s.status!=='all'&&s.status!==task.status)s.status='all';A.closeModal();A.render();
};
X.compareVersionRuns=function(version){const c=context(),tasks=c.tasks.filter(t=>versionName(t)===version).sort(newestFirst);if(!tasks.length)return;Object.assign(settings(),{version,status:'all',compared:null,runChoices:tasks.slice(0,4).map(t=>t.id)});A.closeModal();A.render();};
X.resetSeriesFilters=function(){Object.assign(settings(),{query:'',version:'all',status:'all',compared:null,runChoices:null});A.render();};
function trend(tasks){
  const completed=[...tasks].reverse().filter(t=>X.metrics(t).valid).slice(-8);
  if(!completed.length)return '<span class="series-no-trend">等待结果</span>';
  const pts=completed.map((t,i)=>({x:completed.length===1?70:5+i*130/(completed.length-1),y:28-Number(X.metrics(t).asr)*.23}));
  return `<svg class="series-mini-trend" viewBox="0 0 140 32" role="img" aria-label="最近 ${completed.length} 次演练 ASR"><path d="M0 30H140" class="axis"/><polyline points="${pts.map(p=>`${p.x},${p.y}`).join(' ')}"/>${pts.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="2.5"><title>${E(completed[i].name)}：${E(X.metrics(completed[i]).asr)}%</title></circle>`).join('')}</svg>`;
}
function versionTile(row,selected){return `<article class="series-version ${selected?'selected':''}"><label><input type="checkbox" ${selected?'checked':''} data-version="${E(row.name)}" onchange="App.attack.toggleSeriesVersion(this.dataset.version)"><span><strong>${E(row.name)}</strong><small>${E(X.targetFor(row.task).name)}</small></span></label><div class="series-version-bottom">${trend(row.tasks)}<button class="link-btn" data-version="${E(row.name)}" onclick="App.attack.seriesHistory(this.dataset.version)">${row.allCount} 次演练 ${I('chevron',12)}</button></div></article>`;}
function comparisonCard(row,index){
  const {task:t,metric:m}=row,asr=m.valid?Number(m.asr):0,defense=m.valid?100-asr:0;
  return `<article class="series-compare-card" data-task="${E(t.id)}"><header><span class="series-column-number">0${index+1}</span><div><h3>${E(row.name)}</h3><small title="${E(X.targetFor(t).name)}">${E(X.targetFor(t).name)}</small></div></header><div class="series-run-picker"><label for="series-run-${index}">演练记录</label><select id="series-run-${index}" data-version="${E(row.name)}" onchange="App.attack.chooseSeriesTask(this.dataset.version,this.value,${index})">${row.tasks.map(run=>`<option value="${E(run.id)}" ${run.id===t.id?'selected':''}>${E(run.name)} · ${E(run.created||'')} · ${stateText(run)}</option>`).join('')}</select><div><time>${E(t.created||'—')}</time><span class="series-run-state ${E(t.status)}">${stateText(t)}</span></div></div><div class="series-result"><div class="series-result-caption">攻击成功率 <span>ASR</span>${isPartial(t,m)?'<em>阶段结果</em>':''}</div><strong>${m.valid?E(m.asr):'—'}${m.valid?'<small>%</small>':''}</strong><div class="series-asr-scale"><span style="width:${asr}%"></span></div><div class="series-scale-labels"><span>0%</span><span>100%</span></div></div><div class="series-result-stats"><div><span>有效判定</span><b>${m.valid}</b></div><div class="breach"><span>攻破</span><b>${m.breach}</b></div><div class="defended"><span>守住</span><b>${m.defended}</b></div><div class="error"><span>异常</span><b>${m.errors}</b></div></div><div class="series-defense-rate"><span>守住率</span><b>${m.valid?defense.toFixed(1)+'%':'—'}</b></div><footer><button class="link-btn" data-version="${E(row.name)}" onclick="App.attack.seriesHistory(this.dataset.version)">全部 ${row.allCount} 次演练</button><button class="link-btn" ${taskLink(t)}>任务详情 ${I('arrow',12)}</button></footer></article>`;
}
function configuration(rows){
  const fields=[['题库',t=>t.bankSnapshot?.name||'—'],['攻击方法',t=>(t.engine?.methods||[]).map(id=>X.methodDependencies[id]?.label||id).join('、')||'—'],['蓝队',t=>X.blueLabel?X.blueLabel(t.defense||{mode:'existing'}):'基准防守'],['裁判',t=>t.engine?.roles?.judge?.name||t.engine?.judge||'—']];
  return `<details class="series-config-compare"><summary>对比演练配置<span>展开</span></summary><div class="table-wrap"><table><thead><tr><th>配置项</th>${rows.map(row=>`<th>${E(row.name)}${settings().runChoices?`<small>${E(row.task.name)}</small>`:''}</th>`).join('')}</tr></thead><tbody>${fields.map(([name,value])=>`<tr><th>${name}</th>${rows.map(row=>`<td>${E(value(row.task))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
}
X.seriesHistory=function(version,query=''){
  const c=context(),all=c.tasks.filter(t=>versionName(t)===version).sort(newestFirst),q=query.trim().toLocaleLowerCase(),rows=all.filter(t=>!q||t.name.toLocaleLowerCase().includes(q));
  X.seriesHistoryVersion=version;
  A.modal(`${E(c.family)} · ${E(version)} 的演练记录`,`<div class="series-history-search"><input id="series-history-query" aria-label="搜索本版本任务名称" placeholder="搜索本版本任务名称" value="${E(query)}" oninput="if(!event.isComposing)App.attack.searchSeriesHistory(this.value)"><span>${rows.length} / ${all.length} 次演练</span></div><div class="series-history-list">${rows.map(t=>{const m=X.metrics(t);return `<article><div><button class="link-btn" ${taskLink(t)}>${E(t.name)}</button><small>${E(t.created||'')} · ${stateText(t)}</small></div><div><strong>${m.valid?E(m.asr)+'%':'—'}</strong><small>ASR${isPartial(t,m)?' · 阶段':''}</small></div><button class="btn small" data-version="${E(version)}" data-task="${E(t.id)}" onclick="App.attack.chooseSeriesTask(this.dataset.version,this.dataset.task)">用于对比</button></article>`;}).join('')||'<div class="empty">没有匹配的任务</div>'}</div>`,`<button class="btn" onclick="App.closeModal()">关闭</button><button class="btn primary" data-version="${E(version)}" ${all.length<2?'disabled':''} onclick="App.attack.compareVersionRuns(this.dataset.version)">对比本版本演练</button>`,{wide:true});
};
X.searchSeriesHistory=function(value){X.seriesHistory(X.seriesHistoryVersion,value);const input=document.getElementById('series-history-query');input?.focus();input?.setSelectionRange?.(value.length,value.length);};
X.seriesHTML=function(){
  const c=context(),s=settings(),selected=selection(c.rows);let compared=c.rows.filter(row=>selected.includes(row.name));
  if(s.runChoices)compared=s.runChoices.map(id=>c.tasks.find(t=>t.id===id)).filter(Boolean).map(task=>{const tasks=c.tasks.filter(t=>versionName(t)===versionName(task)).sort(newestFirst);return {name:versionName(task),task,metric:X.metrics(task),tasks,allCount:tasks.length};});
  if(!c.all.length)return '<section class="card model-series-empty"><h2>还没有模型系列</h2><button class="btn primary" onclick="App.attack.newTask()">新建攻防任务</button></section>';
  return `<div class="model-series-page"><div class="series-search-toolbar"><div class="series-search-box">${I('search',16)}<input id="series-search" aria-label="搜索模型或系列名称" placeholder="搜索模型或系列名称" value="${E(s.query)}" oninput="if(!event.isComposing)App.attack.searchSeries(this.value)"></div><select aria-label="系列名称" onchange="App.attack.selectSeries(this.value)">${c.matches.map(([name,tasks])=>`<option value="${E(name)}" ${name===c.family?'selected':''}>${E(name)} · ${tasks.length} 次演练</option>`).join('')||'<option>没有匹配的系列</option>'}</select></div>${c.family?`<section class="series-family-header"><div><span>当前系列</span><h2>${E(c.family)}</h2></div><div><b>${versionGroups(c.tasks).length}</b> 个版本<span>·</span><b>${c.tasks.length}</b> 次演练</div></section><section class="series-version-browser"><div class="series-filter-row"><h3>版本与演练</h3><div><select aria-label="筛选模型版本" onchange="App.attack.filterSeries('version',this.value)"><option value="all">全部版本</option>${c.versions.map(row=>`<option value="${E(row.name)}" ${row.name===s.version?'selected':''}>${E(row.name)}</option>`).join('')}</select><select aria-label="筛选任务状态" onchange="App.attack.filterSeries('status',this.value)">${[['all','全部状态'],['done','已完成'],['running','进行中'],['paused','已暂停'],['stopped','已结束']].map(([id,name])=>`<option value="${id}" ${s.status===id?'selected':''}>${name}</option>`).join('')}</select>${s.version!=='all'||s.status!=='all'?'<button class="link-btn" onclick="App.attack.resetSeriesFilters()">重置</button>':''}</div></div><div class="series-version-grid">${c.rows.map(row=>versionTile(row,selected.includes(row.name))).join('')||'<div class="empty">当前筛选没有演练记录</div>'}</div></section><section class="series-comparison"><header><h3>${s.runChoices?'同版本演练对比':'版本结果对比'}</h3><div>${s.runChoices?'<button class="link-btn" onclick="App.attack.resetSeriesFilters()">返回版本对比</button>':''}<span>已选 ${compared.length} ${s.runChoices?'次演练':'个版本'}</span></div></header>${compared.length?`<div class="series-compare-grid" style="--compare-columns:${compared.length}">${compared.map(comparisonCard).join('')}</div>${configuration(compared)}`:'<div class="card empty">选择上方版本，查看并对比演练结果</div>'}</section>`:'<div class="card empty">没有找到匹配的模型或系列</div>'}</div>`;
};
const overview=X.overview;
X.overview=function(){if(X.tab==='series')return A.heading('','版本管理','')+X.seriesHTML();return overview.apply(this,arguments);};
})();
