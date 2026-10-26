from pathlib import Path
import json
import re


def read_inline_script(path):
    script = path.read_text(encoding='utf-8')
    # HTML parses these tokens before JavaScript string escaping takes effect.
    unsafe = re.search(r'</?script\b|<!--', script, flags=re.IGNORECASE)
    if unsafe:
        line = script.count('\n', 0, unsafe.start()) + 1
        raise ValueError(
            f'{path.name}:{line}: unsafe inline script token {unsafe.group()!r}; '
            "encode '<' as '\\u003c' in embedded HTML strings"
        )
    return script


root=Path(__file__).resolve().parent
m=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
if 'scan-restored-document.js' in m['js']:
    from build_scan_original import build as build_scan_original
    build_scan_original()
s=(root/'index.template.html').read_text(encoding='utf-8')
s=s.replace('/* APP_STYLES */','\n'.join((root/'src'/n).read_text(encoding='utf-8') for n in m['css']))
s=s.replace('/* APP_SCRIPTS */','\n'.join(read_inline_script(root/'src'/n) for n in m['js']))
(root/'index.html').write_text(s,encoding='utf-8')
