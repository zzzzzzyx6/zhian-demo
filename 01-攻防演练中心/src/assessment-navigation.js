(function(){
'use strict';
const A=window.App,S=A.scanProduct,V=A.evaluation,B=A.scanRestoration,Q=A.assessment,E=A.escape;
const back=(label,action)=>`<button type="button" class="back assessment-back" title="${E(label)}" aria-label="${E(label)}" onclick="${action}">${A.icon('arrow',16)}</button>`;
const heading=(t,report)=>`<div class="attack-detail-top refined scan-unified-heading">${back(report?'返回报告分析':'返回任务列表',report?'App.evaluation.openReportList()':`App.scanRestoration.list('${E(t.type)}')`)}<div class="task-detail-heading"><div class="task-title-line"><h1>${E(t.name)}</h1>${Q.taskStatus(t)}</div><p>任务创建时间：${E(t.created||t.createdAt||'未记录')}</p></div><div class="page-actions">${report?`<button class="btn" data-id="${E(t.id)}" onclick="App.scanProduct.open(this.dataset.id)">来源任务</button>`:`<button class="btn" data-object="${E(Q.objectKey(t))}" onclick="App.assessment.openObject(this.dataset.object)">对象评估历史</button>${['done','error','stopped'].includes(t.status)?`<button class="btn" data-id="${E(t.id)}" onclick="App.scanProduct.retest(this.dataset.id)">再次评估</button>`:''}`}</div></div>`;
S.detailHTML=function(t){return heading(t,false)+B.frame('/projects/'+encodeURIComponent(t.id),V.reportReady(t)?'report':'run');};
S.reportHTML=function(id){const t=S.tasks().find(t=>t.id===id);if(!V.reportReady(t))return A.heading('','评估报告','任务成功完成后生成报告。');return heading(t,true)+B.frame('/projects/'+encodeURIComponent(t.id),'report');};
// Keep each existing return destination; move the same arrow control before its title.
for(const [owner,key] of [[Q,'objectDetailHTML'],[A.leanPlatform,'applicationResultHTML']]){const original=owner[key];if(!original)continue;owner[key]=function(...args){let html=original.apply(this,args);const match=html.match(/<button class="btn" onclick="([^"]+)">(返回[^<]+)<\/button>/);if(!match)return html;html=html.replace(match[0],'');return html.replace('<div class="page-heading">','<div class="page-heading">'+back(match[2],match[1]));};}
})();
