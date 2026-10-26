/* Successful complete reports retain the original object-history analysis. */
(function(){
'use strict';
const A=window.App,V=A.evaluation,X=A.attack,Q=A.assessment,S=A.scanProduct,L=A.leanPlatform,E=A.escape;
const R=A.reportRefinement={},target=t=>t.targetName||t.targetSnapshot?.name||X.targetFor(t)?.name||'未记录';
V.reportReady=function(t){
 if(!t||t.deletedAt||t.status!=='done'||t.resultSource==='simulation'||t.simulated===true||t.simulation===true)return false;
 const m=V.metrics(t);if(!m.total||m.done!==m.total||m.errors>0)return false;
 return V.type(t)==='scan'?t.resultSaved===true:m.valid===m.total;
};
V.reports=function(){const f=V.reportFilters,q=String(f.query||'').trim().toLowerCase();return V.allTasks().filter(t=>V.reportReady(t)&&(f.type==='all'||V.type(t)===f.type)&&(!q||[t.name,t.id,target(t)].join(' ').toLowerCase().includes(q))).sort((a,b)=>(f.sort==='asc'?1:-1)*(Date.parse(a.created||0)-Date.parse(b.created||0)));};
Q.reportNav=()=>'';
// Restore the existing asset history, charts and report drill-down; only the tab label changes.
V.reportsHTML=function(){if(['objects','compare'].includes(V.reportTab))return Q.objectResultsHTML();const f=V.reportFilters,rows=V.reports();return `<div class="lp-page">${A.heading('','评估报告','')}${Q.reportNav()}<section class="card lp-table"><div class="toolbar lp-toolbar pr-filters"><select aria-label="报告类型" onchange="App.evaluation.filter('reports','type',this.value)"><option value="all">全部评估类型</option><option value="attack" ${f.type==='attack'?'selected':''}>攻防演练</option><option value="scan" ${f.type==='scan'?'selected':''}>漏洞扫描</option></select><label class="dc-search">${A.icon('search',16)}<input id="ec-reports-query" type="search" aria-label="搜索报告" placeholder="搜索任务或对象" value="${E(f.query)}" onchange="App.evaluation.filter('reports','query',this.value)"></label></div><div class="table-wrap"><table><thead><tr><th>任务报告</th><th>评估对象</th><th>评估结果</th><th>创建时间</th></tr></thead><tbody>${rows.map(t=>`<tr><td><button class="link-btn" data-id="${E(t.id)}" onclick="App.evaluation.openReport(this.dataset.id)">${E(t.name)}</button><small>${E(V.typeName(t))}</small></td><td>${E(target(t))}<small>${E(t.targetMaterial?.version||'')}</small></td><td>${L.resultHTML(t)}</td><td>${E(t.created||'—')}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">暂无已成功完成的评估报告</td></tr>'}</tbody></table></div></section></div>`;};
const openReport=V.openReport;
V.openReport=function(id){const t=V.allTasks().find(t=>t.id===id);if(!V.reportReady(t)){A.toast('任务成功完成全部执行后才生成报告，请先查看任务记录。');return false;}return openReport.call(V,id);};
const scanReport=S.reportHTML,scanExport=S.exportReport;
S.reportHTML=function(id){const t=S.tasks().find(t=>t.id===id);return V.reportReady(t)?scanReport.call(S,id):A.heading('','扫描报告','任务成功完成后生成报告。');};
S.exportReport=function(id){const t=S.tasks().find(t=>t.id===id);if(!V.reportReady(t)){A.toast('任务尚未成功完成，暂无可导出的报告');return false;}return scanExport.apply(S,arguments);};
// The embedded scanner also receives eligibility, so its own report button cannot bypass the archive contract.
const payload=S.payload;
S.payload=function(t){const data=payload.call(S,t);data.reportEligible=V.reportReady(t);return data;};
const detail=S.detailHTML;
S.detailHTML=function(t){return detail.call(S,t).replace("data-tab=\"report\"",`data-tab="${V.reportReady(t)?'report':'run'}"`);};
const exportTask=V.exportTaskReport;
V.exportTaskReport=function(id){if(!V.reportReady(X.db.tasks.find(t=>t.id===id))){A.toast('任务成功完成后才可导出报告');return false;}R.exporting=id;try{return exportTask.apply(V,arguments);}finally{R.exporting=null;}};
for(const name of ['exportReport','printReport','exportWord']){const fn=X[name];if(typeof fn==='function')X[name]=function(){if(!V.reportReady(X.db.tasks.find(t=>t.id===(R.exporting||X.selected)))){A.toast('任务成功完成后才可导出报告');return false;}return fn.apply(X,arguments);};}
const reportHTML=X.reportHTML;
X.reportHTML=function(){return V.reportReady(X.db.tasks.find(t=>t.id===(R.exporting||X.selected)))?reportHTML.apply(X,arguments):'';};
})();
