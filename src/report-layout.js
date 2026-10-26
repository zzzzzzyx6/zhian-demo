/* One report body for preview, HTML, print and Word-compatible exports. */
(function(){
'use strict';
const A=window.App,X=A.attack,R=A.taskReports,E=A.escape,H=X.reportParts;
const list=v=>Array.isArray(v)?v:[],text=v=>v==null?'':typeof v==='object'?JSON.stringify(v,null,2):String(v);
const saved=v=>v==null?'未记录':text(v)===''?'（空内容）':text(v);
const resultName=v=>({breach:'已攻破',defended:'未攻破',error:'异常终止',pending:'待判定'}[v]||'未记录');
const modelName=m=>typeof m==='string'?m:m?.name||m?.model||'未记录';
const methodName=m=>m.label||m.name||X.methodDependencies?.[m.id||m.method]?.label||m.id||m.method||'未记录';
const policy=t=>t.runSnapshot?.policySnapshot||t.runSnapshot?.policy||t.policySnapshot||{};
const bank=t=>t.runSnapshot?.bankSnapshot||policy(t).bankSnapshot||t.bankSnapshot||{};
const view=t=>({...t,policySnapshot:policy(t),bankSnapshot:bank(t),defense:t.runSnapshot?.defense||t.defense});
const demo=t=>t.simulated===true||t.simulation===true||t.resultSource==='offline-case'||t.resultSource==='simulation';
const styles=`
.report-layout{color:#25364c;line-height:1.8}.report-layout .analysis-report-title{padding:20px 0 15px}.report-layout .analysis-report-title h2{margin:0;font-size:21px}.report-layout .report-meta{font-size:13px;color:#718096;margin:8px 0 16px}.report-layout .report-demo-note{font-size:13px;color:#826b4b;background:#fff9ef;padding:9px 12px;margin:10px 0 16px;border-left:3px solid #d8ad6d}
.report-layout .analysis-section{margin:0;padding:8px 0 20px;border:0;border-top:1px solid #e5eaf0;background:#fff;overflow:visible}.report-layout .analysis-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0 12px}.report-layout .analysis-section-head h3{margin:0;font-size:16px;font-weight:600}.report-layout .analysis-section-head>span,.report-layout .report-caption{font-size:12px;color:#718096}.report-layout .report-caption{margin:8px 0;line-height:1.8}
.report-layout .report-config{width:100%;table-layout:fixed;border-collapse:collapse;font-size:13px}.report-layout .report-config th,.report-layout .report-config td{border:1px solid #e3e9f0;padding:10px 12px;vertical-align:top;white-space:normal;overflow-wrap:anywhere}.report-layout .report-config th{width:16%;background:#f6f8fb;font-weight:500;color:#69798f;text-align:left}.report-layout .report-config td{width:34%;color:#344b69}.report-layout .report-config pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.8 Consolas,monospace}
.report-layout .result-digest{grid-template-columns:140px minmax(0,1fr);gap:32px;padding:12px 0}.report-layout .digest-results{max-width:640px}.report-layout .report-prose{margin:0;padding:0;list-style:none}.report-layout .report-prose li{padding:10px 0}.report-layout .report-prose h4{margin:0 0 5px;font-size:14px;font-weight:600}.report-layout .report-prose p{margin:0;font-size:13px;color:#64748b;line-height:1.9}
.report-layout .report-appendix-entry{border-top:1px solid #e5eaf0;margin:16px 0 0;padding:16px 0 4px}.report-layout .report-appendix-entry h4{margin:0 0 14px;font-size:16px;font-weight:600;color:#344b69}.report-layout .report-appendix-entry dl{margin:0}.report-layout .report-appendix-entry dl>div{display:grid;grid-template-columns:110px minmax(0,1fr);gap:16px;padding:7px 0;font-size:13px}.report-layout .report-appendix-entry dt{color:#718096}.report-layout .report-appendix-entry dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;color:#344b69}.report-layout .report-appendix-entry .report-verdict{font-weight:600}.report-layout .report-footer{border-top:1px solid #e5eaf0;margin:18px 0 0;padding-top:14px;color:#718096;font-size:12px}
@media(max-width:650px){.report-layout .result-digest{grid-template-columns:95px minmax(0,1fr);gap:16px}.report-layout .report-config th,.report-layout .report-config td{padding:8px;font-size:12px}.report-layout .report-appendix-entry dl>div{grid-template-columns:1fr;gap:3px}.report-layout .analysis-section-head{align-items:flex-start}.report-layout .analysis-section-head>span{max-width:45%;text-align:right}}
@media print{.report-layout .report-export{display:none}.report-layout .report-config tr{break-inside:avoid}.report-layout .analysis-section{break-inside:auto}.report-layout .report-appendix-entry{break-inside:auto}.report-layout .report-appendix-entry dl>div{break-inside:auto}.report-layout h3,.report-layout h4,.report-layout dt{break-after:avoid}.report-layout .report-appendix-entry dd{orphans:3;widows:3}}
`;
// Only explicitly selected configuration values are exported, never model connection objects.
function safeParameters(value){
 if(Array.isArray(value))return value.map(safeParameters);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([k])=>!(/^(api[_-]?key|key|secret|token|access[_-]?token|authorization|password|credentials?|headers|success_threshold|break_score)$/i.test(k))).map(([k,v])=>[k,safeParameters(v)]));
 return value;
}
function configuredMethods(t){
 const m=list(policy(t).methods);if(m.length)return m;
 const bindings=list(t.engine?.bindings);return bindings.length?bindings:list(t.engine?.methods).map(id=>({id}));
}
function configHTML(t,a){
 const s=t.runSnapshot||{},p=policy(t),b=bank(t),j=R.judgement(t),methods=configuredMethods(t),defense=s.defense||t.defense||{};
 const target=s.targetSnapshot||s.target||t.targetSnapshot||{},sources=list(b.sources),bankNames=sources.length?sources.map(row=>row.name||row.id).join('、'):b.name||'未记录';
 const rows=[
  ['任务名称',t.name||'未记录'],['任务编号',X.taskNumber?.(t.id)||t.id||'未记录'],
  ['任务状态',({running:'进行中',done:'已完成',stopped:'已终止',error:'异常终止'}[t.status]||'等待中')],['任务创建时间',t.created||'未记录'],
  ['开始时间',t.startedAt||'未记录'],['结束时间',t.finishedAt||t.finished||'未记录'],
  ['靶标',modelName(target)],['红队模型',modelName(s.attacker||t.engine?.roles?.attacker||t.engine?.attacker)],
  ['攻击策略',p.name||'历史任务配置'],['攻击方法',methods.map(methodName).join('、')||'未记录'],
  ['攻击题库',bankNames],['题目范围',`${list(b.items).length} 道已保存题目`],
  ['防守方式',X.blueLabel?.(defense,true)||'未记录'],['护栏模型',defense.model?modelName(defense.model):'未启用独立护栏'],
  ['裁判模型',modelName(j.model||t.engine?.roles?.judge||t.engine?.judge||j.modelId)],
  ['并发数',s.concurrency??t.engine?.concurrency??'未记录'],['完成情况',`${a.done} / ${a.total} 个测试单元`],
  ['任务说明',t.description||'未记录']
 ];
 const models=s.methodModels||(t.runSnapshot?Object.fromEntries(methods.filter(m=>m.modelSnapshots).map(m=>[m.id||m.method,{modelSnapshots:m.modelSnapshots}])):X.methodModelsFor?.(t))||{};
 for(const [id,entry] of Object.entries(models))for(const [key,m] of Object.entries(entry.modelSnapshots||{}))rows.push([methodName(methods.find(m=>(m.id||m.method)===id)||{id})+' · '+(X.methodSlots?.({id})?.find(slot=>slot.key===key)?.label||key),modelName(m)]);
 let table='';
 for(let i=0;i<rows.length;i+=2)table+=`<tr>${rows.slice(i,i+2).map(([k,v])=>`<th scope="row">${E(k)}</th><td>${E(text(v))}</td>`).join('')}${!rows[i+1]?'<td colspan="2"></td>':''}</tr>`;
 const params=methods.map(m=>{
  const parameters=safeParameters(m.parameters||{}),body=Object.keys(parameters).length?JSON.stringify(parameters,null,2):'默认配置，无额外参数';
  return `<tr><th scope="row">${E(methodName(m))} · 方法参数</th><td colspan="3"><pre>${E(body)}${m.template?'\n攻击模板：\n'+E(m.template):''}</pre></td></tr>`;
 }).join('');
 return section('任务配置信息',`<table class="report-config"><tbody>${table}${params}</tbody></table>`,'report-config-section');
}
function findings(a){
 const out=[];
 if(a.primaryScene)out.push([`「${a.primaryScene.label}」存在安全边界失守`, '该场景已出现满足原始不安全目标的交付内容，是本次测试中需要优先关注的风险。具体触发条件可结合任务记录中的响应与判定依据核对。']);
 else if(a.breach)out.push(['已发现安全边界失守','部分最终交付内容满足原始不安全目标；由于场景信息不足，暂不归因到具体场景。']);
 else if(a.valid)out.push(['本次已测范围内未发现攻破','有效判定中的最终交付内容保持了本次配置的安全边界，结论限于已执行的题目、方法与判定规则。']);
 else out.push(['当前尚无有效结论','尚未取得可用于判断安全边界的有效结果。']);
 const leading=[...a.methods].filter(m=>m.breach).sort((l,r)=>r.breach-l.breach)[0];
 if(leading)out.push([`${leading.label} 下仍存在风险暴露`,'该方法产生了攻破结果，说明当前防守未能稳定拒绝相关请求；需要结合原题与最终交付内容定位失守原因。']);
 if(a.errors)out.push(['执行异常造成覆盖缺口','部分执行未取得有效判定，不能按安全或攻破处理，也不计入攻击成功率分母。']);
 if(a.pending)out.push(['测试覆盖尚未完成','未完成单元尚无最终结论，当前发现仅覆盖已有有效判定。']);
 if(a.unclassifiedSceneQuestions||a.unknownQuestionUnits)out.push(['部分结果缺少场景归属','相关结果保留在总体统计中；补充题目关联与场景标签后才能纳入场景比较。']);
 return out;
}
const guidance={
 'national-security':'完善国家安全与社会秩序相关内容的识别与拒绝规则，区分正常知识问答与煽动、宣扬或实质性协助。',
 'violence-danger':'加强对伤害意图、危险物质与武器相关请求的判断，拒绝提供可执行的伤害指导，并引导至应急求助或安全知识。',
 'contraband-trade':'识别违禁品获取、非法交易和规避监管意图，拒绝交易指导，并提供合法合规的处理渠道。',
 'cyber-abuse':'将权限与工具访问校验交给业务系统，限制未经授权的操作，保留合法防御场景的帮助能力。',
 'privacy-secrets':'完善敏感信息识别、访问授权和脱敏规则，防止个人信息、凭据与商业秘密进入最终交付。',
 'fraud-manipulation':'加强对冒充、欺诈和恶意操纵意图的识别，避免生成可直接用于误导受众的交付内容。'
};
function recommendations(a,t){
 const out=[];
 if(a.primaryScene)out.push([`优先加固「${a.primaryScene.label}」`,guidance[a.primaryScene.id]||'围绕该场景的攻破样本补充识别和拒绝规则，明确业务允许的回答边界，并验证最终交付内容。']);
 if(a.breach)out.push(['建立攻破样本回归集','将已确认的原题、攻击方法和判定依据纳入回归测试；加固后使用相同配置复测，并比较场景与方法的攻击成功率。']);
 else if(a.valid)out.push(['扩大对抗覆盖','在现有题库基础上补充不同表达、跨轮追问和业务边界样本，持续验证安全边界。']);
 if(t.defense?.model||t.defense?.mode==='guard')out.push(['核对护栏处理链路','分别检查输入侧与输出侧的检测、拦截回复及放行结果，确认最终交付内容与业务策略一致。']);
 if(a.errors)out.push(['补齐异常覆盖',a.errorGroups.map(g=>g.advice).join(' ')]);
 if(a.unclassifiedSceneQuestions||a.unknownQuestionUnits)out.push(['完善场景归属','补齐原题关联和场景标签，避免把未分类结果误解为相关场景没有风险。']);
 if(!out.length)out.push(['完成执行与判定','先取得有效结果，再分析薄弱场景并安排加固与回归。']);
 return out;
}
const section=(title,body,cls='')=>`<section class="analysis-section ${cls}"><header class="analysis-section-head"><h3>${E(title)}</h3></header>${body}</section>`;
const prose=rows=>`<ul class="report-prose">${rows.map(([title,body])=>`<li><h4>${E(title)}</h4><p>${E(body)}</p></li>`).join('')}</ul>`;
function guardText(s,t){
 if(!s.guards.length)return '未配置独立输入侧或输出侧护栏。';
 return s.guards.map(g=>{
  const name=g.stage==='input'?'输入侧':'输出侧';
  if(g.state.startsWith('已跳过'))return `${name}：输入侧已拦截，本阶段未执行。`;
  if(!g.records.length)return `${name}：已配置，未保存处理记录；蓝队响应内容未记录。`;
  return g.records.map(e=>{
   const blocked=e.action==='拦截',delivery=e.outputContent??(blocked&&s.deliverySource.startsWith(g.stage==='input'?'输入':'输出')?s.deliveredResponse:null);
   const output=e.rawOutput??e.output??e.modelResult?.rawOutput??e.modelResult??null;
   return `${name} · ${modelName(e.method||e.model||t.defense?.model)}\n处理：${saved(e.action)}${e.label?' · '+text(e.label):''}\n依据：${saved(e.reason)}\n蓝队响应内容：${saved(output)}\n护栏交付内容：${saved(delivery)}`;
  }).join('\n\n');
 }).join('\n\n');
}
function appendixHTML(task){
 const t=view(task);
 const ER=A.evaluationRecords,units=list(t.units).filter(u=>ER.started(u)),entries=units;
 const fields=rows=>`<dl>${rows.map(([label,value])=>`<div><dt>${E(label)}</dt><dd${label==='判定结果'?' class="report-verdict"':''}>${E(saved(value))}</dd></div>`).join('')}</dl>`;
 const body=entries.map((u,index)=>{
  const q=R.question(t,u),last=ER.roundEntries(u).at(-1)?.record||{result:u.result},r={...last};
  if(r.result===u.result){if(r.score==null)r.score=u.score;if(r.verdict==null)r.verdict=u.verdict;}
  const s=ER.roundSummary(t,u,r),score=Number(s.score),validScore=s.score!==null&&Number.isInteger(score)&&score>=1&&score<=5;
  return `<article class="report-appendix-entry"><h4>${index+1}.</h4>${fields([
   ['原始题目',q?.prompt||u.seedPrompt||null],['场景标签',R.tags(q).join('、')||'未标注'],
   ['靶标原始响应',s.rawResponseNote||s.rawResponse],['最终交付内容',s.deliveredResponse],
   ['蓝队处理',guardText(s,t)],['判定结果',(validScore?score+'/5':'评分未记录')+' '+resultName(s.result)],
   ['判定依据',s.reason||s.error]
  ])}</article>`;
 }).join('');
 return section('附录：攻防明细',`<p class="report-caption">按执行顺序展示全部 ${entries.length} 条已执行记录。${demo(t)?'以下为离线演示记录，响应内容采用模拟摘要。':''}</p>${body||'<p class="report-caption">暂无已保存的攻防明细。</p>'}`,'report-appendix');
}
const L=A.reportLayout={configHTML,appendixHTML,styles};
L.body=function(task,variant='process'){
 const t=view(task),a=X.taskAnalysis(t);
 return configHTML(t,a)+section('攻破数据',H.metricsHTML(a,t,false,false)+`<p class="report-caption">ASR = 攻破 / 有效判定；异常与待判定不计入分母。</p>`,'report-results')+
 section('核心发现',prose(findings(a)),'report-findings')+H.scenesHTML(a,true)+H.methodsHTML(a)+
 section('下一步建议',prose(recommendations(a,t)),'report-next-steps')+(variant==='process'?appendixHTML(t):'');
};
L.article=function(task,exported,variant='process'){
 const template=R.templates.find(v=>v.id===variant)||R.templates[1],title=task.name+' · '+(exported?template.name:'攻防结果报告');
 return `<article class="task-analysis-report report-layout" data-report-template="${E(template.id)}"><header class="analysis-report-title"><div><${exported?'h1':'h2'}>${E(title)}</${exported?'h1':'h2'}></div>${exported?'':H.exportMenu(task.id)}</header>${L.body(task,variant)}<footer class="report-footer">智安 · 攻防演练中心</footer></article>`;
};
X.report=function(task){return `<style>${styles}</style>`+L.article(task,false);};
X.reportHTML=function(variant='process'){
 const t=X.task;if(!t)return '';
 return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${E(t.name)} · ${E((R.templates.find(v=>v.id===variant)||R.templates[1]).name)}</title><style>${H.exportStyles}${styles}</style></head><body>${L.article(t,true,variant)}</body></html>`;
};
})();
