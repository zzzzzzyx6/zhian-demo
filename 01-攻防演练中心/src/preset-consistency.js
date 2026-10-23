/* Keep system task fixtures on the same defense flow as newly created tasks. */
(function(){
'use strict';
const A=window.App,X=A.attack,M=X.methodDependencies;
const modes={
  'EV-260920-101':'existing',
  'EV-260919-077':'qwen3guard',
  'EV-260918-210':'qwen3guard',
  'EV-260910-033':'qwen3guard'
};
const version=1;
const executionFields=['score','finished','pendingResult','pendingScore','currentRound','attackPrompt','rawResponse','response','verdict','verdictState','blueBlocked','blueEvidence','error','errorCode','errorMessage','errorReason'];

function rebuildUnit(task,old,position){
  const max=M[old.method]?.process?Math.max(1,old.rounds||task.engine.maxRounds||1):1;
  const events=(old.events||[]).map(e=>old.eventSchema===5?e:{...e,round:1,phase:e.phase===0?1:e.phase===1?2:4});
  const last=events.at(-1),complete=old.result!=='pending';
  // Reconstruct only as far as the saved phase for an unfinished unit.
  const steps=complete?max*5+1:last?Math.min(max*5,((last.round||1)-1)*5+last.phase+1):0;
  const unit={...old,rounds:max,result:'pending',events:[],roundHistory:[],eventSchema:5};
  for(const key of executionFields)delete unit[key];
  const created=Date.parse(String(task.created).replace(' ','T')+'+08:00');
  const start=(Number.isFinite(created)?created:Date.parse('2026-09-20T01:00:00Z'))+position*25000;
  let previousTime=0;
  for(let step=0;step<steps;step++){
    // A pending final verdict remains pending until the next live tick commits it.
    if(!complete&&unit.pendingResult)break;
    const round=Math.floor(step/5)+1,phase=step%5;
    const recorded=events.find(e=>(e.round||1)===round&&e.phase===phase);
    const savedTime=Date.parse(recorded?.time||'');
    const time=Math.max(previousTime,Number.isFinite(savedTime)?savedTime:start+step*1000);
    X.advanceUnit(task,unit,new Date(time).toISOString());
    previousTime=time;
    if(unit.result!=='pending')break;
  }
  return unit;
}

X.normalizePresetDefenses=function(){
  let changed=false;
  for(const task of X.db.tasks){
    const mode=modes[task.id];
    if(!mode||!task.simulated||task.presetDefenseVersion===version)continue;
    task.defense=X.blueSnapshot({defenseMode:mode,blueInput:true,blueOutput:false});
    task.units=task.units.map((unit,index)=>rebuildUnit(task,unit,index));
    task.demoPreset='task-catalog-v2';
    task.presetDefenseVersion=version;
    if(task.status==='done'){
      const finished=task.units.map(u=>u.finished).filter(Boolean).sort().at(-1);
      if(finished&&(!task.finished||Date.parse(task.finished)<Date.parse(finished)))task.finished=finished;
    }
    changed=true;
  }
  if(changed)A.save();
  return changed;
};
const init=A.modules.attack.init;
A.modules.attack.init=function(){init();X.normalizePresetDefenses();};
})();
