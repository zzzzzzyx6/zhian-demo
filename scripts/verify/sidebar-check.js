// 专项检查：侧边栏重构回归
// 1. 各栏目侧边栏渲染正确（workspace/risk 无侧栏，其余有）
// 2. 收起功能彻底移除：无 #center-toggle、.platform-collapse、toggleSidebar、nav-collapsed
// 3. 扫描域路由切换时侧边栏同步（Q.syncScanSidebar 路径）
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const util = require('util');
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
      Object.defineProperty(window, 'sessionStorage', {
        value: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) },
      });
      const hist = window.history;
      window.history.replaceState = function (...a) { try { hist.replaceState.apply(hist, a); } catch (e) {} };
      for (const n of ['TextEncoder', 'TextDecoder']) if (!window[n]) window[n] = require('util')[n];
    },
    virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1200));
  const A = w.App, P = A.platform, doc = w.document;
  const problems = [];

  // 1) 全局符号清除
  if (typeof P.toggleSidebar !== 'undefined') problems.push('P.toggleSidebar 仍存在');
  if (typeof P.sideShell !== 'function') problems.push('P.sideShell 未定义');
  if (JSON.stringify(A.data.ui || {}).includes('sidebarCollapsed')) problems.push('sidebarCollapsed 数据残留');

  // 2) 逐栏目走查
  const routes = [
    ['workspace', 'home'], ['evaluation', 'scan'], ['evaluation', 'attack'],
    ['evaluation', 'reports'], ['protection', 'overview'], ['policy', 'policies'],
    ['policy', 'defense'], ['assets', 'applications'], ['assets', 'models'],
    ['risk', 'events'], ['management', 'model-roles'],
  ];
  const sideTitles = {};
  for (const [section, item] of routes) {
    P.go(section, item);
    const side = doc.getElementById('center-sidebar');
    const html = side ? side.innerHTML : '';
    sideTitles[section + '/' + item] = (side?.querySelector('.platform-side-title strong') || {}).textContent || '(无侧栏)';
    if (doc.querySelector('.platform-collapse') || doc.getElementById('center-toggle')) problems.push(`${section}/${item} 仍渲染收起按钮`);
    if (String(html).includes('toggleSidebar')) problems.push(`${section}/${item} 侧栏仍引用 toggleSidebar`);
    const expectSide = !['workspace', 'risk'].includes(P.state.section);
    if (expectSide && !html.includes('platform-side-title')) problems.push(`${section}/${item} 侧栏缺失标题`);
    if (expectSide && !html.includes('platform-side-title')) problems.push(`${section}/${item} 侧栏缺标题（外壳未复用）`);
    if (!expectSide && html.trim() !== '') problems.push(`${section}/${item} 不应有侧栏`);
  }

  // 3) 扫描器内部路由同步
  P.go('evaluation', 'scan');
  if (w.App.review24) {
    w.App.review24.scanGo('/targets');
    const side = doc.getElementById('center-sidebar');
    if (!side.innerHTML.includes('被测对象')) problems.push('扫描器路由切换后侧栏未同步');
    if (!side.innerHTML.includes('platform-side-title')) problems.push('扫描侧栏外壳不完整');
  } else problems.push('App.review24 未挂载');

  console.log('各栏目侧栏标题:');
  for (const [k, v] of Object.entries(sideTitles)) console.log(' ', k.padEnd(26), v);
  const bad = errs.filter((e) => !/getContext|scrollTo/.test(e));
  if (bad.length) problems.push(...bad.slice(0, 5).map((e) => '运行期错误: ' + e));
  console.log(problems.length ? '问题:\n  ' + problems.join('\n  ') : '全部通过');
  process.exit(problems.length ? 1 : 0);
})();
