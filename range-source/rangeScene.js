import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildCampus } from './rangeCampus';

const COLORS = { red: 0xff6e66, blue: 0x56b6ff, purple: 0xb58aff, target: 0x5de0d0 };
const POINTS = [[0, 0], [1, 5], [-2, -5.6], [6.5, -3], [-4, 4]];

// Geometry stays mounted across state polls. Only topology changes rebuild nodes.
export function createRangeScene(host, labels, onSelect, onFailure) {
  // Retain the last frame when paused; some embedded browsers discard an idle WebGL buffer.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0xf2f5f8, 0); // CSS supplies the light or dark surface behind the canvas.
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-label', '可旋转的三维演练园区');
  renderer.domElement.setAttribute('role', 'img');
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b1524, 36, 68);
  const camera = new THREE.PerspectiveCamera(39, 1, .1, 110);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 19;
  controls.maxDistance = 48;
  controls.minPolarAngle = .18;
  controls.maxPolarAngle = Math.PI / 2.35;
  controls.enableDamping = false;
  controls.target.set(0, .4, 0);
  scene.add(new THREE.HemisphereLight(0xbfe5ff, 0x142a32, 2.8));
  const sun = new THREE.DirectionalLight(0xafd4ff, 3);
  sun.position.set(-10, 18, 10); scene.add(sun);
  const city = new THREE.Group(); scene.add(city);
  let nodes = [], routes = [], dynamic = new THREE.Group(); scene.add(dynamic);
  let topology = '', latest = {}, frame = 0, lastTime = 0, time = 0, visible = true, disposed = false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function mesh(parent, geometry, color, position, options = {}) {
    const material = new THREE.MeshStandardMaterial({ color, roughness: .65, metalness: .3, ...options });
    const object = new THREE.Mesh(geometry, material); object.position.set(...position); parent.add(object); return object;
  }
  function box(parent, w, h, d, color, x, y, z, options) { return mesh(parent, new THREE.BoxGeometry(w, h, d), color, [x,y,z], options); }
  function line(parent, points, color, opacity = 1) {
    const result = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    parent.add(result); return result;
  }
  function disposeGroup(group) {
    group.traverse(obj => { obj.geometry?.dispose(); if (obj.material) for (const m of [obj.material].flat()) m.dispose(); });
    group.clear();
  }
  buildCampus(city);

  function makeNode(id, kind, x, z) {
    const group = new THREE.Group(); group.position.set(x,0,z); dynamic.add(group);
    const color=COLORS[kind], height=kind==='target'?1.6:2.6;
    const glow={ emissive: color, emissiveIntensity:.65 };
    box(group,2.7,.14,2.4,0x102236,0,.08,0);
    box(group,2.35,.15,2.05,0x3d536d,0,.2,0);
    const ring=mesh(group,new THREE.TorusGeometry(1.55,.025,5,48),color,[0,.3,0],glow);ring.rotation.x=Math.PI/2;
    for(const [offset,h,w] of (kind==='target'?[[-.58,1.1,.65],[.24,1.8,.85],[.96,1.1,.45]]:[[0,height,1.15]])) {
      const body=box(group,w,h,1,0x2b435d,offset,.3+h/2,0);
      body.userData.nodeId=id;
      const edges=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),new THREE.LineBasicMaterial({color:0x58798c}));body.add(edges);
      box(group,w+.1,.09,1.12,color,offset,.3+h,0,glow);
      for(let floor=.55;floor<h+.15;floor+=.29) {
        box(group,w*.63,.05,.02,color,offset,floor,.51,glow);
        box(group,.02,.05,.65,color,offset+w/2+.005,floor,0,glow);
      }
    }
    if(kind!=='target') {
      box(group,.06,.65,.06,color,0,height+.65,0,glow);
      const beacon=mesh(group,new THREE.OctahedronGeometry(.16),color,[0,height+1,0],glow);beacon.userData.nodeId=id;
      if(kind==='blue') { const shield=mesh(group,new THREE.IcosahedronGeometry(1.55,1),color,[0,1.55,0],{transparent:true,opacity:.09,wireframe:true}); shield.userData.nodeId=id; }
    }
    const target={id,group,ring,kind,anchor:new THREE.Vector3(x,height+1.45,z),point:new THREE.Vector3(x,1.8,z)};
    nodes.push(target); return target;
  }
  function route(from,to,kind,targetId) {
    const middle=from.point.clone().add(to.point).multiplyScalar(.5);middle.y=6.4;
    const curve=new THREE.QuadraticBezierCurve3(from.point,middle,to.point);
    const track=new THREE.Mesh(new THREE.TubeGeometry(curve,56,.035,6,false),new THREE.MeshBasicMaterial({color:COLORS[kind],transparent:true,opacity:.8}));
    dynamic.add(track);
    const glow=new THREE.Mesh(new THREE.TubeGeometry(curve,72,.065,7,false),new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(COLORS[kind])},uPower:{value:.45},uOffset:{value:routes.length*.19}},
      vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:'uniform float uTime; uniform float uOffset; uniform float uPower; uniform vec3 uColor; varying vec2 vUv; void main(){float p=fract(vUv.x*3.0-uTime+uOffset); float trail=pow(p,12.0); float core=pow(p,38.0); gl_FragColor=vec4(uColor*(1.0+core*1.8),trail*uPower);}'
    }));dynamic.add(glow);
    const packets=Array.from({length:2},()=>{
      const packet=new THREE.Group();
      mesh(packet,new THREE.SphereGeometry(.075,8,6),0xe5ffff,[0,0,0],{emissive:COLORS[kind],emissiveIntensity:2});
      mesh(packet,new THREE.SphereGeometry(.17,8,6),COLORS[kind],[0,0,0],{transparent:true,opacity:.23,depthWrite:false,emissive:COLORS[kind],emissiveIntensity:1});
      dynamic.add(packet);return packet;
    });
    routes.push({curve,track,glow,packets,kind,targetId});
  }
  function rebuild(targets) {
    disposeGroup(dynamic); nodes=[];routes=[];
    const red=makeNode('red','red',-8,1),blue=makeNode('blue','blue',8,1),purple=makeNode('purple','purple',2,-5.5);
    targets.forEach((t,i)=>{ const pos=POINTS[i];if(!pos)return;const target=makeNode(t.id,'target',...pos);route(red,target,'red',t.id);route(target,blue,'blue',t.id);route(target,purple,'purple',t.id); });
  }
  const projected=new THREE.Vector3();
  function render() {
    if(disposed || !visible)return;
    renderer.render(scene,camera);
    const width=host.clientWidth,height=host.clientHeight;
    const placements=[];
    for(const n of nodes) {
      const label=labels.querySelector(`[data-map-id="${CSS.escape(n.id)}"]`);
      if(!label)continue;
      projected.copy(n.anchor).project(camera);
      const w=label.offsetWidth,h=label.offsetHeight;
      let x=THREE.MathUtils.clamp((projected.x*.5+.5)*width,w/2+8,width-w/2-8);
      let y=THREE.MathUtils.clamp((-projected.y*.5+.5)*height,65,height-110);
      if(width<1000) {
        const candidates=[[x,y],[x-w*.7,y],[x+w*.7,y],[x,y-h-6],[x-w*.7,y-h-6],[x+w*.7,y-h-6]];
        const free=candidates.find(([cx,cy])=>cx>w/2+8&&cx<width-w/2-8&&cy>=65&&!placements.some(p=>Math.abs(cx-p.x)<(w+p.w)/2+5&&Math.abs(cy-h/2-(p.y-p.h/2))<(h+p.h)/2+5));
        if(free)[x,y]=free;
      }
      placements.push({label,x,y,w,h,visible:projected.z<1&&Math.abs(projected.x)<1.2&&Math.abs(projected.y)<1.2});
    }
    for(const p of placements) {
      p.label.style.left=`${p.x}px`;p.label.style.top=`${p.y}px`;p.label.style.visibility=p.visible?'visible':'hidden';
    }
  }
  function animate(timestamp) {
    frame=0;
    if(disposed||!visible||document.hidden||latest.paused||reduced.matches){lastTime=0;return;}
    if(timestamp-lastTime>=32){time+=lastTime?Math.min(timestamp-lastTime,100)/1000*(latest.activeId?.72:.38):0;lastTime=timestamp;
      routes.forEach((r,i)=>{
        r.glow.material.uniforms.uTime.value=time;
        r.packets.forEach((p,j)=>p.position.copy(r.curve.getPoint((time*.4+j*.5+i*.13)%1)));
      });render();}
    frame=requestAnimationFrame(animate);
  }
  function schedule(){if(!frame&&!disposed)frame=requestAnimationFrame(animate);}
  function update(data) {
    latest=data;
    const key=data.targets.map(t=>t.id).join('|');
    if(key!==topology||!nodes.length){topology=key;rebuild(data.targets);}
    nodes.forEach(n=>{n.ring.material.emissiveIntensity=data.selected===n.id?2:.6;n.ring.scale.setScalar(data.selected===n.id?1.12:1);});
    routes.forEach(r=>{
      const engaged=r.targetId===data.activeId&&(r.kind!=='blue'||data.defense);
      r.track.material.opacity=engaged ? .85 : data.activeId ? .12 : .48;
      r.glow.visible=!reduced.matches;
      r.glow.material.uniforms.uPower.value=engaged?1:data.activeId ? .1 : .72;
      r.packets.forEach(p=>{p.visible=!reduced.matches&&(!data.activeId||engaged);});
    });render();schedule();
  }
  function reset(view='perspective'){camera.position.set(...(view==='top'?[0,44,3.8]:[8,23,32]));controls.target.set(0,0,1.8);controls.update();render();}
  function zoom(factor){camera.position.sub(controls.target).multiplyScalar(factor).clampLength(controls.minDistance,controls.maxDistance).add(controls.target);controls.update();render();}
  function rotate(dx,dy=0) { const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));s.theta+=dx;s.phi=THREE.MathUtils.clamp(s.phi+dy,controls.minPolarAngle,controls.maxPolarAngle);camera.position.setFromSpherical(s).add(controls.target);controls.update();render(); }
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w/h<.8?66:w/h<1.1?58:36;camera.updateProjectionMatrix();render();}
  controls.addEventListener('change',render);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){render();schedule();}});observer.observe(host);
  const motion=()=>{update(latest);};reduced.addEventListener('change',motion);
  const visibility=()=>{if(!document.hidden){render();schedule();}};document.addEventListener('visibilitychange',visibility);
  const lost=e=>{e.preventDefault();onFailure('3D 显示已中断，可重新加载地图。');};renderer.domElement.addEventListener('webglcontextlost',lost);
  let pointerStart=null;
  const down=e=>{pointerStart=[e.clientX,e.clientY];};
  const up=e=>{
    if(!pointerStart||Math.hypot(e.clientX-pointerStart[0],e.clientY-pointerStart[1])>5)return;
    const rect=renderer.domElement.getBoundingClientRect();
    const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);
    const hit=ray.intersectObjects(dynamic.children,true).find(h=>h.object.userData.nodeId);if(hit)onSelect(hit.object.userData.nodeId);
  };
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);
  reset();resize();
  return {update,reset,zoom,rotate,dispose(){disposed=true;cancelAnimationFrame(frame);controls.dispose();resizeObserver.disconnect();observer.disconnect();reduced.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);disposeGroup(scene);renderer.dispose();renderer.domElement.remove();}};
}
