/* Creation metadata and shared list presentation; existing actions remain authoritative. */
(function(){
'use strict';
const A=window.App,P=window.ListPresentation,E=A.escape,arr=v=>Array.isArray(v)?v:[];
const T=A.listConsistency={time:P.time,created:r=>r?.createdAt||r?.created||r?.created_at,generated:r=>r?.reportGeneratedAt||r?.generatedAt||r?.completedAt||r?.finishedAt||r?.finished};
T.cell=value=>`<td class="lc-time" title="北京时间（UTC+8）">${P.time(value)}</td>`;
// Track persistent resource identities, not render time. Existing undated records stay undated.
let ready=false;const known=new Map();
function collections(){const d=A.data;return {
 models:A.connections.db,applications:d.aiApplications,banks:d.banks,policies:d.attackPolicies,
 basics:d.contentSafetyPolicies,rules:d.safetyRules,configurations:d.defenseConfigurations,
 members:d.enterpriseManagement?.members,templates:d.attackMethodTemplates,
 tasks:d.attack?.tasks,scans:A.scanProduct.db?.tasks,
 ...Object.fromEntries(['code','packages','web'].map(k=>['assets-'+k,d.businessAssets?.[k]]))
 };}
T.recordTimes=function(baseline=false){
 for(const [kind,rows] of Object.entries(collections()))for(const r of arr(rows)){
  if(!r?.id)continue;const key=kind+':'+r.id,previous=known.get(key);
  if(!baseline&&ready){
   if(!known.has(key)&&!T.created(r))r.createdAt=new Date().toISOString();
   else if(previous&&!T.created(r))r.createdAt=previous;
  }
  known.set(key,T.created(r)||null);
 }
};
const encode=A.storageCodec.encode;
A.storageCodec.encode=function(data){if(data===A.data&&ready)T.recordTimes();return encode.apply(this,arguments);};
const copyPolicy=A.policies.copy;A.policies.copy=function(){const result=copyPolicy.apply(this,arguments);if(A.policies.draft&&!A.policies.draft.id)for(const key of ['createdAt','created','created_at','updatedAt'])delete A.policies.draft[key];return result;};
const start=A.start;A.start=function(){const result=start.apply(this,arguments);T.recordTimes(true);ready=true;return result;};
// Add one column before actions to explicitly registered resource tables.
T.tableTimes=function(html,rows,label='创建时间',get=T.created){
 return html.replace(/<table\b[^>]*>[\s\S]*?<\/table>/g,table=>{
  if(!/<th[^>]*>操作<\/th>/.test(table)||table.includes('data-lc-time'))return table;
  const head=table.match(/<thead>[\s\S]*?<\/thead>/)?.[0]||'';
  if(head.includes('>'+label+'</th>'))return table;
  table=table.replace(/<th([^>]*)>操作<\/th>/,`<th class="lc-time" data-lc-time title="北京时间（UTC+8）">${label}</th><th$1>操作</th>`);
  return table.replace(/(<tbody[^>]*>)([\s\S]*?)(<\/tbody>)/,(all,open,body,close)=>open+T.rowTimes(body,rows,get)+close);
 });
};
T.rowTimes=function(body,rows,get=T.created){return body.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/g,row=>{
 if(/colspan="\d+"/.test(row))return row.replace(/colspan="(\d+)"/,(_,n)=>`colspan="${Number(n)+1}"`);
 const first=row.match(/<td\b[^>]*>[\s\S]*?<\/td>/)?.[0]||'',id=(first.match(/data-id="([^"]+)"/)||row.match(/data-id="([^"]+)"/))?.[1];
 const record=arr(rows).find(r=>id?E(r.id)===id:first.includes("('"+E(r.id)+"')")||first.includes('>'+E(r.name)+'</'));
 return row.replace(/(<td\b[^>]*>(?:(?!<td\b)[\s\S])*?<\/td>)\s*<\/tr>$/,T.cell(get(record))+'$1</tr>');
 });};
function wrap(object,name,rows,label,get){const original=object?.[name];if(typeof original!=='function')return;object[name]=function(){return P.html(T.tableTimes(original.apply(this,arguments),typeof rows==='function'?rows.apply(this,arguments):rows,label,get));};}
wrap(A.modelRoles,'render',()=>A.connections.db);
wrap(A.leanAssets,'list',kind=>A.leanAssets.rows(kind));
wrap(A.defenseConfigurations,'table',()=>A.defenseConfigurations.rows());
wrap(A.defenseConfigurations,'basicTable',()=>A.defensePolicies.policyRows());
wrap(A.safetyRules,'render',()=>A.safetyRules.db);
wrap(A.protectionMvp,'knowledge',()=>A.safetyRules.db);
wrap(A.policies,'renderPolicies',()=>A.policies.db);
wrap(A.policyManagement,'identityHTML',()=>A.data.enterpriseManagement?.members);
wrap(A.leanOperations,'appTable',()=>A.contentSafety.apps);
A.protectionOps.appTable=A.leanOperations.appTable;
wrap(A.octoberRefinement,'results',()=>[...A.attack.db.tasks,...A.scanProduct.tasks()]);
// Catalog search updates only tbody; keep its header and row renderer in sync.
const catalog=A.banks.catalogTable;A.banks.catalogTable=function(){return P.html(T.rowTimes(catalog.apply(this,arguments),A.banks.catalogRows()));};
for(const [object,name] of [[A.banks,'render'],[A.policies,'renderContent']]){const old=object[name];object[name]=function(){return P.html(old.apply(this,arguments).replace('<th>操作</th>','<th class="lc-time" title="北京时间（UTC+8）">创建时间</th><th>操作</th>'));};}
const profile=A.leanAssets.profile;A.leanAssets.profile=function(kind,record){return profile.apply(this,arguments).replace('<dl class="la-facts">',`<dl class="la-facts"><div><dt>创建时间（北京时间）</dt><dd>${P.time(T.created(record))}</dd></div>`);};
const render=A.modules.attack.render;A.modules.attack.render=function(){return P.html(render.apply(this,arguments));};
for(const name of ['modal','drawer']){const old=A[name];A[name]=function(title,body,footer,...rest){return old.call(this,title,P.html(body),P.html(footer),...rest);};}
const update=A.updateHTML;if(update)A.updateHTML=function(id,html,...rest){return update.call(this,id,P.html(html),...rest);};
const deleteButton=A.entryManagement.button;A.entryManagement.button=function(){return P.html(deleteButton.apply(this,arguments));};
A.contentSafety.time=P.time;
})();
