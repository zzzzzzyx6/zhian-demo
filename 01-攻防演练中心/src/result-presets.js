/* Additional model and result fixtures. They never call a model and are not benchmarks. */
(function(){
'use strict';
const A=window.App,X=A.attack,C=A.connections,B=A.banks,copy=v=>JSON.parse(JSON.stringify(v));
const init=A.modules.attack.init;
A.modules.attack.init=function(){
  init();if(X.db.resultPresetsVersion===1)return;
  const bank=B.get('jbb-harmful-100');if(!bank?.items?.length)return;
  const presets=[
    ['m1','Qwen2.5-72B-Instruct','Qwen','Qwen2.5','72B-Instruct',6],
    ['qwen25-32b','Qwen2.5-32B-Instruct','Qwen','Qwen2.5','32B-Instruct',10],
    ['qwen25-7b','Qwen2.5-7B-Instruct','Qwen','Qwen2.5','7B-Instruct',15],
    ['llama31-8b','Llama-3.1-8B-Instruct','Meta','Llama 3.1','8B-Instruct',13],
    ['llama31-70b','Llama-3.1-70B-Instruct','Meta','Llama 3.1','70B-Instruct',8],
    ['llama31-405b','Llama-3.1-405B-Instruct','Meta','Llama 3.1','405B-Instruct',5]
  ];
  const items=copy(bank.items.slice(0,30)),methods=['Direct','DeepInception'],judge=X.connectionSnapshot(X.model('deepseek-judge'));
  for(const [preferred,name,vendor,family,version,breaches] of presets){
    let model=C.db.find(m=>m.id===preferred&&m.model===name);
    if(!model){
      const id=C.db.some(m=>m.id===preferred)?'result-demo-'+preferred:preferred;
      model=C.db.find(m=>m.id===id);
      if(!model){model={id,name,model:name,vendor,kind:'model',schema:2,accessType:'api',hosting:'cloud',protocol:'openai',auth:'none',caps:['text','chat'],uses:['target','attacker','judge'],timeout:60,endpoint:`https://model.example/${id}`,demoConfigured:true,simulated:true};C.db.push(model);}
    }
    const id='EV-DEMO-RANK-'+preferred;if(X.db.tasks.some(t=>t.id===id))continue;
    const created='2026-09-28 09:00',finished='2026-09-28T01:20:00.000Z';
    const engine={attacker:'本地模板 / 变换',judge:judge.name,methods,roles:{attacker:null,judge},concurrency:4,maxRounds:1,evaluationVersion:'demo-answer-safety-v1',reference:{source:'OpenRT',attacker:null,judge:judge.model,attackerTemperature:null,judgeTemperature:0},bindings:methods.map(method=>({method,registry:X.methodInfo[method][0],generator:null,judge:judge.id}))};
    const task={id,name:`${name} 通用安全演练`,description:'内置结果展示样例；所有分数为模拟值，不代表模型真实能力。',model:model.id,targetSnapshot:X.connectionSnapshot(model),targetMeta:{family,version},engine:copy(engine),defense:{mode:'existing',parts:[],prompt:''},bankSnapshot:{id:bank.id,bankIds:[bank.id],name:'JailbreakBench 固定 30 题演示子集',sources:[{id:bank.id,name:bank.name,count:items.length}],items:copy(items),provenance:copy(bank.provenance)},status:'done',created,finished,simulated:true,demoPreset:'model-results-v1',demoPlanName:'通用安全演示方案',scenes:['jailbreak'],level:'dataset',sampleCount:items.length,ticks:5,units:[]};
    for(const method of methods)for(const q of items){
      const index=task.units.length,result=(index*17)%60<breaches?'breach':'defended';
      const prompt=method==='Direct'?q.prompt:`[嵌套情境]\n${q.prompt}`;
      const response=result==='breach'?'模拟响应越过安全边界：[受限内容已隐藏]':'模拟靶标保持安全边界，拒绝提供不安全内容并给出安全替代建议。';
      const verdict=result==='breach'?'模拟裁判判定：最终回答突破安全边界。':'模拟裁判判定：最终回答未突破安全边界。';
      task.units.push({id:'S-'+String(index+1).padStart(4,'0'),index,questionId:q.id,scene:'jailbreak',method,rounds:1,currentRound:1,result,score:result==='breach'?5:1,seedPrompt:q.prompt,attackPrompt:prompt,rawResponse:response,response,verdict,blueEvidence:[],finished,eventSchema:5,events:[0,1,2,3,4].map(phase=>({phase,round:1,time:finished})),roundHistory:[{round:1,prompt,rawResponse:response,response,verdict,result,blueBlocked:null,blueEvidence:[],finishedAt:finished}]});
    }
    X.db.tasks.push(task);
  }
  X.db.resultPresetsVersion=1;A.save();
};
})();
