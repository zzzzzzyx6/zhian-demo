// Smoke test for 02-内容审核中心: model management module (no agents).
const fs = require('fs');
const path = require('path');
const root = __dirname;
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

for (const name of manifest.js) {
  const code = fs.readFileSync(path.join(root, 'src', name), 'utf-8');
  // eslint-disable-next-line no-eval
  (0, eval)(code);
}

const A = window.App;
A.session = { user: 'admin' };
Object.values(A.modules).forEach((m) => m.init && m.init());
A.page = 'review';
A.render();
A.review.setTab('models');

const out = [];
const check = (label, cond) => out.push((cond ? 'PASS' : 'FAIL') + ' - ' + label);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const view = captured['view'] || '';
  const sidebar = captured['center-sidebar'] || '';

  // sidebar entry
  check('sidebar has 模型管理 item', sidebar.includes('模型管理'));
  check('sidebar has 系统配置 section', sidebar.includes('系统配置'));
  check('sidebar still has 审核记录 item', sidebar.includes('审核记录'));
  check('sidebar has no agent entry', !sidebar.includes('智能体'));

  // page head: single add button, no tabs
  check('view heading says 模型管理', view.includes('模型管理'));
  check('head has 接入模型 button', view.includes('接入模型'));
  check('head has no kind tabs', !view.includes('connection-kind-tabs'));

  // cards
  check('card Qwen2.5-72B-Instruct renders', view.includes('Qwen2.5-72B-Instruct'));
  check('card vendor preview Qwen', view.includes('Qwen'));
  check('card DeepSeek-V3 renders', view.includes('DeepSeek-V3'));
  check('card DeepSeek-V4-Flash renders', view.includes('DeepSeek-V4-Flash'));
  check('card has 已连通 badge', /badge green[^"]*connection-state/.test(view) && view.includes('已连通'));
  check('seed cards are all 已连通 like 01', !view.includes('未连通'));
  check('card has bare icon actions', view.includes('class="model-action"') && view.includes('model-action danger'));
  check('no divider markup on card actions', !view.includes('attack-model-divider'));

  check('connState m1 sample -> 已连通', A.connections.connState(A.connections.db.find((m) => m.id === 'm1')).label === '已连通');
  check('connState DeepSeek-V3 -> 已连通', A.connections.connState(A.connections.db.find((m) => m.id === 'm2')).label === '已连通');
  check('connState DeepSeek-V4-Flash -> 已连通', A.connections.connState(A.connections.db.find((m) => m.id === 'm3')).label === '已连通');

  // an un-configured user connection drives the 未连通 -> 测试中 -> 未连通 flow
  A.connections.db.push({id:'mx',kind:'model',name:'未配置连接',vendor:'',model:'demo-72b',endpoint:'https://api.example.com',auth:'bearer',connectStatus:'pending'});
  check('connState mx no key -> 未连通', A.connections.connState(A.connections.db.find((m) => m.id === 'mx')).label === '未连通');

  // card test button: only the status tag flips, no modal
  const modalBefore = captured['modal'];
  A.connections.test('mx');
  check('card test flips tag to 测试中', A.connections.connState(A.connections.db.find((m) => m.id === 'mx')).label === '测试中');
  check('card test opens no modal', captured['modal'] === modalBefore);
  await wait(1100);
  check('card test without key ends 未连通', A.connections.connState(A.connections.db.find((m) => m.id === 'mx')).label === '未连通');

  // delete modal
  A.connections.remove('mx');
  const delModal = captured['modal'] || '';
  check('delete modal is plain', /modal-panel\s+plain/.test(delModal));
  check('delete modal title 删除模型', delModal.includes('删除模型'));
  check('delete modal body asks 确认删除模型', delModal.includes('确认删除模型') && delModal.includes('未配置连接'));
  check('delete modal has 取消 + red 删除', delModal.includes('取消') && delModal.includes('btn danger') && delModal.includes('>删除<'));
  A.connections.removeConfirm('mx');
  check('removeConfirm deletes the model', !A.connections.db.some((m) => m.id === 'mx'));

  // add-connection form
  A.connections.open();
  const modal = captured['modal'] || '';
  check('form title says 接入模型', modal.includes('接入模型'));
  check('form has 模型名称 field', modal.includes('模型名称 *'));
  check('form has 厂商 field', modal.includes('厂商') && modal.includes('id="c-vendor"'));
  check('form has Base URL field', modal.includes('Base URL *'));
  check('form has API Key field', modal.includes('API Key *'));
  check('test button sits beside the API Key field', modal.includes('id="c-key"') && modal.includes('id="c-test-btn"') && modal.indexOf('c-test-btn') > modal.indexOf('c-key'));
  check('footer keeps only 取消/保存配置', (modal.match(/测试链接/g) || []).length === 1);
  check('form has no agent-specific fields', !modal.includes('智能体') && !modal.includes('HTTP'));

  A.connections.testDraft();
  check('testDraft blocks empty form', document.getElementById('connection-error').textContent.includes('请填写'));

  document.getElementById('c-name').value = '审核演示连接';
  document.getElementById('c-vendor').value = '智安演示厂商';
  document.getElementById('c-endpoint').value = 'https://api.example.com/v1';
  document.getElementById('c-key').value = 'sk-demo';
  A.connections.save();
  check('save blocked before connectivity test', !A.connections.db.some((m) => m.name === '审核演示连接') && document.getElementById('connection-error').textContent.includes('连通性测试'));

  A.connections.testDraft();
  check('test button shows 测试中 while waiting', document.getElementById('c-test-btn').textContent.includes('测试中'));
  await wait(1100);
  check('test button marks itself 已通过', document.getElementById('c-test-btn').textContent.includes('已通过'));
  check('tested flag set after success', A.connections.draft.tested === true);

  document.getElementById('c-key').value = 'sk-demo-2';
  A.connections.markDirty();
  check('editing the key resets the tested flag', !A.connections.draft.tested);
  A.connections.testDraft();
  await wait(1100);
  check('retest passes again', A.connections.draft.tested === true);

  A.connections.save();
  const saved = A.connections.db.find((m) => m.name === '审核演示连接');
  check('save works after a passed test', !!saved);
  check('vendor is persisted', saved && saved.vendor === '智安演示厂商');
  check('saved model is kind model', saved && saved.kind === 'model');
  const view2 = captured['view'] || '';
  check('card preview shows the vendor', view2.includes('智安演示厂商'));

  console.log('\n' + out.join('\n'));
  console.log('\n--- one model card ---');
  console.log(view2.match(/<article class="card attack-model-card">[\s\S]*?<\/article>/)?.[0] || '(card not found)');
  process.exit(out.some((l) => l.startsWith('FAIL')) ? 1 : 0);
})();
