/* Task-local, read-only attack snapshots. A judge result never implies a guard action. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,M=X.methodDependencies;
const states=new Map();
const resultLabel=r=>({breach:'已攻破',defended:'未攻破',error:'执行异常',pending:'待判定'}[r]||'未记录');
const args=v=>E(JSON.stringify(String(v)));
const finished=u=>['breach','defended','error'].includes(u.result);
function state(t){
  let s=states.get(t.id);if(!s){s={unitId:t.units[0]?.id,roundKey:null};states.set(t.id,s);}
  if(!t.units.some(u=>u.id===s.unitId)){s.unitId=t.units[0]?.id;s.roundKey=null;}
  return s;
}
function rounds(u){
  const history=(u.roundHistory||[]).filter(r=>Number.isFinite(Number(r.round))).map(r=>({...r,key:'round-'+r.round,recorded:true}));
  if(!finished(u)&&u.events?.length){
    const round=u.currentRound||u.events.at(-1)?.round||1;
    if(!history.some(r=>Number(r.round)===round))history.push({key:'round-'+round,round,prompt:u.attackPrompt,rawResponse:u.rawResponse,response:u.response,verdict:u.verdict,blueBlocked:u.blueBlocked,blueEvidence:u.blueEvidence||[],result:'pending',phase:u.events.at(-1)?.phase,current:true});
  }
  if(!history.length)history.push({key:'summary',round:null,prompt:u.attackPrompt,rawResponse:u.rawResponse,response:u.response,verdict:u.verdict,blueBlocked:u.blueBlocked,blueEvidence:u.blueEvidence||[],result:u.result,summary:true});
  return history.sort((a,b)=>(a.round||0)-(b.round||0));
}
function guard(t,r,node){
  if(node==='output'&&r.blueBlocked==='input')return {label:'已跳过',tone:'muted',reason:'输入层已拦截，未调用靶标或输出护栏'};
  const evidence=(r.blueEvidence||[]).filter(e=>e.node===node).at(-1);
  if(r.blueBlocked===node||evidence?.action==='拦截')return {label:node==='input'?'输入层防住':'输出层防住',tone:'safe',active:true,reason:evidence?.reason||'记录显示该层已拦截'};
  if(evidence)return {label:evidence.action||'已执行',tone:'checked',active:true,reason:evidence.reason||'未记录详细理由'};
  const d=t.defense,enabled=d?.mode==='guard'&&(d.guardType==='rules'?d.rules?.[node]:d[node==='input'?'modelInput':'modelOutput']);
  if(!enabled)return {label:'未配置',tone:'muted',reason:'本任务未配置该层独立护栏'};
  return {label:r.result==='pending'?'待执行':'未记录',tone:'muted',reason:r.result==='pending'?'尚无该层处理记录':'该记录未保存此层防护证据，无法判断'};
}
X.snapshotData=function(t){
  const selection=state(t),index=t.units.findIndex(u=>u.id===selection.unitId),unit=t.units[index];
  if(!unit)return {selection,index:-1,unit:null,rounds:[]};
  const list=rounds(unit),round=list.find(r=>r.key===selection.roundKey)||list.at(-1);selection.roundKey=round.key;
  const input=guard(t,round,'input'),output=guard(t,round,'output');
  return {selection,index,unit,rounds:list,round,input,output,multi:!!M[unit.method]?.process||unit.rounds>1};
};
function role(css,title,name,detail,active=false){return `<div class="flow-group ${css} ${active?'active':''}"><div class="snapshot-role"><div class="flow-group-top"><small>${title}</small><i></i></div><strong>${E(name)}</strong><em>${E(detail)}</em></div></div>`;}
function stage(name,index,value){return `<div class="snapshot-stage ${value.tone||'muted'} ${value.active?'highlighted':''}"><span><i>${index}</i>${name}</span><strong>${E(value.label)}</strong><small>${E(value.reason||'')}</small></div>`;}
function content(t,data){
  const {unit:u,round:r,input,output,multi}=data;
  if(!u)return `<div class="snapshot-empty"><strong>暂无攻击记录</strong><p>任务产生攻击记录后，可在这里按编号查看快照。</p></div>`;
  const method=M[u.method]?.label||u.method,question=t.bankSnapshot?.items?.find(q=>q.id===u.questionId),verdict=resultLabel(r.result);
  const judge={label:verdict,tone:r.result==='breach'?'risk':r.result==='defended'?'safe':r.result==='error'?'warning':'muted',active:['breach','defended','error'].includes(r.result),reason:r.verdict||(r.result==='error'?'不计入有效判定':r.result==='pending'?'本轮尚未产生裁判结论':'仅记录结果，未保存裁判理由')};
  const guardSummary=r.blueBlocked==='input'?'输入层防住':r.blueBlocked==='output'?'输出层防住':input.active||output.active?'查看各层处理结果':t.defense?.mode==='guard'?'暂无可定位的拦截证据':'未配置独立输入 / 输出护栏';
  const rawPrompt=r.prompt||(r.summary&&finished(u)?question?.prompt:'')||'尚无本轮攻击输入记录';
  const delivered=r.response||(r.summary&&finished(u)?X.unitContent(t,u).response:'')||(r.result==='pending'?'等待本轮执行':'未保存最终判定对象');
  const evidence=(r.blueEvidence||[]).map(e=>`${e.node==='input'?'输入层':e.node==='output'?'输出层':'系统指令'} · ${e.action}：${e.reason||'未记录理由'}`).join('\n');
  const topology=`<div class="snapshot-topology coordinated-flow">
    ${role('node-attack red','红队',M[u.method]?.gen?t.engine?.roles?.attacker?.name||t.engine?.attacker||'攻击生成':'本地模板 / 变换',method)}
    <span class="major-arrow attack"><b>→</b><small>攻击输入</small></span>
    ${role('node-target target','靶标',X.targetFor(t).name,r.blueBlocked==='input'?'输入已拦截 · 未调用':'被测模型')}
    <span class="major-arrow evidence"><b>→</b><small>判定证据</small></span>
    ${role('node-judge judge','裁判',t.engine?.roles?.judge?.name||t.engine?.judge||'未配置',verdict,judge.active)}
    <div class="blue-target-link"><span>↑</span><small>防护靶标</small></div>
    ${role('node-blue blue','蓝队',X.blueLabel(t.defense),guardSummary,input.active||output.active)}
  </div>`;
  return `<article class="attack-internal-flow snapshot-card" aria-label="所选攻击快照"><div id="snapshot-card-detail">
    <header class="snapshot-card-head"><div><span class="mono snapshot-id">${E(u.id)}</span><strong>${E(method)}</strong>${r.summary&&finished(u)?'<small>最终记录</small>':''}</div>
    ${multi&&data.rounds.some(row=>row.round)?`<label>轮次 <select aria-label="选择快照轮次" data-task="${E(t.id)}" onchange="App.attack.selectSnapshotRound(this.dataset.task,this.value)">${data.rounds.map(row=>`<option value="${E(row.key)}" ${row.key===r.key?'selected':''}>第 ${row.round} 轮 · ${resultLabel(row.result)}</option>`).join('')}</select></label>`:`<small>${multi?finished(u)?'多轮攻击 · 逐轮明细未保存':'多轮攻击 · 尚无已完成轮次':'单轮攻击'}</small>`}</header>
    <div class="snapshot-stage-track">
      ${stage('攻击生成',1,{label:r.prompt||r.summary&&finished(u)?'已生成':'等待生成',tone:'muted',reason:method})}
      ${stage('输入防护',2,input)}
      ${stage('靶标响应',3,{label:r.blueBlocked==='input'?'未调用':r.rawResponse||r.response?'已响应':r.summary&&finished(u)?'查看最终记录':'等待响应',tone:'muted',reason:r.blueBlocked==='input'?'输入已拦截':X.targetFor(t).name})}
      ${stage('输出防护',4,output)}
      ${stage('裁判判定',5,judge)}
    </div>
    ${r.summary&&multi&&finished(u)?'<p class="snapshot-gap">该旧记录未保存逐轮明细，仅展示最终记录；无法还原未记录的轮次。</p>':''}
    <div class="snapshot-question"><span>攻击题目</span><p>${E(question?.prompt||u.seedPrompt||'原始题目未保存在任务快照中')}</p></div>
    <details class="snapshot-evidence"><summary>查看${r.summary?'该记录':'本轮'}证据</summary><div><h4>实际攻击输入</h4><pre>${E(rawPrompt)}</pre><h4>最终判定对象</h4><pre>${E(delivered)}</pre>${evidence?`<h4>防护处理记录</h4><pre>${E(evidence)}</pre>`:''}<h4>裁判依据</h4><pre>${E(judge.reason)}</pre></div></details>
    <footer>${finished(u)?`<button class="link-btn" onclick="App.attack.sample(${args(u.id)})">查看完整记录 →</button>`:''}</footer>
  </div>${sliderHTML(t,data)}</article>${topology}`;
}
function refresh(t){
  const data=X.snapshotData(t),container=document.getElementById('task-snapshot-content');
  if(container){
    const detail=container.querySelector('#snapshot-card-detail');
    if(detail&&data.unit){
      const template=document.createElement('template');template.innerHTML=content(t,data);
      detail.innerHTML=template.content.querySelector('#snapshot-card-detail').innerHTML;
      container.querySelector('.snapshot-topology').replaceWith(template.content.querySelector('.snapshot-topology'));
    }else container.innerHTML=content(t,data);
  }
  const range=document.getElementById('task-snapshot-range'),select=document.getElementById('task-snapshot-select'),position=document.getElementById('task-snapshot-position');
  if(range){range.value=String(Math.max(0,data.index));range.setAttribute('aria-valuetext',`${data.unit?.id||'无记录'}，第 ${data.index+1} 条，共 ${t.units.length} 条`);}
  if(select)select.value=String(data.index);
  if(position)position.textContent=`${data.index+1} / ${t.units.length}`;
  const prev=document.getElementById('task-snapshot-prev'),next=document.getElementById('task-snapshot-next');if(prev)prev.disabled=data.index<=0;if(next)next.disabled=data.index>=t.units.length-1;
}
X.selectSnapshot=function(taskId,index){const t=X.task;if(!t||t.id!==taskId)return;const value=Number(index);if(!Number.isFinite(value))return;const s=state(t),unit=t.units[Math.max(0,Math.min(t.units.length-1,Math.round(value)))];if(!unit)return;s.unitId=unit.id;s.roundKey=null;refresh(t);};
X.stepSnapshot=function(taskId,step){const t=X.task;if(t?.id===taskId)X.selectSnapshot(taskId,X.snapshotData(t).index+step);};
X.selectSnapshotRound=function(taskId,key){const t=X.task;if(t?.id!==taskId)return;const data=X.snapshotData(t);if(!data.rounds.some(row=>row.key===key))return;data.selection.roundKey=key;refresh(t);document.querySelector('[aria-label="选择快照轮次"]')?.focus();};
function sliderHTML(t,data){
  const index=Math.max(0,data.index),count=t.units.length;
  return `<div class="snapshot-slider-row"><button id="task-snapshot-prev" class="btn small" aria-label="上一条攻击快照" ${index===0?'disabled':''} data-task="${E(t.id)}" onclick="App.attack.stepSnapshot(this.dataset.task,-1)">←</button><input id="task-snapshot-range" aria-label="攻击快照时间轴" type="range" min="0" max="${Math.max(0,count-1)}" step="1" value="${index}" ${count===1?'disabled':''} aria-valuetext="${E(data.unit.id)}，第 ${index+1} 条，共 ${count} 条" data-task="${E(t.id)}" oninput="App.attack.selectSnapshot(this.dataset.task,this.value)"><span id="task-snapshot-position" aria-live="polite">${index+1} / ${count}</span><button id="task-snapshot-next" class="btn small" aria-label="下一条攻击快照" ${index>=count-1?'disabled':''} data-task="${E(t.id)}" onclick="App.attack.stepSnapshot(this.dataset.task,1)">→</button></div>`;
}
X.taskBoardHTML=function(t){
  return `<section class="battle-board coordinated is-frozen attack-snapshots" aria-label="任务攻击快照"><header class="snapshot-heading"><h3>攻击快照</h3></header><div id="task-snapshot-content" class="snapshot-content">${content(t,X.snapshotData(t))}</div></section>`;
};
})();
