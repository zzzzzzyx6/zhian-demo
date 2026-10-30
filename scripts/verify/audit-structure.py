# -*- coding: utf-8 -*-
"""静态检查入口、代码段登记和启动表；不执行产品代码，无第三方依赖。"""
from pathlib import Path
from collections import Counter
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
PART = re.compile(r"AppParts\[['\"]([^'\"]+)['\"]\]\s*=")


def main():
    html = (ROOT / 'index.html').read_text(encoding='utf-8-sig')
    refs = re.findall(r'(?:src|href)="([^"]+)"', html)
    local = [r for r in refs if not re.match(r'(?:https?:|data:|#|mailto:)', r)]
    problems = [f'入口引用不存在：{r}' for r in local if not (ROOT / r).is_file()]
    registered = []
    print('模块文件 / KiB / 代码段数')
    for path in sorted((ROOT / 'src/modules').rglob('*.js')):
        parts = PART.findall(path.read_text(encoding='utf-8-sig'))
        rel = path.relative_to(ROOT).as_posix()
        print(f'{rel}: {path.stat().st_size / 1024:.1f} / {len(parts)}')
        if rel not in local:
            problems.append(f'模块未由入口加载：{rel}')
        expected = path.relative_to(ROOT / 'src/modules').with_suffix('').as_posix()
        if parts != [expected]:
            problems.append(f'模块应只登记与文件路径一致的代码段：{rel}')
        registered.extend(parts)
    boot = (ROOT / 'src/boot.js').read_text(encoding='utf-8-sig')
    order = re.findall(r"^\s*'([^']+)',", boot, re.M)
    for label, names in [('登记', registered), ('启动', order)]:
        for name, count in Counter(names).items():
            if count > 1:
                problems.append(f'{label}重复：{name}（{count} 次）')
    for name in sorted(set(order) - set(registered)):
        problems.append(f'启动段不存在：{name}')
    print(f'\n登记 {len(registered)} 段，启动 {len(order)} 段')
    for name in sorted(set(registered) - set(order)):
        problems.append(f'代码段未进入启动表：{name}')
    print('\n本工具只检查登记与引用，不推断死代码或方法覆盖链深度。')
    for problem in problems:
        print('错误：' + problem)
    print(f'结构检查：{len(problems)} 个错误')
    return bool(problems)


if __name__ == '__main__':
    sys.exit(main())
