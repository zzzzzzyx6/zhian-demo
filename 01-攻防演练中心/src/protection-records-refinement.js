/* Focused record selection and full-page, immutable protection reports. */
(function(){
'use strict';
const A=window.App,S=A.contentSafety,G=A.guardrail,O=A.protectionOps,C=A.contentProduct,U=A.unifiedGuard,P=A.platform,E=A.escape;
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v)),stages={input:'输入',output:'输出'},actions={allow:'放行',block:'阻断'};
const R=A.protectionRecords={selected:new Set(),pageRows:[],reportId:null,pageSize:12};
const content=r=>String(r.text||r.imageRef||arr(r.images).map(v=>v.url).join('；')||'—').replace(/演示输入：|演示输出：/g,'');
const actual=r=>r.enforcementAck===true?(actions[r.effectiveAction||r.action]||'未确认执行'):'未确认执行';
const verdict=r=>r.detectionStatus==='skipped'?'Skipped':r.detectionComplete===false?'Unknown':r.safety||r.original?.safety||'Unknown';
const link=(label,id,action)=>`<button class="link-btn ds-name" data-id="${E(id)}" onclick="${action}(this.dataset.id)">${E(label)}</button>`;
const options=(rows,value,all)=>`<option value="">${E(all)}</option>`+rows.map(([id,label])=>`<option value="${E(id)}" ${id===value?'selected':''}>${E(label)}</option>`).join('');
R.record=id=>S.db.requests.find(r=>r.id===id)||arr(A.data.protectionCompactExamplesArchive?.requests).find(r=>r.id===id);
R.selectedRows=function(){const rows=G.records(),valid=new Set(rows.map(r=>r.id));for(const id of R.selected)if(!valid.has(id))R.selected.delete(id);return rows.filter(r=>R.selected.has(r.id));};
R.toggle=function(id,checked){if(!G.records().some(r=>r.id===id))return;checked?R.selected.add(id):R.selected.delete(id);A.render();};
R.selectPage=function(checked){R.pageRows.forEach(r=>checked?R.selected.add(r.id):R.selected.delete(r.id));A.render();};
R.selectFiltered=function(){S.filteredRequests().forEach(r=>R.selected.add(r.id));A.render();};
R.clear=function(){R.selected.clear();A.render();};
R.exportSelected=function(){
 const rows=R.selectedRows();if(!rows.length){A.toast('请先选择防护记录');return false;}
 const data=rows.map(r=>({...O.exportRow(r),images:copy(arr(r.images)),simulation:r.simulation===true,external_verified:r.externalVerified===true}));
 A.download('防护记录-所选'+rows.length+'条.jsonl',data.map(r=>JSON.stringify(r)).join('\n'),'application/x-ndjson;charset=utf-8');
 O.audit('records.export',S.uuid('export'),'导出所选防护记录：'+rows.length+' 条',{requestIds:rows.map(r=>r.id)});A.save();return data;
};
R.syncSelection=function(){const el=document.getElementById('protection-records-select-all');if(!el)return;const n=R.pageRows.filter(r=>R.selected.has(r.id)).length;el.indeterminate=n>0&&n<R.pageRows.length;};
S.requestTable=function(rows){
 R.pageRows=rows;const checked=rows.length&&rows.every(r=>R.selected.has(r.id));
 return `<div class="table-wrap ds-table-wrap"><table class="ds-table po-record-table prr-record-table"><thead><tr><th class="prr-check"><input id="protection-records-select-all" type="checkbox" aria-label="选择本页全部防护记录" ${checked?'checked':''} ${rows.length?'':'disabled'} onchange="App.protectionRecords.selectPage(this.checked)"></th><th>请求 ID</th><th>内容</th><th>应用</th><th>阶段</th><th>内容类型</th><th>检测判定</th><th>处置动作</th><th>后续跟进</th><th>检测时间</th></tr></thead><tbody>${rows.map(r=>{const review=S.db.reviews.find(v=>v.requestId===r.id);return `<tr class="${R.selected.has(r.id)?'prr-selected':''}"><td class="prr-check"><input type="checkbox" aria-label="选择记录 ${E(r.id)}" data-id="${E(r.id)}" ${R.selected.has(r.id)?'checked':''} onchange="App.protectionRecords.toggle(this.dataset.id,this.checked)"></td><td>${link(r.id,r.id,'App.contentSafety.detail')}</td><td class="ds-excerpt-cell"><span class="ds-excerpt" title="${E(content(r))}">${E(content(r))}</span></td><td>${E(S.appName(r.appId))}</td><td>${E(stages[r.stage]||r.stage)}</td><td>${r.contentType==='mixed'?'文本 + '+arr(r.images).length+' 张图片':r.contentType==='image'?'图片':'文本'}</td><td>${S.riskBadge(verdict(r))}</td><td>${A.badge(actual(r),r.enforcementAck&&(r.effectiveAction||r.action)==='block'?'red':'gray')}</td><td>${A.dispositionPolicy.followupHTML(r,review)}</td><td class="ds-date">${S.time(r.createdAt)}</td></tr>`;}).join('')||'<tr><td colspan="10" class="empty">暂无符合条件的防护记录</td></tr>'}</tbody></table></div>`;
};
C.records=function(){
 const rows=S.filteredRequests(),pages=Math.max(1,Math.ceil(rows.length/R.pageSize)),count=R.selectedRows().length;
 O.recordPage=Math.max(1,Math.min(O.recordPage||1,pages));
 const field=(key,label,items)=>`<select aria-label="${label}" onchange="App.contentSafety.filterChange('${key}',this.value)">${options(items,S.filter[key],label)}</select>`;
 const filters=field('app','全部应用',S.apps.map(a=>[a.id,a.name]))+field('stage','全部阶段',Object.entries(stages))+field('result','全部判定',[['Safe','安全'],['Controversial','待确认'],['Unsafe','不安全'],['skipped','未检测'],['error','检测异常']])+field('action','全部处置',Object.entries(actions));
 return A.heading('','防护记录','')+`<section class="card prr-records"><div class="toolbar cs-filters prr-filters">${filters}${S.timeFilter()}<label class="dc-search">${A.icon('search',16)}<input type="search" aria-label="内容或请求 ID" placeholder="内容 / 请求 ID" value="${E(S.filter.query||'')}" onchange="App.contentSafety.filterChange('query',this.value)"></label><button class="link-btn" onclick="App.protectionRecords.advanced=!App.protectionRecords.advanced;App.render()">${R.advanced?'收起筛选':'更多筛选'}</button><button class="link-btn" onclick="App.protectionMvp.resetFilters()">重置</button></div>${R.advanced?`<div class="toolbar prr-extra-filters">${field('type','全部内容',[['text','文本'],['image','图片'],['mixed','文本 + 图片']])}${field('review','全部复核',[['pending','待复核'],['complete','已复核']])}</div>`:''}<div class="er-selection prr-selection"><button class="btn small" ${rows.length?'':'disabled'} onclick="App.protectionRecords.selectFiltered()">选择筛选结果</button><button class="link-btn" ${count?'':'disabled'} onclick="App.protectionRecords.clear()">清空选择</button><span aria-live="polite">已选 <strong>${count}</strong> 条</span><button class="btn small primary" ${count?'':'disabled'} onclick="App.protectionRecords.exportSelected()">${A.icon('download',14)}导出所选（${count}）</button></div>${S.requestTable(rows.slice((O.recordPage-1)*R.pageSize,O.recordPage*R.pageSize))}<div class="table-foot"><span>共 ${rows.length} 条 · 每页 ${R.pageSize} 条</span><div><button class="btn small" ${O.recordPage===1?'disabled':''} onclick="App.protectionOps.recordPage--;App.render()">上一页</button><span>${O.recordPage} / ${pages}</span><button class="btn small" ${O.recordPage===pages?'disabled':''} onclick="App.protectionOps.recordPage++;App.render()">下一页</button></div></div></section>`;
};
const render=A.render;A.render=function(){const result=render.apply(A,arguments);R.syncSelection();return result;};

