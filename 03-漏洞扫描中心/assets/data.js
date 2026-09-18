// 烘焙数据：由在线控制台 localhost:8765 的真实接口快照生成，供静态 demo 使用。
// 与后端完全解耦，所有页面只读这份数据。
window.DEMO_DATA = {
  "generatedAt": "2026-09-17T07:14:23.371Z",
  "projects": [
    {
      "id": "src_20260914_174801_197734",
      "backend_project_id": "prj_20260914_174732_59cb39",
      "name": "很重要的测试",
      "description": "111",
      "created_at": 1789379411.7825096,
      "phase": "detect",
      "phase_label": "本地候选 + A3S 确认",
      "target_type": "源码目录",
      "target": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_174732_2c360f\\src",
      "model_config": "",
      "status": "succeeded",
      "progress": 100,
      "started_at": 1789379411.7825096,
      "duration": 0,
      "stages": [
        {
          "label": "画像",
          "hint": "画像、情报、关注度",
          "state": "done"
        },
        {
          "label": "环境",
          "hint": "探针、构建、隔离",
          "state": "done"
        },
        {
          "label": "发现",
          "hint": "静态 + 专长智能体",
          "state": "done"
        },
        {
          "label": "排序",
          "hint": "合并排序与上下文包",
          "state": "done"
        },
        {
          "label": "验证",
          "hint": "计划、确认、裁决",
          "state": "done"
        },
        {
          "label": "修复",
          "hint": "补丁或缓解建议",
          "state": "skipped"
        },
        {
          "label": "报告",
          "hint": "总结与报告",
          "state": "done"
        }
      ],
      "metrics": {
        "candidates": 16,
        "probes": 0,
        "findings": 0,
        "patches": 0,
        "errors": 0
      },
      "severity": {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0,
        "info": 0
      },
      "files": {
        "00_profile_intel/agent_tool_capabilities.json": {
          "size": 8768,
          "path": "00_profile_intel/agent_tool_capabilities.json"
        },
        "00_profile_intel/attention_map.json": {
          "size": 182572,
          "path": "00_profile_intel/attention_map.json"
        },
        "00_profile_intel/intel_cache/20260914_174732_2c360f__online_v2_vuln_intel.json": {
          "size": 2,
          "path": "00_profile_intel/intel_cache/20260914_174732_2c360f__online_v2_vuln_intel.json"
        },
        "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json": {
          "size": 10590,
          "path": "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json"
        },
        "00_profile_intel/profile_summary.json": {
          "size": 1639,
          "path": "00_profile_intel/profile_summary.json"
        },
        "00_profile_intel/project_profile.json": {
          "size": 39111,
          "path": "00_profile_intel/project_profile.json"
        },
        "00_profile_intel/raw_intel.json": {
          "size": 11010,
          "path": "00_profile_intel/raw_intel.json"
        },
        "00_profile_intel/raw_intel_queries.json": {
          "size": 42,
          "path": "00_profile_intel/raw_intel_queries.json"
        },
        "00_profile_intel/raw_intel_query_plan.json": {
          "size": 343,
          "path": "00_profile_intel/raw_intel_query_plan.json"
        },
        "00_profile_intel/top_attention_items.json": {
          "size": 155612,
          "path": "00_profile_intel/top_attention_items.json"
        },
        "00_profile_intel/vulnerability_intel.json": {
          "size": 11393,
          "path": "00_profile_intel/vulnerability_intel.json"
        },
        "01_environment/artifacts/container/build.log": {
          "size": 757,
          "path": "01_environment/artifacts/container/build.log"
        },
        "01_environment/artifacts/container/Dockerfile": {
          "size": 1021,
          "path": "01_environment/artifacts/container/Dockerfile"
        },
        "01_environment/artifacts/container/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/container/scripts/check_container.sh"
        },
        "01_environment/artifacts/container/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/container/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/container/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/container/scripts/provision_runtime.sh"
        },
        "01_environment/artifacts/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/scripts/check_container.sh"
        },
        "01_environment/artifacts/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/scripts/provision_runtime.sh"
        },
        "01_environment/container_artifacts.json": {
          "size": 2690,
          "path": "01_environment/container_artifacts.json"
        },
        "01_environment/directory_snapshot.json": {
          "size": 6125,
          "path": "01_environment/directory_snapshot.json"
        },
        "01_environment/environment.json": {
          "size": 20790,
          "path": "01_environment/environment.json"
        },
        "01_environment/environment_plan.json": {
          "size": 20790,
          "path": "01_environment/environment_plan.json"
        },
        "01_environment/local_environment_probe.json": {
          "size": 11329,
          "path": "01_environment/local_environment_probe.json"
        },
        "02_candidate_discovery/agent_candidates.json": {
          "size": 2,
          "path": "02_candidate_discovery/agent_candidates.json"
        },
        "02_candidate_discovery/discovery_plan.json": {
          "size": 838,
          "path": "02_candidate_discovery/discovery_plan.json"
        },
        "02_candidate_discovery/discovery_tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/discovery_tasks.json"
        },
        "02_candidate_discovery/merged_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/merged_candidates.json"
        },
        "02_candidate_discovery/skill_assignments.json": {
          "size": 9785,
          "path": "02_candidate_discovery/skill_assignments.json"
        },
        "02_candidate_discovery/static_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates.json"
        },
        "02_candidate_discovery/static_candidates_filtered.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates_filtered.json"
        },
        "02_candidate_discovery/tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/tasks.json"
        },
        "03_candidate_ranking/candidate_ranking.json": {
          "size": 2,
          "path": "03_candidate_ranking/candidate_ranking.json"
        },
        "03_candidate_ranking/remaining_validation_queue.json": {
          "size": 7995,
          "path": "03_candidate_ranking/remaining_validation_queue.json"
        },
        "03_candidate_ranking/selected_validation_queue.json": {
          "size": 10726,
          "path": "03_candidate_ranking/selected_validation_queue.json"
        },
        "04_validation/batches/batch_001_input.json": {
          "size": 13098,
          "path": "04_validation/batches/batch_001_input.json"
        },
        "04_validation/batches/batch_002_input.json": {
          "size": 14461,
          "path": "04_validation/batches/batch_002_input.json"
        },
        "04_validation/batches/batch_003_input.json": {
          "size": 13864,
          "path": "04_validation/batches/batch_003_input.json"
        },
        "04_validation/batches/batch_004_input.json": {
          "size": 14354,
          "path": "04_validation/batches/batch_004_input.json"
        },
        "04_validation/batches/batch_005_input.json": {
          "size": 11627,
          "path": "04_validation/batches/batch_005_input.json"
        },
        "04_validation/batches/batch_006_input.json": {
          "size": 13690,
          "path": "04_validation/batches/batch_006_input.json"
        },
        "04_validation/batches/batch_007_input.json": {
          "size": 11502,
          "path": "04_validation/batches/batch_007_input.json"
        },
        "04_validation/batches/batch_008_input.json": {
          "size": 11930,
          "path": "04_validation/batches/batch_008_input.json"
        },
        "04_validation/batches/batch_009_input.json": {
          "size": 10414,
          "path": "04_validation/batches/batch_009_input.json"
        },
        "04_validation/batches/batch_010_input.json": {
          "size": 12873,
          "path": "04_validation/batches/batch_010_input.json"
        },
        "04_validation/batches/batch_011_input.json": {
          "size": 14548,
          "path": "04_validation/batches/batch_011_input.json"
        },
        "04_validation/batches/batch_012_input.json": {
          "size": 14345,
          "path": "04_validation/batches/batch_012_input.json"
        },
        "04_validation/batches/batch_013_input.json": {
          "size": 12752,
          "path": "04_validation/batches/batch_013_input.json"
        },
        "04_validation/batches/batch_014_input.json": {
          "size": 12427,
          "path": "04_validation/batches/batch_014_input.json"
        },
        "04_validation/batches/batch_015_input.json": {
          "size": 13422,
          "path": "04_validation/batches/batch_015_input.json"
        },
        "04_validation/batches/batch_016_input.json": {
          "size": 14072,
          "path": "04_validation/batches/batch_016_input.json"
        },
        "04_validation/candidate_context_bundles.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles.json"
        },
        "04_validation/candidate_context_bundles_selected.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles_selected.json"
        },
        "04_validation/environment_restore_plan.json": {
          "size": 2,
          "path": "04_validation/environment_restore_plan.json"
        },
        "04_validation/findings.json": {
          "size": 2,
          "path": "04_validation/findings.json"
        },
        "04_validation/skill_assignments/batch_001.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_001.json"
        },
        "04_validation/skill_assignments/batch_002.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_002.json"
        },
        "04_validation/skill_assignments/batch_003.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_003.json"
        },
        "04_validation/skill_assignments/batch_004.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_004.json"
        },
        "04_validation/skill_assignments.json": {
          "size": 25566,
          "path": "04_validation/skill_assignments.json"
        },
        "04_validation/streaming/static_queue.json": {
          "size": 45499,
          "path": "04_validation/streaming/static_queue.json"
        },
        "04_validation/streaming_validation_records.json": {
          "size": 243,
          "path": "04_validation/streaming_validation_records.json"
        },
        "04_validation/validation_adjudication.json": {
          "size": 273,
          "path": "04_validation/validation_adjudication.json"
        },
        "04_validation/validation_plan.json": {
          "size": 7981,
          "path": "04_validation/validation_plan.json"
        },
        "04_validation/validation_results.json": {
          "size": 2,
          "path": "04_validation/validation_results.json"
        },
        "05_remediation/patches.json": {
          "size": 2,
          "path": "05_remediation/patches.json"
        },
        "05_remediation/remediation_plan.json": {
          "size": 241,
          "path": "05_remediation/remediation_plan.json"
        },
        "05_remediation/remediation_review.json": {
          "size": 218,
          "path": "05_remediation/remediation_review.json"
        },
        "06_report/report.md": {
          "size": 478,
          "path": "06_report/report.md"
        },
        "06_report/summary.json": {
          "size": 41979,
          "path": "06_report/summary.json"
        },
        "debug/a3s/08_a3s_candidate_ranking_parsed_1789379384306.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_candidate_ranking_parsed_1789379384306.json"
        },
        "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789379365418.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789379365418.json"
        },
        "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789379366265.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789379366265.json"
        },
        "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789379369675.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789379369675.json"
        },
        "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789379370414.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789379370414.json"
        },
        "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789379373677.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789379373677.json"
        },
        "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789379374848.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789379374848.json"
        },
        "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789379377308.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789379377308.json"
        },
        "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789379379379.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789379379379.json"
        },
        "debug/a3s/08_a3s_discovery_plan_parsed_1789379359734.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discovery_plan_parsed_1789379359734.json"
        },
        "debug/a3s/08_a3s_environment_parsed_1789379303109.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_environment_parsed_1789379303109.json"
        },
        "debug/a3s/08_a3s_intel_parsed_1789379296433.json": {
          "size": 11393,
          "path": "debug/a3s/08_a3s_intel_parsed_1789379296433.json"
        },
        "debug/a3s/08_a3s_profile_parsed_1789379287867.json": {
          "size": 1639,
          "path": "debug/a3s/08_a3s_profile_parsed_1789379287867.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379322799.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379322799.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379339562.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379339562.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379347825.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379347825.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379352478.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379352478.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379396437.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379396437.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379397276.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379397276.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379398113.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379398113.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379398933.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379398933.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379401742.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379401742.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379402733.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379402733.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379403705.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379403705.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379404724.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379404724.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379406683.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379406683.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379407477.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379407477.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379408812.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379408812.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379410006.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379410006.json"
        },
        "debug/a3s/08_a3s_validation_plan_parsed_1789379389471.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validation_plan_parsed_1789379389471.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789379373786.jsonl": {
          "size": 80900,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789379373786.jsonl"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789379373786.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789379373786.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789379373786.txt": {
          "size": 73507,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789379373786.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789379373786.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789379373786.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789379373786.json": {
          "size": 236322,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789379373786.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_events_1789379352647.jsonl": {
          "size": 92932,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_events_1789379352647.jsonl"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_meta_1789379352647.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_meta_1789379352647.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789379352647.txt": {
          "size": 84496,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789379352647.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_response_1789379352647.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_response_1789379352647.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789379352647.json": {
          "size": 272418,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789379352647.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_events_1789379379925.jsonl": {
          "size": 192190,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_events_1789379379925.jsonl"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_meta_1789379379925.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_meta_1789379379925.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789379379925.txt": {
          "size": 177790,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789379379925.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_response_1789379379925.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_response_1789379379925.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789379379925.json": {
          "size": 570192,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789379379925.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789379360512.jsonl": {
          "size": 81407,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789379360512.jsonl"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789379360512.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789379360512.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789379360512.txt": {
          "size": 73984,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789379360512.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789379360512.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789379360512.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789379360512.json": {
          "size": 237843,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789379360512.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789379366386.jsonl": {
          "size": 81405,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789379366386.jsonl"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789379366386.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789379366386.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789379366386.txt": {
          "size": 73982,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789379366386.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789379366386.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789379366386.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789379366386.json": {
          "size": 237837,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789379366386.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_events_1789379293241.jsonl": {
          "size": 16516,
          "path": "debug/a3s/08_a3s_安全情报智能体_events_1789379293241.jsonl"
        },
        "debug/a3s/08_a3s_安全情报智能体_meta_1789379293241.json": {
          "size": 905,
          "path": "debug/a3s/08_a3s_安全情报智能体_meta_1789379293241.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_prompt_1789379293241.txt": {
          "size": 12854,
          "path": "debug/a3s/08_a3s_安全情报智能体_prompt_1789379293241.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_response_1789379293241.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全情报智能体_response_1789379293241.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_snapshot_1789379293241.json": {
          "size": 43170,
          "path": "debug/a3s/08_a3s_安全情报智能体_snapshot_1789379293241.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379309565.jsonl": {
          "size": 76940,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379309565.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379323159.jsonl": {
          "size": 77006,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379323159.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379340111.jsonl": {
          "size": 76887,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379340111.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379348188.jsonl": {
          "size": 76902,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379348188.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379390139.jsonl": {
          "size": 76468,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379390139.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379390575.jsonl": {
          "size": 76545,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379390575.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379391214.jsonl": {
          "size": 76531,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379391214.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379391811.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379391811.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379396608.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379396608.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379397691.jsonl": {
          "size": 76539,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379397691.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379398489.jsonl": {
          "size": 76580,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379398489.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379399389.jsonl": {
          "size": 76458,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379399389.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379401871.jsonl": {
          "size": 76543,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379401871.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379402856.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379402856.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379403924.jsonl": {
          "size": 76434,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379403924.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379405084.jsonl": {
          "size": 76678,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379405084.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379309565.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379309565.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379323159.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379323159.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379340111.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379340111.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379348188.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379348188.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379390139.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379390139.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379390575.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379390575.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379391214.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379391214.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379391811.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379391811.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379396608.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379396608.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379397691.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379397691.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379398489.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379398489.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379399389.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379399389.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379401871.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379401871.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379402856.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379402856.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379403924.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379403924.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379405084.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379405084.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379309565.txt": {
          "size": 69763,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379309565.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379323159.txt": {
          "size": 69807,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379323159.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379340111.txt": {
          "size": 69720,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379340111.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379348188.txt": {
          "size": 69744,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379348188.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390139.txt": {
          "size": 69332,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390139.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390575.txt": {
          "size": 69407,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390575.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391214.txt": {
          "size": 69357,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391214.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391811.txt": {
          "size": 69343,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391811.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379396608.txt": {
          "size": 69341,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379396608.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379397691.txt": {
          "size": 69371,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379397691.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379398489.txt": {
          "size": 69455,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379398489.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379399389.txt": {
          "size": 69340,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379399389.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379401871.txt": {
          "size": 69413,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379401871.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379402856.txt": {
          "size": 69386,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379402856.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379403924.txt": {
          "size": 69297,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379403924.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379405084.txt": {
          "size": 69511,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379405084.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379309565.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379309565.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379323159.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379323159.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379340111.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379340111.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379348188.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379348188.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379390139.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379390139.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379390575.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379390575.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379391214.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379391214.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379391811.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379391811.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379396608.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379396608.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379397691.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379397691.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379398489.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379398489.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379399389.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379399389.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379401871.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379401871.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379402856.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379402856.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379403924.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379403924.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379405084.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379405084.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379309565.json": {
          "size": 224442,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379309565.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379323159.json": {
          "size": 224640,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379323159.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379340111.json": {
          "size": 224283,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379340111.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379348188.json": {
          "size": 224328,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379348188.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390139.json": {
          "size": 223026,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390139.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390575.json": {
          "size": 223257,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390575.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391214.json": {
          "size": 223215,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391214.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391811.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391811.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379396608.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379396608.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379397691.json": {
          "size": 223239,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379397691.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379398489.json": {
          "size": 223362,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379398489.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379399389.json": {
          "size": 222996,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379399389.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379401871.json": {
          "size": 223251,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379401871.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379402856.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379402856.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379403924.json": {
          "size": 222924,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379403924.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379405084.json": {
          "size": 223656,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379405084.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789379370513.jsonl": {
          "size": 81402,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789379370513.jsonl"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789379370513.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789379370513.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789379370513.txt": {
          "size": 73979,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789379370513.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789379370513.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789379370513.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789379370513.json": {
          "size": 237828,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789379370513.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789379360617.jsonl": {
          "size": 81394,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789379360617.jsonl"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789379360617.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789379360617.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789379360617.txt": {
          "size": 73971,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789379360617.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789379360617.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789379360617.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789379360617.json": {
          "size": 237804,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789379360617.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_events_1789379299729.jsonl": {
          "size": 34007,
          "path": "debug/a3s/08_a3s_环境建立智能体_events_1789379299729.jsonl"
        },
        "debug/a3s/08_a3s_环境建立智能体_meta_1789379299729.json": {
          "size": 908,
          "path": "debug/a3s/08_a3s_环境建立智能体_meta_1789379299729.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_prompt_1789379299729.txt": {
          "size": 29683,
          "path": "debug/a3s/08_a3s_环境建立智能体_prompt_1789379299729.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_response_1789379299729.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_环境建立智能体_response_1789379299729.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_snapshot_1789379299729.json": {
          "size": 95643,
          "path": "debug/a3s/08_a3s_环境建立智能体_snapshot_1789379299729.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_events_1789379284979.jsonl": {
          "size": 18128,
          "path": "debug/a3s/08_a3s_目标画像智能体_events_1789379284979.jsonl"
        },
        "debug/a3s/08_a3s_目标画像智能体_meta_1789379284979.json": {
          "size": 906,
          "path": "debug/a3s/08_a3s_目标画像智能体_meta_1789379284979.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_prompt_1789379284979.txt": {
          "size": 14557,
          "path": "debug/a3s/08_a3s_目标画像智能体_prompt_1789379284979.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_response_1789379284979.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_目标画像智能体_response_1789379284979.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_snapshot_1789379284979.json": {
          "size": 48006,
          "path": "debug/a3s/08_a3s_目标画像智能体_snapshot_1789379284979.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789379365592.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789379365592.jsonl"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789379365592.json": {
          "size": 1019,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789379365592.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789379365592.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789379365592.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789379365592.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789379365592.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789379365592.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789379365592.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_events_1789379374960.jsonl": {
          "size": 81381,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_events_1789379374960.jsonl"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_meta_1789379374960.json": {
          "size": 947,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_meta_1789379374960.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789379374960.txt": {
          "size": 73958,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789379374960.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_response_1789379374960.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_response_1789379374960.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789379374960.json": {
          "size": 237765,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789379374960.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789379369783.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789379369783.jsonl"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789379369783.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789379369783.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789379369783.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789379369783.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789379369783.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789379369783.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789379369783.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789379369783.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_events_1789379385143.jsonl": {
          "size": 42622,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_events_1789379385143.jsonl"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_meta_1789379385143.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_meta_1789379385143.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789379385143.txt": {
          "size": 37107,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789379385143.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_response_1789379385143.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_response_1789379385143.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789379385143.json": {
          "size": 121488,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789379385143.json"
        },
        "debug/logs/a3s_interactions.jsonl": {
          "size": 2358983,
          "path": "debug/logs/a3s_interactions.jsonl"
        },
        "debug/logs/events.jsonl": {
          "size": 38017,
          "path": "debug/logs/events.jsonl"
        },
        "records/01_skill_assignments.json": {
          "size": 9785,
          "path": "records/01_skill_assignments.json"
        },
        "records/15_validation_skill_assignments.json": {
          "size": 25566,
          "path": "records/15_validation_skill_assignments.json"
        },
        "records/agent_pool_status.json": {
          "size": 17109,
          "path": "records/agent_pool_status.json"
        },
        "records/artifact_index.json": {
          "size": 27124,
          "path": "records/artifact_index.json"
        },
        "records/feedback_memory.json": {
          "size": 182,
          "path": "records/feedback_memory.json"
        },
        "records/process.md": {
          "size": 10935,
          "path": "records/process.md"
        },
        "records/run_status.json": {
          "size": 587,
          "path": "records/run_status.json"
        },
        "records/state.json": {
          "size": 420,
          "path": "records/state.json"
        },
        "SUMMARY.md": {
          "size": 1735,
          "path": "SUMMARY.md"
        }
      },
      "reportHref": "/api/output/src_20260914_174801_197734/06_report/report.md"
    },
    {
      "id": "src_20260914_173934_382488",
      "backend_project_id": "default",
      "name": "src",
      "description": "历史任务和未指定项目的扫描。",
      "created_at": 1789378863.7815218,
      "phase": "detect",
      "phase_label": "本地候选 + A3S 确认",
      "target_type": "源码目录",
      "target": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_173107_f48600\\src",
      "model_config": "",
      "status": "succeeded",
      "progress": 100,
      "started_at": 1789378863.7815218,
      "duration": 0,
      "stages": [
        {
          "label": "画像",
          "hint": "画像、情报、关注度",
          "state": "done"
        },
        {
          "label": "环境",
          "hint": "探针、构建、隔离",
          "state": "done"
        },
        {
          "label": "发现",
          "hint": "静态 + 专长智能体",
          "state": "done"
        },
        {
          "label": "排序",
          "hint": "合并排序与上下文包",
          "state": "done"
        },
        {
          "label": "验证",
          "hint": "计划、确认、裁决",
          "state": "done"
        },
        {
          "label": "修复",
          "hint": "补丁或缓解建议",
          "state": "skipped"
        },
        {
          "label": "报告",
          "hint": "总结与报告",
          "state": "done"
        }
      ],
      "metrics": {
        "candidates": 16,
        "probes": 0,
        "findings": 0,
        "patches": 0,
        "errors": 0
      },
      "severity": {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0,
        "info": 0
      },
      "files": {
        "00_profile_intel/agent_tool_capabilities.json": {
          "size": 8768,
          "path": "00_profile_intel/agent_tool_capabilities.json"
        },
        "00_profile_intel/attention_map.json": {
          "size": 182572,
          "path": "00_profile_intel/attention_map.json"
        },
        "00_profile_intel/intel_cache/20260914_173107_f48600__online_v2_vuln_intel.json": {
          "size": 2,
          "path": "00_profile_intel/intel_cache/20260914_173107_f48600__online_v2_vuln_intel.json"
        },
        "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json": {
          "size": 10590,
          "path": "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json"
        },
        "00_profile_intel/profile_summary.json": {
          "size": 1639,
          "path": "00_profile_intel/profile_summary.json"
        },
        "00_profile_intel/project_profile.json": {
          "size": 39111,
          "path": "00_profile_intel/project_profile.json"
        },
        "00_profile_intel/raw_intel.json": {
          "size": 11010,
          "path": "00_profile_intel/raw_intel.json"
        },
        "00_profile_intel/raw_intel_queries.json": {
          "size": 42,
          "path": "00_profile_intel/raw_intel_queries.json"
        },
        "00_profile_intel/raw_intel_query_plan.json": {
          "size": 343,
          "path": "00_profile_intel/raw_intel_query_plan.json"
        },
        "00_profile_intel/top_attention_items.json": {
          "size": 155612,
          "path": "00_profile_intel/top_attention_items.json"
        },
        "00_profile_intel/vulnerability_intel.json": {
          "size": 11393,
          "path": "00_profile_intel/vulnerability_intel.json"
        },
        "01_environment/artifacts/container/build.log": {
          "size": 757,
          "path": "01_environment/artifacts/container/build.log"
        },
        "01_environment/artifacts/container/Dockerfile": {
          "size": 1021,
          "path": "01_environment/artifacts/container/Dockerfile"
        },
        "01_environment/artifacts/container/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/container/scripts/check_container.sh"
        },
        "01_environment/artifacts/container/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/container/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/container/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/container/scripts/provision_runtime.sh"
        },
        "01_environment/artifacts/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/scripts/check_container.sh"
        },
        "01_environment/artifacts/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/scripts/provision_runtime.sh"
        },
        "01_environment/container_artifacts.json": {
          "size": 2690,
          "path": "01_environment/container_artifacts.json"
        },
        "01_environment/directory_snapshot.json": {
          "size": 6125,
          "path": "01_environment/directory_snapshot.json"
        },
        "01_environment/environment.json": {
          "size": 20790,
          "path": "01_environment/environment.json"
        },
        "01_environment/environment_plan.json": {
          "size": 20790,
          "path": "01_environment/environment_plan.json"
        },
        "01_environment/local_environment_probe.json": {
          "size": 11329,
          "path": "01_environment/local_environment_probe.json"
        },
        "02_candidate_discovery/agent_candidates.json": {
          "size": 2,
          "path": "02_candidate_discovery/agent_candidates.json"
        },
        "02_candidate_discovery/discovery_plan.json": {
          "size": 838,
          "path": "02_candidate_discovery/discovery_plan.json"
        },
        "02_candidate_discovery/discovery_tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/discovery_tasks.json"
        },
        "02_candidate_discovery/merged_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/merged_candidates.json"
        },
        "02_candidate_discovery/skill_assignments.json": {
          "size": 9785,
          "path": "02_candidate_discovery/skill_assignments.json"
        },
        "02_candidate_discovery/static_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates.json"
        },
        "02_candidate_discovery/static_candidates_filtered.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates_filtered.json"
        },
        "02_candidate_discovery/tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/tasks.json"
        },
        "03_candidate_ranking/candidate_ranking.json": {
          "size": 2,
          "path": "03_candidate_ranking/candidate_ranking.json"
        },
        "03_candidate_ranking/remaining_validation_queue.json": {
          "size": 7995,
          "path": "03_candidate_ranking/remaining_validation_queue.json"
        },
        "03_candidate_ranking/selected_validation_queue.json": {
          "size": 10726,
          "path": "03_candidate_ranking/selected_validation_queue.json"
        },
        "04_validation/batches/batch_001_input.json": {
          "size": 13098,
          "path": "04_validation/batches/batch_001_input.json"
        },
        "04_validation/batches/batch_002_input.json": {
          "size": 14461,
          "path": "04_validation/batches/batch_002_input.json"
        },
        "04_validation/batches/batch_003_input.json": {
          "size": 13864,
          "path": "04_validation/batches/batch_003_input.json"
        },
        "04_validation/batches/batch_004_input.json": {
          "size": 14354,
          "path": "04_validation/batches/batch_004_input.json"
        },
        "04_validation/batches/batch_005_input.json": {
          "size": 11627,
          "path": "04_validation/batches/batch_005_input.json"
        },
        "04_validation/batches/batch_006_input.json": {
          "size": 13690,
          "path": "04_validation/batches/batch_006_input.json"
        },
        "04_validation/batches/batch_007_input.json": {
          "size": 11502,
          "path": "04_validation/batches/batch_007_input.json"
        },
        "04_validation/batches/batch_008_input.json": {
          "size": 11930,
          "path": "04_validation/batches/batch_008_input.json"
        },
        "04_validation/batches/batch_009_input.json": {
          "size": 10414,
          "path": "04_validation/batches/batch_009_input.json"
        },
        "04_validation/batches/batch_010_input.json": {
          "size": 12873,
          "path": "04_validation/batches/batch_010_input.json"
        },
        "04_validation/batches/batch_011_input.json": {
          "size": 14548,
          "path": "04_validation/batches/batch_011_input.json"
        },
        "04_validation/batches/batch_012_input.json": {
          "size": 14345,
          "path": "04_validation/batches/batch_012_input.json"
        },
        "04_validation/batches/batch_013_input.json": {
          "size": 12752,
          "path": "04_validation/batches/batch_013_input.json"
        },
        "04_validation/batches/batch_014_input.json": {
          "size": 12427,
          "path": "04_validation/batches/batch_014_input.json"
        },
        "04_validation/batches/batch_015_input.json": {
          "size": 13422,
          "path": "04_validation/batches/batch_015_input.json"
        },
        "04_validation/batches/batch_016_input.json": {
          "size": 14072,
          "path": "04_validation/batches/batch_016_input.json"
        },
        "04_validation/candidate_context_bundles.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles.json"
        },
        "04_validation/candidate_context_bundles_selected.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles_selected.json"
        },
        "04_validation/environment_restore_plan.json": {
          "size": 2,
          "path": "04_validation/environment_restore_plan.json"
        },
        "04_validation/findings.json": {
          "size": 2,
          "path": "04_validation/findings.json"
        },
        "04_validation/skill_assignments/batch_001.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_001.json"
        },
        "04_validation/skill_assignments/batch_002.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_002.json"
        },
        "04_validation/skill_assignments/batch_003.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_003.json"
        },
        "04_validation/skill_assignments/batch_004.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_004.json"
        },
        "04_validation/skill_assignments.json": {
          "size": 25566,
          "path": "04_validation/skill_assignments.json"
        },
        "04_validation/streaming/static_queue.json": {
          "size": 45499,
          "path": "04_validation/streaming/static_queue.json"
        },
        "04_validation/streaming_validation_records.json": {
          "size": 243,
          "path": "04_validation/streaming_validation_records.json"
        },
        "04_validation/validation_adjudication.json": {
          "size": 273,
          "path": "04_validation/validation_adjudication.json"
        },
        "04_validation/validation_plan.json": {
          "size": 7981,
          "path": "04_validation/validation_plan.json"
        },
        "04_validation/validation_results.json": {
          "size": 2,
          "path": "04_validation/validation_results.json"
        },
        "debug/a3s/08_a3s_candidate_ranking_parsed_1789378839129.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_candidate_ranking_parsed_1789378839129.json"
        },
        "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789378822243.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789378822243.json"
        },
        "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789378822658.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789378822658.json"
        },
        "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789378826135.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789378826135.json"
        },
        "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789378827011.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789378827011.json"
        },
        "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789378830138.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789378830138.json"
        },
        "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789378831546.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789378831546.json"
        },
        "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789378834284.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789378834284.json"
        },
        "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789378835463.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789378835463.json"
        },
        "debug/a3s/08_a3s_discovery_plan_parsed_1789378817765.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discovery_plan_parsed_1789378817765.json"
        },
        "debug/a3s/08_a3s_environment_parsed_1789378795980.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_environment_parsed_1789378795980.json"
        },
        "debug/a3s/08_a3s_intel_parsed_1789378790337.json": {
          "size": 11393,
          "path": "debug/a3s/08_a3s_intel_parsed_1789378790337.json"
        },
        "debug/a3s/08_a3s_profile_parsed_1789378780924.json": {
          "size": 1639,
          "path": "debug/a3s/08_a3s_profile_parsed_1789378780924.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378805149.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378805149.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378808633.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378808633.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378811849.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378811849.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378814866.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378814866.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378847512.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378847512.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378849366.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378849366.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378850308.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378850308.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378851749.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378851749.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378853842.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378853842.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378855262.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378855262.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378856715.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378856715.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378858132.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378858132.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378859803.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378859803.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378860551.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378860551.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378861544.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378861544.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378862375.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378862375.json"
        },
        "debug/a3s/08_a3s_validation_plan_parsed_1789378842455.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validation_plan_parsed_1789378842455.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789378830345.jsonl": {
          "size": 80900,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789378830345.jsonl"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789378830345.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789378830345.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789378830345.txt": {
          "size": 73507,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789378830345.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789378830345.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789378830345.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789378830345.json": {
          "size": 236322,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789378830345.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_events_1789378814991.jsonl": {
          "size": 92932,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_events_1789378814991.jsonl"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_meta_1789378814991.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_meta_1789378814991.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789378814991.txt": {
          "size": 84496,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789378814991.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_response_1789378814991.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_response_1789378814991.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789378814991.json": {
          "size": 272418,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789378814991.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_events_1789378836057.jsonl": {
          "size": 192190,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_events_1789378836057.jsonl"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_meta_1789378836057.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_meta_1789378836057.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789378836057.txt": {
          "size": 177790,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789378836057.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_response_1789378836057.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_response_1789378836057.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789378836057.json": {
          "size": 570192,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789378836057.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789378818372.jsonl": {
          "size": 81407,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789378818372.jsonl"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789378818372.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789378818372.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789378818372.txt": {
          "size": 73984,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789378818372.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789378818372.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789378818372.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789378818372.json": {
          "size": 237843,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789378818372.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789378822970.jsonl": {
          "size": 81405,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789378822970.jsonl"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789378822970.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789378822970.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789378822970.txt": {
          "size": 73982,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789378822970.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789378822970.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789378822970.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789378822970.json": {
          "size": 237837,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789378822970.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_events_1789378787384.jsonl": {
          "size": 16516,
          "path": "debug/a3s/08_a3s_安全情报智能体_events_1789378787384.jsonl"
        },
        "debug/a3s/08_a3s_安全情报智能体_meta_1789378787384.json": {
          "size": 905,
          "path": "debug/a3s/08_a3s_安全情报智能体_meta_1789378787384.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_prompt_1789378787384.txt": {
          "size": 12854,
          "path": "debug/a3s/08_a3s_安全情报智能体_prompt_1789378787384.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_response_1789378787384.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全情报智能体_response_1789378787384.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_snapshot_1789378787384.json": {
          "size": 43170,
          "path": "debug/a3s/08_a3s_安全情报智能体_snapshot_1789378787384.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378802300.jsonl": {
          "size": 76940,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378802300.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378805435.jsonl": {
          "size": 77006,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378805435.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378808926.jsonl": {
          "size": 76887,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378808926.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378812127.jsonl": {
          "size": 76902,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378812127.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378843046.jsonl": {
          "size": 76468,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378843046.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378843307.jsonl": {
          "size": 76545,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378843307.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378843482.jsonl": {
          "size": 76531,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378843482.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378844398.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378844398.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378847720.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378847720.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378849556.jsonl": {
          "size": 76539,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378849556.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378850676.jsonl": {
          "size": 76580,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378850676.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378851995.jsonl": {
          "size": 76458,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378851995.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378854042.jsonl": {
          "size": 76543,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378854042.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378855475.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378855475.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378857007.jsonl": {
          "size": 76434,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378857007.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378858377.jsonl": {
          "size": 76678,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378858377.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378802300.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378802300.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378805435.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378805435.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378808926.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378808926.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378812127.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378812127.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378843046.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378843046.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378843307.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378843307.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378843482.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378843482.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378844398.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378844398.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378847720.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378847720.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378849556.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378849556.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378850676.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378850676.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378851995.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378851995.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378854042.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378854042.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378855475.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378855475.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378857007.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378857007.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378858377.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378858377.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378802300.txt": {
          "size": 69763,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378802300.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378805435.txt": {
          "size": 69807,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378805435.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378808926.txt": {
          "size": 69720,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378808926.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378812127.txt": {
          "size": 69744,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378812127.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843046.txt": {
          "size": 69332,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843046.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843307.txt": {
          "size": 69407,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843307.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843482.txt": {
          "size": 69357,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843482.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378844398.txt": {
          "size": 69343,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378844398.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378847720.txt": {
          "size": 69341,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378847720.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378849556.txt": {
          "size": 69371,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378849556.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378850676.txt": {
          "size": 69455,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378850676.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378851995.txt": {
          "size": 69340,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378851995.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378854042.txt": {
          "size": 69413,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378854042.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378855475.txt": {
          "size": 69386,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378855475.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378857007.txt": {
          "size": 69297,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378857007.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378858377.txt": {
          "size": 69511,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378858377.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378802300.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378802300.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378805435.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378805435.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378808926.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378808926.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378812127.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378812127.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378843046.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378843046.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378843307.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378843307.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378843482.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378843482.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378844398.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378844398.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378847720.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378847720.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378849556.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378849556.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378850676.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378850676.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378851995.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378851995.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378854042.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378854042.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378855475.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378855475.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378857007.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378857007.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378858377.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378858377.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378802300.json": {
          "size": 224442,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378802300.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378805435.json": {
          "size": 224640,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378805435.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378808926.json": {
          "size": 224283,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378808926.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378812127.json": {
          "size": 224328,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378812127.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843046.json": {
          "size": 223026,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843046.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843307.json": {
          "size": 223257,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843307.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843482.json": {
          "size": 223215,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843482.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378844398.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378844398.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378847720.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378847720.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378849556.json": {
          "size": 223239,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378849556.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378850676.json": {
          "size": 223362,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378850676.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378851995.json": {
          "size": 222996,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378851995.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378854042.json": {
          "size": 223251,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378854042.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378855475.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378855475.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378857007.json": {
          "size": 222924,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378857007.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378858377.json": {
          "size": 223656,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378858377.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789378827144.jsonl": {
          "size": 81402,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789378827144.jsonl"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789378827144.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789378827144.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789378827144.txt": {
          "size": 73979,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789378827144.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789378827144.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789378827144.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789378827144.json": {
          "size": 237828,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789378827144.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789378818465.jsonl": {
          "size": 81394,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789378818465.jsonl"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789378818465.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789378818465.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789378818465.txt": {
          "size": 73971,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789378818465.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789378818465.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789378818465.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789378818465.json": {
          "size": 237804,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789378818465.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_events_1789378793051.jsonl": {
          "size": 34007,
          "path": "debug/a3s/08_a3s_环境建立智能体_events_1789378793051.jsonl"
        },
        "debug/a3s/08_a3s_环境建立智能体_meta_1789378793051.json": {
          "size": 908,
          "path": "debug/a3s/08_a3s_环境建立智能体_meta_1789378793051.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_prompt_1789378793051.txt": {
          "size": 29683,
          "path": "debug/a3s/08_a3s_环境建立智能体_prompt_1789378793051.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_response_1789378793051.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_环境建立智能体_response_1789378793051.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_snapshot_1789378793051.json": {
          "size": 95643,
          "path": "debug/a3s/08_a3s_环境建立智能体_snapshot_1789378793051.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_events_1789378778013.jsonl": {
          "size": 18128,
          "path": "debug/a3s/08_a3s_目标画像智能体_events_1789378778013.jsonl"
        },
        "debug/a3s/08_a3s_目标画像智能体_meta_1789378778013.json": {
          "size": 906,
          "path": "debug/a3s/08_a3s_目标画像智能体_meta_1789378778013.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_prompt_1789378778013.txt": {
          "size": 14557,
          "path": "debug/a3s/08_a3s_目标画像智能体_prompt_1789378778013.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_response_1789378778013.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_目标画像智能体_response_1789378778013.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_snapshot_1789378778013.json": {
          "size": 48006,
          "path": "debug/a3s/08_a3s_目标画像智能体_snapshot_1789378778013.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789378822352.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789378822352.jsonl"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789378822352.json": {
          "size": 1019,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789378822352.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789378822352.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789378822352.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789378822352.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789378822352.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789378822352.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789378822352.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_events_1789378831694.jsonl": {
          "size": 81381,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_events_1789378831694.jsonl"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_meta_1789378831694.json": {
          "size": 947,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_meta_1789378831694.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789378831694.txt": {
          "size": 73958,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789378831694.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_response_1789378831694.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_response_1789378831694.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789378831694.json": {
          "size": 237765,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789378831694.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789378826318.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789378826318.jsonl"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789378826318.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789378826318.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789378826318.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789378826318.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789378826318.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789378826318.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789378826318.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789378826318.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_events_1789378839699.jsonl": {
          "size": 42622,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_events_1789378839699.jsonl"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_meta_1789378839699.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_meta_1789378839699.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789378839699.txt": {
          "size": 37107,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789378839699.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_response_1789378839699.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_response_1789378839699.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789378839699.json": {
          "size": 121488,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789378839699.json"
        },
        "debug/logs/a3s_interactions.jsonl": {
          "size": 2358983,
          "path": "debug/logs/a3s_interactions.jsonl"
        },
        "debug/logs/events.jsonl": {
          "size": 34861,
          "path": "debug/logs/events.jsonl"
        },
        "records/01_skill_assignments.json": {
          "size": 9785,
          "path": "records/01_skill_assignments.json"
        },
        "records/15_validation_skill_assignments.json": {
          "size": 25566,
          "path": "records/15_validation_skill_assignments.json"
        },
        "records/agent_pool_status.json": {
          "size": 17109,
          "path": "records/agent_pool_status.json"
        },
        "records/artifact_index.json": {
          "size": 26701,
          "path": "records/artifact_index.json"
        },
        "records/feedback_memory.json": {
          "size": 182,
          "path": "records/feedback_memory.json"
        },
        "records/process.md": {
          "size": 10708,
          "path": "records/process.md"
        },
        "records/run_status.json": {
          "size": 590,
          "path": "records/run_status.json"
        },
        "records/state.json": {
          "size": 371,
          "path": "records/state.json"
        },
        "SUMMARY.md": {
          "size": 1480,
          "path": "SUMMARY.md"
        }
      },
      "reportHref": "/api/output/src_20260914_173934_382488/SUMMARY.md"
    }
  ],
  "findings": [],
  "candidates": [
    {
      "id": "VULN-009",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/bert_toxic.py",
      "line": 13,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 13,
          "text": "model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-001",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
      "line": 321,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 321,
          "text": "exec(code, exec_globals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-002",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
      "line": 647,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 647,
          "text": "exec(tool_to_execute.tool_code, exec_globals, exec_locals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-003",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
      "line": 101,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 101,
          "text": "exec(self.tool_code, exec_globals, exec_locals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-004",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
      "line": 224,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 224,
          "text": "exec(self.tool_code, exec_globals, exec_locals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-005",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
      "line": 540,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 540,
          "text": "exec(evolved_code, env)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-006",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
      "line": 64,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 64,
          "text": "exec(ai_tool_code)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-007",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
      "line": 103,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 103,
          "text": "exec(roleplay_tool_code)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-008",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
      "line": 143,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 143,
          "text": "exec(strategy_tool_code)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-010",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
      "line": 100,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 100,
          "text": "self.model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-011",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
      "line": 169,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 169,
          "text": "steer_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-012",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
      "line": 288,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 288,
          "text": "self.hf_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-013",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/attack.py",
      "line": 203,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 203,
          "text": "self.hf_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-014",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
      "line": 64,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 64,
          "text": "self.hf_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-016",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/models/implementations/huggingface_model.py",
      "line": 86,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 86,
          "text": "self.model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-015",
      "project_id": "src_20260914_174801_197734",
      "suspected_severity": "medium",
      "suspected_category": "Crypto Weakness",
      "status": "probing",
      "title": "Weak hash algorithm appears in security-sensitive code.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
      "line": 154,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Weak hash algorithm appears in security-sensitive code.",
        "Weak hashes are unsuitable for passwords, signatures, and integrity checks."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 154,
          "text": "return hashlib.md5(content.encode()).hexdigest()[:8]",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-009",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/bert_toxic.py",
      "line": 13,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 13,
          "text": "model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-001",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
      "line": 321,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 321,
          "text": "exec(code, exec_globals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-002",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
      "line": 647,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 647,
          "text": "exec(tool_to_execute.tool_code, exec_globals, exec_locals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-003",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
      "line": 101,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 101,
          "text": "exec(self.tool_code, exec_globals, exec_locals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-004",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
      "line": 224,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 224,
          "text": "exec(self.tool_code, exec_globals, exec_locals)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-005",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
      "line": 540,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 540,
          "text": "exec(evolved_code, env)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-006",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
      "line": 64,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 64,
          "text": "exec(ai_tool_code)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-007",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
      "line": 103,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 103,
          "text": "exec(roleplay_tool_code)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-008",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
      "line": 143,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 143,
          "text": "exec(strategy_tool_code)",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-010",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
      "line": 100,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 100,
          "text": "self.model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-011",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
      "line": 169,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 169,
          "text": "steer_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-012",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
      "line": 288,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 288,
          "text": "self.hf_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-013",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/attack.py",
      "line": 203,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 203,
          "text": "self.hf_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-014",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
      "line": 64,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 64,
          "text": "self.hf_model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-016",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "critical",
      "suspected_category": "Code Injection",
      "status": "probing",
      "title": "Dynamic code execution API is used.",
      "file": "OpenRT-main/OpenRT/models/implementations/huggingface_model.py",
      "line": 86,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Dynamic code execution API is used.",
        "User-controlled expressions can execute arbitrary code."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 86,
          "text": "self.model.eval()",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    },
    {
      "id": "VULN-015",
      "project_id": "src_20260914_173934_382488",
      "suspected_severity": "medium",
      "suspected_category": "Crypto Weakness",
      "status": "probing",
      "title": "Weak hash algorithm appears in security-sensitive code.",
      "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
      "line": 154,
      "confidence": 0.7,
      "source": "static",
      "why_suspicious": [
        "Weak hash algorithm appears in security-sensitive code.",
        "Weak hashes are unsuitable for passwords, signatures, and integrity checks."
      ],
      "counter_evidence": [],
      "next_action": "等待 A3S 复核或人工确认。",
      "code_snippet": [
        {
          "ln": 154,
          "text": "return hashlib.md5(content.encode()).hexdigest()[:8]",
          "highlight": true
        }
      ],
      "rejection_reason": "",
      "validation_verdict": ""
    }
  ],
  "probes": [],
  "patches": [],
  "modelConfigs": [
    {
      "id": "mdl_20260914_163900_c66866",
      "name": "Deepseek",
      "base_url": "https://ark.cn-beijing.volces.com/api/v3",
      "model": "deepseek-v4-flash-260425",
      "created_at": 1789375140.4256535,
      "updated_at": 1789375143.2273788,
      "last_test_status": "passed",
      "last_test_message": "OpenAI 兼容 chat/completions 测试通过",
      "last_test_at": 1789375143.2273788,
      "has_api_key": true,
      "masked_api_key": "ark-...f030"
    },
    {
      "id": "mdl_20260914_163830_23147e",
      "name": "deepseek",
      "base_url": "https://ark.cn-beijing.volces.com/api/v3/chat",
      "model": "deepseek-v4-flash-260425",
      "created_at": 1789375110.5384257,
      "updated_at": 1789375123.187107,
      "last_test_status": "failed",
      "last_test_message": "HTTP 404: {\"error\":{\"code\":\"InvalidAction\",\"message\":\"The specified action is invalid: /api/v3/chat/chat/completions Request id: 0217893751231103f04613060c95c0e1cb70b4f628471a9971626\",\"param\":\"\",\"type\":\"NotFound\"}}",
      "last_test_at": 1789375123.187107,
      "has_api_key": true,
      "masked_api_key": "ark-...f030"
    }
  ],
  "trashItems": [
    {
      "kind": "project",
      "id": "prj_20260914_172844_6402c4",
      "name": "OpenRT源代码测试",
      "description": "111",
      "deleted_at": 1789626873.1862993,
      "job_count": 0
    },
    {
      "kind": "project",
      "id": "prj_20260914_173107_f36586",
      "name": "OpenRT源代码测试",
      "description": "",
      "deleted_at": 1789626806.6872175,
      "job_count": 1
    },
    {
      "kind": "project",
      "id": "prj_20260914_174623_d80ec7",
      "name": "很重要的测试",
      "description": "",
      "deleted_at": 1789379236.2203724,
      "job_count": 1
    },
    {
      "kind": "project",
      "id": "prj_20260914_164117_afc19a",
      "name": "OpenRT项目测试",
      "description": "OpenRT源代码测试，使用ds作为judge",
      "deleted_at": 1789378219.8880546,
      "job_count": 1
    }
  ],
  "artifactsByJob": {
    "src_20260914_174801_197734": {
      "files": {
        "00_profile_intel/agent_tool_capabilities.json": {
          "size": 8768,
          "path": "00_profile_intel/agent_tool_capabilities.json"
        },
        "00_profile_intel/attention_map.json": {
          "size": 182572,
          "path": "00_profile_intel/attention_map.json"
        },
        "00_profile_intel/intel_cache/20260914_174732_2c360f__online_v2_vuln_intel.json": {
          "size": 2,
          "path": "00_profile_intel/intel_cache/20260914_174732_2c360f__online_v2_vuln_intel.json"
        },
        "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json": {
          "size": 10590,
          "path": "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json"
        },
        "00_profile_intel/profile_summary.json": {
          "size": 1639,
          "path": "00_profile_intel/profile_summary.json"
        },
        "00_profile_intel/project_profile.json": {
          "size": 39111,
          "path": "00_profile_intel/project_profile.json"
        },
        "00_profile_intel/raw_intel.json": {
          "size": 11010,
          "path": "00_profile_intel/raw_intel.json"
        },
        "00_profile_intel/raw_intel_queries.json": {
          "size": 42,
          "path": "00_profile_intel/raw_intel_queries.json"
        },
        "00_profile_intel/raw_intel_query_plan.json": {
          "size": 343,
          "path": "00_profile_intel/raw_intel_query_plan.json"
        },
        "00_profile_intel/top_attention_items.json": {
          "size": 155612,
          "path": "00_profile_intel/top_attention_items.json"
        },
        "00_profile_intel/vulnerability_intel.json": {
          "size": 11393,
          "path": "00_profile_intel/vulnerability_intel.json"
        },
        "01_environment/artifacts/container/build.log": {
          "size": 757,
          "path": "01_environment/artifacts/container/build.log"
        },
        "01_environment/artifacts/container/Dockerfile": {
          "size": 1021,
          "path": "01_environment/artifacts/container/Dockerfile"
        },
        "01_environment/artifacts/container/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/container/scripts/check_container.sh"
        },
        "01_environment/artifacts/container/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/container/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/container/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/container/scripts/provision_runtime.sh"
        },
        "01_environment/artifacts/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/scripts/check_container.sh"
        },
        "01_environment/artifacts/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/scripts/provision_runtime.sh"
        },
        "01_environment/container_artifacts.json": {
          "size": 2690,
          "path": "01_environment/container_artifacts.json"
        },
        "01_environment/directory_snapshot.json": {
          "size": 6125,
          "path": "01_environment/directory_snapshot.json"
        },
        "01_environment/environment.json": {
          "size": 20790,
          "path": "01_environment/environment.json"
        },
        "01_environment/environment_plan.json": {
          "size": 20790,
          "path": "01_environment/environment_plan.json"
        },
        "01_environment/local_environment_probe.json": {
          "size": 11329,
          "path": "01_environment/local_environment_probe.json"
        },
        "02_candidate_discovery/agent_candidates.json": {
          "size": 2,
          "path": "02_candidate_discovery/agent_candidates.json"
        },
        "02_candidate_discovery/discovery_plan.json": {
          "size": 838,
          "path": "02_candidate_discovery/discovery_plan.json"
        },
        "02_candidate_discovery/discovery_tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/discovery_tasks.json"
        },
        "02_candidate_discovery/merged_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/merged_candidates.json"
        },
        "02_candidate_discovery/skill_assignments.json": {
          "size": 9785,
          "path": "02_candidate_discovery/skill_assignments.json"
        },
        "02_candidate_discovery/static_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates.json"
        },
        "02_candidate_discovery/static_candidates_filtered.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates_filtered.json"
        },
        "02_candidate_discovery/tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/tasks.json"
        },
        "03_candidate_ranking/candidate_ranking.json": {
          "size": 2,
          "path": "03_candidate_ranking/candidate_ranking.json"
        },
        "03_candidate_ranking/remaining_validation_queue.json": {
          "size": 7995,
          "path": "03_candidate_ranking/remaining_validation_queue.json"
        },
        "03_candidate_ranking/selected_validation_queue.json": {
          "size": 10726,
          "path": "03_candidate_ranking/selected_validation_queue.json"
        },
        "04_validation/batches/batch_001_input.json": {
          "size": 13098,
          "path": "04_validation/batches/batch_001_input.json"
        },
        "04_validation/batches/batch_002_input.json": {
          "size": 14461,
          "path": "04_validation/batches/batch_002_input.json"
        },
        "04_validation/batches/batch_003_input.json": {
          "size": 13864,
          "path": "04_validation/batches/batch_003_input.json"
        },
        "04_validation/batches/batch_004_input.json": {
          "size": 14354,
          "path": "04_validation/batches/batch_004_input.json"
        },
        "04_validation/batches/batch_005_input.json": {
          "size": 11627,
          "path": "04_validation/batches/batch_005_input.json"
        },
        "04_validation/batches/batch_006_input.json": {
          "size": 13690,
          "path": "04_validation/batches/batch_006_input.json"
        },
        "04_validation/batches/batch_007_input.json": {
          "size": 11502,
          "path": "04_validation/batches/batch_007_input.json"
        },
        "04_validation/batches/batch_008_input.json": {
          "size": 11930,
          "path": "04_validation/batches/batch_008_input.json"
        },
        "04_validation/batches/batch_009_input.json": {
          "size": 10414,
          "path": "04_validation/batches/batch_009_input.json"
        },
        "04_validation/batches/batch_010_input.json": {
          "size": 12873,
          "path": "04_validation/batches/batch_010_input.json"
        },
        "04_validation/batches/batch_011_input.json": {
          "size": 14548,
          "path": "04_validation/batches/batch_011_input.json"
        },
        "04_validation/batches/batch_012_input.json": {
          "size": 14345,
          "path": "04_validation/batches/batch_012_input.json"
        },
        "04_validation/batches/batch_013_input.json": {
          "size": 12752,
          "path": "04_validation/batches/batch_013_input.json"
        },
        "04_validation/batches/batch_014_input.json": {
          "size": 12427,
          "path": "04_validation/batches/batch_014_input.json"
        },
        "04_validation/batches/batch_015_input.json": {
          "size": 13422,
          "path": "04_validation/batches/batch_015_input.json"
        },
        "04_validation/batches/batch_016_input.json": {
          "size": 14072,
          "path": "04_validation/batches/batch_016_input.json"
        },
        "04_validation/candidate_context_bundles.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles.json"
        },
        "04_validation/candidate_context_bundles_selected.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles_selected.json"
        },
        "04_validation/environment_restore_plan.json": {
          "size": 2,
          "path": "04_validation/environment_restore_plan.json"
        },
        "04_validation/findings.json": {
          "size": 2,
          "path": "04_validation/findings.json"
        },
        "04_validation/skill_assignments/batch_001.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_001.json"
        },
        "04_validation/skill_assignments/batch_002.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_002.json"
        },
        "04_validation/skill_assignments/batch_003.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_003.json"
        },
        "04_validation/skill_assignments/batch_004.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_004.json"
        },
        "04_validation/skill_assignments.json": {
          "size": 25566,
          "path": "04_validation/skill_assignments.json"
        },
        "04_validation/streaming/static_queue.json": {
          "size": 45499,
          "path": "04_validation/streaming/static_queue.json"
        },
        "04_validation/streaming_validation_records.json": {
          "size": 243,
          "path": "04_validation/streaming_validation_records.json"
        },
        "04_validation/validation_adjudication.json": {
          "size": 273,
          "path": "04_validation/validation_adjudication.json"
        },
        "04_validation/validation_plan.json": {
          "size": 7981,
          "path": "04_validation/validation_plan.json"
        },
        "04_validation/validation_results.json": {
          "size": 2,
          "path": "04_validation/validation_results.json"
        },
        "05_remediation/patches.json": {
          "size": 2,
          "path": "05_remediation/patches.json"
        },
        "05_remediation/remediation_plan.json": {
          "size": 241,
          "path": "05_remediation/remediation_plan.json"
        },
        "05_remediation/remediation_review.json": {
          "size": 218,
          "path": "05_remediation/remediation_review.json"
        },
        "06_report/report.md": {
          "size": 478,
          "path": "06_report/report.md"
        },
        "06_report/summary.json": {
          "size": 41979,
          "path": "06_report/summary.json"
        },
        "debug/a3s/08_a3s_candidate_ranking_parsed_1789379384306.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_candidate_ranking_parsed_1789379384306.json"
        },
        "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789379365418.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789379365418.json"
        },
        "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789379366265.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789379366265.json"
        },
        "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789379369675.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789379369675.json"
        },
        "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789379370414.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789379370414.json"
        },
        "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789379373677.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789379373677.json"
        },
        "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789379374848.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789379374848.json"
        },
        "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789379377308.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789379377308.json"
        },
        "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789379379379.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789379379379.json"
        },
        "debug/a3s/08_a3s_discovery_plan_parsed_1789379359734.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discovery_plan_parsed_1789379359734.json"
        },
        "debug/a3s/08_a3s_environment_parsed_1789379303109.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_environment_parsed_1789379303109.json"
        },
        "debug/a3s/08_a3s_intel_parsed_1789379296433.json": {
          "size": 11393,
          "path": "debug/a3s/08_a3s_intel_parsed_1789379296433.json"
        },
        "debug/a3s/08_a3s_profile_parsed_1789379287867.json": {
          "size": 1639,
          "path": "debug/a3s/08_a3s_profile_parsed_1789379287867.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379322799.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379322799.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379339562.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379339562.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379347825.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379347825.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379352478.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379352478.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379396437.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379396437.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379397276.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379397276.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379398113.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379398113.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379398933.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379398933.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379401742.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379401742.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379402733.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379402733.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379403705.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379403705.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379404724.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379404724.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379406683.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379406683.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379407477.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379407477.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379408812.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379408812.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789379410006.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789379410006.json"
        },
        "debug/a3s/08_a3s_validation_plan_parsed_1789379389471.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validation_plan_parsed_1789379389471.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789379373786.jsonl": {
          "size": 80900,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789379373786.jsonl"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789379373786.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789379373786.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789379373786.txt": {
          "size": 73507,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789379373786.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789379373786.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789379373786.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789379373786.json": {
          "size": 236322,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789379373786.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_events_1789379352647.jsonl": {
          "size": 92932,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_events_1789379352647.jsonl"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_meta_1789379352647.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_meta_1789379352647.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789379352647.txt": {
          "size": 84496,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789379352647.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_response_1789379352647.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_response_1789379352647.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789379352647.json": {
          "size": 272418,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789379352647.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_events_1789379379925.jsonl": {
          "size": 192190,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_events_1789379379925.jsonl"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_meta_1789379379925.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_meta_1789379379925.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789379379925.txt": {
          "size": 177790,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789379379925.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_response_1789379379925.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_response_1789379379925.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789379379925.json": {
          "size": 570192,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789379379925.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789379360512.jsonl": {
          "size": 81407,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789379360512.jsonl"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789379360512.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789379360512.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789379360512.txt": {
          "size": 73984,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789379360512.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789379360512.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789379360512.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789379360512.json": {
          "size": 237843,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789379360512.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789379366386.jsonl": {
          "size": 81405,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789379366386.jsonl"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789379366386.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789379366386.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789379366386.txt": {
          "size": 73982,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789379366386.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789379366386.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789379366386.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789379366386.json": {
          "size": 237837,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789379366386.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_events_1789379293241.jsonl": {
          "size": 16516,
          "path": "debug/a3s/08_a3s_安全情报智能体_events_1789379293241.jsonl"
        },
        "debug/a3s/08_a3s_安全情报智能体_meta_1789379293241.json": {
          "size": 905,
          "path": "debug/a3s/08_a3s_安全情报智能体_meta_1789379293241.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_prompt_1789379293241.txt": {
          "size": 12854,
          "path": "debug/a3s/08_a3s_安全情报智能体_prompt_1789379293241.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_response_1789379293241.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全情报智能体_response_1789379293241.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_snapshot_1789379293241.json": {
          "size": 43170,
          "path": "debug/a3s/08_a3s_安全情报智能体_snapshot_1789379293241.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379309565.jsonl": {
          "size": 76940,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379309565.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379323159.jsonl": {
          "size": 77006,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379323159.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379340111.jsonl": {
          "size": 76887,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379340111.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379348188.jsonl": {
          "size": 76902,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379348188.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379390139.jsonl": {
          "size": 76468,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379390139.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379390575.jsonl": {
          "size": 76545,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379390575.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379391214.jsonl": {
          "size": 76531,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379391214.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379391811.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379391811.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379396608.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379396608.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379397691.jsonl": {
          "size": 76539,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379397691.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379398489.jsonl": {
          "size": 76580,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379398489.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379399389.jsonl": {
          "size": 76458,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379399389.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379401871.jsonl": {
          "size": 76543,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379401871.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379402856.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379402856.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379403924.jsonl": {
          "size": 76434,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379403924.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789379405084.jsonl": {
          "size": 76678,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789379405084.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379309565.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379309565.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379323159.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379323159.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379340111.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379340111.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379348188.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379348188.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379390139.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379390139.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379390575.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379390575.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379391214.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379391214.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379391811.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379391811.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379396608.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379396608.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379397691.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379397691.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379398489.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379398489.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379399389.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379399389.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379401871.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379401871.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379402856.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379402856.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379403924.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379403924.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789379405084.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789379405084.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379309565.txt": {
          "size": 69763,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379309565.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379323159.txt": {
          "size": 69807,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379323159.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379340111.txt": {
          "size": 69720,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379340111.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379348188.txt": {
          "size": 69744,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379348188.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390139.txt": {
          "size": 69332,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390139.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390575.txt": {
          "size": 69407,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379390575.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391214.txt": {
          "size": 69357,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391214.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391811.txt": {
          "size": 69343,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379391811.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379396608.txt": {
          "size": 69341,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379396608.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379397691.txt": {
          "size": 69371,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379397691.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379398489.txt": {
          "size": 69455,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379398489.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379399389.txt": {
          "size": 69340,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379399389.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379401871.txt": {
          "size": 69413,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379401871.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379402856.txt": {
          "size": 69386,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379402856.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379403924.txt": {
          "size": 69297,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379403924.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789379405084.txt": {
          "size": 69511,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789379405084.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379309565.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379309565.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379323159.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379323159.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379340111.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379340111.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379348188.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379348188.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379390139.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379390139.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379390575.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379390575.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379391214.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379391214.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379391811.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379391811.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379396608.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379396608.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379397691.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379397691.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379398489.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379398489.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379399389.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379399389.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379401871.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379401871.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379402856.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379402856.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379403924.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379403924.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789379405084.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789379405084.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379309565.json": {
          "size": 224442,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379309565.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379323159.json": {
          "size": 224640,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379323159.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379340111.json": {
          "size": 224283,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379340111.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379348188.json": {
          "size": 224328,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379348188.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390139.json": {
          "size": 223026,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390139.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390575.json": {
          "size": 223257,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379390575.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391214.json": {
          "size": 223215,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391214.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391811.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379391811.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379396608.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379396608.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379397691.json": {
          "size": 223239,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379397691.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379398489.json": {
          "size": 223362,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379398489.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379399389.json": {
          "size": 222996,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379399389.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379401871.json": {
          "size": 223251,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379401871.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379402856.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379402856.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379403924.json": {
          "size": 222924,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379403924.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379405084.json": {
          "size": 223656,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789379405084.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789379370513.jsonl": {
          "size": 81402,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789379370513.jsonl"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789379370513.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789379370513.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789379370513.txt": {
          "size": 73979,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789379370513.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789379370513.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789379370513.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789379370513.json": {
          "size": 237828,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789379370513.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789379360617.jsonl": {
          "size": 81394,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789379360617.jsonl"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789379360617.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789379360617.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789379360617.txt": {
          "size": 73971,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789379360617.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789379360617.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789379360617.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789379360617.json": {
          "size": 237804,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789379360617.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_events_1789379299729.jsonl": {
          "size": 34007,
          "path": "debug/a3s/08_a3s_环境建立智能体_events_1789379299729.jsonl"
        },
        "debug/a3s/08_a3s_环境建立智能体_meta_1789379299729.json": {
          "size": 908,
          "path": "debug/a3s/08_a3s_环境建立智能体_meta_1789379299729.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_prompt_1789379299729.txt": {
          "size": 29683,
          "path": "debug/a3s/08_a3s_环境建立智能体_prompt_1789379299729.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_response_1789379299729.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_环境建立智能体_response_1789379299729.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_snapshot_1789379299729.json": {
          "size": 95643,
          "path": "debug/a3s/08_a3s_环境建立智能体_snapshot_1789379299729.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_events_1789379284979.jsonl": {
          "size": 18128,
          "path": "debug/a3s/08_a3s_目标画像智能体_events_1789379284979.jsonl"
        },
        "debug/a3s/08_a3s_目标画像智能体_meta_1789379284979.json": {
          "size": 906,
          "path": "debug/a3s/08_a3s_目标画像智能体_meta_1789379284979.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_prompt_1789379284979.txt": {
          "size": 14557,
          "path": "debug/a3s/08_a3s_目标画像智能体_prompt_1789379284979.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_response_1789379284979.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_目标画像智能体_response_1789379284979.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_snapshot_1789379284979.json": {
          "size": 48006,
          "path": "debug/a3s/08_a3s_目标画像智能体_snapshot_1789379284979.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789379365592.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789379365592.jsonl"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789379365592.json": {
          "size": 1019,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789379365592.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789379365592.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789379365592.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789379365592.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789379365592.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789379365592.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789379365592.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_events_1789379374960.jsonl": {
          "size": 81381,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_events_1789379374960.jsonl"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_meta_1789379374960.json": {
          "size": 947,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_meta_1789379374960.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789379374960.txt": {
          "size": 73958,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789379374960.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_response_1789379374960.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_response_1789379374960.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789379374960.json": {
          "size": 237765,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789379374960.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789379369783.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789379369783.jsonl"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789379369783.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789379369783.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789379369783.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789379369783.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789379369783.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789379369783.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789379369783.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789379369783.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_events_1789379385143.jsonl": {
          "size": 42622,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_events_1789379385143.jsonl"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_meta_1789379385143.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_meta_1789379385143.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789379385143.txt": {
          "size": 37107,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789379385143.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_response_1789379385143.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_response_1789379385143.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789379385143.json": {
          "size": 121488,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789379385143.json"
        },
        "debug/logs/a3s_interactions.jsonl": {
          "size": 2358983,
          "path": "debug/logs/a3s_interactions.jsonl"
        },
        "debug/logs/events.jsonl": {
          "size": 38017,
          "path": "debug/logs/events.jsonl"
        },
        "records/01_skill_assignments.json": {
          "size": 9785,
          "path": "records/01_skill_assignments.json"
        },
        "records/15_validation_skill_assignments.json": {
          "size": 25566,
          "path": "records/15_validation_skill_assignments.json"
        },
        "records/agent_pool_status.json": {
          "size": 17109,
          "path": "records/agent_pool_status.json"
        },
        "records/artifact_index.json": {
          "size": 27124,
          "path": "records/artifact_index.json"
        },
        "records/feedback_memory.json": {
          "size": 182,
          "path": "records/feedback_memory.json"
        },
        "records/process.md": {
          "size": 10935,
          "path": "records/process.md"
        },
        "records/run_status.json": {
          "size": 587,
          "path": "records/run_status.json"
        },
        "records/state.json": {
          "size": 420,
          "path": "records/state.json"
        },
        "SUMMARY.md": {
          "size": 1735,
          "path": "SUMMARY.md"
        }
      },
      "agent_activity": {
        "source": "agent_pool",
        "groups": {
          "discovery": {
            "label": "发现漏洞",
            "running": 0,
            "completed": 8,
            "failed": 0,
            "stale": 0
          },
          "validation": {
            "label": "验证漏洞",
            "running": 0,
            "completed": 13,
            "failed": 0,
            "stale": 0
          },
          "environment": {
            "label": "环境",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "profile": {
            "label": "画像/情报",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "ranking": {
            "label": "排序",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "remediation": {
            "label": "修复",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "other": {
            "label": "其他",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          }
        },
        "agents": [
          {
            "label": "漏洞验证-batch-016",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:50:05",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-015"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-015",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:50:03",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-016"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-014",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:50:02",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-014"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-013",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:50:01",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-013"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-012",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:49:59",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-012"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-011",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:49:58",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-011"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-010",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:49:57",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-010"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-009",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:49:56",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-008"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-008",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 8,
            "started_at": "2026-09-14T17:49:51",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-007"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-007",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 8,
            "started_at": "2026-09-14T17:49:50",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-006"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-006",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 7,
            "started_at": "2026-09-14T17:49:50",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-005"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-005",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 6,
            "started_at": "2026-09-14T17:49:50",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-009"
              ],
              "serial": false
            }
          },
          {
            "label": "通用候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:49:34",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-08-general-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "general"
            }
          },
          {
            "label": "低关注面候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:49:33",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-07-underexplored-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/models/implementations/mock_model.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py"
              ],
              "specialty": "underexplored"
            }
          },
          {
            "label": "并发资源候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:49:30",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-06-resource-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "resource"
            }
          },
          {
            "label": "配置密钥候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:49:29",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-05-config-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "configuration"
            }
          },
          {
            "label": "动态输入候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:49:26",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-04-injection-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "injection"
            }
          },
          {
            "label": "解析器序列化候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:49:25",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-03-parser-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "parser"
            }
          },
          {
            "label": "权限认证候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 6,
            "started_at": "2026-09-14T17:49:20",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-02-authz-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "authorization"
            }
          },
          {
            "label": "内存安全候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:49:20",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-01-memory-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "memory_safety"
            }
          }
        ],
        "running_total": 0,
        "completed_total": 21,
        "failed_total": 0,
        "stale_total": 0,
        "capacity": 4,
        "min_workers": 2,
        "updated_at": "2026-09-14T17:50:10"
      },
      "agent_pool_status": {
        "max_workers": 4,
        "min_workers": 2,
        "running_total": 0,
        "by_stage": {
          "validation": {
            "running": 0,
            "completed": 13,
            "failed": 0
          },
          "discovery": {
            "running": 0,
            "completed": 8,
            "failed": 0
          }
        },
        "active": [],
        "recent": [
          {
            "id": "agent-0021",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-016",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-015"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:50:05",
            "updated_at": "2026-09-14T17:50:10",
            "ended_at": "2026-09-14T17:50:10",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0020",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-015",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-016"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:50:03",
            "updated_at": "2026-09-14T17:50:08",
            "ended_at": "2026-09-14T17:50:08",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0019",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-014",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-014"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:50:02",
            "updated_at": "2026-09-14T17:50:07",
            "ended_at": "2026-09-14T17:50:07",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0018",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-013",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-013"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:50:01",
            "updated_at": "2026-09-14T17:50:06",
            "ended_at": "2026-09-14T17:50:06",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0017",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-012",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-012"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:59",
            "updated_at": "2026-09-14T17:50:04",
            "ended_at": "2026-09-14T17:50:04",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0016",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-011",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-011"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:58",
            "updated_at": "2026-09-14T17:50:03",
            "ended_at": "2026-09-14T17:50:03",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0015",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-010",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-010"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:57",
            "updated_at": "2026-09-14T17:50:02",
            "ended_at": "2026-09-14T17:50:02",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0014",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-009",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-008"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:56",
            "updated_at": "2026-09-14T17:50:01",
            "ended_at": "2026-09-14T17:50:01",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0013",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-008",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-007"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:51",
            "updated_at": "2026-09-14T17:49:59",
            "ended_at": "2026-09-14T17:49:59",
            "elapsed_seconds": 8
          },
          {
            "id": "agent-0012",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-007",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-006"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:50",
            "updated_at": "2026-09-14T17:49:58",
            "ended_at": "2026-09-14T17:49:58",
            "elapsed_seconds": 8
          },
          {
            "id": "agent-0011",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-006",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-005"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:50",
            "updated_at": "2026-09-14T17:49:57",
            "ended_at": "2026-09-14T17:49:57",
            "elapsed_seconds": 7
          },
          {
            "id": "agent-0010",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-005",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-009"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:49:50",
            "updated_at": "2026-09-14T17:49:56",
            "ended_at": "2026-09-14T17:49:56",
            "elapsed_seconds": 6
          },
          {
            "id": "agent-0009",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "通用候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-08-general-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "general"
            },
            "started_at": "2026-09-14T17:49:34",
            "updated_at": "2026-09-14T17:49:39",
            "ended_at": "2026-09-14T17:49:39",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0008",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "低关注面候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-07-underexplored-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/models/implementations/mock_model.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py"
              ],
              "specialty": "underexplored"
            },
            "started_at": "2026-09-14T17:49:33",
            "updated_at": "2026-09-14T17:49:37",
            "ended_at": "2026-09-14T17:49:37",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0007",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "并发资源候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-06-resource-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "resource"
            },
            "started_at": "2026-09-14T17:49:30",
            "updated_at": "2026-09-14T17:49:34",
            "ended_at": "2026-09-14T17:49:34",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0006",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "配置密钥候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-05-config-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "configuration"
            },
            "started_at": "2026-09-14T17:49:29",
            "updated_at": "2026-09-14T17:49:33",
            "ended_at": "2026-09-14T17:49:33",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0005",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "动态输入候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-04-injection-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "injection"
            },
            "started_at": "2026-09-14T17:49:26",
            "updated_at": "2026-09-14T17:49:30",
            "ended_at": "2026-09-14T17:49:30",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0004",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "解析器序列化候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-03-parser-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "parser"
            },
            "started_at": "2026-09-14T17:49:25",
            "updated_at": "2026-09-14T17:49:29",
            "ended_at": "2026-09-14T17:49:29",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0003",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "权限认证候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-02-authz-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "authorization"
            },
            "started_at": "2026-09-14T17:49:20",
            "updated_at": "2026-09-14T17:49:26",
            "ended_at": "2026-09-14T17:49:26",
            "elapsed_seconds": 6
          },
          {
            "id": "agent-0002",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "内存安全候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-01-memory-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "memory_safety"
            },
            "started_at": "2026-09-14T17:49:20",
            "updated_at": "2026-09-14T17:49:25",
            "ended_at": "2026-09-14T17:49:25",
            "elapsed_seconds": 5
          }
        ],
        "updated_at": "2026-09-14T17:50:10"
      },
      "run_status": {
        "task_id": "src_20260914_174801_197734",
        "status": "succeeded",
        "stage": "report",
        "message": "流水线完成",
        "error": "",
        "phase": "agent-detect",
        "pid": 26156,
        "updated_at": "2026-09-14T17:50:13",
        "output_dir": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_174801_197734",
        "target": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_174732_2c360f\\src"
      },
      "state": {
        "task_id": "src_20260914_174801_197734",
        "started_at": "2026-09-14T09:48:04.240125+00:00",
        "phases": {
          "profile": "完成",
          "intel": "完成",
          "environment": "完成",
          "candidate_ranking": "进入验证队列 16 个候选，流式已验证 4 个",
          "validation": "已确认 0 个漏洞",
          "analysis": "已确认 0 个漏洞",
          "patch": "跳过",
          "report": "完成"
        }
      },
      "summary": {
        "project": {
          "root": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_174732_2c360f\\src",
          "name": "20260914_174732_2c360f",
          "files": [
            {
              "path": "OpenRT-main/eval.py",
              "language": "python",
              "size": 28429,
              "lines": 715
            },
            {
              "path": "OpenRT-main/eval_async.py",
              "language": "python",
              "size": 20584,
              "lines": 536
            },
            {
              "path": "OpenRT-main/example/actor_attack_example.py",
              "language": "python",
              "size": 6153,
              "lines": 153
            },
            {
              "path": "OpenRT-main/example/adaptive_attack_example.py",
              "language": "python",
              "size": 8599,
              "lines": 263
            },
            {
              "path": "OpenRT-main/example/air_attack_example.py",
              "language": "python",
              "size": 5112,
              "lines": 147
            },
            {
              "path": "OpenRT-main/example/artprompt_attack_example.py",
              "language": "python",
              "size": 11308,
              "lines": 331
            },
            {
              "path": "OpenRT-main/example/asa_example.py",
              "language": "python",
              "size": 2548,
              "lines": 80
            },
            {
              "path": "OpenRT-main/example/autodan_attack_example_2024.py",
              "language": "python",
              "size": 3350,
              "lines": 104
            },
            {
              "path": "OpenRT-main/example/autodan_turbo_example.py",
              "language": "python",
              "size": 3974,
              "lines": 121
            },
            {
              "path": "OpenRT-main/example/autodan_turbo_r_example.py",
              "language": "python",
              "size": 9980,
              "lines": 221
            },
            {
              "path": "OpenRT-main/example/cipherchat_attack_example_2024.py",
              "language": "python",
              "size": 3674,
              "lines": 95
            },
            {
              "path": "OpenRT-main/example/coa_attack_example.py",
              "language": "python",
              "size": 3341,
              "lines": 102
            },
            {
              "path": "OpenRT-main/example/code_attack_example.py",
              "language": "python",
              "size": 2821,
              "lines": 87
            },
            {
              "path": "OpenRT-main/example/crescendo_attack_example.py",
              "language": "python",
              "size": 8118,
              "lines": 180
            },
            {
              "path": "OpenRT-main/example/csdj_attack_example.py",
              "language": "python",
              "size": 3474,
              "lines": 100
            },
            {
              "path": "OpenRT-main/example/deepinception_attack_example_2024.py",
              "language": "python",
              "size": 3052,
              "lines": 92
            },
            {
              "path": "OpenRT-main/example/drattack_example.py",
              "language": "python",
              "size": 3243,
              "lines": 100
            },
            {
              "path": "OpenRT-main/example/evosynth_example.py",
              "language": "python",
              "size": 2225,
              "lines": 70
            },
            {
              "path": "OpenRT-main/example/figstep_attack_example.py",
              "language": "python",
              "size": 4643,
              "lines": 126
            },
            {
              "path": "OpenRT-main/example/flipattack_example.py",
              "language": "python",
              "size": 2791,
              "lines": 88
            },
            {
              "path": "OpenRT-main/example/gptfuzzer_attack_example_2023.py",
              "language": "python",
              "size": 4207,
              "lines": 114
            },
            {
              "path": "OpenRT-main/example/hades_attack_example.py",
              "language": "python",
              "size": 6695,
              "lines": 181
            },
            {
              "path": "OpenRT-main/example/himrd_attack_example.py",
              "language": "python",
              "size": 3840,
              "lines": 127
            },
            {
              "path": "OpenRT-main/example/ica_attack_example_2023.py",
              "language": "python",
              "size": 3911,
              "lines": 101
            },
            {
              "path": "OpenRT-main/example/ideator_attack_example.py",
              "language": "python",
              "size": 4337,
              "lines": 119
            },
            {
              "path": "OpenRT-main/example/imperceptible_jailbreak_example.py",
              "language": "python",
              "size": 3582,
              "lines": 106
            },
            {
              "path": "OpenRT-main/example/jailbroken_attack_example_2023.py",
              "language": "python",
              "size": 3281,
              "lines": 93
            },
            {
              "path": "OpenRT-main/example/jam_attack_example.py",
              "language": "python",
              "size": 3768,
              "lines": 109
            },
            {
              "path": "OpenRT-main/example/jood_attack_example.py",
              "language": "python",
              "size": 4555,
              "lines": 136
            },
            {
              "path": "OpenRT-main/example/jsonl_dataset_examply.py",
              "language": "python",
              "size": 10240,
              "lines": 274
            },
            {
              "path": "OpenRT-main/example/mml_attack_example.py",
              "language": "python",
              "size": 7380,
              "lines": 195
            },
            {
              "path": "OpenRT-main/example/mousetrap_example.py",
              "language": "python",
              "size": 3007,
              "lines": 93
            },
            {
              "path": "OpenRT-main/example/multilingual_attack_example_2024.py",
              "language": "python",
              "size": 2685,
              "lines": 75
            },
            {
              "path": "OpenRT-main/example/nanogcg_attack_example.py",
              "language": "python",
              "size": 6026,
              "lines": 181
            },
            {
              "path": "OpenRT-main/example/pair_attack_example_2024.py",
              "language": "python",
              "size": 3411,
              "lines": 96
            },
            {
              "path": "OpenRT-main/example/past_tense_attack_example.py",
              "language": "python",
              "size": 6487,
              "lines": 198
            },
            {
              "path": "OpenRT-main/example/prefill_attack.py",
              "language": "python",
              "size": 2485,
              "lines": 79
            },
            {
              "path": "OpenRT-main/example/query_relevant_attack_example.py",
              "language": "python",
              "size": 6216,
              "lines": 160
            },
            {
              "path": "OpenRT-main/example/race_attack_example.py",
              "language": "python",
              "size": 3509,
              "lines": 105
            },
            {
              "path": "OpenRT-main/example/rainbow_teaming_attack_example.py",
              "language": "python",
              "size": 5843,
              "lines": 153
            },
            {
              "path": "OpenRT-main/example/redqueen_attack_example.py",
              "language": "python",
              "size": 5654,
              "lines": 135
            },
            {
              "path": "OpenRT-main/example/renellm_attack_example.py",
              "language": "python",
              "size": 6137,
              "lines": 197
            },
            {
              "path": "OpenRT-main/example/response_attack_example.py",
              "language": "python",
              "size": 7371,
              "lines": 215
            },
            {
              "path": "OpenRT-main/example/seqar_attack_example.py",
              "language": "python",
              "size": 2756,
              "lines": 90
            },
            {
              "path": "OpenRT-main/example/si_attack_example.py",
              "language": "python",
              "size": 7721,
              "lines": 229
            },
            {
              "path": "OpenRT-main/example/test_openai_image.py",
              "language": "python",
              "size": 1131,
              "lines": 42
            },
            {
              "path": "OpenRT-main/example/tree_attack_example_2024.py",
              "language": "python",
              "size": 3715,
              "lines": 103
            },
            {
              "path": "OpenRT-main/example/visual_jailbreak_example.py",
              "language": "python",
              "size": 8516,
              "lines": 233
            },
            {
              "path": "OpenRT-main/example/xteaming_attack_2025.py",
              "language": "python",
              "size": 3344,
              "lines": 98
            },
            {
              "path": "OpenRT-main/main.py",
              "language": "python",
              "size": 10772,
              "lines": 295
            },
            {
              "path": "OpenRT-main/OpenRT/__init__.py",
              "language": "python",
              "size": 75,
              "lines": 2
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/__init__.py",
              "language": "python",
              "size": 95,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/base_attack.py",
              "language": "python",
              "size": 704,
              "lines": 26
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/__init__.py",
              "language": "python",
              "size": 508,
              "lines": 17
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/base.py",
              "language": "python",
              "size": 516,
              "lines": 16
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/__init__.py",
              "language": "python",
              "size": 3763,
              "lines": 81
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/actor_attack.py",
              "language": "python",
              "size": 14135,
              "lines": 337
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
              "language": "python",
              "size": 24144,
              "lines": 569
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/AIR/__init__.py",
              "language": "python",
              "size": 58,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/AIR/air_attack.py",
              "language": "python",
              "size": 7821,
              "lines": 189
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/AIR/reform_prompt.py",
              "language": "python",
              "size": 21319,
              "lines": 293
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/__init__.py",
              "language": "python",
              "size": 76,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/artprompt_attack.py",
              "language": "python",
              "size": 10057,
              "lines": 268
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
              "language": "python",
              "size": 24486,
              "lines": 513
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan.py",
              "language": "python",
              "size": 5613,
              "lines": 136
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo/__init__.py",
              "language": "python",
              "size": 183,
              "lines": 5
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo/agents.py",
              "language": "python",
              "size": 18248,
              "lines": 301
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo/autodan_turbo.py",
              "language": "python",
              "size": 11149,
              "lines": 263
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo/strategy_library.py",
              "language": "python",
              "size": 8344,
              "lines": 198
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo/summarizer.py",
              "language": "python",
              "size": 8207,
              "lines": 210
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo_r/__init__.py",
              "language": "python",
              "size": 747,
              "lines": 20
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo_r/attacker_reasoning_model.py",
              "language": "python",
              "size": 12728,
              "lines": 211
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo_r/autodan_turbo_r.py",
              "language": "python",
              "size": 30230,
              "lines": 715
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo_r/retrival.py",
              "language": "python",
              "size": 7734,
              "lines": 262
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo_r/scorer_reasoning_model.py",
              "language": "python",
              "size": 4586,
              "lines": 121
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/autodan_turbo_r/summarizer_reasoning_model.py",
              "language": "python",
              "size": 7158,
              "lines": 124
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/__init__.py",
              "language": "python",
              "size": 290,
              "lines": 10
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/attack.py",
              "language": "python",
              "size": 11602,
              "lines": 257
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/ciphers/__init__.py",
              "language": "python",
              "size": 1141,
              "lines": 43
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/ciphers/ascii.py",
              "language": "python",
              "size": 480,
              "lines": 16
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/ciphers/atbash.py",
              "language": "python",
              "size": 641,
              "lines": 22
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/ciphers/base.py",
              "language": "python",
              "size": 410,
              "lines": 16
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/ciphers/caesar.py",
              "language": "python",
              "size": 1052,
              "lines": 33
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/cipherchat/ciphers/morse.py",
              "language": "python",
              "size": 1572,
              "lines": 41
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/coa/__init__.py",
              "language": "python",
              "size": 210,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/coa/coa_attack.py",
              "language": "python",
              "size": 5331,
              "lines": 131
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/coa/coa_modules.py",
              "language": "python",
              "size": 4531,
              "lines": 117
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/CodeAttack/__init__.py",
              "language": "python",
              "size": 157,
              "lines": 9
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/CodeAttack/attack.py",
              "language": "python",
              "size": 6916,
              "lines": 182
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/crescendo_attack.py",
              "language": "python",
              "size": 17843,
              "lines": 440
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/CSDJ/__init__.py",
              "language": "python",
              "size": 557,
              "lines": 17
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/CSDJ/attack.py",
              "language": "python",
              "size": 16303,
              "lines": 402
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/CSDJ/image_generator.py",
              "language": "python",
              "size": 9133,
              "lines": 256
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/deepinception_attack.py",
              "language": "python",
              "size": 5252,
              "lines": 133
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/direct_attack.py",
              "language": "python",
              "size": 2796,
              "lines": 81
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/DrAttack/__init__.py",
              "language": "python",
              "size": 149,
              "lines": 9
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/DrAttack/analyzer.py",
              "language": "python",
              "size": 4354,
              "lines": 126
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/DrAttack/attack.py",
              "language": "python",
              "size": 4802,
              "lines": 125
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/DrAttack/core.py",
              "language": "python",
              "size": 25882,
              "lines": 609
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/DrAttack/library.py",
              "language": "python",
              "size": 2431,
              "lines": 40
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/DrAttack/parser.py",
              "language": "python",
              "size": 6407,
              "lines": 134
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/__init__.py",
              "language": "python",
              "size": 581,
              "lines": 20
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/__init__.py",
              "language": "python",
              "size": 7680,
              "lines": 224
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
              "language": "python",
              "size": 61596,
              "lines": 1261
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
              "language": "python",
              "size": 24975,
              "lines": 543
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
              "language": "python",
              "size": 31733,
              "lines": 837
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/master_coordinator_agent.py",
              "language": "python",
              "size": 20392,
              "lines": 370
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/reconnaissance_agent.py",
              "language": "python",
              "size": 12625,
              "lines": 245
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/tool_synthesizer.py",
              "language": "python",
              "size": 22802,
              "lines": 444
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/basic_usage.py",
              "language": "python",
              "size": 2004,
              "lines": 62
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/config/__init__.py",
              "language": "python",
              "size": 184,
              "lines": 7
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/config/default_config.py",
              "language": "python",
              "size": 1644,
              "lines": 40
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/__init__.py",
              "language": "python",
              "size": 3635,
              "lines": 114
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
              "language": "python",
              "size": 34297,
              "lines": 848
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/test_tool_system.py",
              "language": "python",
              "size": 5735,
              "lines": 199
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/unified_context.py",
              "language": "python",
              "size": 3953,
              "lines": 121
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/evosynth_attack.py",
              "language": "python",
              "size": 13642,
              "lines": 346
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/ai_response.py",
              "language": "python",
              "size": 2593,
              "lines": 82
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
              "language": "python",
              "size": 4618,
              "lines": 146
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_attack_tool.py",
              "language": "python",
              "size": 875,
              "lines": 31
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/utils/__init__.py",
              "language": "python",
              "size": 48,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/utils/data_saver.py",
              "language": "python",
              "size": 27818,
              "lines": 608
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/FigStep/__init__.py",
              "language": "python",
              "size": 138,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/FigStep/attack.py",
              "language": "python",
              "size": 6306,
              "lines": 154
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/FigStep/image_generator.py",
              "language": "python",
              "size": 2027,
              "lines": 58
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/flipattack.py",
              "language": "python",
              "size": 4009,
              "lines": 97
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/genetic_attack.py",
              "language": "python",
              "size": 676,
              "lines": 14
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/gptfuzzer/__init__.py",
              "language": "python",
              "size": 170,
              "lines": 9
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/gptfuzzer/core.py",
              "language": "python",
              "size": 10164,
              "lines": 256
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/gptfuzzer/mutator.py",
              "language": "python",
              "size": 8206,
              "lines": 216
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/gptfuzzer/selection.py",
              "language": "python",
              "size": 5032,
              "lines": 159
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/__init__.py",
              "language": "python",
              "size": 130,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
              "language": "python",
              "size": 29434,
              "lines": 576
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/image_generator.py",
              "language": "python",
              "size": 4786,
              "lines": 128
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/__init__.py",
              "language": "python",
              "size": 59,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py",
              "language": "python",
              "size": 28237,
              "lines": 708
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/ica_attack.py",
              "language": "python",
              "size": 6765,
              "lines": 154
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/IDEATOR/__init__.py",
              "language": "python",
              "size": 62,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/IDEATOR/attack.py",
              "language": "python",
              "size": 8701,
              "lines": 206
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/IDEATOR/messages.py",
              "language": "python",
              "size": 6174,
              "lines": 72
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/iterative_base.py",
              "language": "python",
              "size": 2431,
              "lines": 55
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/jailbroken_attack.py",
              "language": "python",
              "size": 20236,
              "lines": 430
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/__init__.py",
              "language": "python",
              "size": 58,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/bert_toxic.py",
              "language": "python",
              "size": 5616,
              "lines": 102
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/jam_attack.py",
              "language": "python",
              "size": 8908,
              "lines": 192
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/jood/__init__.py",
              "language": "python",
              "size": 57,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/jood/attack.py",
              "language": "python",
              "size": 16145,
              "lines": 414
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/jood/image_mixer.py",
              "language": "python",
              "size": 6093,
              "lines": 186
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/jood/string_mixer.py",
              "language": "python",
              "size": 5442,
              "lines": 164
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/MML/__init__.py",
              "language": "python",
              "size": 122,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/MML/attack.py",
              "language": "python",
              "size": 8147,
              "lines": 195
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/MML/const.py",
              "language": "python",
              "size": 27452,
              "lines": 381
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/MML/image_generator.py",
              "language": "python",
              "size": 6909,
              "lines": 189
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/mousetrap.py",
              "language": "python",
              "size": 20321,
              "lines": 386
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/multilingual_attack.py",
              "language": "python",
              "size": 9932,
              "lines": 211
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/pair_attack.py",
              "language": "python",
              "size": 8139,
              "lines": 197
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/past_tense_attack.py",
              "language": "python",
              "size": 7545,
              "lines": 190
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/prefill_attack.py",
              "language": "python",
              "size": 4360,
              "lines": 135
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/query_relevant/__init__.py",
              "language": "python",
              "size": 163,
              "lines": 5
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/query_relevant/attack.py",
              "language": "python",
              "size": 11612,
              "lines": 268
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/query_relevant/image_generator.py",
              "language": "python",
              "size": 9154,
              "lines": 243
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/race/__init__.py",
              "language": "python",
              "size": 283,
              "lines": 5
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/race/attack_state_machine.py",
              "language": "python",
              "size": 1329,
              "lines": 39
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/race/race_attack.py",
              "language": "python",
              "size": 4343,
              "lines": 104
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/race/race_modules.py",
              "language": "python",
              "size": 3967,
              "lines": 116
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/rainbow_teaming.py",
              "language": "python",
              "size": 15320,
              "lines": 389
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/redqueen_attack.py",
              "language": "python",
              "size": 9211,
              "lines": 171
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/renellm_attack.py",
              "language": "python",
              "size": 18660,
              "lines": 472
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/response_attack/__init__.py",
              "language": "python",
              "size": 64,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/response_attack/attack.py",
              "language": "python",
              "size": 7081,
              "lines": 187
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/response_attack/dialogue_generator.py",
              "language": "python",
              "size": 10183,
              "lines": 216
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/seqar_attack.py",
              "language": "python",
              "size": 10464,
              "lines": 95
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/si_attack.py",
              "language": "python",
              "size": 10500,
              "lines": 263
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/tree_attack.py",
              "language": "python",
              "size": 21389,
              "lines": 466
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/blackbox/implementations/xteaming_attack.py",
              "language": "python",
              "size": 27833,
              "lines": 644
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/__init__.py",
              "language": "python",
              "size": 509,
              "lines": 18
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/base.py",
              "language": "python",
              "size": 1470,
              "lines": 44
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/__init__.py",
              "language": "python",
              "size": 704,
              "lines": 21
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/__init__.py",
              "language": "python",
              "size": 0,
              "lines": 1
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
              "language": "python",
              "size": 16694,
              "lines": 377
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/config.py",
              "language": "python",
              "size": 513,
              "lines": 21
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/__init__.py",
              "language": "python",
              "size": 251,
              "lines": 9
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/attack.py",
              "language": "python",
              "size": 16511,
              "lines": 453
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/config.py",
              "language": "python",
              "size": 1142,
              "lines": 38
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/nanogcg/__init__.py",
              "language": "python",
              "size": 0,
              "lines": 1
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/nanogcg/attack.py",
              "language": "python",
              "size": 17870,
              "lines": 453
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/nanogcg/config.py",
              "language": "python",
              "size": 975,
              "lines": 34
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/nanogcg/utils.py",
              "language": "python",
              "size": 3136,
              "lines": 93
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/__init__.py",
              "language": "python",
              "size": 126,
              "lines": 3
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
              "language": "python",
              "size": 27879,
              "lines": 664
            },
            {
              "path": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/config.py",
              "language": "python",
              "size": 1916,
              "lines": 58
            },
            {
              "path": "OpenRT-main/OpenRT/core/__init__.py",
              "language": "python",
              "size": 21,
              "lines": 2
            },
            {
              "path": "OpenRT-main/OpenRT/core/async_orchestrator.py",
              "language": "python",
              "size": 19694,
              "lines": 469
            },
            {
              "path": "OpenRT-main/OpenRT/core/orchestrator.py",
              "language": "python",
              "size": 4921,
              "lines": 106
            },
            {
              "path": "OpenRT-main/OpenRT/core/registry.py",
              "language": "python",
              "size": 1185,
              "lines": 34
            },
            {
              "path": "OpenRT-main/OpenRT/datasets/__init__.py",
              "language": "python",
              "size": 122,
              "lines": 5
            },
            {
              "path": "OpenRT-main/OpenRT/datasets/base_dataset.py",
              "language": "python",
              "size": 970,
              "lines": 30
            },
            {
              "path": "OpenRT-main/OpenRT/datasets/implementations/__init__.py",
              "language": "python",
              "size": 126,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/datasets/implementations/jsonl_dataset.py",
              "language": "python",
              "size": 4281,
              "lines": 124
            },
            {
              "path": "OpenRT-main/OpenRT/datasets/implementations/static_dataset.py",
              "language": "python",
              "size": 817,
              "lines": 26
            },
            {
              "path": "OpenRT-main/OpenRT/eval.py",
              "language": "python",
              "size": 28440,
              "lines": 717
            },
            {
              "path": "OpenRT-main/OpenRT/evaluators/__init__.py",
              "language": "python",
              "size": 253,
              "lines": 6
            },
            {
              "path": "OpenRT-main/OpenRT/evaluators/base_evaluator.py",
              "language": "python",
              "size": 1009,
              "lines": 31
            },
            {
              "path": "OpenRT-main/OpenRT/evaluators/implementations/__init__.py",
              "language": "python",
              "size": 224,
              "lines": 9
            },
            {
              "path": "OpenRT-main/OpenRT/evaluators/implementations/grouped_evaluator.py",
              "language": "python",
              "size": 4468,
              "lines": 126
            },
            {
              "path": "OpenRT-main/OpenRT/evaluators/implementations/judge_evaluator.py",
              "language": "python",
              "size": 2853,
              "lines": 70
            },
            {
              "path": "OpenRT-main/OpenRT/evaluators/implementations/keyword_evaluator.py",
              "language": "python",
              "size": 827,
              "lines": 20
            },
            {
              "path": "OpenRT-main/OpenRT/evaluators/multi_thread_evaluator.py",
              "language": "python",
              "size": 2842,
              "lines": 83
            },
            {
              "path": "OpenRT-main/OpenRT/judges/__init__.py",
              "language": "python",
              "size": 116,
              "lines": 5
            },
            {
              "path": "OpenRT-main/OpenRT/judges/base_judge.py",
              "language": "python",
              "size": 3074,
              "lines": 80
            },
            {
              "path": "OpenRT-main/OpenRT/judges/implementations/__init__.py",
              "language": "python",
              "size": 111,
              "lines": 4
            },
            {
              "path": "OpenRT-main/OpenRT/judges/implementations/llm_judge.py",
              "language": "python",
              "size": 8663,
              "lines": 153
            },
            {
              "path": "OpenRT-main/OpenRT/judges/implementations/refusal_judge.py",
              "language": "python",
              "size": 2004,
              "lines": 52
            },
            {
              "path": "OpenRT-main/OpenRT/models/__init__.py",
              "language": "python",
              "size": 289,
              "lines": 13
            },
            {
              "path": "OpenRT-main/OpenRT/models/base_image_generator.py",
              "language": "python",
              "size": 1108,
              "lines": 37
            },
            {
              "path": "OpenRT-main/OpenRT/models/base_model.py",
              "language": "python",
              "size": 1351,
              "lines": 34
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/__init__.py",
              "language": "python",
              "size": 654,
              "lines": 21
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/diffusion_generator.py",
              "language": "python",
              "size": 2821,
              "lines": 75
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/huggingface_model.py",
              "language": "python",
              "size": 12870,
              "lines": 334
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/mock_model.py",
              "language": "python",
              "size": 810,
              "lines": 20
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/multithreaded_openai_model.py",
              "language": "python",
              "size": 8066,
              "lines": 206
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/openai_generator.py",
              "language": "python",
              "size": 4061,
              "lines": 105
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/openai_model.py",
              "language": "python",
              "size": 13811,
              "lines": 318
            },
            {
              "path": "OpenRT-main/OpenRT/models/implementations/typography_generator.py",
              "language": "python",
              "size": 3572,
              "lines": 106
            },
            {
              "path": "OpenRT-main/OpenRT/models/multithreaded_model.py",
              "language": "python",
              "size": 5134,
              "lines": 136
            },
            {
              "path": "OpenRT-main/OpenRT/strategies/__init__.py",
              "language": "python",
              "size": 49,
              "lines": 2
            },
            {
              "path": "OpenRT-main/OpenRT/strategies/advancers.py",
              "language": "python",
              "size": 2453,
              "lines": 63
            },
            {
              "path": "OpenRT-main/OpenRT/strategies/base_strategy.py",
              "language": "python",
              "size": 345,
              "lines": 12
            },
            {
              "path": "OpenRT-main/OpenRT/strategies/propagators.py",
              "language": "python",
              "size": 4891,
              "lines": 115
            },
            {
              "path": "OpenRT-main/OpenRT/utils/__init__.py",
              "language": "python",
              "size": 103,
              "lines": 2
            },
            {
              "path": "OpenRT-main/OpenRT/utils/logging_utils.py",
              "language": "python",
              "size": 320,
              "lines": 12
            },
            {
              "path": "OpenRT-main/OpenRT/utils/text_processing.py",
              "language": "python",
              "size": 215,
              "lines": 9
            }
          ],
          "languages": {
            "python": 232
          },
          "manifests": [],
          "test_commands": [],
          "target_mode": "source_tree",
          "input_path": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_174732_2c360f\\src",
          "target_url": "",
          "binary_artifacts": []
        },
        "findings": [],
        "patches": []
      }
    },
    "src_20260914_173934_382488": {
      "files": {
        "00_profile_intel/agent_tool_capabilities.json": {
          "size": 8768,
          "path": "00_profile_intel/agent_tool_capabilities.json"
        },
        "00_profile_intel/attention_map.json": {
          "size": 182572,
          "path": "00_profile_intel/attention_map.json"
        },
        "00_profile_intel/intel_cache/20260914_173107_f48600__online_v2_vuln_intel.json": {
          "size": 2,
          "path": "00_profile_intel/intel_cache/20260914_173107_f48600__online_v2_vuln_intel.json"
        },
        "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json": {
          "size": 10590,
          "path": "00_profile_intel/intel_cache/src__online_v2_vuln_intel.json"
        },
        "00_profile_intel/profile_summary.json": {
          "size": 1639,
          "path": "00_profile_intel/profile_summary.json"
        },
        "00_profile_intel/project_profile.json": {
          "size": 39111,
          "path": "00_profile_intel/project_profile.json"
        },
        "00_profile_intel/raw_intel.json": {
          "size": 11010,
          "path": "00_profile_intel/raw_intel.json"
        },
        "00_profile_intel/raw_intel_queries.json": {
          "size": 42,
          "path": "00_profile_intel/raw_intel_queries.json"
        },
        "00_profile_intel/raw_intel_query_plan.json": {
          "size": 343,
          "path": "00_profile_intel/raw_intel_query_plan.json"
        },
        "00_profile_intel/top_attention_items.json": {
          "size": 155612,
          "path": "00_profile_intel/top_attention_items.json"
        },
        "00_profile_intel/vulnerability_intel.json": {
          "size": 11393,
          "path": "00_profile_intel/vulnerability_intel.json"
        },
        "01_environment/artifacts/container/build.log": {
          "size": 757,
          "path": "01_environment/artifacts/container/build.log"
        },
        "01_environment/artifacts/container/Dockerfile": {
          "size": 1021,
          "path": "01_environment/artifacts/container/Dockerfile"
        },
        "01_environment/artifacts/container/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/container/scripts/check_container.sh"
        },
        "01_environment/artifacts/container/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/container/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/container/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/container/scripts/provision_runtime.sh"
        },
        "01_environment/artifacts/scripts/check_container.sh": {
          "size": 526,
          "path": "01_environment/artifacts/scripts/check_container.sh"
        },
        "01_environment/artifacts/scripts/entrypoint.sh": {
          "size": 312,
          "path": "01_environment/artifacts/scripts/entrypoint.sh"
        },
        "01_environment/artifacts/scripts/provision_runtime.sh": {
          "size": 534,
          "path": "01_environment/artifacts/scripts/provision_runtime.sh"
        },
        "01_environment/container_artifacts.json": {
          "size": 2690,
          "path": "01_environment/container_artifacts.json"
        },
        "01_environment/directory_snapshot.json": {
          "size": 6125,
          "path": "01_environment/directory_snapshot.json"
        },
        "01_environment/environment.json": {
          "size": 20790,
          "path": "01_environment/environment.json"
        },
        "01_environment/environment_plan.json": {
          "size": 20790,
          "path": "01_environment/environment_plan.json"
        },
        "01_environment/local_environment_probe.json": {
          "size": 11329,
          "path": "01_environment/local_environment_probe.json"
        },
        "02_candidate_discovery/agent_candidates.json": {
          "size": 2,
          "path": "02_candidate_discovery/agent_candidates.json"
        },
        "02_candidate_discovery/discovery_plan.json": {
          "size": 838,
          "path": "02_candidate_discovery/discovery_plan.json"
        },
        "02_candidate_discovery/discovery_tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/discovery_tasks.json"
        },
        "02_candidate_discovery/merged_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/merged_candidates.json"
        },
        "02_candidate_discovery/skill_assignments.json": {
          "size": 9785,
          "path": "02_candidate_discovery/skill_assignments.json"
        },
        "02_candidate_discovery/static_candidates.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates.json"
        },
        "02_candidate_discovery/static_candidates_filtered.json": {
          "size": 10726,
          "path": "02_candidate_discovery/static_candidates_filtered.json"
        },
        "02_candidate_discovery/tasks.json": {
          "size": 20750,
          "path": "02_candidate_discovery/tasks.json"
        },
        "03_candidate_ranking/candidate_ranking.json": {
          "size": 2,
          "path": "03_candidate_ranking/candidate_ranking.json"
        },
        "03_candidate_ranking/remaining_validation_queue.json": {
          "size": 7995,
          "path": "03_candidate_ranking/remaining_validation_queue.json"
        },
        "03_candidate_ranking/selected_validation_queue.json": {
          "size": 10726,
          "path": "03_candidate_ranking/selected_validation_queue.json"
        },
        "04_validation/batches/batch_001_input.json": {
          "size": 13098,
          "path": "04_validation/batches/batch_001_input.json"
        },
        "04_validation/batches/batch_002_input.json": {
          "size": 14461,
          "path": "04_validation/batches/batch_002_input.json"
        },
        "04_validation/batches/batch_003_input.json": {
          "size": 13864,
          "path": "04_validation/batches/batch_003_input.json"
        },
        "04_validation/batches/batch_004_input.json": {
          "size": 14354,
          "path": "04_validation/batches/batch_004_input.json"
        },
        "04_validation/batches/batch_005_input.json": {
          "size": 11627,
          "path": "04_validation/batches/batch_005_input.json"
        },
        "04_validation/batches/batch_006_input.json": {
          "size": 13690,
          "path": "04_validation/batches/batch_006_input.json"
        },
        "04_validation/batches/batch_007_input.json": {
          "size": 11502,
          "path": "04_validation/batches/batch_007_input.json"
        },
        "04_validation/batches/batch_008_input.json": {
          "size": 11930,
          "path": "04_validation/batches/batch_008_input.json"
        },
        "04_validation/batches/batch_009_input.json": {
          "size": 10414,
          "path": "04_validation/batches/batch_009_input.json"
        },
        "04_validation/batches/batch_010_input.json": {
          "size": 12873,
          "path": "04_validation/batches/batch_010_input.json"
        },
        "04_validation/batches/batch_011_input.json": {
          "size": 14548,
          "path": "04_validation/batches/batch_011_input.json"
        },
        "04_validation/batches/batch_012_input.json": {
          "size": 14345,
          "path": "04_validation/batches/batch_012_input.json"
        },
        "04_validation/batches/batch_013_input.json": {
          "size": 12752,
          "path": "04_validation/batches/batch_013_input.json"
        },
        "04_validation/batches/batch_014_input.json": {
          "size": 12427,
          "path": "04_validation/batches/batch_014_input.json"
        },
        "04_validation/batches/batch_015_input.json": {
          "size": 13422,
          "path": "04_validation/batches/batch_015_input.json"
        },
        "04_validation/batches/batch_016_input.json": {
          "size": 14072,
          "path": "04_validation/batches/batch_016_input.json"
        },
        "04_validation/candidate_context_bundles.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles.json"
        },
        "04_validation/candidate_context_bundles_selected.json": {
          "size": 111502,
          "path": "04_validation/candidate_context_bundles_selected.json"
        },
        "04_validation/environment_restore_plan.json": {
          "size": 2,
          "path": "04_validation/environment_restore_plan.json"
        },
        "04_validation/findings.json": {
          "size": 2,
          "path": "04_validation/findings.json"
        },
        "04_validation/skill_assignments/batch_001.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_001.json"
        },
        "04_validation/skill_assignments/batch_002.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_002.json"
        },
        "04_validation/skill_assignments/batch_003.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_003.json"
        },
        "04_validation/skill_assignments/batch_004.json": {
          "size": 2033,
          "path": "04_validation/skill_assignments/batch_004.json"
        },
        "04_validation/skill_assignments.json": {
          "size": 25566,
          "path": "04_validation/skill_assignments.json"
        },
        "04_validation/streaming/static_queue.json": {
          "size": 45499,
          "path": "04_validation/streaming/static_queue.json"
        },
        "04_validation/streaming_validation_records.json": {
          "size": 243,
          "path": "04_validation/streaming_validation_records.json"
        },
        "04_validation/validation_adjudication.json": {
          "size": 273,
          "path": "04_validation/validation_adjudication.json"
        },
        "04_validation/validation_plan.json": {
          "size": 7981,
          "path": "04_validation/validation_plan.json"
        },
        "04_validation/validation_results.json": {
          "size": 2,
          "path": "04_validation/validation_results.json"
        },
        "debug/a3s/08_a3s_candidate_ranking_parsed_1789378839129.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_candidate_ranking_parsed_1789378839129.json"
        },
        "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789378822243.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-01-memory-shard-01_parsed_1789378822243.json"
        },
        "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789378822658.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-02-authz-shard-01_parsed_1789378822658.json"
        },
        "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789378826135.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-03-parser-shard-01_parsed_1789378826135.json"
        },
        "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789378827011.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-04-injection-shard-01_parsed_1789378827011.json"
        },
        "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789378830138.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-05-config-shard-01_parsed_1789378830138.json"
        },
        "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789378831546.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-06-resource-shard-01_parsed_1789378831546.json"
        },
        "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789378834284.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-07-underexplored-shard-01_parsed_1789378834284.json"
        },
        "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789378835463.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discover_discover-08-general-shard-01_parsed_1789378835463.json"
        },
        "debug/a3s/08_a3s_discovery_plan_parsed_1789378817765.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_discovery_plan_parsed_1789378817765.json"
        },
        "debug/a3s/08_a3s_environment_parsed_1789378795980.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_environment_parsed_1789378795980.json"
        },
        "debug/a3s/08_a3s_intel_parsed_1789378790337.json": {
          "size": 11393,
          "path": "debug/a3s/08_a3s_intel_parsed_1789378790337.json"
        },
        "debug/a3s/08_a3s_profile_parsed_1789378780924.json": {
          "size": 1639,
          "path": "debug/a3s/08_a3s_profile_parsed_1789378780924.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378805149.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378805149.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378808633.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378808633.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378811849.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378811849.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378814866.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378814866.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378847512.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378847512.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378849366.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378849366.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378850308.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378850308.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378851749.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378851749.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378853842.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378853842.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378855262.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378855262.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378856715.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378856715.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378858132.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378858132.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378859803.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378859803.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378860551.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378860551.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378861544.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378861544.json"
        },
        "debug/a3s/08_a3s_validate_parsed_1789378862375.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validate_parsed_1789378862375.json"
        },
        "debug/a3s/08_a3s_validation_plan_parsed_1789378842455.json": {
          "size": 2,
          "path": "debug/a3s/08_a3s_validation_plan_parsed_1789378842455.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789378830345.jsonl": {
          "size": 80900,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_events_1789378830345.jsonl"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789378830345.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_meta_1789378830345.json"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789378830345.txt": {
          "size": 73507,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_prompt_1789378830345.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789378830345.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_response_1789378830345.txt"
        },
        "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789378830345.json": {
          "size": 236322,
          "path": "debug/a3s/08_a3s_低关注面候选发现智能体_snapshot_1789378830345.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_events_1789378814991.jsonl": {
          "size": 92932,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_events_1789378814991.jsonl"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_meta_1789378814991.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_meta_1789378814991.json"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789378814991.txt": {
          "size": 84496,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_prompt_1789378814991.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_response_1789378814991.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_response_1789378814991.txt"
        },
        "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789378814991.json": {
          "size": 272418,
          "path": "debug/a3s/08_a3s_候选发现规划智能体_snapshot_1789378814991.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_events_1789378836057.jsonl": {
          "size": 192190,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_events_1789378836057.jsonl"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_meta_1789378836057.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_meta_1789378836057.json"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789378836057.txt": {
          "size": 177790,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_prompt_1789378836057.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_response_1789378836057.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_response_1789378836057.txt"
        },
        "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789378836057.json": {
          "size": 570192,
          "path": "debug/a3s/08_a3s_候选合并排序智能体_snapshot_1789378836057.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789378818372.jsonl": {
          "size": 81407,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_events_1789378818372.jsonl"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789378818372.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_meta_1789378818372.json"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789378818372.txt": {
          "size": 73984,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_prompt_1789378818372.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789378818372.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_response_1789378818372.txt"
        },
        "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789378818372.json": {
          "size": 237843,
          "path": "debug/a3s/08_a3s_内存安全候选发现智能体_snapshot_1789378818372.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789378822970.jsonl": {
          "size": 81405,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_events_1789378822970.jsonl"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789378822970.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_meta_1789378822970.json"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789378822970.txt": {
          "size": 73982,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_prompt_1789378822970.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789378822970.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_response_1789378822970.txt"
        },
        "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789378822970.json": {
          "size": 237837,
          "path": "debug/a3s/08_a3s_动态输入候选发现智能体_snapshot_1789378822970.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_events_1789378787384.jsonl": {
          "size": 16516,
          "path": "debug/a3s/08_a3s_安全情报智能体_events_1789378787384.jsonl"
        },
        "debug/a3s/08_a3s_安全情报智能体_meta_1789378787384.json": {
          "size": 905,
          "path": "debug/a3s/08_a3s_安全情报智能体_meta_1789378787384.json"
        },
        "debug/a3s/08_a3s_安全情报智能体_prompt_1789378787384.txt": {
          "size": 12854,
          "path": "debug/a3s/08_a3s_安全情报智能体_prompt_1789378787384.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_response_1789378787384.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全情报智能体_response_1789378787384.txt"
        },
        "debug/a3s/08_a3s_安全情报智能体_snapshot_1789378787384.json": {
          "size": 43170,
          "path": "debug/a3s/08_a3s_安全情报智能体_snapshot_1789378787384.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378802300.jsonl": {
          "size": 76940,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378802300.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378805435.jsonl": {
          "size": 77006,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378805435.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378808926.jsonl": {
          "size": 76887,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378808926.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378812127.jsonl": {
          "size": 76902,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378812127.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378843046.jsonl": {
          "size": 76468,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378843046.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378843307.jsonl": {
          "size": 76545,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378843307.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378843482.jsonl": {
          "size": 76531,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378843482.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378844398.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378844398.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378847720.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378847720.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378849556.jsonl": {
          "size": 76539,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378849556.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378850676.jsonl": {
          "size": 76580,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378850676.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378851995.jsonl": {
          "size": 76458,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378851995.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378854042.jsonl": {
          "size": 76543,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378854042.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378855475.jsonl": {
          "size": 76532,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378855475.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378857007.jsonl": {
          "size": 76434,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378857007.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_events_1789378858377.jsonl": {
          "size": 76678,
          "path": "debug/a3s/08_a3s_安全确认智能体_events_1789378858377.jsonl"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378802300.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378802300.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378805435.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378805435.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378808926.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378808926.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378812127.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378812127.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378843046.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378843046.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378843307.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378843307.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378843482.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378843482.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378844398.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378844398.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378847720.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378847720.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378849556.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378849556.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378850676.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378850676.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378851995.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378851995.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378854042.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378854042.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378855475.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378855475.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378857007.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378857007.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_meta_1789378858377.json": {
          "size": 909,
          "path": "debug/a3s/08_a3s_安全确认智能体_meta_1789378858377.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378802300.txt": {
          "size": 69763,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378802300.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378805435.txt": {
          "size": 69807,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378805435.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378808926.txt": {
          "size": 69720,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378808926.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378812127.txt": {
          "size": 69744,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378812127.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843046.txt": {
          "size": 69332,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843046.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843307.txt": {
          "size": 69407,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843307.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843482.txt": {
          "size": 69357,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378843482.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378844398.txt": {
          "size": 69343,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378844398.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378847720.txt": {
          "size": 69341,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378847720.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378849556.txt": {
          "size": 69371,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378849556.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378850676.txt": {
          "size": 69455,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378850676.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378851995.txt": {
          "size": 69340,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378851995.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378854042.txt": {
          "size": 69413,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378854042.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378855475.txt": {
          "size": 69386,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378855475.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378857007.txt": {
          "size": 69297,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378857007.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_prompt_1789378858377.txt": {
          "size": 69511,
          "path": "debug/a3s/08_a3s_安全确认智能体_prompt_1789378858377.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378802300.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378802300.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378805435.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378805435.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378808926.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378808926.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378812127.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378812127.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378843046.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378843046.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378843307.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378843307.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378843482.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378843482.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378844398.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378844398.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378847720.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378847720.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378849556.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378849556.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378850676.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378850676.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378851995.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378851995.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378854042.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378854042.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378855475.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378855475.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378857007.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378857007.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_response_1789378858377.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_安全确认智能体_response_1789378858377.txt"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378802300.json": {
          "size": 224442,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378802300.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378805435.json": {
          "size": 224640,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378805435.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378808926.json": {
          "size": 224283,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378808926.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378812127.json": {
          "size": 224328,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378812127.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843046.json": {
          "size": 223026,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843046.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843307.json": {
          "size": 223257,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843307.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843482.json": {
          "size": 223215,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378843482.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378844398.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378844398.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378847720.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378847720.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378849556.json": {
          "size": 223239,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378849556.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378850676.json": {
          "size": 223362,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378850676.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378851995.json": {
          "size": 222996,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378851995.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378854042.json": {
          "size": 223251,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378854042.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378855475.json": {
          "size": 223218,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378855475.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378857007.json": {
          "size": 222924,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378857007.json"
        },
        "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378858377.json": {
          "size": 223656,
          "path": "debug/a3s/08_a3s_安全确认智能体_snapshot_1789378858377.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789378827144.jsonl": {
          "size": 81402,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_events_1789378827144.jsonl"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789378827144.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_meta_1789378827144.json"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789378827144.txt": {
          "size": 73979,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_prompt_1789378827144.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789378827144.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_response_1789378827144.txt"
        },
        "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789378827144.json": {
          "size": 237828,
          "path": "debug/a3s/08_a3s_并发资源候选发现智能体_snapshot_1789378827144.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789378818465.jsonl": {
          "size": 81394,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_events_1789378818465.jsonl"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789378818465.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_meta_1789378818465.json"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789378818465.txt": {
          "size": 73971,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_prompt_1789378818465.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789378818465.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_response_1789378818465.txt"
        },
        "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789378818465.json": {
          "size": 237804,
          "path": "debug/a3s/08_a3s_权限认证候选发现智能体_snapshot_1789378818465.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_events_1789378793051.jsonl": {
          "size": 34007,
          "path": "debug/a3s/08_a3s_环境建立智能体_events_1789378793051.jsonl"
        },
        "debug/a3s/08_a3s_环境建立智能体_meta_1789378793051.json": {
          "size": 908,
          "path": "debug/a3s/08_a3s_环境建立智能体_meta_1789378793051.json"
        },
        "debug/a3s/08_a3s_环境建立智能体_prompt_1789378793051.txt": {
          "size": 29683,
          "path": "debug/a3s/08_a3s_环境建立智能体_prompt_1789378793051.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_response_1789378793051.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_环境建立智能体_response_1789378793051.txt"
        },
        "debug/a3s/08_a3s_环境建立智能体_snapshot_1789378793051.json": {
          "size": 95643,
          "path": "debug/a3s/08_a3s_环境建立智能体_snapshot_1789378793051.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_events_1789378778013.jsonl": {
          "size": 18128,
          "path": "debug/a3s/08_a3s_目标画像智能体_events_1789378778013.jsonl"
        },
        "debug/a3s/08_a3s_目标画像智能体_meta_1789378778013.json": {
          "size": 906,
          "path": "debug/a3s/08_a3s_目标画像智能体_meta_1789378778013.json"
        },
        "debug/a3s/08_a3s_目标画像智能体_prompt_1789378778013.txt": {
          "size": 14557,
          "path": "debug/a3s/08_a3s_目标画像智能体_prompt_1789378778013.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_response_1789378778013.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_目标画像智能体_response_1789378778013.txt"
        },
        "debug/a3s/08_a3s_目标画像智能体_snapshot_1789378778013.json": {
          "size": 48006,
          "path": "debug/a3s/08_a3s_目标画像智能体_snapshot_1789378778013.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789378822352.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_events_1789378822352.jsonl"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789378822352.json": {
          "size": 1019,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_meta_1789378822352.json"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789378822352.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_prompt_1789378822352.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789378822352.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_response_1789378822352.txt"
        },
        "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789378822352.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_解析器序列化候选发现智能体_snapshot_1789378822352.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_events_1789378831694.jsonl": {
          "size": 81381,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_events_1789378831694.jsonl"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_meta_1789378831694.json": {
          "size": 947,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_meta_1789378831694.json"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789378831694.txt": {
          "size": 73958,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_prompt_1789378831694.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_response_1789378831694.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_response_1789378831694.txt"
        },
        "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789378831694.json": {
          "size": 237765,
          "path": "debug/a3s/08_a3s_通用候选发现智能体_snapshot_1789378831694.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789378826318.jsonl": {
          "size": 81408,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_events_1789378826318.jsonl"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789378826318.json": {
          "size": 983,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_meta_1789378826318.json"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789378826318.txt": {
          "size": 73985,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_prompt_1789378826318.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789378826318.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_response_1789378826318.txt"
        },
        "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789378826318.json": {
          "size": 237846,
          "path": "debug/a3s/08_a3s_配置密钥候选发现智能体_snapshot_1789378826318.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_events_1789378839699.jsonl": {
          "size": 42622,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_events_1789378839699.jsonl"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_meta_1789378839699.json": {
          "size": 944,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_meta_1789378839699.json"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789378839699.txt": {
          "size": 37107,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_prompt_1789378839699.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_response_1789378839699.txt": {
          "size": 0,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_response_1789378839699.txt"
        },
        "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789378839699.json": {
          "size": 121488,
          "path": "debug/a3s/08_a3s_验证任务规划智能体_snapshot_1789378839699.json"
        },
        "debug/logs/a3s_interactions.jsonl": {
          "size": 2358983,
          "path": "debug/logs/a3s_interactions.jsonl"
        },
        "debug/logs/events.jsonl": {
          "size": 34861,
          "path": "debug/logs/events.jsonl"
        },
        "records/01_skill_assignments.json": {
          "size": 9785,
          "path": "records/01_skill_assignments.json"
        },
        "records/15_validation_skill_assignments.json": {
          "size": 25566,
          "path": "records/15_validation_skill_assignments.json"
        },
        "records/agent_pool_status.json": {
          "size": 17109,
          "path": "records/agent_pool_status.json"
        },
        "records/artifact_index.json": {
          "size": 26701,
          "path": "records/artifact_index.json"
        },
        "records/feedback_memory.json": {
          "size": 182,
          "path": "records/feedback_memory.json"
        },
        "records/process.md": {
          "size": 10708,
          "path": "records/process.md"
        },
        "records/run_status.json": {
          "size": 590,
          "path": "records/run_status.json"
        },
        "records/state.json": {
          "size": 371,
          "path": "records/state.json"
        },
        "SUMMARY.md": {
          "size": 1480,
          "path": "SUMMARY.md"
        }
      },
      "agent_activity": {
        "source": "agent_pool",
        "groups": {
          "discovery": {
            "label": "发现漏洞",
            "running": 0,
            "completed": 8,
            "failed": 0,
            "stale": 0
          },
          "validation": {
            "label": "验证漏洞",
            "running": 0,
            "completed": 13,
            "failed": 0,
            "stale": 0
          },
          "environment": {
            "label": "环境",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "profile": {
            "label": "画像/情报",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "ranking": {
            "label": "排序",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "remediation": {
            "label": "修复",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          },
          "other": {
            "label": "其他",
            "running": 0,
            "completed": 0,
            "failed": 0,
            "stale": 0
          }
        },
        "agents": [
          {
            "label": "漏洞验证-batch-016",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:58",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-015"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-015",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:40:56",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-016"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-014",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:40:55",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-014"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-013",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:40:54",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-013"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-012",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 7,
            "started_at": "2026-09-14T17:40:51",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-012"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-011",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 6,
            "started_at": "2026-09-14T17:40:50",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-011"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-010",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 6,
            "started_at": "2026-09-14T17:40:49",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-010"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-009",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 6,
            "started_at": "2026-09-14T17:40:47",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-008"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-008",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 8,
            "started_at": "2026-09-14T17:40:43",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-007"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-007",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 7,
            "started_at": "2026-09-14T17:40:43",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-006"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-006",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 6,
            "started_at": "2026-09-14T17:40:43",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-005"
              ],
              "serial": false
            }
          },
          {
            "label": "漏洞验证-batch-005",
            "kind": "validation",
            "kind_label": "验证漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:40:42",
            "function": "source_validation_batch",
            "priority": "漏洞确认/安全确认",
            "metadata": {
              "candidate_ids": [
                "VULN-009"
              ],
              "serial": false
            }
          },
          {
            "label": "通用候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:31",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-08-general-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "general"
            }
          },
          {
            "label": "低关注面候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:30",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-07-underexplored-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/models/implementations/mock_model.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py"
              ],
              "specialty": "underexplored"
            }
          },
          {
            "label": "并发资源候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:27",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-06-resource-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "resource"
            }
          },
          {
            "label": "配置密钥候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:26",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-05-config-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "configuration"
            }
          },
          {
            "label": "动态输入候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 5,
            "started_at": "2026-09-14T17:40:22",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-04-injection-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "injection"
            }
          },
          {
            "label": "解析器序列化候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:22",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-03-parser-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "parser"
            }
          },
          {
            "label": "权限认证候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:18",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-02-authz-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "authorization"
            }
          },
          {
            "label": "内存安全候选发现智能体",
            "kind": "discovery",
            "kind_label": "发现漏洞",
            "status": "completed",
            "elapsed_seconds": 4,
            "started_at": "2026-09-14T17:40:18",
            "function": "source_slice_discovery",
            "priority": "候选发现智能体",
            "metadata": {
              "task_id": "discover-01-memory-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "memory_safety"
            }
          }
        ],
        "running_total": 0,
        "completed_total": 21,
        "failed_total": 0,
        "stale_total": 0,
        "capacity": 4,
        "min_workers": 2,
        "updated_at": "2026-09-14T17:41:02"
      },
      "agent_pool_status": {
        "max_workers": 4,
        "min_workers": 2,
        "running_total": 0,
        "by_stage": {
          "validation": {
            "running": 0,
            "completed": 13,
            "failed": 0
          },
          "discovery": {
            "running": 0,
            "completed": 8,
            "failed": 0
          }
        },
        "active": [],
        "recent": [
          {
            "id": "agent-0021",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-016",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-015"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:58",
            "updated_at": "2026-09-14T17:41:02",
            "ended_at": "2026-09-14T17:41:02",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0020",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-015",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-016"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:56",
            "updated_at": "2026-09-14T17:41:01",
            "ended_at": "2026-09-14T17:41:01",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0019",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-014",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-014"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:55",
            "updated_at": "2026-09-14T17:41:00",
            "ended_at": "2026-09-14T17:41:00",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0018",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-013",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-013"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:54",
            "updated_at": "2026-09-14T17:40:59",
            "ended_at": "2026-09-14T17:40:59",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0017",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-012",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-012"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:51",
            "updated_at": "2026-09-14T17:40:58",
            "ended_at": "2026-09-14T17:40:58",
            "elapsed_seconds": 7
          },
          {
            "id": "agent-0016",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-011",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-011"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:50",
            "updated_at": "2026-09-14T17:40:56",
            "ended_at": "2026-09-14T17:40:56",
            "elapsed_seconds": 6
          },
          {
            "id": "agent-0015",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-010",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-010"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:49",
            "updated_at": "2026-09-14T17:40:55",
            "ended_at": "2026-09-14T17:40:55",
            "elapsed_seconds": 6
          },
          {
            "id": "agent-0014",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-009",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-008"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:47",
            "updated_at": "2026-09-14T17:40:53",
            "ended_at": "2026-09-14T17:40:53",
            "elapsed_seconds": 6
          },
          {
            "id": "agent-0013",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-008",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-007"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:43",
            "updated_at": "2026-09-14T17:40:51",
            "ended_at": "2026-09-14T17:40:51",
            "elapsed_seconds": 8
          },
          {
            "id": "agent-0012",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-007",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-006"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:43",
            "updated_at": "2026-09-14T17:40:50",
            "ended_at": "2026-09-14T17:40:50",
            "elapsed_seconds": 7
          },
          {
            "id": "agent-0011",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-006",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-005"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:43",
            "updated_at": "2026-09-14T17:40:49",
            "ended_at": "2026-09-14T17:40:49",
            "elapsed_seconds": 6
          },
          {
            "id": "agent-0010",
            "stage": "validation",
            "function": "source_validation_batch",
            "name": "漏洞验证-batch-005",
            "priority": "漏洞确认/安全确认",
            "status": "completed",
            "metadata": {
              "candidate_ids": [
                "VULN-009"
              ],
              "serial": false
            },
            "started_at": "2026-09-14T17:40:42",
            "updated_at": "2026-09-14T17:40:47",
            "ended_at": "2026-09-14T17:40:47",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0009",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "通用候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-08-general-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "general"
            },
            "started_at": "2026-09-14T17:40:31",
            "updated_at": "2026-09-14T17:40:35",
            "ended_at": "2026-09-14T17:40:35",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0008",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "低关注面候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-07-underexplored-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/models/implementations/mock_model.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py"
              ],
              "specialty": "underexplored"
            },
            "started_at": "2026-09-14T17:40:30",
            "updated_at": "2026-09-14T17:40:34",
            "ended_at": "2026-09-14T17:40:34",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0007",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "并发资源候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-06-resource-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "resource"
            },
            "started_at": "2026-09-14T17:40:27",
            "updated_at": "2026-09-14T17:40:31",
            "ended_at": "2026-09-14T17:40:31",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0006",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "配置密钥候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-05-config-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "configuration"
            },
            "started_at": "2026-09-14T17:40:26",
            "updated_at": "2026-09-14T17:40:30",
            "ended_at": "2026-09-14T17:40:30",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0005",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "动态输入候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-04-injection-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "injection"
            },
            "started_at": "2026-09-14T17:40:22",
            "updated_at": "2026-09-14T17:40:27",
            "ended_at": "2026-09-14T17:40:27",
            "elapsed_seconds": 5
          },
          {
            "id": "agent-0004",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "解析器序列化候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-03-parser-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "parser"
            },
            "started_at": "2026-09-14T17:40:22",
            "updated_at": "2026-09-14T17:40:26",
            "ended_at": "2026-09-14T17:40:26",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0003",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "权限认证候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-02-authz-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "authorization"
            },
            "started_at": "2026-09-14T17:40:18",
            "updated_at": "2026-09-14T17:40:22",
            "ended_at": "2026-09-14T17:40:22",
            "elapsed_seconds": 4
          },
          {
            "id": "agent-0002",
            "stage": "discovery",
            "function": "source_slice_discovery",
            "name": "内存安全候选发现智能体",
            "priority": "候选发现智能体",
            "status": "completed",
            "metadata": {
              "task_id": "discover-01-memory-shard-01",
              "files": [
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/ArtPrompt/base_prompt.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/HADES/attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/adaptive_attack.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/autonomous_orchestrator.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/exploitation_agent.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
                "OpenRT-main/OpenRT/attacks/blackbox/implementations/himrd/attack.py"
              ],
              "specialty": "memory_safety"
            },
            "started_at": "2026-09-14T17:40:18",
            "updated_at": "2026-09-14T17:40:22",
            "ended_at": "2026-09-14T17:40:22",
            "elapsed_seconds": 4
          }
        ],
        "updated_at": "2026-09-14T17:41:02"
      },
      "run_status": {
        "task_id": "src_20260914_173934_382488",
        "status": "succeeded",
        "stage": "validation",
        "message": "流水线完成",
        "error": "",
        "phase": "agent-detect",
        "pid": 5600,
        "updated_at": "2026-09-14T17:41:03",
        "output_dir": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_173934_382488",
        "target": "C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_173107_f48600\\src"
      },
      "state": {
        "task_id": "src_20260914_173934_382488",
        "started_at": "2026-09-14T09:39:37.331215+00:00",
        "phases": {
          "profile": "完成",
          "intel": "完成",
          "environment": "完成",
          "candidate_ranking": "进入验证队列 16 个候选，流式已验证 4 个",
          "validation": "已确认 0 个漏洞",
          "analysis": "已确认 0 个漏洞"
        }
      },
      "summary": null
    }
  },
  "nodesByJob": {
    "src_20260914_174801_197734": [
      {
        "id": "profile",
        "status": "done",
        "summary": {
          "file_count": 232,
          "high_risk_count": 160,
          "underexplored_count": 2
        },
        "message": ""
      },
      {
        "id": "environment",
        "status": "done",
        "summary": {
          "environment_ready": true,
          "summary": null
        },
        "message": ""
      },
      {
        "id": "discovery",
        "status": "done",
        "summary": {
          "candidates": 16
        },
        "message": ""
      },
      {
        "id": "ranking",
        "status": "done",
        "summary": {
          "queued": 0
        },
        "message": ""
      },
      {
        "id": "validation",
        "status": "done",
        "summary": {
          "findings": 0
        },
        "message": ""
      },
      {
        "id": "remediation",
        "status": "done",
        "summary": {
          "total": 0,
          "patched": 0,
          "failed": 0
        },
        "message": ""
      },
      {
        "id": "report",
        "status": "done",
        "summary": {
          "present": true
        },
        "message": ""
      }
    ],
    "src_20260914_173934_382488": [
      {
        "id": "profile",
        "status": "done",
        "summary": {
          "file_count": 232,
          "high_risk_count": 160,
          "underexplored_count": 2
        },
        "message": ""
      },
      {
        "id": "environment",
        "status": "done",
        "summary": {
          "environment_ready": true,
          "summary": null
        },
        "message": ""
      },
      {
        "id": "discovery",
        "status": "done",
        "summary": {
          "candidates": 16
        },
        "message": ""
      },
      {
        "id": "ranking",
        "status": "done",
        "summary": {
          "queued": 0
        },
        "message": ""
      },
      {
        "id": "validation",
        "status": "done",
        "summary": {
          "findings": 0
        },
        "message": ""
      },
      {
        "id": "remediation",
        "status": "done",
        "summary": {
          "total": 0,
          "patched": 0,
          "failed": 0
        },
        "message": ""
      },
      {
        "id": "report",
        "status": "done",
        "summary": {
          "present": false
        },
        "message": ""
      }
    ]
  },
  "activityByJob": {
    "src_20260914_174801_197734": [
      {
        "source": "info",
        "time": "",
        "title": "\r[validate] [################------------] 7/12  58.3%   13s 已确认 0 个",
        "detail": []
      },
      {
        "source": "info",
        "time": "validate",
        "title": "agent-15 开始验证：VULN-016:OpenRT-main/OpenRT/models/implementations/huggingface_model.py:86",
        "detail": []
      },
      {
        "source": "info",
        "time": "",
        "title": "\r[validate] [##################----------] 8/12  66.7%   15s 已确认 0 个",
        "detail": []
      },
      {
        "source": "info",
        "time": "validate",
        "title": "agent-16 开始验证：VULN-015:OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py:154",
        "detail": []
      },
      {
        "source": "info",
        "time": "",
        "title": "\r[validate] [#####################-------] 9/12  75.0%   16s 已确认 0 个\r[validate] [#######################-----] 10/12  83.3%   17s 已确认 0 个\r[validate] [#########################---] 11/12  91.7%   19s 已确认 0 个\r[validate] [############################] 12/12 100.0%   20s 已确认 0 个",
        "detail": []
      },
      {
        "source": "info",
        "time": "stage",
        "title": "跨批次确认结果聚合校正 - 候选总数：16；验证结论总数：0",
        "detail": []
      },
      {
        "source": "info",
        "time": "stage",
        "title": "漏洞验证汇总 - 验证候选数：16；流式已验证候选数：4",
        "detail": []
      },
      {
        "source": "info",
        "time": "stage",
        "title": "报告生成 - 中文最终报告：06_report/report.md；过程记录：records/process.md",
        "detail": []
      },
      {
        "source": "info",
        "time": "summary",
        "title": "确认漏洞数：0",
        "detail": []
      },
      {
        "source": "info",
        "time": "summary",
        "title": "最终总结：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_174801_197734\\SUMMARY.md",
        "detail": []
      }
    ],
    "src_20260914_173934_382488": [
      {
        "source": "info",
        "time": "validate",
        "title": "agent-14 开始验证：VULN-014:OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py:64",
        "detail": []
      },
      {
        "source": "info",
        "time": "",
        "title": "\r[validate] [################------------] 7/12  58.3%   14s 已确认 0 个",
        "detail": []
      },
      {
        "source": "info",
        "time": "validate",
        "title": "agent-15 开始验证：VULN-016:OpenRT-main/OpenRT/models/implementations/huggingface_model.py:86",
        "detail": []
      },
      {
        "source": "info",
        "time": "",
        "title": "\r[validate] [##################----------] 8/12  66.7%   15s 已确认 0 个",
        "detail": []
      },
      {
        "source": "info",
        "time": "validate",
        "title": "agent-16 开始验证：VULN-015:OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py:154",
        "detail": []
      },
      {
        "source": "info",
        "time": "",
        "title": "\r[validate] [#####################-------] 9/12  75.0%   17s 已确认 0 个\r[validate] [#######################-----] 10/12  83.3%   17s 已确认 0 个\r[validate] [#########################---] 11/12  91.7%   18s 已确认 0 个\r[validate] [############################] 12/12 100.0%   19s 已确认 0 个",
        "detail": []
      },
      {
        "source": "info",
        "time": "stage",
        "title": "跨批次确认结果聚合校正 - 候选总数：16；验证结论总数：0",
        "detail": []
      },
      {
        "source": "info",
        "time": "stage",
        "title": "漏洞验证汇总 - 验证候选数：16；流式已验证候选数：4",
        "detail": []
      },
      {
        "source": "info",
        "time": "summary",
        "title": "确认漏洞数：0",
        "detail": []
      },
      {
        "source": "info",
        "time": "summary",
        "title": "最终总结：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_173934_382488\\SUMMARY.md",
        "detail": []
      }
    ]
  },
  "logsByJob": {
    "src_20260914_174801_197734": {
      "lines": [
        {
          "t": "config",
          "lvl": "info",
          "msg": "使用配置：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\shuan_config.toml"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "输入目标：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_174732_2c360f\\src"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "工作目录：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_174732_2c360f\\src"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "任务 ID：src_20260914_174801_197734"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "输出目录：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_174801_197734"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "目标模式：source_tree"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "语言分布：{'python': 232}"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "后端：a3s-code"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "任务启动 - 任务 ID：src_20260914_174801_197734；输入目标：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_17..."
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "目标画像 - 项目名：20260914_174732_2c360f；目标模式：source_tree"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "工具链基座准备 - CLI 策略：允许 agent 按任务需要多轮使用当前环境中的任意本地命令，不预设命令类型白名单。；工具策略：按假设选择工具，工具类别作为启发而不是全量执行清单。"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "目标画像智能体启动 - 目标：从主程序粗扫描中归纳软件身份、软件类型、运行形态、输入面和安全相关能力。；边界：不做漏洞判断，不枚举完整文件清单，不运行构建/测试/随机输入。"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "目标画像智能体输出 - 软件身份：{'name': '20260914_174732_2c360f', 'version': '未知', 'version_evidence': [], 'confidence': 0.4}；软件类型：源码目录"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞情报智能体启动 - 目标：收集历史 CVE、依赖风险、历史漏洞模式和推荐关注面。；原始情报数：20"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞情报智能体输出 - 软件身份：{}；已知漏洞：0"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "风险关注度地图 - 文件数：232；高风险文件数：160"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "环境建立智能体启动 - 目标：建立最小可复现、可观测、可清理的验证环境，并准备可复用的测试输入驱动。；边界：不发现漏洞、不验证漏洞、不执行 fuzz 发现、不修改业务源码；只规划和脚本化后续测试/fuzz 输入。"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Exception in thread Thread-1 (_readerthread):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Traceback (most recent call last):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1075, in _bootstrap_inner"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self.run()"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1012, in run"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self._target(*self._args, **self._kwargs)"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\subprocess.py\", line 1599, in _readerthread"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    buffer.append(fh.read())"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "                  ^^^^^^^^^"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"<frozen codecs>\", line 322, in decode"
        },
        {
          "t": "",
          "lvl": "error",
          "msg": "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xb2 in position 6: invalid start byte"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Exception in thread Thread-2 (_readerthread):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Traceback (most recent call last):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1075, in _bootstrap_inner"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self.run()"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1012, in run"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self._target(*self._args, **self._kwargs)"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\subprocess.py\", line 1599, in _readerthread"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    buffer.append(fh.read())"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "                  ^^^^^^^^^"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"<frozen codecs>\", line 322, in decode"
        },
        {
          "t": "",
          "lvl": "error",
          "msg": "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xce in position 6: invalid continuation byte"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "环境建立智能体输出 - 环境可用：True；目标模式：source_tree"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[static] [----------------------------] 1/232   0.4%    0s OpenRT-main/eval.py\r[static] [######----------------------] 55/232  23.7%    0s OpenRT-main/OpenRT/attacks/blackbox/base.py\r[static] [############----------------] 106/232  45.7%    0s lementations/evosynth/ai_agents/external_power_tools.py\r[static] [###################---------] 160/232  69.0%    0s tacks/blackbox/implementations/query_relevant/attack.py\r[static] [###########################-] 225/232  97.0%    0s OpenRT-main/OpenRT/models/multithreaded_model.py\r[static] [############################] 232/232 100.0%    0s OpenRT-main/OpenRT/utils/text_processing.py"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[static] [############################] 232/232 100.0%    0s 完成"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "本地静态候选发现 - 原始候选数：16；过滤后候选数：16"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "流式候选验证启动 - 批次：static；原因：本地静态候选已产生，先对高优先级候选进行流式筛选验证。"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-1 开始验证：VULN-001:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py:321"
        },
        {
          "t": "DEBUG",
          "lvl": "error",
          "msg": "HTTP error: Failed to send request to https://ark.cn-beijing.volces.com/api/v3/v1/chat/completions"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Caused by:"
        },
        {
          "t": "",
          "lvl": "error",
          "msg": "    0: error sending request for url (https://ark.cn-beijing.volces.com/api/v3/v1/chat/completions): error trying to connect: unsuccessful tunnel"
        },
        {
          "t": "",
          "lvl": "error",
          "msg": "    1: error trying to connect: unsuccessful tunnel"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    2: unsuccessful tunnel"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-2 开始验证：VULN-002:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py:647"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-3 开始验证：VULN-003:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py:101"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-4 开始验证：VULN-004:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py:224"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "流式候选验证输出 - 批次：static；已验证候选：['VULN-001', 'VULN-002', 'VULN-003', 'VULN-004']"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选发现规划智能体输出 - 策略：候选发现规划智能体未运行或失败，使用本地默认分片策略。；启用专长：默认全量"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "启动 2 个 A3S agent，执行 8 个候选发现任务"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选发现智能体启动 - 任务数：8；并发数：2"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "内存安全候选发现智能体 分析 8 个文件"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "权限认证候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [###-------------------------] 1/8  12.5%    5s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "解析器序列化候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [#######---------------------] 2/8  25.0%    5s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "动态输入候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [##########------------------] 3/8  37.5%    9s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "配置密钥候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [##############--------------] 4/8  50.0%   10s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "并发资源候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [#################-----------] 5/8  62.5%   13s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "低关注面候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [#####################-------] 6/8  75.0%   14s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "通用候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [########################----] 7/8  87.5%   16s 已发现 0 个\r[discover] [############################] 8/8 100.0%   19s 已发现 0 个"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选发现汇总 - 本地静态候选数：16；Agent 候选数：0"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选合并排序智能体启动 - 输入候选数：16；发送给排序智能体候选数：16"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选合并排序智能体输出 - 验证队列数：0；合并组数：0"
        },
        {
          "t": "candidates",
          "lvl": "info",
          "msg": "已选择 16 个候选进入漏洞验证"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "验证任务规划智能体输出 - 策略：验证任务规划智能体未运行或失败，使用本地默认批次。；批次数：12"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "启动 4 个 A3S agent，并发验证 12 个批次"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞验证智能体启动 - 验证批次数：12；并发数：4"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-5 开始验证：VULN-009:OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/bert_toxic.py:13"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-6 开始验证：VULN-005:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py:540"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-7 开始验证：VULN-006:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py:64"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-8 开始验证：VULN-007:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py:103"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [##--------------------------] 1/12   8.3%    6s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-9 开始验证：VULN-008:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py:143"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [####------------------------] 2/12  16.7%    7s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-10 开始验证：VULN-010:OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py:100"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [#######---------------------] 3/12  25.0%    8s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-11 开始验证：VULN-011:OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py:169"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [#########-------------------] 4/12  33.3%    9s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-12 开始验证：VULN-012:OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py:288"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [###########-----------------] 5/12  41.7%   11s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-13 开始验证：VULN-013:OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/attack.py:203"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [##############--------------] 6/12  50.0%   12s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-14 开始验证：VULN-014:OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py:64"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [################------------] 7/12  58.3%   13s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-15 开始验证：VULN-016:OpenRT-main/OpenRT/models/implementations/huggingface_model.py:86"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [##################----------] 8/12  66.7%   15s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-16 开始验证：VULN-015:OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py:154"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [#####################-------] 9/12  75.0%   16s 已确认 0 个\r[validate] [#######################-----] 10/12  83.3%   17s 已确认 0 个\r[validate] [#########################---] 11/12  91.7%   19s 已确认 0 个\r[validate] [############################] 12/12 100.0%   20s 已确认 0 个"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "跨批次确认结果聚合校正 - 候选总数：16；验证结论总数：0"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞验证汇总 - 验证候选数：16；流式已验证候选数：4"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "报告生成 - 中文最终报告：06_report/report.md；过程记录：records/process.md"
        },
        {
          "t": "summary",
          "lvl": "info",
          "msg": "确认漏洞数：0"
        },
        {
          "t": "summary",
          "lvl": "info",
          "msg": "最终总结：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_174801_197734\\SUMMARY.md"
        }
      ],
      "size": 11047
    },
    "src_20260914_173934_382488": {
      "lines": [
        {
          "t": "config",
          "lvl": "info",
          "msg": "使用配置：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\shuan_config.toml"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "输入目标：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_173107_f48600\\src"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "工作目录：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_173107_f48600\\src"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "任务 ID：src_20260914_173934_382488"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "输出目录：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_173934_382488"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "目标模式：source_tree"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "语言分布：{'python': 232}"
        },
        {
          "t": "info",
          "lvl": "info",
          "msg": "后端：a3s-code"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "任务启动 - 任务 ID：src_20260914_173934_382488；输入目标：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\uploads\\20260914_17..."
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "目标画像 - 项目名：20260914_173107_f48600；目标模式：source_tree"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "工具链基座准备 - CLI 策略：允许 agent 按任务需要多轮使用当前环境中的任意本地命令，不预设命令类型白名单。；工具策略：按假设选择工具，工具类别作为启发而不是全量执行清单。"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "目标画像智能体启动 - 目标：从主程序粗扫描中归纳软件身份、软件类型、运行形态、输入面和安全相关能力。；边界：不做漏洞判断，不枚举完整文件清单，不运行构建/测试/随机输入。"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "目标画像智能体输出 - 软件身份：{'name': '20260914_173107_f48600', 'version': '未知', 'version_evidence': [], 'confidence': 0.4}；软件类型：源码目录"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞情报智能体启动 - 目标：收集历史 CVE、依赖风险、历史漏洞模式和推荐关注面。；原始情报数：20"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞情报智能体输出 - 软件身份：{}；已知漏洞：0"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "风险关注度地图 - 文件数：232；高风险文件数：160"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "环境建立智能体启动 - 目标：建立最小可复现、可观测、可清理的验证环境，并准备可复用的测试输入驱动。；边界：不发现漏洞、不验证漏洞、不执行 fuzz 发现、不修改业务源码；只规划和脚本化后续测试/fuzz 输入。"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Exception in thread Thread-1 (_readerthread):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Traceback (most recent call last):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1075, in _bootstrap_inner"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self.run()"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1012, in run"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self._target(*self._args, **self._kwargs)"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\subprocess.py\", line 1599, in _readerthread"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    buffer.append(fh.read())"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "                  ^^^^^^^^^"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"<frozen codecs>\", line 322, in decode"
        },
        {
          "t": "",
          "lvl": "error",
          "msg": "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xb2 in position 6: invalid start byte"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Exception in thread Thread-2 (_readerthread):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "Traceback (most recent call last):"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1075, in _bootstrap_inner"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self.run()"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\threading.py\", line 1012, in run"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    self._target(*self._args, **self._kwargs)"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"C:\\Users\\huangchenghao\\AppData\\Roaming\\uv\\python\\cpython-3.12.13-windows-x86_64-none\\Lib\\subprocess.py\", line 1599, in _readerthread"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "    buffer.append(fh.read())"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "                  ^^^^^^^^^"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "  File \"<frozen codecs>\", line 322, in decode"
        },
        {
          "t": "",
          "lvl": "error",
          "msg": "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xce in position 6: invalid continuation byte"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "环境建立智能体输出 - 环境可用：True；目标模式：source_tree"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[static] [----------------------------] 1/232   0.4%    0s OpenRT-main/eval.py\r[static] [########--------------------] 73/232  31.5%    0s kbox/implementations/autodan_turbo_r/autodan_turbo_r.py\r[static] [###############-------------] 132/232  56.9%    0s enRT/attacks/blackbox/implementations/HADES/__init__.py\r[static] [#######################-----] 193/232  83.2%    0s OpenRT-main/OpenRT/core/async_orchestrator.py\r[static] [############################] 232/232 100.0%    0s OpenRT-main/OpenRT/utils/text_processing.py"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[static] [############################] 232/232 100.0%    0s 完成"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "本地静态候选发现 - 原始候选数：16；过滤后候选数：16"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "流式候选验证启动 - 批次：static；原因：本地静态候选已产生，先对高优先级候选进行流式筛选验证。"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-1 开始验证：VULN-001:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py:321"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-2 开始验证：VULN-002:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py:647"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-3 开始验证：VULN-003:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py:101"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-4 开始验证：VULN-004:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py:224"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "流式候选验证输出 - 批次：static；已验证候选：['VULN-001', 'VULN-002', 'VULN-003', 'VULN-004']"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选发现规划智能体输出 - 策略：候选发现规划智能体未运行或失败，使用本地默认分片策略。；启用专长：默认全量"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "启动 2 个 A3S agent，执行 8 个候选发现任务"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选发现智能体启动 - 任务数：8；并发数：2"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "内存安全候选发现智能体 分析 8 个文件"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "权限认证候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [###-------------------------] 1/8  12.5%    3s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "解析器序列化候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [#######---------------------] 2/8  25.0%    4s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "动态输入候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [##########------------------] 3/8  37.5%    7s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "配置密钥候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [##############--------------] 4/8  50.0%    8s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "并发资源候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [#################-----------] 5/8  62.5%   11s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "低关注面候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [#####################-------] 6/8  75.0%   13s 已发现 0 个"
        },
        {
          "t": "discovery",
          "lvl": "info",
          "msg": "通用候选发现智能体 分析 8 个文件"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[discover] [########################----] 7/8  87.5%   16s 已发现 0 个\r[discover] [############################] 8/8 100.0%   17s 已发现 0 个"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选发现汇总 - 本地静态候选数：16；Agent 候选数：0"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选合并排序智能体启动 - 输入候选数：16；发送给排序智能体候选数：16"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "候选合并排序智能体输出 - 验证队列数：0；合并组数：0"
        },
        {
          "t": "candidates",
          "lvl": "info",
          "msg": "已选择 16 个候选进入漏洞验证"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "验证任务规划智能体输出 - 策略：验证任务规划智能体未运行或失败，使用本地默认批次。；批次数：12"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "启动 4 个 A3S agent，并发验证 12 个批次"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞验证智能体启动 - 验证批次数：12；并发数：4"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-5 开始验证：VULN-009:OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/bert_toxic.py:13"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-6 开始验证：VULN-005:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py:540"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-7 开始验证：VULN-006:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py:64"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-8 开始验证：VULN-007:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py:103"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [##--------------------------] 1/12   8.3%    4s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-9 开始验证：VULN-008:OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py:143"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [####------------------------] 2/12  16.7%    6s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-10 开始验证：VULN-010:OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py:100"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [#######---------------------] 3/12  25.0%    7s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-11 开始验证：VULN-011:OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py:169"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [#########-------------------] 4/12  33.3%    9s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-12 开始验证：VULN-012:OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py:288"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [###########-----------------] 5/12  41.7%   11s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-13 开始验证：VULN-013:OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/attack.py:203"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [##############--------------] 6/12  50.0%   12s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-14 开始验证：VULN-014:OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py:64"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [################------------] 7/12  58.3%   14s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-15 开始验证：VULN-016:OpenRT-main/OpenRT/models/implementations/huggingface_model.py:86"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [##################----------] 8/12  66.7%   15s 已确认 0 个"
        },
        {
          "t": "validate",
          "lvl": "info",
          "msg": "agent-16 开始验证：VULN-015:OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py:154"
        },
        {
          "t": "",
          "lvl": "info",
          "msg": "\r[validate] [#####################-------] 9/12  75.0%   17s 已确认 0 个\r[validate] [#######################-----] 10/12  83.3%   17s 已确认 0 个\r[validate] [#########################---] 11/12  91.7%   18s 已确认 0 个\r[validate] [############################] 12/12 100.0%   19s 已确认 0 个"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "跨批次确认结果聚合校正 - 候选总数：16；验证结论总数：0"
        },
        {
          "t": "stage",
          "lvl": "info",
          "msg": "漏洞验证汇总 - 验证候选数：16；流式已验证候选数：4"
        },
        {
          "t": "summary",
          "lvl": "info",
          "msg": "确认漏洞数：0"
        },
        {
          "t": "summary",
          "lvl": "info",
          "msg": "最终总结：C:\\Users\\huangchenghao\\Downloads\\InternShannon-Vulnerability-Detect-dev-pub\\InternShannon-Vulnerability-Detect-dev-pub\\output\\src_20260914_173934_382488\\SUMMARY.md"
        }
      ],
      "size": 10494
    }
  },
  "findingsByJob": {
    "src_20260914_174801_197734": [],
    "src_20260914_173934_382488": []
  },
  "candidatesByJob": {
    "src_20260914_174801_197734": [
      {
        "id": "VULN-009",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/bert_toxic.py",
        "line": 13,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 13,
            "text": "model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-001",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
        "line": 321,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 321,
            "text": "exec(code, exec_globals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-002",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
        "line": 647,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 647,
            "text": "exec(tool_to_execute.tool_code, exec_globals, exec_locals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-003",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
        "line": 101,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 101,
            "text": "exec(self.tool_code, exec_globals, exec_locals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-004",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
        "line": 224,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 224,
            "text": "exec(self.tool_code, exec_globals, exec_locals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-005",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
        "line": 540,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 540,
            "text": "exec(evolved_code, env)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-006",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
        "line": 64,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 64,
            "text": "exec(ai_tool_code)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-007",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
        "line": 103,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 103,
            "text": "exec(roleplay_tool_code)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-008",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
        "line": 143,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 143,
            "text": "exec(strategy_tool_code)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-010",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
        "line": 100,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 100,
            "text": "self.model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-011",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
        "line": 169,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 169,
            "text": "steer_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-012",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
        "line": 288,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 288,
            "text": "self.hf_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-013",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/attack.py",
        "line": 203,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 203,
            "text": "self.hf_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-014",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
        "line": 64,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 64,
            "text": "self.hf_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-016",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/models/implementations/huggingface_model.py",
        "line": 86,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 86,
            "text": "self.model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-015",
        "project_id": "src_20260914_174801_197734",
        "suspected_severity": "medium",
        "suspected_category": "Crypto Weakness",
        "status": "probing",
        "title": "Weak hash algorithm appears in security-sensitive code.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
        "line": 154,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Weak hash algorithm appears in security-sensitive code.",
          "Weak hashes are unsuitable for passwords, signatures, and integrity checks."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 154,
            "text": "return hashlib.md5(content.encode()).hexdigest()[:8]",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      }
    ],
    "src_20260914_173934_382488": [
      {
        "id": "VULN-009",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/JAM/bert_toxic.py",
        "line": 13,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 13,
            "text": "model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-001",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
        "line": 321,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 321,
            "text": "exec(code, exec_globals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-002",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/ai_agents/external_power_tools.py",
        "line": 647,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 647,
            "text": "exec(tool_to_execute.tool_code, exec_globals, exec_locals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-003",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
        "line": 101,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 101,
            "text": "exec(self.tool_code, exec_globals, exec_locals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-004",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
        "line": 224,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 224,
            "text": "exec(self.tool_code, exec_globals, exec_locals)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-005",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/data_structures/ai_tool_system.py",
        "line": 540,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 540,
            "text": "exec(evolved_code, env)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-006",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
        "line": 64,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 64,
            "text": "exec(ai_tool_code)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-007",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
        "line": 103,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 103,
            "text": "exec(roleplay_tool_code)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-008",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/blackbox/implementations/evosynth/exec_env/test_ai_response.py",
        "line": 143,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 143,
            "text": "exec(strategy_tool_code)",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-010",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
        "line": 100,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 100,
            "text": "self.model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-011",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
        "line": 169,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 169,
            "text": "steer_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-012",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/asa/attack.py",
        "line": 288,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 288,
            "text": "self.hf_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-013",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/imperceptible_jailbreak/attack.py",
        "line": 203,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 203,
            "text": "self.hf_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-014",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
        "line": 64,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 64,
            "text": "self.hf_model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-016",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "critical",
        "suspected_category": "Code Injection",
        "status": "probing",
        "title": "Dynamic code execution API is used.",
        "file": "OpenRT-main/OpenRT/models/implementations/huggingface_model.py",
        "line": 86,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Dynamic code execution API is used.",
          "User-controlled expressions can execute arbitrary code."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 86,
            "text": "self.model.eval()",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      },
      {
        "id": "VULN-015",
        "project_id": "src_20260914_173934_382488",
        "suspected_severity": "medium",
        "suspected_category": "Crypto Weakness",
        "status": "probing",
        "title": "Weak hash algorithm appears in security-sensitive code.",
        "file": "OpenRT-main/OpenRT/attacks/whitebox/implementations/visual_jailbreak/attack.py",
        "line": 154,
        "confidence": 0.7,
        "source": "static",
        "why_suspicious": [
          "Weak hash algorithm appears in security-sensitive code.",
          "Weak hashes are unsuitable for passwords, signatures, and integrity checks."
        ],
        "counter_evidence": [],
        "next_action": "等待 A3S 复核或人工确认。",
        "code_snippet": [
          {
            "ln": 154,
            "text": "return hashlib.md5(content.encode()).hexdigest()[:8]",
            "highlight": true
          }
        ],
        "rejection_reason": "",
        "validation_verdict": ""
      }
    ]
  },
  "probesByJob": {
    "src_20260914_174801_197734": [],
    "src_20260914_173934_382488": []
  },
  "patchesByJob": {
    "src_20260914_174801_197734": [],
    "src_20260914_173934_382488": []
  }
};
