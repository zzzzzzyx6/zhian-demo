/* exercise/demo-presentation。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/demo-presentation'] = function () {
  /* Focused presentation: reuse task state, snapshots and report renderers. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      V = A.evaluation,
      P = A.platform,
      H = A.platformHome,
      E = A.escape,
      L = A.reportLayout;
    const D = (A.demoPresentation = { reportTabs: {}, attackId: null, scanId: null, goal: null });
    const copy = (v) => JSON.parse(JSON.stringify(v)),
      list = (v) => (Array.isArray(v) ? v : []);
    D.riskTab = 'rules';
    D.renderRiskManagement = function () {
      const grading = D.riskTab === 'grading';
      let body = A.platformGovernance.renderRisk(D.riskTab);
      body = body.replace(
        /<div class="page-heading">[\s\S]*?<\/h1>[\s\S]*?<div class="page-actions">[\s\S]*?<\/div><\/div>/,
        '',
      );
      body = body.replace(
        /<button class="link-btn" onclick="App.platform.go\('risk','grading'\)">分级标准 →<\/button>/,
        '',
      );
      const action = grading
        ? '<button class="btn primary" onclick="App.riskClassification.edit()">调整分级标准</button>'
        : '<button class="btn primary" onclick="App.platformGovernance.editRule()">＋ 新建规则</button>';
      return (
        A.heading(
          '',
          '风险管理',
          '触发规则决定何时产生风险事件，分级标准决定事件的处置等级。',
          action,
        ) +
        `<div class="tabs" role="tablist" aria-label="风险管理">${[
          ['rules', '触发规则'],
          ['grading', '分级标准'],
        ]
          .map(
            ([id, label]) =>
              `<button class="tab ${D.riskTab === id ? 'active' : ''}" role="tab" id="risk-tab-${id}" aria-selected="${D.riskTab === id}" aria-controls="risk-management-panel" onclick="App.platform.go('management','risk-management','${id}')">${label}</button>`,
          )
          .join(
            '',
          )}</div><section id="risk-management-panel" role="tabpanel" aria-labelledby="risk-tab-${D.riskTab}">${body}</section>`
      );
    };
    P.routes['management/risk-management'] = () => D.renderRiskManagement();
    H.openArena = () => P.go('workspace', 'home');
    X.showArena = function (id) {
      D.attackId = id;
      D.goal = null;
      X.selected = null;
      X.tab = 'platform';
      P.state = { section: 'workspace', item: 'home' };
      A.closeModal();
      A.closeDrawer();
      A.render();
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    H.openHomeTask = function (id) {
      const t = X.db.tasks.find((t) => t.id === id);
      if (t) return X.open(id);
      return A.scanProduct.open(id);
    };
    D.choose = function (kind, id) {
      D[kind + 'Id'] = id;
      if (kind === 'attack') D.goal = null;
      A.render();
    };
    const status = (t) =>
      t
        ? {
            running: '运行中',
            done: '已完成',
            stopped: '已终止',
            error: '异常终止',
            queued: '等待中',
            pending: '等待中',
          }[t.status] || '等待中'
        : '暂无任务';
    const choose = (rows, id) =>
      rows.find((t) => t.id === id) || rows.find((t) => t.status === 'running') || rows[0];
    const sorted = (rows) =>
      rows
        .slice()
        .sort(
          (a, b) =>
            (b.status === 'running') - (a.status === 'running') ||
            Date.parse(b.created || 0) - Date.parse(a.created || 0),
        );
    function picker(kind, rows, t) {
      return rows.length
        ? `<select aria-label="选择${kind === 'attack' ? '模型演练' : '漏洞检测'}任务" onchange="App.demoPresentation.choose('${kind}',this.value)">${rows.map((r) => `<option value="${E(r.id)}" ${r.id === t?.id ? 'selected' : ''}>${E(r.name)} · ${status(r)}</option>`).join('')}</select>`
        : '<span class="runtime-no-task">创建任务后显示进程</span>';
    }
    function graph(nodes, active, live, kind) {
      const pts =
        kind === 'attack'
          ? [
              [66, 112],
              [193, 54],
              [318, 112],
              [193, 185],
              [447, 112],
            ]
          : [
              [65, 72],
              [193, 72],
              [321, 72],
              [447, 72],
              [447, 182],
              [321, 182],
              [193, 182],
            ];
      const edges = nodes.slice(1).map((_, i) => [i, i + 1]);
      return `<svg class="runtime-graph" viewBox="0 0 512 245" role="img" aria-label="${E(nodes.map((n) => n.label + '：' + n.state).join('，'))}"><defs><marker id="rt-arrow-${kind}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#6c87b5"/></marker></defs>${edges
        .map(([a, b]) => {
          const [x, y] = pts[a],
            [xx, yy] = pts[b],
            horizontal = Math.abs(xx - x) > Math.abs(yy - y),
            sx = x + (horizontal ? Math.sign(xx - x) * 49 : 0),
            sy = y + (horizontal ? 0 : Math.sign(yy - y) * 28),
            ex = xx - (horizontal ? Math.sign(xx - x) * 52 : 0),
            ey = yy - (horizontal ? 0 : Math.sign(yy - y) * 32);
          return `<path class="runtime-edge ${live && (a === active || b === active) ? 'flowing' : ''}" d="M${sx},${sy} C${horizontal ? (sx + ex) / 2 : sx},${horizontal ? sy : (sy + ey) / 2} ${horizontal ? (sx + ex) / 2 : ex},${horizontal ? ey : (sy + ey) / 2} ${ex},${ey}" marker-end="url(#rt-arrow-${kind})"/>`;
        })
        .join('')}${nodes
        .map((n, i) => {
          const [x, y] = pts[i];
          return `<g class="runtime-node ${live && active === i ? 'is-active' : ''} ${n.state === '已完成' ? 'is-done' : ''}" transform="translate(${x},${y})"><rect x="-48" y="-27" width="96" height="54" rx="13"/><circle cx="-31" cy="-12" r="3"/><text text-anchor="middle" y="1">${E(n.label)}</text><text class="runtime-node-state" text-anchor="middle" y="17">${E(n.state)}</text></g>`;
        })
        .join('')}</svg>`;
    }
    H.render = function () {
      const s = H.snapshot();
      return `<div class="platform-dashboard ph-workbench"><div class="page-heading"><div><h1>安全态势</h1></div><div class="page-actions"><button class="wb-reset" onclick="App.resetDemo()">恢复初始数据</button></div></div><section class="wb-task-pulse" aria-labelledby="task-pulse-title"><header class="wb-task-pulse-head"><div><h2 id="task-pulse-title">实时执行态势</h2><span class="wb-task-pulse-caption">安全扫描 / 模型演练</span></div></header><div class="runtime-panels">${D.scanPanel()}${D.attackPanel()}</div></section>${H.homeFollowup(s)}<div class="wb-main-grid">${H.homeEvaluation(s)}${H.homeProtection(s)}</div>${H.homeResources(s)}</div>`;
    };
    // The original report body stays the export source; interactive evidence has its own tab.
    const article = L.article;
    D.reportTab = function (id, tab) {
      D.reportTabs[id] = tab === 'details' ? 'details' : 'summary';
      A.render();
    };
    L.article = function (t, exported, variant = 'process') {
      if (exported) return article.call(L, t, true, variant);
      const details = D.reportTabs[t.id] === 'details';
      // 两部分是报告的两个独立章节：章节式切换条，不再套框。
      const tabs = [
        ['summary', '结果分析'],
        ['details', '攻防明细'],
      ]
        .map(([tab, label], i) => {
          const on = details === (tab === 'details');
          return `<button role="tab" aria-selected="${on}" class="report-part ${on ? 'active' : ''}" data-task="${E(t.id)}" onclick="App.demoPresentation.reportTab(this.dataset.task,'${tab}')"><span class="report-part-no">${String(i + 1).padStart(2, '0')}</span><span><strong>${label}</strong></span></button>`;
        })
        .join('');
      return `<article class="task-analysis-report report-doc"><nav class="report-parts" role="tablist" aria-label="报告内容">${tabs}</nav><section role="tabpanel" class="report-part-panel">${details ? A.evaluationRecords.renderEmbedded(t) : L.body(t, 'capability')}</section></article>`;
    };
    const detail = V.taskDetailHTML;
    V.taskDetailHTML = function (t) {
      if (!t || t.deletedAt || t.type === 'scan') return detail.call(V, t);
      const a = X.taskAnalysis(t),
        j = A.taskReports.judgement(t),
        defense = t.runSnapshot?.defense || t.defense || {};
      const criteria = `<details class="task-judge-config"><summary>防守与裁判配置</summary><dl><dt>防护位置</dt><dd>${E([defense.modelInput ? '输入侧' : '', defense.modelOutput ? '输出侧' : ''].filter(Boolean).join('、') || '未启用独立护栏')}</dd><dt>判定规则</dt><dd>${E(j.safetyRules || j.rule || t.engine?.judgeRule || '未保存规则正文')}</dd></dl>${j.promptTemplate ? `<details><summary>裁判提示词</summary><pre>${E(j.promptTemplate)}</pre></details>` : ''}</details>`;
      return `<div class="page-heading"><div class="page-heading-main">${A.backButton('exercise/tasks')}<h1>${E(t.name)}</h1><span>${status(t)}</span></div><div class="page-actions">${t.status === 'running' ? `<button class="btn" data-id="${E(t.id)}" onclick="App.attack.taskAction(this.dataset.id,'stop')">终止任务</button>` : ''}<button class="btn primary" ${V.reportReady(t) && !A.reviewPolish.reportDeleted(t) ? '' : 'disabled'} data-id="${E(t.id)}" onclick="App.evaluation.openReport(this.dataset.id)">查看报告</button>${A.entryManagement.button('attack-task', t.id)}</div></div><section class="card task-config-detail report-layout"><h2>任务配置</h2><p class="hint">按任务启动时保存的配置展示。</p>${L.configHTML(t, a)}${criteria}</section><section class="card task-visual-summary"><div><h2>场景表现</h2><p class="hint">各场景攻破率；完整分析与执行明细见报告。</p></div>${X.reportParts.radarHTML(a)}</section>`;
    };
    const reportDetail = V.reportDetailHTML;
    V.reportDetailHTML = function (t) {
      if (!t || t.type === 'scan' || !V.reportReady(t) || A.reviewPolish.reportDeleted(t))
        return reportDetail.call(V, t);
      return `<div class="page-heading report-page-heading"><div class="page-heading-main">${A.backButton('exercise/tasks')}<h1>${E(t.name)}</h1></div><div class="report-heading-actions">${A.reportApi.exportMenu(t.id)}<button class="btn" data-id="${E(t.id)}" onclick="App.attack.open(this.dataset.id)">来源任务</button></div></div>${X.report(t)}`;
    };
    const N = A.reportApi;
    N.selection = { summary: true, details: true };
    N.exportMenu = function (id) {
      return `<details class="report-export export-variant"><summary>${A.icon('download', 14)}报告导出${A.icon('chevron', 12)}</summary><div class="export-variant-panel"><span class="export-format-label">勾选报告内容</span>${[
        ['summary', '基础报告（配置与分析）'],
        ['details', '攻防明细'],
      ]
        .map(
          ([key, label]) =>
            `<label class="export-check"><input type="checkbox" value="${key}" ${N.selection[key] ? 'checked' : ''} onchange="App.reportApi.selection[this.value]=this.checked">${label}</label>`,
        )
        .join('')}<span class="export-format-label">导出格式</span>${[
        ['pdf', 'PDF'],
        ['markdown', 'Markdown'],
      ]
        .map(
          ([format, label]) =>
            `<button data-id="${E(id || '')}" onclick="App.reportApi.exportFrom(this,'${format}')">${label}</button>`,
        )
        .join('')}</div></details>`;
    };
    N.exportFrom = function (button, format) {
      const menu = button.closest('details'),
        selected = Array.from(menu.querySelectorAll('input:checked')).map((el) => el.value);
      if (!selected.length) {
        A.toast('请至少勾选一项报告内容');
        return false;
      }
      const original = L.body;
      L.body = function (t) {
        return (
          (selected.includes('summary') ? original.call(L, t, 'capability') : '') +
          (selected.includes('details') ? L.appendixHTML(t) : '')
        );
      };
      try {
        const result = V.exportTaskReport(
          button.dataset.id,
          format,
          selected.includes('details') ? 'process' : 'capability',
        );
        if (result) menu.removeAttribute('open');
        return result;
      } finally {
        L.body = original;
      }
    };
    X.reportParts.exportMenu = N.exportMenu;
    // Drafts have their own storage and never enter the execution/report collections.
    D.drafts = () => (A.data.exerciseTaskDrafts ||= []);
    D.saveDraft = function () {
      if (!X.wizard) return false;
      X.wizard._draftId ||= 'DRAFT-' + Date.now().toString(36);
      const d = {
        id: X.wizard._draftId,
        updated: new Date().toLocaleString('zh-CN', { hour12: false }),
        config: copy(X.wizard),
      };
      const i = D.drafts().findIndex((r) => r.id === d.id);
      if (i >= 0) D.drafts()[i] = d;
      else D.drafts().unshift(d);
      A.save();
      A.closeModal();
      A.render();
      A.toast('草稿已保存，可在任务列表继续配置');
      return d;
    };
    D.deleteDraft = function (id) {
      A.data.exerciseTaskDrafts = D.drafts().filter((d) => d.id !== id);
      A.save();
      A.toast('草稿已删除');
      A.render();
    };
    D.resumeDraft = function (id) {
      const d = D.drafts().find((r) => r.id === id);
      if (!d) return false;
      if (A.evaluation) A.evaluation.showDrafts = false;
      P.go('exercise', 'tasks');
      X.wizard = copy(d.config);
      X.selected = null;
      X.wizardModal();
      return true;
    };
    const launch = X.launchTask;
    X.launchTask = function () {
      const id = X.wizard?._draftId,
        before = X.db.tasks.length,
        result = launch.apply(X, arguments);
      if (X.db.tasks.length > before && id) {
        A.data.exerciseTaskDrafts = D.drafts().filter((d) => d.id !== id);
        A.save();
      }
      return result;
    };
    // 草稿箱渲染已并入 evaluation-center 的 V.tasksHTML / V.draftBoxHTML，这里不再二次包装。
  })();
};
