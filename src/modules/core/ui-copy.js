/* core/ui-copy。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/ui-copy'] = function () {
  /* Shared navigation copy. Keep IDs stable; edit labels in this file. */
  (function () {
    'use strict';
    const sections = [
      ['workspace', '安全态势', 'grid'],
      ['scan', '安全扫描', 'search'],
      ['exercise', '模型演练', 'shield'],
      ['protection', '安全防护', 'shield'],
      ['policy', '策略中心', 'settings'],
      ['assets', '资产中心', 'box'],
      ['risk', '风险中心', 'alert'],
      ['management', '平台管理', 'settings'],
    ];
    const menus = {
      workspace: [],
      scan: [
        ['tasks', '扫描任务', 'search'],
        ['reports', '扫描报告', 'file'],
        ['results', '扫描结果', 'layers'],
      ],
      // 第 4 项 { hidden: true }：可路由、不在侧栏显示（演练报告从任务详情进入）。
      exercise: [
        ['tasks', '演练任务', 'shield'],
        ['results', '模型结果', 'layers'],
        ['reports', '演练报告', 'file', { hidden: true }],
      ],
      protection: [
        ['overview', '防护总览', 'shield'],
        ['review', '复核工作台', 'file'],
        ['records', '防护记录', 'file'],
        ['accounts', '账号风险', 'user'],
        ['reports', '防护报告', 'file'],
      ],
      policy: [
        ['policies', '攻击策略配置', 'layers'],
        ['defense', '防护策略配置', 'shield'],
      ],
      assets: [
        ['applications', 'AI 应用', 'layers'],
        ['models', '模型', 'box'],
        ['code', '代码', 'code'],
        ['packages', '二进制/软件包', 'box'],
        ['web', 'Web', 'link'],
      ],
      risk: [['events', '风险事件', 'alert']],
      management: [
        ['model-roles', '模型配置', 'settings'],
        ['api-traffic', 'API 与流量', 'link'],
        ['risk-management', '风险管理', 'settings'],
      ],
    };
    /* 菜单唯一定义处：各模块只注册路由（P.routes），不要在启动时增删、调换这里的菜单项。 */
    const scanTabs = [
        ['code-scan', '代码检测'],
        ['app-scan', '二进制／软件包检测'],
        ['web-scan', 'Web 检测'],
      ],
      policyTabs = [
        ['strategies', '策略配置'],
        ['methods', '攻击方法'],
        ['content', '攻击题库'],
      ];
    window.PlatformUI = { sections, menus, scanTabs, policyTabs };
  })();
};
