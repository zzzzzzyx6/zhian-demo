/* Application-centric protection: reusable knowledge, trace filters and integration. */
(function(){
'use strict';
const A=window.App,C=A.contentProduct,S=A.contentSafety,G=A.guardrail,O=A.protectionOps,D=A.defensePolicies,F=A.defenseConfigurations,R=A.safetyRules,P=A.platform,E=A.escape;
const copy=v=>JSON.parse(JSON.stringify(v)),arr=v=>Array.isArray(v)?v:[];
const K=A.protectionMvp={tab:'words',query:'',advanced:false,appId:'',testResult:null};
P.menus.protection.push(['integration','接入指南','link']);
K.changeTab=function(tab){K.tab=tab;K.query='';A.render();};
K.wordReferences=id=>F.rows().filter(p=>p.rules.some(r=>r.ruleId===id));
K.replyReferences=id=>F.rows().filter(p=>p.replyTemplateId===id);
K.knowledge=function(){const words=K.tab==='words',query=K.query.trim().toLowerCase(),rows=(words?R.db.filter(r=>r.type==='word'):A.data.guardReplyTemplates).filter(r=>r.name.toLowerCase().includes(query));
 return A.heading('','知识库','词库定义命中内容，代答定义阻断后的安全回复，由防护策略统一引用。',`<button class="btn primary" onclick="App.protectionMvp.${words?'wordEdit()':'replyEdit()'}">＋ 新建${words?'词库':'代答'}</button>`)+`<div class="tabs dp-tabs"><button class="tab ${words?'active':''}" onclick="App.protectionMvp.changeTab('words')">词库</button><button class="tab ${words?'':'active'}" onclick="App.protectionMvp.changeTab('replies')">代答库</button></div><section class="card"><div class="toolbar"><input type="search" aria-label="搜索知识库" placeholder="搜索${words?'词库':'代答'}名称" value="${E(K.query)}" onchange="App.protectionMvp.query=this.value;App.render()"><button class="link-btn" onclick="App.platform.go('policy','defense','configurations')">配置防护策略 →</button></div><div class="table-wrap"><table><thead><tr><th>${words?'词库名称':'代答名称'}</th><th>${words?'词条数量':'代答内容'}</th><th>引用策略</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="link-btn" data-id="${E(r.id)}" onclick="App.protectionMvp.${words?'wordDetail':'replyDetail'}(this.dataset.id)">${E(r.name)}</button></td><td class="pm-knowledge-text">${words?arr(r.words).length:E(r.text)}</td><td>${(words?K.wordReferences(r.id):K.replyReferences(r.id)).map(p=>`<button class="link-btn" data-id="${E(p.id)}" onclick="App.defenseConfigurations.detail(this.dataset.id)">${E(p.name)}</button>`).join('、')||'未引用'}</td><td>${A.badge(r.enabled?'可用':'停用',r.enabled?'green':'gray')}</td><td><div class="lo-actions"><button class="link-btn" data-id="${E(r.id)}" onclick="App.protectionMvp.${words?'wordEdit':'replyEdit'}(this.dataset.id)">编辑</button>${A.entryManagement.button(words?'safety-rule':'reply',r.id)}</div></td></tr>`).join('')||'<tr><td colspan="5" class="empty">暂无匹配内容</td></tr>'}</tbody></table></div></section>`;
};
K.wordDetail=id=>R.detail(id);
K.replyDetail=function(id){const t=A.data.guardReplyTemplates.find(r=>r.id===id);if(t)A.drawer(E(t.name),`<div class="gr-config"><h3>安全回复</h3><p>${E(t.text)}</p><p class="hint">仅在阻断时替换原内容，不调用生成模型。历史检测记录保留当时使用的代答内容。</p></div>`,'<button class="btn" onclick="App.closeDrawer()">关闭</button>');};
K.replyEdit=id=>D.replyEdit(id);
K.wordEdit=function(id){const r=R.get(id);K.wordDraft=r?copy(r):{name:'',type:'word',purpose:'custom',risk:'Unsafe',enabled:true,description:'',words:[],matchMode:'contains',caseSensitive:false};K.wordForm();};
K.wordForm=function(){const d=K.wordDraft;A.modal(d.id?'编辑词库':'新建词库',`<div class="field"><label for="pm-word-name">词库名称 *</label><input id="pm-word-name" maxlength="80" value="${E(d.name)}" oninput="App.protectionMvp.wordDraft.name=this.value"></div><div class="field"><label for="pm-words">词条 *</label><textarea id="pm-words" rows="7" placeholder="每行一条，任一词条命中即触发" oninput="App.protectionMvp.wordDraft.words=this.value.split(/\\r?\\n/)">${E(d.words.join('\n'))}</textarea><label>导入 UTF-8 文本文件<input type="file" accept=".txt" aria-label="导入词条文件" onchange="App.protectionMvp.importWords(this)"></label></div><div class="form-grid"><div class="field"><label>匹配方式</label><select aria-label="词库匹配方式" onchange="App.protectionMvp.wordDraft.matchMode=this.value">${Object.entries({contains:'包含匹配',exact:'全文精确匹配',prefix:'前缀匹配',suffix:'后缀匹配'}).map(([id,label])=>`<option value="${id}" ${d.matchMode===id?'selected':''}>${label}</option>`).join('')}</select></div><label class="cs-checkbox"><input type="checkbox" ${d.caseSensitive?'checked':''} onchange="App.protectionMvp.wordDraft.caseSensitive=this.checked">区分大小写</label></div><p class="hint">最多 200 条，每条 200 字以内。词库无需 Embedding；语义近似检测在规则库配置，需向量模型。</p><p id="pm-word-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.protectionMvp.saveWords()">保存词库</button>`);};
K.importWords=async function(input){const file=input.files?.[0],draft=K.wordDraft;if(!file)return;try{if(!/\.txt$/i.test(file.name)||file.size>200000)throw new Error('请选择小于 200 KB 的 UTF-8 TXT 文件');const text=await file.text();if(text.includes('\ufffd'))throw new Error('文件编码无效，请保存为 UTF-8');if(K.wordDraft!==draft)return;draft.words=[...new Set([...draft.words,...text.replace(/^\ufeff/,'').split(/\r?\n/)].map(s=>s.trim()).filter(Boolean))];K.wordForm();}catch(e){document.getElementById('pm-word-error').textContent=e.message;}};
K.saveWords=function(){const error=R.validate(K.wordDraft);if(error){document.getElementById('pm-word-error').textContent=error;return false;}const r=R.save(K.wordDraft);if(r){A.closeModal();A.render();}return r;};
const snapshot=F.snapshot;
F.snapshot=function(d,version){const s=snapshot.call(F,d,version),reply=A.data.guardReplyTemplates.find(r=>r.id===d.replyTemplateId&&r.enabled);s.replyTemplateSnapshot=reply?copy(reply):null;if(reply)s.replyText=reply.text;return s;};
const validate=F.validate;
F.validate=function(d){const e=validate.call(F,d);return e||d.replyTemplateId&&!A.data.guardReplyTemplates.some(r=>r.id===d.replyTemplateId&&r.enabled)?e||'请选择可用的代答，或改用默认安全提示':'';};
K.replyPicker=function(d){return `<div class="field"><label for="dc-reply-template">阻断代答</label><select id="dc-reply-template" onchange="App.defenseConfigurations.draft.replyTemplateId=this.value;App.defenseConfigurations.form()"><option value="">${d.replyText?'使用本策略安全提示':'使用默认安全提示'}</option>${A.data.guardReplyTemplates.filter(r=>r.enabled||r.id===d.replyTemplateId).map(r=>`<option value="${E(r.id)}" ${d.replyTemplateId===r.id?'selected':''}>${E(r.name)}${r.enabled?'':'（已停用）'}</option>`).join('')}</select>${d.replyTemplateId?`<p class="pm-reply-preview">${E(A.data.guardReplyTemplates.find(r=>r.id===d.replyTemplateId)?.text||'代答已删除，请重新选择')}</p>`:''}<button type="button" class="link-btn" onclick="App.closeModal();App.platform.go('protection','knowledge','replies')">管理代答库 →</button></div>`;};
// Preserve historical reply snapshots; removal checks current references only.
const issue=A.entryManagement.issue;
A.entryManagement.issue=function(kind,id){return kind==='reply'&&K.replyReferences(id).length?'该代答仍被策略配置引用，请先更换策略中的代答':issue.apply(this,arguments);};
const replySave=D.replySave;
D.replySave=function(value){const d=value||D.replyDraft;if(d&&!d.enabled&&K.replyReferences(d.id).length){if(!value)document.getElementById('dp-reply-error').textContent='该代答仍被策略配置引用，请先更换';return {error:'代答仍被策略配置引用'};}return replySave.apply(D,arguments);};
const rows=S.filteredRequests;
S.filteredRequests=function(){const q=String(S.filter.query||'').trim().toLowerCase(),old=S.filter.query;S.filter.query='';let result;try{result=rows.call(S);}finally{S.filter.query=old;}return result.filter(r=>!q||[r.id,r.text,r.content,r.imageRef].join(' ').toLowerCase().includes(q));};
K.filter=function(key,value){S.filter[key]=value;O.recordPage=1;A.render();};
K.resetFilters=function(){S.filter={app:'',session:'',stage:'',type:'',action:'',query:'',result:'',review:'',dimension:''};O.recordPage=1;A.render();};
K.advancedCount=()=>['session','type','review'].filter(key=>S.filter[key]).length;
const records=C.records;
C.records=function(){let html=records.call(C);html=html.replace('placeholder="内容或请求 ID"','placeholder="内容 / 请求 ID / Trace ID"').replace('aria-label="内容或请求 ID"','aria-label="内容或请求 ID 或 Trace ID"');const start=html.indexOf('<select aria-label="全部防护轮次"');if(start>=0){const end=html.indexOf('</select>',start)+9,session=html.slice(start,end);html=html.slice(0,start)+html.slice(end);const extras=[session];for(const label of ['全部内容','全部复核']){const a=html.indexOf('<select aria-label="'+label+'"');if(a>=0){const z=html.indexOf('</select>',a)+9;extras.push(html.slice(a,z));html=html.slice(0,a)+html.slice(z);}}const position=html.indexOf('</div><div class="table-wrap">');if(position>=0)html=html.slice(0,position)+`<button class="link-btn" onclick="App.protectionMvp.advanced=!App.protectionMvp.advanced;App.render()">${K.advanced?'收起':'高级筛选'}${K.advancedCount()?'（已选 '+K.advancedCount()+' 项）':''}</button><button class="link-btn" onclick="App.protectionMvp.resetFilters()">重置</button></div><div class="toolbar pm-advanced" ${K.advanced?'':'hidden'}>${extras.join('')}`+html.slice(position);}
 return html;
};
const overview=C.overview;
C.overview=function(){return overview.call(C).replace('<div class="pr-metrics">','<div class="pm-quick-start"><span>① 接入应用</span><span>② 绑定策略</span><span>③ API / SDK 同步审核</span><span>④ 记录与报告</span><button class="link-btn" onclick="App.platform.go(\'protection\',\'integration\')">接入指南 →</button></div><div class="pr-metrics">');};
C.applications=C.overview;S.overview=C.overview;
K.integration=function(){const id=S.apps.some(a=>a.id===K.appId)?K.appId:S.apps[0]?.id||'<APP_ID>';return A.heading('','接入指南','在应用服务端调用护栏，输入通过后再执行业务，输出通过后再返回用户。')+`<section class="card pm-guide"><div class="toolbar"><select aria-label="接入应用" onchange="App.protectionMvp.appId=this.value;App.render()">${S.apps.map(a=>`<option value="${E(a.id)}" ${a.id===id?'selected':''}>${E(a.name)}</option>`).join('')}</select><button class="btn" data-id="${E(id)}" onclick="App.protectionOps.config(this.dataset.id)">绑定防护策略</button></div><div class="card-body"><ol class="pm-steps"><li><strong>登记应用与绑定策略</strong><p>选择基础检测维度、词库规则与阻断代答；一个应用绑定一项防护策略。</p></li><li><strong>服务端接入 API / SDK</strong><p>私有部署使用企业内网 Guard 地址与服务端应用凭据；密钥不写入网页或客户端。</p></li><li><strong>同步执行防护</strong><p>输入 → 输入审核 → 模型调用 → 缓冲完整输出 → 输出审核 → 交付。block 时丢弃原内容，返回代答。</p></li><li><strong>记录执行结果</strong><p>输入与输出使用同一个 Trace ID，分别保存检测 Request ID。回传实际处置，关闭防护轮次后生成报告。</p></li></ol><div class="tabs dp-tabs"><button class="tab ${!K.guideTab||K.guideTab==='api'?'active':''}" onclick="App.protectionMvp.guideTab='api';App.render()">HTTP API</button><button class="tab ${K.guideTab==='sdk'?'active':''}" onclick="App.protectionMvp.guideTab='sdk';App.render()">Python SDK</button><button class="tab ${K.guideTab==='test'?'active':''}" onclick="App.protectionMvp.guideTab='test';App.render()">规则验证</button></div>${K.guideTab==='test'?K.testHTML():K.guideTab==='sdk'?`<p>轻量客户端负责调用、解析与先审后发。接入自己的 Guard 服务后使用，不依赖云厂商 SDK。</p><pre class="code-block">${E(K.pythonExample(id))}</pre><button class="btn" onclick="App.protectionMvp.downloadSdk()">下载 guard_client.py</button>`:`<h3>请求</h3><pre class="code-block">${E('POST /v1/guardrails/check\nAuthorization: Bearer <APPLICATION_TOKEN>\nContent-Type: application/json\n\n'+JSON.stringify({app_id:id,trace_id:'trace-001',stage:'output',content:'尚未交付的模型回答',context:[{role:'user',content:'本轮用户输入'}]},null,2))}</pre><h3>响应</h3><pre class="code-block">${E(JSON.stringify({request_id:'check-001',trace_id:'trace-001',action:'block',verdict:'Unsafe',reply:'当前请求无法处理，请调整内容后重试。',configuration:{id:'策略 ID'},hits:[{type:'word',name:'业务敏感词',evidence:['命中词']}],duration_ms:86},null,2))}</pre><h3>执行回执</h3><pre class="code-block">${E('POST /v1/guardrails/ack\n'+JSON.stringify({app_id:id,request_id:'check-001',trace_id:'trace-001',effective_action:'block'},null,2))}</pre>`}<div class="pm-boundary"><h3>当前范围</h3><p>接口为自研后端的接入约定，当前静态页面不会启动网络服务；SDK 需要配套服务地址。规则验证实际执行本地词库与有限正则，不冒充 Guard 或 Embedding 模型结果。</p><p>首期采用完整文本同步审核；流式内容先缓冲。Agent 工具调用必须在工具执行前另做权限与参数校验，输出审核不能撤回已发生的操作。默认服务异常时阻断，异常不计入安全。</p></div></div></section>`;};
K.testHTML=function(){const options=F.rows(),d=K.testDraft||={configurationId:options[0]?.id||'',stage:'input',text:''};return `<div class="form-grid"><div class="field"><label>防护策略</label><select aria-label="验证策略" onchange="App.protectionMvp.testDraft.configurationId=this.value">${options.map(p=>`<option value="${E(p.id)}" ${d.configurationId===p.id?'selected':''}>${E(p.name)}</option>`).join('')}</select></div><div class="field"><label>审核位置</label><select aria-label="验证位置" onchange="App.protectionMvp.testDraft.stage=this.value"><option value="input" ${d.stage==='input'?'selected':''}>输入</option><option value="output" ${d.stage==='output'?'selected':''}>输出</option></select></div></div><div class="field"><label for="pm-test-text">待测文本</label><textarea id="pm-test-text" rows="4" maxlength="4096" oninput="App.protectionMvp.testDraft.text=this.value">${E(d.text)}</textarea></div><button class="btn primary" onclick="App.protectionMvp.testRules()">验证规则</button><p class="hint">使用已发布规则快照；不会生成业务流量或改变应用防护状态。</p>${K.testResult?`<pre class="code-block" role="status">${E(K.testResult)}</pre>`:''}`;};
K.testRules=function(){const d=K.testDraft,p=d&&F.latest(d.configurationId);if(!p)return;const rules=p.rules.filter(r=>r.stage==='both'||r.stage===d.stage).map(r=>({...r.snapshot,risk:r.risk})),result=R.match(d.text,rules);K.testResult=JSON.stringify({规则命中:result.hits.map(h=>({名称:h.name,证据:h.evidence})),规则执行完成:result.complete,规则判定:result.risk,未执行项:[...p.basics.filter(b=>b.stage==='both'||b.stage===d.stage).map(b=>b.snapshot.name+'（需后端模型服务）'),...result.results.filter(r=>r.status==='not-run'||r.status==='invalid').map(r=>r.name+'：'+r.reason)],说明:rules.length?'此结果只覆盖本地规则，不是完整护栏判定。':'该策略未选用此位置的词库或正则规则。'},null,2);A.render();return result;};
K.pythonExample=id=>`import os\nfrom guard_client import GuardClient\n\nguard = GuardClient(os.environ['GUARD_URL'],\n                    os.environ['GUARD_TOKEN'], '${id}')\n\n# call_model 必须返回完整文本，禁止先流式交付\nanswer = guard.protect(user_input, call_model, trace_id='trace-001')\nreturn_to_user(answer)`;
K.sdk=`"""Synchronous application-side client for the platform Guard API contract."""
import json
import urllib.request
import uuid

class GuardClient:
    def __init__(self, base_url, token, app_id, timeout=5):
        self.url = base_url.rstrip('/')
        self.token, self.app_id, self.timeout = token, app_id, timeout

    def _post(self, path, payload):
        body = json.dumps(dict(payload, app_id=self.app_id), ensure_ascii=False).encode('utf-8')
        req = urllib.request.Request(self.url + path, data=body, method='POST', headers={
            'Authorization': 'Bearer ' + self.token, 'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=self.timeout) as response:
            return json.loads(response.read())

    def check(self, content, stage, trace_id, context=None):
        try:
            if not isinstance(content, str) or stage not in ('input', 'output') or not trace_id:
                raise ValueError('Invalid guard request')
            data = self._post('/v1/guardrails/check', dict(content=content, stage=stage,
                              trace_id=trace_id, context=context or []))
            if data.get('action') not in ('allow', 'log', 'block') or not isinstance(data.get('request_id'), str) or not data['request_id']:
                raise ValueError('Invalid guard response')
            if data.get('trace_id') != trace_id or not isinstance(data.get('reply', ''), str):
                raise ValueError('Mismatched or malformed guard response')
            if data.get('verdict') not in ('Safe', 'Controversial', 'Unsafe'):
                raise ValueError('Missing verdict')
            return data
        except Exception:
            # Fail closed. No fabricated request ID or successful detector result.
            return dict(action='block', verdict='Unknown', request_id=None,
                        reply='安全检测暂不可用，请稍后重试。')

    def ack(self, decision, trace_id):
        if not decision.get('request_id'):
            return
        self._post('/v1/guardrails/ack', dict(request_id=decision['request_id'],
                   trace_id=trace_id, effective_action=decision['action']))

    def protect(self, user_input, call_model, trace_id=None):
        trace_id = trace_id or str(uuid.uuid4())
        first = self.check(user_input, 'input', trace_id)
        if first['action'] == 'block':
            self.ack(first, trace_id)
            return first.get('reply') or '当前请求无法处理。'
        self.ack(first, trace_id)
        output = call_model(user_input)
        if not isinstance(output, str):
            raise TypeError('call_model must return buffered text')
        last = self.check(output, 'output', trace_id, [{'role': 'user', 'content': user_input}])
        answer = (last.get('reply') or '当前请求无法处理。') if last['action'] == 'block' else output
        self.ack(last, trace_id)
        return answer
`;
K.downloadSdk=()=>A.download('guard_client.py',K.sdk,'text/x-python;charset=utf-8');
const render=C.render;
C.render=function(page){return page==='integration'?'<div class="content-safety-page content-product-page">'+K.integration()+'</div>':render.apply(C,arguments);};
S.render=C.render;
O.integration=function(id){K.appId=id;P.go('protection','integration');};G.integration=O.integration;S.access=O.integration;
})();
