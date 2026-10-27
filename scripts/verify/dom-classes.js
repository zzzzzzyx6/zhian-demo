// 导出「实际会出现在页面上的 class 名」：走完平台全部路由，收集 #view 与外壳里的 class。
//   node scripts/verify/dom-classes.js out.json
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const fs = require('fs');
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
  vc.on('jsdomError', () => {});
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: URL_, beforeParse, virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1200));
  const A = w.App, P = A.platform;
  const set = new Set();
  const collect = () => {
    for (const el of w.document.querySelectorAll('*')) {
      const c = el.getAttribute('class');
      if (c) c.split(/\s+/).forEach((t) => t && set.add(t));
      const id = el.getAttribute('id');
      if (id) set.add('#' + id);
    }
  };
  collect();
  const routes = [];
  for (const [section] of P.sections) {
    const m = P.menus[section] || [];
    if (m.length) m.forEach(([item]) => routes.push([section, item]));
    else routes.push([section, 'home']);
  }
  for (const r of [['evaluation', 'scan', 'code-scan'], ['evaluation', 'scan', 'app-scan'], ['evaluation', 'scan', 'web-scan'],
    ['evaluation', 'attack', 'tasks'], ['evaluation', 'reports', 'compare'], ['policy', 'policies', 'strategies'],
    ['policy', 'policies', 'methods'], ['policy', 'policies', 'content'],
    ['workspace', 'home-b'], ['management', 'risk-management', 'grading']]) routes.push(r);
  for (const r of routes) {
    try { P.go(...r); } catch (e) { continue; }
    collect();
    // 让弹窗、抽屉、详情这些二级界面也留下痕迹
    for (const t of ['App.platformHome.openHomeTodos()', 'App.platformHome.openExceptions()', 'App.platformHome.openDefenseResources()']) {
      try { w.eval(t); collect(); w.eval('App.closeModal()'); } catch (e) {}
    }
  }
  w.close();
  const out = process.argv[2] || 'dom-classes.json';
  fs.writeFileSync(out, JSON.stringify([...set].sort(), null, 0), 'utf-8');
  console.log(`收集到 ${set.size} 个 class/id，写入 ${out}`);
})();
