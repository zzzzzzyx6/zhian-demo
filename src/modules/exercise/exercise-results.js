/* exercise/exercise-results。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/exercise-results'] = function () {
  /* Exercise results: tasks ordered by target, risk tag per ASR rule, comparison inside one modal. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      V = A.evaluation,
      P = A.platform,
      E = A.escape;
    const C = (A.exerciseResults = {
      filters: { query: '', target: '', policy: '', defense: '' },
      riskSort: '', // '' 按靶标顺序；desc 风险由高到低；asc 由低到高
    });
    const pct = (n, d) => (d ? ((100 * n) / d).toFixed(1) + '%' : '—');
    // 与策略、攻击方法列表一致，显示方法英文标识名。
    const methodLabel = (id) => A.policies.method(id)?.name || id;

    // Every comparable variable is read from the task snapshot taken at launch.
    C.facts = function (t) {
      const s = t.policySnapshot || {},
        roles = s.executionRoles || {},
        engine = t.engine?.roles || {},
        a = X.taskAnalysis(t),
        judge = A.taskReports.judgement(t).model || engine.judge;
      return {
        target: t.targetName || t.targetSnapshot?.name || X.targetFor(t)?.name || '未记录靶标',
        targetKey: t.model || t.targetSnapshot?.id || '',
        policy: s.name || '未记录策略',
        policyKey: s.policyId || s.name || '',
        bank: s.bankSnapshot
          ? s.bankSnapshot.name.includes(' 题')
            ? s.bankSnapshot.name
            : s.bankSnapshot.name + ' · ' + (s.bankSnapshot.items?.length || 0) + ' 题'
          : '未记录',
        methods: (s.methods || []).map((m) => methodLabel(m.id)).join('、') || '未记录',
        attacker: (roles.attacker || engine.attacker)?.name || '不需要（模板方法）',
        process: (roles.process || engine.process)?.name || '不需要',
        defense: X.blueText(t.runSnapshot?.defense || t.defense || {}),
        judge: judge?.name || judge?.model || '未记录',
        created: t.created || '—',
        finished: t.finishedAt || t.finished || t.completedAt || '',
        status: t.status,
        a,
        asr: a.valid ? a.breach / a.valid : null,
      };
    };
    C.tasks = () => X.db.tasks.filter((t) => !t.deletedAt && V.type(t) === 'attack');
    C.comparable = (t) => t.status === 'done' && X.taskAnalysis(t).valid > 0;
    C.setFilter = function (key, value) {
      if (!Object.hasOwn(C.filters, key)) return;
      C.filters[key] = value;
      A.render();
    };
    C.toggleRiskSort = function () {
      C.riskSort = C.riskSort === 'desc' ? 'asc' : 'desc';
      A.render();
    };

    function filtered() {
      const f = C.filters;
      return C.tasks()
        .map((t) => ({ t, f: C.facts(t) }))
        .filter(
          ({ f: v }) =>
            (!f.query || v.target.toLowerCase().includes(f.query.trim().toLowerCase())) &&
            (!f.target || v.targetKey === f.target) &&
            (!f.policy || v.policyKey === f.policy) &&
            (!f.defense || v.defense === f.defense),
        );
    }
    function select(key, label, pairs) {
      return `<label class="lt-field">${label}<select aria-label="按${label}筛选" onchange="App.exerciseResults.setFilter('${key}',this.value)"><option value="">全部</option>${pairs.map(([v, n]) => `<option value="${E(v)}" ${C.filters[key] === v ? 'selected' : ''}>${E(n)}</option>`).join('')}</select></label>`;
    }
    function uniq(rows, key, name = key) {
      const map = new Map();
      for (const r of rows) if (!map.has(r[key])) map.set(r[key], r[name]);
      return [...map].sort((a, b) => String(a[1]).localeCompare(String(b[1]), 'zh-CN'));
    }

    // 风险等级：按风险分级标准中 ASR 指标的阈值判定紧急 / 重要 / 一般。
    function riskTag(v) {
      if (v.asr == null) return '<span class="xr-risk xr-risk-na">—</span>';
      const N = A.riskClassification,
        G = A.platformGovernance;
      G?.init?.();
      const th = N?.standard?.()?.metrics?.['attack-asr'];
      if (!N || !th) return '<span class="xr-risk xr-risk-na">未配置分级标准</span>';
      return N.badge({ classification: { priority: N.pick(v.asr * 100, th) } });
    }

    function listHTML() {
      const all = C.tasks().map(C.facts),
        rows = filtered();
      // 默认按靶标顺序（同靶标内新任务在前）；选择风险排序后按 ASR 排列，未判定排最后。
      const byTarget = (a, b) =>
        a.f.target.localeCompare(b.f.target, 'zh-CN') ||
        String(b.f.created).localeCompare(String(a.f.created));
      const dir = C.riskSort === 'asc' ? 1 : -1;
      rows.sort((a, b) =>
        C.riskSort && a.f.asr !== b.f.asr
          ? a.f.asr == null
            ? 1
            : b.f.asr == null
              ? -1
              : dir * (a.f.asr - b.f.asr)
          : byTarget(a, b),
      );
      const sortLabel =
        C.riskSort === 'asc' ? '由低到高 ↑' : C.riskSort === 'desc' ? '由高到低 ↓' : '↕';
      const filters = `<div class="toolbar xr-filters lt-bar"><input class="input lt-search" type="search" aria-label="搜索靶标名称" placeholder="搜索靶标名称" value="${E(C.filters.query)}" onchange="App.exerciseResults.setFilter('query',this.value)">${select('target', '靶标', uniq(all, 'targetKey', 'target'))}${select('policy', '攻击策略', uniq(all, 'policyKey', 'policy'))}${select('defense', '蓝队', uniq(all, 'defense'))}<button class="btn small" onclick="App.exerciseResults.toggleRiskSort()">风险等级 ${sortLabel}</button></div>`;
      const row = ({ t, f: v }) => {
        const id = E(t.id),
          compare = C.comparable(t)
            ? `<button class="link-btn" data-id="${id}" onclick="App.exerciseResults.pick(this.dataset.id)">结果对比</button>`
            : '<span class="xr-op-off" title="仅已完成且有有效判定的任务可对比">结果对比</span>',
          report = V.reportReady(t)
            ? `<button data-id="${id}" onclick="App.evaluation.openReport(this.dataset.id)">查看报告</button>`
            : '<button disabled>查看报告</button>',
          more = `<details class="xr-more"><summary class="link-btn">更多</summary><div class="xr-more-menu"><button data-id="${id}" onclick="App.attack.open(this.dataset.id)">任务详情</button>${report}</div></details>`;
        return `<tr><td>${E(v.target)}</td><td>${E(t.name)}</td><td class="xr-num">${v.asr == null ? '—' : pct(v.a.breach, v.a.valid)}<small>${v.a.breach} / ${v.a.valid}</small></td><td>${riskTag(v)}</td><td>${E(v.policy)}</td><td>${E(v.defense)}</td><td>${E(v.judge)}</td><td class="lc-time">${E(A.fmtTime(v.created))}</td><td class="lc-time">${v.finished ? E(A.fmtTime(v.finished)) : '—'}</td><td class="xr-ops">${compare}${more}</td></tr>`;
      };
      const body =
        rows.map(row).join('') ||
        '<tr><td colspan="10" class="empty">没有符合筛选条件的演练任务</td></tr>';
      return (
        A.heading('', '模型结果', '按靶标顺序列出全部演练任务，可从任一已完成任务发起结果对比。') +
        `<section class="card xr-list">${filters}<div class="table-wrap"><table class="xr-table"><thead><tr><th>靶标</th><th>任务名称</th><th>ASR</th><th>风险等级</th><th>攻击策略</th><th>蓝队</th><th>裁判模型</th><th>创建时间</th><th>完成时间</th><th>操作</th></tr></thead><tbody>${body}</tbody></table></div></section>`
      );
    }

    // 结果对比：全部在一个弹窗内完成。先选对比方式与对照任务，再在同一弹窗查看对比；
    // “重新选择”回到选择视图（保留已选项），任务较多时列表自身滚动，不挤占对比内容。
    const SAME = [
      'targetKey',
      'policyKey',
      'bank',
      'methods',
      'attacker',
      'process',
      'defense',
      'judge',
    ];
    const VARY = { blue: 'defense', target: 'targetKey' };
    C.cmp = null; // { baseId, mode, otherId, view: 'pick' | 'result' }
    C.candidates = function (base, mode) {
      const bf = C.facts(base),
        vary = VARY[mode];
      return C.tasks()
        .filter((t) => t.id !== base.id && C.comparable(t))
        .map((t) => ({ t, f: C.facts(t) }))
        .filter(
          ({ f }) =>
            f[vary] !== bf[vary] && SAME.filter((k) => k !== vary).every((k) => f[k] === bf[k]),
        );
    };
    C.pick = function (id, mode) {
      const base = C.tasks().find((t) => t.id === id);
      if (!base || !C.comparable(base)) return;
      mode = mode === 'target' ? 'target' : 'blue';
      const keep = C.cmp?.baseId === id && C.cmp.mode === mode ? C.cmp.otherId : '';
      const cands = C.candidates(base, mode);
      C.cmp = {
        baseId: id,
        mode,
        otherId: cands.some(({ t }) => t.id === keep) ? keep : cands[0]?.t.id || '',
        view: 'pick',
      };
      C.renderModal();
    };
    C.choose = function (id) {
      if (C.cmp) C.cmp.otherId = id;
    };
    C.showResult = function (show) {
      if (!C.cmp || (show && !C.cmp.otherId)) return;
      C.cmp.view = show ? 'result' : 'pick';
      C.renderModal();
    };
    C.renderModal = function () {
      const s = C.cmp,
        base = C.tasks().find((t) => t.id === s.baseId),
        other = C.tasks().find((t) => t.id === s.otherId);
      if (s.view === 'result' && base && other)
        return A.modal(
          '结果对比',
          resultHTML(base, other),
          `<button class="btn" onclick="App.exerciseResults.showResult(false)">重新选择</button><button class="btn primary" onclick="App.closeModal()">关闭</button>`,
          { wide: true },
        );
      A.modal(
        '选择对比任务',
        pickHTML(base),
        `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" ${s.otherId ? '' : 'disabled'} onclick="App.exerciseResults.showResult(true)">开始对比</button>`,
        { wide: true },
      );
    };
    function pickHTML(base) {
      const s = C.cmp,
        bf = C.facts(base),
        cands = C.candidates(base, s.mode);
      const modes = [
        ['blue', '蓝队对比', '仅蓝队不同，靶标、攻击策略与裁判均一致，', '对比蓝队效果'],
        ['target', '靶标对比', '仅靶标不同，攻击策略、蓝队与裁判均一致，', '对比靶标结果'],
      ]
        .map(
          ([k, n, d, goal]) =>
            `<button class="xr-mode ${s.mode === k ? 'active' : ''}" data-id="${E(base.id)}" onclick="App.exerciseResults.pick(this.dataset.id,'${k}')"><strong>${n}</strong><small>${d}<em class="xr-mode-goal">${goal}</em></small></button>`,
        )
        .join('');
      const vary = s.mode === 'blue' ? '蓝队' : '靶标';
      const rows = cands
        .map(
          ({ t, f }) =>
            `<tr><td><input type="radio" name="xr-cand" aria-label="选择 ${E(t.name)}" value="${E(t.id)}" ${t.id === s.otherId ? 'checked' : ''} onchange="App.exerciseResults.choose(this.value)"></td><td>${E(t.name)}</td><td>${E(s.mode === 'blue' ? f.defense : f.target)}</td><td class="xr-num">${pct(f.a.breach, f.a.valid)}</td><td class="lc-time">${E(A.fmtTime(f.finished) || '—')}</td></tr>`,
        )
        .join('');
      const list = cands.length
        ? `<div class="xr-cand-table"><table><thead><tr><th></th><th>任务名称</th><th>${vary}</th><th>ASR</th><th>完成时间</th></tr></thead><tbody>${rows}</tbody></table></div>`
        : `<p class="empty">暂无仅${vary}不同、其余配置一致的已完成任务</p>`;
      return `<p class="xr-pick-base"><span>靶标：<strong>${E(bf.target)}</strong></span><span>原始任务：<strong>${E(base.name)}</strong></span></p><div class="xr-modes">${modes}</div><h3 class="xr-cand-title">可对比任务<span>${cands.length} 个</span></h3>${list}`;
    }

    // 差异以百分点显示：对照组更高为红色 +，更低为绿色 −。
    const rate = (r) => (r && r.valid ? r.breach / r.valid : null);
    function delta(a, b) {
      if (a == null || b == null) return '';
      const d = (b - a) * 100;
      if (Math.abs(d) < 0.05) return '<span class="xr-delta same">±0</span>';
      return `<span class="xr-delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(1)}%</span>`;
    }
    const count = (breach, valid) => `攻破数/有效判定: ${breach}/${valid}`;
    function value(r, ref) {
      if (!r || !r.valid) return '<span class="xr-na">—</span>';
      return `${ref ? delta(rate(ref), rate(r)) : ''}<strong>${pct(r.breach, r.valid)}</strong><small>${count(r.breach, r.valid)}</small>`;
    }
    // 场景按题目数、方法按测试单元数从多到少；默认展示前三项，其余收起。
    function rateRows(title, aRows, bRows, size) {
      const ids = [...new Set([...aRows, ...bRows].map((r) => r.id))],
        find = (rows, id) => rows.find((r) => r.id === id),
        label = (id) => (find(aRows, id) || find(bRows, id)).label;
      ids.sort(
        (x, y) =>
          Math.max(size(find(aRows, y)), size(find(bRows, y))) -
          Math.max(size(find(aRows, x)), size(find(bRows, x))),
      );
      const row = (id) => {
        const a = find(aRows, id),
          b = find(bRows, id);
        return `<div class="xr-cmp-row"><span>${E(label(id))}</span><div>${value(a)}</div><div>${value(b, a)}</div></div>`;
      };
      const head = ids.slice(0, 3).map(row).join(''),
        rest = ids.slice(3);
      return `<section class="xr-cmp-block"><h3>${title}</h3>${head || '<p class="empty">暂无有效判定</p>'}${rest.length ? `<details class="xr-cmp-rest"><summary>展开全部${title.slice(0, 2)}（另 ${rest.length} 项）</summary>${rest.map(row).join('')}</details>` : ''}</section>`;
    }
    function resultHTML(base, other) {
      const fa = C.facts(base),
        fb = C.facts(other);
      const names = `<section class="xr-cmp-names"><div><small>原始任务</small><strong>${E(base.name)}</strong></div><div><small>对照任务</small><strong>${E(other.name)}</strong></div></section>`;
      const asr = `<section class="xr-cmp-asr"><div><small>原始任务 ASR</small><strong>${pct(fa.a.breach, fa.a.valid)}</strong><span>${count(fa.a.breach, fa.a.valid)}</span></div><div><small>对照任务 ASR</small><strong>${delta(fa.asr, fb.asr)}${pct(fb.a.breach, fb.a.valid)}</strong><span>${count(fb.a.breach, fb.a.valid)}</span></div></section>`;
      const config = [
        ['靶标', 'target'],
        ['攻击策略', 'policy'],
        ['蓝队', 'defense'],
        ['裁判', 'judge'],
      ]
        .map(([label, k]) => {
          const diff = fa[k] !== fb[k];
          return `<div class="xr-cmp-row${diff ? ' xr-diff' : ''}"><span>${label}${diff ? '<small>不同</small>' : ''}</span><div>${E(fa[k])}</div><div>${E(fb[k])}</div></div>`;
        })
        .join('');
      const valid = `<div class="xr-cmp-row"><span>有效判定</span><div>${fa.a.valid}</div><div>${fb.a.valid}</div></div>`;
      const scenes = (t) => X.taskAnalysis(t).scenes.filter((s) => s.valid > 0),
        methods = (t) => X.taskAnalysis(t).methods.map((m) => ({ ...m, label: methodLabel(m.id) }));
      return (
        names +
        asr +
        `<section class="xr-cmp-block"><h3>配置对照</h3>${config}${valid}</section>` +
        rateRows('场景表现', scenes(base), scenes(other), (r) => r?.questions || 0) +
        rateRows('方法表现', methods(base), methods(other), (r) => r?.total || 0)
      );
    }
    C.render = listHTML;

    // 模型结果页由本文件渲染；扫描结果仍走 R.results。旧的对比/对象链接已在 P.legacyRoute 换算到这里。
    P.routes['exercise/results'] = () => C.render();
    // Model assets open their exercise results; other assets keep the report list.
    const openObject = A.assessment.openObject;
    A.assessment.openObject = function (key) {
      if (!String(key).startsWith('models:')) return openObject.apply(this, arguments);
      Object.keys(C.filters).forEach((k) => (C.filters[k] = ''));
      C.filters.target = String(key).slice(7);
      A.platform.go('exercise', 'results');
    };
  })();
};
