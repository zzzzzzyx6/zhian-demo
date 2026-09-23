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
  check('reference attack and judge connections use the expected names and model IDs', X.model('deepseek-v3').name === 'DeepSeek-V3.2' && X.model('deepseek-v3').model === 'deepseek-v3.2' && X.model('deepseek-judge').name === 'GPT-4o mini' && X.model('deepseek-judge').model === 'gpt-4o-mini');
  check('predefined task role labels match their selected role snapshots', X.db.tasks.every(t => (!t.engine.roles.attacker || t.engine.attacker === t.engine.roles.attacker.name) && t.engine.judge === t.engine.roles.judge.name));

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

  // ---- coordinated experience: one attack chain, linked series, concise launch ----
  X.setTab('arena');
  let arenaView = captured['view'] || '';
  check('arena switches all unfinished tasks', arenaView.includes('未完成任务') && arenaView.includes('进行中') && arenaView.includes('已暂停') && arenaView.includes('<select'));
  check('arena presents one attack chain with separate target and blue team', ['红队 · 攻击方法','被测靶标','裁判 · 判定','flow-group node-target','flow-group node-blue','blue-target-link'].every(label => arenaView.includes(label)) && /(?:single|multi)-turn-flow/.test(arenaView));
  check('arena only contains the live board, not model-series results', !arenaView.includes('model-series-page') && !arenaView.includes('模型系列安全结果') && !arenaView.includes('系列概览'));
  check('arena uses task execution progress label', arenaView.includes('任务执行进度') && !arenaView.includes('题目进度'));
  check('arena module detail is collapsed initially', !arenaView.includes('flow-inspector'));
  X.inspectArenaNode('attack'); arenaView = captured['view'] || '';
  check('arena module detail opens beside clicked module', arenaView.includes('flow-inspector') && arenaView.includes('红队攻击配置'));
  X.inspectArenaNode('blue'); arenaView = captured['view'] || '';
  check('clicking another module replaces the floating details', (arenaView.match(/class="flow-inspector"/g) || []).length === 1 && arenaView.includes('蓝队防守配置') && !arenaView.includes('红队攻击配置'));
  X.inspectArenaNode('blue'); arenaView = captured['view'] || '';
  check('clicking an open module closes its details', !arenaView.includes('flow-inspector') && X.focusNode === null);
  check('arena quick actions use 结束', arenaView.includes('>结束</button>') && !arenaView.includes('终止'));
  check('arena has no replay or observation history controls', !arenaView.includes('观测记录') && !arenaView.includes('>回放</button>'));
  check('arena telemetry uses matching result colors', arenaView.includes('coordinated-score') && arenaView.includes('telemetry-grid colored') && arenaView.includes('result-legend'));

  const dynamicTask = X.liveTasks().find(t => t.status === 'running');
  const beforeActivity = dynamicTask.units.reduce((n, u) => n + (u.events?.length || 0), 0) + X.metrics(dynamicTask).done;
  for (let i = 0; i < 5; i++) X.tick();
  const afterActivity = dynamicTask.units.reduce((n, u) => n + (u.events?.length || 0), 0) + X.metrics(dynamicTask).done;
  check('running arena data advances dynamically', afterActivity > beforeActivity);
  const pausedTask = X.liveTasks().find(t => t.status === 'paused');
  const pausedBefore = JSON.stringify(pausedTask);
  for (let i = 0; i < 3; i++) X.tick();
  check('paused task keeps the same progress and evidence through ticks', JSON.stringify(pausedTask) === pausedBefore);

  const taskBackup = JSON.parse(JSON.stringify(X.db.tasks));
  const arenaBackup = {...X.arena};
  for (const task of X.db.tasks) task.status = 'done';
  const recentTask = [...X.db.tasks].sort((a,b) => String(b.created).localeCompare(String(a.created)))[0];
  X.arena.taskId = 'missing-task'; A.render();
  check('all-ended arena retains the most recent task and last attack', X.workspaceTasks().length === 1 && X.exerciseTask()?.id === recentTask.id && (captured['view'] || '').includes('最近完成任务') && (captured['view'] || '').includes('battle-board coordinated'));
  X.db.tasks = taskBackup; X.arena = arenaBackup; A.render();

  const executionBackup = X.db.tasks;
  const multiTask = JSON.parse(JSON.stringify(executionBackup[0]));
  multiTask.status = 'running'; multiTask.engine.concurrency = 1; multiTask.engine.maxRounds = 2;
  multiTask.defense = {mode:'existing',parts:[],prompt:''};
  const multiUnit = {...multiTask.units[0],index:0,method:'PAIR',rounds:2,result:'pending',events:[],roundHistory:[],eventSchema:5};
  for (const key of ['response','attackPrompt','verdict','finished','blueBlocked','rawResponse','currentRound']) delete multiUnit[key];
  multiTask.units = [multiUnit]; X.db.tasks = [multiTask];
  for (let i = 0; i < 12 && !multiUnit.roundHistory.length; i++) X.tick();
  check('multi-turn attack remains pending after first-round judge feedback', multiUnit.roundHistory.length === 1 && multiUnit.roundHistory[0].round === 1 && multiUnit.result === 'pending' && multiUnit.verdict.includes('继续改写'));
  for (let i = 0; i < 12 && multiTask.status === 'running'; i++) X.tick();
  check('multi-turn attack preserves both rounds and completes the final verdict', multiTask.status === 'done' && multiUnit.roundHistory.length === 2 && multiUnit.events.some(e => e.round === 2 && e.phase === 0) && multiUnit.events.some(e => e.round === 2 && e.phase === 4) && multiUnit.attackPrompt.includes('根据裁判反馈改写') && multiUnit.result !== 'pending');
  const guardTask = JSON.parse(JSON.stringify(executionBackup[0]));
  guardTask.status = 'running'; guardTask.engine.concurrency = 1; guardTask.engine.maxRounds = 1;
  guardTask.defense = {mode:'guard',guardType:'rules',parts:['rules'],rules:{keywords:['input-regression-block'],input:true,output:false}};
  const guardUnit = {...guardTask.units[0],index:0,method:'Direct',rounds:1,result:'pending',events:[],roundHistory:[],blueEvidence:[],eventSchema:5,seedPrompt:'input-regression-block'};
  for (const key of ['response','attackPrompt','verdict','finished','blueBlocked','rawResponse','currentRound']) delete guardUnit[key];
  guardTask.units = [guardUnit]; X.db.tasks = [guardTask];
  for (let i = 0; i < 12 && guardTask.status === 'running'; i++) X.tick();
  const blockedBoard = X.battleBoardHTML(guardTask);
  check('input interception skips target response and output defense in the displayed chain', guardUnit.blueBlocked === 'input' && guardUnit.result === 'defended' && (blockedBoard.match(/class="skipped"/g) || []).length === 2 && blockedBoard.includes('输入已拦截 · 未调用'));
  const inputConfig = X.compactConfigHTML(guardTask);
  check('input-only guard configuration only describes input detection', inputConfig.includes('输入安全检测') && !inputConfig.includes('输出安全检测'));
  X.db.tasks = executionBackup;

  const liveTask = X.liveTasks()[0];
  X.open(liveTask.id);
  const detailView = captured['view'] || '';
  check('detail has visual result hero', detailView.includes('detail-hero') && detailView.includes('场景风险趋势'));
  check('detail configuration is compact strip', detailView.includes('task-config-strip'));
  check('detail reuses coordinated battle board', detailView.includes('battle-board coordinated embedded'));
  check('detail has one compact export control', (detailView.match(/class="report-export/g) || []).length === 1);
  X.inspectArenaNode('target');
  check('task-detail target opens its own floating details', (captured['view'] || '').includes('flow-inspector') && (captured['view'] || '').includes('系列 '+liveTask.targetMeta.family) && X.selected === liveTask.id);
  X.inspectArenaNode('blue');
  check('task-detail module switching preserves the task and shows blue details', X.selected === liveTask.id && (captured['view'] || '').includes('蓝队防守配置') && ((captured['view'] || '').match(/class="flow-inspector"/g) || []).length === 1);
  X.inspectArenaNode('blue');
  check('task-detail floating details can be closed', !(captured['view'] || '').includes('flow-inspector'));

  X.detailTab = 'report'; A.render();
  const reportView = captured['view'] || '';
  check('report preview is enriched', reportView.includes('演练结论') && reportView.includes('重点发现与建议') && reportView.includes('关键指标'));
  check('report uses one visible export menu', (reportView.match(/class="report-export/g) || []).length === 1 && !reportView.includes('报告与样本'));

  X.setTab('series');
  let seriesView = captured['view'] || '';
  check('model series is a separate workspace page', seriesView.includes('model-series-page') && seriesView.includes('关联任务') && !seriesView.includes('battle-board coordinated'));
  check('workspace navigation exposes an independent series page', (captured['center-sidebar'] || '').includes("App.centers.go('series')") && (captured['center-sidebar'] || '').includes('aria-label="模型系列"'));
  const seriesTasks = X.db.tasks.filter(t => t.targetMeta.family === X.seriesFamily);
  check('series version results link to actual task IDs', seriesTasks.length > 0 && seriesTasks.every(t => seriesView.includes('data-task="'+t.id+'"') && seriesView.includes(t.targetMeta.version) && seriesView.includes(A.escape(X.targetFor(t).name))));
  const familyFixture = JSON.parse(JSON.stringify(seriesTasks[0]));
  familyFixture.id = 'SMOKE-CUSTOM-FAMILY'; familyFixture.name = '自研系列回归验证'; familyFixture.targetMeta = {family:'自研安全模型',version:'v1.2'};
  X.db.tasks.push(familyFixture); X.selectSeries(familyFixture.targetMeta.family); seriesView = captured['view'] || '';
  check('selecting a family filters its real associated tasks', seriesView.includes('自研安全模型') && seriesView.includes('v1.2') && seriesView.includes('data-task="SMOKE-CUSTOM-FAMILY"') && seriesTasks.every(t => !seriesView.includes('data-task="'+t.id+'"')));
  X.db.tasks = X.db.tasks.filter(t => t.id !== familyFixture.id);

  const searchBackup = {tasks:X.db.tasks,query:X.query,filter:X.filter,targetFilter:X.targetFilter,timeSort:X.timeSort};
  const searchFixture = JSON.parse(JSON.stringify(X.db.tasks[0]));
  searchFixture.id = 'id-only-search-needle'; searchFixture.name = '任务名称命中'; searchFixture.targetSnapshot.name = 'target-only-search-needle';
  X.db.tasks = [searchFixture]; X.filter = 'all'; X.targetFilter = 'all';
  X.query = '  任务名称  ';
  check('task search trims whitespace and matches task names', X.filteredTasks().length === 1);
  X.query = 'target-only-search-needle';
  check('task text search does not match target names', X.filteredTasks().length === 0);
  X.query = 'id-only-search-needle';
  check('task text search does not match task IDs', X.filteredTasks().length === 0);
  X.query = ''; X.targetFilter = searchFixture.targetSnapshot.id;
  check('target dropdown remains independent of task-name search', X.filteredTasks().length === 1);
  X.targetFilter = 'missing-target';
  check('target dropdown still excludes other targets', X.filteredTasks().length === 0);
  X.db.tasks = searchBackup.tasks; X.query = searchBackup.query; X.filter = searchBackup.filter; X.targetFilter = searchBackup.targetFilter; X.timeSort = searchBackup.timeSort;

  // ---- focused task definition: target identity + OpenRT black-box methods ----
  X.newTask();
  const wizardStep1 = captured['view'] || '';
  check('target definition only adds family and version labels', wizardStep1.includes('定义任务与靶标') && wizardStep1.includes('系列名称') && wizardStep1.includes('版本标签') && !/提供方|部署环境|模型规格|构建版本/.test(wizardStep1));
  check('selected target name matches model management', wizardStep1.includes(A.escape(X.model(X.wizard.model).name)));
  X.wizard.name = '多题库黑盒演练';
  X.wizard.targetFamily = '自动化回归系列';
  X.wizard.targetVersion = 'v2.1';
  X.wizard.step = 2; X.wizardModal();
  const wizardStep2 = captured['view'] || '';
  check('exercise banks support independent multi-select', wizardStep2.includes('bank-multi-grid') && wizardStep2.includes('type="checkbox"'));
  check('old bank count preview is removed', !wizardStep2.includes('bank-selection-meta') && !wizardStep2.includes('道题目'));
  check('OpenRT technique categories are used', ['LLM 驱动优化','语言与编码','上下文欺骗'].every(name => wizardStep2.includes(name)) && wizardStep2.includes('technique-category'));
  check('individual methods and black-box labels are hidden', !wizardStep2.includes('technique-method') && !wizardStep2.includes('NanoGCG') && !wizardStep2.includes('白盒'));
  check('categories have concise descriptions', wizardStep2.includes('持续改写输入') && wizardStep2.includes('语言结构变换') && wizardStep2.includes('虚构情境'));

  X.wizard.bankIds = A.banks.db.slice(0, 2).map(b => b.id);
  X.wizard.bankId = X.wizard.bankIds[0];
  X.wizard.methods = ['Direct', 'CipherChat'];
  X.wizard.scenes = ['jailbreak', 'obfuscation'];
  X.wizard.step = 3; X.wizardModal();
  const wizardStep3 = captured['view'] || '';
  check('roles consistently use red blue judge', ['>红队<','>蓝队<','>裁判<','裁判模型'].every(label => wizardStep3.includes(label)) && !wizardStep3.includes('评价模型') && !wizardStep3.includes('Judge'));
  check('blue strategy is simplified and positioned', wizardStep3.includes('基准防守') && wizardStep3.includes('系统提示词加固') && wizardStep3.includes('输入/输出护栏') && !wizardStep3.includes('自由组合') && !wizardStep3.includes('模型防护'));

  const css = fs.readFileSync(path.join(root, 'src', 'task-design-refinement.css'), 'utf-8');
  check('quick actions reserve fixed slots', css.includes('grid-template-columns:30px 30px 56px') && X.taskRowHTML(X.db.tasks).includes('task-action-placeholder'));
  check('sidebar proportions match shared centers', css.includes('--nav-width:192px') && css.includes('min-height:44px') && css.includes('height:80px'));

  X.wizard.step = 3;
  X.wizard.judge = X.wizard.judge || A.connections.db[0].id;
  const bankItemCount = X.wizard.bankIds.reduce((n, id) => n + A.banks.get(id).items.length, 0);
  const beforeTasks = X.db.tasks.length;
  X.confirmTask();
  check('launch confirmation opens a concise modal without creating a task', X.db.tasks.length === beforeTasks && (captured['modal'] || '').includes('确认启动攻防任务') && (captured['modal'] || '').includes('返回配置') && (captured['modal'] || '').includes('确认启动'));
  X.launchTask();
  const created = X.db.tasks[0];
  check('multi-bank snapshot is combined', X.db.tasks.length === beforeTasks + 1 && created.bankSnapshot.bankIds.length === 2 && created.bankSnapshot.items.length === bankItemCount);
  check('task stores only the selected family and version labels', JSON.stringify(created.targetMeta) === JSON.stringify({family:'自动化回归系列',version:'v2.1'}));
  check('task target keeps the exact model-management name', X.targetFor(created).name === X.model(created.model).name);
  check('task uses selected focused methods only', created.engine.methods.length === 2 && created.engine.methods.every(id => ['Direct','CipherChat'].includes(id)));
  X.setTab('series'); X.selectSeries('自动化回归系列');
  check('newly launched task appears in its selected model series', (captured['view'] || '').includes('data-task="'+created.id+'"') && (captured['view'] || '').includes('v2.1'));
  X.open(created.id); X.detailTab = 'report'; A.render();
  check('attack pages use judge terminology consistently', !/评价模型|Judge|评价结果|评价结论|有效评价/.test(captured['view'] || '') && (captured['view'] || '').includes('裁判'));

  const dbBackup = JSON.parse(JSON.stringify(A.data.attack));
  const customized = X.db.tasks.find(t => t.id === 'EV-260920-101');
  customized.targetMeta = {family:'企业自研系列',version:'release-3'};
  customized.engine.roles = {attacker:{id:'enterprise-attacker',name:'自研攻击模型 v2',model:'enterprise-attack-v2'},judge:{id:'enterprise-judge',name:'企业裁判 v4',model:'enterprise-judge-v4'}};
  customized.engine.attacker = customized.engine.roles.attacker.name;
  customized.engine.judge = customized.engine.roles.judge.name;
  X.db.defaults.attacker = saved.id; X.db.defaults.judge = saved.id;
  const customBefore = JSON.stringify({meta:customized.targetMeta,roles:customized.engine.roles,attacker:customized.engine.attacker,judge:customized.engine.judge});
  A.modules.attack.init();
  const reloaded = X.db.tasks.find(t => t.id === customized.id);
  check('reinitialization preserves existing customized target labels and roles', JSON.stringify({meta:reloaded.targetMeta,roles:reloaded.engine.roles,attacker:reloaded.engine.attacker,judge:reloaded.engine.judge}) === customBefore);
  check('reinitialization preserves customized default role selections', X.db.defaults.attacker === saved.id && X.db.defaults.judge === saved.id);
  A.data.attack = dbBackup;

  console.log('\n' + out.join('\n'));
  console.log('\n--- one model card ---');
  console.log(view2.match(/<article class="card attack-model-card">[\s\S]*?<\/article>/)?.[0] || '(card not found)');
  console.log('\n--- add-connection form ---');
  console.log(modal.slice(0, 800));
  process.exit(out.some(l => l.startsWith('FAIL')) ? 1 : 0);
})();
