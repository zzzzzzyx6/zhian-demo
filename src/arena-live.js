/* Follow running evaluations, with two finite local runs for task switching. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,copy=v=>JSON.parse(JSON.stringify(v));
const L=A.arenaLive={version:2,id:'EV-261016-LIVE',ids:['EV-261019-LIVE-01','EV-261019-LIVE-02']};
const time=value=>{const n=Date.parse(value||'');return Number.isFinite(n)?n:0;};
const latest=(a,b)=>time(b.finishedAt||b.finished||b.createdAt||b.created)-time(a.finishedAt||a.finished||a.createdAt||a.created)||String(b.id).localeCompare(String(a.id));
X.workspaceTasks=function(){
 const rows=X.db.tasks.filter(t=>!t.deletedAt),running=rows.filter(t=>t.status==='running').sort((a,b)=>(a.demoOrder??99)-(b.demoOrder??99)||time(b.createdAt||b.created)-time(a.createdAt||a.created));
 return running.length?running:rows.filter(t=>t.status==='done').sort(latest).slice(0,6);
};
X.exerciseTask=function(){const rows=X.workspaceTasks();return rows.find(t=>t.id===X.arena.taskId)||rows[0]||null;};
X.arenaHTML=function(){
 const rows=X.workspaceTasks();
 if(!rows.length)return `<section class="card arena-empty"><h2>暂无进行中或已完成的演练</h2><p>创建演练任务后，这里会自动跟随执行过程。</p><button class="btn primary" onclick="App.attack.newTask()">新建演练任务</button></section>`;
 if(!rows.some(t=>t.id===X.arena.taskId)){X.arena={taskId:rows[0].id,unitId:null,replay:null};X.focusNode=null;}
 const t=X.exerciseTask(),live=t.status==='running';
 return `<div class="arena-follow-bar ${live?'is-live':''}"><div><span class="arena-follow-label ${live?'live':''}"><i></i>${live?'正在演练 · '+rows.length:'最近完成'}</span><span class="arena-follow-hint">${live?'自动跟随任务进度':'当前无进行中任务，展示最近完成结果'}</span></div><div>${rows.length>1?`<select aria-label="${live?'切换进行中的演练任务':'切换已完成的演练任务'}" onchange="App.attack.switchLive(this.value)">${rows.map(r=>`<option value="${E(r.id)}" ${r.id===t.id?'selected':''}>${E(r.name)}</option>`).join('')}</select>`:''}${A.fullBankDemo?.completionAction?.()||''}<button class="btn" onclick="App.platform.go('evaluation','attack','tasks')">任务管理</button></div></div>${X.battleBoardHTML(t,false)}`;
};
L.seed=function(){
 if(!X.db||!A.data.dashboardCasesVersion||A.data.arenaLiveSetupVersion>=L.version)return false;
 const sources=A.dashboardCases.ids.slice(0,2).map(id=>X.db.tasks.find(t=>t.id===id&&!t.deletedAt));if(sources.some(t=>!t))return false;
 const old=X.db.tasks.find(t=>t.id===L.id&&t.arenaLiveSeed&&t.status==='running');
 if(old){(A.data.arenaLiveArchive||=[]).push(copy(old));old.status='stopped';old.finishedAt=new Date().toISOString();old.terminationReason='已切换为双任务演练示例';}
 for(const [i,source] of sources.entries()){
 const id=L.ids[i];if(X.db.tasks.some(t=>t.id===id))continue;
 const at=new Date().toISOString(),t=copy(source);
 Object.assign(t,{id,name:i?'网络安全 · 多轮对抗演练':'隐私保护 · 输入输出护栏演练',description:'本地动态执行流程，展示攻击、护栏、靶标与裁判的阶段变化；不调用远程模型，不作为真实评测报告。',created:at,startedAt:at,status:'running',ticks:0,simulated:true,example:true,resultSource:'simulation',externalVerified:false,demoHold:false,arenaLiveSeed:2,planId:id,seriesId:id,parentId:null,runVersion:1,iteration:1,changeSummary:'场景专项演练',engine:{...copy(source.engine),concurrency:1},defense:X.blueSnapshot({defenseMode:'qwen3guard',guard:X.guardCandidates()[0]?.id,blueInput:true,blueOutput:true})});
 for(const key of ['finished','finishedAt','deletedAt','caseSet','runSnapshot','executionSnapshot','terminationReason','sceneBrief'])delete t[key];
 t.units=source.units.map(u=>({id:u.id,index:u.index,questionId:u.questionId,scene:u.scene,method:u.method,methodParameters:copy(u.methodParameters||{}),rounds:u.rounds,seedPrompt:u.seedPrompt,result:'pending',currentRound:0,eventSchema:5,events:[],roundHistory:[],judgeThreshold:t.engine.judgement.threshold}));
 // Give the initial view both completed evidence and a genuinely advancing unit.
 for(const u of t.units.slice(0,i?2:4)){let guard=0;while(u.result==='pending'&&guard++<100)X.advanceUnit(t,u);}
 const next=t.units.find(u=>u.result==='pending');if(next){X.advanceUnit(t,next);X.advanceUnit(t,next);}
 t.runSnapshot=A.policies.runSnapshot(t);t.arenaAdvancedAt=Date.now();X.db.tasks.unshift(t);
 }
 A.data.arenaLiveSetupVersion=L.version;A.save();return true;
};
// Pace only these two walkthroughs; their phase history still advances to completion.
const advance=X.advanceUnit;X.advanceUnit=function(t,u,at){if(at===undefined&&t.arenaLiveSeed>=2&&L.ids.includes(t.id)&&X.db.tasks.includes(t)){if(Date.now()-(t.arenaAdvancedAt||0)<6000)return;t.arenaAdvancedAt=Date.now();}return advance.apply(this,arguments);};
const start=A.start;
A.start=function(){const result=start.apply(A,arguments);L.seed();A.render();return result;};
})();
