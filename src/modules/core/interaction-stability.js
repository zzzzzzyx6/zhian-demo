/* core/interaction-stability。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/interaction-stability'] = function () {
  /* Keep unchanged DOM nodes alive during filtering and background updates. */
  (function () {
    'use strict';
    const A = window.App;
    const identity = (n) =>
      n.nodeType === 1
        ? n.id
          ? 'id:' + n.id
          : n.getAttribute('data-id')
            ? 'data:' +
              n.tagName +
              ':' +
              n.getAttribute('data-id') +
              ':' +
              (n.getAttribute('onclick') || '')
            : null
        : null;
    const compatible = (a, b) =>
      a &&
      b &&
      a.nodeType === b.nodeType &&
      (a.nodeType !== 1 || a.tagName === b.tagName) &&
      identity(a) === identity(b);
    function patch(a, b) {
      if (a.nodeType !== 1) {
        if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue;
        return;
      }
      if (a.isEqualNode(b)) return;
      const active = a === document.activeElement,
        details = a.tagName === 'DETAILS',
        opened = details && a.open;
      const oldValue = a.value,
        selection =
          active && typeof a.selectionStart === 'number'
            ? [a.selectionStart, a.selectionEnd]
            : null;
      for (const at of Array.from(a.attributes))
        if (!b.hasAttribute(at.name) && !(details && at.name === 'open'))
          a.removeAttribute(at.name);
      for (const at of Array.from(b.attributes))
        if (a.getAttribute(at.name) !== at.value && !(details && at.name === 'open'))
          a.setAttribute(at.name, at.value);
      // 同名节点之间只做增量更新，保住输入焦点与滚动位置。
      // iframe 与 textarea 内部不是我们生成的；带 data-own-dom 的容器由挂载方自己渲染
      // （例如扫描器），也不能被这里的协调逻辑清空。
      if (a.tagName !== 'IFRAME' && a.tagName !== 'TEXTAREA' && !a.hasAttribute('data-own-dom'))
        children(a, b);
      if (a.tagName === 'INPUT') {
        if (!active && a.type !== 'file' && a.value !== b.value) a.value = b.value;
        if (a.type === 'checkbox' || a.type === 'radio') a.checked = b.checked;
      } else if (a.tagName === 'TEXTAREA') {
        if (a.defaultValue !== b.defaultValue) a.defaultValue = b.defaultValue;
        a.value = active ? oldValue : b.value;
      } else if (a.tagName === 'SELECT') a.value = b.value;
      if (details) a.open = opened;
      if (selection)
        try {
          a.setSelectionRange(...selection);
        } catch (e) {
          /* Not every input supports a selection. */
        }
    }
    function children(a, b) {
      let cursor = a.firstChild;
      for (const next of Array.from(b.childNodes)) {
        let found = cursor;
        if (!compatible(found, next)) {
          const key = identity(next);
          found = key
            ? Array.from(a.childNodes).find((n) => identity(n) === key && compatible(n, next))
            : null;
          if (found) a.insertBefore(found, cursor);
          else {
            a.insertBefore(next.cloneNode(true), cursor);
            continue;
          }
        }
        patch(found, next);
        cursor = found.nextSibling;
      }
      while (cursor) {
        const next = cursor.nextSibling;
        a.removeChild(cursor);
        cursor = next;
      }
    }
    A.updateHTML = function (host, html) {
      if (!host) return;
      // The minimal command-line test DOM has no parser; browsers use incremental updates.
      if (typeof host.cloneNode !== 'function' || typeof document.createRange !== 'function') {
        host.innerHTML = html;
        return;
      }
      const range = document.createRange();
      range.selectNodeContents(host);
      const fragment = range.createContextualFragment(String(html));
      children(host, fragment);
    };
    const modal = A.modal,
      drawer = A.drawer;
    A.modal = function (title, body, footer, opts) {
      const el = document.getElementById('modal'),
        open = el.classList.contains('open');
      if (!open) return modal.apply(A, arguments);
      const y = el.querySelector('.modal-body')?.scrollTop || 0;
      const template = document.createElement('div');
      template.innerHTML = `<section class="modal-panel ${opts?.wide ? 'wide' : ''} ${opts?.plain ? 'plain' : ''}" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button type="button" class="close-btn" aria-label="关闭弹窗" onclick="App.closeModal()">${A.icon('close', 20)}</button></div><div class="modal-body">${body}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</section>`;
      A.updateHTML(el, template.innerHTML);
      const panel = el.querySelector('.modal-body');
      if (panel) panel.scrollTop = y;
    };
    A.drawer = function (title, body, footer) {
      const el = document.getElementById('drawer');
      if (!el.classList.contains('open')) return drawer.apply(A, arguments);
      const y = el.querySelector('.modal-body')?.scrollTop || 0;
      A.updateHTML(
        el,
        `<section class="modal-panel drawer-panel" role="dialog" aria-modal="true" aria-label="${A.escape(title)}"><div class="modal-header"><h2>${title}</h2><button type="button" class="close-btn" aria-label="关闭详情" onclick="App.closeDrawer()">${A.icon('close', 20)}</button></div><div class="modal-body">${body}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</section>`,
      );
      const panel = el.querySelector('.modal-body');
      if (panel) panel.scrollTop = y;
    };
    // Plain buttons inside configuration forms must never submit the document.
    document.addEventListener(
      'click',
      (event) => {
        const button = event.target.closest?.('button');
        if (button && !button.hasAttribute('type') && button.closest('form'))
          button.type = 'button';
      },
      true,
    );
  })();
};
