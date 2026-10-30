# -*- coding: utf-8 -*-
"""剪枝死页面头 CSS v4（最终版）。

语义：
- 先对选择器做 :is()/:has() 组内死成员摘除（补回左括号！），组全空 → 该选择器不可匹配 → 判死。
- 摘除后仍含死类 token（组外）→ 判死。
- 全部逗号选择器判死 → 删整条规则；部分死 → 只保留活选择器（已摘除组内死成员）。
- @media 递归；内层空 → 删整个 @media。
- 注释先用占位符保护（与浏览器「/* 到第一个 *​/」语义一致）。
"""
import re, io

DEAD = ['attack-detail-top', 'wb-heading', 'setup-page-head']
EMPTY = '\x00EMPTYGROUP\x00'

src = io.open('src/styles/app.css', encoding='utf-8').read()

comments = []
def stash(m):
    comments.append(m.group(0))
    return f'\x00C{len(comments)-1}\x00'
src = re.sub(r'/\*.*?\*/', stash, src, flags=re.S)

def split_selectors(sel):
    parts, depth, cur = [], 0, ''
    for ch in sel:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur); cur = ''
        else:
            cur += ch
    if cur.strip():
        parts.append(cur)
    return parts

def strip_dead_groups(sel):
    """摘除 :is()/:has() 组内死成员；组全空返回 None。"""
    prev = None
    while prev != sel:
        prev = sel
        def fix(m):
            keep = [x for x in m.group(2).split(',') if not any(d in x for d in DEAD)]
            if not keep:
                return EMPTY
            return m.group(1) + '(' + ','.join(keep) + ')'
        sel = re.sub(r'(:is|:has)\(([^()]*)\)', fix, sel)
        if EMPTY in sel:
            return None
    return sel

def process_selector(sel):
    """返回清洗后的活选择器；不可匹配返回 None。"""
    cleaned = strip_dead_groups(sel)
    if cleaned is None:
        return None
    bare = re.sub(r'\x00C\d+\x00', '', cleaned)
    if any(d in bare for d in DEAD):
        return None
    return cleaned

removed = {'rules': 0, 'media': 0, 'sels': 0}

def prune_block(text):
    out = []
    i, n = 0, len(text)
    buf = ''
    while i < n:
        c = text[i]
        if c == '{':
            j, depth = i, 0
            while j < n:
                if text[j] == '{':
                    depth += 1
                elif text[j] == '}':
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            body = text[i:j + 1]
            head = buf
            buf = ''
            bare = re.sub(r'\x00C\d+\x00', '', head).strip()
            if bare.startswith('@'):
                inner = prune_block(body[body.index('{') + 1:body.rindex('}')])
                if inner.strip():
                    out.append(head + '{' + inner + '}')
                else:
                    removed['media'] += 1
            else:
                kept = []
                for s in split_selectors(head):
                    p = process_selector(s)
                    if p is None:
                        removed['sels'] += 1
                    else:
                        kept.append(p)
                if not kept:
                    removed['rules'] += 1
                else:
                    out.append(','.join(kept) + body)
            i = j + 1
            continue
        buf += c
        i += 1
    return ''.join([*out, buf])

result = prune_block(src)
result = re.sub(r'\x00C(\d+)\x00', lambda m: comments[int(m.group(1))], result)

io.open('src/styles/app.css', 'w', encoding='utf-8', newline='').write(result)

print('removed rules:', removed['rules'], '| removed empty @media:', removed['media'], '| removed dead selectors:', removed['sels'])
nocmt = re.sub(r'/\*.*?\*/', '', result, flags=re.S)
for d in DEAD:
    print('live residual', d, ':', nocmt.count(d))
# 括号配对完整性：:is( 与 :has( 的开括号数 = 对应闭括号数
print('paren sanity :is(', nocmt.count(':is('), ' :has(', nocmt.count(':has('))
