/* evaluation/october-refinement。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['evaluation/october-refinement'] = function () {
  /* Product review: independent work areas, focused task presentation and review queue. */
  (function () {
    'use strict';
    const A = window.App,
      P = A.platform,
      X = A.attack,
      V = A.evaluation,
      H = A.platformHome,
      D = A.demoPresentation,
      E = A.escape;
    const R = (A.octoberRefinement = {});
    const scanSide = () => P.state.section === 'scan';
    const arr = (v) => (Array.isArray(v) ? v : []),
      copy = (v) => JSON.parse(JSON.stringify(v)),
      opt = (v, label, current) =>
        `<option value="${E(v)}" ${v === current ? 'selected' : ''}>${E(label)}</option>`;
    const state = (t) =>
      ({
        running: '运行中',
        done: '已完成',
        error: '异常终止',
        stopped: '已终止',
        queued: '等待中',
        pending: '等待中',
      })[t?.status] || '暂无任务';
    const btn = (label, action, cls = 'link-btn') =>
      `<button type="button" class="${cls}" onclick="${action}">${label}</button>`;
    const link = (label, id, action) =>
      `<button type="button" class="link-btn" data-id="${E(id)}" onclick="${action}(this.dataset.id)">${E(label)}</button>`;
    /* 演练报告不单独列出：有任务直接打开该报告，否则回到演练任务。 */
    const reportList = V.openReportList;
    V.openReportList = function (id) {
      const t = id && V.allTasks().find((t) => t.id === id);
      if (t && V.type(t) !== 'scan') return V.openReport(id);
      reportList.apply(V, arguments);
    };
    const reports = V.reports;
    V.reports = function () {
      return reports.apply(V, arguments).filter((t) => V.type(t) === 'scan');
    };
    V.reportsHTML = function () {
      const rows = V.reports();
      return (
        A.heading(
          '',
          '扫描报告',
          '',
          `<input type="search" aria-label="搜索报告" placeholder="搜索任务名称" value="${E(V.reportFilters.query || '')}" onchange="App.evaluation.reportFilters.query=this.value;App.render()">`,
        ) +
        `<section class="card"><div class="table-wrap"><table><thead><tr><th>报告名称</th><th>任务状态</th><th>任务创建时间</th><th>生成时间</th><th>操作</th></tr></thead><tbody>${rows.map((t) => `<tr><td>${link(t.name, t.id, 'App.evaluation.openReport')}</td><td>${state(t)}</td>${A.listConsistency.cell(A.listConsistency.created(t))}${A.listConsistency.cell(A.listConsistency.generated(t))}<td>${link('查看报告', t.id, 'App.evaluation.openReport')} ${link('删除', t.id, 'App.reviewPolish.removeEvaluation')}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">暂无报告，任务产生有效结果后可在这里查看。</td></tr>'}</tbody></table></div></section>`
      );
    };
    R.results = function () {
      const scan = scanSide(),
        tasks = (scan ? A.scanProduct.tasks() : X.db.tasks).filter(
          (t) => !t.deletedAt && (scan || V.type(t) === 'attack'),
        );
      const completed = tasks.filter((t) => V.reportReady(t)),
        total = tasks.length;
      return (
        A.heading('', scan ? '扫描结果' : '模型结果', '按任务查看结果与对应证据。') +
        `<div class="or-metrics">${[
          ['全部任务', total],
          ['已有报告', completed.length],
          ['进行中', tasks.filter((t) => t.status === 'running').length],
        ]
          .map(([name, n]) => `<div><span>${name}</span><strong>${n}</strong></div>`)
          .join(
            '',
          )}</div><section class="card"><div class="table-wrap"><table><thead><tr><th>任务</th><th>对象</th><th>状态</th><th>结果</th><th>操作</th></tr></thead><tbody>${
          tasks
            .map((t) => {
              const a = scan ? null : X.taskAnalysis(t);
              return `<tr><td>${link(t.name, t.id, scan ? 'App.scanProduct.open' : 'App.attack.open')}</td><td>${E(scan ? t.targetName || t.target || '扫描对象' : X.targetFor(t)?.name || '未记录')}</td><td>${state(t)}</td><td>${scan ? (V.reportReady(t) ? '已生成扫描报告' : '等待扫描结果') : a.valid ? `${a.breach} / ${a.valid} 个有效测试攻破` : '尚无有效判定'}</td><td>${V.reportReady(t) ? link('查看报告', t.id, 'App.evaluation.openReport') : '—'}</td></tr>`;
            })
            .join('') || '<tr><td colspan="5" class="empty">尚无任务结果</td></tr>'
        }</tbody></table></div></section>`
      );
    };
    /* 结果页：扫描结果与模型结果各自一条路由。 */
    P.routes['scan/results'] = () => R.results();
    P.routes['exercise/results'] = () => R.results();
    // One live task, or the most recently created task when no run is active.
    R.latestTask = () =>
      X.db.tasks
        .filter((t) => !t.deletedAt && V.type(t) === 'attack')
        .slice()
        .sort(
          (a, b) =>
            (b.status === 'running') - (a.status === 'running') ||
            String(b.created || '').localeCompare(String(a.created || '')),
        )[0];
    D.scanPanel = () =>
      `<section class="runtime-panel runtime-scan or-scan-empty" aria-label="安全扫描预留区域"><header><div><h3>安全扫描</h3></div><span class="or-live-status">待接入</span></header><div class="wb-scan-reserved"><div class="wb-scan-reserved-orbit" aria-hidden="true"><i></i><span></span></div><strong>扫描任务进度</strong><p>预留区域</p></div><footer><button type="button" class="link-btn" onclick="App.platform.go('scan','tasks')">扫描任务 <span aria-hidden="true">→</span></button></footer></section>`;
    D.attackPanel = function () {
      const t = R.latestTask(),
        live = t?.status === 'running',
        a = t ? X.taskAnalysis(t) : { total: 0, done: 0, valid: 0, breach: 0 },
        progress = a.total ? Math.round((a.done / a.total) * 100) : 0;
      const unit =
          t?.units?.find((u) => u.result === 'pending' && u.events?.length) ||
          t?.units?.find((u) => u.result === 'pending') ||
          t?.units?.at(-1),
        guard = t ? X.guardFlow(t) : {};
      const raw = unit?.events?.at(-1)?.phase,
        phase = unit?.eventSchema === 5 ? raw : raw === 0 ? 1 : raw === 1 ? 2 : raw === 2 ? 4 : -1;
      const labels = ['红队构造', '输入防护', '目标模型', '输出防护', '裁判判定'],
        icons = ['zap', 'shield', 'box', 'shield', 'check'];
      const question =
        t && unit
          ? A.taskReports.question(t, unit)?.prompt ||
            unit.seedPrompt ||
            unit.attackPrompt ||
            unit.roundHistory?.at(-1)?.prompt ||
            '题目内容未保存'
          : '创建模型演练任务后，在这里查看执行进程。';
      const displayQuestion = String(question).replace(/^(?:\s*\[[^\]\r\n]*\]\s*)+/, '');
      return `<section class="runtime-panel runtime-exercise or-arena ${live ? 'is-live' : ''}" aria-label="模型演练运行面板"><header><div><h3>模型演练</h3></div><span class="or-live-status"><i></i>${state(t)}</span></header><div class="or-arena-stage"><div class="or-stage-grid"></div><div class="or-flow-track"></div><div class="or-flow-nodes">${labels
        .map((name, i) => {
          const skipped = (i === 1 && !guard.input) || (i === 3 && !guard.output),
            active = live && i === phase && !skipped;
          return `<div class="or-flow-node ${active ? 'active' : ''} ${skipped ? 'skipped' : ''}"><div class="or-node-symbol">${A.icon(icons[i], i === 2 ? 28 : 20)}</div><strong>${name}</strong><span>${!t ? '待任务' : skipped ? '未配置' : active ? '执行中' : t.status === 'done' ? '已完成' : live ? '等待调度' : '已结束'}</span></div>`;
        })
        .join(
          '',
        )}</div></div><div class="or-progress-caption"><span>测试进度 <b>${a.done.toLocaleString()} / ${a.total.toLocaleString()}</b></span><strong>${progress}%</strong></div><div class="or-progress"><i style="width:${progress}%"></i></div><div class="or-current-question"><span>${live ? '当前攻击题目' : '最近攻击题目'}</span><p title="${E(displayQuestion)}">${E(displayQuestion)}</p></div><footer>${btn('演练任务 <span aria-hidden="true">→</span>', "App.platform.go('exercise','tasks')")}</footer></section>`;
    };
    R.performance = function (title, rows) {
      return `<section class="card or-performance"><header><h2>${title}</h2><span>攻击成功率</span></header><div class="or-performance-rows">${
        rows.length
          ? rows
              .map((row) => {
                const value = row.valid ? (row.breach / row.valid) * 100 : null;
                return `<div class="or-performance-row"><div><strong title="${E(row.label || row.name || row.id)}">${E(row.label || row.name || row.id)}</strong><b>${value === null ? '—' : value.toFixed(1) + '%'}</b></div><div class="or-bar ${value === null ? 'no-result' : ''}"><i style="width:${value || 0}%"></i></div><small>${row.valid ? `${row.breach} 次攻破 / ${row.valid} 次有效判定` : `等待判定 · ${row.total || 0} 个测试单元`}</small></div>`;
              })
              .join('')
          : '<div class="or-chart-empty"><span>等待测试结果</span><i></i><i></i><i></i><small>任务执行后自动汇总，暂无数据不计为 0%。</small></div>'
      }</div></section>`;
    };
    const taskDetail = V.taskDetailHTML;
    V.taskDetailHTML = function (t) {
      if (!t || t.deletedAt || V.type(t) === 'scan') return taskDetail.call(V, t);
      const a = X.taskAnalysis(t),
        j = A.taskReports.judgement(t),
        target = X.targetFor(t),
        methods = a.methods.map((m) => m.label).join('、'),
        original = taskDetail.call(V, t),
        heading = original.slice(0, original.indexOf('<section class="card task-config-detail'));
      const tiles = [
        [
          '靶标模型',
          target?.name || '未记录',
          t.targetMeta?.version || t.targetMeta?.environment || '评测对象',
        ],
        [
          '攻击策略',
          t.runSnapshot?.policy?.name || t.policySnapshot?.name || '自定义配置',
          methods || '未配置方法',
        ],
        [
          '测试范围',
          t.bankSnapshot?.name || '未记录题库',
          `${t.bankSnapshot?.items?.length || 0} 道题目 · ${a.total} 个测试单元`,
        ],
        [
          '防护方案',
          X.blueLabel(t.defense),
          X.guardFlow(t).input || X.guardFlow(t).output ? '独立安全防护' : '模型原生能力',
        ],
      ];
      return (
        heading +
        `<section class="card or-task-information"><header><h2>任务信息</h2><span>${E(t.created || '创建时间未记录')}</span></header>${t.description ? `<p class="or-task-description">${E(t.description)}</p>` : ''}<div class="or-info-grid">${tiles.map(([label, value, sub], i) => `<div><span class="or-info-icon">${A.icon(['box', 'zap', 'layers', 'shield'][i], 19)}</span><span>${label}</span><strong>${E(value)}</strong><small>${E(sub)}</small></div>`).join('')}</div><div class="or-task-meta"><span>红队 <b>${E(t.engine?.roles?.attacker?.name || t.engine?.attacker || '本地模板')}</b></span><span>裁判 <b>${E(t.engine?.roles?.judge?.name || t.engine?.judge || '未记录')}</b></span><span>并发 <b>${E(t.engine?.concurrency || 1)}</b></span></div><details class="or-config-details"><summary>查看完整配置与判定规则</summary>${A.reportLayout.configHTML(t, a)}<h3>判定规则</h3><p>${E(j.safetyRules || j.rule || t.engine?.judgeRule || '未保存规则正文')}</p></details></section><div class="or-performance-grid">${R.performance('场景表现', a.relatedScenes)}${R.performance('攻击方法表现', a.methods)}</div>`
      );
    };
    // Reference parameters stay visible in the catalogue; actual overrides belong to a policy.
    const PP = A.policies;
    // 依赖模型列：方法所需的辅助模型角色（来自 X.methodDependencies）。
    PP.methodDependencyLabels = (id) => {
      const d = X.methodDependencies?.[id] || {};
      return [
        d.gen ? '攻击生成模型' : '',
        d.process ? '过程裁判' : '',
        id === 'DrAttack' ? '向量模型' : '',
        id === 'NanoGCG' ? '本地可求梯度靶标' : '',
      ].filter(Boolean);
    };
    PP.renderMethods = function () {
      const query = PP.methodQuery.trim().toLowerCase(),
        rows = PP.methods().filter(
          (m) =>
            (PP.methodCategory === 'all' || m.family === PP.methodCategory) &&
            (!PP.methodTurns || m.turns === PP.methodTurns) &&
            [m.name, m.description, m.family].join(' ').toLowerCase().includes(query),
        );
      return `<section class="card or-methods"><div class="toolbar"><input aria-label="搜索攻击方法" placeholder="搜索方法或说明" value="${E(PP.methodQuery)}" onchange="App.policies.searchMethods(this.value)"><select aria-label="技术路线筛选" onchange="App.policies.methodCategory=this.value;App.render()">${opt('all', '全部技术路线', PP.methodCategory)}${PP.methodFamilies.map((f) => opt(f, f, PP.methodCategory)).join('')}</select><select aria-label="交互轮次筛选" onchange="App.policies.methodTurns=this.value;App.render()">${opt('', '全部轮次', PP.methodTurns)}${['单轮', '多轮'].map((f) => opt(f, f, PP.methodTurns)).join('')}</select></div><div class="table-wrap"><table><thead><tr><th>攻击方法 / 说明</th><th>技术路线</th><th>交互轮次</th><th>依赖模型</th></tr></thead><tbody>${
        rows
          .map(
            (m) =>
              `<tr><td>${link(m.name, m.id, 'App.policies.methodDetail')}<p>${E(m.description || m.label || '查看方法定义')}</p></td><td>${E(m.family || m.category)}</td><td>${E(m.turns || '单轮')}</td><td>${E(PP.methodDependencyLabels(m.id).join('、') || '—')}</td></tr>`,
          )
          .join('') || '<tr><td colspan="4" class="empty">暂无匹配方法</td></tr>'
      }</tbody></table></div><p class="or-table-note">表中展示方法参考值；任务实际参数以攻击策略中保存的配置为准。</p></section>`;
    };
    const B = A.banks,
      bankRender = B.render;
    R.bankTags = function (b) {
      const tags = new Map();
      for (const q of arr(b.items))
        for (const id of A.sceneTags.resolve(q)) tags.set(id, A.sceneTags.label(id, q));
      return [...tags.values()];
    };
    // 内置题库的统一简介，按题库名称匹配。
    const bankIntro = {
      advbench: '覆盖违法、有害行为等典型风险请求，用于测试模型能否拒绝危险指令。',
      salad: '覆盖多层安全风险分类及多语言样本，用于评估模型的综合安全边界。',
      harmbench: '包含多类有害行为测试目标，用于比较不同攻击方法下的模型稳健性。',
      jailbreak: '收集越狱与对抗提示词，用于检验指令绕过及拒答稳定性。',
      strongreject: '以有害请求测试拒答质量，用于检查模型是否真正阻止危险信息交付。',
      'safety-prompts':
        '覆盖多类典型安全场景的中文问题，用于测试日常对话中的风险识别与安全回答能力。',
    };
    B.introFor = (b) => {
      const name = String(b.name || '').toLowerCase(),
        key = Object.keys(bankIntro).find((k) => name.includes(k));
      return key ? bankIntro[key] : b.description || b.sourceName || '';
    };
    // 场景标签：显示前 3 个，其余收进「…」悬浮提示。
    const tagCell = (tags) => {
      const all = E(tags.join('、'));
      return `<td class="or-bank-tags"><div>${tags
        .slice(0, 3)
        .map((s) => `<span>${E(s)}</span>`)
        .join(
          '',
        )}</div><span class="r24-tag-more" tabindex="0" title="${all}" aria-label="全部场景标签：${all}">…<span class="r24-tag-popup">${all}</span></span></td>`;
    };
    B.catalogTable = function () {
      return (
        B.catalogRows()
          .map(
            (b) =>
              `<tr><td>${link(b.name, b.id, 'App.banks.open')}<small>${E(B.introFor(b))}</small></td><td><span class="bank-source ${b.builtin ? 'builtin' : 'custom'}">${b.builtin ? '系统' : '自建'}</span></td><td>${E(B.industryLabel?.(b.industry) || b.industry || '通用')}</td>${tagCell(R.bankTags(b).length ? R.bankTags(b) : ['未标注场景'])}<td>${b.items.length.toLocaleString()}</td><td>${link('查看题目', b.id, 'App.banks.open')} ${!b.builtin ? link('编辑', b.id, 'App.banks.create') : ''} ${link('导出', b.id, 'App.banks.export')} ${A.entryManagement.button('bank', b.id)}</td></tr>`,
          )
          .join('') || '<tr><td colspan="6" class="empty">暂无题库</td></tr>'
      );
    };
    B.render = function () {
      return bankRender
        .apply(B, arguments)
        .replace(/(<th[^>]*>)(题目数|题目数量|数量)(<\/th>)/, '<th>场景标签</th>$1$2$3');
    };
    const content = PP.renderContent;
    PP.renderContent = function () {
      return content
        .apply(PP, arguments)
        .replace('<th>题目数量</th>', '<th>场景标签</th><th>题目数量</th>');
    };
    H.openReviews = () => P.go('protection', 'review');
    H.openAppReviews = (id) => A.guard.reviewViews.openApp(id);
  })();
};
