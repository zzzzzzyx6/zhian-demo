/* Shared by the platform and the embedded scan application. */
(function(){
'use strict';
const P=window.ListPresentation={};
P.time=function(value){
 if(value===undefined||value===null||value==='')return '未记录';
 let input=value;
 // Legacy dates without an offset were entered as Beijing wall-clock time.
 if(typeof input==='string'&&/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?$/.test(input))input=input.length===10?input+'T00:00:00+08:00':input.replace(' ','T')+'+08:00';
 const date=new Date(input);if(!Number.isFinite(date.getTime()))return '未记录';
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const p=Object.fromEntries(parts.map(v=>[v.type,v.value]));return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
};
P.html=function(html){
 if(typeof html!=='string')return html;
 return html.replace(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/g,(all,tag,attrs,body)=>{
  if(!/class="[^"]*\b(?:btn|link-btn|entry-delete|mi-icon-action|model-action)\b/.test(attrs)||/data-np-close|modal-close|drawer-close/.test(attrs))return all;
  const clean=body.replace(/<svg\b[\s\S]*?<\/svg>/g,'');
  let visible=clean.replace(/<[^>]+>/g,'').trim();
  if(!visible){visible=['title','aria-label'].map(key=>attrs.match(new RegExp(key+'="([^"]+)"'))?.[1]?.match(/^(确认删除|删除|编辑|测试连接|测试|刷新|导出|复制|返回)/)?.[1]).find(Boolean);if(!visible&&/\bentry-delete\b/.test(attrs))visible='删除';if(!visible)return all;return `<${tag}${attrs}>${visible}</${tag}>`;}
  return `<${tag}${attrs}>${clean.replace(/^\s*[＋+]\s*/,'').replace(/\s*→\s*$/,'')}</${tag}>`;
 }).replace(/<th([^>]*)>(创建时间|生成时间|更新时间|任务创建时间|提交时间|检测时间)<\/th>/g,(all,attrs,label)=>/\btitle=/.test(attrs)?all:`<th${attrs} title="北京时间（UTC+8）">${label}</th>`);
};
})();
