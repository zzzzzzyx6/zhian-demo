# 智安 · AI 安全平台 Demo

单平台纯静态演示：聚焦某个项目/资产的安全检测与风险治理——漏洞扫描、模型攻防演练、应用防护、策略与资产治理。无构建步骤，静态服务器打开即用。

## 运行

```bash
python -m http.server 8911
# 打开 http://127.0.0.1:8911/index.html
```

> 直接双击 index.html 也能看，但部分浏览器在 file:// 下 sessionStorage 受限，推荐走本地服务。

## 结构

```
index.html               入口
src/boot.js              加载器：按其中 order 数组顺序执行 window.AppParts 代码段（新增段必须登记）
src/modules/             业务模块：core(外壳/存储) dashboard(安全态势) scan(漏洞扫描)
                         evaluation(评估) exercise(攻防演练) protection(防护) policy(策略) assets(资产)
src/styles/app.css       全平台唯一样式：页面头/组件/工具类/图表语义色板
src/styles/scan-app.css  扫描器作用域样式
src/data/                演示数据
src/vendor/              第三方库
docs/ui-spec.md          设计系统规范（token/组件/复用/色板/数据准入/禁止清单）
```

## 回归验证

jsdom 工具链，唯一开发依赖：

```bash
cd scripts/verify && npm install

node boot-check.js                              # 首屏渲染 / 运行期错误
node fingerprint.js --against baseline.json     # 30 路由 DOM 指纹比对
node page-head-check.js                         # 页面头结构 + 详情子页（指纹基线未覆盖，需单独跑）
node sidebar-check.js                           # 侧边栏外壳
node dom-classes.js <输出路径>                   # DOM 类清单刷新（必须显式传输出路径）
```

有意变更 DOM 后用 `node fingerprint.js --dump baseline.json` 刷新基线。`scripts/` 根目录的 `*.py` 为历史一次性审计/修复脚本，按需取用。

## 约定

- 页面头统一 `.page-heading`（标题左、`.page-actions` 右同行）；返回按钮作其直接子元素。
- 图表语义色板唯一来源：core.js 的 `D.colors` / `D.verdict` / `D.severity`，禁止再造旁支色值。
- 文案修正改在数据源头（ui-copy / 菜单定义），禁止渲染后处理 DOM 改文本。
