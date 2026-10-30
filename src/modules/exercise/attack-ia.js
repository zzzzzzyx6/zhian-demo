/* exercise/attack-ia。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/attack-ia'] = function () {
  /* Live dashboard on the range; task detail holds board, records and reports. */
  (function () {
    'use strict';
    const A = App,
      X = A.attack,
      E = A.escape,
      I = A.icon;
    const liveArena = X.arenaHTML;
    X.targetFilter = X.targetFilter || 'all';
    X.timeSort = X.timeSort || 'desc';
    X.taskFilterGroup = function (value = X.filter) {
      return (
        { running: 'active', done: 'ended', stopped: 'ended' }[value] ||
        (['all', 'active', 'ended', 'error'].includes(value) ? value : 'all')
      );
    };
    X.liveTasks = () => {
      const order = { running: 0 };
      return X.db.tasks
        .filter((t) => ['running'].includes(t.status))
        .slice()
        .sort(
          (a, b) =>
            order[a.status] - order[b.status] ||
            String(b.created || '').localeCompare(String(a.created || '')),
        );
    };
    X.arenaFilterHTML = function (live, t) {
      return `<div class="live-filter"><span class="live-filter-tag">进行中任务</span><select aria-label="进行中任务" onchange="App.attack.switchLive(this.value)">${live.map((r) => `<option value="${r.id}" ${r.id === t.id ? 'selected' : ''}>${E(r.name)} · ${E(X.targetFor(r).name)} · 进行中</option>`).join('')}</select></div>`;
    };
    X.configPanelHTML = function (t) {
      const target = X.targetFor(t);
      const scenes = t.scenes
        .map((sid) => {
          const methods = X.taskMethods(t, sid)
            .map((n) => X.methodDependencies[n]?.label || n)
            .join('、');
          return `<div class="snapshot-scene-row"><span class="snapshot-scene-name">${E(X.scene(sid)?.name || sid)}</span><span class="snapshot-scene-methods">${E(methods || '—')}</span></div>`;
        })
        .join('');
      const judge = t.engine?.roles?.judge?.name || t.engine?.judge || '未记录';
      const attacker = t.engine?.roles?.attacker?.name || t.engine?.attacker || '规则 / 模板生成';
      return `<section class="card config-detail"><div class="card-head"><h3 class="card-title">攻防配置</h3>${A.badge('创建时锁定', 'gray')}</div><div class="card-body"><div class="kv"><span>靶标</span><strong>${E(target.name)}</strong></div><div class="kv"><span>模型</span><span>${E(target.model || '—')}</span></div><div class="kv"><span>攻击模型</span><span>${E(attacker)}</span></div><div class="kv"><span>裁判模型</span><strong>${E(judge)}</strong></div>${t.bankSnapshot ? `<div class="kv"><span>演练题库</span><span>${E(t.bankSnapshot.name)} · ${t.bankSnapshot.items.length} 题</span></div>` : ''}${t.description ? `<div class="kv"><span>任务描述</span><span>${E(t.description)}</span></div>` : ''}<div class="divider"></div><h3>攻击场景</h3><div class="snapshot-scene-list">${scenes || '<p class="muted">未记录攻击场景</p>'}</div><div class="divider"></div><h3>蓝队</h3>${X.blueEvidenceHTML(t.defense)}</div></section>`;
    };
    X.open = function (id) {
      X.tab = 'tasks';
      X.selected = id;
      X.detailTab = 'board';
      X.pageNum = 1;
      X.sampleFilter = 'all';
      X.rangePreview = false;
      X.arena = { taskId: id, unitId: null, replay: null };
      A.render();
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const samples = X.samples;
    X.targetOptions = () => {
      const seen = new Map();
      for (const t of X.db.tasks) {
        const m = X.targetFor(t);
        const id = m.id || m.name;
        if (id && !seen.has(id)) seen.set(id, m.name || id);
      }
      return [...seen.entries()];
    };
    X.filteredTasks = function () {
      const q = (X.query || '').trim().toLowerCase(),
        statuses = { active: ['running'], ended: ['done', 'stopped'], error: ['error'] }[
          X.taskFilterGroup()
        ];
      const rows = X.db.tasks.filter((t) => {
        if (statuses && !statuses.includes(t.status)) return false;
        if (
          q &&
          !String(t.name || '')
            .toLowerCase()
            .includes(q)
        )
          return false;
        return true;
      });
      const dir = X.timeSort === 'asc' ? 1 : -1;
      return rows
        .slice()
        .sort((a, b) => String(a.created || '').localeCompare(String(b.created || '')) * dir);
    };
    X.planSearch = function (v) {
      X.query = v;
      const body = document.getElementById('attack-task-rows');
      if (body) body.innerHTML = X.taskRowHTML(X.filteredTasks());
      else A.render();
      const el = document.querySelector('[aria-label="搜索任务名称"]');
      el?.focus();
      el?.setSelectionRange?.(v.length, v.length);
    };
    const setTab = X.setTab;
    X.setTab = function (tab) {
      if (tab === 'arena') {
        const live = X.liveTasks();
        if (!live.some((t) => t.id === X.arena.taskId))
          X.arena = { taskId: live[0]?.id || null, unitId: null, replay: null };
      }
      setTab(tab);
    };
    const origTick = X.tick;
    setInterval(() => {
      if (
        A.page !== 'attack' ||
        !X.selected ||
        X.detailTab !== 'board' ||
        document.querySelector('.overlay.open')
      )
        return;
      if (X.rangePreview) {
        if (X.rangePreviewPaused) return;
        X.rangePhase = (X.rangePhase + 1) % 5;
        A.render();
        return;
      }
      const r = X.arena.replay;
      if (!r?.playing) return;
      const t = X.task,
        u = t?.units.find((u) => u.id === X.arena.unitId);
      if (!u?.events?.length) {
        r.playing = false;
        return;
      }
      if (r.index < u.events.length - 1) r.index++;
      else r.playing = false;
      A.render();
    }, 1200);
  })();
};
