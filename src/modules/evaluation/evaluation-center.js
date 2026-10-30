/* evaluation/evaluation-center。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['evaluation/evaluation-center'] = function () {
  /* Product-owned tasks with a shared assessment overview and report archive. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      E = A.escape,
      I = A.icon;
    const V = (A.evaluation = {
      taskFilters: { status: 'all', target: 'all', query: '', sort: 'desc' },
      reportFilters: { type: 'all', scope: 'all', query: '', sort: 'desc' },
      scanReportId: null,
    });
    const terminal = new Set(['done', 'stopped', 'error']);
    const type = (t) =>
      ['scan', 'vulnerability', 'vulnerability-scan'].includes(t?.evaluationType) ||
      ['code-scan', 'app-scan', 'web-scan'].includes(t?.type)
        ? 'scan'
        : 'attack';
    const typeName = (t) =>
      type(t) === 'scan' ? A.scanProduct?.typeName(t.type) || '漏洞扫描' : '模型演练';
    const metrics = (t) => {
      if (type(t) === 'scan')
        return A.scanProduct?.metrics(t) || { total: 0, done: 0, valid: 0, errors: 0, pct: 0 };
      const units = t?.units || [],
        done = units.filter((u) => ['breach', 'defended', 'error'].includes(u.result)),
        valid = done.filter((u) => u.result !== 'error');
      return {
        total: units.length,
        done: done.length,
        valid: valid.length,
        errors: done.length - valid.length,
        pct: units.length ? Math.round((done.length / units.length) * 100) : 0,
      };
    };
    const partial = (t) =>
      t.status !== 'done' ||
      metrics(t).done < metrics(t).total ||
      metrics(t).errors > 0 ||
      t.verificationComplete === false ||
      t.resultSource === 'simulation';
    const target = (t) =>
      t.targetSnapshot?.name ||
      t.targetName ||
      (type(t) === 'attack' ? X.targetFor(t)?.name : '') ||
      '未记录';
    const ref = (t) => `data-task="${E(t.id)}"`;
    const byTime = (a, b) =>
      (Date.parse(a.created || '') || 0) - (Date.parse(b.created || '') || 0) ||
      String(a.id).localeCompare(String(b.id));
    const heading = (name, description, actions = '', back) =>
      A.heading('', name, description, actions, back);
    const options = (items, value) =>
      items
        .map(
          ([v, label]) =>
            `<option value="${E(v)}" ${value === v ? 'selected' : ''}>${E(label)}</option>`,
        )
        .join('');
    const searchMatch = (t, query) =>
      !query ||
      [t.name, t.id, X.taskNumber(t.id), target(t)]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase());
    const statusBadge = (t) => (type(t) === 'scan' ? A.scanProduct.status(t) : X.status(t));
    const taskActions = (t) =>
      `<div class="ec-row-actions"><button class="link-btn" ${ref(t)} onclick="App.attack.open(this.dataset.task)">详情</button>${['running'].includes(t.status) ? `<button class="link-btn" ${ref(t)} onclick="App.attack.taskAction(this.dataset.task,'stop')">终止</button>` : ''}${terminal.has(t.status) ? `<button class="link-btn" ${ref(t)} onclick="App.attack.quickRetest(this.dataset.task)">复测</button>${A.entryManagement.button('attack-task', t.id)}` : ''}</div>`;
    V.type = type;
    V.typeName = typeName;
    V.metrics = metrics;
    V.terminal = terminal;
    V.taskErrorHTML = function (t) {
      if (type(t) !== 'attack' || t.status !== 'error') return '';
      const unit = t.units?.find((u) => u.result === 'error');
      return `<div class="task-error-alert" role="alert"><strong>异常终止 · ${E(t.errorCode || unit?.errorCode || 'EXECUTION_ERROR')}</strong><span>${E(t.error || unit?.errorMessage || '执行发生异常，请查看任务日志后重新发起。')}</span></div>`;
    };
    V.allTasks = () => [
      ...X.db.tasks.filter((t) => !t.deletedAt),
      ...(A.scanProduct?.tasks() || []),
    ];
    V.reportReady = (t) =>
      !!t &&
      !t.deletedAt &&
      terminal.has(t.status) &&
      (type(t) === 'scan' ? !!t.resultSaved : metrics(t).done > 0);
    V.tasks = function () {
      const s = V.taskFilters;
      return X.db.tasks
        .filter(
          (t) =>
            !t.deletedAt &&
            type(t) === 'attack' &&
            (s.status === 'all' ||
              (s.status === 'active'
                ? ['running'].includes(t.status)
                : s.status === 'stopped'
                  ? ['stopped', 'error'].includes(t.status)
                  : t.status === s.status)) &&
            (s.target === 'all' || String(t.model) === s.target) &&
            searchMatch(t, s.query),
        )
        .slice()
        .sort((a, b) => (s.sort === 'asc' ? 1 : -1) * byTime(a, b));
    };
    V.reports = function () {
      const s = V.reportFilters;
      return V.allTasks()
        .filter(
          (t) =>
            V.reportReady(t) &&
            (s.type === 'all' || type(t) === s.type) &&
            (s.scope === 'all' || (s.scope === 'partial') === partial(t)) &&
            searchMatch(t, s.query),
        )
        .sort((a, b) => (s.sort === 'asc' ? 1 : -1) * byTime(a, b));
    };
    V.filter = function (which, key, value) {
      const s = which === 'reports' ? V.reportFilters : V.taskFilters;
      if (!Object.hasOwn(s, key)) return;
      s[key] = value;
      A.render();
      if (key === 'query') {
        const el = document.getElementById('ec-' + which + '-query');
        el?.focus();
        el?.setSelectionRange?.(value.length, value.length);
      }
    };
    V.openTasks = function (selectedType = 'attack', selectedStatus = 'all') {
      V.showDrafts = false;
      if (selectedType === 'scan') {
        A.platform.go('scan', 'tasks', 'code-scan');
        return;
      }
      V.taskFilters.status = ['active', 'running', 'done', 'stopped', 'error'].includes(
        selectedStatus,
      )
        ? selectedStatus
        : 'all';
      V.taskFilters.query = '';
      A.platform.go('exercise', 'tasks');
    };
    V.newTask = function () {
      A.modal(
        '新建评估任务',
        `<div class="ec-type-options">${[
          ['attack', '模型演练', '选择靶标与攻击策略，自动执行攻击并判定结果。'],
          ['code-scan', '代码安全扫描', '从代码资产启动扫描，自动发现、验证并定位问题。'],
          ['app-scan', '应用安全扫描', '围绕应用接口、访问控制与数据处理开展自动评估。'],
          ['web-scan', 'Web 安全扫描', '从 Web 资产启动检查，查看漏洞位置与修复建议。'],
        ]
          .map(
            ([id, name, desc]) =>
              `<button type="button" class="ec-type-option" data-type="${id}" onclick="App.closeModal();App.evaluation.enterProduct(this.dataset.type)"><strong>${name}</strong><p>${desc}</p><b>进入${id === 'attack' ? '演练场' : '扫描任务'} →</b></button>`,
          )
          .join('')}</div>`,
        `<button class="btn" onclick="App.closeModal()">取消</button>`,
      );
    };
    V.openTask = function (id) {
      const t = V.allTasks().find((v) => v.id === id);
      if (!t) return false;
      if (type(t) === 'scan') return A.scanProduct.open(id);
      X.open(id);
      return true;
    };
    V.openReportList = function (id = '') {
      V.reportFilters = { type: 'all', scope: 'all', query: id, sort: 'desc' };
      V.scanReportId = null;
      X.selected = null;
      A.platform.go('scan', 'reports');
    };
    V.openReport = function (id) {
      const t = V.allTasks().find((t) => t.id === id);
      if (!V.reportReady(t)) {
        A.toast(
          t && !terminal.has(t.status)
            ? '任务尚未结束，请在任务详情查看执行进度。'
            : '暂无已完成记录，尚未生成评估报告。',
        );
        return false;
      }
      A.closeModal();
      A.closeDrawer();
      if (type(t) === 'scan') {
        V.scanReportId = t.id;
        X.selected = null;
        A.platform.go('scan', 'reports', 'scan', t.id);
        return true;
      }
      V.scanReportId = null;
      X.tab = 'tasks';
      X.selected = id;
      X.detailTab = 'report';
      A.render();
      return true;
    };
    V.deleteTask = function (id, confirmed = false) {
      const t = X.db.tasks.find((t) => t.id === id);
      if (!t || t.deletedAt) return false;
      if (!terminal.has(t.status)) {
        A.toast('请先终止任务，再删除任务记录。');
        return false;
      }
      if (!confirmed) {
        A.modal(
          '删除演练任务',
          `<p>确定删除“${E(t.name)}”？删除后不可恢复。</p>`,
          `<button class="btn" onclick="App.closeModal()">取消</button><button class="entry-delete" ${ref(t)} onclick="App.evaluation.deleteTask(this.dataset.task,true)" aria-label="确认删除" title="确认删除" type="button">删除</button>`,
        );
        return false;
      }
      t.deletedAt = new Date().toISOString();
      if (X.selected === id) X.selected = null;
      if (X.arena?.taskId === id) X.arena.taskId = null;
      A.save();
      A.closeModal();
      A.render();
      A.toast('任务已删除');
      return true;
    };
    // Archived evidence stays in storage but is excluded from every default product view.
    for (const key of ['liveTasks', 'filteredTasks']) {
      const previous = X[key];
      if (typeof previous === 'function')
        X[key] = function () {
          return previous.apply(X, arguments).filter((t) => !t.deletedAt);
        };
    }
    const openTask = X.open;
    X.open = function (id) {
      if (!X.db.tasks.some((t) => t.id === id && !t.deletedAt)) {
        A.toast('任务不存在或已删除');
        return false;
      }
      return openTask.apply(X, arguments);
    };
    V.openDrafts = function () {
      V.showDrafts = true;
      A.render();
    };
    V.closeDrafts = function () {
      V.showDrafts = false;
      A.render();
    };
    // 草稿命名：空名或纯数字名统一显示为「未命名任务」，多个时自动编号区分。
    V.draftName = function (d, i, unnamedList) {
      const n = String(d.config?.name || '').trim();
      if (n && !/^\d+$/.test(n)) return n;
      const seq = unnamedList.indexOf(d.id);
      return seq <= 0 ? '未命名任务' : '未命名任务 ' + (seq + 1);
    };
    V.draftBoxHTML = function () {
      const drafts = A.demoPresentation?.drafts?.() || [];
      const unnamed = drafts
        .filter((d) => {
          const n = String(d.config?.name || '').trim();
          return !n || /^\d+$/.test(n);
        })
        .map((d) => d.id);
      const rows =
        drafts
          .map((d, i) => {
            const name = V.draftName(d, i, unnamed);
            return `<tr><td><strong>${E(name)}</strong></td><td class="ec-time">${E(A.fmtTime(d.updated) || '—')}</td><td><div class="ec-row-actions"><button class="link-btn" data-id="${E(d.id)}" onclick="App.demoPresentation.resumeDraft(this.dataset.id)">继续配置</button><button class="entry-delete" data-id="${E(d.id)}" onclick="App.demoPresentation.deleteDraft(this.dataset.id)">删除</button></div></td></tr>`;
          })
          .join('') || '<tr><td colspan="3"><div class="empty">暂无草稿任务</div></td></tr>';
      return (
        heading('任务草稿箱', '保存但尚未启动的演练任务草稿；继续配置可回到新建流程。', '', {
          action: 'App.evaluation.closeDrafts()',
        }) +
        `<section class="card ec-list"><div class="table-wrap"><table class="ec-task-table"><thead><tr><th>任务名称</th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div><div class="table-foot">共 ${drafts.length} 个草稿</div></section>`
      );
    };
    V.tasksHTML = function () {
      if (V.showDrafts) return V.draftBoxHTML();
      const s = V.taskFilters,
        rows = V.tasks(),
        drafts = A.demoPresentation?.drafts?.() || [];
      const draftBtn = `<button class="btn" onclick="App.evaluation.openDrafts()">${I('file', 14)}任务草稿箱${drafts.length ? ' · ' + drafts.length : ''}</button>`;
      return (
        heading(
          '演练任务',
          '任务自动执行并判定；点击任务名称或“详情”查看配置与攻防记录。',
          `<button class="btn primary" onclick="App.attack.newTask()">${I('plus', 14)}新建演练任务</button>${draftBtn}`,
        ) +
        `<section class="card ec-list"><div class="toolbar ec-toolbar"><input class="input" id="ec-tasks-query" aria-label="搜索演练任务" placeholder="搜索任务、靶标或编号" value="${E(s.query)}" oninput="if(!event.isComposing)App.evaluation.filter('tasks','query',this.value)"><select aria-label="筛选任务状态" onchange="App.evaluation.filter('tasks','status',this.value)">${options(
          [
            ['all', '全部状态'],
            ['active', '未结束'],
            ['running', '进行中'],
            ['done', '已完成'],
            ['stopped', '已终止'],
            ['error', '任务异常'],
          ],
          s.status,
        )}</select><select aria-label="任务创建时间排序" onchange="App.evaluation.filter('tasks','sort',this.value)">${options(
          [
            ['desc', '最新创建优先'],
            ['asc', '最早创建优先'],
          ],
          s.sort,
        )}</select></div><div class="table-wrap"><table class="ec-task-table"><thead><tr><th>任务名称</th><th>靶标模型</th><th>状态 / 进度</th><th>任务创建时间</th><th>完成 / 终止时间</th><th>操作</th></tr></thead><tbody>${
          rows
            .map((t) => {
              const m = metrics(t);
              const endTime = terminal.has(t.status)
                ? A.fmtTime(t.finishedAt || t.finished || t.stoppedAt) || '—'
                : '—';
              return `<tr ${ref(t)}><td><button class="link-btn ec-task-name" ${ref(t)} onclick="App.attack.open(this.dataset.task)">${E(t.name)}</button><small>${E(X.taskNumber(t.id))}${t.parentId ? ' · 复测任务' : ''}</small></td><td class="ec-object">${E(target(t))}</td><td>${statusBadge(t)}<small>${m.done} / ${m.total} 已完成</small><div class="ec-progress"><span style="width:${m.pct}%"></span></div></td><td class="ec-time">${E(A.fmtTime(t.created) || '未记录')}</td><td class="ec-time">${E(endTime)}</td><td>${taskActions(t)}</td></tr>`;
            })
            .join('') || '<tr><td colspan="6"><div class="empty">暂无匹配的演练任务</div></td></tr>'
        }</tbody></table></div><div class="table-foot">共 ${rows.length} 个任务</div></section>`
      );
    };
    V.taskExportMenu = function (t) {
      return V.reportReady(t)
        ? `<details class="report-export ec-task-export"><summary>${I('download', 14)}导出报告${I('chevron', 12)}</summary><div><button ${ref(t)} onclick="this.closest('details').removeAttribute('open');App.evaluation.exportTaskReport(this.dataset.task,'pdf')">PDF</button><button ${ref(t)} onclick="this.closest('details').removeAttribute('open');App.evaluation.exportTaskReport(this.dataset.task,'markdown')">Markdown</button></div></details>`
        : `<button class="btn" disabled title="任务结束并产生记录后可导出报告">${I('download', 14)}导出报告</button>`;
    };
    // Existing report renderers read X.task. Bind an explicit task only while building the document.
    V.taskReportDocument = function (id) {
      const t = X.db.tasks.find((t) => t.id === id && !t.deletedAt);
      if (!t || !V.reportReady(t) || type(t) !== 'attack') return '';
      const previous = X.selected;
      try {
        X.selected = id;
        return X.reportHTML();
      } finally {
        X.selected = previous;
      }
    };
    V.reportNodeMarkdown = function (node) {
      if (node.nodeType === 3)
        return String(node.textContent || '')
          .replace(/\s+/g, ' ')
          .replace(/([\\`*_\[\]])/g, '\\$1')
          .replace(/</g, '&lt;');
      if (node.nodeType !== 1 && node.nodeType !== 9) return '';
      const tag = String(node.tagName || '').toUpperCase(),
        children = () =>
          Array.from(node.childNodes || [])
            .map(V.reportNodeMarkdown)
            .join(''),
        block = (text) => '\n\n' + text.trim() + '\n\n';
      if (['STYLE', 'SCRIPT', 'SVG', 'BUTTON', 'NOSCRIPT'].includes(tag)) return '';
      if (/^H[1-6]$/.test(tag)) return block('#'.repeat(Number(tag[1])) + ' ' + children().trim());
      if (tag === 'PRE') {
        const raw = String(node.textContent || '')
            .replace(/\r\n/g, '\n')
            .trimEnd(),
          longest = Math.max(2, ...(raw.match(/`+/g) || []).map((s) => s.length)),
          fence = '`'.repeat(longest + 1);
        return block(fence + '\n' + raw + '\n' + fence);
      }
      if (tag === 'TABLE') {
        const rows = Array.from(node.querySelectorAll('tr'))
          .map((row) =>
            Array.from(row.children || [])
              .filter((cell) => ['TD', 'TH'].includes(cell.tagName))
              .map((cell) =>
                Array.from(cell.childNodes || [])
                  .map(V.reportNodeMarkdown)
                  .join('')
                  .trim()
                  .replace(/\n+/g, '<br>')
                  .replace(/\|/g, '\\|'),
              ),
          )
          .filter((row) => row.length);
        if (!rows.length) return '';
        const width = Math.max(...rows.map((row) => row.length)),
          line = (row) =>
            '| ' + Array.from({ length: width }, (_, i) => row[i] || '').join(' | ') + ' |';
        return block(
          [line(rows[0]), line(Array(width).fill('---')), ...rows.slice(1).map(line)].join('\n'),
        );
      }
      if (tag === 'BR') return '\n';
      if (tag === 'HR') return '\n\n---\n\n';
      if (tag === 'STRONG' || tag === 'B') return '**' + children().trim() + '** ';
      if (tag === 'EM' || tag === 'I') return '*' + children().trim() + '* ';
      if (tag === 'LI') return '\n- ' + children().trim().replace(/\n\n/g, '\n  ');
      if (tag === 'DT') return '**' + children().trim() + '：** ';
      if (tag === 'DD') return children().trim() + '\n';
      if (tag === 'SPAN' || tag === 'SMALL') return children() + ' ';
      if (
        [
          'P',
          'DIV',
          'SECTION',
          'ARTICLE',
          'MAIN',
          'HEADER',
          'FOOTER',
          'DETAILS',
          'SUMMARY',
          'UL',
          'OL',
          'DL',
        ].includes(tag)
      )
        return block(children());
      return children();
    };
    V.reportMarkdown = function (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (
        V.reportNodeMarkdown(doc.body)
          .replace(/[ \t]+\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim() + '\n'
      );
    };
    V.exportTaskReport = function (id, format) {
      const t = X.db.tasks.find((t) => t.id === id && !t.deletedAt);
      if (!t || !V.reportReady(t)) {
        A.toast(t && !terminal.has(t.status) ? '任务结束后可导出报告' : '暂无可导出的任务报告');
        return false;
      }
      if (!['pdf', 'markdown'].includes(format)) return false;
      const html = V.taskReportDocument(id);
      if (!html) return false;
      if (format === 'markdown') {
        A.download(
          String(t.id).replace(/[\\/:*?"<>|]/g, '_') + '-演练报告.md',
          V.reportMarkdown(html),
          'text/markdown;charset=utf-8',
        );
        return true;
      }
      const reportHTML = X.reportHTML;
      try {
        X.reportHTML = () => html;
        X.printReport();
      } finally {
        X.reportHTML = reportHTML;
      }
      return true;
    };
    function detailHeading(t, report) {
      return `<div class="page-heading ec-detail-head">${A.backButton('exercise/tasks')}<div class="task-detail-heading"><div class="task-title-line"><h1>${E(t.name)}</h1>${statusBadge(t)}</div><p class="page-desc">任务创建时间：${E(t.created || '未记录')}${t.parentId ? ' · 复测来源：' + E(X.taskNumber(t.parentId)) : ''}</p>${V.taskErrorHTML(t)}</div><div class="page-actions">${report ? `<button class="btn" ${ref(t)} onclick="App.attack.open(this.dataset.task)">来源任务</button>` : `${t.status === 'running' ? `<button class="btn danger-soft" ${ref(t)} onclick="App.attack.taskAction(this.dataset.task,'stop')">终止</button>` : ''}${V.taskExportMenu(t)}${A.entryManagement.button('attack-task', t.id)}`}</div></div>`;
    }
    V.previewHTML = function (t) {
      const m = metrics(t),
        breach = t.units.filter((u) => u.result === 'breach').length,
        defended = t.units.filter((u) => u.result === 'defended').length,
        rate = m.valid ? Math.round((defended / m.valid) * 100) : null,
        ready = V.reportReady(t),
        risks = new Map();
      for (const u of t.units.filter((u) => u.result === 'breach')) {
        const q = A.taskReports?.question(t, u),
          tags = A.taskReports?.tags(q) || [];
        for (const label of tags.length ? tags : ['未标注场景'])
          risks.set(label, (risks.get(label) || 0) + 1);
      }
      return `<section class="card ec-report-preview"><div class="ec-panel-head"><h2>演练报告</h2>${A.badge(ready ? '预览' : terminal.has(t.status) ? '暂无报告' : '执行中', 'blue')}</div><div class="ec-preview-body"><h3>${E(A.taskReports?.normalize(t)?.name || '抗攻击能力报告')}</h3><p class="ec-caption">${ready ? (partial(t) ? '当前报告仅覆盖已完成的有效判定。' : '任务已结束，以下为报告摘要。') : terminal.has(t.status) ? '本次任务未产生可归档的执行记录。' : '任务结束后自动归档报告，目前展示已完成记录。'}</p><dl class="ec-preview-stats"><div><dt>有效判定</dt><dd>${m.valid}</dd></div><div><dt>已攻破</dt><dd>${breach}</dd></div><div><dt>防御成功率</dt><dd>${rate === null ? '—' : rate + '%'}</dd></div><div><dt>执行异常</dt><dd>${m.errors}</dd></div></dl>${m.valid ? `<p class="ec-preview-conclusion">${breach ? `已发现 ${breach} 条攻破记录，建议优先查看对应场景和判定依据。` : '已完成的有效记录中未出现攻破；结论范围限于本次策略和测试题目。'}</p>` : '<p class="ec-partial-note">尚无有效判定，暂不形成安全结论或鲁棒性评级。</p>'}<h4>重点场景</h4>${
        risks.size
          ? `<ul class="ec-risk-list">${[...risks]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([label, count]) => `<li><span>${E(label)}</span><strong>${count}</strong></li>`)
              .join('')}</ul>`
          : `<p class="ec-caption">${m.valid ? '暂无攻破场景' : '等待有效判定记录'}</p>`
      }<button class="btn primary" ${ref(t)} ${ready ? '' : 'disabled'} onclick="App.evaluation.openReportList(this.dataset.task)">在报告分析中查看完整报告</button></div></section>`;
    };
    V.taskDetailHTML = function (t) {
      if (!t || t.deletedAt) return V.tasksHTML();
      if (type(t) === 'scan') return A.scanProduct?.detailHTML(t) || '';
      return (
        detailHeading(t, false) +
        `<section class="task-summary-card">${X.compactConfigHTML(t)}${X.detailHeroHTML(t, X.metrics(t))}</section><div class="ec-task-evidence ec-task-evidence-full"><section class="card ec-records-panel" id="task-records"><div class="ec-panel-head"><h2>攻防记录</h2></div>${A.evaluationRecords?.renderEmbedded(t) || '<p class="empty">暂无攻防记录</p>'}</section></div>`
      );
    };
    V.reportDetailHTML = function (t) {
      if (!V.reportReady(t))
        return heading(
          t && type(t) === 'scan' ? '扫描报告' : '演练报告',
          '任务结束且产生记录后可查看报告。',
          '',
          'exercise/tasks',
        );
      if (type(t) === 'scan') return A.scanProduct.reportHTML(t.id);
      const m = metrics(t);
      return (
        detailHeading(t, true) +
        (partial(t)
          ? `<p class="ec-partial-note" role="status">部分结果：${E(X.statusLabel(t))}，共完成 ${m.done} / ${m.total} 个测试单元，其中 ${m.errors} 个执行异常。${m.valid ? '结论仅覆盖已完成的有效判定。' : '尚无有效判定，不能据此判断模型安全表现。'}</p>`
          : '') +
        X.compactConfigHTML(t) +
        (m.valid
          ? X.report(t, X.metrics(t))
          : `<section class="card ec-no-conclusion"><h2>暂无可用的安全结论</h2><p>本次任务没有有效判定，不计算攻击成功率、防御成功率或鲁棒性评级。</p>${A.taskReports?.evidenceHTML(t) || ''}</section>`)
      );
    };
    // Guard every retest entry point, including direct calls and historical links.
    V.canRetest = function (id) {
      const t = X.db.tasks.find((t) => t.id === id);
      if (!t || t.deletedAt) {
        A.toast('任务不存在或已删除');
        return false;
      }
      if (!terminal.has(t.status)) {
        A.toast('任务完成、结束或异常退出后才可复测。');
        return false;
      }
      return true;
    };
    for (const key of ['repeatTask', 'startQuickRetest']) {
      const original = X[key];
      if (typeof original === 'function')
        X[key] = function (id) {
          if (!V.canRetest(id)) return false;
          return original.apply(X, arguments);
        };
    }
    X.quickRetest = function (id) {
      if (!V.canRetest(id)) return false;
      X.repeatTask(id);
      return true;
    };
  })();
};
