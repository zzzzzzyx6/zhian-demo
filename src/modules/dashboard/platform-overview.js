/* 安全态势：platform-overview。执行顺序由 src/boot.js 维护。 */
window.AppParts = window.AppParts || {};

// ─── platform-overview ─────────────────────────────────────────────────────
AppParts['dashboard/platform-overview'] = function () {
  /* The home dashboard projects the existing centers; it does not create findings or tasks. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      E = A.escape;
    const H = (A.platformHome = { days: 30 }),
      arr = (v) => (Array.isArray(v) ? v : []);
    const colors = {
      blue: '#4779b5',
      teal: '#348875',
      amber: '#d59a38',
      red: '#c45568',
      gray: '#a6b2c1',
    };
    const inventory = [
      ['models', '模型', colors.blue],
      ['code', '代码', colors.teal],
      ['packages', '软件包', '#95a5c3'],
      ['web', 'Web', colors.amber],
    ];
    const assetNames = {
      model: '模型',
      application: 'AI应用',
      code: '代码',
      package: '软件包',
      web: 'Web',
    };
    const synthetic = (t) =>
      !!(
        t.example ||
        t.simulation ||
        t.simulated ||
        ['example', 'simulation'].includes(t.resultSource) ||
        t.runSnapshot?.simulated ||
        t.executionSnapshot?.simulated
      );

    H.snapshot = function () {
      const V = A.evaluation,
        Q = A.assessment,
        GD = A.guard,
        G = A.platformGovernance;
      const groups = Object.fromEntries(
        ['applications', ...inventory.map((v) => v[0])].map((kind) => [
          kind,
          A.leanAssets.rows(kind),
        ]),
      );
      const assets = Object.entries(groups).flatMap(([kind, rows]) =>
        rows.map((a) => ({ ...a, kind, key: kind + ':' + a.id })),
      );
      const technical = assets.filter((a) => a.kind !== 'applications');
      const services = new Set(Object.values(A.data.guardServices || {}).map((s) => s.id));
      const evaluableAssets = technical.filter(
        (a) => a.kind !== 'models' || (!services.has(a.id) && !a.systemGuard),
      );
      const eligible = new Set(evaluableAssets.map((a) => a.key)),
        tasks = V.allTasks();
      const resultTasks = tasks.filter((t) => V.reportReady(t) && Q.taskResult(t).value !== null);
      const covered = [
        ...new Set([
          ...resultTasks.filter((t) => !synthetic(t)).map(Q.objectKey),
          ...arr(A.riskDemo?.coveredKeys?.()),
        ]),
      ].filter((key) => eligible.has(key));
      const attacks = tasks.filter((t) => V.type(t) === 'attack'),
        scans = tasks.filter((t) => V.type(t) === 'scan');
      GD.init();
      const apps = groups.applications,
        protectedApps = apps.filter((a) => GD.access.mode(a.id) === 'enforce');
      const requests = GD.records.all(),
        runtimeRecords = G.runtimeRecords(),
        verdicts = GD.records.summary(requests).byVerdict,
        recordSummary = {
          all: requests.length,
          counts: {
            Safe: verdicts.Safe,
            Controversial: verdicts.Controversial,
            Unsafe: verdicts.Unsafe,
            Unknown: verdicts.Unknown,
          },
          real: runtimeRecords.length,
        };
      const alerts = G.events(),
        riskMap = new Map();
      for (const e of alerts) {
        const key = e.assetType + ':' + e.assetId;
        const row = riskMap.get(key) || {
          key,
          id: e.assetId,
          name: e.assetName || e.assetId || '未命名资产',
          assetType: e.assetType,
          kind: assetNames[e.assetType] || '资产',
          count: 0,
          evaluation: 0,
          protection: 0,
          riskLabels: [],
        };
        const label = e.ruleSnapshot?.name || G.metrics[e.metric]?.label || '风险事件';
        if (!row.riskLabels.includes(label)) row.riskLabels.push(label);
        row.count++;
        row[e.domain === 'protection' ? 'protection' : 'evaluation']++;
        riskMap.set(key, row);
      }
      const riskAssets = [...riskMap.values()].sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name),
      );
      return {
        assets,
        apps,
        models: groups.models,
        code: groups.code,
        packages: groups.packages,
        web: groups.web,
        technical,
        evaluableAssets,
        tasks,
        attacks,
        scans,
        resultTasks,
        covered,
        protectedApps,
        requests,
        runtimeRecords,
        recordSummary,
        alerts,
        riskAssets,
        completedTasks: tasks.filter((t) => t.status === 'done'),
        pendingModels: A.leanAssets.pendingModels?.() || [],
        enabledRules: arr(G.db?.rules).filter((r) => r.enabled),
        pendingAlerts: alerts.filter((e) => e.status !== 'closed'),
        pendingReviews: GD.records.reviews().filter((v) => v.status === 'pending'),
        exceptions: tasks.filter((t) => t.status === 'error' && !t.deletedAt),
        readyApps: apps.filter((a) => GD.access.policies(a.id).length),
        blocked: requests.filter((r) => r.acked && r.effectiveAction === 'block').length,
        exampleTasks: tasks.filter((t) => t.example || t.resultSource === 'example').length,
        simulationTasks: tasks.filter(
          (t) => synthetic(t) && !t.example && t.resultSource !== 'example',
        ).length,
      };
    };
    H.strategies = function () {
      const attack = arr(A.policies.db).filter((p) => arr(p.revisions).length && !p.archived);
      const GD = A.guard,
        defense = GD.policies.all().filter((p) => arr(p.revisions).length),
        snap = (p) => GD.policies.latest(p.id);
      const methods = A.policies.methods(),
        banks = A.banks.db,
        methodIds = methods.map((m) => m.id);
      const used = [
        ...new Set(
          X.db.tasks
            .filter((t) => !t.deletedAt)
            .flatMap((t) => (t.policySnapshot?.methods || []).map((m) => m.id)),
        ),
      ];
      const featuredMethods = used
        .map((id) => methods.find((m) => m.id === id))
        .filter(Boolean)
        .slice(0, 3);
      for (const m of methods) {
        if (featuredMethods.length >= 3) break;
        if (!featuredMethods.some((row) => row.id === m.id)) featuredMethods.push(m);
      }
      const types = ['compliance', 'pii', 'prompt', 'image', 'custom'].map((type) => {
        const rows = defense.filter((p) => snap(p)?.policyType === type);
        return {
          type,
          name: GD.detectors.guard.profiles[type]?.name || '自定义规则',
          rows,
          enabled: rows.filter((p) => snap(p)?.enabled).length,
        };
      });
      return {
        attack,
        defense,
        methods,
        banks,
        methodIds,
        featuredMethods,
        types,
        enabled: defense.filter((p) => snap(p)?.enabled).length,
      };
    };

    // Each summary opens its complete source list, independent of the previous visit's filters.
    H.openAsset = function (kind = 'models') {
      A.leanAssets.query[kind] = '';
      if (A.leanAssets.filters) A.leanAssets.filters[kind] = { owner: '', environment: '' };
      if (kind === 'models') Object.assign(A.modelIntake.filter, { query: '', state: '' });
      A.platform.go('assets', kind);
    };
    H.openPendingModels = function () {
      Object.assign(A.modelRoles.filter, {
        query: '',
        type: '',
        capability: '',
        role: '',
        state: 'pending',
      });
      A.platform.go('management', 'model-roles');
    };
    H.openEvaluation = function () {
      Object.assign(A.assessment, { filter: 'all', status: 'all', query: '' });
      A.platform.go('scan', 'tasks');
    };
    H.openProtection = function () {
      A.guard.records.filter.appId = '';
      A.platform.go('protection', 'overview');
    };
    H.openAttackPolicies = function () {
      A.policies.policyQuery = '';
      A.platform.go('policy', 'policies', 'strategies');
    };
    H.openMethod = function (id) {
      A.policies.methodQuery = '';
      A.policies.methodCategory = 'all';
      A.platform.go('policy', 'policies', 'methods');
      if (id) A.policies.methodDetail(id);
    };
    H.openBanks = function () {
      Object.assign(A.banks.catalog, { query: '', source: 'all' });
      A.platform.go('policy', 'policies', 'content');
    };
    H.openDefense = function (id) {
      A.guard.policyViews.query = '';
      A.platform.go('policy', 'defense', 'configurations');
      if (id) A.guard.policyViews.detail(id);
    };
    H.openRiskRules = function (id) {
      Object.assign(A.platformGovernance.ruleFilter || {}, { domain: '', query: '' });
      A.platform.go('risk', 'rules');
      if (id) A.platformGovernance.editRule(id);
    };
    H.openPendingRisk = function (priority = '') {
      A.platformGovernance.showEvents({
        state: 'active',
        priority: ['R1', 'R2', 'R3'].includes(priority) ? priority : '',
      });
    };
    H.openExceptions = function () {
      const rows = H.snapshot().exceptions;
      A.modal(
        '异常评估任务',
        `<div class="ph-queue-errors">${rows.map((t) => `<button data-id="${E(t.id)}" onclick="App.closeModal();App.evaluation.openTask(this.dataset.id)"><span><strong>${E(t.name || t.id)}</strong><small>${E(A.evaluation.typeName(t))}</small></span><span>查看任务 →</span></button>`).join('') || '<p class="empty">暂无执行异常的评估任务</p>'}</div>`,
        '<button class="btn" onclick="App.closeModal()">关闭</button>',
      );
    };
    // 渲染由 dashboard-workbench 和 dashboard-b 提供；此处只保留共享数据与导航。

    const init = X.init;
    X.init = function () {
      const result = init.apply(X, arguments);
      A.scanProduct?.init();
      A.modelRoles?.init();
      A.platformGovernance?.init();
      const fixture = X.db.tasks.find(
        (t) => t.id === 'EV-260919-077' && t.simulated && t.name.includes('智能体策略复核'),
      );
      if (fixture) {
        fixture.name = fixture.name.replace('智能体策略复核', '多轮对话安全演练');
        A.save();
      }
      return result;
    };
  })();
};
