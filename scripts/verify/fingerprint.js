// 回归比对工具：启动 index.html，走一遍平台全部路由，输出可复现的 DOM 指纹。
//
//   node scripts/verify/fingerprint.js                    打印指纹表
//   node scripts/verify/fingerprint.js --dump base.json   导出基线
//   node scripts/verify/fingerprint.js --against base.json 与基线比对，有差异则退出码 1
//
// 目录重组、补丁调整这类"不该改变呈现"的改动，用 --against 证明零差异。
// 依赖 jsdom（唯一开发依赖）：cd scripts/verify && npm install
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

// 固定时间与随机数，否则生成的 id（如 risk-event-xxx）会让指纹每次都变。
const FIXED_TIME = Date.UTC(2026, 9, 26, 10, 0, 0);
const ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(ROOT, 'index.html');
const URL_ = 'file:///' + FILE.replace(/\\/g, '/');

function beforeParse(window) {
  const RealDate = window.Date;
  class FixedDate extends RealDate {
    constructor(...args) { if (args.length === 0) super(FIXED_TIME); else super(...args); }
    static now() { return FIXED_TIME; }
  }
  window.Date = FixedDate;
  let seed = 42;
  window.Math.random = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  // jsdom 在 file:// 下按规范拒绝 replaceState；浏览器接受，这里吞掉差异。
  const hist = window.history;
  // jsdom 在 file:// 下会拒绝 replaceState，而 location.hash 因此永不更新；
  // 记下「本想要写的地址」，用它判断路由是否算得对。
  window.__routes = [];
  window.history.replaceState = function (...a) {
    try { hist.replaceState.apply(hist, a); } catch (e) {}
    window.__routes.push(String(a[2] || ''));
  };
  // 浏览器自带 TextEncoder/TextDecoder，jsdom 24 的 window 上没有（存储编码用得到）。
  for (const name of ['TextEncoder', 'TextDecoder']) {
    if (!window[name]) window[name] = util[name];
  }
}

const norm = (h) => h.replace(/risk-event-[a-z0-9]+/g, 'ID').replace(/\s+/g, ' ').trim();
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

(async () => {
  if (!fs.existsSync(FILE)) {
    console.error('找不到 index.html，先跑 python scripts/build.py');
    process.exit(2);
  }
  const errs = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errs.push((e.detail && e.detail.message) || e.message));

  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: URL_, beforeParse, virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1200));

  const A = w.App, doc = w.document, P = A.platform;
  const grab = (sel) => { const el = doc.querySelector(sel); return el ? norm(el.innerHTML) : 'MISSING'; };

  const shot = {
    page: A.page,
    '#view': grab('#view'),
    '#platform-header': grab('#platform-header'),
    '#center-sidebar': grab('#center-sidebar'),
    routes: {},
    chrome: {},
  };

  const routes = [];
  for (const [section] of P.sections) {
    const m = P.menus[section] || [];
    if (m.length) m.forEach(([item]) => routes.push([section, item]));
    else routes.push([section, 'home']);
  }
  // 二级 tab 不在 menus 里，单独补上，否则这些页面测不到。
  for (const r of [['evaluation', 'scan', 'code-scan'], ['evaluation', 'scan', 'app-scan'], ['evaluation', 'scan', 'web-scan'],
    ['evaluation', 'attack', 'tasks'], ['evaluation', 'reports', 'compare'], ['policy', 'policies', 'strategies'],
    ['policy', 'policies', 'methods'], ['policy', 'policies', 'content']]) routes.push(r);

  for (const r of routes) {
    w.__routes.length = 0;
    try { P.go(...r); } catch (e) { shot.routes[r.join('/')] = 'THREW ' + e.message; continue; }
    shot.routes[r.join('/')] = grab('#view');
    // 顶部导航、侧边栏、标题与地址都是按路由变化的通用外壳，必须逐路由比对，
    // 否则只看到首屏那一次渲染，导航改写出错也发现不了。
    shot.chrome[r.join('/')] = {
      header: grab('#platform-header'),
      sidebar: grab('#center-sidebar'),
      hash: w.__routes[w.__routes.length - 1] || '',
      title: doc.title,
    };
  }
  w.close();

  const args = process.argv.slice(2);
  const dumpAt = args.indexOf('--dump');
  const againstAt = args.indexOf('--against');
  const errors = errs.filter((e) => !/getContext|scrollTo/.test(e));

  if (dumpAt >= 0) {
    fs.writeFileSync(args[dumpAt + 1], JSON.stringify(shot, null, 1), 'utf-8');
    console.log(`已导出基线：${args[dumpAt + 1]}（路由 ${Object.keys(shot.routes).length} 条）`);
    process.exit(0);
  }

  if (againstAt >= 0) {
    const base = JSON.parse(fs.readFileSync(args[againstAt + 1], 'utf-8'));
    const keys = new Set([...Object.keys(base.routes), ...Object.keys(shot.routes)]);
    const diffs = [...keys].filter((k) => base.routes[k] !== shot.routes[k]);
    const baseChrome = base.chrome || {}, shotChrome = shot.chrome || {};
    for (const k of new Set([...Object.keys(baseChrome), ...Object.keys(shotChrome)])) {
      for (const part of ['header', 'sidebar', 'hash', 'title']) {
        if ((baseChrome[k] || {})[part] !== (shotChrome[k] || {})[part]) diffs.push(k + ' ' + part);
      }
    }
    for (const k of ['page', '#view', '#platform-header', '#center-sidebar']) {
      if (base[k] !== shot[k]) diffs.push(k);
    }
    console.log(`路由 ${keys.size} 条，差异 ${diffs.length} 处`);
    for (const k of diffs) console.log('  ✗ ' + k);
    if (errors.length) { console.log('运行期错误：'); errors.forEach((e) => console.log('  ! ' + e)); }
    process.exit(diffs.length || errors.length ? 1 : 0);
  }

  console.log('路由  #指纹       长度');
  for (const [k, v] of Object.entries(shot.routes)) {
    console.log(`${k.padEnd(28)} ${sha(v)} ${String(v.length).padStart(7)}`);
  }
  console.log(`\n共 ${Object.keys(shot.routes).length} 条路由；运行期错误 ${errors.length} 条`);
  errors.forEach((e) => console.log('  ! ' + e));
  process.exit(errors.length ? 1 : 0);
})().catch((e) => { console.error('工具本身出错：', e); process.exit(2); });