// Keep the detection/evidence semantics, while removing the requested presentation blocks.
R.imagesHTML=function(r){return arr(r.images).length?`<div class="prr-images">${r.images.map(v=>{const preview=String(v.previewData||'');return `<figure>${/^data:image\/(?:svg\+xml|png|jpeg|webp);/i.test(preview)?`<img src="${E(preview)}" alt="${E(v.alt||'检测图片 '+v.id)}" loading="lazy">`:''}<figcaption><strong>${E(v.id||'图片')}</strong><span>${E(v.url||'未记录图片引用')}</span></figcaption></figure>`;}).join('')}</div>`:'';};
const detailHTML=S.detailHTML;
S.detailHTML=function(r){
 let html=detailHTML.call(S,r);
 html=html.replace(/(<div class="cs-detail-summary">[\s\S]*?)<strong>[^<]*<\/strong><\/div>/,'$1</div>')
  .replace(/<section><h3>操作记录<\/h3>[\s\S]*?<\/section>/g,'')
  .replace(/<section><h3>内容与检测覆盖<\/h3>[\s\S]*?<\/section>/g,'');
 if(arr(r.images).length){html=html.replace(/<section class="gr-config"><h3>图片引用<\/h3>[\s\S]*?<\/section>/g,'');html=html.replace(`<pre class="code-block">${E(r.text)}</pre></section>`,`${r.text?`<pre class="code-block">${E(r.text)}</pre>`:''}${R.imagesHTML(r)}</section>`);}
 for(const p of arr(r.policyResults))if(p.partId&&arr(r.images).length)html=html.replace(`<strong>${E(p.name)}</strong><p>检测判定`, `<strong>${E(p.name)}</strong><small>检测对象：${p.partId==='text'?'文本':E(p.partId)}</small><p>检测判定`);
 return `<div class="prr-record-detail">${html}</div>`;
};
S.detail=function(id){const r=R.record(id);if(!r)return false;A.drawer('检测详情',S.detailHTML(r),'');return r;};
const governance=A.platformGovernance,openEvidence=governance?.openEvidence;
if(openEvidence)governance.openEvidence=function(id,index){const event=governance.db?.events.find(v=>v.id===id),evidence=event?.evidence?.[index];if(evidence?.source==='content'&&!S.db.requests.some(v=>v.id===evidence.recordId)&&R.record(evidence.recordId)){A.closeDrawer();P.go('protection','records');return S.detail(evidence.recordId);}return openEvidence.apply(governance,arguments);};

