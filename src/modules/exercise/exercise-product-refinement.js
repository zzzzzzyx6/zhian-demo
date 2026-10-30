/* exercise/exercise-product-refinement。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/exercise-product-refinement'] = function () {
  /* Exercise roles: strategies fix the attack and process models; each task picks its blue team and judge. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      P = A.policies,
      M = A.modelRoles,
      E = A.escape;
    const candidates = (role) => M.candidates(role);
    const usable = (id, role) => candidates(role).find((m) => m.id === id) || null;
    const needs = (methods) => X.requirements(methods.map((m) => m.id || m));
    const options = (role, value) => {
      const list = candidates(role);
      return (
        `<option value="">${list.length ? '请选择' : '暂无可用模型'}</option>` +
        list
          .map(
            (m) =>
              `<option value="${E(m.id)}" ${value === m.id ? 'selected' : ''}>${E(m.name || m.model)}</option>`,
          )
          .join('')
      );
    };
    const roleName = (m) => m?.name || m?.model || '';

    // 全平台唯一的蓝队表述：只说明防护位置，不暴露具体护栏模型。
    // blueLabel 的早期多层实现统一收敛到这里，向导、详情、报告、结果列表共用。
    X.blueText = function (d = {}) {
      const input = !!(d.modelInput ?? d.rules?.input),
        output = !!(d.modelOutput ?? d.rules?.output),
        positions = [input ? '输入' : '', output ? '输出' : ''].filter(Boolean).join('，');
      if (d.mode === 'prompt') return '系统提示词加固';
      return d.mode && d.mode !== 'existing' && positions ? '启用护栏：' + positions : '基准测试';
    };
    X.blueLabel = (d) => X.blueText(d || {});

    /* Strategy editor: methods, banks and the auxiliary models those methods need. Published strategies are immutable. */
    P.rolesHTML = function () {
      const d = P.draft,
        req = needs(d.methods);
      const head =
        '<div class="policy-section-title"><h3>攻击辅助模型</h3><span>随策略发布固定，任务中不可修改</span></div>';
      if (!req.attacker && !req.process)
        return (
          head +
          '<p class="field-help">所选方法使用本地模板构造攻击输入，无需攻击生成模型和过程裁判。</p>'
        );
      d.attacker = usable(d.attacker, 'attacker')?.id || candidates('attacker')[0]?.id || '';
      d.processJudge = usable(d.processJudge, 'judge')?.id || M.defaultJudge()?.id || '';
      const field = (role, key, label, help) =>
        `<div class="field"><label for="policy-${key}">${label} *</label><select id="policy-${key}" onchange="App.policies.draft.${key}=this.value">${options(role, d[key])}</select><p class="field-help">${help}</p></div>`;
      return (
        head +
        `<div class="form-grid">${req.attacker ? field('attacker', 'attacker', '攻击生成模型', '候选为平台管理中配置了「攻击生成」用途的模型。') : ''}${req.process ? field('judge', 'processJudge', '过程裁判', '迭代方法内部判断是否继续改写，不决定最终结果；候选为「裁判」用途模型。') : ''}</div>`
      );
    };
    P.editor = function () {
      const d = P.draft;
      if (!d) return;
      d.selectionMode = 'all';
      delete d.sampleLimit;
      const back =
        P.taskPolicyReturn?.draft === d ? 'App.policies.returnToTask()' : 'App.closeModal()';
      const body = `<div class="policy-editor"><div class="field"><label for="policy-name">策略名称 *</label><input id="policy-name" maxlength="100" value="${E(d.name)}" oninput="App.policies.draft.name=this.value"></div><div class="field"><label for="policy-description">策略说明</label><input id="policy-description" maxlength="300" value="${E(d.description || '')}" oninput="App.policies.draft.description=this.value"></div>
 <section class="policy-editor-section"><div class="policy-section-title"><h3>攻击方法 *</h3><span>每种方法单独配置参数与所需辅助模型</span></div>${P.selectionHTML('methods')}<div id="policy-method-parameters">${P.selectedMethodsHTML()}</div></section>
 <section class="policy-editor-section"><div class="policy-section-title"><h3>攻击题库 *</h3></div>${P.selectionHTML('banks')}<div class="ps-selected-banks" id="policy-selected-banks">${P.selectedBanksHTML()}</div></section>
 <p class="field-help">策略名称唯一，发布后内容固定；需要调整时复制为新策略。最终裁判在创建演练任务时选择。</p>
 <p id="policy-editor-error" class="error-message" role="alert"></p></div>`;
      A.modal(
        '新建攻击策略',
        body,
        `<button class="btn" onclick="${back}">取消</button><button class="btn primary" onclick="App.policies.save()">发布策略</button>`,
        { wide: true },
      );
    };
    const refresh = P.refreshSelection;
    P.refreshSelection = function (kind) {
      refresh.apply(P, arguments);
      // 辅助模型已并入各方法参数弹窗（见 openrt-methods P.parameterFor），
      // 不再有独立的 #policy-role-bindings 栏需要刷新。
    };
    // Existing strategies open read-only; only new strategies are edited.
    const edit = P.edit;
    P.edit = function (id) {
      if (id && P.db.some((p) => p.id === id)) return P.detail(id);
      return edit.call(P);
    };
    const copyPolicy = P.copy;
    P.copy = function (id) {
      A.closeDrawer();
      const result = copyPolicy.apply(P, arguments);
      if (P.draft) delete P.draft.demoFixture;
      return result;
    };
    P.detail = function (id) {
      const p = P.db.find((v) => v.id === id);
      if (!p) return;
      const v = p.revisions.at(-1);
      A.drawer(
        p.name,
        `<section class="policy-detail-section"><h3>策略说明</h3><p>${E(p.description || '暂无说明')}</p></section>${v ? `<div class="policy-current-detail">${P.summary(v)}</div>` : ''}`,
        `<button class="btn" onclick="App.closeDrawer()">关闭</button><button class="btn primary" data-id="${E(p.id)}" onclick="App.policies.copy(this.dataset.id)">复制为新策略</button>`,
      );
    };
    // 辅助模型已并入每种方法的参数弹窗（entry.modelBindings），逐方法回填/校验。
    // 兼容旧数据：若某方法未单独绑定，回落到策略级 d.attacker / d.processJudge。
    const methodAux = (d, entry, key) =>
      entry.modelBindings?.[key] || (key === 'attacker' ? d.attacker : d.processJudge) || '';
    const validate = P.validate;
    P.validate = function (d, publishing = true) {
      const error = validate.apply(P, arguments);
      if (error || !publishing) return error;
      for (const entry of d.methods || []) {
        const m = P.method(entry.id),
          slots = X.methodSlots?.(m || entry) || [];
        for (const slot of slots) {
          if (!usable(methodAux(d, entry, slot.key), slot.role))
            return (
              '“' +
              (m?.name || entry.id) +
              '”需要' +
              slot.label +
              '，请在该方法参数中选择已配置相应用途的模型'
            );
        }
      }
      return '';
    };
    const freeze = P.freeze;
    P.freeze = function (d) {
      const s = freeze.apply(P, arguments),
        req = needs(d.methods);
      // 逐方法快照辅助模型连接，保存在 method.methodRoles 上；同时保留策略级 executionRoles
      // 作为整体回退/展示（取第一个有绑定的方法）。
      let firstAttacker = null,
        firstProcess = null;
      for (const entry of s.methods || []) {
        const slots = X.methodSlots?.(P.method(entry.id) || entry) || [];
        if (!slots.length) continue;
        const roles = {};
        for (const slot of slots) {
          const conn = usable(methodAux(d, entry, slot.key), slot.role);
          roles[slot.key] = conn ? X.connectionSnapshot(conn) : null;
          if (slot.key === 'attacker' && conn && !firstAttacker) firstAttacker = roles[slot.key];
          if (slot.key === 'process' && conn && !firstProcess) firstProcess = roles[slot.key];
        }
        entry.methodRoles = roles;
      }
      s.executionRoles = {
        attacker: req.attacker ? firstAttacker : null,
        process: req.process ? firstProcess : null,
      };
      s.immutable = true;
      return s;
    };
    const summary = P.summary;
    P.renderPolicies = function () {
      const q = P.policyQuery.toLowerCase(),
        rows = P.db.filter((p) => (p.name + ' ' + (p.description || '')).toLowerCase().includes(q));
      const used = (id) =>
        X.db.tasks.filter((t) => !t.deletedAt && t.policySnapshot?.policyId === id).length;
      const html = `<div class="policy-page lean-operations"><section class="card"><div class="toolbar policy-toolbar"><input class="input" aria-label="搜索攻击策略" placeholder="搜索策略名称" value="${E(P.policyQuery)}" oninput="App.policies.searchPolicies(this.value)"></div><div class="table-wrap"><table><thead><tr><th>策略名称</th><th>攻击方法</th><th>攻击题库</th><th>操作</th></tr></thead><tbody>${
        rows
          .map((p) => {
            const v = p.revisions.at(-1) || {};
            return `<tr><td><button class="link-btn" data-id="${E(p.id)}" onclick="App.policies.detail(this.dataset.id)">${E(p.name)}</button></td><td>${(v.methods || []).map((m) => E(m.name || m.id)).join('、')}</td><td>${E(v.bankSnapshot?.name || '—')}</td><td><div class="lo-actions"><button class="link-btn" data-id="${E(p.id)}" onclick="App.policies.copy(this.dataset.id)">复制为新策略</button>${A.entryManagement.button('attack-policy', p.id)}</div></td></tr>`;
          })
          .join('') || '<tr><td colspan="4" class="empty">暂无攻击策略</td></tr>'
      }</tbody></table></div></section></div>`;
      return A.listConsistency.tableTimes(html, P.db);
    };

    /* 演练任务配置弹窗：新建、复测、草稿续填共用同一单屏表单，提交即创建并运行。 */
    const apply = P.applyTaskPolicy;
    P.applyTaskPolicy = function (w) {
      apply.apply(P, arguments);
      const s = w.policySnapshot,
        r = s?.executionRoles || {};
      w.attacker = r.attacker?.id || '';
      w.processJudge = r.process?.id || '';
      // 方法辅助模型由策略固定，任务直接沿用策略快照中的绑定。
      w.methodModelBindings = Object.fromEntries(
        (s?.methods || [])
          .filter((m) => m.methodRoles)
          .map((m) => [
            m.id,
            Object.fromEntries(Object.entries(m.methodRoles).map(([k, v]) => [k, v?.id || ''])),
          ]),
      );
    };
    const newTask = X.newTask;
    X.newTask = function () {
      if (A.evaluation) A.evaluation.showDrafts = false;
      return newTask.apply(X, arguments);
    };
    X.setDefenseMode = function (mode) {
      if (!X.wizard || !['existing', 'qwen3guard'].includes(mode)) return;
      X.wizard.defenseMode = mode;
      X.wizardModal();
    };
    X.blueEditor = function (w) {
      const on = w.defenseMode === 'qwen3guard';
      return `<label class="task-switch"><input id="task-guard-enabled" type="checkbox" ${on ? 'checked' : ''} onchange="App.attack.setDefenseMode(this.checked?'qwen3guard':'existing')"><span>启用护栏</span></label>${
        on
          ? `<div class="task-guard-positions" role="group" aria-label="防护位置">${[
              ['input', 'Input', '输入'],
              ['output', 'Output', '输出'],
            ]
              .map(
                ([stage, key, label]) =>
                  `<label><input type="checkbox" ${w['blue' + key] !== false ? 'checked' : ''} onchange="App.attack.setGuardPosition('${stage}',this.checked)">${label}</label>`,
              )
              .join('')}</div>`
          : ''
      }`;
    };
    const section = (title, body, cls = '') =>
      `<section class="task-form-section ${cls}"><h3>${title}</h3>${body}</section>`;
    X.wizardModal = function () {
      const w = X.wizard;
      if (!w) return;
      if (!['existing', 'qwen3guard'].includes(w.defenseMode)) w.defenseMode = 'existing';
      if (w.judge && !usable(w.judge, 'judge')) w.judge = '';
      if (w.policySnapshot) P.applyTaskPolicy(w);
      const s = w.policySnapshot,
        published = P.db.map((p) => p.revisions?.at(-1)).filter(Boolean),
        ref = (r) => r.policyId + '@' + r.version,
        legacy = s && !published.some((r) => ref(r) === w.policyRef);
      const body =
        section(
          '任务信息',
          `<div class="field"><label for="task-name">任务名称 *</label><input id="task-name" value="${E(w.name || '')}" maxlength="100" placeholder="例如：业务模型1 · 客服场景安全回归" oninput="App.attack.wizard.name=this.value"></div><div class="field"><label for="task-description">任务描述</label><textarea id="task-description" rows="2" oninput="App.attack.wizard.description=this.value">${E(w.description || '')}</textarea></div>`,
        ) +
        section('靶标 *', A.connections.taskTargetPicker(w)) +
        section(
          '攻击策略 *',
          `<div class="field"><select id="task-policy" aria-label="攻击策略" onchange="App.policies.selectForTask(this.value)"><option value="">请选择攻击策略</option>${legacy ? `<option value="${E(w.policyRef)}" selected>${E(s.name || '历史策略快照')}</option>` : ''}${published.map((r) => `<option value="${E(ref(r))}" ${w.policyRef === ref(r) ? 'selected' : ''}>${E(r.name)}</option>`).join('')}<option value="__new_policy__">＋ 前往策略中心新建策略</option></select></div>${s ? P.summary(s) : ''}`,
        ) +
        section(
          '基础参数',
          `<div class="field task-concurrency-field"><label for="task-concurrency">并发数</label><input id="task-concurrency" type="number" min="1" max="8" value="${w.concurrency || 4}" oninput="App.attack.wizard.concurrency=Number(this.value)"></div>`,
        ) +
        section('蓝队', X.blueEditor(w)) +
        section(
          '裁判',
          `<div class="field"><label for="task-judge">裁判模型 *</label><select id="task-judge" onchange="App.attack.wizard.judge=this.value">${options('judge', w.judge)}</select></div>`,
        ) +
        '<p id="wizard-error" class="error-message" role="alert"></p>';
      A.modal(
        w.retest ? '复测演练任务' : '新建演练任务',
        `<div class="task-config-form">${body}</div>`,
        `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn" onclick="App.demoPresentation.saveDraft()">保存草稿</button><button class="btn primary" onclick="App.attack.launchTask()">${w.retest ? '开始复测' : '创建并运行'}</button>`,
        { wide: true },
      );
    };
    const taskValidation = X.taskValidation;
    X.taskValidation = function (w) {
      if (w.policySnapshot) P.applyTaskPolicy(w);
      const error = taskValidation.apply(X, arguments);
      if (error) return error;
      if (!usable(w.judge, 'judge')) return '请选择裁判模型';
      const r = w.policySnapshot?.executionRoles || {};
      if (r.process && !usable(r.process.id, 'judge'))
        return '策略的过程裁判已不可用，请复制策略并重新选择';
      return '';
    };

    /* 复测：基于原任务全部配置新建一次任务，名称为 A(1)、A(2)… */
    X.retestName = function (t) {
      const base = String(t.name || '').replace(/\(\d+\)$/, ''),
        names = new Set(X.db.tasks.filter((v) => !v.deletedAt).map((v) => v.name));
      let n = 1;
      while (names.has(base + '(' + n + ')')) n++;
      return base + '(' + n + ')';
    };
    const repeatTask = X.repeatTask;
    X.repeatTask = function (id) {
      const result = repeatTask.apply(X, arguments),
        t = X.db.tasks.find((v) => v.id === id);
      if (!t || !X.wizard) return result;
      Object.assign(X.wizard, { name: X.retestName(t), retest: true });
      X.wizardModal();
      return result;
    };
    const launchTask = X.launchTask;
    X.launchTask = function () {
      if (X.wizard?.policySnapshot) P.applyTaskPolicy(X.wizard);
      const t = launchTask.apply(X, arguments);
      if (!t) return t;
      const process = t.policySnapshot.executionRoles?.process || null;
      t.engine.roles.process = process;
      for (const b of t.engine.bindings || [])
        b.processJudge = P.method(b.method)?.process ? process?.id || null : null;
      t.runSnapshot = P.runSnapshot(t);
      A.save();
      return t;
    };

    /* Remove the dataset export entry points. */
    if (A.evaluationDatasets) {
      A.evaluationDatasets.exportMenu = () => '';
      A.evaluationDatasets.export = () => false;
    }
  })();
};
