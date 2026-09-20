/* app.js — 书安·智矛 漏洞检测控制台 · 静态 demo
 *
 * 由 web_console/frontend 的 React 视图（Shell / DashboardView / ServiceView /
 * ProjectsView / ProjectDetailView 及子视图 / ModelsView /
 * FindingDrawer / CandidateDrawer / NewProjectModal / ReportView）翻译为原生 JS。
 * 数据只读 demo/assets/data.js（window.DEMO_DATA），不依赖任何后端。
 * 原始产物文件置于 demo/output/<job-id>/ 下，结果文件链接指向这份真实副本。
 */
(function () {
  'use strict';

  var D = window.DEMO_DATA;
  if (!D) {
    document.getElementById('root').textContent = '缺少数据文件 assets/data.js';
    return;
  }

  // ---------------------------------------------------------------- icons
  var PATHS = {
    dashboard: '<rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="9" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="13" width="5" height="1" rx="0.5"/>',
    project: '<path d="M2 4.5C2 3.7 2.7 3 3.5 3h2.7l1.4 1.5h4.9c.8 0 1.5.7 1.5 1.5v6.5c0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5v-8z"/>',
    scan: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/><path d="M5 7h4"/><path d="M7 5v4"/>',
    job: '<rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M5 6.5h6"/><path d="M5 9.5h4"/>',
    model: '<circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/>',
    settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15M3.05 3.05l1.77 1.77M11.18 11.18l1.77 1.77M3.05 12.95l1.77-1.77M11.18 4.82l1.77-1.77"/>',
    logout: '<path d="M9 3H3.5c-.8 0-1.5.7-1.5 1.5v7c0 .8.7 1.5 1.5 1.5H9"/><path d="M11 5l3 3-3 3"/><path d="M14 8H6"/>',
    plus: '<path d="M8 3v10M3 8h10"/>',
    play: '<path d="M4 3l9 5-9 5z"/>',
    stop: '<rect x="4" y="4" width="8" height="8" rx="1"/>',
    chevron: '<path d="M6 4l4 4-4 4"/>',
    chevronDown: '<path d="M4 6l4 4 4-4"/>',
    check: '<path d="M3 8.5l3.2 3L13 4.5"/>',
    x: '<path d="M4 4l8 8M12 4l-8 8"/>',
    file: '<path d="M4 2h5l3 3v9H4z"/><path d="M9 2v3h3"/>',
    folder: '<path d="M2 4.5C2 3.7 2.7 3 3.5 3h2.7l1.4 1.5h4.9c.8 0 1.5.7 1.5 1.5v6.5c0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5v-8z"/>',
    download: '<path d="M8 2v8M5 7l3 3 3-3M3 12h10"/>',
    upload: '<path d="M8 12V4M5 7l3-3 3 3M3 12h10"/>',
    search: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>',
    bell: '<path d="M4 11V7a4 4 0 018 0v4l1.5 1.5h-11z"/><path d="M6.5 13.5a1.5 1.5 0 003 0"/>',
    log: '<path d="M2 4h12M2 8h12M2 12h8"/>',
    alert: '<path d="M8 2l6.5 11.5h-13z"/><path d="M8 6v3.5M8 11.5v.5"/>',
    shield: '<path d="M8 2l5 2v4c0 3.3-2.2 5.4-5 6-2.8-.6-5-2.7-5-6V4l5-2z"/>',
    bug: '<circle cx="8" cy="9" r="3.5"/><path d="M8 5.5V4M5.5 4l-1-1M10.5 4l1-1M3.5 9H2M12.5 9H14M4.5 12L3 13.5M11.5 12L13 13.5"/>',
    code: '<path d="M5 5L2 8l3 3M11 5l3 3-3 3M9 3l-2 10"/>',
    network: '<circle cx="3" cy="8" r="1.5"/><circle cx="13" cy="4" r="1.5"/><circle cx="13" cy="12" r="1.5"/><path d="M4.3 7.3L11.7 4.7M4.3 8.7L11.7 11.3"/>',
    list: '<circle cx="3" cy="4" r=".8"/><circle cx="3" cy="8" r=".8"/><circle cx="3" cy="12" r=".8"/><path d="M6 4h8M6 8h8M6 12h6"/>',
    refresh: '<path d="M13 4v3h-3"/><path d="M13 7A5 5 0 003 8"/><path d="M3 12v-3h3"/><path d="M3 9a5 5 0 0010-1"/>',
    eye: '<path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z"/><circle cx="8" cy="8" r="2"/>',
    copy: '<rect x="3" y="3" width="7" height="9" rx="1"/><path d="M6 6h7v7"/>',
    history: '<path d="M2 8a6 6 0 1 0 1.8-4.3"/><path d="M2 2v3.5h3.5"/><path d="M8 5v3.5l2.5 1.5"/>',
    trash: '<path d="M3 4h10"/><path d="M6 4V2.8h4V4"/><path d="M5 6v7M8 6v7M11 6v7"/><path d="M4 4l.6 10h6.8L12 4"/>',
    info: '<circle cx="8" cy="8" r="6"/><path d="M8 5v.5M8 7v4"/>',
    home: '<path d="M8 2L2.5 6.5V13.5H13.5V6.5L8 2z"/><path d="M6.6 13.5V10.2h2.8v3.3"/>',
    edit: '<path d="M8 13.3h6"/><path d="M11 2.3a1.4 1.4 0 0 1 2 2L4.7 12.7l-2.7.6.6-2.7Z"/>',
    zap: '<path d="M8.7 1.3L2.7 9.3h4L6 14.6l6-8h-4l.7-5.3Z"/>',
    box: '<path d="M8 1.2 1.8 4.3v7.4L8 14.8l6.2-3.1V4.3L8 1.2ZM1.8 4.3 8 7.4l6.2-3.1M8 7.4v7.4"/>'
  };

  function icon(name, size, cls) {
    var p = PATHS[name];
    if (!p) return '';
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 16 16" fill="none"' +
      ' stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"' +
      ' class="' + (cls || '') + '" style="flex-shrink:0">' + p + '</svg>';
  }

  // ------------------------------------------------------------- format.ts
  function fmtRelTime(ts) {
    if (!ts) return '—';
    var now = Math.floor(Date.now() / 1000);
    var diff = now - ts;
    if (diff < 60) return diff + ' 秒前';
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
    return Math.floor(diff / 86400) + ' 天前';
  }
  function fmtDuration(sec) {
    if (!sec) return '—';
    if (sec < 60) return sec + 's';
    if (sec < 3600) return Math.floor(sec / 60) + 'm ' + (sec % 60) + 's';
    return Math.floor(sec / 3600) + 'h ' + Math.floor((sec % 3600) / 60) + 'm';
  }
  function fmtAbs(ts) {
    if (!ts) return '—';
    var d = new Date(ts * 1000);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function fmtBytes(size) {
    if (!size) return '0 B';
    var units = ['B', 'KB', 'MB', 'GB'];
    var value = size, index = 0;
    while (value >= 1024 && index < units.length - 1) { value /= 1024; index += 1; }
    return value.toFixed(index ? 1 : 0) + ' ' + units[index];
  }
  function sevColor(s) {
    return ({ critical: 'b-critical', high: 'b-high', medium: 'b-medium', low: 'b-low', info: 'b-info' })[s] || 'b-info';
  }
  function statusBadge(s) {
    return ({ running: 'b-brand', succeeded: 'b-ok', failed: 'b-critical', stopping: 'b-medium', queued: 'b-info', idle: 'b-info', confirmed: 'b-ok', rejected: 'b-info', suggested: 'b-low', patched: 'b-ok', passed: 'b-ok' })[s] || 'b-info';
  }

  // --------------------------------------------------------------- helpers
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function asArray(v) { return Array.isArray(v) ? v : []; }
  function ensureObj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
  function num(v) { var n = Number(v); return Number.isFinite(n) ? n : 0; }

  var CAND_STATUS_LABEL = { pending: '待验证', probing: '验证中', rejected: '已排除漏洞', promoted: '已确认漏洞' };
  var CAND_STATUS_BADGE = { pending: 'b-medium', probing: 'b-brand', rejected: 'b-medium', promoted: 'b-ok' };

  function validationStatusLabel(status) {
    var s = String(status || '').toLowerCase();
    var map = { succeeded: '已确认漏洞', confirmed: '已确认漏洞', passed: '已通过', rejected: '已排除漏洞', rejected_or_inconclusive: '已排除漏洞', inconclusive: '已排除漏洞', failed: '失败' };
    return map[s] || status || '未知';
  }
  function validationStatusBadge(status) {
    var s = String(status || '').toLowerCase();
    if (['succeeded', 'confirmed', 'passed'].indexOf(s) !== -1) return 'b-ok';
    if (['rejected', 'rejected_or_inconclusive', 'inconclusive'].indexOf(s) !== -1) return 'b-medium';
    if (s === 'failed') return 'b-critical';
    return statusBadge(status);
  }

  // 演示环境提示：所有写操作（删除/还原/新建/测试连通）都不请求后端。
  function demoToast(msg) {
    var box = document.getElementById('toast');
    if (!box) return;
    box.innerHTML = '<div class="cand-banner" style="border-color:var(--brand-soft);background:var(--brand-softer)">' +
      icon('info', 15) + '<b>' + esc(msg) + '</b></div>';
    box.classList.add('on');
    clearTimeout(demoToast._t);
    demoToast._t = setTimeout(function () { box.classList.remove('on'); }, 3600);
  }

  // ------------------------------------------------------------- export.ts
  function downloadFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }
  function slug(value) {
    return (String(value || 'export').replace(/[^\p{L}\p{N}._-]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 80)) || 'export';
  }
  function diffText(patchDiff) {
    return (patchDiff || []).map(function (row) { return typeof row === 'string' ? row : (row && row.text) || ''; }).join('\n');
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){}, function(){ fallbackCopy(text); });
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
  }
  function printReport() {
    document.body.classList.add('printing-report');
    var cleanup = function () { document.body.classList.remove('printing-report'); window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    window.print();
  }
  function findingToMarkdown(f) {
    var lines = ['# ' + f.title, ''];
    lines.push('- ID: ' + f.id);
    lines.push('- 严重度: ' + f.severity);
    if (f.category) lines.push('- 分类: ' + f.category);
    if (f.cwe) lines.push('- CWE: ' + f.cwe);
    if (f.file && f.file !== '—') lines.push('- 位置: ' + f.file + ':' + f.line);
    if (typeof f.confidence === 'number') lines.push('- 置信度: ' + (f.confidence * 100).toFixed(0) + '%');
    if (f.status) lines.push('- 状态: ' + f.status);
    lines.push('');
    if (f.description) lines.push('## 描述', '', f.description, '');
    if (f.impact) lines.push('## 潜在影响', '', f.impact, '');
    if (f.recommendation) lines.push('## 修复建议', '', f.recommendation, '');
    var code = (f.code_snippet || []).map(function (r) { return r.text; }).join('\n');
    if (code.trim()) lines.push('## 问题代码', '', '```', code, '```', '');
    var diff = diffText(f.patch_diff);
    if (diff.trim()) lines.push('## 建议 Patch', '', '```', diff, '```', '');
    return lines.join('\n');
  }
  function reportToMarkdown(project, findings, probes, patches) {
    var order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    var sorted = findings.slice().sort(function (a, b) { return order[a.severity] - order[b.severity]; });
    var sev = project.severity || {};
    var lines = [];
    lines.push('# 书安 安全扫描报告 — ' + project.name, '');
    if (project.description) lines.push(project.description, '');
    lines.push('## 元信息', '');
    lines.push('- 扫描 ID: ' + project.id);
    lines.push('- 模式: ' + project.phase + '（' + project.phase_label + '）');
    lines.push('- 目标: ' + project.target);
    lines.push('- 大模型: ' + (project.model_config || '服务器环境变量'));
    lines.push('- 开始时间: ' + fmtAbs(project.started_at));
    lines.push('- 耗时: ' + (project.duration ? fmtDuration(project.duration) : '进行中'));
    lines.push('', '## 1. 总览', '');
    lines.push('本次扫描共生成 ' + project.metrics.candidates + ' 个候选，沉淀 ' + project.metrics.probes + ' 条验证证据，最终确认 ' + findings.length + ' 个漏洞。', '');
    lines.push('### 严重度分布', '');
    lines.push('- 严重: ' + (sev.critical || 0), '- 高危: ' + (sev.high || 0), '- 中等: ' + (sev.medium || 0), '- 低危: ' + (sev.low || 0), '');
    lines.push('## 2. 漏洞详情', '');
    if (!sorted.length) lines.push('本次扫描未发现确认的漏洞。', '');
    sorted.forEach(function (f, i) {
      lines.push('### 2.' + (i + 1) + ' ' + f.title, '');
      lines.push(findingToMarkdown(f).split('\n').slice(1).join('\n').trim(), '');
    });
    lines.push('## 3. 修复建议汇总', '');
    if (!patches.length) lines.push('当前扫描未生成自动修复建议。', '');
    else { patches.forEach(function (p) { lines.push('- ' + p.id + ' — ' + p.summary + '（关联 ' + p.finding_id + ' · ' + p.file + '）'); }); lines.push(''); }
    lines.push('## 4. 验证记录', '');
    lines.push('共有 ' + probes.length + ' 条验证记录。', '');
    lines.push('— END OF REPORT —');
    return lines.join('\n');
  }

  // 真实产物副本位于 demo/output/<job-id>/<relPath>。
  function artifactHref(projectId, relPath) {
    return 'output/' + encodeURIComponent(projectId) + '/' + String(relPath).split('/').map(encodeURIComponent).join('/');
  }

  // ------------------------------------------------------ workflow derive
  var WORKFLOW_NODES = [
    { id: 'profile', label: '目标画像与情报' }, { id: 'environment', label: '环境建立' },
    { id: 'discovery', label: '候选发现' }, { id: 'ranking', label: '候选排序' },
    { id: 'validation', label: '验证确认' }, { id: 'remediation', label: '修复建议' },
    { id: 'report', label: '报告生成' }
  ];
  var LABEL_BY_ID = {};
  WORKFLOW_NODES.forEach(function (n) { LABEL_BY_ID[n.id] = n.label; });

  function summaryText(summary) {
    return Object.entries(summary || {})
      .filter(function (e) { return e[1] !== null && e[1] !== undefined && e[1] !== ''; })
      .map(function (e) { return e[0] + ' ' + String(e[1]); }).join(' · ');
  }

  // ------------------------------------------------------- agentTopology
  var KIND_ORDER = { profile: 1, environment: 2, discovery: 3, ranking: 4, validation: 5, remediation: 6, other: 8 };
  var KIND_LABEL = { profile: '画像/情报', environment: '环境建立', discovery: '候选发现', ranking: '候选排序', validation: '验证确认', remediation: '修复建议', other: '其他 Agent' };
  var AG_RUNNING = ['running', 'in_progress', 'started', 'active'];
  var AG_DONE = ['done', 'completed', 'succeeded', 'success', 'finished', 'ok', 'passed'];
  var AG_FAILED = ['failed', 'error', 'errored', 'crashed', 'timeout', 'timed_out', 'cancelled', 'aborted'];

  function agentStatus(raw) {
    var s = String(raw == null ? '' : raw).toLowerCase();
    if (s === 'stale') return 'stale';
    if (AG_FAILED.indexOf(s) !== -1) return 'failed';
    if (AG_DONE.indexOf(s) !== -1) return 'done';
    if (AG_RUNNING.indexOf(s) !== -1) return 'running';
    return 'idle';
  }
  function parseStart(value) {
    if (value == null || value === '') return null;
    var t = Date.parse(String(value));
    return Number.isFinite(t) ? t : null;
  }
  var STATUS_RANK = { running: 0, stale: 1, failed: 2, done: 3, idle: 4 };
  function deriveAgentTopology(artifacts) {
    var activity = ensureObj(ensureObj(artifacts).agent_activity);
    var groupsRaw = ensureObj(activity.groups);
    var agentsRaw = asArray(activity.agents);
    var byKind = {};
    agentsRaw.forEach(function (raw) {
      var a = ensureObj(raw);
      var kind = String(a.kind || 'other').toLowerCase();
      var node = {
        label: String(a.label || a.function || a.id || 'Agent'),
        kind: kind,
        status: agentStatus(a.status),
        elapsedSeconds: a.elapsed_seconds == null ? null : num(a.elapsed_seconds),
        startedAt: parseStart(a.started_at)
      };
      (byKind[kind] = byKind[kind] || []).push(node);
    });
    var kinds = Object.keys(Object.assign({}, groupsRaw, byKind));
    var groups = [];
    kinds.forEach(function (kind) {
      var g = ensureObj(groupsRaw[kind]);
      var agents = byKind[kind] || [];
      var running = num(g.running), completed = num(g.completed), failed = num(g.failed), stale = num(g.stale);
      if (!agents.length && !running && !completed && !failed && !stale) return;
      agents.sort(function (a, b) { return (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || ((b.elapsedSeconds || 0) - (a.elapsedSeconds || 0)); });
      groups.push({ kind: kind, label: String(g.label || KIND_LABEL[kind] || kind), order: KIND_ORDER[kind] != null ? KIND_ORDER[kind] : 7, running: running, completed: completed, failed: failed, stale: stale, agents: agents });
    });
    groups.sort(function (a, b) { return a.order - b.order; });
    return {
      groups: groups,
      runningTotal: num(activity.running_total), completedTotal: num(activity.completed_total),
      failedTotal: num(activity.failed_total), staleTotal: num(activity.stale_total),
      capacity: activity.capacity == null ? null : num(activity.capacity)
    };
  }

  // ------------------------------------------------------------ agentTree
  var FLOW = { COL_W: 224, ROW_V: 42, WAVE_GAP: 16, PAD: 16, NODE_W: 188, NODE_H: 30, BRACKET_DX: 9 };
  var PLANNER_RE = /规划|planner/i;
  var STAGE_ORDER = ['profile', 'environment', 'discovery', 'ranking', 'validation', 'remediation'];
  var SPECIALTY_KEYWORD = { memory: '内存', parser: '解析', authz: '权限', authorization: '权限', general: '通用' };

  function stageRank(kind) { var i = STAGE_ORDER.indexOf(kind); return i === -1 ? STAGE_ORDER.length : i; }
  function endOf(a) { return a.startedAt == null ? null : a.startedAt + (a.elapsedSeconds || 0) * 1000; }
  function groupWaves(workers) {
    var sorted = workers.slice().sort(function (a, b) {
      if (a.startedAt == null && b.startedAt == null) return 0;
      if (a.startedAt == null) return 1;
      if (b.startedAt == null) return -1;
      return a.startedAt - b.startedAt;
    });
    var waves = [], curEnd = null;
    sorted.forEach(function (w) {
      var start = w.startedAt, end = endOf(w);
      if (waves.length && start != null && curEnd != null && start < curEnd) {
        waves[waves.length - 1].push(w);
        if (end != null) curEnd = Math.max(curEnd, end);
      } else { waves.push([w]); curEnd = end; }
    });
    return waves;
  }
  function minStart(agents) {
    var xs = agents.map(function (a) { return a.startedAt; }).filter(function (v) { return v != null; });
    return xs.length ? Math.min.apply(null, xs) : null;
  }
  function maxEnd(agents) {
    var xs = agents.map(endOf).filter(function (v) { return v != null; });
    return xs.length ? Math.max.apply(null, xs) : null;
  }
  function edgePathD(e) {
    if (e.kind === 'dispatch') {
      var dy = Math.max(12, (e.y2 - e.y1) / 2);
      return 'M ' + e.x1 + ' ' + e.y1 + ' C ' + e.x1 + ' ' + (e.y1 + dy) + ', ' + e.x2 + ' ' + (e.y2 - dy) + ', ' + e.x2 + ' ' + e.y2;
    }
    var dx = Math.max(16, (e.x2 - e.x1) / 2);
    return 'M ' + e.x1 + ' ' + e.y1 + ' C ' + (e.x1 + dx) + ' ' + e.y1 + ', ' + (e.x2 - dx) + ' ' + e.y2 + ', ' + e.x2 + ' ' + e.y2;
  }

  function layoutAgentFlow(projectName, stages) {
    var COL_W = FLOW.COL_W, ROW_V = FLOW.ROW_V, WAVE_GAP = FLOW.WAVE_GAP, PAD = FLOW.PAD;
    var NODE_W = FLOW.NODE_W, NODE_H = FLOW.NODE_H, BRACKET_DX = FLOW.BRACKET_DX;
    var ordered = stages.slice().sort(function (a, b) { return stageRank(a.kind) - stageRank(b.kind); });
    var nodes = [], edges = [], brackets = [];
    var colX = function (col) { return PAD + col * COL_W; };
    var headerY = PAD + NODE_H / 2;
    nodes.push({ id: 'project', label: projectName || '扫描', kind: 'project', role: 'project', status: 'root', elapsedSeconds: null, x: colX(0), y: headerY });
    var placed = [], maxBottom = headerY + NODE_H / 2;
    var nodeById = {};
    nodeById['project'] = nodes[nodes.length - 1];
    ordered.forEach(function (stage, i) {
      var col = i + 1, x = colX(col);
      var headerId = 'stage:' + stage.kind;
      nodes.push({ id: headerId, label: stage.label, kind: stage.kind, role: 'stage', status: stage.status, elapsedSeconds: null, x: x, y: headerY });
      nodeById[headerId] = nodes[nodes.length - 1];
      var planners = stage.agents.filter(function (a) { return PLANNER_RE.test(a.label); });
      var workers = stage.agents.filter(function (a) { return !PLANNER_RE.test(a.label); });
      var hasPlanner = planners.length === 1;
      var y = headerY, plannerId = null;
      if (hasPlanner) {
        y += ROW_V;
        var p = planners[0];
        plannerId = 'planner:' + stage.kind + ':' + p.label;
        nodes.push({ id: plannerId, label: p.label, kind: stage.kind, role: 'planner', status: p.status, elapsedSeconds: p.elapsedSeconds, x: x, y: y });
        nodeById[plannerId] = nodes[nodes.length - 1];
        edges.push(dispatch(headerId, plannerId, x, headerY, y, p.status));
        maxBottom = Math.max(maxBottom, y + NODE_H / 2);
      }
      var waves = groupWaves(workers);
      waves.forEach(function (wave, wi) {
        if (wi > 0) y += WAVE_GAP;
        var parallel = wave.length > 1;
        var groupTop = y + ROW_V - NODE_H / 2, lastY = y;
        wave.forEach(function (w) {
          y += ROW_V; lastY = y;
          var id = 'agent:' + stage.kind + ':' + w.label;
          nodes.push({ id: id, label: w.label, kind: stage.kind, role: 'agent', status: w.status, elapsedSeconds: w.elapsedSeconds, x: x, y: y, wave: wi, parallel: parallel });
          nodeById[id] = nodes[nodes.length - 1];
          var fromY = hasPlanner ? nodeById[plannerId].y : headerY;
          edges.push(dispatch(hasPlanner ? plannerId : headerId, id, x, fromY, y, w.status));
          maxBottom = Math.max(maxBottom, y + NODE_H / 2);
        });
        if (parallel) brackets.push({ id: 'wave:' + stage.kind + ':' + wi, x: x - BRACKET_DX, y1: groupTop, y2: lastY + NODE_H / 2, count: wave.length, status: stage.status });
      });
      placed.push({ kind: stage.kind, status: stage.status, headerId: headerId, minStart: minStart(workers), maxEnd: maxEnd(workers) });
    });
    var prevId = 'project', prevEnd = null;
    placed.forEach(function (st) {
      var streaming = prevEnd != null && st.minStart != null && st.minStart < prevEnd;
      edges.push({
        fromId: prevId, toId: st.headerId,
        kind: prevId === 'project' ? 'pipeline' : streaming ? 'stream' : 'pipeline',
        status: st.status,
        x1: ((nodeById[prevId] || {}).x || 0) + NODE_W, y1: headerY, x2: ((nodeById[st.headerId] || {}).x || 0), y2: headerY
      });
      prevId = st.headerId; prevEnd = st.maxEnd;
    });
    var discoveryAgents = nodes.filter(function (n) { return n.kind === 'discovery' && (n.role === 'agent' || n.role === 'planner'); });
    nodes.forEach(function (v) {
      if (v.kind !== 'validation' || v.role !== 'agent') return;
      var m = /discover-\d+-([a-z]+)-shard/i.exec(v.label);
      if (!m) return;
      var keyword = SPECIALTY_KEYWORD[m[1].toLowerCase()];
      if (!keyword) return;
      var src = null;
      for (var i = 0; i < discoveryAgents.length; i++) { if (discoveryAgents[i].label.indexOf(keyword) !== -1) { src = discoveryAgents[i]; break; } }
      if (!src) return;
      edges.push({ fromId: src.id, toId: v.id, kind: 'context', status: v.status, x1: src.x + NODE_W, y1: src.y, x2: v.x, y2: v.y });
    });
    var width = PAD * 2 + (ordered.length + 1) * COL_W - (COL_W - NODE_W);
    var height = Math.max(headerY + NODE_H / 2, maxBottom) + PAD;
    return { nodes: nodes, edges: edges, brackets: brackets, width: width, height: height };
  }
  function dispatch(fromId, toId, x, fromY, toY, status) {
    var cx = x + FLOW.NODE_W / 2;
    return { fromId: fromId, toId: toId, kind: 'dispatch', status: status, x1: cx, y1: fromY + FLOW.NODE_H / 2, x2: cx, y2: toY - FLOW.NODE_H / 2 };
  }

  // ============================================================== shell
  var SECTIONS = [
    { title: '工作台', items: [
      { id: 'dashboard', label: '仪表盘', desc: '总览与态势', icon: 'dashboard', path: '/' },
      { id: 'service', label: '运行', desc: '扫描服务', icon: 'scan', path: '/service' },
      { id: 'projects', label: '任务', desc: '创建与进度', icon: 'project', path: '/projects' }
    ] },
    { title: '系统配置', items: [
      { id: 'models', label: '模型管理', desc: '模型连接配置', icon: 'box', path: '/models' }
    ] }
  ];

  function counts() {
    return { projects: D.projects.length };
  }

  function Sidebar(active) {
    var c = counts();
    var groups = SECTIONS.map(function (sec) {
      var items = sec.items.map(function (item) {
        var on = item.path === '/' ? active === '/' : active.indexOf(item.path) === 0;
        var badge = c[item.id] != null ? '<span class="count mono">' + c[item.id] + '</span>' : '';
        return '<a class="nav-item' + (on ? ' active' : '') + '" aria-label="' + item.label + '" title="' + item.label + ' · ' + item.desc + '" href="#' + item.path + '">' +
          '<span class="ico">' + icon(item.icon) + '</span><span class="nav-text"><strong>' + item.label + '</strong></span>' + badge + '</a>';
      }).join('');
      return '<nav class="sidebar-nav">' + '<div class="sidebar-section">' + sec.title + '</div>' + items + '</nav>';
    }).join('');
    return '<aside class="sidebar">' +
      '<div class="sidebar-brand"><div><div class="name">漏洞扫描中心</div></div>' +
      '<button class="zhian-collapse" type="button" aria-label="收起侧边栏" onclick="window.zhianToggle()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/></svg></button></div>' + groups +
      '<div class="sidebar-foot">' +
      '<div class="user-chip" id="user-chip" role="button" tabindex="0" title="账户菜单">' +
      '<div class="avatar">安</div><div class="who"><div class="b" style="font-size:13px">安全管理员</div></div>' +
      '<span class="user-chev" aria-hidden="true">›</span></div>' +
      '<div class="user-menu' + (STATE.userMenu ? ' open' : '') + '" id="user-menu">' +
      '<a class="user-menu-item" href="#" data-um="home">' + icon('home', 14) + '<span>回到首页</span></a>' +
      '<button class="user-menu-item" data-um="logout">' + icon('logout', 14) + '<span>退出登录</span></button>' +
      '</div></div>' +
      '</aside>';
  }

  function PageHead(o) {
    return '<header class="page-head">' +
      '<h1 class="title">' + esc(o.title) + '</h1>' +
      '<div class="actions">' + (o.actions || '') + '</div></header>';
  }

  function StagePipeline(stages, compact) {
    return '<div class="pipeline' + (compact ? ' compact' : '') + '">' + stages.map(function (s, idx) {
      var cls = ['done', 'running', 'failed', 'skipped'].indexOf(s.state) !== -1 ? s.state : 'queued';
      var node = s.state === 'done' ? icon('check', 16)
        : s.state === 'failed' ? icon('x', 14)
        : s.state === 'running' ? '<span>' + (idx + 1) + '</span>'
        : s.state === 'skipped' ? '<span class="muted" style="font-size:10px">跳过</span>'
        : '<span style="font-size:11px">' + (idx + 1) + '</span>';
      return '<div class="stage ' + cls + '"><div class="node">' + node + '</div>' +
        '<div class="stage-copy"><div class="label">' + esc(s.label) + '</div>' +
        (!compact && s.hint ? '<div class="hint">' + esc(s.hint) + '</div>' : '') +
        '</div></div>';
    }).join('') + '</div>';
  }

  // ============================================================== views
  function Kpi(label, value, delta, accent) {
    var valueColor = accent === 'critical' ? 'var(--sig-critical)' : 'var(--brand-ink)';
    return '<div class="kpi"><span class="label">' + esc(label) + '</span>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:2px">' +
      '<span class="value" style="color:' + valueColor + '">' + esc(value) + '</span></div>' +
      (delta ? '<span class="delta">' + esc(delta) + '</span>' : '') + '</div>';
  }
  function StatTile(label, value, variant) {
    return '<div class="stat-tile ' + (variant || '') + '"><div class="label">' + esc(label) + '</div><div class="value">' + esc(value) + '</div></div>';
  }

  function DashboardView() {
    var projects = D.projects;
    var totalFindings = projects.reduce(function (s, p) { return s + (p.metrics && p.metrics.findings || 0); }, 0);
    var totalCritical = projects.reduce(function (s, p) { return s + (p.severity && p.severity.critical || 0); }, 0);
    var totalHigh = projects.reduce(function (s, p) { return s + (p.severity && p.severity.high || 0); }, 0);
    var running = projects.filter(function (p) { return p.status === 'running'; });
    var succeeded = projects.filter(function (p) { return p.status === 'succeeded'; });
    var failed = projects.filter(function (p) { return p.status === 'failed'; });
    var durations = projects.map(function (p) { return p.duration; }).filter(Boolean);
    var avgDuration = durations.length ? Math.round(durations.reduce(function (s, n) { return s + n; }, 0) / durations.length) : 0;
    var findings = D.findings;

    var runningCard;
    if (running.length) {
      runningCard = running.slice(0, 1).map(function (p) {
        return '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">' +
          '<div><div class="b" style="font-size:15px;color:var(--text)">' + esc(p.name) + '</div>' +
          '<div class="muted xs mono" style="margin-top:4px">' + esc(p.id) + ' · ' + esc(p.target) + '</div></div>' +
          '<div style="display:flex;gap:12px;align-items:center"><span class="muted xs">' + fmtRelTime(p.started_at) + ' 启动</span>' +
          '<a class="btn sm" href="#/projects/' + encodeURIComponent(p.id) + '">打开 ' + icon('chevron', 11) + '</a></div></div>' +
          StagePipeline(p.stages) +
          '<div style="display:flex;justify-content:space-between;margin-top:14px;align-items:center">' +
          '<span class="muted xs mono">阶段进度</span><span class="b mono brand-text">' + Math.round(p.progress) + '%</span></div>' +
          '<div class="bar-track" style="margin-top:6px"><div class="bar-fill" style="width:' + p.progress + '%"></div></div>' +
          '<div class="grid grid-4" style="margin-top:14px;gap:10px">' +
          StatTile('候选', p.metrics.candidates) + StatTile('验证', p.metrics.probes) +
          StatTile('确认', p.metrics.findings, p.metrics.findings ? 'crit' : '') + StatTile('错误', p.metrics.errors) +
          '</div>';
      }).join('');
    } else {
      runningCard = '<div class="empty"><div class="glyph">' + icon('scan') + '</div>当前没有运行中的扫描</div>';
    }

    var allProjects = projects.length ? projects.slice(0, 6).map(function (p, i) {
      var last = i === Math.min(projects.length, 6) - 1;
      return '<a href="#/projects/' + encodeURIComponent(p.id) + '" style="display:grid;grid-template-columns:16px 1fr 120px 80px 90px;gap:12px;align-items:center;' +
        'padding:12px 18px;' + (last ? '' : 'border-bottom:1px solid var(--line);') + 'cursor:pointer;font-size:13px;text-decoration:none;color:inherit">' +
        '<span class="status ' + p.status + '"><span class="pulse"></span></span>' +
        '<div style="min-width:0"><div class="b" style="color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(p.name) + '</div>' +
        '<div class="mono xs muted" style="margin-top:2px">' + esc(p.id) + '</div></div>' +
        '<span class="badge ' + statusBadge(p.status) + '">' + esc(p.status) + '</span>' +
        '<span class="muted xs">' + fmtRelTime(p.started_at) + '</span>' +
        '<span class="mono xs muted" style="text-align:right">' + p.metrics.findings + ' 发现</span></a>';
    }).join('') : '<div class="empty"><div class="glyph">' + icon('project') + '</div>还没有扫描任务</div>';

    var sevRows = [
      { key: 'critical', label: '严重', count: totalCritical },
      { key: 'high', label: '高危', count: totalHigh },
      { key: 'medium', label: '中等', count: projects.reduce(function (s, p) { return s + (p.severity && p.severity.medium || 0); }, 0) },
      { key: 'low', label: '低危', count: projects.reduce(function (s, p) { return s + (p.severity && p.severity.low || 0); }, 0) }
    ];
    var badgeMap = { critical: 'b-critical', high: 'b-high', medium: 'b-medium', low: 'b-low' };
    var barMap = { critical: 'var(--sig-critical)', high: 'var(--sig-high)', medium: 'var(--sig-medium)', low: 'var(--sig-low)' };
    var max = Math.max(1, totalFindings);
    var sevHtml = sevRows.map(function (r) {
      return '<div style="display:grid;grid-template-columns:60px 1fr 40px;gap:12px;align-items:center">' +
        '<span class="badge ' + badgeMap[r.key] + '">' + r.label + '</span>' +
        '<div style="height:6px;border-radius:3px;background:var(--bg-sunken);overflow:hidden;border:1px solid var(--line)">' +
        '<div style="width:' + (r.count / max * 100) + '%;height:100%;background:' + barMap[r.key] + '"></div></div>' +
        '<span class="mono b" style="text-align:right;color:var(--text)">' + r.count + '</span></div>';
    }).join('');

    var findingsHtml = findings.length ? findings.slice(0, 5).map(function (f) {
      var proj = projects.find(function (p) { return p.id === f.project_id; });
      return '<a href="#/projects/' + encodeURIComponent(f.project_id) + '" style="display:block;padding:10px 12px;border-radius:6px;border:1px solid var(--line);background:var(--bg-sunken);cursor:pointer;text-decoration:none;color:inherit">' +
        '<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">' +
        '<span class="badge ' + sevColor(f.severity) + '">' + esc(f.severity) + '</span>' +
        '<span class="muted xs mono">' + esc(f.id) + '</span><span class="spacer"></span>' +
        '<span class="muted xs mono">' + esc(proj ? proj.name : '—') + '</span></div>' +
        '<div class="b xs" style="margin-top:4px;color:var(--text);line-height:1.4">' + esc(f.title) + '</div></a>';
    }).join('') : '<div class="empty"><div class="glyph">' + icon('bug') + '</div>暂无确认漏洞</div>';

    return PageHead({
      title: '仪表盘',
      actions: '<button class="btn" onclick="void 0" id="btn-refresh" title="演示数据为静态快照">' + icon('refresh', 14) + ' 刷新</button>' +
        '<a class="btn primary" href="#/projects" id="btn-newproject">' + icon('plus', 14) + ' 新建扫描任务</a>'
    }) + '<div class="page-body">' +
      '<div class="grid grid-4" style="margin-bottom:18px">' +
      Kpi('任务总数', projects.length, succeeded.length + ' 已完成') +
      Kpi('进行中', running.length, failed.length + ' 失败') +
      Kpi('确认漏洞', totalFindings, totalCritical + ' 严重 · ' + totalHigh + ' 高危', 'critical') +
      Kpi('平均耗时', avgDuration ? fmtDuration(avgDuration) : '—', projects.length + ' 次扫描') +
      '</div>' +
      '<div class="grid" style="grid-template-columns:1.4fr 1fr;gap:18px">' +
      '<div class="stack" style="gap:18px">' +
      '<div class="card"><div class="card-h"><div style="display:flex;align-items:center;gap:10px"><h3>正在运行</h3>' +
      (running.length ? '<span class="status running"><span class="pulse"></span>' + running.length + ' 个任务</span>' : '') +
      '</div><a class="btn sm ghost" href="#/projects">查看全部 ' + icon('chevron', 12) + '</a></div>' +
      '<div class="card-b">' + runningCard + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>所有任务</h3><a class="btn sm ghost" href="#/projects">管理 ' + icon('chevron', 12) + '</a></div>' +
      '<div>' + allProjects + '</div></div>' +
      '</div>' +
      '<div class="stack" style="gap:18px">' +
      '<div class="card"><div class="card-h"><h3>严重度汇总</h3><span class="muted xs mono">' + totalFindings + ' TOTAL</span></div>' +
      '<div class="card-b stack-sm">' + sevHtml + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>最近的发现</h3></div><div class="card-b stack-sm">' + findingsHtml + '</div></div>' +
      '</div></div></div>';
  }

  // ------------------------------------------------------- service view
  function pickActiveJob() {
    var scans = D.projects.filter(function (p) { return p.id.indexOf('empty_') !== 0; });
    if (!scans.length) return null;
    var running = scans.find(function (p) { return p.status === 'running'; });
    if (running) return running;
    return scans.slice().sort(function (a, b) { return (b.started_at || 0) - (a.started_at || 0); })[0];
  }

  function WorkflowTopologyHtml(nodes) {
    var out = '';
    nodes.forEach(function (node, idx) {
      if (idx > 0) out += '<span class="topo-connector"></span>';
      var glyph = node.status === 'idle' ? (idx + 1) : ({ done: '✓', running: '●', failed: '✕', skipped: '–' }[node.status] || '·');
      out += '<div class="topo-node" data-state="' + esc(node.status) + '">' +
        '<div class="topo-dot">' + glyph + '</div>' +
        '<div class="topo-copy"><div class="topo-label">' + esc(LABEL_BY_ID[node.id] || node.id) + '</div>' +
        '<div class="topo-summary">' + esc(summaryText(node.summary) || '待运行') + '</div></div></div>';
    });
    return '<div class="topology">' + out + '</div>';
  }

  function AgentTreeHtml(layout) {
    var NODE_W = FLOW.NODE_W, NODE_H = FLOW.NODE_H;
    var glyphFor = { done: '✓', running: '●', failed: '✕', stale: '!', skipped: '–', idle: '·', root: '◆' };
    var edgesSvg = '';
    layout.brackets.forEach(function (b) {
      var w = 7;
      edgesSvg += '<g class="atree-bracket" data-state="' + esc(b.status) + '">' +
        '<path d="M ' + (b.x + w) + ' ' + b.y1 + ' H ' + b.x + ' V ' + b.y2 + ' H ' + (b.x + w) + '" fill="none"/>' +
        '<text x="' + (b.x - 3) + '" y="' + ((b.y1 + b.y2) / 2) + '" class="atree-bracket-tag">∥' + b.count + '</text></g>';
    });
    layout.edges.forEach(function (e) {
      edgesSvg += '<path class="atree-edge" data-kind="' + esc(e.kind) + '" data-state="' + esc(e.status) + '" d="' + edgePathD(e) + '" fill="none" marker-end="url(#atree-arrow)"/>';
    });
    var boxes = layout.nodes.map(function (n) {
      var glyph = glyphFor[n.status] || '·';
      return '<div class="atree-node" data-role="' + esc(n.role) + '" data-state="' + esc(n.status) + '"' +
        (n.parallel ? ' data-parallel="1"' : '') +
        ' style="left:' + n.x + 'px;top:' + (n.y - NODE_H / 2) + 'px;width:' + NODE_W + 'px;height:' + NODE_H + 'px">' +
        '<span class="atree-dot">' + glyph + '</span>' +
        '<span class="atree-label" title="' + esc(n.label) + '">' + esc(n.label) + '</span>' +
        (n.role === 'planner' ? '<span class="atree-tag">规划</span>' : '') +
        (n.elapsedSeconds != null && n.status === 'running' ? '<span class="atree-time mono">' + fmtDuration(n.elapsedSeconds) + '</span>' : '') +
        '</div>';
    }).join('');
    return '<div class="atree" style="width:' + layout.width + 'px;height:' + layout.height + 'px;min-width:' + layout.width + 'px">' +
      '<svg class="atree-edges" width="' + layout.width + '" height="' + layout.height + '">' +
      '<defs><marker id="atree-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M 0 1 L 9 5 L 0 9 z" class="atree-arrowhead"/></marker></defs>' +
      edgesSvg + '</svg>' + boxes + '</div>';
  }

  function ServiceView() {
    var job = pickActiveJob();
    if (!job) {
      return PageHead({ title: '运行' }) +
        '<div class="page-body"><div class="empty"><div class="glyph">' + icon('scan') + '</div>暂无扫描任务 · 新建扫描后将在此实时呈现工作流进度</div></div>';
    }
    var artifacts = D.artifactsByJob[job.id] || {};
    var nodes = D.nodesByJob[job.id] || [];
    var overall = job.status;
    var doneCount = nodes.filter(function (n) { return n.status === 'done'; }).length;
    var totalCount = nodes.length;
    var currentNode = nodes.find(function (n) { return n.status === 'running'; });
    var currentLabel = currentNode ? (LABEL_BY_ID[currentNode.id] || currentNode.id) : null;
    var currentMessage = currentNode ? String(currentNode.message || '').trim() : '';
    var OVERALL_LABEL = { running: '运行中', succeeded: '已完成', failed: '已失败' };

    var view = STATE.serviceView;
    var bodyHtml;
    if (view === 'stage') {
      bodyHtml = WorkflowTopologyHtml(nodes);
    } else {
      // agent 拓扑：stage 状态来自 nodes，agent 来自 agent_activity（静态快照，
      // 一次性累积；已完成 stage 的残留 running agent 归位为 done）。
      var topology = deriveAgentTopology(artifacts);
      var acc = {};
      topology.groups.forEach(function (g) {
        var bucket = {};
        (acc[g.kind] || []).forEach(function (a) { bucket[a.label] = a; });
        g.agents.forEach(function (a) {
          bucket[a.label] = {
            label: a.label, status: a.status,
            elapsedSeconds: a.elapsedSeconds != null ? a.elapsedSeconds : (bucket[a.label] ? bucket[a.label].elapsedSeconds : null),
            startedAt: a.startedAt != null ? a.startedAt : (bucket[a.label] ? bucket[a.label].startedAt : null)
          };
        });
        acc[g.kind] = Object.values(bucket);
      });
      var TREE_DEFS = [['profile', '画像/情报'], ['environment', '环境建立'], ['discovery', '候选发现'], ['ranking', '候选排序'], ['validation', '验证确认'], ['remediation', '修复建议']];
      var stageStatus = {};
      nodes.forEach(function (n) { stageStatus[n.id] = n.status; });
      var treeStages = TREE_DEFS.map(function (def) {
        var status = stageStatus[def[0]] || 'idle';
        var agents = (acc[def[0]] || []).map(function (a) {
          if (status === 'done') { if (a.status === 'running' || a.status === 'idle') return Object.assign({}, a, { status: 'done' }); }
          else if (status === 'failed') { if (a.status === 'running') return Object.assign({}, a, { status: 'failed' }); }
          return a;
        });
        agents.sort(function (a, b) { return (STATUS_RANK[a.status] != null ? STATUS_RANK[a.status] : 9) - (STATUS_RANK[b.status] != null ? STATUS_RANK[b.status] : 9); });
        return { kind: def[0], label: def[1], status: status, agents: agents };
      });
      if (acc.other && acc.other.length) treeStages.push({ kind: 'other', label: '其他 Agent', status: 'running', agents: acc.other });
      var layout = layoutAgentFlow(job.name, treeStages);
      bodyHtml = '<div class="atree-scroll">' + AgentTreeHtml(layout) + '</div>';
    }

    var validationNode = nodes.find(function (n) { return n.id === 'validation'; });
    var remediationNode = nodes.find(function (n) { return n.id === 'remediation'; });
    var findingsCount = validationNode && validationNode.summary ? validationNode.summary.findings : null;
    var patchesCount = remediationNode && remediationNode.summary ? (remediationNode.summary.patched != null ? remediationNode.summary.patched : remediationNode.summary.total) : null;

    var runInfo;
    if (currentNode) {
      runInfo = '<div class="activity-row"><div class="activity-dot"></div><div class="activity-main">' +
        '<div class="activity-head"><span class="badge b-info">' + esc(currentLabel) + '</span></div>' +
        '<div class="activity-title">' + esc(currentMessage || ('正在执行：' + currentLabel)) + '</div></div></div>';
    } else {
      runInfo = '<div class="muted" style="padding:12px">' +
        (overall === 'succeeded' ? '扫描已完成，工作流各节点状态见上方拓扑。' : overall === 'failed' ? '扫描已结束（失败），详见任务详情。' : '等待节点开始执行…') +
        '</div>';
    }

    return PageHead({
      title: '运行',
      actions: '<a class="btn sm ghost" href="#/projects/' + encodeURIComponent(job.id) + '">' + icon('project', 13) + ' 查看任务详情</a>'
    }) + '<div class="page-body">' +
      '<div class="card"><div class="card-h">' +
      '<div style="display:flex;align-items:center;gap:10px"><h3>工作流拓扑</h3>' +
      (overall === 'running' ? '<span class="status running"><span class="pulse"></span>live</span>' : '') +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:10px">' +
      '<div class="seg" role="tablist" aria-label="拓扑视图切换">' +
      '<button type="button" role="tab" data-sv="agent" class="' + (view === 'agent' ? 'on' : '') + '">Agent</button>' +
      '<button type="button" role="tab" data-sv="stage" class="' + (view === 'stage' ? 'on' : '') + '">阶段</button>' +
      '</div>' +
      '<span class="muted xs mono">' + esc(OVERALL_LABEL[overall] || overall) + ' · ' + doneCount + '/' + totalCount + ' 节点完成</span>' +
      '</div></div><div class="card-b">' + bodyHtml + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>运行信息</h3><span class="muted xs mono">' +
      (findingsCount != null ? findingsCount + ' 漏洞' : '0 漏洞') + (patchesCount != null ? ' · ' + patchesCount + ' 修复' : '') +
      '</span></div><div class="card-b">' + runInfo + '</div></div>' +
      '</div>';
  }

  // ------------------------------------------------------ projects view
  function projectRow(p) {
    var initial = String(p.name).replace(/[^\u4e00-\u9fa5A-Za-z]/g, '').slice(0, 1) || '·';
    var sev = p.severity || {};
    var totalFindings = (sev.critical || 0) + (sev.high || 0) + (sev.medium || 0) + (sev.low || 0) + (sev.info || 0);
    var badges = '';
    if (p.metrics && p.metrics.errors > 0) badges += '<span class="badge b-critical">' + p.metrics.errors + ' 错误</span>';
    if (sev.critical) badges += '<span class="badge b-critical">' + sev.critical + ' 严重</span>';
    if (sev.high) badges += '<span class="badge b-high">' + sev.high + ' 高危</span>';
    if (sev.medium) badges += '<span class="badge b-medium">' + sev.medium + ' 中</span>';
    if (sev.low) badges += '<span class="badge b-low">' + sev.low + ' 低</span>';
    if (!totalFindings) badges += '<span class="badge b-info">无发现</span>';
    return '<a class="project-row" href="#/projects/' + encodeURIComponent(p.id) + '" style="text-decoration:none;color:inherit">' +
      '<div class="glyph">' + esc(initial) + '</div>' +
      '<div style="min-width:0">' +
      '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
      '<span class="b" style="font-size:15px;color:var(--text);white-space:nowrap">' + esc(p.name) + '</span>' +
      '<span class="muted xs mono">' + esc(p.id) + '</span>' +
      '<span class="status ' + p.status + '"><span class="pulse"></span>' + esc(p.status) + '</span>' +
      '</div>' +
      '<div class="muted xs" style="margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">' + esc(p.description) + '</div>' +
      '<div style="display:flex;gap:12px;margin-top:8px;color:var(--text-faint);font-size:11.5px;white-space:nowrap;overflow:hidden">' +
      '<span class="mono">' + esc(p.phase_label) + '</span><span>·</span>' +
      '<span>启动 ' + fmtRelTime(p.started_at) + '</span>' +
      (p.status === 'running' ? '<span>·</span><span class="brand-text mono">' + Math.round(p.progress) + '%</span>' : '') +
      (p.duration ? '<span>·</span><span>耗时 ' + fmtDuration(p.duration) + '</span>' : '') +
      '<span>·</span><span class="mono" title="' + esc(p.target) + '">' + esc(p.target) + '</span>' +
      '</div>' +
      (p.status === 'running' ? '<div class="bar-track" style="margin-top:8px;max-width:320px"><div class="bar-fill" style="width:' + p.progress + '%"></div></div>' : '') +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end">' + badges + '</div>' +
      '<div style="display:flex;gap:6px;flex-shrink:0">' +
      '<span class="btn sm">打开 ' + icon('chevron', 11) + '</span>' +
      '<button class="btn sm danger" data-del="' + encodeURIComponent(p.id) + '" title="演示环境为静态快照，不支持删除">' + icon('x', 11) + ' 删除</button>' +
      '</div></a>';
  }

  function ProjectsView() {
    var q = STATE.query.trim().toLowerCase();
    var filtered = !q ? D.projects : D.projects.filter(function (p) {
      return [p.name, p.id, p.target, p.description, p.phase_label].some(function (v) {
        return String(v || '').toLowerCase().indexOf(q) !== -1;
      });
    });
    var body = filtered.length ? filtered.map(projectRow).join('') :
      '<div class="empty"><div class="glyph">' + icon('project') + '</div>没有匹配的扫描任务</div>';
    return PageHead({
      title: '任务',
      actions: '<div class="field" style="margin:0;min-width:240px"><input class="input" id="proj-search" value="' + esc(STATE.query) + '" placeholder="搜索任务 / 目标 / ID"/></div>' +
        '<button class="btn primary" id="btn-newproject2">' + icon('plus', 14) + ' 新建扫描任务</button>'
    }) + '<div class="page-body"><div class="stack" style="gap:10px">' + body + '</div></div>';
  }

  // --------------------------------------------------- project cards/lists
  function CandidateCard(c, compact) {
    var statusLabel = CAND_STATUS_LABEL[c.status] || c.status || '未知';
    var statusBadgeCls = CAND_STATUS_BADGE[c.status] || 'b-info';
    var terminalText = c.status === 'promoted' ? '已进入已确认漏洞' : c.status === 'rejected' ? '验证后不再推进' : '';
    var why = c.why_suspicious || [];
    var whyList = (compact ? why.slice(0, 2) : why).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('');
    if (compact && why.length > 2) whyList += '<li class="more">…还有 ' + (why.length - 2) + ' 条信号</li>';
    return '<div class="cand sev-' + esc(c.suspected_severity) + (c.status === 'rejected' ? ' is-rejected' : '') + '" data-cand="' + esc(c.id) + '">' +
      '<div class="head">' +
      '<span class="badge ' + statusBadgeCls + '">' + esc(statusLabel) + '</span>' +
      '<span class="badge ' + sevColor(c.suspected_severity) + '">疑似 ' + esc(c.suspected_severity) + '</span>' +
      '<span class="muted xs mono">' + esc(c.id) + '</span><span class="muted xs">·</span>' +
      '<span class="muted xs">' + esc(c.suspected_category) + '</span>' +
      '<span class="spacer"></span>' +
      '<span class="muted xs mono" title="可疑度">SUSPICION <span class="b" style="color:var(--text)">' + Math.round(c.confidence * 100) + '%</span></span>' +
      '</div>' +
      '<h4>' + esc(c.title) + '</h4>' +
      (c.file && c.file !== '—' ? '<div class="loc">' + icon('file', 11) + ' ' + esc(c.file) + ':' + esc(c.line) + '</div>' : '') +
      '<div class="cand-why"><div class="cand-why-lbl">为何可疑</div>' +
      '<ul class="cand-why-list"' + (compact ? ' style="-webkit-line-clamp:2"' : '') + '>' + whyList + '</ul></div>' +
      '<div class="cand-foot"><span class="muted xs mono">来源 ' + esc(c.source) + '</span><span class="spacer"></span>' +
      '<span class="muted xs">' + (terminalText
        ? esc(terminalText)
        : '下一步：<span class="b" style="color:var(--text)">' + esc(c.next_action ? String(c.next_action).split(/[:：]/)[0] : '待定') + '</span>') +
      '</span></div></div>';
  }

  function FindingCard(f, compact) {
    var desc = compact
      ? '<p style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + esc(f.description) + '</p>'
      : '<p>' + esc(f.description) + '</p>';
    return '<div class="find sev-' + esc(f.severity) + '" data-find="' + esc(f.id) + '">' +
      '<div class="head">' +
      '<span class="badge ' + sevColor(f.severity) + '">' + esc(f.severity) + '</span>' +
      '<span class="muted xs mono">' + esc(f.id) + '</span><span class="muted xs">·</span>' +
      '<span class="muted xs">' + esc(f.category) + '</span><span class="muted xs">·</span>' +
      '<span class="muted xs mono">' + esc(f.cwe) + '</span>' +
      '<span class="spacer"></span>' +
      '<span class="muted xs">置信度 <span class="b mono brand-text">' + (f.confidence * 100).toFixed(0) + '%</span></span>' +
      '</div>' +
      '<h4>' + esc(f.title) + '</h4>' +
      (f.file !== '—' ? '<div class="loc">' + icon('file', 11) + ' ' + esc(f.file) + ':' + esc(f.line) + '</div>' : '') +
      desc + '</div>';
  }

  function Empty(iconName, label) {
    return '<div class="empty" style="padding:80px"><div class="glyph">' + icon(iconName) + '</div>' + esc(label) + '</div>';
  }

  function CandidatesList(candidates, fixedStatus) {
    if (!candidates.length) return Empty('bug', '本任务还没有生成候选');
    var status = STATE.candStatus, sev = STATE.candSev;
    var activeStatus = fixedStatus || status;
    var filtered = candidates;
    if (activeStatus !== 'all') filtered = filtered.filter(function (c) { return c.status === activeStatus; });
    if (sev !== 'all') filtered = filtered.filter(function (c) { return c.suspected_severity === sev; });
    var counts = {
      pending: candidates.filter(function (c) { return c.status === 'pending'; }).length,
      probing: candidates.filter(function (c) { return c.status === 'probing'; }).length,
      promoted: candidates.filter(function (c) { return c.status === 'promoted'; }).length,
      rejected: candidates.filter(function (c) { return c.status === 'rejected'; }).length,
      all: candidates.length
    };
    var banner = '';
    if (!fixedStatus) {
      banner = '<div class="cand-banner">' + icon('info', 15) +
        '<div><b>候选 ≠ 确认漏洞。</b><span class="muted sm"> 候选按验证状态归类：待验证、验证中、已确认漏洞、已排除漏洞。</span></div>' +
        '<span class="spacer"></span><span class="muted xs mono">待验证 ' + counts.pending + ' · 验证中 ' + counts.probing + ' · 已确认漏洞 ' + counts.promoted + ' · 已排除漏洞 ' + counts.rejected + '</span></div>';
    }
    var segStatus = '';
    if (!fixedStatus) {
      var opts = [['pending', '待验证 ' + counts.pending], ['probing', '验证中 ' + counts.probing], ['promoted', '已确认漏洞 ' + counts.promoted], ['rejected', '已排除漏洞 ' + counts.rejected], ['all', '全部 ' + counts.all]];
      segStatus = '<span class="muted xs mono" style="letter-spacing:.1em;text-transform:uppercase">STATUS</span><div class="seg">' +
        opts.map(function (o) { return '<button class="' + (status === o[0] ? 'on' : '') + '" data-cs="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div><span style="width:12px"></span>';
    }
    var sevSeg = ['all', 'critical', 'high', 'medium', 'low'].map(function (s) {
      return '<button class="' + (sev === s ? 'on' : '') + '" data-csev="' + s + '">' + (s === 'all' ? '全部' : s) + '</button>';
    }).join('');
    return '<div class="stack" style="gap:14px">' + banner +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' + segStatus +
      '<span class="muted xs mono" style="letter-spacing:.1em;text-transform:uppercase">SEVERITY</span>' +
      '<div class="seg">' + sevSeg + '</div><span class="spacer"></span>' +
      '<span class="muted xs mono">' + filtered.length + ' 项</span></div>' +
      (filtered.length ? filtered.map(function (c) { return CandidateCard(c); }).join('')
        : Empty('bug', (CAND_STATUS_LABEL[activeStatus] || '这个筛选') + '下没有候选')) +
      '</div>';
  }

  function FindingsList(findings) {
    if (!findings.length) return Empty('bug', '暂无已确认漏洞');
    var sev = STATE.findSev;
    var filtered = sev === 'all' ? findings : findings.filter(function (f) { return f.severity === sev; });
    var seg = ['all', 'critical', 'high', 'medium', 'low'].map(function (s) {
      return '<button class="' + (sev === s ? 'on' : '') + '" data-fsev="' + s + '">' + (s === 'all' ? '全部' : s) + '</button>';
    }).join('');
    return '<div class="stack" style="gap:14px">' +
      '<div style="display:flex;gap:8px;align-items:center">' +
      '<span class="muted xs mono" style="letter-spacing:.1em;text-transform:uppercase">FILTER</span>' +
      '<div class="seg">' + seg + '</div><span class="spacer"></span>' +
      '<span class="muted xs mono">' + filtered.length + ' / ' + findings.length + '</span></div>' +
      filtered.map(function (f) { return FindingCard(f); }).join('') + '</div>';
  }

  function ConfirmedVulnerabilitiesView(findings, promotedCandidates) {
    var findingIds = {}; findings.forEach(function (f) { findingIds[f.id] = true; });
    var extra = (promotedCandidates || []).filter(function (c) { return !findingIds[c.id]; });
    if (!findings.length && !extra.length) return Empty('bug', '暂无已确认漏洞');
    return '<div class="stack" style="gap:14px">' +
      (findings.length ? FindingsList(findings) : '') +
      (extra.length ? '<div class="stack" style="gap:10px">' + extra.map(function (c) { return CandidateCard(c); }).join('') + '</div>' : '') +
      '</div>';
  }

  function PatchesList(patches, findings) {
    if (!patches.length) return Empty('code', '暂无修复建议');
    return '<div class="stack" style="gap:12px">' + patches.map(function (p) {
      var f = findings.find(function (x) { return x.id === p.finding_id; });
      return '<div class="find" style="cursor:default">' +
        '<div class="head">' +
        '<span class="badge ' + validationStatusBadge(p.status) + '">' + esc(p.status) + '</span>' +
        '<span class="badge b-info">' + esc(p.type) + '</span>' +
        '<span class="muted xs mono">' + esc(p.id) + '</span><span class="muted xs">·</span>' +
        '<span class="muted xs">关联 <a href="#" data-find-link="' + esc(p.finding_id) + '" class="mono">' + esc(p.finding_id) + '</a></span>' +
        '<span class="spacer"></span>' +
        '<button class="btn sm" data-find-link="' + esc(p.finding_id) + '">' + icon('eye', 12) + ' 查看详情</button>' +
        '</div><h4>' + esc(p.summary) + '</h4>' +
        '<div class="loc">' + icon('file', 11) + ' ' + esc(p.file) + '</div>' +
        '<p class="mono xs" style="background:var(--bg-sunken);padding:8px 10px;border-radius:4px">' + esc(p.test_output) + '</p>' +
        '</div>';
    }).join('') + '</div>';
  }

  // ------------------------------------------------------ agent activity
  function AgentActivityPanel(project, artifacts, logLines) {
    var activity = ensureObj(artifacts.agent_activity);
    var groups = ensureObj(activity.groups);
    var g = function (k) { return ensureObj(groups[k]); };
    var discovery = g('discovery'), validation = g('validation');
    var otherKeys = ['profile', 'environment', 'ranking', 'remediation', 'other'];
    var other = { running: 0, completed: 0, failed: 0, stale: 0 };
    otherKeys.forEach(function (k) {
      var it = g(k);
      other.running += num(it.running); other.completed += num(it.completed);
      other.failed += num(it.failed); other.stale += num(it.stale);
    });
    var activeAgents = asArray(activity.agents).filter(function (a) {
      return ['running', 'started', 'in_progress', 'stale'].indexOf(String(ensureObj(a).status || '').toLowerCase()) !== -1;
    }).slice(0, 8);
    var failures = agentFailureItems(activity, artifacts.agent_pool_status);
    var cards = [
      { key: 'total', label: '总运行 Agent', value: num(activity.running_total), done: num(activity.completed_total), failed: num(activity.failed_total), stale: num(activity.stale_total), capacity: activity.capacity },
      { key: 'discovery', label: '发现漏洞', value: num(discovery.running) + num(discovery.stale), done: num(discovery.completed), failed: num(discovery.failed), stale: num(discovery.stale) },
      { key: 'validation', label: '验证漏洞', value: num(validation.running) + num(validation.stale), done: num(validation.completed), failed: num(validation.failed), stale: num(validation.stale) },
      { key: 'other', label: '其他 Agent', value: other.running + other.stale, done: other.completed, failed: other.failed, stale: other.stale }
    ];
    var cardsHtml = cards.map(function (it) {
      return '<div class="agent-load-card ' + it.key + (num(it.failed) ? ' failed' : '') + '"><span>' + esc(it.label) + '</span>' +
        '<b class="mono">' + it.value + '</b><small>' +
        (it.capacity != null ? '池容量 ' + it.capacity + ' · ' : '') + '已完成 ' + it.done +
        (it.failed ? ' · 失败 ' + it.failed : '') + (it.stale ? ' · 超预算 ' + it.stale : '') +
        '</small></div>';
    }).join('');
    var failuresHtml = failures.length ? '<div class="agent-failures">' + failures.map(function (a) {
      return '<div class="agent-failure">' + icon('alert', 13) + '<div><b>' + esc(a.kind_label || 'Agent') + ' · ' + esc(a.label) + '</b>' +
        '<span>' + esc(a.status) + (a.error ? '：' + esc(a.error) : '') + (a.elapsed_seconds != null ? ' · ' + fmtDuration(a.elapsed_seconds) : '') + '</span></div></div>';
    }).join('') + '</div>' : '';
    var activeHtml = activeAgents.length ? '<div class="agent-load-active">' + activeAgents.map(function (a) {
      var aa = ensureObj(a);
      return '<span class="agent-chip ' + esc(aa.kind || 'other') + '">' + esc(aa.kind_label || aa.kind || 'Agent') + ' · ' + esc(aa.label) +
        (aa.elapsed_seconds != null ? '<b class="mono">' + fmtDuration(aa.elapsed_seconds) + '</b>' : '') + '</span>';
    }).join('') + '</div>' : '';

    var items = D.activityByJob[project.id] || [];
    var itemsHtml = items.length ? items.map(function (item) {
      return '<div class="activity-row"><div class="activity-dot"></div><div class="activity-main">' +
        '<div class="activity-head"><span class="badge b-info">' + esc(item.source) + '</span>' +
        (item.time ? '<span class="muted xs mono">' + esc(item.time) + '</span>' : '') + '</div>' +
        '<div class="activity-title">' + esc(item.title) + '</div>' +
        (item.detail && item.detail.length ? '<ul>' + item.detail.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
        '</div></div>';
    }).join('') : '<div class="empty" style="padding:36px"><div class="glyph">' + icon('log') + '</div>暂无实时活动</div>';

    return '<div class="card"><div class="card-h">' +
      '<div style="display:flex;align-items:center;gap:10px"><h3>实时 Agent 活动</h3>' +
      (project.status === 'running' ? '<span class="status running"><span class="pulse"></span>live</span>' : '') +
      (failures.length ? '<span class="badge b-critical">' + failures.length + ' 异常</span>' : '') +
      '</div><span class="muted xs mono">' + num(activity.running_total) + ' RUNNING · ' + failures.length + ' FAILED · ' + items.length + ' EVENTS</span>' +
      '</div><div class="card-b agent-activity">' +
      '<div class="agent-load"><div class="agent-load-grid">' + cardsHtml + '</div>' + failuresHtml + activeHtml + '</div>' +
      itemsHtml + '</div></div>';
  }

  var FAILED_STATUSES = ['failed', 'error', 'timeout', 'timed_out', 'cancelled', 'aborted', 'stale'];
  function agentFailureItems(activity, pool) {
    activity = ensureObj(activity); pool = ensureObj(pool);
    var groups = ensureObj(activity.groups);
    var rawItems = asArray(activity.agents).concat(asArray(pool.active), asArray(pool.recent));
    var seen = {}, failures = [];
    rawItems.forEach(function (raw, idx) {
      var r = ensureObj(raw);
      var status = String(r.status || '').toLowerCase();
      var hasError = Boolean(r.error || r.message);
      if (FAILED_STATUSES.indexOf(status) === -1 && !hasError) return;
      var kind = r.kind || r.stage || 'other';
      var group = ensureObj(groups[kind]);
      var label = r.label || r.name || r.function || r.id || ('Agent ' + (idx + 1));
      var key = kind + ':' + label + ':' + status + ':' + (r.started_at || '');
      if (seen[key]) return;
      seen[key] = true;
      failures.push({ label: label, kind: kind, kind_label: r.kind_label || group.label || kind || 'Agent', status: status || 'failed', error: r.error || r.message || '', elapsed_seconds: r.elapsed_seconds, started_at: r.started_at });
    });
    if (!failures.length && (num(activity.failed_total) || num(activity.stale_total))) {
      failures.push({ label: 'Agent 执行异常', kind: 'other', kind_label: 'Agent', status: num(activity.failed_total) ? 'failed' : 'stale', error: num(activity.failed_total) + ' 个失败，' + num(activity.stale_total) + ' 个超预算。' });
    }
    return failures.slice(0, 8);
  }

  // ------------------------------------------------------------ overview
  function ConfigRow(label, value, mono) {
    return '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">' +
      '<span class="muted xs" style="flex-shrink:0;font-family:IBM Plex Mono,monospace;letter-spacing:.06em;text-transform:uppercase">' + esc(label) + '</span>' +
      '<span class="b xs ' + (mono ? 'mono' : '') + '" style="text-align:right;color:var(--text);overflow-wrap:anywhere;max-width:70%">' + esc(value || '—') + '</span></div>';
  }

  function Overview(project, findings, candidates, artifacts, logLines) {
    var sev = project.severity || {};
    var isOpen = function (c) { return c.status === 'pending' || c.status === 'probing'; };
    var openCands = (candidates || []).filter(isOpen);
    var topCands = openCands.slice().sort(function (a, b) {
      var o = { critical: 0, high: 1, medium: 2, low: 3 };
      return o[a.suspected_severity] - o[b.suspected_severity];
    }).slice(0, 3);
    var badgeMap = { critical: 'b-critical', high: 'b-high', medium: 'b-medium', low: 'b-low' };
    var barMap = { critical: 'var(--sig-critical)', high: 'var(--sig-high)', medium: 'var(--sig-medium)', low: 'var(--sig-low)' };
    var sevRows = ['critical', 'high', 'medium', 'low'].map(function (k) {
      var count = sev[k] || 0;
      return '<div style="display:grid;grid-template-columns:60px 1fr 40px;gap:12px;align-items:center">' +
        '<span class="badge ' + badgeMap[k] + '">' + ({ critical: '严重', high: '高危', medium: '中等', low: '低危' })[k] + '</span>' +
        '<div style="height:6px;border-radius:3px;background:var(--bg-sunken);overflow:hidden;border:1px solid var(--line)">' +
        '<div style="width:' + (count / (findings.length || 1) * 100) + '%;height:100%;background:' + barMap[k] + '"></div></div>' +
        '<span class="mono b" style="text-align:right;color:var(--text)">' + count + '</span></div>';
    }).join('');

    var out = '<div class="stack" style="gap:18px">' +
      '<div class="card"><div class="card-h"><h3>阶段流水线</h3>' +
      '<span class="muted xs">总进度 <span class="brand-text b mono">' + Math.round(project.progress) + '%</span></span></div>' +
      '<div class="card-b">' + StagePipeline(project.stages) +
      '<div class="bar-track" style="margin-top:16px"><div class="bar-fill" style="width:' + project.progress + '%"></div></div>' +
      '</div></div>' +
      AgentActivityPanel(project, artifacts, logLines) +
      '<div class="grid grid-4">' +
      StatTile('候选', project.metrics.candidates) + StatTile('验证记录', project.metrics.probes) +
      StatTile('已确认漏洞', project.metrics.findings, project.metrics.findings ? 'crit' : '') +
      StatTile('修复建议', project.metrics.patches) + '</div>' +
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:18px">' +
      '<div class="card"><div class="card-h"><h3>严重度分布</h3><span class="muted xs mono">' + findings.length + ' TOTAL</span></div>' +
      '<div class="card-b stack-sm">' + sevRows + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>扫描配置</h3></div><div class="card-b stack-sm">' +
      ConfigRow('模式', project.phase_label) + ConfigRow('类型', project.target_type || '目标文件') +
      ConfigRow('目标', project.target, true) + ConfigRow('模型', project.model_config || '默认（环境变量）') +
      ConfigRow('开始', fmtAbs(project.started_at), true) +
      (project.duration ? ConfigRow('耗时', fmtDuration(project.duration), true) : '') +
      '</div></div></div>';

    if (findings.length) {
      out += '<div class="card"><div class="card-h"><h3>最严重的发现</h3>' +
        '<button class="btn sm ghost" data-tab="confirmed">查看全部 ' + icon('chevron', 11) + '</button></div>' +
        '<div class="card-b stack" style="gap:10px">' + findings.slice(0, 3).map(function (f) { return FindingCard(f, true); }).join('') + '</div></div>';
    }
    if (topCands.length) {
      out += '<div class="card"><div class="card-h"><h3>待验证候选 <span class="muted xs mono" style="margin-left:8px">' + openCands.length + ' 项</span></h3>' +
        '<button class="btn sm ghost" data-tab="pending">查看全部 ' + icon('chevron', 11) + '</button></div>' +
        '<div class="card-b stack" style="gap:10px">' + topCands.map(function (c) { return CandidateCard(c, true); }).join('') + '</div></div>';
    }
    return out + '</div>';
  }

  // ------------------------------------------------------------- report
  function ReportFinding(f, idx) {
    var snippet = (f.code_snippet || []).map(function (row) {
      return '<div class="' + (row.highlight ? 'lh' : '') + '"><span class="ln">' + esc(row.ln) + '</span>' + esc(row.text) + '</div>';
    }).join('');
    return '<section style="margin-top:22px;padding:16px 18px;border:1px solid var(--line);border-radius:8px;background:var(--bg-sunken)">' +
      '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
      '<span class="mono b" style="color:var(--text-muted);font-size:13px">2.' + idx + '</span>' +
      '<span class="badge ' + sevColor(f.severity) + '">' + esc(f.severity) + '</span>' +
      '<span class="muted xs mono">' + esc(f.id) + '</span><span class="muted xs">·</span>' +
      '<span class="muted xs mono">' + esc(f.cwe) + '</span><span class="spacer"></span>' +
      '<span class="muted xs">置信度 <span class="b mono brand-text">' + (f.confidence * 100).toFixed(0) + '%</span></span>' +
      '</div>' +
      '<h3 style="margin:0 0 8px;color:var(--text)">' + esc(f.title) + '</h3>' +
      (f.file !== '—' ? '<div class="loc" style="margin-bottom:10px">' + icon('file', 11) + ' <span class="mono">' + esc(f.file) + ':' + esc(f.line) + '</span></div>' : '') +
      '<p style="margin-top:8px"><b>描述：</b>' + esc(f.description) + '</p>' +
      (f.impact ? '<p><b>影响：</b>' + esc(f.impact) + '</p>' : '') +
      (f.recommendation ? '<p><b>建议：</b><span style="white-space:pre-line">' + esc(f.recommendation) + '</span></p>' : '') +
      (snippet ? '<pre class="code" style="margin-top:10px">' + snippet + '</pre>' : '') +
      '</section>';
  }

  function ReportView(project, findings, probes, patches) {
    var sev = project.severity || {};
    var critical = findings.filter(function (f) { return f.severity === 'critical'; });
    var high = findings.filter(function (f) { return f.severity === 'high'; });
    var order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    var sorted = findings.slice().sort(function (a, b) { return order[a.severity] - order[b.severity]; });
    var blockquote = (critical.length || high.length) ?
      '<blockquote><b>需要立即关注：</b>' + critical.length + ' 个严重漏洞 + ' + high.length + ' 个高危漏洞。' +
      (critical[0] ? ' 最严重的是 <span class="mono">' + esc(critical[0].id) + '</span> — ' + esc(critical[0].title) + '。' : '') +
      '</blockquote>' : '';
    var total = findings.length;
    return '<div class="report">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:10px">' +
      '<div><div class="muted xs mono" style="letter-spacing:.18em;text-transform:uppercase;margin-bottom:6px">书安 安全扫描报告</div>' +
      '<h1>' + esc(project.name) + '</h1>' +
      '<p class="muted" style="margin:6px 0 0;font-size:14px">' + esc(project.description) + '</p></div>' +
      '<div class="report-actions" style="display:flex;gap:6px;flex-shrink:0">' +
      '<button class="btn sm" id="btn-report-pdf" title="打开浏览器打印对话框，可选择“另存为 PDF”">' + icon('download', 12) + ' PDF</button>' +
      '<button class="btn sm" id="btn-report-md" title="下载 Markdown 报告">' + icon('copy', 12) + ' Markdown</button>' +
      '</div></div>' +
      '<div class="report-meta">' +
      '<div><div class="m-label">扫描 ID</div><div class="m-value">' + esc(project.id) + '</div></div>' +
      '<div><div class="m-label">模式</div><div class="m-value">' + esc(project.phase) + '</div></div>' +
      '<div><div class="m-label">开始时间</div><div class="m-value">' + fmtAbs(project.started_at) + '</div></div>' +
      '<div><div class="m-label">耗时</div><div class="m-value">' + (project.duration ? fmtDuration(project.duration) : '进行中') + '</div></div>' +
      '</div>' +
      '<h2>1. 总览</h2>' +
      '<p>本次扫描在 <span class="mono brand-text">' + esc(project.target) + '</span> 上执行 <b>' + esc(project.phase_label) + '</b>，' +
      '共生成 <b class="mono">' + project.metrics.candidates + '</b> 个候选，沉淀 <b class="mono">' + project.metrics.probes + '</b> 条验证/环境证据，' +
      '最终确认 <b class="mono" style="color:' + (total ? 'var(--sig-critical)' : 'var(--text)') + '">' + total + '</b> 个漏洞。</p>' +
      blockquote +
      '<h3>严重度分布</h3><ul>' +
      '<li><b style="color:var(--sig-critical)">严重</b>：' + (sev.critical || 0) + ' 个 — 通常意味着可被未授权攻击者远程触发的高影响漏洞</li>' +
      '<li><b style="color:var(--sig-high)">高危</b>：' + (sev.high || 0) + ' 个 — 在特定条件下可造成较大影响</li>' +
      '<li><b style="color:var(--sig-medium)">中等</b>：' + (sev.medium || 0) + ' 个 — 通常需要满足前置条件</li>' +
      '<li><b style="color:var(--text-muted)">低危</b>：' + (sev.low || 0) + ' 个 — 信息泄露、配置不当类</li>' +
      '</ul>' +
      '<h2>2. 漏洞详情</h2>' +
      (sorted.length ? sorted.map(function (f, i) { return ReportFinding(f, i + 1); }).join('') : '<p>本次扫描未发现确认的漏洞。</p>') +
      '<h2>3. 修复建议汇总</h2>' +
      (patches.length ? '<ul>' + patches.map(function (p) {
        return '<li><span class="mono brand-text">' + esc(p.id) + '</span> — ' + esc(p.summary) + '<br/>' +
          '<span class="muted xs mono">关联 ' + esc(p.finding_id) + ' · ' + esc(p.file) + ' · ' + esc(p.test_output) + '</span></li>';
      }).join('') + '</ul>' : '<p>当前扫描未生成自动修复建议。建议参考第 2 节中各漏洞的「修复建议」部分。</p>') +
      '<h2>4. 验证记录</h2>' +
      (probes.length ? '<p>共有 <b class="mono">' + probes.length + '</b> 条验证记录，其中 <b class="mono brand-text">' +
        probes.filter(function (p) { return ['confirmed', 'succeeded', 'passed'].indexOf(p.status) !== -1; }).length +
        '</b> 条返回确认或通过结果。详细原始记录可在“结果文件”中查看。</p>'
        : '<p>本次扫描暂无验证记录。</p>') +
      '<h2>5. 附录</h2><h3>5.1 扫描配置</h3><ul>' +
      '<li>模式：<span class="mono">' + esc(project.phase) + '</span>（' + esc(project.phase_label) + '）</li>' +
      '<li>目标：<span class="mono">' + esc(project.target) + '</span></li>' +
      '<li>大模型：' + esc(project.model_config || '服务器环境变量') + '</li>' +
      '<li>开始时间：<span class="mono">' + fmtAbs(project.started_at) + '</span></li></ul>' +
      '<h3>5.2 致谢</h3>' +
      '<p>本报告由 <b>书安 A3S</b> 智能体生成。所有漏洞均经过大模型多轮推理与运行时探针双重确认。如需复测，请到该任务页点击“重新扫描”。</p>' +
      '<div style="margin-top:48px;padding-top:18px;border-top:1px dashed var(--line);color:var(--text-faint);font-size:11.5px;font-family:IBM Plex Mono,monospace">' +
      '— END OF REPORT —<br/>Generated by 书安 v2.4.0 · build a3c1f02 · ' + fmtAbs(project.started_at) + '</div>' +
      '</div>';
  }

  // ----------------------------------------------------------- artifacts
  var ARTIFACT_GROUPS = [
    { id: 'report', title: '报告与总览', hint: '最终给用户看的报告、摘要和过程总览。' },
    { id: 'profile', title: '目标画像与情报', hint: '识别目标、版本线索、情报检索、风险关注度地图。' },
    { id: 'environment', title: '环境与可验证条件', hint: '本地环境探针、目录快照、构建/运行/隔离/清理策略。' },
    { id: 'discovery', title: '候选发现', hint: '静态候选、二进制快速种子、专长智能体候选和发现规划。' },
    { id: 'ranking', title: '排序与上下文包', hint: '候选去重、归因、优先级排序和验证上下文补全。' },
    { id: 'validation', title: '验证、裁决与恢复', hint: '验证计划、验证结果、裁决、环境恢复和最终确认漏洞集合。' },
    { id: 'remediation', title: '修复与缓解', hint: '源码补丁、无源码缓解建议、复测和整理结论。' },
    { id: 'logs', title: '运行日志', hint: '编排器事件、错误流、A3S 交互流水和实时调试日志。' },
    { id: 'a3s', title: 'A3S 调试材料', hint: '每个智能体的 prompt、response、meta、events、snapshot 和 parsed JSON。' },
    { id: 'errors', title: '错误诊断', hint: '阶段异常、环境错误和调试失败信息。' },
    { id: 'other', title: '其他产物', hint: '尚未归入标准流水线的辅助文件。' }
  ];

  function artifactKind(relPath) {
    var name = relPath.split('/').pop() || relPath;
    if (name.endsWith('.jsonl')) return 'JSONL';
    if (name.endsWith('.json')) return 'JSON';
    if (name.endsWith('.md')) return 'Markdown';
    if (name.endsWith('.txt')) return 'Text';
    if (name.endsWith('.diff')) return 'Diff';
    return (name.split('.').pop() || 'file').toUpperCase();
  }

  function artifactInfo(relPath) {
    var path = String(relPath || '');
    var name = path.split('/').pop() || path;
    var base = { group: 'other', role: '辅助产物', audience: '需要时查看', kind: artifactKind(path), priority: 90 };
    if (path === 'SUMMARY.md') return Object.assign(base, { group: 'report', role: '最终中文摘要', audience: '汇报/快速阅读', priority: 1 });
    if (name === 'report.md') return Object.assign(base, { group: 'report', role: '完整漏洞检测报告', audience: '用户/评审', priority: 2 });
    if (name === 'summary.json') return Object.assign(base, { group: 'report', role: '机器可读摘要', audience: '前端/自动化集成', priority: 3 });
    if (name === 'process.md') return Object.assign(base, { group: 'report', role: '流水线过程记录', audience: '排查进度/复盘', priority: 4 });
    if (name === 'state.json') return Object.assign(base, { group: 'report', role: '任务阶段状态快照', audience: '控制台/自动化', priority: 5 });
    if (name === 'artifact_index.json') return Object.assign(base, { group: 'report', role: '产物索引', audience: '控制台定位文件', priority: 6 });
    if (name === 'feedback_memory.json') return Object.assign(base, { group: 'report', role: '反馈记忆', audience: '后续扫描复用', priority: 7 });
    if (path.indexOf('00_profile_intel/') === 0) {
      var m = {
        'project_profile.json': { role: '本地粗扫描画像', audience: '后续智能体共享事实层', priority: 10 },
        'profile_summary.json': { role: '目标画像智能体输出', audience: '理解目标身份/入口面', priority: 11 },
        'raw_intel_query_plan.json': { role: '情报检索计划', audience: '确认检索关键词', priority: 12 },
        'raw_intel_queries.json': { role: '情报检索词', audience: '检查查询来源', priority: 13 },
        'raw_intel.json': { role: '公开情报原始预取结果', audience: '追溯情报输入', priority: 14 },
        'vulnerability_intel.json': { role: '安全情报智能体结论', audience: '看危险版本/历史模式', priority: 15 },
        'attention_map.json': { role: '风险关注度地图', audience: '看优先覆盖区域', priority: 16 },
        'top_attention_items.json': { role: '高关注区域摘要', audience: '快速定位关注点', priority: 17 },
        'agent_tool_capabilities.json': { role: '本地工具能力清单', audience: '理解 agent 可用工具', priority: 18 }
      }[name];
      if (m) return Object.assign(base, m, { group: 'profile' });
      if (path.indexOf('/intel_cache/') !== -1) return Object.assign(base, { group: 'profile', role: '单关键词情报缓存', audience: '调试情报预取', priority: 30 });
    }
    if (path.indexOf('01_environment/') === 0) {
      var e = {
        'local_environment_probe.json': { role: '本地环境探针', audience: '看工具/目录/隔离基线', priority: 10 },
        'directory_snapshot.json': { role: '目录快照', audience: '复现目标文件布局', priority: 11 },
        'environment.json': { role: '环境建立智能体输出', audience: '判断是否可验证', priority: 12 },
        'environment_plan.json': { role: '构建/运行/观测/清理计划', audience: '验证智能体复用', priority: 13 },
        'source_test_plan.json': { role: '源码测试计划', audience: '源码目标回归验证', priority: 14 },
        'script_artifacts.json': { role: '环境脚本产物', audience: '追踪本地命令证据', priority: 15 }
      }[name];
      if (e) return Object.assign(base, e, { group: 'environment' });
      if (name.indexOf('failure') !== -1) return Object.assign(base, { group: 'environment', role: '环境不可用原因', audience: '排查阻断点', priority: 16 });
    }
    if (path.indexOf('02_candidate_discovery/') === 0) {
      var d = {
        'static_candidates.json': { role: '轻量静态候选', audience: '候选发现起点', priority: 10 },
        'binary_fast_seed_candidates.json': { role: '二进制快速种子候选', audience: '无源码目标早期线索', priority: 11 },
        'agent_candidates.json': { role: '专长智能体候选', audience: '查看 agent 发现结果', priority: 12 },
        'discovery_plan.json': { role: '候选发现规划', audience: '看专长/切片分配', priority: 13 },
        'discovery_tasks.json': { role: '发现任务清单', audience: '追踪每个 agent 任务', priority: 14 }
      }[name];
      if (d) return Object.assign(base, d, { group: 'discovery' });
      if (name.indexOf('error') !== -1) return Object.assign(base, { group: 'errors', role: '候选发现错误', audience: '排查发现阶段', priority: 14 });
    }
    if (path.indexOf('03_candidate_ranking/') === 0) return Object.assign(base, { group: 'ranking', role: '候选合并排序结果', audience: '看去重/优先级/验证队列', priority: 10 });
    if (path.indexOf('04_validation/') === 0) {
      var v = {
        'candidate_context_bundles.json': { group: 'ranking', role: '候选上下文包', audience: '验证前的证据补全', priority: 11 },
        'validation_plan.json': { group: 'validation', role: '验证任务规划', audience: '看批次/隔离/证据目标', priority: 10 },
        'streaming_validation_records.json': { group: 'validation', role: '流式提前验证记录', audience: '看候选何时进入确认队列', priority: 11 },
        'validation_results.json': { group: 'validation', role: '安全确认智能体原始结果', audience: '确认/排除候选', priority: 11 },
        'validation_adjudication.json': { group: 'validation', role: '验证结果裁决', audience: '看最终保留与复验建议', priority: 12 },
        'findings.json': { group: 'validation', role: '最终确认漏洞集合', audience: '漏洞列表来源', priority: 13 },
        'environment_restore_plan.json': { group: 'validation', role: '环境恢复记录', audience: '看污染与清理动作', priority: 14 },
        'binary_validation_inconclusive.json': { group: 'validation', role: '无源码验证排除记录', audience: '二进制目标排查', priority: 15 }
      }[name];
      if (v) return Object.assign(base, v);
      if (name.indexOf('error') !== -1) return Object.assign(base, { group: 'errors', role: '验证阶段错误', audience: '排查确认失败', priority: 16 });
    }
    if (path.indexOf('05_remediation/') === 0) {
      var r = {
        'remediation_plan.json': { role: '修复/缓解规划', audience: '看任务拆分与顺序', priority: 10 },
        'patches.json': { role: '源码补丁结果', audience: '源码目标修复', priority: 11 },
        'remediations.json': { role: '无源码缓解建议', audience: '二进制/部署侧处置', priority: 12 },
        'remediation_review.json': { role: '修复结果整理', audience: '复测/剩余风险/回滚', priority: 13 },
        'patch.diff': { role: '补丁 diff', audience: '代码审查/应用补丁', priority: 14 }
      }[name];
      if (r) return Object.assign(base, r, { group: 'remediation' });
    }
    if (path.indexOf('06_report/') === 0) return Object.assign(base, { group: 'report', role: '报告阶段产物', audience: '用户阅读/系统集成', priority: 20 });
    if (path.indexOf('debug/logs/') === 0) {
      var l = {
        'events.jsonl': { role: '编排事件流', audience: '实时活动窗口来源', priority: 10 },
        'errors.jsonl': { role: '运行错误流', audience: '排查异常', priority: 11 },
        'a3s_interactions.jsonl': { role: 'A3S 交互日志', audience: '追踪 agent 调用', priority: 12 }
      }[name];
      return Object.assign(base, l || { group: 'logs', role: '调试日志', audience: '运行排查', priority: 20 });
    }
    if (path.indexOf('debug/a3s/') === 0) {
      if (name.indexOf('_prompt_') !== -1) return Object.assign(base, { group: 'a3s', role: '智能体 Prompt', audience: '调试输入上下文', priority: 10 });
      if (name.indexOf('_response_') !== -1) return Object.assign(base, { group: 'a3s', role: '智能体原始响应', audience: '调试模型输出', priority: 11 });
      if (name.indexOf('_meta_') !== -1) return Object.assign(base, { group: 'a3s', role: '智能体调用元信息', audience: '查看耗时/模型/配置', priority: 12 });
      if (name.indexOf('_events_') !== -1) return Object.assign(base, { group: 'a3s', role: '智能体工具事件', audience: '追踪命令与工具调用', priority: 13 });
      if (name.indexOf('_snapshot_') !== -1) return Object.assign(base, { group: 'a3s', role: '智能体上下文快照', audience: '复现输入状态', priority: 14 });
      if (name.indexOf('_parsed_') !== -1) return Object.assign(base, { group: 'a3s', role: '解析后的结构化输出', audience: '检查 JSON 解析结果', priority: 15 });
      return Object.assign(base, { group: 'a3s', role: 'A3S 调试产物', audience: '深入排查', priority: 20 });
    }
    if (path.indexOf('debug/errors/') === 0 || name.indexOf('error') !== -1) {
      return Object.assign(base, { group: 'errors', role: '错误诊断文件', audience: '定位异常阶段', priority: 10 });
    }
    return base;
  }

  function ArtifactsList(project, artifacts) {
    var files = artifacts.files || {};
    var names = Object.keys(files).sort();
    if (!names.length) return Empty('file', '暂无结果文件');
    var grouped = ARTIFACT_GROUPS.map(function (group) {
      return {
        id: group.id, title: group.title, hint: group.hint,
        items: names.map(function (name) { return { name: name, info: artifactInfo(name), file: files[name] }; })
          .filter(function (item) { return item.info.group === group.id; })
          .sort(function (a, b) { return (a.info.priority - b.info.priority) || a.name.localeCompare(b.name); })
      };
    }).filter(function (g) { return g.items.length; });
    var out = '<div class="artifact-catalog">' +
      '<div class="artifact-summary"><div><h3>结果文件归类</h3>' +
      '<p>按流水线阶段、日志类型和调试用途整理。正式结论优先看“报告与总览”“验证、裁决与恢复”，排查过程看“运行日志”和“A3S 调试材料”。</p></div>' +
      '<span class="muted xs mono">' + names.length + ' FILES · ' + grouped.length + ' GROUPS</span></div>';
    grouped.forEach(function (group) {
      out += '<section class="artifact-group"><div class="artifact-group-head"><div><h3>' + esc(group.title) + '</h3><p>' + esc(group.hint) + '</p></div>' +
        '<span class="badge b-info">' + group.items.length + '</span></div><div class="artifact-list">';
      group.items.forEach(function (item) {
        var iconName = (group.id === 'logs' || group.id === 'a3s') ? 'log' : 'file';
        out += '<a class="artifact-row" href="' + artifactHref(project.id, (item.file && item.file.path) || item.name) + '" target="_blank" rel="noreferrer">' +
          '<div class="artifact-icon">' + icon(iconName, 15) + '</div>' +
          '<div class="artifact-main"><div class="artifact-title"><span>' + esc(item.info.role) + '</span>' +
          '<span class="badge b-low">' + esc(item.info.kind) + '</span></div>' +
          '<div class="artifact-path mono">' + esc(item.name) + '</div>' +
          '<div class="artifact-desc">' + esc(item.info.audience) + '</div></div>' +
          '<div class="artifact-size mono">' + fmtBytes((item.file && item.file.size) || 0) + '</div></a>';
      });
      out += '</div></section>';
    });
    return out + '</div>';
  }

  // --------------------------------------------------------------- log
  function LogView(project, logLines, logSize) {
    var lines = (logLines || []).map(function (l, i) {
      return '<div class="l-' + esc(l.lvl) + '"><span class="l-dim">' + esc(l.t) + '</span> ' +
        '<span style="text-transform:uppercase;font-weight:600">' + esc(String(l.lvl).padEnd(4)) + '</span> ' +
        esc(l.msg) + '</div>';
    }).join('');
    return '<div class="card"><div class="card-h">' +
      '<div style="display:flex;align-items:center;gap:10px"><h3>实时日志</h3>' +
      (project.status === 'running' ? '<span class="status running"><span class="pulse"></span>streaming</span>' : '') +
      '<span class="muted xs mono">' + (logLines || []).length + ' 行 · ' + fmtBytes(logSize) + '</span></div>' +
      '<div style="display:flex;gap:8px"><label class="check"><input type="checkbox" id="log-autoscroll" ' + (STATE.logAutoscroll ? 'checked' : '') + '/> 自动滚动</label></div>' +
      '</div><div style="padding:0"><pre class="log" id="log-pre" style="border-radius:0;max-height:620px">' + lines +
      (project.status === 'running' ? '<div class="l-info" style="margin-top:6px">▌</div>' : '') +
      '</pre></div></div>';
  }

  // --------------------------------------------------- project detail
  function projectReportPath(project) {
    var files = project.files || {};
    var key = files['SUMMARY.md'] ? 'SUMMARY.md' : files['report.md'] ? 'report.md' : files['06_report/report.md'] ? '06_report/report.md' : '';
    return key ? artifactHref(project.id, key) : '';
  }

  function ProjectDetailView(project) {
    var artifacts = D.artifactsByJob[project.id] || {};
    var findings = (D.findingsByJob[project.id] || []);
    var candidates = (D.candidatesByJob[project.id] || []);
    var probes = (D.probesByJob[project.id] || []);
    var patches = (D.patchesByJob[project.id] || []);
    var logState = D.logsByJob[project.id] || { lines: [], size: 0 };
    var pending = candidates.filter(function (c) { return c.status === 'pending'; });
    var probing = candidates.filter(function (c) { return c.status === 'probing'; });
    var promoted = candidates.filter(function (c) { return c.status === 'promoted'; });
    var rejected = candidates.filter(function (c) { return c.status === 'rejected'; });
    var confirmedIds = {};
    findings.forEach(function (f) { confirmedIds[f.id] = true; });
    promoted.forEach(function (c) { confirmedIds[c.id] = true; });
    var confirmedCount = Object.keys(confirmedIds).length;
    var reportPath = projectReportPath(project);

    var tabs = [
      { id: 'overview', label: '概览' },
      { id: 'pending', label: '待验证', n: pending.length, sev: 'b-medium' },
      { id: 'probing', label: '验证中', n: probing.length, sev: 'b-brand' },
      { id: 'confirmed', label: '已确认漏洞', n: confirmedCount, sev: findings.some(function (f) { return f.severity === 'critical'; }) ? 'b-critical' : confirmedCount ? 'b-high' : '' },
      { id: 'rejected', label: '已排除漏洞', n: rejected.length, sev: 'b-medium' },
      { id: 'patches', label: '修复建议', n: patches.length },
      { id: 'report', label: '漏洞报告' },
      { id: 'artifacts', label: '结果文件', n: Object.keys(artifacts.files || {}).length },
      { id: 'log', label: '实时日志' }
    ];
    var tab = STATE.tab;
    var tabsHtml = tabs.map(function (t) {
      return '<button class="tab ' + (tab === t.id ? 'on' : '') + '" data-tab="' + t.id + '">' + esc(t.label) +
        (t.n != null && t.n > 0 ? '<span class="badge ' + (t.sev || 'b-info') + '">' + t.n + '</span>' : '') +
        '</button>';
    }).join('');

    var body;
    if (tab === 'overview') body = Overview(project, findings, candidates, artifacts, logState.lines);
    else if (tab === 'pending') body = CandidatesList(candidates, 'pending');
    else if (tab === 'probing') body = CandidatesList(candidates, 'probing');
    else if (tab === 'confirmed') body = ConfirmedVulnerabilitiesView(findings, promoted);
    else if (tab === 'rejected') body = CandidatesList(candidates, 'rejected');
    else if (tab === 'patches') body = PatchesList(patches, findings);
    else if (tab === 'report') body = ReportView(project, findings, probes, patches);
    else if (tab === 'artifacts') body = ArtifactsList(project, artifacts);
    else body = LogView(project, logState.lines, logState.size);

    return PageHead({ title: project.name, actions:
      (project.status === 'running' && project.id.indexOf('empty_') !== 0 ? '<button class="btn danger" id="btn-stop">' + icon('stop', 11) + ' 停止</button>' : '') +
      (project.status !== 'running' ? '<button class="btn" id="btn-refresh2" title="演示数据为静态快照">' + icon('refresh', 13) + ' 刷新</button>' : '') +
      (reportPath ? '<a class="btn" href="' + reportPath + '" target="_blank" rel="noreferrer">' + icon('download', 13) + ' 导出报告</a>'
        : '<button class="btn" disabled title="该任务没有报告产物">' + icon('download', 13) + ' 导出报告</button>') +
      '<button class="btn danger" id="btn-del" title="演示环境为静态快照，不支持删除">' + icon('x', 12) + ' 删除</button>'
    }) +
      '<div class="tabs">' + tabsHtml + '</div>' +
      '<div class="page-body">' + body + '</div>';
  }

  // --------------------------------------------------------------- models
  // Model configs persist to localStorage so added / edited / deleted entries survive reload.
  var MODEL_STORE_KEY = 'zhian-scan-models';
  function modelStoreSave() {
    try {
      var user = D.modelConfigs.filter(function (m) { return !m.read_only; });
      localStorage.setItem(MODEL_STORE_KEY, JSON.stringify(user));
    } catch (e) {}
  }
  function modelStoreLoad() {
    try {
      var raw = localStorage.getItem(MODEL_STORE_KEY);
      if (raw === null) { modelStoreSave(); return; } // first visit: keep the seeded configs
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return;
      D.modelConfigs = D.modelConfigs.filter(function (m) { return m.read_only; }).concat(arr);
    } catch (e) {}
  }
  function modelState(m) {
    if (m._testing) return { label: '测试中', cls: 'b-info', testing: true };
    if (m.last_test_status === 'failed') return { label: '未连通', cls: 'b-neutral' };
    if (m.has_api_key || m.last_test_status === 'passed') return { label: '已连通', cls: 'b-ok' };
    return { label: '未连通', cls: 'b-neutral' };
  }
  function modelValidate(d) {
    if (!(d.name || '').trim()) return '请填写模型名称';
    if (!(d.base_url || '').trim()) return '请填写 Base URL';
    if (!(d.api_key || '').trim() && !d.has_api_key) return '请填写 API Key';
    return '';
  }
  function maskKey(k) {
    var t = String(k || '').trim();
    return t.length > 8 ? t.slice(0, 3) + '...' + t.slice(-4) : '已保存';
  }

  function ModelsView() {
    var list = D.modelConfigs.length ? D.modelConfigs.map(function (m) {
      var st = modelState(m);
      var badge = m.read_only
        ? '<span class="badge b-info">只读</span>'
        : '<span class="badge ' + st.cls + (st.testing ? ' conn-testing' : '') + '">' + st.label + '</span>';
      var actions = m.read_only
        ? '<span class="muted xs" style="white-space:nowrap">只读</span>'
        : '<button class="model-action" data-medit="' + esc(m.id) + '" title="编辑" aria-label="编辑 ' + esc(m.name) + '">' + icon('edit', 15) + '</button>' +
          '<button class="model-action" data-mtest="' + esc(m.id) + '" title="测试连接" aria-label="测试 ' + esc(m.name) + '">' + icon('zap', 15) + '</button>' +
          '<button class="model-action danger" data-mdel="' + esc(m.id) + '" title="删除" aria-label="删除 ' + esc(m.name) + '">' + icon('trash', 15) + '</button>';
      return '<article class="card m-card"><div class="m-card-in">' +
        '<div class="m-card-head">' +
        '<span class="m-mark">' + icon('model', 19) + '</span>' +
        '<div class="m-title"><strong>' + esc(m.name) + '</strong>' +
        '<small>' + esc(m.vendor || m.model || m.base_url || '模型接入') + '</small></div>' +
        badge + '</div>' +
        '<div class="m-actions">' + actions + '</div></div></article>';
    }).join('') : '<div class="empty"><div class="glyph">' + icon('model') + '</div>暂无模型配置，点击右上角按钮接入</div>';

    return PageHead({
      title: '模型管理',
      actions: '<button class="btn primary" id="btn-model-add">' + icon('plus', 14) + ' 新增模型</button>'
    }) + '<div class="page-body"><div class="m-grid">' + list + '</div></div>';
  }

  // add / edit modal: 模型名称 / 厂商 / Base URL / API Key; test required before save
  function modelModal() {
    var d = STATE.modelDraft;
    var fld = function (id, label, value, placeholder, extra, type) {
      return '<div class="field"><label for="m-' + id + '">' + label + '</label>' +
        '<input class="input" id="m-' + id + '" type="' + (type || 'text') + '" value="' + esc(value || '') + '" placeholder="' + (placeholder || '') + '" autocomplete="off" ' + (extra || '') + '/></div>';
    };
    var btnLabel = d.testing ? '测试中…' : (d.tested ? '✓ 已通过' : '测试链接');
    return '<div class="modal-back" data-mclose="1"></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-label="' + (d.id ? '编辑模型' : '新增模型') + '">' +
      '<div class="modal-h"><h3>' + (d.id ? '编辑模型' : '新增模型') + '</h3>' +
      '<button class="btn sm ghost" data-mclose="1" aria-label="关闭">' + icon('x', 14) + '</button></div>' +
      '<div class="modal-b"><form onsubmit="return false">' +
      fld('name', '模型名称 *', d.name, '例如：测试模型', 'data-mf2="name"') +
      fld('vendor', '厂商', d.vendor, '例如：DeepSeek', 'data-mf2="vendor"') +
      fld('base', 'Base URL *', d.base_url, '填写服务地址', 'data-mf2="base_url"') +
      '<div class="field"><label for="m-key">API Key *</label><div class="m-row">' +
      '<input class="input mono" id="m-key" type="password" value="' + esc(d.api_key || '') + '" placeholder="' + (d.has_api_key ? '留空保留已保存的密钥' : '填写服务调用的 API Key') + '" autocomplete="off" data-mf2="api_key"/>' +
      '<button class="btn" type="button" id="m-test-btn"' + (d.testing ? ' disabled' : '') + '>' + icon('zap', 14) + ' ' + btnLabel + '</button>' +
      '</div></div>' +
      '<p id="m-error" class="m-error" role="alert">' + esc(STATE.modelError || '') + '</p>' +
      '</form></div>' +
      '<div class="modal-f"><button class="btn" data-mclose="1">取消</button>' +
      '<button class="btn primary" id="m-save">保存配置</button></div>' +
      '</div>';
  }

  // plain delete confirm: text only, no dividers or tinted backgrounds
  function modelDeleteModal() {
    var m = D.modelConfigs.find(function (x) { return x.id === STATE.modelDeleting; });
    if (!m) return '';
    return '<div class="modal-back" data-mclose="1"></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-label="删除模型">' +
      '<div class="modal-h"><h3>删除模型</h3>' +
      '<button class="btn sm ghost" data-mclose="1" aria-label="关闭">' + icon('x', 14) + '</button></div>' +
      '<div class="modal-b"><p class="m-plain-text">确认删除模型「' + esc(m.name) + '」吗？</p></div>' +
      '<div class="modal-f"><button class="btn" data-mclose="1">取消</button>' +
      '<button class="btn danger" id="m-del-confirm">删除</button></div>' +
      '</div>';
  }

  // -------------------------------------------------------------- drawers
  function findingDrawer(f, probes) {
    var related = (probes || []).filter(function (p) { return (f.evidence_probes || []).indexOf(p.id) !== -1; });
    var snippet = (f.code_snippet || []).map(function (row) {
      return '<div class="' + (row.highlight ? 'lh' : '') + '"><span class="ln">' + esc(row.ln) + '</span>' + esc(row.text) + '</div>';
    }).join('');
    var diff = (f.patch_diff || []).map(function (row) {
      return '<div class="' + (row.type === 'add' ? 'diff-add' : 'diff-rem') + '">' + esc(row.text) + '</div>';
    }).join('');
    var relatedHtml = related.length ? related.map(function (p) {
      return '<div style="padding:10px 12px;border:1px solid var(--line);border-radius:6px;background:var(--bg-sunken)">' +
        '<div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">' +
        '<span class="badge ' + statusBadge(p.status) + '">' + esc(p.status) + '</span>' +
        '<span class="muted xs mono">' + esc(p.id) + '</span><span class="spacer"></span>' +
        '<span class="muted xs mono">' + esc(p.name) + '</span></div>' +
        '<div class="b sm" style="margin-top:4px">' + esc(p.case) + '</div>' +
        '<div class="mono xs muted" style="margin-top:4px">' + esc(p.evidence) + '</div></div>';
    }).join('') : '';
    var timeline = (f.timeline || []).map(function (ev, i) {
      return '<div style="display:flex;gap:12px;align-items:flex-start;position:relative;padding-left:16px">' +
        '<span style="position:absolute;left:0;top:6px;width:8px;height:8px;border-radius:999px;background:var(--brand);box-shadow:0 0 6px var(--brand)"></span>' +
        (i < f.timeline.length - 1 ? '<span style="position:absolute;left:3.5px;top:14px;bottom:-10px;width:1px;background:var(--line-strong)"></span>' : '') +
        '<div><div class="mono xs muted">' + fmtAbs(ev.t) + '</div><div class="sm" style="margin-top:2px">' + esc(ev.label) + '</div></div></div>';
    }).join('');

    return '<div class="drawer-back" data-close="1"></div><div class="drawer">' +
      '<div class="drawer-h"><div style="min-width:0;flex:1">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">' +
      '<span class="badge ' + sevColor(f.severity) + '">' + esc(f.severity) + '</span>' +
      '<span class="muted xs mono">' + esc(f.id) + '</span><span class="muted xs">·</span>' +
      '<span class="muted xs">' + esc(f.category) + '</span><span class="muted xs">·</span>' +
      '<span class="muted xs mono">' + esc(f.cwe) + '</span></div>' +
      '<h2 style="margin:0;font-size:19px;font-weight:600;letter-spacing:-.01em;color:var(--text);line-height:1.35">' + esc(f.title) + '</h2>' +
      (f.file !== '—' ? '<div class="loc" style="margin-top:8px;font-size:12px">' + icon('file', 12) +
        ' <span class="mono">' + esc(f.file) + ':' + esc(f.line) + '</span>' +
        '<button class="btn sm ghost" style="margin-left:6px" title="复制路径" data-copy="' + esc(f.file + ':' + f.line) + '">' + icon('copy', 11) + '</button></div>' : '') +
      '</div><div style="display:flex;gap:6px;flex-shrink:0">' +
      '<button class="btn sm" title="下载该漏洞的 Markdown" data-download-md="' + esc(f.id) + '">' + icon('download', 12) + '</button>' +
      '<button class="btn ghost" data-close="1">' + icon('x', 14) + '</button></div></div>' +
      '<div class="drawer-b"><div class="stack" style="gap:22px">' +
      '<div class="drawer-meta-grid">' +
      metaTile('状态', f.status) + metaTile('置信度', (f.confidence * 100).toFixed(0) + '%', 'brand') +
      metaTile('严重度', f.severity, 'critical') + metaTile('CWE', f.cwe, null, true) +
      '</div>' +
      drawerSection('漏洞描述', '<p style="margin:0;color:var(--text);line-height:1.7">' + esc(f.description) + '</p>') +
      (f.impact ? drawerSection('潜在影响', '<div style="padding:12px 14px;border-left:3px solid var(--sig-critical);background:var(--sig-critical-softer);border-radius:0 var(--r) var(--r) 0;color:var(--text);font-size:13px;line-height:1.6">' + esc(f.impact) + '</div>') : '') +
      (snippet ? drawerSection('问题代码', '<pre class="code">' + snippet + '</pre>') : '') +
      (f.recommendation ? drawerSection('修复建议', '<p style="margin:0;color:var(--text);line-height:1.7;white-space:pre-line">' + esc(f.recommendation) + '</p>') : '') +
      (diff ? drawerSection('建议 Patch', '<pre class="code">' + diff + '</pre>' +
        '<div style="display:flex;gap:6px;margin-top:10px">' +
        '<button class="btn sm" data-copy-diff="1">' + icon('copy', 11) + ' 复制 diff</button>' +
        '<button class="btn sm primary" disabled title="该操作需要后端持久化支持，当前版本暂未提供">' + icon('check', 11) + ' 应用补丁</button></div>') : '') +
      (relatedHtml ? drawerSection('关联验证记录', '<div class="stack-sm">' + relatedHtml + '</div>') : '') +
      (timeline ? drawerSection('时间线', '<div class="stack-sm">' + timeline + '</div>') : '') +
      '<div class="drawer-actions">' +
      '<button class="btn" disabled title="该操作需要后端持久化支持，当前版本暂未提供">' + icon('check', 12) + ' 标记已修复</button>' +
      '<button class="btn" disabled title="该操作需要后端持久化支持，当前版本暂未提供">' + icon('x', 12) + ' 标记误报</button>' +
      '<span class="spacer"></span>' +
      '<button class="btn" data-copy-url="1" title="复制当前页面链接">' + icon('copy', 12) + ' 复制链接</button>' +
      '<button class="btn" data-download-json="' + esc(f.id) + '" title="导出该漏洞为 JSON">' + icon('download', 12) + ' 导出</button>' +
      '</div></div></div></div>';
  }

  function metaTile(label, value, accent, mono) {
    var color = accent === 'critical' ? 'var(--sig-critical)' : accent === 'brand' ? 'var(--brand)' : 'var(--text)';
    var upper = accent === 'critical' || label === '状态';
    return '<div style="padding:10px 12px;border:1px solid var(--line);border-radius:6px;background:var(--bg-sunken)">' +
      '<div class="muted xs" style="font-family:IBM Plex Mono,monospace;letter-spacing:.1em;text-transform:uppercase;font-size:10px;font-weight:600">' + esc(label) + '</div>' +
      '<div class="b" style="font-size:14px;color:' + color + ';margin-top:4px;' + (mono ? 'font-family:IBM Plex Mono,monospace;' : '') +
      (upper ? 'text-transform:uppercase;letter-spacing:.04em;' : '') + '">' + esc(value) + '</div></div>';
  }

  function drawerSection(title, inner) {
    return '<section><h3 style="margin:0 0 10px;font-size:13px;font-weight:600;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase;font-family:IBM Plex Mono,monospace">' +
      esc(title) + '</h3>' + inner + '</section>';
  }

  function candidateDrawer(c) {
    var statusInfo = ({ pending: { cls: 'b-medium', label: '待验证' }, probing: { cls: 'b-brand', label: '验证中' }, rejected: { cls: 'b-medium', label: '已排除漏洞' }, promoted: { cls: 'b-ok', label: '已确认漏洞' } })[c.status] || { cls: 'b-info', label: c.status };
    var banner = c.status === 'promoted'
      ? { title: '该候选已经确认。', text: ' 它会从候选队列移出，并进入已确认漏洞视图。' }
      : c.status === 'rejected'
        ? { title: '该候选本轮验证已结束。', text: ' 安全确认未拿到可确认漏洞证据，因此已归入已排除漏洞。' }
        : { title: '这是候选，不是已确认漏洞。', text: ' A3S 觉得此处可疑但还没拿到决定性证据。下面是完整推理。' };
    var snippet = (c.code_snippet || []).map(function (row) {
      return '<div class="' + (row.highlight ? 'lh' : '') + '"><span class="ln">' + esc(row.ln) + '</span>' + esc(row.text) + '</div>';
    }).join('');
    var why = (c.why_suspicious || []).map(function (w, i) {
      return '<li><span class="why-num">' + (i + 1) + '</span><span>' + esc(w) + '</span></li>';
    }).join('');
    var counter = (c.counter_evidence || []).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('');
    var NO_BACKEND = '该操作需要后端持久化支持，当前版本暂未提供';
    return '<div class="drawer-back" data-close="1"></div><div class="drawer">' +
      '<div class="drawer-h"><div style="min-width:0;flex:1">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">' +
      '<span class="badge ' + statusInfo.cls + '">' + esc(statusInfo.label) + '</span>' +
      '<span class="badge ' + sevColor(c.suspected_severity) + '">疑似 ' + esc(c.suspected_severity) + '</span>' +
      '<span class="muted xs mono">' + esc(c.id) + '</span><span class="muted xs">·</span>' +
      '<span class="muted xs">' + esc(c.suspected_category) + '</span></div>' +
      '<h2 style="margin:0;font-size:19px;font-weight:600;letter-spacing:-.01em;color:var(--text);line-height:1.35">' + esc(c.title) + '</h2>' +
      (c.file && c.file !== '—' ? '<div class="loc" style="margin-top:8px;font-size:12px">' + icon('file', 12) +
        ' <span class="mono">' + esc(c.file) + ':' + esc(c.line) + '</span>' +
        '<button class="btn sm ghost" style="margin-left:6px" title="复制路径" data-copy="' + esc(c.file + ':' + c.line) + '">' + icon('copy', 11) + '</button></div>' : '') +
      '</div><div style="display:flex;gap:6px;flex-shrink:0">' +
      '<button class="btn ghost" data-close="1">' + icon('x', 14) + '</button></div></div>' +
      '<div class="drawer-b"><div class="stack" style="gap:22px">' +
      '<div class="cand-banner" style="margin-top:0">' + icon('info', 15) +
      '<div><b>' + esc(banner.title) + '</b><span class="muted sm">' + esc(banner.text) + '</span></div></div>' +
      '<div class="drawer-meta-grid">' +
      metaTile('状态', statusInfo.label) + metaTile('可疑度', Math.round(c.confidence * 100) + '%', 'brand') +
      metaTile('疑似严重度', c.suspected_severity, 'critical') + metaTile('来源', c.source, null, true) +
      '</div>' +
      drawerSection('为什么可疑', '<ol class="why-list">' + why + '</ol>') +
      (snippet ? drawerSection('可疑代码', '<pre class="code">' + snippet + '</pre>') : '') +
      (counter ? drawerSection('反向证据 / 为何尚未确认', '<ul class="counter-list">' + counter + '</ul>') : '') +
      (c.status !== 'rejected' && c.next_action ? drawerSection('下一步动作',
        '<div style="padding:12px 14px;border-left:3px solid var(--brand);background:var(--brand-softer);border-radius:0 var(--r) var(--r) 0;color:var(--text);font-size:13.5px;line-height:1.6">' + esc(c.next_action) + '</div>') : '') +
      (c.status === 'rejected' && c.rejection_reason ? drawerSection('排除原因',
        '<div style="padding:12px 14px;border-left:3px solid var(--text-faint);background:var(--bg-sunken);border-radius:0 var(--r) var(--r) 0;color:var(--text-muted);font-size:13.5px;line-height:1.6">' + esc(c.rejection_reason) + '</div>') : '') +
      '<div class="drawer-actions">' +
      (c.status !== 'rejected' && c.status !== 'promoted'
        ? '<button class="btn primary" disabled title="' + NO_BACKEND + '">' + icon('check', 12) + ' 升级为已确认漏洞</button>' +
        '<button class="btn" disabled title="' + NO_BACKEND + '">' + icon('x', 12) + ' 标记误报</button>' : '') +
      '<button class="btn" disabled title="' + NO_BACKEND + '">' + icon('refresh', 12) + ' 重新复核</button>' +
      '<span class="spacer"></span>' +
      '<button class="btn" data-copy-url="1" title="复制当前页面链接">' + icon('copy', 12) + ' 复制链接</button>' +
      '</div></div></div></div>';
  }

  function newProjectModal() {
    var PHASES = [
      { id: 'agent-detect', label: '智能体发现并确认', desc: 'A3S 主动发现 + 证据确认，跳过修复' },
      { id: 'agent-full', label: '智能体全流程', desc: '画像 → 发现 → 验证裁决 → 修复/缓解 → 报告', rec: true },
      { id: 'detect', label: '本地候选 + A3S 确认', desc: '本地轻量候选发现，A3S 负责证据确认' },
      { id: 'full', label: '本地候选 + A3S 全流程', desc: '本地候选 → 证据确认 → 修复/缓解 → 报告' }
    ];
    var LIMIT_FIELDS = [
      ['candidate_limit', '候选上限'], ['discovery_limit', '发现上限'], ['discovery_slice_size', '切片大小'],
      ['discovery_max_tasks', '发现任务上限'], ['discovery_max_tasks_per_specialty', '每类切片上限'],
      ['validation_batch_size', '验证批大小'], ['agent_pool_size', 'Agent 池上限'], ['agent_pool_min', 'Agent 池下限'],
      ['agent_tool_rounds', '工具轮数上限']
    ];
    var src = STATE.np.source;
    var sourceField = '';
    if (src === 'path') sourceField = field('服务器目标路径', '<input class="input mono" data-np="target_path" value="' + esc(STATE.np.target_path) + '" placeholder="/path/to/source-dir 或 /path/to/binary"/>');
    else if (src === 'url') sourceField = field('在线网站 URL', '<input class="input mono" data-np="website_url" value="' + esc(STATE.np.website_url) + '" placeholder="https://example.com/"/>');
    else {
      var label = src === 'file' ? '选择单个目标文件' : src === 'archive' ? '选择目标归档' : '选择本地目录';
      var small = src === 'file' ? '源码文件、二进制、库文件、固件片段或无源码单文件'
        : src === 'archive' ? '源码目录、无源码归档或安装树归档，最大 2 GB' : '保留目录结构上传，建议不超过 10,000 个文件';
      var ic = src === 'upload' ? 'folder' : src === 'archive' ? 'upload' : 'file';
      sourceField = '<label class="drop">' + icon(ic, 22) + '<div><b>' + label + '</b></div><small>' + small + '</small></label>';
    }
    function field(label, inner) { return '<div class="field"><label>' + label + '</label>' + inner + '</div>'; }

    return '<div class="drawer-back" data-np-close="1"></div><div class="drawer" style="width:min(860px,95vw)">' +
      '<div class="drawer-h"><div>' +
      '<div class="muted xs mono" style="margin-bottom:6px;letter-spacing:.12em;text-transform:uppercase">新建</div>' +
      '<h1 style="margin:0;font-size:22px;font-weight:600;letter-spacing:-.015em">扫描任务配置</h1>' +
      '<p class="muted xs" style="margin:6px 0 0">演示环境为静态快照，填写后不会真正启动扫描。</p></div>' +
      '<button class="btn ghost" data-np-close="1">' + icon('x', 14) + '</button></div>' +
      '<div class="drawer-b"><div class="stack" style="gap:18px">' +
      (STATE.npError ? '<div class="cand-banner" style="border-color:var(--sig-critical-soft);background:var(--sig-critical-softer)">' + icon('alert', 15) + '<b>' + esc(STATE.npError) + '</b></div>' : '') +
      '<div class="card"><div class="card-h"><div style="display:flex;align-items:center;gap:10px">' +
      '<div style="width:22px;height:22px;border-radius:4px;background:var(--brand-softer);color:var(--brand);display:grid;place-items:center;font-size:11px;font-weight:600;font-family:IBM Plex Mono,monospace;border:1px solid var(--brand-soft)">1</div>' +
      '<h3>任务信息</h3></div></div><div class="card-b">' +
      '<div class="grid grid-2">' +
      field('任务名称', '<input class="input" data-np="name" value="' + esc(STATE.np.name) + '"/>') +
      field('大模型配置', '<select class="select" data-np="model_config_id"><option value="">使用服务器环境变量</option>' +
        D.modelConfigs.map(function (m) { return '<option value="' + esc(m.id) + '">' + esc(m.name) + (m.model ? ' · ' + esc(m.model) : '') + '</option>'; }).join('') + '</select>') +
      '</div>' +
      '<div class="field" style="margin-top:14px"><label>任务备注</label>' +
      '<textarea class="textarea" data-np="description">' + esc(STATE.np.description) + '</textarea></div>' +
      '</div></div>' +
      '<div class="card"><div class="card-h"><div style="display:flex;align-items:center;gap:10px">' +
      '<div style="width:22px;height:22px;border-radius:4px;background:var(--brand-softer);color:var(--brand);display:grid;place-items:center;font-size:11px;font-weight:600;font-family:IBM Plex Mono,monospace;border:1px solid var(--brand-soft)">2</div>' +
      '<h3>扫描模式</h3></div></div><div class="card-b"><div class="stack" style="gap:8px">' +
      PHASES.map(function (p) {
        return '<label style="display:flex;gap:12px;padding:12px;border:1px solid ' + (STATE.np.phase === p.id ? 'var(--brand)' : 'var(--line)') +
          ';border-radius:8px;background:' + (STATE.np.phase === p.id ? 'var(--brand-softer)' : 'var(--bg-elev)') + ';cursor:pointer;align-items:flex-start">' +
          '<input type="radio" name="phase" data-np-phase="' + p.id + '" ' + (STATE.np.phase === p.id ? 'checked' : '') + ' style="margin-top:2px;accent-color:var(--brand)"/>' +
          '<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<span class="b sm">' + esc(p.label) + '</span>' +
          (p.rec ? '<span class="badge b-brand">推荐</span>' : '') +
          '<span class="badge b-ok">源码/文件/二进制/网址</span></div>' +
          '<div class="muted xs" style="margin-top:4px">' + esc(p.desc) + '</div></div></label>';
      }).join('') + '</div></div></div>' +
      '<div class="card"><div class="card-h"><div style="display:flex;align-items:center;gap:10px">' +
      '<div style="width:22px;height:22px;border-radius:4px;background:var(--brand-softer);color:var(--brand);display:grid;place-items:center;font-size:11px;font-weight:600;font-family:IBM Plex Mono,monospace;border:1px solid var(--brand-soft)">3</div>' +
      '<h3>目标来源</h3></div></div><div class="card-b">' +
      '<div class="seg" style="margin-bottom:12px">' +
      [['path', '服务器路径'], ['url', '在线网址'], ['file', '上传文件'], ['archive', '上传归档'], ['upload', '上传目录']].map(function (o) {
        return '<button type="button" class="' + (src === o[0] ? 'on' : '') + '" data-np-src="' + o[0] + '">' + o[1] + '</button>';
      }).join('') + '</div>' + sourceField + '</div></div>' +
      '<div class="card"><div class="card-h"><div style="display:flex;align-items:center;gap:10px">' +
      '<div style="width:22px;height:22px;border-radius:4px;background:var(--brand-softer);color:var(--brand);display:grid;place-items:center;font-size:11px;font-weight:600;font-family:IBM Plex Mono,monospace;border:1px solid var(--brand-soft)">4</div>' +
      '<h3>发现参数</h3></div></div><div class="card-b">' +
      '<div class="grid grid-2">' +
      field('候选类别', '<input class="input" data-np="candidate_categories" value="' + esc(STATE.np.candidate_categories) + '" placeholder="留空表示不限制"/>') +
      LIMIT_FIELDS.map(function (f) {
        return field(f[1], '<input class="input mono" type="number" min="1" data-np-limit="' + f[0] + '" value="' + esc(STATE.np[f[0]]) + '" placeholder="' + (f[0].endsWith('_limit') ? '不限制' : '') + '"/>');
      }).join('') +
      '</div></div></div>' +
      '<div style="display:flex;justify-content:flex-end;gap:8px;padding-top:8px;border-top:1px solid var(--line);margin-top:6px">' +
      '<button type="button" class="btn" data-np-close="1">取消</button>' +
      '<button type="button" class="btn primary lg" id="btn-np-create">' + icon('play', 11) + ' 创建并启动扫描</button>' +
      '</div></div></div></div>';
  }

  // ============================================================== state
  var STATE = {
    tab: 'overview',
    serviceView: 'agent',
    query: '',
    candStatus: 'pending',
    candSev: 'all',
    findSev: 'all',
    logAutoscroll: true,
    drawerFinding: null,
    drawerCandidate: null,
    creating: false,
    projectId: null,
    showModelForm: false,
    modelError: '',
    modelForm: { name: '', base_url: '', api_key: '', model: '' },
    np: { name: '', description: '', phase: 'agent-full', source: 'path', target_path: '', website_url: '', model_config_id: '', candidate_categories: '', discovery_slice_size: '8', validation_batch_size: '1', agent_pool_size: '4', agent_pool_min: '2' },
    npError: '',
    userMenu: false
  };

  function parseHash() {
    var raw = String(location.hash || '').replace(/^#/, '');
    if (!raw) return { name: 'dashboard' };
    var parts = raw.split('/').filter(Boolean);
    if (parts[0] === 'service') return { name: 'service' };
    if (parts[0] === 'projects' && parts[1]) return { name: 'project', id: decodeURIComponent(parts[1]) };
    if (parts[0] === 'projects') return { name: 'projects' };
    if (parts[0] === 'models') return { name: 'models' };
    return { name: 'dashboard' };
  }

  function render() {
    var route = parseHash();
    if (route.name === 'project' && route.id !== STATE.projectId) {
      STATE.projectId = route.id;
      STATE.tab = 'overview';
      STATE.candStatus = 'pending'; STATE.candSev = 'all'; STATE.findSev = 'all';
      STATE.drawerFinding = null; STATE.drawerCandidate = null;
    }
    if (route.name !== 'project') STATE.projectId = null;

    var main;
    if (route.name === 'service') main = ServiceView();
    else if (route.name === 'projects') main = ProjectsView();
    else if (route.name === 'models') main = ModelsView();
    else if (route.name === 'project') {
      var project = D.projects.find(function (p) { return p.id === route.id; });
      main = project ? ProjectDetailView(project) : PageHead({ title: '任务不存在' }) +
        '<div class="page-body"><div class="empty"><div class="glyph">' + icon('project') + '</div>找不到任务 ' + esc(route.id) + '</div></div>';
    } else main = DashboardView();

    var root = document.getElementById('root');
    root.innerHTML = '<div class="app">' +
      Sidebar(location.hash.replace(/^#/, '') || '/') + '<main class="main">' + main + '</main>' +
      (STATE.drawerFinding ? findingDrawer(STATE.drawerFinding, D.probesByJob[STATE.drawerFinding.project_id] || []) : '') +
      (STATE.drawerCandidate ? candidateDrawer(STATE.drawerCandidate) : '') +
      (STATE.creating ? newProjectModal() : '') +
      (STATE.modelDraft ? modelModal() : '') +
      (STATE.modelDeleting ? modelDeleteModal() : '') +
      '</div>' +
      '<div id="toast"></div>';

    bind();
  }

  // =============================================================== events
  function onClick(root, selector, fn) {
    root.querySelectorAll(selector).forEach(function (el) { el.addEventListener('click', fn); });
  }

  function bind() {
    var root = document.getElementById('root');

    // tabs / segs
    onClick(root, '[data-tab]', function (e) {
      STATE.tab = e.currentTarget.getAttribute('data-tab');
      render();
    });
    onClick(root, '[data-sv]', function (e) {
      STATE.serviceView = e.currentTarget.getAttribute('data-sv');
      render();
    });
    onClick(root, '[data-cs]', function (e) { STATE.candStatus = e.currentTarget.getAttribute('data-cs'); render(); });
    onClick(root, '[data-csev]', function (e) { STATE.candSev = e.currentTarget.getAttribute('data-csev'); render(); });
    onClick(root, '[data-fsev]', function (e) { STATE.findSev = e.currentTarget.getAttribute('data-fsev'); render(); });

    // candidate / finding drawers
    onClick(root, '[data-cand]', function (e) {
      var id = e.currentTarget.getAttribute('data-cand');
      var c = D.candidates.find(function (x) { return x.id === id; });
      if (c) { STATE.drawerCandidate = c; render(); }
    });
    onClick(root, '[data-find]', function (e) {
      var id = e.currentTarget.getAttribute('data-find');
      var f = D.findings.find(function (x) { return x.id === id; });
      if (f) { STATE.drawerFinding = f; render(); }
    });
    onClick(root, '[data-find-link]', function (e) {
      e.preventDefault();
      var id = e.currentTarget.getAttribute('data-find-link');
      var f = D.findings.find(function (x) { return x.id === id; });
      if (f) { STATE.drawerFinding = f; render(); }
    });

    // drawer close
    onClick(root, '[data-close]', function () { STATE.drawerFinding = null; STATE.drawerCandidate = null; render(); });
    document.onkeydown = function (e) {
      if (e.key === 'Escape' && (STATE.drawerFinding || STATE.drawerCandidate || STATE.creating)) {
        STATE.drawerFinding = null; STATE.drawerCandidate = null; STATE.creating = false; render();
      }
    };
    onClick(root, '[data-copy]', function (e) { copyText(e.currentTarget.getAttribute('data-copy')); });
    onClick(root, '[data-copy-url]', function () { copyText(location.href); });
    onClick(root, '[data-copy-diff]', function () {
      if (STATE.drawerFinding) copyText(diffText(STATE.drawerFinding.patch_diff));
    });
    onClick(root, '[data-download-md]', function (e) {
      var f = D.findings.find(function (x) { return x.id === e.currentTarget.getAttribute('data-download-md'); });
      if (f) downloadFile(slug(f.id || f.title) + '.md', findingToMarkdown(f), 'text/markdown;charset=utf-8');
    });
    onClick(root, '[data-download-json]', function (e) {
      var f = D.findings.find(function (x) { return x.id === e.currentTarget.getAttribute('data-download-json'); });
      if (f) downloadFile(slug(f.id || f.title) + '.json', JSON.stringify(f, null, 2), 'application/json;charset=utf-8');
    });

    // new project modal
    var npOpen = function () { STATE.creating = true; STATE.npError = ''; render(); };
    onClick(root, '#btn-newproject', npOpen);
    onClick(root, '#btn-newproject2', npOpen);
    onClick(root, '[data-np-close]', function () { STATE.creating = false; render(); });
    onClick(root, '[data-np-src]', function (e) { STATE.np.source = e.currentTarget.getAttribute('data-np-src'); render(); });
    onClick(root, '[data-np-phase]', function (e) { STATE.np.phase = e.currentTarget.getAttribute('data-np-phase'); render(); });
    root.querySelectorAll('[data-np]').forEach(function (el) {
      el.addEventListener('change', function () { STATE.np[el.getAttribute('data-np')] = el.value; });
      el.addEventListener('input', function () { STATE.np[el.getAttribute('data-np')] = el.value; });
    });
    root.querySelectorAll('[data-np-limit]').forEach(function (el) {
      el.addEventListener('input', function () { STATE.np[el.getAttribute('data-np-limit')] = el.value; });
    });
    onClick(root, '#btn-np-create', function () {
      if (!STATE.np.name.trim()) { STATE.npError = '演示环境：请填写任务名称（静态 demo 不会真正启动扫描）。'; render(); return; }
      STATE.npError = '演示环境为静态快照，不支持创建并启动扫描任务。';
      render();
    });

    // models
    onClick(root, '#btn-model-add', function () {
      STATE.modelDraft = { id: '', name: '', vendor: '', base_url: '', api_key: '', tested: false, testing: false };
      STATE.modelError = ''; render();
    });
    onClick(root, '[data-medit]', function (e) {
      var m = D.modelConfigs.find(function (x) { return x.id === e.currentTarget.getAttribute('data-medit'); });
      if (!m) return;
      STATE.modelDraft = { id: m.id, name: m.name, vendor: m.vendor || '', base_url: m.base_url, api_key: '', has_api_key: !!m.has_api_key, tested: false, testing: false };
      STATE.modelError = ''; render();
    });
    onClick(root, '[data-mdel]', function (e) {
      STATE.modelDeleting = e.currentTarget.getAttribute('data-mdel');
      render();
    });
    onClick(root, '#m-del-confirm', function () {
      var id = STATE.modelDeleting;
      D.modelConfigs = D.modelConfigs.filter(function (m) { return m.id !== id; });
      modelStoreSave();
      STATE.modelDeleting = null;
      render(); demoToast('模型配置已删除');
    });
    // close add/edit/delete overlays: backdrop, X, 取消
    onClick(root, '[data-mclose]', function () {
      STATE.modelDraft = null; STATE.modelDeleting = null; STATE.modelError = '';
      render();
    });
    // form inputs write back to the draft; editing a connectivity field invalidates a passed test
    root.querySelectorAll('[data-mf2]').forEach(function (el) {
      el.addEventListener('input', function () {
        var key = el.getAttribute('data-mf2');
        STATE.modelDraft[key] = el.value;
        if (key === 'base_url' || key === 'api_key') {
          STATE.modelDraft.tested = false;
          var b = document.getElementById('m-test-btn');
          if (b && !STATE.modelDraft.testing) { b.classList.remove('ok'); b.innerHTML = icon('zap', 14) + ' 测试链接'; }
        }
      });
    });
    // inline connectivity test: button only, 测试中… -> green ✓ 已通过
    onClick(root, '#m-test-btn', function () {
      var d = STATE.modelDraft;
      if (!d || d.testing) return;
      var err = modelValidate(d);
      var errEl = document.getElementById('m-error');
      if (err) { STATE.modelError = err; if (errEl) errEl.textContent = err; return; }
      STATE.modelError = '';
      if (errEl) errEl.textContent = '';
      d.testing = true;
      var btn = document.getElementById('m-test-btn');
      if (btn) { btn.disabled = true; btn.classList.remove('ok'); btn.innerHTML = icon('zap', 14) + ' 测试中…'; }
      setTimeout(function () {
        if (!STATE.modelDraft) return;
        d.testing = false; d.tested = true;
        var b2 = document.getElementById('m-test-btn');
        if (b2 && b2.isConnected) { b2.disabled = false; b2.classList.add('ok'); b2.innerHTML = icon('check', 14) + ' ✓ 已通过'; }
        demoToast('连接测试成功');
      }, 800);
    });
    // save requires a passed connectivity test first
    onClick(root, '#m-save', function () {
      var d = STATE.modelDraft;
      if (!d) return;
      if (!d.tested) { STATE.modelError = '请先完成连通性测试，再保存配置'; render(); return; }
      var err = modelValidate(d);
      if (err) { STATE.modelError = err; render(); return; }
      var id = d.id || ('mdl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
      var existing = D.modelConfigs.find(function (m) { return m.id === id; });
      var keyEntered = (d.api_key || '').trim();
      var rec = existing ? Object.assign({}, existing) : { id: id, created_at: Date.now() / 1000 };
      rec.name = d.name.trim();
      rec.vendor = (d.vendor || '').trim();
      rec.base_url = d.base_url.trim().replace(/\/$/, '');
      rec.model = rec.model || rec.name;
      rec.updated_at = Date.now() / 1000;
      rec.last_test_status = 'passed';
      rec.last_test_message = '连通性测试通过（本地模拟）';
      rec.last_test_at = Date.now() / 1000;
      if (keyEntered) { rec.has_api_key = true; rec.masked_api_key = maskKey(keyEntered); }
      else if (!existing) { rec.has_api_key = false; }
      var at = D.modelConfigs.findIndex(function (m) { return m.id === id; });
      if (at >= 0) D.modelConfigs[at] = rec; else D.modelConfigs.push(rec);
      modelStoreSave();
      STATE.modelDraft = null; STATE.modelError = '';
      render(); demoToast('配置成功');
    });
    // card test: only the status tag flips, no modal
    onClick(root, '[data-mtest]', function (e) {
      var m = D.modelConfigs.find(function (x) { return x.id === e.currentTarget.getAttribute('data-mtest'); });
      if (!m || m.read_only || m._testing) return;
      m._testing = true; render();
      setTimeout(function () {
        m._testing = false;
        var ok = !!m.has_api_key;
        m.last_test_status = ok ? 'passed' : 'failed';
        m.last_test_message = ok ? '连通性测试通过（本地模拟）' : '连接测试失败：缺少 API Key';
        m.last_test_at = Date.now() / 1000;
        modelStoreSave(); render();
        demoToast(ok ? '连接测试成功' : '连接测试失败：缺少 API Key');
      }, 800);
    });
    // 账户菜单：点击 chip 展开 / 收起，Escape 关闭，点空白处关闭
    var chip = root.querySelector('#user-chip');
    if (chip) {
      var toggleMenu = function (e) {
        if (e.stopPropagation) e.stopPropagation();
        STATE.userMenu = !STATE.userMenu;
        render();
      };
      chip.addEventListener('click', toggleMenu);
      chip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(e); }
      });
    }
    onClick(root, '[data-um]', function (e) {
      if (e.stopPropagation) e.stopPropagation();
      var act = e.currentTarget.getAttribute('data-um');
      STATE.userMenu = false;
      if (act === 'home') {
        window.zhianHome();
      } else if (act === 'logout') {
        window.zhianLogout();
      }
      render();
    });
    if (!STATE._docMenuBound) {
      STATE._docMenuBound = true;
      document.addEventListener('click', function (e) {
        if (!STATE.userMenu) return;
        var t = e.target;
        if (t && t.closest && t.closest('#user-chip, #user-menu')) return;
        STATE.userMenu = false;
        render();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && STATE.userMenu) { STATE.userMenu = false; render(); }
      });
    }
    onClick(root, '[data-test]', function () { demoToast('演示环境不发起模型连通性测试。'); });

    // write ops → demo toast
    onClick(root, '[data-del]', function () { demoToast('演示环境为静态快照，删除操作不会生效。'); });
    onClick(root, '#btn-del', function () { demoToast('演示环境为静态快照，删除操作不会生效。'); });
    onClick(root, '#btn-refresh', function () { demoToast('演示数据为静态快照，无需刷新。'); });
    onClick(root, '#btn-refresh2', function () { demoToast('演示数据为静态快照，无需刷新。'); });
    onClick(root, '#btn-stop', function () { demoToast('演示环境没有运行中的任务可停止。'); });

    // report actions
    onClick(root, '#btn-report-pdf', function () { printReport(); });
    onClick(root, '#btn-report-md', function () {
      var project = D.projects.find(function (p) { return p.id === STATE.projectId; });
      if (!project) return;
      var md = reportToMarkdown(project, D.findingsByJob[project.id] || [], D.probesByJob[project.id] || [], D.patchesByJob[project.id] || []);
      downloadFile(slug(project.name) + '_报告.md', md, 'text/markdown;charset=utf-8');
    });

    // projects search
    var search = root.querySelector('#proj-search');
    if (search) {
      search.addEventListener('input', function () {
        STATE.query = search.value;
        var pos = search.selectionStart;
        render();
        var next = document.getElementById('proj-search');
        if (next) { next.focus(); next.setSelectionRange(pos, pos); }
      });
    }

    // log autoscroll
    var auto = root.querySelector('#log-autoscroll');
    if (auto) auto.addEventListener('change', function () { STATE.logAutoscroll = auto.checked; });
    var pre = root.querySelector('#log-pre');
    if (pre && STATE.logAutoscroll) pre.scrollTop = pre.scrollHeight;
  }

  window.addEventListener('hashchange', render);
  modelStoreLoad();
  render();
})();
