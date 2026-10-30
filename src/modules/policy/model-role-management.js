/* policy/model-role-management。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['policy/model-role-management'] = function () {
  /* Platform roles reference model assets; credentials and historical run snapshots stay in their owners. */
  (function () {
    'use strict';
    const A = window.App,
      C = A.connections,
      X = A.attack,
      E = A.escape;
    const copy = (v) => JSON.parse(JSON.stringify(v)),
      now = () => new Date().toISOString();
    const types = {
      basic: '基础模型',
      safety: '安全模型',
      embedding: 'Embedding 模型',
      multimodal: '多模态模型',
    };
    const roles = {
      target: '靶标',
      attacker: '攻击生成',
      judge: '裁判',
      scanner: '漏洞分析',
      guard: '护栏',
      embedding: '语义检索',
    };
    const protocols = {
      chat: '对话生成',
      qwen3guard: 'Qwen3Guard 安全分类',
      embeddings: '向量输出',
      'multimodal-chat': '多模态对话',
    };
    const contracts = {
      basic: ['chat'],
      safety: ['chat', 'qwen3guard'],
      embedding: ['embeddings'],
      multimodal: ['multimodal-chat'],
    };
    const compatible = {
      chat: ['target', 'attacker', 'judge', 'scanner'],
      'multimodal-chat': ['target', 'attacker', 'judge', 'scanner'],
      qwen3guard: ['guard'],
      embeddings: ['embedding'],
    };
    const guardId = 'system-qwen3guard';
    const visibleRoles = () => roles;
    const rows = () => A.data.attack?.models || [];
    const revision = (m) => Number(m?.configurationRevision) || 1;
    const modelName = (m) => m?.name || m?.model || '未命名模型';
    const supported = (d) =>
      (contracts[d.type] || []).includes(d.outputProtocol)
        ? (compatible[d.outputProtocol] || []).filter(
            (r) => d.type !== 'safety' || r !== 'attacker',
          )
        : [];
    const M = (A.modelRoles = {
      types,
      roles,
      protocols,
      filter: { type: '', role: '', state: '', query: '' },
      draft: null,
    });
    M.init = function () {
      if (!A.data.attack) return;
      if (
        !A.data.modelRoleAssignments ||
        typeof A.data.modelRoleAssignments !== 'object' ||
        Array.isArray(A.data.modelRoleAssignments)
      )
        A.data.modelRoleAssignments = {};
      const db = A.data.modelRoleAssignments;
      for (const m of rows().filter((m) => (m.kind || 'model') === 'model')) {
        if (['user', 'unassigned'].includes(db[m.id]?.source)) continue;
        const guard = !!m.systemGuard || m.id === guardId;
        const type = guard ? 'safety' : m.caps?.includes('vision') ? 'multimodal' : 'basic';
        db[m.id] = {
          modelId: m.id,
          type,
          outputProtocol: 'unconfigured',
          roles: [],
          confirmed: false,
          assetRevision: revision(m),
          revision: 1,
          source: 'unassigned',
          updatedAt: now(),
        };
      }
    };
    M.get = function (id) {
      M.init();
      const d = A.data.modelRoleAssignments?.[typeof id === 'object' ? id.id : id];
      return d ? copy(d) : null;
    };
    M.allows = function (model, role) {
      const id = typeof model === 'string' ? model : model?.id,
        m = rows().find((v) => v.id === id),
        d = M.get(m?.id);
      return (
        !!m &&
        (m.kind || 'model') === 'model' &&
        m.accessType !== 'weights' &&
        M.configured(m, d) &&
        d.roles.includes(role) &&
        supported(d).includes(role)
      );
    };
    M.candidates = function (role) {
      M.init();
      return rows()
        .filter((m) => M.connected(m) && M.allows(m, role))
        .sort(
          (a, b) =>
            modelName(a).localeCompare(modelName(b), 'en', {
              numeric: true,
              sensitivity: 'base',
            }) || a.id.localeCompare(b.id),
        );
    };
    M.state = function (m) {
      const d = M.get(m?.id);
      return !d?.confirmed
        ? 'unassigned'
        : d.assetRevision !== revision(m)
          ? 'changed'
          : !d.roles.length
            ? 'disabled'
            : !M.connected(m)
              ? 'offline'
              : 'ready';
    };
    M.stateLabel = function (m) {
      return {
        unassigned: '未配置',
        changed: '需重新确认',
        disabled: '未启用用途',
        offline: '连接不可用',
        ready: '已配置',
      }[M.state(m)];
    };
    M.filterBy = function (key, value) {
      if (!Object.hasOwn(M.filter, key)) return;
      M.filter[key] = value;
      A.render();
    };
    M.filtered = function () {
      const f = M.filter,
        q = f.query.trim().toLowerCase();
      return rows()
        .filter((m) => (m.kind || 'model') === 'model')
        .filter((m) => {
          const d = M.get(m.id);
          return (
            (!f.type || d?.type === f.type) &&
            (!f.role || d?.roles.includes(f.role)) &&
            (!f.state || M.state(m) === f.state) &&
            (!q || [m.name, m.model].join(' ').toLowerCase().includes(q))
          );
        });
    };
    // Enforce roles wherever existing task and strategy pickers obtain their options.
    C.assetCandidates = (role) => M.candidates(role);
    C.eligible = (role) => M.candidates(role || 'target');
    const assetPicker = C.assetPicker;
    const taskValidate = X.taskValidation;
    X.taskValidation = function (w) {
      if (w.model && !M.allows(w.model, 'target'))
        return '靶标模型未配置对应用途，请到平台管理 → 模型配置检查';
      if (w.step === 3) {
        const judge = w.judge;
        if (judge && !M.allows(judge, 'judge'))
          return '裁判模型未配置裁判用途，请在任务中重新选择或到平台管理配置用途';
        if (
          X.requirements(w.methods || []).attacker &&
          w.attacker &&
          !M.allows(w.attacker, 'attacker')
        )
          return '攻击模型未配置攻击生成用途，请到平台管理 → 模型配置检查';
      }
      return taskValidate.apply(X, arguments);
    };
    const guardReady = X.guardReady;
    X.guardConnectionHint =
      '护栏不可用，请在资产中心 → 模型查看 Qwen3Guard 服务，在平台管理 → 模型配置查看用途。';
    const retestError = A.policies.retestError;
    A.policies.retestError = function (s) {
      const error = retestError.apply(this, arguments);
      if (error) return error;
      for (const [role, model] of [
        ['target', s?.target],
        ['attacker', s?.attacker],
        ['judge', s?.judgement?.model],
        ['guard', s?.defense?.model],
      ]) {
        if (model && !M.allows(model.id, role))
          return (roles[role] || role) + '模型的用途已调整：' + modelName(model);
      }
      for (const entry of Object.values(s?.methodModels || {}))
        for (const [key, model] of Object.entries(entry.modelSnapshots || {})) {
          const role = entry.roles?.[key] || 'embedding';
          if (model && !M.allows(model.id, role))
            return '方法辅助模型的用途已调整：' + modelName(model);
        }
      return '';
    };
    const saveConnection = C.save;
    const init = X.init;
    X.init = function () {
      const result = init.apply(X, arguments);
      M.init();
      return result;
    };
  })();
};
