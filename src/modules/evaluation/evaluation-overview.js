/* evaluation/evaluation-overview。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['evaluation/evaluation-overview'] = function () {
  /* Shared result helpers for the dashboard, and the new-assessment chooser. */
  (function () {
    'use strict';
    const A = window.App,
      V = A.evaluation,
      Q = A.assessment;
    const arr = (v) => (Array.isArray(v) ? v : []),
      stamp = (v) => Date.parse(v || '') || 0,
      ended = (t) => stamp(t.finishedAt || t.finished || t.created),
      created = (t) => stamp(t.created);
    const D = (A.evaluationOverview = {});
    const scanTypes = {
      'code-scan': '代码检测',
      'app-scan': '二进制 / 软件包',
      'web-scan': 'Web 检测',
    };
    D.confirmed = (t) =>
      arr(t.findings).filter(
        (f) =>
          f.confirmed !== false &&
          f.verified !== false &&
          ![
            'candidate',
            'pending',
            'failed',
            'error',
            'unknown',
            'unverified',
            'false-positive',
            'false_positive',
            'dismissed',
            'rejected',
          ].includes(f.verificationStatus || f.status) &&
          (f.confirmed === true ||
            f.verified === true ||
            ['confirmed', 'verified'].includes(f.verificationStatus || f.status)),
      );
    D.latest = function (tasks) {
      const map = new Map();
      for (const t of tasks.slice().sort((a, b) => ended(b) - ended(a) || created(b) - created(a)))
        if (!map.has(Q.objectKey(t))) map.set(Q.objectKey(t), t);
      return [...map.values()];
    };
    V.newTask = function () {
      A.modal(
        '新建评估任务',
        `<div class="ev-task-groups"><section><span class="ev-product-tag">漏洞检测</span><h3>检查系统与软件的安全问题</h3><p>选择检测对象，进入对应的材料与模型配置。</p><div class="ev-scan-choices">${Object.entries(
          scanTypes,
        )
          .map(
            ([id, name]) =>
              `<button data-type="${id}" onclick="App.assessment.startTask(this.dataset.type)"><strong>${name}</strong><span>${id === 'code-scan' ? '代码文件或项目' : id === 'app-scan' ? '可执行文件、库或软件包' : '网站地址与检测范围'}</span><b>创建任务 →</b></button>`,
          )
          .join(
            '',
          )}</div></section><section><span class="ev-product-tag">模型演练</span><h3>评估模型的抗攻击能力</h3><p>选择靶标、攻击策略与裁判，保留完整攻击过程和判定依据。</p><button class="btn primary" onclick="App.assessment.startTask('attack')">新建演练任务 →</button><div class="ev-create-flow">靶标模型 → 攻击策略 → 执行与判定 → 结果报告</div></section></div>`,
        '<button class="btn" onclick="App.closeModal()">取消</button>',
        { wide: true },
      );
    };
  })();
};
