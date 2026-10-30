/* scan/asset-intake。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['scan/asset-intake'] = function () {
  /* Business entry points own asset creation; tasks retain immutable material snapshots. */
  (function () {
    'use strict';
    const A = window.App,
      S = A.scanProduct,
      G = A.platformGovernance,
      E = A.escape;
    const copy = (x) => JSON.parse(JSON.stringify(x)),
      time = () => new Date().toISOString(),
      uid = (p) => p + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    const options = (rows, value) =>
      rows
        .map(
          ([id, label]) =>
            `<option value="${E(id)}" ${id === value ? 'selected' : ''}>${E(label)}</option>`,
        )
        .join('');
    const error = (text) => {
      const el = document.getElementById('scan-error');
      if (el) el.textContent = text;
      return false;
    };
    const baseInit = S.init,
      baseForm = S.form,
      baseCreate = S.create,
      baseRetest = S.retest;
    S.init = function () {
      const result = baseInit.apply(S, arguments);
      for (const a of A.data.businessAssets.code) {
        if (!Array.isArray(a.versions))
          a.versions = [
            {
              id: uid('version'),
              label: a.revision || 'V1',
              source: 'directory',
              path: a.scanPath || '',
              createdAt: a.createdAt,
              fixtureType: a.fixtureType || null,
              available: !!a.scanPath,
            },
          ];
      }
      return result;
    };
    S.newTask = function () {
      S.init();
      const type = S.tab;
      if (type === 'app-scan') {
        const a = S.assets(type)[0];
        S.draft = {
          name: '',
          type,
          targetId: a?.id || '',
          materialId: a?.scanMaterials?.[0]?.id || '',
          scope: '',
        };
        return S.form();
      }
      S.draft = {
        name: '',
        type,
        targetId: 'new',
        projectName: '',
        source: 'upload',
        materialMode: 'new',
        targetPath: '',
        versionNote: '',
        scope: '',
        url: '',
        versionId: '',
      };
      S.form();
    };
    S.intakeChange = function (key, value) {
      const d = S.draft;
      if (!d) return;
      d[key] = value;
      if (key === 'targetId') {
        const a = S.assets(d.type).find((a) => a.id === value);
        d.projectName = a?.name || '';
        d.url = a?.url || '';
        d.versionId = a?.versions?.at(-1)?.id || '';
        d.materialMode = d.type === 'code-scan' && a ? 'existing' : 'new';
      }
      if (key === 'source' || key === 'materialMode' || key === 'targetId') {
        S.uploadToken = null;
        d.upload = null;
        d.reading = false;
        S.form();
      }
    };
    S.readPackage = async function (input) {
      const d = S.draft,
        file = input.files?.[0];
      if (!d || !file) return;
      const token = uid('upload');
      S.uploadToken = token;
      d.upload = null;
      d.reading = true;
      const status = document.getElementById('scan-file-status');
      if (status) status.textContent = '正在校验文件…';
      try {
        if (!/\.(zip|tar|tar\.gz|tgz)$/i.test(file.name))
          throw new Error('请选择 ZIP、TAR 或 TAR.GZ 代码包。');
        if (!file.size || file.size > 200 * 1024 * 1024)
          throw new Error('代码包须大于 0 且不超过 200 MB。');
        const bytes = await file.arrayBuffer(),
          digest = await crypto.subtle.digest('SHA-256', bytes),
          hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join(
            '',
          );
        if (S.draft !== d || S.uploadToken !== token) return;
        d.upload = { name: file.name, size: file.size, sha256: hash };
        if (status)
          status.textContent = file.name + ' · ' + (file.size / 1024).toFixed(1) + ' KB · 校验完成';
      } catch (e) {
        if (S.draft === d && S.uploadToken === token) {
          if (status) status.textContent = e.message;
        }
      } finally {
        if (S.draft === d && S.uploadToken === token) d.reading = false;
      }
    };
    S.form = function () {
      const d = S.draft;
      if (!d) return;
      if (d.type === 'app-scan') return baseForm.apply(S, arguments);
      const code = d.type === 'code-scan',
        assets = S.assets(d.type),
        asset = assets.find((a) => a.id === d.targetId),
        versions = asset?.versions || [];
      const target = `<div class="field"><label for="scan-project">${code ? '所属项目' : '所属站点'} *</label><select id="scan-project" onchange="App.scanProduct.intakeChange('targetId',this.value)">${options([['new', code ? '新建代码项目' : '添加 Web 站点'], ...assets.map((a) => [a.id, a.name])], d.targetId)}</select></div>${d.targetId === 'new' ? `<div class="field"><label for="scan-project-name">${code ? '项目名称' : '站点名称'} *</label><input id="scan-project-name" maxlength="80" value="${E(d.projectName || '')}" oninput="App.scanProduct.draft.projectName=this.value"></div>` : ''}`;
      const material = code
        ? `${
            asset
              ? `<div class="field"><label for="scan-material-mode">扫描代码</label><select id="scan-material-mode" onchange="App.scanProduct.intakeChange('materialMode',this.value)">${options(
                  [
                    ['existing', '已有版本'],
                    ['new', '上传新版本'],
                  ],
                  d.materialMode,
                )}</select></div>`
              : ''
          }${
            d.materialMode === 'existing' && asset
              ? `<div class="field"><label for="scan-version-id">代码版本 *</label><select id="scan-version-id" onchange="App.scanProduct.draft.versionId=this.value">${options(
                  versions.map((v) => [
                    v.id,
                    v.label + (v.available === false ? ' · 材料不可用' : ''),
                  ]),
                  d.versionId,
                )}</select></div>`
              : `<div class="field"><label for="scan-package">代码包 *</label><input id="scan-package" type="file" accept=".zip,.tar,.gz,.tgz" onchange="App.scanProduct.readPackage(this)"><small id="scan-file-status">${E(d.upload?.name || '支持 ZIP、TAR、TAR.GZ，最大 200 MB')}</small></div><div class="field"><label for="scan-version-note">版本名称 *</label><input id="scan-version-note" maxlength="120" required value="${E(d.versionNote || '')}" placeholder="如 v1.2.0 或 release-2026.10" oninput="App.scanProduct.draft.versionNote=this.value"></div>`
          }`
        : `<div class="field"><label for="scan-url">扫描地址 *</label><input id="scan-url" maxlength="500" value="${E(d.url || '')}" placeholder="https://portal.example.com/api/" oninput="App.scanProduct.draft.url=this.value"><p class="hint">同一协议、域名及端口归入同一站点；路径作为本次扫描范围。</p></div>`;
      A.modal(
        '新建' + S.typeName(d.type) + '扫描任务',
        `<form id="scan-form" onsubmit="event.preventDefault();App.scanProduct.create()"><div class="field"><label for="scan-name">任务名称 *</label><input id="scan-name" maxlength="80" value="${E(d.name || '')}" oninput="App.scanProduct.draft.name=this.value"></div>${target}${material}<div class="field"><label for="scan-scope">范围说明</label><input id="scan-scope" maxlength="200" value="${E(d.scope || '')}" oninput="App.scanProduct.draft.scope=this.value"></div><p id="scan-error" class="error-message" role="alert"></p></form>`,
        `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.scanProduct.create()">启动扫描</button>`,
      );
    };
    S.create = function () {
      const d = S.draft;
      if (!d || d.type === 'app-scan') return baseCreate.apply(S, arguments);
      S.init();
      const code = d.type === 'code-scan',
        assets = S.assets(d.type);
      let asset = assets.find((a) => a.id === d.targetId),
        version,
        url;
      if (!String(d.name || '').trim() || d.name.length > 80)
        return error('请填写不超过 80 字的任务名称。');
      if (
        !asset &&
        (d.targetId !== 'new' || !String(d.projectName || '').trim() || d.projectName.length > 80)
      )
        return error('请填写不超过 80 字的项目或站点名称。');
      if (
        !asset &&
        assets.some((a) => a.name.trim().toLowerCase() === d.projectName.trim().toLowerCase())
      )
        return error('已有同名资产，请在所属项目或站点中选择，避免重复创建。');
      if (code) {
        if (d.materialMode === 'existing' && asset) {
          version = asset.versions.find((v) => v.id === d.versionId);
          if (!version || version.available === false || !version.path)
            return error('该版本代码材料不可用，请上传新代码。');
        } else {
          const versionName = String(d.versionNote || '').trim();
          if (!versionName || versionName.length > 120) return error('请填写 1–120 字的版本名称。');
          if (d.reading) return error('文件校验尚未完成。');
          if (!d.upload) return error('请选择代码包并等待校验完成。');
          const existing = asset?.versions.find(
            (v) => String(v.label || '').trim() === versionName,
          );
          if (existing && existing.sha256 !== d.upload.sha256)
            return error('该版本名称已存在且检测输入不同，请填写新的版本名称。');
          version = existing || {
            id: uid('version'),
            label: versionName,
            source: 'upload',
            createdAt: time(),
            available: false,
            materialStored: false,
            ...d.upload,
            path: '/uploads/' + uid('source') + '/src',
          };
        }
      } else {
        try {
          url = new URL(String(d.url || '').trim());
          if (
            !['https:', 'http:'].includes(url.protocol) ||
            url.username ||
            url.password ||
            url.hash ||
            url.href.length > 500
          )
            throw 0;
        } catch (e) {
          return error('请输入不含凭据和片段的有效 HTTP(S) 地址。');
        }
        if (asset && new URL(asset.url).origin !== url.origin)
          return error('扫描地址须属于所选站点；其他站点请选择添加 Web 站点。');
        asset = asset || assets.find((a) => new URL(a.url).origin === url.origin);
      }
      const created = !asset;
      if (!asset) {
        asset = {
          id: uid(code ? 'asset-code' : 'asset-web'),
          name: d.projectName.trim(),
          createdAt: time(),
          ...(code ? { repository: '', versions: [] } : { url: url.origin + '/' }),
        };
        assets.push(asset);
      }
      if (code) {
        if (!asset.versions.some((v) => v.id === version.id)) asset.versions.push(version);
        asset.repository = version.source === 'upload' ? '本地上传' : '服务器路径';
        asset.scanPath = version.path;
        asset.revision = version.label;
        d.targetPath = version.path;
        d.version = version.label;
      }
      d.targetId = asset.id;
      const task = baseCreate.apply(S, arguments);
      if (task) {
        if (code) {
          task.versionId = version.id;
          task.targetMaterial = {
            ...task.targetMaterial,
            ...copy(version),
            version: version.label,
          };
          if (!version.fixtureType) {
            task.fixtureType = null;
            task.targetMaterial.fixtureType = null;
          }
        } else {
          task.targetMaterial.path = url.href;
          task.config.scope = String(d.scope || '').trim() || url.pathname + url.search;
        }
        task.targetSnapshot = copy(asset);
        asset.updatedAt = time();
        G.audit(
          created ? 'asset.create' : 'asset.update',
          asset.id,
          (created ? '登记资产：' : '扫描资产：') + asset.name,
          { assetId: asset.id, taskId: task.id },
        );
        A.save();
      }
      return task;
    };
    S.startForAsset = function (kind, id, newVersion = false) {
      S.tab = kind === 'code' ? 'code-scan' : 'web-scan';
      S.newTask();
      S.intakeChange('targetId', id);
      if (newVersion) {
        S.intakeChange('materialMode', 'new');
      }
      S.form();
    };
    S.retest = function (id) {
      const t = S.tasks().find((t) => t.id === id);
      if (!t || t.type === 'app-scan') return baseRetest.apply(S, arguments);
      if (!['done', 'stopped', 'error'].includes(t.status)) return false;
      S.startForAsset(t.type === 'code-scan' ? 'code' : 'web', t.targetId);
      S.draft.name = t.name + ' · 复测';
      S.draft.parentId = t.id;
      if (t.type === 'code-scan') {
        const a = S.assets(t.type).find((a) => a.id === t.targetId);
        S.draft.versionId =
          t.versionId ||
          a?.versions.find(
            (v) => v.path === t.targetMaterial?.path && v.label === t.targetMaterial?.version,
          )?.id ||
          '';
      } else S.draft.url = t.targetMaterial?.path || S.draft.url;
      S.form();
      return true;
    };
    G.saveRename = function () {
      const d = G.renameDraft,
        list = A.data.businessAssets[d.kind],
        a = list.find((a) => a.id === d.id),
        name = d.name.trim();
      if (
        !name ||
        name.length > 80 ||
        list.some((v) => v.id !== d.id && v.name.toLowerCase() === name.toLowerCase())
      ) {
        document.getElementById('asset-rename-error').textContent =
          '名称不能为空、超过 80 字或与已有资产重复。';
        return false;
      }
      a.name = name;
      G.audit('asset.update', a.id, '更新资产名称：' + name, { assetId: a.id });
      A.save();
      A.closeModal();
      A.render();
      return true;
    };
    S.saveMaterial = function () {
      const d = S.materialDraft,
        w = S.draft,
        app = S.assets('app-scan').find((a) => a.id === w?.targetId);
      if (!app || !d) return false;
      const issue =
        !d.name.trim() || d.name.length > 80
          ? '请填写不超过 80 字的制品名称。'
          : w.reading
            ? '文件校验尚未完成。'
            : !w.upload
              ? '请选择制品文件并等待校验完成。'
              : !['source', 'binary'].includes(d.kind)
                ? '请选择有效的制品类型。'
                : !String(d.version || '').trim() || String(d.version).trim().length > 120
                  ? '请填写 1–120 字的版本名称。'
                  : '';
      if (issue) {
        document.getElementById('scan-material-error').textContent = issue;
        return false;
      }
      const material = {
        id: uid('material'),
        name: d.name.trim(),
        kind: d.kind,
        version: d.version.trim(),
        path: '/uploads/' + uid('material') + '/src',
        fileName: w.upload.name,
        sha256: w.upload.sha256,
        source: 'upload',
      };
      app.scanMaterials = app.scanMaterials || [];
      app.scanMaterials.push(material);
      w.materialId = material.id;
      w.upload = null;
      A.save();
      A.closeDrawer();
      S.form();
      return material;
    };
  })();
};
