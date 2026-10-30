// 导航快照：按固定的导航调用列表，记录每个页面的正文、侧栏、顶栏、地址栏、标题与外壳样式类，
// 以及页面上每个按钮调用的结果；另含演练/扫描任务详情与报告、旧地址、侧栏与顶栏逐个点击。
// 比 fingerprint.js 覆盖更全，适合改动路由、外壳、侧栏之后使用。
//
//   node scripts/verify/nav-snap.js . --dump scripts/verify/nav.local.json
//   # 修改后
//   node scripts/verify/nav-snap.js . --against scripts/verify/nav.local.json [差异明细.json]
//
// 第一个参数是仓库根目录；可传入另一份工作树（如 git worktree）的路径，用旧版本导出基线。
const path = require('path'),
  fs = require('fs');
const repo = path.resolve(process.argv[2] || '.');
const V = path.join(repo, 'scripts/verify');
const { JSDOM, VirtualConsole } = require('jsdom');
const { FILE, URL_, beforeParse } = require(path.join(V, 'environment.js'));
const NAV = [
  ['workspace'],
  ['workspace', 'home'],
  ['evaluation'],
  ['evaluation', 'scan'],
  ['evaluation', 'scan', 'code-scan'],
  ['evaluation', 'scan', 'app-scan'],
  ['evaluation', 'scan', 'web-scan'],
  ['evaluation', 'attack'],
  ['evaluation', 'attack', 'tasks'],
  ['evaluation', 'attack', 'arena'],
  ['evaluation', 'reports'],
  ['evaluation', 'tasks'],
  ['scan'],
  ['scan', 'tasks'],
  ['scan', 'tasks', 'app-scan'],
  ['scan', 'tasks', 'web-scan'],
  ['scan', 'reports'],
  ['scan', 'results'],
  ['exercise'],
  ['exercise', 'tasks'],
  ['exercise', 'results'],
  ['exercise', 'reports'],
  ['protection'],
  ['protection', 'overview'],
  ['protection', 'review'],
  ['protection', 'records'],
  ['protection', 'accounts'],
  ['protection', 'reports'],
  ['policy', 'policies', 'strategies'],
  ['policy', 'policies', 'methods'],
  ['policy', 'policies', 'content'],
  ['policy', 'defense', 'configurations'],
  ['policy', 'defense', 'basics'],
  ['policy', 'defense', 'rules'],
  ['policy', 'defense', 'knowledge'],
  ['assets', 'applications'],
  ['assets', 'models'],
  ['assets', 'code'],
  ['assets', 'packages'],
  ['assets', 'web'],
  ['risk', 'events'],
  ['management', 'model-roles'],
  ['management', 'api-traffic'],
  ['management', 'access'],
  ['management', 'risk-management'],
];
const HASHES = [
  '#scan/tasks/code-scan',
  '#scan/reports',
  '#exercise/tasks',
  '#exercise/results',
  '#evaluation/attack/tasks',
  '#evaluation/scan/web-scan',
  '#evaluation/reports',
  '#attack',
  '#protection/review',
  '#policy/defense/rules',
];
const norm = (h) =>
  (h || '')
    .replace(/risk-event-[a-z0-9]+/g, 'ID')
    .replace(/\s+/g, ' ')
    .trim();
