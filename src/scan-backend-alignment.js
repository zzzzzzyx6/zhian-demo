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

