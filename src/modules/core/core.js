/* core/core。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/core'] = function () {
  (function () {
    'use strict';
    const key = 'zhian-standalone-attack';
    const paths = {
      shield:
        'M12 3 4.5 6v5c0 4.8 3 8.2 7.5 10 4.5-1.8 7.5-5.2 7.5-10V6L12 3Z M8.8 11.8l2.2 2.2 4.5-4.5',
      activity: 'M3 12h4l3-8 4 16 3-8h4',
      check: 'm5 12 4 4L19 6',
      close: 'm6 6 12 12M6 18 18 6',
      search: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.5-2 5 5',
      arrow: 'M4 12h15m-6-6 6 6-6 6',
      'arrow-left': 'M20 12H5m6-6-6 6 6 6',
      chevron: 'm9 5 7 7-7 7',
      plus: 'M12 5v14M5 12h14',
      download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
      filter: 'M4 6h16M7 12h10M10 18h4',
      play: 'm8 4 12 8-12 8V4Z',
      pause: 'M8 5v14M16 5v14',
      file: 'M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6',
      settings:
        'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z',
      user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-2c0-3 3.5-5 8-5s8 2 8 5v2',
      clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
      alert: 'm12 3 10 18H2L12 3Zm0 6v5m0 3v1',
      eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
      code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
      link: 'm9 15 6-6M7 17l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M17 7l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
      copy: 'M8 8h13v13H8V8ZM4 16H2V2h14v2',
      grid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
      spark: 'm12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z',
      terminal: 'M3 4h18v16H3V4Zm4 4 4 4-4 4m6 0h4',
      logout: 'M9 3H3v18h6M9 12h12m-5-5 5 5-5 5',
      help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v1',
      layers: 'm12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5M3 17l9 5 9-5',
      bell: 'M5 16h14l-2-4V8a5 5 0 0 0-10 0v4l-2 4Zm5 4h4',
      box: 'M12 3 3 7.5v9L12 21l9-4.5v-9L12 3ZM3 7.5l9 4.5 9-4.5M12 12v9',
      zap: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
      edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
      trash:
        'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6',
    };
    // 演示环境：每次打开或刷新都从初始数据开始。
    // 清掉旧版本和上次操作留下的本地数据（含扫描器的 zhian-scan-models），
    // 避免历史任务、复测产生的进行中任务在刷新后重新出现。
    try {
      Object.keys(localStorage)
        .filter((k) => k === key || k.startsWith('zhian-'))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
    const stored = {};
    const A = (window.App = {
      data: stored,
      modules: {},
      page: 'workspace',
      storageOK: true,
      escape: (s) =>
        String(s ?? '').replace(
          /[&<>"']/g,
          (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
        ),
      icon: (n, s = 18) =>
        `<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n] || paths.shield}"/></svg>`,
      badge: (t, tone = 'gray') => `<span class="badge ${tone}">${A.escape(t)}</span>`,
      // 统一时间展示：接受 ISO（2026-10-19T02:23:40.000Z）或已是 "YYYY-MM-DD HH:MM"，
      // 一律规整为本地 "YYYY-MM-DD HH:MM"，避免页面上出现裸 ISO。
      fmtTime: (v) => {
        if (!v) return '';
        const s = String(v);
        if (!s.includes('T')) return s.length > 16 ? s.slice(0, 16) : s;
        const d = new Date(s);
        return isNaN(d.getTime()) ? s : d.toLocaleString('sv-SE', { hour12: false }).slice(0, 16);
      },
      save() {
        try {
          localStorage.setItem(key, JSON.stringify(A.data));
        } catch (e) {
          A.storageOK = false;
          A.toast('浏览器存储不可用，本次修改仅在当前页面保留');
        }
      },
      toast(t) {
        const el = document.getElementById('toast');
        el.textContent = t;
        el.classList.add('show');
        clearTimeout(A.toastTimer);
        A.toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
      },
      download(name, text, mime = 'text/plain;charset=utf-8') {
        const blob = new Blob([text], { type: mime }),
          url = URL.createObjectURL(blob),
          link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        A.toast('文件已生成并下载');
      },
      modal(title, body, footer, opts = {}) {
        A.focusReturn = document.activeElement;
        const overlay = document.getElementById('modal');
        overlay.innerHTML = `<section class="modal-panel ${opts.wide ? 'wide' : ''} ${opts.plain ? 'plain' : ''}" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button class="close-btn" aria-label="关闭弹窗" onclick="App.closeModal()">${A.icon('close', 20)}</button></div><div class="modal-body">${body}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</section>`;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('button')?.focus();
      },
      closeModal() {
        document.getElementById('modal').classList.remove('open');
        document.body.style.overflow = document.querySelector('.overlay.open') ? 'hidden' : '';
        A.focusReturn?.focus?.();
      },
      drawer(title, body, footer) {
        A.focusReturn = document.activeElement;
        const overlay = document.getElementById('drawer');
        overlay.innerHTML = `<section class="modal-panel drawer-panel" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button class="close-btn" aria-label="关闭详情" onclick="App.closeDrawer()">${A.icon('close', 20)}</button></div><div class="modal-body">${body}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</section>`;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('button')?.focus();
      },
      closeDrawer() {
        document.getElementById('drawer').classList.remove('open');
        document.body.style.overflow = document.querySelector('.overlay.open') ? 'hidden' : '';
        A.focusReturn?.focus?.();
      },
      // 只负责画内容区；顶栏、侧边栏、文档标题由 platform-render 段在每次重绘后统一刷新。
      render() {
        if (!A.session) return;
        const host = document.getElementById('view'),
          html = A.modules[A.page].render();
        if (A.updateHTML) A.updateHTML(host, html);
        else if (host.innerHTML !== html) host.innerHTML = html;
        A.modules[A.page].afterRender?.();
      },
      // back：可选，传入没有上一页时的回退 hash（或 { action }）；传入后标题左侧显示返回按钮。
      heading(eye, title, desc, actions = '', back) {
        const text = `<div class="eyebrow">${eye}</div><h1>${title}</h1>${desc ? `<p class="page-desc">${desc}</p>` : ''}`,
          main =
            back == null
              ? `<div>${text}</div>`
              : `<div class="page-heading-main">${typeof back === 'object' ? A.backButton('', back.action) : A.backButton(back)}<div>${text}</div></div>`;
        return `<div class="page-heading">${main}<div class="page-actions">${actions}</div></div>`;
      },
      start() {
        Object.values(A.modules).forEach((m) => m.init?.());
        A.save();
        if (A.session) A.showApp();
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            A.closeModal();
            A.closeDrawer();
          }
          if (e.key === 'Tab') {
            const ov = document.querySelector('.overlay.open');
            if (!ov) return;
            const els = [
              ...ov.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]'),
            ].filter((x) => !x.disabled && x.offsetParent !== null);
            const first = els[0],
              last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        });
        window.addEventListener('hashchange', () => {
          const page = location.hash.slice(1);
          if (A.modules[page] && A.session) {
            A.page = page;
            A.render();
          }
        });
        setInterval(() => {
          if (!A.session) return;
          let changed = false;
          for (const [name, m] of Object.entries(A.modules)) {
            if (m.tick?.()) {
              changed = true;
              if (
                name === A.page &&
                (!A.platform ||
                  A.platform.state.section === 'workspace' ||
                  (A.platform.state.section === 'exercise' && A.platform.state.item === 'tasks') ||
                  (A.platform.state.section === 'scan' && A.platform.state.item === 'tasks')) &&
                m.shouldRenderTick?.() !== false &&
                !document.querySelector('.overlay.open') &&
                !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
              )
                A.render();
            }
          }
          if (changed) A.save();
        }, 1800);
      },
    });
  })();
};
