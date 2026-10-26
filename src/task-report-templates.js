/* Task-level report templates reuse recorded analysis and immutable run evidence. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape;
const array=value=>Array.isArray(value)?value:[];
const text=value=>value===null||value===undefined?'':String(value);
const missing=value=>text(value)||'未记录';
const clip=(value,length=100)=>{const s=text(value);return s.length>length?s.slice(0,length)+'…':s;};
const status=value=>({breach:'已攻破',defended:'已守住',error:'执行异常',pending:'待判定'}[value]||'未记录');
const templateId=value=>typeof value==='string'?value:value?.id;
const policy=task=>task.runSnapshot?.policySnapshot||task.runSnapshot?.policy||task.policySnapshot||{};
const methods=task=>array(policy(task).methods).length?array(policy(task).methods):array(task.engine?.bindings);
const bank=task=>task.runSnapshot?.bankSnapshot||policy(task).bankSnapshot||task.bankSnapshot||{};
const R=A.taskReports={
 templates:[
  {id:'capability',name:'攻防结果报告（简版）',description:'包含任务配置、攻破数据、核心发现、风险场景、攻击方法与建议，不含攻防明细附录。'},
  {id:'process',name:'攻防结果报告（含明细）',description:'包含简版全部内容，并附攻防明细附录。'}
 ],
 defaultId:'capability',
 normalize(task){const id=templateId(task?.runSnapshot?.reportTemplate)||templateId(task?.reportTemplate);return R.templates.find(row=>row.id===id)||R.templates[0];},
 judgement(task){return task.runSnapshot?.judgement||policy(task).judgement||task.judgementSnapshot||{};},
 question(task,unit){return array(bank(task).items).find(q=>String(q.id)===String(unit.questionId))||null;},
 source(question){
  const original=typeof question?.source==='object'?question.source?.name||question.source?.dataset||question.source?.id||question.source?.url||'':question?.source||'';
  const sourceBank=question?.sourceBankName?question.sourceBankName+(question.sourceBankId?'（'+question.sourceBankId+'）':''):question?.sourceBankId||'';
  return original&&sourceBank?original+' · 题库：'+sourceBank:original||sourceBank||'未记录';
 },
 labelsHTML(labels){
  if(!labels||typeof labels!=='object'||!Object.keys(labels).length)return '<p class="task-report-record-meta">过程标签：历史任务未记录</p>';
  const names={method:'攻击方法',sourceBankId:'来源题库编号',questionId:'题目编号',policyId:'策略编号',policyVersion:'策略版本',runVersion:'执行序号',methodVersion:'方法版本',result:'判定标签'};
  return `<p class="task-report-record-meta">过程标签：${Object.entries(labels).filter(([key])=>!['policyVersion','methodVersion','runVersion'].includes(key)).map(([key,value])=>E(names[key]||key)+'：'+E(typeof value==='object'?JSON.stringify(value):text(value))).join(' · ')}</p>`;
 },
 tags(question){
  const out=[];
  if(A.sceneTags?.resolve&&A.sceneTags?.label){try{for(const id of A.sceneTags.resolve(question)||[])out.push(A.sceneTags.label(id,question));}catch(error){}}
  if(out.length)return out;
  for(const value of [...array(question?.riskTags),...array(question?.tags)]){const label=typeof value==='string'?value:value?.label||value?.name||value?.id;if(label&&!out.includes(label))out.push(label);}

  return out;
 },
 snapshotHTML(task,exported=false){
  const p=policy(task),j=R.judgement(task),target=task.runSnapshot?.targetSnapshot||task.runSnapshot?.target||task.targetSnapshot||{},judge=j.model||task.engine?.roles?.judge||{},template=R.normalize(task);
  const threshold=j.threshold!==undefined&&j.threshold!==null?String(j.threshold)+' / 5':task.engine?.judgeThreshold!==undefined?String(task.engine.judgeThreshold)+' / 5':'未记录';
  const rows=[['报告模板',template.name],['任务创建时间',missing(task.created)],['任务编号',missing(X.taskNumber(task.id))],['执行序号','第 '+(task.runVersion||task.runSnapshot?.runVersion||task.iteration||1)+' 次执行'],['复测来源',X.taskNumber(task.parentId||task.sourceTaskId||task.runSnapshot?.parentId)||'首次运行'],['攻击策略',p.name||'历史任务配置'],['靶标模型',target.name||target.model||task.modelName||'未记录'],['攻击内容',missing(bank(task).name)],['红队模型',task.runSnapshot?.attacker?.name||task.engine?.roles?.attacker?.name||task.engine?.attacker||'未记录'],['防守方式',X.blueLabel?.(task.runSnapshot?.defense||task.defense)||'未记录'],['护栏模型',task.runSnapshot?.defense?.model?.name||task.defense?.model?.name||'未启用'],['裁判模型',judge.name||judge.model||task.engine?.roles?.judge?.name||task.engine?.judge||j.modelId||'未记录'],['并发数',task.runSnapshot?.concurrency??task.engine?.concurrency??'未记录']];
  for(const [id,entry] of Object.entries(X.methodModelsFor?.(task)||{}))for(const [key,model] of Object.entries(entry.modelSnapshots||{}))rows.push([(methods(task).find(m=>m.id===id)?.name||id)+' · '+(X.methodSlots?.({id}).find(s=>s.key===key)?.label||key),model?.name||model?.model||'未记录']);
  const methodRows=methods(task).map(method=>{const label=method.label||X.methodDependencies?.[method.id||method.method]?.label||method.id||method.method||'未记录',parameters=method.parameters||{};return `<tr><th>${E(label)}</th><td><pre>${E(Object.keys(parameters).length?JSON.stringify(parameters,null,2):'无额外参数记录')}</pre>${method.template?`<p>攻击模板</p><pre>${E(method.template)}</pre>`:''}</td></tr>`;}).join('');
  const inner=`<table class="task-report-config"><tbody>${rows.map(([label,value])=>`<tr><th>${E(label)}</th><td>${E(text(value))}</td></tr>`).join('')}</tbody></table>${j.promptTemplate?'':`<h4>裁判规则</h4><pre>${E(j.rule||task.engine?.judgeRule||'历史任务未保存裁判规则正文')}</pre>`}<h4>攻击方法参数</h4><table class="task-report-config"><tbody>${methodRows||'<tr><td>历史任务未保存方法参数</td></tr>'}</tbody></table>`;
  return exported?`<section class="task-report-snapshot"><h2>任务配置快照</h2>${inner}</section>`:`<details class="task-report-snapshot" ${template.id==='process'?'open':''}><summary>任务配置快照 · ${E(p.name||'历史任务配置')}</summary>${inner}</details>`;
 },
 tagsHTML(task,exported=false){
  const questions=array(bank(task).items),rows=questions.map(q=>`<tr><td>${E(missing(q.id))}</td><td>${E(exported?missing(q.prompt):clip(q.prompt))}</td><td>${E(R.tags(q).join('、')||'未标注')}</td><td>${E(R.source(q))}</td></tr>`).join('');
  const table=`<div class="task-report-table-wrap"><table class="task-report-record-table"><thead><tr><th>题目编号</th><th>原始题目</th><th>场景 / 风险标签</th><th>来源</th></tr></thead><tbody>${rows||'<tr><td colspan="4">历史任务未保存题目快照</td></tr>'}</tbody></table></div>`;
  return exported?`<section class="task-report-tags"><h2>攻击内容与标签明细</h2>${table}</section>`:`<details class="task-report-tags"><summary>攻击内容与标签明细 · ${questions.length} 题</summary>${table}</details>`;
 },
 evidenceHTML(task,exported=false){
  const units=array(task.units),items=units.map((unit,index)=>{
   const q=R.question(task,unit),history=array(unit.roundHistory),rounds=history.length?history:unit.result==='pending'?[]:[{round:unit.currentRound||1,prompt:unit.attackPrompt||unit.seedPrompt,response:unit.response,rawResponse:unit.rawResponse,verdict:unit.verdict,result:unit.result,score:unit.score,blueEvidence:unit.blueEvidence,blueBlocked:unit.blueBlocked,finalOnly:true}];
   const content=`<p class="task-report-record-meta">题目：${E(unit.questionId||'未记录')} · 攻击方法：${E(X.methodDependencies?.[unit.method]?.label||unit.method||'未记录')} · 场景 / 风险标签：${E(R.tags(q).join('、')||'未标注')}</p>${R.labelsHTML(unit.dataLabels)}<dl><div><dt>原始题目</dt><dd>${E(q?.prompt||unit.seedPrompt||'未记录')}</dd></div></dl>${rounds.map(round=>{
    const guards=array(round.blueEvidence),roundResult=round.result||unit.result,rawResponse=round.blueBlocked==='input'?'输入护栏拦截，未调用靶标':round.rawResponse||round.response||'未记录',guardRows=guards.map(row=>`<tr><td>${E(row.node==='input'?'输入护栏':row.node==='output'?'输出护栏':row.node||'未记录')}</td><td>${E(row.method||row.model||'未记录')}</td><td>${E(row.action||'未记录')}</td><td>${E(row.reason||'未记录')}</td></tr>`).join('');
    return `<section class="task-report-round"><h4>第 ${E(text(round.round||1))} 轮${round.finalOnly?' · 仅保存最终记录':''}</h4>${round.dataLabels?R.labelsHTML(round.dataLabels):''}<dl><div><dt>攻击输入</dt><dd>${E(round.prompt||'未记录')}</dd></div><div><dt>靶标原始响应</dt><dd>${E(rawResponse)}</dd></div><div><dt>最终交付内容</dt><dd>${E(round.response||'未记录')}</dd></div><div><dt>判定结果</dt><dd>${E(status(roundResult))}${round.score!==undefined&&round.score!==null?' · 评分 '+E(text(round.score))+' / 5':''}</dd></div><div><dt>裁判依据</dt><dd>${E(round.verdict||'未记录')}</dd></div></dl>${guardRows?`<table class="task-report-guard-table"><thead><tr><th>阶段</th><th>护栏</th><th>处理</th><th>依据</th></tr></thead><tbody>${guardRows}</tbody></table>`:''}</section>`;
   }).join('')}${!rounds.length?`<p class="task-report-caption">暂无已保存轮次；${array(unit.events).length||unit.attackPrompt?'当前攻击仍在执行。':'本单元尚未执行。'}</p>${unit.attackPrompt?`<dl><div><dt>当前攻击输入</dt><dd>${E(unit.attackPrompt)}</dd></div>${unit.response?`<div><dt>当前交付内容</dt><dd>${E(unit.response)}</dd></div>`:''}</dl>`:''}`:''}`;
   return exported?`<article class="task-report-record"><h3>${index+1}. ${E(unit.id||'编号未记录')} · ${E(status(unit.result))}</h3>${content}</article>`:`<details class="task-report-record" ${index===0?'open':''}><summary>${E(unit.id||'编号未记录')} · ${E(status(unit.result))} · ${rounds.length?rounds.length+' 轮已保存记录':'暂无已保存轮次'}</summary>${content}</details>`;
  }).join('');
  return `<section class="task-report-process"><${exported?'h2':'h3'}>完整攻击过程明细</${exported?'h2':'h3'}><p class="task-report-caption">展示任务中保存的 ${units.length} 个测试单元；异常和待判定记录保留，不计入攻击成功率分母。</p>${items||'<p>暂无攻击过程记录。</p>'}</section>`;
 }
};
const report=X.report,reportHTML=X.reportHTML;
X.report=function(task){
 const template=R.normalize(task),base=report.apply(X,arguments).replace(/<h2>[^<]*<\/h2>/,`<h2>${E(template.name)}</h2>`);
 return `<div class="task-template-report" data-report-template="${template.id}"><p class="task-report-template-note">${E(template.description)}</p>${R.snapshotHTML(task)}${base}${R.tagsHTML(task)}${template.id==='process'?R.evidenceHTML(task):''}</div>`;
};
X.reportHTML=function(){
 const task=X.task;if(!task)return reportHTML.apply(X,arguments);const template=R.normalize(task),base=reportHTML.apply(X,arguments),additional=R.snapshotHTML(task,true)+R.tagsHTML(task,true)+(template.id==='process'?R.evidenceHTML(task,true):'');
 const style=`.task-report-snapshot,.task-report-tags,.task-report-process{margin:20px 0;padding:16px 0;border-top:1px solid #dfe6ee}.task-report-config th{width:140px}.task-report-config pre,.task-report-snapshot>pre{white-space:pre-wrap;overflow-wrap:anywhere;margin:6px 0;font:13px/1.7 Consolas,monospace}.task-report-record{margin:16px 0;border-top:1px solid #dfe6ee;padding:14px 0}.task-report-record-meta,.task-report-caption{font-size:12px;color:#64748b}.task-report-record dl>div{display:flex;gap:14px;margin:6px 0}.task-report-record dt{width:100px;flex-shrink:0;color:#64748b}.task-report-record dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.task-report-record-table td{white-space:pre-wrap;overflow-wrap:anywhere}.task-report-round{padding:10px 0}.task-report-guard-table{font-size:12px}@media print{.task-report-round{break-inside:avoid}.task-report-record{break-inside:auto}}`;
 return base.replace(/<title>[\s\S]*?<\/title>/,`<title>${E(task.name)} · ${E(template.name)}</title>`).replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${E(task.name)} · ${E(template.name)}</h1>`).replace('</head>',`<style>${style}</style></head>`).replace('<footer>',additional+'<footer>');
};
})();

