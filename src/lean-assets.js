/* Asset inventory and model access share one center; managed guard services stay read-only. */
(function(){
'use strict';
const A=window.App,Q=A.assessment,R=A.applicationAssets,C=A.connections,M=A.modelRoles,X=A.attack,E=A.escape;
const arr=value=>Array.isArray(value)?value:[];
const kinds={applications:{name:'AI应用',single:'应用',icon:'layers'},models:{name:'模型',single:'模型',icon:'box'},code:{name:'代码',single:'代码',icon:'code'},packages:{name:'二进制/软件包',single:'二进制/软件包',icon:'box'},web:{name:'Web',single:'Web 站点',icon:'link'}};
const L=A.leanAssets={query:{},filters:{},kinds,connectionOrigin:false};
const display=value=>E(value||'—');
const date=value=>A.listConsistency.time(value);
const attr=(kind,id)=>`data-kind="${E(kind)}" data-id="${E(id)}"`;
const status=(text,tone='neutral')=>`<span class="la-state la-state-${tone}"><i></i>${E(text)}</span>`;
const nameTags=names=>names.length?`<div class="la-tags">${names.map(name=>`<span>${E(name)}</span>`).join('')}</div>`:'<span class="muted">—</span>';
const safeEndpoint=value=>{try{const u=new URL(value);if(!['http:','https:'].includes(u.protocol))return '—';return u.origin+u.pathname.replace(/\/$/,'');}catch(e){return '—';}};
const serviceRows=()=>Object.entries(A.data.defenseServices||{}).map(([type,s])=>({...s,_serviceType:type}));
const serviceReady=s=>A.leanOperations?.serviceReady?A.leanOperations.serviceReady(s):s.status==='configured';
L.isManaged=m=>!!(A.managedGuards?.isManaged?.(m)||m?.managed||m?.platformManaged);
L.modelState=function(m){return m._serviceType?(serviceReady(m)?'ready':'unassigned'):M.state(m);};
L.needsConfiguration=m=>!L.isManaged(m)&&!m._serviceType&&(!M.connected(m)||M.state(m)!=='ready');
L.pendingModels=()=>L.rows('models').filter(L.needsConfiguration);
L.rows=function(kind){
 if(kind==='models'){const services=serviceRows(),ids=new Set(services.map(s=>s.id));return [...C.db.filter(m=>(m.kind||'model')==='model'&&!ids.has(m.id)),...services];}
 if(kind==='applications')return arr(A.data.aiApplications);
 return arr(A.data.businessAssets?.[kind]);
};
L.appNames=(kind,id)=>R.applicationsFor(kind+':'+id).map(a=>a.name);
L.assetNames=id=>R.assetsFor(id).map(r=>r.asset.name);
L.connectionState=function(m){
 if(L.isManaged(m))return status(serviceReady(m)?'已就绪':'服务异常',serviceReady(m)?'ready':'attention');
 if(m._serviceType)return status(serviceReady(m)?'已配置':'未配置',serviceReady(m)?'ready':'neutral');
 if(m.sample||m.simulated||m.demoConfigured)return status('演示接入','neutral');
 if(m.connectStatus==='testing')return status('校验中','active');
 if(m.presetPending||!m.model||!m.endpoint)return status('未配置','neutral');
 if(['fail','failed'].includes(m.connectStatus)||m.configurationCheck?.valid===false)return status('校验未通过','attention');
 return status(m.connectStatus==='ok'?'已配置 · 未验证':'待校验','neutral');
};
L.endpoint=m=>L.isManaged(m)?'平台托管':m._serviceType&&!serviceReady(m)?'—':safeEndpoint(m.endpoint);
L.purposes=function(m){
 if(L.isManaged(m))return nameTags(['内容防护']);
 if(m._serviceType)return serviceReady(m)?nameTags(['护栏']):'<span class="muted">未配置</span>';
 const d=M.get(m.id);return d?.confirmed&&d.roles?.length?nameTags(d.roles.map(r=>M.roles[r]||r)):'<span class="muted">未配置</span>';
};
L.identity=function(kind,a){
 if(kind==='models')return a.model||a.id;
 if(kind==='applications')return a.scene||a.description||'—';
 if(kind==='web')return safeEndpoint(a.url);
 if(kind==='code')return a.repository||'本地代码';
 return arr(a.versions).at(-1)?.fileName||arr(a.versions).at(-1)?.name||'二进制 / 软件包';
};
L.filter=function(kind,value){L.query[kind]=value;A.render();};
L.filterBy=function(kind,key,value){if(!['owner','environment'].includes(key))return;(L.filters[kind]||=( {owner:'',environment:''}))[key]=value;A.render();};
L.empty=function(kind,search){
 const note=search?'调整筛选条件或搜索名称。':({applications:'在安全防护中接入应用后显示。',models:'完成模型接入后显示。',code:'创建代码检测任务后记录对象与版本信息。',packages:'创建二进制/软件包检测任务后记录对象信息。',web:'创建 Web 检测任务后记录站点信息。'})[kind];
 return `<div class="la-empty"><span>${A.icon(kinds[kind].icon,26)}</span><strong>${search?'未找到匹配资产':'暂无'+kinds[kind].single}</strong><p>${note}</p></div>`;
};
L.list=function(kind){
 if(kind==='models')return M.render();
 A.scanProduct.init();M.init();
 const query=(L.query[kind]||'').trim().toLowerCase(),all=L.rows(kind),f=L.filters[kind]||{owner:'',environment:''},app=kind==='applications';
 const matches=(value,filter)=>!filter||(filter==='__unset__'?!String(value||'').trim():String(value||'').trim()===filter);
 const rows=all.filter(a=>(!query||String(a.name||'').toLowerCase().includes(query))&&matches(a.owner,f.owner)&&(!app||matches(a.environment,f.environment)));
 const choices=(key,label)=>{const values=[...new Set(all.map(a=>String(a[key]||'').trim()).filter(Boolean))].sort();return `<select aria-label="${label}筛选" onchange="App.leanAssets.filterBy('${kind}','${key}',this.value)"><option value="">全部${label}</option>${values.map(v=>`<option value="${E(v)}" ${f[key]===v?'selected':''}>${E(v)}</option>`).join('')}${all.some(a=>!String(a[key]||'').trim())?`<option value="__unset__" ${f[key]==='__unset__'?'selected':''}>未指定${label}</option>`:''}</select>`;};
 const columns=app?['应用名称','负责人','环境','操作']:['资产名称',...(kind==='code'?['版本数量']:[]),'负责人','更新时间','操作'];
 const body=rows.map(a=>{
  const title=`<button class="la-name" ${attr(kind,a.id)} onclick="App.leanAssets.open(this.dataset.kind,this.dataset.id)"><strong>${E(a.name||a.id)}</strong></button>`;
  const cells=app?[title,display(a.owner),display(a.environment),A.entryManagement.button('applications',a.id)]:[title,...(kind==='code'?[`<span class="la-version-count">${arr(a.versions).length}</span>`]:[]),display(a.owner),date(a.updatedAt||a.createdAt),A.entryManagement.button(kind,a.id)];
  return `<tr>${cells.map((cell,i)=>`<td${app&&i===cells.length-1?' class="la-row-end"':''}>${cell}</td>`).join('')}</tr>`;
 }).join('');
 return `<div class="la-page la-inventory-page">${A.heading('',kinds[kind].name,'')}<section class="card la-inventory"><div class="la-list-toolbar"><div class="la-inventory-filters">${choices('owner','负责人')}${app?choices('environment','环境'):''}</div><label class="la-search">${A.icon('search',16)}<input type="search" aria-label="${app?'搜索应用名称':'搜索资产名称'}" placeholder="${app?'搜索应用名称':'搜索资产名称'}" value="${E(L.query[kind]||'')}" onchange="App.leanAssets.filter('${kind}',this.value)"></label></div><div class="table-wrap"><table><thead><tr>${columns.map((c,i)=>`<th${app&&i===columns.length-1?' class="la-row-end"':''}>${c}</th>`).join('')}</tr></thead><tbody>${body||`<tr><td colspan="${columns.length}" class="la-empty-cell">${L.empty(kind,!!query||!!f.owner||!!f.environment)}</td></tr>`}</tbody></table></div></section></div>`;
};
const kv=(label,value)=>`<div><dt>${label}</dt><dd>${value}</dd></div>`;
L.profile=function(kind,a){
 const app=kind==='applications',model=kind==='models',versions=arr(a.versions),latest=versions.at(-1),format=v=>String(v?.fileName||v?.name||v?.path||'').match(/\.(tar\.gz|[a-z0-9]+)$/i)?.[1]?.toUpperCase()||'未记录';
 const facts=app?[['负责人',display(a.owner)],['环境',display(a.environment)],...(a.scene?[['业务场景',display(a.scene)]]:[])]:model?[['接入方式',L.isManaged(a)?'平台内置':'API 接入'],['服务地址',display(L.endpoint(a))],['连接状态',L.connectionState(a)],['平台用途',L.purposes(a)]]:[['负责人',display(a.owner)],['更新时间',date(a.updatedAt||a.createdAt)],...(kind==='web'?[['站点地址',display(a.url)]]:kind==='packages'?[['文件格式',format(latest)],['文件说明',display(a.description||latest?.note)]]:[])];
 let html=`<div class="la-profile"><div class="la-profile-head"><span class="la-profile-icon">${A.icon(kinds[kind].icon,25)}</span><div><span>${kinds[kind].single}</span><h3>${E((model?a.model||a.name:a.name)||a.id)}</h3></div></div><dl class="la-facts">${facts.map(([label,value])=>kv(label,value)).join('')}</dl>`;
 if(app&&a.description)html+=`<section class="la-detail-section"><h3>业务说明</h3><p>${E(a.description)}</p></section>`;
 if(['code','packages'].includes(kind))html+=`<section class="la-detail-section"><div class="la-section-label"><h3>版本记录</h3></div><div class="table-wrap"><table><thead><tr><th>版本名称</th>${kind==='packages'?'<th>文件格式</th>':''}<th>更新时间</th></tr></thead><tbody>${versions.slice().reverse().map(v=>`<tr><td><strong>${E(v.label||'版本未记录')}</strong></td>${kind==='packages'?`<td>${E(format(v))}</td>`:''}<td>${date(v.updatedAt||v.createdAt)}</td></tr>`).join('')||`<tr><td colspan="${kind==='packages'?3:2}" class="empty">暂无版本记录</td></tr>`}</tbody></table></div></section>`;
 return html+'</div>';
};
L.open=function(kind,id){const a=L.rows(kind).find(a=>a.id===id);if(!a)return;A.drawer(kinds[kind].single+'信息',L.profile(kind,a),'');};
L.applicationPage=function(id){const a=L.rows('applications').find(a=>a.id===id);return a?`<div class="la-page">${A.heading('',E(a.name),'应用档案',`<button class="btn" onclick="App.platform.go('assets','applications')">返回目录</button>`)}<section class="card la-profile-page">${L.profile('applications',a)}</section></div>`:L.list('applications');};
Q.assetDetail=L.open;
Q.assetsHTML=L.list;
A.platformGovernance.assetsHTML=L.list;
R.inline=(kind,id)=>nameTags(L.appNames(kind,id));
R.assetSection=(kind,id)=>{const names=L.appNames(kind,id);return names.length?`<section class="la-detail-section"><h3>关联应用</h3>${nameTags(names)}</section>`:'';};
R.listHTML=()=>L.list('applications');
R.open=id=>L.open('applications',id);
A.contentSafety.assetHTML=()=>A.platform.applicationId?L.applicationPage(A.platform.applicationId):L.list('applications');
R.scanField=()=>'';

L.connect=function(id){
 const asset=id&&L.rows('models').find(m=>m.id===id);if(asset&&L.isManaged(asset)){L.open('models',id);return;}
 L.connectionOrigin=true;X.connectionKind='model';const model=C.db.find(m=>m.id===id);C.open(id||'');
 // Editing a listed demonstration connection updates that identity rather than making a duplicate.
 if(model&&C.draft&&C.draft.id!==model.id){Object.assign(C.draft,{id:model.id,name:model.name,endpoint:model.endpoint||'',sample:false});C.form();}
};
// This standalone demo checks fields locally and never asserts network connectivity.
C.accessTestHTML=function(d){
 if(!d.testing&&!d.tested)return '';
 return `<p class="la-validation-state" role="status">${d.testing?'正在校验配置…':'配置格式校验通过 · 未验证服务连接'}</p>`;
};
C.renderAccessTest=function(){
 const d=C.draft;if(!d)return;const button=document.getElementById('c-test-btn'),steps=document.getElementById('connection-test-steps'),save=document.getElementById('c-save-btn');
 if(button){button.disabled=!!d.testing;button.classList.toggle('ok',!!d.tested);button.innerHTML=d.testing?'校验中…':d.tested?'✓ 配置校验通过':'配置校验';}
 if(steps)steps.innerHTML=C.accessTestHTML(d);if(save)save.disabled=!d.tested;
};
C.testDraft=function(){
 C.capture();const d=C.draft;if(!d)return false;const issue=(C.validateComparison?C.validateComparison(d):'')||C.validate(d),error=document.getElementById('connection-error');if(error)error.textContent=issue;
 C.markDirty();if(issue)return false;d.tested=true;d.testing=false;d.testProgress=3;d.testFingerprint=C.testFingerprint(d);d.validationMode='local-format';C.renderAccessTest();return true;
};
C.test=function(id){
 const m=C.db.find(m=>m.id===id);if(!m)return false;const draft={...m,key:C.secrets.get(id)||'',useSavedKey:true};
 const issue=m.presetPending?'请先补全接入配置':C.validate(draft);m.configurationCheck={valid:!issue,checkedAt:new Date().toISOString(),mode:'local-format'};m.connectStatus=issue?'fail':'ok';A.save();A.render();A.toast(issue?'配置校验未通过：'+issue:'配置格式校验通过；尚未验证服务连接');return !issue;
};
const connectionForm=C.form;
C.form=function(){const modal=A.modal;A.modal=function(title,body,footer,options){return modal.call(A,title,body.replace(/测试连接/g,'配置校验').replace(/<p class="call-id-help">[\s\S]*?<\/p>/,'<p class="call-id-help">仅校验配置格式，不调用模型服务。</p>'),String(footer||'').replace(/测试连接/g,'配置校验'),options);};try{return connectionForm.apply(C,arguments);}finally{A.modal=modal;}};
const saveConnection=C.save;
C.save=function(){const fromAssets=L.connectionOrigin&&A.platform.state.section==='assets',draft=C.draft,result=saveConnection.apply(C,arguments);if(fromAssets&&draft&&!C.draft){const saved=C.db.find(m=>m.id===draft.id);if(saved){delete saved.simulated;delete saved.demoConfigured;saved.sample=false;A.save();}L.connectionOrigin=false;X.tab='models';A.platform.state={section:'assets',item:'models'};A.render();}return result;};
M.render=function(){
 M.init();const f=M.filter,q=f.query.trim().toLowerCase(),all=L.rows('models'),rows=all.filter(m=>{const state=L.modelState(m),d=m._serviceType?{roles:serviceReady(m)?['guard']:[]}:M.get(m.id);return (!q||[m.name,m.model,m.endpoint].join(' ').toLowerCase().includes(q))&&(!f.state||(f.state==='pending'?L.needsConfiguration(m):state===f.state))&&(!f.role||d?.roles.includes(f.role));});
 const continuation=Q.pendingScanDraft?'<div class="aq-return-draft"><span>检测任务草稿已保留</span><button class="btn" onclick="App.assessment.resumeScanDraft()">继续创建任务</button></div>':'';
 const body=rows.map(m=>{const managed=L.isManaged(m),state=L.modelState(m),label=managed?(serviceReady(m)?'已就绪':'服务异常'):m._serviceType?(serviceReady(m)?'已配置':'未配置'):M.stateLabel(m);return `<tr><td><button class="la-name" data-id="${E(m.id)}" onclick="App.leanAssets.open('models',this.dataset.id)"><span class="la-asset-symbol">${A.icon(managed?'shield':'box',17)}</span><span><strong>${E(m.name||m.model)}</strong><small class="la-model-id">${E(m.model||'—')}</small></span></button></td><td>${managed?'<span class="la-source-tag">平台内置</span>':'外部接入'}</td><td class="la-endpoint">${display(L.endpoint(m))}${managed?'':`<small>${L.connectionState(m)}</small>`}</td><td>${L.purposes(m)}</td><td>${status(label,state==='ready'?'ready':state==='changed'?'attention':'neutral')}</td><td><div class="la-management-actions">${managed?`<button class="link-btn" data-id="${E(m.id)}" onclick="App.leanAssets.open('models',this.dataset.id)">查看</button>`:m._serviceType?`<button class="link-btn" data-type="${E(m._serviceType)}" onclick="App.defensePolicies.serviceEdit(this.dataset.type)">配置服务</button>`:`<button class="link-btn" data-id="${E(m.id)}" onclick="App.leanAssets.connect(this.dataset.id)">编辑连接</button><button class="link-btn" data-id="${E(m.id)}" ${C.connState(m).testing?'disabled':''} onclick="App.connections.test(this.dataset.id)">配置校验</button><button class="link-btn" data-id="${E(m.id)}" onclick="App.modelRoles.edit(this.dataset.id)">配置用途</button>`}</div></td></tr>`;}).join('');
 return `<div class="la-page la-management">${continuation}${A.heading('','模型资产','统一管理模型接入、服务连接与平台用途。',`<button class="btn primary" onclick="App.leanAssets.connect()">${A.icon('plus',14)}接入模型</button>`)}<section class="card la-inventory"><div class="la-list-toolbar"><div class="la-management-filters"><span class="la-model-total"><strong>${all.length}</strong> 项模型</span><select aria-label="用途筛选" onchange="App.modelRoles.filterBy('role',this.value)"><option value="">全部用途</option>${Object.entries(M.roles).map(([value,label])=>`<option value="${value}" ${f.role===value?'selected':''}>${label}</option>`).join('')}</select><select aria-label="配置状态筛选" onchange="App.modelRoles.filterBy('state',this.value)"><option value="">全部状态</option>${Object.entries({pending:'待配置',unassigned:'未配置用途',ready:'已配置',changed:'需重新确认',disabled:'未启用用途',offline:'连接不可用'}).map(([value,label])=>`<option value="${value}" ${f.state===value?'selected':''}>${label}</option>`).join('')}</select></div><label class="la-search">${A.icon('search',16)}<input type="search" aria-label="搜索模型" placeholder="搜索名称或模型标识" value="${E(f.query)}" onchange="App.modelRoles.filterBy('query',this.value)"></label></div><div class="table-wrap"><table><thead><tr><th>模型</th><th>接入方式</th><th>服务连接</th><th>平台用途</th><th>配置状态</th><th>操作</th></tr></thead><tbody>${body||'<tr><td colspan="6" class="empty">暂无匹配模型</td></tr>'}</tbody></table></div><div class="la-table-note">未配置用途的模型不可用于新任务。平台内置模型由平台维护。</div></section></div>`;
};

const contracts={basic:['chat'],safety:['chat','qwen3guard'],embedding:['embeddings'],multimodal:['multimodal-chat']};
const compatible={chat:['target','attacker','judge','scanner'],'multimodal-chat':['target','attacker','judge','scanner'],qwen3guard:['guard'],embeddings:['embedding']};
const supported=d=>(compatible[d.outputProtocol]||[]).filter(r=>d.type!=='safety'||r!=='attacker');
M.edit=function(id){const asset=L.rows('models').find(v=>v.id===id);if(asset&&L.isManaged(asset)){L.open('models',id);return;}const m=C.db.find(v=>v.id===id);if(!m)return;M.draft=M.get(id);if(m.systemGuard||id==='system-qwen3guard'){M.draft.type='safety';M.draft.outputProtocol='qwen3guard';}else if(M.draft.outputProtocol==='unconfigured')M.draft.outputProtocol=contracts[M.draft.type][0];M.editor();};
M.editor=function(){
 const d=M.draft,m=C.db.find(v=>v.id===d?.modelId);if(!m)return;const fixed=!!m.systemGuard||m.id==='system-qwen3guard';
 const body=`<div class="la-role-editor"><p class="la-edit-subject">${E(m.name||m.model)}</p><div class="form-grid"><div class="field"><label for="mr-type">模型类型</label><select id="mr-type" ${fixed?'disabled':''} onchange="App.modelRoles.changeType(this.value)">${Object.entries(M.types).map(([id,label])=>`<option value="${id}" ${d.type===id?'selected':''}>${label}</option>`).join('')}</select></div><div class="field"><label for="mr-protocol">输出能力</label><select id="mr-protocol" ${fixed?'disabled':''} onchange="App.modelRoles.changeProtocol(this.value)">${contracts[d.type].filter(id=>fixed||id!=='qwen3guard').map(id=>`<option value="${id}" ${d.outputProtocol===id?'selected':''}>${M.protocols[id]}</option>`).join('')}</select></div></div><fieldset class="mr-role-choices"><legend>平台用途 <span>可多选</span></legend>${Object.entries(M.roles).map(([id,label])=>{const enabled=supported(d).includes(id);return `<label class="${enabled?'':'disabled'}"><input type="checkbox" ${d.roles.includes(id)?'checked':''} ${enabled?'':'disabled'} onchange="App.modelRoles.toggleRole('${id}',this.checked)"><span>${label}</span></label>`;}).join('')}</fieldset><p class="hint">清空用途后，该模型不再供新任务选用。</p>${M.state(m)==='changed'?'<p class="error-message">连接已变更，请重新确认用途。</p>':''}<p id="mr-error" class="error-message" role="alert"></p></div>`;
 A.modal('配置模型用途',body,'<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.modelRoles.save()">保存</button>');
};
X.guardConnectionHint='护栏未就绪，请在资产中心 → 模型查看检测服务。';
const render=A.modules.attack.render;
A.modules.attack.render=function(){A.platform.sync();const {section,item}=A.platform.state;if(section==='assets'&&item==='models')return M.render();if(section==='assets'&&kinds[item])return item==='applications'&&A.platform.applicationId?L.applicationPage(A.platform.applicationId):L.list(item);return render.apply(this,arguments);};
})();
