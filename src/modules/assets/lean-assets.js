/* assets/lean-assets。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['assets/lean-assets'] = function () {
  /* Asset inventory and model access share one center; managed guard services stay read-only. */
  (function () {
    'use strict';
    const A = window.App,
      Q = A.assessment,
      R = A.applicationAssets,
      C = A.connections,
      M = A.modelRoles,
      X = A.attack,
      E = A.escape;
    const arr = (value) => (Array.isArray(value) ? value : []);
    const kinds = {
      applications: { name: 'AI应用', single: '应用', icon: 'layers' },
      models: { name: '模型', single: '模型', icon: 'box' },
      code: { name: '代码', single: '代码', icon: 'code' },
      packages: { name: '二进制/软件包', single: '二进制/软件包', icon: 'box' },
      web: { name: 'Web', single: 'Web 站点', icon: 'link' },
    };
    const L = (A.leanAssets = { query: {}, filters: {}, kinds, connectionOrigin: false });
    const display = (value) => E(value || '—');
    const date = (value) => A.listConsistency.time(value);
    const attr = (kind, id) => `data-kind="${E(kind)}" data-id="${E(id)}"`;
    const status = (text, tone = 'neutral') =>
      `<span class="la-state la-state-${tone}"><i></i>${E(text)}</span>`;
    const nameTags = (names) =>
      names.length
        ? `<div class="la-tags">${names.map((name) => `<span>${E(name)}</span>`).join('')}</div>`
        : '<span class="muted">—</span>';
    const safeEndpoint = (value) => {
      try {
        const u = new URL(value);
        if (!['http:', 'https:'].includes(u.protocol)) return '—';
        return u.origin + u.pathname.replace(/\/$/, '');
      } catch (e) {
        return '—';
      }
    };
    // guard 检测服务在安全防护内部管理，不作为模型资产列出
    const serviceRows = () => [];
    const serviceReady = (s) => A.leanOperations.serviceReady(s);
    // 平台内置的 guard 检测模型，由安全防护管理
    const builtinGuards = new Set(['system-qwen3guard', 'dedicated-singguard']);
    L.isManaged = (m) =>
      !!(builtinGuards.has(typeof m === 'string' ? m : m?.id) || m?.managed || m?.platformManaged);
    L.modelState = function (m) {
      return m._serviceType ? (serviceReady(m) ? 'ready' : 'unassigned') : M.state(m);
    };
    L.rows = function (kind) {
      if (kind === 'models') {
        const services = serviceRows(),
          ids = new Set(services.map((s) => s.id));
        return [
          ...C.db.filter((m) => (m.kind || 'model') === 'model' && !ids.has(m.id)),
          ...services,
        ];
      }
      if (kind === 'applications') return arr(A.data.aiApplications);
      return arr(A.data.businessAssets?.[kind]);
    };
    L.appNames = (kind, id) => R.applicationsFor(kind + ':' + id).map((a) => a.name);
    L.assetNames = (id) => R.assetsFor(id).map((r) => r.asset.name);
    L.endpoint = (m) =>
      L.isManaged(m)
        ? '平台托管'
        : m._serviceType && !serviceReady(m)
          ? '—'
          : safeEndpoint(m.endpoint);
    L.purposes = function (m) {
      if (L.isManaged(m)) return nameTags(['内容防护']);
      if (m._serviceType)
        return serviceReady(m) ? nameTags(['护栏']) : '<span class="muted">未配置</span>';
      const d = M.get(m.id);
      return d?.confirmed && d.roles?.length
        ? nameTags(d.roles.map((r) => M.roles[r] || r))
        : '<span class="muted">未配置</span>';
    };
    L.identity = function (kind, a) {
      if (kind === 'models') return a.model || a.id;
      if (kind === 'applications') return a.scene || a.description || '—';
      if (kind === 'web') return safeEndpoint(a.url);
      if (kind === 'code') return a.repository || '本地代码';
      return arr(a.versions).at(-1)?.fileName || arr(a.versions).at(-1)?.name || '二进制 / 软件包';
    };
    L.filter = function (kind, value) {
      L.query[kind] = value;
      A.render();
    };
    L.filterBy = function (kind, key, value) {
      if (!['owner', 'environment'].includes(key)) return;
      (L.filters[kind] ||= { owner: '', environment: '' })[key] = value;
      A.render();
    };
    L.empty = function (kind, search) {
      const note = search
        ? '调整筛选条件或搜索名称。'
        : {
            applications: '在安全防护中接入应用后显示。',
            models: '完成模型接入后显示。',
            code: '创建代码检测任务后记录对象与版本信息。',
            packages: '创建二进制/软件包检测任务后记录对象信息。',
            web: '创建 Web 检测任务后记录站点信息。',
          }[kind];
      return `<div class="la-empty"><span>${A.icon(kinds[kind].icon, 26)}</span><strong>${search ? '未找到匹配资产' : '暂无' + kinds[kind].single}</strong><p>${note}</p></div>`;
    };
    L.list = function (kind) {
      if (kind === 'models') return M.render();
      A.scanProduct.init();
      M.init();
      const query = (L.query[kind] || '').trim().toLowerCase(),
        all = L.rows(kind),
        f = L.filters[kind] || { owner: '', environment: '' },
        app = kind === 'applications';
      const matches = (value, filter) =>
        !filter ||
        (filter === '__unset__'
          ? !String(value || '').trim()
          : String(value || '').trim() === filter);
      const rows = all.filter(
        (a) =>
          (!query ||
            String(a.name || '')
              .toLowerCase()
              .includes(query)) &&
          matches(a.owner, f.owner) &&
          (!app || matches(a.environment, f.environment)),
      );
      const choices = (key, label) => {
        const values = [
          ...new Set(all.map((a) => String(a[key] || '').trim()).filter(Boolean)),
        ].sort();
        return `<select aria-label="${label}筛选" onchange="App.leanAssets.filterBy('${kind}','${key}',this.value)"><option value="">全部${label}</option>${values.map((v) => `<option value="${E(v)}" ${f[key] === v ? 'selected' : ''}>${E(v)}</option>`).join('')}${all.some((a) => !String(a[key] || '').trim()) ? `<option value="__unset__" ${f[key] === '__unset__' ? 'selected' : ''}>未指定${label}</option>` : ''}</select>`;
      };
      const columns = app
        ? ['应用名称', '负责人', '环境', '操作']
        : ['资产名称', ...(kind === 'code' ? ['版本数量'] : []), '负责人', '操作'];
      const body = rows
        .map((a) => {
          const title = `<button class="la-name" ${attr(kind, a.id)} onclick="App.leanAssets.open(this.dataset.kind,this.dataset.id)"><strong>${E(a.name || a.id)}</strong></button>`;
          const cells = app
            ? [
                title,
                display(a.owner),
                display(a.environment),
                A.entryManagement.button('applications', a.id),
              ]
            : [
                title,
                ...(kind === 'code'
                  ? [`<span class="la-version-count">${arr(a.versions).length}</span>`]
                  : []),
                display(a.owner),
                A.entryManagement.button(kind, a.id),
              ];
          return `<tr>${cells.map((cell, i) => `<td${app && i === cells.length - 1 ? ' class="la-row-end"' : ''}>${cell}</td>`).join('')}</tr>`;
        })
        .join('');
      return `<div class="la-page la-inventory-page">${A.heading('', kinds[kind].name, '')}<section class="card la-inventory"><div class="la-list-toolbar"><div class="la-inventory-filters">${choices('owner', '负责人')}${app ? choices('environment', '环境') : ''}</div><label class="la-search">${A.icon('search', 16)}<input type="search" aria-label="${app ? '搜索应用名称' : '搜索资产名称'}" placeholder="${app ? '搜索应用名称' : '搜索资产名称'}" value="${E(L.query[kind] || '')}" onchange="App.leanAssets.filter('${kind}',this.value)"></label></div><div class="table-wrap"><table><thead><tr>${columns.map((c, i) => `<th${app && i === columns.length - 1 ? ' class="la-row-end"' : ''}>${c}</th>`).join('')}</tr></thead><tbody>${body || `<tr><td colspan="${columns.length}" class="la-empty-cell">${L.empty(kind, !!query || !!f.owner || !!f.environment)}</td></tr>`}</tbody></table></div></section></div>`;
    };
    const kv = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`;
    L.profile = function (kind, a) {
      const app = kind === 'applications',
        model = kind === 'models',
        versions = arr(a.versions),
        latest = versions.at(-1),
        format = (v) =>
          String(v?.fileName || v?.name || v?.path || '')
            .match(/\.(tar\.gz|[a-z0-9]+)$/i)?.[1]
            ?.toUpperCase() || '未记录';
      const facts = app
        ? [
            ['负责人', display(a.owner)],
            ['环境', display(a.environment)],
            ...(a.scene ? [['业务场景', display(a.scene)]] : []),
          ]
        : model
          ? [
              ['接入方式', L.isManaged(a) ? '平台内置' : 'API 接入'],
              ['服务地址', display(L.endpoint(a))],
              ['连接状态', L.connectionState(a)],
              ['平台用途', L.purposes(a)],
            ]
          : [
              ['负责人', display(a.owner)],
              ['更新时间', date(a.updatedAt || a.createdAt)],
              ...(kind === 'web'
                ? [['站点地址', display(a.url)]]
                : kind === 'packages'
                  ? [
                      ['文件格式', format(latest)],
                      ['文件说明', display(a.description || latest?.note)],
                    ]
                  : []),
            ];
      let html = `<div class="la-profile"><div class="la-profile-head"><span class="la-profile-icon">${A.icon(kinds[kind].icon, 25)}</span><div><span>${kinds[kind].single}</span><h3>${E((model ? a.model || a.name : a.name) || a.id)}</h3></div></div><dl class="la-facts">${facts.map(([label, value]) => kv(label, value)).join('')}</dl>`;
      if (app && a.description)
        html += `<section class="la-detail-section"><h3>业务说明</h3><p>${E(a.description)}</p></section>`;
      if (['code', 'packages'].includes(kind))
        html += `<section class="la-detail-section"><div class="la-section-label"><h3>版本记录</h3></div><div class="table-wrap"><table><thead><tr><th>版本名称</th>${kind === 'packages' ? '<th>文件格式</th>' : ''}<th>更新时间</th></tr></thead><tbody>${
          versions
            .slice()
            .reverse()
            .map(
              (v) =>
                `<tr><td><strong>${E(v.label || '版本未记录')}</strong></td>${kind === 'packages' ? `<td>${E(format(v))}</td>` : ''}<td>${date(v.updatedAt || v.createdAt)}</td></tr>`,
            )
            .join('') ||
          `<tr><td colspan="${kind === 'packages' ? 3 : 2}" class="empty">暂无版本记录</td></tr>`
        }</tbody></table></div></section>`;
      return html + '</div>';
    };
    L.open = function (kind, id) {
      const a = L.rows(kind).find((a) => a.id === id);
      if (!a) return;
      A.drawer(kinds[kind].single + '信息', L.profile(kind, a), '');
    };
    L.applicationPage = function (id) {
      const a = L.rows('applications').find((a) => a.id === id);
      return a
        ? `<div class="la-page">${A.heading('', E(a.name), '应用档案', '', 'assets/applications')}<section class="card la-profile-page">${L.profile('applications', a)}</section></div>`
        : L.list('applications');
    };
    Q.assetDetail = L.open;
    Q.assetsHTML = L.list;
    A.platformGovernance.assetsHTML = L.list;
    R.inline = (kind, id) => nameTags(L.appNames(kind, id));
    R.assetSection = (kind, id) => {
      const names = L.appNames(kind, id);
      return names.length
        ? `<section class="la-detail-section"><h3>关联应用</h3>${nameTags(names)}</section>`
        : '';
    };
    R.listHTML = () => L.list('applications');
    R.open = (id) => L.open('applications', id);

    // This standalone demo checks fields locally and never asserts network connectivity.
    const connectionForm = C.form;
    const saveConnection = C.save;

    const contracts = {
      basic: ['chat'],
      safety: ['chat', 'qwen3guard'],
      embedding: ['embeddings'],
      multimodal: ['multimodal-chat'],
    };
    const compatible = {
      chat: ['target', 'attacker', 'judge', 'scanner'],
      'multimodal-chat': ['target', 'attacker', 'judge', 'scanner'],
      qwen3guard: ['guard'],
      embeddings: ['embedding'],
    };
    const supported = (d) =>
      (compatible[d.outputProtocol] || []).filter((r) => d.type !== 'safety' || r !== 'attacker');
    X.guardConnectionHint = '护栏未就绪，请在资产中心 → 模型查看检测服务。';
    /* 资产中心各类资产页：模型走 modelRoles，其余按 kinds 分类走 leanAssets。 */
    A.platform.routes['assets/models'] = () => M.render();
    for (const kind of Object.keys(kinds))
      A.platform.routes['assets/' + kind] = () =>
        kind === 'applications' && A.platform.applicationId
          ? L.applicationPage(A.platform.applicationId)
          : L.list(kind);
  })();
};
