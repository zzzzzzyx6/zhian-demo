"""Embed the supplied scan UI, adapting only platform navigation and data boundaries."""
from pathlib import Path
import json
from html import escape as escape_html

ROOT = Path(__file__).resolve().parent


def build():
    base = ROOT / 'src' / 'scan-original'
    script = (base / 'app.js').read_text('utf-8')

    def replace(old, new):
        nonlocal script
        if old not in script:
            raise ValueError('Original scan adapter anchor missing: ' + old[:100])
        script = script.replace(old, new)

    replace('  var D = window.DEMO_DATA;', '''  var D = {projects:[],posture:{targets:[]},modelConfigs:[],findings:[],candidates:[],probes:[],patches:[],trashItems:[],artifactsByJob:{},nodesByJob:{},activityByJob:{},logsByJob:{},findingsByJob:{},candidatesByJob:{},probesByJob:{},patchesByJob:{}};
  var embeddedRoute = '/scan/code', loaded = false;
  function send(action, extra) { parent.postMessage(Object.assign({type:'scan-restored-action',action:action},extra||{}),'*'); }
  function navigate(path) { send('navigate',{path:path}); }
''')
    replace("    var tt = String(p.target_type || '');", "    if (p.platformCategory) return p.platformCategory;\n    var tt = String(p.target_type || '');")
    replace('D.findings.find(function', '(D.findingsByJob[STATE.projectId] || D.findings).find(function')
    replace('D.candidates.find(function', '(D.candidatesByJob[STATE.projectId] || D.candidates).find(function')
    replace("    var raw = String(location.hash || '').replace(/^#/, '');", "    var raw = embeddedRoute;")
    replace("location.hash.replace(/^#/, '')", "embeddedRoute")
    replace("location.hash === '#/scan/new'", "embeddedRoute === '/scan/new'")
    replace("      STATE.tab = 'run';", "      STATE.tab = loadedTab || 'run';")
    # A completed historical task without a recorded duration is not still running.
    script = script.replace("project.duration ? fmtDuration(project.duration) : '进行中'", "project.duration ? fmtDuration(project.duration) : project.status === 'running' ? '进行中' : '未记录'")
    script = script.replace("p.duration ? fmtDuration(p.duration) : '进行中'", "p.duration ? fmtDuration(p.duration) : p.status === 'running' ? '进行中' : '未记录'")
    replace("Sidebar(navPath) + '<main class=\"main\">'", "'<main class=\"main\">'")
    replace("      window.location.hash = '#/scan/new';", "      navigate('/scan/new');")
    replace("      window.location.hash = back;", "      navigate(back);")
    replace("      window.location.hash = e.currentTarget.getAttribute('data-goto');", "      navigate(e.currentTarget.getAttribute('data-goto').replace(/^#/,''));")
    replace("title=\"演示环境为静态快照，不支持删除\"", "title=\"删除任务\"")
    # Use the platform task list's 24-unit trash glyph and button style in the embedded scanner too.
    trash_path = 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6'
    replace('    var p = PATHS[name];', '''    if (name === 'trash') return '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="''' + trash_path + '''"/></svg>';
    var p = PATHS[name];''')
    replace('class="btn sm danger" data-del=', 'class="entry-delete" type="button" aria-label="删除任务" data-del=')
    replace("icon('x', 11) + ' 删除</button>'", "icon('trash', 16) + '</button>'")
    replace('class="btn danger" id="btn-del"', 'class="entry-delete" type="button" aria-label="删除任务" id="btn-del"')
    replace("icon('x', 12) + ' 删除</button>'", "icon('trash', 16) + '</button>'")
    replace('class="model-action danger" data-mdel=', 'class="entry-delete" type="button" data-mdel=')
    replace('''<button class="btn danger" id="m-del-confirm">删除</button></div>''', '''<button class="entry-delete" type="button" title="确认删除" aria-label="确认删除模型" id="m-del-confirm">' + icon('trash',16) + '</button></div>''')
    replace("onClick(root, '#btn-del', function () { demoToast('演示环境为静态快照，删除操作不会生效。'); });", "onClick(root, '#btn-del', function () { send('delete',{taskId:STATE.projectId}); });")
    replace("onClick(root, '#btn-stop', function () { demoToast('演示环境没有运行中的任务可停止。'); });", "onClick(root, '#btn-stop', function () { send('stop',{taskId:STATE.projectId}); });")
    replace("onClick(root, '#btn-refresh', function () { demoToast('演示数据为静态快照，无需刷新。'); });", "onClick(root, '#btn-refresh', function () { send('refresh'); });")
    replace("'<button class=\"btn primary\" data-np-open=\"' + esc(catId)", "'<button class=\"btn\" data-platform-recycle>回收记录</button><button class=\"btn primary\" data-np-open=\"' + esc(catId)")
    replace("    var root = document.getElementById('root');\n\n    // tabs / segs", "    var root = document.getElementById('root');\n    onClick(root, '[data-platform-recycle]', function(){send('recycle');});\n\n    // tabs / segs")
    # Existing platform report eligibility remains authoritative.
    replace("    var tab = STATE.tab;\n    var tabsHtml", "    var tab = STATE.tab;\n    if(project.reportEligible === false) { tabs = tabs.filter(function(t){return t.id !== 'report';}); tab = STATE.tab = 'run'; }\n    var tabsHtml")
    replace("      reportActions +", "      (project.reportEligible === false ? '' : reportActions) +")
    replace("      if (!project) return;\n      var md = reportToMarkdown", "      if (!project || project.reportEligible === false) return;\n      var md = reportToMarkdown")
    intro = escape_html((base / 'intro.html').read_text('utf-8'), quote=True)
    replace("'<iframe class=\"intro-frame\" src=\"assets/intro.html\" title=\"产品介绍页\"></iframe>'", json.dumps('<iframe class="intro-frame" srcdoc="' + intro + '" title="产品介绍页"></iframe>', ensure_ascii=False))
    # Retain the supplied form, adding the version name required by the platform asset model.
    replace("      sec('检测目标') + targetRelField + targetInner +", "      sec('检测目标') + targetRelField + targetInner +\n      (isWeb ? '' : field('版本名称 *', '<input class=\"input\" required maxlength=\"120\" data-np=\"version_name\" value=\"' + esc(STATE.np.version_name||'') + '\" placeholder=\"如 release-2026.10\"/>')) +")
    replace("POSTURE.targets.filter(function(t){ return catId === 'web' ? t.type.indexOf('Web') !== -1 : t.type.indexOf('Web') === -1; })", "POSTURE.targets.filter(function(t){ return t.platformCategory === catId; })")
    start = script.index("    onClick(root, '#btn-np-create', function () {")
    end = script.index('\n    // models', start)
    script = script[:start] + '''    onClick(root, '#btn-np-create', function () {
      if (STATE.np.reading) { STATE.npError='请等待文件校验完成。'; render(); return; }
      if (!STATE.np.name.trim()) { STATE.npError='请填写任务名称。'; render(); return; }
      if (!STATE.np.model_config_id) { STATE.npError='请选择大模型配置。'; render(); return; }
      if (STATE.np.category !== 'web' && !String(STATE.np.version_name||'').trim()) { STATE.npError='请填写版本名称。'; render(); return; }
      send('create',{draft:STATE.np});
    });
''' + script[end:]
    # Keep file bytes in the browser; only metadata enters the platform's existing task creator.
    start = script.index("    root.querySelectorAll('[data-np-file]').forEach(function (el) {")
    end = script.index('    var tpInput', start)
    script = script[:start] + '''    async function readTarget(files, folder) {
      files=Array.from(files||[]);if(!files.length)return;
      var draft=STATE.np, total=files.reduce(function(n,f){return n+f.size;},0);
      draft.upload=null;draft.reading=true;STATE.npError='';
      try {
        if(total<=0||total>2*1024*1024*1024||files.length>10000)throw Error('目标须大于 0 且不超过 2 GB，最多 10,000 个文件。');
        var hashes=[];
        for(var file of files){
          var digest=await crypto.subtle.digest('SHA-256',await file.arrayBuffer());
          hashes.push((file.webkitRelativePath||file.name)+':'+Array.from(new Uint8Array(digest),function(v){return v.toString(16).padStart(2,'0');}).join(''));
        }
        if(STATE.np!==draft)return;
        var combined=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(hashes.sort().join('\\n')));
        draft.targetName=folder?(files[0].webkitRelativePath||files[0].name).split('/')[0]:files[0].name;
        draft.targetKind=folder?'目录':files.length>1?'多个文件':'文件';draft.targetFiles=files.length;
        draft.upload={name:draft.targetName,size:total,sha256:Array.from(new Uint8Array(combined),function(v){return v.toString(16).padStart(2,'0');}).join('')};
        draft.target_path='';if(!draft.name.trim())draft.name=draft.targetName;
      }catch(error){STATE.npError=error.message;}finally{draft.reading=false;render();}
    }
    root.querySelectorAll('[data-np-file]').forEach(function(el){el.addEventListener('change',function(){readTarget(el.files,el.getAttribute('data-np-file')==='folder');});});
    var drop=root.querySelector('.drop');if(drop){drop.addEventListener('dragover',function(e){e.preventDefault();});drop.addEventListener('drop',function(e){e.preventDefault();readTarget(e.dataTransfer.files,false);});}
''' + script[end:]
    replace("      STATE.np.targetName = seg;", "      STATE.np.upload = null;\n      STATE.np.targetName = seg;")
    # The outer platform handles all navigation; no nested sidebar/account/model store.
    replace("  modelStoreLoad();\n  render();", (base / 'bridge.js').read_text('utf-8'))
    # Adapt presentation terminology while preserving the supplied vendor sources.
    script = script.replace('源码', '代码')
    replace("return String(v == null ? '' : v)", "return String(v == null ? '' : v).replace(/源码/g, '代码')")
    css = '\n'.join((base / name).read_text('utf-8') for name in ['app.css', 'demo.css', 'zhian-theme.css'])
    css += (base / 'embed.css').read_text('utf-8')
    css += (ROOT / 'src' / 'typography-system.css').read_text('utf-8')
    css += (ROOT / 'src' / 'entry-management.css').read_text('utf-8')
    css += (ROOT / 'src' / 'list-consistency.css').read_text('utf-8')
    css += (ROOT / 'src' / 'silver-system.css').read_text('utf-8')
    script = (ROOT / 'src' / 'list-presentation.js').read_text('utf-8') + '\n' + script
    # Keep absolute scan timestamps aligned with the outer platform timezone.
    start = script.index('  function fmtAbs(ts) {')
    end = script.index('  function fmtBytes', start)
    script = script[:start] + "  function fmtAbs(ts) { return window.ListPresentation.time(ts ? ts * 1000 : null); }\n" + script[end:]
    script = script.replace("    var bodyAfter = document.querySelector('.page-body');", "    root.innerHTML = window.ListPresentation.html(root.innerHTML);\n    var bodyAfter = document.querySelector('.page-body');")
    document = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + css + '</style></head><body><div id="root"></div><script>' + script + '</script></body></html>'
    encoded = json.dumps(document, ensure_ascii=False).replace('<', '\\u003c')
    (ROOT / 'src' / 'scan-restored-document.js').write_text('/* Generated from the supplied ZIP scan module. */\nwindow.ScanRestoredDocument=' + encoded + ';\n', 'utf-8')


if __name__ == '__main__':
    build()
