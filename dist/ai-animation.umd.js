(function(A,a){typeof exports=="object"&&typeof module<"u"?a(exports,require("three")):typeof define=="function"&&define.amd?define(["exports","three"],a):(A=typeof globalThis<"u"?globalThis:A||self,a(A.AiAnimation={},A.THREE))})(this,function(A,a){"use strict";var pt=Object.defineProperty;var ut=(A,a,D)=>a in A?pt(A,a,{enumerable:!0,configurable:!0,writable:!0,value:D}):A[a]=D;var Oe=(A,a,D)=>ut(A,typeof a!="symbol"?a+"":a,D);function D(d){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(d){for(const n in d)if(n!=="default"){const e=Object.getOwnPropertyDescriptor(d,n);Object.defineProperty(t,n,e.get?e:{enumerable:!0,get:()=>d[n]})}}return t.default=d,Object.freeze(t)}const h=D(a),ie={type:"change"},H={type:"start"},se={type:"end"},Y=new a.Ray,ae=new a.Plane,Ee=Math.cos(70*a.MathUtils.DEG2RAD);class be extends a.EventDispatcher{constructor(t,n){super(),this.object=t,this.domElement=n,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new a.Vector3,this.cursor=new a.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:a.MOUSE.ROTATE,MIDDLE:a.MOUSE.DOLLY,RIGHT:a.MOUSE.PAN},this.touches={ONE:a.TOUCH.ROTATE,TWO:a.TOUCH.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return c.phi},this.getAzimuthalAngle=function(){return c.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(o){o.addEventListener("keydown",oe),this._domElementKeyEvents=o},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",oe),this._domElementKeyEvents=null},this.saveState=function(){e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=function(){e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(ie),e.update(),s=i.NONE},this.update=function(){const o=new a.Vector3,r=new a.Quaternion().setFromUnitVectors(t.up,new a.Vector3(0,1,0)),S=r.clone().invert(),M=new a.Vector3,w=new a.Quaternion,F=new a.Vector3,R=2*Math.PI;return function(dt=null){const we=e.object.position;o.copy(we).sub(e.target),o.applyQuaternion(r),c.setFromVector3(o),e.autoRotate&&s===i.NONE&&W(Ke(dt)),e.enableDamping?(c.theta+=m.theta*e.dampingFactor,c.phi+=m.phi*e.dampingFactor):(c.theta+=m.theta,c.phi+=m.phi);let _=e.minAzimuthAngle,T=e.maxAzimuthAngle;isFinite(_)&&isFinite(T)&&(_<-Math.PI?_+=R:_>Math.PI&&(_-=R),T<-Math.PI?T+=R:T>Math.PI&&(T-=R),_<=T?c.theta=Math.max(_,Math.min(T,c.theta)):c.theta=c.theta>(_+T)/2?Math.max(_,c.theta):Math.min(T,c.theta)),c.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,c.phi)),c.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(y,e.dampingFactor):e.target.add(y),e.target.sub(e.cursor),e.target.clampLength(e.minTargetRadius,e.maxTargetRadius),e.target.add(e.cursor),e.zoomToCursor&&G||e.object.isOrthographicCamera?c.radius=ee(c.radius):c.radius=ee(c.radius*l),o.setFromSpherical(c),o.applyQuaternion(S),we.copy(e.target).add(o),e.object.lookAt(e.target),e.enableDamping===!0?(m.theta*=1-e.dampingFactor,m.phi*=1-e.dampingFactor,y.multiplyScalar(1-e.dampingFactor)):(m.set(0,0,0),y.set(0,0,0));let Z=!1;if(e.zoomToCursor&&G){let V=null;if(e.object.isPerspectiveCamera){const k=o.length();V=ee(k*l);const Q=k-V;e.object.position.addScaledVector(L,Q),e.object.updateMatrixWorld()}else if(e.object.isOrthographicCamera){const k=new a.Vector3(N.x,N.y,0);k.unproject(e.object),e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/l)),e.object.updateProjectionMatrix(),Z=!0;const Q=new a.Vector3(N.x,N.y,0);Q.unproject(e.object),e.object.position.sub(Q).add(k),e.object.updateMatrixWorld(),V=o.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;V!==null&&(this.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar(V).add(e.object.position):(Y.origin.copy(e.object.position),Y.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(Y.direction))<Ee?t.lookAt(e.target):(ae.setFromNormalAndCoplanarPoint(e.object.up,e.target),Y.intersectPlane(ae,e.target))))}else e.object.isOrthographicCamera&&(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/l)),e.object.updateProjectionMatrix(),Z=!0);return l=1,G=!1,Z||M.distanceToSquared(e.object.position)>p||8*(1-w.dot(e.object.quaternion))>p||F.distanceToSquared(e.target)>0?(e.dispatchEvent(ie),M.copy(e.object.position),w.copy(e.object.quaternion),F.copy(e.target),Z=!1,!0):!1}}(),this.dispose=function(){e.domElement.removeEventListener("contextmenu",Ie),e.domElement.removeEventListener("pointerdown",xe),e.domElement.removeEventListener("pointercancel",j),e.domElement.removeEventListener("wheel",Pe),e.domElement.removeEventListener("pointermove",te),e.domElement.removeEventListener("pointerup",j),e._domElementKeyEvents!==null&&(e._domElementKeyEvents.removeEventListener("keydown",oe),e._domElementKeyEvents=null)};const e=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=i.NONE;const p=1e-6,c=new a.Spherical,m=new a.Spherical;let l=1;const y=new a.Vector3,u=new a.Vector2,x=new a.Vector2,P=new a.Vector2,I=new a.Vector2,f=new a.Vector2,v=new a.Vector2,O=new a.Vector2,E=new a.Vector2,C=new a.Vector2,L=new a.Vector3,N=new a.Vector2;let G=!1;const g=[],q={};function Ke(o){return o!==null?2*Math.PI/60*e.autoRotateSpeed*o:2*Math.PI/60/60*e.autoRotateSpeed}function B(){return Math.pow(.95,e.zoomSpeed)}function W(o){m.theta-=o}function K(o){m.phi-=o}const le=function(){const o=new a.Vector3;return function(S,M){o.setFromMatrixColumn(M,0),o.multiplyScalar(-S),y.add(o)}}(),he=function(){const o=new a.Vector3;return function(S,M){e.screenSpacePanning===!0?o.setFromMatrixColumn(M,1):(o.setFromMatrixColumn(M,0),o.crossVectors(e.object.up,o)),o.multiplyScalar(S),y.add(o)}}(),U=function(){const o=new a.Vector3;return function(S,M){const w=e.domElement;if(e.object.isPerspectiveCamera){const F=e.object.position;o.copy(F).sub(e.target);let R=o.length();R*=Math.tan(e.object.fov/2*Math.PI/180),le(2*S*R/w.clientHeight,e.object.matrix),he(2*M*R/w.clientHeight,e.object.matrix)}else e.object.isOrthographicCamera?(le(S*(e.object.right-e.object.left)/e.object.zoom/w.clientWidth,e.object.matrix),he(M*(e.object.top-e.object.bottom)/e.object.zoom/w.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}}();function J(o){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?l/=o:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function de(o){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?l*=o:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function pe(o){if(!e.zoomToCursor)return;G=!0;const r=e.domElement.getBoundingClientRect(),S=o.clientX-r.left,M=o.clientY-r.top,w=r.width,F=r.height;N.x=S/w*2-1,N.y=-(M/F)*2+1,L.set(N.x,N.y,1).unproject(e.object).sub(e.object.position).normalize()}function ee(o){return Math.max(e.minDistance,Math.min(e.maxDistance,o))}function ue(o){u.set(o.clientX,o.clientY)}function Ze(o){pe(o),O.set(o.clientX,o.clientY)}function me(o){I.set(o.clientX,o.clientY)}function Qe(o){x.set(o.clientX,o.clientY),P.subVectors(x,u).multiplyScalar(e.rotateSpeed);const r=e.domElement;W(2*Math.PI*P.x/r.clientHeight),K(2*Math.PI*P.y/r.clientHeight),u.copy(x),e.update()}function He(o){E.set(o.clientX,o.clientY),C.subVectors(E,O),C.y>0?J(B()):C.y<0&&de(B()),O.copy(E),e.update()}function $e(o){f.set(o.clientX,o.clientY),v.subVectors(f,I).multiplyScalar(e.panSpeed),U(v.x,v.y),I.copy(f),e.update()}function Je(o){pe(o),o.deltaY<0?de(B()):o.deltaY>0&&J(B()),e.update()}function et(o){let r=!1;switch(o.code){case e.keys.UP:o.ctrlKey||o.metaKey||o.shiftKey?K(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(0,e.keyPanSpeed),r=!0;break;case e.keys.BOTTOM:o.ctrlKey||o.metaKey||o.shiftKey?K(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(0,-e.keyPanSpeed),r=!0;break;case e.keys.LEFT:o.ctrlKey||o.metaKey||o.shiftKey?W(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(e.keyPanSpeed,0),r=!0;break;case e.keys.RIGHT:o.ctrlKey||o.metaKey||o.shiftKey?W(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):U(-e.keyPanSpeed,0),r=!0;break}r&&(o.preventDefault(),e.update())}function fe(){if(g.length===1)u.set(g[0].pageX,g[0].pageY);else{const o=.5*(g[0].pageX+g[1].pageX),r=.5*(g[0].pageY+g[1].pageY);u.set(o,r)}}function ge(){if(g.length===1)I.set(g[0].pageX,g[0].pageY);else{const o=.5*(g[0].pageX+g[1].pageX),r=.5*(g[0].pageY+g[1].pageY);I.set(o,r)}}function ve(){const o=g[0].pageX-g[1].pageX,r=g[0].pageY-g[1].pageY,S=Math.sqrt(o*o+r*r);O.set(0,S)}function tt(){e.enableZoom&&ve(),e.enablePan&&ge()}function ot(){e.enableZoom&&ve(),e.enableRotate&&fe()}function ye(o){if(g.length==1)x.set(o.pageX,o.pageY);else{const S=ne(o),M=.5*(o.pageX+S.x),w=.5*(o.pageY+S.y);x.set(M,w)}P.subVectors(x,u).multiplyScalar(e.rotateSpeed);const r=e.domElement;W(2*Math.PI*P.x/r.clientHeight),K(2*Math.PI*P.y/r.clientHeight),u.copy(x)}function Se(o){if(g.length===1)f.set(o.pageX,o.pageY);else{const r=ne(o),S=.5*(o.pageX+r.x),M=.5*(o.pageY+r.y);f.set(S,M)}v.subVectors(f,I).multiplyScalar(e.panSpeed),U(v.x,v.y),I.copy(f)}function Me(o){const r=ne(o),S=o.pageX-r.x,M=o.pageY-r.y,w=Math.sqrt(S*S+M*M);E.set(0,w),C.set(0,Math.pow(E.y/O.y,e.zoomSpeed)),J(C.y),O.copy(E)}function nt(o){e.enableZoom&&Me(o),e.enablePan&&Se(o)}function it(o){e.enableZoom&&Me(o),e.enableRotate&&ye(o)}function xe(o){e.enabled!==!1&&(g.length===0&&(e.domElement.setPointerCapture(o.pointerId),e.domElement.addEventListener("pointermove",te),e.domElement.addEventListener("pointerup",j)),lt(o),o.pointerType==="touch"?rt(o):st(o))}function te(o){e.enabled!==!1&&(o.pointerType==="touch"?ct(o):at(o))}function j(o){ht(o),g.length===0&&(e.domElement.releasePointerCapture(o.pointerId),e.domElement.removeEventListener("pointermove",te),e.domElement.removeEventListener("pointerup",j)),e.dispatchEvent(se),s=i.NONE}function st(o){let r;switch(o.button){case 0:r=e.mouseButtons.LEFT;break;case 1:r=e.mouseButtons.MIDDLE;break;case 2:r=e.mouseButtons.RIGHT;break;default:r=-1}switch(r){case a.MOUSE.DOLLY:if(e.enableZoom===!1)return;Ze(o),s=i.DOLLY;break;case a.MOUSE.ROTATE:if(o.ctrlKey||o.metaKey||o.shiftKey){if(e.enablePan===!1)return;me(o),s=i.PAN}else{if(e.enableRotate===!1)return;ue(o),s=i.ROTATE}break;case a.MOUSE.PAN:if(o.ctrlKey||o.metaKey||o.shiftKey){if(e.enableRotate===!1)return;ue(o),s=i.ROTATE}else{if(e.enablePan===!1)return;me(o),s=i.PAN}break;default:s=i.NONE}s!==i.NONE&&e.dispatchEvent(H)}function at(o){switch(s){case i.ROTATE:if(e.enableRotate===!1)return;Qe(o);break;case i.DOLLY:if(e.enableZoom===!1)return;He(o);break;case i.PAN:if(e.enablePan===!1)return;$e(o);break}}function Pe(o){e.enabled===!1||e.enableZoom===!1||s!==i.NONE||(o.preventDefault(),e.dispatchEvent(H),Je(o),e.dispatchEvent(se))}function oe(o){e.enabled===!1||e.enablePan===!1||et(o)}function rt(o){switch(Ae(o),g.length){case 1:switch(e.touches.ONE){case a.TOUCH.ROTATE:if(e.enableRotate===!1)return;fe(),s=i.TOUCH_ROTATE;break;case a.TOUCH.PAN:if(e.enablePan===!1)return;ge(),s=i.TOUCH_PAN;break;default:s=i.NONE}break;case 2:switch(e.touches.TWO){case a.TOUCH.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;tt(),s=i.TOUCH_DOLLY_PAN;break;case a.TOUCH.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;ot(),s=i.TOUCH_DOLLY_ROTATE;break;default:s=i.NONE}break;default:s=i.NONE}s!==i.NONE&&e.dispatchEvent(H)}function ct(o){switch(Ae(o),s){case i.TOUCH_ROTATE:if(e.enableRotate===!1)return;ye(o),e.update();break;case i.TOUCH_PAN:if(e.enablePan===!1)return;Se(o),e.update();break;case i.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;nt(o),e.update();break;case i.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;it(o),e.update();break;default:s=i.NONE}}function Ie(o){e.enabled!==!1&&o.preventDefault()}function lt(o){g.push(o)}function ht(o){delete q[o.pointerId];for(let r=0;r<g.length;r++)if(g[r].pointerId==o.pointerId){g.splice(r,1);return}}function Ae(o){let r=q[o.pointerId];r===void 0&&(r=new a.Vector2,q[o.pointerId]=r),r.set(o.pageX,o.pageY)}function ne(o){const r=o.pointerId===g[0].pointerId?g[1]:g[0];return q[r.pointerId]}e.domElement.addEventListener("contextmenu",Ie),e.domElement.addEventListener("pointerdown",xe),e.domElement.addEventListener("pointercancel",j),e.domElement.addEventListener("wheel",Pe,{passive:!1}),this.update()}}const z={SCENE_ANIMATION_DURATION:2,MOVEMENT_TIME:.6,PROCESSING_TIME:2.5,PULSE_SPEED:2,PULSE_AMPLITUDE:.1,PARTICLE_SIZE:.005,PARTICLE_COUNT:3e4,SPHERE_RADIUS:2,TEXT_SPHERE_RADIUS:2.3,TEXT_MIN_RADIUS:.1,PROCESSING_COLORS:["#FBD23D","#3EECFF","#EF6F34","#5C20DD"],DEFAULT_TEXT_COLOR:"#3EECFF",WORD_ANIMATION:{MOVE_OUT_DURATION:1,SURFACE_DURATION:2,MOVE_IN_DURATION:1,TYPING_SPEED:.5},MAX_ACTIVE_WORDS:20,WORD_DELAY:100,NOISE:{AMPLITUDE:.1,FREQUENCY:1}};function Ce(d={}){return{...z,...d,WORD_ANIMATION:{...z.WORD_ANIMATION,...d.WORD_ANIMATION||{}},NOISE:{...z.NOISE,...d.NOISE||{}}}}const _e=`uniform float time;
uniform float noiseAmplitude;
uniform float noiseFrequency;
uniform float pulseTime;
uniform float particleSize;
varying vec3 vColor;

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

void main() {
    vColor = color;
    vec3 pos = position;
    
    float noiseVal = cnoise(pos * noiseFrequency + time * 0.4);
    float displacement = noiseVal * noiseAmplitude;
    
    float pulse = 1.0 + sin(pulseTime * 0.8) * 0.05;
    
    pos *= pulse;
    pos += normal * displacement;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = particleSize * (1000.0 / -mvPosition.z);
}
`,Te=`varying vec3 vColor;

void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha);
}
`,Ne=`varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`,Re=`uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Funzione per il rumore di Perlin 3D semplificato
float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
}

void main() {
    // Base color mixing con transizioni più morbide
    vec3 baseColor = mix(
        mix(color1, color2, sin(time * 0.5 + vPosition.x * 2.0) * 0.5 + 0.5),
        mix(color3, color4, cos(time * 0.5 + vPosition.y * 2.0) * 0.5 + 0.5),
        sin(time + vPosition.z * 2.0) * 0.5 + 0.5
    );
    
    // Effetto Fresnel migliorato
    vec3 viewDirection = normalize(vViewPosition);
    float fresnelTerm = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
    
    // Rumore per l'effetto opale più dettagliato
    float noiseVal = noise(vPosition * 8.0 + time * 0.2); // Aumentato la frequenza
    float darkSpots = smoothstep(0.3, 0.7, noiseVal); // Allargato il range
    
    // Aggiungi riflessi scuri più profondi
    vec3 darkReflection = vec3(0.05, 0.05, 0.1) * (1.0 - darkSpots);
    
    // Aggiungi riflessi chiari più brillanti
    vec3 brightReflection = vec3(1.0, 0.98, 0.95) * fresnelTerm * noiseVal * 1.5;
    
    // Effetto iridescente potenziato
    float iridescenceStrength = 0.3; // Aumentato da 0.1 a 0.3
    vec3 iridescence = vec3(
        sin(fresnelTerm * 6.28318 + time),
        sin(fresnelTerm * 6.28318 + time + 2.0944), // 2π/3
        sin(fresnelTerm * 6.28318 + time + 4.18879) // 4π/3
    ) * iridescenceStrength;
    
    // Combina tutti gli effetti
    vec3 finalColor = baseColor;
    finalColor += brightReflection * 0.8; // Aumentato l'effetto dei riflessi chiari
    finalColor *= (1.0 - darkReflection);
    finalColor += iridescence * fresnelTerm; // Aggiunge l'iridescenza modulata dal Fresnel
    
    // Regola l'opacità per mantenere la trasparenza ai bordi
    float alpha = mix(0.2, 0.9, (1.0 - fresnelTerm * 0.7) * (1.0 - darkSpots * 0.4));
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;function X(d){return d.toString()}class ze extends h.Scene{constructor(t,n={}){super(),this.options=n,this.clock=new h.Clock,this.wordManager=t,this.wordMeshes=[],this.setInitialState()}setInitialState(){console.log("set initial state"),this.initialScale=0,this.initialOpacity=0}hideAll(){this.wordMeshes&&this.wordMeshes.length>0&&this.wordMeshes.forEach(t=>{t.scale.set(0,0,0),t.visible=!1})}updateWordMeshes(t){this.wordMeshes=t}update(t){}}class De{constructor(t=2.2,n=1,e={}){this.options={...z,...e},this.geometry=new h.IcosahedronGeometry(t,n),this.material=new h.ShaderMaterial({uniforms:{time:{value:0},noiseFrequency:{value:.5},noiseAmplitude:{value:.05},color1:{value:new h.Color(this.options.PROCESSING_COLORS[0])},color2:{value:new h.Color(this.options.PROCESSING_COLORS[1])},color3:{value:new h.Color(this.options.PROCESSING_COLORS[2])},color4:{value:new h.Color(this.options.PROCESSING_COLORS[3])}},vertexShader:`
                uniform float time;
                uniform float noiseFrequency;
                uniform float noiseAmplitude;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                // Funzioni di rumore
                vec3 mod289(vec3 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }
                
                vec4 mod289(vec4 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }
                
                vec4 permute(vec4 x) {
                    return mod289(((x*34.0)+1.0)*x);
                }
                
                vec4 taylorInvSqrt(vec4 r) {
                    return 1.79284291400159 - 0.85373472095314 * r;
                }
                
                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                    
                    vec3 i  = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);
                    
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);
                    
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;
                    
                    i = mod289(i);
                    vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                        
                    float n_ = 0.142857142857;
                    vec3 ns = n_ * D.wyz - D.xzx;
                    
                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                    
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_);
                    
                    vec4 x = x_ *ns.x + ns.yyyy;
                    vec4 y = y_ *ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);
                    
                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);
                    
                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    
                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                    
                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);
                    
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                }
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    // Usa i parametri uniformi per il noise
                    vec3 noisePos = position * noiseFrequency + time * 0.2;
                    float noiseValue = snoise(noisePos);
                    
                    // Applica il noise con l'ampiezza controllata
                    vec3 newPosition = position + normal * noiseValue * noiseAmplitude;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,fragmentShader:`
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform vec3 color4;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float t = (vPosition.y + 1.0) * 0.5 + sin(time * 0.2) * 0.2;
                    
                    vec3 color;
                    if (t < 0.33) {
                        color = mix(color1, color2, smoothstep(0.0, 0.33, t));
                    } else if (t < 0.66) {
                        color = mix(color2, color3, smoothstep(0.33, 0.66, t));
                    } else {
                        color = mix(color3, color4, smoothstep(0.66, 1.0, t));
                    }
                    
                    float fresnel = pow(1.0 + dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    color = mix(color, vec3(1.0), fresnel * 0.3);
                    
                    gl_FragColor = vec4(color, 0.3);
                }
            `,transparent:!0,wireframe:!0}),console.log("Icosahedron vertices:",this.geometry.attributes.position.count),this.geometry.index?console.log("Icosahedron faces:",this.geometry.index.count/3):console.log("Icosahedron faces:",this.geometry.attributes.position.count/3),this.mesh=new h.Mesh(this.geometry,this.material),this.rotationSpeed={x:(Math.random()-.5)*.001,y:(Math.random()-.5)*.002,z:(Math.random()-.5)*.0015},this.directionChangeInterval=3e3,this.lastDirectionChange=0,this.accelerationFactor={x:1+Math.random()*.5,y:1+Math.random()*.5,z:1+Math.random()*.5},this.mesh.scale.setScalar(1)}update(t){this.material.uniforms.time.value=t,t-this.lastDirectionChange>this.directionChangeInterval&&(this.targetRotation={x:Math.random()*Math.PI*4,y:Math.random()*Math.PI*4,z:Math.random()*Math.PI*4},this.accelerationFactor={x:1+Math.random()*.5,y:1+Math.random()*.5,z:1+Math.random()*.5},this.lastDirectionChange=t),this.mesh.rotation.x+=this.rotationSpeed.x*this.accelerationFactor.x,this.mesh.rotation.y+=this.rotationSpeed.y*this.accelerationFactor.y,this.mesh.rotation.z+=this.rotationSpeed.z*this.accelerationFactor.z}dispose(){this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose()}}let b;function Le(d,t){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?(b=new be(d,t.domElement),b.enableDamping=!0,b.dampingFactor=.05,b.minDistance=5,b.maxDistance=15,b.minPolarAngle=Math.PI/4,b.maxPolarAngle=Math.PI/1.5,b.enablePan=!1,b.rotateSpeed=.5,t.domElement.style.touchAction="none",function(){b.update()}):null}class Ue{constructor(t,n={}){this.options={...z,...n},this.wordManager=t,this.scene=new ze(this.wordManager,this.options),this.camera=null,this.renderer=null,this.particles=null,this.innerSphere=null,this.uniforms=null,this.container=null,this.renderContainer=null,this.icosahedron=null,this.targetRotationX=0,this.targetRotationY=0,this.mouseX=0,this.mouseY=0,this.windowHalfX=0,this.windowHalfY=0,this.noiseUniforms={noiseAmplitude:{value:this.options.NOISE.AMPLITUDE},noiseFrequency:{value:this.options.NOISE.FREQUENCY}},this.updateControls=null}init(t){this.container=t,this.renderContainer=document.createElement("div"),this.renderContainer.style.width="100%",this.renderContainer.style.height="100%",this.renderContainer.style.aspectRatio="1/1",this.container.appendChild(this.renderContainer);const n=this.renderContainer.getBoundingClientRect(),e=n.width,i=n.height;this.setupCamera(e,i),this.setupRenderer(e,i),this.setupMouseControls(),this.setupParticles(),this.setupInnerSphere(),this.setupIcosahedron(),this.updateControls=Le(this.camera,this.renderer),this.setVisibility(!1),this.scene.scale.setScalar(0),this.renderContainer.appendChild(this.renderer.domElement)}setupCamera(t,n){this.camera=new h.PerspectiveCamera(75,1,.1,1e3),this.camera.position.z=5,this.windowHalfX=t/2,this.windowHalfY=n/2}setupRenderer(t,n){this.renderer=new h.WebGLRenderer({alpha:!0,antialias:!0}),this.renderer.setSize(t,n),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(window.devicePixelRatio)}setupMouseControls(){document.addEventListener("mousemove",this.onMouseMove.bind(this)),document.addEventListener("mouseleave",this.onMouseLeave.bind(this))}onMouseMove(t){const n=window.innerWidth/2,e=window.innerHeight/2;this.mouseX=(t.clientX-n)/n,this.mouseY=(t.clientY-e)/e,this.targetRotationY=this.mouseX*Math.PI,this.targetRotationX=this.mouseY*Math.PI/2;const i=Math.sqrt(this.mouseX*this.mouseX+this.mouseY*this.mouseY);if(i<1){const s=Math.pow(1-i,3);this.uniforms.noiseFrequency.value=this.options.NOISE.FREQUENCY+(4-this.options.NOISE.FREQUENCY)*s,this.uniforms.noiseAmplitude.value=this.options.NOISE.AMPLITUDE+(.8-this.options.NOISE.AMPLITUDE)*s,this.icosahedron&&this.icosahedron.material.uniforms&&(this.icosahedron.material.uniforms.noiseFrequency.value=this.options.NOISE.FREQUENCY/2+(2-this.options.NOISE.FREQUENCY/2)*s,this.icosahedron.material.uniforms.noiseAmplitude.value=this.options.NOISE.AMPLITUDE/2+(.2-this.options.NOISE.AMPLITUDE/2)*s)}else this.uniforms.noiseFrequency.value=this.options.NOISE.FREQUENCY,this.uniforms.noiseAmplitude.value=this.options.NOISE.AMPLITUDE,this.icosahedron&&this.icosahedron.material.uniforms&&(this.icosahedron.material.uniforms.noiseFrequency.value=this.options.NOISE.FREQUENCY/2,this.icosahedron.material.uniforms.noiseAmplitude.value=this.options.NOISE.AMPLITUDE/2)}onMouseLeave(){const n=this.scene.rotation.x,e=this.scene.rotation.y,i=performance.now(),s=p=>{const c=p-i,m=Math.min(c/1e3,1),y=(u=>u*(2-u))(m);this.scene.rotation.x=n*(1-y),this.scene.rotation.y=e*(1-y),m<1&&requestAnimationFrame(s)};requestAnimationFrame(s)}updateRotation(){const n=this.targetRotationX-this.scene.rotation.x,e=this.targetRotationY-this.scene.rotation.y;this.scene.rotation.x+=n*.3,this.scene.rotation.y+=e*.3}setupParticles(){const t=new h.SphereGeometry(this.options.SPHERE_RADIUS,64,64);t.attributes.position.array,t.attributes.normal.array;const n=new Float32Array(this.options.PARTICLE_COUNT*3),e=new Float32Array(this.options.PARTICLE_COUNT*3),i=new Float32Array(this.options.PARTICLE_COUNT*3),s=new h.Color(this.options.PROCESSING_COLORS[0]),p=new h.Color(this.options.PROCESSING_COLORS[1]),c=new h.Color(this.options.PROCESSING_COLORS[2]),m=new h.Color(this.options.PROCESSING_COLORS[3]);for(let u=0;u<this.options.PARTICLE_COUNT;u++){const x=Math.random(),P=Math.random(),I=2*Math.PI*x,f=Math.acos(2*P-1),v=this.options.SPHERE_RADIUS*Math.sin(f)*Math.cos(I),O=this.options.SPHERE_RADIUS*Math.sin(f)*Math.sin(I),E=this.options.SPHERE_RADIUS*Math.cos(f);e[u*3]=v,e[u*3+1]=O,e[u*3+2]=E;const C=new h.Vector3(v,O,E).normalize();i[u*3]=C.x,i[u*3+1]=C.y,i[u*3+2]=C.z;const L=new h.Color().lerpColors(s.clone().lerp(p,(v+this.options.SPHERE_RADIUS)/(2*this.options.SPHERE_RADIUS)),c.clone().lerp(m,(O+this.options.SPHERE_RADIUS)/(2*this.options.SPHERE_RADIUS)),(E+this.options.SPHERE_RADIUS)/(2*this.options.SPHERE_RADIUS));n[u*3]=L.r,n[u*3+1]=L.g,n[u*3+2]=L.b}const l=new h.BufferGeometry;l.setAttribute("position",new h.Float32BufferAttribute(e,3)),l.setAttribute("normal",new h.Float32BufferAttribute(i,3)),l.setAttribute("color",new h.Float32BufferAttribute(n,3)),this.uniforms={time:{value:1},noiseAmplitude:{value:this.options.NOISE.AMPLITUDE},noiseFrequency:{value:this.options.NOISE.FREQUENCY},pulseTime:{value:0},particleSize:{value:this.options.PARTICLE_SIZE}};const y=new h.ShaderMaterial({uniforms:this.uniforms,vertexShader:X(_e),fragmentShader:X(Te),transparent:!0,vertexColors:!0});this.particles=new h.Points(l,y),this.scene.add(this.particles)}setupInnerSphere(){const t=new h.SphereGeometry(.8,64,64),n=new h.ShaderMaterial({uniforms:{time:{value:0},color1:{value:new h.Color(this.options.PROCESSING_COLORS[0])},color2:{value:new h.Color(this.options.PROCESSING_COLORS[1])},color3:{value:new h.Color(this.options.PROCESSING_COLORS[2])},color4:{value:new h.Color(this.options.PROCESSING_COLORS[3])}},vertexShader:X(Ne),fragmentShader:X(Re),transparent:!0,blending:h.AdditiveBlending,side:h.DoubleSide});this.innerSphere=new h.Mesh(t,n),this.scene.add(this.innerSphere)}setupIcosahedron(){this.icosahedron=new De(2.2,1,this.options),this.scene.add(this.icosahedron.mesh)}updateParticlesScale(t){const n=this.particles.geometry.attributes.position.array;for(let e=0;e<n.length;e+=3){const i=new h.Vector3(n[e],n[e+1],n[e+2]).normalize(),s=t*this.options.SPHERE_RADIUS;n[e]=i.x*s,n[e+1]=i.y*s,n[e+2]=i.z*s}this.particles.geometry.attributes.position.needsUpdate=!0}updateInnerSphereScale(t){this.innerSphere.scale.setScalar(t),this.innerSphere.material.opacity=t}updatePulsation(t){this.uniforms.time.value=t,this.uniforms.pulseTime.value=t*this.options.PULSE_SPEED,this.innerSphere.material.uniforms.time.value=t*this.options.PULSE_SPEED;const n=1+Math.sin(t*this.options.PULSE_SPEED)*this.options.PULSE_AMPLITUDE;this.innerSphere.scale.setScalar(n),this.icosahedron&&this.icosahedron.update(t)}onResize(t,n){const e=Math.min(t,n);this.windowHalfX=e/2,this.windowHalfY=e/2,this.camera.aspect=1,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,e)}render(){this.updateControls?this.updateControls():this.updateRotation(),this.renderer.render(this.scene,this.camera)}dispose(){this.particles.geometry.dispose(),this.particles.material.dispose(),this.innerSphere.geometry.dispose(),this.innerSphere.material.dispose(),this.scene.remove(this.particles),this.scene.remove(this.innerSphere),this.icosahedron&&(this.icosahedron.dispose(),this.scene.remove(this.icosahedron.mesh)),this.renderContainer&&this.renderContainer.parentNode&&this.renderContainer.parentNode.removeChild(this.renderContainer),this.renderContainer=null,this.container=null,document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseleave",this.onMouseLeave)}setVisibility(t){this.particles&&(this.particles.visible=t),this.innerSphere&&(this.innerSphere.visible=t),this.scene.wordMeshes&&this.scene.wordMeshes.forEach(n=>n.visible=t),this.icosahedron&&(this.icosahedron.mesh.visible=t)}}const $=1.70158,re=$+1;function Fe(d){return 1+re*Math.pow(d-1,3)+$*Math.pow(d-1,2)}function We(d){return re*d*d*d-$*d*d}class je{constructor(t={}){this.options=t,this.isSceneEntering=!1,this.isSceneExiting=!1,this.sceneAnimationProgress=0,this.sceneManager=null,this.wordManager=null}init(t,n){this.sceneManager=t,this.wordManager=n}update(){const t=performance.now()*.001;(this.isSceneEntering||this.isSceneExiting)&&this.updateSceneAnimation(),this.sceneManager.updatePulsation(t),this.wordManager.updateWords(t)}updateSceneAnimation(){if(this.sceneAnimationProgress+=.016/this.options.SCENE_ANIMATION_DURATION,this.sceneAnimationProgress>=1){this.isSceneExiting?(this.sceneManager.setVisibility(!1),this.sceneManager.scene.scale.setScalar(0)):this.sceneManager.scene.scale.setScalar(1),this.isSceneEntering=!1,this.isSceneExiting=!1;return}const t=this.isSceneEntering?Fe(this.sceneAnimationProgress):1-We(this.sceneAnimationProgress);this.sceneManager.scene.scale.setScalar(t),this.wordManager&&this.wordManager.updateWordsAnimation(t,this.isSceneEntering)}startEnterAnimation(){this.isSceneEntering=!0,this.isSceneExiting=!1,this.sceneAnimationProgress=0,this.sceneManager.setVisibility(!0),this.sceneManager.scene.scale.setScalar(0),this.wordManager&&this.wordManager.isInitialized()&&this.wordManager.createTextSphere()}startExitAnimation(){this.isSceneExiting=!0,this.isSceneEntering=!1,this.sceneAnimationProgress=0}dispose(){this.sceneManager=null,this.wordManager=null}}class Ve extends a.Loader{constructor(t){super(t)}load(t,n,e,i){const s=this,p=new a.FileLoader(this.manager);p.setPath(this.path),p.setRequestHeader(this.requestHeader),p.setWithCredentials(this.withCredentials),p.load(t,function(c){const m=s.parse(JSON.parse(c));n&&n(m)},e,i)}parse(t){return new ke(t)}}class ke{constructor(t){this.isFont=!0,this.type="Font",this.data=t}generateShapes(t,n=100){const e=[],i=Ye(t,n,this.data);for(let s=0,p=i.length;s<p;s++)e.push(...i[s].toShapes());return e}}function Ye(d,t,n){const e=Array.from(d),i=t/n.resolution,s=(n.boundingBox.yMax-n.boundingBox.yMin+n.underlineThickness)*i,p=[];let c=0,m=0;for(let l=0;l<e.length;l++){const y=e[l];if(y===`
`)c=0,m-=s;else{const u=Xe(y,i,c,m,n);c+=u.offsetX,p.push(u.path)}}return p}function Xe(d,t,n,e,i){const s=i.glyphs[d]||i.glyphs["?"];if(!s){console.error('THREE.Font: character "'+d+'" does not exists in font family '+i.familyName+".");return}const p=new a.ShapePath;let c,m,l,y,u,x,P,I;if(s.o){const f=s._cachedOutline||(s._cachedOutline=s.o.split(" "));for(let v=0,O=f.length;v<O;)switch(f[v++]){case"m":c=f[v++]*t+n,m=f[v++]*t+e,p.moveTo(c,m);break;case"l":c=f[v++]*t+n,m=f[v++]*t+e,p.lineTo(c,m);break;case"q":l=f[v++]*t+n,y=f[v++]*t+e,u=f[v++]*t+n,x=f[v++]*t+e,p.quadraticCurveTo(u,x,l,y);break;case"b":l=f[v++]*t+n,y=f[v++]*t+e,u=f[v++]*t+n,x=f[v++]*t+e,P=f[v++]*t+n,I=f[v++]*t+e,p.bezierCurveTo(u,x,P,I,l,y);break}}return{offsetX:s.ha*t,path:p}}class Ge extends a.ExtrudeGeometry{constructor(t,n={}){const e=n.font;if(e===void 0)super();else{const i=e.generateShapes(t,n.size);n.depth=n.height!==void 0?n.height:50,n.bevelThickness===void 0&&(n.bevelThickness=10),n.bevelSize===void 0&&(n.bevelSize=8),n.bevelEnabled===void 0&&(n.bevelEnabled=!1),super(i,n)}this.type="TextGeometry"}}class qe{constructor(t,n={}){if(!t)throw new Error("TextManager is required");this.textManager=t,this.options={...z,...n},this.text="",this.scene=null,this.wordMeshes=[],this.wordStates=new Map,this.activeWords=new Set,this.font=null,this.MAX_ACTIVE_WORDS=this.options.MAX_ACTIVE_WORDS,this.PROCESSING_COLORS=this.options.PROCESSING_COLORS,this.WORD_ANIMATION=this.options.WORD_ANIMATION,this._isInitialized=!1,this.words=[],this.activeWords=[],this.currentIndex=0,this.isAnimating=!1,this.delayBetweenWords=this.options.WORD_DELAY}init(t){return console.log("WordManager init"),this.scene=t,this.loadFont().then(()=>{console.log("Font loaded"),this._isInitialized=!0})}isInitialized(){return this._isInitialized}getWords(){return console.log("WordManager getting words"),this.textManager.getText()}async loadFont(){const t=new Ve;return new Promise(n=>{t.load("https://threejs.org/examples/fonts/droid/droid_sans_mono_regular.typeface.json",e=>{this.font=e,n()})})}update(t){this.wordMeshes&&this.wordMeshes.length>0&&this.updateWords(t)}updateWords(t){this.activeWords.size<this.MAX_ACTIVE_WORDS&&this.wordMeshes.forEach(n=>{!this.wordStates.get(n).active&&Math.random()<.01&&this.activateWord(n)}),this.activeWords.forEach(n=>{const e=this.wordStates.get(n);e.active&&this.updateWordAnimation(n,e,t)})}updateWordAnimation(t,n,e){const i=this.WORD_ANIMATION.MOVE_OUT_DURATION+this.WORD_ANIMATION.SURFACE_DURATION+this.WORD_ANIMATION.MOVE_IN_DURATION;n.progress+=.016;const s=n.progress;if(s>=i){this.deactivateWord(t,n);return}if(s<this.WORD_ANIMATION.MOVE_OUT_DURATION){const p=s/this.WORD_ANIMATION.MOVE_OUT_DURATION,c=this.easeOutBack(p),m=this.options.TEXT_MIN_RADIUS+(this.options.TEXT_SPHERE_RADIUS-this.options.TEXT_MIN_RADIUS)*c;t.position.setFromSphericalCoords(m,n.originalPosition.theta,n.originalPosition.phi),t.scale.setScalar(c);const l=Math.floor(n.letters.length*.3);n.letters.forEach((y,u)=>{u<l?y.material.opacity=c*.5:y.material.opacity=0})}else if(s<this.WORD_ANIMATION.MOVE_OUT_DURATION+this.WORD_ANIMATION.SURFACE_DURATION){const p=(s-this.WORD_ANIMATION.MOVE_OUT_DURATION)/this.WORD_ANIMATION.SURFACE_DURATION,c=Math.floor(p*n.letters.length);n.letters.forEach((m,l)=>{l<=c?m.material.opacity=.75:m.material.opacity=0})}else{const p=(s-(this.WORD_ANIMATION.MOVE_OUT_DURATION+this.WORD_ANIMATION.SURFACE_DURATION))/this.WORD_ANIMATION.MOVE_IN_DURATION,c=this.easeInBack(p),m=this.options.TEXT_SPHERE_RADIUS-(this.options.TEXT_SPHERE_RADIUS-this.options.TEXT_MIN_RADIUS)*c;t.position.setFromSphericalCoords(m,n.originalPosition.theta,n.originalPosition.phi),n.letters.forEach(l=>{l.material.opacity=.5*(1-c)})}t.lookAt(0,0,0),t.rotateY(Math.PI)}activateWord(t){const n=this.wordStates.get(t);n.active=!0,n.progress=0,t.position.setFromSphericalCoords(this.options.TEXT_MIN_RADIUS,n.originalPosition.theta,n.originalPosition.phi),t.scale.set(0,0,0),this.activeWords.add(t)}deactivateWord(t,n){n.active=!1,n.progress=0,this.activeWords.delete(t),n.letters.forEach(e=>{e.material.opacity=0}),t.position.setFromSphericalCoords(this.options.TEXT_MIN_RADIUS,n.originalPosition.theta,n.originalPosition.phi),t.scale.set(0,0,0)}easeOutBack(t){return 1+2.70158*Math.pow(t-1,3)+1.70158*Math.pow(t-1,2)}easeInBack(t){return 2.70158*t*t*t-1.70158*t*t}updateText(t){console.log("Updating text:",t),this.text=t,this.wordMeshes&&this.wordMeshes.length>0&&this.wordMeshes.forEach(n=>{this.scene&&this.scene.remove(n),n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(e=>e.dispose()):n.material.dispose())}),this.wordMeshes=[],this.wordStates.clear(),this.activeWords=new Set,this._isInitialized&&this.scene&&this.createTextSphere()}createTextSphere(){let t=this.text.split(" ").filter(i=>i.length>4).map(i=>i.trim()).filter(i=>i);t.length===0&&(t=this.textManager.getText());const n=200,e=[];for(;e.length<n;){const i=n-e.length,s=t.slice(0,Math.min(t.length,i));e.push(...s)}this.shuffleArray(e),this.words=[],e.forEach((i,s)=>{try{const p=i.split(""),c=[];let m=0;const l=new h.Group,y=new h.Color(this.options.PROCESSING_COLORS[Math.floor(Math.random()*this.options.PROCESSING_COLORS.length)]);p.forEach(x=>{const P=new Ge(x,{font:this.font,size:.3,height:.01}),I=new h.MeshBasicMaterial({color:y,transparent:!0,opacity:0}),f=new h.Mesh(P,I);P.computeBoundingBox();const v=P.boundingBox.max.x-P.boundingBox.min.x;f.position.x=m,m+=v*1.1,c.push(f),l.add(f)}),l.children.forEach(x=>{x.position.x-=m/2});const u=this.getRandomSpherePosition();l.position.setFromSphericalCoords(this.options.TEXT_MIN_RADIUS,u.theta,u.phi),l.lookAt(0,0,0),l.rotateY(Math.PI),this.wordStates.set(l,{active:!1,progress:0,letters:c,originalPosition:u,hasCreatedLine:!1,isOnSurface:!1}),this.wordMeshes.push(l),this.words.push(l),this.scene&&this.scene.add(l)}catch(p){console.warn(`Failed to create word mesh for "${i}"`,p)}}),this.scene&&this.scene.updateWordMeshes(this.wordMeshes),this.currentIndex=0,this.isAnimating=!1,this.startWordAnimation()}shuffleArray(t){for(let n=t.length-1;n>0;n--){const e=Math.floor(Math.random()*(n+1));[t[n],t[e]]=[t[e],t[n]]}return t}getRandomSpherePosition(){const t=(1+Math.sqrt(5))/2,n=this.wordMeshes.length,e=200,i=2*Math.PI*n/t,s=Math.acos(1-2*(n+.5)/e),p=.1,c=(Math.random()-.5)*p,m=(Math.random()-.5)*p,l=(i+c)%(2*Math.PI),y=Math.max(.1,Math.min(Math.PI-.1,s+m)),u=Math.random()*Math.PI*2;return{theta:l+u,phi:y}}updateWordsAnimation(t,n){if(!(!this.wordMeshes||this.wordMeshes.length===0)){if(n&&t>.5&&this.activeWords.size===0){const e=Math.floor(this.MAX_ACTIVE_WORDS*.5);let i=0;this.wordMeshes.forEach(s=>{i<e&&Math.random()<.5&&(this.activateWord(s),i++)})}!n&&t<.5&&this.activeWords.forEach(e=>{const i=this.wordStates.get(e);i&&this.deactivateWord(e,i)}),this.wordMeshes.forEach(e=>{if(!this.activeWords.has(e)){e.visible=n,e.scale.setScalar(0);const i=this.wordStates.get(e);i&&i.letters.forEach(s=>{s.material.opacity=0})}})}}processText(t){}activateNextWordGroup(){if(this.currentIndex>=this.words.length||this.isAnimating)return!1;this.isAnimating=!0;const t=this.words[this.currentIndex];this.activeWords.add(t);const n=t.position.y;let e=[t],i=this.currentIndex+1;for(;i<this.words.length&&Math.abs(this.words[i].position.y-n)<.1;)e.push(this.words[i]),this.activeWords.add(this.words[i]),i++;return e.forEach((s,p)=>{setTimeout(()=>{this.activateWord(s),p===e.length-1&&(this.isAnimating=!1)},p*this.options.WORD_DELAY)}),this.currentIndex=i,!0}dispose(){this.wordMeshes&&this.wordMeshes.forEach(t=>{this.scene&&this.scene.remove(t),t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}startWordAnimation(){const t=()=>{this.activateNextWordGroup()&&setTimeout(t,this.options.WORD_DELAY)};t()}}class Be{constructor(t={}){this.options={...z,...t},this.placeholderText=["Three.js","WebGL","Creative","Development","Interactive","Experience","Digital","Art"]}getText(){console.log("TextManager getText called");const t=document.querySelector(".content-text");if(console.log("Content text element:",t),t&&t.textContent.trim()){const n=t.textContent.trim().split(/\s+/).filter(e=>e.length>3).slice(0,8);if(console.log("Found words:",n),n.length>=4)return n}return console.log("Using placeholder"),this.placeholderText}}class ce{constructor(t={}){Oe(this,"animate",()=>{requestAnimationFrame(this.animate),this.animationManager.update(),this.sceneManager.render()});console.log("AiAnimation constructor started",t);const{containerId:n="ai_animation",options:e={},onInitialized:i}=t;if(this.container=document.getElementById(n),!this.container)throw new Error(`Container element with id "${n}" not found`);console.log("Container found:",this.container),this.options=Ce(e),this.onInitialized=i,console.log("Options initialized:",this.options),this.textManager=new Be(this.options),this.wordManager=new qe(this.textManager,this.options),this.sceneManager=new Ue(this.wordManager,this.options),this.animationManager=new je(this.options),console.log("Managers created"),this.init()}async init(){console.log("Starting initialization...");try{console.log("Initializing scene..."),this.sceneManager.init(this.container),console.log("Scene initialized"),console.log("Initializing word manager..."),await this.wordManager.init(this.sceneManager.scene),console.log("Word manager initialized"),console.log("Initializing animation manager..."),this.animationManager.init(this.sceneManager,this.wordManager),console.log("Animation manager initialized"),this.animate(),console.log("Animation loop started"),this.onInitialized&&(console.log("Calling onInitialized callback"),this.onInitialized())}catch(t){throw console.error("Initialization error:",t),t}}startAnimation(t){if(console.log("Starting animation with text:",t),!t||typeof t!="string")throw new Error("Text parameter is required and must be a string");this.wordManager.updateText(t),this.animationManager.startEnterAnimation()}stopAnimation(){console.log("Stopping animation"),this.animationManager.startExitAnimation()}dispose(){this.sceneManager.dispose(),this.animationManager.dispose(),this.wordManager.dispose()}}A.AiAnimation=ce,A.default=ce,Object.defineProperties(A,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
