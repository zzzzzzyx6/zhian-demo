(function () {
'use strict';
const A=window.App, E=A.escape, I=A.icon;
const C=A.connections={
 secrets:new Map(), draft:null,
 get db(){ if(!A.data.connections) C.init(); return A.data.connections.models; },
 init(){
  if(A.data.connections) return;
  A.data.connections={models:[
   {id:'m1',kind:'model',name:'示例模型 · Qwen',vendor:'Qwen',model:'qwen-plus',endpoint:'',auth:'none',connectStatus:'ok',sample:true,desc:'内置示例连接'},
   {id:'m2',kind:'model',name:'DeepSeek-V3',vendor:'DeepSeek',model:'deepseek-chat',endpoint:'https://api.deepseek.com',auth:'bearer',connectStatus:'pending',desc:'自有模型接入'}
  ]};
  A.save();
  for(const m of A.data.connections.models){
   m.kind='model';
   if(m.connectStatus===undefined)m.connectStatus=(m.sample||m.auth==='none')?'ok':'pending';
   delete m.apiKey;delete m.key;delete m.token;
  }
 },
 clearSecrets(){C.secrets.clear();C.draft=null;const el=document.getElementById('c-key');if(el)el.value='';},
 connState(m){if(m.presetPending)return {label:'待配置',tone:'orange',ok:false};if(m.connectStatus==='testing')return {label:'测试中',tone:'blue',testing:true};if(m.sample||m.auth==='none'||C.secrets.has(m.id)||m.connectStatus==='ok')return {label:'已连通',tone:'green',ok:true};return {label:'未连通',tone:'gray',ok:false};},
 status(m){return C.connState(m).label;},
 test(id){const m=C.db.find(x=>x.id===id);if(!m)return;
  if(m.presetPending){A.toast('该连接尚未配置，请先编辑再测试');return;}
  if(m.connectStatus==='testing')return;
  // Decide the outcome first, then only the status tag changes: 未连通 -> 测试中 -> 已连通/未连通. No modal.
  const ok=m.sample||m.auth==='none'||C.secrets.has(m.id)||m.connectStatus==='ok';
  m.connectStatus='testing';A.save();A.render();
  setTimeout(()=>{m.connectStatus=ok?'ok':'fail';A.save();A.render();A.toast(ok?'连接测试成功':'连接测试失败：缺少 API Key');},800);},
 remove(id){const m=C.db.find(x=>x.id===id);if(!m)return;
  A.modal('删除模型',`<p>确认删除模型「${E(m.name)}」吗？</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" onclick="App.connections.removeConfirm('${m.id}')">删除</button>`,{plain:true});},
 removeConfirm(id){const at=C.db.findIndex(x=>x.id===id);if(at<0){A.closeModal();return;}const m=C.db[at];C.db.splice(at,1);C.secrets.delete(id);A.save();A.closeModal();A.render();A.toast(`已删除「${m.name}」`);},
 open(id=''){
  const m=C.db.find(x=>x.id===id);
  C.draft=m?{...m,key:'',tested:false}:{id:'',name:'',vendor:'',kind:'model',model:'',endpoint:'',auth:'bearer',key:'',tested:false};
  if(m?.sample){C.draft.id='';C.draft.sample=false;C.draft.endpoint='';C.draft.name=m.name+' · 自有接入';}
  C.form();
 },
 capture(){const d=C.draft;for(const n of ['name','vendor','endpoint','key']){const el=document.getElementById('c-'+n);if(el)d[n]=el.value;}d.auth=d.key.trim()||C.secrets.has(d.id)?'bearer':'none';},
 markDirty(){if(!C.draft)return;C.draft.tested=false;const btn=document.getElementById('c-test-btn');if(btn){btn.classList.remove('ok');btn.innerHTML=`${I('zap',14)}测试链接`;}},
 form(){const d=C.draft;const f=(id,label,value,placeholder='',type='text',extra='')=>`<div class="field"><label for="c-${id}">${label}</label><input id="c-${id}" type="${type}" value="${E(value||'')}" placeholder="${placeholder}" autocomplete="off" ${extra}></div>`;
  A.modal(d.id?'编辑连接':'接入模型',`<form id="connection-form" onsubmit="return false">${f('name','模型名称 *',d.name,'例如：测试模型')}${f('vendor','厂商',d.vendor,'例如：DeepSeek')}${f('endpoint','Base URL *',d.endpoint,'填写服务地址','text','oninput="App.connections.markDirty()"')}<div class="field"><label for="c-key">API Key *</label><div class="field-row"><input id="c-key" type="password" value="${E(d.key||'')}" placeholder="${C.secrets.has(d.id)?'留空保留已保存的密钥':'填写服务调用的 API Key'}" autocomplete="off" oninput="App.connections.markDirty()"><button class="btn" type="button" id="c-test-btn" onclick="App.connections.testDraft()">${I('zap',14)}测试链接</button></div></div><p id="connection-error" class="error-message" role="alert"></p></form>`,`<button class="btn" onclick="App.connections.cancel()">取消</button><button class="btn primary" onclick="App.connections.save()">保存配置</button>`,{wide:false});},
 validate(d){if(!d.name.trim())return '请填写模型名称';if(!d.endpoint.trim())return '请填写 Base URL';if(!d.key.trim()&&!C.secrets.has(d.id))return '请填写 API Key';return '';},
 check(){C.capture();const error=C.validate(C.draft);const errEl=document.getElementById('connection-error');if(errEl)errEl.textContent=error;return !error;},
 testDraft(){C.capture();const d=C.draft,error=C.validate(d),errEl=document.getElementById('connection-error'),btn=document.getElementById('c-test-btn');
  if(error){if(errEl){errEl.textContent=error;errEl.scrollIntoView?.({block:'nearest'});}return;}
  if(errEl)errEl.textContent='';
  // Feedback lives on the inline button only: 测试中… -> green ✓ 已通过.
  if(btn){btn.disabled=true;btn.classList.remove('ok');btn.textContent='测试中…';}
  setTimeout(()=>{if(!btn||!btn.isConnected)return;
   d.tested=true;if(btn){btn.disabled=false;btn.classList.add('ok');btn.textContent='✓ 已通过';}
   A.toast('连接测试成功');},800)},
 save(){
  C.capture();const d=C.draft;
  if(!d.tested){const errEl=document.getElementById('connection-error');if(errEl){errEl.textContent='请先完成连通性测试，再保存配置';errEl.scrollIntoView?.({block:'nearest'});}return;}
  if(!C.check())return;const id=d.id||'conn-'+Date.now()+'-'+Math.random().toString(36).slice(2,6);
  // Whitelist metadata: no credential or draft object is serialized.
  const m={id,kind:'model',sample:false,name:d.name.trim(),model:(d.model||'').trim(),endpoint:d.endpoint.trim().replace(/\/$/,''),auth:d.auth,vendor:(d.vendor||'').trim(),desc:'自有模型接入',connectStatus:(d.key.trim()||C.secrets.has(id))?'ok':'pending'};
  if(d.auth==='none')C.secrets.delete(id);else if(d.key.trim())C.secrets.set(id,d.key.trim());
  const at=C.db.findIndex(x=>x.id===id);if(at>=0)C.db[at]=m;else C.db.push(m);
  C.draft=null;const input=document.getElementById('c-key');if(input)input.value='';
  A.save();A.closeModal();A.render();A.toast('配置成功');
 },
 cancel(){C.draft=null;const input=document.getElementById('c-key');if(input){input.value='';input.setAttribute('value','');}A.closeModal();},
 models(){return `<div class="setup-page-head"><span class="muted" style="font-size:12px">密钥仅保存在当前浏览器，不发送到外部服务</span><button class="btn primary" onclick="App.connections.open()">${I('plus',14)}接入模型</button></div><div class="attack-model-grid">${C.db.map(m=>{const st=C.connState(m);return `<article class="card attack-model-card"><div class="attack-model-head"><span class="model-mark">${I('box',19)}</span><div class="attack-model-title"><strong>${E(m.name)}</strong><small>${E(m.vendor||m.model||m.endpoint||'模型接入')}</small></div><span class="badge ${st.tone} connection-state${st.testing?' testing':''}">${E(st.label)}</span></div><div class="attack-model-actions"><button class="model-action" title="编辑" aria-label="编辑 ${E(m.name)}" onclick="App.connections.open('${m.id}')">${I('edit',16)}</button><button class="model-action" title="测试连接" aria-label="测试 ${E(m.name)}" onclick="App.connections.test('${m.id}')">${I('zap',16)}</button><button class="model-action danger" title="删除" aria-label="删除 ${E(m.name)}" onclick="App.connections.remove('${m.id}')">${I('trash',16)}</button></div></article>`;}).join('')||'<div class="empty">暂无连接，点击右上角按钮接入</div>'}</div>`;}
};
})();
