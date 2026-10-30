import os
ROOT='C:/Users/huangchenghao/Desktop/zhian-demo/src/modules'

reps = {
'exercise.js': [
 # 219 models(): setup-page-head 内是 tabs + 按钮 -> 拆成 page-heading(h1+按钮) + tabs 在标题下
 ('''<div class="setup-page-head"><div class="tabs connection-kind-tabs"><button class="tab ${kind==='model'?'active':''}" onclick="App.attack.connectionKind='model';App.render()">模型</button><button class="tab ${kind==='agent'?'active':''}" onclick="App.attack.connectionKind='agent';App.render()">智能体</button></div><button class="btn primary" onclick="App.connections.open()">${I('plus',14)}${kind==='model'?'接入模型':'接入智能体'}</button></div>''',
  '''<div class="page-heading"><div><h1>模型资产</h1></div><div class="page-actions"><button class="btn primary" onclick="App.connections.open()">${I('plus',14)}${kind==='model'?'接入模型':'接入智能体'}</button></div></div><div class="tabs connection-kind-tabs"><button class="tab ${kind==='model'?'active':''}" onclick="App.attack.connectionKind='model';App.render()">模型</button><button class="tab ${kind==='agent'?'active':''}" onclick="App.attack.connectionKind='agent';App.render()">智能体</button></div>'''),
 # 222 settings()
 ('''<div class="setup-page-head"><div><h2>演练角色默认配置</h2><p class="muted">这里只指定谁生成测试、谁评价结果具体连接统一在「模型资产」管理</p></div><button class="btn primary" onclick="App.attack.saveSettings()">保存默认配置</button></div>''',
  '''<div class="page-heading"><div><h1>演练角色默认配置</h1><p class="page-desc">这里只指定谁生成测试、谁评价结果具体连接统一在「模型资产」管理</p></div><div class="page-actions"><button class="btn primary" onclick="App.attack.saveSettings()">保存默认配置</button></div></div>'''),
 # 267 banks 题库（多按钮）
 ('''<div class="setup-page-head"><h2>全部题库</h2><div class="flex"><button class="btn" onclick="App.banks.extractStart()">从攻击记录提取</button><button class="btn" onclick="App.banks.template()">下载 JSON 模板</button><button class="btn primary" onclick="App.banks.importDialog()">导入题库</button></div></div>''',
  '''<div class="page-heading"><div><h1>全部题库</h1></div><div class="page-actions"><div class="flex"><button class="btn" onclick="App.banks.extractStart()">从攻击记录提取</button><button class="btn" onclick="App.banks.template()">下载 JSON 模板</button><button class="btn primary" onclick="App.banks.importDialog()">导入题库</button></div></div></div>'''),
 # 678 banks 题库（单按钮，标题后有空格）
 ('''<div class="setup-page-head"><h2>全部题库 </h2><div class="flex"><button class="btn primary" onclick="App.banks.create()">新建题库</button></div></div>''',
  '''<div class="page-heading"><div><h1>全部题库</h1></div><div class="page-actions"><div class="flex"><button class="btn primary" onclick="App.banks.create()">新建题库</button></div></div></div>'''),
 # 2461 models 另一个
 ('''<div class="setup-page-head"><span class="muted">共 ${items.length} 个模型</span><button class="btn primary" onclick="App.connections.open()">${I('plus',14)}接入模型</button></div>''',
  '''<div class="page-heading"><div><h1>模型资产</h1><span class="muted page-desc">共 ${items.length} 个模型</span></div><div class="page-actions"><button class="btn primary" onclick="App.connections.open()">${I('plus',14)}接入模型</button></div></div>'''),
],
'policy.js': [
 # 133 攻击方法
 ('''<div class="setup-page-head"><div><h2>攻击方法</h2><p>统一管理方法分类、参数定义和文本模板，供攻击策略引用。</p></div><button class="btn primary" onclick="App.policies.newTemplate()">＋ 自定义模板</button></div>''',
  '''<div class="page-heading"><div><h1>攻击方法</h1><p class="page-desc">统一管理方法分类、参数定义和文本模板，供攻击策略引用。</p></div><div class="page-actions"><button class="btn primary" onclick="App.policies.newTemplate()">＋ 自定义模板</button></div></div>'''),
 # 139 攻击策略
 ('''<div class="setup-page-head"><div><h2>攻击策略</h2><p>组合攻击方法、方法参数与演练题库，发布后供攻防评估任务选择。</p></div><button class="btn primary" onclick="App.policies.edit()">＋ 新建策略</button></div>''',
  '''<div class="page-heading"><div><h1>攻击策略</h1><p class="page-desc">组合攻击方法、方法参数与演练题库，发布后供攻防评估任务选择。</p></div><div class="page-actions"><button class="btn primary" onclick="App.policies.edit()">＋ 新建策略</button></div></div>'''),
 # 218 攻击方法（末尾拼接）
 ('''<div class="setup-page-head"><div><h2>攻击方法</h2><p>查看系统集成的方法与明确变体，在攻击策略中选择并配置。</p></div><button class="btn primary" onclick="App.policies.newTemplate()">＋ 自定义模板</button></div>'+''',
  '''<div class="page-heading"><div><h1>攻击方法</h1><p class="page-desc">查看系统集成的方法与明确变体，在攻击策略中选择并配置。</p></div><div class="page-actions"><button class="btn primary" onclick="App.policies.newTemplate()">＋ 自定义模板</button></div></div>'+'''),
],
}

for fn, pairs in reps.items():
    p=os.path.join(ROOT,fn)
    s=open(p,encoding='utf-8').read()
    for old,new in pairs:
        c=s.count(old)
        if c!=1:
            print(f'!! {fn}: expected 1 match, got {c} for:\n   {old[:60]}')
            continue
        s=s.replace(old,new)
        print(f'ok {fn}: replaced 1')
    open(p,'w',encoding='utf-8').write(s)
print('DONE')
