/* core/structured-lists。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/structured-lists'] = function () {
  /* Presentation only: one named metric per column, with existing detail/actions. */
  (function () {
    'use strict';
    const A = window.App,
      K = A.dataDisplay,
      E = A.escape,
      V = A.evaluation,
      Q = A.assessment,
      X = A.attack,
      L = A.leanPlatform;
    const arr = (v) => (Array.isArray(v) ? v : []),
      stamp = (v) => Date.parse(v || '') || 0;
    const target = (t) =>
      t.targetName || t.targetSnapshot?.name || X.targetFor(t)?.name || '历史对象';
    const date = (v) => A.listConsistency.time(v);
    const link = (label, id, action) =>
      `<button class="link-btn ds-name" data-id="${E(id)}" onclick="${action}(this.dataset.id)">${E(label)}</button>`;
    const options = (rows, value) =>
      rows
        .map(
          ([id, label]) =>
            `<option value="${E(id)}" ${id === value ? 'selected' : ''}>${E(label)}</option>`,
        )
        .join('');
    const result = (t) => (t ? Q.taskResult(t) : null);
    const metricColumns = function (tasks, get = (t) => t, fallback = 'both') {
      const types = new Set(tasks.filter(Boolean).map(V.type)),
        attack = types.has('attack') || (!types.size && fallback !== 'scan'),
        scan = types.has('scan') || (!types.size && fallback !== 'attack');
      const number = (label, kind, read) => ({
        label,
        number: true,
        cell: (row) => {
          const t = get(row),
            r = result(t);
          return t && V.type(t) === kind && r?.value !== null ? E(read(t, r)) : '—';
        },
      });
      return [
        ...(attack
          ? [
              number('ASR', 'attack', (t, r) => r.value.toFixed(1) + '%'),
              number('攻破次数', 'attack', (t, r) => r.breach),
              number('有效判定', 'attack', (t, r) => r.valid),
            ]
          : []),
        ...(scan
          ? [
              number('已确认漏洞', 'scan', (t, r) => r.value),
              number('候选问题', 'scan', (t) => t.candidateCount || 0),
            ]
          : []),
      ];
    };
    K.resultColumns = metricColumns;
    const taskColumns = (tasks) => [
      {
        label: '任务名称',
        cell: (t) =>
          link(t.name, t.id, 'App.evaluation.openTask') +
          `<small>${E(t.bankSnapshot?.name || '—')} · ${t.bankSnapshot?.items?.length || 0} 题 · ${new Set((t.units || []).map((u) => u.method)).size} 种方法</small>`,
      },
      { label: '评估类型', cell: (t) => E(Q.taskName(t)) },
      { label: '评估对象', cell: (t) => E(target(t)) },
      ...(tasks.some((t) => t.targetMaterial?.version || t.targetSnapshot?.versionLabel)
        ? [
            {
              label: '对象版本',
              cell: (t) => E(t.targetMaterial?.version || t.targetSnapshot?.versionLabel || '—'),
            },
          ]
        : []),
      { label: '执行状态', cell: Q.taskStatus },
      {
        label: '完成进度',
        cell: (t) => {
          const m = V.metrics(t);
          return K.progress(m.done, m.total, t.status);
        },
      },
      ...metricColumns(tasks),
      { label: '创建时间', className: 'ds-date', cell: (t) => date(t.created) },
    ];
    L.resultHTML = (t) => `<strong class="lp-result">${E(Q.taskResult(t).main)}</strong>`;
    L.statusHTML = Q.taskStatus;
    L.taskTable = (tasks, toolbar = '') =>
      `<section class="card lp-table">${toolbar}${K.table(taskColumns(tasks), tasks, '暂无匹配任务')}</section>`;
    V.tasksHTML = function () {
      const f = V.taskFilters;
      if (f.status === 'pending') f.status = 'all';
      if (f.status === 'error') f.status = 'stopped';
      const rows = V.tasks(),
        targets = [
          ...new Map(
            X.db.tasks
              .filter((t) => !t.deletedAt && V.type(t) === 'attack')
              .map((t) => [String(t.model), target(t)]),
          ).entries(),
        ],
        columns = [
          { label: '任务名称', cell: (t) => link(t.name, t.id, 'App.evaluation.openTask') },
          { label: '靶标模型', cell: (t) => E(target(t)) },
          { label: '执行状态', cell: Q.taskStatus },
          {
            label: '完成进度',
            cell: (t) => {
              const m = V.metrics(t);
              return K.progress(m.done, m.total, t.status);
            },
          },
          ...metricColumns(rows, (t) => t, 'attack').filter((c) => c.label === 'ASR'),
          { label: '创建时间', className: 'ds-date', cell: (t) => A.fmtTime(t.created) },
          {
            label: '完成 / 终止时间',
            className: 'ds-date',
            cell: (t) =>
              V.terminal.has(t.status)
                ? A.fmtTime(t.finishedAt || t.finished || t.stoppedAt) || '—'
                : '—',
          },
          {
            label: '操作',
            cell: (t) =>
              `<div class="ec-row-actions"><button class="link-btn" data-id="${E(t.id)}" onclick="App.attack.open(this.dataset.id)">详情</button>${t.status === 'running' ? `<button class="link-btn" data-id="${E(t.id)}" onclick="App.attack.taskAction(this.dataset.id,'stop')">终止</button>` : link('复测', t.id, 'App.attack.quickRetest') + A.entryManagement.button('attack-task', t.id)}</div>`,
          },
        ];
      const drafts = A.demoPresentation?.drafts?.() || [];
      if (V.showDrafts) return `<div class="lp-page">${V.draftBoxHTML()}</div>`;
      const draftBtn = `<button class="btn" onclick="App.evaluation.openDrafts()">任务草稿箱${drafts.length ? ' · ' + drafts.length : ''}</button>`;
      return `<div class="lp-page">${A.heading('', '演练任务', '', `<button class="btn primary" onclick="App.attack.newTask()">＋ 新建演练任务</button>${draftBtn}`)}<section class="card lp-table"><div class="toolbar lp-toolbar"><input class="input" id="ec-tasks-query" type="search" aria-label="搜索演练任务" placeholder="搜索任务或靶标名称" value="${E(f.query)}" onchange="App.evaluation.filter('tasks','query',this.value)"><select aria-label="演练状态" onchange="App.evaluation.filter('tasks','status',this.value)">${options([['all', '全部状态'], ...K.states.filter(([id]) => !['pending', 'error'].includes(id)).map(([id, label]) => [id, label])], f.status)}</select><select aria-label="靶标筛选" onchange="App.evaluation.filter('tasks','target',this.value)">${options([['all', '全部靶标'], ...targets], f.target)}</select><button class="btn small" aria-label="${f.sort === 'desc' ? '按创建时间升序' : '按创建时间降序'}" title="${f.sort === 'desc' ? '最新创建优先；点击切换升序' : '最早创建优先；点击切换降序'}" onclick="App.evaluation.filter('tasks','sort','${f.sort === 'desc' ? 'asc' : 'desc'}')">创建时间 ${f.sort === 'desc' ? '↓' : '↑'}</button></div>${K.table(columns, rows, '暂无演练任务')}</section></div>`;
    };
    // Model history uses explicit configuration columns for task-to-task comparison.
  })();
};
