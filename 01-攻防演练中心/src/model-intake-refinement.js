/* Model inventory: one model identity, verified API intake, and independent platform roles. */
(function(){
'use strict';
const A=window.App,C=A.connections,M=A.modelRoles,L=A.leanAssets,X=A.attack,E=A.escape;
if(!C||!M||!L)return;
const N=A.modelIntake={pending:new Map(),timeoutMs:15000};
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString();
const normalized=v=>String(v||'').trim().replace(/\/+$/,'');
const title=m=>{const name=String(managed(m)?m?.model||m?.name||'':m?.name||m?.model||'').trim();return managed(m)?name.split('/').at(-1):name;};
const managed=m=>L.isManaged(m);
const apiMode=d=>d.probeProtocol==='embeddings'?'embeddings':'chat';
const keyFor=d=>d.auth==='none'?'':String(d.key||'').trim()||(C.hasSavedKey(d)?C.secrets.get(d.id):'')||'';
const config=d=>JSON.stringify([normalized(d.endpoint),String(d.model||'').trim(),d.auth==='none'?'none':'bearer',apiMode(d)]);
const storedCheck=m=>m?.connectionCheck?.mode==='network'&&m.connectionCheck.valid===true&&m.connectionCheck.configuration===config(m);
const preset=m=>m?.connectionCheck?.mode==='preset'&&m.connectionCheck.valid===true&&m.connectionCheck.configuration===config(m);
const fixtureSignatures={m1:['Qwen2.5-72B-Instruct','https://model.example/v1'], 'deepseek-v3':['deepseek-v3.2','https://api.deepseek.com'], 'deepseek-judge':['gpt-4o-mini','https://api.openai.com/v1']};
N.isUntouchedFixture=function(m){const signature=fixtureSignatures[m.id];return !!signature&&m.model===signature[0]&&normalized(m.endpoint)===signature[1]&&(m.configurationRevision||1)===1&&!m.updatedAt&&!m.configurationCheck&&!m.connectionCheck&&(m.sample===true||m.demoConfigured===true||m.id!=='m1'&&X.db.referenceModelsVersion===1&&m.auth==='none'&&m.connectStatus==='ok');};
const status=(text,tone='neutral')=>`<span class="la-state la-state-${tone}"><i></i>${E(text)}</span>`;
const fieldError=text=>{const node=document.getElementById('connection-error');if(node)node.textContent=text||'';};

N.normalize=function(){
 for(const m of C.db||[]){
  if((m.kind||'model')!=='model')continue;
  m.name ||= title(m);m.probeProtocol ||= M.get?.(m.id)?.outputProtocol==='embeddings'?'embeddings':'chat';
  // Existing fixed catalogue entries carry a local preset, never a network verification claim.
  if(N.isUntouchedFixture(m)){m.connectionCheck={mode:'preset',valid:true,configuration:config(m),externalVerified:false};m.connectStatus='ok';}
 }
};
const init=C.init;
C.init=function(){const result=init.apply(C,arguments);N.normalize();return result;};
const moduleInit=A.modules.attack.init;
A.modules.attack.init=function(){const result=moduleInit.apply(this,arguments);N.normalize();return result;};
const assetRows=L.rows;
L.rows=function(kind){const values=assetRows.call(L,kind);return kind==='models'?values.map(m=>managed(m)?{...m,name:title(m)}:m):values;};

C.hasSavedKey=function(d){const old=C.db.find(m=>m.id===d?.id);return !!old&&d.useSavedKey!==false&&C.secrets.has(d.id)&&old.auth!=='none'&&normalized(old.endpoint)===normalized(d.endpoint);};
C.connState=function(m){
 if(!m)return {label:'未连通',tone:'gray',ok:false};
 if(managed(m)){const service=Object.values(A.data.defenseServices||{}).find(s=>s.id===m.id)||m;const ok=A.leanOperations?.serviceReady?.(service)===true;return {label:ok?'已连通':'连接异常',tone:ok?'green':'orange',ok};}
 if(N.pending.has(m.id))return {label:'测试中',tone:'blue',ok:false,testing:true};
 if(['fail','failed','disconnected'].includes(m.connectStatus))return {label:'连接失败',tone:'orange',ok:false};
 if(preset(m))return {label:'已连通',tone:'green',ok:true,preset:true};
 if(storedCheck(m)){if(m.auth!=='none'&&!C.secrets.has(m.id))return {label:'待补充密钥',tone:'orange',ok:false};return {label:'已连通',tone:'green',ok:true};}
 return {label:'待测试',tone:'gray',ok:false};
};
M.connected=m=>!!C.connState(m).ok;
const roleValidate=M.validate;
M.validate=function(d){const issue=roleValidate.call(M,d);if(issue)return issue;const model=C.db.find(m=>m.id===d?.modelId);if(!model||managed(model))return '';return apiMode(model)==='embeddings'&&d.outputProtocol!=='embeddings'?'该模型已验证为向量接口，请选择 Embedding 模型与向量输出':apiMode(model)==='chat'&&d.outputProtocol==='embeddings'?'请先将连接改为向量接口并通过测试，再配置语义检索用途':'';};
L.connectionState=function(m){const s=C.connState(m);return status(s.label,s.ok?'ready':s.testing?'active':s.tone==='orange'?'attention':'neutral');};
const purposes=L.purposes;
L.purposes=function(m){return !managed(m)&&M.state(m)==='changed'?'<span class="mi-purpose-pending">待重新确认</span>':purposes.call(L,m);};
L.needsConfiguration=m=>!managed(m)&&!m._serviceType&&(!M.configured(m)||!M.get(m.id)?.roles?.length);
L.pendingModels=()=>L.rows('models').filter(L.needsConfiguration);
L.connect=function(id){const m=id&&L.rows('models').find(v=>v.id===id);if(m&&managed(m)){L.open('models',id);return;}L.connectionOrigin=true;X.connectionKind='model';C.open(id||'');};

N.abortDraft=function(){const d=C.draft;if(d?.testController)d.testController.abort();if(d){delete d.testController;delete d.testToken;d.testing=false;}};
N.abortRow=function(id){const request=N.pending.get(id);if(request){N.pending.delete(id);request.controller.abort();}};
C.open=function(id='',role='target',suggestion='',returnTo=null){
 const m=C.db.find(v=>v.id===id),asset=L.rows('models').find(v=>v.id===id);if(asset&&managed(asset)){L.open('models',id);return;}
 if(m&&(m.kind||'model')!=='model'||!id&&X.connectionKind==='agent'){A.toast('请在 AI应用 中管理 Agent 接入');A.platform.go('assets','applications');return;}
 N.abortDraft();if(id)N.abortRow(id);C.returnTo=returnTo;C.role=role;
 C.draft={...(m||{}),id:m?.id||'',name:title(m),model:title(m),endpoint:m?.endpoint||'',kind:'model',protocol:'openai',accessType:'api',auth:m?.auth==='none'?'none':'bearer',key:'',useSavedKey:true,probeProtocol:apiMode(m||{}),tested:false,testing:false};
 C.form();
};
C.capture=function(){const d=C.draft;if(!d)return;for(const key of ['model','endpoint','key','auth','probeProtocol']){const node=document.getElementById('c-'+key);if(node)d[key]=node.value;}d.name=String(d.model||'').trim();d.protocol='openai';};
C.validate=function(d){
 if(!String(d?.model||'').trim())return '请填写模型全称';
 if(String(d.model).trim().length>200||/[\r\n\t]/.test(d.model))return '模型名称需在 200 个字符以内，且不能包含换行';
 try{const url=new URL(String(d.endpoint||'').trim());if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw Error();}catch(e){return '请填写有效的 HTTP(S) API 地址，不含账号、查询参数或片段';}
 if(!['chat','embeddings'].includes(d.probeProtocol))return '请选择接口类型';
 if(d.auth!=='none'&&!keyFor(d))return '请填写 API Key';
 if(C.db.some(m=>m.id!==d.id&&String(m.model||'').trim()===String(d.model).trim()&&normalized(m.endpoint)===normalized(d.endpoint)))return '该服务已接入此模型，请编辑已有连接';
 return '';
};
C.validateComparison=d=>C.validate(d);
C.testFingerprint=d=>JSON.stringify([config(d),keyFor(d)]);
C.markDirty=function(){const d=C.draft;if(!d)return;N.abortDraft();d.tested=false;delete d.testFingerprint;delete d.testResult;fieldError('');C.renderAccessTest();};
C.syncAuth=function(){const d=C.draft,row=document.getElementById('c-key-field'),input=document.getElementById('c-key');if(!d||!row||!input)return;row.hidden=d.auth==='none';input.disabled=d.auth==='none';input.required=d.auth!=='none'&&!C.hasSavedKey(d);input.placeholder=C.hasSavedKey(d)?'留空使用本次会话密钥':'填写 API Key';};
C.accessInput=C.accessChange=C.identityInput=function(){C.capture();C.markDirty();C.syncAuth();};
C.accessTestHTML=function(d){return d.testing?'<p class="mi-test-state" role="status">正在验证 API 响应…</p>':d.tested?'<p class="mi-test-state success" role="status">连接成功</p>':'';};
C.renderAccessTest=function(){const d=C.draft;if(!d)return;const btn=document.getElementById('c-test-btn'),steps=document.getElementById('connection-test-steps'),save=document.getElementById('c-save-btn');if(btn){btn.disabled=!!d.testing;btn.classList.toggle('ok',!!d.tested);btn.innerHTML=d.testing?'测试中…':d.tested?'✓ 连接成功':A.icon('zap',14)+'测试连接';}if(steps)steps.innerHTML=C.accessTestHTML(d);if(save)save.disabled=!d.tested||!!d.testing;};
C.form=function(){
 const d=C.draft;if(!d)return;
 A.modal(d.id?'编辑模型':'接入模型',`<form id="connection-form" class="mi-intake-form" onsubmit="return false"><div class="field"><label for="c-model">模型名称 *</label><input id="c-model" maxlength="200" autocomplete="off" required value="${E(d.model)}" placeholder="填写服务中的模型全称，如 Qwen2.5-72B-Instruct" oninput="App.connections.accessInput()"><p class="hint">该名称将作为 API 请求的 model 参数。</p></div><div class="field"><label for="c-endpoint">API 地址 *</label><input id="c-endpoint" type="url" autocomplete="off" required value="${E(d.endpoint)}" placeholder="https://api.example.com/v1" oninput="App.connections.accessInput()"></div><div class="form-grid"><div class="field"><label for="c-probeProtocol">接口类型</label><select id="c-probeProtocol" onchange="App.connections.accessChange()"><option value="chat" ${apiMode(d)==='chat'?'selected':''}>OpenAI 兼容对话接口</option><option value="embeddings" ${apiMode(d)==='embeddings'?'selected':''}>OpenAI 兼容向量接口</option></select></div><div class="field"><label for="c-auth">鉴权方式</label><select id="c-auth" onchange="App.connections.accessChange()"><option value="bearer" ${d.auth!=='none'?'selected':''}>API Key</option><option value="none" ${d.auth==='none'?'selected':''}>无需 API Key</option></select></div></div><div class="field" id="c-key-field" ${d.auth==='none'?'hidden':''}><label for="c-key">API Key *</label><input id="c-key" type="password" autocomplete="off" value="" ${d.auth==='none'?'disabled':''} placeholder="${C.hasSavedKey(d)?'留空使用本次会话密钥':'填写 API Key'}" oninput="App.connections.accessInput()"></div><p class="mi-test-note">测试会向该地址发送一次最小请求。API Key 仅在本次页面会话中使用。</p><div id="connection-test-steps" aria-live="polite">${C.accessTestHTML(d)}</div><p id="connection-error" class="error-message" role="alert"></p></form>`,`<button class="btn compact-test-button" id="c-test-btn" type="button" onclick="App.connections.testDraft()">${A.icon('zap',14)}测试连接</button><button class="btn" onclick="App.connections.cancel()">取消</button><button class="btn primary" id="c-save-btn" ${d.tested?'':'disabled'} onclick="App.connections.save()">${d.id?'保存修改':'接入模型'}</button>`);
 C.syncAuth();C.renderAccessTest();
};
N.probe=async function(d,controller){
 const embedding=apiMode(d)==='embeddings',path=embedding?'embeddings':'chat/completions',base=normalized(d.endpoint),url=base.endsWith('/'+path)?base:base+'/'+path;
 const headers={'Content-Type':'application/json'},secret=keyFor(d);if(d.auth!=='none')headers.Authorization='Bearer '+secret;
 const body=embedding?{model:String(d.model).trim(),input:'connection test'}:{model:String(d.model).trim(),messages:[{role:'user',content:'Hi'}],max_tokens:1,stream:false};
 let timedOut=false;const timer=setTimeout(()=>{timedOut=true;controller.abort();},N.timeoutMs);
 try{
  const response=await fetch(url,{method:'POST',mode:'cors',credentials:'omit',redirect:'error',cache:'no-store',referrerPolicy:'no-referrer',headers,body:JSON.stringify(body),signal:controller.signal});
  if(!response.ok){const messages={401:'API Key 无效或已过期',403:'该凭据没有访问此模型的权限',404:'未找到接口或模型，请检查 API 地址与模型名称',429:'服务限流或调用额度不足'};return {ok:false,error:messages[response.status]||`服务返回 HTTP ${response.status}，请检查服务状态`};}
  let payload;try{payload=await response.json();}catch(e){return {ok:false,error:'服务返回的内容不是有效 JSON'};}
  const msg=payload?.choices?.[0]?.message,valid=embedding?Array.isArray(payload?.data?.[0]?.embedding)&&payload.data[0].embedding.length>0&&payload.data[0].embedding.every(Number.isFinite):!!msg&&(typeof msg.content==='string'||typeof msg.refusal==='string'||Array.isArray(msg.tool_calls));
  if(!valid||payload?.error)return {ok:false,error:embedding?'服务未返回有效向量，请确认接口类型':'服务未返回有效对话响应，请确认接口类型'};
  return {ok:true,checkedAt:now(),configuration:config(d),mode:'network',externalVerified:true};
 }catch(error){return {ok:false,cancelled:controller.signal.aborted&&!timedOut,error:timedOut?'连接测试超时，请检查服务响应速度':controller.signal.aborted?'连接测试已取消':'无法连接服务，请检查地址、网络或服务的 CORS 跨域配置'};}
 finally{clearTimeout(timer);}
};
C.testDraft=async function(){
 C.capture();const d=C.draft;if(!d)return false;C.markDirty();const issue=C.validate(d);fieldError(issue);if(issue)return false;
 const fingerprint=C.testFingerprint(d),controller=new AbortController(),token={};d.testing=true;d.testController=controller;d.testToken=token;C.renderAccessTest();
 const result=await N.probe({...d},controller);
 if(C.draft!==d||d.testToken!==token||controller.signal.aborted&&result.cancelled||fingerprint!==C.testFingerprint(d))return false;
 delete d.testController;delete d.testToken;d.testing=false;d.tested=result.ok===true;d.testResult=result;if(d.tested)d.testFingerprint=fingerprint;else delete d.testFingerprint;
 fieldError(result.ok?'':result.error);C.renderAccessTest();return result.ok;
};
C.save=function(){
 C.capture();const d=C.draft;if(!d)return false;const error=C.validate(d)||(!d.tested||d.testResult?.mode!=='network'||!d.testResult.ok||d.testFingerprint!==C.testFingerprint(d)?'请先测试当前配置，连接成功后再保存':'');if(error){fieldError(error);return false;}
 const old=C.db.find(m=>m.id===d.id),id=old?.id||'conn-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),changed=old&&(config(old)!==config(d)||keyFor(d)!==(C.secrets.get(id)||''));
 if(old)for(const task of arr(X.db.tasks))if(task.model===old.id&&!task.targetSnapshot)task.targetSnapshot=copy(X.connectionSnapshot(old));
 const record={id,name:String(d.model).trim(),model:String(d.model).trim(),kind:'model',accessType:'api',schema:3,seriesSchema:4,protocol:'openai',probeProtocol:apiMode(d),auth:d.auth==='none'?'none':'bearer',endpoint:normalized(d.endpoint),hosting:/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?=[:/]|$)/i.test(d.endpoint)?'local':'cloud',sample:false,presetPending:false,connectStatus:'ok',caps:apiMode(d)==='embeddings'?['embeddings']:['text','chat'],uses:[],timeout:60,configurationRevision:(old?.configurationRevision||1)+(changed?1:0),connectionCheck:{mode:'network',valid:true,checkedAt:d.testResult.checkedAt,configuration:config(d),externalVerified:true},updatedAt:now()};
 if(record.auth==='none')C.secrets.delete(id);else C.secrets.set(id,keyFor(d));
 if(old){Object.assign(old,record);delete old.simulated;delete old.demoConfigured;delete old.configurationCheck;delete old.apiKey;delete old.key;delete old.token;}else C.db.push(record);
 M.init();if(apiMode(d)==='embeddings'&&!M.get(id)?.confirmed)Object.assign(A.data.modelRoleAssignments[id],{type:'embedding',outputProtocol:'embeddings'});
 const returnTo=C.returnTo,role=C.role;C.draft=null;L.connectionOrigin=false;const input=document.getElementById('c-key');if(input)input.value='';A.save();A.closeModal();
 if(returnTo==='wizard'&&X.wizard){X.wizard[role==='target'?'model':role]=id;X.wizardModal();}else if(returnTo==='settings'&&X.settingsDraft){X.settingsDraft[role]=id;X.tab='settings';A.render();}else{A.platform.go('assets','models');}
 A.toast(old?(changed?'连接已更新，请到平台管理 → 模型配置重新确认用途':'模型连接已更新'):'模型已接入，请到平台管理 → 模型配置分配用途');return record;
};
C.test=async function(id){
 const m=C.db.find(v=>v.id===id);if(!m)return false;if(managed(m)){A.toast('内置模型由平台维护');return false;}if(N.pending.has(id))return false;
 const d={...m,key:'',useSavedKey:true,probeProtocol:apiMode(m)},issue=C.validate(d);if(issue){L.connect(id);fieldError(issue);return false;}
 const controller=new AbortController(),request={controller,fingerprint:C.testFingerprint(d)};N.pending.set(id,request);A.render();const result=await N.probe(d,controller);
 if(N.pending.get(id)!==request||!C.db.includes(m)||request.fingerprint!==C.testFingerprint({...m,key:'',useSavedKey:true}))return false;
 N.pending.delete(id);if(result.cancelled){A.render();return false;}m.connectStatus=result.ok?'ok':'fail';m.connectionCheck={mode:'network',valid:result.ok===true,checkedAt:result.checkedAt||now(),configuration:config(m),externalVerified:result.ok===true};
 A.save();A.render();A.toast(result.ok?'连接测试成功':result.error);return result.ok;
};
const closeModal=A.closeModal;
A.closeModal=function(){if(C.draft){N.abortDraft();C.draft.key='';C.draft=null;const node=document.getElementById('c-key');if(node)node.value='';}return closeModal.apply(A,arguments);};
C.cancel=function(){const returnTo=C.returnTo;A.closeModal();if(returnTo==='wizard'&&X.wizard)X.wizardModal();};
const clearSecrets=C.clearSecrets;
C.clearSecrets=function(){N.abortDraft();for(const id of N.pending.keys())N.abortRow(id);return clearSecrets.apply(C,arguments);};

N.references=function(t,id){return [t.model,t.targetSnapshot?.id,t.config?.modelSnapshot?.id,t.defense?.model?.id,t.policySnapshot?.attacker?.id,t.policySnapshot?.judgement?.modelId,t.policySnapshot?.judgement?.model?.id,...Object.values(t.engine?.roles||{}).map(v=>v?.id),...arr(t.engine?.bindings).flatMap(v=>[v.generator,v.judge])].includes(id);};
N.blockers=id=>[...arr(X.db?.tasks),...arr(A.scanProduct?.db?.tasks)].filter(t=>!t.deletedAt&&['running','pending','queued','paused','stopping'].includes(t.status)&&N.references(t,id));
C.remove=function(id){const m=C.db.find(v=>v.id===id);if(!m)return false;if(managed(m)){A.toast('平台内置模型不可删除');return false;}const busy=N.blockers(id);if(busy.length){A.toast('该模型正被未完成任务使用，请先结束相关任务');return false;}A.modal('删除模型',`<p>删除「${E(title(m))}」？</p><p class="hint">应用关联与平台用途将同步移除，历史任务和报告继续保留。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="entry-delete" data-id="${E(id)}" onclick="App.connections.removeConfirm(this.dataset.id)" aria-label="删除" title="删除" type="button">${A.icon('trash',16)}</button>`,{plain:true});return true;};
C.removeConfirm=function(id){
 const m=C.db.find(v=>v.id===id);if(!m||managed(m))return false;if(N.blockers(id).length){A.closeModal();A.toast('该模型正被未完成任务使用，暂时无法删除');return false;}
 // Retain immutable identity for older completed records that predate snapshots.
 for(const t of arr(X.db.tasks))if(t.model===id&&!t.targetSnapshot)t.targetSnapshot=copy(X.connectionSnapshot(m));
 N.abortRow(id);C.db.splice(C.db.indexOf(m),1);C.secrets.delete(id);delete A.data.modelRoleAssignments?.[id];A.data.applicationAssetLinks=arr(A.data.applicationAssetLinks).filter(r=>r.assetKey!=='models:'+id);
 for(const role of ['attacker','judge','process'])if(X.db.defaults?.[role]===id)X.db.defaults[role]='';
 A.save();A.closeModal();A.render();A.toast('模型已删除');return true;
};
N.filter={state:'',query:''};
N.filterBy=function(key,value){if(!Object.hasOwn(N.filter,key))return;N.filter[key]=value;A.render();};
M.render=function(){
 const f=N.filter,q=String(f.query||'').trim().toLowerCase(),items=L.rows('models').filter(m=>!managed(m)).filter(m=>{const state=C.connState(m);return (!q||title(m).toLowerCase().includes(q))&&(!f.state||(f.state==='connected'?state.ok:!state.ok));});
 const button=(m,action,label,icon,extra='')=>`<button class="mi-icon-action" title="${label}" aria-label="${label} ${E(title(m))}" data-id="${E(m.id)}" ${extra} onclick="${action==='connect'?'App.leanAssets':'App.connections'}.${action}(this.dataset.id)">${E(label)}</button>`;
 const body=items.map(m=>`<tr><td><button class="la-name mi-model-name" data-id="${E(m.id)}" onclick="App.leanAssets.open('models',this.dataset.id)"><strong>${E(title(m))}</strong></button></td><td>${managed(m)?'<span class="la-source-tag">系统</span>':'API 接入'}</td><td>${L.connectionState(m)}</td><td><div class="mi-model-actions">${managed(m)?'<span class="muted mi-managed">平台维护</span>':button(m,'connect','编辑','edit')+button(m,'test','测试连接','zap',N.pending.has(m.id)?'disabled':'')+A.entryManagement.button('models',m.id)}</div></td></tr>`).join('');
 return `<div class="la-page la-management mi-model-inventory">${A.heading('','模型','',`<button class="btn primary" onclick="App.leanAssets.connect()">${A.icon('plus',14)}接入模型</button><button class="btn" onclick="App.platform.go('management','model-roles')">配置模型用途</button>`)}<section class="card la-inventory"><div class="la-list-toolbar"><div class="la-management-filters"><select aria-label="连接状态筛选" onchange="App.modelIntake.filterBy('state',this.value)"><option value="">全部连接状态</option>${[['connected','已连通'],['disconnected','未连通']].map(([value,label])=>`<option value="${value}" ${f.state===value?'selected':''}>${label}</option>`).join('')}</select></div><label class="la-search">${A.icon('search',16)}<input type="search" aria-label="搜索模型名称" placeholder="搜索模型名称" value="${E(f.query||'')}" onchange="App.modelIntake.filterBy('query',this.value)"></label></div><div class="table-wrap"><table><thead><tr><th>模型名称</th><th>接入方式</th><th>连接状态</th><th>操作</th></tr></thead><tbody>${body||'<tr><td colspan="4" class="empty">暂无匹配模型</td></tr>'}</tbody></table></div></section></div>`;
};
X.guardConnectionHint='请在资产中心 → 模型查看护栏服务。';
})();
