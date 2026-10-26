/* Shared presentation primitives. Values always come from the owning product. */
(function(){
'use strict';
const A=window.App,E=A.escape;
const D=A.dataDisplay={colors:{blue:'#4779b5',teal:'#348875',amber:'#d59a38',red:'#c45568',gray:'#a6b2c1'}};
D.states=[['running','进行中',D.colors.blue],['done','已完成',D.colors.teal],['error','执行异常','#d76a42'],['stopped','已终止',D.colors.amber],['pending','待执行',D.colors.gray]];
D.counts=tasks=>D.states.map(([id,label,color])=>({id,label,color,value:tasks.filter(t=>(D.states.some(s=>s[0]===t.status)?t.status:'pending')===id).length}));
D.ring=function(rows,{value,label,description='',className=''}={}){
 const total=rows.reduce((n,r)=>n+Math.max(0,Number(r.value)||0),0);let offset=0;
 const arcs=rows.filter(r=>r.value>0).map(r=>{const size=r.value/total*100,html=`<circle cx="90" cy="90" r="72" pathLength="100" fill="none" stroke="${r.color}" stroke-width="17" stroke-dasharray="${size} ${100-size}" stroke-dashoffset="${-offset}" transform="rotate(-90 90 90)"><title>${E(r.label)}：${r.value}</title></circle>`;offset+=size;return html;}).join('');
 return `<div class="ds-ring ${className}" role="img" aria-label="${E((description||label)+'：'+rows.map(r=>r.label+' '+r.value).join('，'))}"><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="72" fill="none" stroke="#edf1f6" stroke-width="17"/>${arcs}</svg><div><strong>${E(value??total)}</strong><span>${E(label||'总数')}</span></div></div>`;
};
D.legend=(rows,action)=>`<div class="ds-legend">${rows.map(r=>{const content=`<i style="background:${r.color}"></i><span>${E(r.label)}</span><strong>${r.value}</strong>`;return action?`<button type="button" onclick="${action(r)}">${content}</button>`:`<div>${content}</div>`;}).join('')}</div>`;
D.facts=rows=>`<dl class="ds-facts">${rows.map(([label,value])=>`<div><dt>${E(label)}</dt><dd>${E(value)}</dd></div>`).join('')}</dl>`;
D.progress=function(done,total,state='running'){const pct=total?Math.max(0,Math.min(100,Math.round(done/total*100))):0,tone=D.states.find(s=>s[0]===state)?.[2]||D.colors.blue;return `<span class="ds-progress is-${A.escape(state)}" style="--progress-color:${tone}" role="progressbar" aria-label="已处理 ${done} / ${total}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><span><i style="width:${pct}%"></i></span><b>${done} / ${total}</b></span>`;};
D.table=function(columns,rows,empty='暂无匹配记录',className=''){
 return `<div class="table-wrap ds-table-wrap"><table class="ds-table ${className}"><thead><tr>${columns.map(c=>`<th scope="col" class="${c.number?'ds-number':''}">${E(c.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${columns.map(c=>`<td class="${c.number?'ds-number':''} ${c.className||''}">${c.cell(r)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${columns.length}" class="empty">${E(empty)}</td></tr>`}</tbody></table></div>`;
};
})();
