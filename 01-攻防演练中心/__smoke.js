// Smoke test: load the real app source with a minimal DOM stub,
// render the attack center's model-management page and the sidebar, then assert.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf-8'));

const captured = {};
function makeEl(id) {
  const el = {
    id, hidden: false, textContent: '', value: '', _html: '',
    style: {}, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    appendChild() {}, remove() {}, focus() {},
    querySelector() { return makeEl('q'); }, querySelectorAll() { return []; },
    addEventListener() {}, removeEventListener() {}, scrollIntoView() {},
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return el._html; },
    set(v) { el._html = String(v); if (['view', 'center-sidebar', 'modal'].includes(id)) captured[id] = el._html; },
  });
  return new Proxy(el, {
    get(t, k) { return k in t ? t[k] : () => {}; },
    set(t, k, v) { t[k] = v; return true; },
  });
}
const els = {};
global.window = global;
global.document = {
  getElementById: (id) => (els[id] ?? (els[id] = makeEl(id))),
  querySelector: () => makeEl('qs'),
  querySelectorAll() { return []; },
  createElement: () => makeEl('ce'),
  addEventListener() {},
  body: makeEl('body'),
  documentElement: makeEl('html'),
  activeElement: makeEl('active'),
};
global.location = { hash: '', assign() {}, reload() {} };
global.history = { replaceState() {} };
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.scrollTo = () => {};
global.addEventListener = () => {};
global.removeEventListener = () => {};
global.URL = { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} };
global.Blob = function () { return {}; };
global.alert = () => {};

// Load every script in manifest order.
for (const name of manifest.js) {
  const code = fs.readFileSync(path.join(root, 'src', name), 'utf-8');
  // eslint-disable-next-line no-eval
  (0, eval)(code);
}

const A = window.App;
const X = A.attack;
A.showApp(); // boot: page='attack', A.render()
X.setTab('models'); // sidebar "模型管理" -> models page

const view = captured['view'] || '';
const sidebar = captured['center-sidebar'] || '';
const out = [];
const check = (label, cond) => out.push((cond ? 'PASS' : 'FAIL') + ' - ' + label);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  check('sidebar has 系统配置 heading', sidebar.includes('系统配置'));
  check('sidebar has 模型管理 item', sidebar.includes('模型管理'));
  check('sidebar no longer says 模型接入', !sidebar.includes('模型接入'));
  check('sidebar shows 工作台 heading', sidebar.includes('工作台'));
  check('sidebar renders box icon path', sidebar.includes('M12 3 3 7.5v9'));
  check('view heading says 模型管理', view.includes('模型管理'));
  check('card has model-mark icon', view.includes('class="model-mark"'));
  check('card has badge 已连通', /badge green[^"]*connection-state/.test(view) && view.includes('已连通'));
  check('card has edit icon button', view.includes('title="编辑"') && view.includes('class="model-action"'));
  check('card has test icon button', view.includes('title="测试连接"'));
  check('card has delete icon button', view.includes('title="删除"') && view.includes('model-action danger'));
  check('card name is plain text, not a link button', !view.includes('model-name-btn'));
  check('no old 查看配置/编辑配置 link buttons', !view.includes('编辑配置</button>'));
  check('connState m1 sample -> 已连通', A.connections.connState(X.model('m1')).label === '已连通');
  check('connState preset agent -> 待配置', (A.connections.db.find(m => m.presetPending) ? A.connections.connState(A.connections.db.find(m => m.presetPending)).label === '待配置' : true));

  // page head: tabs on the left, add button on the right, label follows the tab
  check('head renders kind tabs', view.includes('class="tabs connection-kind-tabs"') && view.includes('>模型</button>') && view.includes('>智能体</button>'));
  check('model tab offers 接入模型', view.includes('接入模型'));
  X.connectionKind = 'agent'; A.render();
  check('agent tab switches button to 接入智能体', captured['view'].includes('接入智能体'));
  X.connectionKind = 'model'; A.render();

  // ---- card test button: no modal, only the status tag flips ----
  const modalBeforeTest = captured['modal'];
  A.connections.test('m1');
  check('card test flips tag to 测试中', A.connections.connState(X.model('m1')).label === '测试中');
  check('card test opens no modal', captured['modal'] === modalBeforeTest);
  await wait(1100);
  check('card test ends at 已连通', A.connections.connState(X.model('m1')).label === '已连通');

  // remove flows still work
  A.connections.remove('m1');
  A.connections.removeConfirm('nonexistent');
  check('remove flows run without throwing', true);

  // ---- add-connection form: vendor field + test button beside API Key ----
  A.connections.open();
  const modal = captured['modal'] || '';
  check('form title says 接入模型', modal.includes('接入模型'));
  check('form has 模型名称 field', modal.includes('模型名称 *'));
  check('form has 厂商 field', modal.includes('厂商') && modal.includes('id="c-vendor"'));
  check('form has Base URL field', modal.includes('Base URL *'));
  check('form has API Key field', modal.includes('API Key *'));
  check('test button sits beside the API Key field', modal.includes('id="c-key"') && modal.includes('id="c-test-btn"') && modal.indexOf('c-test-btn') > modal.indexOf('c-key'));
  check('footer keeps only 取消/保存配置', (modal.match(/测试链接/g) || []).length === 1);
  check('form has no stray result paragraph', !modal.includes('connection-result'));
  check('form has no Model ID field', !modal.includes('Model ID'));

  // empty form: test reports the missing required field
  A.connections.testDraft();
  check('testDraft blocks empty form', document.getElementById('connection-error').textContent.includes('请填写'));

  // fill every field, but save is still blocked until the test passes
  document.getElementById('c-name').value = '演示连接';
  document.getElementById('c-vendor').value = '智安演示厂商';
  document.getElementById('c-endpoint').value = 'https://api.example.com/v1';
  document.getElementById('c-key').value = 'sk-demo';
  A.connections.save();
  check('save blocked before connectivity test', !A.connections.db.some(m => m.name === '演示连接') && document.getElementById('connection-error').textContent.includes('连通性测试'));

  A.connections.testDraft();
  check('test button shows 测试中 while waiting', document.getElementById('c-test-btn').textContent.includes('测试中'));
  await wait(1100);
  check('test button marks itself 已通过', document.getElementById('c-test-btn').textContent.includes('已通过'));
  check('tested flag set after success', A.connections.draft.tested === true);

  // editing a connectivity field invalidates the passed test
  document.getElementById('c-key').value = 'sk-demo-2';
  A.connections.markDirty();
  check('editing the key resets the tested flag', !A.connections.draft.tested);
  A.connections.testDraft();
  await wait(1100);
  check('retest passes again', A.connections.draft.tested === true);

  // now save works and the vendor lands on the card preview
  A.connections.save();
  const saved = A.connections.db.find(m => m.name === '演示连接');
  check('save works after a passed test', !!saved);
  check('vendor is persisted', saved && saved.vendor === '智安演示厂商');
  const view2 = captured['view'] || '';
  check('card preview shows the vendor', view2.includes('智安演示厂商'));

  console.log('\n' + out.join('\n'));
  console.log('\n--- one model card ---');
  console.log(view2.match(/<article class="card attack-model-card">[\s\S]*?<\/article>/)?.[0] || '(card not found)');
  console.log('\n--- add-connection form ---');
  console.log(modal.slice(0, 800));
  process.exit(out.some(l => l.startsWith('FAIL')) ? 1 : 0);
})();
