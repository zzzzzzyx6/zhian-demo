/* assets/risk-classification。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['assets/risk-classification'] = function () {
  /* Operational risk categories and versioned response priorities, independent of CVSS. */
  (function () {
    'use strict';
    const A = window.App,
      G = A.platformGovernance,
      P = A.platform,
      E = A.escape;
    const copy = (v) => JSON.parse(JSON.stringify(v)),
      now = () => new Date().toISOString(),
      arr = (v) => (Array.isArray(v) ? v : []);
    const N = (A.riskClassification = { draft: null });
    N.categories = {
      robustness: '模型抗攻击风险',
      vulnerability: '漏洞暴露风险',
      input: '输入内容风险',
      output: '输出内容风险',
      review: '复核积压风险',
      other: '其他风险',
    };
    N.metricCategory = {
      'attack-asr': 'robustness',
      'scan-confirmed-high': 'vulnerability',
      'runtime-unsafe-input': 'input',
      'runtime-unsafe-output': 'output',
      'runtime-pending-review': 'review',
    };
    N.defaults = () => ({
      version: 1,
      publishedAt: now(),
      levels: {
        R1: {
          name: '紧急',
          guidance: '立即核查影响范围，优先采取阻断、隔离或修复措施，并复测确认。',
        },
        R2: { name: '重要', guidance: '尽快明确责任人和处理计划，完成修复或策略调整后复测。' },
        R3: {
          name: '一般',
          guidance: '纳入常规处理计划，持续跟踪；风险扩大或反复出现时升级处置。',
        },
      },
      metrics: {
        'attack-asr': { r1: 30, r2: 10 },
        'scan-confirmed-high': { r1: 3, r2: 1 },
        'runtime-unsafe-input': { r1: 20, r2: 5 },
        'runtime-unsafe-output': { r1: 5, r2: 1 },
        'runtime-pending-review': { r1: 10, r2: 3 },
      },
    });
    const legacyLevels = {
      R1: { name: '重点', guidance: '优先核查证据与影响范围，及时处理并安排复测。' },
      R2: { name: '关注', guidance: '安排责任人跟进，结合业务影响评估修复或策略调整。' },
      R3: { name: '提示', guidance: '记录并持续观察，关注是否反复出现。' },
    };
    // Refresh untouched preset wording only; preserve custom text and all grading evidence.
    N.refreshPresetLabels = function (levels) {
      let changed = false;
      const current = N.defaults().levels;
      for (const [id, old] of Object.entries(legacyLevels)) {
        const level = levels?.[id];
        if (level?.name === old.name && level.guidance === old.guidance) {
          Object.assign(level, current[id]);
          changed = true;
        }
      }
      return changed;
    };
    N.standard = () => G.db.gradingStandard;
    N.value = (e) => {
      const value =
        e.lastWindow?.value ?? G.metricSnapshot(e.ruleSnapshot || e, arr(e.evidence)).value;
      return Number.isFinite(Number(value)) ? Number(value) : 0;
    };
    N.pick = (value, rule) =>
      !rule ? 'R3' : value >= rule.r1 ? 'R1' : value >= rule.r2 ? 'R2' : 'R3';
    N.grade = function (e) {
      const s = N.standard();
      if (!s) return false;
      let changed = false;
      if (!e.classification) {
        const category = N.metricCategory[e.metric] || 'other';
        e.classification = {
          category,
          categoryName: N.categories[category],
          standardVersion: s.version,
          levels: copy(s.levels),
          thresholds: copy(s.metrics[e.metric] || null),
          assignedAt: now(),
        };
        changed = true;
      }
      const c = e.classification,
        value = N.value(e),
        priority = N.pick(value, c.thresholds);
      if (
        c.evidenceCount !== undefined &&
        arr(e.evidence).length > c.evidenceCount &&
        e.status === 'closed'
      ) {
        (e.followups ||= []).push({
          from: 'closed',
          to: 'open',
          label: '新增证据，重新跟进',
          note: '原事件收到新的触发证据，请重新核查。',
          at: now(),
        });
        e.status = 'open';
        changed = true;
      }
      if (c.evidenceCount !== arr(e.evidence).length) {
        c.evidenceCount = arr(e.evidence).length;
        changed = true;
      }
      if (c.value !== value || c.priority !== priority) {
        if (c.priority && c.priority !== priority)
          (e.priorityHistory ||= []).push({
            from: c.priority,
            to: priority,
            at: now(),
            reason: '新增证据达到事件固化分级阈值',
          });
        c.value = value;
        c.priority = priority;
        changed = true;
      }
      if (!e.status) {
        e.status = 'open';
        changed = true;
      }
      return changed;
    };
    N.ensure = function () {
      if (!G.db) return;
      let changed = false;
      if (!G.db.gradingStandard) {
        G.db.gradingStandard = N.defaults();
        G.db.gradingHistory = [copy(G.db.gradingStandard)];
        changed = true;
      }
      for (const s of [
        G.db.gradingStandard,
        ...arr(G.db.gradingHistory),
        ...G.db.events.map((e) => e.classification),
      ])
        changed = N.refreshPresetLabels(s?.levels) || changed;
      for (const e of G.db.events) changed = N.grade(e) || changed;
      if (changed) A.save();
    };
    const init = G.init;
    G.init = function () {
      const result = init.apply(G, arguments);
      N.ensure();
      return result;
    };
    const refresh = G.refresh;
    G.refresh = function () {
      const result = refresh.apply(G, arguments);
      N.ensure();
      return copy(G.db?.events || result);
    };
    const render = G.renderRisk;
    G.renderRisk = (item) => (item === 'grading' ? N.render() : render(item));
    N.badge = function (e) {
      const c = e.classification || {},
        id = c.priority || 'R3',
        name = c.levels?.[id]?.name || N.standard()?.levels[id]?.name || '一般';
      return `<span class="rc-priority rc-${id.toLowerCase()}" title="事件处置等级，与漏洞严重性独立">${E(name)}</span>`;
    };
    N.filter = function (key, value) {
      G.filter[key] = value;
      A.render();
    };
    N.clear = function () {
      G.showEvents({});
    };
    const option = (rows, value) =>
      Object.entries(rows)
        .map(
          ([id, label]) =>
            `<option value="${E(id)}" ${id === value ? 'selected' : ''}>${E(label)}</option>`,
        )
        .join('');
    N.match = function (e, f) {
      const query = String(f.query || '')
        .trim()
        .toLowerCase();
      return (
        (!f.domain || e.domain === f.domain) &&
        (!f.category || e.classification?.category === f.category) &&
        (!f.priority || e.classification?.priority === f.priority) &&
        (!f.state || (f.state === 'active' ? e.status !== 'closed' : e.status === f.state)) &&
        (!f.metric || e.metric === f.metric) &&
        (!f.source || e.source === f.source) &&
        (!f.assetId || e.assetId === f.assetId) &&
        (!f.assetType || e.assetType === f.assetType) &&
        (!query ||
          [e.assetName, e.ruleSnapshot?.name, e.id, e.classification?.categoryName]
            .join(' ')
            .toLowerCase()
            .includes(query))
      );
    };
    G.eventHTML = function () {
      const all = G.events(),
        f = G.filter,
        rows = all.filter((e) => N.match(e, f)),
        select = (key, label, values) =>
          `<select aria-label="${label}" onchange="App.riskClassification.filter('${key}',this.value)"><option value="">${label}</option>${option(values, f[key])}</select>`,
        scope = [
          f.assetId ? all.find((e) => e.assetId === f.assetId)?.assetName || f.assetId : '',
          f.metric ? G.metrics[f.metric]?.label || f.metric : '',
          f.source ? G.sources[f.source] : '',
        ].filter(Boolean);
      return `<div class="lean-operations rc-page">${A.heading('', '风险事件', '按风险类别和处置等级跟进，点击事件查看证据与处理记录。', '<button class="btn" onclick="App.platform.go(\'risk\',\'grading\')">分级标准</button>')}<section class="card"><div class="toolbar rc-filters">${select('domain', '全部风险域', G.domains)}${select('category', '全部风险类别', N.categories)}${select('priority', '全部处置等级', Object.fromEntries(Object.entries(N.standard().levels).map(([id, l]) => [id, l.name])))}${select('state', '全部处理状态', { active: '未关闭', ...G.states })}<input type="search" aria-label="搜索风险事件或对象" placeholder="搜索事件、对象或编号" value="${E(f.query || '')}" onchange="App.riskClassification.filter('query',this.value)"><button class="link-btn" onclick="App.riskClassification.clear()">重置</button></div>${scope.length ? `<div class="rc-scope">当前范围：${E(scope.join(' · '))}<button class="link-btn" onclick="App.riskClassification.clear()">清除范围</button></div>` : ''}<div class="table-wrap"><table class="rc-events"><thead><tr><th>风险事件</th><th>风险域</th><th>风险类别</th><th>处置等级</th><th>风险对象</th><th>处理状态</th><th>最近触发</th></tr></thead><tbody>${rows.map((e) => `<tr><td><button class="link-btn" data-id="${E(e.id)}" onclick="App.platformGovernance.eventDetail(this.dataset.id)">${E(e.ruleSnapshot?.name || '风险事件')}</button></td><td>${E(G.domains[e.domain])}</td><td>${E(e.classification.categoryName)}</td><td>${N.badge(e)}</td><td>${E(e.assetName || '—')}</td><td>${A.badge(G.states[e.status] || '待处理', e.status === 'closed' ? 'gray' : e.status === 'acknowledged' ? 'blue' : 'gray')}</td><td>${E(A.guard.time(e.lastTriggeredAt || e.createdAt))}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">暂无匹配的风险事件</td></tr>'}</tbody></table></div></section></div>`;
    };
    const detail = G.eventDetail;
    G.eventDetail = function (id) {
      G.init();
      const e = G.db.events.find((e) => e.id === id);
      if (!e) return;
      const drawer = A.drawer;
      A.drawer = function (title, body, footer, options) {
        const c = e.classification,
          rule = c.thresholds,
          unit = G.metrics[e.metric]?.unit || ' 项';
        const thresholds = rule
          ? ` ${c.levels.R1.name} ≥ ${rule.r1}${unit}；${c.levels.R2.name} ≥ ${rule.r2}${unit}；其余已触发事件为${c.levels.R3.name}`
          : '按一般等级跟进';
        const panel = `<section class="rc-detail-summary"><div>${N.badge(e)}<strong>${E(c.categoryName)}</strong></div><p>分级依据：${E(G.observedLabel(e))}</p><p class="hint">标准 V${c.standardVersion} · ${E(thresholds)}</p><p>${E(c.levels[c.priority].guidance)}</p></section>`;
        const history = `<section class="rc-followup"><h3>处理记录</h3>${
          arr(e.followups)
            .map(
              (n) =>
                `<div><strong>${E(n.label)}</strong><time>${E(A.guard.time(n.at))}</time><p>${E(n.note)}</p></div>`,
            )
            .join('') || '<p class="hint">尚未记录处理情况。</p>'
        }<label for="rc-note">处理说明${e.status === 'closed' ? '（重新跟进原因）' : ''}</label><textarea id="rc-note" maxlength="500" rows="3" placeholder="记录影响判断、处理措施或复测结果"></textarea><p id="rc-error" role="alert" class="error-message"></p></section>`;
        return drawer.call(
          A,
          title,
          panel + body + history,
          `<button class="btn" onclick="App.closeDrawer()">关闭</button>${e.status === 'open' ? `<button class="btn" data-id="${E(id)}" onclick="App.riskClassification.setState(this.dataset.id,'acknowledged')">确认并跟进</button>` : ''}<button class="btn primary" data-id="${E(id)}" onclick="App.riskClassification.setState(this.dataset.id,'${e.status === 'closed' ? 'open' : 'closed'}')">${e.status === 'closed' ? '重新跟进' : '标记已处理'}</button>`,
          options,
        );
      };
      try {
        return detail.call(G, id);
      } finally {
        A.drawer = drawer;
      }
    };
    N.setState = function (id, state, note) {
      G.init();
      const e = G.db.events.find((e) => e.id === id);
      if (!e || !['open', 'acknowledged', 'closed'].includes(state)) return false;
      const text = String(note ?? document.getElementById('rc-note')?.value ?? '').trim();
      if (!text || text.length > 500) {
        document.getElementById('rc-error').textContent = '请填写 1–500 字的处理说明';
        return false;
      }
      if (e.status === state) return false;
      const label = { open: '重新跟进', acknowledged: '确认并跟进', closed: '标记已处理' }[state];
      (e.followups ||= []).push({ from: e.status, to: state, label, note: text, at: now() });
      e.status = state;
      G.audit('risk.event.' + state, id, label, { note: text });
      A.save();
      A.render();
      G.eventDetail(id);
      return true;
    };
    N.render = function () {
      G.init();
      const s = N.standard();
      return `<div class="rc-page">${A.heading('', '风险分级', '触发规则决定是否触发事件，分级标准决定触发后的处置等级。', '<button class="btn primary" onclick="App.riskClassification.edit()">调整分级标准</button>')}<div class="rc-levels">${Object.entries(
        s.levels,
      )
        .map(
          ([id, l]) =>
            `<section class="card">${N.badge({ classification: { priority: id, levels: s.levels } })}<p>${E(l.guidance)}</p></section>`,
        )
        .join(
          '',
        )}</div><section class="card"><div class="rc-standard-title"><h2>指标分级标准</h2><span>V${s.version} · ${E(A.guard.time(s.publishedAt))}</span></div><div class="table-wrap"><table><thead><tr><th>风险类别</th><th>触发指标</th><th>${E(s.levels.R1.name)}</th><th>${E(s.levels.R2.name)}</th><th>${E(s.levels.R3.name)}</th></tr></thead><tbody>${Object.entries(
        s.metrics,
      )
        .map(([id, r]) => {
          const unit = G.metrics[id]?.unit || ' 项';
          return `<tr><td>${N.categories[N.metricCategory[id]]}</td><td>${E(G.metrics[id]?.label || id)}</td><td>≥ ${r.r1}${unit}</td><td>≥ ${r.r2}${unit} 且 &lt; ${r.r1}${unit}</td><td>已触发且 &lt; ${r.r2}${unit}</td></tr>`;
        })
        .join(
          '',
        )}</tbody></table></div><p class="rc-footnote">这是平台预置的运营分级标准，可按业务调整，不等同于漏洞严重性或外部合规标准。新版本仅用于新事件；已有事件沿用触发时的分级标准，后续证据按该版本更新等级。</p></section></div>`;
    };
    N.edit = function () {
      G.init();
      N.draft = copy(N.standard());
      const d = N.draft;
      A.modal(
        '调整风险分级标准',
        `<div class="rc-standard-editor"><h3>等级名称与处理建议</h3>${Object.entries(d.levels)
          .map(
            ([id, l]) =>
              `<div class="rc-level-edit"><label>等级名称<input aria-label="${E(l.name)} 等级名称" maxlength="8" value="${E(l.name)}" oninput="App.riskClassification.draft.levels.${id}.name=this.value"></label><label>处理建议<input aria-label="${E(l.name)} 处理建议" maxlength="160" value="${E(l.guidance)}" oninput="App.riskClassification.draft.levels.${id}.guidance=this.value"></label></div>`,
          )
          .join(
            '',
          )}<h3>分级阈值</h3><p class="hint">${E(d.levels.R1.name)}阈值必须高于${E(d.levels.R2.name)}；仅对已触发事件分级。评估按单次完成任务，防护按触发规则的时间窗统计。</p>${Object.entries(
          d.metrics,
        )
          .map(
            ([id, r]) =>
              `<div class="rc-threshold-edit"><strong>${E(G.metrics[id].label)}</strong>${['r1', 'r2'].map((k) => `<label>${E(d.levels[k.toUpperCase()].name)} ≥ <input type="number" min="${id === 'attack-asr' ? 0.1 : 1}" max="${id === 'attack-asr' ? 100 : 10000}" step="${id === 'attack-asr' ? 0.1 : 1}" aria-label="${E(G.metrics[id].label)} ${E(d.levels[k.toUpperCase()].name)} 阈值" value="${r[k]}" data-metric="${id}" oninput="App.riskClassification.draft.metrics[this.dataset.metric].${k}=Number(this.value)">${G.metrics[id].unit || '项'}</label>`).join('')}</div>`,
          )
          .join('')}<p id="rc-standard-error" role="alert" class="error-message"></p></div>`,
        '<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.riskClassification.save()">保存为新版本</button>',
        { wide: true },
      );
    };
    N.validate = function (d) {
      if (!d?.levels || !d?.metrics) return '分级配置不完整';
      const names = [];
      for (const id of ['R1', 'R2', 'R3']) {
        const l = d.levels[id];
        if (
          !l ||
          !String(l.name).trim() ||
          l.name.length > 8 ||
          !String(l.guidance).trim() ||
          l.guidance.length > 160
        )
          return '请填写等级名称（1–8 字）和处理建议（1–160 字）';
        names.push(l.name.trim());
      }
      if (new Set(names).size !== 3) return '等级名称不能重复';
      for (const id of Object.keys(N.defaults().metrics)) {
        const r = d.metrics[id],
          percent = id === 'attack-asr',
          max = percent ? 100 : 10000;
        if (
          !r ||
          !Number.isFinite(r.r1) ||
          !Number.isFinite(r.r2) ||
          r.r2 < (percent ? 0.1 : 1) ||
          r.r1 <= r.r2 ||
          r.r1 > max ||
          (!percent && (!Number.isInteger(r.r1) || !Number.isInteger(r.r2)))
        )
          return (
            G.metrics[id].label +
            '：' +
            d.levels.R1.name +
            '阈值须高于' +
            d.levels.R2.name +
            '，百分比不超过 100，数量须为 1–10000 的整数'
          );
      }
      return '';
    };
    N.save = function (value) {
      G.init();
      const d = copy(value || N.draft),
        error = N.validate(d);
      if (error) {
        if (!value) document.getElementById('rc-standard-error').textContent = error;
        return { error };
      }
      const s = { ...d, version: N.standard().version + 1, publishedAt: now() };
      for (const l of Object.values(s.levels)) {
        l.name = l.name.trim();
        l.guidance = l.guidance.trim();
      }
      G.db.gradingStandard = s;
      (G.db.gradingHistory ||= []).push(copy(s));
      G.audit('risk.grading.save', 'grading', '发布风险分级标准 V' + s.version);
      A.save();
      if (!value) {
        A.closeModal();
        A.render();
        A.toast('分级标准已保存，应用于新触发事件');
      }
      return s;
    };
    const ruleForm = G.ruleForm;
    G.ruleForm = function () {
      const modal = A.modal;
      A.modal = function (title, body, footer, options) {
        const d = G.ruleDraft,
          c = N.categories[N.metricCategory[d.metric]];
        body += `<div class="rc-rule-context">风险类别：${E(c || '其他风险')}<p>事件处置等级按风险分级标准计算；本规则只设置触发条件。</p></div>`;
        return modal.call(A, title, body, footer, options);
      };
      try {
        return ruleForm.apply(G, arguments);
      } finally {
        A.modal = modal;
      }
    };
    G.ruleHTML = function () {
      G.init();
      const f = G.ruleFilter,
        query = String(f.query || '')
          .trim()
          .toLowerCase(),
        rows = G.db.rules.filter(
          (r) =>
            (!f.domain || r.domain === f.domain) &&
            (!query || r.name.toLowerCase().includes(query)),
        );
      return `<div class="rc-page">${A.heading('', '触发规则', '设置事件的触发条件；风险类别由指标确定，处置等级由分级标准计算。', '<button class="btn primary" onclick="App.platformGovernance.editRule()">＋ 新建规则</button>')}<section class="card"><div class="toolbar rc-filters"><select aria-label="全部风险域" onchange="App.platformGovernance.filterRules('domain',this.value)"><option value="">全部风险域</option>${option(G.domains, f.domain)}</select><input type="search" aria-label="搜索规则名称" placeholder="搜索规则名称" value="${E(f.query || '')}" onchange="App.platformGovernance.filterRules('query',this.value)"><button class="link-btn" onclick="App.platform.go('risk','grading')">分级标准 →</button></div><div class="table-wrap"><table><thead><tr><th>规则名称</th><th>风险类别</th><th>触发条件</th><th>风险域</th><th>操作</th></tr></thead><tbody>${rows.map((r) => `<tr><td><button class="link-btn" data-id="${E(r.id)}" onclick="App.platformGovernance.editRule(this.dataset.id)">${E(r.name)}</button></td><td>${E(N.categories[N.metricCategory[r.metric]] || '其他风险')}</td><td>${E(G.condition(r))}</td><td>${E(G.domains[r.domain])}</td><td><button class="link-btn" data-id="${E(r.id)}" onclick="App.platformGovernance.editRule(this.dataset.id)">修改配置</button>${A.entryManagement.button('alert-rule', r.id)}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">暂无匹配的触发规则</td></tr>'}</tbody></table></div></section></div>`;
    };
  })();
};
