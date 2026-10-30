/* guard/guard-ops-views。安全防护的复核工作台与账号风险，数据来自 A.guard.records。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['guard/guard-ops-views'] = function () {
  'use strict';
  const A = window.App,
    E = A.escape,
    G = A.guard,
    { records, access, arr, now, time, actor, VERDICTS, STAGES } = G;
  const redraw = () => A.render();
  const opts = (rows, value) =>
    rows
      .map(
        ([id, label]) =>
          `<option value="${E(id)}" ${id === value ? 'selected' : ''}>${E(label)}</option>`,
      )
      .join('');
  const link = (label, handler, id) =>
    `<button class="link-btn" data-id="${E(id)}" onclick="${handler}(this.dataset.id)">${E(label)}</button>`;
  const DAYS = [
    ['', '全部时间'],
    ['1', '近24小时'],
    ['7', '近7天'],
    ['30', '近30天'],
  ];
  const since = (days) => (days ? Date.now() - Number(days) * 86400000 : 0);
  /* go(p) 返回翻到第 p 页的 onclick 代码 */
  const pager = (n, page, size, go) => {
    const pages = Math.max(1, Math.ceil(n / size));
    return `<div class="table-foot"><span>共 ${n} 条 · ${page} / ${pages} 页</span><div><button class="btn small" ${page <= 1 ? 'disabled' : ''} onclick="${go(page - 1)}">上一页</button><button class="btn small" ${page >= pages ? 'disabled' : ''} onclick="${go(page + 1)}">下一页</button></div></div>`;
  };

  /* ── 复核工作台 ── 队列在打开时固定，新事项需手动刷新，避免处理中列表跳动 */
  const RV = (G.reviewViews = {
    filter: { status: 'pending', days: '7', app: '', query: '', page: 1 },
    ids: null,
  });
  RV.refresh = function () {
    RV.ids = records.reviews().map((v) => v.id);
    RV.filter.page = 1;
    redraw();
  };
  RV.set = function (key, value) {
    if (!Object.hasOwn(RV.filter, key)) return;
    RV.filter[key] = value;
    if (key !== 'page') RV.filter.page = 1;
    redraw();
  };
  RV.openApp = function (appId) {
    RV.filter = { ...RV.filter, app: appId || '', status: 'pending', page: 1 };
    A.platform.go('protection', 'review');
  };
  RV.rows = function () {
    if (RV.ids === null) RV.ids = records.reviews().map((v) => v.id);
    const f = RV.filter,
      ids = new Set(RV.ids),
      cut = since(f.days),
      q = f.query.toLowerCase();
    return records
      .reviews()
      .filter((v) => ids.has(v.id))
      .map((v) => ({ v, r: records.get(v.requestId) }))
      .filter(
        ({ v, r }) =>
          r &&
          (!f.app || r.appId === f.app) &&
          (!f.status || v.status === f.status) &&
          (!cut || Date.parse(v.createdAt) >= cut) &&
          (!q || [r.id, r.text, r.appName].join(' ').toLowerCase().includes(q)),
      )
      .sort((a, b) => String(b.v.createdAt).localeCompare(String(a.v.createdAt)));
  };
  RV.render = function () {
    G.init();
    const f = RV.filter,
      rows = RV.rows(),
      size = 15,
      fresh = records.reviews().filter((v) => !RV.ids.includes(v.id)).length;
    f.page = Math.min(f.page, Math.max(1, Math.ceil(rows.length / size)));
    const sel = (key, label, values) =>
      `<select aria-label="${label}" onchange="App.guard.reviewViews.set('${key}',this.value)">${opts(values, f[key])}</select>`;
    const body = rows
      .slice((f.page - 1) * size, f.page * size)
      .map(
        ({
          v,
          r,
        }) => `<tr><td>${link(r.id, 'App.guard.views.detail', r.id)}<p class="or-review-excerpt">${E(r.text || '图片内容')}</p></td>
        <td>${E(r.appName)}</td><td>${STAGES[r.stage]}</td><td>${E(VERDICTS[r.verdict] || r.verdict)}</td><td class="ds-date">${time(v.createdAt)}</td>
        <td>${v.status === 'complete' ? '已复核' : '待处理'}</td><td>${E(v.conclusion || '—')}</td>
        <td>${v.status === 'complete' ? link('查看记录', 'App.guard.views.detail', r.id) : link('开始复核', 'App.guard.views.reviewForm', v.id)}</td></tr>`,
      )
      .join('');
    return (
      A.heading(
        '',
        '复核工作台',
        '集中处理需人工判断的内容；复核结论与原始检测记录分别保留。',
        `<button class="btn" onclick="App.guard.reviewViews.refresh()">刷新队列${fresh ? ' · ' + fresh + ' 条新事项' : ''}</button>`,
      ) +
      `<section class="card"><div class="toolbar or-review-filters">
      ${sel('status', '复核状态', [
        ['pending', '待处理'],
        ['complete', '已复核'],
        ['', '全部状态'],
      ])}
      ${sel('days', '复核时间范围', DAYS)}
      ${sel('app', '复核应用', [['', '全部应用'], ...access.apps().map((a) => [a.id, a.name])])}
      <input aria-label="搜索复核内容" placeholder="请求 ID / 内容" value="${E(f.query)}" onchange="App.guard.reviewViews.set('query',this.value)"></div>
      <div class="or-queue-note">当前队列已固定 · 新事项点击“刷新队列”后载入</div>
      <div class="table-wrap"><table><thead><tr><th>请求 / 内容</th><th>所属应用</th><th>位置</th><th>机器判定</th><th>提交时间</th><th>复核状态</th><th>人工结论</th><th>操作</th></tr></thead>
      <tbody>${body || '<tr><td colspan="8" class="empty">当前范围内没有复核事项</td></tr>'}</tbody></table></div>
      ${pager(rows.length, f.page, size, (p) => `App.guard.reviewViews.set('page',${p})`)}</section>`
    );
  };
  /* ── 账号风险 ── 按“应用 + 用户标识”归集不安全、待确认或被阻断的记录；处置记录只是标注，限制由应用执行 */
  const AR = (G.accounts = {
    query: '',
    app: '',
    days: '',
    mode: 'records',
    page: 1,
    current: null,
  });
  const MARKS = ['待观察', '重点关注', '已排除'],
    STEPS = ['持续观察', '已联系核实', '已通知应用侧处理', '已完成处理'];
  AR.notes = () => (A.data.accountRiskNotes ||= {});
  AR.risky = (r) =>
    r.userId && (['Unsafe', 'Controversial'].includes(r.verdict) || r.suggestedAction === 'block');
  AR.examples = () =>
    Array.from({ length: 6 }, (_, i) => ({
      id: 'account-demo-' + i,
      appId: 'sample-app',
      appName: '示例 · 智能客服',
      userId: i < 3 ? 'user_1024' : i < 5 ? 'user_2086' : 'user_3051',
      createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
      text: ['尝试诱导输出受限内容', '连续提交相似违规请求', '请求获取他人个人信息'][i % 3],
      verdict: 'Unsafe',
      suggestedAction: 'block',
      sample: true,
    }));
  AR.rows = function () {
    const src = AR.mode === 'sample' ? AR.examples() : records.all().filter(AR.risky),
      cut = since(AR.days),
      q = AR.query.toLowerCase(),
      map = new Map();
    for (const r of src) {
      if ((AR.app && r.appId !== AR.app) || (cut && Date.parse(r.createdAt) < cut)) continue;
      const key = (r.sample ? 'sample:' : '') + JSON.stringify([r.appId, r.userId]);
      if (!map.has(key))
        map.set(key, {
          key,
          user: r.userId,
          appId: r.appId,
          appName: r.appName,
          records: [],
          sample: !!r.sample,
        });
      map.get(key).records.push(r);
    }
    return [...map.values()]
      .map((a) => ({
        ...a,
        note: AR.notes()[a.key] || {},
        latest: a.records
          .map((r) => r.createdAt)
          .sort()
          .at(-1),
      }))
      .filter((a) => !q || [a.user, a.appName, a.note.mark].join(' ').toLowerCase().includes(q))
      .sort((a, b) => b.latest.localeCompare(a.latest));
  };
  AR.set = function (key, value) {
    if (!['query', 'app', 'days', 'mode', 'page'].includes(key)) return;
    AR[key] = key === 'page' ? Number(value) : value;
    if (key !== 'page') AR.page = 1;
    if (key === 'mode') AR.app = '';
    redraw();
  };
  AR.open = function (key) {
    const a = AR.rows().find((x) => x.key === key);
    if (!a) return;
    AR.current = a;
    const n = a.note,
      evidence = a.records
        .slice()
        .sort((x, y) => String(y.createdAt).localeCompare(String(x.createdAt)))
        .slice(0, 50)
        .map(
          (r) =>
            `<article><div>${a.sample ? E(r.id) : link(r.id, 'App.guard.views.detail', r.id)}<time>${time(r.createdAt)}</time></div><p>${E(r.text || '图片内容')}</p>${A.badge(VERDICTS[r.verdict] || r.verdict, r.verdict === 'Unsafe' ? 'red' : 'amber')}</article>`,
        )
        .join('');
    const history =
      arr(n.history)
        .slice()
        .reverse()
        .map(
          (h) =>
            `<article><div><strong>${E(h.mark)} · ${E(h.action)}</strong><time>${time(h.at)}</time></div><p>${E(h.note || '无备注')} · ${E(h.actor)}</p></article>`,
        )
        .join('') || '<p class="hint">暂无处置记录</p>';
    A.drawer(
      '账号风险 · ' + E(a.user),
      `<p class="hint">${E(a.appName)} · ${a.sample ? '独立示例数据' : '应用用户账号'} · ${a.records.length} 条关联风险记录</p>
      <div class="rt-detail-grid"><div class="field"><label>风险标记</label><select id="ar-mark">${opts(
        MARKS.map((m) => [m, m]),
        n.mark || '待观察',
      )}</select></div>
      <div class="field"><label>处置记录</label><select id="ar-action">${opts(
        STEPS.map((m) => [m, m]),
        n.action || '持续观察',
      )}</select></div></div>
      <div class="field"><label>备注</label><textarea id="ar-note" maxlength="500" placeholder="填写核实结论或处理说明"></textarea></div>
      <p class="hint">此处记录处置进展；账号限制由业务应用执行。</p><p id="ar-error" class="error-message"></p>
      <h3>关联违规记录</h3><div class="rt-evidence">${evidence}</div>${a.records.length > 50 ? '<p class="hint">展示最近 50 条，请缩小时间范围查看。</p>' : ''}
      <h3>处置历史</h3><div class="rt-evidence">${history}</div>`,
      `<button class="btn primary" onclick="App.guard.accounts.save()">保存处置记录</button>`,
    );
  };
  AR.save = function () {
    const a = AR.current;
    if (!a) return false;
    const mark = document.getElementById('ar-mark').value,
      action = document.getElementById('ar-action').value,
      note = document.getElementById('ar-note').value.trim();
    if (!MARKS.includes(mark) || !STEPS.includes(action)) return false;
    const old = AR.notes()[a.key] || {},
      at = now();
    AR.notes()[a.key] = {
      mark,
      action,
      updatedAt: at,
      history: [...arr(old.history), { mark, action, note, at, actor: actor() }],
    };
    G.audit('guard.account', a.key, mark + ' · ' + action, { appId: a.appId });
    A.save();
    A.closeDrawer();
    redraw();
    return true;
  };
  AR.render = function () {
    G.init();
    const rows = AR.rows(),
      size = 15,
      pages = Math.max(1, Math.ceil(rows.length / size));
    AR.page = Math.min(AR.page, pages);
    const apps =
      AR.mode === 'sample'
        ? [['sample-app', '示例 · 智能客服']]
        : access.apps().map((a) => [a.id, a.name]);
    const body = rows
      .slice((AR.page - 1) * size, AR.page * size)
      .map(
        (a) => `<tr><td>${E(a.user)}</td><td>${E(a.appName)}</td><td>${a.records.length}</td>
        <td class="ds-date">${time(a.latest)}</td>
        <td>${A.badge(a.note.mark || '待观察', a.note.mark === '重点关注' ? 'red' : a.note.mark === '已排除' ? 'gray' : 'orange')}</td><td>${E(a.note.action || '待处置')}</td>
        <td>${link('查看与处置', 'App.guard.accounts.open', a.key)}</td></tr>`,
      )
      .join('');
    return (
      A.heading('', '账号风险', '按应用用户账号归集风险，查看违规证据并记录处置。') +
      `<section class="card"><div class="toolbar">
      <select aria-label="数据来源" onchange="App.guard.accounts.set('mode',this.value)">${opts(
        [
          ['records', '防护记录'],
          ['sample', '查看示例'],
        ],
        AR.mode,
      )}</select>
      <input placeholder="搜索用户标识或标记" aria-label="搜索账号" value="${E(AR.query)}" onchange="App.guard.accounts.set('query',this.value)">
      <select aria-label="应用筛选" onchange="App.guard.accounts.set('app',this.value)">${opts([['', '全部应用'], ...apps], AR.app)}</select>
      <select aria-label="时间范围" onchange="App.guard.accounts.set('days',this.value)">${opts(DAYS, AR.days)}</select></div>
      ${AR.mode === 'sample' ? '<p class="rt-note">示例数据 · 用于预览账号归集与处置流程</p>' : ''}
      <div class="table-wrap"><table><thead><tr><th>用户标识</th><th>所属应用</th><th>关联违规</th><th>最近触发时间</th><th>风险标记</th><th>处置进展</th><th>操作</th></tr></thead>
      <tbody>${body || '<tr><td colspan="7" class="empty">暂无带用户标识的风险记录。应用请求传入 user_id 后自动归集，可切换“查看示例”预览。</td></tr>'}</tbody></table></div>
      ${pager(rows.length, AR.page, size, (p) => `App.guard.accounts.set('page',${p})`)}</section>`
    );
  };

  Object.assign(G.pages, { review: RV.render, accounts: AR.render });

  /* ── AI 应用登记 ── 应用档案存于 A.data.aiApplications，资产中心与安全防护共用 */
  const AP = (G.apps = { draft: null });
  AP.form = function (id) {
    const a = access.app(id) || {
      name: '',
      scene: '',
      owner: '',
      environment: '测试环境',
      description: '',
      status: 'online',
    };
    AP.draft = { ...JSON.parse(JSON.stringify(a)), applicationType: 'application' };
    const set = (k) => `App.guard.apps.draft.${k}=this.value`;
    A.modal(
      id ? '编辑应用' : '接入应用',
      `<div class="form-grid">
      <div class="field"><label for="cs-app-name">应用名称 *</label><input id="cs-app-name" maxlength="80" value="${E(a.name)}" oninput="${set('name')}"></div>
      <div class="field"><label for="cs-app-scene">业务场景 *</label><input id="cs-app-scene" maxlength="80" value="${E(a.scene || '')}" placeholder="如：智能客服、办公助手" oninput="${set('scene')}"></div>
      <div class="field"><label for="cs-app-owner">负责人 *</label><input id="cs-app-owner" maxlength="80" value="${E(a.owner || '')}" oninput="${set('owner')}"></div>
      <div class="field"><label for="cs-app-env">部署环境</label><select id="cs-app-env" onchange="${set('environment')}">${opts(
        ['测试环境', '预发环境', '生产环境'].map((v) => [v, v]),
        a.environment,
      )}</select></div>
      <div class="field"><label for="cs-app-state">应用状态</label><select id="cs-app-state" onchange="${set('status')}">${opts(
        [
          ['online', '已部署'],
          ['offline', '已停用'],
        ],
        a.status === 'online' ? 'online' : 'offline',
      )}</select></div></div>
      <div class="field"><label for="cs-app-description">说明</label><textarea id="cs-app-description" maxlength="300" rows="2" oninput="${set('description')}">${E(a.description || '')}</textarea></div>
      <p class="field-help">登记后在安全防护中绑定输入、输出策略。</p><p id="cs-app-error" class="error-message" role="alert"></p>`,
      `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.guard.apps.save()">${id ? '保存' : '继续配置'}</button>`,
    );
  };
  AP.save = function () {
    const d = AP.draft,
      err = (t) => ((document.getElementById('cs-app-error').textContent = t), false);
    if (!d?.name.trim() || !String(d.scene || '').trim() || !String(d.owner || '').trim())
      return err('请填写应用名称、业务场景和负责人。');
    if (access.apps().some((a) => a.id !== d.id && a.name === d.name.trim()))
      return err('该应用名称已存在。');
    const list = (A.data.aiApplications ||= []),
      old = access.app(d.id),
      isNew = !old;
    if (old) Object.assign(old, d, { name: d.name.trim(), updatedAt: now() });
    else list.push({ ...d, name: d.name.trim(), id: G.uid('app'), createdAt: now() });
    const id = old?.id || list.at(-1).id;
    access.ensure(id);
    G.audit('application.save', id, '保存业务应用资产');
    A.save();
    A.closeModal();
    redraw();
    A.toast('应用资产已保存');
    if (isNew) G.views.configForm(id);
    return true;
  };
};