R.report=function(id){return S.db.protectionReports.find(r=>r.id===id||r.sessionId===id);};
const reportBody=O.reportBody;
O.reportBody=function(report){let html=reportBody.call(O,report);for(const r of arr(report.requests)){if(!arr(r.images).length)continue;const text=[r.text,...r.images.map(v=>v.url)].filter(Boolean).join('\n')||r.imageRef||'',shown=text.replace(/演示输入：|演示输出：/g,'');html=html.replace(`<div class="pr-content"><strong>检测内容</strong><pre>${E(shown)}</pre></div>`,`<div class="pr-content"><strong>检测内容</strong>${r.text?`<pre>${E(r.text)}</pre>`:''}${R.imagesHTML(r)}</div>`);}return html;};
R.exportMenu=function(id){return `<details class="report-export ec-task-export prr-export"><summary>${A.icon('download',14)}导出报告${A.icon('chevron',12)}</summary><div><button data-id="${E(id)}" onclick="this.closest('details').removeAttribute('open');App.protectionRecords.exportReport(this.dataset.id,'pdf')">PDF</button><button data-id="${E(id)}" onclick="this.closest('details').removeAttribute('open');App.protectionRecords.exportReport(this.dataset.id,'markdown')">Markdown</button></div></details>`;};
R.reportPage=function(id){const report=R.report(id),back=`<button type="button" class="back assessment-back" title="返回防护报告" aria-label="返回防护报告" onclick="App.platform.go('protection','reports')">${A.icon('arrow',16)}</button>`;if(!report)return `<div class="prr-report-page"><div class="page-heading">${back}<div><h1>防护报告</h1></div></div><section class="card empty">报告不存在或已删除</section></div>`;return `<div class="prr-report-page"><div class="attack-detail-top refined prr-report-heading">${back}<div class="task-detail-heading"><h1>${E(report.appName)} · 防护报告</h1><p>报告编号：${E(report.id)}　生成时间：${S.time(report.generatedAt)}</p></div><div class="page-actions">${R.exportMenu(report.id)}</div></div><section class="card prr-report-paper">${O.reportBody(report)}</section></div>`;};
const reportDocument=O.reportDocument;
O.reportDocument=function(id){const report=R.report(id);if(!report)return '';return reportDocument.call(O,report.id).replace(/<button class="print"[\s\S]*?<\/button>/,'').replace('</style>','.prr-images{display:flex;gap:16px;flex-wrap:wrap}.prr-images figure{margin:0;max-width:300px}.prr-images img{max-width:100%;max-height:200px;object-fit:contain}.prr-images figcaption span{display:block;overflow-wrap:anywhere}</style>');};
R.exportReport=function(id,format){
 const report=R.report(id);if(!report||!['pdf','markdown'].includes(format))return false;
 const html=O.reportDocument(report.id),name=(report.appName+'-'+report.id+'-防护报告').replace(/[\\/:*?"<>|]/g,'_');
 if(format==='markdown'){A.download(name+'.md',A.evaluation.reportMarkdown(html),'text/markdown;charset=utf-8');return true;}
 const frame=document.createElement('iframe');frame.title='防护报告打印预览';frame.style.cssText='position:fixed;width:1px;height:1px;bottom:0;left:0;border:0';
 frame.onload=()=>{frame.contentWindow.focus();frame.contentWindow.print();setTimeout(()=>frame.remove(),60000);};document.body.appendChild(frame);frame.srcdoc=html;return true;
};
const oldExport=G.exportReport;
G.exportReport=function(id,format){if(['pdf','markdown'].includes(format))return R.exportReport(id,format);if(format)return oldExport.apply(G,arguments);return O.reportDetail(id);};
O.reportDetail=function(id){const report=R.report(id);if(!report)return false;const previous=location.hash||'#protection/reports',target='#protection/reports/'+encodeURIComponent(report.id);P.go('protection','reports',report.id);if(previous!==target&&typeof history.pushState==='function'){history.replaceState(null,'',previous);history.pushState(null,'',target);}return report;};G.reportDetail=O.reportDetail;
C.reports=function(){
 const rows=S.db.protectionReports.filter(r=>!G.reportApp||r.appId===G.reportApp).slice().sort((a,b)=>Date.parse(b.generatedAt)-Date.parse(a.generatedAt));
 return A.heading('','防护报告','按已有记录生成报告快照。',`<button class="btn primary" onclick="App.unifiedGuard.reportForm()">＋ 生成报告</button>`)+`<section class="card prr-reports"><div class="toolbar"><select aria-label="报告应用" onchange="App.guardrail.reportApp=this.value;App.render()">${options(S.apps.map(a=>[a.id,a.name]),G.reportApp,'全部应用')}</select></div><div class="table-wrap ds-table-wrap"><table class="ds-table prr-report-table"><thead><tr><th>报告编号</th><th>应用名称</th><th>统计时段</th><th class="ds-number">检测次数</th><th class="ds-number">已阻断</th><th>生成时间</th><th>操作</th></tr></thead><tbody>${rows.map(r=>{const s=U.summary(arr(r.requests));return `<tr><td>${link(r.id,r.id,'App.protectionOps.reportDetail')}</td><td>${E(r.appName)}</td><td class="ds-date">${S.time(r.from)}<small>至 ${S.time(r.to)}</small></td><td class="ds-number">${s.n}</td><td class="ds-number">${s.blocked}</td><td class="ds-date">${S.time(r.generatedAt)}</td><td>${R.exportMenu(r.id)}</td></tr>`;}).join('')||'<tr><td colspan="7" class="empty">暂无报告，可按已有防护记录生成</td></tr>'}</tbody></table></div></section>`;
};
const contentRender=C.render;
C.render=function(page){if(page==='reports'&&R.reportId){C.init();C.page='reports';S.item='reports';return `<div class="content-safety-page content-product-page">${R.reportPage(R.reportId)}</div>`;}return contentRender.apply(C,arguments);};S.render=C.render;
const select=P.selectState;
P.selectState=function(section,item,tab,id){const result=select.apply(P,arguments);if(result)R.reportId=section==='protection'&&item==='reports'&&tab?tab:null;return result;};
const chrome=P.renderChrome;
P.renderChrome=function(){const result=chrome.apply(P,arguments);if(P.state.section==='protection'&&P.state.item==='reports'&&R.reportId){const hash='protection/reports/'+encodeURIComponent(R.reportId);if(location.hash.slice(1)!==hash)history.replaceState(null,'','#'+hash);document.getElementById('current-crumb').textContent='安全防护 / 防护报告';document.title='防护报告 · AI安全平台';}return result;};
A.centers.render=P.renderChrome;
})();
