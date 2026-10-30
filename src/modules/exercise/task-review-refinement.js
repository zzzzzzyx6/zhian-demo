/* exercise/task-review-refinement。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/task-review-refinement'] = function () {
  /* Focused refinements for task configuration, results, reports and dataset annotation. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      V = A.evaluation,
      E = A.escape,
      L = A.reportLayout,
      DS = A.evaluationDatasets;
    const esc = (v) => E(v == null || v === '' ? '—' : String(v));
    const target = (t) =>
      t.targetName ||
      t.runSnapshot?.targetSnapshot?.name ||
      t.targetSnapshot?.name ||
      X.targetFor(t)?.name ||
      '未记录靶标';
    const statusLabel = (t) =>
      ({ done: '已完成', running: '运行中', error: '异常', stopped: '已终止', queued: '未开始' })[
        t?.status
      ] || '未开始';
    const status = (t) =>
      '<span class="exercise-status status-' +
      (t?.status || 'queued') +
      '"><i aria-hidden="true"></i>' +
      statusLabel(t) +
      '</span>';
    const methods = (t) => {
      const p = t.runSnapshot?.policy || t.runSnapshot?.policySnapshot || t.policySnapshot || {};
      const list = p.methods || t.engine?.methods || [];
      return Array.isArray(list) ? list.map((m) => (typeof m === 'string' ? { id: m } : m)) : [];
    };
    // 与策略、攻击方法列表一致：显示方法英文标识名。
    const methodName = (id) => A.policies?.method?.(id)?.name || id || '未记录';
    // 一个攻击方法一行：参数与该方法绑定的辅助模型合并为方法参数。
    const methodLine = (t, m) => {
      const id = m.id || m.method || m.name,
        bound = X.methodModelsFor?.(t)?.[id] || {},
        params = (A.policies.paramPairs?.(id, m.parameters) || []).map(([k, v]) => k + '：' + v);
      for (const slot of X.methodSlots?.({ id }) || []) {
        const snap = bound.modelSnapshots?.[slot.key];
        params.push(slot.label + '：' + (snap?.name || snap?.model || roleName(t, slot.key)));
      }
      return methodName(id) + (params.length ? '（' + params.join('、') + '）' : '');
    };
    const roleName = (t, role) => {
      const s = t.runSnapshot || {},
        roles = t.engine?.roles || {},
        v =
          role === 'judge'
            ? A.taskReports.judgement(t).model || roles.judge
            : role === 'attacker'
              ? s.attacker || roles.attacker
              : roles.process;
      return v?.name || v?.model || (role === 'judge' ? '未记录' : '无');
    };
    const strategy = (t) => {
      const p = t.runSnapshot?.policy || t.runSnapshot?.policySnapshot || t.policySnapshot || {};
      return p.name || p.title || '自定义攻击策略';
    };
    L.configHTML = function (t, a, open) {
      const s = t.runSnapshot || {},
        d = s.defense || t.defense || {},
        banks = s.bankSnapshot || t.bankSnapshot || {},
        j = A.taskReports.judgement(t),
        ms = methods(t);
      const bank =
        esc(banks.name || '未记录') +
        (banks.items?.length ? '（' + banks.items.length + ' 道）' : '');
      const configVals = [
        ['靶标（被测模型）', target(t)],
        ['红队 · 攻击策略', strategy(t)],
        ['攻击方法与参数', ms.length ? ms.map((m) => methodLine(t, m)) : '未记录攻击方法'],
        ['攻击题库', bank],
        ['蓝队 · 护栏', X.blueText(d)],
        ['裁判', roleName(t, 'judge')],
      ];
      // 值为数组时一项一行。
      const cell = (v) => (Array.isArray(v) ? v.map(esc).join('<br>') : esc(v));
      const config =
        '<dl class="tr-config-table">' +
        configVals
          .map((x) => '<div><dt>' + esc(x[0]) + '</dt><dd>' + cell(x[1]) + '</dd></div>')
          .join('') +
        '</dl>';
      const endTime = ['done', 'stopped', 'error'].includes(t.status)
        ? A.fmtTime(t.finishedAt || t.finished || t.stoppedAt)
        : '';
      const vals = [
        ['任务名称', t.name],
        ['任务描述', t.description],
        ['任务编号', X.taskNumber?.(t.id) || t.id],
        ['状态', statusLabel(t)],
        ['创建时间', A.fmtTime(t.created)],
        ['完成时间', endTime],
        ['并发', s.concurrency ?? t.engine?.concurrency],
        ['完成情况', (a?.done ?? 0) + ' / ' + (a?.total ?? t.units?.length ?? 0) + ' 个测试单元'],
      ];
      const basic =
        '<dl class="tr-basic-grid">' +
        vals
          .map((x) => '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>')
          .join('') +
        '</dl>';
      return (
        '<section class="tr-info-block"><h2>基础信息</h2>' +
        basic +
        '</section><section class="tr-info-block"><h2>配置信息</h2>' +
        config +
        '</section>'
      );
    };

    // 从任务测试单元合成运行日志：编排启动 → 各单元攻击/判定 → 完成/终止。
    // 异常或无报告任务也能借此看到执行进程。
    const resultLabel = {
      breach: '已攻破',
      defended: '已守住',
      error: '执行异常',
      pending: '待判定',
    };
    const logLevel = { breach: 'warn', error: 'error', defended: 'ok', pending: 'info' };
    V.taskLogLines = function (t) {
      const lines = [],
        push = (time, lvl, msg) => lines.push({ time: A.fmtTime(time) || '', lvl, msg });
      push(t.created, 'info', '任务创建 · ' + (X.taskNumber?.(t.id) || t.id));
      push(t.created, 'info', '编排器启动：靶标 ' + target(t) + ' · 策略 ' + strategy(t));
      const units = (t.units || []).filter((u) =>
        ['breach', 'defended', 'error'].includes(u.result),
      );
      units.forEach((u, i) => {
        const r = u.result,
          rounds = u.currentRound || u.rounds || 1;
        push(
          u.finished || t.created,
          logLevel[r] || 'info',
          `单元 ${esc(u.id || '#' + (i + 1))} · ${methodName(u.method)} · ${rounds} 轮 · 裁判判定「${resultLabel[r] || r}」`,
        );
      });
      const end = ['done', 'stopped', 'error'].includes(t.status)
        ? t.finishedAt || t.finished || t.stoppedAt
        : null;
      if (t.status === 'running') push(t.created, 'info', '任务执行中，日志持续写入…');
      else if (t.status === 'error')
        push(end, 'error', '任务异常终止 · ' + (t.errorCode || 'EXECUTION_ERROR'));
      else if (t.status === 'stopped') push(end, 'warn', '任务被手动终止');
      else if (t.status === 'done') push(end, 'ok', '任务完成，全部单元判定结束');
      return lines;
    };
    V.taskLogText = (t) =>
      V.taskLogLines(t)
        .map((l) => `[${l.time}] ${String(l.lvl).toUpperCase().padEnd(5)} ${l.msg}`)
        .join('\n');
    V.taskLogHTML = function (t) {
      const lines = V.taskLogLines(t);
      const body = lines
        .map(
          (l) =>
            `<div class="tr-log-line tr-log-${l.lvl}"><span class="tr-log-time">${esc(l.time)}</span><span class="tr-log-lvl">${esc(String(l.lvl).toUpperCase())}</span><span class="tr-log-msg">${esc(l.msg)}</span></div>`,
        )
        .join('');
      return (
        '<section class="card tr-log-panel"><div class="ec-panel-head"><h2>运行日志</h2><div class="tr-log-tools"><span class="tr-log-count">' +
        lines.length +
        ' 行' +
        (t.status === 'running' ? ' · 写入中' : '') +
        '</span><button class="btn small" data-id="' +
        esc(t.id) +
        '" onclick="App.evaluation.downloadTaskLog(this.dataset.id)">' +
        A.icon('download', 13) +
        '导出完整日志</button></div></div><pre class="tr-log">' +
        body +
        (t.status === 'running' ? '<div class="tr-log-line tr-log-info">▌</div>' : '') +
        '</pre></section>'
      );
    };
    V.downloadTaskLog = function (id) {
      const t = X.db.tasks.find((t) => t.id === id && !t.deletedAt);
      if (!t) return;
      A.download((X.taskNumber?.(t.id) || t.id) + '-运行日志.txt', V.taskLogText(t));
    };
    const priorDetail = V.taskDetailHTML;
    V.taskDetailHTML = function (t) {
      if (!t || t.deletedAt || t.type === 'scan') return priorDetail.apply(V, arguments);
      const a = X.taskAnalysis(t),
        ready = V.reportReady(t) && !A.reviewPolish.reportDeleted(t);
      const hasResult = (t.units || []).some((u) =>
        ['breach', 'defended', 'error'].includes(u.result),
      );
      return (
        '<div class="page-heading exercise-task-heading"><div class="page-heading-main">' +
        A.backButton('exercise/tasks') +
        '<div class="exercise-title-line">' +
        status(t) +
        '<h1>' +
        esc(t.name) +
        '</h1></div></div><div class="page-actions">' +
        (t.status === 'running'
          ? '<button class="btn danger" data-id="' +
            esc(t.id) +
            '" onclick="App.attack.taskAction(this.dataset.id,\'stop\')">终止</button>'
          : '') +
        '<button class="btn primary" ' +
        (ready ? '' : 'disabled') +
        ' data-id="' +
        esc(t.id) +
        '" onclick="App.evaluation.openReport(this.dataset.id)">查看报告</button>' +
        (t.status === 'running'
          ? ''
          : '<button class="btn" data-id="' +
            esc(t.id) +
            '" onclick="App.attack.quickRetest(this.dataset.id)">复测</button>') +
        A.entryManagement.button('attack-task', t.id) +
        '</div></div>' +
        '<div class="tr-detail-columns"><div class="tr-detail-main">' +
        L.configHTML(t, a, true) +
        '</div><div class="tr-detail-side">' +
        (hasResult
          ? '<section class="card tr-result-panel"><div class="ec-panel-head"><h2>演练结果数据</h2></div>' +
            (X.resultDigestHTML ? X.resultDigestHTML(t) : '') +
            '</section>'
          : '') +
        V.taskLogHTML(t) +
        '</div></div>'
      );
    };
    const priorReport = V.reportDetailHTML;
    V.reportDetailHTML = function (t) {
      const html = priorReport.apply(V, arguments);
      return !t || t.type === 'scan'
        ? html
        : html
            .replaceAll('报告概览', '演练结果分析')
            .replaceAll('基础报告（配置与分析）', '演练结果分析')
            .replaceAll('勾选报告内容', '选择报告内容');
    };
    // 报告内基础/配置信息：与其他报告小节同级，用分隔线区分，列表样式同攻击场景/方法表。
    function reportInfo(html) {
      return html
        .replace(
          /<section class="tr-info-block"><h2>([^<]+)<\/h2>/g,
          '<section class="analysis-section report-info"><header class="analysis-section-head"><h3>$1</h3></header>',
        )
        .replace(
          /<dl class="tr-(?:basic-grid|config-table)">/g,
          '<div class="analysis-table-wrap"><table class="analysis-table report-info-table"><tbody>',
        )
        .replace(/<\/dl>/g, '</tbody></table></div>')
        .replace(
          /<div><dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g,
          '<tr><th scope="row">$1</th><td>$2</td></tr>',
        );
    }
    const body = L.body;
    L.body = function (t) {
      let html = body.apply(L, arguments);
      const f = html.match(
          /<section class="analysis-section report-findings">[\s\S]*?<\/section>/,
        )?.[0],
        n = html.match(
          /<section class="analysis-section report-next-steps">[\s\S]*?<\/section>/,
        )?.[0];
      if (f && n)
        html = html
          .replace(f, '')
          .replace(n, '')
          .replace(
            /(<section class="analysis-section report-results">[\s\S]*?<\/section>)/,
            '$1' + f + n,
          );
      return reportInfo(L.configHTML(t, X.taskAnalysis(t), false)) + html;
    };

    const validate = X.validateBlue;
    X.validateBlue = function (w) {
      if (w.defenseMode === 'qwen3guard' && !w.guard) w.guard = X.guardCandidates()[0]?.id || '';
      return validate.call(X, w);
    };
    if (DS) {
      DS.prompts = function (row) {
        const all = [
            { label: '原始题目', text: row.question?.prompt || row.unit.seedPrompt || '' },
            ...(A.evaluationRecords.roundEntries(row.unit) || []).map((x, i) => {
              const r = x.record || x;
              return {
                label: '第 ' + (x.index ?? i + 1) + ' 轮改写输入',
                text: r.attackInput || r.prompt || r.input || '',
              };
            }),
            { label: '最终攻击输入', text: row.unit.attackPrompt || '' },
          ],
          seen = new Set();
        return all.filter((p) => p.text && !seen.has(p.text) && (seen.add(p.text), true));
      };
      DS.canFreeze = (rows) =>
        rows.length > 0 &&
        rows.every((r) => {
          const a = DS.annotation(r);
          return (
            a.reviewed &&
            a.referenceAnswer?.trim() &&
            (a.selectedPrompt?.trim() || DS.prompts(r).length > 0)
          );
        });
      DS.editAnnotation = function (key) {
        const row = DS.rows(false).find((r) => r.key === key);
        if (!row) return;
        const prompts = DS.prompts(row);
        DS.annotationDraft = { ...JSON.parse(JSON.stringify(DS.annotation(row))), key };
        DS.annotationDraft.selectedPrompt ||= prompts[0]?.text || '';
        A.modal(
          '人工标注',
          '<div class="or-annotation-source"><strong>选择用于本条标注的攻防输入</strong><label class="field"><span>输入来源</span><select onchange="App.evaluationDatasets.annotationDraft.selectedPrompt=this.value">' +
            prompts
              .map(
                (p, i) =>
                  '<option value="' +
                  E(p.text) +
                  '" ' +
                  (p.text === DS.annotationDraft.selectedPrompt ? 'selected' : '') +
                  '>' +
                  E(p.label) +
                  '</option>',
              )
              .join('') +
            '</select></label><p class="dataset-selected-prompt">' +
            esc(DS.annotationDraft.selectedPrompt || '没有已保存的攻击输入') +
            '</p><strong>原始模型输出（参考）</strong><p>' +
            esc(row.unit.rawResponse || row.unit.response || '未保存') +
            '</p></div><div class="field"><label for="dataset-answer">安全参考回答</label><textarea id="dataset-answer" rows="6" maxlength="20000" placeholder="填写经人工确认的安全回答" oninput="App.evaluationDatasets.annotationDraft.referenceAnswer=this.value">' +
            esc(DS.annotationDraft.referenceAnswer || '') +
            '</textarea></div><label class="cs-checkbox"><input type="checkbox" ' +
            (DS.annotationDraft.reviewed ? 'checked' : '') +
            ' onchange="App.evaluationDatasets.annotationDraft.reviewed=this.checked">确认此安全参考回答</label><p id="dataset-annotation-error" class="error-message" role="alert"></p>',
          '<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.evaluationDatasets.saveAnnotation()">保存标注</button>',
          { wide: true },
        );
      };
      const record = DS.record;
      DS.record = function (row) {
        const v = record(row);
        v.annotation.selected_prompt = DS.annotation(row).selectedPrompt || '';
        delete v.task_version;
        delete v.evaluation_type;
        delete v.model.version;
        delete v.tags.custom;
        return v;
      };
      const payload = DS.payload;
      DS.payload = function (records, format) {
        if (format !== 'sft') return payload.apply(DS, arguments);
        return records
          .filter(
            (r) =>
              r.annotation.reviewed &&
              r.annotation.reference_answer &&
              r.annotation.selected_prompt &&
              ['breach', 'defended'].includes(r.tags.result),
          )
          .map((r) => ({
            messages: [
              { role: 'user', content: r.annotation.selected_prompt },
              { role: 'assistant', content: r.annotation.reference_answer },
            ],
            metadata: {
              record_id: r.record_id,
              task_id: r.task_id,
              tags: r.tags,
              simulated: r.simulated,
            },
          }));
      };
      const freeze = DS.freeze;
      DS.freeze = function () {
        if (!DS.canFreeze(DS.selection())) {
          const e = document.getElementById('dataset-version-error');
          if (e) e.textContent = '所选样本都完成并确认人工标注后，才能冻结版本';
          else A.toast('所选样本都完成并确认人工标注后，才能冻结版本');
          return false;
        }
        return freeze.apply(DS, arguments);
      };
      const render = DS.render;
      DS.render = function () {
        let html = render.apply(DS, arguments);
        html = html
          .replace(
            /<label><span>评测类型<\/span><select aria-label="数据集评测类型">[\s\S]*?<\/select><\/label>/,
            '',
          )
          .replace(/<label><span>人工标签<\/span><select[\s\S]*?<\/select><\/label>/, '')
          .replace(/<details class="or-dataset-explanation">[\s\S]*?<\/details>/, '')
          .replace(/<div class="rt-tag-entry">[\s\S]*?<\/div>/, '')
          .replace(
            /<button type="button" class="btn" onclick="App\.evaluationDatasets\.tagsForm\(\)">批量标签<\/button>/,
            '',
          )
          .replace(/<span class="custom">[\s\S]*?<\/span>/g, '')
          .replaceAll(' · 安全合规', '')
          .replaceAll(' · 攻击对抗', '')
          .replaceAll('训练标注', '人工标注');
        const selected = DS.selection(),
          ready = DS.canFreeze(selected);
        return html
          .replace(
            'onclick="App.evaluationDatasets.versionForm()">冻结版本</button>',
            'onclick="App.evaluationDatasets.versionForm()" ' +
              (ready ? '' : 'disabled title="所选样本均完成人工标注后可冻结"') +
              '>冻结版本</button>',
          )
          .replace(
            /<span>已选 \d+ 条<\/span>/,
            '<span>已选 ' +
              selected.length +
              ' 条 · ' +
              selected.filter((r) => !DS.annotation(r).reviewed).length +
              ' 条待标注</span>',
          );
      };
      DS.tagsForm = function () {
        return A.toast('人工标签已移除，请使用样本人工标注');
      };
    }

    // 草稿箱渲染与“继续配置”已统一在 evaluation-center 的 V.draftBoxHTML + demo.resumeDraft，
  })();
};
