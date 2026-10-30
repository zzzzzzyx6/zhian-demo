# 智安平台 UI 规范（ZA-DS）

> 权威层：`app.css` 的 **ui-system 段**（`:root { --ui-* }`）。所有布局、字号、表面、交互决策只在这里做；其他段落与 scan-app.css 只允许引用 token，不允许另立数值。
> 本规范面向 demo 实操：沿用现有类名，复用走共享原语（`D.*` / `P.*`），不搞改名风暴。

## 1. Token（语义层，唯一来源）

### 色彩
| Token | 值 | 用途 |
|---|---|---|
| `--ui-canvas` | `#f5f7fa` | 页面底色 |
| `--ui-surface` | `#fff` | 卡片/面板表面 |
| `--ui-subtle` | `#f8fafc` | 次级表面（hover 底、浅块） |
| `--ui-line` | `#e2e7ee` | 边框/分割线 |
| `--ui-ink` | `#253449` | 主文字 |
| `--ui-muted` | `#64748b` | 次要文字 |
| `--ui-accent` | `#356ba7` | 强调 |
| `--ui-selected` | `#edf3fb` | 选中底 |
| `--primary` / `--primary-dark` / `--primary-bg` | `#2563eb` / `#1d4ed8` / `#eff6ff` | 品牌三件套（按钮/链接/选中） |
| `--sig-*`（scan-app.css） | oklch 语义色 | 漏洞严重度：critical/high/medium/low/ok/info |

### 字体
| Token | 栈 | 用途 |
|---|---|---|
| `--font-sans` | `-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif` | 全部正文/按钮/标题 |
| `--font-mono` | `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace` | 日志/代码/ID/严重度标签 |

- **禁止**引入新字体栈。Inter / IBM Plex / Bahnschrift / DIN 系列已全量清除，一律不得再写。
- CSS 内需要指定字体时只写 `var(--font-sans)` / `var(--font-mono)`；导出报告等独立文档 `<style>` 无法引用变量，写同名字面量。

### 排版阶梯（唯一，--type-* / --weight-* / --lh-*）

**字号**（全平台仅此 9 档 + 数字 4 档；新写 CSS 一律引用 token，存量字面量字号逐步替换）

| Token | 值 | 角色 |
|---|---|---|
| `--type-page` | 24px | 页面主标题（h1 / .page-heading h1） |
| `--type-module` | 18px | 模块/区块标题（h2） |
| `--type-block` | 16px | 卡片标题（h3 / .card-title） |
| `--type-section` | 15px | 小节/副标题 |
| `--type-nav` | 14px | 导航、选项卡 |
| `--type-body` | 13px | 正文、按钮、表格、输入 |
| `--type-support` | 12px | 辅助文字、徽章、表头小字 |
| `--type-caption` | 11px | 微标签、角标 |
| `--type-micro` | 10px | 极小标注 |
| `--type-metric-xl` / `-hero` / `-metric` / `-small` | 32 / 28 / 24 / 18px | 数字指标四档（环形图、KPI、评分） |

**字重**：仅 3 档——`--weight-body:400`（正文）/ `--weight-medium:500`（强调、表头）/ `--weight-strong:600`（标题）。550/620/650/700/300 已全量归并。

**行高**：仅 5 档——`--lh-page:1.3` / `--lh-title:1.4` / `--lh-tight:1.5` / `--lh-body:1.65` / `--lh-num:1.2`。

**文本色**：仅 3 级——`--text:#253449`（主）/ `--muted:#64748b`（次）/ `--text-faint:#8493a6`（弱）。
> 历史坑：`:root` 曾重复定义 `--text` 达 4 次（#172b4d/#16263e/#263b52/#293744），导致各页面文字颜色不同。现已全部收口为单一值。

**私有色板已取缔**：`db-*` / `dp-*` / `ds-*` / `ep-*` / `la-*` / `ph-*` / `wb-*` / `brand-*` 等 8 套模块私有 ink/muted/line/blue 变量，全部改为指向 `--text` / `--muted` / `--line` / `--primary`。语义风险色 `--rc-*`、严重度色 `--sig-*` 保留。

### 形状与控件
| Token | 值 | 用途 |
|---|---|---|
| `--ui-radius` | `8px` | 按钮/卡片/输入框统一圆角 |
| `--list-control-height` | `36px` | 按钮/输入/下拉等控件高度 |
| `--ui-gutter` | `clamp(20px,1.65vw,40px)` | 内容区左右留白 |
| `--ui-gap` | `20px` | 卡片间距 |

