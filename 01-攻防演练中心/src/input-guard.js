/* Shared Qwen3Guard asset and task-selected moderation stages. */
(function(){
'use strict';
const A=window.App,C=A.connections,X=A.attack,guardId='system-qwen3guard';
const fixtureIds=new Set(['EV-260919-077','EV-260918-210','EV-260910-033']);
X.ensureInputGuard=function(){
  let m=C.db.find(m=>m.id===guardId);
  if(!m){m={id:guardId,kind:'model',systemGuard:true,name:'Qwen3Guard · Gen-4B',model:'Qwen/Qwen3Guard-Gen-4B',comparisonGroup:'Qwen3Guard',versionLabel:'Gen-4B',hosting:'local',schema:3,accessType:'api',protocol:'openai',sample:false,caps:['text','chat'],uses:['guard'],timeout:60};C.db.push(m);}
  if(!X.db.inputGuardDefaultVersion){
    if(!m.endpoint)Object.assign(m,{endpoint:'https://guard.demo.invalid/v1',auth:'none',connectStatus:'ok',presetPending:false,demoConfigured:true,simulated:true});
    X.db.inputGuardDefaultVersion=1;
  }
};
const normalize=X.normalizePresetDefenses;
X.normalizePresetDefenses=function(){
  X.ensureInputGuard();
  const fixtures=X.db.tasks.filter(t=>fixtureIds.has(t.id)&&t.simulated&&!t.inputGuardPresetVersion);
  for(const t of fixtures)delete t.presetDefenseVersion;
  const changed=normalize.call(X);
  for(const t of fixtures)t.inputGuardPresetVersion=1;
  if(fixtures.length)A.save();
  return changed||fixtures.length>0;
};
const state=C.connState;
C.connState=function(m){
  if(m?.id===guardId){
    if(m.connectStatus==='testing')return {label:'测试中',tone:'blue',testing:true};
    if(m.presetPending||!m.endpoint||m.connectStatus!=='ok')return {label:'未连通',tone:'gray',ok:false};
  }
  return state.call(C,m);
};
const blueEditor=X.blueEditor;
X.blueEditor=function(w){return blueEditor(w).replace(/<div class="guard-access-link">[\s\S]*?<\/div>/g,'');};
X.isInputGuard=t=>t?.defense?.systemGuard==='qwen3guard'&&t.defense.modelInput===true&&t.defense.modelOutput===false;
X.guardFlow=function(t){const d=t?.defense,enabled=d?.systemGuard==='qwen3guard';return {enabled,input:enabled&&!!d.modelInput,output:enabled&&!!d.modelOutput};};
X.guardStages=function(t){const g=X.guardFlow(t);return g.enabled?[['攻击生成',0],...(g.input?[['输入护栏',1]]:[]),['靶标响应',2],...(g.output?[['输出护栏',3]]:[]),['裁判判定',4]]:[['攻击生成',0],['输入防守',1],['靶标响应',2],['输出防守',3],['裁判判定',4]];};
// Include the saved execution positions wherever users compare or export results.
const seriesHTML=X.seriesHTML;
X.seriesHTML=function(){return seriesHTML.apply(X,arguments).replace(/<tr data-task="([^"]+)">[\s\S]*?<\/tr>/g,(row,id)=>{const t=X.db.tasks.find(t=>A.escape(t.id)===id);return t?.defense?.systemGuard==='qwen3guard'?row.replace(/(<td class="result-defense-cell">)[\s\S]*?(<\/td>)/,(_,open,close)=>open+A.escape(X.blueLabel(t.defense,true))+close):row;});};
const report=X.report;
X.report=function(t){return report.apply(X,arguments).replace('防守方式：'+A.escape(X.blueLabel(t.defense)),'防守方式：'+A.escape(X.blueLabel(t.defense,true)));};
const reportHTML=X.reportHTML;
X.reportHTML=function(){const html=reportHTML.apply(X,arguments),t=X.task;return t?html.replace('<th>防护配置</th><td>'+A.escape(X.blueLabel(t.defense)),'<th>防护配置</th><td>'+A.escape(X.blueLabel(t.defense,true))):html;};
})();
