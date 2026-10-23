/* Restore only the ZIP's scan views; platform assets, tasks, models and reports stay authoritative. */
(function(){
'use strict';
const A=window.App,S=A.scanProduct,V=A.evaluation,Q=A.assessment,E=A.escape;
const B=A.scanRestoration={view:'list'},copy=v=>JSON.parse(JSON.stringify(v)),categories={'code-scan':'code','app-scan':'app','web-scan':'web'},types={code:'code-scan',app:'app-scan',web:'web-scan'};
B.payload=function(){const data={projects:[],posture:{targets:[]},modelConfigs:A.modelRoles.candidates('scanner').map(m=>({id:m.id,name:m.name,model:m.model||m.name})),trashItems:[],findings:[],candidates:[],probes:[],patches:[],artifactsByJob:{},nodesByJob:{},activityByJob:{},logsByJob:{},findingsByJob:{},candidatesByJob:{},probesByJob:{},patchesByJob:{}};
 for(const t of S.tasks()){const p=S.payload(t),project=p.projects[0],sourceId=project.id;project.id=t.id;project.platformCategory=categories[t.type];project.reportEligible=V.reportReady(t);project.status=t.status==='done'?'succeeded':t.status==='error'?'failed':t.status;data.projects.push(project);for(const key of ['artifactsByJob','nodesByJob','activityByJob','logsByJob','findingsByJob','candidatesByJob','probesByJob','patchesByJob'])data[key][t.id]=p[key]?.[sourceId]??(['artifactsByJob','logsByJob'].includes(key)?{}:[]);}
 for(const key of ['findings','candidates','probes','patches'])data[key]=Object.values(data[key+'ByJob']).flat();
 for(const type of Object.keys(categories))for(const a of S.assets(type)){data.posture.targets.push({id:a.id,name:a.name,identity:a.url||a.repository||a.name,type:type==='web-scan'?'Web 站点':type==='app-scan'?'二进制 / 软件包':'代码',platformCategory:categories[type],owner:a.owner||'',jobIds:S.tasks().filter(t=>t.targetId===a.id&&t.type===type).map(t=>t.id)});}
 return data;
};
B.frame=function(route,tab=''){return `<iframe id="scan-restored" class="scan-surface" title="漏洞检测" data-route="${E(route)}" data-tab="${E(tab)}" sandbox="allow-scripts allow-downloads allow-modals" srcdoc="${E(window.ScanRestoredDocument)}" onload="App.scanRestoration.mount(this)"></iframe>`;};
B.draft=function(){const d=S.draft||{};return {category:categories[d.type||S.tab],name:d.name||'',description:d.scope||'',target_id:d.targetId==='new'?'':d.targetId||'',model_config_id:d.modelId||A.modelRoles.candidates('scanner')[0]?.id||'',phase:d.mode||'agent-full',version_name:d.versionNote||'',target_path:d.targetPath||'',website_url:d.url||'',upload:d.upload||null,targetName:d.upload?.name||'',targetKind:'',targetFiles:0,reading:false};};
B.mountedFrames=new WeakMap();
B.frameKey=frame=>JSON.stringify([frame.dataset.route,frame.dataset.tab,categories[S.tab]]);
B.mount=function(frame){frame ||= document.getElementById('scan-restored');if(!frame)return;const exporting=B.pendingExport&&frame.dataset.route==='/projects/'+encodeURIComponent(B.pendingExport.id)?B.pendingExport:null;frame.contentWindow?.postMessage({type:'scan-restored-load',route:frame.dataset.route,tab:frame.dataset.tab,payload:B.payload(),category:categories[S.tab],draft:B.draft(),exportFormat:exporting?.format},'*');B.mountedFrames.set(frame,B.frameKey(frame));if(exporting)B.pendingExport=null;};
S.render=function(tab='code-scan'){S.init();S.tab=categories[tab]?tab:'code-scan';const t=S.tasks().find(t=>t.id===S.selected&&t.type===S.tab);if(t)return S.detailHTML(t);if(B.view==='new'&&S.draft?.type===S.tab)return B.frame('/scan/new');return B.frame('/scan/'+categories[S.tab]);};
S.detailHTML=function(t){return `<div class="aq-detail-nav"><button class="btn" data-type="${E(t.type)}" onclick="App.scanRestoration.list(this.dataset.type)">← 返回任务列表</button><div><button class="btn" data-object="${E(Q.objectKey(t))}" onclick="App.assessment.openObject(this.dataset.object)">对象评估历史</button>${['done','error','stopped'].includes(t.status)?`<button class="btn" data-id="${E(t.id)}" onclick="App.scanProduct.retest(this.dataset.id)">再次评估</button>`:''}</div></div>`+B.frame('/projects/'+encodeURIComponent(t.id),V.reportReady(t)?'report':'run');};
S.reportHTML=function(id){const t=S.tasks().find(t=>t.id===id);if(!V.reportReady(t))return A.heading('','评估报告','任务成功完成后生成报告。');return `<div class="aq-detail-nav"><button class="btn" onclick="App.evaluation.openReportList()">← 返回评估报告</button><button class="btn" data-id="${E(id)}" onclick="App.scanProduct.open(this.dataset.id)">来源任务</button></div>`+B.frame('/projects/'+encodeURIComponent(id),'report');};
S.exportReport=function(id,format='html'){const t=S.tasks().find(t=>t.id===id);if(!V.reportReady(t)){A.toast('任务成功完成后才可导出报告');return false;}if(!['html','markdown','pdf'].includes(format))return false;B.pendingExport={id,format};V.openReport(id);return true;};
B.list=function(type){B.view='list';S.selected=null;A.platform.go('evaluation','scan',type||S.tab);};
const open=S.open;S.open=function(id){B.view='list';return open.apply(S,arguments);};
const newTask=S.newTask;S.newTask=function(){B.view='new';return newTask.apply(S,arguments);};
S.form=function(){B.view='new';S.selected=null;A.closeModal();B.formNavigation=true;try{if(A.platform.state.section!=='evaluation'||A.platform.state.item!=='scan'||A.platform.scanTab!==S.tab)A.platform.go('evaluation','scan',S.tab);else A.render();}finally{B.formNavigation=false;}};
const select=A.platform.selectState;A.platform.selectState=function(section,item,tab,id){if(section==='evaluation'&&item==='scan'&&!B.formNavigation)B.view='list';return select.apply(this,arguments);};
B.navigate=function(path){let parts;try{parts=String(path).replace(/^#?\/?/,'').split('/').map(decodeURIComponent);}catch(e){return false;}if(parts[0]==='projects'&&parts[1])return S.open(parts[1]);if(parts[0]==='scan'&&parts[1]==='new')return S.newTask();if(parts[0]==='scan'&&types[parts[1]])return B.list(types[parts[1]]);if(parts[0]==='targets'&&parts[1]){const obj=Q.objects().find(v=>v.asset.id===parts[1]);if(obj)return Q.openObject(obj.key);}return B.list();};
B.create=function(value){if(!value||!S.draft)return false;const d=S.draft;Object.assign(d,{name:String(value.name||''),projectName:String(value.targetName||value.name||''),targetId:value.target_id||'new',modelId:value.model_config_id||'',mode:value.phase==='full'?'full':'agent-full',versionNote:String(value.version_name||''),materialMode:'new',source:value.upload?'upload':'path',upload:value.upload?copy(value.upload):null,targetPath:String(value.target_path||''),url:String(value.website_url||''),scope:String(value.description||''),reading:false});
 // Existing creator remains responsible for validation, version identity and asset registration.
 let error='',get=document.getElementById.bind(document);document.getElementById=function(id){if(id==='scan-error')return {set textContent(v){error=v;}};return get(id);};let result;try{result=S.create();}finally{document.getElementById=get;}
 if(!result){const frame=get('scan-restored');frame?.contentWindow?.postMessage({type:'scan-restored-error',error:error||'创建失败，请检查输入'},'*');}else B.view='list';return result;
};
window.addEventListener('message',event=>{const frame=document.getElementById('scan-restored');if(!frame||event.source!==frame.contentWindow||event.data?.type!=='scan-restored-action')return;const m=event.data;if(m.action==='ready'||m.action==='refresh')B.mount(frame);else if(m.action==='height'&&Number.isFinite(m.height)&&m.height>0)frame.style.height=Math.max(1,Math.min(30000,Math.ceil(m.height)))+'px';else if(m.action==='navigate')B.navigate(m.path);else if(m.action==='create')B.create(m.draft);else if(m.action==='recycle')S.recycle();else if(['delete','stop'].includes(m.action)&&S.tasks().some(t=>t.id===m.taskId))S.action(m.taskId,m.action);});
const tick=S.tick;
S.tick=function(){
 const frame=document.getElementById('scan-restored');if(!frame)return tick.apply(S,arguments);
 const route=frame.dataset.route||'',project=route.startsWith('/projects/')?decodeURIComponent(route.slice('/projects/'.length)):null;
 const visibleState=()=>route==='/scan/new'?'':JSON.stringify(S.tasks().filter(t=>project?t.id===project:t.type===(types[route.split('/')[2]]||S.tab)));
 const before=visibleState(),render=A.render;let result;A.render=()=>{};
 try{result=tick.apply(S,arguments);}finally{A.render=render;}
 if(result&&before!==visibleState())B.mount(frame);return result;
};
// Background attack ticks still advance and save, but must not recreate the
// scanner iframe. Scan progress already arrives through its own message bridge.
const shouldRenderTick=A.modules.attack.shouldRenderTick;
A.modules.attack.shouldRenderTick=function(){return !document.getElementById('scan-restored')&&shouldRenderTick?.apply(this,arguments)!==false;};
// Incremental rendering preserves the iframe, so a route change does not fire onload.
// Send the new route explicitly while keeping the same loaded document alive.
const afterRender=A.modules.attack.afterRender;
A.modules.attack.afterRender=function(){
 const result=afterRender?.apply(this,arguments),frame=document.getElementById('scan-restored');
 if(frame&&(B.mountedFrames.get(frame)!==B.frameKey(frame)||B.pendingExport))B.mount(frame);
 return result;
};
})();
