/* policy/method-params-unify。启动顺序见 src/boot.js。
 * 攻击方法参数的统一中文名称与用途说明；方法详情抽屉、策略介绍卡、策略中心按钮与题库行业筛选。 */
window.AppParts = window.AppParts || {};

AppParts['policy/method-params-unify'] = function () {
  (function () {
    'use strict';
    const A = window.App,
      P = A.policies,
      X = A.attack,
      B = A.banks,
      E = A.escape;
    // 参数键 → [统一中文名称, 用途]。名称以策略编辑表单（parameterSchema）为准，此处补充表单外的固定参数。
    const INFO = {
      max_iterations: ['最大优化次数', '攻击输入最多迭代改写的次数，达到后停止。'],
      population_size: ['种群数量', '每轮遗传搜索保留的候选提示词数量。'],
      max_pool_size: ['种子池容量', '种子池最多保存的种子模板数量。'],
      branching_factor: ['分支数量', '每个节点每轮扩展生成的候选数量。'],
      prune_factor: ['保留分支数量', '每轮评分后继续搜索的分支数量，不大于分支数量。'],
      pre_pruning: ['预剪枝', '提交靶标前先剔除偏离攻击目标的候选。'],
      max_iter_character: ['字符优化次数', '优化角色设定字符的最大轮数。'],
      max_iter_step: ['步骤优化次数', '优化推理步骤的最大轮数。'],
      beam_size: ['束宽', '每轮保留的最优攻击序列数量。'],
      max_turns: ['最大对话轮数', '与靶标多轮对话的最大轮数。'],
      max_rounds: ['最大对话轮数', '分解后的攻击链最多交互的轮数。'],
      warm_up_iterations: ['预热次数', '预热阶段探索初始攻击策略的轮数。'],
      lifelong_iterations: ['策略学习次数', '总结成功经验并复用到新攻击的轮数。'],
      epochs: ['迭代周期', '“攻击—总结”整体循环的次数。'],
      intent_preservation_threshold: [
        '意图保持阈值',
        '改写结果与原始意图的最低一致评分（1–5），低于则丢弃。',
      ],
      verb_sub: ['动词替换', '是否对动词做同义替换，弱化敏感表达。'],
      noun_sub: ['名词替换', '是否对名词做同义替换，弱化敏感表达。'],
      noun_wordgame: ['词义映射', '是否把敏感名词映射为无害词语再在上下文中还原。'],
      topk_sub: ['替换候选数量', '每个词保留的替换候选数量。'],
      sub_threshold: ['相似度筛选阈值', '替换词与原词语义相似度的最低要求。'],
      cipher_type: ['编码规则', '把请求转为编码表达时使用的规则。'],
      use_self_cipher: ['自定义编码', '是否由模型自行约定编码方式（平台固定）。'],
      prompt_type: ['代码封装', '风险问题嵌入的代码数据结构。'],
      target_language: ['目标语言', '请求翻译后使用的语言。'],
      use_compositional: ['组合语言模板', '是否在翻译之外叠加越狱模板。'],
      jailbreak_template: ['上游模板', '组合使用时叠加的越狱模板。'],
      technique: ['预置变体', '包装请求时使用的上游预置变体。'],
      num_demonstrations: ['示范数量', '上下文中放入的示范问答数量。'],
      flip_mode: ['翻转方式', '字符翻转或重排的方式（平台固定）。'],
      cot: ['逐步回答要求', '是否要求靶标先逐步还原请求再回答。'],
      trials_per_iteration: ['每次试验数量', '每次迭代尝试的混淆组合数量。'],
      prefill: ['回答前缀', '预填在靶标回答开头的文本。'],
      max_retries: ['最大重试次数', '未攻破时重新生成的最多次数。'],
      temperature: ['生成温度', '续写预填回答时的采样温度。'],
      max_tokens: ['最大输出 Token', '靶标单次回答的最大长度。'],
      scene_type: ['情境类型', '嵌套虚构场景的类型。'],
      num_layers: ['嵌套层数', '虚构场景的嵌套层数。'],
      num_characters: ['角色数量', '每层场景中的角色数量。'],
      max_backtracks: ['最大回退次数', '靶标拒答时允许回退重试的次数。'],
      escalation_temperature: ['攻击生成温度', '攻击生成模型的采样温度。'],
      num_steps: ['步骤数量', '图片中渲染的步骤条目数（平台固定）。'],
    };
    // 跟随裁判攻破阈值，不作为方法参数展示。
    const HIDDEN = new Set(['system_prompt', 'success_threshold', 'break_score']);
    P.paramInfo = INFO;
    P.paramLabel = (id, key) =>
      (P.parameterSchema?.(id) || []).find((f) => f.key === key)?.label || INFO[key]?.[0] || key;
    P.paramValue = (id, key, v) => {
      const f = (P.parameterSchema?.(id) || []).find((x) => x.key === key);
      if (f?.type === 'select') return f.options.find((o) => o.value === v)?.label ?? String(v);
      if (typeof v === 'boolean') return v ? '开启' : '关闭';
      return v === '' || v == null ? '方法默认' : String(v);
    };
    // 「参数名：值」列表，全平台复用。
    P.paramPairs = (id, params) =>
      Object.entries(params || {})
        .filter(([k, v]) => v !== '' && !HIDDEN.has(k))
        .map(([k, v]) => [P.paramLabel(id, k), P.paramValue(id, k, v)]);

    /* ---------- 方法详情抽屉 ---------- */
    const deps = (m) =>
      [
        m.generator || m.gen ? '攻击生成模型' : '',
        m.process ? '过程裁判' : '',
        m.id === 'DrAttack' ? '向量模型' : '',
        m.id === 'NanoGCG' ? '本地可求梯度靶标' : '',
        m.id === 'FigStep' ? '靶标需支持图片理解' : '',
      ].filter(Boolean);
    P.methodDeps = deps;
    const baseDetail = P.methodDetail;
    P.methodDetail = function (id) {
      const m = P.method(id);
      if (!m) return baseDetail.apply(this, arguments);
      const desc = m.description || m.label || '';
      const values = P.defaults(id),
        schema = P.parameterSchema(id),
        keys = [
          ...schema.map((f) => f.key),
          ...Object.keys(values).filter((k) => !schema.some((f) => f.key === k)),
        ].filter((k) => !HIDDEN.has(k));
      const rows = keys
        .map((k) => {
          const editable = schema.some((f) => f.key === k);
          return `<tr><td>${E(P.paramLabel(id, k))}</td><td>${E(P.paramValue(id, k, values[k] ?? schema.find((f) => f.key === k)?.value))}${editable ? '' : '<small class="mpu-fixed">固定</small>'}</td><td>${E(INFO[k]?.[1] || '—')}</td></tr>`;
        })
        .join('');
      const d = deps(m);
      A.drawer(
        m.name,
        `<div class="r24-method"><h3>攻击逻辑</h3><p>${E(desc)}</p><h3>执行流程</h3><ol><li>读取题库原始问题和攻击策略参数</li><li>${E(m.flow || desc || '按已配置模板构造攻击输入')}</li><li>向靶标提交输入，由结果裁判记录攻破或防守结论</li></ol><h3>依赖模型与角色</h3>${d.length ? `<ul>${d.map((x) => `<li>${E(x)}</li>`).join('')}</ul>` : '<p>无</p>'}<h3>参数</h3>${
          m.kind === 'template'
            ? `<pre class="oj-preview">${E(m.template || '')}</pre>`
            : rows
              ? `<div class="table-wrap"><table class="mpu-params"><thead><tr><th>参数名称</th><th>默认值（可调整）</th><th>参数用途</th></tr></thead><tbody>${rows}</tbody></table></div>`
              : '<p>无</p>'
        }</div>`,
        '<button class="btn" onclick="App.closeDrawer()">关闭</button>',
      );
    };
    /* ---------- 策略介绍卡：每个攻击方法内部分「基本参数」「辅助模型」 ---------- */
    const roleText = (r) => r?.name || r?.model || '';
    P.summary = function (s) {
      const roles = s.executionRoles || {};
      const methods = (s.methods || [])
        .map((m) => {
          const pairs = P.paramPairs(m.id, m.parameters),
            slots = X.methodSlots?.(m) || [],
            aux = slots.map((slot) => [
              slot.label,
              roleText(m.methodRoles?.[slot.key]) || roleText(roles[slot.key]) || '未配置',
            ]),
            line = (label, list) =>
              `<div class="mpu-row"><span class="mpu-key">${label}</span><span>${list.length ? list.map(([k, v]) => `${E(k)}：${E(v)}`).join(' · ') : '无'}</span></div>`;
          return `<div class="mpu-method"><strong>${E(m.name || P.method(m.id)?.name || m.id)}</strong>${line('基本参数', pairs)}${line('辅助模型', aux)}</div>`;
        })
        .join('');
      return `<div class="policy-summary"><section class="policy-detail-section"><h3>攻击题库</h3><p>${E(s.bankSnapshot?.name || '原任务快照')}</p></section><section class="policy-detail-section"><h3>攻击方法</h3><div class="mpu-methods">${methods}</div></section></div>`;
    };

    /* ---------- 题库：行业筛选 ---------- */
    B.catalog.industry ||= 'all';
    const rowsBase = B.catalogRows;
    B.catalogRows = () =>
      rowsBase().filter(
        (b) => B.catalog.industry === 'all' || B.industryLabel(b.industry) === B.catalog.industry,
      );
    B.filterIndustry = function (value) {
      B.catalog.industry = value;
      A.render();
    };

  })();
};
