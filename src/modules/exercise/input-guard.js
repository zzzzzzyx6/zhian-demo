/* exercise/input-guard。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/input-guard'] = function () {
  /* Shared Qwen3Guard asset and task-selected moderation stages. */
  (function () {
    'use strict';
    const A = window.App,
      C = A.connections,
      X = A.attack,
      guardId = 'system-qwen3guard';
    X.ensureInputGuard = function () {
      let m = C.db.find((m) => m.id === guardId);
      if (!m) {
        m = {
          id: guardId,
          kind: 'model',
          systemGuard: true,
          name: 'Qwen3Guard · Gen-4B',
          model: 'Qwen/Qwen3Guard-Gen-4B',
          comparisonGroup: 'Qwen3Guard',
          versionLabel: 'Gen-4B',
          hosting: 'local',
          schema: 3,
          accessType: 'api',
          protocol: 'openai',
          sample: false,
          caps: ['text', 'chat'],
          uses: ['guard'],
          timeout: 60,
        };
        C.db.push(m);
      }
      if (!X.db.inputGuardDefaultVersion) {
        if (!m.endpoint)
          Object.assign(m, {
            endpoint: 'https://guard.demo.invalid/v1',
            auth: 'none',
            connectStatus: 'ok',
            presetPending: false,
            demoConfigured: true,
            simulated: true,
          });
        X.db.inputGuardDefaultVersion = 1;
      }
    };
    const init = A.modules.attack.init;
    A.modules.attack.init = function () {
      init();
      X.ensureInputGuard();
    };
    const state = C.connState;
    X.isInputGuard = (t) =>
      t?.defense?.systemGuard === 'qwen3guard' &&
      t.defense.modelInput === true &&
      t.defense.modelOutput === false;
    X.guardFlow = function (t) {
      const d = t?.defense,
        enabled = d?.systemGuard === 'qwen3guard';
      return { enabled, input: enabled && !!d.modelInput, output: enabled && !!d.modelOutput };
    };
    X.guardStages = function (t) {
      const g = X.guardFlow(t);
      return g.enabled
        ? [
            ['攻击生成', 0],
            ...(g.input ? [['输入护栏', 1]] : []),
            ['靶标响应', 2],
            ...(g.output ? [['输出护栏', 3]] : []),
            ['裁判判定', 4],
          ]
        : [
            ['攻击生成', 0],
            ['输入防守', 1],
            ['靶标响应', 2],
            ['输出防守', 3],
            ['裁判判定', 4],
          ];
    };
    // Include the saved execution positions wherever users compare or export results.
    const report = X.report;
    const reportHTML = X.reportHTML;
  })();
};
