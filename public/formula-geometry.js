import * as THREE from './vendor/three/three.module.js';
import {math} from './math.js';
const round=n=>Number(n.toFixed(2));
export const geometryDefaults={pythagoras:[3,4],rectangle:[6,4],triangle:[6,4],circle:[3],box:[6,4,3],angles:[50,60]};
geometryDefaults.trig=[3,4];
export function geometrySVG(type,values=geometryDefaults[type]){
  if(!values)return '';
  const [a,b,h]=values;let shape='';
  const label=(x,y,text)=>`<text x="${x}" y="${y}" text-anchor="middle">${text}</text>`;
  if(type==='pythagoras'||type==='trig'){
    const k=Math.min(230/a,145/b),w=a*k,t=b*k;
    shape=`<path d="M45 200h${w}L45 ${200-t}Z"/><path class="right-angle" d="M45 185h15v15"/>${label(45+w/2,226,`a = ${a} cm`)}${label(25,200-t/2,`b`)}${label(60+w/2,184-t/2,`c = ${round(Math.hypot(a,b))}`)}`;
    if(type==='trig')shape+=label(45+w-20,191,'α');
  }else if(type==='rectangle'){
    const k=Math.min(235/a,145/b),w=a*k,t=b*k;
    shape=`<rect x="45" y="${200-t}" width="${w}" height="${t}" rx="2"/><path class="right-angle" d="M45 185h15v15"/>${label(45+w/2,226,`a = ${a} cm`)}${label(27,205-t/2,`b`)}${label(45+w/2,205-t/2,`S = ${a*b} cm²`)}`;
  }else if(type==='triangle'){
    const k=Math.min(235/a,145/b),w=a*k,t=b*k;
    shape=`<path d="M40 200h${w}L${40+w*.38} ${200-t}Z"/><path class="altitude" d="M${40+w*.38} 200V${200-t}"/><path class="right-angle" d="M${40+w*.38} 185h15v15"/>${label(40+w/2,226,`b = ${a} cm`)}${label(63+w*.38,200-t/2,`h = ${b}`)}`;
  }else if(type==='circle'){
    const r=35+a*5;
    shape=`<circle cx="160" cy="124" r="${r}"/><path class="altitude" d="M160 124h${r}"/><circle class="center-point" cx="160" cy="124" r="3"/>${label(160+r/2,111,`r = ${a}`)}${label(152,146,'O')}`;
  }else if(type==='box'){
    const k=Math.min(170/a,70/b,120/h),w=a*k,d=b*k,t=h*k,x=55,y=210;
    shape=`<path d="M${x} ${y}h${w}v${-t}h${-w}Z"/><path d="M${x} ${y-t}l${d} ${-d*.6}h${w}l${-d} ${d*.6}Z"/><path d="M${x+w} ${y}l${d} ${-d*.6}v${-t}l${-d} ${d*.6}Z"/>${label(x+w/2,235,`a = ${a}`)}${label(x+w+d+12,y-d*.3,`b = ${b}`)}${label(29,y-t/2,`h = ${h}`)}`;
  }else if(type==='angles'){
    const A=a*Math.PI/180,B=b*Math.PI/180,alt=240*Math.sin(A)*Math.sin(B)/Math.sin(A+B),cx=alt/Math.tan(A);
    const minX=Math.min(0,cx),maxX=Math.max(240,cx),scale=Math.min(245/(maxX-minX),145/alt),x=35-minX*scale,y=203;
    shape=`<path d="M${x} ${y}h${240*scale}L${x+cx*scale} ${y-alt*scale}Z"/>${label(x+22,y-8,`${a}°`)}${label(x+240*scale-23,y-8,`${b}°`)}${label(x+cx*scale,y-alt*scale-12,`${180-a-b}°`)}`;
  }
  return `<svg class="geometry-diagram" viewBox="0 0 320 250" role="img" aria-label="Hình minh họa ${type}"><defs><pattern id="geometry-grid-${type}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" opacity=".09"/></pattern></defs><rect class="geometry-grid" width="320" height="250" fill="url(#geometry-grid-${type})"/>${shape}</svg>`;
}
export function geometryHTML(type){
  const labels={pythagoras:['Cạnh góc vuông a','Cạnh góc vuông b'],rectangle:['Chiều dài a','Chiều rộng b'],triangle:['Đáy b','Chiều cao h'],circle:['Bán kính r'],box:['Chiều dài a','Chiều rộng b','Chiều cao h'],angles:['Góc A','Góc B']}[type==='trig'?'pythagoras':type];
  return `<section class="geometry-lab"><div class="geometry-lab-heading"><h3>Thử thay đổi hình</h3><span>${type==='box'?'Mô hình 3D':'Hình tương tác'}</span></div><div class="geometry-view">${geometrySVG(type)}</div>${type==='box'?'<div class="box-controls"><button type="button" data-box-turn="-1" aria-label="Xoay hộp sang trái">↶ Xoay trái</button><button type="button" data-box-turn="1" aria-label="Xoay hộp sang phải">Xoay phải ↷</button></div>':''}<div class="geometry-sliders">${labels.map((label,i)=>`<label>${label}<output id="dimension-value-${i}">${geometryDefaults[type][i]}</output><input type="range" aria-label="${label}" data-dimension="${i}" min="${type==='angles'?20:1}" max="${type==='angles'?(i===0?100:70):10}" step="${type==='angles'?5:1}" value="${geometryDefaults[type][i]}"></label>`).join('')}</div><div class="geometry-result" aria-live="polite"></div><p class="geometry-caption">${type==='angles'?'Các góc hiển thị theo hình dựng.':type==='box'?'Kéo mô hình để xoay. Các kích thước đều tính bằng cm.':'Các kích thước đều tính bằng cm; kéo thanh trượt để kiểm chứng.'} Số thập phân được làm tròn đến hai chữ số. Quan sát hình không thay thế chứng minh.</p></section>`;
}
export function mountGeometry(root,type){
  const values=[...geometryDefaults[type]],ctrl=new AbortController();let cube=null;
  if(type==='box')cube=mountBox(root.querySelector('.geometry-view'),values,ctrl.signal);
  function update(){
    root.querySelectorAll('[data-dimension]').forEach(input=>{values[Number(input.dataset.dimension)]=Number(input.value);root.querySelector(`#dimension-value-${input.dataset.dimension}`).textContent=input.value+(type==='angles'?'°':' cm');});
    if(cube)cube.update(values);else root.querySelector('.geometry-view').innerHTML=geometrySVG(type,values);
    const [a,b,h]=values;
    const tex=type==='trig'?`\\sin\\alpha\\approx${round(b/Math.hypot(a,b))},\\quad\\cos\\alpha\\approx${round(a/Math.hypot(a,b))},\\quad\\tan\\alpha\\approx${round(b/a)}`:{pythagoras:`c=\\sqrt{${a}^2+${b}^2}\\approx ${round(Math.hypot(a,b))}\\,\\mathrm{cm}`,rectangle:`S=${a}\\cdot${b}=${a*b}\\,\\mathrm{cm}^2`,triangle:`S=\\frac{${a}\\cdot${b}}2=${a*b/2}\\,\\mathrm{cm}^2`,circle:`S=${a*a}\\pi\\approx${round(Math.PI*a*a)}\\,\\mathrm{cm}^2`,box:`V=${a}\\cdot${b}\\cdot${h}=${a*b*h}\\,\\mathrm{cm}^3`,angles:`C=180^\\circ-${a}^\\circ-${b}^\\circ=${180-a-b}^\\circ`}[type];
    root.querySelector('.geometry-result').innerHTML=math(tex);
  }
  root.querySelectorAll('[data-dimension]').forEach(input=>input.addEventListener('input',update,{signal:ctrl.signal}));
  root.querySelectorAll('[data-box-turn]').forEach(button=>button.addEventListener('click',()=>cube?.turn(Number(button.dataset.boxTurn)),{signal:ctrl.signal}));
  update();return ()=>{ctrl.abort();cube?.dispose();};
}
function mountBox(host,values,signal){
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(320,250);renderer.domElement.setAttribute('aria-label','Hình hộp chữ nhật ba chiều, có thể kéo để xoay');renderer.domElement.setAttribute('role','img');host.replaceChildren(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,320/250,.1,100);camera.position.set(0,0,23);
  const group=new THREE.Group();group.rotation.set(.38,-.58,.06);scene.add(group);
  const geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial({color:0x2dd4bf,transparent:true,opacity:.72,roughness:.28,metalness:.1});
  const mesh=new THREE.Mesh(geometry,material);group.add(mesh);
  const edges=new THREE.EdgesGeometry(geometry),lineMaterial=new THREE.LineBasicMaterial({color:0x9ff5f2});mesh.add(new THREE.LineSegments(edges,lineMaterial));
  scene.add(new THREE.AmbientLight(0xffffff,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(4,8,10);scene.add(light);
  let dragging=false,lastX=0,lastY=0;
  const draw=()=>renderer.render(scene,camera);
  renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);},{signal});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;group.rotation.y+=(e.clientX-lastX)*.01;group.rotation.x+=(e.clientY-lastY)*.01;lastX=e.clientX;lastY=e.clientY;draw();},{signal});
  for(const event of ['pointerup','pointercancel'])renderer.domElement.addEventListener(event,()=>dragging=false,{signal});
  return{update(v){const scale=7/Math.max(...v);mesh.scale.set(v[0]*scale,v[2]*scale,v[1]*scale);draw();},turn(dir){group.rotation.y+=dir*.35;draw();},dispose(){geometry.dispose();edges.dispose();material.dispose();lineMaterial.dispose();renderer.dispose();renderer.forceContextLoss();}};
}
