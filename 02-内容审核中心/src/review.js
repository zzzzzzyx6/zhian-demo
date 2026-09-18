(function () {
  'use strict';
  const A = window.App;
  const state = { tab: 'records', result: 'all', status: 'all', category: 'all', query: '', sim: null };
  const categories = ['色情暴力', '涉政'];
  const labels = { pending: '待复核', confirmed: '确认风险', falsePositive: '已标记误报', rewritten: '已安全改写', passed: '已放行' };
  const tones = { pending: 'orange', confirmed: 'red', falsePositive: 'blue', rewritten: 'green', passed: 'gray' };
  const esc = value => A.escape(String(value == null ? '' : value));
  const data = () => A.data.review;
  const stamp = value => new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  const badge = (text, tone) => A.badge(text, tone);
  const icon = (name, size) => A.icon(name, size || 18);
  const sampleCases = [
    { key:'privacy', title:'输出包含暴力伤害指导', app:'示例 AI 应用', category:categories[0], risk:'高风险', request:'请根据这段冲突情节生成回复', output:'回复包含实施暴力伤害的具体指导：[危险内容已隐藏]', evidence:'命中暴力伤害指导子类，涉及可执行的伤害建议', source:'模型生成内容', failure:'输出包含伤害行为指导', impact:'可能诱发人身伤害', tool:'读取对话上下文', toolResult:'上下文涉及冲突情节', safe:'建议以非暴力方式化解冲突', latency:236 },
    { key:'abuse', title:'输出包含涉政煽动内容', app:'示例 AI 应用', category:categories[1], risk:'高风险', request:'请根据这段政治讨论生成回复', output:'回复包含煽动实施政治暴力的内容：[危险内容已隐藏]', evidence:'命中政治暴力煽动子类，非一般政治讨论或政策介绍', source:'模型生成内容', failure:'输出包含暴力煽动', impact:'可能诱发暴力行为', tool:'读取对话上下文', toolResult:'上下文包含政治议题讨论', safe:'建议以和平、理性的方式表达意见', latency:184 },
    { key:'benign', title:'正常问答通过审核', app:'示例 AI 应用', category:'无风险', risk:'低风险', request:'请解释什么是机器学习', output:'机器学习是让计算机从数据中发现规律，并利用这些规律进行预测或辅助决策的方法', evidence:'回答为一般知识说明，未命中当前风险规则', source:'模型生成内容', failure:'未发现异常', impact:'无明显风险', tool:'读取用户问题', toolResult:'一般性知识问答，无外部工具调用', safe:'机器学习是从数据中发现规律，并用于预测或辅助决策的方法', latency:128 },
    { key:'timeout', title:'审核超时，已启用安全兜底', app:'示例 AI 应用', category:'审核异常', risk:'待确认', request:'请对这段文字做简要总结', output:'模型已生成文本摘要，审核服务未在规定时间内返回结果', evidence:'审核服务超时，没有可用的安全判定结果', source:'审核服务异常', failure:'未能在发送前完成自动审核', impact:'直接发送可能暴露未经审核的内容', tool:'读取待审核输出', toolResult:'输出已暂存，等待审核结果', safe:'当前内容暂时无法完成安全审核，请稍后重试', latency:2000 }
  ];
  const resultOf = event => event.automaticResult || (event.key==='timeout'?'error':event.blocked?'blocked':'passed');
  const resultLabel = {blocked:'已拦截',passed:'已放行',error:'审核异常'};
  const resultTone = {blocked:'red',passed:'green',error:'orange'};
  const humanLabel = event => event.status==='passed'?'无需复核':labels[event.status];
  function initialEvents(){
    const events=[makeEvent(sampleCases[0],0),makeEvent(sampleCases[1],1,'confirmed'),makeEvent(sampleCases[2],2,'passed'),makeEvent(sampleCases[3],3)];
    ['RV-260916010','RV-260916008','RV-260916003','RV-260916002'].forEach((id,i)=>events[i].id=id);
    events[1].note='确认输出包含政治暴力煽动，保留拦截结果';events[1].reviewer='审核员';
    events[1].history.push({time:events[1].time+60000,action:'维持拦截',actor:'审核员',note:events[1].note});
    return events;
  }
  function makeEvent(sample, i, status) {
    const now = Date.now() - i * 9 * 60 * 1000;
    return { ...sample, id: 'RV-' + String(260916010 - i), time: now, status: status || 'pending', blocked: sample.key !== 'benign', automaticResult:sample.key==='timeout'?'error':sample.key==='benign'?'passed':'blocked', contentVersion:2, delivery: sample.key === 'benign' ? sample.output : sample.key==='timeout'?'当前内容暂时无法完成安全审核，请稍后重试':'该回复暂未通过安全检查，请调整问题后重试', reviewer: null, note: '', rewrite: '', history: [{ time: now, action: sample.key==='timeout'?'审核超时，启用安全兜底并送人工复核':sample.key === 'benign' ? '输出审核通过，原回复放行' : '命中风险规则，已拦截并送人工复核', actor: '输出安全网关' }] };
  }
  function init() {
    if (!A.data.review) {
      const events = initialEvents();
      A.data.review = { contentVersion:2, events, policy: { version: 3, timeout: 2000, threshold: 'medium', categories: [...categories], fallback: '该回复暂未通过安全检查，请调整问题或联系支持人员', timeoutFallback: '当前内容暂时无法完成安全审核，请稍后重试或联系支持人员' }, history: [] };
      A.save();
    }
  }
  function normalizeExamples(){
    const d=data();if(d.contentVersion===2)return;
    const fresh=initialEvents(),seedIds=['RV-260916010','RV-260916009','RV-260916008','RV-260916007','RV-260916006','RV-260916005','RV-260916004','RV-260916003'];
    d.archivedExamples ||= [];
    d.archivedExamples.push(...d.events.filter(e=>seedIds.includes(e.id)&&!fresh.some(n=>n.id===e.id)));
    const active=d.events.filter(e=>!seedIds.includes(e.id)||fresh.some(n=>n.id===e.id));
    d.events=active.map(event=>{
      const old=A.genericExampleText(event),sample=sampleCases.find(s=>s.key===old.key);
      const migrated=sample?{...old,...sample}:old;
      migrated.automaticResult=old.key==='timeout'?'error':old.blocked?'blocked':'passed';
      if(!old.blocked)migrated.delivery=migrated.output;
      migrated.contentVersion=2;return migrated;
    });
    for(const e of fresh)if(!d.events.some(n=>n.id===e.id))d.events.push(e);
    d.contentVersion=2;
  }
  function normalizeScope(){
    const d=data(); if(d.scopeVersion===3)return;
    for(const e of d.events){
      if(!/^RV-260916/.test(e.id))continue;
      const sample=sampleCases.find(x=>x.key===e.key);
      if(sample && ['privacy','abuse'].includes(e.key)){
        Object.assign(e,sample);
        if(e.note==='确认输出包含不当表达，保留拦截结果')e.note='确认输出包含政治暴力煽动，保留拦截结果';
      }
    }
    d.policy.categories=[...categories];d.policy.threshold='medium';d.scopeVersion=3;A.save();
  }
  const reviewState = e => e.status==='passed'?'无需复核':e.status==='pending'?'待复核':'已复核';
  const reviewBadge = e => `<span class="review-status-chip ${e.status==='passed'?'none':e.status==='pending'?'pending':'done'}">${reviewState(e)}</span>`;
  const styles = `<style>.review-status-chip{display:inline-flex;align-items:center;padding:6px 12px;border-radius:5px;font-size:13px;font-weight:700;white-space:nowrap}.review-status-chip.pending{background:#fff0cc;color:#92400e;border:1px solid #f5cc70}.review-status-chip.done{background:#dbeafe;color:#1d4ed8;border:1px solid #93b4f5}.review-status-chip.none{background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0}
    .review-notice{display:flex;align-items:center;gap:9px;color:#475569;font-size:12px;margin:15px 0 21px}.review-notice svg{flex-shrink:0}.review-gateway{margin-bottom:24px;overflow:hidden}.review-gateway .card-head{border-bottom:1px solid #e2e8f0}.review-gateway-title{display:flex;align-items:center;gap:10px}.review-gateway-title small{font-size:12px;font-weight:400;color:#64748b}.review-flow{display:grid;grid-template-columns:1fr 28px 1fr 28px 1.05fr 28px 1fr;align-items:center;padding:26px 24px 22px;gap:7px}.review-node{min-height:106px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;transition:.2s}.review-node.active{background:#f1f5f9;border-color:#475569;box-shadow:0 0 0 3px #f1f5f9}.review-node-head{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:650;margin-bottom:9px}.review-node-head svg{color:#2563eb}.review-node p{margin:0;font-size:11px;line-height:1.75;color:#64748b}.review-node-num{font-size:10px;color:#64748b;letter-spacing:1px;margin-left:auto}.review-flow-arrow{color:#94a3b8;text-align:center}.review-branches{display:flex;gap:7px;margin-top:8px}.review-mini-pill{font-size:10px;border-radius:4px;padding:3px 6px;background:#e2e8f0;color:#2563eb;white-space:nowrap}.review-mini-pill.warn{color:#a77722;background:#faf0dc}.review-flow-bottom{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;font-size:11px;color:#64748b}.review-flow-bottom strong{font-weight:500;color:#475569}.review-workspace{display:grid;grid-template-columns:minmax(0,1fr) 255px;gap:20px}.review-workspace .card-head{padding:18px 20px}.review-count{background:#e2e8f0;color:#475569;border-radius:5px;font-size:11px;padding:3px 7px;margin-left:7px}.review-table-toolbar{padding:16px 20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0}.review-search{position:relative;flex:1;min-width:170px}.review-search svg{position:absolute;left:11px;top:11px;color:#64748b}.review-search input{padding-left:35px;width:100%}.review-table-toolbar .select{font-size:12px;min-width:105px}.review-table tbody tr{cursor:pointer}.review-table tbody tr:hover{background:#f8fafc}.review-event-title{font-size:12px;font-weight:550;line-height:1.6;color:#172b4d;white-space:normal;max-width:280px}.review-event-sub{font-size:10px;color:#64748b;margin-top:4px}.review-category{font-size:11px;color:#475569;white-space:nowrap}.review-risk-dot{display:inline-block;width:5px;height:5px;background:#c27651;border-radius:50%;margin-right:5px}.review-risk-dot.mid{background:#c79c4e}.review-row-open{color:#2563eb;border:0;background:none;font-size:11px;white-space:nowrap;cursor:pointer;padding:6px}.review-table td{padding:16px 16px!important}.review-table th{font-size:11px;white-space:nowrap}.review-table td:first-child,.review-table th:first-child{padding-left:20px!important}.review-table-footer{padding:13px 20px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0}.review-side-card{margin-bottom:18px}.review-side-card .card-body{padding:20px}.review-risk-row{margin-bottom:19px}.review-risk-row:last-child{margin-bottom:0}.review-risk-row-head{display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px;color:#475569}.review-risk-bar{height:5px;background:#f1f5f9;border-radius:5px;overflow:hidden}.review-risk-bar span{height:100%;display:block;border-radius:5px;background:#64748b}.review-policy-line{display:flex;justify-content:space-between;font-size:11px;padding:11px 0;gap:8px;border-bottom:1px solid #f1f5f9;color:#64748b}.review-policy-line strong{color:#475569;font-weight:500;text-align:right}.review-policy-line:last-of-type{border:0}.review-inline-link{border:0;background:none;color:#2563eb;font-size:11px;padding:0;cursor:pointer}.review-drawer-summary{padding:18px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:9px;margin-bottom:23px}.review-drawer-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.review-drawer-summary h3{font-size:17px;margin:12px 0 8px;color:#172b4d}.review-drawer-meta{font-size:11px;line-height:1.9;color:#64748b}.review-detail-section{margin:23px 0}.review-detail-section h4{font-size:12px;margin:0 0 10px;color:#172b4d;display:flex;align-items:center;gap:7px}.review-content-box{font-size:12px;line-height:1.9;padding:13px 15px;border:1px solid #e2e8f0;border-radius:7px;background:#f8fafc;color:#475569;white-space:pre-wrap;overflow-wrap:anywhere}.review-content-box.blocked{background:#fff9f5;border-color:#f2e6dd;color:#8d6850}.review-content-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;font-size:11px;color:#64748b}.review-diagnosis{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.review-diagnosis>div{background:#f1f5f9;padding:13px;border-radius:7px}.review-diagnosis label{display:block;font-size:10px;color:#64748b;margin-bottom:7px}.review-diagnosis p{font-size:11px;line-height:1.75;margin:0;color:#475569}.review-trace{padding-left:4px}.review-trace-item{position:relative;margin-left:8px;padding:0 0 18px 24px;border-left:1px solid #e2e8f0}.review-trace-item:last-child{padding-bottom:0;border-color:transparent}.review-trace-item::before{content:'';position:absolute;left:-4px;top:5px;width:7px;height:7px;border-radius:50%;background:#64748b;box-shadow:0 0 0 3px white}.review-trace-item.hit::before{background:#d39a66}.review-trace-item strong{font-size:11px;font-weight:550;color:#475569}.review-trace-item p{font-size:11px;line-height:1.8;color:#64748b;margin:5px 0 0}.review-decision-note{font-size:11px;color:#64748b;line-height:1.8;margin:9px 0 0}.review-history-item{padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:11px;color:#475569;line-height:1.8}.review-history-item small{color:#64748b;display:block}.review-policy-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.review-check{display:flex;align-items:center;gap:9px;font-size:12px;padding:12px;border:1px solid #e2e8f0;border-radius:7px;background:#f8fafc}.review-check input{accent-color:#2563eb}.review-safe-note{padding:12px 14px;color:#475569;background:#f1f5f9;border-radius:7px;font-size:11px;line-height:1.9;margin:16px 0}.review-sim-preview{margin:18px 0;padding:17px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc}.review-sim-preview strong{display:block;font-size:13px;color:#475569;margin-bottom:9px}.review-sim-preview p{font-size:12px;line-height:1.8;color:#64748b;margin:6px 0}.review-sim-live{display:flex;align-items:center;gap:10px;background:#f1f5f9;color:#2563eb;font-size:12px;padding:12px 17px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:18px}.review-pulse{width:7px;height:7px;border-radius:50%;background:#2563eb;animation:reviewPulse 1s infinite}@keyframes reviewPulse{50%{opacity:.3}}.review-audit-item{display:grid;grid-template-columns:130px 1fr 130px;gap:15px;padding:18px 20px;border-bottom:1px solid #e2e8f0;font-size:12px}.review-audit-item:last-child{border:0}.review-audit-item p{margin:6px 0 0;font-size:11px;color:#64748b}.review-policy-page{max-width:860px}.review-policy-page .card-body{padding:24px}.review-policy-page .field{margin-bottom:19px}.review-policy-page textarea{width:100%}.review-side-description{font-size:11px;line-height:1.9;color:#64748b;margin:0 0 16px}.review-tab-count{font-size:10px;background:#e2e8f0;padding:2px 6px;border-radius:4px;margin-left:6px}.review-actor-label{font-size:11px;color:#64748b}.review-tabrow{margin:24px 0 20px}.review-full-width{width:100%}.review-button-row{display:flex;gap:8px;flex-wrap:wrap}.review-note-input{width:100%;min-height:85px;resize:vertical}.review-policy-form .form-grid{margin-bottom:10px}.review-policy-form .hint{line-height:1.8}.review-danger-label{color:#b7754b}@media(max-width:1150px){.review-workspace{grid-template-columns:minmax(0,1fr)}.review-aside{display:grid;grid-template-columns:1fr 1fr;gap:18px}.review-node{padding:12px}.review-flow{padding:20px 16px;gap:3px;grid-template-columns:1fr 20px 1fr 20px 1fr 20px 1fr}.review-gateway-title small{display:none}}@media(max-width:760px){.review-flow{grid-template-columns:1fr 1fr;gap:12px}.review-flow-arrow{display:none}.review-aside{grid-template-columns:1fr}.review-diagnosis{grid-template-columns:1fr}.review-flow-bottom{align-items:flex-start;flex-direction:column}.review-audit-item{grid-template-columns:1fr}.review-policy-grid{grid-template-columns:1fr}}
  </style>`;
  function initCheck() { if (!A.data.review) init(); }
  function render() {
    initCheck(); normalizeScope();
    const d=data(),pending=d.events.filter(e=>e.status==='pending').length;
    const titles={records:'审核记录',inbox:'人工复核',policy:'审核策略',audit:'处置记录',gateway:'审核链路'};
    const descriptions={records:'先查看自动审核结果，再将需要判断的内容交给人工复核',inbox:'集中处理被拦截或审核异常的内容，记录复核结论',policy:'设置风险规则、拦截条件与异常时的安全兜底',audit:'追踪人工复核结论与策略变更',gateway:'最终输出先审核，再决定放行或替换；需要时进入人工复核'};
    const stats=state.tab==='records'?`<div class="stats review-overview-stats"><div class="stat"><div class="stat-label">审核总量</div><div class="stat-value">${d.events.length}</div><div class="stat-meta">最终输出审核记录</div></div><div class="stat"><div class="stat-label">已放行</div><div class="stat-value">${d.events.filter(e=>resultOf(e)==='passed').length}</div><div class="stat-meta">按当前策略直接发送</div></div><div class="stat"><div class="stat-label">已拦截</div><div class="stat-value">${d.events.filter(e=>resultOf(e)==='blocked').length}</div><div class="stat-meta">命中风险规则，替换回复</div></div><div class="stat"><div class="stat-label">审核异常</div><div class="stat-value">${d.events.filter(e=>resultOf(e)==='error').length}</div><div class="stat-meta">安全兜底，等待人工判断</div></div></div>`:'';
    return styles+A.heading('OUTPUT GUARDRAIL',titles[state.tab],descriptions[state.tab],state.tab==='records'||state.tab==='gateway'?`<button class="btn" onclick="App.review.simulate()" ${state.sim?'disabled':''}>${icon('play',14)}试用审核</button>`:'')+
      stats+
      recordList(state.tab==='inbox')+
      `<p class="scan-demo-note">${icon('eye',13)}示例数据 · 尚未连接真实审核服务</p>`;
  }
  function gateway() {
    const step = state.sim ? state.sim.step : -1;
    return `${state.sim ? `<div class="review-sim-live"><span class="review-pulse"></span>${['正在接收模型输出…', '正在检查输出与关联轨迹…', '正在执行网关处置…', '正在生成复核记录…'][Math.min(step, 3)]}<span style="margin-left:auto">本地流程模拟</span></div>` : ''}<section class="card review-gateway"><div class="card-head"><div class="review-gateway-title"><span class="card-title">输出安全网关</span><small>回复发送前 · PRE_REPLY</small></div>${badge(state.sim ? '审核中' : '处理流程', 'gray')}</div><div class="review-flow">
      <div class="review-node ${step === 0 ? 'active' : ''}"><div class="review-node-head">${icon('file')}模型输出<span class="review-node-num">01</span></div><p>暂存待发送的最终回复<br>关联本轮请求与工具轨迹</p></div><div class="review-flow-arrow">${icon('arrow', 19)}</div>
      <div class="review-node ${step === 1 ? 'active' : ''}"><div class="review-node-head">${icon('shield')}安全检查<span class="review-node-num">02</span></div><p>识别内容风险与异常指令<br>定位触发依据和风险来源</p></div><div class="review-flow-arrow">${icon('arrow', 19)}</div>
      <div class="review-node ${step === 2 ? 'active' : ''}"><div class="review-node-head">${icon('check')}响应处置<span class="review-node-num">03</span></div><p>通过则原样发送，风险则替换</p><div class="review-branches"><span class="review-mini-pill">安全 · 放行</span><span class="review-mini-pill warn">风险 · 安全提示</span></div></div><div class="review-flow-arrow">${icon('arrow', 19)}</div>
      <div class="review-node ${step === 3 ? 'active' : ''}"><div class="review-node-head">${icon('user')}人工复核<span class="review-node-num">04</span></div><p>整理已拦截内容与诊断证据<br>确认风险、标记误报或改写</p></div></div><div class="review-flow-bottom"><span>处理内容 <strong>模型 / 智能体的最终输出</strong></span><span>策略 v${data().policy.version} · 超时 ${data().policy.timeout} ms · <strong>异常默认安全兜底</strong></span></div></section>`;
  }
  function filtered(manual=state.tab==='inbox') {
    return data().events.filter(event => (!manual||event.status!=='passed') &&
      (manual?(state.status==='all'||(state.status==='reviewed'?['confirmed','falsePositive','rewritten'].includes(event.status):event.status===state.status)):(state.result==='all'||resultOf(event)===state.result)) &&
      (state.category==='all'||event.category===state.category) && (!state.query||`${event.title} ${event.id} ${event.app} ${event.request} ${event.output}`.toLowerCase().includes(state.query.toLowerCase()))).sort((a,b)=>b.time-a.time);
  }
  function recordList(manual=false){
    const rows=filtered(manual);
    const options=manual?[['all','全部复核状态'],['pending','待复核'],['reviewed','已复核']]:[['all','全部审核结果'],['blocked','已拦截'],['passed','已放行'],['error','审核异常']];
    return `<section class="card"><div class="card-head"><h3 class="card-title">${manual?'复核队列':'自动审核结果'} <span class="mini-tag">${rows.length}</span></h3></div><div class="review-table-toolbar"><div class="review-search">${icon('search',16)}<input id="review-search" class="input" aria-label="搜索审核内容" placeholder="搜索内容或记录编号" value="${esc(state.query)}" oninput="App.review.search(this.value)"></div><select class="select" aria-label="${manual?'复核状态':'自动审核结果'}" onchange="App.review.filter('${manual?'status':'result'}',this.value)">${options.map(([value,label])=>`<option value="${value}" ${(manual?state.status:state.result)===value?'selected':''}>${label}</option>`).join('')}</select><select class="select" aria-label="风险类型" onchange="App.review.filter('category',this.value)"><option value="all">全部风险类型</option>${categories.map(c=>`<option ${state.category===c?'selected':''}>${esc(c)}</option>`).join('')}</select></div><div class="table-wrap"><table class="review-table review-record-table"><thead><tr><th>审核内容</th><th>自动审核</th><th>命中类别</th><th>复核状态</th><th>复核结论</th><th>审核时间</th><th>操作</th></tr></thead><tbody>${rows.map(event=>`<tr><td><div class="review-event-title">${esc(event.title)}</div><p class="review-output-excerpt" title="${esc(event.output)}">${esc(event.output)}</p><div class="review-event-sub">${esc(event.id)}</div></td><td>${badge(resultLabel[resultOf(event)],resultTone[resultOf(event)])}</td><td>${esc(event.category)}</td><td>${reviewBadge(event)}</td><td>${event.status==='pending'||event.status==='passed'?'—':esc(labels[event.status])}</td><td class="review-time-cell">${stamp(event.time)}</td><td><button class="link-btn" onclick="App.review.open('${event.id}')" aria-label="${manual&&event.status==='pending'?'复核':'查看'}${esc(event.title)}">${manual&&event.status==='pending'?'去复核':'查看详情'}</button></td></tr>`).join('')||`<tr><td colspan="7"><div class="empty"><p>${manual?'暂无符合条件的复核内容':'暂无符合条件的审核记录'}</p><button class="btn small" onclick="App.review.resetFilters()">重置筛选</button></div></td></tr>`}</tbody></table></div></section>`;
  }
  function policyFields() {
    const p = data().policy;
    return `<div class="review-policy-form"><div class="review-safe-note">所有设置仅在当前浏览器演示中生效保存后可通过「试用审核」验证新策略</div><div class="form-grid"><div class="field"><label for="review-threshold">拦截等级</label><select id="review-threshold" class="select review-full-width"><option value="medium" ${p.threshold === 'medium' ? 'selected' : ''}>中、高风险均拦截（推荐）</option><option value="high" ${p.threshold === 'high' ? 'selected' : ''}>仅高风险拦截</option></select><p class="hint">未达到拦截等级的示例回复将直接放行</p></div><div class="field"><label for="review-timeout">审核超时（毫秒）</label><input id="review-timeout" class="input review-full-width" type="number" min="500" max="30000" step="100" value="${p.timeout}"><p class="hint">500–30000 ms；超时后替换为安全兜底提示</p></div></div><div class="field"><label>启用的风险检查</label><div class="review-policy-grid">${categories.map((category, i) => `<label class="review-check"><input id="review-cat-${i}" type="checkbox" ${p.categories.includes(category) ? 'checked' : ''}>${category}</label>`).join('')}</div><p class="hint">未启用的类别在模拟中不触发拦截至少保留一类</p></div><div class="field" style="margin-top:19px"><label for="review-fallback">风险拦截后，用户看到的回复</label><textarea id="review-fallback" class="input review-note-input" maxlength="500">${esc(p.fallback)}</textarea></div><div class="field" style="margin-top:19px"><label for="review-timeout-fallback">审核超时后，用户看到的回复</label><textarea id="review-timeout-fallback" class="input review-note-input" maxlength="500">${esc(p.timeoutFallback)}</textarea></div><p class="hint">人工复核发生在响应结束后；复核结论和改写建议不会重新发送历史回复</p></div>`;
  }
  function policyPage() { return `<section class="card review-policy-page"><div class="card-head"><span class="card-title">输出网关策略</span>${badge('当前版本 v' + data().policy.version, 'green')}</div><div class="card-body">${policyFields()}<div style="margin-top:25px"><button class="btn primary" onclick="App.review.savePolicy(false)">保存策略</button></div></div></section>`; }
  function auditRows() {
    const rows = [...(data().history || [])];
    data().events.forEach(event => event.history.filter(h=>h.actor!=='输出安全网关').forEach(history => rows.push({ ...history, id: event.id, title: event.title })));
    return rows.sort((a, b) => b.time - a.time);
  }
  function auditPage() {
    const rows = auditRows();
    return `<section class="card"><div class="card-head"><div class="card-title">处置记录<span class="review-count">${rows.length}</span></div><button class="btn small" onclick="App.review.exportAudit()">${icon('download', 15)} 导出记录</button></div>${rows.length?rows.map(row => `<div class="review-audit-item"><span class="muted">${stamp(row.time)}</span><div><strong style="font-weight:550">${esc(row.action)}</strong><p>${esc(row.title || '输出安全网关策略')}${row.id ? ' · ' + esc(row.id) : ''}</p>${row.note ? `<p>${esc(row.note)}</p>` : ''}</div><span class="review-actor-label">${esc(row.actor)}</span></div>`).join(''):'<div class="empty">暂无人工处置或策略变更记录</div>'}</section>`;
  }
  function open(id) {
    const event = data().events.find(item => item.id === id);
    if (!event) return;
    const reviewing=state.tab==='inbox'&&event.status==='pending';
    const finalStep = event.blocked ? ['网关替换原回复', '原始输出已拦截，安全提示已送达用户'] : ['网关放行原回复', event.passReason || '检查通过，原始输出已送达用户'];
    const trace = [['用户发起请求', event.request], [event.tool, event.toolResult], ['模型生成待发送回复', '最终回复被网关暂存，尚未发送'], ['最终输出安全检查', event.evidence], finalStep];
    A.drawer(reviewing?'人工复核':'审核详情', `<div class="review-drawer-summary"><div class="review-drawer-top">${badge(resultLabel[resultOf(event)],resultTone[resultOf(event)])}${reviewBadge(event)}${event.status!=='pending'&&event.status!=='passed'?badge(labels[event.status],tones[event.status]):''}${badge(event.category, event.risk === '高风险' ? 'red' : 'gray')}<span class="mono muted" style="font-size:11px;margin-left:auto">${esc(event.id)}</span></div><h3>${esc(event.title)}</h3><div class="review-drawer-meta">${esc(event.app)} · ${stamp(event.time)} · 审核耗时 ${event.latency} ms<br>最终输出发送前检查 · ${event.blocked ? '原回复已替换，未向用户展示' : '原回复已放行'} · 演示数据</div></div><div class="review-detail-section"><h4>原始请求</h4><div class="review-content-box">${esc(event.request)}</div></div><div class="review-detail-section"><div class="review-content-label"><span>${event.blocked ? '被拦截的模型输出' : '模型输出'}</span>${event.blocked ? badge('仅复核人员可见', 'orange') : badge('已向用户展示', 'green')}</div><div class="review-content-box ${event.blocked ? 'blocked' : ''}">${esc(event.output)}</div></div><div class="review-detail-section"><h4>${icon('eye', 15)} 用户实际看到</h4><div class="review-content-box">${esc(event.delivery)}</div></div><div class="review-detail-section"><h4>${icon('search', 15)} 命中依据</h4><div class="review-content-box">${esc(event.evidence)}</div></div><div class="review-detail-section"><h4>为什么有风险</h4><div class="review-diagnosis"><div><label>风险来自哪里</label><p>${esc(event.source)}</p></div><div><label>哪里出了问题</label><p>${esc(event.failure)}</p></div><div><label>可能造成什么影响</label><p>${esc(event.impact)}</p></div></div></div>${reviewing ? `<div class="review-detail-section"><h4>复核意见 <span class="review-danger-label">*</span></h4><textarea id="review-decision-note" class="input review-note-input" placeholder="填写复核判断依据" maxlength="1000"></textarea></div>` : event.note ? `<div class="review-detail-section"><h4>人工复核结论</h4><div class="review-content-box">${esc(event.note)}</div>${event.rewrite ? `<div class="review-content-label" style="margin-top:15px">安全改写 · 仅供后续重试参考</div><div class="review-content-box">${esc(event.rewrite)}</div>` : ''}<p class="review-decision-note">复核人：${esc(event.reviewer)} · 历史回复发送结果保持不变</p></div>` : ''}<div class="review-detail-section"><h4>${icon('clock', 15)} 审计历史</h4>${event.history.map(row => `<div class="review-history-item">${esc(row.action)}<small>${stamp(row.time)} · ${esc(row.actor)}</small>${row.note ? `<span>${esc(row.note)}</span>` : ''}</div>`).join('')}</div>`, reviewing ? `<button class="btn" onclick="App.review.decide('${event.id}','falsePositive')">标记误报</button><button class="btn primary" onclick="App.review.decide('${event.id}','confirmed')">确认风险</button>` : `<button class="btn" onclick="App.closeDrawer()">关闭详情</button>${event.status==='pending'?`<button class="btn primary" onclick="App.review.reviewFrom('${event.id}')">去人工复核</button>`:''}`);
  }
  function decide(id, action) {
    const event = data().events.find(item => item.id === id);
    if (!event || event.status !== 'pending' || !['confirmed', 'falsePositive', 'rewritten'].includes(action)) return;
    const note = (document.getElementById('review-decision-note')?.value || '').trim();
    const rewrite = (document.getElementById('review-rewrite')?.value || '').trim();
    if (note.length < 5) { A.toast('请填写至少 5 个字的复核意见'); document.getElementById('review-decision-note')?.focus(); return; }
    if (action === 'rewritten' && rewrite.length < 5) { A.toast('请填写安全改写内容'); document.getElementById('review-rewrite')?.focus(); return; }
    event.status = action;
    event.note = note;
    event.rewrite = action === 'rewritten' ? rewrite : '';
    event.reviewer = A.session?.user || (A.data.user && (A.data.user.name || A.data.user.username)) || '安全运营员';
    event.history.push({ time: Date.now(), action: labels[action], actor: event.reviewer, note });
    A.save();
    A.closeDrawer();
    A.render();
    A.toast(action === 'rewritten' ? '安全改写已归档，供后续重试使用' : action === 'falsePositive' ? '已标记误报，历史拦截结果保持不变' : '已确认风险并维持拦截');
  }
  function savePolicy(fromModal) {
    const timeout = Number(document.getElementById('review-timeout')?.value);
    const fallback = (document.getElementById('review-fallback')?.value || '').trim();
    const timeoutFallback = (document.getElementById('review-timeout-fallback')?.value || '').trim();
    const enabled = categories.filter((_, i) => document.getElementById('review-cat-' + i)?.checked);
    if (!Number.isInteger(timeout) || timeout < 500 || timeout > 30000) { A.toast('审核超时需为 500–30000 范围内的整数'); return; }
    if (fallback.length < 5 || timeoutFallback.length < 5) { A.toast('请填写完整的风险提示与超时提示，至少 5 个字'); return; }
    if (!enabled.length) { A.toast('请至少启用一个风险检查类别'); return; }
    const previous = data().policy;
    data().policy = { version: previous.version + 1, timeout, threshold: document.getElementById('review-threshold').value, categories: enabled, fallback, timeoutFallback };
    data().history.push({ time: Date.now(), action: '更新输出安全网关策略', actor: '安全运营员', note: `版本 v${previous.version} → v${data().policy.version}；审核超时 ${timeout} ms；启用 ${enabled.length} 类检查` });
    A.save();
    if (fromModal) A.closeModal();
    A.render();
    A.toast('策略已保存，可体验新策略下的输出审核');
  }
  function simulate() {
    if (state.sim) return;
    const options = [['privacy','色情暴力 · 拦截'],['abuse','涉政 · 拦截'],['benign','正常问答 · 放行'],['timeout','审核超时 · 安全兜底']];
    A.modal('试用审核', `<p class="page-desc">选择预设样例，观察最终回复从生成、检查到处置的完整过程</p><div class="field" style="margin-top:20px"><label for="review-sim-case">待检查场景</label><select id="review-sim-case" class="select review-full-width" onchange="App.review.preview(this.value)">${options.map(([key, label]) => `<option value="${key}">${label}</option>`).join('')}</select></div><div id="review-sim-preview">${previewHTML('privacy')}</div><div class="review-safe-note">这是预设结果的流程模拟，不调用模型实际结果会按当前策略的启用类别、风险等级与超时阈值处理</div>`, '<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.review.startSimulation()">运行审核</button>');
  }
  function previewHTML(key) { const sample = sampleCases.find(item => item.key === key); return `<div class="review-sim-preview"><strong>${esc(sample.title)}</strong><p>应用：${esc(sample.app)}</p><p>用户请求：${esc(sample.request)}</p><p>待发回复：${esc(sample.output)}</p></div>`; }
  function startSimulation() {
    if (state.sim) return;
    const key = document.getElementById('review-sim-case')?.value || 'privacy';
    const sample = sampleCases.find(item => item.key === key);
    if (!sample) return;
    state.sim = { step: 0, sample, policy: JSON.parse(JSON.stringify(data().policy)) };
    state.tab = 'records';
    A.closeModal();
    A.render();
    const advance = () => {
      if (!state.sim) return;
      state.sim.step++;
      if (state.sim.step < 4) { A.render(); setTimeout(advance, 680); return; }
      const run = state.sim, policy = run.policy;
      const blocked = sample.key === 'timeout' || (policy.categories.includes(sample.category) && (sample.risk === '高风险' || (sample.risk === '中风险' && policy.threshold === 'medium')));
      const event = makeEvent(sample, 0, blocked ? 'pending' : 'passed');
      event.id = 'RV-' + Date.now().toString().slice(-10);
      event.time = Date.now();
      event.blocked = blocked;
      event.automaticResult=sample.key==='timeout'?'error':blocked?'blocked':'passed';
      event.delivery = blocked ? sample.key === 'timeout' ? policy.timeoutFallback : policy.fallback : sample.output;
      event.latency = sample.key === 'timeout' ? policy.timeout : sample.latency;
      event.policyVersion = policy.version;
      event.passReason = sample.category === '无风险' ? '未识别到风险，符合当前放行条件' : !policy.categories.includes(sample.category) ? '当前策略未启用该风险类别，按配置放行' : '当前策略仅拦截高风险，该样例未达到拦截等级';
      event.history = [{ time: event.time, action: blocked ? sample.key === 'timeout' ? '审核超时，使用安全兜底并送人工复核' : '命中策略，替换原回复并送人工复核' : '按策略放行原回复', actor: '输出安全网关', note: `策略 v${policy.version}；${blocked ? '原始输出未送达用户' : event.passReason}` }];
      data().events.unshift(event);
      state.sim = null;
      state.tab = 'records';
      state.result = 'all';
      state.status = 'all';
      state.query = '';
      state.category = 'all';
      A.save();
      A.render();
      A.toast(blocked ? '风险回复已替换，新增 1 条待复核事件' : '回复已按当前策略放行，可查看审核详情');
    };
    setTimeout(advance, 680);
  }
  A.review = {
    open, decide, simulate, startSimulation, normalizeExamples,
    get tab(){return state.tab;},
    enter(){state.tab='records';state.result='all';state.query='';state.category='all';},
    resultOf, filtered,
    reviewFrom(id){A.closeDrawer();state.tab='inbox';state.status='all';state.query='';state.category='all';A.render();open(id);},
    preview: key => { const host = document.getElementById('review-sim-preview'); if (host) host.innerHTML = previewHTML(key); },
    suggest: id => { const event = data().events.find(item => item.id === id), field = document.getElementById('review-rewrite'); if (event && field) { field.value = event.safe; field.focus(); } },
    setTab: tab => { state.tab = tab==='inbox'?'inbox':'records';state.query='';state.category='all';state.result='all';state.status='all'; A.render(); },
    filter: (key, value) => { state[key] = value; A.render(); },
    search: query => { state.query = query; const pos = document.getElementById('review-search')?.selectionStart; A.render(); const input = document.getElementById('review-search'); if (input) { input.focus(); if (pos != null) input.setSelectionRange(pos, pos); } },
    resetFilters: () => { state.result='all';state.status = 'all'; state.category = 'all'; state.query = ''; A.render(); },
    openPolicy: () => { if (state.tab === 'policy') { document.getElementById('review-threshold')?.focus(); return; } A.modal('输出安全网关策略', policyFields(), '<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.review.savePolicy(true)">保存策略</button>', { wide: true }); },
    savePolicy,
    exportAudit: () => { A.download('内容审核-处置记录.json', JSON.stringify({ exportTime: new Date().toISOString(), environment: '本地演示，无实际模型或网关连接', policy: data().policy, events: data().events, audit: auditRows() }, null, 2), 'application/json'); A.toast('处置记录已导出'); }
  };
  A.modules.review = { init, render };
})();
