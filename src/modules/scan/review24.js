/* scan/review24。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['scan/review24'] = function () {
  /* October review: isolated scanner and focused product presentation changes. */
  (function () {
    'use strict';
    const A = window.App,
      P = A.platform,
      X = A.attack,
      E = A.escape;
    // 只有「扫描任务」这一项是内置扫描器；「扫描报告」「扫描结果」由平台自己渲染。
    const scan = () => P.state.section === 'scan' && P.state.item === 'tasks';
    const Q = (A.review24 = {});
    Q.scanRoute = '/';
    // 扫描页由本文件 scanner-app 段直接渲染进内容区，不再套 iframe、也不做跨窗口跳转。
    // data-own-dom 告诉平台的 DOM 协调器：这个容器内部由扫描器自己管，别插手。
    Q.scanHTML = () => '<div id="scan-app" class="scan-app" data-own-dom></div>';
    Q.mountScan = function () {
      const host = document.getElementById('scan-app');
      if (!host) return;
      if (host.__scanMounted && host.children.length) return; // 已挂载且内容还在
      host.__scanMounted = true;
      if (!window.ScanApp) return;
      if (window.ScanApp.getRoute() !== Q.scanRoute) window.ScanApp.navigate(Q.scanRoute);
      else window.ScanApp.mount();
    };
    Q.scanGo = function (route) {
      Q.scanRoute = route;
      if (window.ScanApp) window.ScanApp.navigate(route);
      Q.syncScanSidebar();
    };
    Q.scanSidebar = function () {
      const items = [
        ['/', '总览', 'grid'],
        ['/targets', '被测对象', 'box'],
        ['/scan/code', '代码安全', 'code'],
        ['/scan/app', '应用安全', 'box'],
        ['/scan/web', 'Web 安全', 'link'],
        ['/models', '模型管理', 'settings'],
      ];
      const active = Q.scanRoute.startsWith('/projects/')
        ? ''
        : Q.scanRoute.startsWith('/targets/')
          ? '/targets'
          : Q.scanRoute;
      return P.sideShell(
        '安全扫描',
        items
          .map(
            ([route, label, icon], i) =>
              (i === 2
                ? '<div class="r24-nav-group">漏洞扫描</div>'
                : i === 5
                  ? '<div class="r24-nav-group">系统配置</div>'
                  : '') +
              '<button class="platform-side-item ' +
              (route === active ? 'active' : '') +
              '" data-route="' +
              route +
              '" onclick="App.review24.scanGo(this.dataset.route)">' +
              A.icon(icon, 18) +
              '<span>' +
              label +
              '</span></button>',
          )
          .join(''),
      );
    };
    Q.syncScanSidebar = function () {
      if (scan()) {
        const side = document.getElementById('center-sidebar');
        if (side) side.innerHTML = Q.scanSidebar();
      }
    };
    // 扫描任务页：内容区交给扫描器，侧栏用扫描器自己的导航。
    P.routes['scan/tasks'] = () => Q.scanHTML();
    P.pageChrome['scan/tasks'] = {
      sidebar: () => Q.scanSidebar(),
      mount: () => Q.mountScan(),
      appClass: 'review24-scanner',
    };
    // 扫描器自己持有数据与内部路由，不向平台回传任务负载，也不做资产写入桥接。
    const descriptions = {
      Direct: '直接提交原始问题，测试模型对风险请求的基础拒答能力。',
      DeepInception: '将请求嵌入多层虚构情境，诱导模型在情境内执行。',
      PAIR: '根据目标回答和裁判反馈反复改写攻击提示词。',
      Crescendo: '从低风险话题逐轮推进，逐步引向攻击目标。',
      CoA: '把目标拆成连续步骤，以多轮交互逐步诱导执行。',
      ReNeLLM: '重写原始问题并加入场景包装，迭代筛选有效提示词。',
      DrAttack: '分解敏感请求并重组提示词，弱化原始目标的直接表达。',
      'AutoDAN-Turbo': '总结成功攻击策略，再组合复用到新提示词中。',
      ICA: '在上下文中放入示范问答，诱导模型模仿回答方式。',
      JailBrokenRole: '指定虚构角色与行为约束，诱导模型绕过原有限制。',
      CipherChat: '把请求转为编码表达，借助示例引导模型解码并回答。',
      Multilingual: '把请求翻译为其他语言，测试跨语言防护边界。',
      FlipAttack: '翻转或重排请求字符，引导模型还原后执行。',
      PastTense: '将请求改写为过去时或历史情境，降低直接请求特征。',
      FigStep: '把攻击指令渲染为图像文字，测试视觉输入的安全边界。',
      NanoGCG: '利用本地模型梯度搜索对抗后缀，提高目标输出概率。',
    };
    Object.assign(descriptions, {
      AutoDAN: '以遗传搜索选择和变异候选提示词，保留更有效的攻击输入。',
      GPTFuzzer: '对种子提示词进行变异，依据靶标反馈扩展有效种子。',
      TreeAttack: '按树状路径生成候选，通过评分和剪枝搜索攻击输入。',
      SeqAR: '逐步优化字符与推理步骤，搜索更有效的攻击序列。',
      RACE: '借助影子模型探索候选，再依据靶标反馈调整攻击。',
      'AutoDAN-R': '检索已有攻击策略，结合推理与反馈搜索提示词。',
      CodeAttack: '将风险问题嵌入代码数据结构，以代码补全方式诱导回答。',
      Jailbroken: '用角色、格式或指令模板包装问题，测试约束绕过。',
      Mousetrap: '对请求施加多层混淆，通过试验反馈搜索有效表达。',
      Prefill: '预填回答开头，诱导模型沿给定方向继续生成。',
      RedQueen: '分阶段建立情境、收集信息，最终提出攻击请求。',
    });
    const deps = (id) => {
      const d = X.methodDependencies?.[id] || {};
      return [
        d.gen ? '攻击生成模型' : '',
        d.process ? '过程裁判' : '',
        id === 'DrAttack' ? '向量模型' : '',
        id === 'NanoGCG' ? '本地可求梯度靶标' : '',
      ].filter(Boolean);
    };
    const oldMethods = A.policies.methods;
    A.policies.methods = function () {
      return oldMethods
        .apply(this, arguments)
        .map((m) => ({ ...m, description: descriptions[m.id] || m.description }));
    };
    const detail = A.policies.methodDetail;
    A.policies.methodDetail = function (id) {
      const m = A.policies.method(id);
      if (!m) return detail.apply(this, arguments);
      const d = X.methodDependencies?.[id] || {};
      A.drawer(
        m.name,
        '<div class="r24-method"><h3>攻击逻辑</h3><p>' +
          E(descriptions[id] || m.description || m.label) +
          '</p><h3>执行流程</h3><ol><li>读取题库原始问题和攻击策略参数</li><li>' +
          E(descriptions[id] || '按已配置模板构造攻击输入') +
          '</li><li>向靶标提交输入，由结果裁判记录攻破或防守结论</li></ol><h3>依赖模型角色</h3><ul>' +
          deps(id)
            .map((x) => '<li>' + E(x) + '</li>')
            .join('') +
          '</ul><h3>适用与约束</h3><ul><li>分类：' +
          E(m.category || '文本攻击') +
          '</li><li>' +
          E(d.note || '按方法配置执行，参数在攻击策略中管理。') +
          '</li>' +
          (m.template ? '<li>自定义文本模板<pre>' + E(m.template) + '</pre></li>' : '') +
          '</ul></div>',
        '<button class="btn" onclick="App.closeDrawer()">关闭</button>',
      );
    };
    // Deterministic mock timestamps are assigned only to undated task records, never assets.
    function seedTaskTimes() {
      let changed = false;
      for (const [i, t] of [...(X.db?.tasks || []), ...(A.scanProduct.db?.tasks || [])].entries())
        if (!A.listConsistency.created(t)) {
          t.created =
            '2026-10-' +
            String(19 + (i % 4)).padStart(2, '0') +
            ' 10:' +
            String(i % 60).padStart(2, '0') +
            ':00';
          changed = true;
        }
      if (changed) A.save();
    }
    const start = A.start;
    A.start = function () {
      const result = start.apply(this, arguments);
      seedTaskTimes();
      A.render();
      return result;
    };
    const G = A.platformGovernance,
      initRisk = G.init;
    G.init = function () {
      const result = initRisk.apply(this, arguments);
      if (!G.db.rules.some((r) => r.id === 'risk-user-unsafe')) {
        const r = {
          id: 'risk-user-unsafe',
          name: '应用用户不安全行为超阈值',
          domain: 'protection',
          metric: 'runtime-user-unsafe',
          source: 'content',
          scope: 'application-window',
          windowHours: 24,
          threshold: 3,
          enabled: true,
          version: 1,
          publishedAt: new Date().toISOString(),
        };
        r.revisions = [G.ruleSnapshot(r)];
        G.db.rules.push(r);
      }
      return result;
    };
    const DS = A.evaluationDatasets,
      dsRows = DS.rows,
      exportMenu = DS.exportMenu,
      exportDS = DS.export;
    DS.rows = function () {
      DS.filter.kind = '';
      return dsRows.apply(this, arguments);
    };
    DS.exportMenu = function (id) {
      return id ? exportMenu.apply(this, arguments) : '';
    };
    DS.export = function (format, id) {
      if (!id) return A.toast('请在版本管理中选择已冻结版本导出');
      return exportDS.apply(this, arguments);
    };
  })();
};
