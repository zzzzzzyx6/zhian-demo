/* core/data-display。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/data-display'] = function () {
  /* Shared presentation primitives. Values always come from the owning product. */
  (function () {
    'use strict';
    const A = window.App,
      E = A.escape;
    const D = (A.dataDisplay = {
      colors: {
        blue: '#4779b5',
        teal: '#348875',
        amber: '#d59a38',
        red: '#c45568',
        gray: '#a6b2c1',
        violet: '#6d70b2',
        slate: '#95a5c3',
      },
    });
    // 图表语义色板：判定、严重度、资产类型的唯一颜色来源，各模块引用这里而不是自写色值。
    D.verdict = {
      Safe: D.colors.teal,
      Controversial: D.colors.amber,
      Unsafe: D.colors.red,
      Unknown: D.colors.gray,
    };
    D.severity = {
      critical: '#b42335',
      high: '#ed8a24',
      medium: '#edca51',
      low: '#6c9fca',
      info: '#9aa9bb',
      unknown: '#b8c3d1',
    };
    D.kinds = {
      applications: D.colors.blue,
      models: D.colors.violet,
      code: D.colors.teal,
      packages: D.colors.slate,
      web: D.colors.amber,
    };
    D.states = [
      ['running', '进行中', D.colors.blue],
      ['done', '已完成', D.colors.teal],
      ['error', '执行异常', '#d76a42'],
      ['stopped', '已终止', D.colors.amber],
      ['pending', '待执行', D.colors.gray],
    ];
    D.counts = (tasks) =>
      D.states.map(([id, label, color]) => ({
        id,
        label,
        color,
        value: tasks.filter(
          (t) => (D.states.some((s) => s[0] === t.status) ? t.status : 'pending') === id,
        ).length,
      }));
    D.ring = function (rows, { value, label, description = '', className = '' } = {}) {
      const total = rows.reduce((n, r) => n + Math.max(0, Number(r.value) || 0), 0);
      let offset = 0;
      const arcs = rows
        .filter((r) => r.value > 0)
        .map((r) => {
          const size = (r.value / total) * 100,
            html = `<circle cx="90" cy="90" r="72" pathLength="100" fill="none" stroke="${r.color}" stroke-width="17" stroke-dasharray="${size} ${100 - size}" stroke-dashoffset="${-offset}" transform="rotate(-90 90 90)"><title>${E(r.label)}：${r.value}</title></circle>`;
          offset += size;
          return html;
        })
        .join('');
      return `<div class="ds-ring ${className}" role="img" aria-label="${E((description || label) + '：' + rows.map((r) => r.label + ' ' + r.value).join('，'))}"><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="72" fill="none" stroke="#edf1f6" stroke-width="17"/>${arcs}</svg><div><strong>${E(value ?? total)}</strong><span>${E(label || '总数')}</span></div></div>`;
    };
    D.legend = (rows, action) =>
      `<div class="ds-legend">${rows
        .map((r) => {
          const content = `<i style="background:${r.color}"></i><span>${E(r.label)}</span><strong>${r.value}</strong>`;
          return action
            ? `<button type="button" onclick="${action(r)}">${content}</button>`
            : `<div>${content}</div>`;
        })
        .join('')}</div>`;
    D.facts = (rows) =>
      `<dl class="ds-facts">${rows.map(([label, value]) => `<div><dt>${E(label)}</dt><dd>${E(value)}</dd></div>`).join('')}</dl>`;
    // 共享原语：空状态、卡片、表格空行。新代码复用这里，不再手写同构模板。
    D.empty = (text, hint = '') =>
      `<div class="empty">${A.icon('box', 26)}<p>${E(text)}</p>${hint ? `<p class="hint">${E(hint)}</p>` : ''}</div>`;
    D.card = (title, body, actions = '') =>
      `<section class="card">${title ? `<div class="card-head"><h3 class="card-title">${title}</h3>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>` : ''}<div class="card-body">${body}</div></section>`;
    D.emptyRow = (colspan, text) =>
      `<tr><td class="empty" colspan="${E(String(colspan))}">${E(text)}</td></tr>`;
    D.progress = function (done, total, state = 'running') {
      const pct = total ? Math.max(0, Math.min(100, Math.round((done / total) * 100))) : 0,
        tone = D.states.find((s) => s[0] === state)?.[2] || D.colors.blue;
      return `<span class="ds-progress is-${A.escape(state)}" style="--progress-color:${tone}" role="progressbar" aria-label="已处理 ${done} / ${total}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><span><i style="width:${pct}%"></i></span><b>${done} / ${total}</b></span>`;
    };
    D.table = function (columns, rows, empty = '暂无匹配记录', className = '') {
      return `<div class="table-wrap ds-table-wrap"><table class="ds-table ${className}"><thead><tr>${columns.map((c) => `<th scope="col" class="${c.number ? 'ds-number' : ''}">${E(c.label)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${columns.map((c) => `<td class="${c.number ? 'ds-number' : ''} ${c.className || ''}">${c.cell(r)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${columns.length}" class="empty">${E(empty)}</td></tr>`}</tbody></table></div>`;
    };
  })();
};
