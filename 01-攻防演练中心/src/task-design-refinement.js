/* Focused task creation: target identity, OpenRT black-box techniques, multi-bank selection. */
(function(){
'use strict';
const A=window.App,X=A.attack,B=A.banks,C=A.connections,E=A.escape,M=X.methodDependencies;
const clone=value=>JSON.parse(JSON.stringify(value));
const methodScene={Direct:'jailbreak',PAIR:'jailbreak',DeepInception:'jailbreak',CipherChat:'obfuscation',FlipAttack:'obfuscation'};
const techniqueGroups=[
  {id:'baseline',name:'基线测试',official:false,desc:'不改写题库输入，用于衡量靶标原生安全能力。',methods:[
    {id:'Direct',desc:'将题库问题原样发送给靶标，作为其他攻击方法的对照基线。',mode:'单轮 · 无需攻击模型'}
  ]},
  {id:'llm-refinement',name:'黑盒：LLM 驱动优化',official:true,desc:'由攻击模型根据靶标反馈持续改写输入，逐轮寻找可突破的表达。',methods:[
    {id:'PAIR',desc:'攻击模型依据上一轮响应生成下一轮提示，并由过程裁判决定是否继续。',mode:'多轮 · 需要攻击模型'}
  ]},
  {id:'linguistic',name:'黑盒：语言与编码',official:true,desc:'利用编码或语言结构变换测试安全识别在表达变化下是否稳定。',methods:[
    {id:'CipherChat',desc:'使用预设编码规则和示例包装原始问题，再交由靶标理解并回答。',mode:'单轮 · 本地模板'},
    {id:'FlipAttack',desc:'对关键文本进行字符重排，测试靶标能否识别被变形的风险意图。',mode:'单轮 · 本地变换'}
  ]},
  {id:'contextual',name:'黑盒：上下文欺骗',official:true,desc:'构造虚构情境或角色层级，让风险请求隐藏在看似合理的上下文中。',methods:[
    {id:'DeepInception',desc:'通过多层虚构场景与角色嵌套，测试靶标是否仍能保持安全边界。',mode:'单轮 · 本地模板'}
  ]}
];
X.openRTTechniqueGroups=techniqueGroups;

function targetDefaults(model){
  const raw=(model?.model||model?.name||'').trim();
  const family=raw.match(/^[A-Za-z]+(?:[A-Za-z0-9]*)(?:[.-]?[0-9]+(?:\.[0-9]+)?)?/u)?.[0]||raw.split(/[-_]/)[0]||'自研模型';
  const version=raw.replace(new RegExp('^'+family.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[-_ ]*','i'),'')||'当前版本';
  return {family,version,environment:'候选'};
}
function selectedBanks(w){return (w.bankIds||[]).map(id=>B.get(id)).filter(Boolean);}
function syncScenes(w){w.scenes=[...new Set(w.methods.map(id=>methodScene[id]).filter(Boolean))];}
function field(id,label,value,code,placeholder=''){return `<div class="field"><label for="${id}">${label}</label><input id="${id}" value="${E(value||'')}" placeholder="${E(placeholder)}" oninput="${code}"></div>`;}

X.newTask=function(){
  const defaults=X.db.defaults||{},target=C.eligible('target').find(C.ready)||C.eligible('target')[0],meta=targetDefaults(target);
  X.selected=null;X.tab='create';
  X.wizard={step:1,name:'',description:'',model:target?.id||'',targetFamily:meta.family,targetVersion:meta.version,targetEnvironment:meta.environment,bankIds:[],bankId:'',methods:[],scenes:[],attacker:defaults.attacker||'',judge:defaults.judge||'',defenseMode:'existing',defensePrompt:'',blueInput:true,blueOutput:true,bluePolicy:'识别并拦截违反安全约束的输入或输出',maxRounds:4,concurrency:4};
  X.wizardModal();window.scrollTo({top:0,behavior:'instant'});
};
X.repeatTask=function(id,adjust){
  const t=X.db.tasks.find(row=>row.id===id);if(!t)return;X.newTask();
  const target=X.targetFor(t),meta=t.targetMeta||targetDefaults(target),bankIds=t.bankSnapshot?.bankIds||[t.bankSnapshot?.id].filter(id=>B.get(id));
  Object.assign(X.wizard,{parentId:id,name:t.name,description:t.description||'',model:C.db.some(m=>m.id===t.model)?t.model:'',targetFamily:meta.family||'',targetVersion:meta.version||'',targetEnvironment:meta.environment||'候选',bankIds,bankId:bankIds[0]||'',methods:(t.engine?.methods||[...new Set(t.units.map(u=>u.method))]).filter(id=>methodScene[id]),attacker:t.engine?.roles?.attacker?.id||X.db.defaults.attacker,judge:t.engine?.roles?.judge?.id||X.db.defaults.judge,defenseMode:t.defense?.mode||'existing',defensePrompt:t.defense?.prompt||'',blueInput:t.defense?.rules?.input!==false,blueOutput:t.defense?.rules?.output!==false,bluePolicy:t.defense?.policy||'识别并拦截违反安全约束的输入或输出',maxRounds:t.engine?.maxRounds||4,concurrency:t.engine?.concurrency||4,step:adjust?1:4});
  syncScenes(X.wizard);X.wizardModal();
};
X.wizardTarget=function(id){const w=X.wizard;w.model=id;const meta=targetDefaults(X.model(id));w.targetFamily=meta.family;w.targetVersion=meta.version;w.targetEnvironment=meta.environment;X.wizardModal();};
X.toggleBank=function(id){const w=X.wizard;w.bankIds=w.bankIds.includes(id)?w.bankIds.filter(x=>x!==id):[...w.bankIds,id];w.bankId=w.bankIds[0]||'';X.wizardModal();};
X.toggleMethod=function(id){const w=X.wizard;if(!methodScene[id])return;w.methods=w.methods.includes(id)?w.methods.filter(x=>x!==id):[...w.methods,id];syncScenes(w);X.reconcile?.();X.wizardModal();};

X.blueParts=d=>!d||d.mode==='existing'?[]:[d.mode];
X.blueLabel=d=>({existing:'基准防守',prompt:'系统提示词加固',rules:'输入/输出护栏'}[d?.mode]||'基准防守');
X.blueSnapshot=function(w){
  if(w.defenseMode==='prompt')return {mode:'prompt',parts:['prompt'],prompt:(w.defensePrompt||'').trim(),execution:'demo'};
  if(w.defenseMode==='rules')return {mode:'rules',parts:['rules'],prompt:'',rules:{keywords:[],input:w.blueInput!==false,output:w.blueOutput!==false},policy:(w.bluePolicy||'').trim(),execution:'demo'};
  return {mode:'existing',parts:[],prompt:'',execution:'demo'};
};
X.blueEditor=function(w){return `<div class="field"><label>防守方式</label><div class="blue-strategy-cards">${[
  ['existing','基准防守','不增加额外保护，仅验证靶标自身安全能力'],
  ['prompt','系统提示词加固','在靶标系统指令中增加明确的安全约束'],
  ['rules','输入/输出护栏','在模型调用前后设置独立检查位置']
].map(([id,name,desc])=>`<button type="button" class="blue-strategy-card ${w.defenseMode===id?'selected':''}" onclick="App.attack.wizard.defenseMode='${id}';App.attack.wizardModal()"><strong>${name}</strong><span>${desc}</span></button>`).join('')}</div></div>${w.defenseMode==='prompt'?`<div class="field"><label for="defense-prompt">安全系统指令 *</label><textarea id="defense-prompt" rows="4" oninput="App.attack.wizard.defensePrompt=this.value" placeholder="定义拒答边界、敏感信息保护与安全替代方式">${E(w.defensePrompt||'')}</textarea></div>`:''}${w.defenseMode==='rules'?`<div class="blue-guardrail-config"><div><strong>护栏位置</strong><span>当前 Demo 展示流程位置，不宣称真实防护模型已接入。</span></div><label><input type="checkbox" ${w.blueInput!==false?'checked':''} onchange="App.attack.wizard.blueInput=this.checked"> 输入护栏</label><label><input type="checkbox" ${w.blueOutput!==false?'checked':''} onchange="App.attack.wizard.blueOutput=this.checked"> 输出护栏</label></div><div class="field"><label for="blue-policy">护栏策略说明 *</label><textarea id="blue-policy" rows="3" oninput="App.attack.wizard.bluePolicy=this.value">${E(w.bluePolicy||'')}</textarea></div>`:''}`;};
X.validateBlue=function(w){if(w.defenseMode==='prompt'&&(!(w.defensePrompt||'').trim()||!X.canPrompt(X.model(w.model))))return '系统提示词加固需要填写安全指令，并选择支持系统指令的靶标';if(w.defenseMode==='rules'&&(w.blueInput===false&&w.blueOutput===false))return '输入/输出护栏至少选择一个执行位置';if(w.defenseMode==='rules'&&!(w.bluePolicy||'').trim())return '请填写护栏策略说明';return '';};
X.blueEvidenceHTML=d=>`<div class="kv"><span>蓝队防守</span><strong>${E(X.blueLabel(d))}</strong></div>${d?.mode==='prompt'?`<div class="kv"><span>安全系统指令</span><span>${E(d.prompt||'未记录')}</span></div>`:''}${d?.mode==='rules'?`<div class="kv"><span>护栏位置</span><span>${d.rules?.input?'输入 ':''}${d.rules?.output?'输出':''}</span></div><div class="kv"><span>策略说明</span><span>${E(d.policy||'未记录')}</span></div>`:''}`;

X.wizardModal=function(){
  const w=X.wizard,target=X.model(w.model),req=X.requirements(w.methods),banks=selectedBanks(w);let body='';
  const stepper=`<div class="exercise-steps">${['定义任务与靶标','选择题库与攻击方法','配置红队 / 蓝队 / 裁判','确认并启动'].map((name,i)=>`<div class="${w.step===i+1?'active':w.step>i+1?'done':''}"><b>${w.step>i+1?'✓':i+1}</b><span>${name}</span></div>`).join('')}</div>`;
  if(w.step===1){const candidates=C.eligible('target');body=`${w.parentId?`<div class="exercise-parent">基于 ${E(X.db.tasks.find(t=>t.id===w.parentId)?.name)} 再演练 · 自动保留上一轮配置</div>`:''}<section class="wizard-section"><h3>任务信息</h3>${field('task-name','任务名称 *',w.name,'App.attack.wizard.name=this.value','例如：客服模型候选版本安全演练')}<div class="field"><label for="task-description">任务描述</label><textarea id="task-description" rows="3" maxlength="1000" oninput="App.attack.wizard.description=this.value" placeholder="说明本轮验证目标或版本变化">${E(w.description)}</textarea></div></section><section class="wizard-section target-definition"><div class="wizard-section-head"><div><h3>被测靶标</h3><p>靶标是本次独立被测资产；系列与版本标签用于后续同方案对比。</p></div><span>在定义任务时锁定</span></div><div class="field"><label for="task-model">模型 / 智能体连接 *</label><select id="task-model" onchange="App.attack.wizardTarget(this.value)"><option value="">请选择靶标</option>${candidates.map(m=>`<option value="${E(m.id)}" ${m.id===w.model?'selected':''}>${E(m.name)} · ${E(m.model||m.kind||'API 服务')}</option>`).join('')}</select></div><div class="target-tag-grid">${field('target-family','系列标签 *',w.targetFamily,'App.attack.wizard.targetFamily=this.value','例如 Qwen2.5')}${field('target-version','版本标签 *',w.targetVersion,'App.attack.wizard.targetVersion=this.value','例如 72B-Instruct / r3')}<div class="field"><label for="target-environment">环境标签</label><select id="target-environment" onchange="App.attack.wizard.targetEnvironment=this.value">${['基线','候选','生产','测试'].map(v=>`<option ${w.targetEnvironment===v?'selected':''}>${v}</option>`).join('')}</select></div></div></section>`;}
  if(w.step===2)body=`<section class="wizard-section"><div class="wizard-section-head"><div><h3>演练题库 *</h3><p>可自主多选；启动时会合并并保存题库快照。</p></div><span>已选 ${banks.length} 个</span></div><div class="bank-multi-grid">${B.db.map(bank=>`<label class="bank-choice ${w.bankIds.includes(bank.id)?'selected':''}"><input type="checkbox" ${w.bankIds.includes(bank.id)?'checked':''} onchange="App.attack.toggleBank('${E(bank.id)}')"><span><strong>${E(bank.name)}</strong><small>${E(bank.source|| (bank.builtin?'内置 · OpenRT':'用户导入'))}</small></span></label>`).join('')}</div></section><section class="wizard-section"><div class="wizard-section-head"><div><h3>攻击方法 *</h3><p>按 OpenRT 官方攻击手段分类；当前只开放易落地的少量黑盒方法。</p></div><a href="https://ai45lab.github.io/OpenRT/OpenRT_Page_CN.html" target="_blank" rel="noopener noreferrer">OpenRT 分类参考 ↗</a></div><div class="openrt-techniques">${techniqueGroups.map(group=>`<article class="technique-group"><header><div><strong>${E(group.name)}</strong>${group.official?'<span>OpenRT</span>':'<span class="neutral">对照项</span>'}</div><p>${E(group.desc)}</p></header><div>${group.methods.map(method=>`<label class="technique-method ${w.methods.includes(method.id)?'selected':''}"><input type="checkbox" ${w.methods.includes(method.id)?'checked':''} onchange="App.attack.toggleMethod('${method.id}')"><span><strong>${E(M[method.id]?.label||method.id)} <small>${method.id}</small></strong><p>${E(method.desc)}</p></span><em>${E(method.mode)}</em></label>`).join('')}</div></article>`).join('')}</div><p class="exercise-note">未展示白盒方法及尚未接入的 OpenRT 方法，避免把“可配置”误解为“已实现”。</p></section>`;
  if(w.step===3)body=`<div class="role-config-grid"><section class="exercise-role red"><div class="exercise-role-title"><b>红队</b><h3>攻击执行</h3></div>${req.attacker?`<div class="field"><label for="task-attacker">攻击模型 *</label>${C.roleSelect('attacker',w.attacker,'task-attacker','App.attack.wizard.attacker=this.value')}</div><p class="exercise-note">PAIR 需要攻击模型根据反馈生成下一轮输入。</p>`:'<p class="role-ready">所选方法均由题库原文、本地模板或字符变换执行，无需额外攻击模型。</p>'}</section><section class="exercise-role blue"><div class="exercise-role-title"><b>蓝队</b><h3>防守方式</h3></div>${X.blueEditor(w)}</section><section class="exercise-role judge"><div class="exercise-role-title"><b>裁判</b><h3>裁判模型</h3></div><div class="field"><label for="task-judge">裁判模型 *</label>${C.roleSelect('judge',w.judge,'task-judge','App.attack.wizard.judge=this.value')}</div><p class="exercise-note">独立于被测靶标，对完整攻击证据做统一判定；PAIR 的过程判断默认复用该连接。</p></section></div>`;
  if(w.step===4){const count=banks.reduce((n,b)=>n+b.items.length,0),meta=`${w.targetFamily} · ${w.targetVersion} · ${w.targetEnvironment}`;body=`<div class="exercise-summary">${[['任务名称',w.name],['被测靶标',target.name],['靶标标签',meta],['演练题库',banks.map(b=>b.name).join('、')],['攻击方法',w.methods.map(id=>M[id]?.label||id).join('、')],['红队',req.attacker?X.model(w.attacker).name:'本地模板 / 变换'],['蓝队',X.blueLabel(X.blueSnapshot(w))],['裁判',X.model(w.judge).name]].map(([k,v])=>`<div class="kv"><span>${k}</span><strong>${E(v||'—')}</strong></div>`).join('')}</div>${X.blueEvidenceHTML(X.blueSnapshot(w))}<div class="exercise-total">计划测试 <strong>${count*w.methods.length}</strong> 个单元 <span>${count} 条题库样本 × ${w.methods.length} 种方法</span></div><div class="form-grid"><div class="field"><label for="engine-concurrency">并发测试单元</label><input id="engine-concurrency" type="number" min="1" max="8" step="1" value="${w.concurrency}" oninput="App.attack.wizard.concurrency=Number(this.value)"></div>${req.process?`<div class="field"><label for="engine-rounds">PAIR 最大轮数</label><input id="engine-rounds" type="number" min="1" value="${w.maxRounds}" oninput="App.attack.wizard.maxRounds=Number(this.value)"></div>`:''}</div><p class="exercise-note">当前为模拟执行，不调用真实模型、不消耗 Token；任务、靶标标签与角色配置将保存为快照。</p>`;}
  X.presentWizard(stepper+body+'<p id="wizard-error" class="error-message" role="alert"></p>',`<span class="muted">${w.step} / 4</span><div class="flex"><button class="btn" onclick="${w.step===1?"App.attack.setTab('tasks')":'App.attack.wizard.step--;App.attack.wizardModal()'}">${w.step===1?'取消':'上一步'}</button><button class="btn primary" onclick="App.attack.wizardNext()">${w.step===4?'启动模拟演练':'下一步'}</button></div>`);
};

X.taskValidation=function(w){
  if(!w.name.trim())return '请填写任务名称';if(w.name.length>100)return '任务名称不能超过 100 个字符';
  if(!C.db.some(m=>m.id===w.model))return '请选择被测靶标';if(!(w.targetFamily||'').trim())return '请填写靶标系列标签';if(!(w.targetVersion||'').trim())return '请填写靶标版本标签';if(w.step===1)return '';
  if(!selectedBanks(w).length)return '请至少选择一个演练题库';if(!w.methods.length)return '请至少选择一种攻击方法';if(w.methods.some(id=>!methodScene[id]))return '存在当前未开放的攻击方法';if(w.step===2)return '';
  const blueError=X.validateBlue(w);if(blueError)return blueError;const req=X.requirements(w.methods);if(!C.eligible('judge').some(m=>m.id===w.judge))return '请选择裁判模型';if(req.attacker&&!C.eligible('attacker').some(m=>m.id===w.attacker))return '请选择攻击模型';if(w.step===3)return '';
  if(!Number.isSafeInteger(w.concurrency)||w.concurrency<1||w.concurrency>8)return '并发测试单元需为 1–8 的整数';if(req.process&&(!Number.isSafeInteger(w.maxRounds)||w.maxRounds<1))return 'PAIR 最大轮数需为大于 0 的整数';return '';
};
X.wizardNext=function(){
  const w=X.wizard,error=X.taskValidation(w);if(error){const node=document.getElementById('wizard-error');if(node)node.textContent=error;return;}if(w.step<4){w.step++;X.wizardModal();return;}
  const banks=selectedBanks(w),items=banks.flatMap(bank=>bank.items.map(item=>({...clone(item),id:`${bank.id}::${item.id}`,sourceBankId:bank.id,sourceBankName:bank.name}))),req=X.requirements(w.methods),target=X.model(w.model),judge=X.model(w.judge),attacker=req.attacker?X.model(w.attacker):null;
  syncScenes(w);const engine={attacker:attacker?attacker.name:'本地模板 / 变换',judge:judge.name,concurrency:w.concurrency,maxRounds:req.process?w.maxRounds:1,methods:[...w.methods],roles:{attacker:X.connectionSnapshot(attacker),judge:X.connectionSnapshot(judge)},evaluationVersion:'unified-v1',bindings:w.methods.map(id=>({method:id,registry:X.methodInfo[id][0],generator:M[id].gen?attacker?.id||null:null,judge:judge.id}))};
  const task=X.makeTask(w.name.trim(),w.model,w.scenes,'dataset',items.length,engine);task.id='EV-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);task.description=w.description.trim();task.defense=X.blueSnapshot(w);task.targetSnapshot=X.connectionSnapshot(target);task.targetMeta={family:w.targetFamily.trim(),version:w.targetVersion.trim(),environment:w.targetEnvironment||'候选'};task.bankSnapshot={id:'multi:'+banks.map(b=>b.id).join('+'),bankIds:banks.map(b=>b.id),name:banks.map(b=>b.name).join(' + '),sources:banks.map(b=>({id:b.id,name:b.name,count:b.items.length})),items};task.units.forEach((unit,i)=>{unit.questionId=items[i%items.length].id;unit.rounds=M[unit.method].process?w.maxRounds:1;});
  const parent=X.db.tasks.find(t=>t.id===w.parentId);task.parentId=parent?.id||null;task.seriesId=parent?.seriesId||parent?.id||task.id;task.iteration=parent?Math.max(...X.db.tasks.filter(t=>(t.seriesId||t.id)===task.seriesId).map(t=>t.iteration||1))+1:1;task.changeSummary=parent?X.changes(parent,task).join('、')||'配置不变，再次运行':'首次演练';task.simulated=true;X.db.tasks.unshift(task);A.save();X.showArena(task.id);A.toast('模拟攻防任务已启动');
};

const previousCompact=X.compactConfigHTML;
X.compactConfigHTML=function(t){
  const target=X.targetFor(t),meta=t.targetMeta,methods=[...new Set(t.units.map(u=>M[u.method]?.label||u.method))];
  const d=t.defense||{},input=d.guardType==='rules'?d.rules?.input:d.modelInput,output=d.guardType==='rules'?d.rules?.output:d.modelOutput;
  const position=[input!==false?'输入':'',output!==false?'输出':''].filter(Boolean).join(' / ');
  return `<section class="task-config-strip"><div><span>被测靶标</span><strong>${E(target.name)}</strong><small>${meta?`系列 ${E(meta.family)} · 版本 ${E(meta.version)}`:''}</small></div><div><span>红队</span><strong>${E(t.engine?.roles?.attacker?.name||t.engine?.attacker||'本地模板 / 变换')}</strong><small>${methods.slice(0,2).map(E).join('、')}${methods.length>2?` 等 ${methods.length} 种`:''}</small></div><div><span>蓝队</span><strong>${E(X.blueLabel(t.defense))}</strong><small>${d.mode==='guard'?position+'安全检测':d.mode==='prompt'?'系统指令约束':'靶标原生安全能力'}</small></div><div><span>裁判</span><strong>${E(t.engine?.roles?.judge?.name||t.engine?.judge||'--')}</strong><small>${E(t.bankSnapshot?.name||'内置题库')} · ${t.units.length} 单元</small></div></section>`;
};
const previousReport=X.report;
X.report=function(t,m){return previousReport(t,m).replaceAll('场景风险趋势','攻击方法风险趋势').replaceAll('最高场景','最高方法').replaceAll('个场景','种攻击方法').replaceAll('场景防御表现','攻击方法防御表现').replaceAll('有效评价','有效判定').replaceAll('评价覆盖率','判定覆盖率');};
const previousUnitContent=X.unitContent;
X.unitContent=function(t,u){const content=previousUnitContent(t,u);return {...content,verdict:String(content.verdict||'').replaceAll('评价确认','裁判确认').replaceAll('有效评价','有效判定')};};
const previousTick=X.tick;
X.tick=function(){const changed=previousTick();if(changed)for(const task of X.db.tasks)for(const unit of task.units)if(unit.verdict)unit.verdict=unit.verdict.replaceAll('评价确认','裁判确认').replaceAll('有效评价','有效判定');return changed;};
const consistentTerms=html=>String(html).replaceAll('最终 Judge','最终裁判').replaceAll('Judge 模型','裁判模型').replaceAll('Judge 评价','裁判判定').replaceAll('评价模型','裁判模型').replaceAll('最终评价确认','最终裁判确认').replaceAll('评价确认','裁判确认').replaceAll('评价结果','裁判结果').replaceAll('评价结论','裁判结论').replaceAll('有效评价','有效判定').replaceAll('评价覆盖率','判定覆盖率').replaceAll('统一评价','统一判定').replaceAll('独立评价','独立判定').replaceAll(' Judge',' 裁判');
const renderAttack=A.modules.attack.render;
A.modules.attack.render=function(){return consistentTerms(renderAttack.call(this));};
const rawModal=A.modal,rawDrawer=A.drawer;
A.modal=function(title,body,footer,opts){return rawModal.call(A,A.page==='attack'?consistentTerms(title):title,A.page==='attack'?consistentTerms(body):body,A.page==='attack'?consistentTerms(footer||''):footer,opts);};
A.drawer=function(title,body,footer){return rawDrawer.call(A,A.page==='attack'?consistentTerms(title):title,A.page==='attack'?consistentTerms(body):body,A.page==='attack'?consistentTerms(footer||''):footer);};
const rawReportHTML=X.reportHTML;
X.reportHTML=function(){return consistentTerms(rawReportHTML());};
})();
