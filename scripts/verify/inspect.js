// 体检：打印关键容器与外壳的实际显示状态，判断旧外壳是否还在生效。
//   node scripts/verify/inspect.js
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const util = require('util');

const FIXED_TIME = Date.UTC(2026, 9, 26, 10, 0, 0);
const ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(ROOT, 'index.html');
const URL_ = 'file:///' + FILE.replace(/\\/g, '/');

function beforeParse(window) {
  const RealDate = window.Date;
  class FixedDate extends RealDate {
    constructor(...a) { if (!a.length) super(FIXED_TIME); else super(...a); }
    static now() { return FIXED_TIME; }
  }
  window.Date = FixedDate;
  let seed = 42;
  window.Math.random = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const hist = window.history;
  window.__routes = [];
  window.history.replaceState = function (...a) { try { hist.replaceState.apply(hist, a); } catch (e) {} window.__routes.push(String(a[2] || '')); };
  for (const n of ['TextEncoder', 'TextDecoder']) if (!window[n]) window[n] = util[n];
}

(async () => {
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => console.log('  ! ' + (e.detail && e.detail.message || e.message)));
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: URL_, beforeParse, virtualConsole: vc,
  });
  const w = dom.window, d = w.document;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1200));

  const show = (label, sel) => {
    const el = d.querySelector(sel);
    if (!el) return console.log(`${label.padEnd(26)} 不存在`);
    const st = w.getComputedStyle(el);
    console.log(`${label.padEnd(26)} display=${st.display} 子节点=${el.children.length} 文本=${(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)}`);
  };
  show('#login 登录页', '#login');
  show('#app 主容器', '#app');
  show('#platform-header 新外壳', '#platform-header');
  show('.standalone-topbar 旧外壳', '.standalone-topbar');
  show('#center-sidebar 侧栏', '#center-sidebar');
  show('#view', '#view');
  console.log('session =', JSON.stringify(w.App.session));
  console.log('A.page =', w.App.page, ' platform.state =', JSON.stringify(w.App.platform && w.App.platform.state));
  console.log('路由历史 =', JSON.stringify(w.__routes.slice(-3)));
  w.close();
})();
