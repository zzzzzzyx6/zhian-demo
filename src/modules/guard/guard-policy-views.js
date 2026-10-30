/* guard/guard-policy-views。策略中心“防护策略配置”的页面，数据全部来自 A.guard。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['guard/guard-policy-views'] = function () {
  'use strict';
  const A = window.App,
    E = A.escape,
    G = A.guard,
    { policies, rules, detectors, access, arr, copy, time, STAGES, ACTIONS } = G;
  const V = (G.policyViews = { tab: 'configurations', query: '', draft: null, ruleDraft: null });
  const TABS = {
    configurations: '防护策略配置',
    basics: '基础策略',
    rules: '规则库',
    knowledge: '词库',
  };
  V.tabs = TABS;
  V.setTab = (tab) =>
    (V.tab = Object.hasOwn(TABS, tab) ? tab : tab === 'policies' ? 'basics' : 'configurations');

  const redraw = () => A.render();
  const link = (label, handler, id) =>
    `<button class="link-btn" data-id="${E(id)}" onclick="${handler}(this.dataset.id)">${E(label)}</button>`;
  const table = (head, rows, empty) =>
    `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${head.length}" class="empty">${E(empty)}</td></tr>`}</tbody></table></div>`;
  const opts = (rows, value) =>
    rows
      .map(
        ([id, label]) =>
          `<option value="${E(id)}" ${id === value ? 'selected' : ''}>${E(label)}</option>`,
      )
      .join('');
  const stageText = (s) => (s === 'both' ? '输入 + 输出' : STAGES[s] || '—');
  const usedBy = (policyId) =>
    access.bindings().filter((b) => arr(b.policyRefs).some((r) => r.policyId === policyId));
  const search = (handler) =>
    `<input type="search" aria-label="搜索" placeholder="搜索名称" value="${E(V.query)}" onchange="${handler}">`;
  const match = (name) =>
    !V.query ||
    String(name || '')
      .toLowerCase()
      .includes(V.query.toLowerCase());

  V.render = function () {
    G.init();
    return (
      {
        configurations: V.configurations,
        basics: V.basics,
        rules: V.rules,
        knowledge: V.knowledge,
      }[V.tab] || V.configurations
    )();
  };

  /* 全部已发布策略：四类基础策略 + 自定义规则策略。应用在“配置防护”里绑定它们。 */
  V.configurations = function () {
    const rows = policies
      .all()
      .filter((p) => match(p.name))
      .map((p) => {
        const snap = policies.latest(p.id) || p;
        return `<tr><td>${link(p.name, 'App.guard.policyViews.detail', p.id)}</td>
          <td>${p.policyType === 'custom' ? '自定义规则' : 'guard 模型'}</td>
          <td>${stageText(snap.stage)}</td>
          <td>${snap.enabled ? A.badge('启用', 'green') : A.badge('停用', 'gray')}</td>
          <td>V${snap.version || 0}</td><td>${usedBy(p.id).length}</td>
          <td class="ds-date">${time(snap.publishedAt)}</td>
          <td><div class="lo-actions">${link('修改配置', 'App.guard.policyViews.edit', p.id)}${A.entryManagement?.button('guard-policy', p.id) || ''}</div></td></tr>`;
      });
    return (
      A.heading(
        '',
        '防护策略配置',
        '策略发布后冻结为版本快照，应用在“配置防护”中绑定。',
        `<button class="btn primary" onclick="App.guard.policyViews.edit()">＋ 新建自定义策略</button>`,
      ) +
      `<section class="card"><div class="toolbar">${search('App.guard.policyViews.query=this.value;App.render()')}</div>${table(['策略名称', '检测方式', '检测位置', '状态', '版本', '绑定应用', '发布时间', '操作'], rows, '暂无防护策略')}</section>`
    );
  };

  V.basics = function () {
    const rows = Object.entries(detectors.guard.profiles).map(([type, prof]) => {
      const p = policies.all().find((x) => x.policyType === type && x.isStandard);
      return `<tr><td>${p ? link(prof.name, 'App.guard.policyViews.detail', p.id) : E(prof.name)}</td>
        <td>${prof.contentType === 'image' ? '图片' : '文本'}</td><td>${prof.stages.map((s) => STAGES[s]).join(' + ')}</td>
        <td>${prof.categories.map(([, n]) => E(n)).join('、')}</td>
        <td>${p ? link('修改参数', 'App.guard.policyViews.edit', p.id) : '—'}</td></tr>`;
    });
    return (
      A.heading('', '基础策略', '同一个 guard 模型，四套系统提示词与风险类别。') +
      `<section class="card">${table(['基础策略', '内容类型', '支持检测位置', '风险类别', '操作'], rows, '暂无基础策略')}</section>`
    );
  };

  const ruleRows = (type) =>
    rules
      .store()
      .filter((r) => (type === 'word' ? r.type === 'word' : r.type !== 'word') && match(r.name))
      .map(
        (r) => `<tr><td>${link(r.name, 'App.guard.policyViews.ruleDetail', r.id)}</td>
        <td>${type === 'word' ? arr(r.words).length : r.type === 'regex' ? '正则规则' : '语义规则'}</td>
        <td>${A.badge(G.VERDICTS[r.risk] || r.risk, r.risk === 'Unsafe' ? 'red' : 'amber')}</td>
        <td>${r.enabled ? A.badge('启用', 'green') : A.badge('停用', 'gray')}</td>
        <td>${policies.all().filter((p) => arr(p.ruleIds).includes(r.id)).length}</td>
        <td><div class="lo-actions">${link('编辑', 'App.guard.policyViews.ruleEdit', r.id)}${A.entryManagement?.button('guard-rule', r.id) || ''}</div></td></tr>`,
      );
  V.rules = function () {
    return (
      A.heading(
        '',
        '规则库',
        '正则规则在本地确定性匹配，被自定义策略或基础策略引用。',
        `<button class="btn primary" onclick="App.guard.policyViews.ruleEdit('','regex')">＋ 新建规则</button>`,
      ) +
      `<section class="card"><div class="toolbar">${search('App.guard.policyViews.query=this.value;App.render()')}</div>${table(['规则名称', '类型', '命中判定', '状态', '引用策略', '操作'], ruleRows('regex'), '暂无规则')}</section>`
    );
  };
  V.knowledge = function () {
    return (
      A.heading(
        '',
        '词库',
        '词条命中即按词库的判定等级上报。',
        `<button class="btn primary" onclick="App.guard.policyViews.ruleEdit('','word')">＋ 新建词库</button>`,
      ) +
      `<section class="card"><div class="toolbar">${search('App.guard.policyViews.query=this.value;App.render()')}</div>${table(['词库名称', '词条数量', '命中判定', '状态', '引用策略', '操作'], ruleRows('word'), '暂无词库')}</section>`
    );
  };
  const kv = (k, v) => `<div class="kv"><span>${E(k)}</span><strong>${v}</strong></div>`;
  V.detail = function (id) {
    const p = policies.get(id),
      s = policies.latest(id);
    if (!p || !s) return;
    const prof = detectors.guard.profiles[s.policyType];
    const cats = prof
      ? prof.categories.filter(([c]) => arr(s.categories).includes(c)).map(([, n]) => n)
      : [];
    A.drawer(
      '防护策略 · ' + E(s.name),
      `<div class="cs-rule-detail">${kv('检测方式', s.policyType === 'custom' ? '自定义规则' : 'guard 模型')}${kv('检测位置', stageText(s.stage))}${kv('状态', s.enabled ? '启用' : '停用')}${kv('当前版本', 'V' + s.version + ' · ' + time(s.publishedAt))}
      ${cats.length ? kv('风险类别', E(cats.join('、'))) : ''}
      ${kv('待确认时', ACTIONS[s.controversialAction] + (s.reviewControversial ? '，并进入复核' : ''))}${kv('不安全时', ACTIONS[s.unsafeAction])}
      ${kv(
        '引用规则',
        E(
          arr(s.ruleSnapshots)
            .map((r) => r.name)
            .join('、') || '无',
        ),
      )}
      ${s.serviceSnapshot ? kv('检测服务', E(s.serviceSnapshot.name)) : ''}
      ${kv(
        '绑定应用',
        E(
          usedBy(id)
            .map((b) => access.appName(b.appId))
            .join('、') || '无',
        ),
      )}
      <h3>版本记录</h3>${arr(p.revisions)
        .slice()
        .reverse()
        .map((r) => kv('V' + r.version, time(r.publishedAt)))
        .join('')}</div>`,
      `<button class="btn" onclick="App.closeDrawer()">关闭</button><button class="btn primary" data-id="${E(id)}" onclick="App.guard.policyViews.edit(this.dataset.id)">修改配置</button>`,
    );
  };

  V.edit = function (id) {
    const p = id && policies.get(id);
    V.draft = p ? copy(p) : policies.newCustom();
    delete V.draft.revisions;
    V.renderForm();
  };
  const field = (label, html, help = '') =>
    `<div class="field"><label>${label}</label>${html}${help ? `<p class="field-help">${help}</p>` : ''}</div>`;
  const set = (key) => `App.guard.policyViews.draft.${key}`;
  V.renderForm = function () {
    const d = V.draft,
      prof = detectors.guard.profiles[d.policyType],
      custom = d.policyType === 'custom';
    const stages =
      prof && prof.stages.length === 1
        ? [[prof.stages[0], STAGES[prof.stages[0]] + '（固定）']]
        : [
            ['both', '输入 + 输出'],
            ['input', '仅输入'],
            ['output', '仅输出'],
          ];
    const ruleList = rules
      .store()
      .map(
        (r) =>
          `<label class="cs-checkbox"><input type="checkbox" ${arr(d.ruleIds).includes(r.id) ? 'checked' : ''} onchange="App.guard.policyViews.toggle('ruleIds','${E(r.id)}',this.checked)"><span>${E(r.name)}<small>${r.type === 'word' ? '词库' : '正则'}${r.enabled ? '' : ' · 已停用'}</small></span></label>`,
      )
      .join('');
    const catList = prof
      ? prof.categories
          .map(
            ([c, n]) =>
              `<label class="cs-checkbox"><input type="checkbox" ${arr(d.categories).includes(c) ? 'checked' : ''} onchange="App.guard.policyViews.toggle('categories','${c}',this.checked)"><span>${E(n)}</span></label>`,
          )
          .join('')
      : '';
    const act = (key) =>
      `<select onchange="${set(key)}=this.value">${opts(Object.entries(ACTIONS), d[key])}</select>`;
    A.drawer(
      policies.get(d.id) ? '修改防护策略' : '新建自定义策略',
      `<div class="gr-config">
      ${field('策略名称 *', `<input maxlength="80" value="${E(d.name)}" ${d.isStandard ? 'disabled' : ''} oninput="${set('name')}=this.value">`)}
      ${field('检测位置', `<select ${stages.length === 1 ? 'disabled' : ''} onchange="${set('stage')}=this.value">${opts(stages, d.stage)}</select>`)}
      ${catList ? field('风险类别', `<div class="dp-category-grid">${catList}</div>`) : ''}
      ${field(custom ? '引用规则 *' : '补充规则（可选）', `<div class="dp-category-grid">${ruleList || '<p class="muted">规则库为空</p>'}</div>`)}
      ${
        custom
          ? field(
              '规则组合',
              `<select onchange="${set('ruleOperator')}=this.value">${opts(
                [
                  ['OR', '任一命中'],
                  ['AND', '全部命中'],
                ],
                d.ruleOperator,
              )}</select>`,
            )
          : ''
      }
      <div class="form-grid">${field('待确认时', act('controversialAction'))}${field('不安全时', act('unsafeAction'))}</div>
      <label class="cs-checkbox"><input type="checkbox" ${d.reviewControversial ? 'checked' : ''} onchange="${set('reviewControversial')}=this.checked"><span>待确认内容进入复核工作台</span></label>
      <label class="cs-checkbox"><input type="checkbox" ${d.enabled ? 'checked' : ''} onchange="${set('enabled')}=this.checked"><span>启用策略</span></label>
      <p class="field-help">发布后生成新版本。已绑定的应用立即使用新版本，历史记录保留当时的版本号。</p>
      <p id="guard-policy-error" class="error-message" role="alert"></p></div>`,
      `<button class="btn" onclick="App.closeDrawer()">取消</button><button class="btn primary" onclick="App.guard.policyViews.save()">发布</button>`,
    );
  };
  V.toggle = function (key, value, on) {
    const list = arr(V.draft[key]).filter((v) => v !== value);
    if (on) list.push(value);
    V.draft[key] = list;
  };
  V.save = function () {
    const r = policies.save(V.draft);
    if (r.error) {
      document.getElementById('guard-policy-error').textContent = r.error;
      return false;
    }
    A.closeDrawer();
    redraw();
    A.toast('已发布 V' + r.revisions.at(-1).version);
    return true;
  };
  /* 规则保存：校验后整体替换，版本号递增。已发布策略里的规则快照不受影响，重新发布策略后才生效。 */
  rules.save ||= function (draft) {
    const d = copy(draft);
    if (!String(d.name || '').trim() || d.name.length > 80)
      return { error: '请填写 1–80 字的名称' };
    if (rules.store().some((r) => r.id !== d.id && r.name.trim() === d.name.trim()))
      return { error: '已有同名规则' };
    if (d.type === 'word') {
      d.words = [
        ...new Set(
          arr(d.words)
            .map((w) => String(w).trim())
            .filter(Boolean),
        ),
      ];
      if (!d.words.length) return { error: '请至少填写一个词条' };
    } else {
      d.patterns = arr(d.patterns)
        .map((p) => String(p).trim())
        .filter(Boolean);
      if (!d.patterns.length) return { error: '请至少填写一条正则' };
      const bad = d.patterns.map((p) => detectors.rules.regexError(p)).find(Boolean);
      if (bad) return { error: bad };
    }
    const old = rules.get(d.id);
    d.version = (old?.version || 0) + 1;
    if (old) rules.store().splice(rules.store().indexOf(old), 1, d);
    else rules.store().push(d);
    G.audit('guard.rule.save', d.id, '保存规则：' + d.name, { version: d.version });
    A.save();
    return d;
  };

  V.ruleDetail = function (id) {
    const r = rules.get(id);
    if (!r) return;
    const refs = policies.all().filter((p) => arr(p.ruleIds).includes(id));
    A.drawer(
      (r.type === 'word' ? '词库 · ' : '规则 · ') + E(r.name),
      `<div class="cs-rule-detail">${kv('类型', r.type === 'word' ? '词库' : '正则规则')}${kv('命中判定', E(G.VERDICTS[r.risk] || r.risk))}${kv('状态', r.enabled ? '启用' : '停用')}${kv('版本', 'V' + (r.version || 1))}
      ${r.description ? `<p>${E(r.description)}</p>` : ''}
      <h3>${r.type === 'word' ? '词条' : '正则'}</h3><p class="mono">${E((r.type === 'word' ? arr(r.words) : arr(r.patterns)).join('\n'))}</p>
      ${kv('引用策略', E(refs.map((p) => p.name).join('、') || '无'))}</div>`,
      `<button class="btn" onclick="App.closeDrawer()">关闭</button><button class="btn primary" data-id="${E(id)}" onclick="App.guard.policyViews.ruleEdit(this.dataset.id)">编辑</button>`,
    );
  };
  V.ruleEdit = function (id, type = 'regex') {
    const r = id && rules.get(id);
    V.ruleDraft = r
      ? copy(r)
      : {
          id: G.uid('rule'),
          name: '',
          type,
          risk: 'Unsafe',
          enabled: true,
          description: '',
          caseSensitive: false,
          ...(type === 'word'
            ? { words: [], matchMode: 'contains' }
            : { patterns: [], patternMode: 'any' }),
        };
    const d = V.ruleDraft,
      word = d.type === 'word',
      list = (word ? arr(d.words) : arr(d.patterns)).join('\n'),
      setR = (k) => `App.guard.policyViews.ruleDraft.${k}`;
    A.drawer(
      (r ? '编辑' : '新建') + (word ? '词库' : '规则'),
      `<div class="gr-config">
      ${field('名称 *', `<input maxlength="80" value="${E(d.name)}" oninput="${setR('name')}=this.value">`)}
      ${field('说明', `<input maxlength="200" value="${E(d.description || '')}" oninput="${setR('description')}=this.value">`)}
      ${field(word ? '词条 *（每行一个）' : '正则 *（每行一条）', `<textarea rows="6" oninput="${setR(word ? 'words' : 'patterns')}=this.value.split('\\n')">${E(list)}</textarea>`, word ? '' : '不支持回溯引用，分组请用 (?:…)。')}
      <div class="form-grid">${field(
        '命中判定',
        `<select onchange="${setR('risk')}=this.value">${opts(
          [
            ['Unsafe', '不安全'],
            ['Controversial', '待确认'],
          ],
          d.risk,
        )}</select>`,
      )}
      ${
        word
          ? field(
              '匹配方式',
              `<select onchange="${setR('matchMode')}=this.value">${opts(
                [
                  ['contains', '包含'],
                  ['exact', '完全一致'],
                  ['prefix', '开头'],
                  ['suffix', '结尾'],
                ],
                d.matchMode,
              )}</select>`,
            )
          : field(
              '多条正则',
              `<select onchange="${setR('patternMode')}=this.value">${opts(
                [
                  ['any', '任一命中'],
                  ['all', '全部命中'],
                ],
                d.patternMode,
              )}</select>`,
            )
      }</div>
      <label class="cs-checkbox"><input type="checkbox" ${d.enabled ? 'checked' : ''} onchange="${setR('enabled')}=this.checked"><span>启用</span></label>
      <p class="field-help">引用此规则的策略需重新发布后才使用新内容。</p>
      <p id="guard-rule-error" class="error-message" role="alert"></p></div>`,
      `<button class="btn" onclick="App.closeDrawer()">取消</button><button class="btn primary" onclick="App.guard.policyViews.ruleSave()">保存</button>`,
    );
  };
  V.ruleSave = function () {
    const r = rules.save(V.ruleDraft);
    if (r.error) {
      document.getElementById('guard-rule-error').textContent = r.error;
      return false;
    }
    A.closeDrawer();
    redraw();
    A.toast('已保存');
    return true;
  };
};