## 2. 组件规格

### 按钮 .btn
| 属性 | Default | Hover | Disabled |
|---|---|---|---|
| 高度 | `--list-control-height`（页内紧凑按钮可 28/30px） | — | — |
| 字号 | `--type-body`（13px） | — | — |
| 圆角 | `--ui-radius` | — | — |
| 底色 | surface | subtle | opacity .5 |
| 边框 | `--line-strong` | brand | — |

primary = `--primary` 底白字；danger = 透明底 critical 色字。

### 卡片 .card
表面 `--ui-surface` · 边框 `--ui-line` · 圆角 `--ui-radius`（**唯一值**，10/12px 旁支已收口） · 无阴影。
**卡片头**全平台同规格：`padding:16px 20px` · `min-height:56px` · `border-bottom:1px solid var(--line)` · 标题 `--type-block/600`。含 `.card-head` / `.db-card-head` / `.pd-card-heading` / `.api-section-head`。

### 徽章 .badge
字号 `--type-support`（12px） · 圆角 4px · padding 2px 7px。扫描器严重度徽章保留 mono + uppercase（语义标签）。

### 标签页 / 分段控件
**唯一形态 = 下划线式**：容器 `border-bottom:1px solid var(--line)`、**无背景无边框无圆角**（禁止胶囊容器）；项 `padding:11px 0`，激活态 `color:var(--primary)` + `box-shadow:inset 0 -2px 0 var(--primary)`。
适用 `.tabs` / `.dp-tabs` / `.ec-tabs` / `.cs-segment` / `.cp-record-tabs` / `.connection-kind-tabs` / `.lp-report-tabs`。平台级主导航走 Header 的 `.platform-top-nav`，不属于此列。

### 空状态 / 表格
- 空态文案统一「暂无 X」；容器 `.empty`（栅格居中）。
- 表格容器一律 `.table-wrap`；`th/td` 统一 `padding:12px 16px`、字号 `--type-body`，`th` 底 `#f8fafc`、字重 500。
- 新页面表格**必须**用 `D.table()` 原语（core data-display 段），禁止再手写 tbody 模板。

## 2.1 页面二级行（Header 之下）

> 规则：**Header 承载平台级 Tab；Header 之下只允许一行页面头**，承载标题 + 操作按钮 + 筛选/搜索。窄屏才允许折行。

| 层 | 选择器 | 规格 |
|---|---|---|
| 页面头行 | `.page-heading` | `flex` + `space-between` + `gap:16px` + `flex-wrap:wrap` + `min-height:var(--list-control-height)` + `margin-bottom:20px`；**无 padding / 无边框 / 无背景** |
| 操作区 | `.page-heading > .page-actions` | `gap:10px` + `flex-wrap` + `margin-left:auto` + `justify-content:flex-end` |
| 筛选行 | `.page-heading > .toolbar`（含 `.la-list-toolbar`） | 与操作区**同行右侧**；`padding:0`、无边框无背景（在页面头内不制造第二层卡片） |
| 列表卡片内筛选行 | `.card > .toolbar` / `.la-list-toolbar` | `padding:14px 20px` + `min-height:56px` + `border-bottom:1px solid var(--line)` |
| 内嵌扫描器应用头 | `.scan-app .page-head` | `padding:16px 20px` + `min-height:56px`（与平台页面头同一高度节奏） |

- 禁止给页面头行套独立卡片容器（历史上 `.la-list-toolbar` 的 `min-height:78px + border-bottom` 造成"第二层卡片"观感，已收口）。
- 禁止各页面自定义页面头高度（历史上 `.page-heading` 有 flex/block 三个冲突定义，已由权威层 `!important` 统一）。

## 3. 复用约定（JS 侧）

| 原语 | 用途 | 状态 |
|---|---|---|
| `A.heading(eye,title,desc,actions)` | 页面标题区 | ✅ 已强制（122 处） |
| `D.table(columns,rows,empty)` | 数据表格 | ✅ 已有，新代码强制 |
| `D.ring / D.legend / D.facts / D.progress` | 统计图表原语 | ✅ 已有 |
| `D.empty(text,hint)` | 空状态（div.empty，栅格居中） | ✅ 已建（存量渐进接入） |
| `D.emptyRow(colspan,text)` | 表格行内空态（td.empty） | ✅ 已建（新代码强制，存量渐进接入） |
| `D.toolbar()` | 筛选栏 | 待建（R2） |
| `D.card(title,body,actions)` | 卡片（card-head/card-body 结构） | ✅ 已建（存量渐进接入） |
| `P.sideShell(title,nav)` | 侧边栏外壳（标题 + 折叠按钮 + 导航 + 页脚） | ✅ 唯一外壳；折叠状态 `A.data.ui.sidebarCollapsed`，入口 `P.toggleSidebar` |

