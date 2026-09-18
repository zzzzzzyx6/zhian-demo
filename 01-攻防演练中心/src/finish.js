// Small shared demo utilities, independent of the three business modules.
App.resetDemo = function () {
  App.modal('恢复初始演示数据', '<p>清除当前浏览器中新增的演示任务、对象、治理样本和规则版本，重新载入初始样例</p><p class="hint">只影响这个 Demo 的本地数据，不会修改项目文件</p>', '<button class="btn" onclick="App.closeModal()">保留当前数据</button><button class="btn danger" onclick="App.confirmResetDemo()">恢复初始样例</button>');
};
App.confirmResetDemo = function () {
  try { localStorage.removeItem('zhian-standalone-attack'); location.hash = 'workspace'; location.reload(); }
  catch (e) { App.toast('浏览器不允许清理本地存储，请重新打开页面'); }
};
