/* Coordinated range workflow, real task-linked model families, and concise task launch. */
(function(){
'use strict';
const A=window.App,X=A.attack,B=A.banks,C=A.connections,E=A.escape,I=A.icon,M=X.methodDependencies;
const copy=value=>JSON.parse(JSON.stringify(value));
const statusText=t=>({running:'进行中',paused:'已暂停',done:'已完成',stopped:'已结束',error:'任务异常'}[t?.status]||'等待中');
const resultText=u=>({breach:'已攻破',defended:'已守住',error:'执行异常',pending:'执行中'}[u?.result]||'等待中');
const resultTone=u=>u?.result==='breach'?'breach':u?.result==='defended'?'defended':u?.result==='error'?'error':'pending';
const selectedBanks=w=>(w.bankIds||[]).map(id=>B.get(id)).filter(Boolean);
const methodScene={Direct:'jailbreak',PAIR:'jailbreak',DeepInception:'jailbreak',CipherChat:'obfuscation',FlipAttack:'obfuscation'};

function modelIdentity(model){
  const previous=X.db.tasks?.filter(t=>t.model===model?.id&&t.targetMeta?.family&&t.targetMeta?.version).sort((a,b)=>String(b.created).localeCompare(String(a.created)))[0];
  if(previous)return {family:previous.targetMeta.family,version:previous.targetMeta.version};
  const raw=(model?.name||model?.model||'').trim();
  const qwen=raw.match(/^(Qwen\d+(?:\.\d+)?)[-_](.+)$/i);
  const deepseek=raw.match(/^(DeepSeek)[-_](.+)$/i);
  if(qwen)return {family:qwen[1],version:qwen[2]};
  if(deepseek)return {family:'DeepSeek',version:deepseek[2]};
  const release=raw.match(/^(.*?)[-_\s]+(v?\d[^\s]*)$/i);
  return {family:release?.[1]||raw,version:release?.[2]||''};
}
X.targetIdentity=modelIdentity;
function snapshot(id){const m=C.db.find(x=>x.id===id);return m?X.connectionSnapshot(m):null;}
function ensureReferenceModels(){
  if(X.db.referenceModelsVersion===1)return;
  const upsert=(id,data)=>{let model=C.db.find(m=>m.id===id);if(!model){model={id,kind:'model',schema:2,accessType:'api',hosting:'cloud',protocol:'openai',auth:'none',caps:['text','chat'],uses:['target','attacker','judge'],timeout:60,connectStatus:'ok',...data};C.db.push(model);}return model;};
  upsert('deepseek-v3',{name:'DeepSeek-V3.2',model:'deepseek-v3.2',vendor:'DeepSeek',endpoint:'https://api.deepseek.com',uses:['attacker']});
  upsert('deepseek-judge',{name:'GPT-4o mini',model:'gpt-4o-mini',vendor:'OpenAI',endpoint:'https://api.openai.com/v1',uses:['judge']});
  upsert('qwen25-7b',{name:'Qwen2.5-7B-Instruct',model:'Qwen2.5-7B-Instruct',vendor:'Qwen',endpoint:'https://model.example/qwen25-7b',uses:['target']});
  upsert('qwen25-32b',{name:'Qwen2.5-32B-Instruct',model:'Qwen2.5-32B-Instruct',vendor:'Qwen',endpoint:'https://model.example/qwen25-32b',uses:['target']});
  const main=C.db.find(m=>m.id==='m1');if(main&&main.name==='通用对话模型')Object.assign(main,{name:'Qwen2.5-72B-Instruct',model:'Qwen2.5-72B-Instruct',vendor:'Qwen',uses:['target'],connectStatus:'ok'});
  X.db.defaults={attacker:'deepseek-v3',judge:'deepseek-judge',...(X.db.defaults||{})};
  X.db.referenceModelsVersion=1;
}
function hydrateTask(task,targetId,identity){
  task.model=targetId;task.targetSnapshot=snapshot(targetId);task.targetMeta=identity;task.engine ||= {};task.engine.methods ||= [...new Set(task.units.map(u=>u.method))];task.engine.roles ||= {};
  const needsAttacker=task.engine.methods.some(id=>M[id]?.gen);task.engine.roles.attacker=needsAttacker?snapshot('deepseek-v3'):null;task.engine.attacker=needsAttacker?task.engine.roles.attacker.name:'本地模板 / 变换';task.engine.roles.judge=snapshot('deepseek-judge');task.engine.judge=task.engine.roles.judge.name;task.engine.reference={source:'OpenRT',attacker:task.engine.roles.attacker?.model||null,judge:task.engine.roles.judge.model,attackerTemperature:needsAttacker?1:null,judgeTemperature:0};
  task.defense ||= {mode:'existing',parts:[],prompt:''};
  task.engine.concurrency ||= 4;task.engine.maxRounds ||= 4;
  if(!task.bankSnapshot){const bank=B.db[0];task.bankSnapshot={id:bank.id,bankIds:[bank.id],name:bank.name,sources:[{id:bank.id,name:bank.name,count:bank.items.length}],items:copy(bank.items)};task.units.forEach((u,i)=>u.questionId=bank.items[i%bank.items.length].id);}
}
function coordinateData(){
  ensureReferenceModels();
  const configs={
    'EV-260920-101':['m1',{family:'Qwen2.5',version:'72B-Instruct'}],
    'EV-260919-077':['qwen25-32b',{family:'Qwen2.5',version:'32B-Instruct'}],
    'EV-260918-210':['m1',{family:'Qwen2.5',version:'72B-Instruct'}],
    'EV-260910-033':['qwen25-7b',{family:'Qwen2.5',version:'7B-Instruct'}]
  };
  const seeded=new Set(['EV-260916-001','EV-260914-003','EV-260920-101','EV-260919-077','EV-260918-210','EV-260917-088','EV-260915-044','EV-260910-033']);
  if(X.db.coordinatedTasksVersion!==2){X.db.tasks=X.db.tasks.filter(t=>!seeded.has(t.id)||configs[t.id]);X.db.coordinatedTasksVersion=2;}
  for(const task of X.db.tasks){
    const cfg=configs[task.id];
    if(cfg&&X.db.seriesTagsVersion!==1){
      hydrateTask(task,cfg[0],cfg[1]);
      const replacements={Crescendo:'PAIR',CoA:'PAIR',Multilingual:'CipherChat',PastTense:'FlipAttack'};
      task.units.forEach(u=>{u.method=replacements[u.method]||u.method;u.scene=methodScene[u.method]||u.scene;u.rounds=M[u.method]?.process?task.engine.maxRounds:1;});
      task.scenes=[...new Set(task.units.map(u=>u.scene))];task.engine.methods=[...new Set(task.units.map(u=>u.method))];
      task.engine.bindings=task.engine.methods.map(id=>({method:id,registry:X.methodInfo[id]?.[0],generator:M[id]?.gen?task.engine.roles.attacker?.id:null,judge:task.engine.roles.judge.id}));
    }
    else {
      const old=task.targetMeta||{},inferred=modelIdentity(X.targetFor(task));
      task.targetMeta={family:old.family||inferred.family,version:old.version||old.revision||old.variant||inferred.version};
    }
  }
  X.db.seriesTagsVersion=1;
  A.save();
}
const init=A.modules.attack.init;A.modules.attack.init=function(){init();coordinateData();X.focusNode=null;};

X.focusNode=null;
X.inspectArenaNode=function(id){X.focusNode=X.focusNode===id?null:id;A.render();};
const openTask=X.open;X.open=function(){X.focusNode=null;return openTask.apply(this,arguments);};
const showArena=X.showArena;X.showArena=function(){X.focusNode=null;return showArena.apply(this,arguments);};
X.switchLive=function(id){X.focusNode=null;X.arena={taskId:id,unitId:null,replay:null};A.render();};
X.workspaceTasks=function(){
  const unfinished=X.db.tasks.filter(t=>['running','paused'].includes(t.status)).sort((a,b)=>(a.status==='running'?-1:1)-(b.status==='running'?-1:1)||String(b.created).localeCompare(String(a.created)));
  if(unfinished.length)return unfinished;const recent=X.db.tasks.filter(t=>['done','stopped','error'].includes(t.status)).sort((a,b)=>String(b.finished||b.created).localeCompare(String(a.finished||a.created)))[0];return recent?[recent]:[];
};
X.exerciseTask=function(){const tasks=X.workspaceTasks();return X.db.tasks.find(t=>t.id===X.arena.taskId&&tasks.some(x=>x.id===t.id))||tasks[0]||null;};

function boardState(t){
  const m=X.metrics(t),pending=t.units.filter(u=>u.result==='pending'),completed=t.units.filter(u=>u.result!=='pending');
  const active=pending.find(u=>u.events?.length),latest=completed.slice().sort((a,b)=>String(b.finished||'').localeCompare(String(a.finished||''))||(b.index||0)-(a.index||0))[0];
  const unit=['running','paused'].includes(t.status)?active||pending[0]||latest:latest||t.units[0];
  const events=unit?.events||[],raw=events.length?events.at(-1).phase:-1,phase=unit?.eventSchema===5?raw:raw===0?1:raw===1?2:raw===2?4:unit?.result!=='pending'?4:-1;
  return {m,unit,phase,moving:t.status==='running'&&unit?.result==='pending',content:unit?X.unitContent(t,unit):null};
}
function detailPanel(id,t,s){
  if(X.focusNode!==id)return '';const u=s.unit,target=X.targetFor(t),method=M[u?.method]?.label||u?.method||'等待调度',meta=t.targetMeta;
  const data={
    attack:['红队攻击配置',M[u?.method]?.gen?t.engine?.roles?.attacker?.name||t.engine?.attacker:'本地模板 / 变换',`${method} · ${M[u?.method]?.note||'按任务配置生成攻击输入'}`],
    target:['被测靶标',target.name,meta?`系列 ${meta.family} · 版本 ${meta.version}`:target.model||''],
    blue:['蓝队防守配置',X.blueLabel(t.defense),t.defense?.mode==='guard'?`${t.defense.guardType==='model'?t.defense.model?.name||'模型护栏':'规则护栏'} · ${t.defense.guardType==='rules'?(t.defense.rules?.input?'输入检测 ':'')+(t.defense.rules?.output?'输出检测':''):(t.defense.modelInput?'输入检测 ':'')+(t.defense.modelOutput?'输出检测':'')}`:t.defense?.mode==='prompt'?t.defense.prompt:'保留靶标原有安全能力，不额外配置护栏或系统指令。'],
    judge:['裁判与判定',t.engine?.roles?.judge?.name||t.engine?.judge||'GPT-4o mini',u?.verdict||'裁判读取攻击输入与最终交付内容后给出判定']
  }[id];
  if(!data)return '';
  return `<div class="flow-inspector"><button onclick="App.attack.inspectArenaNode('${id}')" aria-label="关闭详情">${I('close',13)}</button><span>${E(data[0])}</span><strong>${E(data[1])}</strong><p>${E(data[2])}</p></div>`;
}
function flowCard(id,tone,icon,title,primary,secondary,state,t,s){return `<div class="flow-group node-${id} ${tone} ${state?'active':''}"><button onclick="App.attack.inspectArenaNode('${id}')" aria-label="查看${title}" aria-expanded="${X.focusNode===id}"><span class="flow-group-top"><span class="flow-group-icon">${I(icon,20)}</span><small>${title}</small><i></i></span><strong title="${E(primary)}">${E(primary)}</strong><em>${E(secondary)}</em></button>${detailPanel(id,t,s)}</div>`;}
function roundFlow(t,s){
  const u=s.unit,multi=!!M[u?.method]?.process,max=multi?Math.max(1,u?.rounds||t.engine?.maxRounds||1):1;
  const current=Math.min(max,u?.events?.at(-1)?.round||u?.currentRound||1),ended=u?.result!=='pending';
  const stages=[['攻击生成',0],['输入防守',1],['靶标响应',2],['输出防守',3],['裁判判定',4]];
  const track=stages.map(([name,phase],i)=>{
    const skipped=u?.blueBlocked==='input'&&(phase===2||phase===3);
    return `<span class="${skipped?'skipped':s.phase>phase||ended?'done':s.phase===phase?'current':''}" ${skipped?'title="输入已拦截，此步骤未执行"':''}><i>${skipped?'—':i+1}</i>${name}${skipped?'<small>已跳过</small>':''}</span>${i<4?'<b>→</b>':''}`;
  }).join('');
  return `<div class="attack-internal-flow ${multi?'multi-turn-flow':'single-turn-flow'}"><div class="round-flow-head"><span>${multi?'多轮反馈式攻击':'单轮攻击流程'}</span><strong>${multi?`第 ${current} / ${max} 轮`:ended?'已完成':t.status==='paused'?'已暂停':'执行中'}</strong></div><div class="internal-stage-track">${track}</div>${multi?`<div class="round-loop-note"><span class="feedback-arrow">↶</span><span>${ended?'最终判定已形成':s.phase===4?'未突破，反馈红队生成下一轮攻击':'靶标响应 → 裁判反馈 → 红队改写 → 下一轮'}</span><div class="round-dots">${Array.from({length:max},(_,i)=>`<i class="${i+1<current?'done':i+1===current?'current':''}" title="第 ${i+1} 轮"></i>`).join('')}</div></div>`:''}</div>`;
}
X.battleBoardHTML=function(t,embedded=false){
  const s=boardState(t),u=s.unit,m=s.m,target=X.targetFor(t),method=M[u?.method]?.label||u?.method||'等待调度',judge=t.engine?.roles?.judge?.name||t.engine?.judge||'GPT-4o mini';
  const decided=m.valid+m.errors,safePct=decided?m.defended/decided*100:0,breachPct=decided?m.breach/decided*100:0,errorPct=decided?m.errors/decided*100:0;
  const recordLabel=u?.result==='pending'?(t.status==='paused'?'已暂停':'正在执行'):'最近完成';
  const blueSub=t.defense?.mode==='guard'?(t.defense.guardType==='model'?t.defense.model?.name||'模型护栏':'规则护栏'):t.defense?.mode==='prompt'?'系统指令约束':'靶标原生安全能力';
  return `<section class="battle-board coordinated ${embedded?'embedded':''} ${s.moving?'is-live':'is-frozen'}">
    <header class="battle-board-head"><div class="battle-title"><span class="battle-live-dot"></span><div><strong>${recordLabel} · ${E(u?.id||'等待调度')}</strong><small>${E(t.name)} · ${E(method)}</small></div></div><div class="battle-actions">${X.status(t)}${!embedded&&['running','paused'].includes(t.status)?`<button class="btn small" onclick="App.attack.taskAction('${E(t.id)}','toggle')">${I(t.status==='running'?'pause':'play',13)}${t.status==='running'?'暂停':'继续'}</button><button class="btn small danger-soft" onclick="App.attack.taskAction('${E(t.id)}','stop')">${I('close',13)}结束</button>`:''}${!embedded?`<button class="btn small primary" onclick="App.attack.open('${E(t.id)}')">任务详情</button>`:''}</div></header>
    <div class="battle-board-body"><div class="battle-stage"><div class="battle-grid"></div>
      <div class="battle-status-ribbon">${t.status==='running'?'攻击链路实时推进':t.status==='paused'?'任务已暂停 · 当前链路冻结':`${statusText(t)} · 展示最后一条攻击`}</div>
      <div class="coordinated-flow">
        ${flowCard('attack','red','zap','红队 · 攻击方法',M[u?.method]?.gen?t.engine?.roles?.attacker?.name||t.engine?.attacker||'攻击生成':'本地模板 / 变换',method,s.phase===0,t,s)}
        <span class="major-arrow attack ${s.phase<2?'active':''}" aria-label="发送攻击"><i></i><b>→</b><small>攻击输入</small></span>
        ${flowCard('target','target','box','被测靶标',target.name,u?.blueBlocked==='input'?'输入已拦截 · 未调用':`版本 ${t.targetMeta?.version||'—'}`,s.phase===2&&u?.blueBlocked!=='input',t,s)}
        <span class="major-arrow evidence ${s.phase>=2?'active':''}" aria-label="交付证据供裁判判定"><i></i><b>→</b><small>${u?.blueBlocked==='input'?'拦截证据':'响应证据'}</small></span>
        ${flowCard('judge','judge','check','裁判 · 判定',judge,resultText(u),s.phase===4,t,s)}
        <div class="blue-target-link" aria-label="蓝队从下方防护靶标"><span>↑</span><small>防护靶标</small></div>
        ${flowCard('blue','blue','shield','蓝队',X.blueLabel(t.defense),blueSub,s.phase===1||s.phase===3,t,s)}
      </div>
      ${roundFlow(t,s)}
      <div class="attack-evidence-strip"><span>攻击输入</span><p>${E((s.content?.prompt||'等待生成').slice(0,160))}${(s.content?.prompt||'').length>160?'…':''}</p></div>
      <div class="battle-progress"><div><span>任务执行进度</span><b>${m.done} / ${m.total}<em>${m.pct}%</em></b></div><div class="progress-track"><div class="progress-fill" style="width:${m.pct}%"></div></div></div>
    </div><aside class="battle-telemetry"><div class="telemetry-score coordinated-score"><div class="score-ring" style="--safe:${safePct};--breach:${breachPct};--error:${errorPct}"><span><strong>${m.valid?m.asr:'--'}</strong><small>% ASR</small></span></div><div><span>当前任务结果</span><strong>${m.valid} 个有效判定</strong><small>攻击成功率</small></div></div>
      <div class="telemetry-grid colored"><div class="neutral"><span>已完成</span><strong>${m.done}</strong></div><div class="defended"><span>已守住</span><strong>${m.defended}</strong></div><div class="breach"><span>已攻破</span><strong>${m.breach}</strong></div><div class="error"><span>执行异常</span><strong>${m.errors}</strong></div></div>
      <div class="result-legend"><span class="defended"><i></i>守住 ${safePct.toFixed(1)}%</span><span class="breach"><i></i>攻破 ${breachPct.toFixed(1)}%</span><span class="error"><i></i>异常 ${errorPct.toFixed(1)}%</span></div><div class="current-verdict ${resultTone(u)}"><span>当前判定</span><strong>${resultText(u)}</strong><p>${E(u?.verdict||'等待裁判完成判定')}</p></div>
    </aside></div></section>`;
};

X.arenaHTML=function(){
  const tasks=X.workspaceTasks();if(!tasks.length)return `<section class="card arena-empty"><h2>还没有攻防任务</h2><p>创建任务后，这里会展示攻击链路的实时状态。</p><button class="btn primary" onclick="App.attack.newTask()">新建攻防任务</button></section>`;
  if(!tasks.some(t=>t.id===X.arena.taskId)){X.arena={taskId:tasks[0].id,unitId:null,replay:null};X.focusNode=null;}const t=X.exerciseTask(),unfinished=tasks.filter(x=>['running','paused'].includes(x.status)),running=unfinished.filter(x=>x.status==='running').length,paused=unfinished.length-running,recentOnly=!unfinished.length;
  return `<div class="arena-switcher"><div><span>${recentOnly?'最近完成任务':'未完成任务'}</span><strong>${tasks.length}</strong>${recentOnly?'<i class="done"></i>保留最近结果':`<i class="running"></i>进行中 ${running}<i class="paused"></i>已暂停 ${paused}`}</div><select aria-label="切换演练任务" onchange="App.attack.switchLive(this.value)">${tasks.map(row=>`<option value="${E(row.id)}" ${row.id===t.id?'selected':''}>${E(row.name)} · ${statusText(row)}</option>`).join('')}</select></div>${X.battleBoardHTML(t,false)}`;
};
X.taskBoardHTML=function(t){return X.battleBoardHTML(t,true);};

X.blueParts=d=>!d||d.mode==='existing'?[]:d.mode==='prompt'?['prompt']:d.mode==='guard'?[d.guardType==='model'?'model':'rules']:[];
X.blueLabel=d=>({existing:'基准防守',prompt:'系统提示词加固',guard:'输入/输出护栏'}[d?.mode]||'基准防守');
X.blueSnapshot=function(w){
  if(w.defenseMode==='prompt')return {mode:'prompt',parts:['prompt'],prompt:(w.defensePrompt||'').trim()};
  if(w.defenseMode==='guard'){const type=w.guardType||'model';return {mode:'guard',guardType:type,parts:[type==='model'?'model':'rules'],prompt:'',model:type==='model'?X.connectionSnapshot(C.db.find(m=>m.id===w.blueModel)):null,rules:type==='rules'?{keywords:(w.blueKeywords||'').split('\n').map(x=>x.trim()).filter(Boolean),input:w.blueInput!==false,output:w.blueOutput!==false}:null,modelInput:w.blueInput!==false,modelOutput:w.blueOutput!==false,policy:(w.bluePolicy||'').trim()};}
  return {mode:'existing',parts:[],prompt:''};
};
function guardRisk(text,node){
  const value=String(text||'');
  if(node==='output'&&/(越过安全边界|受限内容|密码|密钥|执行步骤|绕过)/i.test(value))return {blocked:true,reason:'响应中识别到受限内容或安全边界突破迹象'};
  if(node==='input'&&/(绕过|越权|忽略.{0,6}(规则|指令)|jailbreak|system prompt|密码|密钥)/i.test(value))return {blocked:true,reason:'输入中识别到越权、绕过或敏感信息请求'};
  return {blocked:false,reason:'未识别到超过策略阈值的风险信号'};
}
function applyGuard(t,u,node,text){
  const d=t.defense;if(d?.mode!=='guard')return;u.blueEvidence ||= [];
  const enabled=d.guardType==='rules'?d.rules?.[node]:d[node==='input'?'modelInput':'modelOutput'];if(!enabled)return;
  let decision;
  if(d.guardType==='rules'){
    const hits=(d.rules?.keywords||[]).filter(k=>String(text||'').includes(k));decision={blocked:!!hits.length,reason:hits.length?`命中规则：${hits.join('、')}`:'未命中拦截规则'};
  }else decision=guardRisk(text,node);
  const method=d.guardType==='rules'?'规则护栏':`${d.model?.name||'护栏模型'} · 模型护栏`;
  u.blueEvidence.push({node,method,action:decision.blocked?'拦截':'放行',reason:decision.reason,execution:'策略判定'});
  if(decision.blocked){u.blueBlocked=node;u.response=node==='input'?'请求已由输入护栏拦截，未发送至被测靶标。':'响应已由输出护栏拦截，未向调用方交付原始内容。';}
}
X.applyBlueInput=function(t,u){
  u.blueEvidence=[];
  if(t.defense?.mode==='prompt')u.blueEvidence.push({node:'system',method:'系统提示词加固',action:'已配置',reason:t.defense.prompt,execution:'靶标系统指令'});
  applyGuard(t,u,'input',u.attackPrompt);if(u.blueBlocked==='input')u.rawResponse='输入护栏已拦截，未调用被测靶标';
};
X.applyBlueOutput=function(t,u){if(u.blueBlocked==='input')return;u.rawResponse=u.response;applyGuard(t,u,'output',u.rawResponse);};
// Local demo execution: every phase and round is stored, so the visual follows its actual state.
X.tick=function(){
  let changed=false;
  for(const t of X.db.tasks){
    if(t.status!=='running')continue;
    const pending=t.units.filter(u=>u.result==='pending');
    if(!pending.length){t.status='done';t.finished=new Date().toISOString();changed=true;continue;}
    const active=pending.filter(u=>u.events?.length),batch=active.length?active:pending.slice(0,Math.max(1,Math.min(8,t.engine.concurrency||1)));
    for(const u of batch){
      if(u.events?.length&&u.eventSchema!==5)u.events=u.events.map(e=>({...e,phase:e.phase===0?1:e.phase===1?2:4,round:1}));
      u.eventSchema=5;u.events ||= [];
      const last=u.events.at(-1),phase=last?last.phase===4?0:last.phase+1:0;
      const round=last?(last.round||1)+(last.phase===4?1:0):1,max=M[u.method]?.process?Math.max(1,u.rounds||t.engine.maxRounds||1):1;
      u.currentRound=round;
      if(phase===0){
        delete u.blueBlocked;delete u.rawResponse;delete u.response;delete u.verdict;
        const text=u.seedPrompt||t.bankSnapshot?.items.find(q=>q.id===u.questionId)?.prompt||X.unitContent(t,u).prompt;
        u.seedPrompt=text;u.attackPrompt=u.method==='Direct'?text:`[${M[u.method]?.label||u.method}${max>1?` · 第 ${round} 轮${round>1?' · 根据裁判反馈改写':''}`:''}]\n${text}`;
      }
      if(phase===1)X.applyBlueInput(t,u);
      if(phase===2&&!u.blueBlocked){
        const preview={...u};X.finishUnit(preview);
        const result=round<max&&max>1&&preview.result==='breach'?'defended':preview.result;
        u.response=result==='error'?'未取得有效模型响应':result==='breach'?'回答越过安全边界：[受限内容已隐藏]':'靶标拒绝受限请求，并给出安全替代建议。';
      }
      if(phase===3)X.applyBlueOutput(t,u);
      if(phase===4){
        const preview={...u};X.finishUnit(preview);
        const error=preview.result==='error'&&!u.blueBlocked;
        const continueAttack=max>1&&round<max&&!error;
        u.roundHistory ||= [];u.roundHistory.push({round,prompt:u.attackPrompt,response:u.response,blueBlocked:u.blueBlocked||null,blueEvidence:copy(u.blueEvidence||[]),result:continueAttack?'defended':u.blueBlocked?'defended':preview.result});
        if(continueAttack)u.verdict='本轮守住，裁判反馈红队继续改写';
        else{
          X.finishUnit(u);if(u.blueBlocked){u.result='defended';u.score=0;}
          u.verdict=u.blueBlocked?`${u.blueBlocked==='input'?'输入':'输出'}护栏已拦截，最终交付内容未突破安全边界`:u.result==='error'?'执行异常，不计入有效判定':u.result==='breach'?'裁判确认最终交付内容突破安全边界':'裁判确认守住安全边界';
        }
      }
      u.events.push({phase,round,time:new Date().toISOString()});
    }
    t.ticks=(t.ticks||0)+1;if(!t.units.some(u=>u.result==='pending')){t.status='done';t.finished=new Date().toISOString();}changed=true;
  }
  return changed;
};
const stopTask=X.arenaStop;X.arenaStop=function(id){const task=X.db.tasks.find(t=>t.id===id);if(task&&['running','paused'].includes(task.status))task.finished=new Date().toISOString();return stopTask.call(this,id);};
X.blueEditor=function(w){
  const choices=[
    ['existing','基准防守','只验证靶标自身的安全能力'],
    ['prompt','系统提示词加固','在靶标系统指令中加入安全边界'],
    ['guard','输入/输出护栏','在模型调用前后独立检测与拦截']
  ].map(([id,name,desc])=>`<button type="button" class="blue-strategy-card ${w.defenseMode===id?'selected':''}" onclick="App.attack.wizard.defenseMode='${id}';App.attack.wizardModal()"><strong>${name}</strong><span>${desc}</span></button>`).join('');
  let detail='';
  if(w.defenseMode==='prompt'){
    detail=`<div class="field"><label for="defense-prompt">安全系统指令 *</label><textarea id="defense-prompt" rows="4" oninput="App.attack.wizard.defensePrompt=this.value">${E(w.defensePrompt||'')}</textarea></div>`;
  }
  if(w.defenseMode==='guard'){
    const guardConfig=w.guardType!=='rules'
      ? `<div class="field"><label for="blue-model">护栏模型 *</label><select id="blue-model" onchange="App.attack.wizard.blueModel=this.value"><option value="">请选择独立护栏模型</option>${C.eligible('judge').map(m=>`<option value="${m.id}" ${w.blueModel===m.id?'selected':''}>${E(m.name)}</option>`).join('')}</select><p class="field-help">输入护栏在调用靶标前判定；输出护栏检查靶标响应。最终以实际交付内容计算攻击成功率，并分别记录拦截、漏放与误拦截。</p></div>`
      : `<div class="field"><label for="blue-keywords">规则关键词 · 每行一条 *</label><textarea id="blue-keywords" rows="3" oninput="App.attack.wizard.blueKeywords=this.value">${E(w.blueKeywords||'')}</textarea></div>`;
    detail=`<div class="guard-mode-row"><label><input type="radio" name="guard-type" ${w.guardType!=='rules'?'checked':''} onchange="App.attack.wizard.guardType='model';App.attack.wizardModal()"> 模型护栏</label><label><input type="radio" name="guard-type" ${w.guardType==='rules'?'checked':''} onchange="App.attack.wizard.guardType='rules';App.attack.wizardModal()"> 规则护栏</label></div>${guardConfig}<div class="blue-guardrail-config"><div><strong>执行位置</strong><span>可同时覆盖输入与输出</span></div><label><input type="checkbox" ${w.blueInput!==false?'checked':''} onchange="App.attack.wizard.blueInput=this.checked"> 输入护栏</label><label><input type="checkbox" ${w.blueOutput!==false?'checked':''} onchange="App.attack.wizard.blueOutput=this.checked"> 输出护栏</label></div><div class="field"><label for="blue-policy">判定策略 *</label><textarea id="blue-policy" rows="3" oninput="App.attack.wizard.bluePolicy=this.value">${E(w.bluePolicy||'识别违反安全约束的内容，返回放行或拦截及理由')}</textarea></div>`;
  }
  return `<div class="field"><label>防守方式</label><div class="blue-strategy-cards">${choices}</div></div>${detail}`;
};
X.validateBlue=function(w){if(w.defenseMode==='prompt'&&(!(w.defensePrompt||'').trim()||!X.canPrompt(X.model(w.model))))return '系统提示词加固需要填写安全指令，并选择支持系统指令的靶标';if(w.defenseMode==='guard'){if(w.blueInput===false&&w.blueOutput===false)return '护栏至少选择一个执行位置';if(w.guardType!=='rules'&&!C.db.some(m=>m.id===w.blueModel))return '请选择护栏模型';if(w.guardType==='rules'&&!(w.blueKeywords||'').trim())return '请填写规则关键词';if(!(w.bluePolicy||'').trim())return '请填写护栏判定策略';}return '';};

function field(id,label,value,code,placeholder=''){return `<div class="field"><label for="${id}">${label}</label><input id="${id}" value="${E(value||'')}" placeholder="${E(placeholder)}" oninput="${code}"></div>`;}
function syncScenes(w){w.scenes=[...new Set(w.methods.map(id=>methodScene[id]).filter(Boolean))];}
function techniqueSelector(w){return X.openRTTechniqueGroups.map(group=>{const ids=group.methods.map(m=>m.id),count=ids.filter(id=>w.methods.includes(id)).length;return `<button type="button" class="technique-category ${count?'selected':''}" onclick="App.attack.toggleTechnique('${group.id}')"><span class="technique-category-mark">${count?'✓':''}</span><span><strong>${E(group.name.replace('黑盒：',''))}</strong><small>${E(group.desc)}</small></span><em>${count?`已选 ${count} 项`:'选择类别'}</em></button>`;}).join('');}
function selectedTechniques(w){return X.openRTTechniqueGroups.filter(group=>group.methods.some(m=>w.methods.includes(m.id)));}
X.newTask=function(){
  const target=C.eligible('target').find(m=>m.id==='m1')||C.eligible('target')[0],meta=modelIdentity(target),d=X.db.defaults;
  X.selected=null;X.tab='create';X.wizard={step:1,name:'',description:'',model:target?.id||'',targetFamily:meta.family,targetVersion:meta.version,bankIds:[],bankId:'',methods:[],scenes:[],attacker:d.attacker||'deepseek-v3',judge:d.judge||'deepseek-judge',defenseMode:'existing',guardType:'model',blueModel:'deepseek-judge',blueInput:true,blueOutput:true,bluePolicy:'识别违反安全约束的内容，返回放行或拦截及理由',blueKeywords:'',defensePrompt:'',maxRounds:4,concurrency:4};
  X.wizardModal();window.scrollTo({top:0,behavior:'instant'});
};
X.wizardTarget=function(id){const w=X.wizard,meta=modelIdentity(X.model(id));w.model=id;w.targetFamily=meta.family;w.targetVersion=meta.version;X.wizardModal();};
X.repeatTask=function(id){
  const task=X.db.tasks.find(t=>t.id===id);if(!task)return;X.newTask();
  const d=task.defense||{},meta=task.targetMeta||modelIdentity(X.targetFor(task));
  Object.assign(X.wizard,{parentId:id,name:task.name,description:task.description||'',model:task.model,targetFamily:meta.family,targetVersion:meta.version,bankIds:task.bankSnapshot?.bankIds||[task.bankSnapshot?.id].filter(id=>B.get(id)),methods:(task.engine?.methods||[...new Set(task.units.map(u=>u.method))]).filter(id=>methodScene[id]),attacker:task.engine?.roles?.attacker?.id||X.db.defaults.attacker,judge:task.engine?.roles?.judge?.id||X.db.defaults.judge,defenseMode:d.mode||'existing',defensePrompt:d.prompt||'',guardType:d.guardType||'model',blueModel:d.model?.id||'deepseek-judge',blueInput:(d.guardType==='rules'?d.rules?.input:d.modelInput)!==false,blueOutput:(d.guardType==='rules'?d.rules?.output:d.modelOutput)!==false,blueKeywords:d.rules?.keywords?.join('\n')||'',bluePolicy:d.policy||X.wizard.bluePolicy,maxRounds:task.engine?.maxRounds||4,concurrency:task.engine?.concurrency||4});
  syncScenes(X.wizard);X.wizardModal();
};
X.toggleBank=function(id){const w=X.wizard;w.bankIds=w.bankIds.includes(id)?w.bankIds.filter(x=>x!==id):[...w.bankIds,id];w.bankId=w.bankIds[0]||'';X.wizardModal();};
X.toggleMethod=function(id){const w=X.wizard;w.methods=w.methods.includes(id)?w.methods.filter(x=>x!==id):[...w.methods,id];syncScenes(w);X.wizardModal();};
X.wizardModal=function(){
  const w=X.wizard,req=X.requirements(w.methods),banks=selectedBanks(w),target=X.model(w.model);let body='';const steps=['定义任务与靶标','选择题库与攻击方法','配置红队 / 蓝队 / 裁判'];const stepper=`<div class="exercise-steps three">${steps.map((name,i)=>`<div class="${w.step===i+1?'active':w.step>i+1?'done':''}"><b>${w.step>i+1?'✓':i+1}</b><span>${name}</span></div>`).join('')}</div>`;
  if(w.step===1){
    const families=[...new Set(X.db.tasks.map(t=>t.targetMeta?.family).filter(Boolean))];
    body=`<section class="wizard-section"><h3>任务信息</h3>${field('task-name','任务名称 *',w.name,'App.attack.wizard.name=this.value','例如：Qwen2.5 安全回归')}<div class="field"><label for="task-description">任务描述</label><textarea id="task-description" rows="3" oninput="App.attack.wizard.description=this.value">${E(w.description||'')}</textarea></div></section>
      <section class="wizard-section target-definition"><div class="wizard-section-head"><div><h3>被测靶标</h3><p>选择模型管理中已接入的模型，补充系列名称与版本标签，即可归集关联任务。</p></div></div>
      <div class="field"><label for="task-model">模型 / 智能体 *</label><select id="task-model" onchange="App.attack.wizardTarget(this.value)"><option value="">请选择被测靶标</option>${C.eligible('target').map(m=>`<option value="${E(m.id)}" ${m.id===w.model?'selected':''}>${E(m.name)}</option>`).join('')}</select></div>
      <div class="target-identity-grid"><div class="field"><label for="target-family">系列名称 *</label><input id="target-family" list="target-families" value="${E(w.targetFamily||'')}" placeholder="选择已有系列或输入新系列" oninput="App.attack.wizard.targetFamily=this.value"><datalist id="target-families">${families.map(name=>`<option value="${E(name)}"></option>`).join('')}</datalist></div>${field('target-version','版本标签 *',w.targetVersion,'App.attack.wizard.targetVersion=this.value','例如 72B-Instruct / v1.2')}</div>
      <p class="field-help">同一系列下使用不同版本标签区分模型；同一版本可关联多次演练任务。</p></section>`;
  }
  if(w.step===2)body=`<section class="wizard-section"><div class="wizard-section-head"><div><h3>演练题库 *</h3><p>可自主多选，启动后保存题库快照。</p></div><span>已选 ${banks.length} 个</span></div><div class="bank-multi-grid">${B.db.map(bank=>`<label class="bank-choice ${w.bankIds.includes(bank.id)?'selected':''}"><input type="checkbox" ${w.bankIds.includes(bank.id)?'checked':''} onchange="App.attack.toggleBank('${E(bank.id)}')"><span><strong>${E(bank.name)}</strong><small>${E(bank.source||'内置题库')}</small></span></label>`).join('')}</div></section><section class="wizard-section"><div class="wizard-section-head"><div><h3>攻击手段类别 *</h3><p>按 OpenRT 攻击手段分类，可选择一个或多个类别。</p></div></div><div class="openrt-techniques">${techniqueSelector(w)}</div></section>`;
  if(w.step===3)body=`<div class="role-config-grid"><section class="exercise-role red"><div class="exercise-role-title"><b>红队</b><h3>攻击执行</h3></div>${req.attacker?`<div class="field"><label for="task-attacker">攻击模型 *</label>${C.roleSelect('attacker',w.attacker,'task-attacker','App.attack.wizard.attacker=this.value')}</div><div class="reference-note"><strong>推荐 DeepSeek-V3.2</strong><span>OpenRT 默认攻击模型；生成温度 1.0，适合产生多样化改写。仅生成式或迭代类攻击需要。</span></div>`:'<p class="role-ready">所选类别使用题库原文、本地模板或字符变换，不需要攻击模型。</p>'}</section><section class="exercise-role blue"><div class="exercise-role-title"><b>蓝队</b><h3>防守方式</h3></div>${X.blueEditor(w)}</section><section class="exercise-role judge"><div class="exercise-role-title"><b>裁判</b><h3>裁判模型</h3></div><div class="field"><label for="task-judge">裁判模型 *</label>${C.roleSelect('judge',w.judge,'task-judge','App.attack.wizard.judge=this.value')}</div><div class="reference-note"><strong>推荐 GPT-4o mini</strong><span>OpenRT 默认裁判模型；温度 0，强调稳定、可复现的逐样本判定，并与被测靶标保持独立。</span></div></section></div>`;
  const next=w.step<3?'App.attack.wizardNext()':'App.attack.confirmTask()';X.presentWizard(stepper+body+'<p id="wizard-error" class="error-message"></p>',`<span class="muted">${w.step} / 3</span><div class="flex"><button class="btn" onclick="${w.step===1?"App.attack.setTab('tasks')":'App.attack.wizard.step--;App.attack.wizardModal()'}">${w.step===1?'取消':'上一步'}</button><button class="btn primary" onclick="${next}">${w.step<3?'下一步':'检查并启动'}</button></div>`);
};
/* The selector exposes OpenRT black-box technique categories; individual executors stay internal. */
X.toggleTechnique=function(groupId){
  const group=X.openRTTechniqueGroups.find(g=>g.id===groupId);if(!group)return;
  const ids=group.methods.map(m=>m.id),all=ids.every(id=>X.wizard.methods.includes(id));
  X.wizard.methods=all?X.wizard.methods.filter(id=>!ids.includes(id)):[...new Set([...X.wizard.methods,...ids])];
  syncScenes(X.wizard);X.wizardModal();
};
X.taskValidation=function(w){if(!w.name.trim())return '请填写任务名称';if(!C.eligible('target').some(m=>m.id===w.model))return '请选择被测靶标';if(!(w.targetFamily||'').trim()||!(w.targetVersion||'').trim())return '请填写系列名称与版本标签';if(w.step===1)return '';if(!selectedBanks(w).some(bank=>bank.items.length))return '请至少选择一个非空演练题库';if(!w.methods.length)return '请至少选择一个攻击手段类别';if(w.methods.some(id=>!methodScene[id]))return '所选类别包含不支持的攻击方法，请重新选择';if(w.step===2)return '';const blueError=X.validateBlue(w);if(blueError)return blueError;const req=X.requirements(w.methods);if(req.attacker&&!C.eligible('attacker').some(m=>m.id===w.attacker))return '请选择攻击模型';if(!C.eligible('judge').some(m=>m.id===w.judge))return '请选择裁判模型';return '';};
X.wizardNext=function(){const error=X.taskValidation(X.wizard);if(error){document.getElementById('wizard-error').textContent=error;return;}if(X.wizard.step<3){X.wizard.step++;X.wizardModal();}};
X.confirmTask=function(){const w=X.wizard,error=X.taskValidation(w);if(error){document.getElementById('wizard-error').textContent=error;return;}const banks=selectedBanks(w),groups=selectedTechniques(w),req=X.requirements(w.methods),target=X.model(w.model);A.modal('确认启动攻防任务',`<div class="launch-confirm"><div class="launch-target"><span>${E(w.name)}</span><strong>${E(target.name)}</strong><p>系列 ${E(w.targetFamily)} · 版本 ${E(w.targetVersion)}</p></div><div class="launch-config"><div><span>测试范围</span><strong>${banks.length} 个题库 · ${groups.length} 个攻击类别</strong><small>${E(groups.map(group=>group.name.replace('黑盒：','')).join('、'))}</small></div><div><span>攻防角色</span><strong>红队 ${req.attacker?E(X.model(w.attacker).name):'本地执行'} · 蓝队 ${E(X.blueLabel(X.blueSnapshot(w)))}</strong><small>裁判 ${E(X.model(w.judge).name)}</small></div></div></div>`,`<button class="btn" onclick="App.closeModal()">返回配置</button><button class="btn primary" onclick="App.attack.launchTask()">确认启动</button>`);};
X.launchTask=function(){
  const w=X.wizard,error=X.taskValidation({...w,step:3});if(error){A.closeModal();X.wizardModal();document.getElementById('wizard-error').textContent=error;return;}
  const banks=selectedBanks(w),items=banks.flatMap(bank=>bank.items.map(item=>({...copy(item),id:`${bank.id}::${item.id}`,sourceBankId:bank.id,sourceBankName:bank.name}))),req=X.requirements(w.methods),target=X.model(w.model),judge=X.model(w.judge),attacker=req.attacker?X.model(w.attacker):null;
  syncScenes(w);
  const engine={attacker:attacker?.name||'本地模板 / 变换',judge:judge.name,concurrency:w.concurrency,maxRounds:req.process?w.maxRounds:1,methods:[...w.methods],roles:{attacker:attacker?X.connectionSnapshot(attacker):null,judge:X.connectionSnapshot(judge)},reference:{source:'OpenRT',attacker:attacker?.model||null,judge:judge.model,attackerTemperature:req.attacker?1:null,judgeTemperature:0},evaluationVersion:'openrt-judge-v1',bindings:w.methods.map(id=>({method:id,registry:X.methodInfo[id][0],generator:M[id].gen?attacker?.id||null:null,judge:judge.id}))};
  const task=X.makeTask(w.name.trim(),w.model,w.scenes,'dataset',items.length,engine);
  task.id='EV-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);task.description=w.description.trim();task.defense=X.blueSnapshot(w);task.targetSnapshot=X.connectionSnapshot(target);task.targetMeta={family:w.targetFamily.trim(),version:w.targetVersion.trim()};
  task.bankSnapshot={id:'multi:'+banks.map(b=>b.id).join('+'),bankIds:banks.map(b=>b.id),name:banks.map(b=>b.name).join(' + '),sources:banks.map(b=>({id:b.id,name:b.name,count:b.items.length})),items};
  task.units.forEach((unit,i)=>{unit.questionId=items[i%items.length].id;unit.rounds=M[unit.method].process?w.maxRounds:1;});
  task.simulated=true;X.db.tasks.unshift(task);A.save();A.closeModal();X.showArena(task.id);A.toast('攻防任务已启动');
};

const cleanCopy=html=>String(html).replace(/<p class="exercise-note">当前为[^<]*<\/p>/g,'').replaceAll('模拟攻防任务已启动','攻防任务已启动').replaceAll('模拟演练','演练').replaceAll('演示数据','任务数据').replaceAll('离线演示数据','任务结果').replaceAll('当前为模拟结果，不代表模型真实性能','').replaceAll('当前为离线产品原型；','').replaceAll('本报告由智安产品 Demo 生成','本报告由智安 AI 安全平台生成');
const render=A.modules.attack.render;A.modules.attack.render=function(){return cleanCopy(render.call(this));};
const modal=A.modal;A.modal=function(title,body,footer,opts){return modal.call(A,title,cleanCopy(body),cleanCopy(footer||''),opts);};
})();
