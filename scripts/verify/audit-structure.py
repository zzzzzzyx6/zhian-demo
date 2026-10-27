# -*- coding: utf-8 -*-
"""统计各模块文件里登记的代码段：数量、体积、以及方法被覆盖的次数（补丁链深度）。"""
import os, re, json

ROOT = r'C:\Users\huangchenghao\Desktop\zhian-demo\src'
files = sorted(os.path.join(dp, f) for dp, dn, fn in os.walk(ROOT) for f in fn if f.endswith('.js'))

print('=== 代码段分布 ===')
seg_total = 0
for p in files:
    if 'vendor' in p or p.endswith('boot.js'):
        continue
    t = open(p, encoding='utf-8').read()
    segs = list(re.finditer(r'AppParts\[[\'"]([^\'"]+)[\'"]\]\s*=', t))
    if not segs:
        continue
    seg_total += len(segs)
    print('\n%s  (%d KB, %d 段)' % (os.path.relpath(p, ROOT).replace('\\', '/'), os.path.getsize(p) // 1024, len(segs)))
    rows = []
    for i, m in enumerate(segs):
        end = segs[i + 1].start() if i + 1 < len(segs) else len(t)
        rows.append((end - m.start(), m.group(1)))
    for size, name in sorted(rows, reverse=True)[:6]:
        print('   %7d B  %s' % (size, name))
    if len(rows) > 6:
        print('   …其余 %d 段，合计 %d B' % (len(rows) - 6, sum(s for s, _ in sorted(rows)[:-6])))
print('\n代码段合计', seg_total)

print('\n=== 同名方法被重复定义最多的（补丁链） ===')
counts = {}
for p in files:
    if 'vendor' in p:
        continue
    t = open(p, encoding='utf-8').read()
    for m in re.finditer(r'\b([A-Za-z_$][\w$]*)\.([A-Za-z_]\w*)\s*=(?![=>])', t):
        ns, prop = m.group(1), m.group(2)
        if ns in ('AppParts', 'window', 'const', 'let', 'var'):
            continue
        if prop in ('onclick', 'innerHTML', 'value', 'style', 'className', 'textContent', 'dataset'):
            continue
        counts.setdefault(prop, []).append(os.path.basename(p))
top = sorted(counts.items(), key=lambda kv: -len(kv[1]))[:22]
for prop, fs in top:
    print('  %-24s %2d 次  %s' % (prop, len(fs), ', '.join(sorted(set(fs)))))
