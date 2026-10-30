# 智安 · AI 安全平台 Demo

离线单页演示，包含安全态势、安全扫描、模型演练、安全防护，以及共享的策略、资产、评估报告和平台管理页面。

## 使用

直接打开根目录 `index.html`。不需要构建、服务器或网络连接。
页面使用本地演示账号；手动修改的数据保存在当前浏览器。右上角“恢复初始数据”用于重置。

## 源码结构

```text
index.html                   离线入口，显式加载资源
src/boot.js                  唯一启动顺序表
src/modules/
  core/                      外壳、存储、弹窗、公共交互、启动
  dashboard/                 态势数据、工作台、当前大屏
  scan/                      扫描页面与 scanner-app.js 扫描器本体
  exercise/                  模型演练页面
  protection/                防护策略、运营、记录与页面
  guard/                     当前安全防护界面
  policy/                    策略与模型角色管理
  evaluation/                评估、结果与报告
  assets/                    资产、风险与平台管理
src/styles/                  全站样式与扫描器作用域样式
src/data/                    演示数据（按需读取）
src/vendor/                  第三方引擎（按需读取）
scripts/verify/              仅开发使用的检查工具
maintenance/                 维护指南、源码和样式定位索引
```

每个模块文件只登记与相对路径同名的一个 `AppParts` 代码段；文件加载时不执行业务逻辑。
`boot.js` 决定执行顺序。既有业务仍有方法包装和跨模块依赖，不能仅凭文件独立就调整启动顺序。

修改前先看 [维护指南](maintenance/代码维护指南.md) 和 [代码导航](maintenance/代码导航.md)。
默认只读取目标模块；数据快照与第三方引擎不参与日常源码格式整理。

## 扫描器接入

`scan/review24.js` 提供平台容器，`scan/scanner-app.js` 通过 `window.ScanApp.mount()` / `navigate()` 管理容器内部。
`data-own-dom` 让公共 DOM 协调器保留扫描器节点；地址栏、顶栏和侧栏由平台管理。

## 开发检查

这些命令需要 Node.js；依赖安装只用于开发，不影响直接打开 demo。

```sh
pnpm --dir scripts/verify install --frozen-lockfile
node scripts/verify/check.js
- `node scripts/verify/page-head-check.js`：逐页检查页面头统一为 `.page-heading` + `.page-actions`，无旧类（wb-heading / attack-detail-top / setup-page-head）残留。
python scripts/verify/audit-structure.py
pnpm --dir scripts/verify format:check
```

重构前保存当前工作区基线，再与修改后结果比较。不要用历史仓库基线代替当前版本，也不要为消除差异覆盖历史基线。

```sh
node scripts/verify/fingerprint.js --dump scripts/verify/current-baseline.local.json
# 修改后
node scripts/verify/fingerprint.js --against scripts/verify/current-baseline.local.json
```

改动路由、外壳或侧栏时，用 `nav-snap.js` 做更全的比对（页面、按钮调用结果、任务与报告详情、旧地址、侧栏与顶栏点击）：

```sh
node scripts/verify/nav-snap.js . --dump scripts/verify/nav.local.json
# 修改后
node scripts/verify/nav-snap.js . --against scripts/verify/nav.local.json
```

`interaction.mjs` 执行每页按钮并比对弹窗、抽屉、提示结果；`skip-check.js` 用于删除代码段前，确认跳过该段后页面不变。
`scripts/verify/baseline.json` 是仓库内的参考基线，路由或页面有意改动后需要重新导出。

`source-check.js` 检查模块语法；`paths.js` 检查入口与扫描器挂载契约；`css-audit.js` 检查同一条件范围、同一选择器的完全重复声明。
`check.js` 会执行这些检查，并运行首屏、扫描器挂载和路由检查。jsdom 里的 DOM 比对不等同于真实浏览器的视觉、动画或完整交互验证。

这些检查没有覆盖所有弹窗和用户数据状态；不能仅凭没有命中，就删除某个方法或样式。

## 第三方代码与数据来源

演示数据不手捏：题库与场景标注来自公开数据集，文件内 `*Provenance` 常量记录了上游仓库、
commit、文件哈希与许可证，可直接核对。

| 文件 | 内容 | 上游 | 许可 |
|---|---|---|---|
| `src/vendor/range-engine.js` | 3D 园区引擎（改编自 lijing-ai-range v0.12.0，内含 three.js r180） | — | AGPL-3.0 / three.js 为 MIT |
| `src/data/datasets.js` | AdvBench 有害行为题库（`AdvBenchProvenance`） | `llm-attacks/llm-attacks` @ `a62d130` | MIT |
| `src/data/datasets.js` | Salad-Data 安全题库抽样（`SaladBankProvenance`） | `OpenSafetyLab/Salad-Data` @ `d21a325` | Apache-2.0 |

> `src/vendor/range-engine.js` 为 AGPL-3.0，仅用于演示；对外分发前请确认整体许可策略。

## 约定

- 页面头统一 `.page-heading`（标题左、`.page-actions` 右同行）；返回按钮作其直接子元素。
- 图表语义色板唯一来源：core/data-display.js 的 `colors` / `D.verdict` / `D.severity`，禁止再造旁支色值。
- 文案修正改在数据源头（ui-copy / 菜单定义），禁止渲染后处理 DOM 改文本。
