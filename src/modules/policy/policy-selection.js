/* policy/policy-selection。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['policy/policy-selection'] = function () {
  /* Classified multi-select controls keep resource selection beside its parameters. */
  (function () {
    'use strict';
    const A = window.App,
      P = A.policies,
      B = A.banks,
      E = A.escape;
    P.selection = { methods: { group: '', scope: '' }, banks: { group: '', scope: '' } };
    const edit = P.edit;
    P.edit = function () {
      P.selection = { methods: { group: '', scope: '' }, banks: { group: '', scope: '' } };
      return edit.apply(P, arguments);
    };
    P.selectionRows = function (kind) {
      if (kind === 'banks')
        return B.db.map((b) => ({
          ...b,
          group: B.industryLabel(b.industry),
          scope: b.builtin ? 'builtin' : 'custom',
        }));
      const rows = P.methods().map((m) => ({
        ...m,
        group: m.family || '其他',
        scope: m.turns || '单轮',
      }));
      for (const entry of P.draft?.methods || [])
        if (!rows.some((m) => m.id === entry.id)) {
          const m = P.method(entry.id);
          rows.push({
            ...m,
            id: entry.id,
            name: m?.name || entry.id,
            group: '历史配置',
            scope: m?.turns || '单轮',
            blocked: m?.blocked || '该方法已不可用于新策略',
          });
        }
      return rows;
    };
    P.selectionContent = function (kind) {
      const state = P.selection[kind],
        methods = kind === 'methods',
        all = P.selectionRows(kind);
      const groups = [
        ...new Set(methods ? [...P.methodFamilies, ...all.map((r) => r.group)] : B.industries()),
      ];
      const rows = all.filter(
        (r) =>
          (!state.group || r.group === state.group) && (!state.scope || r.scope === state.scope),
      );
      const scopes = methods
        ? [
            ['', '全部轮次'],
            ['单轮', '单轮'],
            ['多轮', '多轮'],
          ]
        : [
            ['', '全部来源'],
            ['builtin', '系统题库'],
            ['custom', '自建题库'],
          ];
      return `<div class="ps-picker-body"><nav class="ps-picker-groups" aria-label="${methods ? '攻击方法技术路线' : '题库行业'}">${[['', methods ? '全部技术路线' : '全部行业'], ...groups.map((g) => [g, g])].map(([id, label]) => `<button type="button" class="${state.group === id ? 'active' : ''}" data-kind="${kind}" data-value="${E(id)}" aria-pressed="${state.group === id}" onclick="App.policies.selectGroup(this.dataset.kind,'group',this.dataset.value)"><span>${E(label)}</span><small>${all.filter((r) => !id || r.group === id).length}</small></button>`).join('')}</nav><div class="ps-picker-options"><div class="ps-picker-scopes" aria-label="${methods ? '交互轮次' : '题库来源'}">${scopes.map(([id, label]) => `<button type="button" class="${state.scope === id ? 'active' : ''}" data-kind="${kind}" data-value="${E(id)}" aria-pressed="${state.scope === id}" onclick="App.policies.selectGroup(this.dataset.kind,'scope',this.dataset.value)">${label}</button>`).join('')}</div><div class="ps-choice-grid">${
        rows
          .map((r) => {
            const checked = methods
                ? P.draft.methods.some((m) => m.id === r.id)
                : P.draft.bankIds.includes(r.id),
              blocked = methods ? r.blocked : !r.items?.length;
            const desc = methods
              ? r.summary || r.tagline || r.description || r.flow || ''
              : '';
            return `<label class="ps-choice ${checked ? 'selected' : ''} ${blocked ? 'unavailable' : ''}" title="${E(methods ? r.blocked || desc || r.name : r.name)}"><input type="checkbox" data-id="${E(r.id)}" ${checked ? 'checked' : ''} ${blocked && !checked ? 'disabled' : ''} onchange="App.policies.${methods ? 'toggleMethod' : 'toggleBank'}(this.dataset.id,this.checked)"><span>${E(r.name)}</span>${methods && desc ? `<em class="ps-choice-desc">${E(desc)}</em>` : ''}<small>${methods ? (blocked ? '待接入' : '') : r.items.length + ' 题'}</small></label>`;
          })
          .join('') || '<p class="ps-empty">该分类下暂无可选内容</p>'
      }</div></div></div>`;
    };
    P.selectionSummary = (kind) =>
      kind === 'methods'
        ? P.draft.methods.length
          ? '已选择 ' + P.draft.methods.length + ' 种攻击方法'
          : '请选择攻击方法'
        : P.draft.bankIds.length
          ? '已选择 ' + P.draft.bankIds.length + ' 套攻击题库'
          : '请选择攻击题库';
    P.selectionHTML = function (kind) {
      return `<details class="ps-picker" id="policy-${kind}-picker"><summary><span id="policy-${kind}-summary">${P.selectionSummary(kind)}</span><span class="ps-picker-arrow" aria-hidden="true">⌄</span></summary><div id="policy-${kind}-options">${P.selectionContent(kind)}</div></details>`;
    };
    P.selectGroup = function (kind, key, value) {
      if (!['methods', 'banks'].includes(kind) || !['group', 'scope'].includes(key)) return;
      P.selection[kind][key] = value;
      const host = document.getElementById('policy-' + kind + '-options');
      if (host) host.innerHTML = P.selectionContent(kind);
    };
    // 选中的方法展开为内联配置（参照“复制为新策略”：行内展开基础参数+依赖模型，不再弹窗套弹窗）。
    P.methodExpanded = P.methodExpanded || {};
    P.selectedMethodsHTML = function () {
      if (!P.draft.methods.length)
        return '<p class="ps-method-empty">尚未选择攻击方法。勾选上方方法后将在此展开参数配置。</p>';
      return (
        '<ul class="ps-selected-methods">' +
        P.draft.methods
          .map((entry) => {
            const m = P.method(entry.id),
              name = m?.name || entry.id,
              desc = m?.summary || m?.tagline || m?.description || m?.flow || '',
              open = !!P.methodExpanded[entry.id];
            return `<li class="ps-selected-row ${open ? 'expanded' : ''}"><div class="ps-selected-head"><div class="ps-selected-info"><strong>${E(name)}</strong>${desc ? `<small>${E(desc)}</small>` : ''}</div><div class="ps-selected-actions"><button type="button" class="link-btn" data-id="${E(entry.id)}" aria-expanded="${open}" onclick="App.policies.toggleMethodConfig(this.dataset.id)">${open ? '收起' : '配置'}</button><button type="button" class="link-btn" data-id="${E(entry.id)}" aria-label="移除攻击方法 ${E(name)}" onclick="App.policies.toggleMethod(this.dataset.id,false)">移除</button></div></div>${open ? `<div class="ps-selected-config" id="policy-parameters-${E(entry.id)}">${P.parameterFor(entry)}</div>` : ''}</li>`;
          })
          .join('') +
        '</ul>'
      );
    };
    P.toggleMethodConfig = function (id) {
      P.methodExpanded[id] = !P.methodExpanded[id];
      P.refreshSelection('methods');
    };
    // 兼容旧调用：改为内联展开，不再弹窗。
    P.methodConfigModal = function (id) {
      P.methodExpanded[id] = true;
      P.refreshSelection('methods');
    };
    // 选中的题库内联展开子集选择：全部 / 前 N 题（N 可自定义）。
    P.bankExpanded = P.bankExpanded || {};
    P.selectedBanksHTML = function () {
      const d = P.draft;
      d.bankLimits = d.bankLimits || {};
      if (!d.bankIds.length)
        return '<p class="ps-method-empty">尚未选择攻击题库。勾选上方题库后可在此选择全部或前 N 题。</p>';
      return (
        '<ul class="ps-selected-methods ps-selected-banks-list">' +
        d.bankIds
          .map((id) => {
            const b = B.get(id),
              total = b?.items?.length || 0,
              lim = d.bankLimits[id],
              useAll = !lim || lim >= total,
              open = !!P.bankExpanded[id],
              scopeLabel = useAll ? '全部 ' + total + ' 题' : '前 ' + lim + ' 题';
            return `<li class="ps-selected-row ${open ? 'expanded' : ''}"><div class="ps-selected-head"><div class="ps-selected-info"><strong>${E(b?.name || id)}</strong><small>${scopeLabel} · 共 ${total} 题</small></div><div class="ps-selected-actions"><button type="button" class="link-btn" data-id="${E(id)}" aria-expanded="${open}" onclick="App.policies.toggleBankConfig(this.dataset.id)">${open ? '收起' : '选择题量'}</button><button type="button" class="link-btn" data-id="${E(id)}" aria-label="移除题库 ${E(b?.name || id)}" onclick="App.policies.toggleBank(this.dataset.id,false)">移除</button></div></div>${open ? `<div class="ps-selected-config ps-bank-scope"><label class="ps-bank-radio"><input type="radio" name="bank-scope-${E(id)}" ${useAll ? 'checked' : ''} data-id="${E(id)}" onchange="App.policies.setBankScope(this.dataset.id,'all')"><span>全部题目（${total} 题）</span></label><label class="ps-bank-radio"><input type="radio" name="bank-scope-${E(id)}" ${useAll ? '' : 'checked'} data-id="${E(id)}" onchange="App.policies.setBankScope(this.dataset.id,'limit')"><span>前 <input type="number" class="ps-bank-count" min="1" max="${total}" value="${useAll ? Math.min(total, 20) : lim}" data-id="${E(id)}" oninput="App.policies.setBankLimit(this.dataset.id,this.value)"> 题</span></label></div>` : ''}</li>`;
          })
          .join('') +
        '</ul>'
      );
    };
    P.toggleBankConfig = function (id) {
      P.bankExpanded[id] = !P.bankExpanded[id];
      P.refreshSelection('banks');
    };
    P.setBankScope = function (id, mode) {
      const d = P.draft,
        b = B.get(id),
        total = b?.items?.length || 0;
      d.bankLimits = d.bankLimits || {};
      if (mode === 'all') delete d.bankLimits[id];
      else d.bankLimits[id] = Math.min(total, d.bankLimits[id] || Math.min(total, 20));
      P.refreshSelection('banks');
    };
    P.setBankLimit = function (id, val) {
      const d = P.draft,
        b = B.get(id),
        total = b?.items?.length || 0,
        n = Math.max(1, Math.min(total, Number(val) || 1));
      d.bankLimits = d.bankLimits || {};
      d.bankLimits[id] = n;
      // 仅更新数值，不重渲染，避免打断输入；头部摘要在收起/展开时刷新。
    };
    P.refreshSelection = function (kind) {
      const options = document.getElementById('policy-' + kind + '-options'),
        summary = document.getElementById('policy-' + kind + '-summary'),
        selected = document.getElementById(
          kind === 'methods' ? 'policy-method-parameters' : 'policy-selected-banks',
        );
      if (options) options.innerHTML = P.selectionContent(kind);
      if (summary) summary.textContent = P.selectionSummary(kind);
      if (selected)
        selected.innerHTML = kind === 'methods' ? P.selectedMethodsHTML() : P.selectedBanksHTML();
    };
    P.toggleMethod = function (id, checked) {
      const d = P.draft,
        m = P.method(id);
      if (!d || (checked && (!m || m.blocked))) return;
      if (checked && !d.methods.some((v) => v.id === id)) {
        d.methods.push({ id, parameters: P.defaults(id), modelBindings: {} });
        // 勾选后行内展开该方法的基础参数+依赖模型（不再弹窗套弹窗）。
        P.methodExpanded[id] = true;
        P.refreshSelection('methods');
        return;
      }
      if (!checked) {
        d.methods = d.methods.filter((v) => v.id !== id);
        delete P.methodExpanded[id];
      }
      P.refreshSelection('methods');
    };
    P.toggleBank = function (id, checked) {
      const d = P.draft;
      if (!d || (checked && !B.get(id)?.items.length)) return;
      if (checked && !d.bankIds.includes(id)) {
        d.bankIds.push(id);
        P.bankExpanded[id] = true;
      }
      if (!checked) {
        d.bankIds = d.bankIds.filter((v) => v !== id);
        if (d.bankLimits) delete d.bankLimits[id];
        delete P.bankExpanded[id];
      }
      P.refreshSelection('banks');
    };
  })();
};
