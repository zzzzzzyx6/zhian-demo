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
| 无 token，统一栈 | `-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif` | 全部正文/按钮/标题 |
| 无 token，统一栈 | `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace` | 日志/代码/ID/严重度标签 |

- **禁止**引入新字体栈。Inter / IBM Plex 系列未加载字体文件，一律不得再写。
- `Bahnschrift/DIN Alternate`（数字大字）保留：系统字体、零成本、数字表现力。

### 字号阶梯（--type-*）
`--type-page:24px` 页面主标题 · `--type-module:18px` 模块标题 · `--type-section:15px` 区块标题 · `--type-nav:14px` 导航/按钮 · `--type-body:13px` 正文 · `--type-support:12px` 辅助

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
| 高度 | `--list-control-height`（sm 28 / lg 40） | — | — |
| 字号 | 14px（sm 12 / lg 15） | — | — |
| 圆角 | `--ui-radius` | — | — |
| 底色 | surface | subtle | opacity .5 |
| 边框 | `--line-strong` | brand | — |

primary = `--primary` 底白字；danger = 透明底 critical 色字。

### 卡片 .card
表面 `--ui-surface` · 边框 `--ui-line` · 圆角 `--ui-radius` · 无阴影（扫描器 `--shadow-card:none` 同步）。

### 徽章 .badge
高 22px · 字号 12px · 圆角 3px。扫描器严重度徽章保留 mono + uppercase（语义标签）。

### 标签页
平台级 `.tab`：14px / padding 10px 17px。页内小型切换器（扫描器 `.tab` 28px）：仅限区块内切换，不做平台级导航。

### 空状态 / 表格
- 空态文案统一「暂无 X」；容器 `.empty`（栅格居中）。
- 表格容器一律 `.table-wrap`；新页面表格**必须**用 `D.table()` 原语（core data-display 段），禁止再手写 tbody 模板。

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
| `P.sideShell(title,nav)` | 侧边栏外壳 | ✅ 唯一外壳 |

### 图表语义色板（单套，权威定义在 core.js `D`）
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
- 正文/标题：`-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif`（body 继承，禁止另设 font-family）
- 等宽：`ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`（`.mono` / code-block / 报告正文）
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
- 页面样式一律进 `app.css`（如 attack-module 段，已从 exercise.js 迁出）；模块 JS 内仅允许：①导出报告的独立文档 `<style>`（下载文件需自带样式）②`${...\}` 动态插值。

## 4. 数据层准入
`src/data/` 只收**字面量快照**（机器生成/外部导入、可整体替换、零逻辑）；依赖模块逻辑的程序化种子写在所属模块 `init` 内。

## 5. 禁止清单
- ❌ 新字体栈 / 新筛选栏类名（一律复用 `.toolbar` + 修饰类）
- ❌ 模块 JS 内新增 `<style>` 段（样式进 CSS 文件）
- ❌ 在 ui-system 之外定义 `:root` 级 token
- ❌ 图表/状态用色另造近似色值（一律走 `D.colors/D.verdict/D.severity/D.states/D.kinds` 槽位）
- ❌ 无引用的死函数/死类留存（删除前用裸词全项目计数验证 ≤1 次出现）
- ❌ 硬编码色值用于可主题化表面（用语义 token）
