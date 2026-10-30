// 删除前验证：跳过指定代码段后，比对全部路由的正文、侧栏、顶栏 HTML 是否与不跳过时一致。
//   node scripts/verify/skip-check.js exercise/attack-ia policy/policy-selection
//   node scripts/verify/skip-check.js a/b+c/d     用 + 连接表示一起跳过
// 页面零差异只是必要条件；删除前还应跑 interaction.mjs --skip 比对按钮交互。
const { JSDOM, VirtualConsole } = require('jsdom');
const { URL_, beforeParse, routes } = require('./environment');

async function shot(skip) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(e.message));
  const dom = await JSDOM.fromURL(URL_, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      beforeParse(w);
      const store = {};
      w.AppParts = new Proxy(store, {
        set(t, k, v) {
          t[k] = skip.includes(k) ? function () {} : v;
          return true;
        },
        get: (t, k) => t[k],
      });
    },
  });
  const w = dom.window;
  w.addEventListener('error', (e) => errors.push(e.message));
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1200));
  const P = w.App?.platform;
  if (!P) return { boot: false, errors };
  const grab = (id) => w.document.getElementById(id)?.innerHTML || '';
  const out = {};
  for (const r of routes(P)) {
    try {
      P.go(...r);
      out[r.join('/')] = [grab('view'), grab('center-sidebar'), grab('platform-header')]
        .join('|')
        .replace(/\s+/g, ' ');
    } catch (e) {
      out[r.join('/')] = 'THREW ' + e.message;
    }
  }
  // 路由表之外的深层页面：每个演练任务的详情页与报告页、每个扫描报告。
  const deep = [
    ...(w.App.attack?.db?.tasks || [])
      .filter((t) => !t.deletedAt)
      .flatMap((t) => [
        ['task ' + t.id, () => w.App.evaluation.taskDetailHTML(t)],
        ['report ' + t.id, () => w.App.evaluation.reportDetailHTML(t)],
      ]),
    ...(w.App.scanProduct?.tasks?.() || []).map((t) => [
      'scan-report ' + t.id,
      () => w.App.scanProduct.reportHTML(t.id),
    ]),
  ];
  for (const [key, render] of deep) {
    try {
      out[key] = String(render()).replace(/\s+/g, ' ');
    } catch (e) {
      out[key] = 'THREW ' + e.message;
    }
  }
  w.close();
  return { out, errors: errors.filter((e) => !/parse CSS|getContext|scrollTo/.test(e)) };
}

(async () => {
  const args = process.argv.slice(2);
  const fs = require('fs');
  // --dump 文件 / --against 文件：不跳过任何代码段，导出或比对“路由 + 深层页面”快照
  if (args[0] === '--dump' || args[0] === '--against') {
    const now = await shot([]);
    if (args[0] === '--dump') {
      fs.writeFileSync(args[1], JSON.stringify(now.out));
      console.log('已导出', Object.keys(now.out).length, '项');
      process.exit(0);
    }
    const base = JSON.parse(fs.readFileSync(args[1], 'utf8'));
    const keys = [...new Set([...Object.keys(base), ...Object.keys(now.out)])];
    const diff = keys.filter((k) => base[k] !== now.out[k]);
    console.log('页面', keys.length, '差异', diff.length, '错误', now.errors.length);
    diff.slice(0, 20).forEach((k) => console.log('  ✗ ' + k));
    process.exit(diff.length ? 1 : 0);
  }
  const groups = args;
  if (!groups.length) {
    console.log('用法：node skip-check.js 段名 [段名+段名 ...]');
    process.exit(2);
  }
  const base = await shot([]);
  let failed = 0;
  for (const g of groups) {
    const s = await shot(g.split('+'));
    if (!s.boot && !s.out) {
      failed++;
      console.log('✗', g, '启动失败');
      continue;
    }
    const diff = Object.keys(base.out).filter((k) => base.out[k] !== s.out[k]);
    const ok = !diff.length && s.errors.length <= base.errors.length;
    if (!ok) failed++;
    console.log(
      ok ? '✓' : '✗',
      g,
      '差异路由',
      diff.length,
      diff.slice(0, 4).join(' '),
      '错误',
      s.errors.length,
    );
  }
  process.exit(failed ? 1 : 0);
})();
