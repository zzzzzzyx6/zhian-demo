/* 安全态势：dashboard-cases。执行顺序由 src/boot.js 维护。 */
window.AppParts = window.AppParts || {};

// ─── dashboard-cases ───────────────────────────────────────────────────────
AppParts['dashboard/dashboard-cases'] = function () {
  /* Versioned offline walkthroughs for the dashboard: one failed scan. 防护复核案例由 guard 种子数据提供。 */
  (function () {
    'use strict';
    const A = window.App,
      copy = (v) => JSON.parse(JSON.stringify(v));
    const D = (A.dashboardCases = { version: 1, caseSet: 'scene-workbench-v1' });
    D.ensure = function () {
      if (A.data.dashboardCasesVersion >= D.version) return false;
      const scan = A.scanProduct.tasks()[0];
      if (scan && !A.scanProduct.db.tasks.some((t) => t.id === 'SCAN-261019-ERROR')) {
        const error =
          '模型分析服务请求超时（60 秒），自动重试 2 次后停止。请检查扫描模型连接与服务响应，再发起评估。';
        A.scanProduct.db.tasks.push({
          id: 'SCAN-261019-ERROR',
          name: 'OpenRT 代码增量扫描',
          type: scan.type,
          evaluationType: 'scan',
          targetId: scan.targetId,
          targetName: scan.targetName,
          targetSnapshot: copy(scan.targetSnapshot),
          targetMaterial: copy(scan.targetMaterial),
          created: '2026-10-19 09:10:00',
          finishedAt: '2026-10-19T01:13:00.000Z',
          status: 'error',
          completedSteps: 2,
          resultSaved: false,
          resultSource: 'offline-case',
          simulated: true,
          example: true,
          caseSet: D.caseSet,
          findings: [],
          candidateCount: 0,
          config: copy(scan.config),
          error,
          stageHistory: [
            {
              label: '目标准备',
              result: 'done',
              message: '扫描制品已读取',
              time: '2026-10-19 09:10:10',
            },
            {
              label: '执行环境',
              result: 'done',
              message: '分析环境已就绪',
              time: '2026-10-19 09:10:20',
            },
            { label: '模型分析', result: 'error', message: error, time: '2026-10-19 09:13:00' },
          ],
          backendAligned: 1,
        });
      }
      A.data.dashboardCasesVersion = D.version;
      A.save();
      return true;
    };
    const start = A.start;
    A.start = function () {
      const r = start.apply(A, arguments);
      if (D.ensure()) A.render();
      return r;
    };
  })();
};
