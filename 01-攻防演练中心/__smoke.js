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
  check('sidebar menu items omit leading icons', !sidebar.includes('center-nav-icon'));
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
  const pausedDemo = X.db.tasks.find(t => t.id === 'EV-260919-077');
  check('paused demo has remaining four-round work and low concurrency', pausedDemo?.status === 'paused' && X.metrics(pausedDemo).done < X.metrics(pausedDemo).total && pausedDemo.engine.concurrency === 1 && pausedDemo.units.some(u => u.result === 'pending' && u.rounds === 4));
  const savedDemoTasks = X.db.tasks;
  const legacyDemo = JSON.parse(JSON.stringify(pausedDemo));
  legacyDemo.units = legacyDemo.units.slice(0, 16);
  legacyDemo.units.forEach(X.finishUnit);
  legacyDemo.status = 'paused';
  legacyDemo.engine.concurrency = 4;
  X.db.tasks = [legacyDemo]; X.db.pausedDemoContinuationVersion = 0;
  A.modules.attack.init();
  check('existing paused 16/16 demo migrates to 16/24 with pending records', legacyDemo.units.length === 24 && X.metrics(legacyDemo).done === 16 && legacyDemo.engine.concurrency === 1 && legacyDemo.status === 'paused');
  X.taskAction(legacyDemo.id, 'toggle');
  for (let i = 0; i < 5; i++) X.tick();
  check('resumed paused demo stays running and visibly advances', legacyDemo.status === 'running' && X.metrics(legacyDemo).done < 24 && legacyDemo.units.some(u => u.result === 'pending' && u.events?.length) && X.battleBoardHTML(legacyDemo).includes('attack-live-float'));
  X.db.tasks = savedDemoTasks; X.db.pausedDemoContinuationVersion = 1;

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
  check('arena presents one attack chain with separate target and blue team', ['>红队<','>靶标<','>裁判<','flow-group node-target','flow-group node-blue','blue-target-link'].every(label => arenaView.includes(label)));
  check('arena only contains the live board, not model-series results', !arenaView.includes('model-series-page') && !arenaView.includes('模型系列安全结果') && !arenaView.includes('系列概览'));
  check('arena uses task execution progress label', arenaView.includes('任务执行进度') && !arenaView.includes('题目进度'));
  check('arena module detail is collapsed initially', !arenaView.includes('flow-inspector'));
  X.inspectArenaNode('attack'); arenaView = captured['view'] || '';
  check('arena module detail opens beside clicked module', arenaView.includes('flow-inspector') && arenaView.includes('红队攻击配置'));
  X.focusNode = 'attack';
  const pausedRedPanel = X.battleBoardHTML(pausedDemo);
  check('red inspector labels attack model and exact method without extra prose', pausedRedPanel.includes('攻击模型：DeepSeek-V3.2') && pausedRedPanel.includes('攻击方法：反馈式改写') && !pausedRedPanel.includes('过程裁判决定是否继续'));
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
  multiTask.status = 'running'; multiTask.engine.concurrency = 1; multiTask.engine.maxRounds = 4;
  multiTask.defense = {mode:'existing',parts:[],prompt:''};
  const multiUnit = {...multiTask.units[0],index:0,method:'PAIR',rounds:4,result:'pending',events:[],roundHistory:[],eventSchema:5};
  for (const key of ['response','attackPrompt','verdict','finished','blueBlocked','rawResponse','currentRound']) delete multiUnit[key];
  multiTask.units = [multiUnit]; X.db.tasks = [multiTask];
  const liveRoundBoard = X.battleBoardHTML(multiTask);
  check('live multi-turn window names the method and current four-round progress', liveRoundBoard.includes('attack-live-float') && liveRoundBoard.includes('第 1 / 4 轮') && liveRoundBoard.includes('攻击输入') && liveRoundBoard.includes('反馈式改写'));
  X.presentedAttackIds.set(multiTask.id, multiUnit.id);
  X.tick();
  check('same attack progresses without restarting the whole-card flash', X.battleBoardHTML(multiTask).includes('internal-stage-track') && !X.battleBoardHTML(multiTask).includes('new-attack'));
  X.presentedAttackIds.set(multiTask.id, 'previous-record');
  check('switching to the next attack flashes only once', X.battleBoardHTML(multiTask).includes('new-attack') && !X.battleBoardHTML(multiTask).includes('new-attack'));
  for (let i = 0; i < 12 && !multiUnit.roundHistory.length; i++) X.tick();
  check('multi-turn attack remains pending after first-round judge feedback', multiUnit.roundHistory.length === 1 && multiUnit.roundHistory[0].round === 1 && multiUnit.result === 'pending' && multiUnit.verdict.includes('继续改写'));
  for (let i = 0; i < 30 && multiTask.status === 'running'; i++) X.tick();
  check('multi-turn attack preserves four rounds and completes the final verdict', multiTask.status === 'done' && multiUnit.roundHistory.length === 4 && multiUnit.events.some(e => e.round === 4 && e.phase === 0) && multiUnit.events.some(e => e.round === 4 && e.phase === 4) && multiUnit.attackPrompt.includes('根据裁判反馈改写') && multiUnit.result !== 'pending' && !X.battleBoardHTML(multiTask).includes('attack-live-float'));
  const guardTask = JSON.parse(JSON.stringify(executionBackup[0]));
  guardTask.status = 'running'; guardTask.engine.concurrency = 1; guardTask.engine.maxRounds = 1;
  guardTask.defense = {mode:'guard',guardType:'rules',parts:['rules'],rules:{keywords:['input-regression-block'],input:true,output:false}};
  const guardUnit = {...guardTask.units[0],index:0,method:'Direct',rounds:1,result:'pending',events:[],roundHistory:[],blueEvidence:[],eventSchema:5,seedPrompt:'input-regression-block'};
  for (const key of ['response','attackPrompt','verdict','finished','blueBlocked','rawResponse','currentRound']) delete guardUnit[key];
  guardTask.units = [guardUnit]; X.db.tasks = [guardTask];
  X.tick(); X.tick();
  const blockedBoard = X.battleBoardHTML(guardTask);
  check('input interception skips target response and output defense in the live chain', guardUnit.blueBlocked === 'input' && guardUnit.result === 'pending' && (blockedBoard.match(/class="skipped"/g) || []).length === 2);
  for (let i = 0; i < 12 && guardTask.status === 'running'; i++) X.tick();
  check('finished input interception hides the transient attack window', guardUnit.result === 'defended' && !X.battleBoardHTML(guardTask).includes('attack-live-float'));
  const inputConfig = X.compactConfigHTML(guardTask);
  check('input-only guard configuration only describes input detection', inputConfig.includes('输入安全检测') && !inputConfig.includes('输出安全检测'));

  // Task snapshots must preserve task context, individual rounds, and honest guard evidence.
  check('live internal flow identifies the same sample as the records table', liveRoundBoard.includes('class="mono">'+multiUnit.id+'</b>'));
  check('each completed round stores its own response and verdict', multiUnit.roundHistory.every(r=>r.rawResponse && r.verdict && r.finishedAt));
  const snapshotNavigation={selected:X.selected,tab:X.tab,detailTab:X.detailTab,arena:X.arena};
  multiTask.id='snapshot-multi';guardTask.id='snapshot-input';X.db.tasks=[multiTask,guardTask];
  X.selected=multiTask.id;X.tab='tasks';X.detailTab='board';
  const originalRounds=JSON.stringify(multiUnit.roundHistory),snapshotTaskJSON=JSON.stringify(multiTask),snapshotArena=JSON.stringify(X.arena);
  X.selectSnapshotRound(multiTask.id,'round-1');
  check('round selection shows the saved earlier round rather than the final input', X.snapshotData(multiTask).round.round===1 && X.taskBoardHTML(multiTask).includes('第 1 轮') && X.snapshotData(multiTask).round.prompt===multiUnit.roundHistory[0].prompt && X.snapshotData(multiTask).round.prompt!==multiUnit.attackPrompt);
  X.selectSnapshotRound(multiTask.id,'round-4');
  check('last round and first round remain independently selectable', X.snapshotData(multiTask).round.round===4 && JSON.stringify(multiUnit.roundHistory)===originalRounds);
  check('snapshot inspection does not mutate task data or jump to the arena', JSON.stringify(multiTask)===snapshotTaskJSON && JSON.stringify(X.arena)===snapshotArena && X.selected===multiTask.id && X.tab==='tasks' && X.detailTab==='board');
  check('a defended judgment without a guard never claims input/output interception', X.snapshotData(multiTask).input.label==='未配置' && X.snapshotData(multiTask).output.label==='未配置' && !X.taskBoardHTML(multiTask).includes('输出层防住'));
  check('snapshot view has a draggable labeled range and no live-arena navigation', X.taskBoardHTML(multiTask).includes('type="range"') && X.taskBoardHTML(multiTask).includes('攻击快照时间轴') && !/showArena|switchLive|attack-live-float/.test(X.taskBoardHTML(multiTask)));
  X.selected=guardTask.id;
  check('input interception highlights input defense and skips output', X.snapshotData(guardTask).input.label==='输入层防住' && X.snapshotData(guardTask).output.label==='已跳过' && X.taskBoardHTML(guardTask).includes('未攻破'));
  check('single-turn snapshot has no round selector', !X.taskBoardHTML(guardTask).includes('选择快照轮次'));
  const outputTask=JSON.parse(JSON.stringify(guardTask));outputTask.id='snapshot-output';outputTask.status='running';
  outputTask.defense.rules={keywords:['安全'],input:false,output:true};
  const outputUnit={id:'S-0002',index:0,questionId:guardUnit.questionId,method:'Direct',rounds:1,result:'pending',events:[],roundHistory:[],eventSchema:5,seedPrompt:'output-regression'};outputTask.units=[outputUnit];X.db.tasks=[outputTask];
  for(let i=0;i<6&&outputTask.status==='running';i++)X.tick();
  check('output-only interception stores original and final objects separately', outputUnit.blueBlocked==='output' && outputUnit.roundHistory[0].rawResponse!==outputUnit.roundHistory[0].response && outputUnit.roundHistory[0].verdict.includes('输出'));
  check('output snapshot highlights the correct layer and judge independently', X.snapshotData(outputTask).input.label==='未配置' && X.snapshotData(outputTask).output.label==='输出层防住' && X.taskBoardHTML(outputTask).includes('未攻破'));
  const legacyTask=JSON.parse(JSON.stringify(multiTask));legacyTask.id='snapshot-legacy';legacyTask.units[0].roundHistory=[];legacyTask.defense=outputTask.defense;
  check('legacy multi-turn record never invents missing round options', X.snapshotData(legacyTask).rounds.length===1 && X.taskBoardHTML(legacyTask).includes('逐轮明细未保存') && !X.taskBoardHTML(legacyTask).includes('选择快照轮次'));
  check('missing defense evidence stays unknown rather than claiming blocked', X.snapshotData(legacyTask).output.label==='未记录');
  const pendingTask={...multiTask,id:'snapshot-pending',units:[{id:'S-0001',method:'PAIR',rounds:4,result:'pending',events:[],roundHistory:[]}]};
  check('unstarted attack has no fabricated decision or rounds', X.snapshotData(pendingTask).round.result==='pending' && X.taskBoardHTML(pendingTask).includes('等待生成') && !X.taskBoardHTML(pendingTask).includes('选择快照轮次'));
  check('unstarted attack is not mislabeled as an old final record', !X.taskBoardHTML(pendingTask).includes('最终记录') && !X.taskBoardHTML(pendingTask).includes('旧记录') && !X.taskBoardHTML(pendingTask).includes('查看完整记录'));
  const activeSnapshot={...pendingTask,id:'snapshot-active',units:[{...pendingTask.units[0],currentRound:1,events:[{phase:3,round:1}],attackPrompt:'round-one',roundHistory:[]}]};
  X.snapshotData(activeSnapshot);
  activeSnapshot.units[0].roundHistory=[{round:1,prompt:'round-one',result:'defended'}];activeSnapshot.units[0].currentRound=2;
  check('selected executing round stays selected when it completes and next round begins', X.snapshotData(activeSnapshot).round.round===1 && X.snapshotData(activeSnapshot).round.recorded);
  const emptyTask={...multiTask,id:'snapshot-empty',units:[]};
  check('zero-record task has a useful empty state and no broken slider', X.taskBoardHTML(emptyTask).includes('暂无攻击记录') && !X.taskBoardHTML(emptyTask).includes('type="range"'));
  const selectionTask={...multiTask,id:'snapshot-selection',units:[{...multiUnit,id:'S-0001'},{...outputUnit,id:'S-0002'}]};X.db.tasks=[selectionTask];X.selected=selectionTask.id;
  X.selectSnapshot(selectionTask.id,1);
  check('slider and dropdown select the exact record without replacing their controls', X.snapshotData(selectionTask).unit.id==='S-0002' && document.getElementById('task-snapshot-range').value==='1' && document.getElementById('task-snapshot-content').innerHTML.includes('S-0002'));
  X.stepSnapshot(selectionTask.id,-1);X.selectSnapshot('another-task',1);
  check('previous/next and task-id validation keep snapshot selection local', X.snapshotData(selectionTask).unit.id==='S-0001');
  X.selectSnapshot(selectionTask.id,100);check('out-of-range selection clamps to the last record', X.snapshotData(selectionTask).index===1);
  X.selectSnapshotRound(selectionTask.id,'missing-round');check('invalid round does not change selection', X.snapshotData(selectionTask).round.key==='round-1');
  X.sample(selectionTask.units[1].id);const snapshotDrawer=document.getElementById('drawer').innerHTML;
  check('record drawer uses requested labels without redundant defense configuration', snapshotDrawer.includes('攻击题目') && snapshotDrawer.includes('最终判定对象') && !snapshotDrawer.includes('蓝队防守') && !snapshotDrawer.includes('<h3>攻击输入</h3>'));
  check('bank page no longer offers a template download', !A.banks.render().includes('下载导入模板'));
  Object.assign(X,snapshotNavigation);
  X.db.tasks = executionBackup;

  const liveTask = X.liveTasks()[0];
  X.open(liveTask.id);
  const detailView = captured['view'] || '';
  check('detail has evidence-led overview without fabricated trends', detailView.includes('analysis-overview') && detailView.includes('核心发现') && detailView.includes('下一步') && !detailView.includes('场景风险趋势'));
  check('detail configuration is compact strip', detailView.includes('task-config-strip'));
  check('detail uses a task-local frozen snapshot board', detailView.includes('attack-snapshots') && detailView.includes('snapshot-topology') && detailView.includes('选择攻击快照'));
  check('overview is one read-only card without an export shortcut',detailView.includes('task-summary-card')&&!detailView.includes('class="report-export')&&!X.detailHeroHTML(liveTask).includes('onclick='));
  check('detail configuration remains available above the read-only snapshot topology', detailView.includes('系列 '+liveTask.targetMeta.family) && detailView.includes('蓝队') && X.selected===liveTask.id);
  check('snapshot roles no longer trigger the live arena inspector', !X.taskBoardHTML(liveTask).includes('inspectArenaNode') && !X.taskBoardHTML(liveTask).includes('flow-inspector'));

  X.detailTab = 'report'; A.render();
  const reportView = captured['view'] || '';
  check('report keeps findings and evidence without coverage or methodology sections', reportView.includes('核心发现') && reportView.includes('下一步建议') && reportView.includes('重点攻破证据') && reportView.includes('场景风险分析') && !reportView.includes('覆盖缺口') && !reportView.includes('统计口径') && !reportView.includes('安全评级'));
  check('report uses one visible export menu', (reportView.match(/class="report-export/g) || []).length === 1 && !reportView.includes('报告与样本'));

  const analysisFixture = {engine:{methods:['Direct','PAIR']},bankSnapshot:{items:[{id:'Q-1',category:'隐私'}, {id:'Q-2'}, {id:'UNTESTED',category:'未测试类别'}]},units:[
    {id:'U-1',questionId:'Q-1',method:'Direct',result:'breach'},
    {id:'U-2',questionId:'Q-1',method:'PAIR',result:'breach'},
    {id:'U-3',questionId:'Q-2',method:'PAIR',result:'defended'},
    {id:'U-4',questionId:'Q-2',method:'PAIR',result:'error'},
    {id:'U-5',questionId:'Q-2',method:'Direct',result:'pending'}
  ]};
  const analysis = X.taskAnalysis(analysisFixture);
  check('analysis excludes errors and pending units from ASR', analysis.valid === 3 && analysis.errors === 1 && analysis.pending === 1 && analysis.asr === 66.7);
  check('analysis deduplicates breached questions across methods', analysis.breach === 2 && analysis.uniqueBreachQuestions === 1 && analysis.methods.length === 2);
  check('analysis coverage excludes unused bank questions', analysis.knownQuestions === 2 && analysis.classifiedQuestions === 1 && analysis.unclassifiedQuestions === 1 && analysis.categoryCoverage === 50);
  check('analysis does not infer zero ASR from missing results', X.taskAnalysis({...analysisFixture,units:analysisFixture.units.slice(3)}).asr === null && X.taskAnalysis({units:[]}).asr === null);
  const unidentified = X.taskAnalysis({...analysisFixture,units:[...analysisFixture.units,{id:'U-6',method:'Direct',result:'breach'}]});
  check('analysis does not invent unique question counts when identifiers are absent', unidentified.uniqueBreachQuestions === null && unidentified.unknownBreachQuestions === 1);
  const renderedReport = X.reportHTML();
  check('export shares scene analysis without UI controls or prototype banners', renderedReport.includes('重点攻破证据') && !renderedReport.includes('模拟数据') && renderedReport.includes('场景风险分析') && !renderedReport.includes('覆盖缺口') && !renderedReport.includes('统计口径') && !renderedReport.includes('安全评级') && !renderedReport.includes('onclick=') && !renderedReport.includes('NaN'));

  X.setTab('series');
  let seriesView = captured['view'] || '';
  check('version management uses a final-ASR table without scores, ranks or cards', seriesView.includes('model-results-table') && seriesView.includes('最终 ASR') && !/开始对比|用于对比|版本结果对比|type="checkbox"|防守得分|同方案第|result-overview|model-result-card|模拟数据|结果排序/.test(seriesView));
  check('workspace navigation exposes independent 版本管理 page', (captured['center-sidebar'] || '').includes("App.centers.go('series')") && (captured['center-sidebar'] || '').includes('aria-label="版本管理"') && seriesView.includes('版本管理'));
  const seriesTasks=[...X.db.tasks],modelRows=X.modelResultRows();
  check('all task-backed model families are shown initially', X.resultFilters.family==='all' && modelRows.some(r=>r.family==='Qwen2.5') && modelRows.some(r=>r.family==='Llama 3.1') && seriesView.includes('Qwen2.5') && seriesView.includes('Llama 3.1'));
  check('judge-only and red-team-only connections do not enter the result catalog', !modelRows.some(r=>['deepseek-judge','deepseek-v3'].includes(r.task.model)));
  check('six model presets include real task-backed simulated results', X.db.tasks.filter(t=>t.demoPreset==='model-results-v1').length===6 && modelRows.filter(r=>r.task.demoPreset==='model-results-v1').every(r=>r.task.simulated&&r.cohortSize===6&&r.rank!==null));
  const repeatRow=modelRows.find(r=>r.tasks.length>1);
  check('a model with multiple exercises retains its complete history', !!repeatRow);
  X.seriesHistory(repeatRow.key);
  const repeatRuns=repeatRow.tasks;
  check('version history opens on demand and contains all of its runs', repeatRuns.every(t=>(captured['modal']||'').includes('data-task="'+t.id+'"')));
  check('history offers results and reports without comparison actions', !/用于对比|对比本版本/.test(captured['modal']||'') && (captured['modal']||'').includes('报告'));
  X.resetSeriesFilters();
  X.searchSeries('72B-Instruct');
  check('model-name search narrows the result catalog', X.visibleResultRows().length===1 && (captured['view']||'').includes('72B-Instruct') && !(captured['view']||'').includes('32B-Instruct'));
  X.resetSeriesFilters();
  X.toggleResultTimeSort();
  const ascending=X.visibleResultRows();
  check('time sorting is user controlled and does not rank model scores', X.resultFilters.timeSort==='asc' && !X.seriesHTML().includes('得分从低到高'));
  X.resetSeriesFilters();
  const familyFixture = JSON.parse(JSON.stringify(seriesTasks[0]));
  familyFixture.id = 'SMOKE-CUSTOM-FAMILY'; familyFixture.name = '自研系列回归验证'; familyFixture.targetMeta = {family:'自研安全模型',version:'v1.2'};
  X.db.tasks.push(familyFixture); X.selectSeries(familyFixture.targetMeta.family); seriesView = captured['view'] || '';
  check('selecting a family filters its real associated tasks', seriesView.includes('自研安全模型') && seriesView.includes('v1.2') && seriesView.includes('data-task="SMOKE-CUSTOM-FAMILY"') && seriesTasks.every(t => !seriesView.includes('data-task="'+t.id+'"')));
  X.db.tasks = X.db.tasks.filter(t => t.id !== familyFixture.id);
  X.resetSeriesFilters();
  const rankA=JSON.parse(JSON.stringify(modelRows.find(r=>r.task.demoPreset).task));
  const rankB=JSON.parse(JSON.stringify(rankA));rankA.id='rank-a';rankB.id='rank-b';rankB.model='other-target';rankB.targetSnapshot.id='other-target';
  check('equal same-plan scores share a rank', X.modelResultRows([rankA,rankB]).every(r=>r.rank===1&&r.cohortSize===2));
  rankB.bankSnapshot.items[0].prompt+=' changed';
  check('same-named bank with changed questions never shares a ranking cohort', X.modelResultRows([rankA,rankB]).every(r=>r.rank===null));
  rankB.bankSnapshot=JSON.parse(JSON.stringify(rankA.bankSnapshot));rankB.engine.roles.judge.model='another-judge';
  check('different judge settings prevent a shared rank', X.modelResultRows([rankA,rankB]).every(r=>r.rank===null));
  rankB.engine=JSON.parse(JSON.stringify(rankA.engine));rankB.simulated=false;
  check('real and simulated runs cannot share a ranking cohort', X.modelResultRows([rankA,rankB]).every(r=>r.rank===null));
  rankB.simulated=true;rankB.units[0].result='error';
  check('runs containing execution errors can show scores but never rank', X.modelResultRows([rankA,rankB]).every(r=>r.rank===null) && X.modelResultRows([rankB])[0].score!==null);
  rankB.units.forEach(u=>u.result='pending');rankB.status='running';
  check('a started target without judgments is included with no score or rank', X.modelResultRows([rankB]).length===1 && X.modelResultRows([rankB])[0].score===null && X.modelResultRows([rankB])[0].rank===null);
  const recentPending=JSON.parse(JSON.stringify(rankA));recentPending.id='rank-new-pending';recentPending.status='paused';recentPending.created='2099-01-01 00:00';delete recentPending.finished;
  check('latest initiated task replaces previous completed task in version results', X.modelResultRows([rankA,recentPending])[0].task.id===recentPending.id);
  const noPlan=JSON.parse(JSON.stringify(rankA));delete noPlan.engine.evaluationVersion;
  check('missing plan metadata is not assumed comparable', X.resultPlanKey(noPlan)===null);
  check('public banks are installed with fixed counts and source revisions', [['jbb-harmful-100',100],['harmbench-standard-200',200],['safety-prompts-700',700]].every(([id,count])=>A.banks.get(id)?.items.length===count&&A.banks.get(id).provenance.revision.length===40));
  check('all catalog banks are generic and language-purpose-status controls are absent', A.banks.db.filter(b=>b.builtin).every(b=>b.industry==='通用') && !/语言筛选|评测用途|可用状态/.test(A.banks.render()));
  A.banks.catalog.source='custom';check('custom-source filtering excludes built-ins', A.banks.catalogRows().every(b=>!b.builtin));
  A.banks.catalog.source='builtin';check('built-in-source filtering excludes user banks', A.banks.catalogRows().length===5&&A.banks.catalogRows().every(b=>b.builtin));
  A.banks.catalog.source='all';A.banks.searchCatalog('Safety-Prompts');check('bank-name search locates the added dataset', A.banks.catalogRows().length===1&&A.banks.catalogRows()[0].id==='safety-prompts-700');A.banks.searchCatalog('');
  check('lightweight adapters preserve risk labels and original provenance', A.banks.get('harmbench-standard-200').items.every(q=>q.source.functionalCategory==='standard'&&q.category) && A.banks.get('safety-prompts-700').items.every(q=>q.source.rowIndex>=0&&q.category&&q.referenceResponse));
  const roundTripBank=A.banks.get('safety-prompts-700');
  const parsedBank=A.banks.parse(JSON.stringify({name:roundTripBank.name,provenance:roundTripBank.provenance,items:roundTripBank.items}),'roundtrip.json');
  check('exported public questions can be reimported with source labels and reference responses intact', parsedBank.items.length===700&&parsedBank.items[0].referenceResponse===roundTripBank.items[0].referenceResponse&&parsedBank.items[0].source.rowIndex===roundTripBank.items[0].source.rowIndex&&parsedBank.provenance.revision===roundTripBank.provenance.revision);
  const resultMigrationCount=X.db.tasks.filter(t=>t.demoPreset==='model-results-v1').length;
  A.modules.attack.init();
  check('reinitialization does not duplicate model result presets', X.db.tasks.filter(t=>t.demoPreset==='model-results-v1').length===resultMigrationCount);

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
  check('exercise banks use a searchable dropdown with independent checkboxes', wizardStep2.includes('id="bank-picker"') && wizardStep2.includes('id="bank-picker-search"') && wizardStep2.includes('type="checkbox"') && !wizardStep2.includes('bank-multi-grid'));
  check('bank dropdown starts collapsed', !X.bankPicker.open && /id="bank-picker-popup"[^>]+ hidden/.test(wizardStep2));
  const pickerBanks = A.banks.db.slice(0, 2);
  const originalQueryAll = document.querySelectorAll;
  const pickerOptions = pickerBanks.map(bank => {
    const option = makeEl('option-'+bank.id), input = makeEl('input-'+bank.id);
    option.dataset.bankName = bank.name.toLocaleLowerCase(); input.value = bank.id;
    input.focus = () => { document.activeElement = input; };
    option.querySelector = () => input;
    return option;
  });
  document.querySelectorAll = selector => selector === '#bank-picker .bank-picker-option' ? pickerOptions : originalQueryAll(selector);
  const pickerSearch = document.getElementById('bank-picker-search');
  const originalSearchFocus = pickerSearch.focus;
  pickerSearch.focus = () => { document.activeElement = pickerSearch; };
  X.toggleBankPicker(true);
  X.searchBanks('  SALAD  ');
  check('bank search matches names case-insensitively and trims whitespace', pickerOptions.filter(option => !option.hidden).length === 1 && pickerOptions.find(option => !option.hidden).dataset.bankName.includes('salad'));
  X.bankPickerKeydown({key:'ArrowDown',target:pickerSearch,preventDefault(){}});
  check('arrow navigation only focuses visible bank options', document.activeElement === pickerOptions.find(option => !option.hidden).querySelector('input'));
  X.searchBanks('missing-bank-query');
  check('bank search shows an empty state without changing selection', pickerOptions.every(option => option.hidden) && !document.getElementById('bank-picker-empty').hidden && document.getElementById('bank-picker-match-count').textContent === '匹配 0 个题库');
  X.searchBanks('salad');
  X.toggleBank(pickerBanks[0].id); X.toggleBank(pickerBanks[1].id);
  check('multi-select retains the open search without rerendering the wizard', X.wizard.bankIds.length === 2 && X.bankPicker.open && X.bankPicker.query === 'salad' && captured['view'] === wizardStep2);
  check('selected banks update the compact summary and count', document.getElementById('bank-picker-summary').textContent.includes(pickerBanks[0].name) && document.getElementById('bank-selected-count').textContent === '已选 2 个');
  X.toggleBank(pickerBanks[0].id);
  check('deselecting one bank preserves the other and its primary bank ID', X.wizard.bankIds.length === 1 && X.wizard.bankIds[0] === pickerBanks[1].id && X.wizard.bankId === pickerBanks[1].id);
  X.toggleBank('missing-bank');
  check('unknown bank IDs cannot be selected', X.wizard.bankIds.length === 1);
  X.bankPickerKeydown({key:'Escape',preventDefault(){},stopPropagation(){}});
  check('Escape closes the dropdown without clearing selection', !X.bankPicker.open && document.getElementById('bank-picker-popup').hidden && X.wizard.bankIds.length === 1);
  X.wizard.step = 1; X.wizardModal(); X.wizard.step = 2; X.wizardModal();
  check('returning to bank selection keeps checked banks and search', X.wizard.bankIds[0] === pickerBanks[1].id && (captured['view'] || '').includes('value="salad"') && (captured['view'] || '').includes('value="'+pickerBanks[1].id+'" checked'));
  X.clearBanks();
  check('clearing banks resets selection and required-field validation', X.wizard.bankIds.length === 0 && X.wizard.bankId === '' && document.getElementById('bank-picker-clear').disabled && X.taskValidation(X.wizard) === '请至少选择一个非空演练题库');
  check('clearing banks unchecks every visible and filtered-out option', pickerOptions.every(option => !option.querySelector('input').checked));
  document.querySelectorAll = originalQueryAll; pickerSearch.focus = originalSearchFocus;
  X.searchBanks(''); X.wizardModal();
  check('old bank count preview is removed', !wizardStep2.includes('bank-selection-meta') && !wizardStep2.includes('道题目'));
  check('OpenRT technique categories are used', ['LLM 驱动优化','语言与编码','上下文欺骗'].every(name => wizardStep2.includes(name)) && wizardStep2.includes('technique-family'));
  check('focused OpenRT methods appear within categories, excluding white-box', ['PAIR','CipherChat','FlipAttack','DeepInception','反馈式改写','编码表达','字符重排','嵌套情境'].every(name => wizardStep2.includes(name)) && !wizardStep2.includes('NanoGCG') && !wizardStep2.includes('白盒'));
  check('categories have concise descriptions', wizardStep2.includes('持续改写输入') && wizardStep2.includes('语言结构变换') && wizardStep2.includes('虚构情境'));
  check('method lists are collapsed by default', (wizardStep2.match(/class="technique-method-list" hidden/g)||[]).length===3);
  check('method families include four LLM methods and three context methods', X.openRTTechniqueGroups.find(g=>g.id==='llm-refinement').methods.length===4 && X.openRTTechniqueGroups.find(g=>g.id==='contextual').methods.length===3);
  X.toggleTechniqueDetails('llm-refinement');X.wizardModal();
  check('expansion survives method selection rerender', (captured['view']||'').includes('aria-expanded="true" aria-controls="methods-llm-refinement"'));
  X.toggleMethod('CipherChat');
  check('one language method can be selected without the other', X.wizard.methods.length === 1 && X.wizard.methods[0] === 'CipherChat' && (captured['view'] || '').includes('已选 1 种'));
  X.toggleTechnique('baseline');
  check('baseline remains a single category switch', X.wizard.methods.includes('Direct') && X.wizard.methods.includes('CipherChat') && !X.wizard.methods.includes('FlipAttack'));

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
  check('launch confirmation opens a concise modal with exact methods', X.db.tasks.length === beforeTasks && (captured['modal'] || '').includes('确认启动攻防任务') && (captured['modal'] || '').includes('直接提问') && (captured['modal'] || '').includes('编码表达') && (captured['modal'] || '').includes('<details>') && (captured['modal'] || '').includes('返回配置') && (captured['modal'] || '').includes('确认启动'));
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

  const methodBank={...A.banks.db[0],id:'smoke-method-bank',items:A.banks.db[0].items.slice(0,2)};
  A.data.banks ||= [];A.data.banks.push(methodBank);X.newTask();
  Object.assign(X.wizard,{name:'方法配置回归',step:3,bankIds:[methodBank.id],bankId:methodBank.id,methods:X.openRTTechniqueGroups.flatMap(g=>g.methods.map(m=>m.id))});
  const expectedMethods=[...X.wizard.methods];X.launchTask();
  const methodTask=X.db.tasks[0];
  check('every selectable method creates a complete run over every selected question', methodTask.units.length===expectedMethods.length*2 && expectedMethods.every(id=>methodTask.units.filter(u=>u.method===id).length===2));
  check('new LLM methods retain generator, judge and required auxiliary presets', methodTask.engine.bindings.every(b=>b.registry&&b.judge&&(!X.methodDependencies[b.method].gen||b.generator)) && methodTask.engine.bindings.find(b=>b.method==='DrAttack').auxiliary.embedding.model==='text-embedding-3-large' && methodTask.engine.bindings.find(b=>b.method==='AutoDAN-Turbo').auxiliary.summarizer===methodTask.engine.roles.attacker.id);
  X.repeatTask(methodTask.id);
  check('repeating a task retains all expanded attack methods', expectedMethods.every(id=>X.wizard.methods.includes(id)));

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

  // Unified scene tags survive import, bank edits and historical task snapshots.
  const S=A.sceneTags,B=A.banks;
  const originalDownload=A.download;let templateText='';A.download=(name,text)=>{templateText=text;};B.template();A.download=originalDownload;
  const templateObject=JSON.parse(templateText),templateParsed=B.parse(templateText,'template.json');
  check('JSON template includes scene instructions and parses labels automatically',templateObject.schemaVersion===2&&templateObject._场景分类&&templateParsed.items.length===2&&S.resolve(templateParsed.items[0])[0]==='privacy');
  let missingScenes=false;try{B.parse(JSON.stringify({schemaVersion:2,items:[{prompt:'missing scene'}]}),'missing.json');}catch(e){missingScenes=/scenes/.test(e.message);}
  check('new JSON schema rejects missing scene arrays',missingScenes);
  check('snapshot timeline is below the selected record content',X.taskBoardHTML(liveTask).indexOf('id="task-snapshot-range"')>X.taskBoardHTML(liveTask).indexOf('id="task-snapshot-content"'));
  check('risk scenes are independent of attack methods and languages', S.catalog.filter(s=>!s.standard).length===8 && !S.catalog.some(s=>/Direct|PAIR|中文|英文/.test(s.label)));
  check('standard reference taxonomy has 31 traceable risks in five groups',S.catalog.filter(s=>s.standard).length===31&&new Set(S.catalog.filter(s=>s.standard).map(s=>s.group)).size===5&&S.catalog.find(s=>s.label==='侵害隐私权').clause==='A.4.e');
  check('dataset source categories resolve to product scene labels', S.resolve({category:'Malware/Hacking'})[0]==='cyber' && S.resolve({category:'O33: Inferring Personal Information'})[0]==='privacy' && S.resolve({category:'违法犯罪'})[0]==='illegal');
  check('unknown and broad source categories are not guessed', S.resolve({category:'harmful'}).length===0 && S.resolve({prompt:'unknown'}).length===0 && S.resolve({category:'O66: Copyright Infringement'}).length===0);
  check('explicit empty tags preserve manual unclassified decision', S.resolve({category:'Privacy',sceneTags:[]}).length===0);
  check('multiple tags are normalized without duplicates', S.resolve({sceneTags:['privacy','privacy','cyber','invalid']}).join(',')==='privacy,cyber');
  const tagImport=B.parse(JSON.stringify({items:[{id:'tag-1',prompt:'tag test',category:'Privacy',sceneTags:['隐私与数据泄露','cyber']}]}),'tags.json');
  check('scene-tag import preserves original labels and normalized tags', tagImport.items[0].category==='Privacy' && tagImport.items[0].sceneTags.join(',')==='privacy,cyber');
  const customImport=B.parse(JSON.stringify([{prompt:'custom tag test',sceneTags:['知识产权']}]),'tags.json');
  check('unknown named import tags become portable custom definitions',customImport.items[0].sceneTags[0].startsWith('custom-')&&customImport.items[0].sceneTagDefinitions[0].label==='知识产权');
  let badTag=false;try{B.parse(JSON.stringify([{prompt:'tag test',sceneTags:[123]}]),'tags.json');}catch(e){badTag=true;}
  check('invalid imported scene tag types still raise a validation error',badTag);
  const snapshotCase={id:'SCENE-TEST',name:'场景联动测试',status:'done',created:'2026-09-30',model:'m1',scenes:['jailbreak'],defense:{mode:'existing'},engine:{methods:['Direct']},bankSnapshot:{name:'标签测试',items:[{id:'A',prompt:'first',sceneTags:['privacy','cyber']},{id:'B',prompt:'second',sceneTags:['hate']},{id:'C',prompt:'third',sceneTags:[]}]},units:[{id:'S-0001',questionId:'A',method:'Direct',rounds:1,result:'breach',response:'stored response',verdict:'stored verdict'},{id:'S-0002',questionId:'A',method:'Direct',rounds:1,result:'defended'},{id:'S-0003',questionId:'B',method:'Direct',rounds:1,result:'defended'},{id:'S-0004',questionId:'C',method:'Direct',rounds:1,result:'error',errorCode:'timeout'},{id:'S-0005',questionId:'C',method:'Direct',rounds:1,result:'pending'}]};
  const sceneAnalysis=X.taskAnalysis(snapshotCase),privacy=sceneAnalysis.scenes.find(s=>s.id==='privacy'),unused=sceneAnalysis.scenes.find(s=>s.id==='illegal');
  check('multi-label scene analysis never double counts overall results',sceneAnalysis.valid===3 && sceneAnalysis.breach===1 && sceneAnalysis.asr===33.3 && privacy.valid===2 && privacy.breach===1 && privacy.questions===1);
  check('uncovered scene metrics remain null rather than zero',unused.asr===null && unused.total===0);
  check('scene report categorizes execution errors',sceneAnalysis.errorGroups.some(g=>g.id==='timeout'&&g.count===1));
  const sceneTaskList=X.db.tasks,sceneSelected=X.selected;
  X.db.tasks=[snapshotCase];X.open(snapshotCase.id);X.filterRecordsByScene('privacy','breach');
  check('report drill-down selects matching scene and result',X.detailTab==='samples' && X.sampleScene==='privacy' && X.sampleFilter==='breach' && X.sceneRecordRows().length===1 && X.sceneRecordRows()[0].id==='S-0001');
  X.selection().clear();X.selectVisible(true);
  check('selecting filtered records does not select other scenes or results',X.selection().size===1 && X.selection().has('S-0001'));
  X.filterRecordsByScene('unclassified');
  check('unclassified drill-down preserves result filtering and excludes pending',X.sceneRecordRows().length===1&&X.sceneRecordRows()[0].id==='S-0004');
  X.sampleQuery='missing query';X.analysisNavigate('breach');
  check('global evidence navigation clears stale scene and query filters',X.sampleScene==='all' && !X.sampleQuery && X.sceneRecordRows().length===1);
  const sceneReport=X.report(snapshotCase),sceneExport=X.reportHTML();
  check('report only charts task-related scenes and hides unused table rows',sceneReport.includes('攻击成功率雷达图')&&!sceneReport.includes('data-scene="illegal"')&&!sceneReport.includes('违法犯罪')&&!sceneReport.includes('防守率')&&!sceneReport.includes('NaN'));
  check('report export contains complete evidence index and no interactive controls',sceneExport.includes('完整攻破记录索引')&&sceneExport.includes('stored response')&&!sceneExport.includes('onclick=')&&!sceneExport.includes('模拟数据'));
  check('record export carries original question and scene tags',X.sampleJSON(snapshotCase.units[0]).sceneTags.join(',')==='privacy,cyber'&&X.sampleJSON(snapshotCase.units[0]).question.id==='A');
  const bankForEdit=B.get('jbb-harmful-100'),questionForEdit=bankForEdit.items[0],originalQuestion=JSON.parse(JSON.stringify(questionForEdit)),frozenQuestion=JSON.parse(JSON.stringify(questionForEdit)),annotationBackup=JSON.parse(JSON.stringify(A.data.sceneAnnotations||{}));
  B.open(bankForEdit.id);B.editScenes(bankForEdit.id,questionForEdit.id);B.sceneDraft.tags=['privacy'];B.saveScenes();
  check('manual label edits persist without changing original taxonomy',questionForEdit.sceneTags[0]==='privacy'&&questionForEdit.category===originalQuestion.category&&A.data.sceneAnnotations[JSON.stringify([bankForEdit.id,questionForEdit.id])].tags[0]==='privacy');
  check('bank edits do not mutate an existing question snapshot',JSON.stringify(frozenQuestion)===JSON.stringify(originalQuestion));
  Object.keys(questionForEdit).forEach(k=>delete questionForEdit[k]);Object.assign(questionForEdit,originalQuestion);A.data.sceneAnnotations=annotationBackup;
  const sceneRegistryBackup=JSON.parse(JSON.stringify(A.data.sceneTagCatalog||[]));
  B.create();B.merge(customImport.items);B.edit();
  const customTagId=B.draft.items[0].sceneTags[0];
  check('import preview displays parsed labels without manual dropdowns',!captured.modal.includes('第 1 题攻击场景')&&captured.modal.includes('知识产权')&&captured.modal.includes('下载 JSON 模板'));
  B.chooseScene('0','privacy');
  check('import preview supports multiple tags without changing source category',S.resolve(B.draft.items[0]).includes(customTagId)&&S.resolve(B.draft.items[0]).includes('privacy'));
  B.removeScene('0','privacy');
  check('removing one draft tag leaves the other intact',S.resolve(B.draft.items[0]).join(',')===customTagId);
  B.chooseScene('0','__custom');document.getElementById('scene-custom-0').value='  行业规范  ';B.addCustomScene('0');
  const secondCustom=B.draft.items[0].sceneTags[1];
  check('custom draft label is normalized and immediately selectable',S.label(secondCustom)==='行业规范'&&captured.modal.includes('行业规范'));
  const portableQuestion=JSON.parse(JSON.stringify(B.draft.items[0]));B.draft=null;
  check('cancelling draft does not persist its custom catalog',!S.catalog.some(s=>s.id===customTagId||s.id===secondCustom));
  const roundTrip=B.parse(JSON.stringify([portableQuestion]),'round-trip.json').items[0];
  check('custom tags round-trip with the same identifiers and labels',roundTrip.sceneTags.join(',')===portableQuestion.sceneTags.join(',')&&roundTrip.sceneTagDefinitions.map(s=>s.label).join(',')==='知识产权,行业规范');
  const detachedTask={...snapshotCase,bankSnapshot:{items:[roundTrip]},units:[{id:'S-0098',questionId:roundTrip.id,method:'Direct',result:'breach'}]};
  check('historical custom scene snapshot can render independently of live tag registry',X.taskAnalysis(detachedTask).relatedScenes.some(s=>s.id===customTagId&&s.label==='知识产权')&&S.html(roundTrip).includes('知识产权'));
  const standardImport=B.parse(JSON.stringify([{prompt:'standard risk',sceneTags:['侵害隐私权']}]),'standard.json').items[0];
  check('standard-tag question preserves its standard and clause reference',standardImport.sceneTagReferences[0].standard==='GB/T 45654—2025'&&standardImport.sceneTagReferences[0].clause==='A.4.e');
  B.create();B.merge([roundTrip]);B.draft.name='Custom scene smoke';
  const bankStorageBackup=JSON.parse(JSON.stringify(A.data.banks||[])),storageSave=localStorage.setItem;localStorage.setItem=()=>{throw Error('quota');};B.saveDraft();
  check('storage failure rolls back custom catalog and retains import draft',!!B.draft&&JSON.stringify(A.data.sceneTagCatalog)===JSON.stringify(sceneRegistryBackup)&&JSON.stringify(A.data.banks)===JSON.stringify(bankStorageBackup));
  localStorage.setItem=storageSave;B.saveDraft();
  const savedCustomBank=A.data.banks.find(b=>b.name==='Custom scene smoke');
  check('saved custom tags persist together with their question bank',!!savedCustomBank&&S.label(customTagId)==='知识产权');
  const customTask={...snapshotCase,bankSnapshot:{items:savedCustomBank.items},units:[{id:'S-0099',questionId:savedCustomBank.items[0].id,method:'Direct',result:'error',errorCode:'timeout'}]};
  const customAnalysis=X.taskAnalysis(customTask),customReport=X.report(customTask);
  check('custom scene reports preserve error-only scenarios without zero ASR',customAnalysis.scenes.find(s=>s.id===customTagId)?.asr===null&&customReport.includes('知识产权')&&customReport.includes('无有效判定')&&!customReport.includes('违法犯罪'));
  check('fewer than three valid scenes uses bars instead of a misleading radar',!customReport.includes('role="img"')&&customReport.includes('场景攻击成功率'));
  const emptySceneReport=X.report({...snapshotCase,bankSnapshot:{items:[]},units:[]});
  check('empty report does not show unrelated scene categories',!emptySceneReport.includes('data-scene="')&&!emptySceneReport.includes('违法犯罪'));
  A.data.banks=bankStorageBackup;A.data.sceneTagCatalog=sceneRegistryBackup;B.draft=null;
  X.db.tasks=sceneTaskList;X.selected=sceneSelected;X.sampleQuery='';X.sampleScene='all';

  console.log('\n' + out.join('\n'));
  console.log('\n--- one model card ---');
  console.log(view2.match(/<article class="card attack-model-card">[\s\S]*?<\/article>/)?.[0] || '(card not found)');
  console.log('\n--- add-connection form ---');
  console.log(modal.slice(0, 800));
  process.exit(out.some(l => l.startsWith('FAIL')) ? 1 : 0);
})();
