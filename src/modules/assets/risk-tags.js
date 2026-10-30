/* assets/risk-tags。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['assets/risk-tags'] = function () {
  (function () {
    'use strict';
    const A = window.App,
      D = A.evaluationDatasets,
      E = A.escape,
      copy = (v) => JSON.parse(JSON.stringify(v)),
      now = () => new Date().toISOString(),
      time = (v) => A.listConsistency.time(v);
    const btn = (text, action) => `<button class="link-btn" onclick="${action}">${text}</button>`;
    const T = (A.datasetTags = {});
    T.catalog = () => D.db().tagCatalog || (D.db().tagCatalog = []);
    T.rows = () =>
      [
        ...new Set([
          ...T.catalog().map((t) => t.name),
          ...D.rows(false).flatMap((r) => D.annotation(r).tags),
        ]),
      ]
        .sort()
        .map((name) => ({
          name,
          count: D.rows(false).filter((r) => D.annotation(r).tags.includes(name)).length,
          createdAt: T.catalog().find((t) => t.name === name)?.createdAt,
        }));
    T.open = function () {
      const rows = T.rows();
      A.modal(
        '标签管理',
        `<p class="hint">场景、攻击方法、判定结果自动生成；下方维护人工标签，便于筛选复用和训练样本。</p><div class="toolbar"><input id="tag-new" maxlength="30" aria-label="新标签名称" placeholder="例如：训练候选、业务重点"><button class="btn primary" onclick="App.datasetTags.create()">新建标签</button></div><p id="tag-error" class="error-message"></p><div class="table-wrap"><table><thead><tr><th>人工标签</th><th>关联样本</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${rows.map((r, i) => `<tr><td>${E(r.name)}</td><td>${r.count}</td><td class="lc-time">${time(r.createdAt)}</td><td>${btn('查看样本', `App.datasetTags.view(${i})`)} ${btn('重命名', `App.datasetTags.edit(${i})`)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">暂无人工标签，新建后可在样本列表批量添加。</td></tr>'}</tbody></table></div>`,
        '<button class="btn" onclick="App.closeModal()">关闭</button>',
        { wide: true },
      );
    };
    T.create = function () {
      const name = document.getElementById('tag-new').value.trim();
      if (
        !name ||
        name.length > 30 ||
        /[,，\n]/.test(name) ||
        T.rows().some((t) => t.name === name)
      ) {
        document.getElementById('tag-error').textContent =
          '请输入不重复的标签名称，最多 30 字，不含逗号';
        return false;
      }
      const before = copy(D.db());
      T.catalog().push({ name, createdAt: now() });
      if (!D.persist(before, 'tag-error')) return false;
      T.open();
      return true;
    };
    T.view = function (i) {
      const r = T.rows()[i];
      if (!r) return;
      D.filter = { query: '', scene: '', method: '', result: '', tag: r.name, kind: '', task: '' };
      D.tab = 'records';
      D.page = 1;
      A.closeModal();
      A.render();
    };
    T.edit = function (i) {
      const r = T.rows()[i];
      if (!r) return;
      T.old = r.name;
      A.modal(
        '重命名标签',
        `<p>同步更新 ${r.count} 条样本的人工标签。已冻结的数据集版本保留原标签。</p><input id="tag-rename" maxlength="30" aria-label="标签名称" value="${E(r.name)}"><p id="tag-error" class="error-message"></p>`,
        `<button class="btn" onclick="App.datasetTags.open()">取消</button><button class="btn primary" onclick="App.datasetTags.rename()">保存</button>`,
      );
    };
    T.rename = function () {
      const name = document.getElementById('tag-rename').value.trim(),
        old = T.old;
      if (
        !name ||
        name.length > 30 ||
        /[,，\n]/.test(name) ||
        T.rows().some((t) => t.name === name && name !== old)
      ) {
        document.getElementById('tag-error').textContent = '名称为空、重复或格式不正确';
        return false;
      }
      const before = copy(D.db());
      for (const a of Object.values(D.db().annotations))
        if (a.tags.includes(old)) {
          a.tags = a.tags.map((t) => (t === old ? name : t));
          a.history.push({
            action: 'rename-tag',
            from: old,
            to: name,
            at: now(),
            actor: A.session?.user || '安全管理员',
          });
        }
      const entry = T.catalog().find((t) => t.name === old);
      if (entry) entry.name = name;
      else T.catalog().push({ name, createdAt: null });
      if (!D.persist(before, 'tag-error')) return false;
      if (D.filter.tag === old) D.filter.tag = name;
      A.render();
      T.open();
      return true;
    };
    const datasetRender = D.render;
    D.render = function () {
      return datasetRender
        .apply(this, arguments)
        .replace(
          '<div class="tabs">',
          `<div class="rt-tag-entry"><span>自动标签：场景 / 方法 / 结果　人工标签：整理与复用</span>${btn('管理人工标签', 'App.datasetTags.open()')}</div><div class="tabs">`,
        );
    };
  })();
};
