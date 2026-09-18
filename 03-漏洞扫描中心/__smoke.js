// Smoke test for 03-漏洞扫描中心: rewritten model management page.
// Loads the real assets with a small DOM stub that can parse rendered HTML and
// dispatch click/input events, so bind() wiring is exercised for real.
const fs = require('fs');
const path = require('path');
const root = __dirname;

const captured = { root: '' };
const elStore = new Map();

function parseTags(html) {
  const out = [];
  const re = /<(\w+)([^>]*)>/g;
  let m;
  while ((m = re.exec(html))) {
    const attrs = {};
    const are = /([\w-]+)="([^"]*)"/g;
    let a;
    while ((a = are.exec(m[2]))) attrs[a[1]] = a[2];
    out.push({ tag: m[1], attrs });
  }
  return out;
}
function matchesSel(t, sel) {
  const id = sel.match(/^#([\w-]+)$/);
  if (id) return t.attrs.id === id[1];
  const cls = sel.match(/^\.([\w-]+)$/);
  if (cls) return (t.attrs.class || '').split(/\s+/).indexOf(cls[1]) !== -1;
  const attr = sel.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);
  if (attr) return attr[2] === undefined ? t.attrs[attr[1]] !== undefined : t.attrs[attr[1]] === attr[2];
  return false;
}
function keyOf(t) { return t.attrs.id || (t.tag + ':' + JSON.stringify(t.attrs)); }
function makeEls(html, selector) {
  return parseTags(html).filter((t) => matchesSel(t, selector)).map((t) => {
    const k = keyOf(t);
    if (!elStore.has(k)) elStore.set(k, {
      tag: t.tag, attrs: t.attrs, value: '', textContent: '',
      _l: {},
      getAttribute(n) { return this.attrs[n] !== undefined ? this.attrs[n] : null; },
      setAttribute(n, v) { this.attrs[n] = String(v); },
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
      focus() {}, scrollIntoView() {}, remove() {}, appendChild() {},
      querySelector() { return null; }, querySelectorAll() { return []; },
      addEventListener(type, fn) { this._l[type] = [fn]; },
      removeEventListener() {},
      get isConnected() { return true; },
    });
    return elStore.get(k);
  });
}
function emit(el, type, e) {
  if (process.env.DBG) console.log('EMIT', type, 'data-mdel=', el.getAttribute ? el.getAttribute('data-mdel') : null, 'id=', el.attrs ? el.attrs.id : null);
  (el._l[type] || []).forEach((fn) => fn(e || { currentTarget: el }));
}

const store = {};
global.window = global;
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};
global.document = {
  getElementById(id) {
    if (id === 'root') return rootEl;
    const els = makeEls(captured.root, '#' + id);
    if (els.length) return els[0];
    return makeEls('<div id="' + id + '"></div>', '#' + id)[0];
  },
  querySelector: () => null,
  querySelectorAll(sel) { return makeEls(captured.root, sel); },
  createElement: () => makeEls('<div></div>', '.x')[0],
  addEventListener() {},
  body: { classList: { add() {}, remove() {} } },
  documentElement: makeEls('<div></div>', '.x')[0],
  onkeydown: null,
};
const rootEl = {
  id: 'root', _html: '',
  get innerHTML() { return this._html; },
  set innerHTML(v) { this._html = String(v); captured.root = this._html; },
  querySelector(sel) { const e = makeEls(this._html, sel); return e.length ? e[0] : null; },
  querySelectorAll(sel) { return makeEls(this._html, sel); },
  appendChild() {}, remove() {}, focus() {},
};
global.location = { hash: '#/models' };
global.scrollTo = () => {};
global.addEventListener = () => {};
global.removeEventListener = () => {};
global.print = () => {};

