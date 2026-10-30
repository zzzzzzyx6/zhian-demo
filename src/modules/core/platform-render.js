/* core/platform-render。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/platform-render'] = function () {
  (function () {
    'use strict';
    const A = window.App;
    const render = A.render;
    A.render = function () {
      render();
      if (A.session && A.platform) A.platform.renderChrome();
    };
  })();
};
