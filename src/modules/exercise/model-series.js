/* exercise/model-series。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/model-series'] = function () {
  /* User-managed comparison labels are separate from service model identifiers. */
  (function () {
    'use strict';
    const A = window.App,
      C = A.connections,
      X = A.attack,
      E = A.escape;
    const guardId = 'system-qwen3guard';
    C.seriesCatalog = [
      { developer: 'Qwen', families: ['Qwen2.5', 'Qwen3'] },
      { developer: 'DeepSeek', families: ['DeepSeek-V3', 'DeepSeek-R1'] },
      { developer: 'OpenAI', families: ['GPT-4o', 'GPT-4.1', 'GPT-5', 'o3', 'o4-mini'] },
      { developer: 'Anthropic', families: ['Claude 3.5', 'Claude 3.7', 'Claude 4'] },
      { developer: 'Google', families: ['Gemini 2.0', 'Gemini 2.5', 'Gemma 3'] },
      { developer: 'Meta', families: ['Llama 3.1', 'Llama 3.2', 'Llama 3.3'] },
      { developer: 'Zhipu', families: ['GLM-4', 'GLM-4.5'] },
      { developer: 'Moonshot', families: ['Kimi', 'Kimi K2'] },
      { developer: 'ByteDance', families: ['Doubao'] },
    ];
    C.seriesPresets = C.seriesCatalog.flatMap((g) => g.families);
    // Display taxonomy for old metadata; never a claim about underlying weights.
    const key = (v) =>
      String(v || '')
        .trim()
        .toLocaleLowerCase();
    const developerAliases = {
      阿里巴巴: 'Qwen',
      Alibaba: 'Qwen',
      深度求索: 'DeepSeek',
      智谱: 'Zhipu',
      月之暗面: 'Moonshot',
      字节跳动: 'ByteDance',
    };
    C.normalizeDeveloper = (value) =>
      developerAliases[String(value || '').trim()] || String(value || '').trim();
    C.normalizeFamily = function (value) {
      const s = String(value || '').trim();
      if (/^Llama[-_]\d+(?:\.\d+)?$/i.test(s)) return s.replace(/[-_]/, ' ');
      if (s === 'Doubao（豆包）') return 'Doubao';
      return s;
    };
    C.developerOf = function (m) {
      if (m?.modelDeveloper) return C.normalizeDeveloper(m.modelDeveloper);
      const family = C.normalizeFamily(
        m?.comparisonGroup || m?.family || m?.identity?.family || C.identify(m?.model).family,
      );
      const preset = C.seriesCatalog.find((g) => g.families.some((f) => key(f) === key(family)));
      if (preset) return preset.developer;
      for (const [pattern, developer] of [
        [/^Qwen/i, 'Qwen'],
        [/^DeepSeek/i, 'DeepSeek'],
        [/^(GPT|o[134](?:-|$))/i, 'OpenAI'],
        [/^Claude/i, 'Anthropic'],
        [/^(Gemini|Gemma)/i, 'Google'],
        [/^Llama/i, 'Meta'],
        [/^GLM/i, 'Zhipu'],
        [/^Kimi/i, 'Moonshot'],
        [/^Doubao/i, 'ByteDance'],
      ])
        if (pattern.test(family)) return developer;
      return '';
    };
    C.comparisonVersion = (m) => String(m?.versionLabel || m?.model || '').trim();
    C.seriesChoices = function () {
      const groups = C.seriesCatalog.map((g) => ({
        developer: g.developer,
        families: [...g.families],
      }));
      for (const name of X.db.modelDevelopers || [])
        if (!groups.some((g) => key(g.developer) === key(name)))
          groups.push({ developer: name, families: [] });
      for (const m of [
        ...(X.db.modelSeries || []),
        ...C.db.filter((m) => !m.systemGuard && m.kind !== 'agent'),
      ]) {
        const family = C.normalizeFamily(m.family || C.identity(m).family),
          developer = C.developerOf(m);
        if (!family || family === 'Qwen3Guard' || !developer) continue;
        let group = groups.find((g) => key(g.developer) === key(developer));
        if (!group) {
          group = { developer, families: [] };
          groups.push(group);
        }
        if (!group.families.some((f) => key(f) === key(family))) group.families.push(family);
      }
      return groups;
    };
    C.rememberSeries = function (m) {
      if (m.kind === 'agent' || m.systemGuard || !m.comparisonGroup || !m.modelDeveloper) return;
      X.db.modelSeries ||= [];
      if (
        !X.db.modelSeries.some(
          (s) =>
            key(s.family) === key(m.comparisonGroup) &&
            key(C.developerOf(s)) === key(m.modelDeveloper),
        )
      )
        X.db.modelSeries.push({ family: m.comparisonGroup, modelDeveloper: m.modelDeveloper });
    };
    const identity = C.identity;
    C.identity = function (m) {
      const old = identity(m),
        family = m?.comparisonGroup || old.family || '';
      return {
        ...old,
        family: C.normalizeFamily(family),
        modelDeveloper: C.developerOf(m),
        version: m?.comparisonGroup ? C.comparisonVersion(m) : old.version || '',
        source: m?.comparisonGroup ? 'asset-label' : old.source,
        seriesSchema: 3,
      };
    };
    C.resultIdentity = function (t) {
      const meta = t.targetMeta || {};
      return { ...meta, family: C.normalizeFamily(meta.family), version: meta.version || '' };
    };
    C.captureComparison = function () {
      const d = C.draft;
      if (!d || d.kind === 'agent') return;
      const input = document.getElementById('c-name');
      if (input) d.name = input.value;
      if (d.systemGuard) {
        d.comparisonGroup = 'Qwen3Guard';
        d.modelDeveloper = 'Qwen';
        d.name = 'Qwen3Guard-Gen-4B';
      }
      d.comparisonGroup = (d.comparisonGroup || '').trim();
      d.name = (d.name || '').trim();
      d.versionLabel = '';
      d.seriesSchema = 4;
      d.identity = {
        ...C.identify(d.model, d.deploymentRevision),
        family: d.comparisonGroup,
        modelDeveloper: d.modelDeveloper,
        version: C.comparisonVersion(d),
        source: 'asset-label',
        seriesSchema: 4,
      };
    };
    C.comparisonInput = function () {
      C.captureComparison();
    };
    C.seriesLabel = (d) =>
      d.comparisonGroup
        ? [d.modelDeveloper, d.comparisonGroup].filter(Boolean).join(' / ')
        : '先选择厂商，再选择系列';
    C.seriesMenuHTML = function (d) {
      const groups = C.seriesChoices(),
        index = groups.findIndex((g) => g.developer === d.seriesBrowse),
        group = groups[index];
      return `<div class="series-column"><div class="series-column-title">厂商 / 品牌</div><div class="series-options" id="c-developer-options">${groups.map((g, i) => `<button type="button" id="c-developer-${i}" aria-pressed="${i === index}" onclick="App.connections.browseDeveloper(${i})"><span>${E(g.developer)}</span><span aria-hidden="true">›</span></button>`).join('')}<button type="button" id="c-add-developer" class="series-inline-add" onclick="App.connections.addSeries(true)">自定义</button></div></div><div class="series-column"><div class="series-column-title">${group ? E(group.developer) + ' · 模型系列' : '模型系列'}</div><div class="series-options" id="c-family-options">${group ? group.families.map((f, i) => `<button type="button" id="c-family-${i}" aria-pressed="${d.modelDeveloper === group.developer && d.comparisonGroup === f}" onclick="App.connections.chooseSeries(${index},${i})">${E(f)}</button>`).join('') + '<button type="button" id="c-add-family" class="series-inline-add" onclick="App.connections.addSeries()">＋ 添加系列</button>' : '<p class="series-empty">请先选择左侧厂商</p>'}</div></div>`;
    };
    C.renderSeries = function () {
      const d = C.draft,
        panel = document.getElementById('c-series-panel'),
        button = document.getElementById('c-series');
      if (!d || !panel || !button) return;
      const scrolls = ['c-developer-options', 'c-family-options'].map(
        (id) => document.getElementById(id)?.scrollTop || 0,
      );
      panel.innerHTML = C.seriesMenuHTML(d);
      panel.hidden = !d.seriesMenuOpen;
      button.setAttribute('aria-expanded', String(!!d.seriesMenuOpen));
      button.classList.toggle('has-value', !!d.comparisonGroup);
      document.getElementById('c-series-value').textContent = C.seriesLabel(d);
      ['c-developer-options', 'c-family-options'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.scrollTop = scrolls[i];
      });
    };
    C.browseDeveloper = function (index) {
      const group = C.seriesChoices()[index];
      if (!group || !C.draft) return;
      C.draft.seriesBrowse = group.developer;
      C.renderSeries();
      const options = document.getElementById('c-family-options');
      if (options) options.scrollTop = 0;
      document.getElementById('c-developer-' + index)?.focus();
    };
    C.chooseSeries = function (groupIndex, familyIndex) {
      const group = C.seriesChoices()[groupIndex],
        family = group?.families[familyIndex];
      if (!family || !C.draft) return;
      Object.assign(C.draft, {
        modelDeveloper: group.developer,
        comparisonGroup: family,
        seriesMenuOpen: false,
      });
      C.captureComparison();
      C.renderSeries();
      document.getElementById('c-series')?.focus();
    };
    C.closeSeries = function (focus = false) {
      if (!C.draft?.seriesMenuOpen) return;
      C.draft.seriesMenuOpen = false;
      const panel = document.getElementById('c-series-panel');
      if (panel) panel.hidden = true;
      document.getElementById('c-series')?.setAttribute('aria-expanded', 'false');
      if (focus) document.getElementById('c-series')?.focus();
    };
    C.addSeries = function (newDeveloper = false) {
      const d = C.draft;
      if (!d || (!newDeveloper && !d.seriesBrowse)) return;
      C.capture();
      d.taxonomyDraft = { kind: newDeveloper ? 'developer' : 'family', parent: d.seriesBrowse };
      C.closeSeries();
      const host = document.getElementById('c-taxonomy-popover');
      if (!host) return;
      host.innerHTML = `<section role="dialog" aria-labelledby="c-taxonomy-title" class="taxonomy-editor"><h3 id="c-taxonomy-title">${newDeveloper ? '自定义厂商' : '添加模型系列'}</h3>${newDeveloper ? '' : `<p class="taxonomy-parent">厂商：${E(d.seriesBrowse)}</p>`}<label for="c-taxonomy-name">${newDeveloper ? '厂商名称' : '系列名称'} *</label><input id="c-taxonomy-name" maxlength="80" autocomplete="off" placeholder="${newDeveloper ? '输入厂商或研发团队名称' : '输入模型系列名称'}" onkeydown="if(event.key==='Enter'){event.preventDefault();App.connections.confirmTaxonomy()}"><p id="c-taxonomy-error" class="error-message" role="alert"></p><div class="taxonomy-actions"><button type="button" class="btn" onclick="App.connections.cancelTaxonomy()">取消</button><button type="button" class="btn primary" onclick="App.connections.confirmTaxonomy()">确定</button></div></section>`;
      host.hidden = false;
      document.getElementById('c-taxonomy-name')?.focus();
    };
    C.cancelTaxonomy = function () {
      const d = C.draft;
      if (!d?.taxonomyDraft) return;
      const kind = d.taxonomyDraft.kind;
      delete d.taxonomyDraft;
      const host = document.getElementById('c-taxonomy-popover');
      if (host) {
        host.hidden = true;
        host.innerHTML = '';
      }
      d.seriesMenuOpen = true;
      C.renderSeries();
      document.getElementById(kind === 'developer' ? 'c-add-developer' : 'c-add-family')?.focus();
    };
    C.confirmTaxonomy = function () {
      const d = C.draft,
        t = d?.taxonomyDraft;
      if (!t) return;
      const input = document.getElementById('c-taxonomy-name'),
        raw = input?.value.trim() || '',
        value = t.kind === 'developer' ? C.normalizeDeveloper(raw) : raw;
      const group = C.seriesChoices().find((g) => key(g.developer) === key(t.parent)),
        duplicate =
          t.kind === 'developer'
            ? C.seriesChoices().some((g) => key(g.developer) === key(value))
            : group?.families.some((f) => key(f) === key(value));
      const error = !value
        ? '请填写' + (t.kind === 'developer' ? '厂商名称' : '系列名称')
        : value.length > 80
          ? '名称不能超过 80 个字符'
          : duplicate
            ? t.kind === 'developer'
              ? '该厂商已存在，请直接选择'
              : '该厂商下已存在此系列，请直接选择'
            : '';
      if (error) {
        document.getElementById('c-taxonomy-error').textContent = error;
        input?.focus();
        return;
      }
      if (t.kind === 'developer') {
        X.db.modelDevelopers ||= [];
        X.db.modelDevelopers.push(value);
        d.seriesBrowse = value;
      } else {
        X.db.modelSeries ||= [];
        X.db.modelSeries.push({ family: value, modelDeveloper: t.parent });
        Object.assign(d, {
          modelDeveloper: t.parent,
          comparisonGroup: value,
          seriesBrowse: t.parent,
        });
        C.captureComparison();
      }
      delete d.taxonomyDraft;
      const host = document.getElementById('c-taxonomy-popover');
      if (host) {
        host.hidden = true;
        host.innerHTML = '';
      }
      d.seriesMenuOpen = true;
      A.save();
      C.renderSeries();
      const groups = C.seriesChoices(),
        index = groups.findIndex((g) => g.developer === d.seriesBrowse),
        id =
          t.kind === 'developer'
            ? 'c-developer-' + index
            : 'c-family-' + groups[index].families.indexOf(value);
      document.getElementById(id)?.focus();
    };
    document.addEventListener('click', (event) => {
      if (!event.composedPath().some((node) => node.classList?.contains('series-cascader')))
        C.closeSeries();
    });
    document.addEventListener(
      'keydown',
      (event) => {
        const d = C.draft;
        if (event.key === 'Escape' && (d?.taxonomyDraft || d?.seriesMenuOpen)) {
          event.preventDefault();
          event.stopPropagation();
          if (d.taxonomyDraft) C.cancelTaxonomy();
          else C.closeSeries(true);
        }
        if (event.key === 'Tab' && d?.taxonomyDraft) {
          const items = [
              ...document.querySelectorAll('#c-taxonomy-popover input,#c-taxonomy-popover button'),
            ],
            first = items[0],
            last = items.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
          event.stopPropagation();
        }
      },
      true,
    );
    C.comparisonForm = function (d) {
      if (d.kind === 'agent') return '';
      return `<div class="field"><label for="c-name">模型名称 *</label><input id="c-name" maxlength="120" value="${E(d.name || '')}" placeholder="如：Qwen2.5-72B-Instruct" required oninput="App.connections.comparisonInput()"></div>`;
    };
    const form = C.form;
    C.identityHTML = function (m) {
      return `<div class="model-identity"><strong>${E(m?.name || m?.model || '未命名模型')}</strong></div>`;
    };
    const snap = X.connectionSnapshot;
    X.connectionSnapshot = function (m) {
      const s = snap(m);
      return s
        ? {
            ...s,
            comparisonGroup: m.comparisonGroup || '',
            versionLabel: m.versionLabel || '',
            modelDeveloper: m.modelDeveloper || '',
            seriesSchema: m.seriesSchema || 1,
          }
        : s;
    };
    const eligible = C.eligible;
    const init = A.modules.attack.init;
    A.modules.attack.init = function () {
      init.apply(this, arguments);
      if (!C.db.some((m) => m.id === guardId))
        C.db.push({
          id: guardId,
          kind: 'model',
          systemGuard: true,
          name: 'Qwen3Guard · Gen-4B',
          model: 'Qwen/Qwen3Guard-Gen-4B',
          comparisonGroup: 'Qwen3Guard',
          versionLabel: 'Gen-4B',
          hosting: 'local',
          auth: 'bearer',
          endpoint: '',
          schema: 3,
          accessType: 'api',
          protocol: 'openai',
          sample: false,
          presetPending: true,
          connectStatus: 'pending',
          caps: ['text', 'chat'],
          uses: ['guard'],
          timeout: 60,
        });
    };
    const remove = C.remove;
    const models = X.models;
    const blueSnapshot = X.blueSnapshot;
    X.blueSnapshot = function (w) {
      const b = blueSnapshot(w);
      if (w.defenseMode === 'qwen3guard') {
        const m = C.db.find((m) => m.id === guardId);
        if (m) b.model = { ...X.connectionSnapshot(m), name: 'Qwen3Guard-Gen-4B', system: true };
      }
      return b;
    };
  })();
};
