/* One detector result per policy; protection runs for configured applications. */
(function(){
'use strict';
const A=window.App,S=A.contentSafety,O=A.protectionOps,U=A.unifiedGuard,R=A.safetyRules;
const copy=v=>JSON.parse(JSON.stringify(v));
U.partsHTML=()=>'';
U.coverageHTML=()=>'';
// All entry points use the same application list without runtime mode controls.
O.appTable=function(){return A.leanOperations.appTable();};
const exportRow=O.exportRow;
O.exportRow=function(r){
 const out=exportRow.call(O,r);
 for(const key of ['mode','coverage','coverage_scope','joint_analysis','skip_reason'])delete out[key];
 delete out.automatic.raw;
 out.automatic.policy_results=(r.policyResults||[]).map(p=>({id:p.id,name:p.name,version:p.version,part_id:p.partId||null,safety:p.safety,categories:copy(p.categories||[]),hits:copy(p.hits||[]),complete:p.complete!==false}));
 return out;
};
const start=A.start;
A.start=function(){
 const result=start.apply(A,arguments);
 if(!A.data.protectionSimplificationVersion){
  // Existing installations need the same available semantic resource as new demos.
  const semantic=R.get('cs-rule-semantic');
  if(semantic&&!semantic.enabled){semantic.enabled=true;semantic.version=(semantic.version||1)+1;}
  // Bound applications no longer have a separate platform pause state.
  for(const b of S.db.bindings)if(b.defenseConfigurationSnapshot){b.guardMode='enforce';O.syncBinding(b.appId);}
  // Retire only the known, untouched skipped demo fixture. Never rewrite real traffic as checked.
  const skipped=S.db.requests.find(r=>r.id==='PD-SKIPPED');
  if(skipped?.seedFixture&&skipped.simulation&&!skipped.externalVerified&&skipped.detectionStatus==='skipped'&&!S.db.reviews.some(v=>v.requestId===skipped.id)&&!S.db.samples.some(v=>v.requestId===skipped.id)){
   const archive=A.data.protectionCompactExamplesArchive||={requests:[],reviews:[],reports:[]};
   archive.requests.push(copy(skipped));S.db.requests=S.db.requests.filter(r=>r!==skipped);
  }
  A.data.protectionSimplificationVersion=1;A.save();
 }
 if(A.session)A.render();return result;
};
})();
