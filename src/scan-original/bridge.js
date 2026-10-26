  var loadedCategory=null,loadedTab=null;
  window.addEventListener('message',function(event){
    if(event.source!==parent||!event.data)return;
    if(event.data.type==='scan-restored-error'){STATE.npError=event.data.error;render();return;}
    if(event.data.type!=='scan-restored-load')return;
    var message=event.data,payload=message.payload;if(!payload||!Array.isArray(payload.projects))return;
    var changed=embeddedRoute!==message.route||loadedCategory!==message.category||!loaded;
    D=payload;POSTURE=D.posture||{targets:[]};embeddedRoute=message.route||'/scan/code';loadedCategory=message.category;loaded=true;
    if(changed){STATE.selectedVuln=null;STATE.taskLimit=10;STATE.prevPath=null;}
    if(embeddedRoute==='/scan/new'){
      if(changed){STATE.np=Object.assign({},STATE.np,message.draft||{});STATE.npError='';STATE.np.category=message.category||'code';}
    }else if(message.tab&&(changed||loadedTab!==message.tab)){STATE.tab=message.tab;}
    loadedTab=message.tab||null;
    render();
    if(message.exportFormat){
      var project=D.projects.find(function(p){return p.id===STATE.projectId;});
      if(project&&project.reportEligible!==false){
        if(message.exportFormat==='pdf')printReport();
        else if(message.exportFormat==='html'){
          var findings=D.findingsByJob[project.id]||[],report=ReportDoc(project,findings,D.probesByJob[project.id]||[],D.patchesByJob[project.id]||[],findings);
          var styles=Array.from(document.querySelectorAll('style')).map(function(s){return s.textContent;}).join('\n');
          downloadFile(slug(project.name)+'_报告.html','<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>'+esc(project.name)+'</title><style>'+styles+'</style><body>'+report+'</body></html>','text/html;charset=utf-8');
        }else downloadFile(slug(project.name)+'_报告.md',reportToMarkdown(project,D.findingsByJob[project.id]||[],D.probesByJob[project.id]||[],D.patchesByJob[project.id]||[]),'text/markdown;charset=utf-8');
      }
    }
  });
  document.addEventListener('click',function(event){
    var anchor=event.target.closest('a[href]');if(!anchor)return;
    var href=anchor.getAttribute('href');
    if(href&&href.indexOf('#/')===0){event.preventDefault();event.stopPropagation();navigate(href.slice(1));}
  },true);
  var lastHeight=0;
  new ResizeObserver(function(){
    var app=document.querySelector('.app'),height=Math.ceil(app?app.getBoundingClientRect().height:400)+8;
    if(height!==lastHeight){lastHeight=height;send('height',{height:height});}
  }).observe(document.body);
  send('ready');
