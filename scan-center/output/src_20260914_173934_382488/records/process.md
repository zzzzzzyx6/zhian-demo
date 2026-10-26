# 测试过程记录

本文件记录本次检测任务的中间过程：目标画像与情报、风险关注度地图、环境建立、候选发现、候选合并排序、漏洞验证、修复/缓解和报告。
## 任务启动

- 时间：2026-09-14 17:39:37
- 任务 ID：`src_20260914_173934_382488`
- 输入目标：`C:\Users\huangchenghao\Downloads\InternShannon-Vulnerability-Detect-dev-pub\InternShannon-Vulnerability-Detect-dev-pub\uploads\20260914_173107_f48600\src`
- 工作目录：`C:\Users\huangchenghao\Downloads\InternShannon-Vulnerability-Detect-dev-pub\InternShannon-Vulnerability-Detect-dev-pub\uploads\20260914_173107_f48600\src`
- 目标模式：`source_tree`
- 后端：`a3s-code`
- Agent 主动发现：`True`
- Agent 分配池：`{'max_workers': 4, 'min_workers': 2, 'running_total': 0, 'by_stage': {}}`
- Agent 优先级：`['漏洞确认/安全确认', '环境恢复', '验证规划与结果裁决', '候选合并排序', '快速候选种子与高价值候选入队', '候选发现智能体', '修复/缓解与报告整理']`
- 验证保留并发：`2`

## 目标画像

- 时间：2026-09-14 17:39:37
- 项目名：`20260914_173107_f48600`
- 目标模式：`source_tree`
- 源文件数：232
- 二进制产物数：0
- 完整粗扫描清单：`00_profile_intel/project_profile.json`
- 语言分布：`{'python': 232}`
- 构建/依赖清单：`[]`
- 测试命令：`[]`

## 工具链基座准备

- 时间：2026-09-14 17:39:37
- CLI 策略：允许 agent 按任务需要多轮使用当前环境中的任意本地命令，不预设命令类型白名单。
- 工具策略：按假设选择工具，工具类别作为启发而不是全量执行清单。
- 常见类别：静态安全规则、依赖/SBOM、密钥/配置扫描、二进制元数据/hardening、动态诊断、短预算 fuzz/随机输入、协议/API/基础设施检查、Web 站点安全基线。
- 记录要求：只记录实际运行过的命令、预算/超时、退出码和关键证据。
- 证据目录：`C:\Users\huangchenghao\Downloads\InternShannon-Vulnerability-Detect-dev-pub\InternShannon-Vulnerability-Detect-dev-pub\output\src_20260914_173934_382488`。

## 目标画像智能体启动

- 时间：2026-09-14 17:39:38
- 目标：从主程序粗扫描中归纳软件身份、软件类型、运行形态、输入面和安全相关能力。
- 边界：不做漏洞判断，不枚举完整文件清单，不运行构建/测试/随机输入。

## 目标画像智能体输出

- 时间：2026-09-14 17:39:41
- 软件身份：`{'name': '20260914_173107_f48600', 'version': '未知', 'version_evidence': [], 'confidence': 0.4}`
- 软件类型：`源码目录`
- 运行/输入面数量：0
- 建议关注面数量：0

## 漏洞情报智能体启动

- 时间：2026-09-14 17:39:47
- 目标：收集历史 CVE、依赖风险、历史漏洞模式和推荐关注面。
- 原始情报数：20

## 漏洞情报智能体输出

- 时间：2026-09-14 17:39:50
- 软件身份：`{}`
- 已知漏洞：0
- 依赖风险：0
- 推荐关注面：0

## 风险关注度地图

- 时间：2026-09-14 17:39:51
- 文件数：232
- 高风险文件数：160
- 低关注文件数：2
- Top 关注文件：
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py`：risk=1.0，under=0.64，signals=`['authorization', 'configuration', 'dangerous_api', 'entrypoint', 'injection', 'large_file', 'low_attention_area', 'memory_safety', 'no_obvious_tests', 'parser', 'resource', 'underexplored_path']`
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'entrypoint', 'injection', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'dangerous_api', 'entrypoint', 'injection', 'intel_related', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'dangerous_api', 'entrypoint', 'injection', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'entrypoint', 'injection', 'large_file', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'entrypoint', 'injection', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'dangerous_api', 'entrypoint', 'injection', 'large_file', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`
  - `OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'entrypoint', 'injection', 'intel_related', 'large_file', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`
  - `OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'dangerous_api', 'entrypoint', 'injection', 'intel_related', 'large_file', 'memory_safety', 'no_obvious_tests', 'resource']`
  - `OpenRT-main/OpenRT/eval.py`：risk=1.0，under=0.26，signals=`['authorization', 'configuration', 'dangerous_api', 'entrypoint', 'injection', 'large_file', 'memory_safety', 'no_obvious_tests', 'parser', 'resource']`

## 环境建立智能体启动

- 时间：2026-09-14 17:39:51
- 目标：建立最小可复现、可观测、可清理的验证环境，并准备可复用的测试输入驱动。
- 边界：不发现漏洞、不验证漏洞、不执行 fuzz 发现、不修改业务源码；只规划和脚本化后续测试/fuzz 输入。

