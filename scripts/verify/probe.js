// 临时探针：启动 index.html，检查指定选择器是否真的渲染出来（判断死代码）。
//   node scripts/verify/probe.js '.ph-clean-dashboard' '.ph-clean-grid'
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

const selectors = process.argv.slice(2);

(async () => {
  const vc = new VirtualConsole();
  vc.on('jsdomError', () => {});
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: URL_, beforeParse, virtualConsole: vc,
  });
  await new Promise((r) => setTimeout(r, 1200));
  const { window } = dom;
  const App = window.App;
  for (const item of ['home', 'home-b']) {
    App.platform.selectState('workspace', item);
    App.render();
    const view = window.document.getElementById('view');
    const hits = selectors.filter((s) => view.querySelector(s));
    console.log(`[${item}] view.class=${view.firstElementChild?.className || ''}`);
    console.log(`    未渲染的选择器: ${selectors.filter((s) => !hits.includes(s)).join(' ') || '（无）'}`);
  }
  window.close();
})();
