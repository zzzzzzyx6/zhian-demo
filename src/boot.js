/* 启动顺序：按下列顺序执行各模块登记的代码段。
 * 后面的代码段可能会覆盖前面同名函数，调整顺序前请确认依赖。新增代码段：在模块文件中登记，再把名称加到这里。 */
(function () {
  const order = [
    'core/core',
    'core/storage-codec',
    'exercise/attack',
    'exercise/attack-setup',
    'exercise/banks',
    'exercise/attack-arena',
    'exercise/blue-strategy',
    'exercise/attack-ia',
    'exercise/bank-builder',
    'core/platform-render',
    'exercise/experience-refinement',
    'exercise/task-design-refinement',
    'exercise/workflow-coordination',
    'exercise/scene-tags',
    'exercise/report-insights',
    'exercise/model-access-guard',
    'exercise/model-series',
    'exercise/input-guard',
    'exercise/asset-navigation',
    'policy/attack-method-catalogue',
    'policy/attack-policies',
    'policy/strategy-workspace',
    'evaluation/task-report-templates',
    'scan/scan-product',
    'evaluation/evaluation-center',
    'evaluation/evaluation-records',
    'policy/model-role-management',
    'assets/platform-governance',
    'core/ui-copy',
    'core/platform-shell',
    'core/data-display',
    'dashboard/platform-overview',
    'scan/asset-intake',
    'evaluation/assessment-integration',
    'assets/application-assets',
    'assets/lean-data',
    'assets/lean-assets',
    'assets/lean-operations',
    'assets/lean-platform',
    'assets/risk-demo',
    'assets/model-intake-refinement',
    'core/platform-notifications',
    'policy/policy-usability',
    'core/entry-management',
    'policy/model-capabilities',
    'policy/openrt-judge',
    'policy/openrt-methods',
    'policy/policy-selection',
    'evaluation/report-layout',
    'evaluation/report-eligibility',
    'assets/risk-classification',
    'evaluation/evaluation-overview',
    'core/structured-lists',
    'dashboard/dashboard-cases',
    'dashboard/dashboard-workbench',
    'core/interaction-stability',
    'policy/review-polish',
    'evaluation/report-api-refinement',
    'exercise/demo-presentation',
    'evaluation/october-refinement',
    'evaluation/evaluation-datasets',
    'core/list-presentation',
    'core/list-consistency',
    'exercise/range-integration',
    'exercise/exercise-fixtures',
    'assets/risk-tags',
    'dashboard/dashboard-b',
    'exercise/task-review-refinement',
    'scan/review24',
    'scan/scanner-app',
    'exercise/exercise-product-refinement',
    'exercise/exercise-results',
    'policy/method-params-unify',
    'guard/guard',
    'guard/guard-policy-views',
    'guard/guard-ops-views',
    'core/finish',
    'core/startup',
  ];
  for (const name of order) {
    const part = window.AppParts[name];
    if (!part) {
      console.error('未找到代码段：' + name);
      continue;
    }
    // 与原先每个文件单独加载一致：某段出错时报告错误并继续执行后续代码段
    try {
      part();
    } catch (error) {
      window.reportError ? window.reportError(error) : console.error(error);
    }
  }
})();
