/* Object-scoped result history reuses the existing saved-evidence summaries. */
(function(){
'use strict';
const A=window.App,R=A.octoberRefinement,X=A.attack,V=A.evaluation,Q=A.assessment,E=A.escape;
const C=A.exerciseResults={object:'',query:'',selected:new Set()};
const original=R.results;
const link=(name,t,action)=>`<button class="link-btn" data-id="${E(t.id)}" onclick="${action}(this.dataset.id)">${E(name)}</button>`;
C.tasks=()=>X.db.tasks.filter(t=>!t.deletedAt&&V.type(t)==='attack').slice().sort((a,b)=>String(b.created||'').localeCompare(String(a.created||'')));
C.version=t=>t.runSnapshot?.targetSnapshot?.versionLabel||t.runSnapshot?.targetSnapshot?.version||t.targetSnapshot?.versionLabel||t.targetSnapshot?.version||t.targetMeta?.version||t.targetMaterial?.version||'未记录版本';
C.target=t=>t.targetName||t.targetSnapshot?.name||X.targetFor(t)?.name||'历史对象';
C.setObject=function(value){C.object=value;C.selected.clear();A.render();};
C.toggle=function(id,on){const t=C.tasks().find(t=>t.id===id);if(!t||!C.object||Q.objectKey(t)!==C.object||!X.taskAnalysis(t).valid)return;if(on)C.selected.add(id);else C.selected.delete(id);A.render();};
C.render=function(){
 const all=C.tasks(),objects=new Map();for(const t of all)objects.set(Q.objectKey(t),C.target(t));
 const scoped=all.filter(t=>!C.object||Q.objectKey(t)===C.object),rows=scoped.filter(t=>!C.query||[t.name,C.target(t),C.version(t)].join(' ').toLowerCase().includes(C.query.toLowerCase()));
 const selected=scoped.filter(t=>C.object&&C.selected.has(t.id)),object=C.object?{key:C.object,kind:'models',name:objects.get(C.object),tasks:scoped}:null;
 const summary=object?A.objectAnalysis.render(object):'';
 const comparison=selected.length>=2?`<section class="card review21-comparison"><h2>所选任务 / 版本结果对比</h2><p>攻破率按有效判定计算；执行异常不计入分母。版本未记录时保留任务名称，题库、策略或防护配置不同的结果需结合条件理解。</p><div class="table-wrap"><table><thead><tr><th>任务</th><th>对象版本</th><th>题库</th><th>攻击策略</th><th>防护方案</th><th>攻破率</th><th>攻破 / 有效判定</th></tr></thead><tbody>${selected.map(t=>{const a=X.taskAnalysis(t),p=t.runSnapshot?.policy||t.runSnapshot?.policySnapshot||t.policySnapshot;return `<tr><td>${link(t.name,t,'App.evaluation.openReport')}</td><td>${E(C.version(t))}</td><td>${E(t.runSnapshot?.bankSnapshot?.name||t.bankSnapshot?.name||'未记录')}</td><td>${E(p?.name||'自定义配置')}</td><td>${E(X.blueLabel(t.runSnapshot?.defense||t.defense))}</td><td>${a.valid?(a.breach/a.valid*100).toFixed(1)+'%':'—'}</td><td>${a.breach} / ${a.valid}</td></tr>`;}).join('')}</tbody></table></div></section>`:'';
 return A.heading('','演练结果','选择演练对象，查看全部历史任务并对比不同版本的结果。')+`<section class="card"><div class="toolbar review21-result-filters"><label>演练对象 <select aria-label="筛选演练对象" onchange="App.exerciseResults.setObject(this.value)"><option value="">全部演练对象</option>${[...objects].map(([id,name])=>`<option value="${E(id)}" ${C.object===id?'selected':''}>${E(name)}</option>`).join('')}</select></label><input type="search" aria-label="搜索任务或版本" placeholder="搜索任务或对象版本" value="${E(C.query)}" onchange="App.exerciseResults.query=this.value;App.render()"><span>${C.object?'已选 '+selected.length+' 项；勾选至少两项进行对比':'选择一个对象后可勾选任务进行版本对比'}</span></div></section>${summary}${comparison}<section class="card"><div class="table-wrap"><table><thead><tr><th>对比</th><th>任务</th><th>演练对象</th><th>对象版本</th><th>状态</th><th>攻破率</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${rows.map(t=>{const a=X.taskAnalysis(t);return `<tr><td><input type="checkbox" aria-label="对比 ${E(t.name)}" data-id="${E(t.id)}" ${C.selected.has(t.id)?'checked':''} ${!C.object||!a.valid?'disabled':''} onchange="App.exerciseResults.toggle(this.dataset.id,this.checked)"></td><td>${link(t.name,t,'App.attack.open')}</td><td>${E(C.target(t))}</td><td>${E(C.version(t))}</td><td>${Q.taskStatus(t)}</td><td>${a.valid?(a.breach/a.valid*100).toFixed(1)+'%':'—'}<small>${a.breach} / ${a.valid} 个有效判定</small></td><td>${A.listConsistency.time(t.created||t.createdAt)}</td><td>${V.reportReady(t)?link('查看报告',t,'App.evaluation.openReport'):'—'}</td></tr>`;}).join('')||'<tr><td colspan="8" class="empty">暂无匹配的任务结果</td></tr>'}</tbody></table></div></section>`;
};
R.results=function(){return R.domain==='scan'?original.apply(R,arguments):C.render();};
})();