### 图表语义色板（单套，权威定义在 core/data-display.js `D`）
| 语义 | 值 | 说明 |
|---|---|---|
| `D.colors` | blue `#4779b5` · teal `#348875` · amber `#d59a38` · red `#c45568` · gray `#a6b2c1` · violet `#6d70b2` · slate `#95a5c3` | 基础七色 |
| `D.verdict` | Safe=teal · Controversial=amber · Unsafe=red · Unknown=gray | 检测结论四态 |
| `D.severity` | critical `#b42335` · high `#ed8a24` · medium `#edca51` · low `#6c9fca` · info `#9aa9bb` · unknown `#b8c3d1` | 漏洞严重级 |
| `D.states` | running=blue · done=teal · stopped=amber · error `#d76a42` · pending=gray | 任务状态五态 |
| `D.kinds` | applications=blue · models=violet · code=teal · packages=slate · web=amber | 资产类型 |

新代码引用色值一律取自上述槽位（`A.dataDisplay.*` 或同名字面量）；**禁止再造近似色**（如 `#4d9d94`/`#527da8` 一类旁支，已于全量归并清除）。

### 布局工具类（app.css ds-primitives 段）
`.flex`（flex+居中+gap10）· `.flip-y`（180° 翻转）· `.minw0` · `.flex-fill`（flex:1+min-width:0）· `.pre-any`（pre-wrap+anywhere）。高频静态内联 style 必须替换为工具类；一次性定位微调（margin-top 等）允许内联。

### 字体栈（唯一）
- 正文/标题：`-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif`（即 `--font-sans`，body 继承，禁止另设 font-family）
- 等宽：`ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`（`.mono` / code-block / 报告正文），即 `--font-mono`
- 已清除：Inter、IBM Plex、Bahnschrift/DIN、独立 "Segoe UI" 等旁支字体栈。

### 筛选栏
- 基类一律 `.toolbar`（flex + wrap + gap 12px），模块差异用修饰类（如 `.toolbar.task-toolbar`），**禁止**新建独立筛选容器类名。
- 现存 4 个独立容器（`.la-management-filters/.or-dataset-filters/.er-filters/.er-embedded-filters`）保留，新代码不得效仿。
- 已清理：`.rt-toolbar/.review-table-toolbar/.filterbar/.filter-bar` 为死类，勿再引用。

### 表格
- 样式已全局统一（`.table-wrap` + platform-shell 全局 th/td/tr:hover 规则）。
- 存量 135 处手写表格 DOM 保持不动（样式由 CSS 兜底）；**新增页面必须用 `D.table()`**，禁止手写 tbody 模板。
- `D.ring/D.legend/D.facts/D.progress` 用于统计可视化，勿重复实现。

### 样式归属
- 页面样式一律进 `app.css`（如 attack-module 段，已从 exercise/attack.js 迁出）；模块 JS 内仅允许：①导出报告的独立文档 `<style>`（下载文件需自带样式）②`${...\}` 动态插值。

## 4. 数据层准入
`src/data/` 只收**字面量快照**（机器生成/外部导入、可整体替换、零逻辑）；依赖模块逻辑的程序化种子写在所属模块 `init` 内。

## 5. 禁止清单
- ❌ 新字体栈 / 新筛选栏类名（一律复用 `.toolbar` + 修饰类）
- ❌ 模块 JS 内新增 `<style>` 段（样式进 CSS 文件）
- ❌ 在 ui-system 之外定义 `:root` 级 token
- ❌ 图表/状态用色另造近似色值（一律走 `D.colors/D.verdict/D.severity/D.states/D.kinds` 槽位）
- ❌ 无引用的死函数/死类留存（删除前用裸词全项目计数验证 ≤1 次出现）
- ❌ 硬编码色值用于可主题化表面（用语义 token）
- ❌ CSS 内写死 `font-size` 字面量（一律走 `--type-*` 阶梯；已归零，勿再引入）
- ❌ 使用 300/550/620/650/700 字重（只保留 400/500/600）
- ❌ 模块私造 `--xx-ink/--xx-muted/--xx-line/--xx-blue` 色板（一律指向 `--text/--muted/--line/--primary`）
- ❌ 页面头行套卡片容器、或把操作区与筛选行拆成上下两行
