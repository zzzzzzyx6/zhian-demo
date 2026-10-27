const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const util = require('util');
const ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(ROOT, 'index.html');
const vc = new VirtualConsole();
const errs = [];
vc.on('jsdomError', (e) => errs.push((e.detail && e.detail.message) || e.message));
const store = new Map();
const ok = (label, cond, extra) => console.log((cond ? '  ✓ ' : '  ✗ ') + label + (extra ? '  ' + extra : ''));

(async () => {
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: 'file:///' + FILE.replace(/\\/g, '/'),
    beforeParse(window) {
      Object.defineProperty(window, 'sessionStorage', {
        value: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k) },
      });
      const h = window.history;
      window.history.replaceState = function (...a) { try { h.replaceState.apply(h, a); } catch (e) {} };
      for (const n of ['TextEncoder', 'TextDecoder']) if (!window[n]) window[n] = util[n];
    },
    virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 900));
  const A = w.App, P = A.platform, doc = w.document;
  const host = () => doc.getElementById('scan-app');

  console.log('扫描器接入检查');
  P.go('evaluation', 'scan');
  ok('扫描路由挂载出内容', host() && host().children.length > 0, host() ? host().children.length + ' 个子节点' : '');
  ok('没有 iframe 残留', !doc.querySelector('#view iframe'));
  ok('侧栏来自平台', !!doc.querySelector('#center-sidebar .platform-side-item'), doc.querySelectorAll('#center-sidebar .platform-side-item').length + ' 项');

  // 内部路由切换
  A.review24.scanGo('/targets');
  ok('切到被测对象', w.ScanApp.getRoute() === '/targets' && host().textContent.includes('被测对象'));
  ok('侧栏选中态跟随', !!doc.querySelector('#center-sidebar .platform-side-item.active[data-route="/targets"]'));

  // 平台重绘不能清空已挂载内容（data-own-dom 守卫生效）
  const before = host().children.length;
  A.render(); A.render(); A.render();
  ok('平台连续重绘后内容仍在', host() && host().children.length === before, before + ' 个子节点');

  // 离开再回来要能恢复，且保持内部路由
  P.go('workspace', 'home');
  ok('离开扫描页后容器消失', !host());
  P.go('evaluation', 'scan');
  ok('回到扫描页重新挂载', host() && host().children.length > 0);
  ok('内部路由保持', w.ScanApp.getRoute() === '/targets', w.ScanApp.getRoute());

  // 扫描器自己的弹层（模型管理）
  A.review24.scanGo('/models');
  ok('模型管理页渲染', host().textContent.includes('模型'));
  const modal = doc.getElementById('modal');
  ok('平台弹层容器未被扫描器占用', !modal.classList.contains('open'));

  const bad = errs.filter((e) => !/getContext|scrollTo|Not implemented/.test(e));
  console.log('运行期错误 =', bad.length, bad.slice(0, 3).join(' | '));
  w.close();
})();
