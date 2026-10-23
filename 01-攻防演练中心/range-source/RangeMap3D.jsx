import { useEffect, useRef, useState } from 'react';
import { Eye, Minus, Pause, Play, Plus, RotateCcw, RotateCw, ShieldCheck, Swords, Crosshair, View } from 'lucide-react';
import './range-map-3d.css';

export default function RangeMap3D({targets,activeId,defense,selected,onSelect,detailsId,isDemo}) {
  const host=useRef(null),labels=useRef(null),scene=useRef(null),selectRef=useRef(onSelect);
  const [paused,setPaused]=useState(false),[failure,setFailure]=useState(''),[ready,setReady]=useState(false),[attempt,setAttempt]=useState(0),[top,setTop]=useState(false);
  selectRef.current=onSelect;
  const stateRef=useRef(null);stateRef.current={targets,activeId,defense,selected,paused};
  useEffect(()=>{
    let cancelled=false;setFailure('');setReady(false);
    import('./rangeScene').then(({createRangeScene})=>{
      if(cancelled)return;
      try {scene.current=createRangeScene(host.current,labels.current,id=>selectRef.current(id),message=>{scene.current?.dispose();scene.current=null;setReady(false);setFailure(message);});scene.current.update(stateRef.current);setReady(true);}
      catch {setFailure('当前浏览器无法启用 3D 显示，仍可通过节点列表查看演练数据。');}
    }).catch(()=>{if(!cancelled)setFailure('3D 组件加载失败，请重新加载。');});
    return()=>{cancelled=true;scene.current?.dispose();scene.current=null;};
  },[attempt]);
  useEffect(()=>{scene.current?.update({targets,activeId,defense,selected,paused});},[targets,activeId,defense,selected,paused]);
  const nodes=[{id:'red',name:'红队 · 攻击',kind:'red',Icon:Swords},...targets.map(t=>({...t,short:t.target_kind==='agent'?'Agent 靶标':'模型靶标',kind:'target',Icon:Crosshair})),{id:'blue',name:'蓝队 · 防御',kind:'blue',Icon:ShieldCheck},{id:'purple',name:'紫队 · 评判',kind:'purple',Icon:Eye}];
  return <div className={`range-3d ${failure?'range-3d-fallback':''}`}>
    <div className="range-3d-status"><i className={activeId?'active':''}/>{activeId?(isDemo?'模拟演练进行中':'接口演练进行中'):'待命拓扑 · 当前无演练'}{paused?' · 动效暂停':''}</div>
    <div className="range-3d-canvas" ref={host} tabIndex={0} role="region" aria-label="三维地图，方向键旋转，加减键缩放" onKeyDown={e=>{
      const moves={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]};
      if(moves[e.key]){e.preventDefault();scene.current?.rotate(...moves[e.key]);setTop(false);}
      if(e.key==='+'||e.key==='='){e.preventDefault();scene.current?.zoom(.9);}
      if(e.key==='-'){e.preventDefault();scene.current?.zoom(1.1);}
    }}/>
    {!ready&&!failure&&<div className="range-3d-message" role="status">正在构建立体演练园区…</div>}
    {failure&&<div className="range-3d-message" role="status"><p>{failure}</p><button onClick={()=>{setTop(false);setAttempt(n=>n+1);}}>重新加载 3D 地图</button></div>}
    <div ref={labels} className="range-3d-labels" aria-label="地图节点">
      {nodes.map(({id,name,short,kind,Icon})=><button key={id} data-map-id={id} title={name} aria-label={name} className={`range-3d-label ${kind} ${selected===id?'selected':''}`} aria-expanded={selected===id} aria-controls={detailsId} onClick={()=>onSelect(id)}><Icon size={14}/><span className="map-name-full">{name}</span>{short&&<span className="map-name-short">{short}</span>}</button>)}
    </div>
    <div className="range-3d-tools" role="toolbar" aria-label="三维地图视角">
      <button aria-label="旋转地图" disabled={!ready||!!failure} onClick={()=>{scene.current?.rotate(.3);setTop(false);}}><RotateCw size={16}/><span>旋转</span></button>
      <button aria-label="放大地图" disabled={!ready||!!failure} onClick={()=>scene.current?.zoom(.85)}><Plus size={17}/></button>
      <button aria-label="缩小地图" disabled={!ready||!!failure} onClick={()=>scene.current?.zoom(1.15)}><Minus size={17}/></button>
      <button aria-label="俯视地图" disabled={!ready||!!failure} aria-pressed={top} onClick={()=>{scene.current?.reset(top?'perspective':'top');setTop(!top);}}><View size={17}/><span>俯视</span></button>
      <button aria-label="重置地图" disabled={!ready||!!failure} onClick={()=>{scene.current?.reset();setTop(false);}}><RotateCcw size={16}/></button>
      <button aria-label={paused?'继续地图光效':'暂停地图光效'} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>
    </div>
    <div className="range-3d-caption"><span>拖动旋转 · 滚轮缩放 · 点击节点</span><span>虚拟 3D 园区 · {targets.length} 个靶标</span></div>
  </div>;
}
