/* exercise/experience-refinement。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/experience-refinement'] = function () {
  /* Final product pass: live range, compact task detail, report, and model-series analysis. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      E = A.escape,
      I = A.icon;
    const roleLabels = {
      red: '红队编排',
      method: '攻击方法',
      target: '靶标',
      blue: '蓝队防守',
      judge: '裁判模型',
      result: '判定结果',
    };
    X.focusNode = X.focusNode || 'target';
    X.seriesId = X.seriesId || 'qwen25';

    const defense = (t) => t.defense || { mode: 'existing', parts: [], prompt: '' };
    const defenseName = (t) =>
      X.blueLabel
        ? X.blueLabel(defense(t))
        : defense(t).mode === 'prompt'
          ? '防御提示词'
          : '基准策略';
    const statusText = (t) =>
      ({ running: '进行中', done: '已完成', stopped: '已终止', error: '异常终止' })[t?.status] ||
      '等待中';
    const resultText = (u) =>
      ({ breach: '已攻破', defended: '已守住', error: '执行异常', pending: '执行中' })[u?.result] ||
      '等待中';
    const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

    X.status = function (t) {
      return A.badge(
        statusText(t),
        { running: 'blue', done: 'green', stopped: 'gray', error: 'red' }[t.status] || 'gray',
      );
    };
    X.statusLabel = statusText;
    X.closeArenaNode = function () {
      X.focusNode = null;
      A.render();
    };

    function boardState(t) {
      const m = X.metrics(t),
        rows = t.units.filter((u) => u.result !== 'pending' || u.events?.length);
      const u =
        rows.find((u) => u.id === X.arena.unitId) ||
        rows.find((u) => u.result === 'pending') ||
        rows.at(-1) ||
        t.units[0];
      const events = u?.events || [],
        replay = X.arena.replay;
      const raw = events.length
        ? replay
          ? events[Math.min(replay.index, events.length - 1)]?.phase
          : events.at(-1).phase
        : -1;
      const phase =
        u?.eventSchema === 5
          ? raw
          : raw === 0
            ? 1
            : raw === 1
              ? 2
              : raw === 2
                ? 4
                : u?.result !== 'pending'
                  ? 4
                  : -1;
      const moving = t.status === 'running' && !replay && u?.result === 'pending';
      return { m, rows, u, events, replay, phase, moving, content: u ? X.unitContent(t, u) : null };
    }

    function nodeDetail(id, t, s) {
      const u = s.u,
        target = X.targetFor(t),
        method = u ? X.methodDependencies[u.method]?.label || u.method : '等待攻击输入';
      const data = {
        red: [
          '攻击执行角色',
          t.engine?.roles?.attacker?.name || t.engine?.attacker || '规则 / 模板生成',
          '负责编排攻击策略、生成与迭代攻击输入',
        ],
        method: [
          '当前攻击方法',
          method,
          u
            ? `${X.scene(u.scene)?.name || u.scene} · 最大 ${u.rounds || t.engine?.maxRounds || 1} 轮`
            : '按任务配置调度攻击方法',
        ],
        target: ['独立被测资产', target.name, target.model || '模型服务'],
        blue: ['防守策略', defenseName(t), defense(t).prompt || '在靶标输入与输出侧执行安全策略'],
        judge: [
          '独立裁判',
          t.engine?.roles?.judge?.name || t.engine?.judge || '未记录',
          '基于完整攻击证据进行统一判定',
        ],
        result: ['当前判定', u ? resultText(u) : '等待中', u?.verdict || '等待裁判完成判定'],
      }[id];
      return `<div class="node-popover" role="status"><button class="node-popover-close" onclick="event.stopPropagation();App.attack.closeArenaNode()" aria-label="关闭角色看板">${I('close', 13)}</button><span>${E(data[0])}</span><strong>${E(data[1])}</strong><p>${E(data[2])}</p></div>`;
    }

    function battleNode(id, x, y, icon, title, sub, active, t, s) {
      return `<div class="battle-node-wrap node-${id} ${active ? 'active' : ''}" style="left:${x}%;top:${y}%"><button class="battle-node" onclick="App.attack.inspectArenaNode('${id}')" aria-label="查看${title}"><span class="battle-node-icon">${I(icon, 23)}</span><span class="battle-node-copy"><strong>${title}</strong><small>${E(sub)}</small></span><i></i></button>${X.focusNode === id ? nodeDetail(id, t, s) : ''}</div>`;
    }

    function eventList(t, s) {
      const completed = t.units
        .filter((u) => u.result !== 'pending')
        .slice(-3)
        .reverse();
      const current =
        s.u?.result === 'pending' ? `正在执行 ${s.u.id}` : `最近完成 ${s.u?.id || '--'}`;
      return `<div class="telemetry-feed"><div><i class="${s.moving ? 'live' : ''}"></i><span>${E(current)}</span><time>实时</time></div>${completed.map((u) => `<div><i class="${u.result}"></i><span>${E(X.methodDependencies[u.method]?.label || u.method)}</span><time>${resultText(u)}</time></div>`).join('')}</div>`;
    }

    X.arenaControl = function (action) {
      const t = X.exerciseTask();
      if (!t) return;
      if (action === 'toggle') return false;
      if (action === 'stop')
        A.modal(
          '终止本次演练',
          `<p>终止后保留已完成的攻防记录和裁判结果。</p><p class="hint">尚未执行的测试单元不会计入结果。</p>`,
          `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" onclick="App.attack.arenaStop('${E(t.id)}')">确认终止</button>`,
        );
    };
    X.arenaStop = function (id) {
      const t = X.db.tasks.find((x) => x.id === id);
      if (t && ['running'].includes(t.status)) t.status = 'stopped';
      A.save();
      A.closeModal();
      A.render();
      A.toast('演练已结束');
    };
    X.stopConfirm = function () {
      X.arenaControl('stop');
    };
    X.taskAction = function (id, action) {
      const t = X.db.tasks.find((x) => x.id === id);
      if (!t) return;
      X.arena.taskId = id;
      if (action === 'stop') return X.arenaControl('stop');
      if (action === 'toggle') return false;
    };

    function exportMenu(compact = false) {
      return `<details class="report-export ${compact ? 'compact' : ''}"><summary>${I('download', 14)}报告导出${I('chevron', 12)}</summary><div><button onclick="App.attack.exportReport()">HTML 报告</button><button onclick="App.attack.printReport()">PDF / 打印</button><button onclick="App.attack.exportWord()">Word 兼容</button></div></details>`;
    }
    function miniTrend(values) {
      const max = Math.max(1, ...values),
        min = Math.min(...values),
        range = Math.max(1, max - min),
        points = values
          .map(
            (v, i) =>
              `${i * (210 / (values.length - 1 || 1)) + 5},${65 - ((v - min) / range) * 48}`,
          )
          .join(' ');
      return `<svg viewBox="0 0 220 76" aria-label="风险趋势"><line x1="5" y1="65" x2="215" y2="65"/><polyline points="${points}"/><circle cx="215" cy="${points.split(' ').at(-1).split(',')[1]}" r="4"/></svg>`;
    }
    X.compactConfigHTML = function (t) {
      const target = X.targetFor(t),
        methods = [
          ...new Set(t.units.map((u) => X.methodDependencies[u.method]?.label || u.method)),
        ];
      return `<section class="task-config-strip"><div><span>靶标</span><strong>${E(target.name)}</strong><small>${E(target.model || '--')}</small></div><div><span>红队</span><strong>${E(t.engine?.roles?.attacker?.name || t.engine?.attacker || '规则 / 模板')}</strong><small>${methods.slice(0, 2).map(E).join('、')}${methods.length > 2 ? ` 等 ${methods.length} 种` : ''}</small></div><div><span>蓝队</span><strong>${E(defenseName(t))}</strong><small>${E(t.scenes.map((id) => X.scene(id)?.name || id).join('、'))}</small></div><div><span>裁判</span><strong>${E(t.engine?.roles?.judge?.name || t.engine?.judge || '--')}</strong></div></section>`;
    };
    X.detail = function () {
      const t = X.task;
      if (!t) {
        X.selected = null;
        return X.overview();
      }
      const m = X.metrics(t),
        tab = ['samples', 'report'].includes(X.detailTab) ? X.detailTab : 'board';
      X.detailTab = tab;
      return `<div class="page-heading">${A.backButton('exercise/tasks')}<div class="task-detail-heading"><div class="task-title-line"><h1>${E(t.name)}</h1>${X.status(t)}</div><p class="page-desc">任务创建时间：${E(t.created || '未记录')}</p></div><div class="page-actions">${['running'].includes(t.status) ? `<button class="btn danger-soft" onclick="App.attack.stopConfirm()">${I('close', 13)}终止</button>` : ''}</div></div>${tab === 'report' ? X.compactConfigHTML(t) : `<section class="task-summary-card">${X.compactConfigHTML(t)}${X.detailHeroHTML(t, m)}</section>`}<div class="tabs detail-tabs">${[
        ['board', '演练视图'],
        ['samples', '攻防记录'],
        ['report', '演练报告'],
      ]
        .map(
          ([v, l]) =>
            `<button class="tab ${tab === v ? 'active' : ''}" onclick="App.attack.detailTab='${v}';App.render()">${l}${v === 'samples' ? ` <span class="muted small-text">${m.done}</span>` : ''}</button>`,
        )
        .join(
          '',
        )}</div>${tab === 'board' ? X.taskBoardHTML(t) : tab === 'samples' ? X.samples(t) : X.report(t, m)}`;
    };

    X.taskRowHTML = function (rows) {
      return (
        rows
          .map((t) => {
            const m = X.metrics(t),
              live = ['running'].includes(t.status);
            return `<tr><td><button class="link-btn" onclick="App.attack.open('${E(t.id)}')">${E(t.name)}</button></td><td>${E(X.targetFor(t).name)}</td><td>${X.status(t)}</td><td>${E(t.created)}</td><td><div class="task-quick-actions">${live ? `<button class="btn small danger-soft" title="终止" aria-label="终止" onclick="App.attack.taskAction('${E(t.id)}','stop')">终止</button>` : '<span class="task-action-placeholder"></span><span class="task-action-placeholder"></span>'}</div></td></tr>`;
          })
          .join('') || '<tr><td colspan="5" class="empty">暂无匹配任务</td></tr>'
      );
    };
    X.toggleTimeSort = function () {
      X.timeSort = X.timeSort === 'asc' ? 'desc' : 'asc';
      A.render();
      document.getElementById('task-created-sort')?.focus({ preventScroll: true });
    };
    X.historyHTML = function () {
      const group = X.taskFilterGroup(),
        ascending = X.timeSort === 'asc',
        sortHint = `任务创建时间：当前${ascending ? '正序（最早优先）' : '倒序（最新优先）'}，点击切换${ascending ? '倒序' : '正序'}`;
      return `<section class="card task-list"><div class="toolbar task-toolbar"><input class="input" aria-label="搜索任务名称" placeholder="搜索任务名称" value="${E(X.query)}" oninput="App.attack.planSearch(this.value)"><select aria-label="任务状态筛选" title="未结束：进行中；已结束：已完成、已终止；异常：任务异常" onchange="App.attack.filter=this.value;App.render()">${[
        ['all', '全部状态'],
        ['active', '未结束'],
        ['ended', '已结束'],
        ['error', '异常'],
      ]
        .map(([v, l]) => `<option value="${v}" ${group === v ? 'selected' : ''}>${l}</option>`)
        .join(
          '',
        )}</select><button class="btn primary" onclick="App.attack.newTask()">${I('plus', 14)}新建模型演练任务</button></div><div class="table-wrap"><table><thead><tr><th>任务名称</th><th>靶标</th><th>任务状态</th><th aria-sort="${ascending ? 'ascending' : 'descending'}"><button id="task-created-sort" class="table-sort" title="${sortHint}" aria-label="${sortHint}" onclick="App.attack.toggleTimeSort()"><span>任务创建时间</span><svg class="time-sort-icon" viewBox="0 0 12 18" aria-hidden="true"><path class="${ascending ? 'active' : ''}" d="M6 2 11 7H1Z"/><path class="${ascending ? '' : 'active'}" d="m6 16 5-5H1Z"/></svg></button></th><th>快捷操作</th></tr></thead><tbody id="attack-task-rows">${X.taskRowHTML(X.filteredTasks())}</tbody></table></div></section>`;
    };

    // Keep the live dashboard visibly dynamic while retaining the original execution engine.
    const init = A.modules.attack.init;
    A.modules.attack.init = function () {
      init();
      for (const t of X.db.tasks) if (t.status === 'running' && t.demoHold) t.demoHold = false;
    };
  })();
};
