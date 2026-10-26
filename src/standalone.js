(function(){
'use strict';
const A=App,center='attack',go=A.navigate,sessionKey='zhian-session-attack',logoutKey='zhian-local-demo-signed-out';
const stored=key=>{try{return sessionStorage.getItem(key);}catch(e){return null;}};
const store=(key,value)=>{try{value===null?sessionStorage.removeItem(key):sessionStorage.setItem(key,value);}catch(e){}};
A.navigate=page=>A.platform?A.platform.navigate(page):page==='workspace'?location.assign('../index.html'):go(center);
A.showApp=function(){
 document.getElementById('login').style.display='none';document.getElementById('app').style.display='block';A.page=center;
 if(A.platform)A.platform.restoreRoute();else history.replaceState(null,'','#'+center);A.render();
};
A.showLogin=function(){document.getElementById('app').style.display='none';document.getElementById('login').style.display='grid';document.getElementById('login-error').textContent='';document.title='登录 · AI安全平台';document.getElementById('login-user').focus();};
A.login=function(){
 const user=document.getElementById('login-user').value.trim();if(!user){document.getElementById('login-error').textContent='请输入账号名称';return false;}
 A.session={user:user.slice(0,64),role:'安全管理员',mode:'local-demo'};store(sessionKey,JSON.stringify(A.session));store(logoutKey,null);A.showApp();window.scrollTo({top:0,behavior:'instant'});return false;
};
A.logout=function(){
 const user=A.session?.user||'安全管理员';A.connections?.clearSecrets();A.session=null;store(sessionKey,null);store(logoutKey,'1');A.closeModal();A.closeDrawer();document.getElementById('login-user').value=user;A.showLogin();
};
A.account=function(){if(!A.session)return;A.closeDrawer();A.modal('账号信息',`<div class="platform-account-profile"><span class="avatar">${A.icon('user',22)}</span><div><h3>${A.escape(A.session.user)}</h3><p>本地账号</p></div></div><dl class="platform-account-info"><div><dt>账号角色</dt><dd>安全管理员</dd></div><div><dt>登录方式</dt><dd>本地登录</dd></div></dl>`,`<button class="btn danger" onclick="App.logout()">${A.icon('logout',15)}退出登录</button>`);};
// First entry remains an immediate product preview. Explicit logout persists in
// this tab; refreshing cannot silently undo it. No password or credential is saved.
const signedOut=stored(logoutKey)==='1';
if(!signedOut&&!stored(sessionKey)){A.session={user:'安全管理员',role:'安全管理员',mode:'local-demo'};store(sessionKey,JSON.stringify(A.session));}
if(signedOut){A.session=null;store(sessionKey,null);}
A.start();
if(signedOut)A.showLogin();else if(!A.session){A.session={user:'安全管理员',role:'安全管理员',mode:'local-demo'};A.showApp();}
})();
