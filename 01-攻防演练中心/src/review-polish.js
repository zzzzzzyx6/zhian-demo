/* Consistent report actions, focused policy libraries, and no replacement answers. */
(function(){
'use strict';
const A=window.App,P=A.platform,E=A.escape,S=A.contentSafety,G=A.guardrail,O=A.protectionOps,C=A.contentProduct,U=A.unifiedGuard,K=A.protectionMvp,R=A.safetyRules,D=A.defensePolicies,F=A.defenseConfigurations,M=A.policyManagement,N=A.policyKnowledge,V=A.evaluation,Q=A.assessment;
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v));
const W=A.reviewPolish={};
const link=(label,id,handler,cls='')=>label==='删除'?`<button type="button" class="entry-delete ${cls}" title="删除" aria-label="删除报告 ${E(id)}" data-id="${E(id)}" onclick="${handler}(this.dataset.id)">${A.icon('trash',16)}</button>`:`<button type="button" class="link-btn ${cls}" data-id="${E(id)}" onclick="${handler}(this.dataset.id)">${E(label)}</button>`;
const sourceOptions=value=>[['','全部来源'],['system','系统'],['custom','自建']].map(([id,name])=>`<option value="${id}" ${value===id?'selected':''}>${name}</option>`).join('');
M.sourceBadge=r=>`<span class="pmr-source ${M.isPreset(r)?'system':'custom'}">${M.isPreset(r)?'系统':'自建'}</span>`;
const sourceMatches=(r,value)=>!value||(M.isPreset(r)?'system':'custom')===value;

W.reportDeleted=t=>!!A.data.deletedEvaluationReports?.[(V.type(t)||'attack')+':'+t.id];
const reports=V.reports;
V.reports=function(){return reports.apply(V,arguments).filter(t=>!W.reportDeleted(t));};
W.deleteReport=function(kind,id,confirmed=false){
 const report=kind==='protection'?A.protectionRecords.report(id):V.allTasks().find(t=>t.id===id);
 if(!report)return false;
 if(!confirmed){A.modal('删除报告',`<p>确定删除「${E(report.name||report.appName+' · 防护报告')}」？</p><p class="hint">只删除报告，原有任务、检测记录和风险证据继续保留。</p>`,`<button type="button" class="btn" onclick="App.closeModal()">取消</button><button type="button" class="entry-delete" title="确认删除" aria-label="确认删除报告" data-id="${E(id)}" onclick="App.reviewPolish.deleteReport('${kind}',this.dataset.id,true)">${A.icon('trash',16)}</button>`,{plain:true});return true;}
 if(kind==='protection'){S.db.protectionReports=S.db.protectionReports.filter(r=>r.id!==report.id);if(A.protectionRecords.reportId===report.id)A.protectionRecords.reportId=null;}
 else(A.data.deletedEvaluationReports||={})[(V.type(report)||'attack')+':'+report.id]=new Date().toISOString();
 S.audit('report.delete',id,'删除'+(kind==='protection'?'防护':'评估')+'报告');A.save();A.closeModal();A.render();A.toast('报告已删除');return true;
};
W.removeProtection=id=>W.deleteReport('protection',id);
W.removeEvaluation=id=>W.deleteReport('evaluation',id);
const evalReports=V.reportsHTML;
V.reportsHTML=function(){if(['objects','compare'].includes(V.reportTab))return evalReports.apply(V,arguments);const html=evalReports.apply(V,arguments);let index=0;const rows=V.reports();return html.replace('<th class="ds-date">生成时间</th>','<th class="ds-date">生成时间</th><th>操作</th>').replace(/(<thead>[\s\S]*?<tr>[\s\S]*?生成时间<\/th>)(?!<th>操作)/,'$1<th>操作</th>').replace(/(<tbody>)([\s\S]*?)(<\/tbody>)/,(all,start,body,end)=>start+body.replace(/<\/tr>/g,()=>{const t=rows[index++];return (t?`<td>${link('删除',t.id,'App.reviewPolish.removeEvaluation','review-delete')}</td>`:'')+'</tr>';}).replace(/colspan="4"/g,'colspan="5"')+end);};
const openReport=V.openReport;
V.openReport=function(id){const t=V.allTasks().find(t=>t.id===id);if(t&&W.reportDeleted(t)){A.toast('该报告已删除，任务记录仍可查看');return false;}return openReport.apply(V,arguments);};
const attackReport=V.reportDetailHTML;
V.reportDetailHTML=function(t){return t&&W.reportDeleted(t)?A.heading('','报告已删除','可从任务管理查看原任务记录。'):attackReport.apply(V,arguments);};
const scanReport=A.scanProduct.reportHTML;
A.scanProduct.reportHTML=function(id){const t=A.scanProduct.tasks().find(t=>t.id===id);return t&&W.reportDeleted(t)?A.heading('','报告已删除','可从检测任务查看原任务记录。'):scanReport.apply(this,arguments);};
const evaluationExport=V.exportTaskReport;
V.exportTaskReport=function(id){const t=V.allTasks().find(t=>t.id===id);return t&&W.reportDeleted(t)?false:evaluationExport.apply(V,arguments);};
const scanExport=A.scanProduct.exportReport;
A.scanProduct.exportReport=function(id){const t=A.scanProduct.tasks().find(t=>t.id===id);return t&&W.reportDeleted(t)?false:scanExport.apply(this,arguments);};

