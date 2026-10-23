# 第三方来源与许可证

## OpenRT 文本算法子集

- 项目：AI45Lab/OpenRT — https://github.com/AI45Lab/OpenRT
- 固定提交：`81efa876f15c22dcff624894eb5d649e135ac0ec`
- 上游许可证：GNU Affero General Public License v3.0；全文位于 `vendor/openrt_text/LICENSE` 和本项目 `LICENSE`。
- 所有原始版权与许可声明保留于对应源文件。

v0.6 在 `vendor/openrt_text/OpenRT/` 收录 7 个攻击实现（PAIR、Crescendo、ReNeLLM、Multilingual、TreeAttack、ActorAttack、X-Teaming），以及它们使用的模型基类、攻击基类、黑盒攻击基类、注册器和评判基类，共 12 个未修改上游文件。文件路径、原始内容 SHA-256 位于 `vendor/openrt_text/manifest.json`，执行前检查完整性。

该子集的 `__init__.py` 为砺境于 2026-09-07 添加的最小初始化文件，没有使用上游自动批量发现逻辑，避免加载未集成算法及依赖。砺境另外实现了本地模型 RPC 适配、标记反馈、预算限制、取消和证据映射，位于 `range_core/openrt_worker.py`、`openrt_runtime.py`。未改动上述 12 个算法与基类源文件。

本交付的软件源代码按随附 AGPL-3.0 提供，压缩包包含应用源代码、实际集成算法、前端源代码、依赖清单及构建说明。砺境不是 OpenRT 官方项目，也不声称实现全部算法或复现论文指标。

## 前端依赖及其他素材

v0.8 新增 Three.js 0.180.0（MIT），用于本地三维园区和 OrbitControls；许可证全文保留于 `docs/licenses/three.txt`。Three.js 已随 `dist/` 打包，运行时不访问 CDN。v0.8 两张界面参考图为内置 Image Gen 生成；实际地图为本项目编写的三维几何体和材质。

React、React DOM、Lucide、Vite 等依赖的版本与锁定信息见 `package.json`、`pnpm-lock.yaml`；随运行前端分发的 React、React DOM、Scheduler、Lucide 许可证保留于 `docs/licenses/`。Vite 为构建工具，不包含其安装目录。首页地形及设计参考图为本项目生成素材。OpenART 的参考范围见 `docs/agent-exercises.md`；Agent 场景由本项目独立实现，未捆绑 OpenART 源代码。
