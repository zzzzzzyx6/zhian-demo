/* 安全态势：dashboard-workbench。执行顺序由 src/boot.js 维护。 */
window.AppParts = window.AppParts || {};

// ─── dashboard-workbench ───────────────────────────────────────────────────
AppParts['dashboard/dashboard-workbench'] = function () {
  /* Home resources, next action, current execution, protection and follow-up. */
  (function () {
    'use strict';
    const A = window.App,
      H = A.platformHome,
      X = A.attack,
      E = A.escape;
    const stamp = (t) => Date.parse(t.finishedAt || t.finished || t.createdAt || t.created) || 0;
    const button = (text, action, cls = 'wb-text-link') =>
      `<button type="button" class="${cls}" onclick="${action}">${text}</button>`;
    const head = (name, description, link, action) =>
      `<header class="wb-card-head"><div><h2>${A.icon(name === '安全防护' ? 'shield' : 'activity', 20)}${name}</h2></div>${button(link + ' →', action)}</header>`;
    const priority = (e) => ({ R1: 0, R2: 1, R3: 2 })[e.classification?.priority] ?? 2;
    H.openArena = function () {
      A.platform.go('exercise', 'tasks');
    };
    H.openHomeTask = function (id) {
      const t = A.evaluation.allTasks().find((t) => t.id === id);
      if (!t) return;
      const scan = A.evaluation.type(t) === 'scan';
      if (A.evaluation.reportReady(t)) {
        if (scan) A.platform.go('scan', 'reports', 'scan', id);
        else A.platform.go('exercise', 'reports', id);
      } else
        A.platform.go(
          scan ? 'scan' : 'exercise',
          'tasks',
          scan ? t.type : id,
          scan ? id : undefined,
        );
    };
    H.openFirstRisk = function () {
      const e = H.snapshot()
        .pendingAlerts.slice()
        .sort(
          (a, b) =>
            priority(a) - priority(b) ||
            Date.parse(b.lastTriggeredAt || b.createdAt) -
              Date.parse(a.lastTriggeredAt || a.createdAt),
        )[0];
      H.openPendingRisk();
      if (e) A.platformGovernance.eventDetail(e.id);
    };
    H.configureNextApp = function () {
      const s = H.snapshot(),
        app =
          s.apps.find((a) => !A.guard.access.policies(a.id).length) ||
          s.apps.find((a) => !s.protectedApps.some((p) => p.id === a.id));
      H.openProtection();
      if (app) A.guard.views.configForm(app.id);
      else if (!s.apps.length) A.platform.go('assets', 'applications');
    };
    H.homeGuidance = function (s) {
      const risk = s.pendingAlerts.slice().sort((a, b) => priority(a) - priority(b))[0],
        level =
          risk?.classification?.levels?.[risk.classification.priority]?.name ||
          A.riskClassification.standard().levels[risk?.classification?.priority || 'R3'].name;
      if (risk && priority(risk) < 2)
        return {
          tone: risk.classification.priority.toLowerCase(),
          title: '优先跟进' + level + '风险',
          detail: `${s.pendingAlerts.filter((e) => e.classification?.priority === risk.classification?.priority).length} 项${level}风险待处理，查看触发证据并记录处置。`,
          action: 'App.platformHome.openFirstRisk()',
          label: '处理风险',
        };
      if (s.exceptions.length)
        return {
          tone: 'r2',
          title: '先排查异常评估任务',
          detail: `${s.exceptions.length} 个任务执行异常，查看日志后再决定复测。`,
          action: 'App.platformHome.openExceptions()',
          label: '排查异常',
        };
      if (s.pendingReviews.length)
        return {
          tone: 'r2',
          title: '完成待复核记录的判断',
          detail: `${s.pendingReviews.length} 条防护记录等待人工确认。`,
          action: 'App.platformHome.openReviews()',
          label: '开始复核',
        };
      if (risk)
        return {
          tone: 'r3',
          title: '跟进尚未关闭的风险',
          detail: `${s.pendingAlerts.length} 项风险仍需处理，可查看证据与处理记录。`,
          action: 'App.platformHome.openPendingRisk()',
          label: '查看风险',
        };
      if (s.pendingModels.length)
        return {
          tone: 'blue',
          title: '完善模型用途，准备开始评估',
          detail: `${s.pendingModels.length} 个模型需要配置或确认用途。`,
          action: 'App.platformHome.openPendingModels()',
          label: '配置模型',
        };
      if (s.tasks.some((t) => t.status === 'running'))
        return {
          tone: 'blue',
          title: '评估正在执行，关注最新进展',
          detail: '查看当前执行环节与已经产生的结果。',
          action: 'App.platformHome.openEvaluation()',
          label: '查看进展',
        };
      if (s.protectedApps.length < s.apps.length)
        return {
          tone: 'blue',
          title: '继续完成应用防护接入',
          detail: '绑定防护策略，并在应用服务端完成 API / SDK 接入验证。',
          action: 'App.platformHome.configureNextApp()',
          label: '配置防护',
        };
      return {
        tone: 'blue',
        title: s.tasks.length ? '开始下一轮安全验证' : '从一次安全评估开始',
        detail: s.tasks.length
          ? '针对模型或软件的新变化创建任务，持续积累可比较的结果。'
          : '选择漏洞检测或模型演练，完成配置后查看结果报告。',
        action: 'App.evaluation.newTask()',
        label: '新建评估',
      };
    };
    H.homeScanCoverage = (s) => [
      { kind: 'code', name: '代码', n: Math.max(3, s.code.length) },
      { kind: 'packages', name: '二进制/软件包', n: Math.max(2, s.packages.length) },
      { kind: 'web', name: 'Web', n: Math.max(2, s.web.length) },
    ];
    H.homeScanPosture = function (s) {
      const levels = [
          ['严重', 3, 'oklch(55% .2 25)'],
          ['高危', 9, 'oklch(63% .17 45)'],
          ['中危', 18, 'oklch(70% .14 75)'],
          ['低危', 8, 'oklch(60% .03 60)'],
        ],
        total = levels.reduce((n, r) => n + r[1], 0);
      let offset = 0;
      const arcs = levels
        .map(([name, n, color]) => {
          const arc = `<circle cx="70" cy="70" r="53" fill="none" stroke="${color}" stroke-width="18" pathLength="100" stroke-dasharray="${(n / total) * 100} ${100 - (n / total) * 100}" stroke-dashoffset="${-offset}" transform="rotate(-90 70 70)"><title>${name} ${n} 个</title></circle>`;
          offset += (n / total) * 100;
          return arc;
        })
        .join('');
      return `<div class="wb-scan-overview"><div class="wb-scan-pie"><svg viewBox="0 0 140 140" role="img" aria-label="累计发现38个漏洞，严重3、高危9、中危18、低危8">${arcs}</svg><span><b>${total}</b><small>累计漏洞</small></span></div><div class="wb-scan-legend">${levels.map(([name, n, color]) => `<span><i style="background:${color}"></i>${name}<b>${n}</b></span>`).join('')}</div></div><div class="wb-scan-coverage-heading"><h4>扫描覆盖资产明细</h4><p>按资产类型展示扫描覆盖数量（本地记录），单位为资产项。</p></div><div class="wb-scan-object-bars">${H.homeScanCoverage(
        s,
      )
        .map((r, i) => {
          const total = H.homeScanCoverage(s).reduce((n, r) => n + r.n, 0);
          return `<div class="wb-scan-object-row"><span>${r.name}</span><div class="wb-scan-object-track"><i style="width:${(r.n / total) * 100}%;background:${['#348875', '#95a5c3', '#d59a38'][i]}"></i></div><b>${r.n}<small> 项</small></b></div>`;
        })
        .join('')}</div><section class="wb-scan-block"><h4>资产风险</h4>${[
        ['支付网关代码', 19, '-3'],
        ['OpenRT 软件包', 12, '+2'],
        ['管理后台 Web', 7, '-1'],
      ]
        .map(
          ([name, n, delta]) =>
            `<div class="wb-scan-asset"><div><b>${name}</b><small><em class="wb-vulnerability-count">${n}</em> 个漏洞</small></div><span class="${delta.startsWith('+') ? 'up' : 'down'}">较上轮 ${delta} 个严重/高危</span></div>`,
        )
        .join('')}</section>`;
    };
    H.homeEvaluation = function (s) {
      const scan = `<section class="wb-card wb-scan-card">${head('安全扫描', '', '扫描任务', "App.platform.go('scan','tasks')")}<section class="wb-assessment-section" data-kind="scan">${H.homeScanPosture(s)}</section></section>`;
      const exercise = `<section class="wb-card wb-exercise-card">${head('模型演练', '', '演练任务', "App.platform.go('exercise','tasks')")}<section class="wb-assessment-section" data-kind="attack">${H.homeAttackSummary(s.attacks)}<p class="wb-ranking-note">攻破率Top3</p>${H.homeRiskChart(s.attacks)}${H.homeMethodChart(s.attacks)}</section></section>`;
      return scan + exercise;
    };
    H.homeAttackSummary = function (tasks) {
      const rows = tasks.filter((t) => !t.deletedAt),
        targets = new Set(rows.map((t) => t.targetSnapshot?.id || t.model).filter(Boolean)),
        questions = new Set();
      rows.forEach((t) =>
        (t.units || []).forEach((u) => {
          if (u.questionId)
            questions.add(
              (t.bankSnapshot?.id || t.runSnapshot?.bankSnapshot?.id || '') + ':' + u.questionId,
            );
        }),
      );
      return `<dl class="wb-result-facts"><div><dt>靶标对象</dt><dd>${targets.size}</dd></div><div><dt>演练任务</dt><dd>${rows.length}</dd></div><div><dt>覆盖题目</dt><dd>${questions.size}</dd></div></dl>`;
    };
    H.homeMethodChart = function (tasks) {
      const methods = new Map();
      tasks
        .filter((t) => !t.deletedAt)
        .forEach((t) =>
          (t.units || []).forEach((u) => {
            if (!u.result || ['pending', 'error'].includes(u.result)) return;
            const r = methods.get(u.method) || { name: u.method, breach: 0, valid: 0 };
            r.valid++;
            if (u.result === 'breach') r.breach++;
            methods.set(u.method, r);
          }),
        );
      const rows = [...methods.values()]
        .filter((r) => r.breach)
        .sort((a, b) => b.breach / b.valid - a.breach / a.valid || b.breach - a.breach)
        .slice(0, 3);
      return `<div class="wb-method-chart"><div class="wb-dimension-summary"><strong>攻击方法</strong></div>${rows.map((r) => `<div class="wb-method-row"><span>${E(r.name || '未知方法')}</span><b>${Math.round((r.breach / r.valid) * 100)}% <small>${r.breach} / ${r.valid}</small></b><div><i style="width:${(r.breach / r.valid) * 100}%"></i></div></div>`).join('') || '<p class="wb-result-empty">暂无有效攻破记录</p>'}</div>`;
    };
    H.homeRiskDimensions = function (tasks) {
      const dimensions = new Map();
      let unclassified = 0;
      for (const task of tasks.filter((t) => !t.deletedAt)) {
        const snapshot =
          task.runSnapshot?.bankSnapshot ||
          task.runSnapshot?.policy?.bankSnapshot ||
          task.runSnapshot?.policySnapshot?.bankSnapshot ||
          task.bankSnapshot;
        const analysis = X.taskAnalysis({ ...task, bankSnapshot: snapshot });
        unclassified += analysis.unclassifiedSceneUnits;
        for (const scene of analysis.relatedScenes) {
          const row = dimensions.get(scene.id) || {
            id: scene.id,
            label: scene.label,
            breach: 0,
            valid: 0,
            pending: 0,
            errors: 0,
            total: 0,
            tasks: [],
          };
          for (const key of ['breach', 'valid', 'pending', 'errors', 'total'])
            row[key] += scene[key];
          row.tasks.push({ task, scene });
          dimensions.set(scene.id, row);
        }
      }
      const rows = [...dimensions.values()].sort(
        (a, b) =>
          b.breach - a.breach ||
          (b.valid ? b.breach / b.valid : 0) - (a.valid ? a.breach / a.valid : 0) ||
          b.valid - a.valid ||
          a.label.localeCompare(b.label),
      );
      return { rows, unclassified };
    };
    H.homeRiskChart = function (tasks) {
      const dimensions = H.homeRiskDimensions(tasks),
        rows = dimensions.rows
          .filter((r) => r.breach > 0 && r.valid > 0)
          .sort((a, b) => b.breach / b.valid - a.breach / a.valid || b.breach - a.breach)
          .slice(0, 3),
        unclassified = dimensions.unclassified,
        max = Math.max(1, ...rows.map((r) => r.breach));
      return `<div class="wb-risk-dimensions"><div class="wb-dimension-summary"><strong>风险维度</strong></div><div class="wb-dimension-bars">${rows.map((r, i) => `<button type="button" class="wb-dimension-row ${r.breach && i === 0 ? 'is-leading' : r.breach ? 'has-risk' : 'is-clear'}" data-scene="${E(r.id)}" onclick="App.platformHome.openRiskDimension(this.dataset.scene)" title="${E(r.label + '：' + r.breach + ' 次攻破 / ' + r.valid + ' 次有效判定，' + r.pending + ' 个待判定，' + r.errors + ' 个异常；点击查看关联任务')}"><span class="wb-dimension-name">${E(r.label)}${i === 0 && r.breach ? '<i>重点</i>' : ''}</span><span class="wb-dimension-value"><b>${Math.round((r.breach / r.valid) * 100)}%</b><small> ${r.breach} / ${r.valid}</small></span><span class="wb-dimension-track"><i style="width:${(r.breach / r.valid) * 100}%"></i></span></button>`).join('') || '<p class="wb-result-empty">暂无已确认的攻破风险</p>'}</div>${unclassified ? `<p class="wb-dimension-note">另有 ${unclassified} 个测试单元未标注场景</p>` : ''}</div>`;
    };
    H.openRiskDimension = function (id) {
      const row = H.homeRiskDimensions(H.snapshot().attacks).rows.find((r) => r.id === id);
      if (!row) return;
      A.modal(
        E(row.label) + ' · 关联演练',
        `<div class="wb-task-results">${row.tasks
          .slice()
          .sort((a, b) => b.scene.breach - a.scene.breach || stamp(b.task) - stamp(a.task))
          .map(
            ({ task, scene }) =>
              `<button type="button" data-id="${E(task.id)}" onclick="App.closeModal();App.platformHome.openHomeTask(this.dataset.id)"><span>${E(task.name)}</span><small>攻破 ${scene.breach} / 有效 ${scene.valid}${scene.pending ? ' · 待判定 ' + scene.pending : ''}${scene.errors ? ' · 异常 ' + scene.errors : ''}</small><b>→</b></button>`,
          )
          .join('')}</div>`,
        '<button class="btn" onclick="App.closeModal()">关闭</button>',
        { wide: true },
      );
    };
    H.homeProtectionApps = function (s) {
      return `<section class="wb-connected-apps"><h3><span>接入应用</span><small>${s.apps.length} 项</small></h3>${
        s.apps
          .map((app) => {
            const protectedApp = s.protectedApps.some((p) => p.id === app.id),
              state = protectedApp
                ? '防护中'
                : !A.guard.access.policies(app.id).length
                  ? '待配置'
                  : '未启用',
              records = s.requests.filter((r) => r.appId === app.id),
              reviews = s.pendingReviews.filter((v) =>
                records.some((r) => r.id === v.requestId),
              ).length;
            return `<button type="button" class="wb-connected-app" data-app="${E(app.id)}" onclick="App.platformHome.openProtectionApp(this.dataset.app)"><span class="wb-app-dot ${protectedApp ? 'on' : ''}"></span><span class="wb-app-copy"><strong>${E(app.name)}</strong><small>${records.length} 条检测记录${reviews ? ' · 待复核 ' + reviews + ' 条' : ''}</small></span><span class="wb-app-state ${reviews ? 'needs-review' : protectedApp ? 'on' : ''}">${reviews ? '待复核' : state}</span><span class="wb-app-arrow">→</span></button>`;
          })
          .join('') || '<p class="wb-result-empty">暂无接入应用</p>'
      }</section>`;
    };
    H.openProtectionApp = function (id) {
      if (!A.guard.access.app(id)) return;
      H.openProtection();
      A.guard.views.configForm(id);
    };
    H.homeProtection = function (s) {
      const rows = [
          ['Safe', '安全', '#348875'],
          ['Controversial', '争议', '#d59a38'],
          ['Unsafe', '不安全', '#c45568'],
        ].map(([id, name, color]) => ({ name, color, n: s.recordSummary.counts[id] || 0 })),
        total = rows.reduce((n, r) => n + r.n, 0),
        uncovered = s.apps.length - s.protectedApps.length;
      return `<section class="wb-card wb-protection">${head('安全防护', '确认接入，跟进处置', '总览', 'App.platformHome.openProtection()')}<div class="wb-protection-body"><div class="wb-coverage-summary"><button type="button" class="wb-coverage" aria-label="${!s.apps.length ? '接入首个应用' : uncovered ? '配置应用防护' : '查看防护应用'}" onclick="${uncovered || !s.apps.length ? 'App.platformHome.configureNextApp()' : 'App.platformHome.openProtection()'}"><strong>${s.protectedApps.length}<small> / ${s.apps.length}</small></strong><span class="wb-coverage-copy"><b>应用防护中</b><span>${!s.apps.length ? '先接入业务应用' : uncovered ? '还有 ' + uncovered + ' 个应用待启用或验证' : '全部应用已接入防护'}</span></span></button><dl class="wb-protection-metrics" aria-label="防护处置统计"><div><dt>已阻断</dt><dd>${s.blocked}</dd></div><div><dt>待复核</dt><dd>${s.pendingReviews.length}</dd></div></dl></div><div class="wb-detection-title"><span>有效检测记录</span><strong>${total}<small> 条</small></strong></div><div class="wb-verdict-strip" role="img" aria-label="${E(rows.map((r) => r.name + ' ' + r.n + ' 条').join('，'))}">${rows
        .filter((r) => r.n)
        .map(
          (r) =>
            `<span style="width:${(r.n / Math.max(1, total)) * 100}%;background:${r.color}"></span>`,
        )
        .join(
          '',
        )}</div><div class="wb-verdict-legend">${rows.map((r) => `<div><i style="background:${r.color}"></i><span>${r.name}</span><b>${r.n}</b></div>`).join('')}</div><p class="wb-protection-note">检测异常 ${s.recordSummary.counts.Unknown || 0} 条 · 不计入有效判定。安全放行，争议与不安全拦截；已阻断按执行回执统计，可能包含异常策略阻断。</p><details class="wb-protection-help"><summary>配置与启用有什么区别？</summary><p>配置：为应用选择防护策略及检测范围。启用：开始执行已配置的防护；收到有效接入和执行回执后显示“防护中”。待验证表示已启用但接入尚未验证，未启用表示尚未开启防护。</p></details>${H.homeProtectionApps(s)}</div></section>`;
    };
    H.homeTodos = function (s) {
      const risks = s.pendingAlerts.map((e) => ({
        kind: 'risk',
        id: e.id,
        name:
          (e.assetName || e.assetId || '未命名对象') +
          ' · ' +
          (e.classification?.categoryName || '风险待处理'),
        detail: e.ruleSnapshot?.name || '查看风险证据',
        label: A.riskClassification.standard().levels[e.classification?.priority || 'R3'].name,
        tone: 'rc-priority rc-' + (e.classification?.priority || 'R3').toLowerCase(),
        rank: priority(e) < 2 ? priority(e) : 4,
        at: e.lastTriggeredAt || e.createdAt,
      }));
      const errors = s.exceptions.map((t) => ({
        kind: 'error',
        category: A.evaluation.type(t) === 'scan' ? 'scan' : 'attack',
        id: t.id,
        name: t.name,
        detail: t.error || t.errorMessage || '查看执行日志，排查异常原因后重试',
        label: '查看异常',
        tone: 'wb-todo-label',
        rank: 2,
        at: t.finishedAt || t.finished || t.created,
      }));
      const apps = new Map();
      for (const v of s.pendingReviews) {
        const r = A.guard.records.get(v.requestId);
        if (!r) continue;
        const row = apps.get(r.appId) || {
          kind: 'review-app',
          category: 'review',
          id: r.appId,
          name: A.guard.access.appName(r.appId),
          count: 0,
          detail: '',
          label: '人工复核',
          tone: 'wb-todo-label',
          rank: 3,
          at: v.createdAt || r.createdAt,
        };
        row.count++;
        row.detail = row.count + ' 条内容待复核 · 需结合业务语境确认';
        apps.set(r.appId, row);
      }
      const reviews = [...apps.values()];
      return [...risks, ...errors, ...reviews].sort(
        (a, b) => a.rank - b.rank || (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0),
      );
    };
    H.homeTodoList = (rows) =>
      rows.length
        ? `<ul class="wb-todo-list">${rows.map((r) => `<li><button type="button" data-kind="${r.kind}" data-id="${E(r.id)}" title="${E(r.name + '；' + r.detail)}" onclick="App.platformHome.openHomeTodo(this.dataset.kind,this.dataset.id)"><span class="wb-todo-copy"><span class="wb-todo-name">${E(r.name)}</span><small>${E(r.detail)}</small></span><span class="${r.tone}">${E(r.label)}</span></button></li>`).join('')}</ul>`
        : '<p class="wb-todo-empty">暂无待处理事项</p>';
    H.openHomeTodo = function (kind, id) {
      A.closeModal();
      if (kind === 'risk') {
        H.openPendingRisk();
        A.platformGovernance.eventDetail(id);
      } else if (kind === 'error') {
        H.openHomeTask(id);
      } else if (kind === 'review-app') {
        H.openAppReviews(id);
      } else if (kind === 'review') {
        H.openProtection();
        A.guard.views.reviewForm(id);
      }
    };
    H.openAppReviews = function (id) {
      const R = A.guard.records,
        rows = R.reviews()
          .filter((v) => v.status === 'pending')
          .flatMap((v) => {
            const r = R.get(v.requestId);
            if (r?.appId !== id) return [];
            return r
              ? [
                  {
                    kind: 'review',
                    id: v.id,
                    name: r.text || r.id,
                    detail:
                      (r.stage === 'input' ? '输入' : '输出') +
                      '内容 · ' +
                      (r.reviewReason || '等待人工确认'),
                    label: '去复核',
                    tone: 'wb-todo-label',
                  },
                ]
              : [];
          });
      A.modal(
        E(s.appName(id)) + ' · 待复核 ' + rows.length + ' 条',
        H.homeTodoList(rows),
        '<button class="btn" onclick="App.closeModal()">关闭</button>',
        { wide: true },
      );
    };
    H.openHomeTodos = function () {
      const todos = H.homeTodos(H.snapshot());
      A.modal(
        '待办事项',
        '<h3 class="wb-todo-section-title">风险事件</h3>' +
          H.homeTodoList(todos.filter((r) => r.kind === 'risk')) +
          '<h3 class="wb-todo-section-title">任务与复核</h3>' +
          H.homeTodoList(todos.filter((r) => r.kind !== 'risk')),
        '<button class="btn" onclick="App.closeModal()">关闭</button>',
        { wide: true },
      );
    };
    H.homeFollowup = function (s) {
      const g = H.homeGuidance(s),
        live = s.attacks.filter((t) => t.status === 'running').length;
      const todos = H.homeTodos(s),
        operations = ['scan', 'attack', 'review']
          .map((category) => todos.find((r) => r.category === category))
          .filter(Boolean),
        levels = ['R1', 'R2', 'R3'].map((id) => ({
          id,
          name: A.riskClassification.standard().levels[id].name,
          n: s.pendingAlerts.filter((e) => (e.classification?.priority || 'R3') === id).length,
        }));
      let offset = 0;
      const arcs = levels
        .filter((l) => l.n)
        .map((l) => {
          const n = (l.n / s.pendingAlerts.length) * 100,
            html = `<circle class="rc-${l.id.toLowerCase()}" cx="80" cy="80" r="62" pathLength="100" fill="none" stroke="var(--rc-bg)" stroke-width="15" stroke-dasharray="${n} ${100 - n}" stroke-dashoffset="${-offset}" transform="rotate(-90 80 80)"/>`;
          offset += n;
          return html;
        })
        .join('');
      return `<section class="wb-card wb-followup wb-attention" aria-label="风险提醒与待办"><div class="wb-attention-left"><div class="wb-attention-guidance"><div class="wb-attention-title"><h2>${A.icon('alert', 20)}建议：${E(g.title)}</h2>${button(g.label + ' →', g.action, 'wb-guide-action')}</div><p>${E(g.detail)}</p></div><section class="wb-risk-section"><h3 class="wb-todo-section-title">风险事件</h3><div class="wb-risk-overview"><button class="wb-risk-ring" onclick="App.platformHome.openPendingRisk()" aria-label="查看 ${s.pendingAlerts.length} 项未关注风险"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="62" fill="none" stroke="#efe8d8" stroke-width="15"/>${arcs}</svg><span><strong>${s.pendingAlerts.length}</strong><small>未关注风险</small></span></button><div class="wb-risk-levels">${levels
        .map(
          (l) =>
            `<div class="wb-risk-level-row"><button class="wb-risk-level-count" data-level="${l.id}" onclick="App.platformHome.openPendingRisk(this.dataset.level)"><span class="rc-priority rc-${l.id.toLowerCase()}">${E(l.name)}</span><strong>${l.n}</strong></button><div class="wb-risk-event-names">${todos
              .filter(
                (r) =>
                  r.kind === 'risk' &&
                  s.pendingAlerts.some(
                    (e) => e.id === r.id && (e.classification?.priority || 'R3') === l.id,
                  ),
              )
              .map(
                (r) =>
                  `<button data-id="${E(r.id)}" title="${E(r.name)}" onclick="App.platformHome.openHomeTodo('risk',this.dataset.id)">${E(r.name)} <span>→</span></button>`,
              )
              .join('')}</div></div>`,
        )
        .join(
          '',
        )}</div></div></section></div><section class="wb-attention-todos"><header><h2>${A.icon('file', 20)}待办事项</h2>${button('全部 ' + todos.length + ' 项 →', 'App.platformHome.openHomeTodos()')}</header>${live ? `<div class="wb-attention-subhead">${button('<i class="wb-pulse"></i>' + live + ' 个演练进行中 →', 'App.platformHome.openArena()', 'wb-live-entry')}</div>` : ''}${H.homeTodoList(operations)}</section></section>`;
    };
    H.openHomeResource = function (kind, id) {
      if (kind === 'method') {
        H.openMethod(id);
        return;
      }
      if (kind === 'bank') {
        H.openBanks();
        if (id) A.banks.open(id);
        return;
      }
      if (kind === 'basic') {
        A.platform.go('policy', 'defense', 'basics');
        if (id) A.guard.policyViews.detail(id);
        return;
      }
      if (kind === 'rule') {
        const r = A.guard.rules.get(id);
        A.platform.go('policy', 'defense', r?.type === 'word' ? 'knowledge' : 'rules');
        if (id) A.guard.policyViews.ruleDetail(id);
      }
    };
    H.homeResources = function (s) {
      const p = H.strategies(),
        configs = A.guard.policies.all();
      const rows = [
        ['applications', 'AI 应用', s.apps, '#4779b5'],
        ['models', '模型', s.models, '#6d70b2'],
        ['code', '代码', s.code, '#348875'],
        ['packages', '二进制 / 软件包', s.packages, '#95a5c3'],
        ['web', 'Web', s.web, '#d59a38'],
      ].map(([kind, name, items, color]) => ({
        kind,
        name,
        n: H.homeScanCoverage(s).find((r) => r.kind === kind)?.n ?? items.length,
        color,
      }));
      const total = rows.reduce((n, r) => n + r.n, 0);
      let angle = -Math.PI / 2;
      const slices = rows
        .filter((r) => r.n)
        .map((r) => {
          const start = angle;
          angle += (r.n / total) * Math.PI * 2;
          const title = `<title>${E(r.name)}：${r.n} 项</title>`;
          if (r.n === total)
            return `<circle cx="90" cy="90" r="82" fill="${r.color}">${title}</circle>`;
          const point = (a) =>
            `${(90 + 82 * Math.cos(a)).toFixed(4)} ${(90 + 82 * Math.sin(a)).toFixed(4)}`;
          return `<path d="M 90 90 L ${point(start)} A 82 82 0 ${r.n / total > 0.5 ? 1 : 0} 1 ${point(angle)} Z" fill="${r.color}" stroke="#fff" stroke-width="2" stroke-linejoin="round">${title}</path>`;
        })
        .join('');
      const chart = `<svg class="wb-asset-pie" viewBox="0 0 180 180" role="img" aria-label="${E('资产分布，共 ' + total + ' 项：' + rows.map((r) => r.name + ' ' + r.n + ' 项').join('，'))}">${slices || '<circle cx="90" cy="90" r="82" fill="#e8eef5"/><text x="90" y="94" text-anchor="middle" fill="#72869b" font-size="14">暂无资产</text>'}</svg>`;
      const count = (name, n, action) =>
        button(`<span>${name}</span><strong>${n}</strong>`, action, 'wb-strategy-count');
      const tag = (r) =>
        `<button type="button" class="wb-resource-tag" data-kind="${r.kind}" data-id="${E(r.id)}" title="${E(r.name)}" onclick="App.platformHome.openHomeResource(this.dataset.kind,this.dataset.id)">${E(r.name)}</button>`;
      const group = (name, all, shown, action) =>
        `<div class="wb-resource-family">${button(`<span>${name}</span><b>${all.length}</b>`, action, 'wb-resource-family-title')}<div class="wb-resource-tags">${shown.map(tag).join('') || '<span class="wb-resource-none">暂无资源</span>'}${all.length > shown.length ? `<button type="button" class="wb-resource-more" title="查看全部${name}" aria-label="查看全部${name}，共 ${all.length} 项" onclick="${action}">…</button>` : ''}</div></div>`;
      const methods = p.featuredMethods.map((r) => ({ ...r, kind: 'method' })),
        banks = p.banks.map((r) => ({ ...r, kind: 'bank' })),
        basics = configs.filter((p) => p.isStandard).map((r) => ({ ...r, kind: 'basic' }));
      const rules = A.guard.rules.store().map((r) => ({ ...r, kind: 'rule' })),
        knowledge = rules;
      const featuredKnowledge = [
        rules.find((r) => r.type === 'word'),
        rules.find((r) => r.type !== 'word'),
      ].filter(Boolean);
      for (const r of knowledge) {
        if (featuredKnowledge.length >= 3) break;
        if (!featuredKnowledge.some((v) => v.kind === r.kind && v.id === r.id))
          featuredKnowledge.push(r);
      }
      const attackResources = `<section class="wb-strategy-column" aria-label="攻击策略资源">${count('攻击策略', p.attack.length, 'App.platformHome.openAttackPolicies()')}${group('攻击方法', p.methods, methods, 'App.platformHome.openMethod()')}${group('攻击题库', banks, banks.slice(0, 2), 'App.platformHome.openBanks()')}</section>`;
      const defenseResources = `<section class="wb-strategy-column" aria-label="防护策略资源">${count('防护策略', configs.length, 'App.platformHome.openDefense()')}${group('基础策略', basics, basics.slice(0, 3), "App.platformHome.openHomeResource('basic')")}${group('规则与知识库', knowledge, featuredKnowledge, 'App.platformHome.openDefenseResources()')}</section>`;
      return `<section class="wb-resources" aria-label="资产与策略资源"><section class="wb-resource-card wb-assets"><header class="wb-resource-head"><h2>${A.icon('box', 20)}资产分布</h2><span class="wb-resource-total">共 <b>${total}</b> 项</span></header><div class="wb-asset-distribution">${chart}<div class="wb-asset-legend">${rows.map((r) => `<button type="button" data-kind="${r.kind}" aria-label="${E(r.name)} ${r.n} 项，查看资产" onclick="App.platformHome.openAsset(this.dataset.kind)"><i style="background:${r.color}"></i><span>${r.name}</span><span style="--asset-color:${r.color}" class="wb-asset-value ${r.n ? '' : 'is-zero'}"><b>${r.n}</b><small>项</small></span></button>`).join('')}</div></div><footer>${button('资产中心 →', 'App.platformHome.openAsset()')}</footer></section><section class="wb-resource-card wb-strategies"><header class="wb-resource-head"><h2>${A.icon('settings', 20)}策略资源</h2><span class="wb-resource-total">共 <b>${p.attack.length + configs.length}</b> 项</span></header><div class="wb-strategy-columns">${attackResources}${defenseResources}</div><footer>${button('策略配置 →', 'App.platformHome.openAttackPolicies()')}</footer></section></section>`;
    };
    H.openDefenseResources = function () {
      const rows = [
        ...A.guard.rules.store().map((r) => ({
          kind: 'rule',
          id: r.id,
          name: r.name,
          type: { word: '词库', regex: '正则规则', semantic: '语义规则' }[r.type] || '规则',
        })),
      ];
      A.modal(
        '防护规则与词库',
        `<div class="wb-task-results">${rows.map((r) => `<button type="button" data-kind="${r.kind}" data-id="${E(r.id)}" onclick="App.closeModal();App.platformHome.openHomeResource(this.dataset.kind,this.dataset.id)"><span>${E(r.name)}</span><small>${r.type}</small><b>→</b></button>`).join('') || '<p class="empty">暂无规则或知识库内容</p>'}</div>`,
        '<button class="btn" onclick="App.closeModal()">关闭</button>',
        { wide: true },
      );
    };
  })();
};
