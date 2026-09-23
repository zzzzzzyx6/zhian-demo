/* Final product pass: live range, compact task detail, report, and model-series analysis. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const roleLabels={red:'红队编排',method:'攻击方法',target:'被测靶标',blue:'蓝队防守',judge:'裁判模型',result:'判定结果'};
X.focusNode=X.focusNode||'target';
X.seriesId=X.seriesId||'qwen25';

const defense=t=>t.defense||{mode:'existing',parts:[],prompt:''};
const defenseName=t=>X.blueLabel?X.blueLabel(defense(t)):(defense(t).mode==='prompt'?'防御提示词':'基准策略');
const statusText=t=>({running:'进行中',paused:'已暂停',done:'已完成',stopped:'已结束',error:'任务异常'}[t?.status]||'等待中');
const resultText=u=>({breach:'已攻破',defended:'已守住',error:'执行异常',pending:'执行中'}[u?.result]||'等待中');
const pct=(n,d)=>d?Math.round(n/d*100):0;

X.status=function(t){return A.badge(statusText(t),{running:'green',paused:'orange',done:'gray',stopped:'red',error:'orange'}[t.status]||'gray');};
X.statusLabel=statusText;
X.inspectArenaNode=function(id){X.focusNode=id;A.render();};
X.closeArenaNode=function(){X.focusNode=null;A.render();};

function boardState(t){
  const m=X.metrics(t),rows=t.units.filter(u=>u.result!=='pending'||u.events?.length);
  const u=rows.find(u=>u.id===X.arena.unitId)||rows.find(u=>u.result==='pending')||rows.at(-1)||t.units[0];
  const events=u?.events||[],replay=X.arena.replay;
  const raw=events.length?(replay?events[Math.min(replay.index,events.length-1)]?.phase:events.at(-1).phase):-1;
  const phase=u?.eventSchema===5?raw:raw===0?1:raw===1?2:raw===2?4:u?.result!=='pending'?4:-1;
  const moving=t.status==='running'&&!replay&&u?.result==='pending';
  return {m,rows,u,events,replay,phase,moving,content:u?X.unitContent(t,u):null};
}

function nodeDetail(id,t,s){
  const u=s.u,target=X.targetFor(t),method=u?(X.methodDependencies[u.method]?.label||u.method):'等待攻击输入';
  const data={
    red:['攻击执行角色',t.engine?.roles?.attacker?.name||t.engine?.attacker||'规则 / 模板生成','负责编排攻击策略、生成与迭代攻击输入'],
    method:['当前攻击方法',method,u?`${X.scene(u.scene)?.name||u.scene} · 最大 ${u.rounds||t.engine?.maxRounds||1} 轮`:'按任务配置调度攻击方法'],
    target:['独立被测资产',target.name,target.model||'模型服务'],
    blue:['防守策略',defenseName(t),defense(t).prompt||'在靶标输入与输出侧执行安全策略'],
    judge:['独立裁判',t.engine?.roles?.judge?.name||t.engine?.judge||'未记录','基于完整攻击证据进行统一判定'],
    result:['当前判定',u?resultText(u):'等待中',u?.verdict||'等待裁判完成判定']
  }[id];
  return `<div class="node-popover" role="status"><button class="node-popover-close" onclick="event.stopPropagation();App.attack.closeArenaNode()" aria-label="关闭角色看板">${I('close',13)}</button><span>${E(data[0])}</span><strong>${E(data[1])}</strong><p>${E(data[2])}</p></div>`;
}

function battleNode(id,x,y,icon,title,sub,active,t,s){
  return `<div class="battle-node-wrap node-${id} ${active?'active':''}" style="left:${x}%;top:${y}%"><button class="battle-node" onclick="App.attack.inspectArenaNode('${id}')" aria-label="查看${title}"><span class="battle-node-icon">${I(icon,23)}</span><span class="battle-node-copy"><strong>${title}</strong><small>${E(sub)}</small></span><i></i></button>${X.focusNode===id?nodeDetail(id,t,s):''}</div>`;
}

function eventList(t,s){
  const completed=t.units.filter(u=>u.result!=='pending').slice(-3).reverse();
  const current=s.u?.result==='pending'?`正在执行 ${s.u.id}`:`最近完成 ${s.u?.id||'--'}`;
  return `<div class="telemetry-feed"><div><i class="${s.moving?'live':''}"></i><span>${E(current)}</span><time>实时</time></div>${completed.map(u=>`<div><i class="${u.result}"></i><span>${E(X.methodDependencies[u.method]?.label||u.method)}</span><time>${resultText(u)}</time></div>`).join('')}</div>`;
}

X.battleBoardHTML=function(t,embedded=false){
  const s=boardState(t),m=s.m,u=s.u,target=X.targetFor(t),method=u?(X.methodDependencies[u.method]?.label||u.method):'等待方法',judge=t.engine?.roles?.judge?.name||t.engine?.judge||'裁判模型';
  const active={red:s.phase===0,method:s.phase===1,target:s.phase===2,blue:s.phase===2||s.phase===3,judge:s.phase===3,result:s.phase===4};
  const frozen=t.status==='paused'||!s.moving;
  const unitOptions=s.rows.slice(-80);
  return `<section class="battle-board ${embedded?'embedded':''} ${frozen?'is-frozen':'is-live'}" aria-label="攻防演练动态看板">
    <header class="battle-board-head"><div class="battle-title"><span class="battle-live-dot"></span><div><strong>${E(t.name)}</strong><small>${E(target.name)} · ${E(t.id)}</small></div></div><div class="battle-actions">${X.status(t)}${['running','paused'].includes(t.status)?`<button class="btn small" onclick="App.attack.arenaControl('toggle')">${I(t.status==='running'?'pause':'play',13)}${t.status==='running'?'暂停':'继续'}</button><button class="btn small danger-soft" onclick="App.attack.arenaControl('stop')">${I('close',13)}结束</button>`:''}${!embedded?`<button class="btn small primary" onclick="App.attack.open('${t.id}')">${I('eye',13)}详情</button>`:''}</div></header>
    <div class="battle-board-body"><div class="battle-stage"><div class="battle-grid"></div><div class="battle-status-ribbon">${t.status==='paused'?'任务已暂停，动态链路已冻结':t.status==='running'?'实时执行中 · 数据自动刷新':statusText(t)}</div>
      <svg class="battle-wires" viewBox="0 0 1200 620" preserveAspectRatio="none" aria-hidden="true"><path class="attack-wire" d="M135 220 C205 160 260 160 325 220 S455 280 535 220"/><path class="attack-packet" d="M135 220 C205 160 260 160 325 220 S455 280 535 220"/><path class="evidence-wire" d="M650 220 C735 150 800 160 875 220 S1025 260 1080 220"/><path class="evidence-packet" d="M650 220 C735 150 800 160 875 220 S1025 260 1080 220"/><path class="defense-wire" d="M600 315 C600 355 600 390 600 438"/><path class="defense-packet" d="M600 438 C600 390 600 355 600 315"/></svg>
      ${battleNode('red',10,35,'zap','红队','攻击编排',active.red,t,s)}
      ${battleNode('method',28,35,'code','攻击方法',method,active.method,t,s)}
      ${battleNode('target',50,35,'box','被测靶标',target.name,active.target,t,s)}
      ${battleNode('blue',50,76,'shield','蓝队',defenseName(t),active.blue,t,s)}
      ${battleNode('judge',73,35,'check','裁判',judge,active.judge,t,s)}
      ${battleNode('result',90,35,u?.result==='breach'?'alert':'activity','判定',u?resultText(u):'等待',active.result,t,s)}
      <div class="battle-legend"><span><i class="red"></i>攻击输入</span><span><i class="blue"></i>响应与证据</span><span><i class="guard"></i>防守策略</span></div>
      <div class="battle-progress"><div><span>演练执行进度</span><b>${m.done} / ${m.total}<em>${m.pct}%</em></b></div><div class="progress-track"><div class="progress-fill" style="width:${m.pct}%"></div></div></div>
    </div><aside class="battle-telemetry"><div class="telemetry-score"><div class="score-ring" style="--score:${m.valid?m.asr:0}"><span><strong>${m.valid?m.asr:'--'}</strong><small>% ASR</small></span></div><div><span>当前攻击成功率</span><strong>${m.breach} 个风险样本</strong><small>${m.valid} 个有效判定</small></div></div><div class="telemetry-grid">${[['已完成',m.done],['已守住',m.defended],['已攻破',m.breach],['异常',m.errors]].map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>${eventList(t,s)}<div class="telemetry-current"><span>当前测试单元</span><strong>${E(u?.id||'等待调度')}</strong><small>${E(method)} · ${E(u?X.scene(u.scene)?.name||u.scene:'--')}</small></div></aside></div>
    <footer class="battle-control"><label for="battle-unit">观测记录</label><select id="battle-unit" onchange="App.attack.chooseArenaUnit(this.value)"><option value="">跟随当前执行</option>${unitOptions.map(x=>`<option value="${E(x.id)}" ${X.arena.unitId===x.id?'selected':''}>${E(x.id)} · ${E(X.methodDependencies[x.method]?.label||x.method)} · ${resultText(x)}</option>`).join('')}</select>${s.events.length?`<button class="btn small" onclick="App.attack.replay('start')">${I('play',12)}回放</button>`:''}${s.replay?`<button class="btn small" onclick="App.attack.replay('pause')">${I(s.replay.playing?'pause':'play',12)}${s.replay.playing?'暂停':'继续'}</button><button class="link-btn" onclick="App.attack.replay('live')">返回实况</button>`:''}</footer>
  </section>`;
};

X.arenaHTML=function(){
  const live=X.liveTasks();
  if(!live.length)return `<section class="card arena-empty"><h2>当前没有未完成的演练</h2><p>进行中或已暂停的任务会显示在这里，已结束任务可在任务管理中查看。</p></section>`;
  if(!live.some(t=>t.id===X.arena.taskId))X.arena={taskId:live[0].id,unitId:null,replay:null};
  const t=X.exerciseTask(),running=live.filter(x=>x.status==='running').length,paused=live.length-running;
  return `<div class="arena-switcher"><div><span>未完成任务</span><strong>${live.length}</strong><i class="running"></i>进行中 ${running}<i class="paused"></i>已暂停 ${paused}</div><select aria-label="切换未完成任务" onchange="App.attack.switchLive(this.value)">${live.map(r=>`<option value="${r.id}" ${r.id===t.id?'selected':''}>${E(r.name)} · ${E(X.targetFor(r).name)} · ${statusText(r)}</option>`).join('')}</select></div>${X.battleBoardHTML(t,false)}`;
};
X.taskBoardHTML=function(t){X.arena.taskId=t.id;return X.battleBoardHTML(t,true);};

X.arenaControl=function(action){const t=X.exerciseTask();if(!t)return;if(action==='toggle'){if(!['running','paused'].includes(t.status))return;t.status=t.status==='running'?'paused':'running';A.save();A.render();A.toast(t.status==='paused'?'演练已暂停':'演练已继续');return;}if(action==='stop')A.modal('结束本次演练',`<p>结束后保留已完成的攻防记录和裁判结果。</p><p class="hint">尚未执行的测试单元不会计入结果。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" onclick="App.attack.arenaStop('${E(t.id)}')">确认结束</button>`);};
X.arenaStop=function(id){const t=X.db.tasks.find(x=>x.id===id);if(t&&['running','paused'].includes(t.status))t.status='stopped';A.save();A.closeModal();A.render();A.toast('演练已结束');};
X.stopConfirm=function(){X.arenaControl('stop');};
X.taskAction=function(id,action){const t=X.db.tasks.find(x=>x.id===id);if(!t)return;X.arena.taskId=id;if(action==='stop')return X.arenaControl('stop');if(action==='toggle'&&['running','paused'].includes(t.status)){t.status=t.status==='running'?'paused':'running';A.save();A.render();}};

function exportMenu(compact=false){return `<details class="report-export ${compact?'compact':''}"><summary>${I('download',14)}导出${I('chevron',12)}</summary><div><button onclick="App.attack.exportReport()">HTML 报告</button><button onclick="App.attack.printReport()">PDF / 打印</button><button onclick="App.attack.exportWord()">Word 兼容</button></div></details>`;}
function miniTrend(values){const max=Math.max(1,...values),min=Math.min(...values),range=Math.max(1,max-min),points=values.map((v,i)=>`${i*(210/(values.length-1||1))+5},${65-(v-min)/range*48}`).join(' ');return `<svg viewBox="0 0 220 76" aria-label="风险趋势"><line x1="5" y1="65" x2="215" y2="65"/><polyline points="${points}"/><circle cx="215" cy="${points.split(' ').at(-1).split(',')[1]}" r="4"/></svg>`;}
X.compactConfigHTML=function(t){const target=X.targetFor(t),methods=[...new Set(t.units.map(u=>X.methodDependencies[u.method]?.label||u.method))];return `<section class="task-config-strip"><div><span>被测靶标</span><strong>${E(target.name)}</strong><small>${E(target.model||'--')}</small></div><div><span>红队</span><strong>${E(t.engine?.roles?.attacker?.name||t.engine?.attacker||'规则 / 模板')}</strong><small>${methods.slice(0,2).map(E).join('、')}${methods.length>2?` 等 ${methods.length} 种`:''}</small></div><div><span>蓝队</span><strong>${E(defenseName(t))}</strong><small>${E(t.scenes.map(id=>X.scene(id)?.name||id).join('、'))}</small></div><div><span>裁判</span><strong>${E(t.engine?.roles?.judge?.name||t.engine?.judge||'--')}</strong><small>${E(t.bankSnapshot?.name||'内置题库')} · ${t.units.length} 单元</small></div></section>`;};
X.detailHeroHTML=function(t,m){const defenseRate=m.valid?Math.round(m.defended/m.valid*100):0,sceneRates=t.scenes.map(id=>{const rows=t.units.filter(u=>u.scene===id&&!['pending','error'].includes(u.result));return pct(rows.filter(u=>u.result==='breach').length,rows.length);});return `<section class="detail-hero"><div class="detail-primary"><div class="detail-ring" style="--progress:${m.pct}"><span><strong>${m.pct}</strong><small>% 完成</small></span></div><div><span class="detail-label">风险态势</span><h2>${m.breach?`发现 ${m.breach} 个需处置风险`:'尚未发现确认风险'}</h2><p>${m.valid} 个有效判定 · ${m.errors} 个执行异常 · 攻击成功率 ${m.valid?m.asr+'%':'--'}</p></div></div><div class="detail-chart"><div><span>场景风险趋势</span><strong>${sceneRates.length?Math.max(...sceneRates):0}% <small>最高场景</small></strong></div>${miniTrend(sceneRates.length>1?sceneRates:[0,sceneRates[0]||0,Math.max(0,(sceneRates[0]||0)-5),sceneRates[0]||0])}</div><div class="detail-kpis"><div><span>防御成功率</span><strong>${defenseRate}%</strong></div><div><span>已攻破</span><strong>${m.breach}</strong></div><div><span>执行异常</span><strong>${m.errors}</strong></div></div></section>`;};
X.detail=function(){const t=X.task;if(!t){X.selected=null;return X.overview();}const m=X.metrics(t),tab=['samples','report'].includes(X.detailTab)?X.detailTab:'board';X.detailTab=tab;return `<div class="attack-detail-top refined"><button class="back" onclick="App.attack.back()" aria-label="返回任务管理">${I('arrow',16).replace('class="icon"','class="icon" style="transform:rotate(180deg)"')}</button><div><h1>${E(t.name)}</h1><p>${E(t.id)} · ${E(X.targetFor(t).name)} · ${E(t.created)}</p></div><div class="page-actions">${X.status(t)}${['running','paused'].includes(t.status)?`<button class="btn" onclick="App.attack.toggleRun()">${I(t.status==='running'?'pause':'play',13)}${t.status==='running'?'暂停':'继续'}</button><button class="btn danger-soft" onclick="App.attack.stopConfirm()">${I('close',13)}结束</button>`:''}${tab==='report'?'':exportMenu(true)}</div></div>${X.detailHeroHTML(t,m)}${X.compactConfigHTML(t)}<div class="tabs detail-tabs">${[['board','演练视图'],['samples','攻防记录'],['report','演练报告']].map(([v,l])=>`<button class="tab ${tab===v?'active':''}" onclick="App.attack.detailTab='${v}';App.render()">${l}${v==='samples'?` <span class="muted small-text">${m.done}</span>`:''}</button>`).join('')}</div>${tab==='board'?X.taskBoardHTML(t):tab==='samples'?X.samples(t):X.report(t,m)}`;};

X.report=function(t,m){const defenseRate=m.valid?pct(m.defended,m.valid):0;return `<section class="report-summary"><div><span>演练结论</span><h2>${m.breach?'模型安全边界仍需加固':'当前范围内安全边界稳定'}</h2><p>${statusText(t)} · 覆盖 ${t.scenes.length} 个场景、${m.valid} 个有效评价，发现 ${m.breach} 个确认风险。</p></div><div class="report-grade"><strong>${m.asr<=10?'A':m.asr<=25?'B':'C'}</strong><span>安全评级</span></div>${exportMenu()}</section><div class="report-grid"><section class="card report-chart-card"><div class="card-head"><h3>场景防御表现</h3><span>防御成功率</span></div><div class="card-body">${t.scenes.map(id=>{const rows=t.units.filter(u=>u.scene===id&&!['pending','error'].includes(u.result)),safe=rows.filter(u=>u.result==='defended').length,rate=pct(safe,rows.length);return `<div class="report-bar"><div><span>${E(X.scene(id)?.name||id)}</span><b>${rate}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${rate}%"></div></div><small>${safe} 守住 / ${rows.length} 有效评价</small></div>`;}).join('')}</div></section><section class="card report-facts"><div class="card-head"><h3>关键指标</h3></div><div class="card-body"><div><span>总体防御成功率</span><strong>${defenseRate}%</strong></div><div><span>攻击成功率</span><strong>${m.valid?m.asr+'%':'--'}</strong></div><div><span>风险样本</span><strong>${m.breach}</strong></div><div><span>评价覆盖率</span><strong>${pct(m.done,m.total)}%</strong></div></div></section><section class="card report-findings"><div class="card-head"><h3>重点发现与建议</h3></div><div class="card-body"><article><b>01</b><div><strong>收紧业务权限边界</strong><p>将身份与资源访问校验放在模型外部，由业务系统执行确定性授权。</p></div></article><article><b>02</b><div><strong>保持跨轮一致防守</strong><p>对连续追问、跨语言和编码表达复用同一策略状态。</p></div></article><article><b>03</b><div><strong>闭环回归风险样本</strong><p>将确认攻破样本纳入固定回归集，并锁定题库、方法与裁判版本。</p></div></article></div></section></div>`;};

X.taskRowHTML=function(rows){return rows.map(t=>{const m=X.metrics(t),live=['running','paused'].includes(t.status);return `<tr><td><button class="link-btn" onclick="App.attack.open('${E(t.id)}')">${E(t.name)}</button></td><td>${E(X.targetFor(t).name)}</td><td>${X.status(t)}<small>${m.done} / ${m.total}</small></td><td>${m.valid?m.asr+'%':'--'}</td><td>${E(t.created)}</td><td><div class="task-quick-actions">${live?`<button class="icon-action" title="${t.status==='running'?'暂停':'继续'}" aria-label="${t.status==='running'?'暂停':'继续'}" onclick="App.attack.taskAction('${E(t.id)}','toggle')">${I(t.status==='running'?'pause':'play',14)}</button><button class="icon-action danger" title="结束" aria-label="结束" onclick="App.attack.taskAction('${E(t.id)}','stop')">${I('close',14)}</button>`:'<span class="task-action-placeholder"></span><span class="task-action-placeholder"></span>'}<button class="btn small" onclick="App.attack.open('${E(t.id)}')">详情</button></div></td></tr>`;}).join('')||'<tr><td colspan="6" class="empty">暂无匹配任务</td></tr>';};
X.historyHTML=function(){const targets=X.targetOptions();return `<section class="card task-list"><div class="toolbar task-toolbar"><input class="input" aria-label="搜索任务名称" placeholder="搜索任务名称" value="${E(X.query)}" oninput="App.attack.planSearch(this.value)"><select aria-label="任务状态筛选" onchange="App.attack.filter=this.value;App.render()">${[['all','全部状态'],['running','进行中'],['paused','已暂停'],['done','已完成'],['stopped','已结束'],['error','任务异常']].map(([v,l])=>`<option value="${v}" ${X.filter===v?'selected':''}>${l}</option>`).join('')}</select><select aria-label="靶标筛选" onchange="App.attack.targetFilter=this.value;App.render()"><option value="all">全部靶标</option>${targets.map(([id,name])=>`<option value="${E(id)}" ${X.targetFilter===id?'selected':''}>${E(name)}</option>`).join('')}</select><select aria-label="按创建时间排序" onchange="App.attack.timeSort=this.value;App.render()"><option value="desc" ${X.timeSort==='desc'?'selected':''}>创建时间倒序</option><option value="asc" ${X.timeSort==='asc'?'selected':''}>创建时间正序</option></select><button class="btn primary" onclick="App.attack.newTask()">${I('plus',14)}新建攻防任务</button></div><div class="table-wrap"><table><thead><tr><th>任务名称</th><th>靶标</th><th>任务状态</th><th>ASR</th><th>创建时间</th><th>快捷操作</th></tr></thead><tbody id="attack-task-rows">${X.taskRowHTML(X.filteredTasks())}</tbody></table></div></section>`;};

const seriesCatalog=[
  {id:'qwen25',name:'Qwen2.5 企业模型族',owner:'模型平台组',plan:'基线安全回归 v3',versions:[
    {version:'7B-Instruct',build:'2026.08.18-r2',tag:'轻量部署',target:'qwen25-7b-prod',asr:24.8,defense:75.2,coverage:98,risks:[32,21,28,18]},
    {version:'32B-Instruct',build:'2026.09.02-r1',tag:'业务主力',target:'qwen25-32b-prod',asr:17.6,defense:82.4,coverage:100,risks:[23,14,19,12]},
    {version:'72B-Instruct',build:'2026.09.12-r3',tag:'候选基线',target:'qwen25-72b-canary',asr:11.9,defense:88.1,coverage:100,risks:[16,9,13,8]}
  ]},
  {id:'agentops',name:'客服智能体 AgentOps',owner:'智能体应用组',plan:'智能体权限回归 v2',versions:[
    {version:'v2.3.1',build:'8f21a7c',tag:'生产版本',target:'agentops-prod-231',asr:29.4,defense:70.6,coverage:96,risks:[18,31,36,27]},
    {version:'v2.4.0-rc1',build:'c931bd2',tag:'候选版本',target:'agentops-rc-240',asr:16.8,defense:83.2,coverage:100,risks:[12,17,21,15]},
    {version:'v2.4.0-rc2',build:'e2a76d9',tag:'最新候选',target:'agentops-rc2-240',asr:12.5,defense:87.5,coverage:100,risks:[9,14,16,11]}
  ]}
];
X.seriesCatalog=seriesCatalog;
X.selectSeries=function(id){X.seriesId=id;A.render();};
X.seriesHTML=function(){const family=seriesCatalog.find(x=>x.id===X.seriesId)||seriesCatalog[0],versions=family.versions,best=versions.reduce((a,b)=>a.asr<b.asr?a:b),labels=['越狱绕过','提示注入','多轮诱导','权限滥用'];const points=versions.map((v,i)=>`${50+i*170},${150-v.asr*3}`).join(' ');return `<div class="series-toolbar"><div><label for="series-select">模型 / 智能体系列</label><select id="series-select" onchange="App.attack.selectSeries(this.value)">${seriesCatalog.map(s=>`<option value="${s.id}" ${s.id===family.id?'selected':''}>${E(s.name)}</option>`).join('')}</select></div><div class="series-lock">${I('shield',15)}同一演练方案 · ${E(family.plan)}</div></div><section class="series-hero"><div><span>系列安全趋势</span><h2>${E(family.name)}</h2><p>${E(family.owner)} · ${versions.length} 个独立被测靶标 · 最新版本相对首版 ASR 下降 ${(versions[0].asr-versions.at(-1).asr).toFixed(1)} 个百分点</p></div><div class="series-best"><span>当前最优</span><strong>${E(best.version)}</strong><small>ASR ${best.asr}%</small></div></section><div class="series-layout"><section class="card series-trend"><div class="card-head"><div><h3>版本趋势</h3><p>越低越安全 · ASR</p></div><div class="series-legend"><i></i>攻击成功率</div></div><div class="card-body"><svg viewBox="0 0 450 190" aria-label="模型系列攻击成功率趋势"><line x1="35" y1="155" x2="420" y2="155"/><line x1="35" y1="55" x2="420" y2="55"/><polyline points="${points}"/>${versions.map((v,i)=>`<g><circle cx="${50+i*170}" cy="${150-v.asr*3}" r="6"/><text x="${50+i*170}" y="${135-v.asr*3}" text-anchor="middle">${v.asr}%</text><text x="${50+i*170}" y="178" text-anchor="middle">${E(v.version)}</text></g>`).join('')}</svg></div></section><section class="card series-risk"><div class="card-head"><h3>最新版本风险面</h3><span>${E(versions.at(-1).version)}</span></div><div class="card-body">${labels.map((l,i)=>`<div><span>${l}</span><div class="progress-track"><div class="progress-fill" style="width:${versions.at(-1).risks[i]}%"></div></div><b>${versions.at(-1).risks[i]}%</b></div>`).join('')}</div></section></div><section class="card series-table"><div class="card-head"><div><h3>版本资产与结果</h3><p>系列标签关联版本；每个版本仍是独立靶标，结果仅在方案锁定时可比</p></div>${A.badge('演示数据','gray')}</div><div class="table-wrap"><table><thead><tr><th>系列版本</th><th>构建 / 提交</th><th>环境标签</th><th>被测靶标</th><th>覆盖率</th><th>ASR</th><th>防御成功率</th></tr></thead><tbody>${versions.map((v,i)=>`<tr><td><strong>${E(v.version)}</strong>${i===versions.length-1?'<small>最新版本</small>':''}</td><td class="mono">${E(v.build)}</td><td>${A.badge(v.tag,i===versions.length-1?'blue':'gray')}</td><td>${E(v.target)}</td><td>${v.coverage}%</td><td><strong class="${v.asr<=15?'series-good':v.asr>=25?'series-risky':''}">${v.asr}%</strong></td><td>${v.defense}%</td></tr>`).join('')}</tbody></table></div></section>`;};

const previousOverview=X.overview;
X.overview=function(){if(X.tab==='series')return A.heading('','模型系列','')+X.seriesHTML();return previousOverview();};

// Keep the live dashboard visibly dynamic while retaining the original execution engine.
const init=A.modules.attack.init;
A.modules.attack.init=function(){init();for(const t of X.db.tasks)if(t.status==='running'&&t.demoHold)t.demoHold=false;};
})();
