/* assets/lean-platform。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['assets/lean-platform'] = function () {
  /* A lean product surface. Execution records remain in their original workbenches. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      V = A.evaluation,
      Q = A.assessment,
      S = A.scanProduct,
      P = A.platform,
      H = A.platformHome,
      R = A.applicationAssets,
      E = A.escape,
      I = A.icon;
    const L = (A.leanPlatform = {}),
      arr = (v) => (Array.isArray(v) ? v : []),
      stamp = (v) => Date.parse(v || '') || 0;
    const types = [
      ['attack', '模型演练'],
      ['code-scan', '代码检测'],
      ['app-scan', '二进制／软件包检测'],
      ['web-scan', 'Web 检测'],
    ];
    const states = [
      ['running', '进行中', '#4779b5'],
      ['done', '已结束', '#348875'],
      ['stopped', '已终止', '#d59a38'],
      ['error', '执行异常', '#d76a42'],
      ['pending', '待执行', '#a6b2c1'],
    ];
    const date = (v) => (stamp(v) ? new Date(v).toLocaleDateString('sv-SE') : '—');
    const time = (v) =>
      stamp(v)
        ? new Date(v).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : '—';
    const opts = (items, value) =>
      items
        .map(
          ([id, name]) =>
            `<option value="${E(id)}" ${id === value ? 'selected' : ''}>${E(name)}</option>`,
        )
        .join('');
    const ref = (t) => `data-id="${E(t.id)}"`;
    const target = (t) =>
      t.targetName || t.targetSnapshot?.name || X.targetFor(t)?.name || '历史对象';
    const sorted = (tasks) => tasks.slice().sort((a, b) => stamp(b.created) - stamp(a.created));
    const source = (t) => (t.snapshotId ? '历史快照' : '');
    const empty = (title, description) =>
      `<div class="lp-empty"><span>${I('file', 28)}</span><h3>${E(title)}</h3>${description ? `<p>${E(description)}</p>` : ''}</div>`;
    const head = (title, extra = '') =>
      `<div class="lp-panel-head"><h2>${title}</h2>${extra}</div>`;
    L.statusHTML = function (t) {
      const running = t.status === 'running',
        pct = V.metrics(t).pct;
      return `${Q.taskStatus(t)}${running ? `<div class="lp-progress" role="progressbar" aria-label="任务进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>` : ''}`;
    };
    L.originHTML = (t) =>
      source(t)
        ? `<span class="lp-origin ${t.snapshotId ? 'historical' : ''}">${source(t)}</span>`
        : '';
    Q.taskRows = function (tasks) {
      return tasks
        .map(
          (t) =>
            `<tr><td><button class="link-btn lp-task-name" ${ref(t)} onclick="App.evaluation.openTask(this.dataset.id)">${E(t.name)}</button><small>${L.originHTML(t)}${t.parentId ? ' · 复测' : ''}</small></td><td><span class="lp-type">${E(Q.taskName(t))}</span></td><td>${E(target(t))}<small>${E(t.targetMaterial?.version || t.targetSnapshot?.versionLabel || '')}</small></td><td>${L.statusHTML(t)}</td><td>${L.resultHTML(t)}</td><td class="lp-date" title="${E(t.created || '')}">${date(t.created)}<small>${time(t.created).split(' ').at(-1)}</small></td></tr>`,
        )
        .join('');
    };
    L.executionHTML = function (tasks) {
      const n = tasks.length,
        counts = states.map(([id, label, color]) => ({
          id,
          label,
          color,
          n: tasks.filter(
            (t) => (states.some((s) => s[0] === t.status) ? t.status : 'pending') === id,
          ).length,
        }));
      let offset = 0;
      const circles = counts
        .filter((s) => s.n)
        .map((s) => {
          const size = (s.n / Math.max(n, 1)) * 100,
            html = `<circle cx="72" cy="72" r="56" pathLength="100" fill="none" stroke="${s.color}" stroke-width="13" stroke-dasharray="${size} ${100 - size}" stroke-dashoffset="${-offset}" transform="rotate(-90 72 72)"/>`;
          offset += size;
          return html;
        })
        .join('');
      return `<div class="lp-execution"><div class="lp-donut" role="img" aria-label="${E(counts.map((s) => s.label + ' ' + s.n + ' 个').join('，'))}"><svg viewBox="0 0 144 144" aria-hidden="true"><circle cx="72" cy="72" r="56" fill="none" stroke="#eef2f7" stroke-width="13"/>${circles}</svg><div><strong>${n}</strong><span>评估任务</span></div></div><div class="lp-state-legend">${counts
        .filter((s) => s.id !== 'pending' || s.n)
        .map(
          (s) =>
            `<div><i style="background:${s.color}"></i><span>${s.label}</span><strong>${s.n}</strong></div>`,
        )
        .join('')}</div></div>`;
    };
    L.objects = () => Q.objects().filter((o) => o.kind !== 'applications' && o.tasks.length);
    L.latestHTML = function () {
      const objects = L.objects()
        .filter((o) => o.tasks.some(V.reportReady))
        .sort((a, b) => stamp(b.latest?.created) - stamp(a.latest?.created))
        .slice(0, 3);
      return `<div class="lp-latest">${objects.map((o) => `<button data-key="${E(o.key)}" onclick="App.assessment.openObject(this.dataset.key)"><span class="lp-object-icon">${I(o.kind === 'models' ? 'box' : 'code', 20)}</span><span><strong>${E(o.name)}</strong><small>${E(Q.kinds[o.kind])} · ${o.tasks.length} 次评估${source(o.latest) ? ' · ' + source(o.latest) : ''}</small></span><b>${E(Q.taskResult(o.latest).main)}</b></button>`).join('') || empty('尚无评估结果', '任务产生有效记录后，查看对象指标。')}</div>`;
    };

    // Task lists use the same vocabulary; detailed scanner screens are deliberately preserved.
    S.render = function (tab = 'code-scan') {
      S.init();
      S.tab = types.some((t) => t[0] === tab) && tab !== 'attack' ? tab : 'code-scan';
      const selected = S.tasks().find((t) => t.id === S.selected && t.type === S.tab);
      if (selected) return S.detailHTML(selected);
      const rows = sorted(S.tasks()).filter(
        (t) =>
          t.type === S.tab &&
          (S.filter === 'all' || S.filter === t.status) &&
          (!S.query ||
            [t.name, t.id, target(t)].join(' ').toLowerCase().includes(S.query.toLowerCase())),
      );
      return `<div class="lp-page">${A.heading('', S.typeName(S.tab), '', `<button class="btn primary" onclick="App.scanProduct.newTask()">${I('plus', 15)}新建检测任务</button>`)}<section class="card lp-table"><div class="toolbar lp-toolbar"><input id="scan-query" class="input" aria-label="搜索检测任务" placeholder="搜索任务或对象" value="${E(S.query)}" onchange="App.scanProduct.filterBy('query',this.value)"><select aria-label="检测状态" onchange="App.scanProduct.filterBy('filter',this.value)">${opts([['all', '全部状态'], ...states.filter((s) => s[0] !== 'pending')], S.filter)}</select><span class="lp-count">${rows.length} 个任务</span></div><div class="table-wrap"><table><thead><tr><th>任务名称</th><th>评估对象 / 版本</th><th>执行状态</th><th>检测结果</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${rows.map((t) => `<tr><td><button class="link-btn lp-task-name" ${ref(t)} onclick="App.scanProduct.open(this.dataset.id)">${E(t.name)}</button><small>${L.originHTML(t)}</small></td><td>${E(target(t))}<small>${E(t.targetMaterial?.version || '')}</small></td><td>${L.statusHTML(t)}</td><td>${L.resultHTML(t)}</td><td class="lp-date">${date(t.created)}<small>${time(t.created).split(' ').at(-1)}</small></td><td>${S.actions(t)}</td></tr>`).join('') || `<tr><td colspan="6">${empty('暂无' + S.typeName(S.tab) + '任务', '创建检测任务后，运行记录会显示在这里。')}</td></tr>`}</tbody></table></div></section></div>`;
    };
    V.enterProduct = (id) =>
      id === 'attack' ? P.go('exercise', 'tasks') : P.go('scan', 'tasks', id);
    // The arena is an execution view of the same tasks, with an explicit, stable selection.
    X.workspaceTasks = () =>
      X.db.tasks
        .filter((t) => !t.deletedAt)
        .slice()
        .sort(
          (a, b) =>
            Number(b.status === 'running') - Number(a.status === 'running') ||
            stamp(b.created) - stamp(a.created),
        );
    // Application associations are maintained in the application asset list.
    R.scanField = () => '';

    const relationEditor = R.editor;
    R.editor = function () {
      const modal = A.modal;
      A.modal = function (title, body, footer, options) {
        return modal.call(
          A,
          title,
          body.replace(
            '暂无可关联对象，可先在资产中心登记。',
            '暂无匹配对象。模型接入或创建检测任务后，相关资产会自动登记。',
          ),
          footer,
          options,
        );
      };
      try {
        return relationEditor.apply(R, arguments);
      } finally {
        A.modal = modal;
      }
    };
    // Keep method variants available without letting one family fill the catalogue.
    const AP = A.policies,
      B = A.banks;
    AP.renderContent = function () {
      return `<section class="card lp-table"><div class="toolbar lp-toolbar"><input id="bank-catalog-search" class="input" aria-label="搜索题库名称" placeholder="搜索题库名称" value="${E(B.catalog.query)}" oninput="App.banks.searchCatalog(this.value)"><select aria-label="筛选题库来源" onchange="App.banks.filterCatalog(this.value)">${opts(
        [
          ['all', '全部来源'],
          ['builtin', '系统'],
          ['custom', '自建'],
        ],
        B.catalog.source,
      )}</select><select aria-label="筛选题库行业" onchange="App.banks.filterIndustry(this.value)"><option value="all">全部行业</option>${B.industries()
        .map(
          (v) =>
            `<option value="${E(v)}" ${B.catalog.industry === v ? 'selected' : ''}>${E(v)}</option>`,
        )
        .join(
          '',
        )}</select><span class="lp-count" id="bank-catalog-count">共 ${B.catalogRows().length} 个题库</span></div><div class="table-wrap"><table><thead><tr><th>题库名称</th><th>来源</th><th>行业</th><th>题目数量</th><th>操作</th></tr></thead><tbody id="bank-catalog-rows">${B.catalogTable()}</tbody></table></div></section>`;
    };
    AP.renderWorkspace = function () {
      const kind = AP.section,
        methods = kind === 'methods',
        content = kind === 'content',
        title = methods ? '攻击方法' : content ? '攻击题库' : '攻击策略配置',
        description = methods
          ? '选择方法，在攻击策略中配置参数。'
          : content
            ? '维护评估题目，发布策略时固定所用内容。'
            : '固定攻击方法、题目与判定配置，供任务引用。',
        actions = methods
          ? '<button class="btn primary" onclick="App.policies.newTemplate()">＋ 自定义模板</button>'
          : content
            ? '<button class="btn primary" onclick="App.banks.create()">＋ 新建题库</button>'
            : '<button class="btn primary" onclick="App.policies.edit()">发布攻击策略</button>';
      return `<div class="lp-page">${A.heading('', title, description, actions)}${methods ? AP.renderMethods() : content ? AP.renderContent() : AP.renderPolicies()}</div>`;
    };
    // Identify synthetic evidence in deep-linked reports as well as list rows.
  })();
};
