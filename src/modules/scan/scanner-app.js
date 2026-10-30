/* scan/scanner-app。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['scan/scanner-app'] = function () {
  /* 扫描器（漏洞检测控制台）：平台的「安全扫描」栏目直接挂载这一段，
   * 不再是独立页面，也不再有自己的地址栏路由。
   *
   * 由 web_console/frontend 的 React 视图翻译为原生 JS，数据只读
   * src/data/scan-data.js（window.DEMO_DATA），不依赖任何后端。
   *
   * 对外接口（由 src/modules/scan.js 调用）：
   *   window.ScanApp.mount()     把当前路由渲染进 #scan-app
   *   window.ScanApp.navigate(r) 切到扫描器内部路由（'/'、'/targets'、'/scan/code' …）
   */
  (function () {
    'use strict';

    var D = window.DEMO_DATA;
    if (!D) {
      console.warn('扫描器缺少数据文件 src/data/scan-data.js（window.DEMO_DATA）');
      return;
    }

    // ---------------------------------------------------------------- icons
    var PATHS = {
      dashboard:
        '<rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="9" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="13" width="5" height="1" rx="0.5"/>',
      project:
        '<path d="M2 4.5C2 3.7 2.7 3 3.5 3h2.7l1.4 1.5h4.9c.8 0 1.5.7 1.5 1.5v6.5c0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5v-8z"/>',
      scan: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/><path d="M5 7h4"/><path d="M7 5v4"/>',
      job: '<rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M5 6.5h6"/><path d="M5 9.5h4"/>',
      model:
        '<circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/>',
      settings:
        '<circle cx="8" cy="8" r="2"/><path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15M3.05 3.05l1.77 1.77M11.18 11.18l1.77 1.77M3.05 12.95l1.77-1.77M11.18 4.82l1.77-1.77"/>',
      logout:
        '<path d="M9 3H3.5c-.8 0-1.5.7-1.5 1.5v7c0 .8.7 1.5 1.5 1.5H9"/><path d="M11 5l3 3-3 3"/><path d="M14 8H6"/>',
      plus: '<path d="M8 3v10M3 8h10"/>',
      play: '<path d="M4 3l9 5-9 5z"/>',
      stop: '<rect x="4" y="4" width="8" height="8" rx="1"/>',
      chevron: '<path d="M6 4l4 4-4 4"/>',
      chevronDown: '<path d="M4 6l4 4 4-4"/>',
      check: '<path d="M3 8.5l3.2 3L13 4.5"/>',
      x: '<path d="M4 4l8 8M12 4l-8 8"/>',
      file: '<path d="M4 2h5l3 3v9H4z"/><path d="M9 2v3h3"/>',
      folder:
        '<path d="M2 4.5C2 3.7 2.7 3 3.5 3h2.7l1.4 1.5h4.9c.8 0 1.5.7 1.5 1.5v6.5c0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5v-8z"/>',
      download: '<path d="M8 2v8M5 7l3 3 3-3M3 12h10"/>',
      upload: '<path d="M8 12V4M5 7l3-3 3 3M3 12h10"/>',
      search: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>',
      bell: '<path d="M4 11V7a4 4 0 018 0v4l1.5 1.5h-11z"/><path d="M6.5 13.5a1.5 1.5 0 003 0"/>',
      log: '<path d="M2 4h12M2 8h12M2 12h8"/>',
      alert: '<path d="M8 2l6.5 11.5h-13z"/><path d="M8 6v3.5M8 11.5v.5"/>',
      shield: '<path d="M8 2l5 2v4c0 3.3-2.2 5.4-5 6-2.8-.6-5-2.7-5-6V4l5-2z"/>',
      bug: '<circle cx="8" cy="9" r="3.5"/><path d="M8 5.5V4M5.5 4l-1-1M10.5 4l1-1M3.5 9H2M12.5 9H14M4.5 12L3 13.5M11.5 12L13 13.5"/>',
      code: '<path d="M5 5L2 8l3 3M11 5l3 3-3 3M9 3l-2 10"/>',
      network:
        '<circle cx="3" cy="8" r="1.5"/><circle cx="13" cy="4" r="1.5"/><circle cx="13" cy="12" r="1.5"/><path d="M4.3 7.3L11.7 4.7M4.3 8.7L11.7 11.3"/>',
      list: '<circle cx="3" cy="4" r=".8"/><circle cx="3" cy="8" r=".8"/><circle cx="3" cy="12" r=".8"/><path d="M6 4h8M6 8h8M6 12h6"/>',
      refresh:
        '<path d="M13 4v3h-3"/><path d="M13 7A5 5 0 003 8"/><path d="M3 12v-3h3"/><path d="M3 9a5 5 0 0010-1"/>',
      eye: '<path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z"/><circle cx="8" cy="8" r="2"/>',
      copy: '<rect x="3" y="3" width="7" height="9" rx="1"/><path d="M6 6h7v7"/>',
      history:
        '<path d="M2 8a6 6 0 1 0 1.8-4.3"/><path d="M2 2v3.5h3.5"/><path d="M8 5v3.5l2.5 1.5"/>',
      trash:
        '<path d="M3 4h10"/><path d="M6 4V2.8h4V4"/><path d="M5 6v7M8 6v7M11 6v7"/><path d="M4 4l.6 10h6.8L12 4"/>',
      info: '<circle cx="8" cy="8" r="6"/><path d="M8 5v.5M8 7v4"/>',
      home: '<path d="M8 2L2.5 6.5V13.5H13.5V6.5L8 2z"/><path d="M6.6 13.5V10.2h2.8v3.3"/>',
      edit: '<path d="M8 13.3h6"/><path d="M11 2.3a1.4 1.4 0 0 1 2 2L4.7 12.7l-2.7.6.6-2.7Z"/>',
      zap: '<path d="M8.7 1.3L2.7 9.3h4L6 14.6l6-8h-4l.7-5.3Z"/>',
      box: '<path d="M8 1.2 1.8 4.3v7.4L8 14.8l6.2-3.1V4.3L8 1.2ZM1.8 4.3 8 7.4l6.2-3.1M8 7.4v7.4"/>',
      wrench:
        '<path d="M11.9 1.3a3.7 3.7 0 0 0-2.8 5.5L2 13.9l1.1 1.1 1-1 .9.9 1.1-1.1-1-1 4.8-4.8a3.7 3.7 0 0 0 4.6-4.9l-2 2-1.7-.5-.5-1.7 2-2a3.7 3.7 0 0 0-1.4-.6z"/>',
    };

    function icon(name, size, cls) {
      var p = PATHS[name];
      if (!p) return '';
      return (
        '<svg width="' +
        (size || 16) +
        '" height="' +
        (size || 16) +
        '" viewBox="0 0 16 16" fill="none"' +
        ' stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"' +
        ' class="' +
        (cls || '') +
        '" style="flex-shrink:0">' +
        p +
        '</svg>'
      );
    }

    // ------------------------------------------------------------- format.ts
    function fmtRelTime(ts) {
      if (!ts) return '—';
      var now = Math.floor(Date.now() / 1000);
      // 时间戳可能是小数，也可能因为演示数据落在未来；一律取整并按「刚刚」处理未来时间。
      var diff = Math.floor(now - Number(ts));
      if (!Number.isFinite(diff)) return '—';
      if (diff < 0) return '刚刚';
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
      var pad = function (n) {
        return String(n).padStart(2, '0');
      };
      return (
        d.getFullYear() +
        '-' +
        pad(d.getMonth() + 1) +
        '-' +
        pad(d.getDate()) +
        ' ' +
        pad(d.getHours()) +
        ':' +
        pad(d.getMinutes())
      );
    }
    function fmtBytes(size) {
      if (!size) return '0 B';
      var units = ['B', 'KB', 'MB', 'GB'];
      var value = size,
        index = 0;
      while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
      }
      return value.toFixed(index ? 1 : 0) + ' ' + units[index];
    }
    function sevColor(s) {
      return (
        {
          critical: 'b-critical',
          high: 'b-high',
          medium: 'b-medium',
          low: 'b-low',
          info: 'b-info',
        }[s] || 'b-info'
      );
    }
    function statusBadge(s) {
      return (
        {
          running: 'b-brand',
          succeeded: 'b-ok',
          failed: 'b-critical',
          stopping: 'b-medium',
          queued: 'b-info',
          idle: 'b-info',
          confirmed: 'b-ok',
          rejected: 'b-info',
          suggested: 'b-low',
          patched: 'b-ok',
          passed: 'b-ok',
        }[s] || 'b-info'
      );
    }

    // --------------------------------------------------------------- helpers
    function esc(v) {
      return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    function asArray(v) {
      return Array.isArray(v) ? v : [];
    }
    function ensureObj(v) {
      return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    }
    function num(v) {
      var n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }

    var CAND_STATUS_LABEL = {
      pending: '待验证',
      probing: '验证中',
      rejected: '已排除漏洞',
      promoted: '已确认漏洞',
    };
    // 分类元信息：CWE 编号 + 中文名（漏洞表分类列统一显示「CWE-94 代码注入」样式，所有状态通用）
    var CATEGORY_META = {
      'Code Injection': { cwe: 'CWE-94', label: '代码注入' },
      'Command Injection': { cwe: 'CWE-78', label: '命令注入' },
      'SQL Injection': { cwe: 'CWE-89', label: 'SQL 注入' },
      'Cross-Site Scripting': { cwe: 'CWE-79', label: '跨站脚本' },
      'Path Traversal': { cwe: 'CWE-22', label: '路径遍历' },
      'Crypto Weakness': { cwe: 'CWE-327', label: '加密算法缺陷' },
      'Hardcoded Credentials': { cwe: 'CWE-798', label: '硬编码凭据' },
      'Insecure Deserialization': { cwe: 'CWE-502', label: '不安全反序列化' },
      SSRF: { cwe: 'CWE-918', label: '服务端请求伪造' },
    };
    // 分类列文案：优先用条目自带 cwe，否则查映射；无映射回退原文
    function cweLabel(cat, cwe) {
      var meta = CATEGORY_META[cat];
      if (!meta) return cat || '—';
      return (cwe || meta.cwe) + ' ' + meta.label;
    }
    var CAND_STATUS_BADGE = {
      pending: 'b-medium',
      probing: 'b-brand',
      rejected: 'b-medium',
      promoted: 'b-ok',
    };

    function validationStatusLabel(status) {
      var s = String(status || '').toLowerCase();
      var map = {
        succeeded: '已确认漏洞',
        confirmed: '已确认漏洞',
        passed: '已通过',
        rejected: '已排除漏洞',
        rejected_or_inconclusive: '已排除漏洞',
        inconclusive: '已排除漏洞',
        failed: '失败',
      };
      return map[s] || status || '未知';
    }
    function validationStatusBadge(status) {
      var s = String(status || '').toLowerCase();
      if (['succeeded', 'confirmed', 'passed'].indexOf(s) !== -1) return 'b-ok';
      if (['rejected', 'rejected_or_inconclusive', 'inconclusive'].indexOf(s) !== -1)
        return 'b-medium';
      if (s === 'failed') return 'b-critical';
      return statusBadge(status);
    }

    // 演示环境提示：所有写操作（删除/还原/新建/测试连通）都不请求后端。
    // 提示统一走平台的全局 toast（平台已提供 #toast，扫描器不再自己建一个）。
    function demoToast(msg) {
      if (window.App && typeof window.App.toast === 'function') return window.App.toast(msg);
      console.info(msg);
    }

    // ------------------------------------------------------------- export.ts
    function downloadFile(filename, content, mime) {
      var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 0);
    }
    function slug(value) {
      return (
        String(value || 'export')
          .replace(/[^\p{L}\p{N}._-]+/gu, '_')
          .replace(/^_+|_+$/g, '')
          .slice(0, 80) || 'export'
      );
    }
    function diffText(patchDiff) {
      return (patchDiff || [])
        .map(function (row) {
          return typeof row === 'string' ? row : (row && row.text) || '';
        })
        .join('\n');
    }
    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {},
          function () {
            fallbackCopy(text);
          },
        );
      } else {
        fallbackCopy(text);
      }
    }
    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(ta);
      }
    }
    function printReport() {
      document.body.classList.add('printing-report');
      var cleanup = function () {
        document.body.classList.remove('printing-report');
        window.removeEventListener('afterprint', cleanup);
      };
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
      if (typeof f.confidence === 'number')
        lines.push('- 置信度: ' + (f.confidence * 100).toFixed(0) + '%');
      if (f.status) lines.push('- 状态: ' + f.status);
      lines.push('');
      if (f.description) lines.push('## 描述', '', f.description, '');
      if (f.impact) lines.push('## 潜在影响', '', f.impact, '');
      if (f.recommendation) lines.push('## 修复建议', '', f.recommendation, '');
      var code = (f.code_snippet || [])
        .map(function (r) {
          return r.text;
        })
        .join('\n');
      if (code.trim()) lines.push('## 问题代码', '', '```', code, '```', '');
      var diff = diffText(f.patch_diff);
      if (diff.trim()) lines.push('## 建议 Patch', '', '```', diff, '```', '');
      return lines.join('\n');
    }
    // 严重度统计统一由 findings 现算：概览环图 / 屏幕报告 / 打印文档 / Markdown 导出四处同源，避免与快照字段漂移。
    function sevFromFindings(findings) {
      var sev = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
      (findings || []).forEach(function (f) {
        if (sev[f.severity] != null) sev[f.severity]++;
      });
      return sev;
    }

    // 报告 tab 可视化：严重度环图（与 findings 同源）
    function severityDonutCard(sev, patchesCount) {
      var order = ['critical', 'high', 'medium', 'low'];
      var zh = { critical: '严重', high: '高危', medium: '中等', low: '低危' };
      var colors = {
        critical: 'var(--sig-critical)',
        high: 'var(--sig-high)',
        medium: 'var(--sig-medium)',
        low: 'var(--sig-low)',
      };
      var rows = order.map(function (k) {
        return { k: k, label: zh[k], count: sev[k] || 0, color: colors[k] };
      });
      var total = rows.reduce(function (s, r) {
        return s + r.count;
      }, 0);
      var CX = 60,
        CY = 60,
        R_OUT = 54,
        R_IN = 38,
        TAU = Math.PI * 2;
      var startAngle = -Math.PI / 2;
      var segs = '';
      if (total > 0) {
        rows.forEach(function (r) {
          if (!r.count) return;
          var frac = r.count / total;
          var a0 = startAngle,
            a1 = startAngle + frac * TAU;
          if (frac > 0.99) {
            segs +=
              '<circle cx="' +
              CX +
              '" cy="' +
              CY +
              '" r="' +
              (R_OUT + R_IN) / 2 +
              '" fill="none" stroke="' +
              r.color +
              '" stroke-width="' +
              (R_OUT - R_IN) +
              '"></circle>';
          } else {
            var large = a1 - a0 > Math.PI ? 1 : 0;
            var x0o = CX + R_OUT * Math.cos(a0),
              y0o = CY + R_OUT * Math.sin(a0);
            var x1o = CX + R_OUT * Math.cos(a1),
              y1o = CY + R_OUT * Math.sin(a1);
            var x1i = CX + R_IN * Math.cos(a1),
              y1i = CY + R_IN * Math.sin(a1);
            var x0i = CX + R_IN * Math.cos(a0),
              y0i = CY + R_IN * Math.sin(a0);
            segs +=
              '<path class="sev-arc" d="M ' +
              x0o.toFixed(2) +
              ' ' +
              y0o.toFixed(2) +
              ' ' +
              'A ' +
              R_OUT +
              ' ' +
              R_OUT +
              ' 0 ' +
              large +
              ' 1 ' +
              x1o.toFixed(2) +
              ' ' +
              y1o.toFixed(2) +
              ' ' +
              'L ' +
              x1i.toFixed(2) +
              ' ' +
              y1i.toFixed(2) +
              ' ' +
              'A ' +
              R_IN +
              ' ' +
              R_IN +
              ' 0 ' +
              large +
              ' 0 ' +
              x0i.toFixed(2) +
              ' ' +
              y0i.toFixed(2) +
              ' Z" ' +
              'fill="' +
              r.color +
              '"><title>' +
              esc(r.label) +
              '：' +
              r.count +
              ' 个（' +
              Math.round(frac * 100) +
              '%）</title></path>';
          }
          startAngle = a1;
        });
      }
      var donutHtml =
        '<div class="sev-donut">' +
        '<svg viewBox="0 0 120 120" role="img" aria-label="严重度分布环状图">' +
        (total > 0
          ? segs
          : '<circle cx="60" cy="60" r="46" fill="none" stroke="var(--line)" stroke-width="16"></circle>') +
        '<text x="60" y="57" text-anchor="middle" class="sev-total">' +
        total +
        '</text>' +
        '<text x="60" y="72" text-anchor="middle" class="sev-total-label">个漏洞</text></svg>' +
        '<div class="sev-legend">' +
        rows
          .map(function (r) {
            return (
              '<div class="sev-legend-row' +
              (r.count ? '' : ' is-zero') +
              '">' +
              '<span class="sev-legend-dot" style="background:' +
              r.color +
              '"></span>' +
              '<span class="sev-legend-label">' +
              esc(r.label) +
              '</span>' +
              '<span class="mono b sev-legend-count">' +
              r.count +
              '</span></div>'
            );
          })
          .join('') +
        '<div class="sev-legend-row sev-legend-extra"><span class="sev-legend-dot" style="background:var(--sig-ok)"></span>' +
        '<span class="sev-legend-label">修复建议</span>' +
        '<span class="mono b sev-legend-count">' +
        (patchesCount || 0) +
        '</span></div>' +
        '</div></div>';
      return (
        '<div class="card"><div class="card-h"><h3>漏洞发现</h3></div>' +
        '<div class="card-b">' +
        donutHtml +
        '</div></div>'
      );
    }

    // 报告 tab 可视化：漏洞类型分布条形图
    function categoryBarsCard(findings) {
      var counts = {};
      (findings || []).forEach(function (f) {
        var k = f.category || '其他';
        counts[k] = (counts[k] || 0) + 1;
      });
      var rows = Object.keys(counts)
        .map(function (k) {
          return { label: k, count: counts[k] };
        })
        .sort(function (a, b) {
          return b.count - a.count;
        });
      var max = rows.length ? rows[0].count : 1;
      var bars = rows
        .map(function (r) {
          var pct = Math.max(6, Math.round((r.count / max) * 100));
          return (
            '<div class="cat-bar-row" title="' +
            esc(r.label) +
            '：' +
            r.count +
            ' 个">' +
            '<div class="cat-bar-label">' +
            esc(r.label) +
            '</div>' +
            '<div class="cat-bar-track"><div class="cat-bar-fill" style="width:' +
            pct +
            '%"></div></div>' +
            '<span class="mono b">' +
            r.count +
            '</span></div>'
          );
        })
        .join('');
      return (
        '<div class="card"><div class="card-h"><h3>漏洞类型分布</h3></div>' +
        '<div class="card-b">' +
        (bars || '<div class="muted sm">暂无数据</div>') +
        '</div></div>'
      );
    }

    // 检测漏斗卡（分层条形，宽度按真实比例）：候选 = 确认 + 已排除 + 待验证。
    function funnelCardHtml(findings, candidates) {
      var cands = candidates || [];
      var openN = cands.filter(function (c) {
        return c.status === 'pending' || c.status === 'probing';
      }).length;
      var rejectedN = cands.filter(function (c) {
        return c.status === 'rejected';
      }).length;
      var maxN = Math.max(cands.length, 1);
      var steps = [
        { label: '候选', value: cands.length, color: 'var(--brand)', dashed: false },
        {
          label: '确认漏洞',
          value: (findings || []).length,
          color: 'var(--sig-critical)',
          dashed: false,
        },
        { label: '已排除', value: rejectedN, color: 'var(--text-faint)', dashed: false },
        { label: '待验证', value: openN, color: 'transparent', dashed: true },
      ];
      var rows = steps
        .map(function (s) {
          var w = Math.max(8, Math.round((s.value / maxN) * 100));
          var style = s.dashed
            ? 'width:' +
              w +
              '%;background:transparent;border:1px dashed var(--text-faint);color:var(--text-muted)'
            : 'width:' + w + '%;background:' + s.color;
          return (
            '<div class="funnel-row"><div class="funnel-bar" style="' +
            style +
            '">' +
            '<span>' +
            esc(s.label) +
            '</span><b>' +
            s.value +
            '</b></div></div>'
          );
        })
        .join('');
      return (
        '<div class="card"><div class="card-h"><h3>检测漏斗</h3></div><div class="card-b"><div class="funnel-vis">' +
        rows +
        '</div></div></div>'
      );
    }

    // ------------------------------------------------------------- report  // ------------------------------------------------------------- report  // ------------------------------------------------------------- report
    function ReportFinding(f, idx, secNo) {
      var snippet = (f.code_snippet || [])
        .map(function (row) {
          return (
            '<div class="' +
            (row.highlight ? 'lh' : '') +
            '"><span class="ln">' +
            esc(row.ln) +
            '</span>' +
            esc(row.text) +
            '</div>'
          );
        })
        .join('');
      return (
        '<section style="margin-top:22px;padding:16px 18px;border:1px solid var(--line);border-radius:8px;background:var(--bg-sunken)">' +
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
        '<span class="mono b" style="color:var(--text-muted);font-size:13px">' +
        secNo +
        '.' +
        idx +
        '</span>' +
        '<span class="badge ' +
        sevColor(f.severity) +
        '">' +
        esc(f.severity) +
        '</span>' +
        '<span class="muted xs mono">' +
        esc(f.id) +
        '</span><span class="muted xs">·</span>' +
        '<span class="muted xs mono">' +
        esc(f.cwe) +
        '</span><span class="spacer"></span>' +
        '<span class="muted xs">置信度 <span class="b mono brand-text">' +
        (f.confidence * 100).toFixed(0) +
        '%</span></span>' +
        '</div>' +
        '<h3 style="margin:0 0 8px;color:var(--text)">' +
        esc(f.title) +
        '</h3>' +
        (f.file !== '—'
          ? '<div class="loc" style="margin-bottom:10px">' +
            icon('file', 11) +
            ' <span class="mono">' +
            esc(f.file) +
            ':' +
            esc(f.line) +
            '</span></div>'
          : '') +
        '<p style="margin-top:8px"><b>描述：</b>' +
        esc(f.description) +
        '</p>' +
        (f.impact ? '<p><b>影响：</b>' + esc(f.impact) + '</p>' : '') +
        (f.recommendation
          ? '<p><b>建议：</b><span style="white-space:pre-line">' +
            esc(f.recommendation) +
            '</span></p>'
          : '') +
        (snippet ? '<pre class="code" style="margin-top:10px">' + snippet + '</pre>' : '') +
        '</section>'
      );
    }

    // 报告 tab：结果可视化预览（KPI + 严重度环图 + 类型分布 + 检测漏斗）；文档仅在导出时生成（header 常驻）。
    function ReportDoc(project, findings, probes, patches, sorted) {
      var sev = project.severity || {};
      var critical = findings.filter(function (f) {
        return f.severity === 'critical';
      });
      var high = findings.filter(function (f) {
        return f.severity === 'high';
      });
      var blockquote =
        critical.length || high.length
          ? '<blockquote><b>需要立即关注：</b>' +
            critical.length +
            ' 个严重漏洞 + ' +
            high.length +
            ' 个高危漏洞。' +
            (critical[0]
              ? ' 最严重的是 <span class="mono">' +
                esc(critical[0].id) +
                '</span> — ' +
                esc(critical[0].title) +
                '。'
              : '') +
            '</blockquote>'
          : '';
      var total = findings.length;
      return (
        '<div class="report report-print">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:10px">' +
        '<div><div class="muted xs mono" style="letter-spacing:.18em;text-transform:uppercase;margin-bottom:6px">书安 安全扫描报告</div>' +
        '<h1>' +
        esc(project.name) +
        '</h1>' +
        '<p class="muted" style="margin:6px 0 0;font-size:14px">' +
        esc(project.description) +
        '</p></div>' +
        '</div>' +
        '<div class="report-meta">' +
        '<div><div class="m-label">扫描 ID</div><div class="m-value">' +
        esc(project.id) +
        '</div></div>' +
        '<div><div class="m-label">模式</div><div class="m-value">' +
        esc(project.phase) +
        '</div></div>' +
        '<div><div class="m-label">开始时间</div><div class="m-value">' +
        fmtAbs(project.started_at) +
        '</div></div>' +
        '<div><div class="m-label">耗时</div><div class="m-value">' +
        (project.duration ? fmtDuration(project.duration) : '进行中') +
        '</div></div>' +
        '</div>' +
        '<h2>1. 总览</h2>' +
        '<p>本次扫描在 <span class="mono brand-text">' +
        esc(project.target) +
        '</span> 上执行 <b>' +
        esc(
          sceneMode(project) +
            (project.phase_label && project.phase_label !== sceneMode(project)
              ? '（' + project.phase_label + '）'
              : ''),
        ) +
        '</b>，' +
        '共生成 <b class="mono">' +
        project.metrics.candidates +
        '</b> 个候选，沉淀 <b class="mono">' +
        project.metrics.probes +
        '</b> 条验证/环境证据，' +
        '最终确认 <b class="mono" style="color:' +
        (total ? 'var(--sig-critical)' : 'var(--text)') +
        '">' +
        total +
        '</b> 个漏洞。</p>' +
        blockquote +
        '<h3>严重度分布</h3><ul>' +
        '<li><b style="color:var(--sig-critical)">严重</b>：' +
        (sev.critical || 0) +
        ' 个 — 通常意味着可被未授权攻击者远程触发的高影响漏洞</li>' +
        '<li><b style="color:var(--sig-high)">高危</b>：' +
        (sev.high || 0) +
        ' 个 — 在特定条件下可造成较大影响</li>' +
        '<li><b style="color:var(--sig-medium)">中等</b>：' +
        (sev.medium || 0) +
        ' 个 — 通常需要满足前置条件</li>' +
        '<li><b style="color:var(--text-muted)">低危</b>：' +
        (sev.low || 0) +
        ' 个 — 信息泄露、配置不当类</li>' +
        '</ul>' +
        '<h2>2. 漏洞详情</h2>' +
        (sorted.length
          ? sorted
              .map(function (f, i) {
                return ReportFinding(f, i + 1);
              })
              .join('')
          : '<p>本次扫描未发现确认的漏洞。</p>') +
        '<h2>3. 修复建议</h2>' +
        (patches.length
          ? '<ul>' +
            patches
              .map(function (p) {
                return (
                  '<li><span class="mono brand-text">' +
                  esc(p.id) +
                  '</span> — ' +
                  esc(p.summary) +
                  '<br/>' +
                  '<span class="muted xs mono">关联 ' +
                  esc(p.finding_id) +
                  ' · ' +
                  esc(p.file) +
                  ' · ' +
                  esc(p.test_output) +
                  '</span></li>'
                );
              })
              .join('') +
            '</ul>'
          : '<p>当前扫描未生成自动修复建议。建议参考第 2 节中各漏洞的「修复建议」部分。</p>') +
        '<h2>4. 验证记录</h2>' +
        (probes.length
          ? '<p>共有 <b class="mono">' +
            probes.length +
            '</b> 条验证记录，其中 <b class="mono brand-text">' +
            probes.filter(function (p) {
              return ['confirmed', 'succeeded', 'passed'].indexOf(p.status) !== -1;
            }).length +
            '</b> 条返回确认或通过结果。详细原始记录可在“结果文件”中查看。</p>'
          : '<p>本次扫描暂无验证记录。</p>') +
        '<h2>5. 附录</h2><h3>5.1 扫描配置</h3><ul>' +
        '<li>模式：<span class="mono">' +
        esc(project.phase) +
        '</span>（' +
        esc(project.phase_label) +
        '）</li>' +
        '<li>目标：<span class="mono">' +
        esc(project.target) +
        '</span></li>' +
        '<li>大模型：' +
        esc(project.model_config || '服务器环境变量') +
        '</li>' +
        '<li>开始时间：<span class="mono">' +
        fmtAbs(project.started_at) +
        '</span></li></ul>' +
        '<h3>5.2 致谢</h3>' +
        '<p>本报告由 <b>书安 A3S</b> 智能体生成。所有漏洞均经过大模型多轮推理与运行时探针双重确认。如需复测，请到该任务页点击“重新扫描”。</p>' +
        '<div style="margin-top:48px;padding-top:18px;border-top:1px dashed var(--line);color:var(--text-faint);font-size:11.5px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">' +
        '— END OF REPORT —<br/>Generated by 书安 v2.4.0 · build a3c1f02 · ' +
        fmtAbs(project.started_at) +
        '</div>' +
        '</div>'
      );
    }

    // ----------------------------------------------------------- artifacts
    var ARTIFACT_GROUPS = [
      { id: 'report', title: '报告与总览', hint: '最终给用户看的报告、摘要和过程总览。' },
      {
        id: 'profile',
        title: '目标画像与情报',
        hint: '识别目标、版本线索、情报检索、风险关注度地图。',
      },
      {
        id: 'environment',
        title: '环境与可验证条件',
        hint: '本地环境探针、目录快照、构建/运行/隔离/清理策略。',
      },
      {
        id: 'discovery',
        title: '候选发现',
        hint: '静态候选、二进制快速种子、专长智能体候选和发现规划。',
      },
      {
        id: 'ranking',
        title: '排序与上下文包',
        hint: '候选去重、归因、优先级排序和验证上下文补全。',
      },
      {
        id: 'validation',
        title: '验证、裁决与恢复',
        hint: '验证计划、验证结果、裁决、环境恢复和最终确认漏洞集合。',
      },
      {
        id: 'remediation',
        title: '修复与缓解',
        hint: '代码补丁、无代码缓解建议、复测和整理结论。',
      },
      { id: 'logs', title: '运行日志', hint: '编排器事件、错误流、A3S 交互流水和实时调试日志。' },
      {
        id: 'a3s',
        title: 'A3S 调试材料',
        hint: '每个智能体的 prompt、response、meta、events、snapshot 和 parsed JSON。',
      },
      { id: 'errors', title: '错误诊断', hint: '阶段异常、环境错误和调试失败信息。' },
      { id: 'other', title: '其他产物', hint: '尚未归入标准流水线的辅助文件。' },
    ];

    function ReportView(project, findings, probes, patches, candidates) {
      var sev = sevFromFindings(findings);
      return (
        '<div class="stack report-dashboard" style="gap:14px">' +
        '<div class="rpt-top">' +
        severityDonutCard(sev, (patches || []).length) +
        categoryBarsCard(findings) +
        '</div>' +
        '<div id="rpt-findings">' +
        FindingMasterDetail(findings || []) +
        '</div>' +
        '</div>'
      );
    }
    function LogView(project, logLines, logSize) {
      var lines = (logLines || [])
        .map(function (l, i) {
          return (
            '<div class="l-' +
            esc(l.lvl) +
            '"><span class="l-dim">' +
            esc(l.t) +
            '</span> ' +
            '<span style="text-transform:uppercase;font-weight:600">' +
            esc(String(l.lvl).padEnd(4)) +
            '</span> ' +
            esc(l.msg) +
            '</div>'
          );
        })
        .join('');
      return (
        '<div class="card"><div class="card-h">' +
        '<div class="flex"><h3>实时日志</h3>' +
        (project.status === 'running'
          ? '<span class="status running"><span class="pulse"></span>streaming</span>'
          : '') +
        '<span class="muted xs mono">' +
        (logLines || []).length +
        ' 行 · ' +
        fmtBytes(logSize) +
        '</span></div>' +
        '<div style="display:flex;gap:8px;align-items:center">' +
        '<button class="btn sm ghost" id="btn-log-download" title="下载完整运行日志（' +
        (logLines || []).length +
        ' 行）">' +
        icon('download', 12) +
        ' 完整日志</button>' +
        '<label class="check"><input type="checkbox" id="log-autoscroll" ' +
        (STATE.logAutoscroll ? 'checked' : '') +
        '/> 自动滚动</label></div>' +
        '</div><div style="padding:0"><pre class="log" id="log-pre" style="border-radius:0;max-height:620px">' +
        lines +
        (project.status === 'running' ? '<div class="l-info" style="margin-top:6px">▌</div>' : '') +
        '</pre></div></div>'
      );
    }

    function fullLogText(project) {
      var lines = (D.logsByJob[project.id] || { lines: [] }).lines || [];
      return lines
        .map(function (l) {
          var row = ensureObj(l) || {};
          return (
            '[' +
            String(row.t || '') +
            '] [' +
            String(row.lvl || '').toUpperCase() +
            '] ' +
            String(row.msg || '')
          );
        })
        .join('\n');
    }

    // 诊断：软件内只保留“要不要下载”的判断材料；深度分析通过导出诊断包在本地进行。
    var TASK_PAGE_SIZE = 10;

    // 三类场景工作台：类目配置（路径 / 图标 / 数据源 / 空态文案）
    // 工作流阶段中文名（与原始项目 shuan_vuln/orchestrator/harness.py 的 STAGE_LABELS 对齐；
    // report 为报告生成，非技术流程，不进入运行轨道）
    var LABEL_BY_ID = {
      profile: '目标画像与情报收集',
      environment: '环境建立',
      discovery: '候选发现',
      ranking: '候选合并排序',
      validation: '漏洞验证',
      remediation: '修复或缓解',
      report: '报告生成',
    };
    var SCAN_CATEGORIES = {
      code: {
        title: '代码安全',
        icon: 'code',
        path: '/scan/code',
        desc: '代码与依赖的漏洞检测',
        hint: '本地候选 + A3S 确认',
        sources: [
          ['path', '本地路径'],
          ['archive', '代码压缩包'],
          ['files', '多文件'],
        ],
        empty: '暂无代码安全任务',
      },
      app: {
        title: '应用安全',
        icon: 'box',
        path: '/scan/app',
        desc: '二进制、固件与无代码组件的检测',
        hint: '种子候选 + 专长智能体确认',
        sources: [
          ['path', '本地路径'],
          ['archive', '应用包'],
          ['files', '多文件'],
        ],
        empty: '暂无应用安全任务',
      },
      web: {
        title: 'Web 安全',
        icon: 'network',
        path: '/scan/web',
        desc: '在线站点的安全基线检测',
        hint: '非破坏性只读探测',
        sources: [['url', '站点 URL']],
        empty: '暂无 Web 安全任务',
      },
    };

    function projectCategory(p) {
      var tt = String(p.target_type || '');
      if (tt.indexOf('Web') !== -1 || tt.indexOf('web') !== -1 || p.phase === 'web') return 'web';
      return 'code';
    }
    // 扫描模式展示名：与创建流程（通用检测/快速检测/站点基线检测）保持同一话术；
    // 后端技术标签（phase_label）通过 title 提示补充。
    function sceneMode(p) {
      var ph = String(p.phase || '');
      if (ph.indexOf('agent') === 0) return '通用检测';
      if (ph === 'web') return '站点基线检测';
      if (ph === 'detect' || ph === 'full') return '快速检测';
      return p.phase_label || ph || '—';
    }
    // 检测目标展示名：URL 去协议；路径仅保留「项目段/…/尾段」，
    // 项目段取路径中最长的一段（通常是仓库/工程目录），避免本机用户目录噪音。
    // 完整路径通过 title 与任务详情页查看。
    function shortTarget(p) {
      var t = String(p.target || '');
      if (!t) return '—';
      if (t.indexOf('http://') === 0 || t.indexOf('https://') === 0) {
        t = t.replace('http://', '').replace('https://', '');
        return t.charAt(t.length - 1) === '/' ? t.slice(0, -1) : t;
      }
      var segs = t
        .split('\\')
        .join('/')
        .split('/')
        .filter(function (s) {
          return s && s !== '.';
        });
      var GENERIC = {
        src: 1,
        lib: 1,
        bin: 1,
        dist: 1,
        app: 1,
        out: 1,
        build: 1,
        code: 1,
        www: 1,
        web: 1,
        main: 1,
        source: 1,
        tmp: 1,
      };
      var tail = segs[segs.length - 1];
      if (!tail) return t;
      if (/\.[a-z0-9]+$/i.test(tail)) return tail;
      if (!GENERIC[tail]) return tail;
      var head = segs
        .slice(0, -1)
        .filter(function (s) {
          return /[a-z]/i.test(s) && !/^[0-9\-.]+$/.test(s);
        })
        .reduce(function (a, b) {
          return b.length > a.length ? b : a;
        }, '');
      return head || tail;
    }
    // 检测目标形态图标：URL→network；归档扩展名→box；带扩展名→file；其余→folder。
    function targetIcon(p) {
      var t = String(p.target || '');
      if (t.indexOf('http://') === 0 || t.indexOf('https://') === 0) return 'network';
      var s = shortTarget(p);
      if (s === '—') return 'folder';
      var last = s.slice(s.lastIndexOf('/') + 1);
      if (/\.(zip|tar|gz|tgz|bz2|xz|7z|rar)$/i.test(last)) return 'box';
      return last.indexOf('.') !== -1 ? 'file' : 'folder';
    }

    function TaskList(visible, catIcon, emptyLabel) {
      if (!visible.length) return Empty(catIcon || 'project', emptyLabel || '暂无任务');
      var head =
        '<div class="task-head"><span>任务</span><span>扫描模式</span><span>检测目标</span><span>发现</span><span>进度</span><span>时间</span><span>操作</span></div>';
      var rows = visible
        .map(function (p) {
          var detailHref = '#/projects/' + encodeURIComponent(p.id);
          var sev = p.severity || {};
          var findingsTotal =
            (sev.critical || 0) + (sev.high || 0) + (sev.medium || 0) + (sev.low || 0);
          var findingsBadges = findingsTotal
            ? '<span class="badge b-critical">' +
              (sev.critical || 0) +
              '</span><span class="badge b-high">' +
              (sev.high || 0) +
              '</span><span class="badge b-medium">' +
              (sev.medium || 0) +
              '</span><span class="badge b-low">' +
              (sev.low || 0) +
              '</span>'
            : sev.info || 0
              ? '<span class="badge b-info">' + (sev.info || 0) + ' 提示</span>'
              : p.status === 'running'
                ? '<span class="badge b-brand">扫描中</span>'
                : '<span class="badge b-ok">无发现</span>';
          return (
            '<div class="task-row" data-goto="' +
            detailHref +
            '">' +
            '<div class="cell-task"><div class="b">' +
            esc(p.name) +
            '</div>' +
            '<span class="mode-sub" title="' +
            esc(p.phase_label || '') +
            '">' +
            esc(sceneMode(p)) +
            '</span></div>' +
            '<div class="cell-phase" title="' +
            esc(p.phase_label || '') +
            '">' +
            esc(sceneMode(p)) +
            '</div>' +
            '<div class="cell-target">' +
            icon(targetIcon(p), 14, 'target-ico') +
            (function () {
              var lt = targetForProject(p);
              var nm = esc(shortTarget(p));
              return lt
                ? '<a class="mono target-link" href="' +
                    pTargetHref(lt) +
                    '" title="' +
                    esc(p.target) +
                    '">' +
                    nm +
                    '</a>'
                : '<span class="mono" title="' + esc(p.target) + '">' + nm + '</span>';
            })() +
            '</div>' +
            '<div class="cell-findings">' +
            findingsBadges +
            '</div>' +
            (function () {
              var pr = Math.max(0, Math.min(100, Math.round(p.progress || 0)));
              var running = p.status === 'running';
              var failed = p.status === 'failed';
              var pct = running ? pr : p.status === 'succeeded' ? 100 : pr;
              var fillStyle = failed
                ? 'width:' + pct + '%;background:var(--sig-critical);box-shadow:none'
                : 'width:' + pct + '%';
              var label = running
                ? pct + '%'
                : failed
                  ? '失败'
                  : p.status === 'succeeded'
                    ? '已完成'
                    : p.status || '—';
              return (
                '<div class="cell-progress"><div class="bar-track"><div class="bar-fill" style="' +
                fillStyle +
                '"></div></div>' +
                '<span class="progress-label' +
                (failed ? ' danger' : '') +
                '">' +
                esc(label) +
                '</span></div>'
              );
            })() +
            '<div class="task-time"><span>' +
            fmtAbs(p.started_at) +
            '</span>' +
            (p.duration ? '<span class="sub">' + fmtDuration(p.duration) + '</span>' : '') +
            '</div>' +
            '<div class="task-actions"><a class="row-act" href="' +
            detailHref +
            '">详情</a><button class="row-act" data-task-md="' +
            encodeURIComponent(p.id) +
            '">导出报告</button><button class="row-act danger" data-del="' +
            encodeURIComponent(p.id) +
            '">删除</button></div>' +
            '</div>'
          );
        })
        .join('');
      return '<div class="card task-list">' + head + rows + '</div>';
    }
    function CategoryView(catId) {
      var cat = SCAN_CATEGORIES[catId];
      if (!cat)
        return (
          PageHead({ title: '场景不存在' }) +
          '<div class="page-body"><div class="empty"><div class="glyph">' +
          icon('project') +
          '</div>未找到该场景</div></div>'
        );
      var scans = D.projects.filter(function (p) {
        return p.id.indexOf('empty_') !== 0 && projectCategory(p) === catId;
      });
      var visible = scans.slice(0, STATE.taskLimit);
      var moreBar =
        scans.length > STATE.taskLimit
          ? '<div class="task-more"><button class="btn sm ghost" data-task-more>查看更多（剩 ' +
            (scans.length - STATE.taskLimit) +
            ' 个）' +
            icon('chevron', 11) +
            '</button></div>'
          : STATE.taskLimit > TASK_PAGE_SIZE
            ? '<div class="task-more"><button class="btn sm ghost" data-task-collapse>收起</button></div>'
            : '';
      var quick =
        '<div class="card"><div class="card-h"><h3>' +
        esc(cat.title) +
        '</h3></div>' +
        '<div class="card-b"><p class="muted sm" style="margin:0">' +
        esc(cat.desc || '') +
        '（' +
        esc(cat.hint || '') +
        '）。</p></div></div>';
      return (
        PageHead({
          title: cat.title,
          actions:
            '<button class="btn primary" data-np-open="' +
            esc(catId) +
            '">' +
            icon('plus', 14) +
            ' 新建扫描任务</button>',
        }) +
        '<div class="page-body cat-body">' +
        quick +
        TaskList(visible, cat.icon, cat.empty) +
        moreBar +
        '</div>'
      );
    }

    // ================================================== 安全态势 / 被测对象
    // 静态演示的 Target / Issue 模型；生产版由后端稳定建模，任务详情仍读取 DEMO_DATA。
    var POSTURE = D.posture || {
      targets: [
        {
          id: 'tgt-payment',
          name: '支付网关',
          type: '代码仓库',
          identity: 'repo://zhian/payment-gateway',
          version: 'v2.9.3',
          lastScan: '2026-10-14 10:32',
          scanAge: 0,
          scanCount: 6,
          mttr: 11,
          history: [
            ['09-01', 3, 8, 12, 6],
            ['09-15', 1, 6, 10, 6],
            ['09-30', 0, 5, 9, 5],
            ['10-14', 1, 3, 6, 3],
          ],
          issues: [
            [
              'PAY-001',
              '动态代码执行入口未收敛',
              'critical',
              'long',
              '09-01',
              '10-14',
              43,
              'runtime/eval_engine.py',
            ],
            [
              'PAY-002',
              '订单查询 SQL 注入绕过',
              'high',
              'reopened',
              '09-01',
              '10-14',
              43,
              'api/order_query.py',
            ],
            [
              'PAY-003',
              '配置文件硬编码云凭证',
              'high',
              'open',
              '09-15',
              '10-14',
              29,
              'config/prod.yaml',
            ],
            [
              'PAY-004',
              '依赖反序列化风险',
              'high',
              'fixed',
              '09-01',
              '09-30',
              29,
              'requirements.txt',
            ],
          ],
          scans: [
            ['09-01', 'v2.8.0', '代码安全', 8, 0, 8],
            ['09-15', 'v2.8.2', '代码安全', 3, 5, 6],
            ['09-30', 'v2.9.0', '代码安全', 2, 4, 5],
            ['10-14', 'v2.9.3', '代码安全', 2, 3, 5],
          ],
        },
        {
          id: 'tgt-openapi',
          name: '供应商开放 API',
          type: 'Web 服务',
          identity: 'https://api.partner.zhian.example',
          version: 'gateway-2026.10',
          lastScan: '2026-10-14 09:10',
          scanAge: 0,
          scanCount: 5,
          mttr: 18,
          history: [
            ['09-01', 2, 7, 9, 4],
            ['09-15', 2, 8, 10, 5],
            ['09-30', 2, 7, 8, 5],
            ['10-14', 2, 4, 7, 3],
          ],
          issues: [
            [
              'OA-001',
              '回调接口缺少租户授权',
              'critical',
              'long',
              '09-01',
              '10-14',
              43,
              '/v2/partner/callback',
            ],
            [
              'OA-002',
              '文件导入接口可触发 SSRF',
              'high',
              'open',
              '09-15',
              '10-14',
              29,
              '/v2/import/url',
            ],
            ['OA-003', '调试接口暴露堆栈', 'medium', 'fixed', '09-01', '09-30', 29, '/debug/trace'],
          ],
          scans: [
            ['09-01', 'release-2609', 'Web 安全', 9, 0, 9],
            ['09-15', 'release-2609', 'Web 安全', 4, 2, 11],
            ['09-30', 'release-2609', 'Web 安全', 2, 4, 9],
            ['10-14', 'gateway-2026.10', 'Web 安全', 2, 3, 8],
          ],
        },
        {
          id: 'tgt-admin',
          name: '运营管理后台',
          type: 'Web 服务',
          identity: 'https://admin.zhian.example',
          version: 'admin-5.4.1',
          lastScan: '2026-10-12 16:20',
          scanAge: 2,
          scanCount: 4,
          mttr: 8,
          history: [
            ['09-03', 1, 5, 8, 5],
            ['09-18', 0, 4, 7, 5],
            ['10-02', 0, 3, 7, 4],
            ['10-12', 0, 2, 6, 4],
          ],
          issues: [
            [
              'AD-001',
              '低权限角色可访问审计导出',
              'high',
              'open',
              '09-18',
              '10-12',
              24,
              '/audit/export',
            ],
            ['AD-002', '登录失败锁定策略可绕过', 'medium', 'fixed', '09-03', '10-02', 29, '/login'],
            [
              'AD-003',
              '静态资源桶权限过宽',
              'medium',
              'open',
              '09-18',
              '10-12',
              24,
              's3://admin-static',
            ],
          ],
          scans: [
            ['09-03', 'admin-5.2.0', 'Web 安全', 6, 0, 6],
            ['09-18', 'admin-5.3.0', 'Web 安全', 2, 4, 4],
            ['10-02', 'admin-5.3.2', 'Web 安全', 1, 2, 3],
            ['10-12', 'admin-5.4.1', 'Web 安全', 0, 1, 2],
          ],
        },
        {
          id: 'tgt-sdk',
          name: '终端安全 SDK',
          type: '应用组件',
          identity: 'package://zhian-client-sdk',
          version: '3.7.0-rc.4',
          lastScan: '2026-10-10 14:05',
          scanAge: 4,
          scanCount: 4,
          mttr: 14,
          history: [
            ['09-05', 0, 4, 6, 7],
            ['09-20', 0, 3, 5, 7],
            ['10-02', 0, 2, 4, 6],
            ['10-10', 0, 1, 3, 5],
          ],
          issues: [
            [
              'SDK-001',
              '升级包签名校验可降级',
              'high',
              'open',
              '09-05',
              '10-10',
              35,
              'updater/signature.cpp',
            ],
            [
              'SDK-002',
              '本地日志记录设备指纹',
              'medium',
              'open',
              '09-20',
              '10-10',
              20,
              'telemetry/logger.cpp',
            ],
            [
              'SDK-003',
              '动态库加载路径可控',
              'high',
              'fixed',
              '09-05',
              '10-02',
              27,
              'plugin/loader.cpp',
            ],
          ],
          scans: [
            ['09-05', '3.6.2', '应用安全', 5, 0, 5],
            ['09-20', '3.6.4', '应用安全', 1, 3, 3],
            ['10-02', '3.7.0-rc.1', '应用安全', 1, 2, 2],
            ['10-10', '3.7.0-rc.4', '应用安全', 0, 1, 1],
          ],
        },
        {
          id: 'tgt-sample',
          name: 'InternShannon 代码样本',
          type: '代码仓库',
          identity: 'repo://InternShannon-Vulnerability-Detect',
          version: 'demo-snapshot',
          lastScan: '2026-09-17 15:14',
          scanAge: 27,
          scanCount: 2,
          mttr: 4,
          history: [
            ['09-14', 0, 0, 0, 0],
            ['09-17', 1, 0, 0, 0],
          ],
          issues: [
            [
              'SAMPLE-001',
              '动态代码执行 API 被用于构造表达式',
              'critical',
              'open',
              '09-14',
              '09-17',
              3,
              'external_power_tools.py:321',
            ],
          ],
          scans: [
            ['09-14', 'snapshot-a', '代码安全', 0, 0, 0, 'src_20260914_173934_382488'],
            ['09-17', 'snapshot-b', '代码安全', 1, 0, 1, 'src_20260914_174801_197734'],
          ],
        },
        {
          id: 'tgt-datahub',
          name: '数据接入服务',
          type: '代码仓库',
          identity: 'repo://zhian/data-hub',
          version: 'v1.42.0',
          lastScan: '2026-08-07 11:40',
          scanAge: 68,
          scanCount: 3,
          mttr: 21,
          history: [
            ['07-10', 0, 2, 5, 4],
            ['07-24', 0, 1, 4, 4],
            ['08-07', 0, 0, 2, 1],
          ],
          issues: [
            [
              'DH-001',
              '任务回调 URL 未限制内网地址',
              'medium',
              'open',
              '07-10',
              '08-07',
              65,
              'task/callback.py',
            ],
            [
              'DH-002',
              '解压缺少路径校验',
              'high',
              'fixed',
              '07-10',
              '07-24',
              14,
              'upload/extract.py',
            ],
          ],
          scans: [
            ['07-10', 'v1.39.0', '代码安全', 3, 0, 3],
            ['07-24', 'v1.40.0', '代码安全', 1, 3, 1],
            ['08-07', 'v1.42.0', '代码安全', 0, 1, 0],
          ],
        },
      ],
    };
    POSTURE.targets.forEach(function (t) {
      t.history = (t.history || []).map(function (a) {
        return { date: a[0], critical: a[1], high: a[2], medium: a[3], low: a[4] };
      });
      t.issues = (t.issues || []).map(function (a) {
        return {
          id: a[0],
          title: a[1],
          severity: a[2],
          status: a[3],
          first: a[4],
          last: a[5],
          age: a[6],
          location: a[7],
        };
      });
      t.scans = (t.scans || []).map(function (a) {
        return {
          date: a[0],
          version: a[1],
          mode: a[2],
          added: a[3],
          fixed: a[4],
          remained: a[5],
          jobId: a[6],
        };
      });
      t.jobIds = (t.jobIds || [])
        .concat(
          (t.scans || [])
            .map(function (x) {
              return x.jobId;
            })
            .filter(Boolean),
        )
        .filter(function (v, i, a) {
          return a.indexOf(v) === i;
        });
    });
    var POSTURE_SEV = [
      ['critical', '严重', 'b-critical', '#D64545', '#FBEDED', '#A32D2D'],
      ['high', '高危', 'b-high', '#E8890C', '#FCF1E2', '#9C5A0A'],
      ['medium', '中危', 'b-medium', '#D9A514', '#FAF4DE', '#7E6410'],
      ['low', '低危', 'b-low', '#4A90D9', '#EAF2FC', '#2D6CB5'],
    ];
    var POSTURE_ST = {
      open: ['未修复', 'b-high'],
      long: ['长期未修复', 'b-critical'],
      reopened: ['重新打开', 'b-critical'],
      fixed: ['已修复', 'b-ok'],
    };
    function pLatest(t) {
      return (t.history || []).slice(-1)[0] || { critical: 0, high: 0, medium: 0, low: 0 };
    }
    function pPrev(t) {
      return (t.history || []).slice(-2)[0] || pLatest(t);
    }
    function pScore(s) {
      return (s.critical || 0) * 10 + (s.high || 0) * 6 + (s.medium || 0) * 2 + (s.low || 0);
    }
    function pRisk(t) {
      var s = pLatest(t);
      if (s.critical) return { label: '严重风险', cls: 'b-critical', rank: 0 };
      if (s.high >= 4) return { label: '高风险', cls: 'b-high', rank: 1 };
      if (s.high || s.medium >= 5) return { label: '中风险', cls: 'b-medium', rank: 2 };
      return { label: '低风险', cls: 'b-ok', rank: 3 };
    }
    function pDelta(t) {
      var a = pLatest(t),
        b = pPrev(t),
        n = (a.critical || 0) + (a.high || 0),
        o = (b.critical || 0) + (b.high || 0),
        d = n - o;
      return {
        d: d,
        label: d
          ? d > 0
            ? '较上轮 +' + d + ' 个严重/高危'
            : '较上轮 ' + d + ' 个严重/高危'
          : '较上轮持平',
        up: d > 0,
        down: d < 0,
      };
    }
    function pAgg() {
      var dates = {};
      POSTURE.targets.forEach(function (t) {
        (t.history || []).forEach(function (h) {
          dates[h.date] = 1;
        });
      });
      return Object.keys(dates)
        .sort()
        .map(function (date) {
          var agg = { date: date, critical: 0, high: 0, medium: 0, low: 0 };
          POSTURE.targets.forEach(function (t) {
            var known = (t.history || []).filter(function (h) {
              return h.date <= date;
            });
            if (!known.length) return;
            var h = known[known.length - 1];
            agg.critical += h.critical || 0;
            agg.high += h.high || 0;
            agg.medium += h.medium || 0;
            agg.low += h.low || 0;
          });
          return agg;
        });
    }
    function pSevBadge(sev) {
      var r = POSTURE_SEV.find(function (x) {
        return x[0] === sev;
      }) || ['info', '提示', 'b-info'];
      return '<span class="badge ' + r[2] + '">' + r[1] + '</span>';
    }
    function pStatusBadge(st) {
      var r = POSTURE_ST[st] || ['未知', 'b-info'];
      return '<span class="badge ' + r[1] + '">' + r[0] + '</span>';
    }
    function targetForProject(p) {
      return (
        POSTURE.targets.find(function (t) {
          return (t.jobIds || []).indexOf(p.id) !== -1;
        }) || null
      );
    }
    function pTargetHref(t) {
      return '#/targets/' + encodeURIComponent(t.id);
    }
    function PostureChart(history) {
      var h = (history || []).slice().sort(function (a, b) {
          return a.date < b.date ? -1 : 1;
        }),
        max = Math.max.apply(
          null,
          h
            .map(function (x) {
              return (x.critical || 0) + (x.high || 0) + (x.medium || 0) + (x.low || 0);
            })
            .concat([1]),
        );
      return (
        '<div class="posture-chart">' +
        h
          .map(function (x) {
            var segs = POSTURE_SEV.map(function (sv) {
              var v = x[sv[0]] || 0;
              return v
                ? '<i style="height:' +
                    Math.max(10, (v / max) * 100) +
                    '%;background:' +
                    sv[3] +
                    '"></i>'
                : '';
            }).join('');
            return (
              '<div class="posture-chart-col"><div class="posture-chart-bars" title="' +
              esc(x.date) +
              ' · 严重 ' +
              (x.critical || 0) +
              ' / 高危 ' +
              (x.high || 0) +
              '">' +
              segs +
              '</div><div class="posture-chart-label"><b>C' +
              (x.critical || 0) +
              ' H' +
              (x.high || 0) +
              '</b><span>' +
              esc(x.date) +
              '</span></div></div>'
            );
          })
          .join('') +
        '</div>'
      );
    }
    function PostureLegend() {
      return (
        '<div class="posture-legend">' +
        POSTURE_SEV.map(function (s) {
          return '<span><i style="background:' + s[3] + '"></i>' + s[1] + '</span>';
        }).join('') +
        '</div>'
      );
    }
    function pIssues(onlyOpen) {
      var out = [];
      POSTURE.targets.forEach(function (t) {
        (t.issues || []).forEach(function (x) {
          out.push(Object.assign({}, x, { target: t }));
        });
      });
      if (onlyOpen)
        out = out.filter(function (x) {
          return x.status !== 'fixed';
        });
      return out.sort(function (a, b) {
        var r = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        return (r[a.severity] || 9) - (r[b.severity] || 9) || (b.age || 0) - (a.age || 0);
      });
    }
    function PostureIssueRows(rows, showTarget, limit, currentTarget) {
      var list = limit ? rows.slice(0, limit) : rows;
      if (!list.length)
        return (
          '<div class="empty"><div class="glyph">' + icon('check') + '</div>暂无未修复问题</div>'
        );
      return (
        '<div class="posture-issue-list">' +
        list
          .map(function (x) {
            return (
              '<a class="posture-issue-row" href="' +
              pTargetHref(x.target || currentTarget) +
              '"><div>' +
              pSevBadge(x.severity) +
              '<b>' +
              esc(x.title) +
              '</b><span class="mono">' +
              esc(x.location) +
              '</span></div><div class="posture-issue-meta">' +
              (showTarget ? '<b>' + esc((x.target || currentTarget).name) + '</b>' : '') +
              '<span>' +
              esc(x.first) +
              ' → ' +
              esc(x.last) +
              ' · ' +
              x.age +
              ' 天</span>' +
              pStatusBadge(x.status) +
              '</div></a>'
            );
          })
          .join('') +
        '</div>'
      );
    }
    function pFilterTargets() {
      var q = (STATE.targetQuery || '').trim().toLowerCase(),
        f = STATE.targetFilter || 'all';
      return POSTURE.targets.filter(function (t) {
        var hit =
          !q ||
          [t.name, t.identity, t.type].some(function (v) {
            return (
              String(v || '')
                .toLowerCase()
                .indexOf(q) !== -1
            );
          });
        if (!hit) return false;
        if (f === 'critical') return pRisk(t).rank === 0;
        if (f === 'high') return pRisk(t).rank <= 1;
        if (f === 'stale') return t.scanAge > 30;
        if (f === 'long')
          return (t.issues || []).some(function (x) {
            return x.status !== 'fixed' && (x.status === 'long' || x.age >= 30);
          });
        return true;
      });
    }
    function pRiskDots(s) {
      var parts = POSTURE_SEV.filter(function (sv) {
        return (s && s[sv[0]]) || 0;
      }).map(function (sv) {
        return (
          '<span class="sev-chip" style="background:' +
          sv[4] +
          ';color:' +
          sv[5] +
          '" title="' +
          sv[1] +
          ' ' +
          (s[sv[0]] || 0) +
          ' 个"><i class="sev-dot" style="background:' +
          sv[5] +
          '"></i><span>' +
          sv[1] +
          '</span><b>' +
          ((s && s[sv[0]]) || 0) +
          '</b></span>'
        );
      });
      return (
        parts.join('') ||
        '<span class="sev-chip" style="background:var(--bg-sunken);color:var(--text-faint)">无风险</span>'
      );
    }
    function PostureTargetList(limit, useFilters) {
      var ops = !!useFilters;
      var list = useFilters ? pFilterTargets() : POSTURE.targets.slice();
      list = list.sort(function (a, b) {
        return pRisk(a).rank - pRisk(b).rank || pScore(pLatest(b)) - pScore(pLatest(a));
      });
      if (limit) list = list.slice(0, limit);
      if (!list.length) return Empty('project', '没有匹配的被测对象');
      var head =
        '<div class="posture-target-head"><span>被测对象</span><span>当前风险</span><span>趋势</span><span>最近扫描</span><span>' +
        (ops ? '操作' : '') +
        '</span></div>';
      return (
        '<div class="posture-target-list' +
        (ops ? ' has-ops' : '') +
        '">' +
        head +
        list
          .map(function (t) {
            var s = pLatest(t),
              r = pRisk(t),
              d = pDelta(t);
            return (
              '<div class="posture-target-row" data-goto="' +
              pTargetHref(t) +
              '" role="link"><div class="posture-target-name"><b>' +
              esc(t.name) +
              '</b></div><div class="posture-risk-cell">' +
              pRiskDots(s) +
              '</div><div class="posture-target-trend ' +
              (d.up ? 'up' : d.down ? 'down' : '') +
              '" title="' +
              esc(d.label) +
              '">' +
              (d.d ? (d.up ? '↑ ' : '↓ ') + Math.abs(d.d) : '—') +
              '</div><div><span>' +
              esc(t.lastScan) +
              '</span></div>' +
              (ops
                ? '<div class="posture-row-actions"><a class="btn sm ghost" href="' +
                  pTargetHref(t) +
                  '">详情</a><button type="button" class="btn sm" data-scan-target="' +
                  t.id +
                  '">复测</button><button type="button" class="btn sm danger-ghost" data-del-target="' +
                  t.id +
                  '">删除</button></div>'
                : '<div class="posture-go">' + icon('chevron', 12) + '</div>') +
              '</div>'
            );
          })
          .join('') +
        '</div>'
      );
    }
    function PostureOverviewView() {
      var ts = POSTURE.targets,
        hist = pAgg(),
        a = hist.slice(-1)[0] || { critical: 0, high: 0 },
        b = hist.slice(-2)[0] || a,
        n = (a.critical || 0) + (a.high || 0),
        o = (b.critical || 0) + (b.high || 0),
        high = ts.filter(function (t) {
          return pRisk(t).rank <= 1;
        }),
        open = pIssues(true),
        long = open.filter(function (x) {
          return x.status === 'long' || x.age >= 30;
        }),
        reopened = open.filter(function (x) {
          return x.status === 'reopened';
        }),
        stale = ts.filter(function (t) {
          return t.scanAge > 30;
        }),
        running = D.projects.filter(function (p) {
          return p.status === 'running';
        }),
        failed = D.projects.filter(function (p) {
          return p.status === 'failed';
        });
      // 需要关注：超期未复测 / 长期未修复 / 重新打开 —— 实时提醒 + 可直接操作
      var attention = [];
      stale.forEach(function (t) {
        attention.push({
          cls: 'b-critical',
          tag: '超期复测',
          title: esc(t.name),
          meta: '超期 ' + t.scanAge + ' 天未复测',
          href: pTargetHref(t),
          rescan: t.id,
        });
      });
      long.slice(0, 3).forEach(function (x) {
        attention.push({
          cls: 'b-high',
          tag: '长期未修复',
          title: esc(x.title),
          meta: (x.target ? esc(x.target.name) + ' · ' : '') + x.age + ' 天未修复',
          href: pTargetHref(x.target),
        });
      });
      reopened.slice(0, 3).forEach(function (x) {
        attention.push({
          cls: 'b-critical',
          tag: '重新打开',
          title: esc(x.title),
          meta: (x.target ? esc(x.target.name) + ' · ' : '') + '问题已重新打开',
          href: pTargetHref(x.target),
        });
      });
      var attentionCount = attention.length;
      var attentionHtml = attentionCount
        ? '<div class="attention-list">' +
          attention
            .slice(0, 6)
            .map(function (it) {
              return (
                '<div class="attention-row"><span class="badge ' +
                it.cls +
                '">' +
                it.tag +
                '</span>' +
                '<a href="' +
                it.href +
                '" class="attention-text"><b>' +
                it.title +
                '</b><span>' +
                it.meta +
                '</span></a>' +
                (it.rescan
                  ? '<button type="button" class="btn sm" data-scan-target="' +
                    esc(it.rescan) +
                    '">' +
                    icon('scan', 12) +
                    ' 复测</button>'
                  : '<a class="btn sm ghost" href="' +
                    it.href +
                    '">查看 ' +
                    icon('chevron', 12) +
                    '</a>') +
                '</div>'
              );
            })
            .join('') +
          '</div>'
        : '<div class="empty"><div class="glyph">' +
          icon('check') +
          '</div>没有需要立即处理的事项</div>';
      // 扫描执行动态：运行中任务进度 + 失败任务入口
      var actRows =
        running
          .map(function (p) {
            var pr = Math.max(0, Math.min(100, Math.round(p.progress || 0)));
            return (
              '<a href="#/projects/' +
              encodeURIComponent(p.id) +
              '">' +
              '<span class="scan-act-top"><b>' +
              esc(p.name) +
              '</b><span class="status running"><span class="pulse"></span>运行中</span></span>' +
              '<div class="bar-track" style="margin-top:6px"><div class="bar-fill" style="width:' +
              pr +
              '%"></div></div>' +
              '<span>' +
              fmtRelTime(p.started_at) +
              ' 启动 · ' +
              pr +
              '% · ' +
              esc(sceneMode(p)) +
              '</span></a>'
            );
          })
          .join('') +
        failed
          .map(function (p) {
            return (
              '<a href="#/projects/' +
              encodeURIComponent(p.id) +
              '">' +
              '<span class="scan-act-top"><b>' +
              esc(p.name) +
              '</b><span class="badge b-critical">已失败</span></span>' +
              '<span>' +
              fmtRelTime(p.started_at) +
              ' 启动 · 点击查看失败详情</span></a>'
            );
          })
          .join('');
      var actHtml =
        running.length || failed.length
          ? '<div class="posture-recent-list">' + actRows + '</div>'
          : '<div class="empty"><div class="glyph">' +
            icon('scan') +
            '</div>暂无运行中或失败的任务</div>';
      return (
        PageHead({
          title: '安全态势总览',
          actions:
            '<button type="button" class="btn primary" data-open-picker="1">' +
            icon('plus', 14) +
            ' 发起检测</button>',
        }) +
        '<div class="page-body posture-body">' +
        '<div class="grid grid-4 posture-kpis">' +
        Kpi('被测对象', ts.length, high.length + ' 个高风险对象') +
        Kpi('未修复严重/高危', n, '较上轮 ' + (n - o >= 0 ? '+' : '') + (n - o), 'critical') +
        Kpi('长期未修复', long.length, '超过 30 天或反复出现') +
        Kpi(
          '扫描覆盖',
          ts.length - stale.length + '/' + ts.length,
          stale.length + ' 个对象超 30 天未扫描',
        ) +
        '</div>' +
        '<div class="posture-overview-layout">' +
        '<div class="stack" style="gap:18px">' +
        '<section class="card"><div class="card-h"><h3>优先处置问题</h3><span class="badge b-critical">' +
        open.filter(function (x) {
          return x.severity === 'critical';
        }).length +
        ' 严重</span></div><div class="card-b">' +
        PostureIssueRows(open, true, 6) +
        '</div></section>' +
        '</div>' +
        '<div class="stack" style="gap:18px">' +
        '<section class="card"><div class="card-h"><h3>需要关注</h3><span class="badge ' +
        (attentionCount ? 'b-critical' : 'b-ok') +
        '">' +
        (attentionCount ? attentionCount + ' 项待处理' : '无待处理') +
        '</span></div><div class="card-b">' +
        attentionHtml +
        '</div></section>' +
        '</div>' +
        '</div>' +
        '<div class="posture-overview-layout">' +
        '<div class="stack" style="gap:18px">' +
        '<section class="card"><div class="card-h"><h3>扫描执行动态</h3><a class="btn sm ghost" href="#/scan/code">任务中心 ' +
        icon('chevron', 12) +
        '</a></div><div class="card-b">' +
        actHtml +
        '</div></section>' +
        '</div>' +
        '<div class="stack" style="gap:18px">' +
        '<section class="card"><div class="card-h"><h3>治理效果</h3></div><div class="card-b posture-effect-grid"><div><b>' +
        (o - n >= 0 ? '+' : '') +
        (o - n) +
        '</b><span>严重/高危净减少</span></div><div><b>' +
        reopened.length +
        '</b><span>问题重新打开</span></div><div><b>' +
        Math.round(
          ts.reduce(function (s, t) {
            return s + (t.mttr || 0);
          }, 0) / ts.length,
        ) +
        ' 天</b><span>平均修复时长</span></div></div></section>' +
        '</div>' +
        '</div>' +
        '<section class="card"><div class="card-h"><div><h3>全局风险趋势</h3><div class="muted xs">跨被测对象按检测时间聚合</div></div>' +
        PostureLegend() +
        '</div><div class="card-b">' +
        PostureChart(hist) +
        '</div></section>' +
        '</div>'
      );
    }
    function TargetsView() {
      var filters = [
        ['all', '全部'],
        ['critical', '严重风险'],
        ['high', '高风险'],
        ['long', '长期未修复'],
        ['stale', '超期未扫描'],
      ];
      var cur = (filters.find(function (x) {
        return x[0] === (STATE.targetFilter || 'all');
      }) || filters[0])[1];
      var menu = filters
        .map(function (x) {
          return (
            '<button type="button" class="tfilter-item' +
            (STATE.targetFilter === x[0] ? ' on' : '') +
            '" role="option" aria-selected="' +
            (STATE.targetFilter === x[0] ? 'true' : 'false') +
            '" data-tfilter="' +
            x[0] +
            '"><span>' +
            x[1] +
            '</span>' +
            (STATE.targetFilter === x[0] ? icon('check', 14) : '') +
            '</button>'
          );
        })
        .join('');
      var tools =
        '<div class="tsearch">' +
        icon('search', 14) +
        '<input class="input" id="target-search" value="' +
        esc(STATE.targetQuery) +
        '" placeholder="搜索对象 / 身份 / 类型"/>' +
        (STATE.targetQuery
          ? '<button type="button" class="tsearch-clear" data-tclear="1" aria-label="清空搜索">' +
            icon('x', 12) +
            '</button>'
          : '') +
        '</div>' +
        '<div class="tfilter-dd"><button type="button" class="tfilter-btn' +
        (STATE.targetFilterOpen ? ' open' : '') +
        '" data-tfilter-toggle="1" aria-haspopup="listbox" aria-expanded="' +
        (STATE.targetFilterOpen ? 'true' : 'false') +
        '"><span class="muted">状态</span><b>' +
        cur +
        '</b>' +
        icon('chevron', 12) +
        '</button>' +
        (STATE.targetFilterOpen
          ? '<div class="tfilter-menu" role="listbox">' + menu + '</div>'
          : '') +
        '</div>';
      return (
        PageHead({ title: '被测对象', tools: tools }) +
        '<div class="page-body posture-body">' +
        PostureTargetList(null, true) +
        '</div>'
      );
    }
    function TargetDetailView(id) {
      var t = POSTURE.targets.find(function (x) {
        return x.id === id;
      });
      if (!t)
        return (
          PageHead({ title: '被测对象不存在' }) +
          '<div class="page-body"><div class="empty"><div class="glyph">' +
          icon('project') +
          '</div>找不到对象 ' +
          esc(id) +
          '</div></div>'
        );
      var s = pLatest(t),
        r = pRisk(t),
        d = pDelta(t),
        open = (t.issues || []).filter(function (x) {
          return x.status !== 'fixed';
        });
      var stale = t.scanAge > 30;
      var scansAll = t.scans || [];
      var last = scansAll.slice(-1)[0];
      var older = scansAll.slice(0, -1);
      var profile =
        '<section class="card profile-card">' +
        '<div class="card-h"><h3>基础信息</h3></div>' +
        '<div class="card-b profile-rows">' +
        '<div class="p-row"><span>对象身份</span><b class="mono">' +
        esc(t.identity) +
        '</b></div>' +
        '<div class="p-row"><span>对象类型</span><b>' +
        esc(t.type) +
        '</b></div>' +
        '<div class="p-row"><span>最近扫描</span><b class="mono' +
        (stale ? ' posture-scan-stale' : '') +
        '">' +
        esc(t.lastScan) +
        '</b>' +
        (stale ? '<span class="stale-tag">超期 ' + t.scanAge + ' 天未复测</span>' : '') +
        '</div>' +
        '</div></section>';
      var scanCard =
        '<section class="card posture-scanhist">' +
        '<div class="card-h"><h3>扫描历史</h3><span class="muted xs">' +
        (t.scans || []).length +
        ' 轮</span></div>' +
        '<div class="card-b posture-history-list">' +
        (last
          ? '<' +
            (last.jobId
              ? 'a class="latest" href="#/projects/' + encodeURIComponent(last.jobId) + '"'
              : 'div class="latest muted-row"') +
            '><div><b>' +
            esc(last.date) +
            ' · ' +
            esc(last.version) +
            '</b><span>' +
            esc(last.mode || '') +
            ' · 新增 ' +
            (last.added || 0) +
            ' / 修复 ' +
            (last.fixed || 0) +
            ' / 残留 ' +
            (last.remained || 0) +
            '</span>' +
            '<div class="latest-risk">' +
            pRiskDots(s) +
            '<span class="posture-delta ' +
            (d.up ? 'up' : d.down ? 'down' : '') +
            '">' +
            esc(d.label) +
            '</span></div>' +
            '<div class="latest-meta"><span>累计扫描 ' +
            t.scanCount +
            ' 次</span><span>平均修复 ' +
            t.mttr +
            ' 天</span></div>' +
            '</div><span class="badge ' +
            (last.jobId ? 'b-brand' : 'b-neutral') +
            '">' +
            (last.jobId ? '最新一轮 · 查看任务' : '最新一轮') +
            '</span></' +
            (last.jobId ? 'a' : 'div') +
            '>'
          : '') +
        older
          .map(function (x) {
            var tag = x.jobId ? 'a' : 'div';
            var attrs = x.jobId
              ? ' href="#/projects/' + encodeURIComponent(x.jobId) + '"'
              : ' class="muted-row"';
            return (
              '<' +
              tag +
              attrs +
              '><b>' +
              esc(x.date) +
              ' · ' +
              esc(x.version) +
              '</b><span>' +
              esc(x.mode) +
              ' · 新增 ' +
              x.added +
              ' / 修复 ' +
              x.fixed +
              ' / 残留 ' +
              x.remained +
              '</span><span class="badge ' +
              (x.jobId ? 'b-neutral' : 'b-neutral') +
              '">' +
              (x.jobId ? '查看任务' : '历史快照') +
              '</span></' +
              tag +
              '>'
            );
          })
          .join('') +
        '</div>' +
        '</section>';
      var trendCard =
        '<section class="card"><div class="card-h"><div><h3>风险趋势</h3><div class="muted xs">趋势内嵌在对象档案中，用同一身份归并多轮结果</div></div><div class="trend-tools">' +
        PostureLegend() +
        '</div></div>' +
        '<div class="card-b">' +
        PostureChart(t.history) +
        '</div></section>';
      var issueCard =
        '<section class="card"><div class="card-h"><h3>漏洞生命周期</h3><span class="badge b-info">' +
        open.length +
        ' 个未修复</span></div><div class="card-b">' +
        PostureIssueRows(t.issues || [], false, null, t) +
        '</div></section>';
      return (
        PageHead({
          title: t.name,
          back: { attr: 'data-back-targets="1"' },
          actions:
            '<button type="button" class="btn" data-open-compare="' +
            esc(t.id) +
            '">对比</button><button type="button" class="btn primary" data-scan-target="' +
            esc(t.id) +
            '">' +
            icon('scan', 14) +
            ' 发起复测</button>',
        }) +
        '<div class="page-body posture-body">' +
        '<div class="detail-top">' +
        profile +
        issueCard +
        '</div>' +
        trendCard +
        scanCard +
        '</div>'
      );
    }
    function PageHead(o) {
      var back = o.back
        ? '<button class="page-back" type="button" ' +
          o.back.attr +
          ' aria-label="返回">' +
          icon('chevron', 18) +
          '</button>'
        : '';
      return (
        '<header class="page-head' +
        (o.tools ? ' has-tools' : '') +
        '">' +
        back +
        '<h1 class="title">' +
        esc(o.title) +
        (o.titleTag || '') +
        '</h1>' +
        (o.sub
          ? '<span class="muted sm" style="margin-left:12px;white-space:nowrap">' +
            esc(o.sub) +
            '</span>'
          : '') +
        (o.tools ? '<div class="page-head-tools">' + o.tools + '</div>' : '') +
        '<div class="actions">' +
        (o.actions || '') +
        '</div></header>'
      );
    }
    function Empty(iconName, label) {
      return (
        '<div class="empty" style="padding:80px"><div class="glyph">' +
        icon(iconName) +
        '</div>' +
        esc(label) +
        '</div>'
      );
    }
    function targetPickerModal() {
      var rows = POSTURE.targets
        .map(function (t) {
          var s = pLatest(t),
            r = pRisk(t);
          return (
            '<button type="button" class="tp-row" data-pick-target="' +
            esc(t.id) +
            '">' +
            '<span class="tp-name"><b>' +
            esc(t.name) +
            '</b><span class="muted xs">' +
            esc(t.type) +
            '</span></span>' +
            '<span class="badge ' +
            r.cls +
            '">' +
            r.label +
            '</span>' +
            '<span class="muted xs mono tp-scan">最近 ' +
            esc(t.lastScan) +
            '</span>' +
            icon('chevron', 14) +
            '</button>'
          );
        })
        .join('');
      return (
        '<div class="modal-back" data-tp-close="1"></div>' +
        '<div class="modal-card tp-modal" role="dialog" aria-modal="true" aria-label="选择被测对象">' +
        '<div class="modal-h"><h3>选择被测对象</h3><button class="btn sm ghost" type="button" data-tp-close="1" aria-label="关闭">' +
        icon('x', 14) +
        '</button></div>' +
        '<div class="modal-b"><div class="muted xs" style="margin-bottom:12px;line-height:1.7">发起检测前请先指定要扫描的对象，本次扫描结果将归并到该对象的长期安全档案。</div>' +
        '<div class="tp-list">' +
        rows +
        '</div>' +
        '<button type="button" class="btn block" data-pick-target="" style="margin-top:10px">新建对象（不关联已有档案）</button>' +
        '</div></div>'
      );
    }
    // plain delete confirm: text only, same pattern as modelDeleteModal
    function targetDeleteModal() {
      var t = POSTURE.targets.find(function (x) {
        return x.id === STATE.targetDeleting;
      });
      if (!t) return '';
      return (
        '<div class="modal-back" data-tdel-close="1"></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true" aria-label="删除被测对象">' +
        '<div class="modal-h"><h3>删除被测对象</h3>' +
        '<button class="btn sm ghost" data-tdel-close="1" aria-label="关闭">' +
        icon('x', 14) +
        '</button></div>' +
        '<div class="modal-b"><p class="m-plain-text">确认删除被测对象「' +
        esc(t.name) +
        '」吗？删除后其扫描档案与问题记录将从列表移除。</p></div>' +
        '<div class="modal-f"><button class="btn" data-tdel-close="1">取消</button>' +
        '<button class="btn danger" data-tdel-confirm="1">删除</button></div>' +
        '</div>'
      );
    }

    // 按需对比两轮扫描：趋势卡「对比」按钮唤出
    function targetCompareModal() {
      var t = POSTURE.targets.find(function (x) {
        return x.id === STATE.compareTargetId;
      });
      if (!t) return '';
      var h = t.history || [];
      var scanByDate = {};
      (t.scans || []).forEach(function (x) {
        scanByDate[x.date] = x;
      });
      var a = h[STATE.compareA] || h[0],
        b = h[STATE.compareB] || h[h.length - 1];
      var sa = scanByDate[a.date] || {},
        sb = scanByDate[b.date] || {};
      var optsFor = function (sel) {
        return h
          .map(function (x, i) {
            var sc = scanByDate[x.date];
            return (
              '<option value="' +
              i +
              '"' +
              (i === sel ? ' selected="1"' : '') +
              '>' +
              esc(x.date) +
              (sc ? ' · ' + esc(sc.version) : '') +
              '</option>'
            );
          })
          .join('');
      };
      var ds = pScore(b) - pScore(a);
      var sevRows = function (x, other) {
        return POSTURE_SEV.map(function (sv) {
          var diff = other && (x[sv[0]] || 0) !== (other[sv[0]] || 0);
          return (
            '<div class="cmp-sev' +
            (diff ? ' diff' : '') +
            '"><i class="sev-dot" style="background:' +
            sv[5] +
            '"></i><span>' +
            sv[1] +
            '</span><b>' +
            (x[sv[0]] || 0) +
            '</b></div>'
          );
        }).join('');
      };
      return (
        '<div class="modal-back" data-cmp-close="1"></div>' +
        '<div class="modal-card cmp-modal" role="dialog" aria-modal="true" aria-label="对比两轮扫描">' +
        '<div class="modal-h"><h3>对比两轮扫描</h3><button class="btn sm ghost" data-cmp-close="1" aria-label="关闭">' +
        icon('x', 14) +
        '</button></div>' +
        '<div class="modal-b">' +
        '<div class="cmp-head">' +
        '<div class="cmp-col-head"><span class="muted">基准轮</span><select class="input" data-cmp-a="1">' +
        optsFor(STATE.compareA) +
        '</select></div>' +
        '<span class="cmp-arrow">→</span>' +
        '<div class="cmp-col-head"><span class="muted">对比轮</span><select class="input" data-cmp-b="1">' +
        optsFor(STATE.compareB) +
        '</select></div>' +
        '</div>' +
        '<div class="cmp-summary">' +
        (sb.date
          ? '<span class="cmp-stat"><b>+' +
            (sb.added || 0) +
            '</b> 新增（' +
            esc(sb.date) +
            '）</span><span class="cmp-stat"><b>-' +
            (sb.fixed || 0) +
            '</b> 修复</span><span class="cmp-stat"><b>' +
            (sb.remained || 0) +
            '</b> 残留</span>'
          : '') +
        '<span class="cmp-score">风险分 <b>' +
        (ds > 0 ? '+' + ds : ds) +
        '</b><span class="badge ' +
        (ds <= 0 ? 'b-ok' : 'b-critical') +
        '">' +
        (ds <= 0 ? '风险收敛' : '风险上升') +
        '</span></span>' +
        '</div>' +
        '<div class="cmp-cols">' +
        '<div class="cmp-round"><div class="cmp-round-h">' +
        esc(a.date) +
        (sa.version ? ' · ' + esc(sa.version) : '') +
        '</div>' +
        sevRows(a, b) +
        '</div>' +
        '<div class="cmp-round"><div class="cmp-round-h">' +
        esc(b.date) +
        (sb.version ? ' · ' + esc(sb.version) : '') +
        '</div>' +
        sevRows(b, a) +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="modal-f"><button class="btn" data-cmp-close="1">关闭</button></div>' +
        '</div>'
      );
    }

    // CWE 编号 -> 中文名（展示用；未收录的显示原编号）。
    var CWE_NAMES = {
      'CWE-94': '代码注入',
      'CWE-95': '动态代码评估',
      'CWE-78': '操作系统命令注入',
      'CWE-79': '跨站脚本(XSS)',
      'CWE-89': 'SQL注入',
      'CWE-22': '路径穿越',
      'CWE-327': '使用有缺陷的加密算法',
      'CWE-326': '加密强度不足',
      'CWE-798': '硬编码凭证',
      'CWE-502': '不可信反序列化',
      'CWE-200': '信息泄露',
      'CWE-611': 'XXE注入',
      'CWE-434': '任意文件上传',
      'CWE-862': '缺失授权',
      'CWE-863': '错误授权',
      'CWE-287': '身份认证缺陷',
      'CWE-352': 'CSRF',
      'CWE-125': '越界读取',
      'CWE-787': '越界写入',
      'CWE-416': 'USE AFTER FREE',
      'CWE-20': '输入校验不当',
      'CWE-400': '资源耗尽',
      'CWE-000': '未分类',
    };
    function Kpi(label, value, delta, accent) {
      var valueColor = accent === 'critical' ? 'var(--sig-critical)' : 'var(--brand-ink)';
      return (
        '<div class="kpi"><span class="label">' +
        esc(label) +
        '</span>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:2px">' +
        '<span class="value" style="color:' +
        valueColor +
        '">' +
        esc(value) +
        '</span></div>' +
        (delta ? '<span class="delta">' + esc(delta) + '</span>' : '') +
        '</div>'
      );
    }
    function StatTile(label, value, variant) {
      return (
        '<div class="stat-tile ' +
        (variant || '') +
        '"><div class="label">' +
        esc(label) +
        '</div><div class="value">' +
        esc(value) +
        '</div></div>'
      );
    }
    function DashboardView() {
      var projects = D.projects;
      var totalFindings = projects.reduce(function (s, p) {
        return s + ((p.metrics && p.metrics.findings) || 0);
      }, 0);
      var totalCritical = projects.reduce(function (s, p) {
        return s + ((p.severity && p.severity.critical) || 0);
      }, 0);
      var totalHigh = projects.reduce(function (s, p) {
        return s + ((p.severity && p.severity.high) || 0);
      }, 0);
      var running = projects.filter(function (p) {
        return p.status === 'running';
      });
      var succeeded = projects.filter(function (p) {
        return p.status === 'succeeded';
      });
      var failed = projects.filter(function (p) {
        return p.status === 'failed';
      });
      var durations = projects
        .map(function (p) {
          return p.duration;
        })
        .filter(Boolean);
      var avgDuration = durations.length
        ? Math.round(
            durations.reduce(function (s, n) {
              return s + n;
            }, 0) / durations.length,
          )
        : 0;
      var findings = D.findings;

      var runningCard;
      if (running.length) {
        runningCard = running
          .slice(0, 1)
          .map(function (p) {
            return (
              '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">' +
              '<div><div class="b" style="font-size:15px;color:var(--text)">' +
              esc(p.name) +
              '</div>' +
              '<div class="muted xs mono" style="margin-top:4px">' +
              esc(p.id) +
              ' · ' +
              esc(p.target) +
              '</div></div>' +
              '<div style="display:flex;gap:12px;align-items:center"><span class="muted xs">' +
              fmtRelTime(p.started_at) +
              ' 启动</span>' +
              '<a class="btn sm" href="#/projects/' +
              encodeURIComponent(p.id) +
              '">打开 ' +
              icon('chevron', 11) +
              '</a></div></div>' +
              StagePipeline(p.stages) +
              '<div style="display:flex;justify-content:space-between;margin-top:14px;align-items:center">' +
              '<span class="muted xs mono">阶段进度</span><span class="b mono brand-text">' +
              Math.round(p.progress) +
              '%</span></div>' +
              '<div class="bar-track" style="margin-top:6px"><div class="bar-fill" style="width:' +
              p.progress +
              '%"></div></div>' +
              '<div class="grid grid-4" style="margin-top:14px;gap:10px">' +
              StatTile('候选', p.metrics.candidates) +
              StatTile('验证', p.metrics.probes) +
              StatTile('确认', p.metrics.findings, p.metrics.findings ? 'crit' : '') +
              StatTile('错误', p.metrics.errors) +
              '</div>'
            );
          })
          .join('');
      } else {
        runningCard =
          '<div class="empty"><div class="glyph">' +
          icon('scan') +
          '</div>当前没有运行中的扫描</div>';
      }

      var allProjects = projects.length
        ? projects
            .slice(0, 6)
            .map(function (p, i) {
              var last = i === Math.min(projects.length, 6) - 1;
              return (
                '<a href="#/projects/' +
                encodeURIComponent(p.id) +
                '" style="display:grid;grid-template-columns:16px 1fr 120px 80px 90px;gap:12px;align-items:center;' +
                'padding:12px 18px;' +
                (last ? '' : 'border-bottom:1px solid var(--line);') +
                'cursor:pointer;font-size:13px;text-decoration:none;color:inherit">' +
                '<span class="status ' +
                p.status +
                '"><span class="pulse"></span></span>' +
                '<div class="minw0"><div class="b" style="color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
                esc(p.name) +
                '</div>' +
                '<div class="mono xs muted" style="margin-top:2px">' +
                esc(p.id) +
                '</div></div>' +
                '<span class="badge ' +
                statusBadge(p.status) +
                '">' +
                esc(p.status) +
                '</span>' +
                '<span class="muted xs">' +
                fmtRelTime(p.started_at) +
                '</span>' +
                '<span class="mono xs muted" style="text-align:right">' +
                p.metrics.findings +
                ' 发现</span></a>'
              );
            })
            .join('')
        : '<div class="empty"><div class="glyph">' + icon('project') + '</div>还没有扫描任务</div>';

      var sevRows = [
        { key: 'critical', label: '严重', count: totalCritical },
        { key: 'high', label: '高危', count: totalHigh },
        {
          key: 'medium',
          label: '中等',
          count: projects.reduce(function (s, p) {
            return s + ((p.severity && p.severity.medium) || 0);
          }, 0),
        },
        {
          key: 'low',
          label: '低危',
          count: projects.reduce(function (s, p) {
            return s + ((p.severity && p.severity.low) || 0);
          }, 0),
        },
      ];
      var badgeMap = { critical: 'b-critical', high: 'b-high', medium: 'b-medium', low: 'b-low' };
      var barMap = {
        critical: 'var(--sig-critical)',
        high: 'var(--sig-high)',
        medium: 'var(--sig-medium)',
        low: 'var(--sig-low)',
      };
      var max = Math.max(1, totalFindings);
      var sevHtml = sevRows
        .map(function (r) {
          return (
            '<div style="display:grid;grid-template-columns:60px 1fr 40px;gap:12px;align-items:center">' +
            '<span class="badge ' +
            badgeMap[r.key] +
            '">' +
            r.label +
            '</span>' +
            '<div style="height:6px;border-radius:3px;background:var(--bg-sunken);overflow:hidden;border:1px solid var(--line)">' +
            '<div style="width:' +
            (r.count / max) * 100 +
            '%;height:100%;background:' +
            barMap[r.key] +
            '"></div></div>' +
            '<span class="mono b" style="text-align:right;color:var(--text)">' +
            r.count +
            '</span></div>'
          );
        })
        .join('');

      var findingsHtml = findings.length
        ? findings
            .slice(0, 5)
            .map(function (f) {
              var proj = projects.find(function (p) {
                return p.id === f.project_id;
              });
              return (
                '<a href="#/projects/' +
                encodeURIComponent(f.project_id) +
                '" style="display:block;padding:10px 12px;border-radius:6px;border:1px solid var(--line);background:var(--bg-sunken);cursor:pointer;text-decoration:none;color:inherit">' +
                '<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">' +
                '<span class="badge ' +
                sevColor(f.severity) +
                '">' +
                esc(f.severity) +
                '</span>' +
                '<span class="muted xs mono">' +
                esc(f.id) +
                '</span><span class="spacer"></span>' +
                '<span class="muted xs mono">' +
                esc(proj ? proj.name : '—') +
                '</span></div>' +
                '<div class="b xs" style="margin-top:4px;color:var(--text);line-height:1.4">' +
                esc(f.title) +
                '</div></a>'
              );
            })
            .join('')
        : '<div class="empty"><div class="glyph">' + icon('bug') + '</div>暂无确认漏洞</div>';

      return (
        PageHead({
          title: '仪表盘',
          actions:
            '<button class="btn" onclick="void 0" id="btn-refresh" title="本地记录为静态快照">' +
            icon('refresh', 14) +
            ' 刷新</button>' +
            '<button class="btn primary" data-np-open="">' +
            icon('plus', 14) +
            ' 新建扫描任务</button>',
        }) +
        '<div class="page-body">' +
        '<div class="grid grid-4" style="margin-bottom:18px">' +
        Kpi('任务总数', projects.length, succeeded.length + ' 已完成') +
        Kpi('进行中', running.length, failed.length + ' 失败') +
        Kpi(
          '确认漏洞',
          totalFindings,
          totalCritical + ' 严重 · ' + totalHigh + ' 高危',
          'critical',
        ) +
        Kpi('平均耗时', avgDuration ? fmtDuration(avgDuration) : '—', projects.length + ' 次扫描') +
        '</div>' +
        '<div class="grid" style="grid-template-columns:1.4fr 1fr;gap:18px">' +
        '<div class="stack" style="gap:18px">' +
        '<div class="card"><div class="card-h"><div class="flex"><h3>正在运行</h3>' +
        (running.length
          ? '<span class="status running"><span class="pulse"></span>' +
            running.length +
            ' 个任务</span>'
          : '') +
        '</div><a class="btn sm ghost" href="#/projects">查看全部 ' +
        icon('chevron', 12) +
        '</a></div>' +
        '<div class="card-b">' +
        runningCard +
        '</div></div>' +
        '<div class="card"><div class="card-h"><h3>所有任务</h3><a class="btn sm ghost" href="#/projects">管理 ' +
        icon('chevron', 12) +
        '</a></div>' +
        '<div>' +
        allProjects +
        '</div></div>' +
        '</div>' +
        '<div class="stack" style="gap:18px">' +
        '<div class="card"><div class="card-h"><h3>严重度汇总</h3><span class="muted xs mono">' +
        totalFindings +
        ' TOTAL</span></div>' +
        '<div class="card-b stack-sm">' +
        sevHtml +
        '</div></div>' +
        '<div class="card"><div class="card-h"><h3>最近的发现</h3></div><div class="card-b stack-sm">' +
        findingsHtml +
        '</div></div>' +
        '</div></div></div>'
      );
    }

    // ------------------------------------------------------- service view
    function ProjectsView() {
      var q = STATE.query.trim().toLowerCase();
      var filtered = !q
        ? D.projects
        : D.projects.filter(function (p) {
            return [p.name, p.id, p.target, p.description, p.phase_label].some(function (v) {
              return (
                String(v || '')
                  .toLowerCase()
                  .indexOf(q) !== -1
              );
            });
          });
      var body = filtered.length
        ? filtered.map(projectRow).join('')
        : '<div class="empty"><div class="glyph">' +
          icon('project') +
          '</div>没有匹配的扫描任务</div>';
      return (
        PageHead({
          title: '任务',
          actions:
            '<div class="field" style="margin:0;min-width:240px"><input class="input" id="proj-search" value="' +
            esc(STATE.query) +
            '" placeholder="搜索任务 / 目标 / ID"/></div>' +
            '<button class="btn primary" data-np-open="">' +
            icon('plus', 14) +
            ' 新建扫描任务</button>',
        }) +
        '<div class="page-body"><div class="stack" style="gap:10px">' +
        body +
        '</div></div>'
      );
    }

    // --------------------------------------------------- project cards/lists
    function projectRow(p) {
      var initial =
        String(p.name)
          .replace(/[^\u4e00-\u9fa5A-Za-z]/g, '')
          .slice(0, 1) || '·';
      var sev = p.severity || {};
      var totalFindings =
        (sev.critical || 0) +
        (sev.high || 0) +
        (sev.medium || 0) +
        (sev.low || 0) +
        (sev.info || 0);
      var badges = '';
      if (p.metrics && p.metrics.errors > 0)
        badges += '<span class="badge b-critical">' + p.metrics.errors + ' 错误</span>';
      if (sev.critical) badges += '<span class="badge b-critical">' + sev.critical + ' 严重</span>';
      if (sev.high) badges += '<span class="badge b-high">' + sev.high + ' 高危</span>';
      if (sev.medium) badges += '<span class="badge b-medium">' + sev.medium + ' 中</span>';
      if (sev.low) badges += '<span class="badge b-low">' + sev.low + ' 低</span>';
      if (!totalFindings) badges += '<span class="badge b-ok">无发现</span>';
      return (
        '<a class="project-row" href="#/projects/' +
        encodeURIComponent(p.id) +
        '" style="text-decoration:none;color:inherit">' +
        '<div class="glyph">' +
        esc(initial) +
        '</div>' +
        '<div class="minw0">' +
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<span class="b" style="font-size:15px;color:var(--text);white-space:nowrap">' +
        esc(p.name) +
        '</span>' +
        '<span class="muted xs mono">' +
        esc(p.id) +
        '</span>' +
        '<span class="status ' +
        p.status +
        '"><span class="pulse"></span>' +
        esc(p.status) +
        '</span>' +
        '</div>' +
        '<div class="muted xs" style="margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">' +
        esc(p.description) +
        '</div>' +
        '<div style="display:flex;gap:12px;margin-top:8px;color:var(--text-faint);font-size:11.5px;white-space:nowrap;overflow:hidden">' +
        '<span class="mono" title="' +
        esc(p.phase_label || '') +
        '">' +
        esc(sceneMode(p)) +
        '</span><span>·</span>' +
        '<span>启动 ' +
        fmtRelTime(p.started_at) +
        '</span>' +
        (p.status === 'running'
          ? '<span>·</span><span class="brand-text mono">' + Math.round(p.progress) + '%</span>'
          : '') +
        (p.duration ? '<span>·</span><span>耗时 ' + fmtDuration(p.duration) + '</span>' : '') +
        '<span>·</span><span class="mono" title="' +
        esc(p.target) +
        '">' +
        esc(shortTarget(p)) +
        '</span>' +
        '</div>' +
        (p.status === 'running'
          ? '<div class="bar-track" style="margin-top:8px;max-width:320px"><div class="bar-fill" style="width:' +
            p.progress +
            '%"></div></div>'
          : '') +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end">' +
        badges +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-shrink:0">' +
        '<span class="btn sm">打开 ' +
        icon('chevron', 11) +
        '</span>' +
        '<button class="btn sm danger" data-del="' +
        encodeURIComponent(p.id) +
        '" title="演示环境为静态快照，不支持删除">' +
        icon('x', 11) +
        ' 删除</button>' +
        '</div></a>'
      );
    }
    function pickActiveJob() {
      var scans = D.projects.filter(function (p) {
        return p.id.indexOf('empty_') !== 0;
      });
      if (!scans.length) return null;
      var running = scans.find(function (p) {
        return p.status === 'running';
      });
      if (running) return running;
      return scans.slice().sort(function (a, b) {
        return (b.started_at || 0) - (a.started_at || 0);
      })[0];
    }

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
          startedAt: parseStart(a.started_at),
        };
        (byKind[kind] = byKind[kind] || []).push(node);
      });
      var kinds = Object.keys(Object.assign({}, groupsRaw, byKind));
      var groups = [];
      kinds.forEach(function (kind) {
        var g = ensureObj(groupsRaw[kind]);
        var agents = byKind[kind] || [];
        var running = num(g.running),
          completed = num(g.completed),
          failed = num(g.failed),
          stale = num(g.stale);
        if (!agents.length && !running && !completed && !failed && !stale) return;
        agents.sort(function (a, b) {
          return (
            STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
            (b.elapsedSeconds || 0) - (a.elapsedSeconds || 0)
          );
        });
        groups.push({
          kind: kind,
          label: String(g.label || KIND_LABEL[kind] || kind),
          order: KIND_ORDER[kind] != null ? KIND_ORDER[kind] : 7,
          running: running,
          completed: completed,
          failed: failed,
          stale: stale,
          agents: agents,
        });
      });
      groups.sort(function (a, b) {
        return a.order - b.order;
      });
      return {
        groups: groups,
        runningTotal: num(activity.running_total),
        completedTotal: num(activity.completed_total),
        failedTotal: num(activity.failed_total),
        staleTotal: num(activity.stale_total),
        capacity: activity.capacity == null ? null : num(activity.capacity),
      };
    }

    // ------------------------------------------------------------ agentTree
    var FLOW = {
      COL_W: 224,
      ROW_V: 42,
      WAVE_GAP: 16,
      PAD: 16,
      NODE_W: 188,
      NODE_H: 30,
      BRACKET_DX: 9,
    };
    var PLANNER_RE = /规划|planner/i;
    var STAGE_ORDER = [
      'profile',
      'environment',
      'discovery',
      'ranking',
      'validation',
      'remediation',
    ];
    var SPECIALTY_KEYWORD = {
      memory: '内存',
      parser: '解析',
      authz: '权限',
      authorization: '权限',
      general: '通用',
    };
    function agentStatus(raw) {
      var s = String(raw == null ? '' : raw).toLowerCase();
      if (s === 'stale') return 'stale';
      if (AG_FAILED.indexOf(s) !== -1) return 'failed';
      if (AG_DONE.indexOf(s) !== -1) return 'done';
      if (AG_RUNNING.indexOf(s) !== -1) return 'running';
      return 'idle';
    }
    function stageRank(kind) {
      var i = STAGE_ORDER.indexOf(kind);
      return i === -1 ? STAGE_ORDER.length : i;
    }
    // 阶段汇总 → 中文人话（字段与原始项目各阶段 summary 对齐）
    function summaryText(summary, nodeId) {
      var s = ensureObj(summary);
      function n(v) {
        return v === null || v === undefined ? 0 : v;
      }
      switch (nodeId) {
        case 'profile':
          return (
            '扫描 ' +
            n(s.file_count) +
            ' 个文件 · 高风险 ' +
            n(s.high_risk_count) +
            ' · 待深入 ' +
            n(s.underexplored_count)
          );
        case 'environment':
          return s.environment_ready ? '环境就绪' : '环境未就绪';
        case 'discovery':
          return n(s.candidates) > 0 ? '产出 ' + n(s.candidates) + ' 个候选' : '未产出候选';
        case 'ranking':
          return n(s.queued) > 0 ? n(s.queued) + ' 个进入验证队列' : '暂无进入验证队列的候选';
        case 'validation':
          return n(s.findings) > 0 ? '确认 ' + n(s.findings) + ' 个漏洞' : '未确认漏洞';
        case 'remediation':
          return n(s.total) > 0
            ? '生成修复 ' +
                n(s.total) +
                ' 项 · 已修复 ' +
                n(s.patched) +
                (n(s.failed) ? ' · 失败 ' + n(s.failed) : '')
            : '未生成修复项';
        case 'report':
          return s.present ? '报告已生成' : '报告未生成';
        default:
          return Object.entries(s)
            .map(function (e) {
              return e[0] + ' ' + String(e[1]);
            })
            .join(' · ');
      }
    }

    // ------------------------------------------------------- agentTopology
    var KIND_ORDER = {
      profile: 1,
      environment: 2,
      discovery: 3,
      ranking: 4,
      validation: 5,
      remediation: 6,
      other: 8,
    };
    var KIND_LABEL = {
      profile: '画像/情报',
      environment: '环境建立',
      discovery: '候选发现',
      ranking: '候选排序',
      validation: '验证确认',
      remediation: '修复建议',
      other: '其他 Agent',
    };
    var AG_RUNNING = ['running', 'in_progress', 'started', 'active'];
    var AG_DONE = ['done', 'completed', 'succeeded', 'success', 'finished', 'ok', 'passed'];
    var AG_FAILED = [
      'failed',
      'error',
      'errored',
      'crashed',
      'timeout',
      'timed_out',
      'cancelled',
      'aborted',
    ];
    function groupWaves(workers) {
      var sorted = workers.slice().sort(function (a, b) {
        if (a.startedAt == null && b.startedAt == null) return 0;
        if (a.startedAt == null) return 1;
        if (b.startedAt == null) return -1;
        return a.startedAt - b.startedAt;
      });
      var waves = [],
        curEnd = null;
      sorted.forEach(function (w) {
        var start = w.startedAt,
          end = endOf(w);
        if (waves.length && start != null && curEnd != null && start < curEnd) {
          waves[waves.length - 1].push(w);
          if (end != null) curEnd = Math.max(curEnd, end);
        } else {
          waves.push([w]);
          curEnd = end;
        }
      });
      return waves;
    }
    function layoutAgentFlow(projectName, stages) {
      var COL_W = FLOW.COL_W,
        ROW_V = FLOW.ROW_V,
        WAVE_GAP = FLOW.WAVE_GAP,
        PAD = FLOW.PAD;
      var NODE_W = FLOW.NODE_W,
        NODE_H = FLOW.NODE_H,
        BRACKET_DX = FLOW.BRACKET_DX;
      var ordered = stages.slice().sort(function (a, b) {
        return stageRank(a.kind) - stageRank(b.kind);
      });
      var nodes = [],
        edges = [],
        brackets = [];
      var colX = function (col) {
        return PAD + col * COL_W;
      };
      var headerY = PAD + NODE_H / 2;
      nodes.push({
        id: 'project',
        label: projectName || '扫描',
        kind: 'project',
        role: 'project',
        status: 'root',
        elapsedSeconds: null,
        x: colX(0),
        y: headerY,
      });
      var placed = [],
        maxBottom = headerY + NODE_H / 2;
      var nodeById = {};
      nodeById['project'] = nodes[nodes.length - 1];
      ordered.forEach(function (stage, i) {
        var col = i + 1,
          x = colX(col);
        var headerId = 'stage:' + stage.kind;
        nodes.push({
          id: headerId,
          label: stage.label,
          kind: stage.kind,
          role: 'stage',
          status: stage.status,
          elapsedSeconds: null,
          x: x,
          y: headerY,
        });
        nodeById[headerId] = nodes[nodes.length - 1];
        var planners = stage.agents.filter(function (a) {
          return PLANNER_RE.test(a.label);
        });
        var workers = stage.agents.filter(function (a) {
          return !PLANNER_RE.test(a.label);
        });
        var hasPlanner = planners.length === 1;
        var y = headerY,
          plannerId = null;
        if (hasPlanner) {
          y += ROW_V;
          var p = planners[0];
          plannerId = 'planner:' + stage.kind + ':' + p.label;
          nodes.push({
            id: plannerId,
            label: p.label,
            kind: stage.kind,
            role: 'planner',
            status: p.status,
            elapsedSeconds: p.elapsedSeconds,
            x: x,
            y: y,
          });
          nodeById[plannerId] = nodes[nodes.length - 1];
          edges.push(dispatch(headerId, plannerId, x, headerY, y, p.status));
          maxBottom = Math.max(maxBottom, y + NODE_H / 2);
        }
        var waves = groupWaves(workers);
        waves.forEach(function (wave, wi) {
          if (wi > 0) y += WAVE_GAP;
          var parallel = wave.length > 1;
          var groupTop = y + ROW_V - NODE_H / 2,
            lastY = y;
          wave.forEach(function (w) {
            y += ROW_V;
            lastY = y;
            var id = 'agent:' + stage.kind + ':' + w.label;
            nodes.push({
              id: id,
              label: w.label,
              kind: stage.kind,
              role: 'agent',
              status: w.status,
              elapsedSeconds: w.elapsedSeconds,
              x: x,
              y: y,
              wave: wi,
              parallel: parallel,
            });
            nodeById[id] = nodes[nodes.length - 1];
            var fromY = hasPlanner ? nodeById[plannerId].y : headerY;
            edges.push(dispatch(hasPlanner ? plannerId : headerId, id, x, fromY, y, w.status));
            maxBottom = Math.max(maxBottom, y + NODE_H / 2);
          });
          if (parallel)
            brackets.push({
              id: 'wave:' + stage.kind + ':' + wi,
              x: x - BRACKET_DX,
              y1: groupTop,
              y2: lastY + NODE_H / 2,
              count: wave.length,
              status: stage.status,
            });
        });
        placed.push({
          kind: stage.kind,
          status: stage.status,
          headerId: headerId,
          minStart: minStart(workers),
          maxEnd: maxEnd(workers),
        });
      });
      var prevId = 'project',
        prevEnd = null;
      placed.forEach(function (st) {
        var streaming = prevEnd != null && st.minStart != null && st.minStart < prevEnd;
        edges.push({
          fromId: prevId,
          toId: st.headerId,
          kind: prevId === 'project' ? 'pipeline' : streaming ? 'stream' : 'pipeline',
          status: st.status,
          x1: ((nodeById[prevId] || {}).x || 0) + NODE_W,
          y1: headerY,
          x2: (nodeById[st.headerId] || {}).x || 0,
          y2: headerY,
        });
        prevId = st.headerId;
        prevEnd = st.maxEnd;
      });
      var discoveryAgents = nodes.filter(function (n) {
        return n.kind === 'discovery' && (n.role === 'agent' || n.role === 'planner');
      });
      nodes.forEach(function (v) {
        if (v.kind !== 'validation' || v.role !== 'agent') return;
        var m = /discover-\d+-([a-z]+)-shard/i.exec(v.label);
        if (!m) return;
        var keyword = SPECIALTY_KEYWORD[m[1].toLowerCase()];
        if (!keyword) return;
        var src = null;
        for (var i = 0; i < discoveryAgents.length; i++) {
          if (discoveryAgents[i].label.indexOf(keyword) !== -1) {
            src = discoveryAgents[i];
            break;
          }
        }
        if (!src) return;
        edges.push({
          fromId: src.id,
          toId: v.id,
          kind: 'context',
          status: v.status,
          x1: src.x + NODE_W,
          y1: src.y,
          x2: v.x,
          y2: v.y,
        });
      });
      var width = PAD * 2 + (ordered.length + 1) * COL_W - (COL_W - NODE_W);
      var height = Math.max(headerY + NODE_H / 2, maxBottom) + PAD;
      return { nodes: nodes, edges: edges, brackets: brackets, width: width, height: height };
    }
    function edgePathD(e) {
      if (e.kind === 'dispatch') {
        var dy = Math.max(12, (e.y2 - e.y1) / 2);
        return (
          'M ' +
          e.x1 +
          ' ' +
          e.y1 +
          ' C ' +
          e.x1 +
          ' ' +
          (e.y1 + dy) +
          ', ' +
          e.x2 +
          ' ' +
          (e.y2 - dy) +
          ', ' +
          e.x2 +
          ' ' +
          e.y2
        );
      }
      var dx = Math.max(16, (e.x2 - e.x1) / 2);
      return (
        'M ' +
        e.x1 +
        ' ' +
        e.y1 +
        ' C ' +
        (e.x1 + dx) +
        ' ' +
        e.y1 +
        ', ' +
        (e.x2 - dx) +
        ' ' +
        e.y2 +
        ', ' +
        e.x2 +
        ' ' +
        e.y2
      );
    }
    function minStart(agents) {
      var xs = agents
        .map(function (a) {
          return a.startedAt;
        })
        .filter(function (v) {
          return v != null;
        });
      return xs.length ? Math.min.apply(null, xs) : null;
    }
    function parseStart(value) {
      if (value == null || value === '') return null;
      var t = Date.parse(String(value));
      return Number.isFinite(t) ? t : null;
    }
    var STATUS_RANK = { running: 0, stale: 1, failed: 2, done: 3, idle: 4 };
    function endOf(a) {
      return a.startedAt == null ? null : a.startedAt + (a.elapsedSeconds || 0) * 1000;
    }
    function dispatch(fromId, toId, x, fromY, toY, status) {
      var cx = x + FLOW.NODE_W / 2;
      return {
        fromId: fromId,
        toId: toId,
        kind: 'dispatch',
        status: status,
        x1: cx,
        y1: fromY + FLOW.NODE_H / 2,
        x2: cx,
        y2: toY - FLOW.NODE_H / 2,
      };
    }

    // ============================================================== shell
    var SECTIONS = [
      {
        title: '安全态势',
        items: [
          { id: 'dashboard', label: '总览', desc: '全局风险与治理趋势', icon: 'shield', path: '/' },
          {
            id: 'targets',
            label: '被测对象',
            desc: '长期安全档案',
            icon: 'project',
            path: '/targets',
          },
        ],
      },
      {
        title: '漏洞扫描',
        items: [
          {
            id: 'code',
            label: '代码安全',
            desc: '代码与依赖漏洞检测',
            icon: 'code',
            path: '/scan/code',
          },
          {
            id: 'app',
            label: '应用安全',
            desc: '二进制与无代码组件检测',
            icon: 'box',
            path: '/scan/app',
          },
          {
            id: 'web',
            label: 'Web 安全',
            desc: '在线站点安全基线',
            icon: 'network',
            path: '/scan/web',
          },
        ],
      },
      {
        title: '系统配置',
        items: [
          { id: 'models', label: '模型管理', desc: '模型连接配置', icon: 'box', path: '/models' },
        ],
      },
    ];
    function WorkflowTopologyHtml(nodes) {
      var out = '';
      nodes.forEach(function (node, idx) {
        if (idx > 0) out += '<span class="topo-connector"></span>';
        var glyph =
          node.status === 'idle'
            ? idx + 1
            : { done: '✓', running: '●', failed: '✕', skipped: '–' }[node.status] || '·';
        out +=
          '<div class="topo-node" data-state="' +
          esc(node.status) +
          '">' +
          '<div class="topo-dot">' +
          glyph +
          '</div>' +
          '<div class="topo-copy"><div class="topo-label">' +
          esc(LABEL_BY_ID[node.id] || node.id) +
          '</div>' +
          '<div class="topo-summary">' +
          esc(summaryText(node.summary) || '待运行') +
          '</div></div></div>';
      });
      return '<div class="topology">' + out + '</div>';
    }
    function AgentTreeHtml(layout) {
      var NODE_W = FLOW.NODE_W,
        NODE_H = FLOW.NODE_H;
      var glyphFor = {
        done: '✓',
        running: '●',
        failed: '✕',
        stale: '!',
        skipped: '–',
        idle: '·',
        root: '◆',
      };
      var edgesSvg = '';
      layout.brackets.forEach(function (b) {
        var w = 7;
        edgesSvg +=
          '<g class="atree-bracket" data-state="' +
          esc(b.status) +
          '">' +
          '<path d="M ' +
          (b.x + w) +
          ' ' +
          b.y1 +
          ' H ' +
          b.x +
          ' V ' +
          b.y2 +
          ' H ' +
          (b.x + w) +
          '" fill="none"/>' +
          '<text x="' +
          (b.x - 3) +
          '" y="' +
          (b.y1 + b.y2) / 2 +
          '" class="atree-bracket-tag">∥' +
          b.count +
          '</text></g>';
      });
      layout.edges.forEach(function (e) {
        edgesSvg +=
          '<path class="atree-edge" data-kind="' +
          esc(e.kind) +
          '" data-state="' +
          esc(e.status) +
          '" d="' +
          edgePathD(e) +
          '" fill="none" marker-end="url(#atree-arrow)"/>';
      });
      var boxes = layout.nodes
        .map(function (n) {
          var glyph = glyphFor[n.status] || '·';
          return (
            '<div class="atree-node" data-role="' +
            esc(n.role) +
            '" data-state="' +
            esc(n.status) +
            '"' +
            (n.parallel ? ' data-parallel="1"' : '') +
            ' style="left:' +
            n.x +
            'px;top:' +
            (n.y - NODE_H / 2) +
            'px;width:' +
            NODE_W +
            'px;height:' +
            NODE_H +
            'px">' +
            '<span class="atree-dot">' +
            glyph +
            '</span>' +
            '<span class="atree-label" title="' +
            esc(n.label) +
            '">' +
            esc(n.label) +
            '</span>' +
            (n.role === 'planner' ? '<span class="atree-tag">规划</span>' : '') +
            (n.elapsedSeconds != null && n.status === 'running'
              ? '<span class="atree-time mono">' + fmtDuration(n.elapsedSeconds) + '</span>'
              : '') +
            '</div>'
          );
        })
        .join('');
      return (
        '<div class="atree" style="width:' +
        layout.width +
        'px;height:' +
        layout.height +
        'px;min-width:' +
        layout.width +
        'px">' +
        '<svg class="atree-edges" width="' +
        layout.width +
        '" height="' +
        layout.height +
        '">' +
        '<defs><marker id="atree-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" class="atree-arrowhead"/></marker></defs>' +
        edgesSvg +
        '</svg>' +
        boxes +
        '</div>'
      );
    }

    // 一张完整的工作流图：阶段骨架（状态+summary）+ 自动展开（运行/失败/Agent在跑的阶段挂 Agent 明细）
    // + 当前指针（运行信息并入：正在执行的节点 message 显示在展开区顶部）。
    var WF_EXPAND_KEY = 'wfExpand';
    function WorkflowMap(job) {
      var artifacts = D.artifactsByJob[job.id] || {};
      var nodes = D.nodesByJob[job.id] || [];
      var overall = job.status;
      var doneCount = nodes.filter(function (n) {
        return n.status === 'done';
      }).length;
      var totalCount = nodes.length;
      var currentNode = nodes.find(function (n) {
        return n.status === 'running';
      });
      var currentLabel = currentNode ? LABEL_BY_ID[currentNode.id] || currentNode.id : null;
      var currentMessage = currentNode ? String(currentNode.message || '').trim() : '';
      var OVERALL_LABEL = { running: '运行中', succeeded: '已完成', failed: '已失败' };

      // agent per kind（静态快照，已完成 stage 的残留 running agent 归位为 done）
      var topology = deriveAgentTopology(artifacts);
      var acc = {};
      topology.groups.forEach(function (g) {
        var bucket = {};
        (acc[g.kind] || []).forEach(function (a) {
          bucket[a.label] = a;
        });
        g.agents.forEach(function (a) {
          bucket[a.label] = {
            label: a.label,
            status: a.status,
            elapsedSeconds:
              a.elapsedSeconds != null
                ? a.elapsedSeconds
                : bucket[a.label]
                  ? bucket[a.label].elapsedSeconds
                  : null,
            startedAt:
              a.startedAt != null
                ? a.startedAt
                : bucket[a.label]
                  ? bucket[a.label].startedAt
                  : null,
          };
        });
        acc[g.kind] = Object.values(bucket);
      });
      var stageStatus = {};
      nodes.forEach(function (n) {
        stageStatus[n.id] = n.status;
      });
      var agentsByStage = {};
      Object.keys(acc).forEach(function (kind) {
        var st = stageStatus[kind] || 'idle';
        var list = acc[kind].map(function (a) {
          if (st === 'done') {
            if (a.status === 'running' || a.status === 'idle')
              return Object.assign({}, a, { status: 'done' });
          } else if (st === 'failed') {
            if (a.status === 'running') return Object.assign({}, a, { status: 'failed' });
          }
          return a;
        });
        list.sort(function (a, b) {
          return (
            (STATUS_RANK[a.status] != null ? STATUS_RANK[a.status] : 9) -
            (STATUS_RANK[b.status] != null ? STATUS_RANK[b.status] : 9)
          );
        });
        agentsByStage[kind] = list;
      });

      var glyph = { done: '✓', running: '●', failed: '✕', skipped: '–', idle: '·' };
      var agGlyph = { done: '✓', running: '●', failed: '✕', stale: '!', idle: '·' };

      // 主从布局：仅"有二级记录（Agent）"的步骤可点开；默认选中运行中节点，否则首个有二级记录的节点
      var hasDetail = {};
      nodes.forEach(function (n) {
        hasDetail[n.id] = (agentsByStage[n.id] || []).length > 0;
      });
      var selId =
        STATE.wfSelected && hasDetail[STATE.wfSelected]
          ? STATE.wfSelected
          : currentNode && hasDetail[currentNode.id]
            ? currentNode.id
            : (function () {
                var f = nodes.find(function (n) {
                  return hasDetail[n.id];
                });
                return f ? f.id : null;
              })();

      function buildWfDetail(node) {
        var st = node.status;
        var label = LABEL_BY_ID[node.id] || node.id;
        var agents = agentsByStage[node.id] || [];
        var isCurrent = node.id === (currentNode && currentNode.id);
        var msg = '';
        if (isCurrent && currentMessage) {
          msg =
            '<div class="wf-msg"><span class="activity-dot"></span><span class="badge b-info">' +
            esc(currentLabel) +
            '</span>' +
            '<span class="wf-msg-text">' +
            esc(currentMessage) +
            '</span></div>';
        } else if (st === 'failed') {
          msg =
            '<div class="wf-msg fail">' +
            icon('alert', 12) +
            '<span class="wf-msg-text">节点执行失败</span></div>';
        }
        var chips = agents
          .map(function (a) {
            return (
              '<span class="agent-chip ' +
              esc(a.kind || 'other') +
              '" data-agst="' +
              esc(a.status) +
              '">' +
              '<i class="ag-dot">' +
              (agGlyph[a.status] || '·') +
              '</i>' +
              esc(a.label) +
              (a.elapsedSeconds != null
                ? '<b class="mono">' + fmtDuration(a.elapsedSeconds) + '</b>'
                : '') +
              '</span>'
            );
          })
          .join('');
        var runCount = agents.filter(function (a) {
          return a.status === 'running' || a.status === 'stale';
        }).length;
        var failCount = agents.filter(function (a) {
          return a.status === 'failed';
        }).length;
        return (
          '<div class="wf-detail" data-state="' +
          esc(st) +
          '">' +
          '<div class="wf-detail-head"><span class="wf-dot">' +
          (glyph[st] || '·') +
          '</span>' +
          '<span class="wf-label">' +
          esc(label) +
          '</span>' +
          (isCurrent
            ? '<span class="status running"><span class="pulse"></span>进行中</span>'
            : '') +
          '</div>' +
          msg +
          (agents.length
            ? '<div class="wf-chips">' + chips + '</div>'
            : '<div class="muted xs" style="padding:4px 2px">本阶段暂无 Agent 二级记录</div>') +
          (runCount || failCount
            ? '<div class="muted xs mono" style="padding:2px 0 0">' +
              runCount +
              ' 在跑' +
              (failCount ? ' · ' + failCount + ' 失败' : '') +
              '</div>'
            : '') +
          '</div>'
        );
      }

      var railHtml = '';
      nodes.forEach(function (node) {
        var label = LABEL_BY_ID[node.id] || node.id;
        var st = node.status;
        var agents = agentsByStage[node.id] || [];
        var isCurrent = node.id === (currentNode && currentNode.id);
        var sel = node.id === selId;
        var inner =
          '<span class="wf-dot">' +
          (glyph[st] || '·') +
          '</span>' +
          '<span class="wf-copy"><span class="wf-label">' +
          esc(label) +
          '</span>' +
          '<span class="wf-summary">' +
          esc(summaryText(node.summary) || (st === 'idle' ? '待运行' : '')) +
          '</span></span>' +
          (agents.length ? '<span class="wf-badge">' + agents.length + '</span>' : '');
        if (agents.length) {
          railHtml +=
            '<button type="button" class="wf-step' +
            (isCurrent ? ' current' : '') +
            (sel ? ' selected' : '') +
            '" data-state="' +
            esc(st) +
            '" data-wf-step="' +
            esc(node.id) +
            '" title="' +
            esc(label) +
            '（查看二级记录）">' +
            inner +
            '</button>';
        } else {
          railHtml +=
            '<div class="wf-step disabled" data-state="' +
            esc(st) +
            '" title="' +
            esc(label) +
            '（暂无二级记录）">' +
            inner +
            '</div>';
        }
      });

      var selNode = nodes.find(function (n) {
        return n.id === selId;
      });
      var detailHtml = selNode
        ? buildWfDetail(selNode)
        : '<div class="muted xs" style="padding:12px;border:1px dashed var(--line);border-radius:var(--r)">暂无二级记录</div>';

      var validationNode = nodes.find(function (n) {
        return n.id === 'validation';
      });
      var remediationNode = nodes.find(function (n) {
        return n.id === 'remediation';
      });
      var findingsCount =
        validationNode && validationNode.summary ? validationNode.summary.findings : null;
      var patchesCount =
        remediationNode && remediationNode.summary
          ? remediationNode.summary.patched != null
            ? remediationNode.summary.patched
            : remediationNode.summary.total
          : null;

      return (
        '<div class="card"><div class="card-h">' +
        '<div class="flex"><h3>工作流</h3>' +
        (overall === 'running'
          ? '<span class="status running"><span class="pulse"></span>live</span>'
          : '') +
        '</div>' +
        '<span class="muted xs mono">' +
        esc(OVERALL_LABEL[overall] || overall) +
        ' · ' +
        doneCount +
        '/' +
        totalCount +
        ' 节点完成' +
        (findingsCount != null ? ' · ' + findingsCount + ' 漏洞' : '') +
        (patchesCount != null ? ' · ' + patchesCount + ' 修复' : '') +
        '</span></div>' +
        '<div class="card-b">' +
        '<div class="bar-track" style="margin-bottom:14px"><div class="bar-fill" style="width:' +
        Math.round(job.progress || 0) +
        '%"></div></div>' +
        '<div class="wf-split">' +
        '<div class="wf-rail">' +
        railHtml +
        '</div>' +
        '<div class="wf-detail-pane">' +
        detailHtml +
        '</div>' +
        '</div>' +
        '</div></div>'
      );
    }

    function WorkflowTopologyCards(job) {
      var artifacts = D.artifactsByJob[job.id] || {};
      var nodes = D.nodesByJob[job.id] || [];
      var overall = job.status;
      var doneCount = nodes.filter(function (n) {
        return n.status === 'done';
      }).length;
      var totalCount = nodes.length;
      var currentNode = nodes.find(function (n) {
        return n.status === 'running';
      });
      var currentLabel = currentNode ? LABEL_BY_ID[currentNode.id] || currentNode.id : null;
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
          (acc[g.kind] || []).forEach(function (a) {
            bucket[a.label] = a;
          });
          g.agents.forEach(function (a) {
            bucket[a.label] = {
              label: a.label,
              status: a.status,
              elapsedSeconds:
                a.elapsedSeconds != null
                  ? a.elapsedSeconds
                  : bucket[a.label]
                    ? bucket[a.label].elapsedSeconds
                    : null,
              startedAt:
                a.startedAt != null
                  ? a.startedAt
                  : bucket[a.label]
                    ? bucket[a.label].startedAt
                    : null,
            };
          });
          acc[g.kind] = Object.values(bucket);
        });
        var TREE_DEFS = [
          ['profile', '画像/情报'],
          ['environment', '环境建立'],
          ['discovery', '候选发现'],
          ['ranking', '候选排序'],
          ['validation', '验证确认'],
          ['remediation', '修复建议'],
        ];
        var stageStatus = {};
        nodes.forEach(function (n) {
          stageStatus[n.id] = n.status;
        });
        var treeStages = TREE_DEFS.map(function (def) {
          var status = stageStatus[def[0]] || 'idle';
          var agents = (acc[def[0]] || []).map(function (a) {
            if (status === 'done') {
              if (a.status === 'running' || a.status === 'idle')
                return Object.assign({}, a, { status: 'done' });
            } else if (status === 'failed') {
              if (a.status === 'running') return Object.assign({}, a, { status: 'failed' });
            }
            return a;
          });
          agents.sort(function (a, b) {
            return (
              (STATUS_RANK[a.status] != null ? STATUS_RANK[a.status] : 9) -
              (STATUS_RANK[b.status] != null ? STATUS_RANK[b.status] : 9)
            );
          });
          return { kind: def[0], label: def[1], status: status, agents: agents };
        });
        if (acc.other && acc.other.length)
          treeStages.push({
            kind: 'other',
            label: '其他 Agent',
            status: 'running',
            agents: acc.other,
          });
        var layout = layoutAgentFlow(job.name, treeStages);
        bodyHtml = '<div class="atree-scroll">' + AgentTreeHtml(layout) + '</div>';
      }

      var validationNode = nodes.find(function (n) {
        return n.id === 'validation';
      });
      var remediationNode = nodes.find(function (n) {
        return n.id === 'remediation';
      });
      var findingsCount =
        validationNode && validationNode.summary ? validationNode.summary.findings : null;
      var patchesCount =
        remediationNode && remediationNode.summary
          ? remediationNode.summary.patched != null
            ? remediationNode.summary.patched
            : remediationNode.summary.total
          : null;

      var runInfo;
      if (currentNode) {
        runInfo =
          '<div class="activity-row"><div class="activity-dot"></div><div class="activity-main">' +
          '<div class="activity-head"><span class="badge b-info">' +
          esc(currentLabel) +
          '</span></div>' +
          '<div class="activity-title">' +
          esc(currentMessage || '正在执行：' + currentLabel) +
          '</div></div></div>';
      } else {
        runInfo =
          '<div class="muted" style="padding:12px">' +
          (overall === 'succeeded'
            ? '扫描已完成，工作流各节点状态见上方拓扑。'
            : overall === 'failed'
              ? '扫描已结束（失败），详见任务详情。'
              : '等待节点开始执行…') +
          '</div>';
      }

      return (
        '<div class="card"><div class="card-h">' +
        '<div class="flex"><h3>工作流拓扑</h3>' +
        (overall === 'running'
          ? '<span class="status running"><span class="pulse"></span>live</span>'
          : '') +
        '</div>' +
        '<div class="flex">' +
        '<div class="seg" role="tablist" aria-label="拓扑视图切换">' +
        '<button type="button" role="tab" data-sv="agent" class="' +
        (view === 'agent' ? 'on' : '') +
        '">Agent</button>' +
        '<button type="button" role="tab" data-sv="stage" class="' +
        (view === 'stage' ? 'on' : '') +
        '">阶段</button>' +
        '</div>' +
        '<span class="muted xs mono">' +
        esc(OVERALL_LABEL[overall] || overall) +
        ' · ' +
        doneCount +
        '/' +
        totalCount +
        ' 节点完成</span>' +
        '</div></div><div class="card-b">' +
        bodyHtml +
        '</div></div>' +
        '<div class="card"><div class="card-h"><h3>运行信息</h3><span class="muted xs mono">' +
        (findingsCount != null ? findingsCount + ' 漏洞' : '0 漏洞') +
        (patchesCount != null ? ' · ' + patchesCount + ' 修复' : '') +
        '</span></div><div class="card-b">' +
        runInfo +
        '</div></div>'
      );
    }
    // ------------------------------------------------------ projects view
    function WorkflowTopologyCards(job) {
      var artifacts = D.artifactsByJob[job.id] || {};
      var nodes = D.nodesByJob[job.id] || [];
      var overall = job.status;
      var doneCount = nodes.filter(function (n) {
        return n.status === 'done';
      }).length;
      var totalCount = nodes.length;
      var currentNode = nodes.find(function (n) {
        return n.status === 'running';
      });
      var currentLabel = currentNode ? LABEL_BY_ID[currentNode.id] || currentNode.id : null;
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
          (acc[g.kind] || []).forEach(function (a) {
            bucket[a.label] = a;
          });
          g.agents.forEach(function (a) {
            bucket[a.label] = {
              label: a.label,
              status: a.status,
              elapsedSeconds:
                a.elapsedSeconds != null
                  ? a.elapsedSeconds
                  : bucket[a.label]
                    ? bucket[a.label].elapsedSeconds
                    : null,
              startedAt:
                a.startedAt != null
                  ? a.startedAt
                  : bucket[a.label]
                    ? bucket[a.label].startedAt
                    : null,
            };
          });
          acc[g.kind] = Object.values(bucket);
        });
        var TREE_DEFS = [
          ['profile', '画像/情报'],
          ['environment', '环境建立'],
          ['discovery', '候选发现'],
          ['ranking', '候选排序'],
          ['validation', '验证确认'],
          ['remediation', '修复建议'],
        ];
        var stageStatus = {};
        nodes.forEach(function (n) {
          stageStatus[n.id] = n.status;
        });
        var treeStages = TREE_DEFS.map(function (def) {
          var status = stageStatus[def[0]] || 'idle';
          var agents = (acc[def[0]] || []).map(function (a) {
            if (status === 'done') {
              if (a.status === 'running' || a.status === 'idle')
                return Object.assign({}, a, { status: 'done' });
            } else if (status === 'failed') {
              if (a.status === 'running') return Object.assign({}, a, { status: 'failed' });
            }
            return a;
          });
          agents.sort(function (a, b) {
            return (
              (STATUS_RANK[a.status] != null ? STATUS_RANK[a.status] : 9) -
              (STATUS_RANK[b.status] != null ? STATUS_RANK[b.status] : 9)
            );
          });
          return { kind: def[0], label: def[1], status: status, agents: agents };
        });
        if (acc.other && acc.other.length)
          treeStages.push({
            kind: 'other',
            label: '其他 Agent',
            status: 'running',
            agents: acc.other,
          });
        var layout = layoutAgentFlow(job.name, treeStages);
        bodyHtml = '<div class="atree-scroll">' + AgentTreeHtml(layout) + '</div>';
      }

      var validationNode = nodes.find(function (n) {
        return n.id === 'validation';
      });
      var remediationNode = nodes.find(function (n) {
        return n.id === 'remediation';
      });
      var findingsCount =
        validationNode && validationNode.summary ? validationNode.summary.findings : null;
      var patchesCount =
        remediationNode && remediationNode.summary
          ? remediationNode.summary.patched != null
            ? remediationNode.summary.patched
            : remediationNode.summary.total
          : null;

      var runInfo;
      if (currentNode) {
        runInfo =
          '<div class="activity-row"><div class="activity-dot"></div><div class="activity-main">' +
          '<div class="activity-head"><span class="badge b-info">' +
          esc(currentLabel) +
          '</span></div>' +
          '<div class="activity-title">' +
          esc(currentMessage || '正在执行：' + currentLabel) +
          '</div></div></div>';
      } else {
        runInfo =
          '<div class="muted" style="padding:12px">' +
          (overall === 'succeeded'
            ? '扫描已完成，工作流各节点状态见上方拓扑。'
            : overall === 'failed'
              ? '扫描已结束（失败），详见任务详情。'
              : '等待节点开始执行…') +
          '</div>';
      }

      return (
        '<div class="card"><div class="card-h">' +
        '<div class="flex"><h3>工作流拓扑</h3>' +
        (overall === 'running'
          ? '<span class="status running"><span class="pulse"></span>live</span>'
          : '') +
        '</div>' +
        '<div class="flex">' +
        '<div class="seg" role="tablist" aria-label="拓扑视图切换">' +
        '<button type="button" role="tab" data-sv="agent" class="' +
        (view === 'agent' ? 'on' : '') +
        '">Agent</button>' +
        '<button type="button" role="tab" data-sv="stage" class="' +
        (view === 'stage' ? 'on' : '') +
        '">阶段</button>' +
        '</div>' +
        '<span class="muted xs mono">' +
        esc(OVERALL_LABEL[overall] || overall) +
        ' · ' +
        doneCount +
        '/' +
        totalCount +
        ' 节点完成</span>' +
        '</div></div><div class="card-b">' +
        bodyHtml +
        '</div></div>' +
        '<div class="card"><div class="card-h"><h3>运行信息</h3><span class="muted xs mono">' +
        (findingsCount != null ? findingsCount + ' 漏洞' : '0 漏洞') +
        (patchesCount != null ? ' · ' + patchesCount + ' 修复' : '') +
        '</span></div><div class="card-b">' +
        runInfo +
        '</div></div>'
      );
    }
    function StagePipeline(stages, compact) {
      return (
        '<div class="pipeline' +
        (compact ? ' compact' : '') +
        '">' +
        stages
          .map(function (s, idx) {
            var cls =
              ['done', 'running', 'failed', 'skipped'].indexOf(s.state) !== -1 ? s.state : 'queued';
            var node =
              s.state === 'done'
                ? icon('check', 16)
                : s.state === 'failed'
                  ? icon('x', 14)
                  : s.state === 'running'
                    ? '<span>' + (idx + 1) + '</span>'
                    : s.state === 'skipped'
                      ? '<span class="muted" style="font-size:10px">跳过</span>'
                      : '<span style="font-size:11px">' + (idx + 1) + '</span>';
            return (
              '<div class="stage ' +
              cls +
              '"><div class="node">' +
              node +
              '</div>' +
              '<div class="stage-copy"><div class="label">' +
              esc(s.label) +
              '</div>' +
              (!compact && s.hint ? '<div class="hint">' + esc(s.hint) + '</div>' : '') +
              '</div></div>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    // ============================================================== views
    function buildWfDetail(node) {
      var st = node.status;
      var label = LABEL_BY_ID[node.id] || node.id;
      var agents = agentsByStage[node.id] || [];
      var isCurrent = node.id === (currentNode && currentNode.id);
      var msg = '';
      if (isCurrent && currentMessage) {
        msg =
          '<div class="wf-msg"><span class="activity-dot"></span><span class="badge b-info">' +
          esc(currentLabel) +
          '</span>' +
          '<span class="wf-msg-text">' +
          esc(currentMessage) +
          '</span></div>';
      } else if (st === 'failed') {
        msg =
          '<div class="wf-msg fail">' +
          icon('alert', 12) +
          '<span class="wf-msg-text">节点执行失败</span></div>';
      }
      var chips = agents
        .map(function (a) {
          return (
            '<span class="agent-chip ' +
            esc(a.kind || 'other') +
            '" data-agst="' +
            esc(a.status) +
            '">' +
            '<i class="ag-dot">' +
            (agGlyph[a.status] || '·') +
            '</i>' +
            esc(a.label) +
            (a.elapsedSeconds != null
              ? '<b class="mono">' + fmtDuration(a.elapsedSeconds) + '</b>'
              : '') +
            '</span>'
          );
        })
        .join('');
      var runCount = agents.filter(function (a) {
        return a.status === 'running' || a.status === 'stale';
      }).length;
      var failCount = agents.filter(function (a) {
        return a.status === 'failed';
      }).length;
      return (
        '<div class="wf-detail" data-state="' +
        esc(st) +
        '">' +
        '<div class="wf-detail-head"><span class="wf-dot">' +
        (glyph[st] || '·') +
        '</span>' +
        '<span class="wf-label">' +
        esc(label) +
        '</span>' +
        (isCurrent ? '<span class="status running"><span class="pulse"></span>进行中</span>' : '') +
        '</div>' +
        msg +
        (agents.length
          ? '<div class="wf-chips">' + chips + '</div>'
          : '<div class="muted xs" style="padding:4px 2px">本阶段暂无 Agent 二级记录</div>') +
        (runCount || failCount
          ? '<div class="muted xs mono" style="padding:2px 0 0">' +
            runCount +
            ' 在跑' +
            (failCount ? ' · ' + failCount + ' 失败' : '') +
            '</div>'
          : '') +
        '</div>'
      );
    }

    // ------------------------------------------------------------ overview
    function ConfigRow(label, value, mono) {
      var v = value || '—';
      return (
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;min-width:0">' +
        '<span class="muted xs" style="flex-shrink:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.06em;text-transform:uppercase">' +
        esc(label) +
        '</span>' +
        '<span class="b xs ' +
        (mono ? 'mono' : '') +
        ' config-val" title="' +
        esc(v) +
        '" style="text-align:right;color:var(--text);flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">' +
        esc(v) +
        '</span></div>'
      );
    }
    function cweTag(cwe) {
      if (!cwe) return '';
      var name = CWE_NAMES[cwe] || '';
      return (
        '<span class="badge b-info"><span class="mono">' +
        esc(cwe) +
        '</span>' +
        (name ? ' ' + esc(name) : '') +
        '</span>'
      );
    }

    // 报告仪表盘用：简化三行布局（扫视层），完整内容在点击后的详情抽屉里。
    // 漏洞：行1 严重度+类型(左) / 置信度+ID(右)；行2 标题；行3 描述。
    // 修复：行1 扳手+「修复建议」(左) / 状态+建议ID(右)；行2 摘要；行3 测试结果。
    // ------------------------------------------------------ agent activity
    function findingToMarkdown(f) {
      var lines = ['# ' + f.title, ''];
      lines.push('- ID: ' + f.id);
      lines.push('- 严重度: ' + f.severity);
      if (f.category) lines.push('- 分类: ' + f.category);
      if (f.cwe) lines.push('- CWE: ' + f.cwe);
      if (f.file && f.file !== '—') lines.push('- 位置: ' + f.file + ':' + f.line);
      if (typeof f.confidence === 'number')
        lines.push('- 置信度: ' + (f.confidence * 100).toFixed(0) + '%');
      if (f.status) lines.push('- 状态: ' + f.status);
      lines.push('');
      if (f.description) lines.push('## 描述', '', f.description, '');
      if (f.impact) lines.push('## 潜在影响', '', f.impact, '');
      if (f.recommendation) lines.push('## 修复建议', '', f.recommendation, '');
      var code = (f.code_snippet || [])
        .map(function (r) {
          return r.text;
        })
        .join('\n');
      if (code.trim()) lines.push('## 问题代码', '', '```', code, '```', '');
      var diff = diffText(f.patch_diff);
      if (diff.trim()) lines.push('## 建议 Patch', '', '```', diff, '```', '');
      return lines.join('\n');
    }
    function reportToMarkdown(project, findings, probes, patches) {
      var order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      var sorted = findings.slice().sort(function (a, b) {
        return order[a.severity] - order[b.severity];
      });
      var sev = project.severity || {};
      var lines = [];
      lines.push('# 书安 安全扫描报告 — ' + project.name, '');
      if (project.description) lines.push(project.description, '');
      lines.push('## 元信息', '');
      lines.push('- 扫描 ID: ' + project.id);
      lines.push(
        '- 模式: ' +
          sceneMode(project) +
          (project.phase_label ? '（' + project.phase_label + '）' : ''),
      );
      lines.push('- 目标: ' + project.target);
      lines.push('- 大模型: ' + (project.model_config || '服务器环境变量'));
      lines.push('- 开始时间: ' + fmtAbs(project.started_at));
      lines.push('- 耗时: ' + (project.duration ? fmtDuration(project.duration) : '进行中'));
      lines.push('', '## 1. 总览', '');
      lines.push(
        '本次扫描共生成 ' +
          project.metrics.candidates +
          ' 个候选，沉淀 ' +
          project.metrics.probes +
          ' 条验证证据，最终确认 ' +
          findings.length +
          ' 个漏洞。',
        '',
      );
      lines.push('### 严重度分布', '');
      lines.push(
        '- 严重: ' + (sev.critical || 0),
        '- 高危: ' + (sev.high || 0),
        '- 中等: ' + (sev.medium || 0),
        '- 低危: ' + (sev.low || 0),
        '',
      );
      lines.push('## 2. 漏洞详情', '');
      if (!sorted.length) lines.push('本次扫描未发现确认的漏洞。', '');
      sorted.forEach(function (f, i) {
        lines.push('### 2.' + (i + 1) + ' ' + f.title, '');
        lines.push(findingToMarkdown(f).split('\n').slice(1).join('\n').trim(), '');
      });
      lines.push('## 3. 修复建议汇总', '');
      if (!patches.length) lines.push('当前扫描未生成自动修复建议。', '');
      else {
        patches.forEach(function (p) {
          lines.push(
            '- ' + p.id + ' — ' + p.summary + '（关联 ' + p.finding_id + ' · ' + p.file + '）',
          );
        });
        lines.push('');
      }
      lines.push('## 4. 验证记录', '');
      lines.push('共有 ' + probes.length + ' 条验证记录。', '');
      lines.push('— END OF REPORT —');
      return lines.join('\n');
    }

    // 真实产物副本位于 demo/output/<job-id>/<relPath>。

    // 运行 tab：概览四卡（任务信息 + 结果概括三卡）+ 全宽工作流（元信息并入进度行与任务信息卡）。
    function RunView(project, findings, patches, candidates) {
      var sev = sevFromFindings(findings);
      var arts = ensureObj(D.artifactsByJob[project.id] || {});
      var activity = ensureObj(arts.agent_activity);
      var agentSummary =
        '运行中 ' +
        num(activity.running_total) +
        ' · 完成 ' +
        num(activity.completed_total) +
        ' · 失败 ' +
        num(activity.failed_total) +
        ' · 超预算 ' +
        num(activity.stale_total) +
        (activity.capacity != null ? ' · 容量 ' + activity.capacity : '');
      var scanConfigCard =
        '<div class="card scan-config-card"><div class="card-h"><h3>任务信息</h3></div><div class="card-b stack-sm">' +
        ConfigRow('任务 ID', project.id, true) +
        ConfigRow(
          '扫描模式',
          sceneMode(project) +
            (project.phase_label && project.phase_label !== sceneMode(project)
              ? ' · ' + project.phase_label
              : ''),
        ) +
        '<div style="display:flex;gap:10px;min-width:0;margin-top:2px"><span class="muted xs" style="flex-shrink:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.06em;text-transform:uppercase">备注</span><span class="b xs" style="color:var(--text);flex:1 1 auto;min-width:0;line-height:1.5;word-break:break-word">' +
        esc(project.description || '—') +
        '</span></div>' +
        ConfigRow('路径', project.target, true) +
        ConfigRow('开始', fmtAbs(project.started_at), true) +
        (project.duration ? ConfigRow('耗时', fmtDuration(project.duration), true) : '') +
        ConfigRow('Agent 池', agentSummary) +
        '</div></div>';
      var findingIds = {};
      findings.forEach(function (f) {
        findingIds[f.id] = true;
      });
      var unconfirmed = (candidates || [])
        .filter(function (c) {
          return !findingIds[c.id];
        })
        .map(function (c) {
          return {
            id: c.id,
            type: 'candidate',
            sev: c.suspected_severity,
            cat: c.suspected_category,
            cwe: '',
            title: c.title,
            file: c.file,
            line: c.line,
            confidence: c.confidence,
            status: c.status,
          };
        });
      return (
        '<div class="stack" style="gap:14px">' +
        '<div class="grid run-cards">' +
        scanConfigCard +
        severityDonutCard(sev, (patches || []).length) +
        funnelCardHtml(findings, candidates) +
        '</div>' +
        WorkflowMap(project) +
        VulnTable(unconfirmed, { emptyText: '没有待确认的候选' }) +
        '</div>'
      );
    }

    // 发现 tab：候选复核工作台（完整卡片 + 状态/严重度筛选；确认结论在「报告」tab）。
    function WorkflowMap(job) {
      var artifacts = D.artifactsByJob[job.id] || {};
      var nodes = (D.nodesByJob[job.id] || []).filter(function (n) {
        return n.id !== 'report';
      });
      var overall = job.status;
      var doneCount = nodes.filter(function (n) {
        return n.status === 'done';
      }).length;
      var totalCount = nodes.length;
      var currentNode = nodes.find(function (n) {
        return n.status === 'running';
      });
      var currentLabel = currentNode ? LABEL_BY_ID[currentNode.id] || currentNode.id : null;
      var currentMessage = currentNode ? String(currentNode.message || '').trim() : '';
      var OVERALL_LABEL = { running: '运行中', succeeded: '已完成', failed: '已失败' };
      var runStatus = ensureObj(artifacts.run_status);
      var activity = ensureObj(artifacts.agent_activity);
      var failedAgents = asArray(activity.agents).filter(function (a) {
        var st = String(ensureObj(a).status || '').toLowerCase();
        return st === 'failed' || st === 'error';
      });

      // agent per kind（静态快照，已完成 stage 的残留 running agent 归位为 done）
      var topology = deriveAgentTopology(artifacts);
      var acc = {};
      topology.groups.forEach(function (g) {
        var bucket = {};
        (acc[g.kind] || []).forEach(function (a) {
          bucket[a.label] = a;
        });
        g.agents.forEach(function (a) {
          bucket[a.label] = {
            label: a.label,
            status: a.status,
            elapsedSeconds:
              a.elapsedSeconds != null
                ? a.elapsedSeconds
                : bucket[a.label]
                  ? bucket[a.label].elapsedSeconds
                  : null,
            startedAt:
              a.startedAt != null
                ? a.startedAt
                : bucket[a.label]
                  ? bucket[a.label].startedAt
                  : null,
          };
        });
        acc[g.kind] = Object.values(bucket);
      });
      var stageStatus = {};
      nodes.forEach(function (n) {
        stageStatus[n.id] = n.status;
      });
      var agentsByStage = {};
      Object.keys(acc).forEach(function (kind) {
        var st = stageStatus[kind] || 'idle';
        var list = acc[kind].map(function (a) {
          if (st === 'done') {
            if (a.status === 'running' || a.status === 'idle')
              return Object.assign({}, a, { status: 'done' });
          } else if (st === 'failed') {
            if (a.status === 'running') return Object.assign({}, a, { status: 'failed' });
          }
          return a;
        });
        list.sort(function (a, b) {
          return (
            (STATUS_RANK[a.status] != null ? STATUS_RANK[a.status] : 9) -
            (STATUS_RANK[b.status] != null ? STATUS_RANK[b.status] : 9)
          );
        });
        agentsByStage[kind] = list;
      });

      var glyph = { done: '✓', running: '●', failed: '✕', skipped: '–', idle: '·' };
      var agGlyph = { done: '✓', running: '●', failed: '✕', stale: '!', idle: '·' };

      // 主从布局：仅"有二级记录（Agent）"的步骤可点开；默认选中运行中节点，否则首个有二级记录的节点
      var hasDetail = {};
      nodes.forEach(function (n) {
        hasDetail[n.id] = (agentsByStage[n.id] || []).length > 0;
      });
      var selId =
        STATE.wfSelected && hasDetail[STATE.wfSelected]
          ? STATE.wfSelected
          : currentNode && hasDetail[currentNode.id]
            ? currentNode.id
            : (function () {
                var f = nodes.find(function (n) {
                  return hasDetail[n.id];
                });
                return f ? f.id : null;
              })();

      function buildWfDetail(node) {
        var st = node.status;
        var label = LABEL_BY_ID[node.id] || node.id;
        var agents = agentsByStage[node.id] || [];
        var isCurrent = node.id === (currentNode && currentNode.id);
        var msg = '';
        if (isCurrent && currentMessage) {
          msg =
            '<div class="wf-msg"><span class="activity-dot"></span><span class="badge b-info">' +
            esc(currentLabel) +
            '</span>' +
            '<span class="wf-msg-text">' +
            esc(currentMessage) +
            '</span></div>';
        } else if (st === 'failed') {
          msg =
            '<div class="wf-msg fail">' +
            icon('alert', 12) +
            '<span class="wf-msg-text">节点执行失败</span></div>';
        }
        var chips = agents
          .map(function (a) {
            return (
              '<span class="agent-chip ' +
              esc(a.kind || 'other') +
              '" data-agst="' +
              esc(a.status) +
              '">' +
              '<i class="ag-dot">' +
              (agGlyph[a.status] || '·') +
              '</i>' +
              esc(a.label) +
              (a.elapsedSeconds != null
                ? '<b class="mono">' + fmtDuration(a.elapsedSeconds) + '</b>'
                : '') +
              '</span>'
            );
          })
          .join('');
        var runCount = agents.filter(function (a) {
          return a.status === 'running' || a.status === 'stale';
        }).length;
        var failCount = agents.filter(function (a) {
          return a.status === 'failed';
        }).length;
        return (
          '<div class="wf-detail" data-state="' +
          esc(st) +
          '">' +
          '<div class="wf-detail-head"><span class="wf-dot">' +
          (glyph[st] || '·') +
          '</span>' +
          '<span class="wf-label">' +
          esc(label) +
          '</span>' +
          (isCurrent
            ? '<span class="status running"><span class="pulse"></span>进行中</span>'
            : '') +
          '</div>' +
          msg +
          (agents.length
            ? '<div class="wf-chips">' + chips + '</div>'
            : '<div class="muted xs" style="padding:4px 2px">本阶段暂无 Agent 二级记录</div>') +
          (runCount || failCount
            ? '<div class="muted xs mono" style="padding:2px 0 0">' +
              runCount +
              ' 在跑' +
              (failCount ? ' · ' + failCount + ' 失败' : '') +
              '</div>'
            : '') +
          '</div>'
        );
      }

      var railHtml = '';
      nodes.forEach(function (node) {
        var label = LABEL_BY_ID[node.id] || node.id;
        var st = node.status;
        var agents = agentsByStage[node.id] || [];
        var isCurrent = node.id === (currentNode && currentNode.id);
        var sel = node.id === selId;
        var inner =
          '<span class="wf-step-top"><span class="wf-dot">' +
          (glyph[st] || '·') +
          '</span>' +
          '<span class="wf-label">' +
          esc(label) +
          '</span>' +
          (agents.length ? '<span class="wf-badge">' + agents.length + '</span>' : '') +
          '</span>' +
          '<span class="wf-summary">' +
          esc(summaryText(node.summary, node.id) || (st === 'idle' ? '待运行' : '')) +
          '</span>';
        if (agents.length) {
          railHtml +=
            '<button type="button" class="wf-step' +
            (isCurrent ? ' current' : '') +
            (sel ? ' selected' : '') +
            '" data-state="' +
            esc(st) +
            '" data-wf-step="' +
            esc(node.id) +
            '" title="' +
            esc(label) +
            '（查看二级记录）">' +
            inner +
            '</button>';
        } else {
          railHtml +=
            '<div class="wf-step disabled" data-state="' +
            esc(st) +
            '" title="' +
            esc(label) +
            '（暂无二级记录）">' +
            inner +
            '</div>';
        }
      });

      var selNode = nodes.find(function (n) {
        return n.id === selId;
      });
      var detailHtml = selNode
        ? buildWfDetail(selNode)
        : '<div class="muted xs" style="padding:12px;border:1px dashed var(--line);border-radius:var(--r)">暂无二级记录</div>';

      var taskError =
        String(runStatus.error || '').trim() ||
        (overall === 'failed' ? String(runStatus.message || '').trim() : '');
      var failHtml =
        taskError || failedAgents.length
          ? '<div class="agent-failures" style="margin-top:14px">' +
            (taskError
              ? '<div class="agent-failure">' +
                icon('alert', 13) +
                '<div><b>任务级错误</b><span>' +
                esc(taskError) +
                '</span></div></div>'
              : '') +
            failedAgents
              .map(function (a) {
                var aa = ensureObj(a);
                return (
                  '<div class="agent-failure">' +
                  icon('alert', 13) +
                  '<div><b>' +
                  esc(aa.kind_label || 'Agent') +
                  ' · ' +
                  esc(aa.label) +
                  '</b><span>' +
                  esc(aa.status) +
                  (aa.error ? '：' + esc(aa.error) : '') +
                  '</span></div></div>'
                );
              })
              .join('') +
            '</div>'
          : '';

      return (
        '<div class="card">' +
        '<div class="card-b">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">' +
        '<span class="muted xs mono" style="flex-shrink:0">' +
        esc(OVERALL_LABEL[overall] || overall) +
        ' · ' +
        doneCount +
        '/' +
        totalCount +
        ' 节点完成' +
        (overall === 'running'
          ? '<span class="status running" style="margin-left:8px"><span class="pulse"></span>live</span>'
          : '') +
        '</span></div>' +
        '<div class="wf-split">' +
        '<div class="wf-rail">' +
        railHtml +
        '</div>' +
        '<div class="wf-detail-pane">' +
        detailHtml +
        '</div>' +
        '</div>' +
        failHtml +
        '</div></div>'
      );
    }
    // 结果 tab：确认漏洞主从视图（左名称列表 / 右详情，复用 VulnDetailPanel）
    function FindingMasterDetail(findings) {
      if (!findings.length) return Empty('bug', '本任务暂无已确认漏洞');
      var sel =
        findings.filter(function (f) {
          return f.id === STATE.findingSel;
        })[0] || findings[0];
      var list = findings
        .map(function (f) {
          return (
            '<div class="fd-item' +
            (f.id === sel.id ? ' on' : '') +
            '" data-fdsel="' +
            esc(f.id) +
            '">' +
            '<span class="fd-dot ' +
            sevColor(f.severity) +
            '" title="' +
            esc(f.severity) +
            '"></span>' +
            '<span class="fd-item-title">' +
            esc(f.title) +
            '</span></div>'
          );
        })
        .join('');
      var patchActions =
        (sel.patch_diff && sel.patch_diff.length
          ? '<button class="btn sm" disabled title="该操作需要后端支持">' +
            icon('check', 11) +
            ' 应用补丁</button>' +
            '<button class="btn sm ghost" data-copy-diff="1">' +
            icon('copy', 11) +
            ' 复制 Patch</button>'
          : '') +
        '<button class="btn sm ghost" disabled title="标记后该漏洞将转入已排除并从确认清单移除（需后端支持）">' +
        icon('x', 11) +
        ' 标记误报</button>';
      return (
        '<div class="card" data-fid="' +
        esc(sel.id) +
        '">' +
        '<div class="card-h"><div style="display:flex;align-items:center;gap:10px;min-width:0;width:100%">' +
        '<h3 style="margin:0">确认漏洞</h3>' +
        '<span class="muted xs mono">' +
        findings.length +
        ' 项 · 点击左侧切换</span>' +
        '<span class="spacer"></span>' +
        patchActions +
        '</div></div>' +
        '<div class="fd-split">' +
        '<div class="fd-list">' +
        list +
        '</div>' +
        '<div class="fd-detail"><div class="fd-detail-title">' +
        esc(sel.title) +
        '</div>' +
        VulnDetailPanel(sel) +
        '</div>' +
        '</div></div>'
      );
    }

    // 统一漏洞表格（运行 tab：未确认候选）。默认排序：严重度 asc → 文件位置 asc（数据暂无时间戳）。
    function VulnTable(items, opts) {
      opts = opts || {};
      var sevOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      var sorted = (items || []).slice().sort(function (a, b) {
        var d =
          (sevOrder[a.sev] != null ? sevOrder[a.sev] : 9) -
          (sevOrder[b.sev] != null ? sevOrder[b.sev] : 9);
        if (d) return d;
        if (String(a.file) !== String(b.file)) return String(a.file) < String(b.file) ? -1 : 1;
        return (parseInt(a.line, 10) || 0) - (parseInt(b.line, 10) || 0);
      });
      if (!sorted.length) return Empty('bug', opts.emptyText || '本次扫描未发现漏洞');
      var head =
        '<div class="task-head vuln-head2"><span>漏洞</span><span>分类</span><span>严重度</span><span>置信度</span><span>状态</span></div>';
      var rows = sorted
        .map(function (v) {
          var statusLabel =
            v.type === 'finding' ? '已确认' : CAND_STATUS_LABEL[v.status] || v.status;
          var statusCls =
            v.type === 'finding' || v.status === 'promoted'
              ? 'b-ok'
              : v.status === 'rejected'
                ? 'b-neutral'
                : 'b-brand';
          var clickAttr =
            v.type === 'finding'
              ? ' data-find="' + esc(v.id) + '"'
              : ' data-cand="' + esc(v.id) + '"';
          return (
            '<div class="task-row vuln-row2"' +
            clickAttr +
            '>' +
            '<div class="minw0"><div class="b" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
            esc(v.title) +
            '</div></div>' +
            '<div class="minw0"><span class="muted xs" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
            esc(cweLabel(v.cat, v.cwe)) +
            '</span></div>' +
            '<div><span class="badge ' +
            sevColor(v.sev) +
            '">' +
            esc(v.sev) +
            '</span></div>' +
            '<div><span class="b mono brand-text">' +
            (v.confidence * 100).toFixed(0) +
            '%</span></div>' +
            '<div><span class="badge ' +
            statusCls +
            '">' +
            esc(statusLabel) +
            '</span></div>' +
            '</div>'
          );
        })
        .join('');
      return '<div class="card task-list">' + head + rows + '</div>';
    }
    function ProjectDetailView(project) {
      var findings = D.findingsByJob[project.id] || [];
      var candidates = D.candidatesByJob[project.id] || [];
      var probes = D.probesByJob[project.id] || [];
      var patches = D.patchesByJob[project.id] || [];
      var logState = D.logsByJob[project.id] || { lines: [], size: 0 };
      var pending = candidates.filter(function (c) {
        return c.status === 'pending';
      });
      var probing = candidates.filter(function (c) {
        return c.status === 'probing';
      });
      var promoted = candidates.filter(function (c) {
        return c.status === 'promoted';
      });
      var rejected = candidates.filter(function (c) {
        return c.status === 'rejected';
      });
      var confirmedIds = {};
      findings.forEach(function (f) {
        confirmedIds[f.id] = true;
      });
      promoted.forEach(function (c) {
        confirmedIds[c.id] = true;
      });
      var confirmedCount = Object.keys(confirmedIds).length;

      var tabs = [
        { id: 'run', label: '运行' },
        { id: 'report', label: '结果' },
        { id: 'log', label: '日志' },
      ];
      var tab = STATE.tab;
      var tabsHtml = tabs
        .map(function (t) {
          return (
            '<button class="tab ' +
            (tab === t.id ? 'on' : '') +
            '" data-tab="' +
            t.id +
            '">' +
            esc(t.label) +
            (t.n != null && t.n > 0
              ? '<span class="badge ' + (t.sev || 'b-info') + '">' + t.n + '</span>'
              : '') +
            '</button>'
          );
        })
        .join('');

      var body;
      if (tab === 'run') body = RunView(project, findings, patches, candidates);
      else if (tab === 'log') body = LogView(project, logState.lines, logState.size);
      else body = ReportView(project, findings, probes, patches, candidates);

      // 导出报告：全 tab 常驻下拉按钮（PDF 打印 / Markdown 下载）
      var reportActions =
        '<div class="export-dd' +
        (STATE.reportExportOpen ? ' open' : '') +
        '">' +
        '<button class="btn" id="btn-export-toggle" title="导出报告">' +
        icon('download', 13) +
        ' 导出报告 ' +
        icon('chevron', 11) +
        '</button>' +
        (STATE.reportExportOpen
          ? '<div class="export-dd-menu">' +
            '<button class="btn sm ghost" id="btn-report-pdf" title="打开浏览器打印对话框，可选择“另存为 PDF”">导出 PDF</button>' +
            '<button class="btn sm ghost" id="btn-report-md" title="下载 Markdown 报告">导出 Markdown</button>' +
            '</div>'
          : '') +
        '</div>';

      // 漏洞详情页：完全独立页面
      if (STATE.selectedVuln) {
        var sv = STATE.selectedVuln;
        var svConfirmed = sv.status === 'confirmed' || sv.status === 'promoted' || !!sv.description;
        var svRejected = !svConfirmed && sv.status === 'rejected';
        var NO_BACKEND = '该操作需要后端持久化支持，当前版本暂未提供';
        var svActions = '';
        if (svConfirmed) {
          svActions =
            '<button class="btn" disabled title="' +
            NO_BACKEND +
            '">' +
            icon('check', 12) +
            ' 标记已修复</button>' +
            '<button class="btn" disabled title="' +
            NO_BACKEND +
            '">' +
            icon('x', 12) +
            ' 标记误报</button>' +
            (sv.patch_diff && sv.patch_diff.length
              ? '<button class="btn" disabled title="' +
                NO_BACKEND +
                '">' +
                icon('check', 12) +
                ' 应用补丁</button>' +
                '<button class="btn" data-copy-diff="1">' +
                icon('copy', 12) +
                ' 复制 Patch</button>'
              : '') +
            '<button class="btn" data-copy-url="1">' +
            icon('copy', 12) +
            ' 复制链接</button>';
        } else if (!svRejected) {
          svActions =
            '<button class="btn primary" disabled title="' +
            NO_BACKEND +
            '">' +
            icon('check', 12) +
            ' 确认漏洞</button>' +
            '<button class="btn" disabled title="' +
            NO_BACKEND +
            '">' +
            icon('x', 12) +
            ' 标记误报</button>' +
            '<button class="btn" data-copy-url="1">' +
            icon('copy', 12) +
            ' 复制链接</button>';
        } else {
          svActions =
            '<button class="btn" data-copy-url="1">' + icon('copy', 12) + ' 复制链接</button>';
        }
        return (
          PageHead({
            title: sv.title || sv.id,
            back: { attr: 'data-close="1"' },
            actions: svActions,
          }) +
          '<div class="page-body vuln-detail-body">' +
          VulnDetailPanel(sv) +
          '</div>' +
          '<div class="report-print">' +
          ReportDoc(
            project,
            findings,
            probes,
            patches,
            findings.slice().sort(function (a, b) {
              var order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
              return order[a.severity] - order[b.severity];
            }),
          ) +
          '</div>'
        );
      }

      return (
        PageHead({
          title: project.name,
          actions:
            (function () {
              var pt = targetForProject(project);
              return pt
                ? '<a class="btn" href="' +
                    pTargetHref(pt) +
                    '" title="查看该对象的长期安全态势">' +
                    icon('shield', 13) +
                    ' 对象态势</a>'
                : '';
            })() +
            reportActions +
            (project.status === 'running' && project.id.indexOf('empty_') !== 0
              ? '<button class="btn danger" id="btn-stop">' + icon('stop', 11) + ' 停止</button>'
              : '') +
            '<button class="btn danger" id="btn-del" title="演示环境为静态快照，不支持删除">' +
            icon('x', 12) +
            ' 删除</button>',
        }) +
        '<div class="tabs">' +
        tabsHtml +
        '</div>' +
        '<div class="page-body">' +
        body +
        '</div>' +
        '<div class="report-print">' +
        ReportDoc(
          project,
          findings,
          probes,
          patches,
          findings.slice().sort(function (a, b) {
            var order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
            return order[a.severity] - order[b.severity];
          }),
        ) +
        '</div>'
      );
    }

    // --------------------------------------------------------------- models
    // Model configs persist to localStorage so added / edited / deleted entries survive reload.
    var MODEL_STORE_KEY = 'zhian-scan-models';
    function modelStoreSave() {
      try {
        var user = D.modelConfigs.filter(function (m) {
          return !m.read_only;
        });
        localStorage.setItem(MODEL_STORE_KEY, JSON.stringify(user));
      } catch (e) {}
    }
    function modelStoreLoad() {
      try {
        var raw = localStorage.getItem(MODEL_STORE_KEY);
        if (raw === null) {
          modelStoreSave();
          return;
        } // first visit: keep the seeded configs
        var arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return;
        D.modelConfigs = D.modelConfigs
          .filter(function (m) {
            return m.read_only;
          })
          .concat(arr);
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
      var list = D.modelConfigs.length
        ? D.modelConfigs
            .map(function (m) {
              var st = modelState(m);
              var badge = m.read_only
                ? '<span class="badge b-info">只读</span>'
                : '<span class="badge ' +
                  st.cls +
                  (st.testing ? ' conn-testing' : '') +
                  '">' +
                  st.label +
                  '</span>';
              var actions = m.read_only
                ? '<span class="muted xs" style="white-space:nowrap">只读</span>'
                : '<button class="model-action" data-medit="' +
                  esc(m.id) +
                  '" title="编辑" aria-label="编辑 ' +
                  esc(m.name) +
                  '">' +
                  icon('edit', 15) +
                  '</button>' +
                  '<button class="model-action" data-mtest="' +
                  esc(m.id) +
                  '" title="测试连接" aria-label="测试 ' +
                  esc(m.name) +
                  '">' +
                  icon('zap', 15) +
                  '</button>' +
                  '<button class="model-action danger" data-mdel="' +
                  esc(m.id) +
                  '" title="删除" aria-label="删除 ' +
                  esc(m.name) +
                  '">' +
                  icon('trash', 15) +
                  '</button>';
              return (
                '<article class="card m-card"><div class="m-card-in">' +
                '<div class="m-card-head">' +
                '<span class="m-mark">' +
                icon('model', 19) +
                '</span>' +
                '<div class="m-title"><strong>' +
                esc(m.name) +
                '</strong>' +
                '<small>' +
                esc(m.vendor || m.model || m.base_url || '模型接入') +
                '</small></div>' +
                badge +
                '</div>' +
                '<div class="m-actions">' +
                actions +
                '</div></div></article>'
              );
            })
            .join('')
        : '<div class="empty"><div class="glyph">' +
          icon('model') +
          '</div>暂无模型配置，点击右上角按钮接入</div>';

      return (
        PageHead({
          title: '模型管理',
          actions:
            '<button class="btn primary" id="btn-model-add">' +
            icon('plus', 14) +
            ' 新增模型</button>',
        }) +
        '<div class="page-body"><div class="m-grid">' +
        list +
        '</div></div>'
      );
    }

    // add / edit modal: 模型名称 / 厂商 / Base URL / API Key; test required before save
    function modelModal() {
      var d = STATE.modelDraft;
      var fld = function (id, label, value, placeholder, extra, type) {
        return (
          '<div class="field"><label for="m-' +
          id +
          '">' +
          label +
          '</label>' +
          '<input class="input" id="m-' +
          id +
          '" type="' +
          (type || 'text') +
          '" value="' +
          esc(value || '') +
          '" placeholder="' +
          (placeholder || '') +
          '" autocomplete="off" ' +
          (extra || '') +
          '/></div>'
        );
      };
      var btnLabel = d.testing ? '测试中…' : d.tested ? '✓ 已通过' : '测试链接';
      return (
        '<div class="modal-back" data-mclose="1"></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true" aria-label="' +
        (d.id ? '编辑模型' : '新增模型') +
        '">' +
        '<div class="modal-h"><h3>' +
        (d.id ? '编辑模型' : '新增模型') +
        '</h3>' +
        '<button class="btn sm ghost" data-mclose="1" aria-label="关闭">' +
        icon('x', 14) +
        '</button></div>' +
        '<div class="modal-b"><form onsubmit="return false">' +
        fld('name', '模型名称 *', d.name, '例如：测试模型', 'data-mf2="name"') +
        fld('vendor', '厂商', d.vendor, '例如：DeepSeek', 'data-mf2="vendor"') +
        fld('base', 'Base URL *', d.base_url, '填写服务地址', 'data-mf2="base_url"') +
        '<div class="field"><label for="m-key">API Key *</label><div class="m-row">' +
        '<input class="input mono" id="m-key" type="password" value="' +
        esc(d.api_key || '') +
        '" placeholder="' +
        (d.has_api_key ? '留空保留已保存的密钥' : '填写服务调用的 API Key') +
        '" autocomplete="off" data-mf2="api_key"/>' +
        '<button class="btn" type="button" id="m-test-btn"' +
        (d.testing ? ' disabled' : '') +
        '>' +
        icon('zap', 14) +
        ' ' +
        btnLabel +
        '</button>' +
        '</div></div>' +
        '<p id="m-error" class="m-error" role="alert">' +
        esc(STATE.modelError || '') +
        '</p>' +
        '</form></div>' +
        '<div class="modal-f"><button class="btn" data-mclose="1">取消</button>' +
        '<button class="btn primary" id="m-save">保存配置</button></div>' +
        '</div>'
      );
    }

    // plain delete confirm: text only, no dividers or tinted backgrounds
    function modelDeleteModal() {
      var m = D.modelConfigs.find(function (x) {
        return x.id === STATE.modelDeleting;
      });
      if (!m) return '';
      return (
        '<div class="modal-back" data-mclose="1"></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true" aria-label="删除模型">' +
        '<div class="modal-h"><h3>删除模型</h3>' +
        '<button class="btn sm ghost" data-mclose="1" aria-label="关闭">' +
        icon('x', 14) +
        '</button></div>' +
        '<div class="modal-b"><p class="m-plain-text">确认删除模型「' +
        esc(m.name) +
        '」吗？</p></div>' +
        '<div class="modal-f"><button class="btn" data-mclose="1">取消</button>' +
        '<button class="btn danger" id="m-del-confirm">删除</button></div>' +
        '</div>'
      );
    }

    // -------------------------------------------------------------- drawers
    // 右侧详情面板（独立组件，嵌入式）
    function VulnDetailPanel(raw) {
      var isC = raw.status === 'confirmed' || raw.status === 'promoted' || !!raw.description;
      var isR = !isC && raw.status === 'rejected';
      var sev = isC ? raw.severity : raw.suspected_severity;
      var cat = isC ? raw.category : raw.suspected_category;
      var stMap = {
        confirmed: '已确认',
        promoted: '已确认',
        probing: '验证中',
        pending: '待验证',
        rejected: '已排除',
      };

      var snippet = (raw.code_snippet || [])
        .map(function (r) {
          return (
            '<div class="' +
            (r.highlight ? 'lh' : '') +
            '"><span class="ln">' +
            esc(r.ln) +
            '</span>' +
            esc(r.text) +
            '</div>'
          );
        })
        .join('');
      var diff = (raw.patch_diff || [])
        .map(function (r) {
          return (
            '<div class="' +
            (r.type === 'add' ? 'diff-add' : 'diff-rem') +
            '">' +
            esc(r.text) +
            '</div>'
          );
        })
        .join('');
      var why = (raw.why_suspicious || [])
        .map(function (w, i) {
          return '<li><span class="why-num">' + (i + 1) + '</span><span>' + esc(w) + '</span></li>';
        })
        .join('');
      var counter = (raw.counter_evidence || [])
        .map(function (w) {
          return '<li>' + esc(w) + '</li>';
        })
        .join('');

      // ── 详细信息：逐行 key-value（严重度/置信度/CWE·分类与 ID/位置 同层级）──
      var row = function (label, value) {
        return '<div class="vd-row"><span>' + label + '</span><div>' + value + '</div></div>';
      };
      var infoRows =
        '<div class="vd-rows">' +
        row('ID', '<span class="mono">' + esc(raw.id) + '</span>') +
        row('严重度', '<span class="badge ' + sevColor(sev) + '">' + esc(sev) + '</span>') +
        row(
          isC ? '置信度' : '可疑度',
          '<span class="mono">' + Math.round((raw.confidence || 0) * 100) + '%</span>',
        ) +
        row('CWE / 分类', (raw.cwe ? esc(raw.cwe) + ' · ' : '') + esc(cat || '—')) +
        row(
          '位置',
          '<span class="mono">' +
            esc(raw.file) +
            ':' +
            esc(raw.line) +
            '</span> <button class="btn sm ghost" data-copy="' +
            esc(raw.file + ':' + raw.line) +
            '">' +
            icon('copy', 10) +
            '</button>',
        ) +
        (!isC ? row('状态', stMap[raw.status] || raw.status) : '') +
        (raw.source ? row('来源', esc(raw.source)) : '') +
        '</div>';

      var info = infoRows;
      // ── 分组内容 ──
      var group = function (label, inner) {
        return (
          '<div class="vd-group"><div class="vd-group-label">' +
          label +
          '</div><div class="vd-group-body">' +
          inner +
          '</div></div>'
        );
      };
      var item = function (label, inner, cls) {
        return (
          '<div class="vd-item ' +
          (cls || '') +
          '"><span class="vd-item-label">' +
          label +
          '</span><div class="vd-item-body">' +
          inner +
          '</div></div>'
        );
      };

      var body = '';
      if (isC) {
        body += group(
          '问题',
          (raw.description ? item('描述', '<p>' + esc(raw.description) + '</p>') : '') +
            (snippet ? item('代码证据', '<pre class="code">' + snippet + '</pre>') : '') +
            (raw.impact ? item('影响', '<p>' + esc(raw.impact) + '</p>') : ''),
        );
        var patchContent = '';
        if (raw.recommendation)
          patchContent += item('建议', '<p>' + esc(raw.recommendation) + '</p>', 'ok');
        if (diff) patchContent += item('Patch', '<pre class="code diff-view">' + diff + '</pre>');
        if (patchContent) body += group('修复', patchContent);
      } else {
        body += group(
          '分析',
          (why ? item('可疑信号', '<ol class="why-list">' + why + '</ol>') : '') +
            (snippet ? item('代码证据', '<pre class="code">' + snippet + '</pre>') : '') +
            (counter ? item('反证', '<ul class="counter-list">' + counter + '</ul>') : ''),
        );
        if (isR && raw.rejection_reason)
          body += group('结论', item('排除原因', '<p>' + esc(raw.rejection_reason) + '</p>'));
        if (!isR && raw.next_action)
          body += group('下一步', item('动作', '<p>' + esc(raw.next_action) + '</p>', 'brand'));
      }

      var body = '';
      if (isC) {
        body += group(
          '问题',
          (raw.description ? item('描述', '<p>' + esc(raw.description) + '</p>') : '') +
            (snippet ? item('代码证据', '<pre class="code">' + snippet + '</pre>') : '') +
            (raw.impact ? item('影响', '<p>' + esc(raw.impact) + '</p>') : ''),
        );
        var patchContent = '';
        if (raw.recommendation)
          patchContent += item('建议', '<p>' + esc(raw.recommendation) + '</p>', 'ok');
        if (diff) patchContent += item('Patch', '<pre class="code diff-view">' + diff + '</pre>');
        if (patchContent) body += group('修复', patchContent);
      } else {
        body += group(
          '分析',
          (why ? item('可疑信号', '<ol class="why-list">' + why + '</ol>') : '') +
            (snippet ? item('代码证据', '<pre class="code">' + snippet + '</pre>') : '') +
            (counter ? item('反证', '<ul class="counter-list">' + counter + '</ul>') : ''),
        );
        if (isR && raw.rejection_reason)
          body += group('结论', item('排除原因', '<p>' + esc(raw.rejection_reason) + '</p>'));
        if (!isR && raw.next_action)
          body += group('下一步', item('动作', '<p>' + esc(raw.next_action) + '</p>', 'brand'));
      }

      return '<div class="vd-root">' + info + body + '</div>';
    }

    function drawerSection(title, inner) {
      return (
        '<section><h3 style="margin:0 0 10px;font-size:13px;font-weight:600;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">' +
        esc(title) +
        '</h3>' +
        inner +
        '</section>'
      );
    }

    function NewProjectPage() {
      // 单卡连续表单：小节仅以轻量标题 + 分隔线区隔，不做割裂的分步卡片。
      // 顺序：任务信息（名称 / 备注）→ 扫描模式（含裁判模型配置）→ 检测目标（关联被测对象 + 目标输入）；
      // 仅通用入口（仪表盘）在页首追加检测对象三选一。
      var PHASES = [
        {
          id: 'agent-full',
          label: '通用检测',
          rec: true,
          points: ['AI 智能体主动挖掘，探索路径更多', '适合发布前审计与重点资产', '耗时与消耗更高'],
        },
        {
          id: 'full',
          label: '快速检测',
          points: ['本地规则初筛，AI 复核确认', '适合日常迭代与频繁回归', '速度更快、消耗更低'],
        },
      ];
      var catId = STATE.np.category || 'code'; // 直接进入时默认代码安全，保证 tag 恒显示
      var cat = catId ? SCAN_CATEGORIES[catId] : null;
      var isWeb = catId === 'web';
      function field(label, inner) {
        return '<div class="field"><label>' + label + '</label>' + inner + '</div>';
      }
      function sec(title) {
        return '<div class="np-sec">' + title + '</div>';
      }
      function divider() {
        return '<div class="np-div"></div>';
      }

      // 扫描模式（两卡一行）+ 裁判模型配置
      var modeCards = PHASES.map(function (p) {
        return (
          '<label style="display:flex;gap:10px;padding:12px;border:1px solid ' +
          (STATE.np.phase === p.id ? 'var(--brand)' : 'var(--line)') +
          ';border-radius:8px;background:' +
          (STATE.np.phase === p.id ? 'var(--brand-softer)' : 'var(--bg-elev)') +
          ';cursor:pointer;align-items:flex-start;height:100%;box-sizing:border-box;margin:0">' +
          '<input type="radio" name="phase" data-np-phase="' +
          p.id +
          '" ' +
          (STATE.np.phase === p.id ? 'checked' : '') +
          ' style="margin-top:2px;accent-color:var(--brand)"/>' +
          '<div class="flex-fill"><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' +
          '<span class="b sm">' +
          esc(p.label) +
          '</span>' +
          (p.rec ? '<span class="badge b-brand">推荐</span>' : '') +
          '</div>' +
          '<ul class="mode-points">' +
          p.points
            .map(function (pt) {
              return '<li>' + esc(pt) + '</li>';
            })
            .join('') +
          '</ul></div></label>'
        );
      }).join('');
      var sel = STATE.np.model_config_id;
      var modelSel = field(
        '裁判模型配置',
        '<select class="select" data-np="model_config_id">' +
          '<option value="" disabled' +
          (sel ? '' : ' selected') +
          '>请选择模型</option>' +
          D.modelConfigs
            .map(function (m) {
              var label = m.model && m.model !== m.name ? m.name + ' · ' + m.model : m.name;
              return (
                '<option value="' +
                esc(m.id) +
                '"' +
                (sel === m.id ? ' selected' : '') +
                '>' +
                esc(label) +
                '</option>'
              );
            })
            .join('') +
          '</select>',
      );
      var modeSec = isWeb
        ? sec('扫描模式') +
          '<label style="display:flex;gap:10px;padding:12px;border:1px solid var(--brand);border-radius:8px;background:var(--brand-softer);align-items:flex-start;margin:0">' +
          '<span style="flex-shrink:0;color:var(--brand);margin-top:2px">' +
          icon('check', 14) +
          '</span>' +
          '<div class="flex-fill"><div class="b sm" style="margin-bottom:6px">站点基线检测</div>' +
          '<ul class="mode-points">' +
          '<li>内置非破坏性基线探测，A3S 参与裁决</li>' +
          '<li>覆盖 TLS / 响应头 / Cookie / CORS / 暴露路径</li>' +
          '<li>固定全流程：检测 + 修复建议 + 报告</li>' +
          '<li>弱口令验证默认关闭，需目标明确授权</li>' +
          '</ul></div></label>' +
          '<div style="margin-top:14px">' +
          modelSel +
          '</div>'
        : sec('扫描模式') +
          '<div class="grid grid-2" style="gap:10px">' +
          modeCards +
          '</div>' +
          '<div style="margin-top:14px">' +
          modelSel +
          '</div>';

      // 检测目标：代码/制品为统一上传 + 服务器路径备用；Web 为 URL。
      var targetInner;
      if (isWeb) {
        targetInner = field(
          '在线网址',
          '<input class="input mono" data-np="website_url" value="' +
            esc(STATE.np.website_url) +
            '" placeholder="https://example.com/"/>' +
            '<div class="muted xs" style="margin-top:6px;line-height:1.7">仅执行授权 origin 的低强度只读探测；默认拒绝内网 / 回环地址。</div>',
        );
      } else {
        // 统一上传区：拖拽或点击按钮打开系统文件选择器（accept 按场景过滤格式）。
        // 后续接真实后端时，上传内容由 classify_target 自动识别目录/压缩包/单文件形态。
        // accept 过滤与后端依据对齐：代码 16 后缀表（_SOURCE_SUFFIXES）、二进制后缀表
        // （_BINARY_SUFFIXES）+ 控制台压缩包白名单（zip / tar 系共 8 种，见 web_console/api/jobs.py）。
        var accept, limitHint;
        if (catId === 'app') {
          accept =
            '.exe,.dll,.so,.dylib,.a,.bin,.zip,.tar,.tar.gz,.tgz,.tar.bz2,.tbz2,.tar.xz,.txz';
          limitHint =
            '支持二进制、固件、库与安装树压缩包 · zip / tar 系 ≤ 2 GB · 保留原始后缀（.exe / .dll / .so / .bin…）以便准确识别';
        } else {
          accept =
            '.py,.js,.jsx,.ts,.tsx,.java,.c,.h,.cc,.cpp,.cxx,.hpp,.go,.rs,.rb,.php,.zip,.tar,.tar.gz,.tgz,.tar.bz2,.tbz2,.tar.xz,.txz';
          limitHint =
            '支持代码目录、压缩包或单个代码文件 · zip / tar 系 ≤ 2 GB · 建议保留 manifest 与锁文件';
        }
        // 两种提供方式上下排布，中间以「或」分隔：先服务器路径，后本地上传。
        targetInner =
          field(
            '服务器路径',
            '<input class="input mono" data-np="target_path" value="' +
              esc(STATE.np.target_path) +
              '" placeholder="' +
              (catId === 'app'
                ? '/path/to/binary 或 /path/to/install-tree'
                : '/path/to/source-dir') +
              '"/>',
          ) +
          '<div class="np-or">或</div>' +
          '<div class="drop" id="np-drop">' +
          icon('upload', 22) +
          '<div><b>将目标拖拽到此处</b></div>' +
          '<div class="drop-btns">' +
          '<label class="btn sm ghost drop-btn">选择文件<input type="file" multiple accept="' +
          accept +
          '" data-np-file="file"></label>' +
          '<label class="btn sm ghost drop-btn">选择文件夹<input type="file" webkitdirectory multiple data-np-file="folder"></label>' +
          '</div>' +
          '<small>' +
          limitHint +
          '</small>' +
          '</div>' +
          (STATE.np.targetName
            ? '<div class="target-picked">' +
              '<span style="flex-shrink:0;color:var(--brand)">' +
              icon('file', 16) +
              '</span>' +
              '<div class="flex-fill"><div class="b xs" style="color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
              esc(STATE.np.targetName) +
              '</div>' +
              '<div class="muted xs" style="margin-top:2px">' +
              esc(STATE.np.targetKind) +
              (STATE.np.targetFiles > 1 ? ' · ' + STATE.np.targetFiles + ' 个文件' : '') +
              '</div></div>' +
              '<span class="badge b-ok">已就绪</span></div>'
            : '');
      }

      // 关联被测对象并入「检测目标」节首位：与本次扫描输入同板块，消除「对象 / 目标」概念混淆；
      // 入口预选（发起检测 / 复测）时以「已关联」chip 回显，选中变化由 bind() 原地同步，不触发整页重渲染。
      var relTarget =
        POSTURE.targets.find(function (t) {
          return t.id === STATE.np.target_id;
        }) || null;
      var targetRelField =
        '<div class="field" style="margin-bottom:14px"><label>关联被测对象</label>' +
        '<select class="select" data-np="target_id">' +
        '<option value="">新建对象（不关联已有档案）</option>' +
        POSTURE.targets
          .filter(function (t) {
            return catId === 'web' ? t.type.indexOf('Web') !== -1 : t.type.indexOf('Web') === -1;
          })
          .map(function (t) {
            return (
              '<option value="' +
              esc(t.id) +
              '"' +
              (STATE.np.target_id === t.id ? ' selected' : '') +
              '>' +
              esc(t.name) +
              ' · ' +
              esc(t.identity) +
              '</option>'
            );
          })
          .join('') +
        '</select>' +
        '<div class="target-picked" id="np-rel-chip" style="' +
        (relTarget ? '' : 'display:none') +
        '">' +
        '<span style="flex-shrink:0;color:var(--brand)">' +
        icon('project', 16) +
        '</span>' +
        '<div class="flex-fill"><div class="b xs" style="color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
        esc(relTarget ? relTarget.name : '') +
        '</div>' +
        '<div class="muted xs" style="margin-top:2px">' +
        esc(relTarget ? relTarget.identity : '') +
        '</div></div>' +
        '<span class="badge b-ok">已关联</span></div>' +
        '<div class="muted xs" style="margin-top:6px;line-height:1.7">选择已有对象后，本次扫描会归并到该对象的长期态势与漏洞生命周期。</div></div>';

      return (
        PageHead({
          title: '新建扫描任务',
          back: { attr: 'data-np-close="1"' },
          titleTag: cat
            ? ' <span class="badge b-brand page-title-tag"><span style="display:inline-flex;align-items:center;gap:5px">' +
              icon(cat.icon, 11) +
              esc(cat.title) +
              '</span></span>'
            : '',
        }) +
        '<div class="page-body np-body"><div class="np-stack">' +
        (STATE.npError
          ? '<div class="cand-banner" style="border-color:var(--sig-critical-soft);background:var(--sig-critical-softer)">' +
            icon('alert', 15) +
            '<b>' +
            esc(STATE.npError) +
            '</b></div>'
          : '') +
        '<div class="card"><div class="card-b">' +
        field(
          '任务名称',
          '<input class="input" data-np="name" value="' +
            esc(STATE.np.name) +
            '" placeholder="例如：支付网关 Q3 例行检测"/>',
        ) +
        '<div class="field" style="margin-top:14px"><label>任务备注</label>' +
        '<textarea class="textarea" data-np="description" placeholder="补充背景、范围或责任人（可选）">' +
        esc(STATE.np.description) +
        '</textarea></div>' +
        divider() +
        modeSec +
        divider() +
        sec('检测目标') +
        targetRelField +
        targetInner +
        '</div></div>' +
        '</div>' +
        '<div class="np-actions">' +
        '<button type="button" class="btn" data-np-close="1">取消</button>' +
        '<button type="button" class="btn primary lg" id="btn-np-create">创建任务</button>' +
        '</div></div>'
      );
    }
    // ============================================================== state
    var STATE = {
      tab: 'run',

      serviceView: 'agent',
      query: '',
      npMenuOpen: false,
      targetPickerOpen: false,
      targetFilterOpen: false,
      targetDeleting: null,
      compareOpen: false,
      compareTargetId: null,
      compareA: 0,
      compareB: 0,
      taskLimit: 10,
      targetQuery: '',
      targetFilter: 'all',
      lastCat: null,
      logAutoscroll: true,
      drawerFinding: null,
      selectedVuln: null,
      findingSel: null,
      drawerCandidate: null,
      projectId: null,
      showModelForm: false,
      modelError: '',
      modelForm: { name: '', base_url: '', api_key: '', model: '' },
      np: {
        name: '',
        description: '',
        category: null,
        phase: 'agent-full',
        source: 'path',
        target_path: '',
        website_url: '',
        target_id: '',
        model_config_id: '',
        candidate_categories: '',
        discovery_slice_size: '8',
        validation_batch_size: '1',
        agent_pool_size: '4',
        agent_pool_min: '2',
      },
      npError: '',
    };

    // 地址栏与页面外壳由平台管理，这里只维护扫描器自己的内部路由。
    var ROUTE = '/';

    function goRoute(next) {
      ROUTE = String(next || '/').replace(/^#/, '') || '/';
      render();
    }

    function parseRoute() {
      var raw = String(ROUTE || '').replace(/^#/, '');
      if (!raw) return { name: 'dashboard' };
      var parts = raw.split('/').filter(Boolean);
      if (parts[0] === 'projects' && parts[1])
        return { name: 'project', id: decodeURIComponent(parts[1]) };
      if (parts[0] === 'projects') return { name: 'dashboard' };
      if (parts[0] === 'scan' && parts[1] === 'new') return { name: 'new' };
      if (parts[0] === 'scan' && SCAN_CATEGORIES[parts[1]])
        return { name: 'scan', category: parts[1] };
      if (parts[0] === 'targets' && parts[1])
        return { name: 'target', id: decodeURIComponent(parts[1]) };
      if (parts[0] === 'targets') return { name: 'targets' };
      if (parts[0] === 'models') return { name: 'models' };
      return { name: 'dashboard' };
    }

    function render() {
      var route = parseRoute();
      if (route.name === 'project' && route.id !== STATE.projectId) {
        STATE.projectId = route.id;
        // 详情页默认选中第一个「运行」tab
        STATE.tab = 'run';

        STATE.drawerFinding = null;
        STATE.drawerCandidate = null;
        STATE.selectedVuln = null;
      }
      if (route.name !== 'project') STATE.projectId = null;

      var main;
      if (route.name === 'scan') main = CategoryView(route.category);
      else if (route.name === 'new') main = NewProjectPage();
      else if (route.name === 'models') main = ModelsView();
      else if (route.name === 'targets') main = TargetsView();
      else if (route.name === 'target') main = TargetDetailView(route.id);
      else if (route.name === 'project') {
        var project = D.projects.find(function (p) {
          return p.id === route.id;
        });
        main = project
          ? ProjectDetailView(project)
          : PageHead({ title: '任务不存在' }) +
            '<div class="page-body"><div class="empty"><div class="glyph">' +
            icon('project') +
            '</div>找不到任务 ' +
            esc(route.id) +
            '</div></div>';
      } else main = PostureOverviewView();

      var root = document.getElementById('scan-app');
      if (!root) return;
      var curPath = ROUTE || '/';
      var samePage = STATE.prevPath === curPath;
      var keepScrollBody = samePage
        ? (document.querySelector('.page-body') || {}).scrollTop || 0
        : 0;
      var keepScrollMain = samePage ? (document.querySelector('.main') || {}).scrollTop || 0 : 0;
      var keepDoc = document.documentElement || {};
      var keepScrollTop = samePage
        ? (typeof window.scrollY === 'number' ? window.scrollY : 0) ||
          (typeof keepDoc.scrollTop === 'number' ? keepDoc.scrollTop : 0)
        : 0;
      root.innerHTML =
        '<div class="app">' +
        '<main class="main">' +
        main +
        '</main>' +
        (STATE.modelDraft ? modelModal() : '') +
        (STATE.modelDeleting ? modelDeleteModal() : '') +
        (STATE.targetPickerOpen ? targetPickerModal() : '') +
        (STATE.targetDeleting ? targetDeleteModal() : '') +
        (STATE.compareOpen ? targetCompareModal() : '') +
        '</div>';

      var bodyAfter = document.querySelector('.page-body');
      if (
        bodyAfter &&
        typeof bodyAfter.scrollTop === 'number' &&
        bodyAfter.scrollHeight > bodyAfter.clientHeight
      )
        bodyAfter.scrollTop = keepScrollBody;
      else {
        var mainAfter = document.querySelector('.main');
        if (
          mainAfter &&
          typeof mainAfter.scrollTop === 'number' &&
          mainAfter.scrollHeight > mainAfter.clientHeight
        )
          mainAfter.scrollTop = keepScrollMain;
        else window.scrollTo(0, keepScrollTop);
      }
      var focusSel = null; // 创建页交互后保持滚动即可，输入不触发重渲染
      if (ROUTE === '/scan/new') {
        var checked = document.querySelector('input[name="phase"]:checked');
        if (checked && document.activeElement && document.activeElement.tagName === 'BODY')
          checked.focus();
      }
      STATE.prevPath = curPath;
      bind();
    }

    // =============================================================== events
    function onClick(root, selector, fn) {
      root.querySelectorAll(selector).forEach(function (el) {
        el.addEventListener('click', fn);
      });
    }

    function bind() {
      var root = document.getElementById('scan-app');
      if (!root) return;

      // tabs / segs
      onClick(root, '[data-tab]', function (e) {
        STATE.tab = e.currentTarget.getAttribute('data-tab');
        render();
      });
      onClick(root, '[data-wf-step]', function (e) {
        var id = e.currentTarget.getAttribute('data-wf-step');
        STATE.wfSelected = id;
        render();
      });
      onClick(root, '[data-sv]', function (e) {
        STATE.serviceView = e.currentTarget.getAttribute('data-sv');
        render();
      });
      onClick(root, '[data-np-menu-close]', function () {
        STATE.npMenuOpen = false;
        render();
      });

      // candidate / finding drawers
      onClick(root, '[data-cand]', function (e) {
        var id = e.currentTarget.getAttribute('data-cand');
        var c = D.candidates.find(function (x) {
          return x.id === id;
        });
        if (c) {
          STATE.selectedVuln = c;
          render();
        }
      });
      // 概览待验证候选快捷裁决：确认（promoted）/ 重验（probing）/ 误报（rejected）
      // 注意：渲染读 D.candidatesByJob，必须改同一对象才能触发列表/徽标更新
      function candDecide(attr, nextStatus, toastMsg) {
        onClick(root, '[' + attr + ']', function (e) {
          var id = e.currentTarget.getAttribute(attr);
          var pid = STATE.projectId;
          var list = D.candidatesByJob[pid] || [];
          var c =
            list.find(function (x) {
              return x.id === id;
            }) ||
            D.candidates.find(function (x) {
              return x.id === id;
            });
          if (c) {
            c.status = nextStatus;
            render();
            demoToast(toastMsg + '：' + c.id);
          }
        });
      }
      candDecide('data-cand-confirm', 'promoted', '已确认为漏洞');
      candDecide('data-cand-retry', 'probing', '已发起重新验证');
      candDecide('data-cand-reject', 'rejected', '已判定为误报并忽略');
      onClick(root, '[data-find]', function (e) {
        var id = e.currentTarget.getAttribute('data-find');
        var f = D.findings.find(function (x) {
          return x.id === id;
        });
        if (f) {
          STATE.selectedVuln = f;
          render();
        }
      });
      onClick(root, '[data-find-link]', function (e) {
        e.preventDefault();
        var id = e.currentTarget.getAttribute('data-find-link');
        var f = D.findings.find(function (x) {
          return x.id === id;
        });
        if (f) {
          STATE.selectedVuln = f;
          render();
        }
      });

      // drawer close
      onClick(root, '[data-close]', function () {
        STATE.drawerFinding = null;
        STATE.drawerCandidate = null;
        STATE.selectedVuln = null;
        render();
      });
      document.onkeydown = function (e) {
        if (
          e.key === 'Escape' &&
          (STATE.drawerFinding ||
            STATE.drawerCandidate ||
            STATE.targetDeleting ||
            STATE.compareOpen)
        ) {
          STATE.drawerFinding = null;
          STATE.drawerCandidate = null;
          STATE.selectedVuln = null;
          STATE.targetDeleting = null;
          STATE.compareOpen = false;
          render();
        }
      };
      onClick(root, '[data-fdsel]', function (e) {
        STATE.findingSel = e.currentTarget.getAttribute('data-fdsel');
        render();
      });
      onClick(root, '[data-copy]', function (e) {
        copyText(e.currentTarget.getAttribute('data-copy'));
      });
      onClick(root, '[data-copy-url]', function () {
        copyText(location.href);
      });
      onClick(root, '[data-copy-diff]', function (e) {
        var raw = STATE.drawerFinding;
        if (!raw) {
          var host = e.currentTarget.closest('[data-fid]');
          raw =
            host &&
            D.findings.find(function (x) {
              return x.id === host.getAttribute('data-fid');
            });
        }
        if (raw) copyText(diffText(raw.patch_diff));
      });
      onClick(root, '[data-download-md]', function (e) {
        var f = D.findings.find(function (x) {
          return x.id === e.currentTarget.getAttribute('data-download-md');
        });
        if (f)
          downloadFile(
            slug(f.id || f.title) + '.md',
            findingToMarkdown(f),
            'text/markdown;charset=utf-8',
          );
      });
      onClick(root, '[data-download-json]', function (e) {
        var f = D.findings.find(function (x) {
          return x.id === e.currentTarget.getAttribute('data-download-json');
        });
        if (f)
          downloadFile(
            slug(f.id || f.title) + '.json',
            JSON.stringify(f, null, 2),
            'application/json;charset=utf-8',
          );
      });

      // new project modal：场景入口预锁定类别；通用入口先三选一。
      var npOpen = function (cat) {
        // 新建语义：每次进入都是空白表单（类别由入口指定）
        STATE.npError = '';
        STATE.np.category = cat || null;
        STATE.np.name = '';
        STATE.np.description = '';
        STATE.np.model_config_id = '';
        STATE.np.target_path = '';
        STATE.np.website_url = '';
        STATE.np.target_id = '';
        STATE.np.targetName = '';
        STATE.np.targetKind = '';
        STATE.np.targetFiles = 0;
        if (cat) STATE.np.source = SCAN_CATEGORIES[cat].sources[0][0];
        goRoute('/scan/new');
      };
      onClick(root, '[data-np-menu]', function (e) {
        STATE.npMenuOpen = false;
        npOpen(e.currentTarget.getAttribute('data-np-menu'));
      });
      onClick(root, '[data-np-open]', function (e) {
        npOpen(e.currentTarget.getAttribute('data-np-open'));
      });
      onClick(root, '[data-open-picker]', function () {
        STATE.targetPickerOpen = true;
        render();
      });
      onClick(root, '[data-tp-close]', function () {
        STATE.targetPickerOpen = false;
        render();
      });
      onClick(root, '[data-pick-target]', function (e) {
        var id = e.currentTarget.getAttribute('data-pick-target');
        STATE.targetPickerOpen = false;
        if (id) {
          STATE.np.category = POSTURE.targets.some(function (t) {
            return t.id === id && t.type.indexOf('Web') !== -1;
          })
            ? 'web'
            : 'code';
          STATE.np.target_id = id;
        } else {
          STATE.np.target_id = '';
          STATE.np.category = 'code';
        }
        goRoute('/scan/new');
      });
      onClick(root, '[data-back-targets]', function () {
        goRoute('/targets');
      });
      onClick(root, '[data-scan-target]', function (e) {
        var id = e.currentTarget.getAttribute('data-scan-target');
        STATE.np.category = POSTURE.targets.some(function (t) {
          return t.id === id && t.type.indexOf('Web') !== -1;
        })
          ? 'web'
          : 'code';
        STATE.np.target_id = id;
        goRoute('/scan/new');
      });

      onClick(root, '[data-tfilter]', function (e) {
        STATE.targetFilter = e.currentTarget.getAttribute('data-tfilter');
        STATE.targetFilterOpen = false;
        render();
      });
      onClick(root, '[data-tfilter-toggle]', function () {
        STATE.targetFilterOpen = !STATE.targetFilterOpen;
        render();
      });
      onClick(root, '[data-tclear]', function () {
        STATE.targetQuery = '';
        render();
      });
      // 点击下拉外部时收起（赋值式绑定，随 render 重挂不会叠加）
      document.onmousedown = function (e) {
        if (
          STATE.targetFilterOpen &&
          e &&
          e.target &&
          !(e.target.closest && e.target.closest('.tfilter-dd'))
        ) {
          STATE.targetFilterOpen = false;
          render();
        }
      };
      onClick(root, '[data-del-target]', function (e) {
        STATE.targetDeleting = e.currentTarget.getAttribute('data-del-target');
        render();
      });
      onClick(root, '[data-tdel-close]', function () {
        STATE.targetDeleting = null;
        render();
      });
      onClick(root, '[data-tdel-confirm]', function () {
        var t = POSTURE.targets.find(function (x) {
          return x.id === STATE.targetDeleting;
        });
        if (t) POSTURE.targets.splice(POSTURE.targets.indexOf(t), 1);
        STATE.targetDeleting = null;
        render();
        demoToast(t ? '已删除被测对象：' + t.name : '已删除被测对象');
      });

      // 风险趋势：按需对比两轮扫描
      onClick(root, '[data-open-compare]', function (e) {
        var id = e.currentTarget.getAttribute('data-open-compare');
        var t = POSTURE.targets.find(function (x) {
          return x.id === id;
        });
        var n = t && t.history ? t.history.length : 0;
        STATE.compareTargetId = id;
        STATE.compareA = Math.max(0, n - 2);
        STATE.compareB = Math.max(0, n - 1);
        STATE.compareOpen = true;
        render();
      });
      onClick(root, '[data-cmp-close]', function () {
        STATE.compareOpen = false;
        render();
      });
      root.querySelectorAll('[data-cmp-a]').forEach(function (el) {
        el.addEventListener('change', function () {
          STATE.compareA = parseInt(el.value, 10) || 0;
          render();
        });
      });
      root.querySelectorAll('[data-cmp-b]').forEach(function (el) {
        el.addEventListener('change', function () {
          STATE.compareB = parseInt(el.value, 10) || 0;
          render();
        });
      });
      var targetSearch = root.querySelector('#target-search');
      if (targetSearch)
        targetSearch.addEventListener('input', function () {
          STATE.targetQuery = targetSearch.value;
          render();
          var next = document.getElementById('target-search');
          if (next) {
            next.focus();
            next.setSelectionRange(next.value.length, next.value.length);
          }
        });
      onClick(root, '[data-task-more]', function () {
        STATE.taskLimit += TASK_PAGE_SIZE;
        render();
      });
      onClick(root, '[data-task-all]', function () {
        STATE.taskLimit = 1000000;
        render();
      });
      onClick(root, '[data-task-collapse]', function () {
        STATE.taskLimit = TASK_PAGE_SIZE;
        render();
      });

      onClick(root, '[data-np-close]', function () {
        var back = STATE.np.category ? SCAN_CATEGORIES[STATE.np.category].path : '/';
        STATE.np.category = null;
        goRoute(back);
      });
      onClick(root, '[data-np-phase]', function (e) {
        STATE.np.phase = e.currentTarget.getAttribute('data-np-phase');
        render();
      });
      root.querySelectorAll('[data-np-file]').forEach(function (el) {
        el.addEventListener('change', function () {
          var files = el.files || [];
          if (!files.length) return;
          var f0 = files[0];
          var isFolder = el.getAttribute('data-np-file') === 'folder';
          if (isFolder) {
            var rel = f0.webkitRelativePath || f0.name || '';
            STATE.np.targetName = rel.split('/')[0] || f0.name;
            STATE.np.targetKind = '目录';
          } else {
            var n = f0.name || '';
            var isArc = /\.(zip|tar|gz|tgz|bz2|xz)$/i.test(n);
            STATE.np.targetName = isArc ? n.replace(/\.(zip|tar|gz|tgz|bz2|xz)$/i, '') : n;
            STATE.np.targetKind = isArc
              ? '压缩包'
              : STATE.np.category === 'app'
                ? '二进制/固件'
                : '单文件';
          }
          STATE.np.targetFiles = files.length;
          if (!STATE.np.name.trim()) STATE.np.name = STATE.np.targetName;
          render();
        });
      });
      var dropEl = root.querySelector('#np-drop');
      if (dropEl) {
        dropEl.addEventListener('dragover', function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropEl.classList.add('drag');
        });
        dropEl.addEventListener('dragleave', function (e) {
          e.preventDefault();
          dropEl.classList.remove('drag');
        });
        dropEl.addEventListener('drop', function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropEl.classList.remove('drag');
          var dt = e.dataTransfer;
          if (!dt) return;
          var entry =
            dt.items && dt.items.length && dt.items[0].webkitGetAsEntry
              ? dt.items[0].webkitGetAsEntry()
              : null;
          var files = dt.files || [];
          if (entry && entry.isDirectory) {
            STATE.np.targetName = entry.name;
            STATE.np.targetKind = '目录';
            STATE.np.targetFiles = files.length || 0;
          } else if (files.length) {
            var f0 = files[0];
            var n = f0.name || '';
            var isArc = /\.(zip|tar|gz|tgz|bz2|xz)$/i.test(n);
            STATE.np.targetName = isArc ? n.replace(/\.(zip|tar|gz|tgz|bz2|xz)$/i, '') : n;
            STATE.np.targetKind = isArc
              ? '压缩包'
              : STATE.np.category === 'app'
                ? '二进制/固件'
                : '单文件';
            STATE.np.targetFiles = files.length;
          } else return;
          if (!STATE.np.name.trim()) STATE.np.name = STATE.np.targetName;
          render();
        });
      }
      var tpInput = root.querySelector('[data-np="target_path"]');
      if (tpInput)
        tpInput.addEventListener('change', function () {
          var v = tpInput.value || '';
          var seg = v
            .replace(/[\\/]+$/, '')
            .split(/[\\/]/)
            .pop();
          if (!seg) return;
          STATE.np.targetName = seg;
          STATE.np.targetKind = '服务器路径';
          STATE.np.targetFiles = 0;
          if (!STATE.np.name.trim()) STATE.np.name = seg;
          render();
        });
      // 关联被测对象：选中变化时原地更新「已关联」回显卡（创建页输入不触发整页重渲染）
      var relSel = root.querySelector('select[data-np="target_id"]');
      if (relSel)
        relSel.addEventListener('change', function () {
          var chip = root.querySelector('#np-rel-chip');
          if (!chip) return;
          var t = POSTURE.targets.find(function (x) {
            return x.id === relSel.value;
          });
          chip.style.display = t ? '' : 'none';
          if (t) {
            chip.querySelector('.b').textContent = t.name;
            chip.querySelector('.muted').textContent = t.identity;
          }
        });
      root.querySelectorAll('[data-np]').forEach(function (el) {
        el.addEventListener('change', function () {
          STATE.np[el.getAttribute('data-np')] = el.value;
        });
        el.addEventListener('input', function () {
          STATE.np[el.getAttribute('data-np')] = el.value;
        });
      });
      onClick(root, '#btn-np-create', function () {
        if (!STATE.np.name.trim()) {
          STATE.npError = '演示环境：请填写任务名称（静态 demo 不会真正启动扫描）。';
          render();
          return;
        }
        if (!STATE.np.model_config_id) {
          STATE.npError = '请选择大模型配置。';
          render();
          return;
        }
        if (STATE.np.category === 'web' && !STATE.np.website_url.trim()) {
          STATE.npError = '请填写在线网站 URL。';
          render();
          return;
        }
        if (STATE.np.category !== 'web' && !STATE.np.target_path.trim()) {
          STATE.npError = '请上传目标或填写服务器路径。';
          render();
          return;
        }
        STATE.npError = '演示环境为静态快照，不支持创建任务。';
        render();
      });

      // models
      onClick(root, '#btn-model-add', function () {
        STATE.modelDraft = {
          id: '',
          name: '',
          vendor: '',
          base_url: '',
          api_key: '',
          tested: false,
          testing: false,
        };
        STATE.modelError = '';
        render();
      });
      onClick(root, '[data-medit]', function (e) {
        var m = D.modelConfigs.find(function (x) {
          return x.id === e.currentTarget.getAttribute('data-medit');
        });
        if (!m) return;
        STATE.modelDraft = {
          id: m.id,
          name: m.name,
          vendor: m.vendor || '',
          base_url: m.base_url,
          api_key: '',
          has_api_key: !!m.has_api_key,
          tested: false,
          testing: false,
        };
        STATE.modelError = '';
        render();
      });
      onClick(root, '[data-mdel]', function (e) {
        STATE.modelDeleting = e.currentTarget.getAttribute('data-mdel');
        render();
      });
      onClick(root, '#m-del-confirm', function () {
        var id = STATE.modelDeleting;
        D.modelConfigs = D.modelConfigs.filter(function (m) {
          return m.id !== id;
        });
        modelStoreSave();
        STATE.modelDeleting = null;
        render();
        demoToast('模型配置已删除');
      });
      // close add/edit/delete overlays: backdrop, X, 取消
      onClick(root, '[data-mclose]', function () {
        STATE.modelDraft = null;
        STATE.modelDeleting = null;
        STATE.modelError = '';
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
            if (b && !STATE.modelDraft.testing) {
              b.classList.remove('ok');
              b.innerHTML = icon('zap', 14) + ' 测试链接';
            }
          }
        });
      });
      // inline connectivity test: button only, 测试中… -> green ✓ 已通过
      onClick(root, '#m-test-btn', function () {
        var d = STATE.modelDraft;
        if (!d || d.testing) return;
        var err = modelValidate(d);
        var errEl = document.getElementById('m-error');
        if (err) {
          STATE.modelError = err;
          if (errEl) errEl.textContent = err;
          return;
        }
        STATE.modelError = '';
        if (errEl) errEl.textContent = '';
        d.testing = true;
        var btn = document.getElementById('m-test-btn');
        if (btn) {
          btn.disabled = true;
          btn.classList.remove('ok');
          btn.innerHTML = icon('zap', 14) + ' 测试中…';
        }
        setTimeout(function () {
          if (!STATE.modelDraft) return;
          d.testing = false;
          d.tested = true;
          var b2 = document.getElementById('m-test-btn');
          if (b2 && b2.isConnected) {
            b2.disabled = false;
            b2.classList.add('ok');
            b2.innerHTML = icon('check', 14) + ' ✓ 已通过';
          }
          demoToast('连接测试成功');
        }, 800);
      });
      // save requires a passed connectivity test first
      onClick(root, '#m-save', function () {
        var d = STATE.modelDraft;
        if (!d) return;
        if (!d.tested) {
          STATE.modelError = '请先完成连通性测试，再保存配置';
          render();
          return;
        }
        var err = modelValidate(d);
        if (err) {
          STATE.modelError = err;
          render();
          return;
        }
        var id = d.id || 'mdl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        var existing = D.modelConfigs.find(function (m) {
          return m.id === id;
        });
        var keyEntered = (d.api_key || '').trim();
        var rec = existing
          ? Object.assign({}, existing)
          : { id: id, created_at: Date.now() / 1000 };
        rec.name = d.name.trim();
        rec.vendor = (d.vendor || '').trim();
        rec.base_url = d.base_url.trim().replace(/\/$/, '');
        rec.model = rec.model || rec.name;
        rec.updated_at = Date.now() / 1000;
        rec.last_test_status = 'passed';
        rec.last_test_message = '连通性测试通过（本地模拟）';
        rec.last_test_at = Date.now() / 1000;
        if (keyEntered) {
          rec.has_api_key = true;
          rec.masked_api_key = maskKey(keyEntered);
        } else if (!existing) {
          rec.has_api_key = false;
        }
        var at = D.modelConfigs.findIndex(function (m) {
          return m.id === id;
        });
        if (at >= 0) D.modelConfigs[at] = rec;
        else D.modelConfigs.push(rec);
        modelStoreSave();
        STATE.modelDraft = null;
        STATE.modelError = '';
        render();
        demoToast('配置成功');
      });
      // card test: only the status tag flips, no modal
      onClick(root, '[data-mtest]', function (e) {
        var m = D.modelConfigs.find(function (x) {
          return x.id === e.currentTarget.getAttribute('data-mtest');
        });
        if (!m || m.read_only || m._testing) return;
        m._testing = true;
        render();
        setTimeout(function () {
          m._testing = false;
          var ok = !!m.has_api_key;
          m.last_test_status = ok ? 'passed' : 'failed';
          m.last_test_message = ok ? '连通性测试通过（本地模拟）' : '连接测试失败：缺少 API Key';
          m.last_test_at = Date.now() / 1000;
          modelStoreSave();
          render();
          demoToast(ok ? '连接测试成功' : '连接测试失败：缺少 API Key');
        }, 800);
      });
      onClick(root, '[data-test]', function () {
        demoToast('演示环境不发起模型连通性测试。');
      });

      // write ops → demo toast
      onClick(root, '[data-del]', function (e) {
        e.stopPropagation();
        demoToast('演示环境为静态快照，删除操作不会生效。');
      });
      // 列表级导出报告：与详情页导出走同一份 Markdown
      onClick(root, '[data-task-md]', function (e) {
        e.stopPropagation();
        var p = D.projects.find(function (x) {
          return x.id === e.currentTarget.getAttribute('data-task-md');
        });
        if (!p) return;
        downloadFile(
          slug(p.name) + '_报告.md',
          reportToMarkdown(
            p,
            D.findingsByJob[p.id] || [],
            D.probesByJob[p.id] || [],
            D.patchesByJob[p.id] || [],
          ),
          'text/markdown;charset=utf-8',
        );
      });
      // 任务列表：整行点击进入详情（内部 a/button 除外）
      onClick(root, '.task-row[data-goto]', function (e) {
        if (e.target && e.target.closest && e.target.closest('a,button')) return;
        goRoute(e.currentTarget.getAttribute('data-goto'));
      });
      // 被测对象列表：整行点击进入对象详情（内部 a/button 除外）
      onClick(root, '.posture-target-row[data-goto]', function (e) {
        if (e.target && e.target.closest && e.target.closest('a,button')) return;
        goRoute(e.currentTarget.getAttribute('data-goto'));
      });
      // 任务列表：状态控制下拉
      onClick(root, '[data-statusact]', function (e) {
        e.stopPropagation();
        demoToast('演示环境为静态快照，不支持修改任务状态。');
      });

      onClick(root, '#btn-del', function () {
        demoToast('演示环境为静态快照，删除操作不会生效。');
      });
      onClick(root, '#btn-refresh', function () {
        demoToast('本地记录为静态快照，无需刷新。');
      });
      onClick(root, '#btn-stop', function () {
        demoToast('演示环境没有运行中的任务可停止。');
      });

      // report actions
      onClick(root, '#btn-export-toggle', function () {
        STATE.reportExportOpen = !STATE.reportExportOpen;
        render();
      });
      onClick(root, '#btn-report-pdf', function () {
        STATE.reportExportOpen = false;
        render();
        printReport();
      });
      onClick(root, '#btn-log-download', function () {
        var p = D.projects.find(function (x) {
          return x.id === STATE.projectId;
        });
        if (!p) return;
        downloadFile(slug(p.name) + '_运行日志.log', fullLogText(p), 'text/plain;charset=utf-8');
      });

      function exportReportMarkdown() {
        var project = D.projects.find(function (p) {
          return p.id === STATE.projectId;
        });
        if (!project) return;
        var md = reportToMarkdown(
          project,
          D.findingsByJob[project.id] || [],
          D.probesByJob[project.id] || [],
          D.patchesByJob[project.id] || [],
        );
        downloadFile(slug(project.name) + '_报告.md', md, 'text/markdown;charset=utf-8');
      }
      onClick(root, '#btn-report-md', function () {
        STATE.reportExportOpen = false;
        render();
        exportReportMarkdown();
      });

      // log autoscroll    // log autoscroll
      var auto = root.querySelector('#log-autoscroll');
      if (auto)
        auto.addEventListener('change', function () {
          STATE.logAutoscroll = auto.checked;
        });
      var pre = root.querySelector('#log-pre');
      if (pre && STATE.logAutoscroll) pre.scrollTop = pre.scrollHeight;
    }

    // 平台负责外壳与路由：这里只暴露挂载接口，不再自己监听 hashchange。
    window.ScanApp = {
      mount: function () {
        render();
      },
      navigate: goRoute,
      getRoute: function () {
        return ROUTE;
      },
    };
    // 本地记录保鲜：运行中任务的启动时间取相对当前时间，避免静态快照过期（仅 demo_run_* 任务）
    (function () {
      D.projects.forEach(function (p) {
        if (p.status === 'running' && /^demo_run/.test(p.id)) {
          var now = Date.now() / 1000;
          p.created_at = now - 420;
          p.started_at = now - 360;
        }
      });
    })();
    modelStoreLoad();
    render();
  })();
};
