/* core/platform-shell。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/platform-shell'] = function () {
  /* Platform navigation: product tasks and shared report/configuration centers. */
  (function () {
    'use strict';
    const A = window.App,
      X = A.attack,
      E = A.escape,
      I = A.icon;
    const { sections, menus, scanTabs, policyTabs } = window.PlatformUI;
    const P = (A.platform = {
      state: { section: 'workspace', item: 'home' },
      scanTab: 'code-scan',
      policyOpen: true,
      defenseOpen: true,
      sections,
      menus,
    });
    P.title = () =>
      P.state.section === 'workspace'
        ? '安全态势'
        : menus[P.state.section]?.find((row) => row[0] === P.state.item)?.[1] || '安全态势';
    /* 旧地址兼容：#evaluation/... 与 #attack 是「安全扫描」「模型演练」拆分前的地址，
     * 这里统一换算成 scan/* 与 exercise/*。返回 [section, item, tab, id]。 */
    P.legacyRoute = function (section, item, tab, id) {
      if (section === 'attack') return ['exercise', 'tasks'];
      if (section !== 'evaluation') return [section, item, tab, id];
      if (item === 'attack') {
        if (tab === 'banks') return ['policy', 'policies', 'content'];
        if (tab === 'details') {
          const task = A.evaluationRecords?.state.task;
          return ['exercise', 'tasks', task !== 'all' ? task : undefined];
        }
        return ['exercise', 'tasks', tab === 'tasks' ? id : undefined];
      }
      if (item === 'tasks') return ['exercise', 'tasks', tab];
      if (item === 'compare' || (item === 'reports' && ['compare', 'objects'].includes(tab)))
        return ['exercise', 'results'];
      if (item === 'reports') {
        if (tab === 'scan') return ['scan', 'reports', 'scan', id];
        return tab ? ['exercise', 'reports', tab] : ['scan', 'reports'];
      }
      if (item === 'scan') return ['scan', 'tasks', tab, id];
      return ['scan', 'tasks', 'code-scan'];
    };
    P.selectState = function (section, item, tab, id) {
      [section, item, tab, id] = P.legacyRoute(section, item, tab, id);
      if (['management', 'risk'].includes(section) && ['rules', 'grading'].includes(item)) {
        tab = item;
        section = 'management';
        item = 'risk-management';
      }
      if (section === 'management' && item === 'access') item = 'api-traffic';
      if ((section === 'scan' || section === 'exercise') && !item) item = 'tasks';
      if (section === 'policy' && ['methods', 'judges', 'templates'].includes(item)) {
        tab = item === 'methods' ? 'methods' : 'strategies';
        item = 'policies';
      }
      if (section === 'protection') {
        if (item === 'content')
          item = { requests: 'records', samples: 'records' }[tab] || tab || 'applications';
        if (item === 'requests' || item === 'samples') {
          tab = item;
          item = 'records';
        }
        if (['settings', 'applications'].includes(item)) item = 'overview';
      }
      if (section === 'policy' && item === 'rules') {
        item = 'defense';
        tab = 'rules';
      }
      if (section === 'risk' && ['overview', 'records'].includes(item)) item = 'events';
      if (section === 'management' && (!item || ['home', 'models', 'roles'].includes(item)))
        item = 'model-roles';
      if (section === 'workspace') item = 'home';
      if (
        !sections.some((s) => s[0] === section) ||
        (section !== 'workspace' && !menus[section].some((row) => row[0] === item))
      )
        return false;
      // Page changes discard unfinished forms; saved policies and task snapshots are unaffected.
      X.wizard = null;
      A.policies.draft = null;
      A.policies.taskPolicyReturn = null;
      A.connections.draft = null;
      A.connections.assetPickers = {};
      if (A.scanProduct) A.scanProduct.draft = null;
      if (A.policyUsability) {
        A.policyUsability.pendingPolicy = null;
        A.policyUsability.pendingTask = null;
      }
      if (A.assessment) A.assessment.pendingScanDraft = null;
      if (A.modelRoles) {
        A.modelRoles.draft?.capabilityController?.abort();
        A.modelRoles.draft = null;
      }
      // 在扫描与演练之间切换时，报告筛选条件不沿用。
      if (A.evaluation && section !== P.state.section && ['scan', 'exercise'].includes(section))
        A.evaluation.reportFilters = { type: 'all', scope: 'all', query: '', sort: 'desc' };
      P.state = { section, item };
      P.applicationId = section === 'assets' && item === 'applications' ? tab || null : null;
      X.selected = null;
      X.rangePreview = false;
      X.tab = 'platform';
      if (A.evaluation) {
        A.evaluation.scanReportId = null;
        A.evaluation.showDrafts = false;
      }
      if (section === 'exercise' && item === 'tasks') {
        X.tab = 'tasks';
        X.detailTab = 'board';
        if (tab && X.db.tasks.some((t) => t.id === tab && !t.deletedAt)) X.selected = tab;
      } else if (section === 'exercise' && item === 'reports') {
        const task = X.db.tasks.find((t) => t.id === tab && !t.deletedAt);
        if (task && A.evaluation?.reportReady(task)) {
          X.selected = task.id;
          X.tab = 'tasks';
          X.detailTab = 'report';
        }
      } else if (section === 'scan' && item === 'tasks') {
        P.scanTab = scanTabs.some((t) => t[0] === tab) ? tab : 'code-scan';
        if (A.scanProduct) A.scanProduct.selected = id || null;
      } else if (section === 'scan' && item === 'reports') {
        if (A.evaluation && tab === 'scan' && id) A.evaluation.scanReportId = id;
      } else if (section === 'management' && item === 'risk-management') {
        if (A.demoPresentation)
          A.demoPresentation.riskTab = tab === 'grading' ? 'grading' : 'rules';
      } else if (section === 'protection' && item === 'review') {
        if (A.guard?.reviewViews) A.guard.reviewViews.ids = null;
      } else if (section === 'assets' && item === 'models') {
        X.tab = 'models';
        X.connectionKind = 'model';
      } else if (section === 'policy' && item === 'policies') {
        A.policies.section = policyTabs.some((t) => t[0] === tab) ? tab : 'strategies';
        P.policyOpen = true;
      } else if (section === 'policy' && item === 'defense') {
        A.guard.policyViews.setTab(tab);
      }
      return true;
    };
    P.go = function (section, item, tab, id) {
      // 重复点击当前地址（且没有打开弹窗）时只重绘，不重置页面状态。
      const target =
        '#' +
        [section, item, tab, id]
          .filter((v) => v !== undefined && v !== null && v !== '')
          .map(encodeURIComponent)
          .join('/');
      if (location.hash === target && !document.querySelector('.overlay.open')) return A.render();
      [section, item, tab, id] = P.legacyRoute(section, item, tab, id);
      section = sections.some((s) => s[0] === section) ? section : 'workspace';
      item ||= section === 'workspace' ? 'home' : menus[section][0][0];
      if (!P.selectState(section, item, tab, id)) return;
      A.closeModal();
      A.closeDrawer();
      A.render();
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    P.navigate = (page) =>
      ({
        attack: () => P.go('exercise', 'tasks'),
        workspace: () => P.go('workspace', 'home'),
        models: () => P.go('assets', 'models'),
        review: () => P.go('protection', 'overview'),
        scan: () => P.go('scan', 'tasks'),
      })[page]?.();
    P.scanPage = (tab, id) => P.go('scan', 'tasks', tab, id);
    P.sync = function () {
      if (X.tab === 'models') {
        P.state = { section: 'assets', item: 'models' };
        X.connectionKind = 'model';
      } else if (X.tab === 'banks') {
        P.state = { section: 'policy', item: 'policies' };
        X.tab = 'platform';
        A.policies.section = 'content';
      } else if (X.selected || X.tab === 'tasks' || X.tab === 'arena' || X.tab === 'details') {
        if (X.tab !== 'tasks') {
          X.selected = X.tab === 'details' ? X.selected : null;
          X.tab = 'tasks';
        }
        const report = X.selected && X.detailTab === 'report' && A.evaluation?.reportReady(X.task);
        if (X.selected && X.detailTab === 'report' && !report) X.detailTab = 'board';
        P.state = { section: 'exercise', item: report ? 'reports' : 'tasks' };
      }
    };
    P.restoreRoute = function () {
      const p = location.hash
        .slice(1)
        .split('/')
        .map((v) => {
          try {
            return decodeURIComponent(v);
          } catch (e) {
            return v;
          }
        });
      if (!p[0]) P.selectState('workspace', 'home');
      else if (!P.selectState(p[0], p[1] || 'home', p[2], p[3])) P.selectState('workspace', 'home');
    };
    P.empty = (title) =>
      A.heading('', title, '') +
      '<section class="platform-empty card"><div class="platform-empty-symbol">' +
      I('layers', 32) +
      '</div><p>暂无内容</p></section>';
    P.header = function () {
      return (
        '<button class="platform-brand" onclick="App.platform.go(\'workspace\',\'home\')" aria-label="AI安全平台安全态势"><strong>AI安全平台</strong></button><nav class="platform-top-nav" aria-label="平台主导航">' +
        sections
          .filter(([id]) => id !== 'management')
          .map(
            ([id, label]) =>
              '<button type="button" class="' +
              (P.state.section === id ? 'active' : '') +
              '" onclick="App.platform.go(\'' +
              id +
              '\')">' +
              label +
              '</button>',
          )
          .join('') +
        '</nav><div class="platform-header-actions"><button class="platform-icon-button" aria-label="平台设置" title="平台设置" onclick="App.platform.go(\'management\',\'model-roles\')">' +
        I('settings', 20) +
        '</button>' +
        (A.platformNotifications?.buttonHTML() ||
          '<button class="platform-icon-button" aria-label="消息通知" onclick="App.platformNotifications.open()">' +
            I('bell', 20) +
            '</button>') +
        '<button class="platform-account" aria-label="账号与退出登录" title="账号与退出登录" onclick="App.account()"><span class="avatar">' +
        I('user', 17) +
        '</span><span class="account-name">' +
        E(A.session?.user || '安全管理员') +
        '</span></button></div>'
      );
    };
    // 侧边栏共享外壳：标题 + 折叠按钮 + 导航 + 页脚。各中心的侧边栏只提供菜单项，不再各自拼装外壳。
    P.sideShell = function (title, nav) {
      const collapsed = !!A.data.ui?.sidebarCollapsed,
        verb = collapsed ? '展开' : '收起';
      return (
        '<div class="platform-side-title"><strong>' +
        title +
        '</strong><button id="center-toggle" class="platform-collapse" aria-controls="center-navigation" aria-expanded="' +
        !collapsed +
        '" aria-label="' +
        verb +
        '侧边栏" title="' +
        verb +
        '侧边栏" onclick="App.platform.toggleSidebar()">' +
        A.icon('chevron', 15) +
        '</button></div><nav id="center-navigation" aria-label="' +
        title +
        '侧边栏">' +
        nav +
        '</nav>'
      );
    };
    P.sidebar = function () {
      const section = P.state.section,
        page = P.pageChrome[section + '/' + P.state.item];
      if (page?.sidebar) return page.sidebar();
      if (['workspace', 'risk'].includes(section)) return '';
      const def = sections.find((s) => s[0] === section);
      const child = (label, action, active) =>
        '<button class="platform-subitem ' +
        (active ? 'active' : '') +
        '" onclick="' +
        action +
        '">' +
        label +
        '</button>';
      return P.sideShell(
        def[1],
        menus[section]
          .filter((row) => !row[3]?.hidden)
          .map(([id, label, icon]) => {
            const active = P.state.item === id,
              group =
                section === 'policy' && id === 'policies'
                  ? 'policy'
                  : section === 'policy' && id === 'defense'
                    ? 'defense'
                    : null,
              expanded = group ? P[group + 'Open'] : false;
            const action = group
              ? "App.platform.toggleGroup('" + group + "')"
              : "App.platform.go('" + section + "','" + id + "')";
            let html =
              '<button class="platform-side-item ' +
              (active ? 'active' : '') +
              '" aria-label="' +
              label +
              '" title="' +
              label +
              '" ' +
              (group ? 'aria-expanded="' + expanded + '"' : '') +
              ' onclick="' +
              action +
              '"><span>' +
              label +
              '</span>' +
              (group
                ? '<i class="platform-menu-chevron ' +
                  (expanded ? 'open' : '') +
                  '">' +
                  I('chevron', 13) +
                  '</i>'
                : '') +
              '</button>';
            if (group === 'policy' || group === 'defense') {
              const tab = group === 'policy' ? 'strategies' : 'configurations',
                selected =
                  active &&
                  (group === 'policy' ? A.policies.section : A.guard.policyViews.tab) === tab;
              html =
                '<div class="platform-nav-parent"><button class="platform-side-item ' +
                (selected ? 'active' : '') +
                "\" onclick=\"App.platform.go('policy','" +
                id +
                "','" +
                tab +
                '\')"><span>' +
                label +
                '</span></button><button class="platform-group-toggle" aria-label="' +
                (expanded ? '收起' : '展开') +
                label +
                '资源" aria-expanded="' +
                expanded +
                '" onclick="App.platform.toggleResources(\'' +
                group +
                '\')"><i class="platform-menu-chevron ' +
                (expanded ? 'open' : '') +
                '">' +
                I('chevron', 13) +
                '</i></button></div>';
            }
            if (group === 'policy' && expanded)
              html +=
                '<div class="platform-subnav">' +
                policyTabs
                  .filter((t) => t[0] !== 'strategies')
                  .map(([tab, name]) =>
                    child(
                      name,
                      "App.platform.go('policy','policies','" + tab + "')",
                      active && A.policies.section === tab,
                    ),
                  )
                  .join('') +
                '</div>';
            if (group === 'defense' && expanded)
              html +=
                '<div class="platform-subnav">' +
                [
                  ['basics', '基础策略'],
                  ['rules', '规则库'],
                  ['knowledge', '词库'],
                ]
                  .map(([tab, name]) =>
                    child(
                      name,
                      "App.platform.go('policy','defense','" + tab + "')",
                      active && A.guard.policyViews.tab === tab,
                    ),
                  )
                  .join('') +
                '</div>';
            return (
              (section === 'assets' && ['applications', 'models'].includes(id)
                ? '<div class="platform-asset-group">' +
                  (id === 'applications' ? '业务应用' : '技术资产') +
                  '</div>'
                : '') + html
            );
          })
          .join(''),
      );
    };
    P.toggleGroup = function (group) {
      const section = 'policy',
        item = group === 'policy' ? 'policies' : group;
      if (P.state.section === section && P.state.item === item) {
        P[group + 'Open'] = !P[group + 'Open'];
        P.renderChrome();
      } else {
        P[group + 'Open'] = true;
        P.go(section, item);
      }
    };
    P.toggleResources = function (group) {
      if (!['policy', 'defense'].includes(group)) return;
      P[group + 'Open'] = !P[group + 'Open'];
      P.renderChrome();
    };
    P.account = () => A.account();
    // 侧边栏折叠：唯一入口，侧边栏与内容区共用同一状态
    P.toggleSidebar = function () {
      A.data.ui ||= {};
      A.data.ui.sidebarCollapsed = !A.data.ui.sidebarCollapsed;
      A.save();
      P.renderChrome();
      document.getElementById('center-toggle')?.focus();
    };
    P.renderChrome = function () {
      P.sync();
      const app = document.getElementById('app'),
        dashboard = ['workspace', 'risk'].includes(P.state.section);
      app.classList.add('platform-shell');
      app.classList.toggle('has-center-nav', !dashboard);
      app.classList.toggle('dashboard-layout', dashboard);
      app.classList.toggle('nav-collapsed', !dashboard && !!A.data.ui?.sidebarCollapsed);
      for (const [id, html] of [
        ['platform-header', P.header()],
        ['center-sidebar', P.sidebar()],
      ]) {
        const host = document.getElementById(id);
        if (A.updateHTML) A.updateHTML(host, html);
        else if (host.innerHTML !== html) host.innerHTML = html;
      }
      document.getElementById('center-sidebar').hidden = dashboard;
      const page = P.pageChrome[P.state.section + '/' + P.state.item];
      for (const cls of Object.values(P.pageChrome)
        .map((c) => c.appClass)
        .filter(Boolean))
        app.classList.toggle(cls, page?.appClass === cls);
      let leaf = P.title(),
        hash = P.state.section + '/' + P.state.item;
      if (P.state.section === 'exercise' && P.state.item === 'tasks') {
        if (X.selected) leaf = '演练任务详情';
        hash = 'exercise/tasks' + (X.selected ? '/' + encodeURIComponent(X.selected) : '');
      }
      if (P.state.section === 'exercise' && P.state.item === 'reports') {
        leaf = '演练报告';
        hash = 'exercise/reports' + (X.selected ? '/' + encodeURIComponent(X.selected) : '');
      }
      if (P.state.section === 'scan' && P.state.item === 'tasks') {
        leaf = scanTabs.find((t) => t[0] === P.scanTab)?.[1] || '扫描任务';
        hash =
          'scan/tasks/' +
          P.scanTab +
          (A.scanProduct?.selected ? '/' + encodeURIComponent(A.scanProduct.selected) : '');
      }
      if (P.state.section === 'scan' && P.state.item === 'reports' && A.evaluation?.scanReportId)
        hash = 'scan/reports/scan/' + encodeURIComponent(A.evaluation.scanReportId);
      if (P.state.section === 'management' && P.state.item === 'risk-management')
        hash = 'management/risk-management/' + (A.demoPresentation?.riskTab || 'rules');
      if (P.state.section === 'assets' && P.state.item === 'applications' && P.applicationId) {
        leaf = '应用详情';
        hash = 'assets/applications/' + encodeURIComponent(P.applicationId);
      }
      if (P.state.section === 'policy' && P.state.item === 'policies') {
        leaf =
          A.policies.section === 'strategies'
            ? '攻击策略配置'
            : policyTabs.find((t) => t[0] === A.policies.section)?.[1];
        hash = 'policy/policies/' + A.policies.section;
      }
      if (P.state.section === 'policy' && P.state.item === 'defense') {
        leaf =
          {
            configurations: '防护策略配置',
            basics: '基础策略',
            rules: '规则库',
            knowledge: '词库',
          }[A.guard.policyViews.tab] || '策略配置';
        hash = 'policy/defense/' + A.guard.policyViews.tab;
      }
      const sectionName = sections.find((s) => s[0] === P.state.section)?.[1];
      document.title = leaf + ' · AI安全平台';
      page?.mount?.();
      app.dataset.section = X.tab;
      app.dataset.platformSection = P.state.section;
      P.setHash(hash);
    };
    /* 页面路由表。一个路由一条记录，键为 'section/item'，值为返回 HTML 的函数。
     *
     * 维护方式：
     *   - 新增页面：P.routes['section/item'] = () => '<html>'；在 window.PlatformUI.menus 里加菜单项。
     *   - 改某页内容：只改对应那一条，不要包装 A.modules.attack.render。
     *   - 整段 section 共用一个渲染器：用 P.sectionRoutes（见下），例如资产中心按 item 分发。
     *
     * 渲染结果会统一过一遍 ListPresentation.html（按钮文案、时间列表头）。
     * 页面内容只在各自的渲染函数里定，不提供渲染后改写 HTML 的钩子。 */
    P.routes = {
      'workspace/home': () => A.platformHome?.render() || P.empty('安全态势'),
      'exercise/tasks': () =>
        X.selected ? A.evaluation.taskDetailHTML(X.task) : A.evaluation.tasksHTML(),
      // 演练报告从任务详情进入；没有选中任务时回到演练任务列表。
      'exercise/reports': () =>
        X.selected ? A.evaluation.reportDetailHTML(X.task) : A.evaluation.tasksHTML(),
      'scan/reports': () =>
        A.evaluation.scanReportId
          ? A.scanProduct.reportHTML(A.evaluation.scanReportId)
          : A.evaluation.reportsHTML(),
      'policy/policies': () => A.policies.renderWorkspace(),
      'policy/defense': () => A.guard.policyViews.render(),
      'assets/models': () => A.modelRoles?.render() || P.empty(P.title()),
      'management/model-roles': () => A.modelRoles.renderManagement(),
    };
    /* 按 section 兜底的渲染器，在 routes 未命中时按 item 分发。 */
    P.sectionRoutes = {
      assets: (item) => A.platformGovernance?.assetsHTML(item) || P.empty(P.title()),
      protection: (item) => A.guard.render(item),
      risk: (item) => A.platformGovernance?.renderRisk(item) || P.empty(P.title()),
    };
    /* 页面级外壳配置：个别页面自带侧边栏或需要在外壳绘制后挂载（如内置扫描器）。
     *   P.pageChrome['section/item'] = { sidebar: () => html, mount: () => {}, appClass: 'x' } */
    P.pageChrome = {};
    A.modules.attack.render = function () {
      P.sync();
      const { section, item } = P.state;
      const route = P.routes[section + '/' + item] || P.sectionRoutes[section];
      let html = route ? route(item) : P.empty(P.title());
      if (window.ListPresentation?.html) html = window.ListPresentation.html(html);
      return html;
    };
    X.back = () => P.go('exercise', 'tasks');
    if (A.evaluationRecords)
      A.evaluationRecords.open = function (id) {
        if (id && X.db.tasks.some((t) => t.id === id)) {
          A.evaluationRecords.setScope(id);
          X.open(id);
          X.detailTab = 'samples';
          A.render();
        } else P.go('exercise', 'tasks');
      };
    P.render = () => A.render();
    /* 返回上一页：路由用 replaceState 写地址栏，不产生浏览器历史，
     * 因此在这里记录页面栈。所有页面左上角的返回按钮都走 A.goBack。 */
    const navStack = [];
    let goingBack = false,
      before = null;
    // 一次渲染里可能多次改写 hash（外壳先写，评估中心再细化），只记录渲染前的那个页面。
    P.setHash = function (hash) {
      const current = location.hash.slice(1);
      if (current === hash) return;
      if (before === null) {
        before = current;
        queueMicrotask(() => {
          const now = location.hash.slice(1);
          if (!goingBack && before && before !== now && navStack.at(-1) !== before)
            navStack.push(before);
          if (navStack.length > 50) navStack.shift();
          before = null;
        });
      }
      history.replaceState(null, '', '#' + hash);
    };
    // fallback：没有上一页时（如刷新后直接打开详情）去的页面 hash。
    A.goBack = function (fallback) {
      const target = navStack.pop() || fallback;
      if (!target) return false;
      goingBack = true;
      // 清掉当前详情选择，由目标 hash 重新恢复；否则渲染时会把详情 id 写回地址栏。
      X.selected = null;
      if (A.evaluation) A.evaluation.scanReportId = null;
      if (A.scanProduct) A.scanProduct.selected = null;
      P.applicationId = null;
      location.hash = target;
      return true;
    };
    // action：同一地址下的子视图（如任务草稿箱）用自己的关闭动作代替页面栈。
    A.backButton = (fallback = '', action = 'App.goBack(this.dataset.fallback)') =>
      `<button type="button" class="page-back" aria-label="返回上一页" title="返回上一页" data-fallback="${A.escape(fallback)}" onclick="${action}">${A.icon('arrow-left', 16)}</button>`;
    window.addEventListener('hashchange', () => {
      if (A.session) {
        P.restoreRoute();
        A.closeModal();
        A.closeDrawer();
        A.render();
      }
      queueMicrotask(() => (goingBack = false));
    });
  })();
};
