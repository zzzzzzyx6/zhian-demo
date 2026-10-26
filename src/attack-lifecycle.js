/* Attack task lifecycle: run, complete, terminate or fail. */
(function(){
'use strict';
const A=window.App,X=A.attack,E=A.escape;
X.migrateTaskLifecycle=function(){
 let changed=false;
 for(const t of X.db.tasks){
  if(t.status==='paused'){
   t.status='stopped';t.terminationReason='旧版暂停任务已归档为终止';
   t.lifecycleMigration={from:'paused',to:'stopped',at:new Date().toISOString()};
   if(!t.finishedAt&&!t.finished)t.finishedAt=t.lifecycleMigration.at;
   changed=true;
  }
 }
 if(X.filter==='paused')X.filter='stopped';
 if(A.evaluation?.taskFilters.status==='paused')A.evaluation.taskFilters.status='stopped';
 if(changed)A.save();return changed;
};
const init=X.init;
X.init=function(){const result=init.apply(X,arguments);X.migrateTaskLifecycle();return result;};
X.toggleRun=function(){return false;};
X.taskAction=function(id,action){
 const t=X.db.tasks.find(t=>t.id===id&&!t.deletedAt);
 if(!t||t.status!=='running'||action!=='stop')return false;
 A.modal('终止攻防任务',`<p>确定终止“${E(t.name)}”？已完成的攻防记录和判定结果会保留，未完成的测试单元不计入结果。</p>`,`<button class="btn" onclick="App.closeModal()">取消</button><button class="btn danger" data-task="${E(t.id)}" onclick="App.attack.arenaStop(this.dataset.task)">确认终止</button>`);
 return true;
};
X.arenaControl=function(action){const t=X.exerciseTask();return t?X.taskAction(t.id,action):false;};
X.stopConfirm=function(){return X.task?X.taskAction(X.task.id,'stop'):false;};
X.arenaStop=function(id){
 const t=X.db.tasks.find(t=>t.id===id&&!t.deletedAt);if(!t||t.status!=='running')return false;
 t.status='stopped';t.finishedAt=t.finished=new Date().toISOString();t.terminationReason='用户终止';
 A.save();A.closeModal();A.render();A.toast('演练已终止，已完成记录已保留');return true;
};
})();
