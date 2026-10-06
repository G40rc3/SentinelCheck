/* Original Sentinel Check Singularity adapted for the fixed homepage.
   Reuses the original simplex-noise shader, instanced travelling streaks,
   radius-dependent orbital velocity, opaque core and additive rim. */
import * as THREE from './vendor/three.module.js';
const SETTINGS = Object.freeze({ particles: 5000, mobileParticles: 1600,
  speed: 0.75, brightness: 1.3, tiltDegrees: -19, cameraDistance: 22,
  centreX: 0.76, centreY: 0.43, interference: 0.8,
  maxPixelRatio: 1.5, maxPixels: 2400000, fps: 30 });
const canvas = document.getElementById('singularity-background-canvas');
if (canvas) initialise();
function initialise() {
  const host = canvas.parentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'low-power'}); }
  catch (error) { host.dataset.sceneState='webgl-unavailable'; console.warn('Singularity: WebGL unavailable; showing fallback.',error); return; }
  let failed=false, lost=false, frame=0, previous=0, elapsed=0;
  renderer.debug.onShaderError = () => { failed=true; host.classList.remove('is-ready'); host.dataset.sceneState='shader-error'; console.warn('Singularity shader failed; showing fallback.'); };
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=SETTINGS.brightness;
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#030b12');
  const camera=new THREE.PerspectiveCamera(40,1,0.1,250);
  // A fixed rolled camera tilts the core's complete particle/interference field.
  const roll=THREE.MathUtils.degToRad(SETTINGS.tiltDegrees);
  camera.up.set(Math.sin(roll),Math.cos(roll),0);
  camera.position.set(0,SETTINGS.cameraDistance*.32,SETTINGS.cameraDistance*.948);
  camera.lookAt(0,0,0);
  let seed=71427;
  const random=()=>{ seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
    const noiseChunk = `
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }
    `;

    // ---- Core: the business, not a void. A solid navy sphere with a calm teal rim. ----
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; varying vec3 vView;
        void main(){vNormal=normalize(normalMatrix*normal);vView=normalize(-(modelViewMatrix*vec4(position,1.0)).xyz);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec3 vNormal; varying vec3 vView;
        void main(){vec3 n=normalize(vNormal);float rim=pow(1.0-max(dot(n,normalize(vView)),0.0),3.4);
        float light=.25+.75*max(dot(n,normalize(vec3(1.0,.5,.1))),0.0);
        gl_FragColor=vec4(vec3(.006,.019,.032)+vec3(0.0,.72,.82)*rim*light,1.0);}`
    });
    const coreGeo = new THREE.SphereGeometry(4, 64, 64);
    coreGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const auraMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uIntensity: { value: 0.5 } },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uIntensity;
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
                float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 4.0);
                gl_FragColor = vec4(vec3(0.0, 0.89, 0.82), rim * uIntensity * 0.55);
            }
        `,
        side: THREE.FrontSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    coreGroup.add(new THREE.Mesh(new THREE.SphereGeometry(4.06, 64, 64), auraMat));

    // ---- Signal field: scattered risk points that resolve into an ordered, calm ring ----
    const instanceCount = SETTINGS.particles;
    const streakGeo = new THREE.CylinderGeometry(0.003, 0.014, 0.40, 3);
    streakGeo.rotateX(Math.PI / 2);

    const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMorph: { value: 0.65 },
            uCompression: { value: 1.0 },
            uIntensity: { value: 0.9 },
            uOrbitScale: { value: 0.8 },
            uCalm: { value: 1.0 }
        },
        vertexShader: `
            ${noiseChunk}
            uniform float uTime;
            uniform float uMorph;
            uniform float uCompression;
            uniform float uIntensity;
            uniform float uOrbitScale;
            uniform float uCalm;
            varying vec3 vColor;
            varying float vOpacity;
            void main() {
                vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
                float rOriginal = length(instPos.xz);
                float r = rOriginal * uCompression;
                float initialAngle = atan(instPos.z, instPos.x);
                float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
                float currentAngle = initialAngle + (uTime * orbitalVelocity);
                vec3 morphedWorldPos = vec3(cos(currentAngle) * r, instPos.y, sin(currentAngle) * r);
                float noise = snoise(vec3(morphedWorldPos.x * 0.08, morphedWorldPos.z * 0.08, uTime * 0.3));
                morphedWorldPos.y += noise * uMorph * 4.0;
                vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
                vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
                float doppler = dot(orbitDir, viewDir);

                // Muted grey-amber (unchecked risk) resolving into calm teal (protected)
                vec3 muted = vec3(0.12, 0.30, 0.58);
                vec3 caution = vec3(0.31, 0.55, 1.0);
                vec3 calmTeal = vec3(0.0, 0.89, 0.82);
                vec3 brightTeal = vec3(0.40, 0.95, 1.0);

                vec3 riskColor = mix(muted, caution, (1.0 - smoothstep(15.0, 45.0, r)));
                vec3 protectedColor = mix(calmTeal, brightTeal, (1.0 - smoothstep(5.0, 30.0, r)));
                vec3 color = mix(riskColor, protectedColor, uCalm);

                vColor = color * (1.1 + doppler * 0.5) * uIntensity;
                vOpacity = (smoothstep(3.8, 5.5, r) * (1.0 - smoothstep(38.0, 48.0, r))) * 0.75;

                float deltaAngle = currentAngle - initialAngle;
                float c = cos(deltaAngle);
                float s = sin(deltaAngle);
                mat3 rotY = mat3(
                    c, 0, s,
                    0, 1, 0,
                   -s, 0, c
                );
                vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
                vec3 rotatedLocalPos = rotY * localPos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedWorldPos + rotatedLocalPos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vOpacity;
            void main() {
                gl_FragColor = vec4(vColor, vOpacity);
            }
        `,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });

    const instancedField = new THREE.InstancedMesh(streakGeo, fieldMaterial, instanceCount);
    instancedField.frustumCulled = false;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < instanceCount; i++) {
        const r = 5 + Math.pow(random(), 1.3) * 23;
        const angle = random() * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * r, (random() - 0.5) * (8 / r), Math.sin(angle) * r);
        dummy.lookAt(dummy.position.x + Math.sin(angle), dummy.position.y, dummy.position.z - Math.cos(angle));
        dummy.updateMatrix();
        instancedField.setMatrixAt(i, dummy.matrix);
    }
    scene.add(instancedField);


  function render() {
    if (lost || failed || document.hidden) return;
    const t=elapsed*SETTINGS.speed;
    fieldMaterial.uniforms.uTime.value=t;
    // Keep the original resolving/interference movement without moving the camera.
    fieldMaterial.uniforms.uMorph.value=SETTINGS.interference*(.65+.35*Math.sin(t*.22));
    fieldMaterial.uniforms.uCompression.value=.96+.04*Math.sin(t*.15);
    fieldMaterial.uniforms.uIntensity.value=.92+.10*Math.sin(t*.19);
    auraMat.uniforms.uTime.value=t;
    auraMat.uniforms.uIntensity.value=.50+.04*Math.sin(t*.20);
    instancedField.rotation.y=t*.024;
    renderer.render(scene,camera);
    if(!failed) { host.classList.add('is-ready'); host.dataset.sceneState=reduced.matches?'reduced-motion':'animated'; }
  }
  function resize() {
    const w=document.documentElement.clientWidth, h=window.innerHeight;
    const mobile=w<761;
    const ratio=Math.min(devicePixelRatio||1,SETTINGS.maxPixelRatio,Math.sqrt(SETTINGS.maxPixels/(w*h)));
    renderer.setPixelRatio(ratio); renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.fov=mobile?THREE.MathUtils.radToDeg(2*Math.atan(4.2/(SETTINGS.cameraDistance*.88*camera.aspect))):40;
    camera.setViewOffset(w,h,-w*((mobile?.69:SETTINGS.centreX)-.5),h*(.5-(mobile?.40:SETTINGS.centreY)),w,h);
    camera.updateProjectionMatrix();
    instancedField.count=mobile?Math.min(SETTINGS.mobileParticles,SETTINGS.particles):SETTINGS.particles;
    render();
  }
  function stop() { cancelAnimationFrame(frame); frame=0; previous=0; }
  function tick(now) {
    frame=0;
    if(lost || failed || document.hidden || reduced.matches) return;
    if(!previous) previous=now;
    if(now-previous>=1000/SETTINGS.fps) { elapsed+=Math.min((now-previous)/1000,.1); previous=now; render(); }
    frame=requestAnimationFrame(tick);
  }
  function start() { if(!frame && !lost && !failed && !document.hidden && !reduced.matches) frame=requestAnimationFrame(tick); }
  document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden){render();start();}});
  reduced.addEventListener('change',()=>{stop();render();start();});
  window.addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('webglcontextlost',()=>{lost=true;stop();host.classList.remove('is-ready');host.dataset.sceneState='context-lost';});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;failed=false;resize();start();});
  window.addEventListener('pagehide',stop); window.addEventListener('pageshow',start);
  resize(); start();
}
