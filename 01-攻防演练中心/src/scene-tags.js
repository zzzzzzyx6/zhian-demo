/* Product scene taxonomy. Original dataset labels remain intact for traceability. */
(function(){
'use strict';
const A=window.App,B=A.banks,X=A.attack,E=A.escape,copy=v=>JSON.parse(JSON.stringify(v));
const legacyCatalog=[
  {id:'illegal',label:'违法犯罪'}, {id:'violence',label:'暴力与人身伤害'},
  {id:'privacy',label:'隐私与数据泄露'}, {id:'cyber',label:'网络与系统安全'},
  {id:'hate',label:'歧视与骚扰'}, {id:'sexual',label:'色情与性安全'},
  {id:'deception',label:'欺诈与虚假信息'}, {id:'professional',label:'专业建议与伦理'}
];
// GB/T 45654—2025, informative Annex A, pp. 7–8 (PDF pp. 13–14).
// IDs below are product serialization keys, not machine keys published by the standard.
const standardGroups=[
  ['A.1','包含违反社会主义核心价值观的内容',['煽动颠覆国家政权、推翻社会主义制度','危害国家安全和利益、损害国家形象','煽动分裂国家、破坏国家统一和社会稳定','宣扬恐怖主义、极端主义','宣扬民族仇恨','宣扬暴力、淫秽色情','传播虚假有害信息','其他法律、行政法规禁止的内容']],
  ['A.2','包含歧视性内容',['民族歧视内容','信仰歧视内容','国别歧视内容','地域歧视内容','性别歧视内容','年龄歧视内容','职业歧视内容','健康歧视内容','其他方面歧视内容']],
  ['A.3','商业违法违规',['侵犯知识产权','违反商业道德','泄露商业秘密','利用算法、数据、平台等优势实施垄断和不正当竞争','其他商业违法违规行为']],
  ['A.4','侵犯他人合法权益',['危害身心健康','侵害肖像权','侵害名誉权','侵害荣誉权','侵害隐私权','侵害个人信息权益','侵害其他合法权益']],
  ['A.5','无法满足特定服务类型的安全需求',['内容不准确，严重不符合科学常识或主流认知','内容不可靠，虽然不包含严重错误，但无法对使用者形成帮助']]
];
for(const [code,group,labels] of standardGroups)labels.forEach((label,index)=>legacyCatalog.push({id:`gbt45654-${code.toLowerCase().replace('.','')}-${String.fromCharCode(97+index)}`,label,group,standard:'GB/T 45654—2025',clause:`${code}.${String.fromCharCode(97+index)}`}));
const catalog=window.BankSceneData.categories;
const fixed=new Map();
for(const [bank,groups] of Object.entries(window.BankSceneData.groups))for(const [tag,ids] of Object.entries(groups))for(const id of ids){const key=JSON.stringify([bank,id]);if(!fixed.has(key))fixed.set(key,[]);fixed.get(key).push(tag);}
const customId=label=>{let a=2166136261,b=5381;for(const c of label){a=Math.imul(a^c.codePointAt(0),16777619);b=Math.imul(b,33)^c.codePointAt(0);}return `custom-${(a>>>0).toString(16)}${(b>>>0).toString(16)}`;};
const cleanLabel=value=>String(value||'').normalize('NFKC').trim().replace(/\s+/g,' ');
const validDefinition=s=>s&&typeof s.label==='string'&&cleanLabel(s.label).length>0&&cleanLabel(s.label).length<=32&&s.id===customId(cleanLabel(s.label));
const definitions=items=>items.filter(Boolean).flatMap(q=>q.sceneTagDefinitions||[]).filter(validDefinition);
const uniqueCatalog=items=>[...new Map(items.map(s=>[s.id,s])).values()];
const saladLabels=new Set((window.SaladBankData||[]).map(q=>q.category));
const mappings={
  'Harassment/Discrimination':['hate'],'Malware/Hacking':['cyber'],'Physical harm':['violence'],
  'Economic harm':['deception'],'Fraud/Deception':['deception'],'Disinformation':['deception'],
  'Sexual/Adult content':['sexual'],'Privacy':['privacy'],'Expert advice':['professional'],
  'Government decision-making':['professional'],'chemical_biological':['violence'],
  'illegal':['illegal'],'misinformation_disinformation':['deception'],'harassment_bullying':['hate'],
  'cybercrime_intrusion':['cyber'],'违法犯罪':['illegal'],'道德伦理':['professional'],
  '脏话侮辱':['hate'],'心理健康':['violence'],'身体伤害':['violence'],
  '财产隐私':['privacy'],'偏见歧视':['hate']
};
const saladGroups={
  hate:[1,2,7,8,9,10,11,12,13,40,41],sexual:[14,15,16,55],
  violence:[3,4,5,6,23,35,39,56,62],privacy:[31,32,33,34,52],cyber:[36,37,38],
  illegal:[19,26,53,54,57,58,59,60,67],deception:[21,22,24,29,30,42,43,45,46,47,48,49,50,51,63],
  professional:[17,20,25,27,28,44]
};
const S=A.sceneTags={version:2,legacyCatalog,
  reference:'https://www.tc260.org.cn/zgwabwuploadfile/1751257342816036759/1751257342816036759.pdf',
  get catalog(){return uniqueCatalog([...catalog,...(A.data.sceneTagCatalog||[]).filter(validDefinition),...(B.draft?.customScenes||[]),...(B.sceneDraft?.customScenes||[])]);},
  label:(id,q)=>q?.sceneTagDefinitions?.find(s=>s.id===id&&validDefinition(s))?.label||S.catalog.find(s=>s.id===id)?.label||legacyCatalog.find(s=>s.id===id)?.label||'未提供场景',
  normalize(values,extra=[]){if(!Array.isArray(values))return [];const all=[...S.catalog,...legacyCatalog,...extra.filter(validDefinition)];return [...new Set(values.map(v=>all.find(s=>s.id===v||s.label===v)?.id).filter(Boolean))];},
  custom(label){label=cleanLabel(label);if(!label||label.length>32)throw Error('标签名称需为 1–32 个字符');if(/[\u0000-\u001f\u007f]/.test(label))throw Error('标签名称不能包含控制字符');return S.catalog.find(s=>s.label===label)||{id:customId(label),label,custom:true};},
  assign(q,ids,origin='manual'){q.sceneTags=S.normalize(ids,q.sceneTagDefinitions||[]);q.sceneTagOrigin=origin;q.sceneTagVersion=S.version;const all=[...S.catalog,...(q.sceneTagDefinitions||[]).filter(validDefinition)],selected=q.sceneTags.map(id=>all.find(s=>s.id===id));q.sceneTagDefinitions=selected.filter(s=>s?.custom||validDefinition(s)).map(s=>({id:s.id,label:s.label,custom:true}));q.sceneTagReferences=selected.filter(s=>s?.standard).map(s=>({id:s.id,standard:s.standard,clause:s.clause}));return q;},
  resolve(q){
    if(!q)return [];
    if(Array.isArray(q.sceneTags))return S.normalize(q.sceneTags,q.sceneTagDefinitions||[]);
    const category=typeof q.category==='string'?q.category.trim():'';
    if(mappings[category])return [...mappings[category]];
    const match=saladLabels.has(category)&&/^O(\d+):/.exec(category);
    if(match){const id=Object.keys(saladGroups).find(id=>saladGroups[id].includes(Number(match[1])));if(id)return [id];}
    return [];
  },
  freeze(q){if(!Array.isArray(q.sceneTags)){q.sceneTags=S.resolve(q);q.sceneTagOrigin=q.sceneTags.length?'mapped':'unclassified';q.sceneTagVersion=S.version;}return S.assign(q,q.sceneTags,q.sceneTagOrigin||'source');},
  html(q){const ids=S.resolve(q);return ids.length?ids.map(id=>`<span class="scene-tag">${E(S.label(id,q))}</span>`).join(''):'<span class="scene-tag unclassified">未提供场景</span>';},
   optionGroups(excluded=[],value=''){return S.catalog.filter(s=>!excluded.includes(s.id)).map(s=>`<option value="${s.id}" ${value===s.id?'selected':''}>${E(s.label)}</option>`).join('');},
  available(items=B.db.flatMap(b=>b.items)){const ids=new Set(items.flatMap(q=>S.resolve(q)));return uniqueCatalog([...S.catalog,...legacyCatalog,...definitions(items)]).filter(s=>ids.has(s.id));},
  inGroup(tag,group){return group==='group:common'?!tag.standard&&!tag.custom:group==='group:standard'?!!tag.standard:group==='group:custom'?!!tag.custom:group.startsWith('group:standard:')?!!tag.standard&&tag.clause?.startsWith(group.slice('group:standard:'.length)+'.'):false;},
  options(value='all',items=B.db.flatMap(b=>b.items)){
    const rows=S.available(items),option=(id,label)=>`<option value="${E(id)}" ${value===id?'selected':''}>${E(label)}</option>`;
     return option('all','全部攻击场景')+rows.map(s=>option(s.id,s.label)).join('')+(items.some(q=>!S.resolve(q).length)?option('unclassified','未提供场景'):'');
  },
  matches(q,scene){const ids=S.resolve(q);return !scene||scene==='all'||(scene==='unclassified'?!ids.length:scene.startsWith('group:')?S.available([q]).some(tag=>S.inGroup(tag,scene)):ids.includes(scene));}
};
const aliases={illegal:'ethics-rights',violence:'violence-danger',privacy:'privacy-secrets',cyber:'cyber-abuse',hate:'discrimination-harassment',sexual:'sexual-harm',deception:'fraud-manipulation',professional:'health-advice'};
const standardAliases=[
 ['national-security','national-security','national-security','violence-danger','discrimination-harassment','violence-danger','fraud-manipulation','ethics-rights'],
 Array(9).fill('discrimination-harassment'),
 ['ip-business','ip-business','privacy-secrets','ip-business','ip-business'],
 ['health-advice','discrimination-harassment','discrimination-harassment','discrimination-harassment','privacy-secrets','privacy-secrets','ethics-rights'],
 ['accuracy-reliability','accuracy-reliability']
];
standardGroups.forEach(([code,,labels],g)=>labels.forEach((_,i)=>aliases[`gbt45654-${code.toLowerCase().replace('.','')}-${String.fromCharCode(97+i)}`]=standardAliases[g][i]));
S.migrate=function(q){const ids=S.resolve(q),tags=ids.map(id=>aliases[id]||id);if(!tags.length){const label=cleanLabel(q.category);if(label&&label.length<=32){const tag=S.custom(label);q.sceneTagDefinitions=[...(q.sceneTagDefinitions||[]),...(tag.custom?[tag]:[])];tags.push(tag.id);}else tags.push('ethics-rights');}return S.assign(q,tags,q.sceneTagOrigin||'source');};
S.refreshDemoSnapshot=function(snapshot){if(!snapshot?.items)return;for(const q of snapshot.items){const bank=q.sourceBankId||snapshot.id,tags=fixed.get(JSON.stringify([bank,String(q.id).split('::').at(-1)]));if(tags)S.assign(q,tags,'source');else S.migrate(q);}};
const init=A.modules.attack.init;
A.modules.attack.init=function(){
  init();
  A.data.sceneTagCatalog=uniqueCatalog([...(A.data.sceneTagCatalog||[]).filter(validDefinition),...definitions(B.db.flatMap(b=>b.items)),...definitions(X.db.tasks.flatMap(t=>t.bankSnapshot?.items||[])),...Object.values(A.data.sceneAnnotations||{}).flatMap(v=>v.definitions||[]).filter(validDefinition)]);
  for(const bank of B.db)for(const q of bank.items){
    const key=JSON.stringify([bank.id,q.id]),override=A.data.sceneAnnotations?.[key];
    if(override){q.sceneTagDefinitions=override.definitions||[];S.assign(q,override.tags);if(override.version!==S.version){S.migrate(q);override.tags=[...q.sceneTags];override.version=S.version;}}
    else if(q.sceneTagVersion!==S.version){const tags=fixed.get(key);if(tags){const custom=S.resolve(q).filter(id=>id.startsWith('custom-'));S.assign(q,[...tags,...custom],'builtin');q.sceneAnnotation={scheme:'security-scenes-v2',version:2};}else S.migrate(q);}
    else S.freeze(q);
  }
  for(const bank of B.db)if(bank.builtin&&bank.provenance)bank.provenance.sceneAnnotation={schemaVersion:2,scheme:'security-scenes-v2',version:2};
  // Existing task labels are resolved only from that task's saved source category.
  // Future edits to the live bank must never rewrite historical report meaning.
  for(const task of X.db.tasks)for(const q of task.bankSnapshot?.items||[])S.freeze(q);
};

const parse=B.parse;
B.parse=function(text,fileName){
  const result=parse.call(B,text,fileName),raw=fileName.toLowerCase().endsWith('.jsonl')?text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(l=>l.trim()).map(l=>JSON.parse(l)):JSON.parse(text.replace(/^\uFEFF/,'')),rows=Array.isArray(raw)?raw:raw.items;
  rows.forEach((r,i)=>{
    if(r.scenes!=null){if(r.sceneTags!=null)throw Error(`第 ${i+1} 题请只填写 scenes 或 sceneTags 中的一种`);r={...r,sceneTags:r.scenes};}
    if(raw.schemaVersion===2&&(!Array.isArray(r.sceneTags)||!r.sceneTags.length))throw Error(`第 ${i+1} 题缺少 scenes 场景数组`);
    if(r.sceneTags!=null&&(!Array.isArray(r.sceneTags)||r.sceneTags.length>20||r.sceneTags.some(v=>typeof v!=='string'||!v.trim())))throw Error(`第 ${i+1} 题的场景字段需为最多 20 个非空标签名称组成的数组`);
    if(r.sceneTags!=null){const defs=(Array.isArray(r.sceneTagDefinitions)?r.sceneTagDefinitions:[]).filter(validDefinition),all=[...S.catalog,...legacyCatalog,...defs],tags=r.sceneTags.map(v=>all.find(s=>s.id===v||s.label===v)||S.custom(v));result.items[i].sceneTagDefinitions=uniqueCatalog(tags.filter(validDefinition));result.items[i].sceneTags=tags.map(s=>s.id);result.items[i].sceneTagOrigin='imported';result.items[i].sceneTagVersion=S.version;}
    S.migrate(S.freeze(result.items[i]));
  });if(!Array.isArray(raw)&&typeof raw.industry==='string')result.industry=raw.industry;return result;
};
const merge=B.merge;
B.merge=function(items){
  const prepared=items.map(q=>{
    const source=q.source,task=source?.taskId&&X.db.tasks.find(t=>t.id===source.taskId),unit=task?.units.find(u=>u.id===source.recordId),original=unit&&task.bankSnapshot?.items?.find(item=>item.id===unit.questionId);
    return S.migrate(S.freeze(original?{...q,sceneTags:S.resolve(original),sceneTagDefinitions:copy(original.sceneTagDefinitions||[]),sceneTagOrigin:original.sceneTagOrigin||'source',sceneTagVersion:original.sceneTagVersion||S.version}:{...q}));
  });
  const missing=prepared.map((q,i)=>S.resolve(q).length?null:i+1).filter(Boolean);if(missing.length)throw Error(`第 ${missing.slice(0,8).join('、')} 题未提供可解析的场景字段，请补充 scenes 后重新导入`);
  const result=merge.call(B,prepared);B.draft.customScenes=uniqueCatalog([...(B.draft.customScenes||[]),...definitions(B.draft.items)]);return result;
};
B.questionFilter={bank:null,query:'',scene:'all'};
B.questionRows=function(bank){const f=B.questionFilter,q=f.query.trim().toLocaleLowerCase();return bank.items.filter(item=>S.matches(item,f.scene)&&(!q||[item.id,item.prompt,item.category].join(' ').toLocaleLowerCase().includes(q)));};
B.sourceInformation=function(bank){
 const p=bank.provenance,url=typeof p?.url==='string'&&/^https:\/\//.test(p.url)?p.url:null,policies=A.policies?.db.filter(v=>v.bankIds?.includes(bank.id))||[];
 return `<details class="bank-source-details"><summary>题库来源</summary><p><b>题目来源：</b>${E(typeof bank.source==='string'?bank.source:'用户导入')}${url?` · <a href="${E(url)}" target="_blank" rel="noopener noreferrer">官方原始文件</a>`:''}</p>${p?.file?`<p><b>来源文件：</b>${E(p.file)}</p>`:''}${p?.license?`<p><b>许可证：</b>${E(p.license)} 许可协议</p>`:''}${p?.revision?`<p><b>来源版本（提交号）：</b><span class="mono" title="${E(p.revision)}">${E(p.revision.slice(0,12))}</span></p>`:''}${p?.integration?`<p>${E(p.integration)}</p>`:''}${policies.length?`<p><b>引用策略：</b>${policies.map(v=>E(v.name)).join('、')}</p>`:''}</details>`;
};
B.open=function(id,page=1){
  const bank=B.get(id);if(!bank)return;
  if(B.questionFilter.bank!==id)B.questionFilter={bank:id,query:'',scene:'all'};
  const f=B.questionFilter;if(f.scene!=='all'&&!bank.items.some(q=>S.matches(q,f.scene)))f.scene='all';
  const rows=B.questionRows(bank),pages=Math.max(1,Math.ceil(rows.length/12));page=Math.max(1,Math.min(pages,Number(page)||1));B.questionPage=page;
  A.drawer(E(bank.name),`<div class="bank-question-head"><span class="bank-source ${bank.builtin?'builtin':'custom'}">${bank.builtin?'系统':'自建'}</span><span>${E(bank.industry||'通用')}</span><span>${bank.items.length} 题</span>${B.sourceInformation(bank)}</div>
    <div class="scene-question-toolbar"><input id="bank-question-query" aria-label="搜索题目或编号" placeholder="搜索题目或编号" value="${E(f.query)}" oninput="if(!event.isComposing)App.banks.filterQuestions('query',this.value)"><select aria-label="题目攻击场景筛选" onchange="App.banks.filterQuestions('scene',this.value)">${S.options(f.scene,bank.items)}</select></div>
    <div class="table-wrap"><table class="scene-questions-table"><thead><tr><th>题目编号 / 原始题目</th><th>攻击场景</th></tr></thead><tbody>${rows.slice((page-1)*12,page*12).map(q=>`<tr><td><small class="mono">${E(q.id)}</small><p>${E(q.prompt)}</p></td><td><div class="scene-tags">${S.html(q)}</div></td></tr>`).join('')||'<tr><td colspan="2" class="empty">没有符合条件的题目</td></tr>'}</tbody></table></div>`,
    `<span>共 ${rows.length} 题 · ${page} / ${pages}</span><button class="btn" data-bank="${E(id)}" ${page===1?'disabled':''} onclick="App.banks.open(this.dataset.bank,${page-1})">上一页</button><button class="btn" data-bank="${E(id)}" ${page===pages?'disabled':''} onclick="App.banks.open(this.dataset.bank,${page+1})">下一页</button>${!bank.builtin?`<button class="btn primary" data-bank="${E(id)}" onclick="App.banks.create(this.dataset.bank)">添加题目</button>`:''}`);
};
B.filterQuestions=function(field,value){if(!['query','scene'].includes(field))return;B.questionFilter[field]=value;B.open(B.questionFilter.bank,1);if(field==='query'){const el=document.getElementById('bank-question-query');el?.focus();el?.setSelectionRange?.(value.length,value.length);}};
B.sceneContext=function(key){return key==='edit'?{owner:B.sceneDraft,q:B.sceneDraft?.question}:{owner:B.draft,q:B.draft?.items[Number(key)]};};
B.scenePickerHTML=function(q,key){
  const {owner}=B.sceneContext(String(key)),ids=S.resolve(q),custom=owner?.customSceneRow===String(key);
  return `<div class="scene-picker"><div class="scene-tags">${ids.map(id=>`<span class="scene-tag">${E(S.label(id))}<button type="button" aria-label="移除${E(S.label(id))}" data-tag="${id}" onclick="App.banks.removeScene('${key}',this.dataset.tag)">×</button></span>`).join('')||'<span class="scene-tag unclassified">未提供场景</span>'}</div><select aria-label="${key==='edit'?'题目':`第 ${Number(key)+1} 题`}攻击场景" onchange="App.banks.chooseScene('${key}',this.value)"><option value="">选择场景标签</option>${S.optionGroups(ids)}<option value="__custom">＋ 自定义标签</option></select>${custom?`<div class="scene-custom-entry"><input id="scene-custom-${key}" aria-label="自定义标签名称" maxlength="32" placeholder="输入标签名称" onkeydown="if(event.key==='Enter'){event.preventDefault();App.banks.addCustomScene('${key}')}"><button class="btn small" onclick="App.banks.addCustomScene('${key}')">添加</button></div>`:''}${owner?.sceneErrorKey===String(key)&&owner.sceneError?`<p class="error-message" role="alert">${E(owner.sceneError)}</p>`:''}</div>`;
};
B.renderSceneContext=function(key){key==='edit'?B.renderSceneEditor():B.edit();};
B.chooseScene=function(key,id){
  const {owner,q}=B.sceneContext(key);if(!q||!id)return;owner.sceneError='';
  if(id==='__custom'){owner.customSceneRow=key;B.renderSceneContext(key);document.getElementById('scene-custom-'+key)?.focus();return;}
  if(!S.catalog.some(s=>s.id===id))return;const ids=S.resolve(q);if(ids.length>=20){owner.sceneError='每题最多选择 20 个标签';owner.sceneErrorKey=key;}else S.assign(q,[...ids,id]);B.renderSceneContext(key);
};
B.removeScene=function(key,id){const {q}=B.sceneContext(key);if(q){S.assign(q,S.resolve(q).filter(v=>v!==id));B.renderSceneContext(key);}};
B.addCustomScene=function(key){
  const {owner,q}=B.sceneContext(key);if(!q)return;
  try{const tag=S.custom(document.getElementById('scene-custom-'+key)?.value);if(S.resolve(q).length>=20)throw Error('每题最多选择 20 个标签');if(S.catalog.filter(s=>s.custom).length>=200&&!S.catalog.some(s=>s.id===tag.id))throw Error('自定义场景最多 200 个，请优先使用已有标签');owner.customScenes=uniqueCatalog([...(owner.customScenes||[]),...(tag.custom?[tag]:[])]);S.assign(q,[...S.resolve(q),tag.id]);owner.customSceneRow=null;owner.sceneError='';}catch(e){owner.sceneError=e.message;owner.sceneErrorKey=key;}
  B.renderSceneContext(key);
};
const saveDraft=B.saveDraft;
B.saveDraft=function(){const d=B.draft;if(!d)return;const previous=copy(A.data.sceneTagCatalog||[]);A.data.sceneTagCatalog=uniqueCatalog([...previous,...definitions(d.items)]);try{saveDraft.call(B);}finally{if(B.draft===d)A.data.sceneTagCatalog=previous;}};
B.editScenes=function(bankId,questionId){
  const q=B.get(bankId)?.items.find(q=>q.id===questionId);if(!q)return;
  B.sceneDraft={bankId,questionId,question:copy(q),customScenes:[]};Object.defineProperty(B.sceneDraft,'tags',{get(){return S.resolve(this.question);},set(v){S.assign(this.question,v);}});A.closeDrawer();B.renderSceneEditor();
};
B.renderSceneEditor=function(){const q=B.sceneDraft?.question;if(!q)return;A.modal('编辑攻击场景',`<p class="scene-edit-question">${E(q.prompt)}</p>${B.scenePickerHTML(q,'edit')}<p id="scene-edit-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.banks.cancelScenes()">取消</button><button class="btn primary" onclick="App.banks.saveScenes()">保存</button>`);};
B.toggleScene=function(id,checked){if(!S.catalog.some(s=>s.id===id)||!B.sceneDraft)return;B.sceneDraft.tags=checked?[...new Set([...B.sceneDraft.tags,id])]:B.sceneDraft.tags.filter(v=>v!==id);};
B.cancelScenes=function(){const id=B.sceneDraft?.bankId;B.sceneDraft=null;A.closeModal();if(id)B.open(id,B.questionPage);};
B.saveScenes=function(){
  const d=B.sceneDraft,bank=d&&B.get(d.bankId),q=bank?.items.find(q=>q.id===d.questionId);if(!q)return;
  const before=copy(q),annotations=copy(A.data.sceneAnnotations||{}),previous=copy(A.data.sceneTagCatalog||[]);A.data.sceneAnnotations ||= {};
  q.sceneTagDefinitions=copy(d.question.sceneTagDefinitions||[]);S.assign(q,d.tags);
  A.data.sceneTagCatalog=uniqueCatalog([...previous,...definitions([q])]);
  A.data.sceneAnnotations[JSON.stringify([d.bankId,d.questionId])]={tags:[...d.tags],definitions:copy(q.sceneTagDefinitions),version:S.version,updatedAt:new Date().toISOString()};
  try{localStorage.setItem('zhian-standalone-attack',JSON.stringify(A.storageCodec?A.storageCodec.encode(A.data):A.data));}catch(e){Object.keys(q).forEach(k=>delete q[k]);Object.assign(q,before);A.data.sceneAnnotations=annotations;A.data.sceneTagCatalog=previous;document.getElementById('scene-edit-error').textContent='存储空间不足，标签未保存';return;}
  B.cancelScenes();A.toast('场景标签已保存');
};

const open=X.open;X.open=function(){X.sampleScene='all';X.sampleQuery='';return open.apply(this,arguments);};
X.sceneQuestion=function(t,u){return t.bankSnapshot?.items?.find(q=>q.id===u.questionId)||null;};
X.sceneRecordRows=function(t=X.task){const query=(X.sampleQuery||'').trim().toLocaleLowerCase();return (t?.units||[]).filter(u=>u.result!=='pending'&&(X.sampleFilter==='all'||u.result===X.sampleFilter)&&S.matches(X.sceneQuestion(t,u),X.sampleScene)&&(!query||[u.id,u.questionId,X.sceneQuestion(t,u)?.prompt].join(' ').toLocaleLowerCase().includes(query)));};
X.filterSceneRecords=function(field,value){if(field==='scene')X.sampleScene=value;else if(field==='query')X.sampleQuery=value;else return;X.pageNum=1;A.render();if(field==='query'){const el=document.getElementById('scene-record-query');el?.focus();el?.setSelectionRange?.(value.length,value.length);}};
X.openSceneRecords=function(scene,result='all'){X.sampleScene=S.catalog.some(s=>s.id===scene)||scene==='unclassified'?scene:'all';X.sampleQuery='';X.sampleFilter=['breach','defended','error'].includes(result)?result:'all';X.pageNum=1;X.detailTab='samples';A.render();document.querySelector('.detail-tabs')?.scrollIntoView({behavior:'smooth',block:'start'});};
X.filterRecordsByScene=X.openSceneRecords;
X.selectVisible=function(checked){X.sceneRecordRows().forEach(u=>checked?X.selection().add(u.id):X.selection().delete(u.id));A.render();};
const after=X.afterRender;X.afterRender=function(){after?.call(X);const el=document.getElementById('record-select-all');if(el&&X.selected){const rows=X.sceneRecordRows(),n=rows.filter(u=>X.selection().has(u.id)).length;el.indeterminate=n>0&&n<rows.length;}};
X.samples=function(t){
  const rows=X.sceneRecordRows(t),pages=Math.max(1,Math.ceil(rows.length/10)),selected=X.selection();X.pageNum=Math.max(1,Math.min(X.pageNum||1,pages));
  return `<section class="card scene-records"><div class="toolbar scene-record-toolbar"><input id="scene-record-query" placeholder="搜索题目或记录编号" aria-label="搜索题目或记录编号" value="${E(X.sampleQuery||'')}" oninput="if(!event.isComposing)App.attack.filterSceneRecords('query',this.value)"><select aria-label="攻防记录场景筛选" onchange="App.attack.filterSceneRecords('scene',this.value)">${S.options(X.sampleScene,(t?.units||[]).filter(u=>u.result!=='pending').map(u=>X.sceneQuestion(t,u)))}</select><select aria-label="攻击结果筛选" onchange="App.attack.sampleFilter=this.value;App.attack.pageNum=1;App.render()">${[['all','全部结果'],['breach','已攻破'],['defended','已守住'],['error','执行异常']].map(([id,label])=>`<option value="${id}" ${X.sampleFilter===id?'selected':''}>${label}</option>`).join('')}</select><button class="btn" ${selected.size?'':'disabled'} onclick="App.attack.exportSamples()">导出所选（${selected.size}）</button></div>
    <div class="record-selection-bar"><button class="link-btn" onclick="App.attack.selectVisible(true)">选择筛选结果</button><button class="link-btn" onclick="App.attack.selectRecords('none')">清空选择</button><span>已选 ${selected.size} 条</span></div>
    <div class="table-wrap"><table><thead><tr><th><input type="checkbox" id="record-select-all" aria-label="选择当前筛选的全部记录" ${rows.length&&rows.every(u=>selected.has(u.id))?'checked':''} ${rows.length?'':'disabled'} onchange="App.attack.selectVisible(this.checked)"></th><th>记录编号</th><th>攻击题目</th><th>攻击场景</th><th>攻击方法</th><th>最终结果</th><th>操作</th></tr></thead><tbody>${rows.slice((X.pageNum-1)*10,X.pageNum*10).map(u=>{const q=X.sceneQuestion(t,u);return `<tr><td><input type="checkbox" aria-label="选择记录 ${E(u.id)}" data-unit="${E(u.id)}" ${selected.has(u.id)?'checked':''} onchange="App.attack.selectRecord(this.dataset.unit,this.checked)"></td><td class="mono">${E(u.id)}</td><td class="record-question-cell"><p title="${E(q?.prompt||'')}">${E(q?.prompt||u.seedPrompt||'原题未保存')}</p><small>${E(u.questionId||'--')}</small></td><td><div class="scene-tags">${S.html(q)}</div></td><td>${E(X.methodDependencies[u.method]?.label||u.method)}<small>${u.rounds||1} 轮</small></td><td>${A.badge({breach:'已攻破',defended:'已守住',error:'执行异常'}[u.result]||'待判定',{breach:'orange',defended:'green',error:'gray'}[u.result])}</td><td><button class="link-btn" data-unit="${E(u.id)}" onclick="App.attack.sample(this.dataset.unit)">详情</button></td></tr>`;}).join('')||'<tr><td colspan="7" class="empty">没有符合条件的攻防记录</td></tr>'}</tbody></table></div>
    <div class="table-foot"><span>共 ${rows.length} 条</span><div class="pagination"><button class="btn small" aria-label="上一页" ${X.pageNum===1?'disabled':''} onclick="App.attack.pageNum--;App.render()">‹</button><span>${X.pageNum} / ${pages}</span><button class="btn small" aria-label="下一页" ${X.pageNum===pages?'disabled':''} onclick="App.attack.pageNum++;App.render()">›</button></div></div></section>`;
};
const sample=X.sample;X.sample=function(id){sample.call(X,id);const u=X.task?.units.find(u=>u.id===id),q=u&&X.sceneQuestion(X.task,u),body=document.querySelector('#drawer .exercise-record');if(body&&u)body.insertAdjacentHTML('afterbegin',`<div class="record-scene-heading"><span class="mono">${E(u.questionId||u.id)}</span><div class="scene-tags">${S.html(q)}</div></div>`);};
const sampleJSON=X.sampleJSON;X.sampleJSON=function(u){const q=X.sceneQuestion(X.task,u);return {...sampleJSON.call(X,u),question:q?copy(q):null,sceneTags:S.resolve(q),sceneLabels:S.resolve(q).map(id=>S.label(id,q))};};
})();
