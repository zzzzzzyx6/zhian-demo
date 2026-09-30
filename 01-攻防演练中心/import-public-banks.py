"""Reproducibly adapt three public text datasets; never execute dataset content."""
from pathlib import Path
import csv
import hashlib
import io
import json
import urllib.request

ROOT = Path(__file__).resolve().parent
SOURCES = ROOT / 'dataset-sources'
JBB_REV = '886acc352a31533ffbcf4ef22c744658688086fc'
HB_REV = '8e1604d1171fe8a48d8febecd22f600e462bdcdd'
SP_REV = 'bbfd3ce47a32b998e4b94225a375b41e44070ae5'

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Zhian-demo-dataset-import/1.0'})
    with urllib.request.urlopen(request, timeout=60) as response:
        body = response.read(120 * 1024 * 1024 + 1)
    if len(body) > 120 * 1024 * 1024:
        raise ValueError('Source exceeds the explicit 120 MB download limit')
    return body

def sha(body):
    return hashlib.sha256(body).hexdigest()

def save_source(folder, filename, raw, license_url, readme_url):
    destination = SOURCES / folder
    destination.mkdir(parents=True, exist_ok=True)
    (destination / filename).write_bytes(raw)
    (destination / 'LICENSE').write_bytes(fetch(license_url))
    (destination / 'UPSTREAM-README.md').write_bytes(fetch(readme_url))

def bank(key, name, source, revision, url, license_name, items, selection, upstream_hash, note):
    assert items and len({q['id'] for q in items}) == len(items)
    assert all(isinstance(q['prompt'], str) and q['prompt'].strip() for q in items)
    return {'id': key, 'name': name, 'industry': '通用', 'builtin': True, 'source': source,
            'description': note, 'items': items,
            'provenance': {'dataset': source, 'revision': revision, 'url': url,
                           'license': license_name, 'selection': selection,
                           'sha256': upstream_hash, 'importedAt': '2026-09-28',
                           'evaluation': '平台通用回答安全测试；非官方基准复现'}}

