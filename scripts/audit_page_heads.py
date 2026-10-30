#!/usr/bin/env python3
# 审计 src/modules 下所有页面级标题容器。
# 目标：找出所有“页面级标题”用的容器 class，标记是否为规范的 .page-heading，
#       并列出所有非规范页面头（setup-page-head/wb-heading/...）。
import re, glob, os

ROOT = 'C:/Users/huangchenghao/Desktop/zhian-demo/src/modules'
files = sorted(glob.glob(os.path.join(ROOT, '*.js')))

# 非规范页面头候选（不是 .page-heading、但承担“页面级标题行”语义的容器）
CANDIDATES = [
    'setup-page-head', 'wb-heading', 'arena-stage-head', 'attack-detail-top',
    'db-page-heading', 'prr-report-heading', 'scan-unified-heading',
    'exercise-task-heading', 'exercise-title-line', 'review-workspace',
    'lp-panel-head', 'ev-panel-head', 'db-card-head', 'wb-card-head',
    'analysis-report-title', 'api-section-head', 'pd-card-heading',
    'center-page-tabs',
]

def nearest_class_before(line, pos):
    pre = line[:pos]
    classes = re.findall(r'class="([^"]*)"', pre)
    return classes[-1] if classes else '(none)'

report = []
for f in files:
    base = os.path.basename(f)
    with open(f, encoding='utf-8') as fh:
        lines = fh.readlines()
    for i, line in enumerate(lines, 1):
        # 1) 每个 <h1 的最近容器 class（页面级 h1 通常是页面头）
        for m in re.finditer(r'<h1[^>]*>', line):
            nearest = nearest_class_before(line, m.start())
            end = line.find('</h1>', m.start())
            snippet = line[m.start():end] if end != -1 else line[m.start():m.start()+70]
            snippet = snippet.replace('\n', ' ')
            report.append((base, i, 'H1', nearest, snippet[:90]))
        # 2) 非规范候选容器出现
        for c in CANDIDATES:
            idx = 0
            while True:
                idx = line.find(c, idx)
                if idx == -1:
                    break
                report.append((base, i, 'CAND', c, line[max(0,idx-40):idx+len(c)+10].replace('\n',' ').strip()[:70]))
                idx += len(c)

# 输出分组
print('=== 页面级 H1 容器清单（就近 class） ===')
for base, i, kind, nearest, snip in report:
    if kind == 'H1':
        mark = 'OK(page-heading)' if 'page-heading' in nearest else '  <-- 非 page-heading'
        print(f'{base}:{i:>5}  container=[{nearest:32}] {mark}  {snip}')

print()
print('=== 非规范页面头候选出现位置 ===')
for base, i, kind, nearest, snip in report:
    if kind == 'CAND':
        print(f'{base}:{i:>5}  {nearest:28}  ...{snip}')

# 汇总
h1_total = sum(1 for r in report if r[2]=='H1')
h1_bad = sum(1 for r in report if r[2]=='H1' and 'page-heading' not in r[3])
cand = [(r[0],r[1],r[3]) for r in report if r[2]=='CAND']
print()
print(f'H1 总数={h1_total}  其中非 page-heading 容器={h1_bad}')
from collections import Counter
cc = Counter(c for _,_,c in cand)
print('候选容器命中统计:', dict(cc))
