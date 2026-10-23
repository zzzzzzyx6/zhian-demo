/* Classified multi-select controls keep resource selection beside its parameters. */
(function(){
'use strict';
const A=window.App,P=A.policies,B=A.banks,E=A.escape;
P.selection={methods:{group:'',scope:''},banks:{group:'',scope:''}};
const edit=P.edit;
P.edit=function(){P.selection={methods:{group:'',scope:''},banks:{group:'',scope:''}};return edit.apply(P,arguments);};
P.selectionRows=function(kind){
 if(kind==='banks')return B.db.map(b=>({...b,group:B.industryLabel(b.industry),scope:b.builtin?'builtin':'custom'}));
 const rows=P.methods().map(m=>({...m,group:m.family||'其他',scope:m.turns||'单轮'}));
 for(const entry of P.draft?.methods||[])if(!rows.some(m=>m.id===entry.id)){const m=P.method(entry.id);rows.push({...m,id:entry.id,name:m?.name||entry.id,group:'历史配置',scope:m?.turns||'单轮',blocked:m?.blocked||'该方法已不可用于新策略'});}
 return rows;
};
P.selectionContent=function(kind){
 const state=P.selection[kind],methods=kind==='methods',all=P.selectionRows(kind);
 const groups=[...new Set(methods?[...P.methodFamilies,...all.map(r=>r.group)]:B.industries())];
 const rows=all.filter(r=>(!state.group||r.group===state.group)&&(!state.scope||r.scope===state.scope));
 const scopes=methods?[['','全部轮次'],['单轮','单轮'],['多轮','多轮']]:[['','全部来源'],['builtin','系统题库'],['custom','自建题库']];
 return `<div class="ps-picker-body"><nav class="ps-picker-groups" aria-label="${methods?'攻击方法技术路线':'题库行业'}">${[['',methods?'全部技术路线':'全部行业'],...groups.map(g=>[g,g])].map(([id,label])=>`<button type="button" class="${state.group===id?'active':''}" data-kind="${kind}" data-value="${E(id)}" aria-pressed="${state.group===id}" onclick="App.policies.selectGroup(this.dataset.kind,'group',this.dataset.value)"><span>${E(label)}</span><small>${all.filter(r=>!id||r.group===id).length}</small></button>`).join('')}</nav><div class="ps-picker-options"><div class="ps-picker-scopes" aria-label="${methods?'交互轮次':'题库来源'}">${scopes.map(([id,label])=>`<button type="button" class="${state.scope===id?'active':''}" data-kind="${kind}" data-value="${E(id)}" aria-pressed="${state.scope===id}" onclick="App.policies.selectGroup(this.dataset.kind,'scope',this.dataset.value)">${label}</button>`).join('')}</div><div class="ps-choice-grid">${rows.map(r=>{
  const checked=methods?P.draft.methods.some(m=>m.id===r.id):P.draft.bankIds.includes(r.id),blocked=methods?r.blocked:!r.items?.length;
  return `<label class="ps-choice ${checked?'selected':''} ${blocked?'unavailable':''}" title="${E(methods?r.blocked||r.name:r.name)}"><input type="checkbox" data-id="${E(r.id)}" ${checked?'checked':''} ${blocked&&!checked?'disabled':''} onchange="App.policies.${methods?'toggleMethod':'toggleBank'}(this.dataset.id,this.checked)"><span>${E(r.name)}</span><small>${methods?(blocked?'待接入':''):r.items.length+' 题'}</small></label>`;
 }).join('')||'<p class="ps-empty">该分类下暂无可选内容</p>'}</div></div></div>`;
};
P.selectionSummary=kind=>kind==='methods'?(P.draft.methods.length?'已选择 '+P.draft.methods.length+' 种攻击方法':'请选择攻击方法'):(P.draft.bankIds.length?'已选择 '+P.draft.bankIds.length+' 套攻击题库':'请选择攻击题库');
P.selectionHTML=function(kind){return `<details class="ps-picker" id="policy-${kind}-picker"><summary><span id="policy-${kind}-summary">${P.selectionSummary(kind)}</span><span class="ps-picker-arrow" aria-hidden="true">⌄</span></summary><div id="policy-${kind}-options">${P.selectionContent(kind)}</div></details>`;};
P.selectGroup=function(kind,key,value){if(!['methods','banks'].includes(kind)||!['group','scope'].includes(key))return;P.selection[kind][key]=value;const host=document.getElementById('policy-'+kind+'-options');if(host)host.innerHTML=P.selectionContent(kind);};
P.selectedMethodsHTML=function(){return P.draft.methods.map(entry=>`<section class="ps-selected-method"><header><strong>${E(P.method(entry.id)?.name||entry.id)}</strong><button type="button" class="link-btn" data-id="${E(entry.id)}" aria-label="移除攻击方法 ${E(P.method(entry.id)?.name||entry.id)}" onclick="App.policies.toggleMethod(this.dataset.id,false)">移除</button></header><div class="pu-method-parameters" id="policy-parameters-${E(entry.id)}">${P.parameterFor(entry)}</div></section>`).join('');};
P.selectedBanksHTML=function(){return P.draft.bankIds.map(id=>{const b=B.get(id);return `<button type="button" class="ps-bank-chip" data-id="${E(id)}" title="移除${E(b?.name||id)}" onclick="App.policies.toggleBank(this.dataset.id,false)">${E(b?.name||id)}<span aria-hidden="true">×</span></button>`;}).join('');};
P.refreshSelection=function(kind){
 const options=document.getElementById('policy-'+kind+'-options'),summary=document.getElementById('policy-'+kind+'-summary'),selected=document.getElementById(kind==='methods'?'policy-method-parameters':'policy-selected-banks');
 if(options)options.innerHTML=P.selectionContent(kind);if(summary)summary.textContent=P.selectionSummary(kind);if(selected)selected.innerHTML=kind==='methods'?P.selectedMethodsHTML():P.selectedBanksHTML();
};
P.toggleMethod=function(id,checked){const d=P.draft,m=P.method(id);if(!d||checked&&(!m||m.blocked))return;if(checked&&!d.methods.some(v=>v.id===id))d.methods.push({id,parameters:P.defaults(id)});if(!checked)d.methods=d.methods.filter(v=>v.id!==id);P.refreshSelection('methods');};
P.toggleBank=function(id,checked){const d=P.draft;if(!d||checked&&!B.get(id)?.items.length)return;if(checked&&!d.bankIds.includes(id))d.bankIds.push(id);if(!checked)d.bankIds=d.bankIds.filter(v=>v!==id);P.refreshSelection('banks');};
})();
