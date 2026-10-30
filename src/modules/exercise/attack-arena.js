/* exercise/attack-arena。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/attack-arena'] = function () {
  /* Event-driven exercise UI. All execution in this standalone demo is simulated. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      C = A.connections,
      B = A.banks,
      E = A.escape,
      I = A.icon,
      M = X.methodDependencies;
    const phaseNames = ['红队生成攻击', '蓝队响应', '裁判模型判定'];
    const copy = (v) => JSON.parse(JSON.stringify(v));
    const defense = (t) => t.defense || { mode: 'existing', prompt: '' };
    const resultName = (u) =>
      ({ breach: '已攻破', defended: '已守住', error: '执行异常', pending: '进行中' })[u?.result] ||
      '等待开始';
    const safeId = () => Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    X.tab = 'arena';
    X.arena = { taskId: null, unitId: null, replay: null };
    X.canPrompt = (m) =>
      m.accessType !== 'weights' && m.kind !== 'agent' && m.protocol === 'openai';
    X.methodFit = (m, w) =>
      !!m?.id &&
      m.accessType !== 'weights' &&
      w.methods.every((n) => X.scenarios.some((s) => s.methods.includes(n)));
    X.eligibleTargets = (w) => C.eligible('target').filter((m) => X.methodFit(m, w));
    X.unitContent = function (t, u) {
      const q = t.bankSnapshot?.items.find((q) => q.id === u.questionId);
      const fallback = X.sampleContent(u, t);
      return {
        prompt: u.attackPrompt || q?.prompt || fallback.prompt,
        response: u.response || fallback.response,
        verdict: u.verdict || fallback.verdict,
      };
    };
    X.chooseArenaUnit = function (id) {
      X.arena.unitId = id || null;
      X.arena.replay = null;
      A.render();
    };
    X.replay = function (action) {
      const t = X.exerciseTask();
      if (!t) return;
      const u =
        t.units.find((u) => u.id === X.arena.unitId) ||
        [...t.units].reverse().find((u) => u.events?.length);
      if (!u?.events?.length) {
        A.toast('此历史记录没有保存过程事件');
        return;
      }
      X.arena.unitId = u.id;
      if (action === 'start') X.arena.replay = { index: 0, playing: true };
      else if (action === 'pause' && X.arena.replay)
        X.arena.replay.playing = !X.arena.replay.playing;
      else if (action === 'next') {
        X.arena.replay ||= { index: 0, playing: false };
        X.arena.replay.playing = false;
        X.arena.replay.index = Math.min(u.events.length - 1, X.arena.replay.index + 1);
      } else if (action === 'live') {
        X.arena.unitId = null;
        X.arena.replay = null;
      }
      A.render();
    };

    // Three recorded stages per simulated test unit; completion is committed only at judgment.
    const contentBefore = X.sampleContent;
    X.sampleContent = function (u, t = X.task) {
      const c = contentBefore(u, t);
      return {
        ...c,
        ...(u.attackPrompt ? { prompt: u.attackPrompt } : {}),
        ...(u.result !== 'pending' && u.response ? { response: u.response } : {}),
        ...(u.verdict ? { verdict: u.verdict } : {}),
      };
    };
    setInterval(() => {
      const r = X.arena.replay;
      if (
        !r?.playing ||
        A.page !== 'attack' ||
        X.tab !== 'arena' ||
        document.querySelector('.overlay.open')
      )
        return;
      const t = X.exerciseTask(),
        u = t?.units.find((u) => u.id === X.arena.unitId);
      if (!u?.events?.length) {
        r.playing = false;
        return;
      }
      if (r.index < u.events.length - 1) r.index++;
      else r.playing = false;
      A.render();
    }, 1500);

    X.statusLabel = (t) =>
      ({ running: '进行中', done: '已完成', stopped: '已终止', error: '异常终止' })[t.status];
    X.overview = function () {
      if (X.tab === 'arena') return A.heading('', '模型演练', '') + X.arenaHTML();
      if (X.tab === 'banks') return A.heading('', '题库管理', '') + B.render();
      if (X.tab === 'models')
        return (
          A.heading('', '模型资产', '管理模型与智能体连接，为被测对象和演练角色提供模型资产') +
          X.models()
        );
      return A.heading('', '任务管理', '') + X.historyHTML();
    };
    X.search = (v) => {
      X.query = v;
      document.getElementById('attack-task-rows').innerHTML = X.taskRows(X.filteredTasks());
    };
    X.taskRows = (rows) =>
      rows
        .map(
          (t) =>
            `<tr><td><button class="link-btn" onclick="App.attack.open('${t.id}')"><strong>${E(t.name)}</strong></button><small>${E(t.created)}</small></td><td>${E(X.targetFor(t).name)}</td><td>${X.blueLabel(defense(t))}</td><td>${X.status(t)}<small>${X.metrics(t).done} / ${t.units.length}</small></td><td>${X.metrics(t).valid ? X.metrics(t).asr + '%' : '—'}</td><td><div class="flex"><button class="link-btn" onclick="App.attack.open('${t.id}')">详情</button></div></td></tr>`,
        )
        .join('') || '<tr><td colspan="6" class="empty">暂无匹配任务</td></tr>';

    X.reconcile = function () {
      const w = X.wizard;
      if (w.model && !X.methodFit(X.model(w.model), w)) w.model = '';
      if (w.defenseMode === 'prompt' && (!w.model || !X.canPrompt(X.model(w.model))))
        w.defenseMode = 'existing';
    };
    X.connectionSnapshot = (m) =>
      m
        ? Object.fromEntries(
            [
              'id',
              'name',
              'model',
              'endpoint',
              'protocol',
              'provider',
              'botId',
              'userId',
              'kind',
              'accessType',
              'node',
              'modelPath',
              'tokenizerPath',
              'caps',
            ]
              .filter((k) => m[k] !== undefined)
              .map((k) => [k, copy(m[k])]),
          )
        : null;
    X.changes = function (a, b) {
      const r = [];
      if (
        JSON.stringify(X.targetFor(a)) !== JSON.stringify(X.targetFor(b)) ||
        JSON.stringify(a.targetMeta) !== JSON.stringify(b.targetMeta)
      )
        r.push('调整靶标');
      if (JSON.stringify(defense(a)) !== JSON.stringify(defense(b))) r.push('调整蓝队策略');
      if (
        JSON.stringify(
          (a.engine.methods || [...new Set(a.units.map((u) => u.method))]).slice().sort(),
        ) !== JSON.stringify(b.engine.methods.slice().sort())
      )
        r.push('调整攻击方法');
      if (JSON.stringify(a.bankSnapshot?.items) !== JSON.stringify(b.bankSnapshot?.items))
        r.push('调整题库');
      if (JSON.stringify(a.engine.roles?.judge) !== JSON.stringify(b.engine.roles?.judge))
        r.push('调整裁判模型');
      if (
        a.engine.maxRounds !== b.engine.maxRounds ||
        JSON.stringify(a.engine.whitebox) !== JSON.stringify(b.engine.whitebox) ||
        a.engine.figHelper !== b.engine.figHelper ||
        a.engine.concurrency !== b.engine.concurrency
      )
        r.push('调整执行参数');
      if (JSON.stringify(a.engine.roles?.attacker) !== JSON.stringify(b.engine.roles?.attacker))
        r.push('调整攻击模型');
      return r;
    };
    X.comparable = function (a, b) {
      if (
        !a.bankSnapshot ||
        !b.bankSnapshot ||
        !a.engine.evaluationVersion ||
        !b.engine.evaluationVersion
      )
        return false;
      return (
        JSON.stringify([
          a.bankSnapshot.items,
          (a.engine.methods || []).slice().sort(),
          a.engine.roles?.judge,
          a.engine.evaluationVersion,
          a.engine.maxRounds,
          a.engine.concurrency,
          a.engine.whitebox,
          a.engine.figHelper,
          a.engine.roles?.attacker,
        ]) ===
        JSON.stringify([
          b.bankSnapshot.items,
          (b.engine.methods || []).slice().sort(),
          b.engine.roles?.judge,
          b.engine.evaluationVersion,
          b.engine.maxRounds,
          b.engine.concurrency,
          b.engine.whitebox,
          b.engine.figHelper,
          b.engine.roles?.attacker,
        ])
      );
    };
    const previousConfig = X.config;
    X.config = function (t) {
      return (
        `<section class="card exercise-task-meta"><div class="card-body"><div class="kv"><span>任务描述</span><span>${E(t.description || '—')}</span></div><div class="kv"><span>演练轮次</span><span>第 ${t.iteration || 1} 轮 · ${E(t.changeSummary || '首次演练')}</span></div><div class="kv"><span>蓝队策略</span><span>${X.blueLabel(defense(t))}</span></div>${defense(t).prompt ? `<div class="kv"><span>防御提示词</span><span style="white-space:pre-wrap">${E(defense(t).prompt)}</span></div>` : ''}</div></section>` +
        previousConfig(t)
      );
    };
    const previousDetail = X.detail;
    const beforeReport = X.reportHTML;
  })();
};
