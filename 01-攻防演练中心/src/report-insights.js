/* Task-snapshot reporting: questions, risk scenes and result evidence share one analysis. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const digestStyles="\n/* Compact result overview shared by task detail and report. */\n.result-digest{display:grid;grid-template-columns:124px minmax(210px,1fr) minmax(230px,1.1fr);align-items:center;gap:24px;padding:18px 0;margin:0;color:#34465e}\n.digest-asr{text-align:center}.digest-asr svg{display:block;width:108px;height:108px;margin:auto}.digest-asr>span{font-size:11px;color:#718096}\n.digest-results,.digest-scope{min-width:0}.digest-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.digest-heading>strong{font-size:12px;font-weight:600}.digest-heading>span{font-size:10px;color:#7a889a}.digest-heading b{color:#44566e;font-weight:600}\n.digest-distribution{height:10px;display:flex;overflow:hidden;border-radius:5px;background:#e6ebf2;margin:15px 0}.digest-distribution>span{display:block;height:100%}.digest-legend{display:flex;gap:10px 16px;flex-wrap:wrap}.digest-legend>span{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:#64748b}.digest-legend b{font-size:15px;color:#34465e;font-weight:600}.digest-legend i{width:6px;height:6px;border-radius:2px;background:#e6ebf2}.digest-legend .breach i{background:#d76b63}.digest-legend .defended i{background:#39a584}.digest-legend .error i{background:#dba153}\n.digest-scope{border-left:1px solid #e7ecf2;padding-left:24px}.digest-bank-names{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px}.digest-bank-names>span{font-size:11px;color:#516982;background:#f1f5fa;border-radius:4px;padding:4px 7px;overflow-wrap:anywhere;max-width:100%}\n.digest-execution{display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#8090a5;margin-bottom:7px}.digest-execution b{font-size:11px;color:#506681;font-weight:500}.digest-progress{height:4px;border-radius:3px;background:#e8eff7;overflow:hidden}.digest-progress>span{display:block;height:100%;background:#5d8fd7}\n.analysis-finding-records{margin-top:12px;width:100%;table-layout:fixed}.analysis-finding-records th:first-child{width:72px}.analysis-finding-records th:nth-child(3){width:90px}.analysis-finding-records th:last-child{width:160px}.analysis-finding-records td,.analysis-evidence dd{white-space:pre-wrap;overflow-wrap:anywhere}\n@media(max-width:1000px){.result-digest{grid-template-columns:108px minmax(0,1fr);gap:14px 20px}.digest-scope{grid-column:1/-1;border-left:0;border-top:1px solid #e7ecf2;padding:12px 0 0}.digest-bank-names{margin-bottom:8px}.digest-heading{margin-bottom:8px}.digest-asr svg{width:96px;height:96px}}\n@media(max-width:560px){.result-digest{grid-template-columns:90px minmax(0,1fr);gap:12px}.digest-asr svg{width:86px;height:86px}.digest-heading{align-items:flex-start;flex-direction:column;gap:4px}.digest-legend{gap:8px}}\n";
const terminal=new Set(['breach','defended','error']);
const rate=(count,total)=>total?Number((count/total*100).toFixed(1)):null;
const percent=value=>Number.isFinite(value)?value.toFixed(1)+'%':'--';
const cleanId=value=>value===null||value===undefined?'':String(value).trim();
const statusText=t=>({running:'进行中',paused:'已暂停',done:'已完成',stopped:'手动结束',error:'任务异常'}[t?.status]||'等待中');
const methodLabel=id=>X.methodDependencies?.[id]?.label||id||'方法未记录';
const clipped=(value,max=160)=>{const text=String(value||'').trim();return text.length>max?text.slice(0,max)+'…':text;};
const asArray=value=>Array.isArray(value)?value:[];
const sceneCatalog=task=>[...new Map([...asArray(A.sceneTags?.catalog),...asArray(task?.bankSnapshot?.items).flatMap(q=>asArray(q.sceneTagDefinitions).filter(s=>s&&A.sceneTags?.resolve(q).includes(s.id)))].filter(row=>row&&typeof row==='object').map(row=>[cleanId(row.id),{id:cleanId(row.id),label:String(row.label||row.id)}])).values()].filter(row=>row.id);
function resolvedScenes(question){
  if(!question||typeof A.sceneTags?.resolve!=='function')return [];
  try{return [...new Set(asArray(A.sceneTags.resolve(question)))].filter(Boolean).map(id=>({id:String(id),label:A.sceneTags.label(String(id),question)}));}catch(error){return [];}
}
function errorGroup(unit){
  const text=[unit.errorCode,unit.errorMessage,typeof unit.error==='string'?unit.error:unit.error?.message,unit.errorReason,unit.verdict].filter(Boolean).join(' ');
  if(/timeout|timed.?out|超时/i.test(text))return {id:'timeout',label:'请求超时',advice:'检查靶标与裁判的响应耗时，确认超时阈值和并发量后，按原方案补测异常单元。'};
  if(/401|403|unauthori|forbidden|鉴权|认证|权限不足|密钥无效/i.test(text))return {id:'auth',label:'认证或权限异常',advice:'检查对应模型连接的认证信息、接口权限及有效期，验证连接后补测。'};
  if(/429|rate.?limit|限流|配额|quota/i.test(text))return {id:'limit',label:'限流或配额不足',advice:'检查接口配额与并发限制，降低并发或恢复配额后补测。'};
  if(/ECONN|ENOTFOUND|network|网络|连接失败|无法连接|连接中断/i.test(text))return {id:'connection',label:'连接异常',advice:'检查服务地址、网络连通性及目标服务状态，恢复连接后补测。'};
  if(/parse|invalid.?json|解析|判定格式|裁判格式/i.test(text))return {id:'format',label:'响应或判定格式异常',advice:'核对接口返回格式与裁判解析规则，保留原始响应，修正解析后重新判定。'};
  return {id:'unknown',label:'原因未记录',advice:'打开异常记录核对调用阶段与原始错误信息；补齐原因后再选择重试或重新判定。'};
}
function storedContent(unit,question){
  const rounds=asArray(unit.roundHistory),last=rounds.length?rounds[rounds.length-1]:{};
  return {prompt:question?.prompt||unit.seedPrompt||unit.attackPrompt||last.prompt||'',response:unit.response||last.response||'',verdict:unit.verdict||last.verdict||''};
}

X.taskAnalysis=function(task){
  const units=asArray(task?.units).filter(unit=>unit&&typeof unit==='object'),items=asArray(task?.bankSnapshot?.items);
  const questions=new Map(),questionStates=new Map(),methods=new Map(),categories=new Map(),scenes=new Map(),errors=new Map();
  for(const item of items){const id=cleanId(item?.id);if(id&&!questions.has(id))questions.set(id,item);}
  for(const scene of sceneCatalog(task))scenes.set(scene.id,{...scene,total:0,done:0,valid:0,breach:0,defended:0,errors:0,pending:0,questionIds:new Set(),validQuestionIds:new Set(),breachQuestionIds:new Set()});
  const a={total:units.length,done:0,valid:0,breach:0,defended:0,errors:0,pending:0,unknownQuestionUnits:0,unknownBreachQuestions:0,missingMethodUnits:0,unclassifiedSceneUnits:0,methods:[],categories:[],scenes:[],findings:[],evidence:[]};
  const addMethod=id=>{if(!methods.has(id))methods.set(id,{id,label:methodLabel(id),total:0,done:0,valid:0,breach:0,defended:0,errors:0,pending:0});return methods.get(id);};
  for(const id of asArray(task?.engine?.methods))if(cleanId(id))addMethod(cleanId(id));
  const increment=(row,result)=>{row.total++;if(result==='pending')row.pending++;else{row.done++;if(result==='error')row.errors++;else{row.valid++;row[result]++;}}};
  for(const unit of units){
    const result=terminal.has(unit.result)?unit.result:'pending',method=cleanId(unit.method),qid=cleanId(unit.questionId),question=questions.get(qid)||null;
    increment(addMethod(method),result);if(!method)a.missingMethodUnits++;
    if(result==='pending')a.pending++;else{a.done++;if(result==='error')a.errors++;else{a.valid++;a[result]++;}}
    if(result==='error'){const group=errorGroup(unit);if(!errors.has(group.id))errors.set(group.id,{...group,count:0});errors.get(group.id).count++;}
    const labels=resolvedScenes(question).filter(scene=>scenes.has(scene.id));
    if(!labels.length)a.unclassifiedSceneUnits++;
    for(const label of labels){const row=scenes.get(label.id);increment(row,result);if(qid)row.questionIds.add(qid);if(qid&&['breach','defended'].includes(result))row.validQuestionIds.add(qid);if(qid&&result==='breach')row.breachQuestionIds.add(qid);}
    if(!qid){a.unknownQuestionUnits++;if(result==='breach')a.unknownBreachQuestions++;continue;}
    if(!questionStates.has(qid))questionStates.set(qid,{id:qid,item:question,scenes:labels,valid:false,breach:false});
    const state=questionStates.get(qid);if(result==='breach'||result==='defended')state.valid=true;if(result==='breach')state.breach=true;
  }
  a.asr=rate(a.breach,a.valid);a.defenseRate=rate(a.defended,a.valid);a.progress=rate(a.done,a.total);a.validCoverage=rate(a.valid,a.total);
  a.methods=[...methods.values()].map(row=>({...row,asr:rate(row.breach,row.valid)}));a.methodCount=a.methods.filter(row=>row.id).length;
  a.knownQuestions=questionStates.size;a.classifiedQuestions=0;a.unclassifiedQuestions=0;a.missingQuestionSnapshots=0;a.validQuestions=0;a.knownBreachQuestions=0;a.sceneClassifiedQuestions=0;a.unclassifiedSceneQuestions=0;
  for(const question of questionStates.values()){
    if(question.valid)a.validQuestions++;if(question.breach)a.knownBreachQuestions++;
    if(question.scenes.length)a.sceneClassifiedQuestions++;else a.unclassifiedSceneQuestions++;
    const category=typeof question.item?.category==='string'?question.item.category.trim():'';
    if(!question.item)a.missingQuestionSnapshots++;
    if(!category){a.unclassifiedQuestions++;continue;}
    a.classifiedQuestions++;
    if(!categories.has(category))categories.set(category,{name:category,total:0,valid:0,breach:0});
    const row=categories.get(category);row.total++;if(question.valid)row.valid++;if(question.breach)row.breach++;
  }
  a.categoryCoverage=rate(a.classifiedQuestions,a.knownQuestions);a.sceneCoverage=rate(a.sceneClassifiedQuestions,a.knownQuestions);
  a.uniqueBreachQuestions=a.unknownBreachQuestions?null:a.knownBreachQuestions;
  a.categories=[...categories.values()].sort((left,right)=>right.breach-left.breach||right.total-left.total||left.name.localeCompare(right.name));
  a.scenes=[...scenes.values()].map(({questionIds,validQuestionIds,breachQuestionIds,...row})=>({...row,questions:questionIds.size,validQuestions:validQuestionIds.size,breachQuestions:breachQuestionIds.size,asr:rate(row.breach,row.valid),defenseRate:rate(row.defended,row.valid)}));
  a.relatedScenes=a.scenes.filter(row=>row.questions>0||row.total>0);
  a.coveredScenes=a.relatedScenes.filter(row=>row.valid>0).length;a.configuredScenes=a.relatedScenes.length;
  a.primaryScene=[...a.scenes].filter(row=>row.breach>0).sort((left,right)=>right.breach-left.breach||right.asr-left.asr||right.valid-left.valid)[0]||null;
  a.errorGroups=[...errors.values()].sort((left,right)=>right.count-left.count);
  a.missingEvidenceUnits=units.filter(unit=>unit.result==='breach'&&(!storedContent(unit,questions.get(cleanId(unit.questionId))).response||!storedContent(unit,questions.get(cleanId(unit.questionId))).verdict)).length;
  if(!a.total)a.findings.push({tone:'neutral',title:'尚无测试单元',body:'当前任务没有可分析的记录，请检查题库与攻击方法配置。',action:'查看任务记录',filter:'all'});
  else if(a.primaryScene){
    const s=a.primaryScene;
    a.findings.push({tone:'breach',title:`优先复核「${s.label}」`,body:`该场景出现 ${s.breach} 条攻破记录，涉及 ${s.breachQuestions} 道题；${s.valid} 次有效判定中攻击成功率为 ${percent(s.asr)}。`,action:'查看该场景攻破记录',sceneId:s.id,filter:'breach'});
  }else if(a.breach){
    const leading=[...a.methods].sort((left,right)=>right.breach-left.breach)[0];
    a.findings.push({tone:'breach',title:`${a.breach} 条攻破记录待复核`,body:`${leading?.label||'现有方法'}产生 ${leading?.breach||0} 条攻破记录；题目场景信息不足，暂不归因到具体风险场景。`,action:'查看攻破证据',section:'analysis-evidence'});
  }else if(a.valid)a.findings.push({tone:'defended',title:`${a.valid} 条有效判定未出现攻破`,body:`已有效覆盖 ${a.coveredScenes} 类场景，结论范围以本次实际测试题目与方法为准。`,action:'查看有效记录',filter:'defended'});
  else a.findings.push({tone:'neutral',title:'暂无有效判定',body:a.errors?'已执行记录均为异常，暂不能判断攻防结果。':'尚未产生最终判定，指标将在有效结果出现后计算。',action:'查看任务记录',filter:'all'});
  if(a.breach&&a.primaryScene){const leading=[...a.methods].filter(row=>row.breach).sort((left,right)=>right.breach-left.breach)[0];a.findings.push({tone:'neutral',title:`${leading.label}产生 ${leading.breach} 条攻破记录`,body:`该方法共 ${leading.valid} 次有效判定，攻击成功率 ${percent(leading.asr)}。请结合原题、最终响应与裁判依据核对结果。`,action:'查看攻破证据',section:'analysis-evidence',methodId:leading.id});}
  if(a.errors)a.findings.push({tone:'error',title:`${a.errors} 条执行异常影响覆盖`,body:a.errorGroups.map(group=>`${group.label} ${group.count} 条`).join('；')+'。异常不计入攻击成功率。',action:'查看异常记录',filter:'error'});
  if(a.pending)a.findings.push({tone:'neutral',title:`${a.pending} 个单元待判定`,body:['stopped','error'].includes(task?.status)?'任务已停止，当前为阶段报告；补测后再汇总完整结果。':'本报告仅统计已产生结果的单元。',action:'查看当前记录',filter:'pending'});
  if(a.unclassifiedSceneQuestions||a.unknownQuestionUnits)a.findings.push({tone:'neutral',title:'部分题目尚未关联场景',body:`${a.unclassifiedSceneQuestions} 道题缺少可用场景标签${a.unknownQuestionUnits?`，${a.unknownQuestionUnits} 个单元缺少题目编号`:''}，这些结果保留在总体统计中，不纳入具体场景。`,action:'查看覆盖缺口',section:'analysis-coverage'});
  const breached=units.filter(unit=>unit.result==='breach'),seen=new Set(),preferred=[];
  for(const unit of breached){const key=cleanId(unit.questionId)||cleanId(unit.id);if(!seen.has(key)){seen.add(key);preferred.push(unit);}}
  a.evidence=preferred.concat(breached.filter(unit=>!preferred.includes(unit))).slice(0,3).map(unit=>({unit,question:questions.get(cleanId(unit.questionId))||null,scenes:resolvedScenes(questions.get(cleanId(unit.questionId)))}));
  a.breachIndex=breached.map(unit=>({unit,question:questions.get(cleanId(unit.questionId))||null,scenes:resolvedScenes(questions.get(cleanId(unit.questionId)))}));
  a.limitations=[
    `攻击成功率 = 攻破 / 有效判定（${a.breach} / ${a.valid}）。执行异常与待判定不进入分母。`,
    '场景统计使用任务题目快照的场景标签；同一题可属于多个场景，分场景数量可能交叉，不能相加作为总体数量。',
    '场景分析只展示本任务实际关联题目或测试单元的场景。攻击成功率以各场景有效判定为分母；有题但尚无有效判定的场景保持空值，不记为 0%。',
    '雷达维度随本任务关联场景变化；少于三类有效场景时使用条目展示。有异常或待判定但暂无有效结果的场景保留，雷达中不补零或跨过缺失维度连线。',
    '攻破记录以测试单元计数，涉及题目按原题编号去重；裁判攻破判定仍需结合原始响应复核，不等同于已确认漏洞。'
  ];
  if(a.pending)a.limitations.push(`${a.pending} 个单元待判定，当前报告为阶段性结果。`);
  if(a.missingQuestionSnapshots)a.limitations.push(`${a.missingQuestionSnapshots} 道题缺少历史题目快照，保留总体结果，不从当前题库回填历史场景。`);
  if(a.unknownQuestionUnits)a.limitations.push(`${a.unknownQuestionUnits} 个单元缺少题目编号，不纳入题目去重与标签覆盖分母。`);
  if(a.missingMethodUnits)a.limitations.push(`${a.missingMethodUnits} 个单元未保存攻击方法，单列为“方法未记录”。`);
  return a;
};

X.analysisNavigate=function(filter,section){
  if(section){X.detailTab='report';A.render();document.getElementById(section)?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  X.sampleScene='all';X.sampleQuery='';X.sampleFilter=['breach','defended','error'].includes(filter)?filter:'all';X.pageNum=1;X.detailTab='samples';A.render();
  document.querySelector('.detail-tabs')?.scrollIntoView({behavior:'smooth',block:'start'});
};
function actionHTML(){return '';}
function metricsHTML(a,t){
  const circumference=251.327,segments=[['breach',a.breach,'#d76b63'],['defended',a.defended,'#39a584'],['error',a.errors,'#dba153'],['pending',a.pending,'#e6ebf2']];
  let offset=0;
  const arcs=segments.map(([,count,color])=>{const length=a.total?count/a.total*circumference:0,arc=`<circle cx="54" cy="54" r="40" fill="none" stroke="${color}" stroke-width="9" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 54 54)"/>`;offset+=length;return arc;}).join('');
  const sources=t?.bankSnapshot?.sources||[],bankNames=sources.length?sources.map(b=>b.name):[t?.bankSnapshot?.name||'题库未记录'];
  return `<div class="result-digest"><div class="digest-asr"><svg viewBox="0 0 108 108" role="img" aria-label="攻击成功率 ${percent(a.asr)}"><circle cx="54" cy="54" r="40" fill="none" stroke="#e6ebf2" stroke-width="9"/>${arcs}<text x="54" y="52" text-anchor="middle" font-size="19" font-weight="650" fill="#24364f">${percent(a.asr)}</text><text x="54" y="70" text-anchor="middle" font-size="10" fill="#718096">ASR</text></svg><span>攻击成功率</span></div><div class="digest-results"><div class="digest-heading"><strong>攻击结果</strong><span>涉及攻破题目 <b>${a.uniqueBreachQuestions??'—'}</b></span></div><div class="digest-distribution" role="img" aria-label="已攻破 ${a.breach}，已守住 ${a.defended}，异常 ${a.errors}，待判定 ${a.pending}">${segments.map(([key,count,color])=>`<span class="${key}" style="width:${a.total?count/a.total*100:0}%;background:${color}"></span>`).join('')}</div><div class="digest-legend">${[['已攻破',a.breach,'breach'],['已守住',a.defended,'defended'],['异常',a.errors,'error'],...(a.pending?[['待判定',a.pending,'pending']]:[])].map(([label,value,tone])=>`<span class="${tone}"><i></i>${label}<b>${value}</b></span>`).join('')}</div></div><div class="digest-scope"><div class="digest-heading"><strong>演练题库</strong><span>${bankNames.length} 个 · ${a.knownQuestions} 题</span></div><div class="digest-bank-names">${bankNames.map(name=>`<span title="${E(name)}">${E(name)}</span>`).join('')}</div><div class="digest-execution"><span>执行进度</span><b>${a.done} / ${a.total}</b></div><div class="digest-progress"><span style="width:${a.progress||0}%"></span></div></div></div>`;
}
function recommendations(a){
  const items=[];
  if(a.primaryScene){const s=a.primaryScene;items.push({title:`复核「${s.label}」的攻破证据`,body:`逐条核对 ${s.breach} 条攻破记录中的最终响应和裁判依据，确认具体违规点；将确认样本及对应攻击方法保留为回归集，按原配置复测。`,basis:`${s.breach} 条攻破 · ${s.breachQuestions} 道题`,sceneId:s.id,filter:'breach',action:'查看关联记录'});}
  else if(a.breach)items.push({title:'复核攻破记录并补齐场景',body:'先核对最终响应与裁判依据，再为原题补充场景标签及标注依据；确认样本纳入同配置回归。',basis:`${a.breach} 条攻破`,filter:'breach',action:'查看攻破记录'});
  for(const group of a.errorGroups)items.push({title:`排查${group.label}`,body:group.advice,basis:`${group.count} 条异常`,filter:'error',action:'查看异常记录'});
  if(a.pending)items.push({title:'补齐未完成的测试单元',body:'沿用本次题目、方法与判定配置完成剩余单元，避免将阶段结果直接用于整体表现判断。',basis:`${a.pending} 个待判定`,filter:'all',action:'查看任务记录'});
  if(a.unclassifiedSceneQuestions||a.unknownQuestionUnits)items.push({title:'完善题目场景关联',body:'先补齐原题与历史快照，再标注场景。新增标签用于后续任务；历史缺失信息保持单列，不自动回填改变旧报告。',basis:`${a.unclassifiedSceneQuestions} 道未关联场景题目`,section:'analysis-coverage',action:'查看覆盖缺口'});
  if(!items.length)items.push({title:a.total?'保留本轮回归基线':'检查任务配置',body:a.total?'保留本次题目快照、攻击方法与判定配置，在更新靶标或防护方案后使用同一方案复测。':'确认题库中有可用题目并选择攻击方法，启动任务后生成分析。',basis:a.total?`${a.valid} 次有效判定`:'尚无测试单元',filter:'all',action:'查看任务记录'});
  return items;
}
X.detailHeroHTML=function(t){
  const a=X.taskAnalysis(t),finding=a.findings[0],next=recommendations(a)[0];
  return `<section class="detail-hero analysis-overview">${metricsHTML(a,t)}<div class="analysis-brief"><article><span class="analysis-kicker">核心发现</span><h3>${E(finding.title)}</h3><p>${E(finding.body)}</p></article><article><span class="analysis-kicker">下一步</span><h3>${E(next.title)}</h3><p>${E(next.body)}</p></article></div></section>`;
};
function exportMenu(){return `<details class="report-export"><summary>${I('download',14)}报告导出${I('chevron',12)}</summary><div><button onclick="App.attack.exportReport()">HTML 报告</button><button onclick="App.attack.printReport()">PDF / 打印</button><button onclick="App.attack.exportWord()">Word 兼容</button></div></details>`;}
function reportHeadline(a){return !a.total?'尚无可分析记录':!a.valid?'等待有效判定':a.breach?`${a.breach} 条攻破记录待复核`:'本次有效判定未出现攻破';}
function findingRecordsHTML(t,finding){
  const rows=(t.units||[]).filter(u=>{
    if(finding.sceneId&&!resolvedScenes(t.bankSnapshot?.items?.find(q=>q.id===u.questionId)).some(s=>s.id===finding.sceneId))return false;
    if(finding.methodId&&u.method!==finding.methodId)return false;
    if(finding.filter&&finding.filter!=='all'&&u.result!==finding.filter)return false;
    if(finding.section==='analysis-evidence'&&u.result!=='breach')return false;
    return finding.section!=='analysis-coverage';
  });
  if(!rows.length)return '';
  return `<table class="analysis-finding-records"><thead><tr><th>记录</th><th>攻击题目</th><th>攻击方法</th><th>判定</th></tr></thead><tbody>${rows.map(u=>{const q=t.bankSnapshot?.items?.find(q=>q.id===u.questionId);return `<tr><td>${E(u.id)}</td><td>${E(q?.prompt||u.seedPrompt||u.attackPrompt||'未记录')}</td><td>${E(methodLabel(u.method))}</td><td>${E({breach:'已攻破',defended:'未攻破',error:'执行异常',pending:'待判定'}[u.result]||'未记录')}<small>${E(u.verdict||'')}</small></td></tr>`;}).join('')}</tbody></table>`;
}
function findingsHTML(t,a,exported){return `<section class="analysis-section"><header class="analysis-section-head"><h3>核心发现</h3></header><div class="analysis-findings">${a.findings.map((finding,index)=>`<article class="${finding.tone}"><span class="analysis-number">${String(index+1).padStart(2,'0')}</span><div><h4>${E(finding.title)}</h4><p>${E(finding.body)}</p>${exported?findingRecordsHTML(t,finding):''}</div></article>`).join('')}</div></section>`;}
function radarHTML(a){
  const rows=a.relatedScenes,valid=rows.filter(row=>row.valid>0),desc=rows.map(row=>`${row.label}：${row.valid?percent(row.asr):'无有效判定'}`).join('；');
  if(valid.length<3||rows.length>12)return `<div class="analysis-radar-empty"><strong>场景攻击成功率</strong><p>${rows.length>12?'场景较多，使用条形图逐项展示。':rows.length?'按本任务关联场景展示；至少三类有效场景时显示雷达图。':'本任务暂无已关联场景的题目或测试记录。'}</p><div class="analysis-radar-fallback">${rows.map(row=>`<div class="analysis-scene-bar-row"><div><span>${E(row.label)}</span><strong>${row.valid?percent(row.asr):'无有效判定'}</strong></div>${row.valid?`<div class="analysis-scene-bar-track"><span style="width:${row.asr}%"></span></div>`:''}<small>${row.valid?`${row.breach} 条攻破 / ${row.valid} 次有效判定`:`${row.questions} 道题 · ${row.errors} 条异常 · ${row.pending} 个待判定`}</small></div>`).join('')}</div></div>`;
  const shortLabels={illegal:'违法犯罪',violence:'暴力伤害',privacy:'隐私泄露',cyber:'网络安全',hate:'歧视骚扰',sexual:'色情性安全',deception:'欺诈虚假',professional:'专业伦理'};
  const n=rows.length,height=Math.max(302,Math.ceil(n/2)*34+72),cx=170,cy=height/2,radius=86,angle=index=>-Math.PI/2+index*2*Math.PI/n;
  const point=(index,value)=>`${(cx+Math.cos(angle(index))*radius*value/100).toFixed(2)},${(cy+Math.sin(angle(index))*radius*value/100).toFixed(2)}`;
  const grid=[25,50,75,100].map(level=>`<polygon points="${rows.map((row,index)=>point(index,level)).join(' ')}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`).join('');
  const axes=rows.map((row,index)=>`<line x1="${cx}" y1="${cy}" x2="${point(index,100).split(',')[0]}" y2="${point(index,100).split(',')[1]}" stroke="#e2e8f0" stroke-width="1"/>`).join('');
  const shape=valid.length===n?`<polygon class="analysis-radar-shape" points="${rows.map((row,index)=>point(index,row.asr)).join(' ')}" fill="#3370ff" fill-opacity=".12" stroke="#3370ff" stroke-width="2"/>`:rows.map((row,index)=>{const next=(index+1)%n;if(!row.valid||!rows[next].valid)return '';return `<line x1="${point(index,row.asr).split(',')[0]}" y1="${point(index,row.asr).split(',')[1]}" x2="${point(next,rows[next].asr).split(',')[0]}" y2="${point(next,rows[next].asr).split(',')[1]}" stroke="#3370ff" stroke-width="2"/>`;}).join('');
  const marks=rows.map((row,index)=>row.valid?`<circle cx="${point(index,row.asr).split(',')[0]}" cy="${point(index,row.asr).split(',')[1]}" r="3.5" fill="#3370ff"><title>${E(row.label)}：${percent(row.asr)}（${row.breach} / ${row.valid}）</title></circle>`:'').join('');
  const labelPoints=rows.map((row,index)=>{const theta=angle(index),cos=Math.cos(theta),x=cx+cos*(radius+17),y=cy+Math.sin(theta)*(radius+17);return {row,index,x,y,originalY:y,anchor:Math.abs(cos)<.1?'middle':cos>0?'start':'end'};});
  for(const anchor of ['start','end']){const side=labelPoints.filter(label=>label.anchor===anchor).sort((left,right)=>left.y-right.y);let last=20;for(const label of side){label.y=Math.max(label.y,last);last=label.y+34;}let next=height-37;for(let index=side.length-1;index>=0;index--){side[index].y=Math.min(side[index].y,next);next=side[index].y-34;}}
  const labels=labelPoints.map(({row,index,x,y,originalY,anchor})=>{const shifted=Math.abs(y-originalY)>8,short=shortLabels[row.id]||clipped(row.label,4);return `${shifted?`<line x1="${point(index,100).split(',')[0]}" y1="${point(index,100).split(',')[1]}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" stroke="#dce3eb" stroke-width="1"/>`:''}<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" text-anchor="${anchor}" font-size="12" fill="${row.valid?'#42536c':'#8b97a8'}"><title>${E(row.label)}：${row.valid?percent(row.asr):'无有效判定'}</title>${E(short)}<tspan x="${x.toFixed(2)}" dy="17" font-size="11">${row.valid?percent(row.asr):'无有效判定'}</tspan></text>`;}).join('');
  return `<div class="analysis-radar"><svg viewBox="0 0 340 ${height}" role="img" aria-label="各场景攻击成功率雷达图"><title>场景攻击成功率</title><desc>${E(desc)}。无有效判定的场景不绘制数值。</desc>${grid}${axes}<text x="${cx+5}" y="${cy-radius+12}" fill="#8b97a8" font-size="10">100%</text><text x="${cx+5}" y="${cy-radius/2-4}" fill="#8b97a8" font-size="10">50%</text>${shape}${marks}${labels}</svg></div>`;
}
function scenesHTML(a,exported){
  const rows=[...a.relatedScenes].sort((left,right)=>right.breach-left.breach||right.valid-left.valid),top=a.primaryScene;
  return `<section class="analysis-section" id="analysis-scenes"><header class="analysis-section-head"><h3>场景风险分析</h3></header><div class="analysis-scene-profile">${radarHTML(a)}<div class="analysis-scene-summary"><span class="analysis-kicker">本次场景覆盖</span><h4>${top?E(top.label)+'需优先复核':a.breach?'攻破记录尚未关联场景':a.coveredScenes?'已测场景内未出现攻破':'等待有效场景结果'}</h4><p>${top?`该场景 ${top.breach} 条攻破记录，涉及 ${top.breachQuestions} 道题；攻击成功率 ${percent(top.asr)}。`:a.valid?`${a.sceneClassifiedQuestions} 道题已关联场景，${a.unclassifiedSceneQuestions} 道题尚未关联。`:'当前未产生可用于场景分析的有效判定。'}</p>${top?actionHTML({sceneId:top.id,filter:'breach',action:'查看该场景证据'},exported):''}<dl><div><dt>已关联场景题目</dt><dd>${a.sceneClassifiedQuestions} / ${a.knownQuestions}</dd></div><div><dt>尚无有效判定</dt><dd>${a.relatedScenes.length-a.coveredScenes} 类</dd></div><div><dt>待补充场景标签</dt><dd>${a.unclassifiedSceneQuestions} 道题</dd></div></dl></div></div><div class="analysis-table-wrap"><table class="analysis-table analysis-scene-table"><thead><tr><th>攻击场景</th><th>有效 / 计划</th><th>攻破</th><th>守住</th><th>攻击成功率</th><th>异常 / 待判定</th></tr></thead><tbody>${rows.map(row=>`<tr data-scene="${E(row.id)}"><td><strong>${E(row.label)}</strong><small>${row.questions} 道关联题目</small></td><td>${row.valid} / ${row.total}</td><td class="analysis-breach">${row.breach}</td><td>${row.defended}</td><td><strong>${row.valid?percent(row.asr) :'无有效判定'}</strong></td><td>${row.errors} / ${row.pending}</td></tr>`).join('')||`<tr><td colspan="6" class="analysis-empty">暂无可分析场景</td></tr>`}</tbody></table></div></section>`;
}
function methodsHTML(a){return `<section class="analysis-section"><header class="analysis-section-head"><h3>攻击方法表现</h3><span>各方法独立计算有效判定</span></header><div class="analysis-table-wrap"><table class="analysis-table"><thead><tr><th>攻击方法</th><th>已执行 / 计划</th><th>有效判定</th><th>攻破 / 守住</th><th>攻击成功率</th><th>异常</th></tr></thead><tbody>${a.methods.map(row=>`<tr><td><strong>${E(row.label)}</strong>${row.id&&row.label!==row.id?`<small>${E(row.id)}</small>`:''}</td><td>${row.done} / ${row.total}</td><td>${row.valid}</td><td><span class="analysis-breach">${row.breach}</span> / ${row.defended}</td><td><strong>${percent(row.asr)}</strong></td><td class="analysis-error">${row.errors}</td></tr>`).join('')||'<tr><td colspan="6" class="analysis-empty">暂无可分析的攻击方法</td></tr>'}</tbody></table></div></section>`;}
function evidenceHTML(t,a,exported){
  const evidence=exported?a.breachIndex:a.evidence;
  return `<section class="analysis-section" id="analysis-evidence"><header class="analysis-section-head"><h3>${exported?'攻破记录明细':'重点攻破证据'}</h3><span>${a.breach?exported?`共 ${a.breach} 条攻破`:`节选 ${a.evidence.length} 条 · 共 ${a.breach} 条攻破`:'暂无攻破记录'}</span></header><div class="analysis-evidence">${evidence.map(({unit,question,scenes})=>{
    const content=storedContent(unit,question),title=content.prompt||'原题未保存',labels=scenes.map(scene=>scene.label).join('、')||'未关联场景';
    return `<article><div class="analysis-evidence-head"><div><span class="analysis-result breach">已攻破</span><span>${E(methodLabel(unit.method))}</span><span class="analysis-record-id">${E(unit.id||'记录编号缺失')}</span></div></div><h4>${E(exported?title:clipped(title,160))}</h4><p class="analysis-evidence-category">攻击场景：${E(labels)} · ${unit.questionId?'题目 '+E(unit.questionId):'题目编号缺失'}</p><dl><div><dt>最终判定对象</dt><dd>${E(exported?(content.response||'未保存最终响应'):clipped(content.response||'未保存最终响应，需补充原始证据。',260))}</dd></div><div><dt>裁判依据</dt><dd>${E(exported?(content.verdict||'未保存裁判依据'):clipped(content.verdict||'未保存具体判定依据，需人工复核。',220))}</dd></div></dl></article>`;
  }).join('')||`<p class="analysis-empty">${a.valid?'当前没有攻破记录。':'有效判定产生后展示关联证据。'}</p>`}</div></section>`;
}
function recommendationsHTML(a,exported){return `<section class="analysis-section"><header class="analysis-section-head"><h3>下一步建议</h3><span>按本次发现安排复核与补测</span></header><div class="analysis-actions">${recommendations(a).map((item,index)=>`<article><span class="analysis-number">${String(index+1).padStart(2,'0')}</span><div><h4>${E(item.title)}<small>${E(item.basis)}</small></h4><p>${E(item.body)}</p>${actionHTML(item,exported)}</div></article>`).join('')}</div></section>`;}
function coverageHTML(a,exported){
  const gaps=[['未关联场景',a.unclassifiedSceneQuestions,'道题'],['缺少题目快照',a.missingQuestionSnapshots,'道题'],['缺少题目编号',a.unknownQuestionUnits,'个单元'],['攻破证据不完整',a.missingEvidenceUnits,'条记录']];
  return `<section class="analysis-section" id="analysis-coverage"><header class="analysis-section-head"><h3>覆盖缺口</h3><span>缺失信息不参与场景结论</span></header><div class="analysis-coverage-stats">${gaps.map(([label,value,unit])=>`<div><strong>${value}<small>${unit}</small></strong><span>${label}</span></div>`).join('')}</div>${a.unclassifiedSceneQuestions||a.missingQuestionSnapshots||a.unknownQuestionUnits||a.missingEvidenceUnits?'<p class="analysis-caption">补齐题目标签、历史快照和原始响应后再开展对应分析；总体执行结果仍保留。</p>':'<p class="analysis-caption">本次关联题目和攻破证据完整；未测试的场景不包含在结论范围内。</p>'}${!exported&&a.unclassifiedSceneUnits?`<div class="analysis-section-foot">${actionHTML({sceneId:'unclassified',action:'查看未关联场景的记录'},false)}</div>`:''}</section>`;
}
function limitationsHTML(a,exported){const list=`<ul>${a.limitations.map(text=>`<li>${E(text)}</li>`).join('')}</ul>`;return exported?`<section class="analysis-limitations"><h3>统计口径</h3>${list}</section>`:`<details class="analysis-limitations"><summary>统计口径</summary>${list}</details>`;}
function evidenceIndexHTML(a){return a.breach?`<section class="analysis-section"><header class="analysis-section-head"><h3>附录：完整攻破记录索引</h3><span>${a.breach} 条</span></header><table class="analysis-table"><thead><tr><th>记录编号</th><th>题目编号</th><th>攻击场景</th><th>攻击方法</th><th>证据完整性</th></tr></thead><tbody>${a.breachIndex.map(({unit,question,scenes})=>{const content=storedContent(unit,question);return `<tr><td>${E(unit.id||'未记录')}</td><td>${E(unit.questionId||'未记录')}</td><td>${E(scenes.map(scene=>scene.label).join('、')||'未关联场景')}</td><td>${E(methodLabel(unit.method))}</td><td>${content.response&&content.verdict?'已保存响应与判定':'需补充原始证据'}</td></tr>`;}).join('')}</tbody></table></section>`:'';}
function reportBody(t,a,exported){return findingsHTML(t,a,exported)+scenesHTML(a,exported)+methodsHTML(a)+evidenceHTML(t,a,exported)+recommendationsHTML(a,exported)+(exported?evidenceIndexHTML(a):'');}
X.report=function(t){
  const a=X.taskAnalysis(t);
  return `<article class="task-analysis-report"><section class="analysis-report-summary"><div class="analysis-report-title"><div><h2>${a.pending?'阶段演练报告':'演练报告'}</h2></div>${exportMenu()}</div>${metricsHTML(a,t)}</section>${reportBody(t,a,false)}</article>`;
};

X.reportHTML=function(){
  const t=X.task;if(!t)return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>演练报告</title><p>任务不存在，无法生成报告。</p></html>';
  const a=X.taskAnalysis(t),target=X.targetFor(t)||{},config=[['靶标',target.name||target.model||'未记录'],['题库',t.bankSnapshot?.name||'未记录'],['实际题目范围',`${a.knownQuestions} 道关联题目 · ${a.total} 个测试单元`],['攻击方法',a.methods.map(row=>row.label).join('、')||'未记录'],['红队',t.engine?.roles?.attacker?.name||t.engine?.attacker||'未记录'],['防护配置',X.blueLabel?.(t.defense)||'未记录'],['裁判',t.engine?.roles?.judge?.name||t.engine?.judge||'未记录']];
  const style=`body{font:13px/1.75 "Microsoft YaHei","PingFang SC",sans-serif;color:#25364c;background:#fff;max-width:1020px;margin:32px auto;padding:24px}h1{font-size:25px;margin:0 0 8px}h2{font-size:19px}h3{font-size:16px;margin:0}h4{font-size:13px;margin:0 0 5px}p{margin:7px 0}small,.analysis-caption,.analysis-kicker,.analysis-section-head>span,.analysis-record-id{font-size:11px;color:#64748b}table{width:100%;border-collapse:collapse;white-space:normal}th,td{padding:9px 10px;text-align:left;border:1px solid #dfe6ee;vertical-align:top}th{background:#f4f7fb;font-weight:500}td small{display:block}section{margin:18px 0}.task-analysis-report{background:#fff}.task-analysis-report>.analysis-section{margin:0;padding:18px 0}.analysis-metrics{display:table;width:100%;border:1px solid #dfe6ee}.analysis-metric{display:table-cell;width:16.666%;padding:12px 8px;border-right:1px solid #dfe6ee;vertical-align:top}.analysis-metric span,.analysis-metric strong,.analysis-metric>small{display:block}.analysis-metric strong{font-size:22px}.analysis-metric strong small{font-size:13px;display:inline}.analysis-metric>small{font-size:10px}.analysis-breach,.breach>strong{color:#b34d48}.analysis-defended,.defended>strong{color:#398365}.analysis-error,.error>strong{color:#986820}.analysis-section{border:0;border-top:1px solid #e5eaf0}.analysis-section-head{display:flex;justify-content:space-between;gap:15px;padding:12px 0;background:#fff}.analysis-findings article,.analysis-evidence article,.analysis-actions article{padding:13px 14px;border-bottom:1px solid #e5eaf0;break-inside:avoid}.analysis-number{display:none}.analysis-evidence-head{display:flex;justify-content:space-between;font-size:11px}.analysis-evidence-head span{margin-right:12px}.analysis-evidence-category{font-size:11px;color:#64748b}.analysis-result{color:#b34d48}.analysis-evidence dl{margin:8px 0}.analysis-evidence dl>div{display:flex;gap:14px}.analysis-evidence dt{width:84px;flex-shrink:0;color:#64748b}.analysis-evidence dd{margin:0;overflow-wrap:anywhere}.analysis-caption,.analysis-empty{padding:10px 14px}.analysis-coverage-stats{display:table;width:100%}.analysis-coverage-stats>div{display:table-cell;width:25%;padding:12px 14px}.analysis-coverage-stats strong,.analysis-coverage-stats span{display:block}.analysis-coverage-stats strong{font-size:19px}.analysis-coverage-stats small{margin-left:5px}.analysis-coverage-stats span{font-size:11px}.analysis-limitations ul{padding:0 20px}.analysis-scene-profile{display:flex;align-items:center;gap:24px;padding:14px}.analysis-radar,.analysis-radar-empty{width:48%;flex:none}.analysis-radar svg{display:block;width:100%;max-width:440px}.analysis-radar p{font-size:11px;text-align:center;color:#64748b}.analysis-scene-summary{flex:1}.analysis-scene-summary dl>div{display:flex;justify-content:space-between;border-top:1px solid #e5eaf0;padding:7px 0}.analysis-scene-summary dd{margin:0}.analysis-scene-bar-row{border-bottom:1px solid #e5eaf0;padding:10px 0}.analysis-scene-bar-row>div:first-child{display:flex;justify-content:space-between;gap:10px}.analysis-scene-bar-track{height:5px;background:#eef2f7;margin:8px 0}.analysis-scene-bar-track>span{display:block;height:100%;background:#3370ff}.analysis-scene-bar-row>small{font-size:11px;color:#64748b}.analysis-radar-empty>p{color:#64748b;font-size:11px}.analysis-actions h4 small{display:block;font-weight:400}.analysis-limitations{font-size:11px;color:#64748b;border-top:1px solid #e5eaf0;padding-top:16px}.analysis-table td{overflow-wrap:anywhere}footer{margin-top:24px;color:#64748b;font-size:11px}@page{margin:15mm}@media print{body{max-width:none;margin:0;padding:0;font-size:10pt}thead{display:table-header-group}h2,h3,h4,.analysis-section-head{break-after:avoid}tr,.analysis-scene-profile{break-inside:avoid}.analysis-section{break-inside:auto}.analysis-metric strong{font-size:18px}.analysis-radar svg{max-height:310px}}`;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${E(t.name)} · 演练报告</title><style>${style}${digestStyles}</style></head><body><article class="task-analysis-report"><h1>${E(t.name)} · ${a.pending?'阶段演练报告':'演练报告'}</h1><p>${E(statusText(t))} · 创建于 ${E(t.created||'未记录')}</p><section><h2>评估范围与方法</h2><table><tbody>${config.map(([key,value])=>`<tr><th>${E(key)}</th><td>${E(value)}</td></tr>`).join('')}</tbody></table></section><section><h2>${E(reportHeadline(a))}</h2>${metricsHTML(a,t)}</section>${reportBody(t,a,true)}<footer>智安 · 攻防演练中心 · 统计结果来自当前任务快照</footer></article></body></html>`;
};
})();