const protectionReports=C.reports;
C.reports=function(){return protectionReports.apply(C,arguments)
 .replace(/<button class="btn primary" onclick="App.unifiedGuard.reportForm\(\)">[^<]*<\/button>/,'')
 .replace(/<td><details class="report-export ec-task-export prr-export">[\s\S]*?<\/details><\/td>/g,(html)=>{const id=html.match(/data-id="([^"]+)"/)?.[1];return `<td>${id?link('删除',id,'App.reviewPolish.removeProtection','review-delete'):''}</td>`;});};

R.render=function(){const types={regex:'正则规则',semantic:'语义规则'},type=Object.hasOwn(types,R.typeFilter)?R.typeFilter:'all',query=String(R.query||'').trim().toLowerCase(),rows=R.db.filter(r=>r.type!=='word'&&(type==='all'||r.type===type)&&sourceMatches(r,M.ruleSource)&&(r.name+' '+(r.description||'')).toLowerCase().includes(query));return `<div class="defense-product lean-operations pmr-resources">${A.heading('','规则库','',`<button type="button" class="btn primary" onclick="App.safetyRules.edit()">＋ 新建规则</button>`)}<section class="card"><div class="toolbar pmr-resource-filters"><select aria-label="规则来源" onchange="App.policyManagement.filterRules('source',this.value)">${sourceOptions(M.ruleSource)}</select><select aria-label="规则类型" onchange="App.policyManagement.filterRules('type',this.value)"><option value="all">全部规则类型</option>${Object.entries(types).map(([id,name])=>`<option value="${id}" ${type===id?'selected':''}>${name}</option>`).join('')}</select><input type="search" aria-label="搜索规则" placeholder="搜索规则名称" value="${E(R.query||'')}" onchange="App.policyManagement.filterRules('query',this.value)"></div><div class="table-wrap"><table class="ds-table pmr-resource-table"><thead><tr><th>规则名称</th><th>类型</th><th>来源</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${link(r.name,r.id,'App.safetyRules.detail')}</td><td>${types[r.type]||E(r.type)}</td><td>${M.sourceBadge(r)}</td><td>${A.badge(r.enabled?'可用':'停用',r.enabled?'green':'gray')}</td><td><div class="lo-actions">${M.isPreset(r)?'—':link('编辑',r.id,'App.safetyRules.edit')+A.entryManagement.button('safety-rule',r.id)}</div></td></tr>`).join('')||'<tr><td colspan="5" class="empty">暂无符合条件的规则</td></tr>'}</tbody></table></div></section></div>`;};
K.knowledge=function(){K.tab='words';const query=String(K.query||'').trim().toLowerCase(),rows=R.db.filter(r=>r.type==='word'&&sourceMatches(r,M.knowledgeSource)&&r.name.toLowerCase().includes(query));return `<div class="pmr-resources">${A.heading('','词库','',`<button type="button" class="btn primary" onclick="App.protectionMvp.wordEdit()">＋ 新建词库</button>`)}<section class="card"><div class="toolbar pmr-resource-filters"><select aria-label="词库来源" onchange="App.policyManagement.filterKnowledge('source',this.value)">${sourceOptions(M.knowledgeSource)}</select><input type="search" aria-label="搜索词库" placeholder="搜索词库名称" value="${E(K.query||'')}" onchange="App.policyManagement.filterKnowledge('query',this.value)"></div><div class="table-wrap"><table class="ds-table pmr-resource-table"><thead><tr><th>词库名称</th><th>来源</th><th>词条数量</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${link(r.name,r.id,'App.protectionMvp.wordDetail')}</td><td>${M.sourceBadge(r)}</td><td>${arr(r.words).length}</td><td>${A.badge(r.enabled?'可用':'停用',r.enabled?'green':'gray')}</td><td><div class="lo-actions">${M.isPreset(r)?'—':link('编辑',r.id,'App.protectionMvp.wordEdit')+A.entryManagement.button('safety-rule',r.id)}</div></td></tr>`).join('')||'<tr><td colspan="5" class="empty">暂无符合条件的词库</td></tr>'}</tbody></table></div></section></div>`;};
R.detail=function(id){const r=R.get(id);if(!r)return;const names={contains:'包含匹配',exact:'全文精确匹配',prefix:'前缀匹配',suffix:'后缀匹配'};A.drawer(E(r.name),`<div class="gr-config"><p>${E(r.description||'')}</p>${r.type==='word'?`<h3>词条 · ${names[r.matchMode]||'包含匹配'}</h3><pre class="code-block">${E(arr(r.words).join('\n'))}</pre>`:r.type==='regex'?`<h3>正则表达式</h3><pre class="code-block">${E(arr(r.patterns).join('\n'))}</pre>`:`<h3>风险语义</h3><p>${E(r.semanticDescription||'')}</p><div class="kv"><span>相似度阈值</span><strong>${E(r.threshold)}</strong></div><h3>正向样本</h3><pre class="code-block">${E(arr(r.positiveExamples).join('\n')||'未配置')}</pre><h3>负向样本</h3><pre class="code-block">${E(arr(r.negativeExamples).join('\n')||'未配置')}</pre>`}</div>`,'');};
K.wordDetail=id=>R.detail(id);
M.copyRule=()=>false;M.copyReply=()=>false;M.replyEditor=()=>false;
K.replyPicker=()=>'';K.replyEdit=K.replyDetail=D.replyEdit=D.replySave=D.repliesHTML=()=>false;
K.importWords=()=>false;K.replyReferences=()=>[];
D.actionFields=function(d){return `<div class="form-grid">${[['controversialAction','待确认时'],['unsafeAction','不安全时']].map(([key,label])=>`<div class="field"><label>${label}</label><select aria-label="${label}" onchange="App.defensePolicies.draft.${key}=this.value">${Object.entries({allow:'放行',log:'放行',block:'阻断',...(key==='controversialAction'?{review:'先阻断并加入复核'}:{})}).map(([id,name])=>`<option value="${id}" ${d[key]===id?'selected':''}>${name}</option>`).join('')}</select></div>`).join('')}</div>`;};
if(A.policyUsability)A.policyUsability.defenseTabs=()=>F.tabs();
const testHTML=K.testHTML;
K.testHTML=function(){return testHTML.apply(K,arguments).replace('>验证规则</button>','>开始验证</button>').replace('使用已发布规则快照；不会生成业务流量或改变应用防护状态。','使用所选策略的已发布快照。本地执行词库和正则；需要模型的检测项会列为未执行。不会生成业务流量。');};
const testRules=K.testRules;
K.testRules=function(){if(!String(K.testDraft?.text||'').trim()){K.testResult='请先输入待测文本。';return false;}return testRules.apply(K,arguments);};
const wordForm=K.wordForm;
K.wordForm=function(){const modal=A.modal;A.modal=function(title,body,footer,opts){body=body.replace(/<label>导入 UTF-8 文本文件[\s\S]*?<\/label>/,'').replace(/<p class="hint">最多 200 条[\s\S]*?<\/p>/,'');return modal.call(A,title,body,footer,opts);};try{return wordForm.apply(K,arguments);}finally{A.modal=modal;}};
F.table=function(){const rows=F.rows().filter(p=>!F.query||p.name.toLowerCase().includes(F.query.toLowerCase()));return `<section class="card"><div class="toolbar"><input type="search" aria-label="搜索策略配置" placeholder="搜索策略名称" value="${E(F.query)}" onchange="App.defenseConfigurations.query=this.value;App.render()"></div><div class="table-wrap"><table class="ds-table review-config-table"><thead><tr><th>策略名称</th><th>检测位置</th><th>基础策略</th><th>规则</th><th>操作</th></tr></thead><tbody>${rows.map(p=>{const v=F.latest(p.id);return `<tr><td>${link(p.name,p.id,'App.defenseConfigurations.detail')}</td><td>${F.positions(v)}</td><td>${v.basics.length}</td><td>${v.rules.length}</td><td><div class="lo-actions">${link('修改配置',p.id,'App.defenseConfigurations.edit')}${A.entryManagement.button('defense-configuration',p.id)}</div></td></tr>`;}).join('')||'<tr><td colspan="5" class="empty">暂无策略配置</td></tr>'}</tbody></table></div></section>`;};
N.applications=()=>false;
const basics=F.basicTable;
F.basicTable=function(){return basics.apply(F,arguments).replace('<th>基础策略</th>','<th>基础策略</th><th>来源</th>').replace(/(<tbody>)([\s\S]*?)(<\/tbody>)/,(all,start,body,end)=>start+body.replace(/(<tr><td>[\s\S]*?<\/td>)/g,'$1<td><span class="pmr-source system">系统</span></td>')+end);};
const basicDetail=D.detail;
D.detail=function(){const drawer=A.drawer;A.drawer=function(title,body){return drawer.call(A,title,body,'');};try{return basicDetail.apply(D,arguments);}finally{A.drawer=drawer;}};
const policies=A.policies.renderPolicies;
A.policies.renderPolicies=function(){return policies.apply(this,arguments).replace(/>编辑<\/button>/g,'>修改配置</button>');};

