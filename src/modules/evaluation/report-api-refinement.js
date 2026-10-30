/* evaluation/report-api-refinement。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['evaluation/report-api-refinement'] = function () {
  /* Report composition is an export preference, never an execution setting. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      V = A.evaluation,
      P = A.platform,
      E = A.escape;
    const N = (A.reportApi = { variant: 'process' });
    N.exportMenu = function (id) {
      return `<details class="report-export export-variant"><summary>${A.icon('download', 14)}报告导出${A.icon('chevron', 12)}</summary><div class="export-variant-panel"><label>报告内容<select aria-label="导出报告内容"><option value="capability">简版 · 不含明细</option><option value="process">完整版本 · 包含明细</option></select></label><span class="export-format-label">导出格式</span>${[
        ['pdf', 'PDF'],
        ['markdown', 'Markdown'],
      ]
        .map(
          ([format, label]) =>
            `<button data-id="${E(id || '')}" onclick="App.reportApi.exportFrom(this,'${format}')">${label}</button>`,
        )
        .join('')}</div></details>`;
    };
    N.exportFrom = function (button, format) {
      const menu = button.closest('details'),
        variant = menu.querySelector('select').value;
      menu.removeAttribute('open');
      return V.exportTaskReport(button.dataset.id, format, variant);
    };
    X.reportParts.exportMenu = N.exportMenu;
    const menu = V.taskExportMenu;
    V.taskExportMenu = function (t) {
      return V.reportReady(t) ? N.exportMenu(t.id) : menu.call(V, t);
    };
    const exportTask = V.exportTaskReport;
    V.exportTaskReport = function (id, format, variant = 'process') {
      if (!['capability', 'process'].includes(variant)) return false;
      const previous = N.variant;
      N.variant = variant;
      try {
        return exportTask.call(V, id, format);
      } finally {
        N.variant = previous;
      }
    };
    const document = V.taskReportDocument;
    V.taskReportDocument = function (id, variant = N.variant) {
      if (!['capability', 'process'].includes(variant)) return '';
      const report = X.reportHTML;
      X.reportHTML = function () {
        return report.call(X, variant);
      };
      try {
        return document.call(V, id);
      } finally {
        X.reportHTML = report;
      }
    };
    // Fixed judgement criteria remain internal to the execution adapter.
    const judge = A.policies.judgementFor;
    A.policies.judgementFor = function (source, task) {
      const result = judge.call(this, source, task);
      if (!task) result.threshold = 5;
      return result;
    };
    const parse = A.openrtJudge.parse;
    A.openrtJudge.parse = function (output) {
      return parse.call(this, output, 5);
    };
    const preview = V.previewHTML;
    V.previewHTML = function (t) {
      return preview.call(V, t).replace(/攻防结果报告（(?:简版|含明细)）/g, '攻防结果报告');
    };
    // Old simulated explanations may contain the retired configuration label.
    N.cleanExplanation = (value) =>
      typeof value === 'string'
        ? value.replace(
            /[；，]?评分\s*\d+(?:\.\d+)?\s*\/\s*5[，,]\s*(?:达到|低于)攻破阈值\s*\d+(?:\.\d+)?\s*\/\s*5/g,
            '',
          )
        : value;
    const round = A.evaluationRecords.roundSummary;
    A.evaluationRecords.roundSummary = function () {
      const result = round.apply(this, arguments);
      return { ...result, reason: N.cleanExplanation(result.reason) };
    };
    // A shared service origin and scoped clients; no browser-side API service is implied.
    const M = (A.apiManagement = {});
    M.db = function () {
      return (
        A.data.platformApi ||
        (A.data.platformApi = { baseUrl: 'https://guard.example.com', clients: [] })
      );
    };
    M.saveAddress = function (value) {
      const text = String(value ?? window.document.getElementById('api-base-url').value).trim();
      let url;
      try {
        url = new URL(text);
      } catch (e) {
        A.toast('请填写完整的 HTTP 或 HTTPS 服务地址');
        return false;
      }
      if (
        !['http:', 'https:'].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.search ||
        url.hash
      ) {
        A.toast('服务地址不能包含凭据、查询参数或片段');
        return false;
      }
      M.db().baseUrl = text.replace(/\/+$/, '');
      A.save();
      A.render();
      A.toast('服务地址已保存');
      return true;
    };
    M.create = function () {
      A.modal(
        '新建调用凭据',
        `<div class="form-grid"><div class="field"><label for="api-client-name">调用方名称</label><input id="api-client-name" maxlength="60" placeholder="例如 客服业务后端"></div><div class="field"><label for="api-client-scope">接口权限</label><select id="api-client-scope" onchange="document.getElementById('api-client-app-field').hidden=this.value!=='guard'"><option value="guard">防护检测与执行确认</option><option value="evaluation">评估任务创建与查询</option></select></div><div class="field" id="api-client-app-field"><label for="api-client-app">绑定应用</label><select id="api-client-app">${A.guard.access
          .apps()
          .map((a) => `<option value="${E(a.id)}">${E(a.name)}</option>`)
          .join(
            '',
          )}</select></div></div><p class="hint">当前创建的是演示凭据，不具备真实接口调用权限。生产凭据由部署服务签发。</p>`,
        `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.apiManagement.saveClient()">创建</button>`,
      );
    };
    M.saveClient = function (value) {
      const d = value || {
        name: window.document.getElementById('api-client-name').value,
        scope: window.document.getElementById('api-client-scope').value,
        appId: window.document.getElementById('api-client-app').value,
      };
      if (
        !String(d.name || '').trim() ||
        String(d.name).length > 60 ||
        !['guard', 'evaluation'].includes(d.scope) ||
        (d.scope === 'guard' && !A.guard.access.apps().some((a) => a.id === d.appId))
      ) {
        A.toast('请填写名称并选择有效的权限与应用');
        return false;
      }
      const id = A.guard.uid('CLIENT'),
        token = 'demo-only-' + id;
      const row = {
        id,
        name: d.name.trim(),
        scope: d.scope,
        appId: d.scope === 'guard' ? d.appId : null,
        suffix: token.slice(-6),
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      M.db().clients.push(row);
      A.save();
      A.closeModal();
      A.render();
      A.modal(
        '调用凭据已创建',
        `<p>请复制并保存本次演示凭据。关闭后仅展示尾号。</p><pre class="code-block">${E(token)}</pre><p class="hint">仅用于API 接入配置，真实服务不会接受此凭据。</p>`,
        '',
      );
      return row;
    };
    M.revoke = function (id, confirmed = false) {
      const row = M.db().clients.find((v) => v.id === id);
      if (!row || row.status === 'revoked') return false;
      if (!confirmed) {
        A.modal(
          '撤销调用凭据',
          `<p>撤销“${E(row.name)}”的调用凭据？</p>`,
          `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" data-id="${E(id)}" onclick="App.apiManagement.revoke(this.dataset.id,true)">撤销</button>`,
        );
        return false;
      }
      row.status = 'revoked';
      A.save();
      A.closeModal();
      A.render();
      return true;
    };
    M.catalog = [
      ['防护检测', 'POST', '/v1/guard/check', '提交输入或输出，返回检测与处置结果'],
      ['执行确认', 'POST', '/v1/guard/ack', '回传应用实际执行的放行或阻断结果'],
      ['创建评估任务', 'POST', '/v1/evaluations/tasks', '提交评估对象与策略，获取任务编号'],
      ['查询评估任务', 'GET', '/v1/evaluations/tasks/{task_id}', '查询执行状态、进度与结果'],
    ];
    M.render = function () {
      const d = M.db(),
        rows = A.guard.records.all().filter((r) => r.source === 'application'),
        verified = rows.filter((r) => r.externalVerified === true),
        appCount = new Set(verified.map((r) => r.appId)).size;
      return `<div class="lp-page api-management">${A.heading('', 'API 与流量', '统一管理平台服务地址、调用凭据与接口用量。')}<section class="card api-service"><div class="api-section-head"><h2>服务接入</h2><span class="pmr-source system">HTTP API / Python SDK</span></div><div class="api-address"><label for="api-base-url">服务基础地址<input id="api-base-url" value="${E(d.baseUrl)}" placeholder="https://guard.company.internal"></label><button class="btn" onclick="App.apiManagement.saveAddress()">保存地址</button></div><p class="hint">使用企业实际部署地址。当前地址为示例，页面不会启动接口服务；评估接口为拟定接入约定。</p><div class="table-wrap"><table class="ds-table"><thead><tr><th>接口</th><th>方法</th><th>路径</th><th>用途</th></tr></thead><tbody>${M.catalog.map(([name, method, path, purpose]) => `<tr><td>${name}</td><td><span class="api-method">${method}</span></td><td><code>${path}</code></td><td>${purpose}</td></tr>`).join('')}</tbody></table></div><p class="api-outbound">模型演练调用靶标、红队与裁判模型时，使用模型资产各自的连接配置。<button class="link-btn" onclick="App.platform.go('management','model-roles')">模型配置 →</button></p></section><section class="card"><div class="api-section-head"><h2>调用凭据</h2><button class="btn primary" onclick="App.apiManagement.create()">＋ 新建凭据</button></div><div class="table-wrap"><table class="ds-table"><thead><tr><th>调用方</th><th>权限范围</th><th>绑定应用</th><th>凭据尾号</th><th>状态</th><th>操作</th></tr></thead><tbody>${d.clients.map((c) => `<tr><td>${E(c.name)}</td><td>${c.scope === 'guard' ? '防护检测与执行确认' : '评估任务创建与查询'}</td><td>${c.appId ? E(A.guard.access.appName(c.appId)) : '—'}</td><td>••••${E(c.suffix)}</td><td>${A.badge(c.status === 'active' ? '可用' : '已撤销', c.status === 'active' ? 'green' : 'gray')}</td><td><button class="link-btn" ${c.status === 'revoked' ? 'disabled' : ''} data-id="${E(c.id)}" onclick="App.apiManagement.revoke(this.dataset.id)">撤销</button></td></tr>`).join('') || '<tr><td colspan="6" class="empty">暂无调用凭据，按应用或自动化调用方分别创建。</td></tr>'}</tbody></table></div></section><section class="card"><div class="api-section-head"><h2>接口流量</h2><span class="muted">当前已保存记录</span></div><div class="api-metrics"><div><span>外部已验证检测</span><strong>${verified.length}</strong></div><div><span>外部调用应用</span><strong>${appCount}</strong></div><div><span>演示检测记录</span><strong>${rows.length - verified.length}</strong></div><div><span>评估 API 请求</span><strong>—</strong></div></div><p class="hint api-traffic-note">仅统计可确认来源的记录。真实请求量、错误率、延迟和限流情况需由服务端接入日志提供；页面内创建的评估任务不计为 API 请求。</p></section></div>`;
    };
    P.routes['management/api-traffic'] = () => M.render();
  })();
};
