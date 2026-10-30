/* 安全态势：dashboard-b。执行顺序由 src/boot.js 维护。 */
window.AppParts = window.AppParts || {};

// ─── dashboard-b ───────────────────────────────────────────────────────────
AppParts['dashboard/dashboard-b'] = function () {
  /* Isolated alternate dashboard. Period figures are explicit design-preview fixtures. */
  (function () {
    'use strict';
    const A = window.App,
      P = A.platform,
      H = A.platformHome,
      E = A.escape;
    const B = (A.dashboardB = {
      periods: { overview: 7, scan: 7, exercise: 7, protection: 7 },
      motion: true,
      protectionRange: { start: '2026-10-21', end: '2026-10-27' },
    });
    const periods = [
      [3, '近三天'],
      [7, '近七天'],
      [30, '近一个月'],
    ];
    const mocks = {
      3: {
        scan: { assets: 7, tasks: 9, findings: 18, levels: [1, 4, 9, 4], coverage: [3, 2, 2] },
        exercise: { tasks: 4, objects: 2, questions: 520, rate: 8.3, scenes: [12, 8, 5] },
        protection: { records: 1680, safe: 1596, controversial: 24, unsafe: 60, error: 2, apps: 3 },
        risk: { urgent: 1, important: 3, normal: 4, review: 2, errors: 1 },
      },
      7: {
        scan: { assets: 9, tasks: 18, findings: 38, levels: [3, 9, 18, 8], coverage: [4, 2, 3] },
        exercise: { tasks: 8, objects: 3, questions: 1820, rate: 12.6, scenes: [21, 14, 8] },
        protection: {
          records: 5640,
          safe: 5358,
          controversial: 76,
          unsafe: 206,
          error: 5,
          apps: 3,
        },
        risk: { urgent: 2, important: 5, normal: 9, review: 4, errors: 2 },
      },
      30: {
        scan: { assets: 16, tasks: 46, findings: 86, levels: [6, 20, 39, 21], coverage: [7, 4, 5] },
        exercise: { tasks: 26, objects: 6, questions: 4860, rate: 10.2, scenes: [18, 12, 7] },
        protection: {
          records: 23180,
          safe: 22137,
          controversial: 302,
          unsafe: 741,
          error: 12,
          apps: 5,
        },
        risk: { urgent: 4, important: 12, normal: 26, review: 8, errors: 3 },
      },
    };
    B.data = (module) => mocks[B.periods[module]][module];
    B.setPeriod = function (module, value) {
      if (!Object.hasOwn(B.periods, module) || ![3, 7, 30].includes(Number(value))) return;
      B.periods[module] = Number(value);
      A.render();
    };
    const picker = (module, label) =>
      `<select class="db-period" aria-label="${label}时间范围" onchange="App.dashboardB.setPeriod('${module}',this.value)">${periods.map(([n, name]) => `<option value="${n}" ${B.periods[module] === n ? 'selected' : ''}>${name}</option>`).join('')}</select>`;
    const number = (n) => Number(n).toLocaleString('zh-CN');
    const footer = (label, action) =>
      `<footer class="db-card-footer"><button class="db-link" onclick="${action}">${label} <span aria-hidden="true">→</span></button></footer>`;
    const metrics = (rows) =>
      `<dl class="db-metrics">${rows.map(([label, n, unit]) => `<div><dt>${label}</dt><dd>${number(n)}<small>${unit || ''}</small></dd></div>`).join('')}</dl>`;
    const headIcons = { scan: 'search', exercise: 'zap', protection: 'shield' };
    const heading = (kind, title, sub, hasPeriod = false) =>
      `<header class="db-card-head"><div><h2><span class="db-head-icon">${A.icon(headIcons[kind] || 'grid', 18)}</span>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${hasPeriod ? picker(kind, title) : ''}</header>`;
    // Five dashboard stages map the task workflow into an overview; the executor stays unchanged.
    B.flowTick = 0;
    B.inspectedStage = null;
    B.flowStages = [
      {
        title: '画像与情报',
        hint: '识别技术栈与风险关注面',
        agents: ['目标画像 Agent', '版本与依赖 Agent', '情报检索 Agent'],
        output: '目标画像与情报已就绪',
      },
      {
        title: '环境准备',
        hint: '建立可验证的执行环境',
        agents: ['环境探针 Agent', '构建与隔离 Agent', '运行条件 Agent'],
        output: '验证环境已准备',
      },
      {
        title: '候选发现',
        hint: '规划发现任务 · 多专长协作',
        agents: ['发现规划 Agent', '代码分析 Agent', '专长发现 Agent'],
        output: '候选风险已汇集',
      },
      {
        title: '排序与验证',
        hint: '去重排序 · 证据验证 · 裁决',
        agents: ['合并排序 Agent', '证据验证 Agent', '风险裁决 Agent'],
        output: '有效风险与证据已确认',
      },
      {
        title: '结果生成',
        hint: '汇总确认结果与修复方案',
        agents: ['修复建议 Agent', '结果汇总 Agent', '报告生成 Agent'],
        output: '扫描报告与修复建议已生成',
      },
    ];
    B.flowFrame = function (tick = B.flowTick) {
      const t = ((tick % 60) + 60) % 60;
      return {
        stage: Math.floor(t / 12),
        agent: Math.min(2, Math.floor((t % 12) / 3)),
        closing: t % 12 === 11,
        progress: Math.min(100, Math.round(((t % 12) / 11) * 100)),
      };
    };
    B.scanScene = (task, d) => {
      const f = B.flowFrame(),
        active = B.flowStages[f.stage],
        taskName = String(task?.name || 'OpenRT 代码安全扫描')
          .split('·')[0]
          .trim();
      return `<div class="db-live-stage db-unified-canvas" role="img" aria-label="安全扫描五阶段多智能体流程正在协同运行"><div class="db-scan-canvas"><div class="db-orchestrator"><i></i>当前步骤 · ${E(active.title)}</div><div id="db-pipeline-window" class="db-pipeline-window"><div class="db-pipeline-track"><div class="db-pipeline-rail"></div><div class="db-pipeline-nodes">${B.flowStages.map((r, i) => `<div class="db-pipeline-node ${i === f.stage ? 'active' : ''} ${i < f.stage ? 'done' : ''}"><i>${i < f.stage ? '✓' : '·'}</i><span>${E(r.title)}</span></div>`).join('')}</div></div></div><input class="db-pipeline-scroll" type="range" min="0" max="100" value="0" aria-label="拖动查看完整扫描流程" oninput="App.dashboardB.scrollPipeline(this.value)"><div class="db-canvas-log"><span>${E(active.hint)} → ${E(active.agents[f.agent])} 正在工作 → ${E(active.output)}</span></div></div><aside class="db-live-summary db-canvas-stats"><h3>${E(taskName)}</h3><div class="db-live-result"><span>候选</span><b>${d.findings + 7}</b></div><div class="db-live-result danger"><span>确认漏洞</span><b>${Math.max(3, d.levels[0] + d.levels[1])}</b></div><div class="db-live-result"><span>已排除</span><b>4</b></div></aside></div>`;
    };
    B.inspectStage = function (i) {
      B.inspectedStage = B.inspectedStage === i ? null : i;
      B.paintFlow();
    };
    B.pipelineManualUntil = 0;
    B.scrollPipeline = function (value) {
      const viewport = document.getElementById('db-pipeline-window');
      if (!viewport) return;
      B.pipelineManualUntil = Date.now() + 8000;
      viewport.scrollTo({
        left: ((viewport.scrollWidth - viewport.clientWidth) * Number(value)) / 100,
        behavior: 'smooth',
      });
    };
    B.paintFlow = function (centerActive = false) {
      const canvas = document.querySelector('.dashboard-b .db-scan-canvas');
      if (!canvas) return;
      const f = B.flowFrame(),
        active = B.flowStages[f.stage],
        nodes = canvas.querySelectorAll('.db-pipeline-node'),
        viewport = canvas.querySelector('.db-pipeline-window'),
        slider = canvas.querySelector('.db-pipeline-scroll');
      nodes.forEach((node, i) => {
        node.classList.toggle('active', i === f.stage);
        node.classList.toggle('done', i < f.stage);
        const mark = node.querySelector('i');
        if (mark) mark.textContent = i < f.stage ? '✓' : '·';
      });
      const title = canvas.querySelector('.db-orchestrator');
      if (title) title.innerHTML = '<i></i>当前步骤 · ' + E(active.title);
      const log = canvas.querySelector('.db-canvas-log span');
      if (log)
        log.textContent =
          active.hint + ' → ' + active.agents[f.agent] + ' 正在工作 → ' + active.output;
      if (slider && viewport) slider.hidden = viewport.scrollWidth <= viewport.clientWidth + 1;
      if (centerActive && Date.now() >= B.pipelineManualUntil) {
        const node = nodes[f.stage];
        if (viewport && node) {
          const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth),
            left = Math.max(
              0,
              Math.min(max, node.offsetLeft - (viewport.clientWidth - node.offsetWidth) / 2),
            );
          viewport.scrollTo({ left, behavior: 'smooth' });
          if (slider) slider.value = max ? String(Math.round((left / max) * 100)) : '0';
        }
      }
    };
    setInterval(function () {
      if (
        P.state.section !== 'workspace' ||
        P.state.item !== 'home' ||
        !B.motion ||
        document.hidden ||
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      )
        return;
      const previous = B.flowFrame().stage;
      B.flowTick = (B.flowTick + 1) % 60;
      const stageChanged = previous !== B.flowFrame().stage;
      if (stageChanged) B.inspectedStage = null;
      B.paintFlow(stageChanged);
    }, 1000);
    B.protectionScene = function () {
      return `<div class="db-scene db-protection-scene" role="img" aria-label="请求流经过安全盾牌，安全请求放行，争议和不安全请求拦截的演示动画"><div class="db-scene-note"><i></i>输入检测 · 输出防护</div><svg viewBox="0 0 340 220" aria-hidden="true"><defs><linearGradient id="db-shield-fill" x2="1" y2="1"><stop stop-color="#effffb"/><stop offset="1" stop-color="#9acdc8"/></linearGradient></defs><ellipse cx="170" cy="181" rx="105" ry="24" fill="#b7d8dc33"/><g fill="none" stroke="#afcfda"><ellipse cx="170" cy="170" rx="118" ry="35"/><ellipse cx="170" cy="170" rx="88" ry="25"/><path d="M12 108h91m134 0h91M199 143l47 41h75" stroke-dasharray="4 5"/></g><circle class="db-shield-orbit" cx="170" cy="108" r="69" fill="none" stroke="#69aeb2" stroke-dasharray="7 12" opacity=".5"/><path d="m170 39 54 20v53c0 35-30 57-54 70-24-13-54-35-54-70V59Z" fill="url(#db-shield-fill)" stroke="#5a9ea9" stroke-width="2"/><path d="m170 53 42 16v43c0 26-21 44-42 57-21-13-42-31-42-57V69Z" fill="#effaf88c" stroke="#91bfca"/><path d="m146 104 17 17 33-36" fill="none" stroke="#438f95" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><g class="db-packet db-packet-in"><rect x="8" y="100" width="14" height="14" rx="4" fill="#74a5d2"/></g><g class="db-packet db-packet-safe"><rect x="237" y="100" width="13" height="13" rx="4" fill="#53a89b"/></g><g class="db-packet db-packet-block"><rect x="230" y="177" width="12" height="12" rx="3" fill="#d6a15e"/></g><path d="M291 172v24" stroke="#c48e56" stroke-width="4" stroke-linecap="round"/><text x="280" y="89" fill="#3a8b81" font-size="11">放行</text><text x="261" y="214" fill="#ad7944" font-size="11">拦截</text><text x="23" y="89" fill="#6586a8" font-size="11">请求流</text></svg></div>`;
    };
    B.setProtectionRange = function (input) {
      const key = input.dataset.rangeKey;
      if (!['start', 'end'].includes(key)) return;
      B.protectionRange[key] = input.value;
      const start = new Date(B.protectionRange.start),
        end = new Date(B.protectionRange.end);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return;
      const days = Math.max(1, Math.round((end - start) / 86400000) + 1),
        count = Math.round((mocks[7].protection.records * days) / 7),
        out = document.getElementById('db-protection-range-count');
      if (out) out.textContent = number(count);
    };
    // 取某指标最高等级的真实风险事件，用于模块卡底部与风险中心联动。
    B.metricRisk = (metrics) => {
      const set = [].concat(metrics);
      const events = (A.platformGovernance?.events?.() || []).filter(
        (e) => set.includes(e.metric) && e.status !== 'closed',
      );
      const order = { R1: 0, R2: 1, R3: 2 };
      return events.sort(
        (a, b) =>
          (order[a.classification?.priority] ?? 3) - (order[b.classification?.priority] ?? 3),
      )[0];
    };
    // 模块卡底部风险条：等级标签 + 名称 + 一行说明，样式与右上角风险事件一致，点击进入风险中心对应事件。
    const cardRisk = (metric, fallback) => {
      const e = B.metricRisk(metric);
      const priority = e?.classification?.priority || fallback.priority;
      const name = E(e?.ruleSnapshot?.name || fallback.name);
      const detail = E(
        e
          ? (e.metricLabel || e.ruleSnapshot?.metricLabel || '风险触发') +
              ' · ' +
              (e.assetName || '') +
              ' · ' +
              e.count +
              ' 条证据'
          : fallback.detail,
      );
      const cls = priority === 'R1' ? 'urgent' : priority === 'R2' ? 'important' : 'general';
      const action = e
        ? `App.platformHome.openHomeTodo('risk','${E(e.id)}')`
        : "App.platform.go('risk','events')";
      return `<div class="db-reminders db-card-risk"><button class="db-risk-alert ${cls}" onclick="${action}">${A.riskClassification.badge({ classification: { priority } })}<span class="db-card-risk-copy"><strong>${name}</strong><small>${detail}</small></span><span aria-hidden="true">→</span></button></div>`;
    };
    B.scan = function () {
      const d = B.data('scan'),
        colors = ['#b42335', '#ed8a24', '#edca51', '#6c9fca'],
        tasks = A.scanProduct.tasks(),
        task = tasks.find((t) => t.status === 'running') || tasks[0];
      return `<section class="db-core-card db-scan">${heading('scan', '安全扫描')}${B.scanScene(task, d)}<div class="db-progress-box db-progress-compact"><div class="db-progress-head"><span>任务进度 · 证据验证阶段</span><b>68%</b></div><div class="db-progress-line"><i style="width:68%"></i></div></div><div class="db-card-data db-product-overview"><div class="db-overview-title"><span>近一周信息总览</span></div>${metrics(
        [
          ['覆盖对象', d.assets, '个'],
          ['扫描任务', d.tasks, '项'],
          ['确认漏洞', d.findings, '个'],
        ],
      )}<div class="db-overview-chart"><div class="db-chart-title">确认漏洞分布情况</div><div class="db-severity-bar" role="img" aria-label="严重、高危、中危、低危漏洞分布">${d.levels.map((n, i) => `<i style="width:${(n / d.findings) * 100}%;background:${colors[i]}"></i>`).join('')}</div><div class="db-legend">${['严重', '高危', '中危', '低危'].map((name, i) => `<span><i style="background:${colors[i]}"></i>${name}<b>${d.levels[i]}</b></span>`).join('')}</div></div>${cardRisk('scan-confirmed-high', { priority: 'R2', name: '扫描确认高危漏洞', detail: '安全扫描确认 · 等待修复' })}</div>${footer('扫描任务', "App.platform.go('scan','tasks')")}</section>`;
    };
    B.exercise = function () {
      const d = B.data('exercise'),
        t = A.octoberRefinement.latestTask(),
        units = t?.units || [],
        count = (result, placeholder) =>
          t ? units.filter((u) => u.result === result).length : placeholder,
        breach = count('breach', 7),
        defended = count('defended', 18),
        errors = count('error', 1),
        done = breach + defended + errors,
        total = Math.max(done, units.length || 40),
        progress = Math.min(100, Math.round((done / total) * 100)),
        current = units.find((u) => !u.result || u.result === 'pending'),
        taskName = E(t?.name || 'Qwen2.5 模型安全演练'),
        sceneColors = ['#b96a77', '#d49a58', '#c9b16d', '#80a5c7'],
        // 场景名对应攻击题库场景分类（BankSceneData），按攻破数量从多到少。
        scenes = [
          ['网络攻击与系统滥用', d.scenes[0]],
          ['隐私、数据与秘密泄露', d.scenes[1]],
          ['欺诈、虚假信息与恶意操纵', d.scenes[2]],
        ].sort((a, b) => b[1] - a[1]),
        sceneTotal = scenes.reduce((n, s) => n + s[1], 0) || 1;
      return `<section class="db-core-card db-exercise">${heading('exercise', '模型演练')}<div class="db-exercise-live db-product-animation db-unified-canvas"><div class="db-exercise-scene">${A.rangeExperience.slot(t)}</div><aside class="db-exercise-stats db-canvas-stats"><h3 title="${taskName}">${taskName}</h3><div class="db-outcome breach"><span>已攻破</span><b>${breach}</b></div><div class="db-outcome defended"><span>已守住</span><b>${defended}</b></div><div class="db-outcome error"><span>执行异常</span><b>${errors}</b></div></aside></div><div class="db-progress-box"><div class="db-progress-head"><span>测试进度 · ${done} / ${total}</span><b>${progress}%</b></div><div class="db-progress-line"><i style="width:${progress}%"></i></div><p class="db-current-item">当前攻击题目：${E(current?.question || current?.prompt || current?.text || '通过多轮上下文诱导模型泄露受保护信息')}</p></div><div class="db-card-data db-product-overview"><div class="db-overview-title"><span>近一周信息总览</span></div>${metrics(
        [
          ['覆盖靶标', d.objects, '个'],
          ['演练任务', d.tasks, '项'],
          ['覆盖题目', d.questions, '道'],
        ],
      )}<div class="db-overview-chart"><div class="db-chart-title">高频攻破场景</div><div class="db-severity-bar" role="img" aria-label="高频攻破场景分布">${scenes.map(([name, value], i) => `<i style="width:${(value / sceneTotal) * 100}%;background:${sceneColors[i]}" title="${name}"></i>`).join('')}</div><div class="db-legend">${scenes.map(([name, value], i) => `<span><i style="background:${sceneColors[i]}"></i>${name}<b>${value}</b></span>`).join('')}</div></div>${cardRisk('attack-asr', { priority: 'R1', name: '模型演练 ASR 超阈值', detail: '模型演练触发 · 等待处置' })}</div>${footer('演练任务', "App.platform.go('exercise','tasks')")}</section>`;
    };
    B.protection = function () {
      const d = B.data('protection'),
        blocked = d.controversial + d.unsafe;
      return `<section class="db-core-card db-protection">${heading('protection', '安全防护')}<div class="db-protection-live db-product-animation db-unified-canvas">${B.protectionScene()}<aside class="db-protection-live-stats db-canvas-stats"><h3>企业智能客服</h3><div><span>本次检测</span><b>1,286</b></div><div><span>已拦截</span><b>${Math.min(blocked, 86)}</b></div><div><span>待人工复核</span><b>${Math.min(d.controversial, 24)}</b></div><button class="db-review-cta" onclick="App.platform.go('protection','review')">去复核 <span aria-hidden="true">→</span></button></aside></div><div class="db-progress-box db-time-range"><div class="db-time-fields"><label>开始<input type="date" data-range-key="start" value="${B.protectionRange.start}" max="${B.protectionRange.end}" onchange="App.dashboardB.setProtectionRange(this)"></label><span>—</span><label>结束<input type="date" data-range-key="end" value="${B.protectionRange.end}" min="${B.protectionRange.start}" max="2026-10-27" onchange="App.dashboardB.setProtectionRange(this)"></label></div><div><span>检测记录</span><b id="db-protection-range-count">${number(d.records)}</b></div></div><div class="db-card-data db-product-overview"><div class="db-overview-title"><span>近一周信息总览</span></div>${metrics(
        [
          ['有效检测', d.records, '条'],
          ['防护应用', d.apps, '个'],
          ['已拦截', blocked, '条'],
        ],
      )}<div class="db-overview-chart"><div class="db-chart-title db-chart-title-inline">安全放行率 <b>${((d.safe / d.records) * 100).toFixed(1)}%</b><span>异常 ${d.error} 条另计</span></div><div class="db-protection-strip"><i style="width:${(d.safe / d.records) * 100}%"></i></div></div>${cardRisk('runtime-unsafe-input', { priority: 'R1', name: 'Unsafe 输入请求数超阈值', detail: '高风险输入持续触发防护策略' })}</div>${footer('防护总览', "App.platform.go('protection','overview')")}</section>`;
    };
    B.risk = function () {
      const s = H.snapshot(),
        todos = H.homeTodos(s),
        risks = todos.filter((r) => r.kind === 'risk'),
        fallback = [
          {
            id: '',
            name: '核心业务模型越权指令风险',
            detail: '模型演练触发 · 等待处置',
            tone: 'rc-r1',
          },
          {
            id: '',
            name: 'OpenRT 代码仓高危依赖风险',
            detail: '安全扫描确认 · 等待修复',
            tone: 'rc-r2',
          },
          {
            id: '',
            name: 'Unsafe 输入请求数超阈值',
            detail: '运行防护拦截 · 持续观察',
            tone: 'rc-r3',
          },
        ],
        shown = [risks[0] || fallback[0], risks[1] || fallback[1], risks[2] || fallback[2]];
      // 最新通知：取消息中心最新三条非风险消息（风险已在左侧展示，避免重复）。
      const notices = (A.platformNotifications?.rows?.() || [])
        .filter((m) => m.kind !== 'risk')
        .slice(0, 3);
      const noticeIcon = { started: 'play', done: 'check', error: 'alert', stopped: 'clock' };
      const noticeHTML = notices.length
        ? notices
            .map(
              (m) =>
                `<button class="db-notice-item" onclick="App.platformNotifications.open()"><span class="db-notice-icon ${E(m.state || '')}">${A.icon(noticeIcon[m.state] || 'bell', 15)}</span><span class="db-notice-copy"><strong>${E(m.title)}</strong><small>${E(m.name)}</small></span><span class="db-notice-type">${E(m.taskType || '')}</span></button>`,
            )
            .join('')
        : '<div class="db-notice-empty">暂无最新通知</div>';
      return `<section class="db-risk-section"><div class="db-risk-compact"><section class="db-risk-alerts"><header><h3><span class="db-head-icon">${A.icon('alert', 18)}</span>风险事件</h3><button class="db-link" onclick="App.platformHome.openPendingRisk()">全部风险 →</button></header><div class="db-risk-list">${shown
        .map((r) => {
          const priority = String(r.tone || '').includes('r1')
            ? 'R1'
            : String(r.tone || '').includes('r2')
              ? 'R2'
              : 'R3';
          const alertCls =
            priority === 'R1' ? 'urgent' : priority === 'R2' ? 'important' : 'normal';
          return `<button class="db-risk-alert ${alertCls}" data-id="${E(r.id || '')}" onclick="${r.id ? "App.platformHome.openHomeTodo('risk',this.dataset.id)" : 'App.platformHome.openPendingRisk()'}">${A.riskClassification.badge({ classification: { priority } })}<span><strong>${E(r.name)}</strong></span><span>→</span></button>`;
        })
        .join(
          '',
        )}</div></section><section class="db-notice-roll"><header><h3><span class="db-head-icon">${A.icon('bell', 18)}</span>最新通知</h3><button class="db-link" onclick="App.platformNotifications.open()">查看全部通知 →</button></header><div class="db-notice-list">${noticeHTML}</div></section></div></section>`;
    };
    B.overview = function () {
      const n = B.periods.overview,
        s = mocks[n],
        blocked = s.protection.controversial + s.protection.unsafe,
        strategies = (H.strategies()?.attack?.length || 0) + A.guard.policies.all().length;
      const primary = {
        icon: 'box',
        label: '受保护资产',
        value: s.scan.assets + s.exercise.objects + s.protection.apps,
        unit: '项',
        hint: '覆盖应用、模型与代码资产',
      };
      const rest = [
        ['activity', '安全任务', s.scan.tasks + s.exercise.tasks, '项'],
        ['alert', '发现风险', s.scan.findings + blocked, '个'],
        ['file', '防护记录', s.protection.records, '条'],
        ['shield', '安全策略', strategies, '项'],
      ];
      return `<section class="db-platform-overview"><header><div><span class="db-head-icon">${A.icon('grid', 18)}</span><span>数据总览</span></div>${picker('overview', '平台总览')}</header><div class="db-overview-body"><div class="db-overview-primary"><span class="db-overview-primary-icon">${A.icon(primary.icon, 22)}</span><div class="db-overview-primary-main"><dt>${primary.label}</dt><dd>${number(primary.value)}<small>${primary.unit}</small></dd><p>${primary.hint}</p></div></div><dl class="db-overview-grid">${rest
        .map(
          ([icon, label, value, unit]) =>
            `<div><span class="db-overview-metric-icon">${A.icon(icon, 16)}</span><div><dt>${label}</dt><dd>${number(value)}<small>${unit}</small></dd></div></div>`,
        )
        .join('')}</dl></div></section>`;
    };
    B.render = function () {
      return `<div class="platform-dashboard ph-workbench dashboard-b ${B.motion ? '' : 'db-motion-paused'}"><div class="db-top-grid">${B.overview()}${B.risk()}</div><div class="db-core-grid">${B.scan()}${B.exercise()}${B.protection()}</div></div>`;
    };
    const home = H.render;
    H.render = function () {
      return P.state.section === 'workspace' && P.state.item === 'home'
        ? B.render()
        : home.apply(H, arguments);
    };
    const sceneData = A.rangeExperience.sceneData;
    A.rangeExperience.sceneData = function (t) {
      const data = sceneData(t);
      return P.state.section === 'workspace' && P.state.item === 'home' && !B.motion
        ? { ...data, paused: true }
        : data;
    };
  })();
};
