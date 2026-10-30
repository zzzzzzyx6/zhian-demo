/* scan/scan-product。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['scan/scan-product'] = function () {
  /* A self-contained scan demo. No network request or real scanner is invoked. */
  (function () {
    'use strict';
    const A = window.App,
      E = A.escape;
    const copy = (v) => JSON.parse(JSON.stringify(v)),
      list = (v) => (Array.isArray(v) ? v : []);
    const types = [
      ['code-scan', '代码安全'],
      ['app-scan', '应用安全'],
      ['web-scan', 'Web 安全'],
    ];
    const stages = ['资产画像', '环境检查', '候选发现', '自动验证', '报告生成'];
    const final = new Set(['done', 'stopped', 'error']);
    const now = () => {
      const d = new Date(),
        p = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    };
    const severity = (v) =>
      ({ critical: '严重', high: '高危', medium: '中危', low: '低危', info: '提示' })[v] ||
      '未分级';
    const tone = (v) =>
      ['critical', 'high'].includes(v) ? 'red' : v === 'medium' ? 'orange' : 'blue';
    const fixture = {
      'code-scan': [
        {
          id: 'SCAN-F-CODE-001',
          severity: 'critical',
          title: '动态代码执行缺少隔离边界',
          category: '代码注入',
          cwe: 'CWE-94',
          location:
            'OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py:321',
          file: 'external_power_tools.py',
          line: 321,
          description: '样例代码通过 exec() 执行动态构造的内容，执行边界需要限制。',
          evidence: '321  exec(code, exec_globals)',
          impact: '若不可信内容可进入执行参数，可能导致非预期代码执行。',
          recommendation:
            '优先使用显式操作白名单与结构化解析；需要执行动态逻辑时，使用隔离环境、资源限制及最小权限。',
          source: '原漏洞扫描 demo 预置记录',
          verification: '样例已保存自动验证结论',
          status: 'open',
        },
      ],
      'app-scan': [
        {
          id: 'SCAN-F-APP-001',
          severity: 'high',
          title: '异常响应包含内部服务信息',
          category: '信息暴露',
          cwe: 'CWE-209',
          location: '智能客服 API · 错误响应',
          description: '预置样例的错误响应包含内部服务路径与堆栈信息。',
          evidence: 'HTTP 500 · error.detail 包含内部组件路径（示例）',
          impact: '内部实现信息可能为后续攻击提供线索。',
          recommendation: '统一对外错误码与错误消息，详细诊断信息仅保存在受控日志中。',
          source: '应用安全预置样例',
          verification: '样例已保存自动响应检查结论',
          status: 'open',
        },
      ],
      'web-scan': [
        {
          id: 'SCAN-F-WEB-001',
          severity: 'medium',
          title: '页面缺少内容安全策略',
          category: '安全配置',
          cwe: 'CWE-693',
          location: 'https://portal.example.com/ · HTTP 响应头',
          description: '预置页面的响应头未配置 Content-Security-Policy。',
          evidence: 'Content-Security-Policy: 未设置（示例）',
          impact: '浏览器缺少资源加载限制，降低对脚本注入风险的纵深防护能力。',
          recommendation: '结合应用资源清单配置 CSP，先使用报告模式验证，再逐步实施强制策略。',
          source: 'Web 安全预置样例',
          verification: '样例已保存自动响应头检查结论',
          status: 'open',
        },
      ],
    };
    const S = (A.scanProduct = {
      selected: null,
      tab: 'code-scan',
      query: '',
      filter: 'all',
      draft: null,
      timer: null,
    });
    S.typeName = (id) => types.find((t) => t[0] === id)?.[1] || '漏洞扫描';
    S.status = (t) =>
      A.badge(
        {
          running: '进行中',
          paused: '已暂停',
          done: '已完成',
          stopped: '已结束',
          error: '执行异常',
        }[t.status] || '待执行',
        { running: 'blue', paused: 'orange', done: 'green', stopped: 'gray', error: 'red' }[
          t.status
        ] || 'gray',
      );
    S.metrics = (t) => ({
      total: stages.length,
      done: Math.min(stages.length, t.completedSteps || 0),
      valid: t.findings?.length || 0,
      errors: t.status === 'error' ? 1 : 0,
      pct: Math.round(((t.completedSteps || 0) / stages.length) * 100),
    });
    S.init = function () {
      A.data.businessAssets = A.data.businessAssets || { code: [], web: [] };
      for (const k of ['code', 'web'])
        if (!Array.isArray(A.data.businessAssets[k])) A.data.businessAssets[k] = [];
      if (!A.data.businessAssets.scanSeeded) {
        if (!A.data.businessAssets.code.length)
          A.data.businessAssets.code.push({
            id: 'asset-code-openrt',
            name: 'OpenRT 代码',
            repository: 'OpenRT-main',
            revision: 'demo-snapshot',
            owner: '研发安全组',
            createdAt: '2026-10-10 10:00:00',
            fixtureType: 'code-scan',
          });
        if (!A.data.businessAssets.web.length)
          A.data.businessAssets.web.push({
            id: 'asset-web-portal',
            name: '企业服务门户',
            url: 'https://portal.example.com',
            owner: '业务平台组',
            createdAt: '2026-10-10 10:00:00',
            fixtureType: 'web-scan',
          });
        A.data.businessAssets.scanSeeded = true;
      }
      A.data.scanProduct = A.data.scanProduct || { tasks: [], seeded: false };
      S.db = A.data.scanProduct;
      if (!S.db.seeded) {
        const app = list(A.data.aiApplications)[0];
        S.db.tasks = [
          S.seed(
            'SCAN-CODE-001',
            'OpenRT 代码基线扫描',
            'code-scan',
            A.data.businessAssets.code[0],
            '2026-10-10 10:30:00',
          ),
          ...(app
            ? [
                S.seed(
                  'SCAN-APP-001',
                  '智能客服应用基线扫描',
                  'app-scan',
                  app,
                  '2026-10-11 09:00:00',
                ),
              ]
            : []),
          S.seed(
            'SCAN-WEB-001',
            '企业门户安全基线扫描',
            'web-scan',
            A.data.businessAssets.web[0],
            '2026-10-11 11:00:00',
          ),
        ];
        S.db.seeded = true;
        A.save();
      }
      if (!S.timer && typeof setInterval === 'function') {
        S.timer = setInterval(() => S.tick(), 2800);
        S.timer?.unref?.();
      }
      return S;
    };
    S.seed = function (id, name, type, asset, created) {
      return {
        id,
        name,
        type,
        evaluationType: 'scan',
        targetId: asset?.id || '',
        targetName: asset?.name || '演示资产',
        targetSnapshot: copy(asset || {}),
        created,
        finishedAt: created,
        status: 'done',
        completedSteps: 5,
        resultSaved: true,
        findings: copy(fixture[type]),
        config: { mode: 'standard', scope: '已登记资产', maxDepth: 3 },
        stageHistory: stages.map((label) => ({ label, result: 'done', message: '预置样例记录' })),
        simulated: true,
        resultSource: 'fixture',
      };
    };
    S.tasks = function (includeDeleted = false) {
      if (!S.db) S.init();
      return S.db.tasks.filter((t) => includeDeleted || !t.deletedAt);
    };
    S.assets = function (type = S.tab) {
      if (type === 'app-scan') return list(A.data.aiApplications);
      return list(A.data.businessAssets?.[type === 'web-scan' ? 'web' : 'code']);
    };
    S.open = function (id) {
      const t = S.tasks().find((t) => t.id === id);
      if (!t) {
        A.toast('扫描任务不存在或已删除');
        return false;
      }
      S.selected = id;
      S.tab = t.type;
      A.platform.go('scan', 'tasks', t.type, id);
      return true;
    };
    S.filterBy = function (key, value) {
      if (!['query', 'filter'].includes(key)) return;
      S[key] = value;
      A.render();
      if (key === 'query') {
        const input = document.getElementById('scan-query');
        input?.focus();
        input?.setSelectionRange?.(value.length, value.length);
      }
    };
    S.form = function () {
      const d = S.draft;
      if (!d) return;
      const assets = S.assets(d.type);
      A.modal(
        '新建' + S.typeName(d.type) + '扫描任务',
        `<form id="scan-form" onsubmit="event.preventDefault();App.scanProduct.create()"><div class="field"><label for="scan-name">任务名称 *</label><input id="scan-name" value="${E(d.name)}" maxlength="80" placeholder="如：本周安全基线扫描" oninput="App.scanProduct.draft.name=this.value"></div><div class="field"><label for="scan-asset">评估资产 *</label><select id="scan-asset" onchange="App.scanProduct.draft.targetId=this.value"><option value="">请选择${S.typeName(d.type)}资产</option>${assets.map((a) => `<option value="${E(a.id)}" ${d.targetId === a.id ? 'selected' : ''}>${E(a.name)}</option>`).join('')}</select>${assets.length ? '' : '<p class="hint">请先在资产中心登记业务资产。</p>'}</div><div class="field"><label for="scan-scope">扫描范围备注</label><input id="scan-scope" maxlength="200" placeholder="选填，如：本次发布变更范围" value="${E(d.scope)}" oninput="App.scanProduct.draft.scope=this.value"></div><div class="field"><label for="scan-mode">扫描方案</label><select id="scan-mode" onchange="App.scanProduct.draft.mode=this.value"><option value="standard" ${d.mode === 'standard' ? 'selected' : ''}>标准扫描</option><option value="focused" ${d.mode === 'focused' ? 'selected' : ''}>重点风险扫描</option></select><p class="hint">标准扫描覆盖已配置的检查项；重点风险扫描关注严重与高危问题。</p></div><p class="scan-source-note">当前使用演示流程，不会向资产发起真实扫描请求。</p><p id="scan-error" class="error-message" role="alert"></p></form>`,
        `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.scanProduct.create()">启动扫描</button>`,
      );
    };
    S.create = function () {
      const d = S.draft;
      if (!d) return false;
      const asset = S.assets(d.type).find((a) => a.id === d.targetId),
        error = !d.name.trim()
          ? '请填写任务名称。'
          : !asset
            ? '请选择已登记的评估资产。'
            : !['standard', 'focused'].includes(d.mode)
              ? '请选择有效的扫描方案。'
              : '';
      if (error) {
        document.getElementById('scan-error').textContent = error;
        return false;
      }
      const created = now(),
        id =
          'SCAN-' +
          Date.now().toString(36).toUpperCase() +
          '-' +
          Math.random().toString(36).slice(2, 5).toUpperCase(),
        t = {
          id,
          name: d.name.trim(),
          type: d.type,
          evaluationType: 'scan',
          created,
          targetId: asset.id,
          targetName: asset.name,
          targetSnapshot: copy(asset),
          status: 'running',
          completedSteps: 0,
          resultSaved: false,
          findings: [],
          stageHistory: [],
          config: { mode: d.mode, scope: d.scope.trim() || '已登记资产' },
          simulated: true,
          resultSource: 'simulation',
          fixtureType:
            asset.fixtureType ||
            (d.type === 'app-scan' && ['cs-app-service', 'cs-app-office'].includes(asset.id)
              ? 'app-scan'
              : null),
        };
      S.db.tasks.unshift(t);
      A.save();
      A.closeModal();
      S.open(id);
      return t;
    };
    S.tick = function () {
      if (!S.db) return;
      let changed = false;
      for (const t of S.tasks().filter((t) => t.status === 'running')) {
        changed = true;
        const index = t.completedSteps;
        t.completedSteps = Math.min(stages.length, index + 1);
        t.stageHistory.push({
          label: stages[index],
          result: 'done',
          message:
            index === 0
              ? '已读取资产快照'
              : index === 1
                ? '演示执行环境就绪'
                : index === 2
                  ? '完成预置检查流程'
                  : index === 3
                    ? '自动验证流程完成'
                    : '结果已归档',
          time: now(),
        });
        if (t.completedSteps >= stages.length) {
          t.status = t.fixtureType ? 'done' : 'error';
          t.finishedAt = now();
          t.resultSaved = true;
          t.findings = t.fixtureType
            ? copy(fixture[t.fixtureType]).filter(
                (f) => t.config.mode !== 'focused' || ['critical', 'high'].includes(f.severity),
              )
            : [];
          if (!t.fixtureType) {
            t.error = '该资产尚未连接真实扫描执行器，没有可用漏洞判定。';
            t.stageHistory.at(-1).result = 'error';
            t.stageHistory.at(-1).message = t.error;
          }
        }
      }
      if (changed) {
        A.save();
        const p = A.platform?.state;
        if (
          !document.getElementById('modal')?.classList.contains('open') &&
          ['scan', 'exercise', 'workspace', 'risk'].includes(p?.section)
        )
          A.render();
      }
      return changed;
    };
    S.action = function (id, action, confirmed = false) {
      const t = S.tasks().find((t) => t.id === id);
      if (!t) return false;
      if (action === 'toggle' && ['running', 'paused'].includes(t.status)) {
        t.status = t.status === 'running' ? 'paused' : 'running';
        A.save();
        A.render();
        return true;
      }
      if (action === 'stop' && ['running', 'paused'].includes(t.status)) {
        if (!confirmed) {
          A.modal(
            '结束扫描任务',
            `<p>结束“${E(t.name)}”并保留已执行的阶段记录。</p>`,
            `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" data-task="${E(id)}" onclick="App.scanProduct.action(this.dataset.task,'stop',true)">结束任务</button>`,
          );
          return false;
        }
        t.status = 'stopped';
        t.finishedAt = now();
        t.resultSaved = t.completedSteps > 0;
        A.save();
        A.closeModal();
        A.render();
        return true;
      }
      if (action === 'delete') {
        if (!final.has(t.status)) {
          A.toast('请先结束任务，再删除任务记录。');
          return false;
        }
        if (!confirmed) {
          A.modal(
            '删除扫描任务',
            `<p>确定删除“${E(t.name)}”？删除后不可恢复。</p>`,
            `<button class="btn" onclick="App.closeModal()">取消</button><button class="entry-delete" data-task="${E(id)}" onclick="App.scanProduct.action(this.dataset.task,'delete',true)" aria-label="确认删除" title="确认删除" type="button">删除</button>`,
          );
          return false;
        }
        t.deletedAt = now();
        if (S.selected === id) S.selected = null;
        A.save();
        A.closeModal();
        A.render();
        return true;
      }
      return false;
    };

    S.reportHTML = function (id) {
      const t = S.tasks().find((t) => t.id === id),
        m = t && S.metrics(t);
      if (!t || !final.has(t.status) || !t.resultSaved)
        return A.heading('', '扫描报告', '任务结束且保存结果后生成报告。');
      return (
        A.heading(
          '',
          t.name + ' · 扫描报告',
          '任务创建时间：' + t.created,
          `<button class="btn" data-task="${E(t.id)}" onclick="App.scanProduct.open(this.dataset.task)">来源任务</button><button class="btn primary" data-task="${E(t.id)}" onclick="App.scanProduct.exportReport(this.dataset.task)">导出报告</button>`,
          'scan/reports',
        ) +
        `<article class="card scan-full-report"><h2>${S.typeName(t.type)}扫描报告</h2><p>评估资产：${E(t.targetName)} · 扫描方案：${t.config.mode === 'focused' ? '重点风险扫描' : '标准扫描'}</p><p>执行结果：${E({ done: '已完成', stopped: '已结束', error: '执行异常' }[t.status])} · 已完成 ${m.done} / ${m.total} 个阶段</p><p class="scan-source-note">结果来源：${t.resultSource === 'fixture' ? '预置样例' : '演示流程'}。${t.status === 'done' ? '结论仅覆盖本次演示范围。' : '当前仅保存部分执行记录，不形成完整安全结论。'}</p>${t.error ? `<p class="ec-partial-note">${E(t.error)}</p>` : ''}<h3>风险分布</h3><div class="scan-severity-grid">${['critical', 'high', 'medium', 'low'].map((level) => `<div><span>${severity(level)}</span><strong>${t.findings.filter((f) => f.severity === level).length}</strong></div>`).join('')}</div><h3>漏洞发现与修复建议</h3>${t.findings.map((f) => `<section class="scan-report-finding"><h4>${A.badge(severity(f.severity), tone(f.severity))}${E(f.title)}</h4><p><strong>定位：</strong>${E(f.location)}</p><p>${E(f.description)}</p><pre>${E(f.evidence)}</pre><p><strong>修复建议：</strong>${E(f.recommendation)}</p></section>`).join('') || '<p>暂无已保存的漏洞发现。</p>'}<details><summary>执行阶段记录</summary><ol>${t.stageHistory.map((row) => `<li>${E(row.label)}：${E(row.message)}</li>`).join('')}</ol></details></article>`
      );
    };
    S.exportReport = function (id) {
      const t = S.tasks().find((t) => t.id === id);
      if (!t || !final.has(t.status) || !t.resultSaved) return false;
      const html = S.reportHTML(id).replace(/<button[\s\S]*?<\/button>/g, '');
      A.download(
        t.name.replace(/[\\/:*?"<>|]/g, '_') + '-扫描报告.html',
        '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>' +
          E(t.name) +
          '</title><style>body{font:15px/1.8 Arial,sans-serif;color:#26364c;padding:30px;max-width:1000px;margin:auto}section{padding:16px 0;border-bottom:1px solid #ddd}pre{white-space:pre-wrap;padding:12px;background:#f3f5f8}.scan-severity-grid{display:flex;gap:24px}.scan-severity-grid strong{margin-left:8px}</style><body>' +
          html +
          '</body></html>',
        'text/html;charset=utf-8',
      );
      return true;
    };
  })();
};
