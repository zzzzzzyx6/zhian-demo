(function(){
'use strict';
const A=window.App,C=A.connections,X=A.attack,E=A.escape;
const init=A.modules.attack.init;
A.modules.attack.init=function(){init();if(X.db.agentPresetsVersion)return;
for(const [id,name,provider,endpoint] of [['agent-dify','Dify 智能体','dify','https://api.dify.ai/v1/chat-messages'],['agent-coze','Coze 智能体','coze','https://api.coze.cn/v3/chat']])if(!C.db.some(m=>m.id===id))C.db.push({id,name,provider,vendor:name.replace(' 智能体',''),protocol:provider,kind:'agent',accessType:'api',model:'',endpoint,botId:'',userId:'security-demo',schema:2,sample:false,presetPending:true,auth:'bearer',caps:['text','chat'],uses:['target'],timeout:60});X.db.agentPresetsVersion=1;};
const status=C.status;C.status=m=>m.presetPending?'待配置':status(m);
const form=C.form;C.form=function(){const d=C.draft;if(!['dify','coze'].includes(d.provider))return form();
const f=(k,l,v,type='text')=>`<div class="field"><label for="c-${k}">${l}</label><input id="c-${k}" type="${type}" value="${E(v||'')}" autocomplete="off"></div>`;
A.modal('编辑智能体',f('name','连接名称 *',d.name)+f('endpoint','请求 URL *',d.endpoint)+(d.provider==='coze'?f('botId','Bot ID *',d.botId):'')+f('userId','调用用户标识 *',d.userId)+f('key',d.provider==='dify'?'应用 API Key *':'访问令牌 *',d.key,'password')+'<p id="connection-error" class="error-message"></p>',`<button class="btn" onclick="App.connections.cancel()">取消</button><button class="btn primary" onclick="App.connections.save()">保存配置</button>`);};
const capture=C.capture;C.capture=function(){capture();for(const k of ['botId','userId']){const el=document.getElementById('c-'+k);if(el)C.draft[k]=el.value;}};
const validate=C.validate;C.validate=function(d){if(!['dify','coze'].includes(d.provider))return validate(d);if(!d.name.trim()||!d.endpoint.trim()||!d.userId?.trim())return '请填写所有必填信息';if(d.provider==='coze'&&!d.botId?.trim())return '请填写 Bot ID';if(!d.key.trim()&&!C.secrets.has(d.id))return '请填写访问凭据';return '';};
const save=C.save;C.save=function(){const d=C.draft;if(!['dify','coze'].includes(d?.provider))return save();C.capture();const error=C.validate(d);if(error){document.getElementById('connection-error').textContent=error;return;}const m=C.db.find(m=>m.id===d.id);Object.assign(m,{name:d.name.trim(),endpoint:d.endpoint.trim(),botId:d.botId?.trim()||'',userId:d.userId.trim(),presetPending:false});if(d.key.trim())C.secrets.set(m.id,d.key.trim());A.save();A.closeModal();A.render();A.toast('配置已保存');};

})();
