/* assets/lean-operations。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['assets/lean-operations'] = function () {
  /* 演练蓝队的护栏可用性、攻击策略可用性、风险规则筛选。安全防护本身在 guard/。 */
  (function () {
    'use strict';
    const A = window.App,
      R = A.platformGovernance;
    const L = (A.leanOperations = {});
    /* 平台内置检测服务是否可用（服务登记在 guard，演练蓝队复用同一服务） */
    const textService = () => A.data.guardServices?.text;
    L.serviceReady = (s) => !!s && ['ready', 'configured', 'verified'].includes(s.status);
    const validateBlue = A.attack.validateBlue;
    A.attack.guardReady = () => L.serviceReady(textService());
    A.attack.guardConnectionHint = '平台内置 Qwen3Guard 检测服务暂不可用。';
    A.attack.validateBlue = function (w) {
      if (w.defenseMode === 'qwen3guard' && !L.serviceReady(textService()))
        return A.attack.guardConnectionHint;
      return validateBlue.call(A.attack, w);
    };
    const sourceRecords = R.sourceRecords;
    R.sourceRecords = function (source, metric) {
      return sourceRecords.call(R, source, metric).filter((r) => {
        if (source !== 'attack') return true;
        const t = A.attack.db.tasks.find((t) => t.id === r.taskId);
        return !(
          t?.simulation ||
          t?.simulated ||
          t?.resultSource === 'simulation' ||
          t?.runSnapshot?.simulated ||
          t?.executionSnapshot?.simulated
        );
      });
    };

    const AP = A.policies;
    L.attackPolicyIssue = function (policy) {
      const v = policy?.revisions?.at(-1) || policy;
      if (!v?.version) return '未发布';
      return A.openrtJudge?.validate(AP.judgementFor(v)) || '';
    };

    L.clearRiskScope = function () {
      R.showEvents({ domain: R.filter.domain, query: R.filter.query });
    };
    R.ruleFilter ||= { domain: '', query: '' };
    R.filterRules = function (key, value) {
      if (!['domain', 'query'].includes(key)) return;
      R.ruleFilter[key] = value;
      A.render();
    };
  })();
};
