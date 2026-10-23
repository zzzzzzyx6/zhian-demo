/* Detection, delivery and human follow-up are independent record dimensions. */
(function(){
'use strict';
const A=window.App,S=A.contentSafety,G=A.guardrail,F=A.defenseConfigurations,D=A.defensePolicies,CP=A.contentPolicies,O=A.protectionOps,E=A.escape,U=A.unifiedGuard;
const copy=v=>JSON.parse(JSON.stringify(v)),arr=v=>Array.isArray(v)?v:[];
const Q=A.dispositionPolicy={};
Q.verdict=r=>r.detectionComplete===false||r.detectionStatus==='skipped'?'Unknown':r.verdict||r.safety||r.original?.safety||'Unknown';
Q.action=value=>value==='log'?'allow':value;
Q.label=value=>({安全:'安全',不安全:'不安全',正常:'安全',违规:'不安全',Safe:'安全',Unsafe:'不安全'}[value]||value);
Q.tableHTML=()=>'<table class="ds-table disposition-matrix"><thead><tr><th>检测判定</th><th>处置动作</th><th>后续跟进</th></tr></thead><tbody><tr><td>安全</td><td>放行</td><td>无</td></tr><tr><td>待确认</td><td>阻断</td><td>人工复核</td></tr><tr><td>不安全</td><td>阻断</td><td>无</td></tr></tbody></table>';
Q.normalize=function(p){if(!p||typeof p!=='object')return p;p.controversialAction='block';p.controversialRealtime='block';p.unsafeAction='block';p.safeAction='allow';p.reviewControversial=true;p.reviewUnsafe=false;p.reviewMode='after_delivery';if(p.failureAction==='log')p.failureAction='allow';return p;};
G.decision=function({safety='Unknown',complete=true,mode='enforce',failureAction='block'}={}){
 if(mode==='off')return {action:'allow',reviewRequired:false,status:'skipped',reviewReason:null};
 if(!complete||!['Safe','Controversial','Unsafe'].includes(safety))return {action:failureAction==='allow'||failureAction==='log'?'allow':'block',reviewRequired:false,status:'error',reviewReason:null};
 return {action:safety==='Safe'?'allow':'block',reviewRequired:safety==='Controversial',status:'complete',reviewReason:safety==='Controversial'?'检测判定待确认':null};
};
G.effectiveAction=r=>Q.action(r.effectiveAction||r.action);
for(const [owner,key] of [[F,'createDraft'],[D,'newDraft']]){const fn=owner[key];owner[key]=function(){return Q.normalize(fn.apply(this,arguments));};}
for(const [owner,key] of [[F,'snapshot'],[CP,'freeze']]){const fn=owner[key];owner[key]=function(){return Q.normalize(fn.apply(this,arguments));};}
const store=F.store;F.store=function(d){return store.call(F,Q.normalize(copy(d)));};
const validate=F.validate;F.validate=function(d){return validate.call(F,Q.normalize(copy(d)));};
const policies=O.policies;O.policies=function(){return policies.apply(O,arguments).map(p=>Q.normalize(copy(p)));};
D.actionFields=CP.actionFields=Q.tableHTML;
const detect=CP.detect;CP.detect=function(input){const r=detect.call(CP,input);if(!r.policy||['not-applicable','disabled','no-published-policy'].includes(r.detectionStatus))return r;return {...r,...G.decision({safety:r.safety,complete:!!r.modelComplete&&r.ruleResult?.complete!==false,failureAction:input.policySnapshot?.failureAction||'block'})};};
S.reviewEligible=function(value){const r=value?.requestId?S.db.requests.find(r=>r.id===value.requestId):value;return !!r&&Q.verdict(r)==='Controversial';};
S.pendingReviews=()=>S.db.reviews.filter(v=>['pending','reviewing'].includes(v.status)&&S.reviewEligible(v));
Q.followupHTML=function(r,v=S.db.reviews.find(v=>v.requestId===r.id)){
 if(v?.status==='complete')return `<span>人工复核</span><small>已完成 · ${E(Q.label(v.conclusion))}</small>`;
 if(v&&['pending','reviewing'].includes(v.status))return `<button class="link-btn" data-id="${E(v.id)}" onclick="App.contentSafety.reviewForm(this.dataset.id)">人工复核</button><small>待处理</small>`;
 return Q.verdict(r)==='Controversial'?'<span>人工复核</span>':'无';
};
S.reviewForm=function(id){const v=S.db.reviews.find(v=>v.id===id),r=S.db.requests.find(r=>r.id===v?.requestId);if(!r||!S.reviewEligible(r)||!['pending','reviewing'].includes(v.status))return false;S.reviewDraft={id,conclusion:'',opinion:'',reviewer:S.actor()};A.modal('人工复核',`<div class="gr-evidence"><strong>${E(S.appName(r.appId))}</strong><p>${E(r.text||'图片内容')}</p>${A.protectionRecords.imagesHTML(r)}<div>${S.riskBadge(Q.verdict(r))} ${S.actionBadge(Q.action(r.effectiveAction||r.action))}</div></div><div class="field"><label for="gr-review-result">人工结论</label><select id="gr-review-result" onchange="App.contentSafety.reviewDraft.conclusion=this.value"><option value="">请选择</option><option>安全</option><option>不安全</option></select></div><div class="field"><label for="cs-review-opinion">判定依据 *</label><textarea id="cs-review-opinion" rows="4" maxlength="1000" oninput="App.contentSafety.reviewDraft.opinion=this.value" placeholder="说明业务语境及判断依据"></textarea></div><p class="field-help">争议判定按当前规则拦截，实际执行动作以记录为准。人工结论独立保存，不覆盖原始判定，也不改变当时的处置动作。</p><p id="cs-review-error" class="error-message" role="alert"></p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn primary" onclick="App.contentSafety.submitReview()">提交复核</button>`);return true;};
S.completeReview=function(id,value){const v=S.db.reviews.find(v=>v.id===id),r=S.db.requests.find(r=>r.id===v?.requestId);if(!r||!S.reviewEligible(r)||!['pending','reviewing'].includes(v.status))return {error:'复核事项已处理或不存在。'};if(!['安全','不安全'].includes(value.conclusion)||!String(value.opinion||'').trim()||value.opinion.length>1000)return {error:'请选择安全或不安全，并填写 1–1000 字的判定依据。'};const event={conclusion:value.conclusion,opinion:value.opinion.trim(),reviewer:S.actor(),reviewedAt:new Date().toISOString()};(v.history||=[]).push({...event,event:'复核完成'});Object.assign(v,event,{status:'complete'});r.reviewConclusion=copy(event);(r.audit||=[]).push({event:'人工复核完成',actor:event.reviewer,time:event.reviewedAt,detail:event.conclusion+'：'+event.opinion});S.addSample(r.id,event.conclusion==='安全'?'误判候选':'确认违规','人工复核');S.audit('review.complete',v.id,event.conclusion+'：'+event.opinion,{requestId:r.id,appId:r.appId});A.save();return v;};
const detail=S.detailHTML;S.detailHTML=function(r){const v=S.db.reviews.find(v=>v.requestId===r.id),actual=r.enforcementAck===false||r.effectiveAction==='pending'?'待确认执行':Q.action(r.effectiveAction||r.action)==='block'?'阻断':'放行';return detail.call(S,r).replace(/<section><h3>即时处置与复核<\/h3>[\s\S]*?<\/section>/,`<section><h3>处置与跟进</h3><div class="kv"><span>处置动作</span><strong>${actual}</strong></div><div class="kv"><span>后续跟进</span><strong>${v||r.reviewRequired?'人工复核':'无'}</strong></div>${v?`<div class="gr-evidence"><strong>${v.status==='complete'?'人工结论：'+E(Q.label(v.conclusion)):'待人工复核'}</strong>${v.status==='complete'?`<p>${E(v.opinion||'')}</p><small>${E(v.reviewer||'')} · ${S.time(v.reviewedAt)}</small>`:''}</div>`:''}</section>`);};
const exportRow=O.exportRow;O.exportRow=function(r){const out=exportRow.call(O,r),v=S.db.reviews.find(v=>v.requestId===r.id);out.execution.suggested=Q.action(out.execution.suggested);out.execution.actual=Q.action(out.execution.actual);if(out.human_annotation){out.human_annotation.conclusion=Q.label(v.conclusion);out.human_annotation.label=Q.label(v.conclusion)==='安全'?'Safe':'Unsafe';}out.follow_up={type:v||r.reviewRequired?'manual_review':'none',status:v?.status||'none',conclusion:v?.status==='complete'?Q.label(v.conclusion):null};return out;};
const response=U.response;U.response=function(r){return {...response.call(U,r),action:Q.action(r.action),follow_up:r.reviewRequired?'manual_review':'none'};};
const reportBody=O.reportBody;O.reportBody=function(report){return reportBody.call(O,report).replace(/<p>人工复核：未发起<\/p>/g,'<p>后续跟进：无</p>').replace(/<p>人工复核：待复核<\/p>/g,'<p>后续跟进：人工复核 · 待处理</p>').replace(/<p>人工复核：/g,'<p>后续跟进：人工复核 · 已完成</p><p>人工结论：');};
const renderAttack=A.policies.renderPolicies;A.policies.renderPolicies=function(){return renderAttack.apply(this,arguments).replace('<h1>攻击策略</h1>','<h1>攻击策略配置</h1>');};
const workspace=A.policies.renderWorkspace;A.policies.renderWorkspace=function(){return workspace.apply(this,arguments).replace('<h1>攻击策略</h1>','<h1>攻击策略配置</h1>');};
const renderDefense=CP.render;CP.render=function(){return renderDefense.apply(this,arguments).replace('<h1>策略配置</h1>','<h1>防护策略配置</h1>');};
Q.migrateRecord=function(r){for(const key of ['action','suggestedAction','effectiveAction'])if(r[key]==='log')r[key]='allow';
 const verdict=Q.verdict(r),demo=r.externalVerified!==true&&(r.simulation===true||r.source==='fixture'||r.demo===true);
 if(demo&&['Safe','Controversial','Unsafe'].includes(verdict)){
  const action=verdict==='Safe'?'allow':'block';r.action=action;r.suggestedAction=action;if(r.enforcementAck){r.effectiveAction=action;r.delivered=action==='allow';r.disposition=action==='allow'?'allowed':'blocked';for(const delivery of [r.originalDelivery,...arr(r.deliveryHistory)])if(delivery){delivery.delivered=r.delivered;delivery.disposition=r.disposition;}}
  for(const row of arr(r.policyResults))if(row.complete!==false)Object.assign(row,G.decision({safety:row.safety,complete:true}));
 }
 r.reviewRequired=verdict==='Controversial';r.reviewReason=r.reviewRequired?'检测判定待确认':null;
 if(r.reviewConclusion)r.reviewConclusion.conclusion=Q.label(r.reviewConclusion.conclusion);
};
Q.migrate=function(){if(!S.db)return;
 if((A.data.dispositionPolicyVersion||0)<2){
  for(const p of F.rows().slice())if(p.controversialAction!=='block'||p.controversialRealtime!=='block'||p.unsafeAction!=='block'||p.failureAction==='log'||p.reviewControversial!==true)F.store(Q.normalize(copy(p)));
  for(const b of S.db.bindings){const p=F.latest(b.defenseConfigurationId);if(p){b.defenseConfigurationSnapshot=copy(p);b.defenseConfigurationVersion=p.version;if(b.runtime)b.runtime.failureAction=Q.action(b.runtime.failureAction);}}
  A.data.dispositionPolicyVersion=2;
 }
 for(const r of S.db.requests){Q.migrateRecord(r);if(!r.reviewRequired)continue;let v=S.db.reviews.find(v=>v.requestId===r.id);if(!v){v={id:S.uuid('review'),requestId:r.id,source:'检测判定待确认',status:'pending',createdAt:r.createdAt,history:[]};S.db.reviews.push(v);}else if(v.status==='archived')v.status='pending';}
 for(const v of S.db.reviews){if(v.conclusion)v.conclusion=Q.label(v.conclusion);for(const h of arr(v.history))if(h.conclusion)h.conclusion=Q.label(h.conclusion);}
 for(const report of S.db.protectionReports)if(report.simulation===true&&report.externalVerified!==true){for(const r of arr(report.requests)){Q.migrateRecord(r);if(r.reviewRequired&&!arr(report.reviews).some(v=>v.requestId===r.id))(report.reviews||=[]).push({requestId:r.id,status:'pending',source:'检测判定待确认'});}for(const v of arr(report.reviews))if(v.conclusion)v.conclusion=Q.label(v.conclusion);report.stats=U.summary(report.requests);}
 if(S.filter.action==='log')S.filter.action='allow';A.save();
};
const start=A.start;A.start=function(){const result=start.apply(A,arguments);Q.migrate();if(A.session)A.render();return result;};
})();