// Remove retired answer settings from active configuration and exported snapshots.
const answerKeys=new Set(['replyTemplateId','reviewReplyTemplateId','replyTemplateSnapshot','replyTemplate','replyText','guardReplyTemplates']);
W.stripAnswers=function(value){if(!value||typeof value!=='object')return value;for(const key of Object.keys(value)){if(answerKeys.has(key))delete value[key];else W.stripAnswers(value[key]);}return value;};
const makeDraft=D.newDraft;D.newDraft=function(){return W.stripAnswers(makeDraft.apply(D,arguments));};
const createDraft=F.createDraft;F.createDraft=function(){return W.stripAnswers(createDraft.apply(F,arguments));};
const freeze=A.contentPolicies.freeze;A.contentPolicies.freeze=function(){return W.stripAnswers(freeze.apply(this,arguments));};
const snapshot=F.snapshot;F.snapshot=function(){return W.stripAnswers(snapshot.apply(F,arguments));};
const validate=F.validate;F.validate=function(d){return validate.call(F,W.stripAnswers(copy(d)));};
const exportRow=O.exportRow;O.exportRow=function(r){const result=W.stripAnswers(exportRow.call(O,r));if(result.execution){delete result.execution.reply;delete result.execution.reply_template;}return result;};
const detail=S.detailHTML;S.detailHTML=function(r){const view=copy(r);delete view.response;delete view.reply;delete view.replyTemplate;return detail.call(S,view).replace(/<div class="gr-evidence"><strong>返回代答[\s\S]*?<\/div>/g,'');};
const reportBody=O.reportBody;O.reportBody=function(report){const view=copy(report);for(const r of arr(view.requests)){delete r.response;delete r.reply;delete r.replyTemplate;}return reportBody.call(O,view);};
W.migrate=function(){if(!S.db)return;W.stripAnswers(A.data);A.data.guardReplyTemplates=[];
 const cleanRecord=r=>{delete r.response;delete r.reply;delete r.replyTemplate;};
 for(const r of arr(S.db.requests))cleanRecord(r);
 for(const report of arr(S.db.protectionReports))for(const r of arr(report.requests))cleanRecord(r);
 for(const r of arr(A.data.protectionCompactExamplesArchive?.requests))cleanRecord(r);
 const removed=R.get('rule-order-prompt');
 if(removed){
  // Publish the removal for future requests; old records and older revisions keep evidence.
  for(const p of F.rows().slice())if(p.rules.some(l=>l.ruleId===removed.id))F.store({...copy(p),rules:p.rules.filter(l=>l.ruleId!==removed.id)});
  for(const b of S.db.bindings)if(arr(b.defenseConfigurationSnapshot?.rules).some(l=>l.ruleId===removed.id)){const latest=F.latest(b.defenseConfigurationId);if(latest){b.defenseConfigurationSnapshot=copy(latest);b.defenseConfigurationVersion=latest.version;}}
  R.db.splice(R.db.indexOf(removed),1);
 }
 K.tab='words';
};
const start=A.start;A.start=function(){const result=start.apply(A,arguments);W.migrate();A.save();if(A.session)A.render();return result;};
const go=P.go;P.go=function(section,item,tab,id){const target='#'+[section,item,tab,id].filter(v=>v!==undefined&&v!==null&&v!=='').map(encodeURIComponent).join('/');if(location.hash===target&&!document.querySelector('.overlay.open')){A.render();return;}return go.apply(P,arguments);};
const select=P.selectState;P.selectState=function(section,item,tab,id){if(section==='policy'&&item==='defense'&&tab==='knowledge')id='words';return select.call(P,section,item,tab,id);};
const chrome=P.renderChrome;P.renderChrome=function(){const result=chrome.apply(P,arguments);const host=document.getElementById('center-sidebar');if(host){for(const button of host.querySelectorAll('button'))if(button.textContent==='知识库')button.textContent='词库';}if(P.state.section==='policy'&&D.tab==='knowledge'){document.getElementById('current-crumb').textContent='策略中心 / 词库';document.title='词库 · AI安全平台';}return result;};A.centers.render=P.renderChrome;
})();
