/* exercise/blue-strategy。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/blue-strategy'] = function () {
  /* Independent blue-team strategies; model calls remain explicitly simulated. */
  (function () {
    const X = App.attack,
      A = App,
      E = A.escape;
    const names = {
      existing: '基准',
      rules: '规则过滤',
      prompt: '提示词加固',
      model: '模型防护',
      custom: '自由组合',
    };
    X.bankPreview = function (id) {
      const b = App.banks.get(id);
      if (!b) return '';
      const categories = [...new Set(b.items.map((q) => q.category).filter(Boolean))];
      return `<div class="bank-selection-meta"><strong>${b.items.length} 道题目</strong>${categories.length ? `<span>${E(categories.slice(0, 6).join(' / '))}${categories.length > 6 ? ' …' : ''}</span>` : ''}</div>`;
    };
    X.toggleBlue = (id, on) => {
      const w = X.wizard;
      w.blueParts = on
        ? [...new Set([...(w.blueParts || []), id])]
        : (w.blueParts || []).filter((x) => x !== id);
      X.wizardModal();
    };
    const conf = X.config;
    X.config = (t) =>
      conf(t) +
      `<section class="card"><div class="card-head"><h3>蓝队策略快照</h3></div><div class="card-body">${X.blueEvidenceHTML(t.defense)}</div></section>`;
    const report = X.reportHTML;
    function check(t, u, node, text) {
      u.blueEvidence ||= [];
      const d = t.defense,
        p = X.blueParts(d);
      if (p.includes('rules') && d.rules?.[node]) {
        const hits = d.rules.keywords.filter((k) => String(text).includes(k));
        u.blueEvidence.push({
          node,
          method: '规则过滤',
          action: hits.length ? '拦截' : '放行',
          reason: hits.join('、') || '未命中关键词',
          execution: '规则匹配',
        });
        if (hits.length) {
          u.blueBlocked = node;
          u.response = '内容已被蓝队策略拦截';
        }
      }
      if (
        !u.blueBlocked &&
        p.includes('model') &&
        d[node === 'input' ? 'modelInput' : 'modelOutput']
      )
        u.blueEvidence.push({
          node,
          method: '模型防护',
          action: '未执行',
          reason: '未取得模型检测结果',
          execution: '未执行检测',
        });
    }
    X.sample = function (id) {
      const t = X.task,
        u = t.units.find((x) => x.id === id);
      if (!u) return;
      const c = X.unitContent(t, u);
      A.drawer(
        '攻击记录 · ' + u.id,
        `<div class="exercise-record"><h3>攻击题目</h3><pre>${E(c.prompt)}</pre><h3>模型原始响应</h3><pre>${E(u.rawResponse || c.response)}</pre><h3>最终判定对象</h3><pre>${E(u.response || c.response)}</pre><h3>蓝队处理记录</h3>${(u.blueEvidence || []).map((e) => `<div class="card-body"><strong>${E({ input: '输入', output: '输出', system: '系统指令' }[e.node])} · ${E(e.method)} · ${E(e.action)}</strong><p>${E(e.reason)}</p><small>${E(e.execution)}</small></div>`).join('') || '<p>该记录未保存蓝队处理证据</p>'}<h3>裁判结论</h3><p>${E(u.verdict || c.verdict)}</p></div>`,
        `<button class="btn" onclick="App.closeDrawer()">关闭</button><button class="btn primary" onclick="App.attack.exportOne('${u.id}')">导出记录</button>`,
      );
    };
    const json = X.sampleJSON;
    X.sampleJSON = function (u) {
      return {
        ...json.call(X, u),
        blueStrategy: X.task.defense,
        blueEvidence: u.blueEvidence || [],
        rawResponse: u.rawResponse || null,
        deliveredResponse: u.response || null,
      };
    };
  })();
};
