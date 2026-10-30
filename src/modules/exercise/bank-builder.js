/* exercise/bank-builder。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['exercise/bank-builder'] = function () {
  (function () {
    const A = App,
      B = A.banks,
      X = A.attack,
      E = A.escape,
      copy = (v) => JSON.parse(JSON.stringify(v));
    B.catalog = { source: 'all', query: '' };
    B.catalogRows = () =>
      B.db.filter(
        (b) =>
          (B.catalog.source === 'all' || (b.builtin ? 'builtin' : 'custom') === B.catalog.source) &&
          b.name.toLocaleLowerCase().includes(B.catalog.query.trim().toLocaleLowerCase()),
      );
    B.searchCatalog = function (value) {
      B.catalog.query = value;
      document.getElementById('bank-catalog-rows').innerHTML = B.catalogTable();
      const count = document.getElementById('bank-catalog-count');
      if (count) count.textContent = `共 ${B.catalogRows().length} 个题库`;
    };
    B.filterCatalog = function (value) {
      if (!['all', 'builtin', 'custom'].includes(value)) return;
      B.catalog.source = value;
      A.render();
    };
    B.render = () =>
      `<div class="page-heading"><div><h1>全部题库</h1></div><div class="page-actions"><div class="flex"><button class="btn primary" onclick="App.banks.create()">新建题库</button></div></div></div><section class="card bank-catalog"><div class="bank-catalog-toolbar"><input id="bank-catalog-search" aria-label="搜索题库名称" placeholder="搜索题库名称" value="${E(B.catalog.query)}" oninput="App.banks.searchCatalog(this.value)"><select aria-label="筛选题库来源" onchange="App.banks.filterCatalog(this.value)">${[
        ['all', '全部来源'],
        ['builtin', '系统'],
        ['custom', '自建'],
      ]
        .map(
          ([value, label]) =>
            `<option value="${value}" ${B.catalog.source === value ? 'selected' : ''}>${label}</option>`,
        )
        .join(
          '',
        )}</select><span id="bank-catalog-count">共 ${B.catalogRows().length} 个题库</span></div><div class="table-wrap"><table><thead><tr><th>题库名称</th><th>来源</th><th>行业</th><th>题目数量</th><th>操作</th></tr></thead><tbody id="bank-catalog-rows">${B.catalogTable()}</tbody></table></div></section>`;
    B.template = () =>
      A.download(
        '题库导入模板.json',
        JSON.stringify(
          {
            schemaVersion: 2,
            name: '我的题库',
            industry: '安全通用',
            _填写指引: [
              '每道题填写 prompt 与 scenes；scenes 是一层标签名称数组，可填写一个或多个标签。',
              '下方覆盖范围只是解释各标签适用的测试内容，不是额外标签，不构成二级分类。请勿把覆盖说明填写到 scenes。',
              '可直接使用推荐场景，也可填写符合业务需要的自定义场景名称（1–32 个字符）；不限于下列范围。',
              '按题目的实际测试目标分类；标签描述测试主题，不代表题目本身必然有害。',
              '只有成功导入的题目实际使用的标签才会出现在场景筛选框。',
            ],
            _场景分类指引: window.BankSceneData.categories.map((s) => ({
              场景标签: s.label,
              覆盖范围: s.coverage,
            })),
            items: [
              {
                id: 'Q-00001',
                prompt: '请说明如何保护个人隐私。',
                scenes: ['隐私、数据与秘密泄露'],
              },
              {
                id: 'Q-00002',
                prompt: '请说明如何识别并防范恶意软件。',
                scenes: ['网络攻击与系统滥用'],
              },
              {
                id: 'Q-00003',
                prompt: '请说明本企业客服应遵守的服务边界。',
                scenes: ['企业客服服务边界'],
              },
            ],
          },
          null,
          2,
        ),
        'application/json',
      );
    B.create = function (id) {
      const b = id ? B.get(id) : null;
      if (b?.builtin) return;
      A.closeDrawer();
      B.draft = {
        id: b?.id,
        name: b?.name || '',
        industry: b?.industry || '',
        metadata: copy(b || {}),
        sources: copy(b?.sources || []),
        items: [],
        existing: copy(b?.items || []),
        message: '',
        page: 1,
      };
      B.edit();
    };
    B.edit = function () {
      const d = B.draft;
      if (!d) return;
      const pages = Math.max(1, Math.ceil(d.items.length / 10));
      d.page = Math.max(1, Math.min(d.page, pages));
      const scroll = document.querySelector('#modal .modal-body')?.scrollTop || 0;
      A.modal(
        d.id ? '添加题目' : '新建题库',
        `<div class="field"><label>题库名称 *</label><input aria-label="题库名称" maxlength="100" value="${E(d.name)}" oninput="App.banks.draft.name=this.value" ${d.id ? 'readonly' : ''}></div>${B.industryField(d)}
    <div class="bank-import-row"><label class="btn">上传文件<input type="file" accept=".json,application/json" hidden onchange="App.banks.addFile(this.files[0])"></label><button class="link-btn" onclick="App.banks.template()">下载 JSON 模板</button></div><div class="bank-import-note"><span class="hint">JSON 文件不超过 5 MB</span></div>${d.message ? `<p class="error-message" role="alert">${E(d.message)}</p>` : ''}
    <div class="bank-draft-heading"><h3>待入库题目 ${d.items.length}${d.id ? ' · 已有 ' + d.existing.length + ' 题' : ''}</h3></div>
    <div class="table-wrap"><table class="bank-draft-table"><thead><tr><th>原始题目</th><th>攻击场景</th><th>操作</th></tr></thead><tbody>${
      d.items
        .slice((d.page - 1) * 10, d.page * 10)
        .map((q, i) => {
          const index = (d.page - 1) * 10 + i;
          return `<tr><td><span class="bank-draft-number">${index + 1}</span><p>${E(q.prompt)}</p></td><td><div class="scene-tags">${A.sceneTags.html(q)}</div></td><td><button class="entry-delete" onclick="App.banks.draft.items.splice(${index},1);App.banks.draft.customSceneRow=null;App.banks.edit()" aria-label="删除" title="删除" type="button">删除</button></td></tr>`;
        })
        .join('') ||
      '<tr><td colspan="3" class="empty">上传 JSON 文件，自动解析题目与场景</td></tr>'
    }</tbody></table></div>
    <div class="table-foot"><span>共 ${d.items.length} 题</span><div class="flex"><button class="btn small" ${d.page === 1 ? 'disabled' : ''} onclick="App.banks.draft.page--;App.banks.edit()">上一页</button><span>${d.page} / ${pages}</span><button class="btn small" ${d.page === pages ? 'disabled' : ''} onclick="App.banks.draft.page++;App.banks.edit()">下一页</button></div></div>`,
        `<button class="btn" onclick="App.banks.draft=null;App.closeModal()">取消</button><button class="btn primary" ${!d.items.length ? 'disabled' : ''} onclick="App.banks.saveDraft()">保存题库</button>`,
        { wide: true },
      );
      const body = document.querySelector('#modal .modal-body');
      if (body) body.scrollTop = scroll;
    };
    B.merge = function (items) {
      const d = B.draft,
        seen = new Set([...d.existing, ...d.items].map((q) => q.prompt.trim()));
      let added = 0,
        duplicates = 0;
      const next = [];
      for (const q of items) {
        const key = q.prompt.trim();
        if (seen.has(key)) {
          duplicates++;
          continue;
        }
        seen.add(key);
        next.push({ ...q, prompt: key });
        added++;
      }
      if (d.existing.length + d.items.length + next.length > 10000)
        throw Error('每个题库最多 10000 题');
      d.items.push(...next);
      d.message = '';
      A.toast(`已添加 ${added} 题${duplicates ? `，跳过 ${duplicates} 道重复题目` : ''}`);
    };
    B.addFile = async function (file) {
      const d = B.draft;
      if (!file || !d) return;
      try {
        if (file.size > 5 * 1024 * 1024) throw Error('文件超过 5 MB');
        if (!/\.json$/i.test(file.name)) throw Error('请选择 JSON 文件');
        const parsed = B.parse(await file.text(), file.name);
        if (B.draft !== d) return;
        const missing = parsed.items
          .map((q, i) => (A.sceneTags.resolve(q).length ? null : i + 1))
          .filter(Boolean);
        if (missing.length)
          throw Error(
            `第 ${missing.slice(0, 8).join('、')} 题缺少可识别的场景，请按 JSON 模板填写 scenes 字段后重新上传`,
          );
        B.merge(parsed.items);
        if (!d.name.trim()) d.name = parsed.name;
        if (parsed.industry && !d.id && !d.industryTouched && !(d.industry || '').trim()) {
          d.industry = String(parsed.industry).trim().slice(0, 32) || '通用';
          d.industryMode = d.industry === '通用' ? 'general' : 'custom';
        }
        const sources = [
          ...(parsed.sources || []),
          {
            fileName: file.name,
            ...(parsed.source != null ? { source: parsed.source } : {}),
            ...(parsed.provenance != null ? { provenance: parsed.provenance } : {}),
          },
        ];
        const known = new Set(d.sources.map((s) => JSON.stringify(s)));
        for (const source of sources)
          if (!known.has(JSON.stringify(source))) {
            d.sources.push(source);
            known.add(JSON.stringify(source));
          }
      } catch (e) {
        if (B.draft !== d) return;
        d.message = e.message;
      }
      B.edit();
    };
    B.pickTasks = function () {
      const rows = [];
      for (const t of X.db.tasks)
        for (const u of t.units) {
          if (u.result === 'pending') continue;
          const q = t.bankSnapshot?.items.find((q) => q.id === u.questionId),
            prompt = q?.prompt || u.seedPrompt;
          if (typeof prompt !== 'string' || !prompt.trim()) continue;
          rows.push({
            key: JSON.stringify([t.id, u.id]),
            taskId: t.id,
            taskName: t.name,
            unitId: u.id,
            method: u.method,
            result: u.result,
            prompt,
            category: q?.category || '',
            target: q?.target,
          });
        }
      B.extraction = { rows, selected: new Set(), task: '', result: 'all', page: 1, name: '' };
      B.extractRender();
    };
    B.extractRows = function () {
      const d = B.extraction;
      return d.rows.filter(
        (r) => r.taskId === d.task && (d.result === 'all' || r.result === d.result),
      );
    };
    B.extractRender = function () {
      const d = B.extraction;
      if (!d) return;
      const rows = B.extractRows(),
        pages = Math.max(1, Math.ceil(rows.length / 10));
      d.page = Math.max(1, Math.min(d.page, pages));
      const checked = rows.filter((r) => d.selected.has(r.key)).length;
      A.modal(
        '从任务添加原始题目',
        `<div class="extract-toolbar"><div class="field"><label for="extract-task">演练任务</label><select id="extract-task" onchange="App.banks.extractFilter('task',this.value)"><option value="" ${!d.task ? 'selected' : ''}>请选择演练任务</option>${X.db.tasks.map((t) => `<option value="${E(t.id)}" ${d.task === t.id ? 'selected' : ''}>${E(t.name)}</option>`).join('')}</select></div><div class="field"><label for="extract-result">攻击结果</label><select id="extract-result" ${!d.task ? 'disabled' : ''} onchange="App.banks.extractFilter('result',this.value)">${[
          ['all', '全部结果'],
          ['breach', '已攻破'],
          ['defended', '已守住'],
          ['error', '执行异常'],
        ]
          .map(([v, n]) => `<option value="${v}" ${d.result === v ? 'selected' : ''}>${n}</option>`)
          .join('')}</select></div></div>${
          d.task
            ? `<div class="record-selection-bar"><strong>已选 ${d.selected.size} 条</strong><button class="link-btn" onclick="App.banks.extraction.selected.clear();App.banks.extractRender()">清空选择</button></div><div class="table-wrap"><table class="extract-table"><thead><tr><th><input id="extract-select-all" type="checkbox" aria-label="选择当前筛选的全部记录" ${rows.length && checked === rows.length ? 'checked' : ''} ${!rows.length ? 'disabled' : ''} onchange="App.banks.extractSelect('filtered',this.checked)"></th><th>记录</th><th>原始题目</th><th>结果</th></tr></thead><tbody>${
                rows
                  .slice((d.page - 1) * 10, d.page * 10)
                  .map(
                    (r) =>
                      `<tr><td><input type="checkbox" aria-label="选择 ${E(r.unitId)}" ${d.selected.has(r.key) ? 'checked' : ''} onchange="App.banks.extractToggle(${d.rows.indexOf(r)},this.checked)"></td><td>${E(r.unitId)}</td><td class="pre-any">${E(r.prompt)}</td><td>${A.badge({ breach: '已攻破', defended: '已守住', error: '执行异常' }[r.result], r.result === 'breach' ? 'orange' : 'gray')}</td></tr>`,
                  )
                  .join('') || '<tr><td colspan="4" class="empty">暂无符合条件的记录</td></tr>'
              }</tbody></table></div><div class="table-foot"><span>${rows.length} 条 · ${d.page} / ${pages} 页</span><div class="flex"><button class="btn small" ${d.page === 1 ? 'disabled' : ''} onclick="App.banks.extractPage(-1)">上一页</button><button class="btn small" ${d.page === pages ? 'disabled' : ''} onclick="App.banks.extractPage(1)">下一页</button></div></div>`
            : '<div class="extract-placeholder" aria-hidden="true"></div>'
        }<p id="extract-error" class="error-message" role="alert"></p>`,
        `<button class="btn" onclick="App.banks.extraction=null;App.banks.edit()">返回</button><button class="btn primary" ${d.selected.size ? '' : 'disabled'} onclick="App.banks.extractConfirm()">添加所选题目（${d.selected.size}）</button>`,
        { wide: true },
      );
      const all = document.getElementById('extract-select-all');
      if (all) all.indeterminate = checked > 0 && checked < rows.length;
    };
    B.extractConfirm = function () {
      const d = B.extraction;
      if (!d || !B.draft) return;
      try {
        B.merge(
          d.rows
            .filter((r) => d.selected.has(r.key))
            .map((r) => ({
              prompt: r.prompt,
              ...(r.category ? { category: r.category } : {}),
              ...(r.target ? { target: r.target } : {}),
              source: {
                taskId: r.taskId,
                taskName: r.taskName,
                recordId: r.unitId,
                type: 'original-question',
              },
            })),
        );
        B.extraction = null;
        B.edit();
      } catch (e) {
        document.getElementById('extract-error').textContent = e.message;
      }
    };
    B.extractStart = () => {
      B.create();
      B.pickTasks();
    };
    B.importDialog = () => B.create();
    B.saveDraft = function () {
      const d = B.draft;
      if (!d) return;
      if (d.industryMode === 'custom' && !d.industry?.trim()) {
        d.message = '请填写自定义行业';
        B.edit();
        return;
      }
      if (!d.name.trim() || !d.items.length) {
        d.message = '请填写题库名称并添加题目';
        B.edit();
        return;
      }
      const old = copy(A.data.banks || []);
      const ids = new Set(d.existing.map((q) => q.id));
      let n = 1;
      const added = d.items.map((q) => {
        let id;
        do {
          id = 'Q-' + String(n++).padStart(5, '0');
        } while (ids.has(id));
        ids.add(id);
        return { ...q, id };
      });
      const bank = {
        ...d.metadata,
        id: d.id || 'bank-' + Date.now(),
        createdAt: d.id
          ? old.find((b) => b.id === d.id)?.createdAt ||
            old.find((b) => b.id === d.id)?.created ||
            null
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: d.name.trim(),
        industry: (d.industry || '').trim() || '通用',
        ...(d.sources.length ? { sources: d.sources } : {}),
        items: [...d.existing, ...added],
      };
      A.data.banks ||= [];
      const at = A.data.banks.findIndex((b) => b.id === bank.id);
      if (at < 0) A.data.banks.push(bank);
      else A.data.banks[at] = bank;
      try {
        localStorage.setItem(
          'zhian-standalone-attack',
          JSON.stringify(A.storageCodec ? A.storageCodec.encode(A.data) : A.data),
        );
      } catch (e) {
        A.data.banks = old;
        d.message = '存储空间不足，请减少题目后重试';
        B.edit();
        return;
      }
      B.draft = null;
      A.closeModal();
      X.setTab('banks');
      A.toast('题库已保存');
    };
  })();
};
