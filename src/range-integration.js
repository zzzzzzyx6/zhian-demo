/* Lijing 3D campus adaptation: current platform task data remains authoritative. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape;
const R=A.rangeExperience={instances:new Map(),paused:false,selected:'target'};
R.task=()=>A.octoberRefinement.latestTask();
R.slot=t=>`<div class="range-slot" data-range-task="${E(t?.id||'')}"></div>`;
R.nodes=t=>[{id:'red',kind:'red',name:'红队 · 攻击生成',detail:t?.engine?.roles?.attacker?.name||t?.engine?.attacker||'本地攻击模板'},
 {id:'target',kind:'target',name:'靶标：'+(t?X.targetFor(t)?.name||t.targetSnapshot?.name||t.targetName||'未记录':'等待任务'),detail:''},
 {id:'blue',kind:'blue',name:'蓝队 · 安全防护',detail:t&&X.guardFlow(t).enabled?X.blueLabel(t.defense):'当前任务未启用防护'},
 {id:'purple',kind:'purple',name:'裁判 · 结果判定',detail:t?.engine?.roles?.judge?.name||t?.engine?.judge||'等待配置'}];
R.sceneData=t=>({targets:t?[{id:'target',name:X.targetFor(t)?.name||'目标模型'}]:[],activeId:t?.status==='running'?'target':null,defense:!!(t&&X.guardFlow(t).enabled),selected:R.selected,paused:R.paused||t?.status!=='running'});
R.action=function(action){for(const item of R.instances.values()){
 if(action==='pause'){R.paused=!R.paused;break;}
 if(action==='reset')item.scene?.reset();if(action==='top')item.scene?.reset('top');if(action==='rotate')item.scene?.rotate(.3);if(action==='in')item.scene?.zoom(.85);if(action==='out')item.scene?.zoom(1.15);
 }R.sync();};
R.select=function(id){R.selected=id;R.sync();};
R.make=function(){
 const root=document.createElement('div');root.className='range-3d range-product';
 root.innerHTML='<div class="range-3d-canvas" tabindex="0" role="region" aria-label="三维演练场，拖拽旋转、滚轮缩放，方向键旋转，加减键缩放"></div><div class="range-3d-status"></div><div class="range-3d-labels"></div><div class="range-node-detail" aria-live="polite"></div><div class="range-3d-tools" role="toolbar" aria-label="三维视角">'+[['reset','复位']].map(([key,name])=>`<button type="button" data-control="${key}" onclick="App.rangeExperience.action('${key}')">${name}</button>`).join('')+'</div><div class="range-3d-caption"><span>拖动旋转 · 滚轮缩放 · 点击节点</span></div>';
 const item={root,scene:null,task:null};const host=root.querySelector('.range-3d-canvas'),labels=root.querySelector('.range-3d-labels');
 host.addEventListener('keydown',e=>{const moves={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]};if(moves[e.key]){e.preventDefault();item.scene?.rotate(...moves[e.key]);}if(['+','=','-'].includes(e.key)){e.preventDefault();item.scene?.zoom(e.key==='-'?1.1:.9);}});
 item.fail=()=>{item.scene?.dispose();item.scene=null;root.classList.add('range-3d-fallback');root.querySelector('.range-3d-status').textContent='当前环境无法启用 3D，仍可查看任务与节点信息';root.querySelectorAll('[data-control]').forEach(b=>b.disabled=true);};
 item.start=()=>{try{item.scene=window.createRangeScene(host,labels,R.select,item.fail);}catch(error){item.fail();}};
 return item;
};
R.sync=function(){
 const slots=[...document.querySelectorAll('.range-slot')],active=new Set();
 for(const slot of slots){const key=slot.dataset.rangeTask||'empty';active.add(key);let item=R.instances.get(key);if(!item){item=R.make();R.instances.set(key,item);slot.appendChild(item.root);item.start();}else if(item.root.parentNode!==slot)slot.appendChild(item.root);
 const t=X.db.tasks.find(t=>t.id===key),nodes=R.nodes(t);item.task=t;
 const labels=item.root.querySelector('.range-3d-labels');labels.innerHTML=nodes.map(n=>`<button class="range-3d-label ${n.kind} ${R.selected===n.id?'selected':''}" data-map-id="${n.id}" title="${E(n.name)}" onclick="App.rangeExperience.select('${n.id}')">${E(n.name)}</button>`).join('');
 const selected=nodes.find(n=>n.id===R.selected)||nodes[1];item.root.querySelector('.range-node-detail').innerHTML=selected.id==='target'?`<span>${E(t?.name||'等待任务')}</span><strong>${E(selected.name)}</strong>`:`<span>${E(selected.name)}</span><strong>${E(selected.detail)}</strong>`;
 if(item.scene){const live=t?.status==='running';item.root.querySelector('.range-3d-status').innerHTML=`<i class="${live?'active':''}"></i>${!t?'等待创建演练任务':live?(t.simulated?'演示任务运行中':'任务运行中'):'任务已结束 · 拓扑回看'}`;item.scene.update(R.sceneData(t));}
 }
 for(const [key,item] of R.instances)if(!active.has(key)){item.scene?.dispose();item.root.remove();R.instances.delete(key);}
};
// Keep the WebGL canvas and camera alive through the existing task refresh cycle.
const render=A.render;A.render=function(){for(const item of R.instances.values())item.root.remove();const result=render.apply(this,arguments);R.sync();return result;};
const panel=A.demoPresentation.attackPanel;
A.demoPresentation.attackPanel=function(){const t=R.task();return panel.apply(this,arguments).replace(/<div class="or-arena-stage">[\s\S]*?(?=<div class="or-progress-caption">)/,R.slot(t));};
const board=X.battleBoardHTML;
X.battleBoardHTML=function(t,embedded){return board.apply(this,arguments).replace(/<div class="battle-stage">[\s\S]*?(?=<aside class="battle-telemetry">)/,`<div class="battle-stage range-battle-stage">${R.slot(t)}</div>`);};
X.arenaHTML=function(){const t=R.task();if(!t)return '<section class="card empty">暂无演练任务<button class="btn primary" onclick="App.attack.newTask()">新建演练任务</button></section>';X.arena.taskId=t.id;return `<div class="arena-follow-bar"><span>自动展示最新演练任务 · 拖拽探索三维攻防拓扑</span><button class="btn" onclick="App.platform.go('exercise','tasks')">任务列表</button></div>`+X.battleBoardHTML(t,false);};
})();
