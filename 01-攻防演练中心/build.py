from pathlib import Path
import json
root=Path(__file__).resolve().parent
m=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
s=(root/'index.template.html').read_text(encoding='utf-8')
s=s.replace('/* APP_STYLES */','\n'.join((root/'src'/n).read_text(encoding='utf-8') for n in m['css']))
s=s.replace('/* APP_SCRIPTS */','\n'.join((root/'src'/n).read_text(encoding='utf-8') for n in m['js']))
(root/'index.html').write_text(s,encoding='utf-8')
