/* exercise/asset-navigation。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/asset-navigation'] = function () {
  /* Pick connected assets by taxonomy, retaining the connection ID as the task identity. */
  (function () {
    'use strict';
    const A = window.App,
      C = A.connections,
      X = A.attack,
      B = A.banks,
      E = A.escape,
      I = A.icon;
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    const sorted = (values) => [...new Set(values)].sort(collator.compare);
    // Normalize old seeded display categories only; never infer a checkpoint revision.
    const assetIdentity = C.identity;
    C.identity = function (m) {
      const v = assetIdentity(m);
      if (m?.comparisonGroup) return v;
      const family =
        m?.model?.toLowerCase() === 'deepseek-v3.2'
          ? 'DeepSeek-V3'
          : C.seriesPresets.find((f) => f.toLowerCase() === v.family?.toLowerCase()) || v.family;
      return { ...v, family };
    };
    const developer = (m) => C.developerOf(m) || '其他厂商';
    const family = (m) => C.identity(m).family || '未分组';
    C.assetTaxonomy = (m) => ({ developer: developer(m), family: family(m) });
    C.assetPickers = {};
    const fieldFor = (role) => (role === 'target' ? 'model' : role);
    C.pickerState = function (role, id, value) {
      let s = C.assetPickers[id];
      if (!s || s.value !== value) {
        const m = C.db.find((m) => m.id === value);
        s = C.assetPickers[id] = {
          role,
          value,
          open: false,
          developer: m ? developer(m) : '',
          family: m ? family(m) : '',
        };
      }
      return s;
    };
    C.positionAssetPicker = function (id) {
      const host = document.getElementById(id + '-picker'),
        panel = document.getElementById(id + '-panel'),
        bounds = host?.getBoundingClientRect?.(),
        card = host?.closest?.('.modal-panel')?.getBoundingClientRect?.();
      if (!panel || !Number.isFinite(bounds?.left)) return;
      const left = Math.max(16, (card?.left || 0) + 16),
        right = Math.min(window.innerWidth - 16, (card?.right || window.innerWidth) - 16),
        width = Math.min(360, right - left),
        x = Math.max(left, Math.min(bounds.left, right - width));
      panel.style.width = width + 'px';
      panel.style.maxWidth = 'none';
      panel.style.left = x - bounds.left + 'px';
      panel.style.right = 'auto';
      const above =
        window.innerHeight - bounds.bottom < 230 && bounds.top - Math.max(0, card?.top || 0) > 230;
      panel.style.top = above ? 'auto' : 'calc(100% + 6px)';
      panel.style.bottom = above ? 'calc(100% + 6px)' : 'auto';
    };
    C.renderAssetPicker = function (id) {
      const host = document.getElementById(id + '-picker'),
        s = C.assetPickers[id];
      if (host && s) {
        host.innerHTML = C.assetPickerContent(s, id);
        if (s.open) C.positionAssetPicker(id);
      }
    };
    C.closeAssetPickers = function (focus = false) {
      for (const [id, s] of Object.entries(C.assetPickers)) {
        if (!s.open) continue;
        s.open = false;
        document.getElementById(id + '-panel')?.setAttribute('hidden', '');
        document.getElementById(id)?.setAttribute('aria-expanded', 'false');
        if (focus) document.getElementById(id)?.focus();
      }
    };
    C.toggleAssetPicker = function (id) {
      const s = C.assetPickers[id];
      if (!s) return;
      const open = !s.open;
      C.closeAssetPickers();
      s.open = open;
      C.renderAssetPicker(id);
      document.getElementById(id)?.focus();
    };
    C.chooseAsset = function (id, index) {
      const s = C.assetPickers[id],
        m = s?.models[index];
      if (!m || !C.assetCandidates(s.role).some((x) => x.id === m.id)) return;
      X.wizard[fieldFor(s.role)] = m.id;
      s.value = m.id;
      s.open = false;
      if (s.role === 'target') X.wizard.targetKind = 'model';
      C.renderAssetPicker(id);
      document.getElementById(id)?.focus();
    };
    document.addEventListener('click', (e) => {
      if (!e.composedPath().some((node) => node.classList?.contains('asset-picker')))
        C.closeAssetPickers();
    });
    document.addEventListener('focusin', (e) => {
      if (!e.target.closest?.('.asset-picker')) C.closeAssetPickers();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && Object.values(C.assetPickers).some((s) => s.open)) {
        e.preventDefault();
        C.closeAssetPickers(true);
      }
    });
    const roleSelect = C.roleSelect;
    C.roleSelect = function (role, value, id, onchange) {
      return /^task-(attacker|judge)$/.test(id)
        ? C.assetPicker(role, value, id)
        : roleSelect.call(C, role, value, id, onchange);
    };
    C.taskTargetPicker = function (w) {
      w.targetKind = 'model';
      return `<div class="field">${C.assetPicker('target', w.model, 'task-model')}</div>`;
    };
    const newTask = X.newTask;
    X.newTask = function () {
      C.assetPickers = {};
      newTask.apply(X, arguments);
      const w = X.wizard;
      const attackers = C.assetCandidates('attacker');
      if (!attackers.some((m) => m.id === w.attacker)) w.attacker = attackers[0]?.id || '';
    };

    X.assetFilters = { developer: '', family: '' };
    X.assetFilterChoices = function () {
      const models = C.db.filter((m) => m.kind !== 'agent'),
        s = X.assetFilters;
      return {
        developers: sorted(models.map(developer)),
        families: sorted(
          models.filter((m) => !s.developer || developer(m) === s.developer).map(family),
        ),
      };
    };
    X.assetRows = function () {
      return C.db.filter((m) => (m.kind || 'model') === (X.connectionKind || 'model'));
    };
    X.models = function () {
      const kind = 'model',
        s = X.assetFilters,
        options = X.assetFilterChoices();
      X.connectionKind = kind;
      const items = X.assetRows();
      const optionsHTML = (values, selected) =>
        values
          .map(
            (v) => `<option value="${E(v)}" ${v === selected ? 'selected' : ''}>${E(v)}</option>`,
          )
          .join('');
      return `<div class="page-heading"><div><h1>模型资产</h1><span class="muted page-desc">共 ${items.length} 个模型</span></div><div class="page-actions"><button class="btn primary" onclick="App.connections.open()">${I('plus', 14)}接入模型</button></div></div><div class="attack-model-grid">${
        items
          .map((m) => {
            const st = C.connState(m),
              vendor = C.developerOf(m) || m.vendor || '';
            return `<article class="card attack-model-card"><div class="attack-model-head"><span class="model-mark">${I('box', 19)}</span><div class="attack-model-title"><strong>${E(m.name || m.model)}</strong></div><span class="badge ${st.tone} connection-state${st.testing ? ' testing' : ''}">${E(st.label)}</span></div><div class="attack-model-actions"><button class="model-action" title="编辑" aria-label="编辑 ${E(m.name)}" data-id="${E(m.id)}" onclick="App.connections.open(this.dataset.id)">${I('edit', 16)}</button><button class="model-action" title="测试连接" aria-label="测试 ${E(m.name)}" data-id="${E(m.id)}" onclick="App.connections.test(this.dataset.id)">${I('zap', 16)}</button>${m.systemGuard ? '' : `<button class="entry-delete" title="删除" aria-label="删除 ${E(m.name)}" data-id="${E(m.id)}" onclick="App.connections.remove(this.dataset.id)" type="button">删除</button>`}</div><div class="ar-model-links">${A.applicationAssets?.inline('models', m.id) || ''}<button class="link-btn" data-key="${E('models:' + m.id)}" onclick="App.applicationAssets.editAsset(this.dataset.key)">关联应用</button></div></article>`;
          })
          .join('') || '<div class="empty">暂无符合条件的资产</div>'
      }</div>`;
    };
  })();
};
