/* assets/platform-governance。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['assets/platform-governance'] = function () {
  /* Shared asset registry and evidence-based risk events. */
  (function () {
    'use strict';
    const A = window.App,
      E = A.escape,
      clone = (v) => JSON.parse(JSON.stringify(v));
    const now = () => new Date().toISOString(),
      uid = (p) => p + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    const domains = { evaluation: '评估风险', protection: '防护风险' };
    const sources = { attack: '模型演练', scan: '漏洞扫描', content: '运行时防护' };
    const metrics = {
      'attack-asr': { domain: 'evaluation', source: 'attack', label: '模型演练·ASR', unit: '%' },
      'scan-confirmed-high': {
        domain: 'evaluation',
        source: 'scan',
        label: '漏洞扫描·高危漏洞数',
        fixedThreshold: 1,
      },
      'runtime-unsafe-input': {
        domain: 'protection',
        source: 'content',
        label: 'Unsafe 输入请求数',
      },
      'runtime-unsafe-output': {
        domain: 'protection',
        source: 'content',
        label: 'Unsafe 输出请求数',
      },
      'runtime-pending-review': { domain: 'protection', source: 'content', label: '待人工复核数' },
      'runtime-user-unsafe': {
        domain: 'protection',
        source: 'content',
        label: '应用用户不安全行为次数',
      },
    };
    const legacyMetrics = {
      'attack-breach': { domain: 'evaluation', source: 'attack', label: '演练攻破记录数' },
      'runtime-unsafe': { domain: 'protection', source: 'content', label: '不安全请求数' },
      'runtime-blocked': { domain: 'protection', source: 'content', label: '不安全内容阻断数' },
      'runtime-error': { domain: 'protection', source: 'content', label: '检测故障请求数' },
    };
    const defaultMetric = {
      attack: 'attack-asr',
      scan: 'scan-confirmed-high',
      content: 'runtime-unsafe-input',
    };
    const severity = { critical: '严重', high: '高危', medium: '中危', low: '低危' },
      states = { open: '待处理', acknowledged: '已确认', closed: '已关闭' };
    const assetTypes = {
      model: '模型',
      application: 'AI 应用',
      code: '代码',
      package: '软件包',
      web: 'Web',
    };
    const stamp = (v) => {
      const n = typeof v === 'number' ? v : Date.parse(v || '');
      return Number.isFinite(n) ? n : null;
    };
    const firstStamp = (...values) => values.map(stamp).find((v) => v !== null) ?? null;
    const displayTime = (v) =>
      v ? new Date(v).toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') : '—';
    const timeWindow = (r) =>
      r.windowHours < 24 ? '近 ' + r.windowHours + ' 小时' : '近 ' + r.windowHours / 24 + ' 天';
    const metricId = (r) => r.metric || defaultMetric[r.source];
    const ASR_DEFAULT = 5; // 默认：单任务 ASR > 5% 触发
    const metricInfo = (r) => metrics[metricId(r)] || legacyMetrics[metricId(r)];
    const ruleDomain = (r) => r.domain || metricInfo(r)?.domain || 'evaluation';
    // ASR 规则为严格大于（> 阈值），计数类规则为大于等于。
    const strictMetric = (r) => metricId(r) === 'attack-asr';
    const meets = (r, value) => (strictMetric(r) ? value > r.threshold : value >= r.threshold);
    const condition = (r) =>
      (ruleDomain(r) === 'evaluation' && r.scope !== 'asset-window'
        ? '单任务完成后'
        : timeWindow(r)) +
      ' · ' +
      (r.metricLabel || metricInfo(r)?.label || sources[r.source]) +
      (strictMetric(r) ? ' > ' : ' ≥ ') +
      r.threshold +
      (r.metricUnit || metricInfo(r)?.unit || '');
    const auditLabel = (key) =>
      ({
        'risk.trigger': '触发风险事件',
        'risk.rule.save': '保存触发规则',
        'risk.event.closed': '关闭风险事件',
        'risk.event.acknowledged': '确认风险事件',
        'asset.create': '登记资产',
        'asset.update': '更新资产',
        'model.roles.update': '配置模型用途',
        'binding.update': '更新防护绑定',
        'binding.model-role-migration': '更新防护模型绑定',
        'request.detect': '执行内容检测',
        'sample.classify': '归档治理样本',
        'application.save': '保存应用资产',
        'review.complete': '完成人工复核',
        'config.block-response': '更新阻断响应',
        'rule.update': '更新检测规则',
        'rule.create': '新增检测规则',
        'policy.publish': '发布防护策略',
        'policy.draft': '保存策略草稿',
      })[key] || key;
    const ruleSnapshot = (r) => ({
      id: r.id,
      name: r.name,
      domain: ruleDomain(r),
      metric: metricId(r),
      metricLabel: metricInfo(r)?.label,
      metricUnit: metricInfo(r)?.unit || '',
      source: r.source,
      scope: r.scope || (ruleDomain(r) === 'evaluation' ? 'task' : 'application-window'),
      windowHours: ruleDomain(r) === 'protection' ? r.windowHours : null,
      threshold: r.threshold,
      enabled: true,
      version: r.version,
      publishedAt: r.publishedAt,
    });
    const emptyFilter = () => ({
      domain: '',
      metric: '',
      source: '',
      state: '',
      severity: '',
      query: '',
      assetId: '',
      assetType: '',
    });
    const G = (A.platformGovernance = {
      domains,
      sources,
      metrics,
      severity,
      states,
      filter: emptyFilter(),
      logQuery: '',
      ruleDraft: null,
      assetDraft: null,
    });
    G.condition = condition;
    G.meets = meets;
    G.ruleSnapshot = ruleSnapshot;
    G.metricValue = function (rule, evidence) {
      if (metricId(rule) !== 'attack-asr') return evidence.length;
      const valid = evidence.reduce((n, r) => n + (Number(r.valid) || 0), 0),
        breach = evidence.reduce((n, r) => n + (Number(r.breach) || 0), 0);
      return valid ? (100 * breach) / valid : 0;
    };
    G.metricSnapshot = function (rule, evidence) {
      const result = { count: evidence.length, value: G.metricValue(rule, evidence) };
      if (metricId(rule) === 'attack-asr') {
        result.valid = evidence.reduce((n, r) => n + (Number(r.valid) || 0), 0);
        result.breach = evidence.reduce((n, r) => n + (Number(r.breach) || 0), 0);
      }
      return result;
    };
    G.observedLabel = function (event) {
      if (metricId(event) !== 'attack-asr')
        return (
          (event.lastWindow?.value ?? event.lastWindow?.count ?? event.count) +
          (metricId(event) === 'scan-confirmed-high'
            ? ' 项高危漏洞'
            : metricId(event) === 'runtime-pending-review'
              ? ' 项待人工复核'
              : ' 条请求')
        );
      const fallback = G.metricSnapshot(event, event.evidence || []),
        window = event.lastWindow || {},
        valid = window.valid ?? fallback.valid,
        breach = window.breach ?? fallback.breach,
        value = window.value ?? fallback.value;
      return 'ASR ' + Number(value).toFixed(1) + '% · ' + breach + ' / ' + valid + ' 次有效判定';
    };
    G.migrateRules = function () {
      const db = G.db;
      if (db.taskRuleSchema >= 1) return false;
      const audit = A.data.guardAudit || [],
        changedByUser = (r) =>
          audit.some(
            (a) =>
              (a.kind || a.action) === 'risk.rule.save' && (a.entity === r.id || a.ruleId === r.id),
          );
      db.ruleMigrationArchive ||= [];
      for (const r of db.rules.slice()) {
        r.metric ||= defaultMetric[r.source];
        const original = clone(r),
          defaultAttack =
            r.id === 'risk-attack' &&
            r.metric === 'attack-breach' &&
            r.name === '模型演练攻破集中出现' &&
            r.threshold === 10 &&
            !changedByUser(r),
          defaultContent =
            r.id === 'risk-content' &&
            r.metric === 'runtime-unsafe' &&
            r.name === '应用不安全内容集中出现' &&
            [3, 5].includes(r.threshold) &&
            !changedByUser(r);
        if (defaultAttack) {
          r.metric = 'attack-asr';
          r.name = '模型演练 ASR 超阈值';
        }
        if (defaultContent) {
          r.metric = 'runtime-unsafe-input';
          r.name = 'Unsafe 输入请求数超阈值';
          r.threshold = 2;
        }
        if (!metrics[r.metric]) {
          // Preserve obsolete custom definitions verbatim rather than reinterpret a count as a percentage.
          (db.legacyRules ||= []).push(original);
          db.rules.splice(db.rules.indexOf(r), 1);
          continue;
        }
        const info = metrics[r.metric];
        r.domain = info.domain;
        r.source = info.source;
        r.scope = info.domain === 'evaluation' ? 'task' : 'application-window';
        r.enabled = true;
        r.windowHours =
          info.domain === 'evaluation'
            ? null
            : [1, 24, 168, 720].includes(r.windowHours)
              ? r.windowHours
              : 24;
        if (info.fixedThreshold) r.threshold = info.fixedThreshold;
        delete r.severity;
        if (JSON.stringify(original) !== JSON.stringify(r)) {
          db.ruleMigrationArchive.push(original);
          r.version = (r.version || 0) + 1;
          r.publishedAt = now();
          r.revisions ||= [];
          r.revisions.push(ruleSnapshot(r));
        }
      }
      // Old event snapshots keep their original aggregation semantics and evidence.
      for (const e of db.events) {
        if (e.ruleSnapshot && !e.ruleSnapshot.scope)
          e.ruleSnapshot.scope =
            ruleDomain(e.ruleSnapshot) === 'evaluation' ? 'asset-window' : 'application-window';
      }
      db.taskRuleSchema = 1;
      return true;
    };
    G.init = function () {
      A.scanProduct?.init();
      A.data.businessAssets ||= { code: [], web: [] };
      for (const kind of ['code', 'web'])
        if (!Array.isArray(A.data.businessAssets[kind])) A.data.businessAssets[kind] = [];
      A.data.platformRisk ||= { schemaVersion: 3, rules: [], events: [], seeded: false };
      G.db = A.data.platformRisk;
      if (!Array.isArray(G.db.rules)) G.db.rules = [];
      if (!Array.isArray(G.db.events)) G.db.events = [];
      if (!G.db.seeded) {
        const presets = [
          ['risk-attack', '模型演练 ASR 超阈值', 'attack', null, ASR_DEFAULT],
          ['risk-scan', '扫描确认高危漏洞', 'scan', null, 1],
          ['risk-content', 'Unsafe 输入请求数超阈值', 'content', 24, 2],
        ];
        for (const [id, name, source, windowHours, threshold] of presets)
          if (!G.db.rules.some((r) => r.id === id)) {
            const r = {
              id,
              name,
              domain: metrics[defaultMetric[source]].domain,
              metric: defaultMetric[source],
              source,
              scope: source === 'content' ? 'application-window' : 'task',
              windowHours,
              threshold,
              enabled: true,
              version: 1,
              publishedAt: now(),
            };
            r.revisions = [ruleSnapshot(r)];
            G.db.rules.push(r);
          }
        G.db.seeded = true;
      }
      for (const r of G.db.rules) {
        r.metric ||= defaultMetric[r.source];
        r.domain ||= metricInfo(r)?.domain;
        r.revisions ||= [ruleSnapshot(r)];
      }
      for (const e of G.db.events) {
        e.metric ||=
          e.ruleSnapshot?.metric ||
          { attack: 'attack-breach', scan: 'scan-confirmed-high', content: 'runtime-unsafe' }[
            e.source
          ];
        e.domain ||= metricInfo(e)?.domain;
        e.ruleSnapshot ||= clone(G.db.rules.find((r) => r.id === e.ruleId) || e);
        e.ruleSnapshot.metric ||= e.metric;
        e.ruleSnapshot.domain ||= e.domain;
        e.evidence ||= [];
      }
      let migrated = G.migrateRules();
      // 默认 ASR 规则从“≥10%”调整为“>5%”；用户改过的规则保持原样。
      if (!G.db.asrDefaultV2) {
        const r = G.db.rules.find((x) => x.id === 'risk-attack' && x.metric === 'attack-asr');
        if (r && r.threshold === 10 && (r.version || 1) <= 2) {
          r.threshold = ASR_DEFAULT;
          r.version = (r.version || 0) + 1;
          r.publishedAt = now();
          (r.revisions ||= []).push(ruleSnapshot(r));
        }
        G.db.asrDefaultV2 = true;
        migrated = true;
      }
      G.db.schemaVersion = 3;
      if (migrated) A.save();
      return G;
    };
    /* 计入风险指标的防护记录：只算业务应用真实调用产生的记录 */
    G.runtimeRecords = () =>
      (A.guard?.records.all() || []).filter(
        (r) => r.source === 'application' && r.externalVerified === true,
      );
    G.audit = function (action, entity, detail, context = {}) {
      A.guard?.audit(action, entity, detail, context);
    };
    G.scanConfirmed = function (t, f) {
      if (
        t.deletedAt ||
        t.status !== 'done' ||
        t.resultSaved === false ||
        !['critical', 'high'].includes(f.severity) ||
        f.confirmed === false ||
        f.verified === false
      )
        return false;
      const excluded = [
        'candidate',
        'pending',
        'failed',
        'error',
        'unknown',
        'unverified',
        'false-positive',
        'false_positive',
        'dismissed',
        'rejected',
      ];
      if (excluded.includes(f.status) || excluded.includes(f.verificationStatus)) return false;
      return (
        f.confirmed === true ||
        f.verified === true ||
        ['confirmed', 'verified'].includes(f.verificationStatus) ||
        ['confirmed', 'verified'].includes(f.status)
      );
    };
    G.contentRecord = function (r, selected) {
      if (selected === 'runtime-user-unsafe') {
        const user = r.userId,
          verdict = String(r.verdict || '').toLowerCase();
        if (!user || verdict !== 'unsafe' || r.status !== 'complete') return null;
        const at = firstStamp(r.createdAt);
        if (at === null) return null;
        return {
          key: 'user-unsafe:' + r.id,
          source: 'content',
          metric: selected,
          assetId: r.appId,
          assetType: 'application',
          assetName: A.data.aiApplications?.find((a) => a.id === r.appId)?.name || '历史应用',
          userId: String(user),
          recordId: r.id,
          at: new Date(at).toISOString(),
          title: '用户 ' + user + ' · 不安全行为',
          summary: '应用用户不安全行为触发阈值',
          originalVerdict: verdict,
        };
      }
      const verdict = r.verdict,
        action = r.effectiveAction || r.suggestedAction,
        valid = r.status === 'complete';
      const reviews = A.guard.records
          .reviews()
          .filter((v) => v.status === 'pending' && v.requestId === r.id),
        pending = reviews.length > 0;
      const match =
        selected === 'runtime-pending-review'
          ? pending
          : selected === 'runtime-unsafe-input'
            ? valid && verdict === 'Unsafe' && r.stage === 'input'
            : selected === 'runtime-unsafe-output'
              ? valid && verdict === 'Unsafe' && r.stage === 'output'
              : false;
      if (!match) return null;
      const at = firstStamp(
        selected === 'runtime-pending-review' ? reviews[0]?.createdAt : null,
        r.createdAt,
      );
      if (at === null) return null;
      return {
        key: 'content:' + r.id,
        source: 'content',
        metric: selected,
        assetId: r.appId || '',
        assetType: 'application',
        assetName: A.data.aiApplications?.find((a) => a.id === r.appId)?.name || '历史应用',
        recordId: r.id,
        stage: r.stage,
        title:
          (r.stage === 'output' ? '输出' : '输入') +
          '检测 · ' +
          (selected === 'runtime-pending-review' ? '待人工复核' : 'Unsafe'),
        at: new Date(at).toISOString(),
        summary:
          selected === 'runtime-pending-review'
            ? '等待人工复核'
            : ((r.detections || []).flatMap((d) => d.categories || []).join('、') ||
                '原始判定 Unsafe') +
              ' · ' +
              ({ block: '已阻断', allow: '已放行', log: '放行', review: '待人工复核' }[action] ||
                '已记录'),
        originalVerdict: verdict,
        action,
      };
    };
    G.sourceRecords = function (source, selectedMetric) {
      const selected = selectedMetric || defaultMetric[source],
        records = [];
      if (source === 'attack' && selected === 'attack-asr')
        for (const t of A.attack?.db?.tasks || []) {
          if (t.deletedAt || t.status !== 'done') continue;
          const judged = (t.units || []).filter((u) => ['breach', 'defended'].includes(u.result)),
            valid = judged.length,
            breach = judged.filter((u) => u.result === 'breach').length,
            at = firstStamp(
              t.finishedAt,
              t.finished,
              ...judged.map((u) => u.finished || u.finishedAt),
              t.created,
            );
          if (!valid || at === null) continue;
          records.push({
            key: 'attack-asr:' + t.id,
            source,
            metric: selected,
            assetId: t.model || t.targetSnapshot?.id || '',
            assetType: 'model',
            assetName: t.targetSnapshot?.name || A.attack.model(t.model)?.name || '历史模型',
            taskId: t.id,
            title: t.name,
            at: new Date(at).toISOString(),
            valid,
            breach,
            summary:
              'ASR ' +
              ((100 * breach) / valid).toFixed(1) +
              '% · ' +
              breach +
              ' 次攻破 / ' +
              valid +
              ' 次有效判定',
          });
        }
      if (source === 'scan' && selected === 'scan-confirmed-high')
        for (const t of A.scanProduct?.tasks?.() || []) {
          for (const f of t.findings || []) {
            if (!G.scanConfirmed(t, f)) continue;
            const at = firstStamp(t.finishedAt, t.finished, f.verifiedAt, f.createdAt, t.created);
            if (at === null) continue;
            records.push({
              key: 'scan:' + t.id + ':' + f.id,
              source,
              metric: selected,
              assetId: t.targetId || '',
              assetType: t.type === 'app-scan' ? 'package' : t.type === 'web-scan' ? 'web' : 'code',
              assetName: t.targetName || '历史资产',
              taskId: t.id,
              recordId: f.id,
              title: t.name || t.targetName,
              at: new Date(at).toISOString(),
              summary:
                f.title +
                ' · ' +
                (severity[f.severity] || '') +
                ' · ' +
                (f.location || f.category || '自动验证通过'),
            });
          }
        }
      if (source === 'content')
        for (const r of G.runtimeRecords()) {
          const record = G.contentRecord(r, selected);
          if (record) records.push(record);
        }
      return [...new Map(records.filter((r) => r.assetId).map((r) => [r.key, r])).values()];
    };
    G.refresh = function (at = Date.now()) {
      G.init();
      const time = stamp(at);
      if (time === null) return clone(G.db.events);
      let changed = false;
      const sourceCache = {};
      for (const rule of G.db.rules.filter((r) => r.enabled && metrics[metricId(r)])) {
        const evaluation = ruleDomain(rule) === 'evaluation',
          records = (sourceCache[rule.metric] ||= G.sourceRecords(rule.source, rule.metric)),
          start = evaluation ? null : time - rule.windowHours * 3600000,
          grouped = new Map();
        for (const r of records) {
          const t = stamp(r.at);
          if (t === null || t > time || (!evaluation && t < start) || (evaluation && !r.taskId))
            continue;
          const key = evaluation
            ? 'task:' + r.taskId
            : r.assetType +
              ':' +
              r.assetId +
              (rule.metric === 'runtime-user-unsafe' ? '#user:' + r.userId : '') +
              (r.demoScenario ? '#demo:' + r.demoScenario : '');
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(r);
        }
        for (const [recordGroup, items] of grouped) {
          const evidence = [...new Map(items.map((r) => [r.key, r])).values()],
            first = evidence[0],
            assetKey = first.assetType + ':' + first.assetId,
            key = rule.id + '@' + rule.version + ':' + recordGroup;
          const related = G.db.events.filter(
            (e) =>
              e.ruleId === rule.id &&
              e.metric === rule.metric &&
              e.assetType + ':' + e.assetId === assetKey &&
              (rule.metric !== 'runtime-user-unsafe' || e.evidence?.[0]?.userId === first.userId),
          );
          // A completed assessment produces at most one event for each rule, across rule revisions.
          if (
            evaluation &&
            related.some(
              (e) =>
                e.taskId === first.taskId ||
                (e.evidence || []).some((r) => r.taskId === first.taskId),
            )
          )
            continue;
          const prior = new Set(related.flatMap((e) => (e.evidence || []).map((r) => r.key))),
            fresh = evidence.filter((r) => !prior.has(r.key));
          if (!fresh.length) continue;
          const current =
            !evaluation &&
            related.find((e) => e.groupKey === key && stamp(e.lastTriggeredAt) >= start);
          if (current) {
            if (meets(rule, G.metricValue(rule, evidence))) {
              current.evidence.push(...clone(fresh));
              current.count = current.evidence.length;
              current.lastTriggeredAt = new Date(time).toISOString();
              current.lastWindow = {
                start: new Date(start).toISOString(),
                end: new Date(time).toISOString(),
                ...G.metricSnapshot(rule, evidence),
              };
              changed = true;
            }
            continue;
          }
          const triggerEvidence = evaluation ? evidence : fresh;
          if (!meets(rule, G.metricValue(rule, triggerEvidence))) continue;
          const triggerAt = evaluation
            ? new Date(Math.max(...evidence.map((r) => stamp(r.at)))).toISOString()
            : new Date(time).toISOString();
          const event = {
            id: uid('risk-event'),
            groupKey: key,
            ruleId: rule.id,
            ruleVersion: rule.version,
            ruleSnapshot: clone(ruleSnapshot(rule)),
            domain: rule.domain,
            metric: rule.metric,
            source: rule.source,
            assetId: first.assetId,
            assetType: first.assetType,
            assetName: first.assetName,
            ...(evaluation ? { taskId: first.taskId } : {}),
            count: triggerEvidence.length,
            evidence: clone(triggerEvidence),
            createdAt: triggerAt,
            lastTriggeredAt: triggerAt,
            lastWindow: {
              start: evaluation ? null : new Date(start).toISOString(),
              end: triggerAt,
              ...G.metricSnapshot(rule, triggerEvidence),
            },
          };
          G.db.events.unshift(event);
          G.audit('risk.trigger', event.id, '触发风险事件：' + rule.name, {
            riskEventId: event.id,
            assetId: event.assetId,
            ruleId: rule.id,
            ruleVersion: rule.version,
          });
          changed = true;
        }
      }
      if (changed) A.save();
      return clone(G.db.events);
    };
    G.events = function () {
      return G.refresh().sort((a, b) => stamp(b.lastTriggeredAt) - stamp(a.lastTriggeredAt));
    };
    G.rule = function (id) {
      G.init();
      return G.db.rules.find((r) => r.id === id);
    };
    G.editRule = function (id) {
      G.init();
      G.ruleDraft = clone(
        G.rule(id) || {
          id: '',
          name: '',
          domain: 'evaluation',
          metric: 'attack-asr',
          source: 'attack',
          scope: 'task',
          windowHours: null,
          threshold: ASR_DEFAULT,
          enabled: true,
        },
      );
      G.ruleForm();
    };
    G.changeRuleDomain = function (value) {
      if (!domains[value]) return;
      G.ruleDraft.domain = value;
      G.ruleDraft.metric = Object.keys(metrics).find((id) => metrics[id].domain === value);
      G.ruleDraft.source = metrics[G.ruleDraft.metric].source;
      G.ruleDraft.threshold = value === 'evaluation' ? ASR_DEFAULT : 1;
      G.ruleDraft.windowHours = value === 'protection' ? 24 : null;
      G.ruleForm();
    };
    G.changeRuleMetric = function (value) {
      if (!metrics[value] || metrics[value].domain !== G.ruleDraft.domain) return;
      G.ruleDraft.metric = value;
      G.ruleDraft.source = metrics[value].source;
      G.ruleDraft.threshold =
        metrics[value].fixedThreshold ||
        (value === 'attack-asr'
          ? ASR_DEFAULT
          : Math.max(1, Math.round(G.ruleDraft.threshold || 1)));
      G.ruleForm();
    };
    G.ruleForm = function () {
      const d = G.ruleDraft;
      if (!d) return;
      const info = metricInfo(d),
        evaluation = d.domain === 'evaluation',
        fixed = !!info.fixedThreshold;
      A.modal(
        d.id ? '编辑触发规则' : '新建触发规则',
        `
 <div class="field"><label for="pg-rule-name">规则名称 *</label><input id="pg-rule-name" maxlength="80" value="${E(d.name)}" oninput="App.platformGovernance.ruleDraft.name=this.value"></div>
 <div class="field"><label>风险域 *</label><div class="pg-domain-picker">${Object.entries(domains)
   .map(
     ([id, n]) =>
       `<button class="${d.domain === id ? 'active' : ''}" onclick="App.platformGovernance.changeRuleDomain('${id}')"><strong>${n}</strong></button>`,
   )
   .join('')}</div></div>
 <div class="field"><label for="pg-rule-metric">触发指标 *</label><select id="pg-rule-metric" onchange="App.platformGovernance.changeRuleMetric(this.value)">${Object.entries(
   metrics,
 )
   .filter(([, v]) => v.domain === d.domain)
   .map(
     ([id, v]) => `<option value="${id}" ${d.metric === id ? 'selected' : ''}>${v.label}</option>`,
   )
   .join('')}</select></div>
 <div class="form-grid">${
   evaluation
     ? ''
     : `<div class="field"><label for="pg-rule-window">统计时间窗 *</label><select id="pg-rule-window" onchange="App.platformGovernance.ruleDraft.windowHours=Number(this.value)">${[
         [1, '近 1 小时'],
         [24, '近 24 小时'],
         [168, '近 7 天'],
         [720, '近 30 天'],
       ]
         .map(
           ([v, n]) =>
             `<option value="${v}" ${d.windowHours === v ? 'selected' : ''}>${n}</option>`,
         )
         .join('')}</select></div>`
 }<div class="field"><label for="pg-rule-threshold">${fixed ? '触发条件' : '触发阈值 *'}</label><div class="pg-threshold-control ${fixed ? 'is-fixed' : ''}"><span aria-hidden="true">${strictMetric(d) ? '>' : '≥'}</span><input id="pg-rule-threshold" aria-label="${strictMetric(d) ? '大于阈值' : '大于等于阈值'}" type="number" min="${info.unit === '%' ? '0.1' : '1'}" max="${info.unit === '%' ? '100' : '10000'}" step="${info.unit === '%' ? '0.1' : '1'}" value="${fixed ? 1 : d.threshold}" ${fixed ? 'readonly aria-readonly="true"' : 'oninput="App.platformGovernance.ruleDraft.threshold=Number(this.value)"'}>${info.unit ? `<span>${info.unit}</span>` : fixed ? '<span>项高危漏洞</span>' : ''}</div></div></div>
 <p id="pg-rule-error" class="error-message" role="alert"></p>`,
        `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.platformGovernance.saveRule()">保存规则</button>`,
      );
    };
    G.validateRule = function (d) {
      if (!d || !String(d.name || '').trim() || d.name.length > 80)
        return '请填写 1–80 字的规则名称';
      const m = metrics[metricId(d)];
      if (!m || (d.domain && d.domain !== m.domain) || (d.source && d.source !== m.source))
        return '请选择匹配的风险域和触发指标';
      if (m.domain === 'protection' && ![1, 24, 168, 720].includes(d.windowHours))
        return '请选择统计时间窗';
      if (m.fixedThreshold && d.threshold !== 1) return '出现高危漏洞即触发，阈值固定为 1';
      if (m.unit === '%') {
        if (!Number.isFinite(d.threshold) || d.threshold <= 0 || d.threshold > 100)
          return 'ASR 阈值须大于 0 且不超过 100%';
      } else if (!Number.isSafeInteger(d.threshold) || d.threshold < 1 || d.threshold > 10000)
        return '阈值须为 1–10000 的整数';
      if (
        G.db.rules.some(
          (r) => r.id !== d.id && r.name.toLowerCase() === d.name.trim().toLowerCase(),
        )
      )
        return '规则名称已存在';
      return '';
    };
    G.saveRule = function (value) {
      G.init();
      const d = clone(value || G.ruleDraft),
        error = G.validateRule(d);
      if (error) {
        const el = document.getElementById('pg-rule-error');
        if (el) el.textContent = error;
        return false;
      }
      const old = G.rule(d.id),
        m = metrics[metricId(d)],
        r = {
          id: old?.id || uid('risk-rule'),
          name: d.name.trim(),
          domain: m.domain,
          metric: metricId(d),
          source: m.source,
          scope: m.domain === 'evaluation' ? 'task' : 'application-window',
          windowHours: m.domain === 'protection' ? d.windowHours : null,
          threshold: m.fixedThreshold || d.threshold,
          enabled: true,
          version: (old?.version || 0) + 1,
          publishedAt: now(),
          revisions: clone(old?.revisions || []),
        };
      r.revisions.push(ruleSnapshot(r));
      if (old) G.db.rules.splice(G.db.rules.indexOf(old), 1, r);
      else G.db.rules.push(r);
      G.audit('risk.rule.save', r.id, '保存触发规则：' + r.name, {
        ruleId: r.id,
        version: r.version,
      });
      A.save();
      if (!value) {
        A.closeModal();
        A.render();
        A.toast('触发规则已保存');
      }
      return clone(r);
    };
    // Kept as a no-op for previously saved links; rules apply as soon as they are saved.
    G.toggleRule = function () {
      return false;
    };
    G.filterBy = function (key, value) {
      if (!Object.hasOwn(G.filter, key)) return;
      G.filter[key] = value;
      if (key === 'domain') G.filter.metric = '';
      A.render();
    };
    G.showEvents = function (options = {}) {
      G.filter = { ...emptyFilter(), ...options };
      A.platform.go('risk', 'events');
    };
    G.eventActions = () => '';
    G.eventDetail = function (id) {
      G.init();
      const e = G.db.events.find((e) => e.id === id);
      if (!e) return;
      const r = e.ruleSnapshot,
        evaluation = e.domain === 'evaluation',
        evidence = e.evidence || [],
        links = evaluation
          ? [...new Map(evidence.map((v, index) => [v.taskId || v.key, { ...v, index }])).values()]
          : evidence.map((v, index) => ({ ...v, index })),
        notes = [
          ...new Set(evidence.filter((v) => v.demo && v.originNote).map((v) => v.originNote)),
        ];
      A.drawer(
        '风险事件详情',
        `<div class="pg-event-detail"><div class="pg-detail-tags">${A.badge(domains[e.domain], e.domain === 'evaluation' ? 'blue' : 'orange')}</div><h2>${E(r.name)}</h2><dl class="pg-detail-kv"><div><dt>风险对象</dt><dd>${assetTypes[e.assetType] || ''} · ${E(e.assetName)}</dd></div><div><dt>触发条件</dt><dd>${E(condition(r))}</dd></div><div><dt>触发结果</dt><dd>${E(G.observedLabel(e))}</dd></div><div><dt>触发时间</dt><dd>${E(displayTime(e.lastTriggeredAt || e.createdAt))}</dd></div>${!evaluation ? `<div><dt>统计时间窗</dt><dd>${E(displayTime(e.lastWindow?.start))} 至 ${E(displayTime(e.lastWindow?.end))}</dd></div>` : ''}</dl>${notes.length ? `<div class="pg-demo-evidence-note">${notes.map((note) => `<p>${E(note)}</p>`).join('')}</div>` : ''}<h3>关联证据</h3><div class="pg-evidence-list">${links.map((v) => `<button data-id="${E(e.id)}" data-index="${v.index}" onclick="App.platformGovernance.openEvidence(this.dataset.id,Number(this.dataset.index))"><strong>${E(v.title)}</strong><small>${E(v.summary)}</small><span>${evaluation ? '查看任务详情' : '查看检测记录'} →</span></button>`).join('') || '<p class="muted">暂无关联证据</p>'}</div></div>`,
        '',
      );
    };
    G.openEvidence = function (id, index) {
      const e = G.db?.events.find((e) => e.id === id),
        r = e?.evidence[index];
      if (!r) return;
      A.closeDrawer();
      if (r.source === 'content') {
        if (A.guard.records.get(r.recordId)) {
          A.platform.go('protection', 'records');
          A.guard.views.detail(r.recordId);
          return;
        }
      }
      if (r.source === 'scan') {
        if (A.scanProduct.tasks().some((t) => t.id === r.taskId)) {
          A.scanProduct.open(r.taskId);
          return;
        }
      }
      if (r.source === 'attack') {
        const t = A.attack.db.tasks.find((t) => t.id === r.taskId && !t.deletedAt);
        if (t) {
          A.evaluation.openTask(t.id);
          return;
        }
      }
      A.drawer(
        '触发证据快照',
        `<h3>${E(r.title)}</h3><p>${E(r.summary)}</p><p class="hint">原始记录已移除，仍保留触发时的证据摘要。</p>`,
        '',
      );
    };
    G.setEventState = () => false;
    G.closeEvent = () => false;
    G.confirmClose = () => false;
    G.renderRisk = (item) => (item === 'rules' ? G.ruleHTML() : G.eventHTML());
    G.editAsset = function (kind, id) {
      G.init();
      if (!['code', 'web'].includes(kind)) return;
      G.assetDraft = {
        kind,
        ...clone(
          A.data.businessAssets[kind].find((a) => a.id === id) || {
            id: '',
            name: '',
            repository: '',
            revision: '',
            url: '',
            owner: '',
          },
        ),
      };
      const d = G.assetDraft;
      A.modal(
        d.id ? '编辑资产' : '登记资产',
        `<div class="field"><label for="pg-asset-name">资产名称 *</label><input id="pg-asset-name" maxlength="80" value="${E(d.name)}" oninput="App.platformGovernance.assetDraft.name=this.value"></div><div class="field"><label for="pg-asset-source">${kind === 'code' ? '仓库 / 代码标识' : '访问地址'} *</label><input id="pg-asset-source" maxlength="500" value="${E(kind === 'code' ? d.repository : d.url)}" placeholder="${kind === 'code' ? '如：team/service-repository' : '如：https://service.example.com'}" oninput="App.platformGovernance.assetDraft.${kind === 'code' ? 'repository' : 'url'}=this.value"></div>${kind === 'code' ? `<div class="field"><label for="pg-asset-revision">分支 / 版本</label><input id="pg-asset-revision" maxlength="100" value="${E(d.revision || '')}" placeholder="如：main 或 release-1.0" oninput="App.platformGovernance.assetDraft.revision=this.value"></div>` : ''}<p id="pg-asset-error" class="error-message" role="alert"></p>`,
        `<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.platformGovernance.saveAsset()">保存资产</button>`,
      );
    };
    G.validateAsset = function (d) {
      if (!['code', 'web'].includes(d?.kind)) return '请选择资产类型';
      if (!String(d.name || '').trim() || d.name.length > 80) return '请填写资产名称，不超过 80 字';
      const source = String(d.kind === 'code' ? d.repository || '' : d.url || '').trim();
      if (!source || source.length > 500) return '请填写不超过 500 字的资产地址或代码标识';
      if (d.kind === 'web') {
        try {
          const u = new URL(source);
          if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password)
            return '请输入不含用户名和密码的 HTTP(S) 地址';
        } catch (e) {
          return '请输入有效的 HTTP(S) 地址';
        }
      }
      if (
        A.data.businessAssets[d.kind].some(
          (a) => a.id !== d.id && a.name.toLowerCase() === d.name.trim().toLowerCase(),
        )
      )
        return '该类型下已存在同名资产';
      return '';
    };
    G.saveAsset = function (value) {
      G.init();
      const d = clone(value || G.assetDraft),
        error = G.validateAsset(d);
      if (error) {
        const el = document.getElementById('pg-asset-error');
        if (el) el.textContent = error;
        return false;
      }
      const list = A.data.businessAssets[d.kind],
        old = list.find((a) => a.id === d.id),
        a = {
          ...(old || {}),
          id: old?.id || uid('asset-' + d.kind),
          name: d.name.trim(),
          createdAt: old?.createdAt || now(),
          updatedAt: now(),
          ...(d.kind === 'code'
            ? { repository: d.repository.trim(), revision: String(d.revision || '').trim() }
            : { url: d.url.trim() }),
        };
      if (
        old &&
        (old.repository !== a.repository || old.revision !== a.revision || old.url !== a.url)
      )
        delete a.fixtureType;
      if (old) list.splice(list.indexOf(old), 1, a);
      else list.push(a);
      G.audit(
        'asset.' + (old ? 'update' : 'create'),
        a.id,
        (old ? '更新' : '登记') + (d.kind === 'code' ? '代码' : 'Web') + '资产：' + a.name,
        { assetId: a.id, assetType: d.kind },
      );
      A.save();
      if (!value) {
        A.closeModal();
        A.render();
        A.toast('资产已保存');
      }
      return clone(a);
    };
    G.renderManagement = function () {
      return A.modelRoles.renderManagement();
    };
  })();
};