function calls(html) {
  const set = new Set(),
    re = /App\.[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\([^)"']*\)/g;
  let m;
  while ((m = re.exec(html))) {
    if (/\.(go|selectState|navigate)\(/.test(m[0])) continue;
    set.add(
      m[0]
        .replace(/this\.dataset\.[\w$]+/g, "'D'")
        .replace(/\bthis\b/g, 'null')
        .replace(/event\.[\w.]+/g, 'null'),
    );
  }
  return [...set];
}
(async () => {
  const vc = new VirtualConsole(),
    errs = [];
  vc.on('jsdomError', (e) => errs.push((e.detail && e.detail.message) || e.message));
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: URL_,
    beforeParse,
    virtualConsole: vc,
  });
  const w = dom.window;
  w.addEventListener('error', (e) => errs.push(e.message));
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1000));
  const P = w.App.platform,
    doc = w.document,
    g = (id) => norm(doc.getElementById(id)?.innerHTML);
  const reset = () => {
    w.__routes.length = 0;
  };
  const state = () => ({
    view: g('view'),
    side: g('center-sidebar'),
    head: g('platform-header'),
    hash: w.__routes.at(-1) || '',
    title: doc.title,
    cls: ['has-center-nav', 'dashboard-layout', 'review24-scanner']
      .filter((c) => doc.getElementById('app').classList.contains(c))
      .join(' '),
  });
  const out = {};
  for (const n of NAV) {
    const k = 'go ' + n.join('/');
    reset();
    try {
      P.go(...n);
    } catch (e) {
      out[k] = 'THREW ' + e.message;
      continue;
    }
    const s = state();
    out[k] = s;
    for (const c of calls(s.view)) {
      try {
        P.go(...n);
      } catch {}
      ['drawer', 'modal', 'toast'].forEach((id) => {
        const el = doc.getElementById(id);
        if (el) el.innerHTML = '';
      });
      let res = '';
      try {
        w.eval(c);
      } catch (e) {
        res = 'ERR:' + e.message;
      }
      out[k + ' » ' + c] = (
        res ||
        'D:' + g('drawer') + '|M:' + g('modal') + '|T:' + g('toast') + '|H:' + w.location.hash
      ).slice(0, 4000);
    }
  }
  // 深层页面：演练任务详情/报告、扫描任务详情、扫描报告
  const X = w.App.attack,
    S = w.App.scanProduct,
    V = w.App.evaluation;
  const deep = [];
  for (const t of X.db.tasks.filter((t) => !t.deletedAt).slice(0, 4)) {
    deep.push(['task ' + t.id, () => X.open(t.id)]);
    deep.push(['report ' + t.id, () => V.openReport(t.id)]);
  }
  for (const t of S.tasks().slice(0, 3)) {
    deep.push(['scantask ' + t.id, () => S.open(t.id)]);
    deep.push(['scanreport ' + t.id, () => V.openReport(t.id)]);
  }
  deep.push(
    ['reportlist', () => V.openReportList()],
    ['opentasks', () => V.openTasks()],
    ['opentasks-scan', () => V.openTasks('scan')],
  );
  for (const [k, f] of deep) {
    P.go('workspace');
    reset();
    try {
      f();
    } catch (e) {
      out['deep ' + k] = 'THREW ' + e.message;
      continue;
    }
    out['deep ' + k] = state();
  }
  for (const h of HASHES) {
    P.go('workspace');
    reset();
    w.location.hash = h;
    await new Promise((r) => setTimeout(r, 30));
    out['hash ' + h] = state();
  }
  // 侧栏与顶栏按钮：逐个点击后记录状态
  P.go('scan');
  for (const [i, b] of [...doc.querySelectorAll('#center-sidebar button')].entries()) {
    P.go('scan');
    reset();
    doc.querySelectorAll('#center-sidebar button')[i]?.click();
    out['scan side ' + i] = state();
  }
  P.go('exercise');
  for (const [i] of [...doc.querySelectorAll('#center-sidebar button')].entries()) {
    P.go('exercise');
    reset();
    doc.querySelectorAll('#center-sidebar button')[i]?.click();
    out['ex side ' + i] = state();
  }
  for (const [i] of [...doc.querySelectorAll('.platform-top-nav button')].entries()) {
    P.go('workspace');
    reset();
    doc.querySelectorAll('.platform-top-nav button')[i]?.click();
    out['top ' + i] = state();
  }
  const errors = errs.filter(
    (e) => !/getContext|scrollTo|WebGL|Could not parse CSS stylesheet/.test(e),
  );
  w.close();
  const a = process.argv.slice(3);
  if (a[0] === '--dump') {
    fs.writeFileSync(a[1], JSON.stringify(out));
    console.log('快照', Object.keys(out).length, '项, 错误', errors.length);
    errors.slice(0, 5).forEach((e) => console.log(' !', e));
  } else {
    const base = JSON.parse(fs.readFileSync(a[1], 'utf8')),
      keys = [...new Set([...Object.keys(base), ...Object.keys(out)])];
    const diffs = [];
    for (const k of keys) {
      const x = base[k],
        y = out[k];
      if (typeof x === 'object' && typeof y === 'object' && x && y) {
        for (const f of Object.keys(x)) if (x[f] !== y[f]) diffs.push(k + ' .' + f);
      } else if (JSON.stringify(x) !== JSON.stringify(y)) diffs.push(k);
    }
    console.log('快照', keys.length, '项, 差异', diffs.length, ', 错误', errors.length);
    diffs.slice(0, 40).forEach((d) => console.log('  ✗', d.slice(0, 140)));
    errors.slice(0, 5).forEach((e) => console.log(' !', e));
    if (a[2]) fs.writeFileSync(a[2], JSON.stringify({ base, out, diffs }));
    process.exit(diffs.length ? 1 : 0);
  }
})();
