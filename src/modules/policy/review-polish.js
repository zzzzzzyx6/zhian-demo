/* policy/review-polish。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['policy/review-polish'] = function () {
  /* 评估报告删除（只删报告，保留任务记录），以及同一地址重复点击时直接重绘。 */
  (function () {
    'use strict';
    const A = window.App,
      P = A.platform,
      E = A.escape,
      V = A.evaluation;
    const W = (A.reviewPolish = {});

    W.reportDeleted = (t) =>
      !!A.data.deletedEvaluationReports?.[(V.type(t) || 'attack') + ':' + t.id];
    const reports = V.reports;
    V.reports = function () {
      return reports.apply(V, arguments).filter((t) => !W.reportDeleted(t));
    };
    W.deleteReport = function (kind, id, confirmed = false) {
      const report = V.allTasks().find((t) => t.id === id);
      if (!report) return false;
      if (!confirmed) {
        A.modal(
          '删除报告',
          `<p>确定删除「${E(report.name || report.id)}」？</p><p class="hint">只删除报告，原有任务、检测记录和风险证据继续保留。</p>`,
          `<button type="button" class="btn" onclick="App.closeModal()">取消</button><button type="button" class="entry-delete" title="确认删除" aria-label="确认删除报告" data-id="${E(id)}" onclick="App.reviewPolish.deleteReport('${kind}',this.dataset.id,true)">删除</button>`,
          { plain: true },
        );
        return true;
      }
      (A.data.deletedEvaluationReports ||= {})[(V.type(report) || 'attack') + ':' + report.id] =
        new Date().toISOString();
      A.guard.audit('report.delete', id, '删除评估报告');
      A.save();
      A.closeModal();
      A.render();
      A.toast('报告已删除');
      return true;
    };
    W.removeEvaluation = (id) => W.deleteReport('evaluation', id);
    const openReport = V.openReport;
    V.openReport = function (id) {
      const t = V.allTasks().find((t) => t.id === id);
      if (t && W.reportDeleted(t)) {
        A.toast('该报告已删除，任务记录仍可查看');
        return false;
      }
      return openReport.apply(V, arguments);
    };
    const attackReport = V.reportDetailHTML;
    V.reportDetailHTML = function (t) {
      return t && W.reportDeleted(t)
        ? A.heading('', '报告已删除', '可从任务管理查看原任务记录。')
        : attackReport.apply(V, arguments);
    };
    const scanReport = A.scanProduct.reportHTML;
    A.scanProduct.reportHTML = function (id) {
      const t = A.scanProduct.tasks().find((t) => t.id === id);
      return t && W.reportDeleted(t)
        ? A.heading('', '报告已删除', '可从检测任务查看原任务记录。')
        : scanReport.apply(this, arguments);
    };
    const evaluationExport = V.exportTaskReport;
    V.exportTaskReport = function (id) {
      const t = V.allTasks().find((t) => t.id === id);
      return t && W.reportDeleted(t) ? false : evaluationExport.apply(V, arguments);
    };
    const scanExport = A.scanProduct.exportReport;
    A.scanProduct.exportReport = function (id) {
      const t = A.scanProduct.tasks().find((t) => t.id === id);
      return t && W.reportDeleted(t) ? false : scanExport.apply(this, arguments);
    };

  })();
};
