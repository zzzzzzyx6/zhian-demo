/* Platform navigation: product tasks and shared report/configuration centers. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape,I=A.icon;
const sections=[['workspace','安全态势','grid'],['evaluation','安全评估','file'],['protection','安全防护','shield'],['policy','策略中心','settings'],['assets','资产中心','box'],['risk','风险中心','alert'],['management','平台管理','settings']];
const menus={workspace:[],evaluation:[['scan','漏洞检测','search'],['attack','模型演练','shield'],['reports','评估报告','file'],['compare','结果对比','file']],protection:[['overview','防护总览','shield'],['records','防护记录','file'],['reports','防护报告','file']],policy:[['policies','攻击策略配置','layers'],['defense','防护策略配置','shield']],assets:[['applications','AI 应用','layers'],['models','模型','box'],['code','代码','code'],['packages','二进制/软件包','box'],['web','Web','link']],risk:[['events','风险事件','alert'],['rules','触发规则','settings']]};
const attackTabs=[['arena','演练场'],['tasks','任务管理']],scanTabs=[['code-scan','代码检测'],['app-scan','二进制／软件包检测'],['web-scan','Web 检测']],policyTabs=[['strategies','策略配置'],['methods','攻击方法'],['content','攻击题库']];
const P=A.platform={state:{section:'workspace',item:'home'},lastAttackTab:'tasks',scanTab:'code-scan',scanOpen:true,attackOpen:true,policyOpen:true,defenseOpen:true,sections,menus};
menus.management=[['model-roles','模型配置','settings']];
P.title=()=>P.state.section==='workspace'?'安全态势':menus[P.state.section]?.find(row=>row[0]===P.state.item)?.[1]||'安全态势';
P.selectState=function(section,item,tab,id){
 if(section==='evaluation'&&item==='attack'&&(!tab||tab==='arena')){tab='tasks';id=undefined;}
 if(section==='risk'&&['rules','grading'].includes(item))section='management';
 if(section==='evaluation'&&item==='compare'){item='reports';tab=tab==='objects'?'objects':'compare';}
 if(section==='evaluation'&&item==='tasks'){item='attack';id=tab;tab='tasks';}
 if(section==='evaluation'&&(!item||['home','operations'].includes(item))){item='scan';tab='code-scan';id=undefined;}
 if(section==='evaluation'&&item==='attack'&&tab==='series'){item='reports';tab='compare';}
 if(section==='evaluation'&&item==='attack'&&tab==='banks'){section='policy';item='policies';tab='content';}
 if(section==='evaluation'&&item==='attack'&&tab==='details'){tab='tasks';id=A.evaluationRecords?.state.task!=='all'?A.evaluationRecords?.state.task:undefined;}
 if(section==='policy'&&['methods','judges','templates'].includes(item)){tab=item==='methods'?'methods':'strategies';item='policies';}
 if(section==='protection'){
  if(item==='content')item=({requests:'records',samples:'records'}[tab]||tab||'applications');
  if(item==='requests'||item==='samples'){tab=item;item='records';}
  if(['review','settings','applications'].includes(item))item='overview';
 }
 if(section==='policy'&&item==='rules'){item='defense';tab='rules';}
 if(section==='risk'&&['overview','records'].includes(item))item='events';
 if(section==='management'&&(!item||['home','models','roles'].includes(item)))item='model-roles';
 if(section==='workspace')item='home';
 if(!sections.some(s=>s[0]===section)||(section!=='workspace'&&!menus[section].some(row=>row[0]===item)))return false;
 // Page changes discard unfinished forms; saved policies and task snapshots are unaffected.
 if(!A.scanRestoration?.formNavigation){
  X.wizard=null;A.policies.draft=null;A.policies.taskPolicyReturn=null;A.connections.draft=null;A.connections.assetPickers={};
  if(A.scanProduct)A.scanProduct.draft=null;
  if(A.policyUsability){A.policyUsability.pendingPolicy=null;A.policyUsability.pendingTask=null;}
  if(A.assessment)A.assessment.pendingScanDraft=null;
  if(A.policyKnowledge)A.policyKnowledge.pendingDraft=null;
  if(A.modelRoles){A.modelRoles.draft?.capabilityController?.abort();A.modelRoles.draft=null;}
 }
 P.state={section,item};P.applicationId=section==='assets'&&item==='applications'?(tab||null):null;X.selected=null;X.rangePreview=false;X.tab='platform';
 if(A.evaluation)A.evaluation.scanReportId=null;
 if(section==='evaluation'&&item==='attack'){
  X.tab=attackTabs.some(t=>t[0]===tab)?tab:P.lastAttackTab;P.attackOpen=true;X.detailTab='board';
  if(id&&X.db.tasks.some(t=>t.id===id&&!t.deletedAt)){if(X.tab==='arena')X.arena={taskId:id,unitId:null,replay:null};else{X.selected=id;X.tab='tasks';}}
 }else if(section==='evaluation'&&item==='scan'){
  P.scanTab=scanTabs.some(t=>t[0]===tab)?tab:P.scanTab;P.scanOpen=true;if(A.scanProduct)A.scanProduct.selected=id||null;
 }else if(section==='evaluation'&&item==='reports'){
  if(A.evaluation){A.evaluation.reportTab=['compare','objects'].includes(tab)?tab:'list';if(A.assessment)A.assessment.selectedObject=tab==='objects'?id||null:null;if(tab==='scan'&&id)A.evaluation.scanReportId=id;}
  const task=X.db.tasks.find(t=>t.id===tab&&!t.deletedAt);
  if(task&&A.evaluation?.reportReady(task)){X.selected=task.id;X.tab='tasks';X.detailTab='report';}
 }else if(section==='assets'&&item==='models'){X.tab='models';X.connectionKind='model';}
 else if(section==='policy'&&item==='policies'){A.policies.section=policyTabs.some(t=>t[0]===tab)?tab:'strategies';P.policyOpen=true;}
 else if(section==='policy'&&item==='defense'){A.defensePolicies.tab=['configurations','basics','rules','knowledge'].includes(tab)?tab:tab==='policies'?'basics':'configurations';}
 else if(section==='protection'&&item==='records'&&A.contentProduct){A.contentProduct.recordsTab=tab==='samples'?'samples':'requests';}
 return true;
};
P.go=function(section,item,tab,id){section=sections.some(s=>s[0]===section)?section:'workspace';item ||= section==='workspace'?'home':menus[section][0][0];if(!P.selectState(section,item,tab,id))return;A.closeModal();A.closeDrawer();A.render();window.scrollTo({top:0,behavior:'instant'});};
P.navigate=page=>({attack:()=>P.go('evaluation','attack'),workspace:()=>P.go('workspace','home'),models:()=>P.go('assets','models'),review:()=>P.go('protection','overview'),scan:()=>P.go('evaluation','scan')})[page]?.();
P.attackTab=tab=>P.go('evaluation','attack',tab);P.scanPage=(tab,id)=>P.go('evaluation','scan',tab,id);
P.sync=function(){
 if(X.tab==='models'){P.state={section:'assets',item:'models'};X.connectionKind='model';}
 else if(X.tab==='banks'){P.state={section:'policy',item:'policies'};X.tab='platform';A.policies.section='content';}
 else if(X.selected||['tasks','create'].includes(X.tab)){
  const report=X.selected&&X.detailTab==='report'&&A.evaluation?.reportReady(X.task);
  if(X.selected&&X.detailTab==='report'&&!report)X.detailTab='board';
  P.state={section:'evaluation',item:report?'reports':'attack'};if(!report)P.lastAttackTab='tasks';
 }else if(X.tab==='series'){P.state={section:'evaluation',item:'reports'};if(A.evaluation)A.evaluation.reportTab='compare';X.tab='platform';}
 else if(X.tab==='arena'){X.tab='tasks';X.selected=null;P.state={section:'evaluation',item:'attack'};P.lastAttackTab='tasks';}
 else if(X.tab==='details'){X.tab='tasks';P.state={section:'evaluation',item:'attack'};P.lastAttackTab='tasks';}
};
P.restoreRoute=function(){const p=location.hash.slice(1).split('/').map(v=>{try{return decodeURIComponent(v);}catch(e){return v;}});if(p[0]==='attack')P.selectState('evaluation','attack','arena');else if(!p[0])P.selectState('workspace','home');else if(!P.selectState(p[0],p[1]||'home',p[2],p[3]))P.selectState('workspace','home');};
P.empty=title=>A.heading('',title,'')+'<section class="platform-empty card"><div class="platform-empty-symbol">'+I('layers',32)+'</div><p>暂无内容</p></section>';
P.header=function(){return '<button class="platform-brand" onclick="App.platform.go(\'workspace\',\'home\')" aria-label="AI安全平台安全态势"><strong>AI安全平台</strong></button><nav class="platform-top-nav" aria-label="平台主导航">'+sections.filter(([id])=>id!=='management').map(([id,label])=>'<button class="'+(P.state.section===id?'active':'')+'" onclick="App.platform.go(\''+id+'\')">'+label+'</button>').join('')+'</nav><div class="platform-header-actions"><button class="platform-icon-button" aria-label="平台设置" title="平台设置" onclick="App.platform.go(\'management\',\'model-roles\')">'+I('settings',20)+'</button>'+(A.platformNotifications?.buttonHTML()||'<button class="platform-icon-button" aria-label="消息通知" onclick="App.platformNotifications.open()">'+I('bell',20)+'</button>')+'<button class="platform-account" aria-label="账号与退出登录" title="账号与退出登录" onclick="App.account()"><span class="avatar">'+I('user',17)+'</span><span class="account-name">'+E(A.session?.user||'安全管理员')+'</span></button></div>';};
P.sidebar=function(){
 const section=P.state.section;if(['workspace','risk'].includes(section))return '';const def=sections.find(s=>s[0]===section);
 const child=(label,action,active)=>'<button class="platform-subitem '+(active?'active':'')+'" onclick="'+action+'">'+label+'</button>';
 return '<div class="platform-side-title"><strong>'+def[1]+'</strong><button id="center-toggle" class="platform-collapse" aria-controls="center-navigation" aria-expanded="'+!A.data.ui?.sidebarCollapsed+'" aria-label="'+(A.data.ui?.sidebarCollapsed?'展开':'收起')+'侧边栏" title="'+(A.data.ui?.sidebarCollapsed?'展开':'收起')+'侧边栏" onclick="App.centers.toggle()">'+I('chevron',15)+'</button></div><nav id="center-navigation" aria-label="'+def[1]+'侧边栏">'+menus[section].map(([id,label,icon])=>{
  const comparing=section==='evaluation'&&['compare','objects'].includes(A.evaluation?.reportTab)&&!X.selected&&!A.evaluation?.scanReportId;
  const active=section==='evaluation'&&id==='compare'?P.state.item==='reports'&&comparing:section==='evaluation'&&id==='reports'?P.state.item==='reports'&&!comparing:P.state.item===id,group=section==='evaluation'&&id==='scan'?'scan':section==='policy'&&id==='policies'?'policy':section==='policy'&&id==='defense'?'defense':null,expanded=group?P[group+'Open']:false;
  const action=group?"App.platform.toggleGroup('"+group+"')":"App.platform.go('"+section+"','"+id+"')";
  let html='<button class="platform-side-item '+(active?'active':'')+'" aria-label="'+label+'" title="'+label+'" '+(group?'aria-expanded="'+expanded+'"':'')+' onclick="'+action+'"><span>'+label+'</span>'+(group?'<i class="platform-menu-chevron '+(expanded?'open':'')+'">'+I('chevron',13)+'</i>':'')+'</button>';
  if(group==='policy'||group==='defense'){
   const tab=group==='policy'?'strategies':'configurations',selected=active&&(group==='policy'?A.policies.section:A.defensePolicies.tab)===tab;
   html='<div class="platform-nav-parent"><button class="platform-side-item '+(selected?'active':'')+'" onclick="App.platform.go(\'policy\',\''+id+'\',\''+tab+'\')"><span>'+label+'</span></button><button class="platform-group-toggle" aria-label="'+(expanded?'收起':'展开')+label+'资源" aria-expanded="'+expanded+'" onclick="App.platform.toggleResources(\''+group+'\')"><i class="platform-menu-chevron '+(expanded?'open':'')+'">'+I('chevron',13)+'</i></button></div>';
  }
  if(group==='attack'&&expanded)html+='<div class="platform-subnav">'+attackTabs.map(([tab,name])=>child(name,"App.platform.attackTab('"+tab+"')",active&&P.lastAttackTab===tab)).join('')+'</div>';
  if(group==='scan'&&expanded)html+='<div class="platform-subnav">'+scanTabs.map(([tab,name])=>child(name,"App.platform.scanPage('"+tab+"')",active&&P.scanTab===tab)).join('')+'</div>';
  if(group==='policy'&&expanded)html+='<div class="platform-subnav">'+policyTabs.filter(t=>t[0]!=='strategies').map(([tab,name])=>child(name,"App.platform.go('policy','policies','"+tab+"')",active&&A.policies.section===tab)).join('')+'</div>';
  if(group==='defense'&&expanded)html+='<div class="platform-subnav">'+[['basics','基础策略'],['rules','规则库'],['knowledge','词库']].map(([tab,name])=>child(name,"App.platform.go('policy','defense','"+tab+"')",active&&A.defensePolicies.tab===tab)).join('')+'</div>';
  return (section==='assets'&&['applications','models'].includes(id)?'<div class="platform-asset-group">'+(id==='applications'?'业务应用':'技术资产')+'</div>':'')+html;
 }).join('')+'</nav><div class="platform-side-footer"><span>AI 安全平台</span></div>';
};
P.toggleGroup=function(group){const section=['policy','defense'].includes(group)?'policy':'evaluation',item=group==='policy'?'policies':group;if(P.state.section===section&&P.state.item===item){P[group+'Open']=!P[group+'Open'];P.renderChrome();}else{P[group+'Open']=true;P.go(section,item);}};
P.toggleResources=function(group){if(!['policy','defense'].includes(group))return;P[group+'Open']=!P[group+'Open'];P.renderChrome();};
P.toggleScan=()=>P.toggleGroup('scan');P.toggleAttack=()=>P.toggleGroup('attack');P.account=()=>A.account();
P.renderChrome=function(){
 P.sync();const app=document.getElementById('app'),dashboard=['workspace','risk'].includes(P.state.section);app.classList.add('platform-shell');app.classList.toggle('has-center-nav',!dashboard);app.classList.remove('is-portal');app.classList.toggle('dashboard-layout',dashboard);app.classList.toggle('nav-collapsed',!dashboard&&!!A.data.ui?.sidebarCollapsed);
 for(const [id,html] of [['platform-header',P.header()],['center-sidebar',P.sidebar()]]){const host=document.getElementById(id);if(A.updateHTML)A.updateHTML(host,html);else if(host.innerHTML!==html)host.innerHTML=html;}document.getElementById('center-sidebar').hidden=dashboard;
 let leaf=P.title(),hash=P.state.section+'/'+P.state.item;
 if(P.state.section==='evaluation'&&P.state.item==='attack'){leaf=X.tab==='create'?'新建演练任务':X.selected?'演练任务详情':attackTabs.find(t=>t[0]===P.lastAttackTab)?.[1];hash='evaluation/attack/'+P.lastAttackTab+(X.selected?'/'+encodeURIComponent(X.selected):X.tab==='create'?'/create':X.tab==='arena'&&X.arena.taskId&&X.db.tasks.some(t=>t.id===X.arena.taskId&&!t.deletedAt)?'/'+encodeURIComponent(X.arena.taskId):'');}
 if(P.state.section==='evaluation'&&P.state.item==='scan'){leaf=scanTabs.find(t=>t[0]===P.scanTab)?.[1]||'漏洞扫描';hash='evaluation/scan/'+P.scanTab+(A.scanProduct?.selected?'/'+encodeURIComponent(A.scanProduct.selected):'');}
 if(P.state.section==='evaluation'&&P.state.item==='reports'){leaf=X.selected||A.evaluation?.scanReportId?'评估报告':A.evaluation?.reportTab==='objects'?'结果对比':A.evaluation?.reportTab==='compare'?'结果对比':'评估报告';hash='evaluation/reports'+(X.selected?'/'+encodeURIComponent(X.selected):A.evaluation?.scanReportId?'/scan/'+encodeURIComponent(A.evaluation.scanReportId):A.evaluation?.reportTab==='objects'?'/objects'+(A.assessment?.selectedObject?'/'+encodeURIComponent(A.assessment.selectedObject):''):A.evaluation?.reportTab==='compare'?'/compare':'');}
 if(P.state.section==='assets'&&P.state.item==='applications'&&P.applicationId){leaf='应用详情';hash='assets/applications/'+encodeURIComponent(P.applicationId);}
 if(P.state.section==='policy'&&P.state.item==='policies'){leaf=A.policies.section==='strategies'?'攻击策略配置':policyTabs.find(t=>t[0]===A.policies.section)?.[1];hash='policy/policies/'+A.policies.section;}
 if(P.state.section==='policy'&&P.state.item==='defense'){leaf=({configurations:'防护策略配置',basics:'基础策略',rules:'规则库',knowledge:'词库'})[A.defensePolicies.tab]||'策略配置';hash='policy/defense/'+A.defensePolicies.tab;}
 const sectionName=sections.find(s=>s[0]===P.state.section)?.[1];document.getElementById('current-crumb').textContent=dashboard?sectionName:sectionName+' / '+leaf;document.title=leaf+' · AI安全平台';app.dataset.section=X.tab;app.dataset.platformSection=P.state.section;
 if(location.hash.slice(1)!==hash)history.replaceState(null,'','#'+hash);
};
const render=A.modules.attack.render;
A.modules.attack.render=function(){
 P.sync();const {section,item}=P.state;
 if(section==='workspace')return A.platformHome?.render()||P.empty('安全态势');
 if(section==='management'&&item==='model-roles')return A.modelRoles.renderManagement();
 if(section==='assets'&&item==='models')return A.modelRoles?.render()||P.empty(P.title());
 if(section==='assets'&&item==='applications')return A.contentSafety.assetHTML();
 if(section==='assets')return A.platformGovernance?.assetsHTML(item)||P.empty(P.title());
 if(section==='evaluation'&&item==='attack'){
  if(X.tab==='create')return render.apply(this,arguments);if(X.selected)return A.evaluation.taskDetailHTML(X.task);if(X.tab==='tasks')return A.evaluation.tasksHTML();
  return A.heading('','攻防演练场','观察自动执行链路与当前任务进度。','<button class="btn primary" onclick="App.attack.newTask()">'+I('plus',14)+'新建演练任务</button>')+X.arenaHTML();
 }
 if(section==='evaluation'&&item==='scan')return A.scanProduct?.render(P.scanTab)||P.empty('漏洞扫描');
 if(section==='evaluation'&&item==='reports')return A.evaluation.scanReportId?A.scanProduct?.reportHTML(A.evaluation.scanReportId):X.selected?A.evaluation.reportDetailHTML(X.task):A.evaluation.reportsHTML();
 if(section==='policy'&&item==='policies')return A.policies.renderWorkspace();if(section==='policy'&&item==='defense')return A.contentPolicies.render();if(section==='policy'&&item==='rules')return A.safetyRules.render();
 if(section==='protection')return A.contentProduct?A.contentProduct.render(item):A.contentSafety.render(item==='records'?'requests':item);
 if(section==='risk')return A.platformGovernance?.renderRisk(item)||P.empty(P.title());
 return P.empty(P.title());
};
A.centers.render=P.renderChrome;A.centers.go=id=>id==='models'?P.go('assets','models'):P.attackTab(id);X.back=()=>P.go('evaluation','attack','tasks');
X.openResultTask=function(id,report=false){if(report&&A.evaluation?.reportReady(X.db.tasks.find(t=>t.id===id)))A.evaluation.openReport(id);else X.open(id);};
if(A.evaluationRecords)A.evaluationRecords.open=function(id){if(id&&X.db.tasks.some(t=>t.id===id)){A.evaluationRecords.setScope(id);X.open(id);X.detailTab='samples';A.render();}else P.go('evaluation','attack','tasks');};
P.render=()=>A.render();window.addEventListener('hashchange',()=>{if(A.session){P.restoreRoute();A.closeModal();A.closeDrawer();A.render();}});
})();
