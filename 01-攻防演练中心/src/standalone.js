(function(){const A=App,center='attack';const go=A.navigate;
A.navigate=page=>page==='workspace'?location.assign('../index.html'):go(center);
A.logout=()=>location.assign('../index.html');
A.showApp=function(){document.getElementById('app').style.display='block';A.page=center;history.replaceState(null,'','#'+center);A.render();};
A.session={user:'安全管理员'};A.start();A.session={user:'安全管理员'};A.showApp();
})();