// 渲染级验证：页面头统一改造后，逐页检查 page-heading 结构
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const util = require('util');
const ROOT = path.resolve(__dirname, '..', '..');
const FILE = path.join(ROOT, 'index.html');
const FIXED_TIME = Date.UTC(2026, 9, 26, 10, 0, 0);

function beforeParse(window) {
  const RealDate = window.Date;
  class FixedDate extends RealDate {
    constructor(...a) { if (a.length === 0) super(FIXED_TIME); else super(...a); }
    static now() { return FIXED_TIME; }
  }
  window.Date = FixedDate;
  let seed = 42;
  window.Math.random = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const hist = window.history;
  window.history.replaceState = function (...a) { try { hist.replaceState.apply(hist, a); } catch (e) {} };
  for (const n of ['TextEncoder', 'TextDecoder']) if (!window[n]) window[n] = util[n];
}

(async () => {
  const errs = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errs.push((e.detail && e.detail.message) || e.message));
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    url: 'file:///' + FILE.replace(/\\/g, '/'), beforeParse, virtualConsole: vc,
  });
  const w = dom.window;
  await new Promise((r) => w.addEventListener('load', r));
  await new Promise((r) => setTimeout(r, 1200));
  const A = w.App, doc = w.document, P = A.platform, view = doc.getElementById('view');

  const inspect = (label) => {
    const heads = [...view.querySelectorAll('.page-heading')];
    const bad = [];
    for (const h of heads) {
      const hasActions = !!h.querySelector(':scope > .page-actions');
      const hasBack = !!h.querySelector(':scope > .back');
      if (!hasActions) bad.push(`${label}: page-heading 缺 .page-actions → ${h.outerHTML.slice(0, 160)}`);
      if (hasBack && !hasActions) bad.push(`${label}: back 变体也必须有 actions`);
    }
    const legacy = view.querySelectorAll('.wb-heading,.attack-detail-top').length;
    if (legacy) bad.push(`${label}: 残留旧类 ${legacy} 处`);
    const first = heads[0];
    console.log(`\n### ${label}`);
    console.log('  page-heading 数 =', heads.length, '| 首个:', first ? first.outerHTML.replace(/\s+/g, ' ').slice(0, 260) : '(无)');
    return bad;
  };

  let problems = [];

  // 1. 安全态势工作台
  P.go('workspace', 'home');
  problems = problems.concat(inspect('workspace/home 安全态势'));

  // 2. 演练任务列表
  P.go('evaluation', 'attack', 'tasks');
  problems = problems.concat(inspect('evaluation/attack/tasks 任务管理'));

  // 3. 攻防任务详情
  const t0 = A.attack.db.tasks[0];
  if (t0) { A.attack.open(t0.id); A.render(); problems = problems.concat(inspect('attack detail 任务详情')); }
  else console.log('\n### attack detail: 无任务可开');

  // 4. 评估任务详情（ec-detail-head）
  const et = A.evaluation.allTasks && A.evaluation.allTasks()[0];
  if (et) { A.evaluation.openTask(et.id); A.render(); problems = problems.concat(inspect('evaluation detail 评估详情')); }
  else console.log('\n### evaluation detail: 无任务');

  // 5. 防护报告详情
  const reports = (A.contentSafety.db && A.contentSafety.db.protectionReports) || [];
  if (reports.length) {
    P.go('protection', 'reports', reports[0].id);
    problems = problems.concat(inspect('protection report 防护报告'));
    const prrHead = view.querySelector('.page-heading.prr-report-heading');
    if (!prrHead) problems.push('protection report: 缺 .page-heading.prr-report-heading');
    else {
      if (!prrHead.querySelector(':scope > .back')) problems.push('protection report: 头部缺返回按钮');
      if (!prrHead.querySelector(':scope > .page-actions')) problems.push('protection report: 头部缺 .page-actions');
    }
  } else console.log('\n### protection report: 无报告数据');

  // 6. 全路由兜底扫描：任何残留旧类 / 缺 actions 的 page-heading
  for (const [section] of P.sections) {
    const menus = P.menus[section] || [];
    const items = menus.length ? menus.map(([i]) => i) : ['home'];
    for (const item of items) {
      try { P.go(section, item); } catch (e) { continue; }
      problems = problems.concat(inspect(`route ${section}/${item}`));
    }
  }

  console.log('\n======== 结论 ========');
  if (!problems.length) console.log('全部页面头结构合规：page-heading + page-actions，无旧类残留');
  else { console.log('发现', problems.length, '处问题:'); problems.forEach((p) => console.log(' -', p)); }
  const realErrs = errs.filter((e) => !/getContext|scrollTo/.test(e));
  console.log('运行期错误 =', realErrs.length, realErrs.slice(0, 3).join(' | '));
  w.close();
  process.exit(problems.length || realErrs.length ? 1 : 0);
})();
