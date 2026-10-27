// 验证：当 sessionStorage 可用（真实浏览器）时，首屏仍能渲染。
// jsdom 在 file:// 下访问 sessionStorage 会抛错，掩盖了「会话被恢复成 null 导致白屏」的路径。
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(ROOT, 'index.html');

const vc = new VirtualConsole();
const errs = [];
vc.on('jsdomError', (e) => errs.push((e.detail && e.detail.message) || e.message));

const store = new Map();
(async () => {
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: 'file:///' + FILE.replace(/\\/g, '/'),
    beforeParse(window) {
      // 模拟真实浏览器：sessionStorage 可读写且为空
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: (k) => (store.has(k) ? store.get(k) : null),
          setItem: (k, v) => store.set(k, String(v)),
          removeItem: (k) => store.delete(k),
        },
      });
      const hist = window.history;
      window.history.replaceState = function (...a) { try { hist.replaceState.apply(hist, a); } catch (e) {} };
      for (const n of ['TextEncoder', 'TextDecoder']) if (!window[n]) window[n] = require('util')[n];
    },
    virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1000));
  const A = w.App;
  const view = w.document.getElementById('view');
  console.log('session     =', JSON.stringify(A.session));
  console.log('#view 文本长度 =', (view.textContent || '').replace(/\s+/g, ' ').trim().length);
  console.log('#view 首段    =', (view.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60));
  console.log('侧边栏渲染    =', w.document.getElementById('center-sidebar').innerHTML.length, '字节（首页应为 0）');
  w.close();
  const bad = errs.filter((e) => !/getContext|scrollTo/.test(e));
  console.log('运行期错误    =', bad.length, bad.slice(0, 3).join(' | '));
})();
