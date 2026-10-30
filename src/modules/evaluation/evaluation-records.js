/* evaluation/evaluation-records。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['evaluation/evaluation-records'] = function () {
  /* Cross-task attack evidence. Rows are live references to executed units, never copied datasets. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      E = A.escape;
    const list = (value) => (Array.isArray(value) ? value : []);
    const copy = (value) => (value === undefined ? null : JSON.parse(JSON.stringify(value)));
    const text = (value) => (value === null || value === undefined ? '' : String(value));
    const complete = (unit) => ['breach', 'defended', 'error'].includes(unit.result);
    const status = (unit) =>
      ({ breach: '已攻破', defended: '已守住', error: '执行异常', pending: '待判定' })[
        unit.result
      ] || '待判定';
    const tone = (unit) =>
      ({ breach: 'orange', defended: 'green', error: 'gray', pending: 'blue' })[unit.result] ||
      'gray';
    const method = (unit) => X.methodDependencies?.[unit.method]?.label || unit.method || '未记录';
    const defaults = () => ({
      task: 'all',
      method: 'all',
      result: 'all',
      scene: 'all',
      query: '',
      page: 1,
    });
    const taskList = () =>
      list(X.db?.tasks).filter(
        (task) => !task.deletedAt && (A.evaluation?.type?.(task) || 'attack') === 'attack',
      );
    const version = (task) => task.runVersion || task.iteration || 1;
    const question = (task, unit) =>
      A.taskReports?.question(task, unit) ||
      list(task.runSnapshot?.bankSnapshot?.items || task.bankSnapshot?.items).find(
        (q) => String(q.id) === String(unit.questionId),
      ) ||
      null;
    const scenes = (q) => A.sceneTags?.resolve(q) || [];
    const sceneLabel = (id, q) => A.sceneTags?.label(id, q) || id;
    const option = (id, label, value) =>
      `<option value="${E(id)}" ${String(value) === String(id) ? 'selected' : ''}>${E(label)}</option>`;
    const fieldsHTML = (rows) =>
      `<dl class="er-evidence-fields">${rows.map(([label, value]) => `<div><dt>${E(label)}</dt><dd>${E(text(value) || '未记录')}</dd></div>`).join('')}</dl>`;
    const ER = (A.evaluationRecords = {
      state: defaults(),
      pageSize: 25,
      embeddedPageSize: 12,
      selected: new Set(),
      started(unit) {
        return (
          complete(unit) ||
          list(unit.events).length > 0 ||
          list(unit.roundHistory).length > 0 ||
          !!(
            unit.attackPrompt ||
            unit.rawResponse ||
            unit.response ||
            unit.verdict ||
            unit.blueBlocked
          ) ||
          list(unit.blueEvidence).length > 0
        );
      },
      setScope(taskId = '', scene = 'all', result = 'all') {
        ER.state = {
          ...defaults(),
          task: taskId || 'all',
          scene: scene || 'all',
          result: result || 'all',
        };
      },
      open(taskId = '') {
        ER.setScope(taskId);
        if (taskId) X.open(taskId);
        else A.evaluation.openTasks();
      },
      clear() {
        ER.state = defaults();
        A.render();
      },
      selectedRows() {
        return ER.rows(false).filter((row) => ER.selected.has(row.key));
      },
      selectRow(taskId, unitId, checked) {
        const key = JSON.stringify([taskId, unitId]);
        if (checked) {
          if (ER.rows(false).some((row) => row.key === key)) ER.selected.add(key);
        } else ER.selected.delete(key);
        A.render();
      },
      selectFiltered() {
        ER.rows().forEach((row) => ER.selected.add(row.key));
        A.render();
      },
      clearSelection() {
        ER.selected.clear();
        A.render();
      },
      filter(key, value) {
        if (!Object.prototype.hasOwnProperty.call(defaults(), key)) return;
        ER.state[key] = key === 'page' ? Math.max(1, Number(value) || 1) : text(value);
        if (key !== 'page') ER.state.page = 1;
        const input = key === 'query' ? document.getElementById('er-query') : null,
          caret = input?.selectionStart;
        A.render();
        if (key === 'query') {
          const next = document.getElementById('er-query');
          next?.focus();
          const position = Number.isInteger(caret) ? caret : text(value).length;
          next?.setSelectionRange?.(position, position);
        }
      },
      rows(filtered = true) {
        const rows = [];
        for (const task of taskList())
          for (const unit of list(task.units))
            if (ER.started(unit)) {
              const q = question(task, unit);
              rows.push({
                key: JSON.stringify([task.id, unit.id]),
                task,
                unit,
                question: q,
                sceneIds: scenes(q),
              });
            }
        rows.sort(
          (a, b) =>
            text(b.task.created).localeCompare(text(a.task.created)) ||
            text(a.task.id).localeCompare(text(b.task.id)) ||
            (Number(a.unit.index) || 0) - (Number(b.unit.index) || 0) ||
            text(a.unit.id).localeCompare(text(b.unit.id), undefined, { numeric: true }),
        );
        if (!filtered) return rows;
        const f = ER.state,
          query = f.query.trim().toLocaleLowerCase();
        return rows.filter(
          (row) =>
            (f.task === 'all' || String(row.task.id) === f.task) &&
            (f.method === 'all' || row.unit.method === f.method) &&
            (f.result === 'all' ||
              (f.result === 'pending' ? !complete(row.unit) : row.unit.result === f.result)) &&
            A.sceneTags.matches(row.question, f.scene) &&
            (!query ||
              [
                row.task.id,
                X.taskNumber(row.task.id),
                row.task.name,
                row.unit.id,
                row.unit.questionId,
                row.question?.prompt,
                row.unit.seedPrompt,
                row.unit.attackPrompt,
                method(row.unit),
                ...row.sceneIds.map((id) => sceneLabel(id, row.question)),
              ]
                .join(' ')
                .toLocaleLowerCase()
                .includes(query)),
        );
      },
      renderEmbedded(task) {
        if (ER.state.task !== String(task.id)) ER.setScope(String(task.id));
        const f = ER.state,
          all = ER.rows(false).filter((r) => r.task.id === task.id),
          rows = ER.rows().filter((r) => r.task.id === task.id),
          pages = Math.max(1, Math.ceil(rows.length / ER.embeddedPageSize));
        f.page = Math.min(f.page, pages);
        const methods = [...new Set(all.map((r) => r.unit.method))].sort((a, b) =>
            method({ method: a }).localeCompare(method({ method: b })),
          ),
          selectedCount = ER.selectedRows().filter((r) => r.task.id === task.id).length;
        return `<div class="er-embedded"><div class="er-embedded-filters"><input id="er-query" type="search" aria-label="搜索本任务攻防记录" placeholder="搜索题目或记录编号" value="${E(f.query)}" oninput="if(!event.isComposing)App.evaluationRecords.filter('query',this.value)"><select aria-label="本任务攻击方法" onchange="App.evaluationRecords.filter('method',this.value)">${option('all', '全部攻击方法', f.method)}${methods.map((id) => option(id, method({ method: id }), f.method)).join('')}</select><select aria-label="本任务判定结果" onchange="App.evaluationRecords.filter('result',this.value)">${[
          ['all', '全部判定'],
          ['breach', '已攻破'],
          ['defended', '已守住'],
          ['error', '执行异常'],
          ['pending', '待判定'],
        ]
          .map(([id, label]) => option(id, label, f.result))
          .join(
            '',
          )}</select><select aria-label="本任务攻击场景" onchange="App.evaluationRecords.filter('scene',this.value)">${A.sceneTags.options(
          f.scene,
          all.map((r) => r.question),
        )}</select><span class="er-filter-count">共 ${rows.length} 条 · 已选 ${selectedCount} 条</span><button class="link-btn" data-task="${E(task.id)}" ${selectedCount ? '' : 'disabled'} onclick="App.evaluationRecords.clearTaskSelection(this.dataset.task)">清空选择</button><button class="btn small primary" data-task="${E(task.id)}" ${selectedCount ? '' : 'disabled'} onclick="App.evaluationRecords.exportTaskSelected(this.dataset.task)">导出攻防明细</button></div>
   <div class="er-table-scroll"><table class="er-embedded-table"><thead><tr><th class="er-check-cell"><input type="checkbox" aria-label="选择全部筛选记录" ${rows.length && rows.every((r) => ER.selected.has(r.key)) ? 'checked' : ''} ${rows.length ? '' : 'disabled'} onchange="App.evaluationRecords.selectFilteredChecked(this.checked)"></th><th>记录 / 攻击题目</th><th>攻击方法</th><th>判定结果</th></tr></thead><tbody>${
     rows
       .slice((f.page - 1) * ER.embeddedPageSize, f.page * ER.embeddedPageSize)
       .map(
         ({ key, unit, question: q }) =>
           `<tr><td class="er-check-cell"><input type="checkbox" aria-label="选择记录 ${E(unit.id)}" data-task="${E(task.id)}" data-unit="${E(unit.id)}" ${ER.selected.has(key) ? 'checked' : ''} onchange="App.evaluationRecords.selectRow(this.dataset.task,this.dataset.unit,this.checked)"></td><td><button class="link-btn mono" data-task="${E(task.id)}" data-unit="${E(unit.id)}" onclick="App.evaluationRecords.inspect(this.dataset.task,this.dataset.unit)">${E(unit.id)}</button><p title="${E(q?.prompt || unit.seedPrompt || '')}">${E(q?.prompt || unit.seedPrompt || '题目未保存')}</p></td><td>${E(method(unit))}</td><td>${A.badge(status(unit), tone(unit))}</td></tr>`,
       )
       .join('') ||
     '<tr><td colspan="4" class="er-empty">暂无匹配记录；执行后自动保存攻击输入、模型响应和判定依据。</td></tr>'
   }</tbody></table></div><div class="er-pagination"><span>每页 ${ER.embeddedPageSize} 条</span><div><button class="btn small" ${f.page <= 1 ? 'disabled' : ''} onclick="App.evaluationRecords.filter('page',${f.page - 1})">上一页</button><span>${f.page} / ${pages}</span><button class="btn small" ${f.page >= pages ? 'disabled' : ''} onclick="App.evaluationRecords.filter('page',${f.page + 1})">下一页</button></div></div></div>`;
      },
      render() {
        const all = ER.rows(false),
          rows = ER.rows(),
          f = ER.state,
          pages = Math.max(1, Math.ceil(rows.length / ER.pageSize)),
          selectedCount = ER.selectedRows().length;
        f.page = Math.min(Math.max(1, f.page), pages);
        const tasks = taskList()
            .slice()
            .sort((a, b) => text(b.created).localeCompare(text(a.created))),
          methods = [...new Set(all.map((row) => row.unit.method).filter(Boolean))].sort((a, b) =>
            method({ method: a }).localeCompare(method({ method: b }), undefined, {
              numeric: true,
            }),
          );
        const body = rows
          .slice((f.page - 1) * ER.pageSize, f.page * ER.pageSize)
          .map((row) => {
            const { task, unit, question: q } = row,
              recordAttrs = `data-task="${E(task.id)}" data-unit="${E(unit.id)}"`,
              saved = list(unit.roundHistory).length;
            return `<tr data-record-key="${E(row.key)}"><td class="er-check-cell"><input type="checkbox" aria-label="选择 ${E(X.taskNumber(task.id))} / ${E(unit.id)}" ${recordAttrs} ${ER.selected.has(row.key) ? 'checked' : ''} onchange="App.evaluationRecords.selectRow(this.dataset.task,this.dataset.unit,this.checked)"></td><td class="er-record-cell"><button class="link-btn mono" ${recordAttrs} onclick="App.evaluationRecords.inspect(this.dataset.task,this.dataset.unit)">${E(unit.id || '未编号')}</button></td><td class="er-task-cell"><button class="link-btn" data-task="${E(task.id)}" onclick="App.attack.open(this.dataset.task)">${E(task.name || task.id)}</button><small>${E(X.taskNumber(task.id))}</small></td><td class="er-question-cell"><p title="${E(q?.prompt || unit.seedPrompt || '')}">${E(q?.prompt || unit.seedPrompt || '原始题目未保存')}</p><small>${E(unit.questionId || '题目编号未记录')}</small></td><td>${E(method(unit))}</td><td class="er-scene-cell"><div class="er-tags">${row.sceneIds.map((id) => `<span>${E(sceneLabel(id, q))}</span>`).join('') || '<span class="er-muted">未提供场景</span>'}</div></td><td>${A.badge(status(unit), tone(unit))}</td><td class="er-time">${E(A.fmtTime(task.created) || '未记录')}</td><td><div class="er-actions"><button class="link-btn" ${recordAttrs} onclick="App.evaluationRecords.inspect(this.dataset.task,this.dataset.unit)">过程</button></div></td></tr>`;
          })
          .join('');
        const selectedTask = tasks.find((task) => String(task.id) === f.task),
          empty =
            selectedTask && !list(selectedTask.units).some(ER.started)
              ? '此任务尚未产生攻防记录。开始执行后，记录会自动出现在这里。'
              : all.length
                ? '没有符合筛选条件的攻防记录。'
                : '任务开始执行后，这里将逐条汇总攻击输入、模型响应和判定结果。';
        return `${A.heading('SECURITY EVALUATION', '攻防明细', '按任务汇总已执行的测试单元，多轮攻击在同一条记录内查看。', `<button class="btn" ${rows.length ? '' : 'disabled'} onclick="App.evaluationRecords.exportRows()">${A.icon('download', 14)}导出当前筛选</button>`)}<section class="card er-page">
   <div class="er-filters"><label class="er-search"><span>搜索</span><input id="er-query" type="search" placeholder="任务、题目或记录编号" value="${E(f.query)}" oninput="if(!event.isComposing)App.evaluationRecords.filter('query',this.value)" oncompositionend="App.evaluationRecords.filter('query',this.value)"></label>
   <label><span>所属任务</span><select aria-label="攻防明细任务筛选" onchange="App.evaluationRecords.filter('task',this.value)">${option('all', '全部任务', f.task)}${tasks.map((task) => option(task.id, (task.name || X.taskNumber(task.id)) + ' · ' + X.taskNumber(task.id), f.task)).join('')}</select></label>
   <label><span>攻击方法</span><select aria-label="攻防明细方法筛选" onchange="App.evaluationRecords.filter('method',this.value)">${option('all', '全部攻击方法', f.method)}${methods.map((id) => option(id, method({ method: id }), f.method)).join('')}</select></label>
   <label><span>判定结果</span><select aria-label="攻防明细判定筛选" onchange="App.evaluationRecords.filter('result',this.value)">${[
     ['all', '全部判定'],
     ['breach', '已攻破'],
     ['defended', '已守住'],
     ['error', '执行异常'],
     ['pending', '待判定'],
   ]
     .map(([id, label]) => option(id, label, f.result))
     .join('')}</select></label>
   <label><span>攻击场景</span><select aria-label="攻防明细场景筛选" onchange="App.evaluationRecords.filter('scene',this.value)">${A.sceneTags.options(
     f.scene,
     all.map((r) => r.question),
   )}</select></label><button class="btn" onclick="App.evaluationRecords.clear()">重置</button></div>
   <div class="er-selection"><button class="btn small" ${rows.length ? '' : 'disabled'} onclick="App.evaluationRecords.selectFiltered()">选择筛选结果</button><button class="link-btn" ${selectedCount ? '' : 'disabled'} onclick="App.evaluationRecords.clearSelection()">清空选择</button><span>已选 <strong>${selectedCount}</strong> 条 · 跨任务、跨页保留选择</span><button class="btn small primary" ${selectedCount ? '' : 'disabled'} onclick="App.evaluationRecords.exportSelected()">导出所选（${selectedCount}）</button></div>
   <div class="er-list-caption"><span>共 <strong>${rows.length}</strong> 条记录${f.task !== 'all' ? ' · 已限定所属任务' : ''}</span><span>每条记录对应一个测试单元，未开始的单元不计入</span></div>
   <div class="er-table-scroll"><table class="er-table"><thead><tr><th class="er-check-cell">选择</th><th>记录编号</th><th>所属任务</th><th>攻击题目</th><th>攻击方法</th><th>攻击场景</th><th>判定结果</th><th>任务创建时间</th><th>操作</th></tr></thead><tbody>${body || `<tr><td colspan="9"><div class="er-empty">${E(empty)}</div></td></tr>`}</tbody></table></div>
   <div class="er-pagination"><span>每页 ${ER.pageSize} 条 · 共 ${rows.length} 条</span><div><button class="btn small" aria-label="攻防明细上一页" ${f.page <= 1 ? 'disabled' : ''} onclick="App.evaluationRecords.filter('page',${f.page - 1})">上一页</button><span>${f.page} / ${pages}</span><button class="btn small" aria-label="攻防明细下一页" ${f.page >= pages ? 'disabled' : ''} onclick="App.evaluationRecords.filter('page',${f.page + 1})">下一页</button></div></div></section>`;
      },
      roundEntries(unit) {
        const history = list(unit.roundHistory).map((row) => ({
          record: row,
          title:
            Number.isFinite(Number(row.round)) && Number(row.round) > 0
              ? '第 ' + row.round + ' 轮'
              : '已保存轮次',
          current: false,
        }));
        const current = unit.currentRound || list(unit.events).at(-1)?.round;
        if (
          !complete(unit) &&
          ER.started(unit) &&
          (!history.length ||
            (current && !history.some((row) => Number(row.record.round) === Number(current))))
        ) {
          history.push({
            record: {
              round: current,
              prompt: unit.attackPrompt,
              rawResponse: unit.rawResponse,
              response: unit.response,
              verdict: unit.verdict,
              result: 'pending',
              score: unit.score,
              blueBlocked: unit.blueBlocked,
              blueEvidence: unit.blueEvidence,
              dataLabels: unit.dataLabels,
            },
            title: current ? '第 ' + current + ' 轮 · 待判定' : '当前执行记录',
            current: true,
          });
        }
        if (!history.length && complete(unit))
          history.push({
            record: {
              prompt: unit.attackPrompt,
              rawResponse: unit.rawResponse,
              response: unit.response,
              verdict: unit.verdict,
              result: unit.result,
              score: unit.score,
              blueBlocked: unit.blueBlocked,
              blueEvidence: unit.blueEvidence,
              dataLabels: unit.dataLabels,
            },
            title: '最终记录 · 逐轮明细未保存',
            current: false,
          });
        return history;
      },
      roundSummary(task, unit, r) {
        const evidence = list(r.blueEvidence),
          blocked =
            r.blueBlocked ||
            (evidence.some((e) => e.node === 'input' && e.action === '拦截')
              ? 'input'
              : evidence.some((e) => e.node === 'output' && e.action === '拦截')
                ? 'output'
                : null),
          configured = X.guardFlow?.(task) || {},
          d = task.defense || {},
          flow = {
            input:
              configured.input ||
              (d.mode === 'guard' && (d.modelInput || d.rules?.input || d.inputPolicySnapshot)),
            output:
              configured.output ||
              (d.mode === 'guard' && (d.modelOutput || d.rules?.output || d.outputPolicySnapshot)),
          };
        const inputBlocked = blocked === 'input',
          guards = ['input', 'output']
            .filter((stage) => flow[stage] || evidence.some((e) => e.node === stage))
            .map((stage) => {
              const rows = evidence.filter((e) => e.node === stage),
                skipped = stage === 'output' && inputBlocked;
              return {
                stage,
                position:
                  stage === 'input'
                    ? '攻击输入 → 输入护栏 → 靶标'
                    : '靶标原始响应 → 输出护栏 → 最终交付',
                state: skipped
                  ? '已跳过：输入护栏已拦截'
                  : rows.length
                    ? '已保存处理记录'
                    : '未记录',
                records: copy(rows),
              };
            });
        return {
          round: r.round ?? null,
          attackInput: r.prompt ?? null,
          targetCalled: inputBlocked ? false : r.rawResponse != null ? true : null,
          rawResponse: inputBlocked ? null : (r.rawResponse ?? null),
          rawResponseNote: inputBlocked
            ? '输入护栏已拦截，未调用靶标，无原始响应'
            : r.rawResponse == null
              ? '未记录'
              : null,
          deliveredResponse: r.response ?? null,
          deliverySource: inputBlocked
            ? '输入护栏拦截回复'
            : blocked === 'output'
              ? '输出护栏处理后的内容'
              : r.response != null && r.rawResponse != null && r.response === r.rawResponse
                ? '靶标响应'
                : r.response != null
                  ? '已保存的最终交付内容'
                  : '未记录',
          result: r.result || 'pending',
          score: r.score ?? null,
          reason: r.verdict ?? null,
          error: r.errorMessage || r.error || unit.errorMessage || null,
          guards,
        };
      },
      evidenceHTML(task, unit) {
        const q = question(task, unit),
          entries = ER.roundEntries(unit),
          threshold =
            unit.judgeThreshold ??
            unit.judgementSnapshot?.threshold ??
            A.taskReports?.judgement(task)?.threshold;
        const guardHTML = (summary) =>
          summary.guards.length
            ? summary.guards
                .map(
                  (g) =>
                    `<section class="er-guard-summary"><h4>${g.stage === 'input' ? '输入护栏' : '输出护栏'}</h4><p class="er-muted">${E(g.position)} · ${E(g.state)}</p>${g.records
                      .map((item) =>
                        fieldsHTML([
                          ['处理动作', item.action],
                          ['护栏判定', item.label || item.modelResult?.label],
                          ['检测依据', item.reason],
                          [
                            '检测原始输出',
                            typeof (
                              item.rawOutput ??
                              item.output ??
                              item.modelResult?.rawOutput
                            ) === 'object'
                              ? JSON.stringify(
                                  item.rawOutput ?? item.output ?? item.modelResult?.rawOutput,
                                  null,
                                  2,
                                )
                              : (item.rawOutput ?? item.output ?? item.modelResult?.rawOutput),
                          ],
                          [
                            '护栏交付内容',
                            item.outputContent ??
                              (item.action === '拦截' &&
                              summary.deliverySource.startsWith(
                                g.stage === 'input' ? '输入' : '输出',
                              )
                                ? summary.deliveredResponse
                                : null),
                          ],
                        ]),
                      )
                      .join('')}</section>`,
                )
                .join('')
            : '<p class="er-muted">未配置独立输入 / 输出护栏。</p>';
        return `<article class="er-detail">${fieldsHTML([
          ['所属任务', (task.name || X.taskNumber(task.id)) + '（' + X.taskNumber(task.id) + '）'],
          ['记录编号', unit.id],
          ['任务创建时间', A.fmtTime(task.created)],
          ['攻击方法', method(unit)],
          ['攻击题目', q?.prompt || unit.seedPrompt],
          [
            '场景标签',
            scenes(q)
              .map((id) => sceneLabel(id, q))
              .join('、') || '未提供场景',
          ],
          ['来源题库', A.taskReports?.source(q) || q?.sourceBankName || '未记录'],
        ])}<div class="er-rounds">${
          entries
            .map((entry, index) => {
              const r = entry.record,
                s = ER.roundSummary(task, unit, r);
              return `<details class="er-round" ${index === entries.length - 1 ? 'open' : ''}><summary><strong>${E(entry.title)}</strong>${A.badge(status(r), tone(r))}</summary>${fieldsHTML([['攻击输入', s.attackInput], ['靶标原始响应', s.rawResponseNote || s.rawResponse], ['最终交付来源', s.deliverySource], ['最终交付内容', s.deliveredResponse], ['判定结果', status(r) + (s.score !== null ? ' · 评分 ' + s.score + ' / 5' : '')], ['判定依据', s.reason], ...(s.error ? [['异常信息', s.error]] : [])])}${guardHTML(s)}</details>`;
            })
            .join('') || '<p class="er-muted">当前仅保存执行事件，尚无输入、响应和判定记录。</p>'
        }</div></article>`;
      },
      inspect(taskId, unitId) {
        const task = taskList().find((row) => String(row.id) === String(taskId)),
          unit = list(task?.units).find((row) => String(row.id) === String(unitId));
        if (!task || !unit || !ER.started(unit)) {
          A.toast('这条攻防记录尚未产生或已不存在');
          return;
        }
        A.drawer(
          '攻防明细 · ' + E(unit.id),
          ER.evidenceHTML(task, unit),
          `<button class="btn" onclick="App.closeDrawer()">关闭</button><button class="btn" data-task="${E(task.id)}" data-unit="${E(unit.id)}" onclick="App.evaluationRecords.exportOne(this.dataset.task,this.dataset.unit)">${A.icon('download', 14)}导出本条</button>`,
        );
      },
      selectFilteredChecked(checked) {
        for (const r of ER.rows()) checked ? ER.selected.add(r.key) : ER.selected.delete(r.key);
        A.render();
      },
      clearTaskSelection(taskId) {
        for (const r of ER.rows(false)) if (r.task.id === taskId) ER.selected.delete(r.key);
        A.render();
      },
      exportTaskRows(taskId) {
        const rows = ER.rows().filter((r) => r.task.id === taskId);
        if (!rows.length) {
          A.toast('当前筛选下没有可导出的攻防记录');
          return;
        }
        return ER.downloadRows(rows, 'filtered');
      },
      exportTaskSelected(taskId) {
        const rows = ER.selectedRows().filter((r) => r.task.id === taskId);
        if (!rows.length) {
          A.toast('请先选择本任务的攻防记录');
          return;
        }
        return ER.downloadRows(rows, 'selected');
      },
      exportLogs(taskId) {
        const task = taskList().find((t) => t.id === taskId);
        if (!task) return;
        if (!['done', 'stopped', 'error'].includes(task.status)) {
          A.toast('任务结束后可导出完整任务日志');
          return false;
        }
        const payload = {
          schemaVersion: 1,
          scope: 'whole_task_saved_execution_log',
          taskId: task.id,
          taskName: task.name,
          status: task.status,
          created: task.created,
          simulated: !!task.simulated,
          resultSource: task.resultSource || 'local-saved',
          coverage:
            '本任务已保存的执行事件、逐轮输入输出、护栏判定与异常；不包含未接入的服务端日志。',
          totalUnits: list(task.units).length,
          records: list(task.units).map((u) => ({
            unitId: u.id,
            questionId: u.questionId,
            method: u.method,
            result: u.result,
            savedUnit: copy(u),
            events: copy(list(u.events)),
            rounds: copy(list(u.roundHistory)),
            current: {
              attackInput: u.attackPrompt ?? null,
              rawResponse: u.blueBlocked === 'input' ? null : (u.rawResponse ?? null),
              deliveredResponse: u.response ?? null,
              blueBlocked: u.blueBlocked ?? null,
              blueEvidence: copy(list(u.blueEvidence)),
              score: u.score ?? null,
              reason: u.verdict ?? null,
            },
            errorCode: u.errorCode ?? null,
            errorMessage: u.errorMessage || u.errorReason || u.error || null,
          })),
          error: task.error || null,
        };
        A.download(
          ('任务日志-' + task.id).replace(/[\\/:*?"<>|]/g, '_') + '.json',
          JSON.stringify(payload, null, 2),
          'application/json;charset=utf-8',
        );
        return payload;
      },
      exportRows() {
        const rows = ER.rows();
        if (!rows.length) {
          A.toast('当前筛选下没有可导出的攻防记录');
          return;
        }
        return ER.downloadRows(rows, 'filtered');
      },
      exportSelected() {
        const rows = ER.selectedRows();
        if (!rows.length) {
          A.toast('请先选择需要导出的攻防记录');
          return;
        }
        return ER.downloadRows(rows, 'selected');
      },
      exportOne(taskId, unitId) {
        const key = JSON.stringify([taskId, unitId]),
          rows = ER.rows(false).filter((row) => row.key === key);
        if (!rows.length) {
          A.toast('这条攻防记录尚未产生或已不存在');
          return;
        }
        return ER.downloadRows(rows, 'single');
      },
      downloadRows(rows, mode) {
        const payload = {
          schemaVersion: 2,
          scope: 'executed_attack_units',
          exportMode: mode,
          count: rows.length,
          items: rows.map(({ task, unit, question: q, sceneIds, key }) => ({
            recordKey: key,
            taskId: task.id,
            taskName: task.name,
            taskCreated: task.created,
            runVersion: version(task),
            unitId: unit.id,
            question: copy(q),
            sceneTags: copy(sceneIds),
            sceneLabels: sceneIds.map((id) => sceneLabel(id, q)),
            simulated: !!task.simulated,
            method: method(unit),
            summary: ER.roundEntries(unit).map(({ record }) => ER.roundSummary(task, unit, record)),
          })),
        };
        if (mode === 'filtered') {
          payload.filters = copy(ER.state);
          delete payload.filters.page;
        }
        const suffix =
          mode === 'single'
            ? '-' + text(rows[0].task.id) + '-' + text(rows[0].unit.id)
            : mode === 'selected'
              ? '-所选'
              : '';
        A.download(
          ('攻防明细' + suffix).replace(/[\\/:*?"<>|]/g, '_') + '.json',
          JSON.stringify(payload, null, 2),
          'application/json;charset=utf-8',
        );
        return payload;
      },
    });
    // Report links enter this task's embedded records and keep their explicit filters.
    const analysisNavigate = X.analysisNavigate;
    X.analysisNavigate = function (filter, section) {
      if (section) return analysisNavigate.apply(X, arguments);
      const task = X.task;
      if (!task || task.deletedAt) return;
      ER.setScope(
        task.id,
        'all',
        ['breach', 'defended', 'error', 'pending'].includes(filter) ? filter : 'all',
      );
      X.tab = 'tasks';
      X.detailTab = 'samples';
      A.render();
      document
        .getElementById('task-records')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    X.openSceneRecords = function (scene, result = 'all') {
      const task = X.task;
      if (!task || task.deletedAt) return;
      ER.setScope(
        task.id,
        scene || 'all',
        ['breach', 'defended', 'error', 'pending'].includes(result) ? result : 'all',
      );
      X.tab = 'tasks';
      X.detailTab = 'samples';
      A.render();
      document
        .getElementById('task-records')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  })();
};