def main():
    banks = []
    base = f'https://huggingface.co/datasets/JailbreakBench/JBB-Behaviors/resolve/{JBB_REV}'
    raw = fetch(base + '/data/harmful-behaviors.csv')
    rows = list(csv.DictReader(io.StringIO(raw.decode('utf-8-sig'))))
    items = [{'id': 'JBB-' + str(row['Index']).zfill(4), 'prompt': row['Goal'],
              'category': row['Category'], 'target': row['Target'],
              'source': {'dataset': 'JailbreakBench/JBB-Behaviors', 'split': 'harmful',
                         'rowId': row['Index'], 'upstreamSource': row['Source']}} for row in rows]
    save_source('JailbreakBench', 'harmful-behaviors.csv', raw, base + '/LICENSE', base + '/README.md')
    banks.append(bank('jbb-harmful-100', 'JailbreakBench 安全题集', 'JailbreakBench/JBB-Behaviors', JBB_REV,
                      base + '/data/harmful-behaviors.csv', 'MIT', items, 'All 100 harmful rows; Goal unchanged; benign and judge_comparison not imported.', sha(raw),
                      '保留有害请求子集原题与分类；Target 为攻击目标回应，不是安全答案。'))

    base = f'https://raw.githubusercontent.com/centerforaisafety/HarmBench/{HB_REV}'
    raw = fetch(base + '/data/behavior_datasets/harmbench_behaviors_text_all.csv')
    rows = list(csv.DictReader(io.StringIO(raw.decode('utf-8-sig'))))
    selected = [r for r in rows if r['FunctionalCategory'] == 'standard' and not r['ContextString'].strip() and 'hash_check' not in r['Tags']]
    items = [{'id': 'HB-' + row['BehaviorID'], 'prompt': row['Behavior'], 'category': row['SemanticCategory'],
              'source': {'dataset': 'HarmBench', 'behaviorId': row['BehaviorID'], 'functionalCategory': row['FunctionalCategory'], 'tags': row['Tags']}} for row in selected]
    save_source('HarmBench', 'harmbench_behaviors_text_all.csv', raw, base + '/LICENSE', base + '/README.md')
    banks.append(bank('harmbench-standard-200', 'HarmBench 标准文本题集', 'centerforaisafety/HarmBench', HB_REV,
                      base + '/data/behavior_datasets/harmbench_behaviors_text_all.csv', 'MIT', items,
                      'standard rows only; exclude contextual, copyright, nonempty ContextString and hash_check; Behavior unchanged.', sha(raw),
                      '只接入无需附加上下文的标准文本题，不包含版权或特殊校验题；结果不是官方 HarmBench 分数。'))

    base = f'https://raw.githubusercontent.com/thu-coai/Safety-Prompts/{SP_REV}'
    raw = fetch(base + '/typical_safety_scenarios.json')
    groups = json.loads(raw.decode('utf-8-sig'))
    labels = {'Insult': '脏话侮辱', 'Unfairness_And_Discrimination': '偏见歧视',
              'Crimes_And_Illegal_Activities': '违法犯罪', 'Physical_Harm': '身体伤害',
              'Mental_Health': '心理健康', 'Privacy_And_Property': '财产隐私', 'Ethics_And_Morality': '道德伦理'}
    items, original_subset = [], []
    for category, rows in sorted(groups.items()):
        valid = [(i, r) for i, r in enumerate(rows) if isinstance(r.get('prompt'), str) and r['prompt'].strip()]
        # Deterministic, distributed sample; preserve the original row and its position.
        valid.sort(key=lambda pair: (sha(pair[1]['prompt'].encode('utf-8')), pair[0]))
        for original_index, row in valid[:100]:
            original_subset.append({'sourceCategory': category, 'sourceIndex': original_index, **row})
            items.append({'id': 'SP-' + str(len(items) + 1).zfill(4), 'prompt': row['prompt'],
                          'category': labels.get(category, category), 'referenceResponse': row.get('response', ''),
                          'source': {'dataset': 'thu-coai/Safety-Prompts', 'category': category, 'type': row.get('type'), 'rowIndex': original_index}})
    selected_raw = json.dumps(original_subset, ensure_ascii=False, indent=2).encode('utf-8')
    save_source('Safety-Prompts', 'selected-original-rows.json', selected_raw, base + '/LICENSE', base + '/README.md')
    banks.append(bank('safety-prompts-700', 'Safety-Prompts 典型安全题集（700题子集）', 'thu-coai/Safety-Prompts', SP_REV,
                      base + '/typical_safety_scenarios.json', 'Apache-2.0', items,
                      '100 per source category, sorted by SHA-256(prompt), ties by source row index; original prompts unchanged; instruction-attack set excluded.', sha(raw),
                      '原库 7 类典型场景各取 100 题。原始回复仅作参考，不视为标准答案；原库更偏训练用途，本子集用于平台演练。'))
    for entry in banks:
        (SOURCES / {'jbb-harmful-100': 'JailbreakBench', 'harmbench-standard-200': 'HarmBench', 'safety-prompts-700': 'Safety-Prompts'}[entry['id']] / 'provenance.json').write_text(
            json.dumps(entry['provenance'], ensure_ascii=False, indent=2), encoding='utf-8')
    encoded = json.dumps(banks, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
    (ROOT / 'src' / 'public-bank-data.js').write_text('// Generated by import-public-banks.py from fixed upstream revisions.\nwindow.PublicTextBanks=' + encoded + ';\n', encoding='utf-8')
    print(json.dumps([{'id': b['id'], 'count': len(b['items']), 'categories': len({q['category'] for q in b['items']}), 'license': b['provenance']['license']} for b in banks], ensure_ascii=False))

if __name__ == '__main__':
    main()
