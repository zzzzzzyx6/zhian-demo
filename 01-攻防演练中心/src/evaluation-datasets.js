/* Local demo dataset curation. Evidence is immutable; annotations and releases are separate. */
(function(){
'use strict';
const A=window.App,E=A.escape,ER=A.evaluationRecords,X=A.attack;
const arr=v=>Array.isArray(v)?v:[],copy=v=>JSON.parse(JSON.stringify(v)),now=()=>new Date().toISOString();
const DS=A.evaluationDatasets={filter:{query:'',scene:'',method:'',result:'',tag:'',kind:'',task:''},page:1,selected:new Set(),tab:'records',annotationDraft:null,versionDraft:null};
const resultNames={breach:'已攻破',defended:'已守住',pending:'待判定',error:'执行异常'};
const option=(id,label,value)=>`<option value="${E(id)}" ${String(id)===String(value)?'selected':''}>${E(label)}</option>`;
const button=(label,action,cls='btn')=>`<button type="button" class="${cls}" onclick="${action}">${label}</button>`;
const text=v=>v===undefined||v===null?'':String(v);
DS.db=()=>A.data.evaluationDatasetCuration|| (A.data.evaluationDatasetCuration={schemaVersion:1,annotations:{},versions:[]});
DS.kind=row=>row.task.evaluationKind||row.task.assessmentType||(row.unit.method==='Direct'?'安全合规':'攻击对抗');
DS.annotation=row=>DS.db().annotations[row.key]||{tags:[],reviewed:false,referenceAnswer:'',history:[]};
DS.persist=function(before,errorId){
 A.save();
 if(A.storageOK===false){A.data.evaluationDatasetCuration=before;const el=document.getElementById(errorId);if(el)el.textContent='浏览器存储空间不足，未保存本次更改。请减少本次选择的记录数量。';return false;}
 return true;
};
DS.rows=function(filtered=true){
 const rows=ER.rows(false),f=DS.filter;
 return filtered?rows.filter(r=>{const a=DS.annotation(r);return (!f.task||r.task.id===f.task)&&(!f.kind||DS.kind(r)===f.kind)&&(!f.method||r.unit.method===f.method)&&(!f.result||r.unit.result===f.result)&&(!f.scene||r.sceneIds.includes(f.scene))&&(!f.tag||a.tags.includes(f.tag))&&(!f.query||[r.task.name,r.unit.id,r.question?.prompt,r.unit.attackPrompt,...a.tags].join(' ').toLowerCase().includes(f.query.toLowerCase()));}):rows;
};
DS.filterBy=function(key,value){if(Object.hasOwn(DS.filter,key)){DS.filter[key]=value;DS.page=1;A.render();}};
DS.toggle=function(key,on){if(on)DS.selected.add(key);else DS.selected.delete(key);A.render();};
DS.selectFiltered=function(){DS.rows().forEach(r=>DS.selected.add(r.key));A.render();};
DS.clearSelection=function(){DS.selected.clear();A.render();};
DS.selection=()=>DS.rows(false).filter(r=>DS.selected.has(r.key));
DS.tagsForm=function(){
 const rows=DS.selection();if(!rows.length)return A.toast('请先选择评测记录');
 DS.tagDraft={value:'',mode:'add'};
 A.modal('批量管理标签',`<p>已选 ${rows.length} 条评测记录</p><div class="field"><label for="dataset-tags">标签（逗号分隔，每个不超过 30 字）</label><input id="dataset-tags" maxlength="300" placeholder="待复核，训练候选，业务重点" oninput="App.evaluationDatasets.tagDraft.value=this.value"></div><div class="field"><label for="dataset-tag-mode">操作</label><select id="dataset-tag-mode" onchange="App.evaluationDatasets.tagDraft.mode=this.value"><option value="add">添加标签</option><option value="remove">移除指定标签</option></select></div><p class="hint">场景、方法、结果等自动标签随原始记录保留；此处管理人工标签。</p><p id="dataset-tag-error" class="error-message"></p>`,button('取消','App.closeModal()')+button('保存标签','App.evaluationDatasets.saveTags()','btn primary'));
};
DS.saveTags=function(value=DS.tagDraft.value,mode=DS.tagDraft.mode){
 const tags=[...new Set(text(value).split(/[,，\n]/).map(v=>v.trim()).filter(Boolean))];
 if(!tags.length||tags.length>10||tags.some(t=>t.length>30)){document.getElementById('dataset-tag-error').textContent='请输入 1–10 个标签，每个不超过 30 字';return false;}
 const before=copy(DS.db());
 if(mode==='add'){DS.db().tagCatalog ||= [];for(const name of tags)if(!DS.db().tagCatalog.some(t=>t.name===name))DS.db().tagCatalog.push({name,createdAt:now()});}
 for(const row of DS.selection()){
  const a=copy(DS.annotation(row));a.tags=mode==='remove'?a.tags.filter(t=>!tags.includes(t)):[...new Set([...a.tags,...tags])];
  a.history.push({action:mode,tags,at:now(),actor:A.session?.user||'安全管理员'});DS.db().annotations[row.key]=a;
 }
 if(!DS.persist(before,'dataset-tag-error'))return false;A.closeModal();A.render();return true;
};
DS.editAnnotation=function(key){
 const row=DS.rows(false).find(r=>r.key===key);if(!row)return;
 DS.annotationDraft={key,...copy(DS.annotation(row))};
 A.modal('训练样本标注',`<div class="or-annotation-source"><strong>测试输入</strong><p>${E(row.unit.attackPrompt||row.question?.prompt||'未保存')}</p><strong>原始模型输出</strong><p>${E(row.unit.rawResponse||row.unit.response||'未保存')}</p></div><div class="field"><label for="dataset-answer">安全参考回答</label><textarea id="dataset-answer" rows="5" maxlength="20000" placeholder="填写经人工确认、用于安全微调的目标回答" oninput="App.evaluationDatasets.annotationDraft.referenceAnswer=this.value">${E(DS.annotationDraft.referenceAnswer)}</textarea></div><label class="cs-checkbox"><input type="checkbox" ${DS.annotationDraft.reviewed?'checked':''} onchange="App.evaluationDatasets.annotationDraft.reviewed=this.checked">已人工确认此回答可作为安全训练目标</label><p id="dataset-annotation-error" class="error-message"></p>`,button('取消','App.closeModal()')+button('保存标注','App.evaluationDatasets.saveAnnotation()','btn primary'),{wide:true});
};
DS.saveAnnotation=function(){
 const d=DS.annotationDraft;if(!d)return false;
 if(d.reviewed&&!d.referenceAnswer.trim()){document.getElementById('dataset-annotation-error').textContent='请填写安全参考回答后再确认';return false;}
 const before=copy(DS.db()),{key,...value}=copy(d);value.referenceAnswer=value.referenceAnswer.trim();value.history.push({action:'annotation',at:now(),actor:A.session?.user||'安全管理员',reviewed:value.reviewed});
 DS.db().annotations[key]=copy(value);if(!DS.persist(before,'dataset-annotation-error'))return false;A.closeModal();A.render();return true;
};
DS.record=function(row){
 const {task,unit,question,sceneIds,key}=row,a=DS.annotation(row);
 // Explicit evidence fields exclude credentials and connection secrets.
 return {schema_version:'evaluation-dataset/1.0',record_id:key,task_id:task.id,task_name:task.name,task_version:task.runVersion||task.iteration||1,created_at:task.created||null,evaluation_type:DS.kind(row),simulated:!!task.simulated,model:{id:task.model,name:X.targetFor(task)?.name||null,version:task.targetMeta?.version||null},question:{id:question?.id||unit.questionId,prompt:question?.prompt||unit.seedPrompt||null,source_bank:question?.sourceBankName||task.bankSnapshot?.name||null},tags:{scenes:sceneIds.map(id=>({id,label:A.sceneTags.label(id,question)})),attack_method:unit.method,result:unit.result,custom:copy(a.tags)},process:{events:copy(arr(unit.events)),rounds:ER.roundEntries(unit).map(({record})=>ER.roundSummary(task,unit,record)),error:unit.errorMessage||unit.errorReason||null},annotation:{reviewed:a.reviewed,reference_answer:a.referenceAnswer,history:copy(a.history)}};
};
DS.versionForm=function(){
 const rows=DS.selection();if(!rows.length)return A.toast('请先选择需要冻结的记录');
 DS.versionDraft={name:'评测样本集',note:''};
 A.modal('冻结数据集版本',`<p>将 ${rows.length} 条所选记录、标签与标注保存为不可变快照。</p><div class="field"><label for="dataset-name">数据集名称</label><input id="dataset-name" maxlength="80" value="评测样本集" oninput="App.evaluationDatasets.versionDraft.name=this.value"></div><div class="field"><label for="dataset-note">版本说明</label><textarea id="dataset-note" maxlength="500" oninput="App.evaluationDatasets.versionDraft.note=this.value" placeholder="例如：补充隐私场景、完成人工复核"></textarea></div><p id="dataset-version-error" class="error-message"></p>`,button('取消','App.closeModal()')+button('创建版本','App.evaluationDatasets.freeze()','btn primary'));
};
DS.freeze=function(){
 const rows=DS.selection(),name=DS.versionDraft?.name?.trim();
 if(!name||!rows.length){document.getElementById('dataset-version-error').textContent='请填写名称并选择记录';return false;}
 const before=copy(DS.db()),versions=DS.db().versions,version=1+Math.max(0,...versions.filter(v=>v.name===name).map(v=>v.version));
 const snapshot={id:'dataset-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),name,version,note:DS.versionDraft.note,created_at:now(),filters:copy(DS.filter),records:rows.map(DS.record)};
 versions.unshift(snapshot);if(!DS.persist(before,'dataset-version-error'))return false;DS.tab='versions';A.closeModal();A.render();return snapshot;
};
DS.payload=function(records,format){
 if(format==='sft')return records.filter(r=>r.annotation.reviewed&&r.annotation.reference_answer&&['breach','defended'].includes(r.tags.result)).map(r=>{
  const input=r.process.rounds.at(-1)?.attackInput||r.question.prompt;if(!input)return null;
  return {messages:[{role:'user',content:input},{role:'assistant',content:r.annotation.reference_answer}],metadata:{record_id:r.record_id,task_id:r.task_id,tags:r.tags,simulated:r.simulated}};
 }).filter(Boolean);
 return records;
};
DS.export=function(format='jsonl',versionId){
 const v=versionId?DS.db().versions.find(v=>v.id===versionId):null;
 if(versionId&&!v)return false;
 const source=v?v.records:DS.rows().map(DS.record),records=DS.payload(source,format);
 if(!records.length){A.toast(format==='sft'?'没有已确认安全参考回答的有效样本；请先完成训练标注。':'当前筛选没有记录');return false;}
 const stem=(v?v.name+'-v'+v.version:'评测数据集-当前筛选').replace(/[\\/:*?"<>|]/g,'_'),meta=v?{dataset_id:v.id,dataset_name:v.name,dataset_version:v.version}:null;
 let output,mime,ext;
 if(format==='csv'){
  const cell=v=>'"'+text(v).replace(/"/g,'""')+'"';
  const safe=v=>/^[=+@\-\t\r]/.test(text(v))?"'"+text(v):text(v);
  output='\uFEFF'+[['record_id','task_id','evaluation_type','scenes','method','result','custom_tags','prompt','response','dataset_version'],...records.map(r=>[r.record_id,r.task_id,r.evaluation_type,r.tags.scenes.map(s=>s.label).join('|'),r.tags.attack_method,r.tags.result,r.tags.custom.join('|'),r.process.rounds.at(-1)?.attackInput||r.question.prompt,r.process.rounds.at(-1)?.rawResponse||'',v?.version||''])].map(row=>row.map(safe).map(cell).join(',')).join('\r\n');mime='text/csv;charset=utf-8';ext='csv';
 }else{output=records.map(r=>JSON.stringify(meta?{...r,...meta}:r)).join('\n')+'\n';mime='application/x-ndjson;charset=utf-8';ext='jsonl';}
 A.download(stem+(format==='sft'?'-SFT':'')+'.'+ext,output,mime);A.toast(`已导出 ${records.length} 条${format==='sft'?'已标注训练样本':''}`);return {records,output};
};
DS.exportMenu=id=>`<details class="or-dataset-export"><summary>导出${id?'版本':'当前筛选'}</summary><div>${[['jsonl','评测 JSONL · 全过程'],['csv','样本 CSV · 摘要'],['sft','安全微调 JSONL · 已确认样本']].map(([format,name])=>`<button type="button" data-version="${E(id||'')}" onclick="App.evaluationDatasets.export('${format}',this.dataset.version||undefined)">${name}</button>`).join('')}</div></details>`;
DS.render=function(){
 const all=DS.rows(false),rows=DS.rows(),f=DS.filter,size=20,pages=Math.max(1,Math.ceil(rows.length/size));DS.page=Math.min(DS.page,pages);
 const sceneMap=new Map(),taskMap=new Map();for(const r of all){taskMap.set(r.task.id,r.task.name);for(const id of r.sceneIds)sceneMap.set(id,A.sceneTags.label(id,r.question));}
 const custom=[...new Set(all.flatMap(r=>DS.annotation(r).tags))],methods=[...new Set(all.map(r=>r.unit.method))];
 const filter=(key,title,items)=>`<label><span>${title}</span><select aria-label="数据集${title}" onchange="App.evaluationDatasets.filterBy('${key}',this.value)">${option('','全部'+title,f[key])}${items.map(([id,name])=>option(id,name,f[key])).join('')}</select></label>`;
 const versions=DS.db().versions;
 return A.heading('','评测数据集','自动汇集已保存的测试过程，按标签整理、冻结版本并导出复用。',DS.exportMenu())+`<div class="tabs">${[['records','样本管理'],['versions','版本管理']].map(([key,name])=>button(name,`App.evaluationDatasets.tab='${key}';App.render()`,'tab '+(DS.tab===key?'active':''))).join('')}</div>${DS.tab==='versions'?`<section class="card"><div class="table-wrap"><table><thead><tr><th>数据集 / 版本</th><th>记录数</th><th>创建时间</th><th>版本说明</th><th>操作</th></tr></thead><tbody>${versions.map(v=>`<tr><td><strong>${E(v.name)}</strong> <span class="or-tag">v${v.version}</span></td><td>${v.records.length}</td><td>${A.listConsistency.time(v.created_at)}</td><td>${E(v.note||'—')}</td><td>${DS.exportMenu(v.id)}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">选择样本并冻结版本后，可重复导出同一批数据。</td></tr>'}</tbody></table></div></section>`:`<section class="card or-datasets"><div class="or-dataset-filters"><label><span>搜索</span><input aria-label="搜索数据集记录" placeholder="题目、任务、标签" value="${E(f.query)}" onchange="App.evaluationDatasets.filterBy('query',this.value)"></label>${filter('kind','评测类型',[['安全合规','安全合规'],['攻击对抗','攻击对抗']])}${filter('task','来源任务',[...taskMap])}${filter('scene','场景标签',[...sceneMap])}${filter('method','攻击方法',methods.map(m=>[m,X.methodDependencies?.[m]?.label||m]))}${filter('result','判定结果',Object.entries(resultNames))}${filter('tag','人工标签',custom.map(t=>[t,t]))}</div><details class="or-dataset-explanation"><summary>评测类型与数据集用途</summary><p>安全合规：直接使用测试题检查回答的安全边界。攻击对抗：使用攻击方法处理后的测试题检查模型的抵抗能力。类型优先沿用任务记录，未记录时按直接测试或其他方法推断。</p><p>演练记录 → 筛选与标注 → 冻结数据集版本 → 导出用于回归评测；人工确认的安全参考回答可导出为微调样本。</p></details><div class="or-dataset-actions">${button('选择筛选结果','App.evaluationDatasets.selectFiltered()')}${button('清空选择','App.evaluationDatasets.clearSelection()','link-btn')}<span>已选 ${DS.selection().length} 条</span>${button('批量标签','App.evaluationDatasets.tagsForm()')}${button('冻结版本','App.evaluationDatasets.versionForm()','btn primary')}</div><div class="table-wrap"><table><thead><tr><th>选择</th><th>测试样本 / 来源</th><th>标签</th><th>结果</th><th>标注</th></tr></thead><tbody>${rows.slice((DS.page-1)*size,DS.page*size).map(r=>{const a=DS.annotation(r);return `<tr><td><input type="checkbox" aria-label="选择样本 ${E(r.unit.id)}" data-key="${E(r.key)}" ${DS.selected.has(r.key)?'checked':''} onchange="App.evaluationDatasets.toggle(this.dataset.key,this.checked)"></td><td><button class="link-btn" data-task="${E(r.task.id)}" data-unit="${E(r.unit.id)}" onclick="App.evaluationRecords.inspect(this.dataset.task,this.dataset.unit)">${E(r.unit.id)}</button><p class="or-sample-prompt" title="${E(r.question?.prompt||r.unit.seedPrompt||'')}">${E(r.question?.prompt||r.unit.seedPrompt||'题目未保存')}</p><small>${E(r.task.name)} · ${DS.kind(r)}${r.task.simulated?' · 演示数据':''}</small></td><td><div class="or-sample-tags">${r.sceneIds.slice(0,3).map(id=>`<span>${E(A.sceneTags.label(id,r.question))}</span>`).join('')}<span>${E(r.unit.method)}</span>${a.tags.map(t=>`<span class="custom">${E(t)}</span>`).join('')}</div></td><td>${E(resultNames[r.unit.result]||'待判定')}</td><td><button class="link-btn" data-key="${E(r.key)}" onclick="App.evaluationDatasets.editAnnotation(this.dataset.key)">${a.reviewed?'已确认 · 编辑':'训练标注'}</button></td></tr>`;}).join('')||'<tr><td colspan="5" class="empty">没有符合条件的记录。任务执行产生的数据将自动进入此处。</td></tr>'}</tbody></table></div><div class="table-foot"><span>共 ${rows.length} 条 · 每页 ${size} 条</span><div><button class="btn small" ${DS.page<=1?'disabled':''} onclick="App.evaluationDatasets.page--;App.render()">上一页</button> ${DS.page} / ${pages} <button class="btn small" ${DS.page>=pages?'disabled':''} onclick="App.evaluationDatasets.page++;App.render()">下一页</button></div></div></section>`}`;
};
})();
