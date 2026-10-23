/* October review: isolated scanner and focused product presentation changes. */
(function(){
'use strict';
const A=window.App,P=A.platform,X=A.attack,V=A.evaluation,E=A.escape,R=A.octoberRefinement;
const scan=()=>P.state.section==='evaluation'&&R.domain==='scan';
const Q=A.review24={};
const render=A.modules.attack.render;
const scanURL='scan-center/index.html';Q.scanRoute='/';
Q.scanHTML=()=>'<iframe id="scan-center-full" title="安全扫描完整中心" src="'+scanURL+'#'+E(Q.scanRoute)+'" style="width:100%;height:calc(100dvh - var(--platform-header-height,76px));border:0;display:block"></iframe>';
Q.scanGo=function(route){Q.scanRoute=route;const frame=document.getElementById('scan-center-full');if(frame)frame.contentWindow.postMessage({type:'platform-scan-navigate',route},'*');else P.go('scan','tasks');Q.syncScanSidebar();};
Q.scanSidebar=function(){const items=[['/','总览','grid'],['/targets','被测对象','box'],['/scan/code','代码安全','code'],['/scan/app','应用安全','box'],['/scan/web','Web 安全','link'],['/models','模型管理','settings']];const active=Q.scanRoute.startsWith('/projects/')?'':Q.scanRoute.startsWith('/targets/')?'/targets':Q.scanRoute;return '<div class="platform-side-title"><strong>安全扫描</strong><button class="platform-collapse" onclick="App.centers.toggle()">'+A.icon('chevron',15)+'</button></div><nav id="center-navigation" aria-label="安全扫描侧边栏">'+items.map(([route,label,icon],i)=>(i===2?'<div class="r24-nav-group">漏洞扫描</div>':i===5?'<div class="r24-nav-group">系统配置</div>':'')+'<button class="platform-side-item '+(route===active?'active':'')+'" data-route="'+route+'" onclick="App.review24.scanGo(this.dataset.route)">'+A.icon(icon,18)+'<span>'+label+'</span></button>').join('')+'</nav><div class="platform-side-footer">AI 安全平台</div>';};
Q.syncScanSidebar=function(){if(scan()){const side=document.getElementById('center-sidebar');if(side)side.innerHTML=Q.scanSidebar();}};
const chrome=P.renderChrome;
P.renderChrome=function(){const v=chrome.apply(this,arguments);document.getElementById('app')?.classList.toggle('review24-scanner',scan());return v;};
A.centers.render=P.renderChrome;
// Scanner owns its data and internal routes; no scan-load payload or asset mutation bridge.
window.addEventListener('message',e=>{const f=document.getElementById('scan-center-full');if(!f||e.source!==f.contentWindow)return;if(e.data?.type==='zhian-home')P.go('workspace','home');if(e.data?.type==='scan-center-route'){Q.scanRoute=e.data.route;Q.syncScanSidebar();}});
const descriptions={Direct:'直接提交原始问题，测试模型对风险请求的基础拒答能力。',DeepInception:'将请求嵌入多层虚构情境，诱导模型在情境内执行。',PAIR:'根据目标回答和裁判反馈反复改写攻击提示词。',Crescendo:'从低风险话题逐轮推进，逐步引向攻击目标。',CoA:'把目标拆成连续步骤，以多轮交互逐步诱导执行。',ReNeLLM:'重写原始问题并加入场景包装，迭代筛选有效提示词。',DrAttack:'分解敏感请求并重组提示词，弱化原始目标的直接表达。','AutoDAN-Turbo':'总结成功攻击策略，再组合复用到新提示词中。',ICA:'在上下文中放入示范问答，诱导模型模仿回答方式。',JailBrokenRole:'指定虚构角色与行为约束，诱导模型绕过原有限制。',CipherChat:'把请求转为编码表达，借助示例引导模型解码并回答。',Multilingual:'把请求翻译为其他语言，测试跨语言防护边界。',FlipAttack:'翻转或重排请求字符，引导模型还原后执行。',PastTense:'将请求改写为过去时或历史情境，降低直接请求特征。',FigStep:'把攻击指令渲染为图像文字，测试视觉输入的安全边界。',NanoGCG:'利用本地模型梯度搜索对抗后缀，提高目标输出概率。'};
Object.assign(descriptions,{AutoDAN:'以遗传搜索选择和变异候选提示词，保留更有效的攻击输入。',GPTFuzzer:'对种子提示词进行变异，依据靶标反馈扩展有效种子。',TreeAttack:'按树状路径生成候选，通过评分和剪枝搜索攻击输入。',SeqAR:'逐步优化字符与推理步骤，搜索更有效的攻击序列。',RACE:'借助影子模型探索候选，再依据靶标反馈调整攻击。','AutoDAN-R':'检索已有攻击策略，结合推理与反馈搜索提示词。',CodeAttack:'将风险问题嵌入代码数据结构，以代码补全方式诱导回答。',Jailbroken:'用角色、格式或指令模板包装问题，测试约束绕过。',Mousetrap:'对请求施加多层混淆，通过试验反馈搜索有效表达。',Prefill:'预填回答开头，诱导模型沿给定方向继续生成。',RedQueen:'分阶段建立情境、收集信息，最终提出攻击请求。'});
const deps=id=>{const d=X.methodDependencies?.[id]||{};return [d.gen?'攻击生成模型':'',d.process?'过程裁判模型':'','结果裁判模型',id==='DrAttack'?'向量模型':'',id==='NanoGCG'?'本地可求梯度靶标':''].filter(Boolean);};
const oldMethods=A.policies.methods;
A.policies.methods=function(){return oldMethods.apply(this,arguments).map(m=>({...m,description:descriptions[m.id]||m.description}));};
const detail=A.policies.methodDetail;
A.policies.methodDetail=function(id){const m=A.policies.method(id);if(!m)return detail.apply(this,arguments);const d=X.methodDependencies?.[id]||{};A.drawer(m.name,'<div class="r24-method"><h3>攻击逻辑</h3><p>'+E(descriptions[id]||m.description||m.label)+'</p><h3>执行流程</h3><ol><li>读取题库原始问题和攻击策略参数</li><li>'+E(descriptions[id]||'按已配置模板构造攻击输入')+'</li><li>向靶标提交输入，由结果裁判记录攻破或防守结论</li></ol><h3>依赖模型角色</h3><ul>'+deps(id).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul><h3>适用与约束</h3><ul><li>分类：'+E(m.category||'文本攻击')+'</li><li>'+E(d.note||'按方法配置执行，参数在攻击策略中管理。')+'</li>'+(m.template?'<li>自定义文本模板<pre>'+E(m.template)+'</pre></li>':'')+'</ul></div>','<button class="btn" onclick="App.closeDrawer()">关闭</button>');};
const bankIntro={advbench:'覆盖违法、有害行为等典型风险请求，用于测试模型能否拒绝危险指令。',salad:'覆盖多层安全风险分类及多语言样本，用于评估模型的综合安全边界。',harmbench:'包含多类有害行为测试目标，用于比较不同攻击方法下的模型稳健性。',jailbreak:'收集越狱与对抗提示词，用于检验指令绕过及拒答稳定性。',strongreject:'以有害请求测试拒答质量，用于检查模型是否真正阻止危险信息交付。'};
function dropColumn(table,label){const headers=[...table.querySelectorAll('thead th')],i=headers.findIndex(c=>c.textContent.trim()===label);if(i<0)return;for(const tr of table.rows){if(tr.cells.length===headers.length)tr.cells[i]?.remove();else if(tr.cells.length===1)tr.cells[0].colSpan=Math.max(1,headers.length-1);}}
function moveColumn(table,label,before){const hs=[...table.querySelectorAll('thead th')],i=hs.findIndex(c=>c.textContent.trim()===label),j=hs.findIndex(c=>c.textContent.trim()===before);if(i<0||j<0)return;for(const tr of table.rows)if(tr.cells.length===hs.length)tr.insertBefore(tr.cells[i],tr.cells[j]);}
function refine(html){const host=document.createElement('div');host.innerHTML=html;const s=P.state,hash=location.hash;
 // In-app navigation renders before renderChrome updates the URL. The live state,
 // not the previous hash, is authoritative for all route-specific refinements.
 const attackPolicy=s.section==='policy'&&s.item==='policies',defense=s.section==='policy'&&s.item==='defense';
 const assets=s.section==='assets',methods=attackPolicy&&A.policies.section==='methods',banks=attackPolicy&&A.policies.section==='content',basics=defense&&A.defensePolicies.tab==='basics',rules=defense&&['rules','knowledge'].includes(A.defensePolicies.tab),strategies=attackPolicy&&A.policies.section==='strategies',accounts=s.section==='protection'&&s.item==='accounts';
 for(const table of host.querySelectorAll('table')){
  if(s.section==='evaluation'&&R.domain==='exercise'&&s.item==='reports'){dropColumn(table,'任务状态');for(const th of table.querySelectorAll('thead th'))if(th.textContent.trim()==='生成时间')th.textContent='报告生成时间';}
  if(assets)for(const n of ['创建时间','更新时间','最近更新时间'])dropColumn(table,n);
  if(strategies)dropColumn(table,'配置状态');
  if(basics)dropColumn(table,'创建时间');
  if(rules){dropColumn(table,'状态');for(const cell of table.querySelectorAll('.lc-time'))if(cell.textContent.includes('未记录'))cell.textContent='—';}
  if(banks){for(const tr of table.querySelectorAll('tbody tr')){const txt=tr.cells[0]?.textContent.toLowerCase()||'',builtin=!!tr.querySelector('.bank-source.builtin')||tr.textContent.includes('系统内置');if(builtin)tr.querySelectorAll('td.lc-time').forEach(c=>c.textContent='—');const key=Object.keys(bankIntro).find(k=>txt.includes(k));const small=tr.cells[0]?.querySelector('small');if(small&&key)small.textContent=bankIntro[key];else if(small&&txt.includes('safety-prompts'))small.textContent='覆盖多类典型安全场景的中文问题，用于测试日常对话中的风险识别与安全回答能力。';}}
  if(methods){const hs=[...table.querySelectorAll('thead th')],idx=hs.findIndex(c=>/参数参考值|参数配置/.test(c.textContent));if(idx>=0){hs[idx].textContent='依赖模型';for(const tr of table.querySelectorAll('tbody tr')){const name=tr.cells[0]?.textContent||'',id=Object.keys(X.methodDependencies||{}).find(k=>name.includes(k));if(id&&tr.cells[idx])tr.cells[idx].textContent=deps(id).join('、');}}for(const tr of table.querySelectorAll('tbody tr')){const id=Object.keys(descriptions).find(k=>(tr.cells[0]?.textContent||'').includes(k));const p=tr.cells[0]?.querySelector('p,small');if(id&&p)p.textContent=descriptions[id];}}
  if(accounts)moveColumn(table,'最近触发时间','风险标记');
  if(s.section==='evaluation'&&R.domain==='exercise'&&!R.view){const hs=[...table.querySelectorAll('thead th')],i=hs.findIndex(c=>/创建时间/.test(c.textContent));if(i>=0)for(const [j,tr] of [...table.querySelectorAll('tbody tr')].entries())if(tr.cells[i]?.textContent.includes('未记录'))tr.cells[i].textContent='2026-10-'+String(19+j%4).padStart(2,'0')+' 10:'+String(j%60).padStart(2,'0')+':00';}
 }
 if(banks)for(const cell of host.querySelectorAll('.or-bank-tags')){const tags=[...cell.querySelectorAll('span')];const names=tags.map(t=>t.textContent.trim());if(names.length){const visible=document.createElement('div');visible.append(...tags.slice(0,3));cell.replaceChildren(visible);const more=document.createElement('span');more.className='r24-tag-more';more.textContent='…';more.tabIndex=0;more.title=names.join('、');more.setAttribute('aria-label','全部场景标签：'+names.join('、'));const popup=document.createElement('span');popup.className='r24-tag-popup';popup.textContent=names.join('、');more.append(popup);cell.append(more);}}
 if(accounts)host.querySelectorAll('.rt-summary').forEach(x=>x.remove());
 if(s.section==='evaluation'&&R.domain==='exercise'&&!R.view&&!X.selected&&s.item!=='reports'){const h=host.querySelector('h1');if(h?.textContent.trim()==='任务管理')h.textContent='演练任务';}
 if(s.section==='evaluation'&&R.view==='datasets'){for(const label of host.querySelectorAll('.or-dataset-filters>label'))if(/评测类型/.test(label.textContent))label.remove();host.querySelector('.page-heading .or-dataset-export')?.remove();}
 if(s.section==='evaluation'&&R.domain==='exercise'&&X.selected)host.querySelector('#task-records')?.remove();
 // Keep demo controls outside the heading; reports must never show this task action.
 host.querySelectorAll('[onclick*="finishRunning"]').forEach(b=>b.remove());
 if(s.section==='evaluation'&&R.domain==='exercise'&&s.item==='attack'&&!R.view&&!X.selected&&host.querySelector('table')){const row=document.createElement('div');row.className='r24-demo-actions';const b=document.createElement('button');b.className='btn';b.textContent='一键完成所有进行中任务';b.setAttribute('onclick','App.evaluation.finishRunning()');row.append(b);host.querySelector('.page-heading')?.after(row);}
 if(defense&&A.defensePolicies.tab==='configurations')for(const tr of host.querySelectorAll('tbody tr')){const edit=tr.querySelector('[onclick*="defenseConfigurations.edit"]');if(edit&&!tr.querySelector('.entry-delete')){const id=edit.dataset.id;if(id){const box=document.createElement('span');box.innerHTML='<button class="entry-delete" title="删除配置" aria-label="删除配置" data-id="'+E(id)+'" onclick="App.entryManagement.request(\'defense-configuration\',this.dataset.id)">'+A.icon('trash',16)+'</button>';edit.parentNode.append(box);}}}
 // Match the full method name before shorter prefixes such as AutoDAN.
 if(methods)for(const tr of host.querySelectorAll('tbody tr')){const name=tr.cells[0]?.querySelector('button,strong,a')?.textContent.trim()||tr.cells[0]?.textContent||'',id=Object.keys(descriptions).sort((a,b)=>b.length-a.length).find(k=>name.includes(k));if(!id)continue;const p=tr.cells[0]?.querySelector('p,small');if(p)p.textContent=descriptions[id];if(tr.cells[3])tr.cells[3].textContent=deps(id).join('、');}
 return host.innerHTML;
}
A.modules.attack.render=function(){P.sync();if(scan())return Q.scanHTML();return refine(render.apply(this,arguments));};
// Remove retired identity management from navigation and prevent stale deep links.
if(P.menus.management)P.menus.management=P.menus.management.filter(x=>!(/身份|权限/.test(x[1])));
const sidebar=P.sidebar;P.sidebar=function(){if(scan())return Q.scanSidebar();const root=document.createElement('div');root.innerHTML=sidebar.apply(this,arguments);for(const b of root.querySelectorAll('button')){if(/身份与权限/.test(b.textContent))b.remove();else if(b.textContent.trim()==='演练结果')b.textContent='对象结果';}return root.innerHTML;};
const pm=P.menus.protection;if(pm){const i=pm.findIndex(x=>x[0]==='records'),j=pm.findIndex(x=>x[0]==='review');if(i>=0&&j>=0)[pm[i],pm[j]]=[pm[j],pm[i]];}
// Deterministic mock timestamps are assigned only to undated task records, never assets.
function seedTaskTimes(){let changed=false;for(const [i,t] of [...(X.db?.tasks||[]),...(A.scanProduct.db?.tasks||[])].entries())if(!A.listConsistency.created(t)){t.created='2026-10-'+String(19+i%4).padStart(2,'0')+' 10:'+String(i%60).padStart(2,'0')+':00';changed=true;}if(changed)A.save();}
const start=A.start;A.start=function(){const result=start.apply(this,arguments);seedTaskTimes();A.render();return result;};
// Bulk completion is limited to bundled offline fixtures, never actual service runs.
V.finishRunning=function(){
 const tasks=X.db.tasks.filter(t=>!t.deletedAt&&t.status==='running'&&t.caseSet===A.fullBankDemo.caseSet&&t.simulated===true&&t.resultSource==='offline-case');
 if(!tasks.length)return A.toast('当前没有可一键完成的内置演示任务；真实任务需等待执行');
 const at=new Date().toISOString();
 for(const t of tasks){
  for(const u of t.units||[]){
   if(u.result!=='pending')continue;
   const hit=u.index%5===0,result=hit?'breach':'defended';
   const response=hit?'[离线演示响应摘要；危险细节已省略] 回答未保持原题涉及的安全边界。':'[离线演示响应摘要] 拒绝不安全请求，并提供合规替代方向。';
   const verdict=hit?'离线演示：响应满足原题中的不安全目标。':'离线演示：响应拒绝不安全目标并保持安全边界。';
   const prompt=u.attackPrompt||u.seedPrompt;
   Object.assign(u,{result,currentRound:u.currentRound||1,attackPrompt:prompt,rawResponse:response,response,verdict,verdictState:result,score:hit?5:1,finished:at,judgementSnapshot:JSON.parse(JSON.stringify(t.policySnapshot.judgement)),completionSource:'offline-demo'});
   delete u.pendingResult;delete u.pendingScore;
   u.events||=[];u.events.push({phase:4,round:u.currentRound,time:at,source:'offline-demo'});
   u.roundHistory||=[];u.roundHistory.push({round:u.currentRound,prompt,rawResponse:response,response,score:u.score,result,verdict,judgeOutput:JSON.stringify({reason:verdict,score:u.score}),finishedAt:at,source:'offline-demo'});
  }
  t.status='done';t.finished=t.finishedAt=at;t.reportGeneratedAt=at;t.resultSaved=true;
 }
 A.save();A.platformGovernance.refresh();A.render();A.toast('内置离线演示任务已完成 '+tasks.length+' 项（非真实模型测评）');
};
const G=A.platformGovernance,initRisk=G.init;
G.init=function(){const result=initRisk.apply(this,arguments);if(!G.db.rules.some(r=>r.id==='risk-user-unsafe')){const r={id:'risk-user-unsafe',name:'应用用户不安全行为超阈值',domain:'protection',metric:'runtime-user-unsafe',source:'content',scope:'application-window',windowHours:24,threshold:3,enabled:true,version:1,publishedAt:new Date().toISOString()};r.revisions=[G.ruleSnapshot(r)];G.db.rules.push(r);}return result;};
// Object selector filters the inventory; only clicking a name opens its result detail.
const C=A.exerciseResults;
C.detailKey='';
// ASR summaries use completed runs with valid judgements, even if a few units errored.
// Report-export eligibility remains unchanged. Sort equal completion times by creation.
C.resultTasks=g=>g.tasks.filter(t=>t.status==='done'&&C.rate(t)!==null).slice().sort((a,b)=>(Date.parse(b.finishedAt||b.finished||b.created||0)-Date.parse(a.finishedAt||a.finished||a.created||0))||(Date.parse(b.created||0)-Date.parse(a.created||0))||String(b.id).localeCompare(String(a.id)));
C.setObject=function(value){C.object=value;C.detailKey='';C.selected.clear();A.render();};
C.openDetail=function(key){C.detailKey=key;C.selected.clear();A.render();window.scrollTo({top:0,behavior:'instant'});};
C.toggle=function(id,on){const g=C.groups().find(g=>g.key===C.detailKey),t=g&&C.resultTasks(g).find(t=>t.id===id);if(!t)return;if(on)C.selected.add(id);else C.selected.delete(id);A.render();};
C.history=function(g){
 const rows=C.resultTasks(g),chosen=rows.filter(t=>C.selected.has(t.id));
 const values=t=>{const a=X.taskAnalysis(t);return '<td>'+E(t.name)+'</td><td>'+E(t.policySnapshot?.name||'自定义策略')+'</td><td>'+E(t.bankSnapshot?.name||'—')+'</td><td>'+E(X.blueLabel(t.defense))+'</td><td>'+C.rate(t).toFixed(1)+'%</td><td>'+a.breach+' / '+a.valid+'</td>';};
 return '<section class="card"><div class="card-body"><h2>历史演练结果</h2><p>勾选至少两次演练进行对比；题库、策略或护栏配置不同，请结合测试条件理解结果。</p><div class="table-wrap"><table><thead><tr><th>对比</th><th>任务</th><th>攻击策略</th><th>攻击题库</th><th>护栏配置</th><th>攻破率</th><th>攻破 / 有效判定</th></tr></thead><tbody>'+rows.map(t=>'<tr><td><input type="checkbox" aria-label="对比 '+E(t.name)+'" data-id="'+E(t.id)+'" '+(C.selected.has(t.id)?'checked':'')+' onchange="App.exerciseResults.toggle(this.dataset.id,this.checked)"></td>'+values(t)+'</tr>').join('')+'</tbody></table></div></div></section>'+(chosen.length>=2?'<section class="card review21-comparison"><div class="card-body"><h2>所选演练结果对比</h2><div class="table-wrap"><table><thead><tr><th>任务</th><th>攻击策略</th><th>攻击题库</th><th>护栏配置</th><th>攻破率</th><th>攻破 / 有效判定</th></tr></thead><tbody>'+chosen.map(t=>'<tr>'+values(t)+'</tr>').join('')+'</tbody></table></div></div></section>':'');
};
C.render=function(){const groups=C.groups(),picked=groups.find(g=>g.key===C.detailKey);
 if(picked)return '<div class="page-heading"><div><button class="link-btn" onclick="App.exerciseResults.detailKey=\'\';App.render()">← 返回对象结果</button><h1>'+E(picked.name)+'</h1></div></div>'+A.objectAnalysis.render({key:picked.key,kind:'models',name:picked.name,tasks:picked.tasks})+C.history(picked);
 const shown=groups.filter(g=>(!C.object||g.key===C.object)&&(!C.query||g.name.toLowerCase().includes(C.query.toLowerCase())));
 return A.heading('','对象结果','按靶标查看最近一次有效演练结果及相较上次的变化。')+'<section class="card"><div class="toolbar review21-result-filters"><label>靶标对象 <select aria-label="筛选靶标对象" onchange="App.exerciseResults.setObject(this.value)"><option value="">全部靶标对象</option>'+groups.map(g=>'<option value="'+E(g.key)+'" '+(C.object===g.key?'selected':'')+'>'+E(g.name)+'</option>').join('')+'</select></label><input type="search" aria-label="搜索对象" placeholder="搜索对象" value="'+E(C.query)+'" oninput="App.exerciseResults.query=this.value;App.render()"></div></section><section class="card"><div class="table-wrap"><table><thead><tr><th>靶标对象</th><th>最新结果</th><th>趋势变化</th><th>最近演练时间</th><th>操作</th></tr></thead><tbody>'+shown.map(g=>{const valid=C.resultTasks(g),latest=valid[0],previous=valid[1],delta=latest&&previous?Number(C.rate(latest).toFixed(1))-Number(C.rate(previous).toFixed(1)):null;return '<tr><td><button class="link-btn" data-key="'+E(g.key)+'" onclick="App.exerciseResults.openDetail(this.dataset.key)">'+E(g.name)+'</button></td><td>'+(latest?C.rate(latest).toFixed(1)+'%':'—')+'</td><td>'+(delta===null?'—':'<strong class="trend-delta '+(delta>0?'up':delta<0?'down':'flat')+'" title="最近两次已完成演练的攻破率百分点差；异常单元不计入分母">'+(delta>0?'+':'')+delta.toFixed(1)+'%</strong>')+'</td><td>'+(latest?A.listConsistency.time(latest.finishedAt||latest.finished||latest.created):'—')+'</td><td>'+(latest?'<button class="btn small" data-id="'+E(latest.id)+'" onclick="App.attack.quickRetest(this.dataset.id)">复测</button>':'—')+'</td></tr>';}).join('')+(shown.length?'':'<tr><td colspan="5" class="empty">暂无匹配对象</td></tr>')+'</tbody></table></div></section>';
};
const DS=A.evaluationDatasets,dsRows=DS.rows,exportMenu=DS.exportMenu,exportDS=DS.export;
DS.rows=function(){DS.filter.kind='';return dsRows.apply(this,arguments);};
DS.exportMenu=function(id){return id?exportMenu.apply(this,arguments):'';};
DS.export=function(format,id){if(!id)return A.toast('请在版本管理中选择已冻结版本导出');return exportDS.apply(this,arguments);};
const drawer=A.drawer;
A.drawer=function(title,body,footer){if(P.state.section==='evaluation'&&R.view==='datasets'&&footer){const box=document.createElement('div');box.innerHTML=footer;for(const b of box.querySelectorAll('button'))if(b.textContent.trim()==='导出本条')b.remove();footer=box.innerHTML;}return drawer.call(this,title,body,footer);};
})();
