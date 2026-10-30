/* exercise/attack-setup。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/attack-setup'] = function () {
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      E = A.escape,
      I = A.icon;
    // Dependency mapping follows the bundled OpenRT implementation, not the algorithm name alone.
    const methods = {
      Direct: { label: '直接提问', gen: false, process: false, note: '原样发送测试样本，建立基线' },
      DeepInception: { label: '嵌套情境', gen: false, process: false, note: '使用固定情境模板' },
      PAIR: {
        label: '反馈式改写',
        gen: true,
        process: true,
        param: 'attacker_model',
        note: '攻击模型根据回应迭代，过程裁判决定是否继续',
      },
      Crescendo: {
        label: '渐进式追问',
        gen: true,
        process: true,
        param: 'attack_model',
        note: '在多轮会话中逐步生成追问',
      },
      CoA: {
        label: '分步诱导',
        gen: true,
        process: true,
        param: 'attack_model',
        note: '生成并执行多轮测试步骤',
      },
      ReNeLLM: {
        label: '重写优化',
        gen: true,
        process: true,
        param: 'attacker_model',
        note: '攻击模型执行改写与重组，裁判检验结果',
      },
      DrAttack: {
        label: '提示分解',
        gen: true,
        process: false,
        param: 'helper_model',
        note: '分解与重组请求；辅助向量模型采用 text-embedding-3-large',
      },
      'AutoDAN-Turbo': {
        label: '策略自优化',
        gen: true,
        process: true,
        param: 'attacker_model',
        note: '学习并复用攻击策略；策略总结复用攻击模型',
      },
      ICA: { label: '上下文示范', gen: false, process: false, note: '使用预设问答示例' },
      JailBrokenRole: {
        label: '角色扮演',
        gen: false,
        process: false,
        note: 'JailBroken 的 evil_confidant 固定模板',
      },
      CipherChat: {
        label: '编码表达',
        gen: false,
        process: false,
        note: '使用编码规则与示例，无需辅助模型',
      },
      Multilingual: {
        label: '跨语言测试',
        gen: true,
        process: false,
        param: 'helper_model',
        note: '攻击生成模型承担翻译工作',
      },
      FlipAttack: { label: '字符重排', gen: false, process: false, note: '使用本地字符变换规则' },
      PastTense: {
        label: '时态改写',
        gen: true,
        process: false,
        param: 'reformulation_model',
        note: '攻击生成模型承担改写工作；当前采用单次改写模式',
      },
      FigStep: {
        label: '图片文字指令',
        gen: false,
        process: false,
        param: 'helper_model',
        note: '默认直接渲染文字；可按需开启辅助改写被测对象须支持图像',
      },
      NanoGCG: {
        label: '梯度优化',
        gen: false,
        process: false,
        note: '需要权重、tokenizer、梯度与 GPU；仅接入本地 URL 不满足条件',
      },
    };
    X.methodDependencies = methods;
    const C = (A.connections = {
      secrets: new Map(),
      draft: null,
      returnTo: null,
      get db() {
        return X.db.models;
      },
      init() {
        const retired = X.db.models.filter((m) => m.accessType === 'weights');
        if (retired.length) {
          X.db.retiredWeightConnections = [...(X.db.retiredWeightConnections || []), ...retired];
          X.db.models = X.db.models.filter((m) => m.accessType !== 'weights');
        }
        for (const m of C.db) {
          m.accessType ||= 'api';
          if (!m.schema) {
            m.sample = ['m1', 'm2', 'm3'].includes(m.id);
            m.kind = 'model';
            m.hosting = 'cloud';
            m.protocol = 'openai';
            m.auth = 'bearer';
            m.uses = ['target'];
            m.timeout = 60;
            m.schema = 2;
          }
          if (m.connectStatus === undefined)
            m.connectStatus = m.sample || m.auth === 'none' ? 'ok' : 'pending';
          // Old versions never asked for credentials. Never import credentials into browser storage.
          delete m.apiKey;
          delete m.key;
          delete m.token;
        }
      },
      clearSecrets() {
        C.secrets.clear();
        C.draft = null;
        const el = document.getElementById('c-key');
        if (el) el.value = '';
      },
      ready(m) {
        return !!m;
      },
      connState(m) {
        if (m.presetPending) return { label: '待配置', tone: 'orange', ok: false };
        if (m.connectStatus === 'testing') return { label: '测试中', tone: 'blue', testing: true };
        if (m.sample || m.auth === 'none' || C.secrets.has(m.id) || m.connectStatus === 'ok')
          return { label: '已连通', tone: 'green', ok: true };
        return { label: '未连通', tone: 'gray', ok: false };
      },
      status(m) {
        return C.connState(m).label;
      },
      usedBy(id) {
        return X.db.tasks.filter(
          (t) =>
            t.model === id || Object.values(t.engine.roles || {}).some((r) => r && r.id === id),
        );
      },
      test(id) {
        const m = C.db.find((x) => x.id === id);
        if (!m) return;
        if (m.presetPending) {
          A.toast('该连接尚未配置，请先编辑再测试');
          return;
        }
        if (m.connectStatus === 'testing') return;
        // Decide the outcome first, then only the status tag changes: 未连通 -> 测试中 -> 已连通/未连通. No modal.
        const ok = m.sample || m.auth === 'none' || C.secrets.has(m.id) || m.connectStatus === 'ok';
        m.connectStatus = 'testing';
        A.save();
        A.render();
        setTimeout(() => {
          m.connectStatus = ok ? 'ok' : 'fail';
          A.save();
          A.render();
          A.toast(ok ? '连接测试成功' : '连接测试失败：缺少 API Key');
        }, 800);
      },
      remove(id) {
        const m = C.db.find((x) => x.id === id);
        if (!m) return;
        const noun = m.kind === 'agent' ? '智能体' : '模型';
        A.modal(
          '删除' + noun,
          `<p>确认删除${noun}「${E(m.name)}」吗？</p>`,
          `<button class="btn" onclick="App.closeModal()">取消</button><button class="entry-delete" onclick="App.connections.removeConfirm('${m.id}')" aria-label="删除" title="删除" type="button">删除</button>`,
          { plain: true },
        );
      },
      removeConfirm(id) {
        const at = C.db.findIndex((x) => x.id === id);
        if (at < 0) {
          A.closeModal();
          return;
        }
        const m = C.db[at];
        C.db.splice(at, 1);
        C.secrets.delete(id);
        A.save();
        A.closeModal();
        A.render();
        A.toast(`已删除「${m.name}」`);
      },
      eligible() {
        return C.db.filter((m) => (m.kind || 'model') === 'model' && m.accessType !== 'weights');
      },
      options(role, value) {
        return (
          '<option value="">请选择连接</option>' +
          C.eligible(role)
            .map(
              (m) =>
                `<option value="${m.id}" ${value === m.id ? 'selected' : ''}>${E(m.name)}${m.accessType === 'weights' ? ' · 模型权重' : ''}</option>`,
            )
            .join('')
        );
      },
      roleSelect(role, value, id, onchange) {
        return `<select id="${id}" onchange="${onchange}">${C.options(role, value)}</select>`;
      },
      open(id = '', role = 'target', preset = '', returnTo = null) {
        const m = C.db.find((x) => x.id === id);
        C.returnTo = returnTo;
        C.role = role;
        C.draft = m
          ? { ...m, caps: [...m.caps], uses: [...m.uses], key: '', tested: false }
          : {
              id: '',
              name: '',
              vendor: '',
              kind: X.connectionKind || 'model',
              hosting: 'cloud',
              protocol: 'openai',
              model: '',
              endpoint: '',
              auth: 'bearer',
              header: 'X-API-Key',
              caps: ['text', 'chat'],
              uses: [role],
              timeout: 60,
              body: '{"input":"{{input}}"}',
              responsePath: 'output',
              sessionPath: 'session_id',
              key: '',
              tested: false,
            };
        if (m?.sample) {
          C.draft.id = '';
          C.draft.sample = false;
          C.draft.endpoint = '';
          C.draft.name = m.name + ' · 自有接入';
        }
        if (preset === 'v3')
          Object.assign(C.draft, {
            name: 'DeepSeek-V3 · 攻击生成',
            hosting: 'local',
            model: '',
            endpoint: '',
            uses: ['attacker'],
          });
        if (preset === 'judge')
          Object.assign(C.draft, {
            name: 'DeepSeek-V4-Flash · Judge',
            model: 'deepseek-v4-flash',
            endpoint: 'https://api.deepseek.com',
            uses: ['judge'],
            thinking: true,
          });
        C.form();
      },
      capture() {
        const d = C.draft;
        for (const n of ['name', 'vendor', 'endpoint', 'key']) {
          const el = document.getElementById('c-' + n);
          if (el) d[n] = el.value;
        }
        d.uses = d.kind === 'agent' ? ['target'] : ['target', 'attacker', 'judge'];
        d.caps = ['text', 'chat'];
        d.timeout = 60;
        d.auth = d.key.trim() || C.secrets.has(d.id) ? 'bearer' : 'none';
        d.hosting = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?=[:/]|$)/i.test(d.endpoint)
          ? 'local'
          : 'cloud';
      },
      change() {
        C.capture();
        C.form();
      },
      markDirty() {
        if (!C.draft) return;
        C.draft.tested = false;
        const btn = document.getElementById('c-test-btn');
        if (btn) {
          btn.classList.remove('ok');
          btn.innerHTML = `${I('zap', 14)}测试链接`;
        }
      },
      form() {
        const d = C.draft;
        const f = (id, label, value, placeholder = '', type = 'text', extra = '') =>
          `<div class="field"><label for="c-${id}">${label}</label><input id="c-${id}" type="${type}" value="${E(value || '')}" placeholder="${placeholder}" autocomplete="off" ${extra}></div>`;
        A.modal(
          d.id ? '编辑连接' : d.kind === 'agent' ? '接入智能体' : '接入模型',
          `<form id="connection-form" onsubmit="return false">${f('name', '模型名称 *', d.name, '请填写模型全称，例如：Qwen2.5-72B-Instruct')}${f('vendor', '厂商', d.vendor, '例如：DeepSeek')}${f('endpoint', 'Base URL *', d.endpoint, '填写服务地址', 'text', 'oninput="App.connections.markDirty()"')}<div class="field"><label for="c-key">API Key *</label><div class="field-row"><input id="c-key" type="password" value="${E(d.key || '')}" placeholder="${C.secrets.has(d.id) ? '留空保留已保存的密钥' : '填写服务调用的 API Key'}" autocomplete="off" oninput="App.connections.markDirty()"><button class="btn" type="button" id="c-test-btn" onclick="App.connections.testDraft()">${I('zap', 14)}测试链接</button></div></div><p id="connection-error" class="error-message" role="alert"></p></form>`,
          `<button class="btn" onclick="App.connections.cancel()">取消</button><button class="btn primary" onclick="App.connections.save()">保存配置</button>`,
          { wide: false },
        );
      },
      validate(d) {
        if (!d.name.trim()) return '请填写模型名称';
        if (!d.endpoint.trim()) return '请填写 Base URL';
        if (!d.key.trim() && !C.secrets.has(d.id)) return '请填写 API Key';
        return '';
      },
      check() {
        C.capture();
        const error = C.validate(C.draft);
        const errEl = document.getElementById('connection-error');
        if (errEl) errEl.textContent = error;
        return !error;
      },
      testDraft() {
        C.capture();
        const d = C.draft,
          error = C.validate(d),
          errEl = document.getElementById('connection-error'),
          btn = document.getElementById('c-test-btn');
        if (error) {
          if (errEl) {
            errEl.textContent = error;
            errEl.scrollIntoView?.({ block: 'nearest' });
          }
          return;
        }
        if (errEl) errEl.textContent = '';
        // Feedback lives on the inline button only: 测试中… -> green ✓ 已通过.
        if (btn) {
          btn.disabled = true;
          btn.classList.remove('ok');
          btn.textContent = '测试中…';
        }
        setTimeout(() => {
          if (!btn || !btn.isConnected) return;
          d.tested = true;
          if (btn) {
            btn.disabled = false;
            btn.classList.add('ok');
            btn.textContent = '✓ 已通过';
          }
          A.toast('连接测试成功');
        }, 800);
      },
      save() {
        C.capture();
        const d = C.draft;
        if (!d.tested) {
          const errEl = document.getElementById('connection-error');
          if (errEl) {
            errEl.textContent = '请先完成连通性测试，再保存配置';
            errEl.scrollIntoView?.({ block: 'nearest' });
          }
          return;
        }
        if (!C.check()) return;
        const id = d.id || 'conn-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
        // Whitelist metadata: no credential or draft object is serialized.
        const m = {
          id,
          accessType: d.kind === 'agent' ? 'api' : d.accessType || 'api',
          schema: 2,
          sample: false,
          name: d.name.trim(),
          kind: d.kind,
          hosting: d.hosting,
          protocol: d.protocol,
          model: d.protocol === 'http' ? 'HTTP 智能体' : d.model.trim(),
          endpoint: d.endpoint.trim().replace(/\/$/, ''),
          auth: d.auth,
          header: d.auth === 'header' ? d.header : '',
          caps: [...d.caps],
          uses: [...d.uses],
          timeout: d.timeout,
          thinking: d.protocol === 'openai' && !!d.thinking,
          vendor: (d.vendor || '').trim(),
          desc: d.kind === 'agent' ? '自有智能体接入' : '自有模型接入',
          connectStatus: d.key.trim() || C.secrets.has(id) ? 'ok' : 'pending',
        };
        if (m.accessType === 'weights') {
          Object.assign(m, {
            node: d.node.trim(),
            modelPath: d.modelPath.trim(),
            tokenizerPath: d.tokenizerPath?.trim() || d.modelPath.trim(),
            protocol: 'huggingface',
            model: d.name.trim(),
            endpoint: '',
            auth: 'none',
            hosting: 'local',
            validationStatus: 'unverified',
          });
          d.auth = 'none';
        }
        if (d.protocol === 'http' && m.accessType !== 'weights')
          Object.assign(m, {
            body: d.body,
            responsePath: d.responsePath,
            sessionPath: d.body.includes('{{session_id}}') ? d.sessionPath : '',
          });
        if (d.auth === 'none') C.secrets.delete(id);
        else if (d.key.trim()) C.secrets.set(id, d.key.trim());
        const at = C.db.findIndex((x) => x.id === id);
        if (at >= 0) C.db[at] = m;
        else C.db.push(m);
        const rt = C.returnTo,
          role = C.role;
        C.draft = null;
        document.getElementById('c-key')?.setAttribute('value', '');
        const input = document.getElementById('c-key');
        if (input) input.value = '';
        A.save();
        A.closeModal();
        if (rt === 'wizard') {
          X.wizard[role === 'target' ? 'model' : role] = id;
          X.wizardModal();
        } else {
          X.tab = 'models';
          X.selected = null;
          A.render();
        }
        A.toast('配置成功');
      },
      cancel() {
        const rt = C.returnTo;
        C.draft = null;
        const input = document.getElementById('c-key');
        if (input) {
          input.value = '';
          input.setAttribute('value', '');
        }
        A.closeModal();
        if (rt === 'wizard') X.wizardModal();
      },
    });
    const originalInit = X.init;
    X.init = function () {
      originalInit();
      C.init();
    };
    for (const [name, m] of Object.entries(methods))
      X.methodInfo[name][2] =
        `${m.gen ? '攻击生成模型' : ''}${m.process ? (m.gen ? '；' : '') + '过程裁判（默认复用 Judge）' : ''}${name === 'FigStep' ? '；辅助改写可选' : ''}${['NanoGCG'].includes(name) ? '；' + m.note : ''}` ||
        '无需辅助模型';
    Object.assign(X, {
      requirements(names, figHelper = false) {
        return {
          attacker: names.some((n) => methods[n].gen || (n === 'FigStep' && figHelper)),
          process: names.some((n) => methods[n].process),
          judge: names.length > 0,
        };
      },
      connectionKind: 'model',
      models() {
        const kind = X.connectionKind || 'model',
          items = C.db.filter((m) => (m.kind || 'model') === kind);
        return `<div class="page-heading"><div><h1>模型资产</h1></div><div class="page-actions"><button class="btn primary" onclick="App.connections.open()">${I('plus', 14)}${kind === 'model' ? '接入模型' : '接入智能体'}</button></div></div><div class="tabs connection-kind-tabs"><button class="tab ${kind === 'model' ? 'active' : ''}" onclick="App.attack.connectionKind='model';App.render()">模型</button><button class="tab ${kind === 'agent' ? 'active' : ''}" onclick="App.attack.connectionKind='agent';App.render()">智能体</button></div><div class="attack-model-grid">${
          items
            .map((m) => {
              const st = C.connState(m);
              return `<article class="card attack-model-card"><div class="attack-model-head"><span class="model-mark">${I(m.kind === 'agent' ? 'terminal' : 'box', 19)}</span><div class="attack-model-title"><strong>${E(m.name)}</strong><small>${E(m.vendor || m.model || m.endpoint || (m.kind === 'agent' ? '智能体接入' : '模型接入'))}</small></div><span class="badge ${st.tone} connection-state${st.testing ? ' testing' : ''}">${E(st.label)}</span></div>${m.kind === 'agent' ? '' : `<div class="model-access-card-meta"><div>${m.hosting === 'local' ? '私有部署模型' : '云端模型服务'} · ${E(C.identity(m).family || '自定义模型')}${C.identity(m).specification ? ' · ' + E(C.identity(m).specification) : ''}${C.identity(m).release ? ' · ' + E(C.identity(m).release) : ''}</div><div>部署版本：${E(C.identity(m).version || '未提供')}</div></div>`}<div class="attack-model-actions"><button class="model-action" title="编辑" aria-label="编辑 ${E(m.name)}" onclick="App.connections.open('${m.id}')">${I('edit', 16)}</button><button class="model-action" title="测试连接" aria-label="测试 ${E(m.name)}" onclick="App.connections.test('${m.id}')">${I('zap', 16)}</button><button class="entry-delete" title="删除" aria-label="删除 ${E(m.name)}" onclick="App.connections.remove('${m.id}')" type="button">删除</button></div></article>`;
            })
            .join('') || '<div class="empty">暂无连接，点击右上角按钮接入</div>'
        }</div>`;
      },
      config(t) {
        return `<div class="card"><div class="card-head"><h3 class="card-title">本次演练配置快照</h3>${A.badge('任务创建时锁定', 'gray')}</div><div class="card-body"><div class="kv"><span>被测对象</span><strong>${E(X.targetFor(t).name)}</strong></div><div class="kv"><span>攻击模型</span><span>${E(t.engine.attacker)}</span></div><div class="kv"><span>裁判模型</span><span>${E(t.engine.judge)}</span></div><div class="kv snapshot-scenes"><span>攻击场景</span><div class="snapshot-scene-list">${t.scenes
          .map(
            (id) =>
              `<div class="snapshot-scene-row"><span class="snapshot-scene-name">${E(X.scene(id)?.name || id)}：</span><span class="snapshot-scene-methods">${X.taskMethods(
                t,
                id,
              )
                .map((n) => E(methods[n]?.label ? methods[n].label + '（' + n + '）' : n))
                .join('、')}</span></div>`,
          )
          .join(
            '',
          )}</div></div>${t.engine.whitebox ? `<div class="kv"><span>白盒攻击配置</span><span>目标输出：${E(t.engine.whitebox.targetOutput)}<br>优化步数：${t.engine.whitebox.steps}</span></div>` : ''}${t.bankSnapshot ? `<div class="kv"><span>演练题库</span><span>${E(t.bankSnapshot.name)} · ${t.bankSnapshot.items.length} 题</span></div>` : ''}<div class="kv"><span>执行参数</span><span>每种方法 ${t.sampleCount} 个样本 · 最大 ${t.engine.maxRounds} 轮 · 并发 ${t.engine.concurrency}</span></div></div></div>`;
      },
    });
    // The process-judge picker still registers a model with the normal Judge capability.
    const openConnection = C.open.bind(C);
  })();
};