(0, eval)(fs.readFileSync(path.join(root, 'assets', 'data.js'), 'utf-8'));
(0, eval)(fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf-8'));

const out = [];
const check = (label, cond) => out.push((cond ? 'PASS' : 'FAIL') + ' - ' + label);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fire = (sel, idx) => { const els = makeEls(captured.root, sel); const el = els[idx || 0]; if (el) emit(el, 'click'); };
const input = (sel, v) => { const e = makeEls(captured.root, sel)[0]; if (e) { e.value = v; emit(e, 'input'); } };

(async () => {
  const D = window.DEMO_DATA;

  // seeded configs are still there after modelStoreLoad()
  check('two seeded configs survive store load', D.modelConfigs.length === 2);
  check('first visit seeded the localStorage store', !!store['zhian-scan-models']);

  const view = captured.root;
  check('page head says 模型 API', view.includes('模型 API'));
  check('head has 新增模型 button', view.includes('新增模型'));
  check('head no longer has 新增配置', !view.includes('新增配置'));
  check('no inline form card remains', !view.includes('新增模型配置'));
  check('card has 已连通 badge', view.includes('已连通'));
  check('card has 未连通 badge', view.includes('未连通'));
  check('bare icon actions', view.includes('class="model-action"') && view.includes('model-action danger'));
  check('no bordered test button', !view.includes('演示环境不发起连通性测试'));
  check('no delete button on the card', !view.includes('id="btn-del"'));

  // card test: status tag flips to 测试中 then back, no modal
  const before = captured.root;
  fire('[data-mtest]');
  check('card test flips tag to 测试中', captured.root.includes('测试中'));
  check('card test opens no modal overlay', !captured.root.includes('modal-card'));
  await wait(1100);
  check('card test ends without a modal', !captured.root.includes('modal-card'));
  check('tested config persisted to localStorage', JSON.parse(store['zhian-scan-models']).some((m) => m.last_test_status === 'passed'));

  // delete: plain modal
  fire('[data-mdel]');
  const del = captured.root;
  check('delete modal rendered', del.includes('class="modal-card"'));
  check('delete modal title 删除模型', del.includes('删除模型'));
  check('delete body asks 确认删除模型', del.includes('确认删除模型'));
  check('delete modal has red 删除 button', del.includes('id="m-del-confirm"') && del.includes('btn danger'));
  check('delete modal has 取消', del.includes('取消'));
  const idDel = D.modelConfigs[0].id;
  fire('#m-del-confirm');
  check('confirm deletes the config', !D.modelConfigs.some((m) => m.id === idDel));
  check('deletion persisted', JSON.parse(store['zhian-scan-models']).length === D.modelConfigs.length);

  // add modal: fields + inline test button + save gated on test
  fire('#btn-model-add');
  const modal = captured.root;
  check('add modal rendered', modal.includes('新增模型'));
  check('form has 模型名称', modal.includes('模型名称 *'));
  check('form has 厂商', modal.includes('厂商'));
  check('form has Base URL', modal.includes('Base URL *'));
  check('form has API Key', modal.includes('API Key *'));
  check('test button sits beside API Key', modal.includes('id="m-key"') && modal.includes('id="m-test-btn"') && modal.indexOf('m-test-btn') > modal.indexOf('m-key'));
  check('no old 4th field 配置名称', !modal.includes('配置名称'));
  check('footer only has 取消/保存配置', (modal.match(/保存配置/g) || []).length === 1);

  fire('#m-test-btn');
  check('empty form test blocked', makeEls(captured.root, '#m-error')[0].textContent.includes('请填写'));

  input('[data-mf2="name"]', '扫描演示连接');
  input('[data-mf2="vendor"]', '智安演示厂商');
  input('[data-mf2="base_url"]', 'https://api.example.com/v1');
  input('[data-mf2="api_key"]', 'sk-demo-1234567890');
  fire('#m-save');
  check('save blocked before test', !D.modelConfigs.some((m) => m.name === '扫描演示连接') && captured.root.includes('请先完成连通性测试'));

  fire('#m-test-btn');
  const btn = makeEls(captured.root, '#m-test-btn')[0];
  check('test button shows 测试中', btn.textContent.includes('测试中') || btn.innerHTML.includes('测试中'));
  await wait(1100);
  check('test button ends at 已通过', makeEls(captured.root, '#m-test-btn')[0].innerHTML.includes('已通过'));

  input('[data-mf2="api_key"]', 'sk-demo-1234567890');
  const afterEdit = makeEls(captured.root, '#m-test-btn')[0];
  check('editing the key resets the tested flag', !/已通过/.test(afterEdit.innerHTML) && /测试链接/.test(afterEdit.innerHTML));
  fire('#m-test-btn');
  await wait(1100);
  fire('#m-save');
  const saved = D.modelConfigs.find((m) => m.name === '扫描演示连接');
  check('save works after a passed test', !!saved);
  check('vendor persisted', saved && saved.vendor === '智安演示厂商');
  check('masked key stored', saved && /^sk-\.\.\.[\w-]{4}$/.test(saved.masked_api_key || ''));
  check('saved config shows on the cards', captured.root.includes('智安演示厂商'));
  check('modal closed after save', !captured.root.includes('id="m-save"'));

  // reload simulation: persisted configs are restored
  const savedCount = D.modelConfigs.length;
  elStore.clear(); captured.root = '';
  delete require.cache[require.resolve('fs')];
  (0, eval)(fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf-8'));
  check('configs restored from localStorage on reload', window.DEMO_DATA.modelConfigs.length === savedCount);

  console.log('\n' + out.join('\n'));
  process.exit(out.some((l) => l.startsWith('FAIL')) ? 1 : 0);
})();
