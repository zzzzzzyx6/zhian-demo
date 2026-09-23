// Small shared demo utilities, independent of the three business modules.
App.resetDemo = App.confirmResetDemo = function () {
  try {
    localStorage.removeItem('zhian-standalone-attack');
    sessionStorage.removeItem('zhian-session-attack');
  } catch (e) {
    App.toast('浏览器不允许清理本地存储，请重新打开页面');
    return;
  }
  location.hash = 'attack';
  location.reload();
};
