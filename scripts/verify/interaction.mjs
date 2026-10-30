// 交互级回归：渲染全部路由后，提取每页 onclick="App.x.y(args)" 调用并实际执行，
// 捕获 #view/#drawer/#modal/#toast 结果，形成"交互指纹"。可 --dump / --against，也可 --skip 段名。
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
// jsdom 是 CommonJS 包，用 require 加载，避免 ESM 解析 main 字段失败
const { JSDOM, VirtualConsole } = createRequire(import.meta.url)('jsdom');
const V = path.join(ROOT, 'scripts/verify');
const env = createRequire(import.meta.url)('./environment.js');
const { FILE, URL_, beforeParse, routes: routeList } = env.default || env;
const norm = (h) =>
  (h || '')
    .replace(/risk-event-[a-z0-9]+/g, 'ID')
    .replace(/\s+/g, ' ')
    .trim();

// 从 HTML 里抽取形如 App.a.b(...) / App.a.b.c(...) 的调用表达式（去重，保留参数字面量）
function extractCalls(html) {
  const set = new Set();
  const re = /App\.[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\([^)"']*\)/g;
  let m;
  while ((m = re.exec(html))) {
    // 跳过明显的导航(go/selectState)——它们改路由，单独由路由指纹覆盖
    if (/\.(go|selectState|navigate)\(/.test(m[0])) continue;
    // this.dataset.x 这类运行期参数无法静态求值，替换成占位，避免 ReferenceError
    const call = m[0]
      .replace(/this\.dataset\.[\w$]+/g, "'D'")
      .replace(/\bthis\b/g, 'null')
      .replace(/event\.[\w.]+/g, 'null');
    set.add(call);
  }
  return [...set];
}

async function run(skip) {
  const skipSet = new Set(Array.isArray(skip) ? skip : skip ? [skip] : []);
  const vc = new VirtualConsole();
  const errs = [];
  vc.on('jsdomError', (e) => errs.push((e.detail && e.detail.message) || e.message));
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: URL_,
    beforeParse(w) {
      beforeParse(w);
      if (skipSet.size) {
        const store = {};
        w.AppParts = new Proxy(store, {
          set(t, k, v) {
            t[k] = skipSet.has(k) ? function () {} : v;
            return true;
          },
          get(t, k) {
            return t[k];
          },
        });
      }
    },
    virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1000));
  const A = w.App,
    doc = w.document,
    P = A && A.platform;
  if (!A || !P) {
    w.close();
    return { fp: { __boot: 'no-App' }, errs, calls: 0 };
  }
  const grab = (id) => {
    const el = doc.getElementById(id);
    return el ? norm(el.innerHTML) : '';
  };
  const fp = {};
  let callCount = 0;
  for (const r of routeList(P)) {
    const key = r.join('/');
    try {
      P.go(...r);
    } catch (e) {
      fp[key] = 'THREW ' + e.message;
      continue;
    }
    const viewHtml = grab('view');
    fp[key] = viewHtml;
    // 抽取本页 onclick 调用并执行，记录产生的 drawer/modal/toast
    const calls = extractCalls(doc.getElementById('view')?.innerHTML || '');
    for (const call of calls) {
      try {
        P.go(...r);
      } catch {}
      // 关闭上一次残留
      ['drawer', 'modal', 'toast'].forEach((id) => {
        const el = doc.getElementById(id);
        if (el) el.innerHTML = '';
      });
      let res = '';
      try {
        w.eval(call);
      } catch (e) {
        res = 'ERR:' + e.message;
      }
      callCount++;
      const sig = res || 'D:' + grab('drawer') + '|M:' + grab('modal') + '|T:' + grab('toast');
      fp[key + ' » ' + call] = sig.slice(0, 4000);
    }
  }
  w.close();
  return { fp, errs: errs.filter((e) => !/getContext|scrollTo/.test(e)), calls: callCount };
}

const args = process.argv.slice(2);
const dumpAt = args.indexOf('--dump');
const againstAt = args.indexOf('--against');
const skipAt = args.indexOf('--skip');
const skip =
  skipAt >= 0
    ? fs
        .readFileSync(args[skipAt + 1], 'utf-8')
        .trim()
        .split('\n')
        .filter(Boolean)
    : null;

const { fp, errs, calls } = await run(skip);
if (dumpAt >= 0) {
  fs.writeFileSync(args[dumpAt + 1], JSON.stringify(fp, null, 0));
  console.log(
    `交互基线已写：${Object.keys(fp).length} 项（含 ${calls} 次调用），运行期错误 ${errs.length}`,
  );
} else if (againstAt >= 0) {
  const base = JSON.parse(fs.readFileSync(args[againstAt + 1], 'utf-8'));
  const keys = [...new Set([...Object.keys(base), ...Object.keys(fp)])];
  const diffs = keys.filter((k) => base[k] !== fp[k]);
  console.log(`交互项 ${keys.length}，差异 ${diffs.length}，运行期错误 ${errs.length}`);
  diffs.slice(0, 25).forEach((k) => console.log('  ✗ ' + k.slice(0, 100)));
  process.exit(diffs.length ? 1 : 0);
} else {
  console.log(`交互项 ${Object.keys(fp).length}，调用 ${calls}，错误 ${errs.length}`);
  errs.slice(0, 10).forEach((e) => console.log('  ! ' + e));
}
