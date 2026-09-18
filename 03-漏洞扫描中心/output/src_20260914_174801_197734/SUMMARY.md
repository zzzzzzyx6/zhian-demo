# 漏洞检测最终总结

- 项目：`20260914_174732_2c360f`
- 任务 ID：`src_20260914_174801_197734`
- 输入目标：`C:\Users\huangchenghao\Downloads\InternShannon-Vulnerability-Detect-dev-pub\InternShannon-Vulnerability-Detect-dev-pub\uploads\20260914_174732_2c360f\src`
- 工作目录：`C:\Users\huangchenghao\Downloads\InternShannon-Vulnerability-Detect-dev-pub\InternShannon-Vulnerability-Detect-dev-pub\uploads\20260914_174732_2c360f\src`
- 目标模式：`source_tree`
- 已确认漏洞：0
- 高危/严重：0
- 已修复：0/0

## 阶段目录

| 目录 | 阶段 | 当前状态 |
|---|---|---|
| `00_profile_intel/` | 目标画像与情报收集 | profile:完成; intel:完成 |
| `01_environment/` | 环境建立 | 完成 |
| `02_candidate_discovery/` | 候选发现 | 完成 |
| `03_candidate_ranking/` | 候选合并排序 | 进入验证队列 16 个候选，流式已验证 4 个 |
| `04_validation/` | 漏洞验证 | 已确认 0 个漏洞 |
| `05_remediation/` | 修复或缓解 | 跳过 |
| `06_report/` | 报告生成 | 完成 |

## 关键产物

- 过程记录：`records/process.md`
- 运行状态：`records/state.json`
- 候选发现规划：`02_candidate_discovery/discovery_plan.json`
- 验证任务规划：`04_validation/validation_plan.json`
- 确认漏洞：`04_validation/findings.json`
- 验证裁决：`04_validation/validation_adjudication.json`
- 修复/缓解规划：`05_remediation/remediation_plan.json`
- 修复/缓解：`05_remediation/patches.json`
- 修复结果整理：`05_remediation/remediation_review.json`
- 完整报告：`06_report/report.md`
- 机器汇总：`06_report/summary.json`

## 已确认漏洞

本次运行尚未确认漏洞。
