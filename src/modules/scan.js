/* 安全扫描：代码 / 二进制 / Web 检测（扫描页面本体在 scan-center/）
 *
 * 本文件包含以下代码段（搜索「─── 名称」可直接跳转）：
 *   scan-product                       A self-contained scan demo. No network request or real scanner is invoked.
 *   scan-backend-alignment             Scan product contracts aligned to the existing source/binary/web workers. * This is a front-end interaction la
 *   asset-intake                       Business entry points own asset creation; tasks retain immutable material snapshots.
 *   scan-restoration                   Restore only the ZIP's scan views; platform assets, tasks, models and reports stay authoritative.
 *   assessment-navigation              
 *   review24                           October review: isolated scanner and focused product presentation changes.
 *
 * 每段登记为 AppParts['scan/名称']，执行顺序统一在 src/boot.js 中维护。
 */
window.AppParts = window.AppParts || {};

// ─── scan-product ──────────────────────────────────────────────────────────
AppParts['scan/scan-product'] = function () {
/* A self-contained scan demo. No network request or real scanner is invoked. */
(function(){
'use strict';
const A=window.App,E=A.escape;
const copy=v=>JSON.parse(JSON.stringify(v)),list=v=>Array.isArray(v)?v:[];
const types=[['code-scan','代码安全'],['app-scan','应用安全'],['web-scan','Web 安全']];
const stages=['资产画像','环境检查','候选发现','自动验证','报告生成'];
const final=new Set(['done','stopped','error']);
const now=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;};
const severity=v=>({critical:'严重',high:'高危',medium:'中危',low:'低危',info:'提示'}[v]||'未分级');
const tone=v=>['critical','high'].includes(v)?'red':v==='medium'?'orange':'blue';
const fixture={
 'code-scan':[{id:'SCAN-F-CODE-001',severity:'critical',title:'动态代码执行缺少隔离边界',category:'代码注入',cwe:'CWE-94',location:'OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py:321',file:'external_power_tools.py',line:321,description:'样例代码通过 exec() 执行动态构造的内容，执行边界需要限制。',evidence:'321  exec(code, exec_globals)',impact:'若不可信内容可进入执行参数，可能导致非预期代码执行。',recommendation:'优先使用显式操作白名单与结构化解析；需要执行动态逻辑时，使用隔离环境、资源限制及最小权限。',source:'原漏洞扫描 demo 预置记录',verification:'样例已保存自动验证结论',status:'open'}],
 'app-scan':[{id:'SCAN-F-APP-001',severity:'high',title:'异常响应包含内部服务信息',category:'信息暴露',cwe:'CWE-209',location:'智能客服 API · 错误响应',description:'预置样例的错误响应包含内部服务路径与堆栈信息。',evidence:'HTTP 500 · error.detail 包含内部组件路径（示例）',impact:'内部实现信息可能为后续攻击提供线索。',recommendation:'统一对外错误码与错误消息，详细诊断信息仅保存在受控日志中。',source:'应用安全预置样例',verification:'样例已保存自动响应检查结论',status:'open'}],
 'web-scan':[{id:'SCAN-F-WEB-001',severity:'medium',title:'页面缺少内容安全策略',category:'安全配置',cwe:'CWE-693',location:'https://portal.example.com/ · HTTP 响应头',description:'预置页面的响应头未配置 Content-Security-Policy。',evidence:'Content-Security-Policy: 未设置（示例）',impact:'浏览器缺少资源加载限制，降低对脚本注入风险的纵深防护能力。',recommendation:'结合应用资源清单配置 CSP，先使用报告模式验证，再逐步实施强制策略。',source:'Web 安全预置样例',verification:'样例已保存自动响应头检查结论',status:'open'}]
};
const S=A.scanProduct={selected:null,tab:'code-scan',query:'',filter:'all',draft:null,timer:null};
S.typeName=id=>types.find(t=>t[0]===id)?.[1]||'漏洞扫描';
S.status=t=>A.badge(({running:'进行中',paused:'已暂停',done:'已完成',stopped:'已结束',error:'执行异常'}[t.status]||'待执行'),({running:'blue',paused:'orange',done:'green',stopped:'gray',error:'red'}[t.status]||'gray'));
S.metrics=t=>({total:stages.length,done:Math.min(stages.length,t.completedSteps||0),valid:t.findings?.length||0,errors:t.status==='error'?1:0,pct:Math.round((t.completedSteps||0)/stages.length*100)});
S.init=function(){
 A.data.businessAssets=A.data.businessAssets||{code:[],web:[]};for(const k of ['code','web'])if(!Array.isArray(A.data.businessAssets[k]))A.data.businessAssets[k]=[];
 if(!A.data.businessAssets.scanSeeded){if(!A.data.businessAssets.code.length)A.data.businessAssets.code.push({id:'asset-code-openrt',name:'OpenRT 代码',repository:'OpenRT-main',revision:'demo-snapshot',owner:'研发安全组',createdAt:'2026-10-10 10:00:00',fixtureType:'code-scan'});if(!A.data.businessAssets.web.length)A.data.businessAssets.web.push({id:'asset-web-portal',name:'企业服务门户',url:'https://portal.example.com',owner:'业务平台组',createdAt:'2026-10-10 10:00:00',fixtureType:'web-scan'});A.data.businessAssets.scanSeeded=true;}
 A.data.scanProduct=A.data.scanProduct||{tasks:[],seeded:false};S.db=A.data.scanProduct;
 if(!S.db.seeded){const app=list(A.data.aiApplications)[0];S.db.tasks=[
  S.seed('SCAN-CODE-001','OpenRT 代码基线扫描','code-scan',A.data.businessAssets.code[0],'2026-10-10 10:30:00'),
  ...(app?[S.seed('SCAN-APP-001','智能客服应用基线扫描','app-scan',app,'2026-10-11 09:00:00')]:[]),
  S.seed('SCAN-WEB-001','企业门户安全基线扫描','web-scan',A.data.businessAssets.web[0],'2026-10-11 11:00:00')
 ];S.db.seeded=true;A.save();}
 if(!S.timer&&typeof setInterval==='function'){S.timer=setInterval(()=>S.tick(),2800);S.timer?.unref?.();}
 return S;
};
S.seed=function(id,name,type,asset,created){return {id,name,type,evaluationType:'scan',targetId:asset?.id||'',targetName:asset?.name||'演示资产',targetSnapshot:copy(asset||{}),created,finishedAt:created,status:'done',completedSteps:5,resultSaved:true,findings:copy(fixture[type]),config:{mode:'standard',scope:'已登记资产',maxDepth:3},stageHistory:stages.map(label=>({label,result:'done',message:'预置样例记录'})),simulated:true,resultSource:'fixture'};};
S.tasks=function(includeDeleted=false){if(!S.db)S.init();return S.db.tasks.filter(t=>includeDeleted||!t.deletedAt);};
S.summary=function(){const tasks=S.tasks(),findings=tasks.flatMap(t=>list(t.findings));return {tasks:tasks.length,running:tasks.filter(t=>t.status==='running').length,done:tasks.filter(t=>t.status==='done').length,findings:findings.length,highRisk:findings.filter(f=>['critical','high'].includes(f.severity)).length};};
S.assets=function(type=S.tab){if(type==='app-scan')return list(A.data.aiApplications);return list(A.data.businessAssets?.[type==='web-scan'?'web':'code']);};
S.open=function(id){const t=S.tasks().find(t=>t.id===id);if(!t){A.toast('扫描任务不存在或已移至回收记录');return false;}S.selected=id;S.tab=t.type;A.platform.go('evaluation','scan',t.type,id);return true;};
S.filterBy=function(key,value){if(!['query','filter'].includes(key))return;S[key]=value;A.render();if(key==='query'){const input=document.getElementById('scan-query');input?.focus();input?.setSelectionRange?.(value.length,value.length);}};
S.render=function(tab='code-scan'){S.init();S.tab=types.some(t=>t[0]===tab)?tab:'code-scan';const selected=S.tasks().find(t=>t.id===S.selected&&t.type===S.tab);if(selected)return S.detailHTML(selected);const rows=S.tasks().filter(t=>t.type===S.tab&&(S.filter==='all'||t.status===S.filter)&&(!S.query||[t.name,t.id,t.targetName].join(' ').toLocaleLowerCase().includes(S.query.toLocaleLowerCase()))).sort((a,b)=>b.created.localeCompare(a.created));return A.heading('',S.typeName(S.tab)+'扫描','任务自动完成发现、验证与报告归档；点击任务名称查看定位证据。',`<button class="btn" onclick="App.scanProduct.recycle()">回收记录</button><button class="btn primary" onclick="App.scanProduct.newTask()">${A.icon('plus',14)}新建扫描任务</button>`)+`<section class="card scan-list"><div class="toolbar"><input id="scan-query" aria-label="搜索扫描任务" class="input" placeholder="搜索任务、资产或编号" value="${E(S.query)}" oninput="if(!event.isComposing)App.scanProduct.filterBy('query',this.value)"><select aria-label="扫描任务状态" onchange="App.scanProduct.filterBy('filter',this.value)">${[['all','全部状态'],['running','进行中'],['paused','已暂停'],['done','已完成'],['stopped','已结束'],['error','执行异常']].map(([id,label])=>`<option value="${id}" ${S.filter===id?'selected':''}>${label}</option>`).join('')}</select></div><div class="table-wrap"><table class="scan-task-table"><thead><tr><th>任务名称</th><th>评估资产</th><th>状态 / 进度</th><th>发现 / 高危</th><th>任务创建时间</th><th>操作</th></tr></thead><tbody>${rows.map(t=>{const m=S.metrics(t);return `<tr><td><button class="link-btn" data-task="${E(t.id)}" onclick="App.scanProduct.open(this.dataset.task)">${E(t.name)}</button><small>${E(t.id)} · ${t.resultSource==='fixture'?'预置样例':'演示运行'}</small></td><td>${E(t.targetName)}</td><td>${S.status(t)}<small>${m.done} / ${m.total} 阶段</small><div class="ec-progress"><span style="width:${m.pct}%"></span></div></td><td>${t.findings.length} / ${t.findings.filter(f=>['high','critical'].includes(f.severity)).length}</td><td>${E(t.created)}</td><td>${S.actions(t)}</td></tr>`;}).join('')||'<tr><td colspan="6" class="empty">暂无匹配的扫描任务</td></tr>'}</tbody></table></div></section>`;};
S.actions=t=>`<div class="ec-row-actions">${['running','paused'].includes(t.status)?`<button class="link-btn" data-task="${E(t.id)}" onclick="App.scanProduct.action(this.dataset.task,'toggle')">${t.status==='running'?'暂停':'继续'}</button><button class="link-btn" data-task="${E(t.id)}" onclick="App.scanProduct.action(this.dataset.task,'stop')">结束</button>`:''}${final.has(t.status)?`<button class="link-btn" data-task="${E(t.id)}" onclick="App.scanProduct.retest(this.dataset.task)">复测</button><button class="entry-delete" data-task="${E(t.id)}" onclick="App.scanProduct.action(this.dataset.task,'delete')" aria-label="删除" title="删除" type="button">${A.icon('trash',16)}</button>`:''}</div>`;
S.newTask=function(){S.init();const assets=S.assets(),asset=assets[0];S.draft={name:'',type:S.tab,targetId:asset?.id||'',mode:'standard',scope:''};S.form();};
S.form=function(){const d=S.draft;if(!d)return;const assets=S.assets(d.type);A.modal('新建'+S.typeName(d.type)+'扫描任务',`<form id="scan-form" onsubmit="event.preventDefault();App.scanProduct.create()"><div class="field"><label for="scan-name">任务名称 *</label><input id="scan-name" value="${E(d.name)}" maxlength="80" placeholder="如：本周安全基线扫描" oninput="App.scanProduct.draft.name=this.value"></div><div class="field"><label for="scan-asset">评估资产 *</label><select id="scan-asset" onchange="App.scanProduct.draft.targetId=this.value"><option value="">请选择${S.typeName(d.type)}资产</option>${assets.map(a=>`<option value="${E(a.id)}" ${d.targetId===a.id?'selected':''}>${E(a.name)}</option>`).join('')}</select>${assets.length?'':'<p class="hint">请先在资产中心登记业务资产。</p>'}</div><div class="field"><label for="scan-scope">扫描范围备注</label><input id="scan-scope" maxlength="200" placeholder="选填，如：本次发布变更范围" value="${E(d.scope)}" oninput="App.scanProduct.draft.scope=this.value"></div><div class="field"><label for="scan-mode">扫描方案</label><select id="scan-mode" onchange="App.scanProduct.draft.mode=this.value"><option value="standard" ${d.mode==='standard'?'selected':''}>标准扫描</option><option value="focused" ${d.mode==='focused'?'selected':''}>重点风险扫描</option></select><p class="hint">标准扫描覆盖已配置的检查项；重点风险扫描关注严重与高危问题。</p></div><p class="scan-source-note">当前使用演示流程，不会向资产发起真实扫描请求。</p><p id="scan-error" class="error-message" role="alert"></p></form>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.scanProduct.create()">启动扫描</button>`);};
S.create=function(){const d=S.draft;if(!d)return false;const asset=S.assets(d.type).find(a=>a.id===d.targetId),error=!d.name.trim()?'请填写任务名称。':!asset?'请选择已登记的评估资产。':!['standard','focused'].includes(d.mode)?'请选择有效的扫描方案。':'';if(error){document.getElementById('scan-error').textContent=error;return false;}const created=now(),id='SCAN-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,5).toUpperCase(),t={id,name:d.name.trim(),type:d.type,evaluationType:'scan',created,targetId:asset.id,targetName:asset.name,targetSnapshot:copy(asset),status:'running',completedSteps:0,resultSaved:false,findings:[],stageHistory:[],config:{mode:d.mode,scope:d.scope.trim()||'已登记资产'},simulated:true,resultSource:'simulation',fixtureType:asset.fixtureType||(d.type==='app-scan'&&['cs-app-service','cs-app-office'].includes(asset.id)?'app-scan':null)};S.db.tasks.unshift(t);A.save();A.closeModal();S.open(id);return t;};
S.tick=function(){if(!S.db)return;let changed=false;for(const t of S.tasks().filter(t=>t.status==='running')){changed=true;const index=t.completedSteps;t.completedSteps=Math.min(stages.length,index+1);t.stageHistory.push({label:stages[index],result:'done',message:index===0?'已读取资产快照':index===1?'演示执行环境就绪':index===2?'完成预置检查流程':index===3?'自动验证流程完成':'结果已归档',time:now()});if(t.completedSteps>=stages.length){t.status=t.fixtureType?'done':'error';t.finishedAt=now();t.resultSaved=true;t.findings=t.fixtureType?copy(fixture[t.fixtureType]).filter(f=>t.config.mode!=='focused'||['critical','high'].includes(f.severity)):[];if(!t.fixtureType){t.error='该资产尚未连接真实扫描执行器，没有可用漏洞判定。';t.stageHistory.at(-1).result='error';t.stageHistory.at(-1).message=t.error;}}}if(changed){A.save();const p=A.platform?.state;if(!document.getElementById('modal')?.classList.contains('open')&&(p?.section==='evaluation'||p?.section==='workspace'||p?.section==='risk'))A.render();}return changed;};
S.action=function(id,action,confirmed=false){const t=S.tasks().find(t=>t.id===id);if(!t)return false;if(action==='toggle'&&['running','paused'].includes(t.status)){t.status=t.status==='running'?'paused':'running';A.save();A.render();return true;}if(action==='stop'&&['running','paused'].includes(t.status)){if(!confirmed){A.modal('结束扫描任务',`<p>结束“${E(t.name)}”并保留已执行的阶段记录。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" data-task="${E(id)}" onclick="App.scanProduct.action(this.dataset.task,'stop',true)">结束任务</button>`);return false;}t.status='stopped';t.finishedAt=now();t.resultSaved=t.completedSteps>0;A.save();A.closeModal();A.render();return true;}if(action==='delete'){if(!final.has(t.status)){A.toast('请先结束任务，再删除任务记录。');return false;}if(!confirmed){A.modal('删除扫描任务',`<p>将“${E(t.name)}”移至回收记录，保留扫描配置与结果。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="entry-delete" data-task="${E(id)}" onclick="App.scanProduct.action(this.dataset.task,'delete',true)" aria-label="确认删除" title="确认删除" type="button">${A.icon('trash',16)}</button>`);return false;}t.deletedAt=now();if(S.selected===id)S.selected=null;A.save();A.closeModal();A.render();return true;}return false;};
S.recycle=function(){const rows=S.tasks(true).filter(t=>t.deletedAt&&t.type===S.tab);A.modal('扫描任务回收记录',`<div class="ec-recycle">${rows.map(t=>`<div><strong>${E(t.name)}</strong><button class="btn small" data-task="${E(t.id)}" onclick="App.scanProduct.restore(this.dataset.task)">恢复</button></div>`).join('')||'<p class="empty">暂无回收记录</p>'}</div>`,`<button class="btn" onclick="App.closeModal()">关闭</button>`);};
S.restore=function(id){const t=S.tasks(true).find(t=>t.id===id);if(!t?.deletedAt)return false;delete t.deletedAt;A.save();S.recycle();A.render();return true;};
S.retest=function(id,confirmed=false){const t=S.tasks().find(t=>t.id===id);if(!t||!final.has(t.status)){A.toast('任务完成、结束或异常退出后才可复测。');return false;}if(!confirmed){A.modal('复测扫描任务',`<p>沿用“${E(t.name)}”的资产快照与扫描配置，新建任务并保留原记录。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" data-task="${E(id)}" onclick="App.scanProduct.retest(this.dataset.task,true)">开始复测</button>`);return false;}const fresh={...copy(t),id:'SCAN-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,5).toUpperCase(),name:t.name+' · 复测',created:now(),parentId:t.id,status:'running',completedSteps:0,resultSaved:false,findings:[],stageHistory:[],resultSource:'simulation',fixtureType:t.fixtureType||(t.resultSource==='fixture'?t.type:null)};delete fresh.finishedAt;delete fresh.error;S.db.tasks.unshift(fresh);A.save();A.closeModal();S.open(fresh.id);return fresh;};
S.findingsHTML=t=>`<div class="table-wrap"><table class="scan-findings"><thead><tr><th>风险等级</th><th>发现 / 定位</th><th>风险分类</th></tr></thead><tbody>${t.findings.map(f=>`<tr><td>${A.badge(severity(f.severity),tone(f.severity))}</td><td><button class="link-btn" data-task="${E(t.id)}" data-finding="${E(f.id)}" onclick="App.scanProduct.inspect(this.dataset.task,this.dataset.finding)">${E(f.title)}</button><small>${E(f.location)}</small></td><td>${E(f.category)}<small>${E(f.cwe||'')}</small></td></tr>`).join('')||`<tr><td colspan="3" class="empty">${t.error?'无可用漏洞判定':t.status==='done'?'本次演示范围内未记录漏洞发现':'等待自动执行结果'}</td></tr>`}</tbody></table></div>`;
S.detailHTML=function(t){const m=S.metrics(t);return A.heading('',t.name,'任务创建时间：'+t.created+(t.parentId?' · 复测来源：'+t.parentId:''),`<button class="btn" onclick="App.platform.go('evaluation','scan','${t.type}')">返回扫描任务</button>`)+`<section class="card scan-detail-summary"><div><span>评估资产</span><strong>${E(t.targetName)}</strong></div><div><span>执行状态</span>${S.status(t)}</div><div><span>扫描方案</span><strong>${t.config.mode==='focused'?'重点风险扫描':'标准扫描'}</strong></div><div><span>风险发现</span><strong>${t.findings.length}</strong></div>${S.actions(t)}</section><section class="card scan-stages"><div class="ec-panel-head"><h2>自动执行流程</h2><span>${m.pct}% · ${t.resultSource==='fixture'?'预置样例':'演示运行'}</span></div><ol>${stages.map((label,i)=>`<li class="${i<t.completedSteps?'done':i===t.completedSteps&&t.status==='running'?'active':''}"><b>${i<t.completedSteps?'✓':i+1}</b><span>${label}</span></li>`).join('')}</ol>${t.error?`<p class="ec-partial-note">${E(t.error)}</p>`:''}</section><div class="scan-detail-grid"><section class="card"><div class="ec-panel-head"><h2>扫描发现</h2><span>自动验证结果</span></div>${S.findingsHTML(t)}</section><section class="card scan-report-preview"><div class="ec-panel-head"><h2>扫描报告</h2><span>预览</span></div><div class="scan-report-body"><h3>${S.typeName(t.type)}扫描报告</h3><p>${t.error?'本任务没有可用漏洞判定，不能据此得出安全结论。':t.status==='done'?`已记录 ${t.findings.length} 项风险发现，包含定位依据、影响说明和修复建议。`:'任务结束后，已保存的结果会归档到报告分析。'}</p><p class="scan-source-note">结果来源：${t.resultSource==='fixture'?'预置样例':'演示流程'}。</p><button class="btn primary" data-task="${E(t.id)}" ${final.has(t.status)&&t.resultSaved?'':'disabled'} onclick="App.evaluation.openReportList(this.dataset.task)">在报告分析中查看完整报告</button></div></section></div>`;};
S.inspect=function(taskId,findingId){const t=S.tasks().find(t=>t.id===taskId),f=t?.findings.find(f=>f.id===findingId);if(!f)return;A.drawer('漏洞详情',`<article class="scan-finding-detail">${A.badge(severity(f.severity),tone(f.severity))}<h2>${E(f.title)}</h2><dl>${[['风险分类',f.category+' · '+f.cwe],['定位',f.location],['问题描述',f.description],['自动验证',f.verification],['影响',f.impact],['修复建议',f.recommendation],['记录来源',f.source]].map(([label,value])=>`<div><dt>${label}</dt><dd>${E(value)}</dd></div>`).join('')}</dl><h3>定位证据</h3><pre>${E(f.evidence)}</pre></article>`,`<button class="btn" onclick="App.closeDrawer()">关闭</button>`);};
S.reportHTML=function(id){const t=S.tasks().find(t=>t.id===id);if(!t||!final.has(t.status)||!t.resultSaved)return A.heading('','扫描报告','任务结束且保存结果后生成报告。');return A.heading('',t.name+' · 扫描报告','任务创建时间：'+t.created,`<button class="btn" onclick="App.evaluation.openReportList()">返回报告分析</button><button class="btn" data-task="${E(t.id)}" onclick="App.scanProduct.open(this.dataset.task)">来源任务</button><button class="btn primary" data-task="${E(t.id)}" onclick="App.scanProduct.exportReport(this.dataset.task)">导出报告</button>`)+`<article class="card scan-full-report"><h2>${S.typeName(t.type)}扫描报告</h2><p>评估资产：${E(t.targetName)} · 扫描方案：${t.config.mode==='focused'?'重点风险扫描':'标准扫描'}</p><p>执行结果：${E(({done:'已完成',stopped:'已结束',error:'执行异常'}[t.status]))} · 已完成 ${t.completedSteps} / ${stages.length} 个阶段</p><p class="scan-source-note">结果来源：${t.resultSource==='fixture'?'预置样例':'演示流程'}。${t.status==='done'?'结论仅覆盖本次演示范围。':'当前仅保存部分执行记录，不形成完整安全结论。'}</p>${t.error?`<p class="ec-partial-note">${E(t.error)}</p>`:''}<h3>风险分布</h3><div class="scan-severity-grid">${['critical','high','medium','low'].map(level=>`<div><span>${severity(level)}</span><strong>${t.findings.filter(f=>f.severity===level).length}</strong></div>`).join('')}</div><h3>漏洞发现与修复建议</h3>${t.findings.map(f=>`<section class="scan-report-finding"><h4>${A.badge(severity(f.severity),tone(f.severity))}${E(f.title)}</h4><p><strong>定位：</strong>${E(f.location)}</p><p>${E(f.description)}</p><pre>${E(f.evidence)}</pre><p><strong>修复建议：</strong>${E(f.recommendation)}</p></section>`).join('')||'<p>暂无已保存的漏洞发现。</p>'}<details><summary>执行阶段记录</summary><ol>${t.stageHistory.map(row=>`<li>${E(row.label)}：${E(row.message)}</li>`).join('')}</ol></details></article>`;};
S.exportReport=function(id){const t=S.tasks().find(t=>t.id===id);if(!t||!final.has(t.status)||!t.resultSaved)return false;const html=S.reportHTML(id).replace(/<button[\s\S]*?<\/button>/g,'');A.download(t.name.replace(/[\\/:*?"<>|]/g,'_')+'-扫描报告.html','<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>'+E(t.name)+'</title><style>body{font:15px/1.8 Arial,sans-serif;color:#26364c;padding:30px;max-width:1000px;margin:auto}section{padding:16px 0;border-bottom:1px solid #ddd}pre{white-space:pre-wrap;padding:12px;background:#f3f5f8}.scan-severity-grid{display:flex;gap:24px}.scan-severity-grid strong{margin-left:8px}</style><body>'+html+'</body></html>','text/html;charset=utf-8');return true;};
})();
};

// ─── scan-backend-alignment ────────────────────────────────────────────────
AppParts['scan/scan-backend-alignment'] = function () {
/* Scan product contracts aligned to the existing source/binary/web workers.
 * This is a front-end interaction layer. Production adapter requirements are
 * documented in 平台改造说明-20261013/02-后端复用与接口适配.md.
 */
(function(){
'use strict';
const A=window.App,S=A.scanProduct,E=A.escape;
if(!S)return;
const copy=v=>JSON.parse(JSON.stringify(v)),list=v=>Array.isArray(v)?v:[];
const terminal=new Set(['done','stopped','error']);
const stages=['资产画像','环境检查','候选发现','自动验证','报告生成'];
const kindName={source:'应用代码',binary:'软件包 / 二进制',web:'在线站点'};
const levelName={critical:'严重',high:'高危',medium:'中危',low:'低危',info:'提示'};
const tone=level=>['critical','high'].includes(level)?'red':level==='medium'?'orange':'blue';
const stamp=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;};
const uid=prefix=>prefix+'-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
const choices=(rows,value)=>rows.map(([id,name])=>`<option value="${E(id)}" ${String(value)===String(id)?'selected':''}>${E(name)}</option>`).join('');
const identified=t=>`data-task="${E(t.id)}"`;
const confirmed=t=>list(t.findings).filter(f=>['confirmed','verified'].includes(f.verificationStatus||f.status));
const clean=value=>String(value||'').replace(/原漏洞扫描 demo 预置记录/g,'代码安全检查').replace(/应用安全预置样例/g,'应用代码检查').replace(/Web 安全预置样例/g,'HTTP 响应头检查').replace(/样例已保存自动验证结论/g,'验证已完成，证据已保存').replace(/样例已保存自动响应检查结论/g,'响应检查已完成，证据已保存').replace(/样例已保存自动响应头检查结论/g,'响应头检查已完成，证据已保存').replace(/预置样例的/g,'应用的').replace(/预置页面的/g,'页面的').replace(/样例代码/g,'目标代码').replace(/（示例）/g,'').replace(/预置样例记录/g,'阶段记录已保存').replace(/演示执行环境就绪/g,'执行环境已就绪').replace(/完成预置检查流程/g,'候选检查已完成');
const baseInit=S.init,baseAction=S.action;
const templates={};
function codeMaterial(asset){return {id:asset.id,kind:'source',name:asset.name,path:asset.scanPath||'',version:asset.revision||'',fixtureType:asset.fixtureType||null};}
function normalizeFinding(f,type,legacyFixture=false){
 for(const key of ['description','evidence','source','verification','recommendation'])if(f[key])f[key]=clean(f[key]);
 const verdict=f.verificationStatus||f.status;
 const legacyOpen=legacyFixture&&!f.verificationStatus&&f.status==='open';
 f.verificationStatus=['confirmed','verified'].includes(verdict)||legacyOpen?'confirmed':['candidate','rejected','failed'].includes(verdict)?verdict:'candidate';
 if(['open','patched'].includes(f.status)&&!f.remediationStatus)f.remediationStatus=f.status;
 f.status=f.verificationStatus;
 if(legacyFixture&&type==='app-scan'&&f.id==='SCAN-F-APP-001'){
  f.location='src/api/error_handler.py:48';f.file='src/api/error_handler.py';f.line=48;
  f.description='异常处理直接返回内部堆栈信息，包含服务路径与组件名称。';
  f.evidence='48  return {"detail": traceback.format_exc()}';
  f.source='应用代码验证';f.verification='已确认异常分支向外部响应写入完整堆栈。';
 }
 return f;
}
S.init=function(){
 baseInit.call(S);
 let changed=false;
 const code=A.data.businessAssets.code.find(a=>a.id==='asset-code-openrt');
 if(code&&!code.scanPath){code.scanPath='/srv/security/assets/openrt/source';changed=true;}
 if(code&&code.revision==='demo-snapshot'){code.revision='2026.10.10';changed=true;}
 for(const app of list(A.data.aiApplications)){
  if(app.scanMaterials===undefined&&['cs-app-service','cs-app-office'].includes(app.id)){
   app.scanMaterials=[{id:app.id+'-source',kind:'source',name:app.name+'服务代码',path:app.id==='cs-app-service'?'/srv/artifacts/customer-service/2.4.0/source':'/srv/artifacts/knowledge-assistant/1.8.0/source',version:app.id==='cs-app-service'?'2.4.0':'1.8.0',fixtureType:'app-scan'}];changed=true;
  }
 }
 for(const t of S.db.tasks){
  if(t.backendAligned!==1){
   if(t.status==='paused'){t.status='stopped';t.finishedAt=t.finishedAt||stamp();t.resultSaved=list(t.stageHistory).length>0;}
   for(const f of list(t.findings))normalizeFinding(f,t.type,t.resultSource==='fixture');
   for(const row of list(t.stageHistory))row.message=clean(row.message);
   if(t.error?.includes('真实扫描执行器'))t.error='扫描服务连接不可用，本次未形成有效漏洞判定。';
   const asset=S.assets(t.type).find(a=>a.id===t.targetId);
   if(!t.targetMaterial)t.targetMaterial=t.type==='app-scan'?copy(list(asset?.scanMaterials)[0]||{kind:'source',name:'历史扫描制品',path:'未保存',version:'未保存'}):t.type==='web-scan'?{kind:'web',name:asset?.name||t.targetName,path:asset?.url||t.targetSnapshot?.url||'',version:t.created}:{...codeMaterial(asset||t.targetSnapshot||{})};
   t.backendAligned=1;changed=true;
  }
  if(!templates[t.type]&&t.resultSource==='fixture')templates[t.type]=copy(confirmed(t));
 }
 if(S.filter==='paused')S.filter='stopped';
 if(changed)A.save();
 return S;
};
S.confirmedFindings=confirmed;
S.status=t=>A.badge(({running:'进行中',done:'已完成',stopped:'已停止',error:'执行异常'}[t.status]||'待执行'),({running:'blue',done:'green',stopped:'gray',error:'red'}[t.status]||'gray'));
S.metrics=t=>({total:stages.length,done:Math.min(stages.length,t.completedSteps||0),valid:confirmed(t).length,errors:t.status==='error'?1:0,pct:Math.min(100,Math.round((t.completedSteps||0)/stages.length*100))});
S.summary=function(){const tasks=S.tasks(),findings=tasks.flatMap(confirmed);return {tasks:tasks.length,running:tasks.filter(t=>t.status==='running').length,done:tasks.filter(t=>t.status==='done').length,findings:findings.length,highRisk:findings.filter(f=>['critical','high'].includes(f.severity)).length};};
S.actions=t=>`<div class="ec-row-actions">${t.status==='running'?`<button class="link-btn" ${identified(t)} onclick="App.scanProduct.action(this.dataset.task,'stop')">停止</button>`:''}${terminal.has(t.status)?`<button class="link-btn" ${identified(t)} onclick="App.scanProduct.retest(this.dataset.task)">${t.status==='done'?'复测':'重新扫描'}</button><button class="entry-delete" ${identified(t)} onclick="App.scanProduct.action(this.dataset.task,'delete')" aria-label="删除" title="删除" type="button">${A.icon('trash',16)}</button>`:''}</div>`;
S.render=function(tab='code-scan'){
 S.init();S.tab=['code-scan','app-scan','web-scan'].includes(tab)?tab:'code-scan';
 const selected=S.tasks().find(t=>t.id===S.selected&&t.type===S.tab);if(selected)return S.detailHTML(selected);
 const rows=S.tasks().filter(t=>t.type===S.tab&&(S.filter==='all'||t.status===S.filter)&&(!S.query||[t.name,t.id,t.targetName].join(' ').toLocaleLowerCase().includes(S.query.toLocaleLowerCase()))).sort((a,b)=>b.created.localeCompare(a.created));
 const intro=S.tab==='app-scan'?'检查应用关联的代码或软件包，保存验证证据与修复建议。':S.tab==='web-scan'?'检查站点的 HTTP(S) 配置、响应头和公开暴露信息。':'对指定版本代码执行发现与验证，确认问题后归档报告。';
 return A.heading('',S.typeName(S.tab)+'扫描',intro,`<button class="btn" onclick="App.scanProduct.recycle()">回收记录</button><button class="btn primary" onclick="App.scanProduct.newTask()">${A.icon('plus',14)}新建扫描任务</button>`)+`<section class="card scan-list"><div class="toolbar"><input id="scan-query" aria-label="搜索扫描任务" class="input" placeholder="搜索任务、资产或编号" value="${E(S.query)}" oninput="if(!event.isComposing)App.scanProduct.filterBy('query',this.value)"><select aria-label="扫描任务状态" onchange="App.scanProduct.filterBy('filter',this.value)">${choices([['all','全部状态'],['running','进行中'],['done','已完成'],['stopped','已停止'],['error','执行异常']],S.filter)}</select></div><div class="table-wrap"><table class="scan-task-table"><thead><tr><th>任务名称</th><th>评估资产</th><th>状态 / 进度</th><th>已确认 / 高危</th><th>任务创建时间</th><th>操作</th></tr></thead><tbody>${rows.map(t=>{const m=S.metrics(t),fs=confirmed(t);return `<tr><td><button class="link-btn" ${identified(t)} onclick="App.scanProduct.open(this.dataset.task)">${E(t.name)}</button><small>${E(t.id)}</small></td><td>${E(t.targetName)}<small>${E(t.targetMaterial?.kind==='web'?t.targetMaterial.path:t.targetMaterial?.version||'')}</small></td><td>${S.status(t)}<small>${m.done} / ${m.total} 阶段</small><div class="ec-progress"><span style="width:${m.pct}%"></span></div></td><td>${fs.length} / ${fs.filter(f=>['high','critical'].includes(f.severity)).length}</td><td>${E(t.created)}</td><td>${S.actions(t)}</td></tr>`;}).join('')||'<tr><td colspan="6" class="empty">暂无匹配的扫描任务</td></tr>'}</tbody></table></div></section>`;
};
S.newTask=function(){S.init();const asset=S.assets()[0];S.draft={name:'',type:S.tab,targetId:asset?.id||'',materialId:list(asset?.scanMaterials)[0]?.id||'',targetPath:asset?.scanPath||'',version:asset?.revision||'',scope:'',mode:'standard'};S.form();};
S.changeTarget=function(id){const d=S.draft;if(!d)return;d.targetId=id;const asset=S.assets(d.type).find(a=>a.id===id);d.materialId=list(asset?.scanMaterials)[0]?.id||'';d.targetPath=asset?.scanPath||'';d.version=asset?.revision||'';S.form();};
S.form=function(){
 const d=S.draft;if(!d)return;const assets=S.assets(d.type),asset=assets.find(a=>a.id===d.targetId),materials=list(asset?.scanMaterials),material=materials.find(m=>m.id===d.materialId);
 const targetFields=d.type==='app-scan'?`<div class="field"><label for="scan-material">扫描制品 *</label><select id="scan-material" onchange="App.scanProduct.draft.materialId=this.value;App.scanProduct.form()">${choices([['','请选择关联代码或软件包'],...materials.map(m=>[m.id,m.name+' · '+m.version])],d.materialId)}</select><div class="scan-material-caption"><span>${material?E(kindName[material.kind]+' · '+(material.fileName||material.name)):'应用需关联代码或软件包后才能扫描。'}</span><button type="button" class="link-btn" ${asset?'':'disabled'} onclick="App.scanProduct.editMaterial()">上传扫描制品</button></div></div>`:d.type==='code-scan'?`<div class="field"><label for="scan-path">代码制品路径 *</label><input id="scan-path" value="${E(d.targetPath)}" maxlength="500" placeholder="扫描执行器可访问的目录或文件" oninput="App.scanProduct.draft.targetPath=this.value"></div><div class="field"><label for="scan-version">制品版本 *</label><input id="scan-version" value="${E(d.version)}" maxlength="120" placeholder="提交版本或发布版本" oninput="App.scanProduct.draft.version=this.value"></div>`:`<div class="scan-target-preview"><span>检查地址</span><strong>${E(asset?.url||'请选择站点资产')}</strong><p>在已授权的站点范围内执行非破坏性基线检查。</p></div>`;
 A.modal(d.parentId?'重新扫描':'新建'+S.typeName(d.type)+'扫描任务',`<form id="scan-form" onsubmit="event.preventDefault();App.scanProduct.create()"><div class="field"><label for="scan-name">任务名称 *</label><input id="scan-name" value="${E(d.name)}" maxlength="80" placeholder="如：发布前安全检查" oninput="App.scanProduct.draft.name=this.value"></div><div class="field"><label for="scan-asset">${d.type==='app-scan'?'所属应用':'评估资产'} *</label><select id="scan-asset" onchange="App.scanProduct.changeTarget(this.value)">${choices([['','请选择资产'],...assets.map(a=>[a.id,a.name])],d.targetId)}</select>${assets.length?'':'<p class="hint">请先在资产中心登记资产。</p>'}</div>${targetFields}<div class="field"><label for="scan-scope">范围说明</label><input id="scan-scope" maxlength="200" placeholder="选填，如：支付服务本次发布版本" value="${E(d.scope)}" oninput="App.scanProduct.draft.scope=this.value"></div>${d.parentId?'<p class="hint">本次将创建新的扫描任务，原任务的记录与报告会保留。</p>':''}<p id="scan-error" class="error-message" role="alert"></p></form>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.scanProduct.create()">启动扫描</button>`);
};
S.editMaterial=function(){
 const app=S.assets('app-scan').find(a=>a.id===S.draft?.targetId);if(!app)return false;
 S.materialDraft={name:'',kind:'source',path:'',version:''};
 A.drawer('登记扫描制品',`<div class="scan-material-drawer"><p>为 ${E(app.name)} 关联可访问的代码或软件包，扫描结果按制品版本归档。</p><div class="field"><label for="scan-material-name">制品名称 *</label><input id="scan-material-name" maxlength="80" oninput="App.scanProduct.materialDraft.name=this.value"></div><div class="field"><label for="scan-material-kind">制品类型 *</label><select id="scan-material-kind" onchange="App.scanProduct.materialDraft.kind=this.value">${choices([['source','应用代码'],['binary','软件包 / 二进制']],'source')}</select></div><div class="field"><label for="scan-material-path">制品路径 *</label><input id="scan-material-path" maxlength="500" placeholder="如 /srv/artifacts/customer-service/2.4.0/source" oninput="App.scanProduct.materialDraft.path=this.value"><p class="hint">填写扫描执行器可访问的目录、文件或已解压的软件包路径。</p></div><div class="field"><label for="scan-material-version">制品版本 *</label><input id="scan-material-version" maxlength="120" placeholder="发布版本或内容摘要" oninput="App.scanProduct.materialDraft.version=this.value"></div><p id="scan-material-error" class="error-message" role="alert"></p></div>`,`<button class="btn" onclick="App.closeDrawer()">取消</button><button class="btn primary" onclick="App.scanProduct.saveMaterial()">保存并选用</button>`);
 return true;
};
const validPath=value=>/^(?:\/(?!\/)|[A-Za-z]:[\\/])/.test(String(value||'').trim())&&!/[\r\n]/.test(value);
S.saveMaterial=function(){
 const d=S.materialDraft,app=S.assets('app-scan').find(a=>a.id===S.draft?.targetId);if(!d||!app)return false;
 const error=!String(d.name||'').trim()||d.name.length>80?'请填写不超过 80 字的制品名称。':!['source','binary'].includes(d.kind)?'请选择有效的制品类型。':!validPath(d.path)||d.path.length>500?'请填写执行器可访问的绝对路径。':!String(d.version||'').trim()||d.version.length>120?'请填写不超过 120 字的制品版本。':'';
 if(error){const el=document.getElementById('scan-material-error');if(el)el.textContent=error;return false;}
 const material={id:uid('material'),name:d.name.trim(),kind:d.kind,path:d.path.trim(),version:d.version.trim()};
 app.scanMaterials=list(app.scanMaterials);app.scanMaterials.push(material);S.draft.materialId=material.id;A.save();A.closeDrawer();S.form();return material;
};
S.create=function(){
 const d=S.draft;if(!d)return false;const asset=S.assets(d.type).find(a=>a.id===d.targetId);
 const material=d.type==='app-scan'?list(asset?.scanMaterials).find(m=>m.id===d.materialId):d.type==='code-scan'?{...codeMaterial(asset||{}),path:String(d.targetPath||'').trim(),version:String(d.version||'').trim()}:asset?{kind:'web',name:asset.name,path:asset.url,version:stamp()}:null;
 let error=!String(d.name||'').trim()||d.name.length>80?'请填写不超过 80 字的任务名称。':!asset?'请选择已登记的评估资产。':!material?'请选择应用关联的代码或软件包。':'';
 if(!error&&d.type!=='web-scan'&&(!validPath(material.path)||material.path.length>500||!String(material.version||'').trim()))error='请填写有效的制品绝对路径与版本。';
 if(!error&&d.type==='web-scan'){try{const url=new URL(material.path);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)error='请选择有效的 HTTP(S) 站点地址。';}catch(e){error='请选择有效的 HTTP(S) 站点地址。';}}
 if(error){const el=document.getElementById('scan-error');if(el)el.textContent=error;return false;}
 const t={id:uid('SCAN'),name:d.name.trim(),type:d.type,evaluationType:'scan',created:stamp(),targetId:asset.id,targetName:asset.name,targetSnapshot:copy(asset),targetMaterial:copy(material),status:'running',completedSteps:0,resultSaved:false,findings:[],stageHistory:[],config:{mode:'standard',scope:String(d.scope||'').trim()||'完整制品',targetKind:material.kind},parentId:d.parentId||null,fixtureType:material.fixtureType||asset.fixtureType||null,backendAligned:1,resultSource:'simulation',simulated:true};
 S.db.tasks.unshift(t);A.save();A.closeModal();S.draft=null;S.open(t.id);return t;
};
S.tick=function(){
 if(!S.db)return false;let changed=false;
 for(const t of S.tasks().filter(t=>t.status==='running')){
  const index=Math.min(stages.length-1,t.completedSteps||0);t.completedSteps=index+1;changed=true;
  t.stageHistory.push({label:stages[index],result:'done',message:['已保存资产与制品版本','执行环境已就绪','候选检查已完成','验证结果与证据已保存','报告已归档'][index],time:stamp()});
  if(t.completedSteps===4)t.findings=t.fixtureType===t.type?copy(templates[t.type]||[]).map(f=>normalizeFinding(f,t.type)):[];
  if(t.completedSteps===stages.length){t.status='done';t.finishedAt=stamp();t.resultSaved=true;t.reportStatus='complete';}
 }
 if(changed){A.save();const state=A.platform?.state;if(!document.querySelector('.overlay.open')&&['evaluation','workspace','risk'].includes(state?.section))A.render();}
 return changed;
};
S.action=function(id,action,accepted=false){
 const t=S.tasks().find(t=>t.id===id);if(!t)return false;
 if(action==='toggle')return false;
 if(action!=='stop')return baseAction.call(S,id,action,accepted);
 if(t.status!=='running')return false;
 if(!accepted){A.modal('停止扫描',`<p>停止“${E(t.name)}”后，已完成的验证结果与阶段记录会保留。</p><p class="hint">后续可重新发起扫描，原任务不会覆盖。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" ${identified(t)} onclick="App.scanProduct.action(this.dataset.task,'stop',true)">停止扫描</button>`);return false;}
 t.status='stopped';t.finishedAt=stamp();t.resultSaved=list(t.stageHistory).length>0;t.reportStatus=t.resultSaved?'partial':'none';A.save();A.closeModal();A.render();return true;
};
S.retest=function(id){
 const t=S.tasks().find(t=>t.id===id);if(!t||!terminal.has(t.status))return false;
 const asset=S.assets(t.type).find(a=>a.id===t.targetId),material=t.targetMaterial||{};
 S.tab=t.type;S.draft={name:t.name+' · 复测',type:t.type,targetId:asset?.id||'',materialId:list(asset?.scanMaterials).some(m=>m.id===material.id)?material.id:'',targetPath:material.path||'',version:material.version||'',scope:t.config?.scope||'',mode:'standard',parentId:t.id};S.form();return true;
};
S.inspectTarget=function(id){
 const t=S.tasks().find(t=>t.id===id);if(!t)return;const m=t.targetMaterial||{};
 A.drawer('扫描目标',`<article class="scan-finding-detail"><h2>${E(t.targetName)}</h2><dl>${[['目标类型',kindName[m.kind]||'未记录'],['制品名称',m.name||t.targetName],[m.kind==='web'?'检查地址':'制品名称',m.kind==='web'?m.path||'未记录':m.fileName||m.name||'已归档制品'],['版本 / 检查时点',m.version||t.created],['扫描范围',t.config?.scope||'已登记目标']].map(([label,value])=>`<div><dt>${E(label)}</dt><dd>${E(value)}</dd></div>`).join('')}</dl><p class="hint">报告对应本任务保存的目标与版本。${t.type==='web-scan'?'检查范围为授权站点的非破坏性基线检查。':'更换制品或版本后需新建任务。'}</p></article>`,`<button class="btn" onclick="App.closeDrawer()">关闭</button>`);
};
S.findingsHTML=function(t){const rows=confirmed(t);return `<div class="table-wrap"><table class="scan-findings"><thead><tr><th>风险等级</th><th>已确认问题 / 定位</th><th>风险分类</th></tr></thead><tbody>${rows.map(f=>`<tr><td>${A.badge(levelName[f.severity]||'未分级',tone(f.severity))}</td><td><button class="link-btn" ${identified(t)} data-finding="${E(f.id)}" onclick="App.scanProduct.inspect(this.dataset.task,this.dataset.finding)">${E(f.title)}</button><small>${E(f.location)}</small></td><td>${E(f.category)}<small>${E(f.cwe||'')}</small></td></tr>`).join('')||`<tr><td colspan="3" class="empty">${t.status==='done'?'本次扫描范围内未确认漏洞。':terminal.has(t.status)?'暂无已确认漏洞，详见执行记录。':'等待候选发现与自动验证结果。'}</td></tr>`}</tbody></table></div>`;};
S.detailHTML=function(t){
 const m=S.metrics(t),rows=confirmed(t),ready=terminal.has(t.status)&&t.resultSaved;
 return A.heading('',E(t.name),'任务创建时间：'+t.created+(t.parentId?' · 复测来源：'+t.parentId:''),`<button class="btn" onclick="App.platform.go('evaluation','scan','${t.type}')">返回扫描任务</button>`)+`<section class="card scan-detail-summary"><div><span>评估资产</span><button class="link-btn" ${identified(t)} onclick="App.scanProduct.inspectTarget(this.dataset.task)"><strong>${E(t.targetName)}</strong></button></div><div><span>扫描目标</span><strong>${E(kindName[t.targetMaterial?.kind]||'已登记目标')}</strong><small>${E(t.targetMaterial?.kind==='web'?t.targetMaterial.path:t.targetMaterial?.version||'')}</small></div><div><span>执行状态</span>${S.status(t)}</div><div><span>已确认漏洞</span><strong>${rows.length}</strong></div>${S.actions(t)}</section><section class="card scan-stages"><div class="ec-panel-head"><h2>执行进度</h2><span>${m.pct}% · ${m.done} / ${m.total} 阶段</span></div><ol>${stages.map((label,i)=>`<li class="${i<t.completedSteps?'done':i===t.completedSteps&&t.status==='running'?'active':''}"><b>${i<t.completedSteps?'✓':i+1}</b><span>${label}</span></li>`).join('')}</ol>${t.error?`<p class="ec-partial-note">${E(t.error)}</p>`:''}${t.status==='stopped'?'<p class="ec-partial-note">任务已停止，结论仅覆盖已完成验证的范围。</p>':''}</section><div class="scan-detail-grid"><section class="card"><div class="ec-panel-head"><h2>扫描发现</h2><span>已确认问题</span></div>${S.findingsHTML(t)}</section><section class="card scan-report-preview"><div class="ec-panel-head"><h2>扫描报告</h2><span>${ready?(t.status==='done'?'已归档':'部分报告'):'执行中'}</span></div><div class="scan-report-body"><h3>${S.typeName(t.type)}扫描报告</h3><p>${t.status==='done'?`已确认 ${rows.length} 项漏洞，包含定位证据、影响与修复建议。`:terminal.has(t.status)?'执行未完整结束，已保存的阶段记录和验证结果可供追溯。':'完成扫描后自动归档报告；零漏洞结果也会保留检查范围。'}</p><button class="btn primary" ${identified(t)} ${ready?'':'disabled'} onclick="App.evaluation.openReportList(this.dataset.task)">查看报告</button></div></section></div>`;
};
S.inspect=function(taskId,findingId){
 const t=S.tasks().find(t=>t.id===taskId),f=confirmed(t||{}).find(f=>f.id===findingId);if(!f)return;
 A.drawer('漏洞详情',`<article class="scan-finding-detail"><div class="flex">${A.badge(levelName[f.severity]||'未分级',tone(f.severity))}${A.badge('已确认','orange')}</div><h2>${E(f.title)}</h2><dl>${[['风险分类',[f.category,f.cwe].filter(Boolean).join(' · ')],['定位',f.location],['问题描述',f.description],['验证依据',f.verification||f.rationale],['影响',f.impact],['修复建议',f.recommendation||f.remediation_hint]].map(([label,value])=>`<div><dt>${label}</dt><dd>${E(value||'未记录')}</dd></div>`).join('')}</dl><h3>定位证据</h3><pre>${E(f.evidence||f.code_snippet||'未记录')}</pre></article>`,`<button class="btn" onclick="App.closeDrawer()">关闭</button>`);
};
S.reportHTML=function(id){
 const t=S.tasks().find(t=>t.id===id);if(!t||!terminal.has(t.status)||!t.resultSaved)return A.heading('','扫描报告','任务尚无可归档的执行记录。');
 const rows=confirmed(t),material=t.targetMaterial||{},partial=t.status!=='done';
 return A.heading('',E(t.name+' · 扫描报告'),'任务创建时间：'+t.created,`<button class="btn" onclick="App.evaluation.openReportList()">返回报告分析</button><button class="btn" ${identified(t)} onclick="App.scanProduct.open(this.dataset.task)">来源任务</button><button class="btn primary" ${identified(t)} onclick="App.scanProduct.exportReport(this.dataset.task)">导出报告</button>`)+`<article class="card scan-full-report"><h2>${S.typeName(t.type)}扫描报告${partial?' · 部分结果':''}</h2><p>评估资产：${E(t.targetName)} · 目标：${E(kindName[material.kind]||'已登记目标')}</p><p>${material.kind==='web'?'检查地址':'扫描制品'}：${E(material.kind==='web'?material.path||'未记录':material.fileName||material.name||'已归档制品')} · 版本：${E(material.version||'未记录')}</p><p>执行结果：${E(({done:'已完成',stopped:'已停止',error:'执行异常'}[t.status]))} · 已完成 ${t.completedSteps} / ${stages.length} 个阶段</p><p>${partial?'本次执行未完整结束，不能据此作出全量安全结论。':'结论仅覆盖本任务保存的目标版本和实际检查范围。'}</p>${t.error?`<p class="ec-partial-note">${E(t.error)}</p>`:''}<h3>已确认漏洞分布</h3><div class="scan-severity-grid">${['critical','high','medium','low'].map(level=>`<div><span>${levelName[level]}</span><strong>${rows.filter(f=>f.severity===level).length}</strong></div>`).join('')}</div><h3>漏洞发现与修复建议</h3>${rows.map(f=>`<section class="scan-report-finding"><h4>${A.badge(levelName[f.severity]||'未分级',tone(f.severity))}${E(f.title)}</h4><p><strong>定位：</strong>${E(f.location)}</p><p>${E(f.description)}</p><pre>${E(f.evidence||f.code_snippet||'未记录')}</pre><p><strong>验证依据：</strong>${E(f.verification||f.rationale||'已确认')}</p><p><strong>修复建议：</strong>${E(f.recommendation||f.remediation_hint||'未记录')}</p></section>`).join('')||`<p>${partial?'暂无已确认漏洞，保留执行记录供排查。':'本次扫描范围内未确认漏洞。'}</p>`}<details><summary>执行阶段记录</summary><ol>${list(t.stageHistory).map(row=>`<li>${E(row.label)}：${E(clean(row.message))}</li>`).join('')}</ol></details></article>`;
};
})();

};

// ─── asset-intake ──────────────────────────────────────────────────────────
AppParts['scan/asset-intake'] = function () {
/* Business entry points own asset creation; tasks retain immutable material snapshots. */
(function(){
'use strict';
const A=window.App,S=A.scanProduct,G=A.platformGovernance,C=A.contentSafety,E=A.escape;
const copy=x=>JSON.parse(JSON.stringify(x)),time=()=>new Date().toISOString(),uid=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
const options=(rows,value)=>rows.map(([id,label])=>`<option value="${E(id)}" ${id===value?'selected':''}>${E(label)}</option>`).join('');
const error=text=>{const el=document.getElementById('scan-error');if(el)el.textContent=text;return false;};
const baseInit=S.init,baseForm=S.form,baseCreate=S.create,baseRetest=S.retest;
S.init=function(){const result=baseInit.apply(S,arguments);for(const a of A.data.businessAssets.code){if(!Array.isArray(a.versions))a.versions=[{id:uid('version'),label:a.revision||'V1',source:'directory',path:a.scanPath||'',createdAt:a.createdAt,fixtureType:a.fixtureType||null,available:!!a.scanPath}];}return result;};
S.newTask=function(){S.init();const type=S.tab;if(type==='app-scan'){const a=S.assets(type)[0];S.draft={name:'',type,targetId:a?.id||'',materialId:a?.scanMaterials?.[0]?.id||'',scope:''};return S.form();}S.draft={name:'',type,targetId:'new',projectName:'',source:'upload',materialMode:'new',targetPath:'',versionNote:'',scope:'',url:'',versionId:''};S.form();};
S.intakeChange=function(key,value){const d=S.draft;if(!d)return;d[key]=value;if(key==='targetId'){const a=S.assets(d.type).find(a=>a.id===value);d.projectName=a?.name||'';d.url=a?.url||'';d.versionId=a?.versions?.at(-1)?.id||'';d.materialMode=d.type==='code-scan'&&a?'existing':'new';}if(key==='source'||key==='materialMode'||key==='targetId'){S.uploadToken=null;d.upload=null;d.reading=false;S.form();}};
S.readPackage=async function(input){const d=S.draft,file=input.files?.[0];if(!d||!file)return;const token=uid('upload');S.uploadToken=token;d.upload=null;d.reading=true;const status=document.getElementById('scan-file-status');if(status)status.textContent='正在校验文件…';try{if(!/\.(zip|tar|tar\.gz|tgz)$/i.test(file.name))throw new Error('请选择 ZIP、TAR 或 TAR.GZ 代码包。');if(!file.size||file.size>200*1024*1024)throw new Error('代码包须大于 0 且不超过 200 MB。');const bytes=await file.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',bytes),hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');if(S.draft!==d||S.uploadToken!==token)return;d.upload={name:file.name,size:file.size,sha256:hash};if(status)status.textContent=file.name+' · '+(file.size/1024).toFixed(1)+' KB · 校验完成';}catch(e){if(S.draft===d&&S.uploadToken===token){if(status)status.textContent=e.message;}}finally{if(S.draft===d&&S.uploadToken===token)d.reading=false;}};
S.form=function(){const d=S.draft;if(!d)return;if(d.type==='app-scan')return baseForm.apply(S,arguments);const code=d.type==='code-scan',assets=S.assets(d.type),asset=assets.find(a=>a.id===d.targetId),versions=asset?.versions||[];
const target=`<div class="field"><label for="scan-project">${code?'所属项目':'所属站点'} *</label><select id="scan-project" onchange="App.scanProduct.intakeChange('targetId',this.value)">${options([['new',code?'新建代码项目':'添加 Web 站点'],...assets.map(a=>[a.id,a.name])],d.targetId)}</select></div>${d.targetId==='new'?`<div class="field"><label for="scan-project-name">${code?'项目名称':'站点名称'} *</label><input id="scan-project-name" maxlength="80" value="${E(d.projectName||'')}" oninput="App.scanProduct.draft.projectName=this.value"></div>`:''}`;
const material=code?`${asset?`<div class="field"><label for="scan-material-mode">扫描代码</label><select id="scan-material-mode" onchange="App.scanProduct.intakeChange('materialMode',this.value)">${options([['existing','已有版本'],['new','上传新版本']],d.materialMode)}</select></div>`:''}${d.materialMode==='existing'&&asset?`<div class="field"><label for="scan-version-id">代码版本 *</label><select id="scan-version-id" onchange="App.scanProduct.draft.versionId=this.value">${options(versions.map(v=>[v.id,v.label+(v.available===false?' · 材料不可用':'')]),d.versionId)}</select></div>`:`<div class="field"><label for="scan-package">代码包 *</label><input id="scan-package" type="file" accept=".zip,.tar,.gz,.tgz" onchange="App.scanProduct.readPackage(this)"><small id="scan-file-status">${E(d.upload?.name||'支持 ZIP、TAR、TAR.GZ，最大 200 MB')}</small></div><div class="field"><label for="scan-version-note">版本名称 *</label><input id="scan-version-note" maxlength="120" required value="${E(d.versionNote||'')}" placeholder="如 v1.2.0 或 release-2026.10" oninput="App.scanProduct.draft.versionNote=this.value"></div>`}`:`<div class="field"><label for="scan-url">扫描地址 *</label><input id="scan-url" maxlength="500" value="${E(d.url||'')}" placeholder="https://portal.example.com/api/" oninput="App.scanProduct.draft.url=this.value"><p class="hint">同一协议、域名及端口归入同一站点；路径作为本次扫描范围。</p></div>`;
A.modal('新建'+S.typeName(d.type)+'扫描任务',`<form id="scan-form" onsubmit="event.preventDefault();App.scanProduct.create()"><div class="field"><label for="scan-name">任务名称 *</label><input id="scan-name" maxlength="80" value="${E(d.name||'')}" oninput="App.scanProduct.draft.name=this.value"></div>${target}${material}<div class="field"><label for="scan-scope">范围说明</label><input id="scan-scope" maxlength="200" value="${E(d.scope||'')}" oninput="App.scanProduct.draft.scope=this.value"></div><p id="scan-error" class="error-message" role="alert"></p></form>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.scanProduct.create()">启动扫描</button>`);};
S.create=function(){const d=S.draft;if(!d||d.type==='app-scan')return baseCreate.apply(S,arguments);S.init();const code=d.type==='code-scan',assets=S.assets(d.type);let asset=assets.find(a=>a.id===d.targetId),version,url;
if(!String(d.name||'').trim()||d.name.length>80)return error('请填写不超过 80 字的任务名称。');
if(!asset&&(d.targetId!=='new'||!String(d.projectName||'').trim()||d.projectName.length>80))return error('请填写不超过 80 字的项目或站点名称。');
if(!asset&&assets.some(a=>a.name.trim().toLowerCase()===d.projectName.trim().toLowerCase()))return error('已有同名资产，请在所属项目或站点中选择，避免重复创建。');
if(code){if(d.materialMode==='existing'&&asset){version=asset.versions.find(v=>v.id===d.versionId);if(!version||version.available===false||!version.path)return error('该版本代码材料不可用，请上传新代码。');}else{const versionName=String(d.versionNote||'').trim();if(!versionName||versionName.length>120)return error('请填写 1–120 字的版本名称。');if(d.reading)return error('文件校验尚未完成。');if(!d.upload)return error('请选择代码包并等待校验完成。');const existing=asset?.versions.find(v=>String(v.label||'').trim()===versionName);if(existing&&existing.sha256!==d.upload.sha256)return error('该版本名称已存在且检测输入不同，请填写新的版本名称。');version=existing||{id:uid('version'),label:versionName,source:'upload',createdAt:time(),available:false,materialStored:false,...d.upload,path:'/uploads/'+uid('source')+'/src'};}}
else{try{url=new URL(String(d.url||'').trim());if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.hash||url.href.length>500)throw 0;}catch(e){return error('请输入不含凭据和片段的有效 HTTP(S) 地址。');}if(asset&&new URL(asset.url).origin!==url.origin)return error('扫描地址须属于所选站点；其他站点请选择添加 Web 站点。');asset=asset||assets.find(a=>new URL(a.url).origin===url.origin);}
const created=!asset;if(!asset){asset={id:uid(code?'asset-code':'asset-web'),name:d.projectName.trim(),createdAt:time(),...(code?{repository:'',versions:[]}:{url:url.origin+'/'} )};assets.push(asset);}
if(code){if(!asset.versions.some(v=>v.id===version.id))asset.versions.push(version);asset.repository=version.source==='upload'?'本地上传':'服务器路径';asset.scanPath=version.path;asset.revision=version.label;d.targetPath=version.path;d.version=version.label;}
d.targetId=asset.id;const task=baseCreate.apply(S,arguments);if(task){if(code){task.versionId=version.id;task.targetMaterial={...task.targetMaterial,...copy(version),version:version.label};if(!version.fixtureType){task.fixtureType=null;task.targetMaterial.fixtureType=null;}}else{task.targetMaterial.path=url.href;task.config.scope=String(d.scope||'').trim()||url.pathname+url.search;}task.targetSnapshot=copy(asset);asset.updatedAt=time();G.audit(created?'asset.create':'asset.update',asset.id,(created?'登记资产：':'扫描资产：')+asset.name,{assetId:asset.id,taskId:task.id});A.save();}return task;};
S.startForAsset=function(kind,id,newVersion=false){S.tab=kind==='code'?'code-scan':'web-scan';S.newTask();S.intakeChange('targetId',id);if(newVersion){S.intakeChange('materialMode','new');}S.form();};
S.retest=function(id){const t=S.tasks().find(t=>t.id===id);if(!t||t.type==='app-scan')return baseRetest.apply(S,arguments);if(!['done','stopped','error'].includes(t.status))return false;S.startForAsset(t.type==='code-scan'?'code':'web',t.targetId);S.draft.name=t.name+' · 复测';S.draft.parentId=t.id;if(t.type==='code-scan'){const a=S.assets(t.type).find(a=>a.id===t.targetId);S.draft.versionId=t.versionId||a?.versions.find(v=>v.path===t.targetMaterial?.path&&v.label===t.targetMaterial?.version)?.id||'';}else S.draft.url=t.targetMaterial?.path||S.draft.url;S.form();return true;};
G.assetHistory=function(kind,id){S.init();const a=A.data.businessAssets[kind].find(a=>a.id===id);if(!a)return;const tasks=S.tasks().filter(t=>t.targetId===id).sort((a,b)=>b.created.localeCompare(a.created));const versions=kind==='code'?`<h3>代码版本</h3><div class="table-wrap"><table><thead><tr><th>版本</th><th>来源</th><th>材料状态</th><th>操作</th></tr></thead><tbody>${a.versions.slice().reverse().map(v=>`<tr><td>${E(v.label)}<small>${E(v.note||'')}</small></td><td>${v.source==='upload'?'本地上传':'服务器路径'}<small>${E(v.name||'')}</small></td><td>${v.available===false?'不可用':'可用'}</td><td><button class="link-btn" data-id="${E(a.id)}" data-version="${E(v.id)}" ${v.available===false?'disabled':''} onclick="App.closeDrawer();App.scanProduct.startForAsset('code',this.dataset.id);App.scanProduct.draft.versionId=this.dataset.version;App.scanProduct.form()">发起扫描</button></td></tr>`).join('')}</tbody></table></div>`:'';A.drawer(a.name,`${versions}<h3>扫描历史</h3><div class="table-wrap"><table><thead><tr><th>任务</th><th>${kind==='code'?'版本':'检查地址'}</th><th>状态</th><th>时间</th></tr></thead><tbody>${tasks.map(t=>`<tr><td><button class="link-btn" data-id="${E(t.id)}" onclick="App.closeDrawer();App.scanProduct.open(this.dataset.id)">${E(t.name)}</button></td><td>${E(kind==='code'?t.targetMaterial?.version||'—':t.targetMaterial?.path||a.url)}</td><td>${S.status(t)}</td><td>${E(t.created)}</td></tr>`).join('')||'<tr><td colspan="4">暂无扫描任务</td></tr>'}</tbody></table></div>`,`<button class="btn" onclick="App.closeDrawer()">关闭</button>`);};
G.assetsHTML=function(item){
 S.init();const code=item!=='web',assets=A.data.businessAssets[code?'code':'web'];
 return A.heading('',code?'代码资产':'Web 资产','')+`<section class="card"><div class="table-wrap"><table class="pg-assets-table"><thead><tr><th>名称</th>${code?'':'<th>地址</th>'}<th>创建时间</th></tr></thead><tbody>${assets.map(a=>`<tr><td>${E(a.name)}</td>${code?'':`<td class="pg-wrap">${E(a.url||'—')}</td>`}<td>${E(a.createdAt?C.time(a.createdAt):'—')}</td></tr>`).join('')||`<tr><td colspan="${code?2:3}" class="empty">暂无${code?'代码':'Web'}资产</td></tr>`}</tbody></table></div></section>`;
};
G.renameAsset=function(kind,id){const a=A.data.businessAssets[kind].find(a=>a.id===id);if(!a)return;G.renameDraft={kind,id,name:a.name};A.modal('编辑资产名称',`<div class="field"><label for="asset-rename">资产名称 *</label><input id="asset-rename" maxlength="80" value="${E(a.name)}" oninput="App.platformGovernance.renameDraft.name=this.value"></div><p id="asset-rename-error" class="error-message"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.platformGovernance.saveRename()">保存</button>`);};
G.saveRename=function(){const d=G.renameDraft,list=A.data.businessAssets[d.kind],a=list.find(a=>a.id===d.id),name=d.name.trim();if(!name||name.length>80||list.some(v=>v.id!==d.id&&v.name.toLowerCase()===name.toLowerCase())){document.getElementById('asset-rename-error').textContent='名称不能为空、超过 80 字或与已有资产重复。';return false;}a.name=name;G.audit('asset.update',a.id,'更新资产名称：'+name,{assetId:a.id});A.save();A.closeModal();A.render();return true;};
S.editMaterial=function(){const d=S.draft,app=S.assets('app-scan').find(a=>a.id===d?.targetId);if(!app)return;d.upload=null;d.reading=false;S.uploadToken=null;S.materialDraft={name:'',kind:'source',version:''};A.drawer('上传扫描制品',`<div class="field"><label for="scan-material-name">制品名称 *</label><input id="scan-material-name" maxlength="80" oninput="App.scanProduct.materialDraft.name=this.value"></div><div class="field"><label for="scan-material-kind">制品类型</label><select id="scan-material-kind" onchange="App.scanProduct.materialDraft.kind=this.value"><option value="source">应用代码</option><option value="binary">软件包</option></select></div><div class="field"><label for="scan-package">制品文件 *</label><input id="scan-package" type="file" accept=".zip,.tar,.gz,.tgz" onchange="App.scanProduct.readPackage(this)"><small id="scan-file-status">支持 ZIP、TAR、TAR.GZ，最大 200 MB</small></div><div class="field"><label for="scan-material-version">版本名称 *</label><input id="scan-material-version" maxlength="120" required oninput="App.scanProduct.materialDraft.version=this.value"></div><p id="scan-material-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.closeDrawer()">取消</button><button class="btn primary" onclick="App.scanProduct.saveMaterial()">保存并选用</button>`);};
S.saveMaterial=function(){const d=S.materialDraft,w=S.draft,app=S.assets('app-scan').find(a=>a.id===w?.targetId);if(!app||!d)return false;const issue=!d.name.trim()||d.name.length>80?'请填写不超过 80 字的制品名称。':w.reading?'文件校验尚未完成。':!w.upload?'请选择制品文件并等待校验完成。':!['source','binary'].includes(d.kind)?'请选择有效的制品类型。':!String(d.version||'').trim()||String(d.version).trim().length>120?'请填写 1–120 字的版本名称。':'';if(issue){document.getElementById('scan-material-error').textContent=issue;return false;}const material={id:uid('material'),name:d.name.trim(),kind:d.kind,version:d.version.trim(),path:'/uploads/'+uid('material')+'/src',fileName:w.upload.name,sha256:w.upload.sha256,source:'upload'};app.scanMaterials=app.scanMaterials||[];app.scanMaterials.push(material);w.materialId=material.id;w.upload=null;A.save();A.closeDrawer();S.form();return material;};

})();
};

// ─── scan-restoration ──────────────────────────────────────────────────────
AppParts['scan/scan-restoration'] = function () {
/* Restore only the ZIP's scan views; platform assets, tasks, models and reports stay authoritative. */
(function(){
'use strict';
const A=window.App,S=A.scanProduct,V=A.evaluation,Q=A.assessment,E=A.escape;
const B=A.scanRestoration={view:'list'},copy=v=>JSON.parse(JSON.stringify(v)),categories={'code-scan':'code','app-scan':'app','web-scan':'web'},types={code:'code-scan',app:'app-scan',web:'web-scan'};
B.payload=function(){const data={projects:[],posture:{targets:[]},modelConfigs:A.modelRoles.candidates('scanner').map(m=>({id:m.id,name:m.name,model:m.model||m.name})),trashItems:[],findings:[],candidates:[],probes:[],patches:[],artifactsByJob:{},nodesByJob:{},activityByJob:{},logsByJob:{},findingsByJob:{},candidatesByJob:{},probesByJob:{},patchesByJob:{}};
 for(const t of S.tasks()){const p=S.payload(t),project=p.projects[0],sourceId=project.id;project.id=t.id;project.platformCategory=categories[t.type];project.reportEligible=V.reportReady(t);project.status=t.status==='done'?'succeeded':t.status==='error'?'failed':t.status;data.projects.push(project);for(const key of ['artifactsByJob','nodesByJob','activityByJob','logsByJob','findingsByJob','candidatesByJob','probesByJob','patchesByJob'])data[key][t.id]=p[key]?.[sourceId]??(['artifactsByJob','logsByJob'].includes(key)?{}:[]);}
 for(const key of ['findings','candidates','probes','patches'])data[key]=Object.values(data[key+'ByJob']).flat();
 for(const type of Object.keys(categories))for(const a of S.assets(type)){data.posture.targets.push({id:a.id,name:a.name,identity:a.url||a.repository||a.name,type:type==='web-scan'?'Web 站点':type==='app-scan'?'二进制 / 软件包':'代码',platformCategory:categories[type],owner:a.owner||'',jobIds:S.tasks().filter(t=>t.targetId===a.id&&t.type===type).map(t=>t.id)});}
 return data;
};
B.frame=function(route,tab=''){return `<iframe id="scan-restored" class="scan-surface" title="漏洞检测" data-route="${E(route)}" data-tab="${E(tab)}" sandbox="allow-scripts allow-downloads allow-modals" srcdoc="${E(window.ScanRestoredDocument)}" onload="App.scanRestoration.mount(this)"></iframe>`;};
B.draft=function(){const d=S.draft||{};return {category:categories[d.type||S.tab],name:d.name||'',description:d.scope||'',target_id:d.targetId==='new'?'':d.targetId||'',model_config_id:d.modelId||A.modelRoles.candidates('scanner')[0]?.id||'',phase:d.mode||'agent-full',version_name:d.versionNote||'',target_path:d.targetPath||'',website_url:d.url||'',upload:d.upload||null,targetName:d.upload?.name||'',targetKind:'',targetFiles:0,reading:false};};
B.mountedFrames=new WeakMap();
B.frameKey=frame=>JSON.stringify([frame.dataset.route,frame.dataset.tab,categories[S.tab]]);
B.mount=function(frame){frame ||= document.getElementById('scan-restored');if(!frame)return;const exporting=B.pendingExport&&frame.dataset.route==='/projects/'+encodeURIComponent(B.pendingExport.id)?B.pendingExport:null;frame.contentWindow?.postMessage({type:'scan-restored-load',route:frame.dataset.route,tab:frame.dataset.tab,payload:B.payload(),category:categories[S.tab],draft:B.draft(),exportFormat:exporting?.format},'*');B.mountedFrames.set(frame,B.frameKey(frame));if(exporting)B.pendingExport=null;};
S.render=function(tab='code-scan'){S.init();S.tab=categories[tab]?tab:'code-scan';const t=S.tasks().find(t=>t.id===S.selected&&t.type===S.tab);if(t)return S.detailHTML(t);if(B.view==='new'&&S.draft?.type===S.tab)return B.frame('/scan/new');return B.frame('/scan/'+categories[S.tab]);};
S.detailHTML=function(t){return `<div class="aq-detail-nav"><button class="btn" data-type="${E(t.type)}" onclick="App.scanRestoration.list(this.dataset.type)">← 返回任务列表</button><div><button class="btn" data-object="${E(Q.objectKey(t))}" onclick="App.assessment.openObject(this.dataset.object)">对象评估历史</button>${['done','error','stopped'].includes(t.status)?`<button class="btn" data-id="${E(t.id)}" onclick="App.scanProduct.retest(this.dataset.id)">再次评估</button>`:''}</div></div>`+B.frame('/projects/'+encodeURIComponent(t.id),V.reportReady(t)?'report':'run');};
S.reportHTML=function(id){const t=S.tasks().find(t=>t.id===id);if(!V.reportReady(t))return A.heading('','评估报告','任务成功完成后生成报告。');return `<div class="aq-detail-nav"><button class="btn" onclick="App.evaluation.openReportList()">← 返回评估报告</button><button class="btn" data-id="${E(id)}" onclick="App.scanProduct.open(this.dataset.id)">来源任务</button></div>`+B.frame('/projects/'+encodeURIComponent(id),'report');};
S.exportReport=function(id,format='html'){const t=S.tasks().find(t=>t.id===id);if(!V.reportReady(t)){A.toast('任务成功完成后才可导出报告');return false;}if(!['html','markdown','pdf'].includes(format))return false;B.pendingExport={id,format};V.openReport(id);return true;};
B.list=function(type){B.view='list';S.selected=null;A.platform.go('evaluation','scan',type||S.tab);};
const open=S.open;S.open=function(id){B.view='list';return open.apply(S,arguments);};
const newTask=S.newTask;S.newTask=function(){B.view='new';return newTask.apply(S,arguments);};
S.form=function(){B.view='new';S.selected=null;A.closeModal();B.formNavigation=true;try{if(A.platform.state.section!=='evaluation'||A.platform.state.item!=='scan'||A.platform.scanTab!==S.tab)A.platform.go('evaluation','scan',S.tab);else A.render();}finally{B.formNavigation=false;}};
const select=A.platform.selectState;A.platform.selectState=function(section,item,tab,id){if(section==='evaluation'&&item==='scan'&&!B.formNavigation)B.view='list';return select.apply(this,arguments);};
B.navigate=function(path){let parts;try{parts=String(path).replace(/^#?\/?/,'').split('/').map(decodeURIComponent);}catch(e){return false;}if(parts[0]==='projects'&&parts[1])return S.open(parts[1]);if(parts[0]==='scan'&&parts[1]==='new')return S.newTask();if(parts[0]==='scan'&&types[parts[1]])return B.list(types[parts[1]]);if(parts[0]==='targets'&&parts[1]){const obj=Q.objects().find(v=>v.asset.id===parts[1]);if(obj)return Q.openObject(obj.key);}return B.list();};
B.create=function(value){if(!value||!S.draft)return false;const d=S.draft;Object.assign(d,{name:String(value.name||''),projectName:String(value.targetName||value.name||''),targetId:value.target_id||'new',modelId:value.model_config_id||'',mode:value.phase==='full'?'full':'agent-full',versionNote:String(value.version_name||''),materialMode:'new',source:value.upload?'upload':'path',upload:value.upload?copy(value.upload):null,targetPath:String(value.target_path||''),url:String(value.website_url||''),scope:String(value.description||''),reading:false});
 // Existing creator remains responsible for validation, version identity and asset registration.
 let error='',get=document.getElementById.bind(document);document.getElementById=function(id){if(id==='scan-error')return {set textContent(v){error=v;}};return get(id);};let result;try{result=S.create();}finally{document.getElementById=get;}
 if(!result){const frame=get('scan-restored');frame?.contentWindow?.postMessage({type:'scan-restored-error',error:error||'创建失败，请检查输入'},'*');}else B.view='list';return result;
};
window.addEventListener('message',event=>{const frame=document.getElementById('scan-restored');if(!frame||event.source!==frame.contentWindow||event.data?.type!=='scan-restored-action')return;const m=event.data;if(m.action==='ready'||m.action==='refresh')B.mount(frame);else if(m.action==='height'&&Number.isFinite(m.height)&&m.height>0)frame.style.height=Math.max(1,Math.min(30000,Math.ceil(m.height)))+'px';else if(m.action==='navigate')B.navigate(m.path);else if(m.action==='create')B.create(m.draft);else if(m.action==='recycle')S.recycle();else if(['delete','stop'].includes(m.action)&&S.tasks().some(t=>t.id===m.taskId))S.action(m.taskId,m.action);});
const tick=S.tick;
S.tick=function(){
 const frame=document.getElementById('scan-restored');if(!frame)return tick.apply(S,arguments);
 const route=frame.dataset.route||'',project=route.startsWith('/projects/')?decodeURIComponent(route.slice('/projects/'.length)):null;
 const visibleState=()=>route==='/scan/new'?'':JSON.stringify(S.tasks().filter(t=>project?t.id===project:t.type===(types[route.split('/')[2]]||S.tab)));
 const before=visibleState(),render=A.render;let result;A.render=()=>{};
 try{result=tick.apply(S,arguments);}finally{A.render=render;}
 if(result&&before!==visibleState())B.mount(frame);return result;
};
// Background attack ticks still advance and save, but must not recreate the
// scanner iframe. Scan progress already arrives through its own message bridge.
const shouldRenderTick=A.modules.attack.shouldRenderTick;
A.modules.attack.shouldRenderTick=function(){return !document.getElementById('scan-restored')&&shouldRenderTick?.apply(this,arguments)!==false;};
// Incremental rendering preserves the iframe, so a route change does not fire onload.
// Send the new route explicitly while keeping the same loaded document alive.
const afterRender=A.modules.attack.afterRender;
A.modules.attack.afterRender=function(){
 const result=afterRender?.apply(this,arguments),frame=document.getElementById('scan-restored');
 if(frame&&(B.mountedFrames.get(frame)!==B.frameKey(frame)||B.pendingExport))B.mount(frame);
 return result;
};
})();
};

// ─── assessment-navigation ─────────────────────────────────────────────────
AppParts['scan/assessment-navigation'] = function () {
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
};

// ─── review24 ──────────────────────────────────────────────────────────────
AppParts['scan/review24'] = function () {
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
};
