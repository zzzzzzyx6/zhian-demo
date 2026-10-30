/* exercise/task-design-refinement。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/task-design-refinement'] = function () {
  /* Focused task creation: target identity, OpenRT black-box techniques, multi-bank selection. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      E = A.escape,
      M = X.methodDependencies;
    const techniqueGroups = [
      {
        id: 'baseline',
        name: '基线测试',
        official: false,
        desc: '不改写题库输入，用于衡量靶标原生安全能力。',
        methods: [
          {
            id: 'Direct',
            desc: '将题库问题原样发送给靶标，作为其他攻击方法的对照基线。',
            mode: '单轮 · 无需攻击模型',
          },
        ],
      },
      {
        id: 'llm-refinement',
        name: '黑盒：LLM 驱动优化',
        official: true,
        desc: '由攻击模型根据靶标反馈持续改写输入，逐轮寻找可突破的表达。',
        methods: [
          {
            id: 'PAIR',
            desc: '依据上一轮靶标回应迭代改写攻击输入。',
            mode: '多轮 · 攻击模型 + 裁判',
          },
          {
            id: 'ReNeLLM',
            desc: '改写原始请求并嵌入情境，根据判定结果继续优化。',
            mode: '迭代 · 攻击模型 + 裁判',
          },
          {
            id: 'DrAttack',
            desc: '分解目标请求，重组子问题并搜索替代表达。',
            mode: '单轮 · 攻击模型 + 向量模型',
          },
          {
            id: 'AutoDAN-Turbo',
            desc: '从测试反馈中提炼策略，再复用策略生成新输入。',
            mode: '迭代 · 攻击模型 + 裁判',
          },
        ],
      },
      {
        id: 'linguistic',
        name: '黑盒：语言与编码',
        official: true,
        desc: '利用编码或语言结构变换测试安全识别在表达变化下是否稳定。',
        methods: [
          {
            id: 'CipherChat',
            desc: '使用预设编码规则和示例包装原始问题，再交由靶标理解并回答。',
            mode: '单轮 · 本地模板',
          },
          {
            id: 'FlipAttack',
            desc: '对关键文本进行字符重排，测试靶标能否识别被变形的风险意图。',
            mode: '单轮 · 本地变换',
          },
        ],
      },
      {
        id: 'contextual',
        name: '黑盒：上下文欺骗',
        official: true,
        desc: '构造虚构情境或角色层级，让风险请求隐藏在看似合理的上下文中。',
        methods: [
          {
            id: 'DeepInception',
            desc: '通过多层虚构场景与角色嵌套测试安全边界。',
            mode: '单轮 · 本地模板',
          },
          {
            id: 'Crescendo',
            desc: '从一般话题开始，结合对话回应逐步推进请求。',
            mode: '多轮 · 攻击模型 + 裁判',
          },
          {
            id: 'CoA',
            desc: '生成分步攻击链，根据每步结果调整推进方向。',
            mode: '多轮 · 攻击模型 + 裁判',
          },
        ],
      },
    ];
    X.openRTTechniqueGroups = techniqueGroups;

    X.blueEvidenceHTML = (d) =>
      `<div class="kv"><span>蓝队防守</span><strong>${E(X.blueLabel(d))}</strong></div>${d?.mode === 'prompt' ? `<div class="kv"><span>安全系统指令</span><span>${E(d.prompt || '未记录')}</span></div>` : ''}${d?.mode === 'rules' ? `<div class="kv"><span>护栏位置</span><span>${d.rules?.input ? '输入 ' : ''}${d.rules?.output ? '输出' : ''}</span></div><div class="kv"><span>策略说明</span><span>${E(d.policy || '未记录')}</span></div>` : ''}`;

    const previousCompact = X.compactConfigHTML;
    X.compactConfigHTML = function (t) {
      const target = X.targetFor(t),
        meta = t.targetMeta,
        methods = [...new Set(t.units.map((u) => M[u.method]?.label || u.method))];
      const d = t.defense || {},
        input = d.guardType === 'rules' ? d.rules?.input : d.modelInput,
        output = d.guardType === 'rules' ? d.rules?.output : d.modelOutput;
      const position = [input !== false ? '输入' : '', output !== false ? '输出' : '']
        .filter(Boolean)
        .join(' / ');
      return `<section class="task-config-strip"><div><span>靶标</span><strong>${E(target.name)}</strong></div><div><span>红队</span><strong>${E(t.engine?.roles?.attacker?.name || t.engine?.attacker || '本地模板 / 变换')}</strong><small>${methods.slice(0, 2).map(E).join('、')}${methods.length > 2 ? ` 等 ${methods.length} 种` : ''}</small></div><div><span>蓝队</span><strong>${E(X.blueLabel(t.defense))}</strong><small>${d.mode === 'guard' ? position + '安全检测' : d.mode === 'prompt' ? '系统指令约束' : '靶标原生安全能力'}</small></div><div><span>裁判</span><strong>${E(t.engine?.roles?.judge?.name || t.engine?.judge || '--')}</strong></div></section>`;
    };
    const previousReport = X.report;
    const previousUnitContent = X.unitContent;
    X.unitContent = function (t, u) {
      const content = previousUnitContent(t, u);
      return {
        ...content,
        verdict: String(content.verdict || '')
          .replaceAll('裁判确认', '裁判确认')
          .replaceAll('有效判定', '有效判定'),
      };
    };
  })();
};
