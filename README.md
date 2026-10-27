# 智安 · AI 安全平台 Demo

单页前端演示，覆盖安全态势、安全扫描、模型演练、安全防护、策略中心、资产中心、风险中心七个栏目，
「安全扫描」栏目直接挂载 `src/scan-center/` 里的扫描器（同一页面内渲染，不再套 iframe）。

## 运行

直接用浏览器打开根目录的 `index.html` 即可，不需要构建、不需要起服务、不依赖网络。

## 目录

```text
index.html            唯一入口：DOM 骨架 + 按顺序引入 src 下的脚本
src/boot.js           启动表：按 order 数组执行各模块登记的代码段
src/modules/          平台代码，按栏目聚合
  core.js             基础能力、平台外壳、通用列表与交互
  dashboard.js        安全态势（仪表盘 A 版 / B 版）
  scan.js             安全扫描
  exercise.js         模型演练
  protection.js       安全防护
  policy.js           策略中心
  evaluation.js       评估与报告
  assets.js           资产中心、风险中心、平台管理
src/scan-center/      独立漏洞扫描器：app.js 渲染 + data.js 数据，被「安全扫描」栏目直接挂载进内容区
src/styles/app.css    全站样式
src/styles/scan-app.css  扫描器样式（全部限定在 .scan-app 下，不影响其他页面）
src/data/datasets.js  内置演示数据（题库、场景标注、预设，来源见下）
src/vendor/           第三方代码（3D 园区引擎），非本项目编写
```

## 第三方代码与数据来源

演示数据不手捏：题库与场景标注来自公开数据集，文件内 `*Provenance` 常量记录了上游仓库、
commit、文件哈希与许可证，可直接核对。

| 文件 | 内容 | 上游 | 许可 |
|---|---|---|---|
| `src/vendor/range-engine.js` | 3D 园区引擎（改编自 lijing-ai-range v0.12.0，内含 three.js r180） | — | AGPL-3.0 / three.js 为 MIT |
| `src/data/datasets.js` | AdvBench 有害行为题库（`AdvBenchProvenance`） | `llm-attacks/llm-attacks` @ `a62d130` | MIT |
| `src/data/datasets.js` | Salad-Data 安全题库抽样（`SaladBankProvenance`） | `OpenSafetyLab/Salad-Data` @ `d21a325` | Apache-2.0 |

> `src/vendor/range-engine.js` 为 AGPL-3.0，仅用于演示；对外分发前请确认整体许可策略。


## 代码段机制（改代码前必读）

`src/modules/*.js` 不是普通脚本，每个文件由若干**代码段**组成：

```js
AppParts['exercise/attack-setup'] = function () {
  (function(){ 'use strict'; /* … */ })();
};
```

段本身不会自己执行，由 `src/boot.js` 里的 `order` 数组按顺序调用。
**顺序即优先级**：后执行的段可以覆盖前面同名的方法，例如

```js
const render = A.modules.attack.render;
A.modules.attack.render = function () { return render.apply(this, arguments) /* 再加一层 */ };
```

因此：

- 新增代码段 → 在对应模块文件里登记，并把名字加进 `boot.js` 的 `order`；
- 调整顺序前 → 先确认是否有段在包装同一个方法，否则界面会被后加载的版本覆盖；
- 想删掉某个段 → 先全局搜索它定义的方法名，确认没有别的段在包装它。

## 扫描器如何接进平台

扫描器（`src/scan-center/app.js`）原本是独立页面，现在按「平台渲染容器、扫描器自己画」的方式接入：

```text
src/modules/scan.js  →  <div id="scan-app" data-own-dom></div>   （只给容器）
src/scan-center/app.js →  window.ScanApp.mount() / navigate(route) （往里渲染）
```

要点：

- `data-own-dom` 告诉平台的 DOM 协调器（`core/interaction-stability`）不要再动这个容器的子节点，
  否则每次平台重绘都会把扫描器画好的内容清掉；
- 扫描器不再读 `location.hash`，地址栏和页面外壳由平台管理，它的内部路由只存在 `ScanApp` 里；
- 侧边栏、账号菜单由平台提供，扫描器只渲染内容区。

## 演示数据与重置

界面右上角「恢复初始数据」会把 `localStorage` 里的演示数据还原成内置预设。
账号固定为本地演示账号「安全管理员」，没有登录流程、没有密码。

## 本地校验

`scripts/verify/` 下有基于 jsdom 的回归工具（需要先在该目录 `npm install`）：

```bash
cd scripts/verify
node fingerprint.js                      # 打印 29 条路由的 DOM 指纹
node fingerprint.js --against baseline.json   # 与基线比对，有差异则退出码 1
node inspect.js                          # 打印外壳与关键容器的实际显示状态
node probe.js '.some-selector'           # 检查某选择器是否真的渲染出来
node boot-check.js                       # 模拟 sessionStorage 可用时的首屏渲染（真实浏览器行为）
node paths.js                            # 校验路径引用与扫描器挂载契约（无构建，移动目录必跑）
node scan-usage.js                       # 走全路由统计某组 API 的调用次数，判断还有没有活路径
node scan-mount-check.js                 # 扫描器挂载契约：挂载/重绘/离返/内部路由/侧栏选中态
```

改动结构、合并文件、删死代码这类「不该改变呈现」的操作，用指纹比对证明零差异。
