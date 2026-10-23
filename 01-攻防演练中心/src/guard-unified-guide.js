/* Public API contract and downloadable synchronous client. */
(function(){
'use strict';
const A=window.App,K=A.protectionMvp,S=A.contentSafety,E=A.escape;
K.pythonExample=id=>`import os\nfrom guard_client import GuardClient, GuardBlocked\n\nguard = GuardClient(os.environ['GUARD_URL'],\n                    os.environ['GUARD_TOKEN'], '${id}')\n\ncontent = {\n    'text': '请检查这两张商品图片',\n    'images': [\n        {'id': 'front', 'url': 'https://assets.example.com/front.jpg'},\n        {'id': 'back', 'url': 'https://assets.example.com/back.jpg'}\n    ]\n}\n# call_model 返回完整文本或同结构内容对象；deliver 负责实际交付。\n# 图片引用只提交给企业部署的护栏服务。\ntry:\n    guard.protect(content, call_model, deliver, trace_id='trace-001')\nexcept GuardBlocked as blocked:\n    handle_blocked(blocked.decision)`;
K.integration=function(){const id=S.apps.some(a=>a.id===K.appId)?K.appId:S.apps[0]?.id||'<APP_ID>';return A.heading('','接入指南','一个检测接口支持文本、图片列表及混合内容，由应用同步执行防护。')+`<section class="card pm-guide"><div class="toolbar"><select aria-label="接入应用" onchange="App.protectionMvp.appId=this.value;App.render()">${S.apps.map(a=>`<option value="${E(a.id)}" ${a.id===id?'selected':''}>${E(a.name)}</option>`).join('')}</select><button class="btn" data-id="${E(id)}" onclick="App.protectionOps.config(this.dataset.id)">配置防护</button></div><div class="card-body"><ol class="pm-steps"><li><strong>绑定一项组合策略</strong><p>按输入、输出选择文本与图片检测项；文本可组合词库、正则与语义规则。</p></li><li><strong>输入检测通过后执行业务</strong><p>调用统一接口，提交文本和图片列表。任一检测项要求阻断时，阻断整个请求。</p></li><li><strong>输出完整检测后交付</strong><p>携带输入响应中的 configuration_token 和同一 Trace ID，使用本次请求开始时的防护配置；不提前交付流式内容。</p></li><li><strong>记录处置并生成报告</strong><p>应用执行动作后回传确认。报告按已有记录独立生成。</p></li></ol><div class="tabs dp-tabs">${[['api','HTTP API'],['sdk','Python SDK'],['test','策略验证']].map(([tab,label])=>`<button class="tab ${(K.guideTab||'api')===tab?'active':''}" onclick="App.protectionMvp.guideTab='${tab}';App.render()">${label==='规则验证'?'策略验证':label}</button>`).join('')}</div>${K.guideTab==='sdk'?`<p>纯标准库客户端：支持文本与多图，校验响应与配置上下文，先审后发。执行确认失败会保留待重试回执。</p><pre class="code-block">${E(K.pythonExample(id))}</pre><button class="btn" onclick="App.protectionMvp.downloadSdk()">下载 guard_client.py</button>`:K.guideTab==='test'?K.testHTML():`<h3>统一检测请求</h3><pre class="code-block">${E('POST /v1/guardrails/check\nAuthorization: Bearer <APPLICATION_TOKEN>\nContent-Type: application/json\n\n'+JSON.stringify({app_id:id,trace_id:'trace-001',stage:'input',content:{text:'本轮用户输入',images:[{id:'front',url:'https://assets.example.com/front.jpg'},{id:'back',url:'https://assets.example.com/back.jpg'}]},context:[]},null,2))}</pre><h3>检测响应</h3><pre class="code-block">${E(JSON.stringify({request_id:'check-001',trace_id:'trace-001',status:'complete',verdict:'Unsafe',action:'block',follow_up:'none',configuration:{id:'策略 ID'},configuration_token:'本请求的配置上下文凭据'},null,2))}</pre><p>输出仍调用同一接口，将 stage 改为 output、content 改为待交付内容，并携带输入返回的 configuration_token。上下文绑定应用与 Trace ID，过期后须重新开始检测。</p><h3>处置与异常约定</h3><table class="ug-guide-table"><thead><tr><th>情况</th><th>响应</th><th>应用行为</th></tr></thead><tbody><tr><td>正常检测</td><td>action=allow / block</td><td>安全放行；待确认放行并进入人工复核；不安全阻断。follow_up 独立表示后续跟进。</td></tr><tr><td>检测器异常</td><td>status=error，verdict=Unknown</td><td>按异常处置配置执行，默认阻断</td></tr><tr><td>接口不可达 / 响应无效</td><td>无可信判定</td><td>SDK 默认阻断，不伪造检测成功记录</td></tr></tbody></table><h3>执行确认</h3><pre class="code-block">${E('POST /v1/guardrails/ack\n'+JSON.stringify({app_id:id,request_id:'check-001',trace_id:'trace-001',effective_action:'block'},null,2))}</pre><p>输入阻断时不再调用模型；输出阻断时丢弃原内容，由业务应用自行处理阻断结果。回执用于核对应用实际执行情况，不是第二次内容检测。</p>`}<div class="pm-boundary"><h3>支持范围</h3><p>支持提交文本、图片和同时包含文本与图片的内容，统一返回检测判定和处置动作。词库与正则直接匹配文本；语义相似度规则需要向量模型。</p><p>图片数量、单张大小与请求总大小由部署服务按资源容量配置；图片抓取须验证类型、大小及可访问地址，防止访问未授权网络资源。私有部署使用企业护栏地址和应用凭据。</p><p>当前页面保存配置、执行本地规则并展示记录；模型推理、接口鉴权、图片获取和在线策略分发需要后端服务实现。SDK 是可下载的接入客户端，页面本身不启动 API 服务。</p><p>输出先完整缓冲后检测。Agent 工具执行前的权限与参数检查是独立控制点；输出检测不能撤回已执行的工具操作。</p></div></div></section>`;};
K.sdk=String.raw`"""Synchronous Guard API client. Supply your deployed API URL and application token."""
import json
import logging
import urllib.request
import uuid

class GuardBlocked(RuntimeError):
    def __init__(self, decision):
        self.decision = decision
        super().__init__('Guard blocked content')

class GuardClient:
    def __init__(self, base_url, token, app_id, timeout=10):
        self.url = base_url.rstrip('/')
        self.token, self.app_id, self.timeout = token, app_id, timeout
        self.pending_acks = []

    def _post(self, path, payload):
        body = json.dumps(dict(payload, app_id=self.app_id), ensure_ascii=False).encode('utf-8')
        request = urllib.request.Request(self.url + path, data=body, method='POST', headers={
            'Authorization': 'Bearer ' + self.token, 'Content-Type': 'application/json'})
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            return json.loads(response.read())

    @staticmethod
    def _content(value):
        if isinstance(value, str):
            value = dict(text=value, images=[])
        if not isinstance(value, dict) or not isinstance(value.get('text', ''), str):
            raise ValueError('Invalid content')
        images = value.get('images', [])
        if not isinstance(images, list):
            raise ValueError('Images must be a list')
        ids = []
        for item in images:
            if not isinstance(item, dict) or not isinstance(item.get('id'), str) or not item['id']:
                raise ValueError('Image ID required')
            if not isinstance(item.get('url'), str) or not item['url'].startswith(('https://', 'http://')):
                raise ValueError('Image URL required')
            ids.append(item['id'])
        if len(set(ids)) != len(ids) or 'text' in ids:
            raise ValueError('Image IDs must be unique and cannot be text')
        if not value.get('text', '').strip() and not images:
            raise ValueError('Empty content')
        return dict(text=value.get('text', ''), images=images)

    def check(self, content, stage, trace_id, configuration_token=None, context=None):
        try:
            content = self._content(content)
            if stage not in ('input', 'output') or not isinstance(trace_id, str) or not trace_id:
                raise ValueError('Invalid guard request')
            payload = dict(content=content, stage=stage, trace_id=trace_id, context=context or [])
            if configuration_token:
                payload['configuration_token'] = configuration_token
            data = self._post('/v1/guardrails/check', payload)
            if not isinstance(data, dict) or data.get('action') not in ('allow', 'block'):
                raise ValueError('Invalid action')
            if not isinstance(data.get('request_id'), str) or not data['request_id'] or data.get('trace_id') != trace_id:
                raise ValueError('Mismatched response')
            if not isinstance(data.get('configuration_token'), str) or not data['configuration_token']:
                raise ValueError('Missing configuration context')
            if configuration_token and data['configuration_token'] != configuration_token:
                raise ValueError('Configuration changed within request')
            status = data.get('status')
            if status not in ('complete', 'error'):
                raise ValueError('Invalid detection status')
            if status == 'error' and data.get('verdict') != 'Unknown':
                raise ValueError('Invalid error response')
            if status == 'complete':
                verdict = data.get('verdict')
                if verdict not in ('Safe', 'Controversial', 'Unsafe'):
                    raise ValueError('Invalid verdict')
                expected_action = 'block' if verdict == 'Unsafe' else 'allow'
                expected_follow_up = 'manual_review' if verdict == 'Controversial' else 'none'
                if data['action'] != expected_action or data.get('follow_up') != expected_follow_up:
                    raise ValueError('Inconsistent guard decision')
            return data
        except Exception:
            return dict(action='block', verdict='Unknown', status='error', request_id=None,
                        trace_id=trace_id, error='guard_unavailable')

    def ack(self, decision, trace_id):
        if not decision.get('request_id'):
            return False
        payload = dict(request_id=decision['request_id'], trace_id=trace_id,
                       effective_action=decision['action'])
        try:
            self._post('/v1/guardrails/ack', payload)
            return True
        except Exception:
            self.pending_acks.append(payload)
            logging.warning('Guard receipt queued for retry: %s', decision['request_id'])
            return False

    def retry_acks(self):
        pending, self.pending_acks = self.pending_acks, []
        for payload in pending:
            try:
                self._post('/v1/guardrails/ack', payload)
            except Exception:
                self.pending_acks.append(payload)
        return len(self.pending_acks)

    def protect(self, user_input, call_model, deliver, trace_id=None):
        trace_id = trace_id or str(uuid.uuid4())
        first = self.check(user_input, 'input', trace_id)
        if first['action'] == 'block':
            self.ack(first, trace_id)
            raise GuardBlocked(first)
        self.ack(first, trace_id)
        output = call_model(user_input)
        # Validate buffered output; generators/streams are never passed to delivery.
        self._content(output)
        last = self.check(output, 'output', trace_id, first['configuration_token'],
                          [dict(role='user', content=self._content(user_input))])
        if last['action'] == 'block':
            self.ack(last, trace_id)
            raise GuardBlocked(last)
        deliver(output)
        self.ack(last, trace_id)
        return output
`;
})();
