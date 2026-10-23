import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Bake static buildings into material batches: detail should not cost a draw call per window.
export function buildCampus(parent) {
  const materials = new Map();
  function mesh(geometry, color, x, y, z, glow = false) {
    const key = `${color}:${glow}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({
      color, roughness: .75, metalness: .2,
      emissive: glow ? color : 0, emissiveIntensity: glow ? .85 : 0,
    }));
    const object = new THREE.Mesh(geometry, materials.get(key));
    object.position.set(x, y, z); parent.add(object); return object;
  }
  const box = (w,h,d,c,x,y,z,glow=false) => mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,glow);
  const ring = (r,c,x,y,z) => { const m=mesh(new THREE.TorusGeometry(r,.022,5,64),c,x,y,z,true);m.rotation.x=Math.PI/2;return m; };
  box(27,.9,21,0x13263a,0,-.6,0);
  box(26.8,.18,20.8,0x33475a,0,-.1,0);
  box(26.5,.04,20.5,0x1c3240,0,.015,0);
  for(const z of [-10.25,10.25]) box(26.5,.055,.055,0x3da6ae,0,-.02,z,true);
  for(const x of [-13.25,13.25]) box(.055,.055,20.5,0x3da6ae,x,-.02,0,true);
  // Survey grid, kept below the roads and landscaped blocks.
  for(let x=-13;x<=13;x++) box(.012,.012,20,0x2c414d,x,.043,0);
  for(let z=-10;z<=10;z++) box(26,.012,.012,0x2c414d,0,.043,z);
  function road(x,z,length,vertical=false) {
    const w=vertical?.65:length,d=vertical?length:.65;
    box(w,.04,d,0x46596a,x,.065,z);
    for(const side of [-1,1]) box(vertical?.026:length,.012,vertical?length:.026,0x899caa,x+(vertical?side*.29:0),.092,z+(vertical?0:side*.29));
    for(let t=-length/2+.45;t<length/2;t+=.7) box(vertical?.025:.24,.012,vertical?.24:.025,0xa7b4b7,x+(vertical?0:t),.095,z+(vertical?t:0));
  }
  for(const z of [-4,3,8.6]) road(0,z,24);
  for(const x of [-10,4.2,10.8]) road(x,.1,17.2,true);
  // A narrow waterway and two bridges define the western edge of the campus.
  box(1.3,.02,19,0x124752,-11.8,.06,0);
  for(let i=0;i<34;i++) {
    const ripple=box(.23+(i%3)*.16,.008,.015,0x327585,-11.8+Math.sin(i*2)*.4,.077,-9.2+i*.55);
    ripple.rotation.y=Math.sin(i)*.3;
  }
  for(const z of [3,8.6]) {
    box(2.3,.14,.9,0x83939d,-11.6,.18,z);
    for(const side of [-.43,.43]) box(2.3,.06,.035,0xa1b5bc,-11.6,.48,z+side);
    for(let x=-12.6;x<=-10.6;x+=.4) for(const side of [-.43,.43]) box(.035,.3,.035,0x708c9b,x,.32,z+side);
  }
  function tree(x,z,s=1) {
    box(.075,.46*s,.075,0x697769,x,.25*s,z);
    mesh(new THREE.ConeGeometry(.25*s,.72*s,6),0x305d56,x,.65*s,z);
    mesh(new THREE.ConeGeometry(.18*s,.55*s,6),0x497766,x,1.02*s,z);
  }
  for(let i=0;i<44;i++) {const x=-10.5+(i%22)*1.04;tree(x,i<22?-8.2:9.5,.65+(i%3)*.12);}
  for(let i=0;i<16;i++) tree(i%2?-12.8:12.4,-7+Math.floor(i/2)*2,.75);
  for(let i=0;i<12;i++) tree(-5+(i%6)*1.4,i<6?3.8:-3.2,.65);
  for(let i=0;i<16;i++) {
    const x=-11+i*1.5,h=1.1+Math.sin(i*2.3)**2*2.3;
    const hill=mesh(new THREE.ConeGeometry(1.7,h,5),i%2?0x334757:0x2a3d4b,x,h/2,-9.5);
    hill.rotation.y=i*.8;hill.scale.z=.7;
  }
  function building(x,z,w,d,h,seed) {
    box(w+.3,.08,d+.3,0x4c625e,x,.11,z);
    box(w,h,d,0x607b89,x,.16+h/2,z);
    box(w+.06,.09,d+.06,0x91a8b1,x,.2+h,z);
    box(w*.35,.17,d*.5,0x3b5364,x-.12,.31+h,z);
    for(let a=-w/2+.15;a<w/2-.08;a+=.25) for(let b=.4;b<h;b+=.27) {
      const c=(seed+Math.round(a*10+b*10))%4===0?0xcebfa0:0x315366;
      box(.12,.11,.02,c,x+a,b,z+d/2+.011,c===0xcebfa0);
      box(.12,.11,.02,0x315366,x+a,b,z-d/2-.011);
    }
    for(let a=-d/2+.17;a<d/2-.07;a+=.27) for(let b=.4;b<h;b+=.27) box(.02,.11,.13,0x315366,x+w/2+.011,b,z+a);
    // Rooftop cooling plant and solar collectors.
    for(let i=0;i<3;i++) box(.18,.06,.36,0x235774,x-w*.28+i*.23,.3+h,z+d*.2);
  }
  [[-7,-5.6,1.6,1.1,1.1],[-4.8,-5.7,1.4,1.1,.9],[-6.1,-1.9,1.2,1,1.05],
    [-3.8,-1.6,1.3,.95,.85],[6.9,-5.6,1.7,1.15,1.2],[9.1,-5.6,1.2,1,.8],
    [7.2,5.3,1.6,1.1,1.2],[9.3,5.5,1.1,1.4,.75],[-4.6,5.8,1.4,1.2,.9],
    [-2.8,6.4,1.1,1,.6],[4.4,7,1.5,.8,.65],[-7.5,7.2,1.3,.8,.65],
  ].forEach((p,i)=>building(...p,i));
  // Helipad, server yard, perimeter light poles and gate.
  box(2.6,.09,2.4,0x374e5d,-7.1,.14,4.4);ring(1,0x8aafba,-7.1,.2,4.4);
  for(const x of [-7.38,-6.82]) box(.09,.014,.75,0xb9d0d1,x,.2,4.4);
  box(.55,.014,.09,0xb9d0d1,-7.1,.2,4.4);
  for(let i=0;i<8;i++) {
    const x=6+(i%4)*.56,z=-1.8+Math.floor(i/4)*.9;
    box(.43,.43,.64,0x607681,x,.29,z);
    for(let n=0;n<3;n++) box(.34,.014,.055,0x243e4e,x,.515,z-.2+n*.15);
  }
  for(let i=0;i<42;i++) {
    const x=-9.5+(i%14)*1.55,z=[-4.48,3.48,8.08][Math.floor(i/14)];
    box(.035,.47,.035,0x839ca7,x,.31,z);
    box(.1,.045,.1,0xbee1dd,x,.56,z,true);
  }
  for(const x of [-.7,.7]) box(.34,.7,.3,0x7e95a2,x,.4,9.65);
  box(1.6,.075,.15,0x589ca6,0,.78,9.65,true);
  // Merge by material, preserving ordinary lighting and depth for all details.
  const batches = new Map();
  for(const object of [...parent.children]) {
    object.updateMatrix();
    const geometry=object.geometry.toNonIndexed();geometry.applyMatrix4(object.matrix);
    if(!batches.has(object.material)) batches.set(object.material,[]);
    batches.get(object.material).push(geometry);
    object.geometry.dispose();parent.remove(object);
  }
  for(const [material,geometries] of batches) {
    parent.add(new THREE.Mesh(mergeGeometries(geometries),material));
    geometries.forEach(g=>g.dispose());
  }
}
