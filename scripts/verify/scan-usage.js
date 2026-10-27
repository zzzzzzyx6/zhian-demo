// 调用计数：走完 29 条路由（再试一次打开扫描报告），统计某组 API 实际被调用多少次，
// 用来判断某个页面/方法链「还有没有活路径」。要统计别的对象就改下面的 hits 列表。
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const util = require('util');
const ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(ROOT, 'index.html');
const vc = new VirtualConsole();
const store = new Map();

(async () => {
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: 'file:///' + FILE.replace(/\\/g, '/'),
    beforeParse(window) {
      Object.defineProperty(window, 'sessionStorage', {
        value: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k) },
      });
      const hist = window.history;
      window.history.replaceState = function (...a) { try { hist.replaceState.apply(hist, a); } catch (e) {} };
      for (const n of ['TextEncoder', 'TextDecoder']) if (!window[n]) window[n] = util[n];
    },
    virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 900));

  const A = w.App, P = A.platform, S = A.scanProduct;
  const hits = {};
  for (const k of ['render', 'detailHTML', 'reportHTML', 'open', 'status', 'actions']) {
    if (typeof S[k] !== 'function') continue;
    hits[k] = 0;
    const orig = S[k];
    S[k] = function () { hits[k]++; return orig.apply(this, arguments); };
  }

  const routes = [];
  for (const [section] of P.sections) {
    const m = P.menus[section] || [];
    if (m.length) m.forEach(([item]) => routes.push([section, item]));
    else routes.push([section, 'home']);
  }
  for (const r of [['evaluation', 'scan', 'code-scan'], ['evaluation', 'scan', 'app-scan'], ['evaluation', 'scan', 'web-scan'],
    ['evaluation', 'attack', 'tasks'], ['evaluation', 'reports', 'compare'], ['policy', 'policies', 'strategies'],
    ['policy', 'policies', 'methods'], ['policy', 'policies', 'content']]) routes.push(r);
  for (const r of routes) { try { P.go(...r); } catch (e) {} }

  console.log('阶段 1 — 只走路由：', JSON.stringify(hits));

  // 阶段 2：从报告分析点开一条扫描任务
  const scanTask = A.evaluation.allTasks().find((t) => A.evaluation.type(t) === 'scan' && A.evaluation.reportReady(t));
  let opened = '无可用扫描任务';
  if (scanTask) {
    try {
      opened = String(A.evaluation.openReport(scanTask.id));
      await new Promise((r) => setTimeout(r, 50));
    } catch (e) { opened = 'openReport 抛错：' + e.message; }
  }
  console.log('阶段 2 — 打开扫描报告 ' + (scanTask ? scanTask.id : '') + '：', opened);
  console.log('        调用累计：', JSON.stringify(hits));
  const view = w.document.getElementById('view').textContent.replace(/\s+/g, ' ');
  console.log('        报告页首段：', view.trim().slice(0,60)||'(空)');const f=w.document.querySelector('#view iframe');console.log('        iframe id =', f&&f.id, '| src =', f&&f.getAttribute('src'));
  console.log('        iframe 数：', w.document.querySelectorAll('#view iframe').length);
  w.close();
})();
