/* Remove legacy sample badges from product surfaces; retain data provenance in storage/exports. */
(function(){
'use strict';
const A=window.App;
const clean=html=>typeof html!=='string'?html:html
 .replace(/<span class="lo-demo-label">[\s\S]*?<\/span>/g,'')
 .replace(/<small class="lo-origin">演示记录<\/small>/g,'')
 .replace(/<div class="lp-example-note">[\s\S]*?<\/div>/g,'')
 .replace(/演示输入：|演示输出：/g,'')
 .replace(/演示数据|演示记录|示例结果|演示场景/g,'本地记录')
 .replace(/平台演示|预置演示样例/g,'本地流程')
 .replace(/演示运行/g,'暂无检测结论')
 .replace(/演示已开启|开启演示/g,'开启防护')
 .replace(/演示已结束|结束演示|结束防护演示/g,'关闭防护')
 .replace(/演示进行中/g,'运行中')
 .replace(/演示接入/g,'API 接入')
 .replace(/当前为本地演示/g,'等待应用接入')
 .replace(/首次演示交付|已演示交付/g,'首次交付记录')
 .replace(/复核正常 · 演示放行|演示放行/g,'放行记录')
 .replace(/等待执行回执|待执行回执/g,'未确认执行')
 .replace(/报告与结果分析/g,'报告与分析')
 .replace(/源码/g,'代码');
A.presentationCopy={clean};
for(const name of ['modal','drawer']){const previous=A[name];A[name]=function(title,body,footer,options){return previous.call(A,clean(title),clean(body),clean(footer),options);};}
const toast=A.toast;A.toast=function(message){return toast.call(A,clean(message));};
const render=A.modules.attack.render;A.modules.attack.render=function(){return clean(render.apply(this,arguments));};
const detail=A.contentSafety.detailHTML;A.contentSafety.detailHTML=function(){return clean(detail.apply(this,arguments));};
const document=A.evaluation.taskReportDocument;A.evaluation.taskReportDocument=function(){return clean(document.apply(this,arguments));};
const report=A.attack.reportHTML;A.attack.reportHTML=function(){return clean(report.apply(this,arguments));};
})();