## 环境建立智能体输出

- 时间：2026-09-14 17:40:00
- 环境可用：`True`
- 目标模式：`source_tree`
- 摘要：本地编排器已建立只读、可复现、可清理的基础环境；后续验证在独立临时目录或受限命令中按候选执行。
- 构建目录：``
- 证据目录：`C:\Users\huangchenghao\Downloads\InternShannon-Vulnerability-Detect-dev-pub\InternShannon-Vulnerability-Detect-dev-pub\output\src_20260914_173934_382488\01_environment\artifacts`
- 可复用命令：
  - `build`：`[]`
  - `test`：`[]`
  - `sanitizer`：`[]`
  - `coverage`：`[]`
  - `safe_runtime`：`['只读源码/配置检查；如需运行测试，由验证阶段按候选选择最小命令。']`
  - `fuzz_smoke`：`[]`
  - `metadata`：`['find . -maxdepth 2 -type d', 'find . -maxdepth 3 -type f -perm /111']`
- 运行入口：blocked=`False`，start=`[]`，client=`[]`
- 测试输入面：`['file_format']`
- Fuzz/随机输入能力：available=`[]`，surfaces=`[]`
  - Fuzz 阻塞原因：尚未由环境智能体确认可运行入口、输入驱动和适用 fuzz 工具。
- 容器镜像：image=`shuan-env-src-20260914-173934-382488:latest`，build=`failed`，context=`01_environment/artifacts/container`
- 运行限制：`{'timeout_seconds': 60, 'memory': '按验证任务设置；默认只读探查不限制内存。', 'network': 'disabled/local-only'}`
- 限制：`['未发现可直接复用的测试命令。', '容器运行环境未完全就绪：容器镜像构建失败。']`

## 本地静态候选发现

- 时间：2026-09-14 17:40:01
- 原始候选数：16
- 过滤后候选数：16
- 过滤测试目录：`True`
- 候选类别限制：`无`

## 流式候选验证启动

- 时间：2026-09-14 17:40:02
- 批次：`static`
- 原因：本地静态候选已产生，先对高优先级候选进行流式筛选验证。
- 候选：`['VULN-001', 'VULN-002', 'VULN-003', 'VULN-004']`

## 流式候选验证输出

- 时间：2026-09-14 17:40:14
- 批次：`static`
- 已验证候选：`['VULN-001', 'VULN-002', 'VULN-003', 'VULN-004']`
- 新确认漏洞数：0

## 候选发现规划智能体输出

- 时间：2026-09-14 17:40:17
- 策略：候选发现规划智能体未运行或失败，使用本地默认分片策略。
- 启用专长：`默认全量`
- 最大任务数：8
- 每类最大切片数：不限制
- 每片文件数：8

## 候选发现智能体启动

- 时间：2026-09-14 17:40:18
- 任务数：8
- 并发数：2
- 流式验证预留：`True`
- 为漏洞确认保留并发：2
- 每片文件数：8
- 每类最大切片数：不限制
- Skill 分配数：8
- 任务：`['discover-01-memory-shard-01', 'discover-02-authz-shard-01', 'discover-03-parser-shard-01', 'discover-04-injection-shard-01', 'discover-05-config-shard-01', 'discover-06-resource-shard-01', 'discover-07-underexplored-shard-01', 'discover-08-general-shard-01']`

## 候选发现汇总

- 时间：2026-09-14 17:40:35
- 本地静态候选数：16
- Agent 候选数：0
- 合并后候选数：16

## 候选合并排序智能体启动

- 时间：2026-09-14 17:40:35
- 输入候选数：16
- 发送给排序智能体候选数：16
- 排序依据：可达性、安全边界强度、危害、证据可验证性、情报关联、低关注加权、假阳性风险。

## 候选合并排序智能体输出

- 时间：2026-09-14 17:40:39
- 验证队列数：0
- 合并组数：0
- 暂缓候选数：0

## 验证任务规划智能体输出

- 时间：2026-09-14 17:40:42
- 策略：验证任务规划智能体未运行或失败，使用本地默认批次。
- 批次数：12
- 是否串行：`False`
- 共享环境策略：`independent_temp_dirs`
- 恢复检查点：`[]`

## 漏洞验证智能体启动

- 时间：2026-09-14 17:40:42
- 验证批次数：12
- 并发数：4
- 优先级：高于候选发现，验证阶段可使用完整 agent 池容量。
- 每批候选数：1
- Skill 分配数：12

## 跨批次确认结果聚合校正

- 时间：2026-09-14 17:41:02
- 候选总数：16
- 验证结论总数：0
- 聚合前已确认：0
- 聚合后确认：0
- 新增补回确认：0
- 跳过（confirmed 但无法解析到候选）：0

## 漏洞验证汇总

- 时间：2026-09-14 17:41:03
- 验证候选数：16
- 流式已验证候选数：4
- 最终批次剩余候选数：12
- 确认漏洞数：0

