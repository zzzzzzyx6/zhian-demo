/* Compact object summaries. Counts come from saved task/report evidence. */
(function(){
'use strict';
const A=window.App,X=A.attack,Q=A.assessment,V=A.evaluation,L=A.leanPlatform,E=A.escape;
const O=A.objectAnalysis={};
const arr=v=>Array.isArray(v)?v:[],time=t=>Date.parse(t.created||'')||0,ordered=ts=>arr(ts).filter(t=>!t.deletedAt).slice().sort((a,b)=>time(a)-time(b)),pct=v=>Number.isFinite(v)?v.toFixed(1)+'%':'—';
const policy=t=>t.runSnapshot?.policySnapshot||t.runSnapshot?.policy||t.policySnapshot||{},bank=t=>t.runSnapshot?.bankSnapshot||policy(t).bankSnapshot||t.bankSnapshot||{};
const empty=text=>`<p class="oa-empty">${E(text)}</p>`;
O.open=function(id){const t=V.allTasks().find(t=>t.id===id);if(t)V.reportReady(t)?V.openReport(id):V.openTask(id);};
O.attackData=t=>X.taskAnalysis({...t,bankSnapshot:bank(t),defense:t.runSnapshot?.defense||t.defense});
O.scanData=function(t){const p=A.scanProduct.payload(t),confirmed=arr(p.findingsByJob?.[t.id]),candidates=arr(p.candidatesByJob?.[t.id]);return {confirmed,candidates,total:confirmed.length,candidateCount:Number(t.candidateCount??candidates.length),high:confirmed.filter(f=>['critical','high'].includes(f.severity)).length};};
O.available=o=>ordered(o.tasks).filter(t=>o.kind==='models'?arr(t.units).some(u=>['breach','defended'].includes(u.result)):V.reportReady(t)||arr(t.findings).length>0);
O.aggregate=function(tasks){
 const scenes=new Map(),methods=new Map(),result={valid:0,breach:0,tasks:tasks.length};
 for(const t of tasks){const a=O.attackData(t);result.valid+=a.valid;result.breach+=a.breach;
  for(const [map,rows] of [[scenes,a.scenes],[methods,a.methods]])for(const r of rows){if(!r.valid)continue;const item=map.get(r.id)||{id:r.id,label:r.label,valid:0,breach:0};item.valid+=r.valid;item.breach+=r.breach;map.set(r.id,item);}
 }
 const ranked=map=>[...map.values()].map(r=>({...r,asr:r.breach/r.valid*100})).sort((a,b)=>b.asr-a.asr||b.valid-a.valid);
 return {...result,asr:result.valid?result.breach/result.valid*100:null,scenes:ranked(scenes),methods:ranked(methods)};
};
O.rates=function(rows){return `<div class="oa-top-list">${rows.slice(0,3).map((r,i)=>`<div class="oa-top-row"><div><span><em>${String(i+1).padStart(2,'0')}</em>${E(r.label||r.id)}</span><strong>${pct(r.asr)}</strong></div><div class="oa-bar"><i style="width:${r.asr}%"></i></div><small>${r.breach} / ${r.valid} 次有效判定</small></div>`).join('')||empty('暂无有效记录')}</div>`;};
O.trend=function(tasks,model){
 const recent=tasks.slice(-8),series=model?[{key:'asr',color:'#5c89bb'}]:[{key:'total',color:'#569b89'},{key:'candidateCount',color:'#c49b58'}],rows=recent.map(t=>({t,d:model?O.attackData(t):O.scanData(t)}));
 if(rows.length<2)return `<div class="oa-single-result"><span>首次${model?'演练':'检测'}结果已收录</span><small>后续结果将在这里形成历史记录</small></div>`;
 const w=model?420:350,h=model?150:104,left=model?w/rows.length/2:22,right=model?w/rows.length/2:22,top=24,bottom=model?120:77,max=model?100:Math.max(5,...rows.flatMap(r=>series.map(s=>r.d[s.key]))),x=i=>left+i/(rows.length-1)*(w-left-right),y=v=>bottom-v/max*(bottom-top);
 return `<div class="oa-trend ${model?'oa-asr-trend':''}"><div class="oa-trend-title"><span>${model?'历次 ASR':'历次检测数量'}</span>${model?'':`<small><i style="background:#569b89"></i>已确认 <i style="background:#c49b58"></i>候选</small>`}</div>${model?'<div class="oa-named-trend-scroll"><div class="oa-named-trend-canvas" style="--oa-points:'+rows.length+';--oa-axis-width:'+Math.max(330,rows.length*120)+'px">':''}<svg viewBox="0 0 ${w} ${h}" role="group" aria-label="${model?'历次攻破率':'历次确认漏洞与候选数量'}">${[0,.5,1].map(n=>`<line x1="${left}" y1="${y(max*n)}" x2="${w-right}" y2="${y(max*n)}" stroke="#e8eef5" stroke-dasharray="3 4"/>`).join('')}${series.map((s,si)=>`${model?'':`<polyline points="${rows.map((r,i)=>x(i)+','+y(r.d[s.key])).join(' ')}" fill="none" stroke="${s.color}" stroke-width="1.5"/>`}${rows.map((r,i)=>{const value=r.d[s.key],cy=y(value),overlap=!model&&r.d.total===r.d.candidateCount;return `<g class="oa-point" role="button" tabindex="0" data-task="${E(r.t.id)}" aria-label="${E(r.t.name+'，'+(model?'ASR '+pct(value):(s.key==='total'?'已确认 ':'候选 ')+value)+'，查看详情')}" onclick="App.objectAnalysis.open(this.dataset.task)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();App.objectAnalysis.open(this.dataset.task)}"><title>${E(r.t.name+' · '+r.t.created+' · '+(model?pct(value):value))}</title>${model?`<line x1="${x(i)}" y1="${cy}" x2="${x(i)}" y2="${bottom}" stroke="#dce7f3" stroke-width="5"/>`:''}<circle cx="${x(i)}" cy="${cy}" r="${model?4.5:3.5}" fill="${s.color}" stroke="white"/><text x="${x(i)}" y="${cy-9-(overlap?si*13:0)}" text-anchor="middle" fill="${s.color}">${model?pct(value):value}</text></g>`;}).join('')}`).join('')}${model?'':rows.map((r,i)=>`<text x="${x(i)}" y="${h-5}" text-anchor="middle" fill="#98a5b4">${i+1}</text>`).join('')}</svg>${model?`<div class="oa-task-axis">${rows.map(r=>{const stamp=time(r.t)?new Date(time(r.t)).toLocaleString('sv-SE',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'时间未记录';return `<div><span title="${E(r.t.name)}">${E(r.t.name)}</span><time title="${E(stamp)}">${E(stamp)}</time></div>`;}).join('')}</div></div></div>`:''}</div>`;
};
O.attack=function(o,tasks){
 const a=O.aggregate(tasks);
 return `<header class="oa-summary-head"><h2>攻防结果摘要</h2></header><div class="oa-summary-band"><div class="oa-main-number"><span>累计攻破率</span><strong>${pct(a.asr)}</strong><p><b>${a.breach}</b> 次攻破 / <b>${a.valid}</b> 次有效判定</p></div>${O.trend(tasks,true)}</div><div class="oa-summary-columns"><section><h3>主要威胁维度 <small>攻破率 Top 3</small></h3>${O.rates(a.scenes)}</section><section><h3>有效攻击方法 <small>攻破率 Top 3</small></h3>${O.rates(a.methods)}</section></div>`;
};
const levels=[['critical','严重','#b42335'],['high','高危','#ed8a24'],['medium','中危','#edca51'],['low','低危','#6c9fca'],['unknown','未分级','#b8c3d1']];
O.severity=function(a){
 const level=f=>{const id=f.severity||f.suspected_severity;return levels.some(l=>l[0]===id)?id:'unknown';},rows=levels.map(([id,label,color])=>({id,label,color,confirmed:a.confirmed.filter(f=>level(f)===id).length,candidates:a.candidates.filter(f=>level(f)===id).length})),max=Math.max(1,...rows.map(r=>r.confirmed+r.candidates));
 return `<div class="oa-severity">${rows.filter(r=>r.id!=='unknown'||r.confirmed+r.candidates).map(r=>`<div><span><i style="background:${r.color}"></i>${r.label}</span><div class="oa-severity-track"><i style="width:${r.confirmed/max*100}%;background:${r.color}"></i><i style="width:${r.candidates/max*100}%;background:${r.color};opacity:.35"></i></div><strong>${r.confirmed}<small> / ${r.candidates}</small></strong></div>`).join('')}</div><p class="oa-inline-note">已确认 / 候选；候选等级来自初筛，尚未验证。</p>`;
};
O.scanRanking=function(o){
 const rows=L.objects().filter(r=>r.kind!=='models').map(r=>{const t=ordered(r.tasks).filter(V.reportReady).at(-1);return t?{o:r,d:O.scanData(t)}:null;}).filter(Boolean).sort((a,b)=>b.d.high-a.d.high||b.d.total-a.d.total||b.d.candidateCount-a.d.candidateCount).slice(0,3),max=Math.max(1,...rows.map(r=>r.d.total+r.d.candidateCount));
 return `<div class="oa-top-list">${rows.map((r,i)=>`<button class="oa-object-row" data-object="${E(r.o.key)}" onclick="App.assessment.openObject(this.dataset.object)"><div><span><em>${String(i+1).padStart(2,'0')}</em>${E(r.o.name)}</span>${o.key===r.o.key?'<small>当前</small>':'<small>→</small>'}</div><div class="oa-bar oa-stacked"><i style="width:${r.d.total/max*100}%;background:#64a190"></i><i style="width:${r.d.candidateCount/max*100}%;background:#cfb17e"></i></div><small>已确认 ${r.d.total} · 候选 ${r.d.candidateCount}</small></button>`).join('')||empty('暂无已完成检测对象')}</div>`;
};
O.scan=function(o,tasks){
 const latest=tasks.filter(V.reportReady).at(-1)||tasks.at(-1),a=O.scanData(latest);
 return `<header class="oa-summary-head"><h2>漏洞检测摘要</h2><span>最近${V.reportReady(latest)?'完成':'有效'}结果</span></header><div class="oa-summary-band"><div class="oa-scan-numbers"><div><span>已确认漏洞</span><strong>${a.total}</strong></div><div><span>待验证候选</span><strong>${a.candidateCount}</strong></div><p>严重 / 高危 <b>${a.high}</b> 个已确认漏洞</p></div>${O.trend(tasks,false)}</div><div class="oa-summary-columns"><section><h3>问题等级分布</h3>${O.severity(a)}</section><section><h3>被测对象排序 <small>Top 3</small></h3>${O.scanRanking(o)}</section></div><p class="oa-footnote">对象排序采用最近完成结果，优先按严重 / 高危、已确认、候选数量排列。</p>`;
};
O.render=function(o){const tasks=O.available(o);return `<section class="object-analysis"><div class="oa-summary">${tasks.length?(o.kind==='models'?O.attack(o,tasks):O.scan(o,tasks)):'<header class="oa-summary-head"><h2>结果摘要</h2></header>'+empty('尚未产生可分析的结果，执行情况见下方任务列表。')}</div></section>`;};
})();
