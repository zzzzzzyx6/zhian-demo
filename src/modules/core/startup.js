/* core/startup。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/startup'] = function () {
  (function () {
    'use strict';
    const A = App;
    A.page = 'attack';
    A.session = { user: '安全管理员', role: '安全管理员', mode: 'local-demo' };
    A.navigate = (page) => {
      if (A.platform) return A.platform.navigate(page);
    };
    A.account = function () {
      if (!A.session) return;
      A.closeDrawer();
      A.modal(
        '账号信息',
        `<div class="platform-account-profile"><span class="avatar">${A.icon('user', 22)}</span><div><h3>${A.escape(A.session.user)}</h3><p>本地账号</p></div></div><dl class="platform-account-info"><div><dt>账号角色</dt><dd>安全管理员</dd></div><div><dt>登录方式</dt><dd>本地演示</dd></div></dl>`,
        `<button class="btn" onclick="App.closeModal()">关闭</button>`,
      );
    };
    // A.start() 内部会调用 showApp() 完成首屏：按地址栏路由恢复页面，再画外壳与内容。
    A.showApp = function () {
      A.page = 'attack';
      if (A.platform) A.platform.restoreRoute();
      else history.replaceState(null, '', '#attack');
      A.render();
    };
    A.start();
  })();
};
