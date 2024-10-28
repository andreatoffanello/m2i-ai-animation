import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

let container, width, height;

let scene, camera, renderer, particles, uniforms, innerSphere;
let mutationSpeed = 2.0;  // Velocità base costante per la pulsazione
let noiseAmplitude = 0.1; // Ampiezza base del noise (verrà modificata dal mouse)
let noiseFrequency = 1.0; // Frequenza base del noise (verrà modificata dal mouse)
let particleSize = 0.001;
let particleCount = 30000;

// Variabili per il controllo della rotazione e dell'interazione del mouse
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let sphereRadius = 2; // Raggio della sfera

// Aggiungi questa variabile globale all'inizio del file
let innerSpherePulseTime = 0;

// Aggiungi questa variabile globale all'inizio del file
let outerSpherePulseTime = 0;

// All'inizio del file, dopo la dichiarazione delle variabili esistenti
let textSphere;
let wordMeshes = [];
const textSphereRadius = 3; // Raggio della sfera di testo (più grande delle altre)
const textMinRadius = 0.5; // Raggio minimo per le parole (vicino al centro)
let activeWords = new Set(); // Tiene traccia delle parole in elaborazione
const WORDS_PROCESSING_TIME = 5.0; // Tempo di elaborazione per ogni parola in secondi
const MAX_ACTIVE_WORDS = 50; // Numero massimo di parole da processare contemporaneamente

// Aggiungi queste strutture per gestire l'animazione delle parole
let wordStates = new Map(); // Mappa per tenere traccia dello stato di ogni parola

// Costanti per i limiti dei valori del noise
const NOISE_AMPLITUDE_MIN = 0.1;
const NOISE_AMPLITUDE_MAX = 0.4;
const NOISE_FREQ_MIN = 1.0;
const NOISE_FREQ_MAX = 2.5;

// Costanti per la pulsazione (ora indipendenti dal mouse)
const PULSE_SPEED = 2.0;
const PULSE_AMPLITUDE = 0.1;

// Modifica le costanti di tempo per una digitazione più rapida
const MOVEMENT_TIME = 0.3;
const PROCESSING_TIME = 2.5; // Ridotto da 3.0 a 1.5 per una digitazione più veloce
const TOTAL_ANIMATION_TIME = MOVEMENT_TIME * 2 + PROCESSING_TIME;

// Aggiungi queste costanti per i colori
const PROCESSING_COLORS = [
    new THREE.Color("#FBD23D"), // giallo
    new THREE.Color("#3EECFF"), // azzurro
    new THREE.Color("#EF6F34"), // arancione
    new THREE.Color("#5C20DD")  // viola
];

// Aggiungi queste costanti per l'effetto digitale
const GLOW_INTENSITY = 0.4;
const SCANLINE_SPEED = 2.0;

// Aggiungi questa funzione per creare il cursore
function createCursor(font) {
    const cursorGeometry = new TextGeometry('_', {  // Cambiato da '|' a '_'
        font: font,
        size: 0.12,
        height: 0.01
    });
    
    const cursorMaterial = new THREE.MeshBasicMaterial({ 
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide
    });
    
    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    cursor.renderOrder = 999;
    return cursor;
}

// Aggiungi queste funzioni di utilità all'inizio del file
function getRandomSpherePosition() {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;
    return {
        phi: phi,
        theta: theta
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Aggiungi queste strutture per gestire le linee
let activeLines = new Set();
const LINE_DURATION = 0.5; // più veloce

// Aggiungi questa classe per gestire le linee animate
class AnimatedLine {
    constructor(startWord, endWord, startColor, endColor) {
        const lineGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(2 * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const lineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                startColor: { value: startColor },
                endColor: { value: endColor },
                progress: { value: 0.0 },
                fadeProgress: { value: 0.0 }
            },
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 startColor;
                uniform vec3 endColor;
                uniform float progress;
                uniform float fadeProgress;
                varying vec3 vPosition;
                
                void main() {
                    float lineProgress = gl_FragCoord.x / gl_FragCoord.y;
                    vec3 color = mix(startColor, endColor, lineProgress);
                    float appearOpacity = smoothstep(lineProgress - 0.1, lineProgress, progress);
                    float fadeOpacity = 1.0 - smoothstep(lineProgress - 0.1, lineProgress, fadeProgress);
                    
                    // Riduci l'opacità generale al 50%
                    gl_FragColor = vec4(color, appearOpacity * fadeOpacity * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,     // Importante per la trasparenza
            depthTest: true,       // Mantiene il test di profondità
            side: THREE.DoubleSide // Renderizza entrambi i lati
        });

        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.line.renderOrder = 1; // Assicura che le linee siano renderizzate dopo gli altri oggetti
        this.startWord = startWord;
        this.endWord = endWord;
        this.startTime = performance.now() * 0.001;
        this.duration = LINE_DURATION;
        
        scene.add(this.line);
    }

    update(currentTime) {
        const elapsed = (currentTime - this.startTime) / this.duration;
        
        // Aggiorna le posizioni
        const positions = this.line.geometry.attributes.position.array;
        const startPos = this.startWord.position;
        const endPos = this.endWord.position;
        
        positions[0] = startPos.x;
        positions[1] = startPos.y;
        positions[2] = startPos.z;
        positions[3] = endPos.x;
        positions[4] = endPos.y;
        positions[5] = endPos.z;
        
        this.line.geometry.attributes.position.needsUpdate = true;

        // Aggiorna i progress dell'animazione
        if (elapsed <= 1.0) {
            this.line.material.uniforms.progress.value = Math.min(1.0, elapsed * 2);
            this.line.material.uniforms.fadeProgress.value = Math.max(0.0, elapsed * 2 - 1);
        }

        return elapsed <= 1.0;
    }

    dispose() {
        scene.remove(this.line);
        this.line.geometry.dispose();
        this.line.material.dispose();
    }
}

// Aggiungi queste variabili globali
let isSceneEntering = false;
let isSceneExiting = false;
let sceneAnimationProgress = 0;
const SCENE_ANIMATION_DURATION = 2.0; // secondi

// Aggiungi queste funzioni per controllare l'animazione
function startEnterAnimation() {
    isSceneEntering = true;
    sceneAnimationProgress = 0;
}

function startExitAnimation() {
    isSceneExiting = true;
    sceneAnimationProgress = 0;
}

function init() {
    container = document.getElementById('ai_animation');
    width = container.clientWidth;
    height = container.clientHeight;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Imposta il colore di sfondo a completamente trasparente
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const vertexShader = `
        uniform float time;
        uniform float noiseAmplitude;
        uniform float noiseFrequency;
        uniform float pulseTime;
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

        // Classic Perlin noise
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
            
            // Aumenta la velocità del noise
            float noiseVal = cnoise(pos * noiseFrequency + time * 0.3); // Aumentato da 0.1 a 0.3
            float displacement = noiseVal * noiseAmplitude;
            
            // Aumenta l'effetto della pulsazione
            float pulse = 1.0 + sin(pulseTime * 0.8) * 0.05; // Aumentato da 0.5 a 0.8 e da 0.03 a 0.05
            
            pos *= pulse;
            pos += normal * displacement;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = ${particleSize.toFixed(3)};
        }
    `;

    const fragmentShader = `
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;
    const colors = new Float32Array(particleCount * 3);

    const particlePositions = new Float32Array(particleCount * 3);
    const particleNormals = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#FBD23D");
    const color2 = new THREE.Color("#3EECFF");
    const color3 = new THREE.Color("#EF6F34");
    const color4 = new THREE.Color("#5C20DD");

    for (let i = 0; i < particleCount; i++) {
        // Generazione di punti uniformemente distribuiti sulla sfera
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const x = 2 * Math.sin(phi) * Math.cos(theta);
        const y = 2 * Math.sin(phi) * Math.sin(theta);
        const z = 2 * Math.cos(phi);

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        // Il vettore normale in una sfera è uguale alla posizione normalizzata
        const normal = new THREE.Vector3(x, y, z).normalize();
        particleNormals[i * 3] = normal.x;
        particleNormals[i * 3 + 1] = normal.y;
        particleNormals[i * 3 + 2] = normal.z;

        const color = new THREE.Color().lerpColors(
            color1.clone().lerp(color2, (x + 2) / 4),
            color3.clone().lerp(color4, (y + 2) / 4),
            (z + 2) / 4  // Questo ora varia da 0 a 1 per l'intera sfera
        );

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(particleNormals, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    uniforms = {
        time: { value: 1.0 },
        noiseAmplitude: { value: noiseAmplitude },
        noiseFrequency: { value: noiseFrequency },
        pulseTime: { value: 0.0 } // Aggiungi questa nuova uniform
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        vertexColors: true
    });

    particles = new THREE.Points(particleGeometry, material);
    scene.add(particles);

    // Creazione della sfera interna luminosa
    const innerSphereGeometry = new THREE.SphereGeometry(0.8, 64, 64);
    const innerSphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color("#FBD23D") },
            color2: { value: new THREE.Color("#3EECFF") },
            color3: { value: new THREE.Color("#EF6F34") },
            color4: { value: new THREE.Color("#5C20DD") }
        },
        vertexShader: `
            varying vec3 vPosition;
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
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform vec3 color4;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            void main() {
                // Migliore interpolazione dei colori
                vec3 color = mix(
                    mix(color1, color2, sin(time * 0.5 + vPosition.x * 2.0) * 0.5 + 0.5),
                    mix(color3, color4, cos(time * 0.5 + vPosition.y * 2.0) * 0.5 + 0.5),
                    sin(time + vPosition.z * 2.0) * 0.5 + 0.5
                );
                
                // Effetto Fresnel migliorato
                vec3 viewDirection = normalize(vViewPosition);
                float fresnelTerm = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
                
                // Effetto di brillantezza
                float glow = pow(fresnelTerm, 2.0) * 2.0;
                color += glow * vec3(0.5, 0.7, 1.0);
                
                // Calcolo alpha più fluido
                float alpha = mix(0.2, 0.8, fresnelTerm);
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
    scene.add(innerSphere);

    // Aggiungi questa riga
    createTextSphere();

    // Aggiungi questo evento per la rotazione basata sul movimento del mouse
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;

    // Ruota la scena in base alla posizione del mouse
    targetRotationY = mouseX * Math.PI;
    targetRotationX = mouseY * Math.PI / 2;

    // Calcola la distanza dal centro della sfera
    const distanceFromCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

    // Modifica solo noise frequency e amplitude in base al mouse
    if (distanceFromCenter < 1) {
        const t = Math.pow(1 - distanceFromCenter, 2);
        
        // Interpola solo i valori del noise
        noiseFrequency = NOISE_FREQ_MIN + (NOISE_FREQ_MAX - NOISE_FREQ_MIN) * t;
        noiseAmplitude = NOISE_AMPLITUDE_MIN + (NOISE_AMPLITUDE_MAX - NOISE_AMPLITUDE_MIN) * t;
    } else {
        noiseFrequency = NOISE_FREQ_MIN;
        noiseAmplitude = NOISE_AMPLITUDE_MIN;
    }

    // Aggiorna gli uniforms del noise
    uniforms.noiseFrequency.value = noiseFrequency;
    uniforms.noiseAmplitude.value = noiseAmplitude;
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;
    
    if (isSceneEntering || isSceneExiting) {
        sceneAnimationProgress += 0.016 / SCENE_ANIMATION_DURATION;
        
        if (sceneAnimationProgress >= 1.0) {
            isSceneEntering = false;
            isSceneExiting = false;
        }
        
        const progress = isSceneEntering ? easeOutQuad(sceneAnimationProgress) 
                                       : 1 - easeInQuad(sceneAnimationProgress);
        
        // Anima le particelle
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const originalPos = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            ).normalize();
            
            const targetScale = isSceneEntering ? 2 : 0;
            const scale = progress * 2; // 2 è il raggio della sfera
            
            positions[i] = originalPos.x * scale;
            positions[i + 1] = originalPos.y * scale;
            positions[i + 2] = originalPos.z * scale;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Anima la sfera interna
        innerSphere.scale.setScalar(progress);
        innerSphere.material.opacity = progress;
        
        // Anima le parole
        wordMeshes.forEach((mesh, index) => {
            const delay = index * 0.1; // Ritardo progressivo per ogni parola
            const wordProgress = Math.max(0, Math.min(1, (progress - delay) * 2));
            
            if (isSceneEntering) {
                mesh.position.normalize().multiplyScalar(wordProgress * textSphereRadius);
            } else {
                mesh.position.normalize().multiplyScalar((1 - wordProgress) * textSphereRadius);
            }
            
            // Fade in/out delle lettere
            const state = wordStates.get(mesh);
            state.letters.forEach(letter => {
                letter.material.opacity = wordProgress * 0.5;
            });
        });
    }

    // Interpolazione fluida per la rotazione
    const rotationLerp = 0.05;
    scene.rotation.x += (targetRotationX - scene.rotation.x) * rotationLerp;
    scene.rotation.y += (targetRotationY - scene.rotation.y) * rotationLerp;
    
    // Pulsazione costante indipendente dal mouse
    uniforms.time.value = time * mutationSpeed;
    outerSpherePulseTime = time * PULSE_SPEED;
    uniforms.pulseTime.value = outerSpherePulseTime;
    
    // Pulsazione della sfera interna con velocità costante
    innerSphere.material.uniforms.time.value = time * PULSE_SPEED;
    const pulseFactor = 1 + Math.sin(time * PULSE_SPEED) * PULSE_AMPLITUDE;
    innerSphere.scale.setScalar(pulseFactor);

    // Animazione del testo con velocità costante
    wordMeshes.forEach((mesh, index) => {
        const offset = index * Math.PI * 2 / wordMeshes.length;
        const radius = textSphereRadius + Math.sin(time * PULSE_SPEED + offset) * 0.2; // <- Qui per l'animazione
        mesh.position.normalize().multiplyScalar(radius);
        mesh.lookAt(0, 0, 0);
        mesh.rotateY(Math.PI);
    });

    // Aggiungi questa chiamata prima di renderer.render
    updateWordAnimations(time);

    renderer.render(scene, camera);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Modifica la funzione createTextSphere
function createTextSphere() {
    // Filtra e randomizza le parole
    let words = text.split(' ').filter(word => word.length > 4);
    words = shuffleArray(words); // Mischia le parole
    
    const fontLoader = new FontLoader();
    
    fontLoader.load('https://threejs.org/examples/fonts/droid/droid_sans_mono_regular.typeface.json', function(font) {
        words.forEach((word, index) => {
            const letters = word.split('');
            const letterMeshes = [];
            let totalWidth = 0;
            
            const wordGroup = new THREE.Group();
            
            // Crea le lettere
            letters.forEach((letter, letterIndex) => {
                const letterGeometry = new TextGeometry(letter, {
                    font: font,
                    size: 0.08,
                    height: 0.01
                });
                
                // Torniamo al materiale semplice
                const letterMaterial = new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color(0x3EECFF),
                    transparent: true,
                    opacity: 0.0
                });
                
                const letterMesh = new THREE.Mesh(letterGeometry, letterMaterial);
                
                letterGeometry.computeBoundingBox();
                const letterWidth = letterGeometry.boundingBox.max.x - letterGeometry.boundingBox.min.x;
                
                letterMesh.position.x = totalWidth;
                totalWidth += letterWidth * 1.1;
                
                letterMeshes.push(letterMesh);
                wordGroup.add(letterMesh);
            });
            
            // Aggiungi il cursore
            const cursor = createCursor(font);
            wordGroup.add(cursor);
            
            // Centra tutto il gruppo
            wordGroup.children.forEach(letter => {
                letter.position.x -= totalWidth / 2;
            });
            
            // Sostituisci il posizionamento esistente con uno casuale
            const randomPos = getRandomSpherePosition();
            wordGroup.position.setFromSphericalCoords(
                textMinRadius,
                randomPos.theta,
                randomPos.phi
            );
            
            wordGroup.lookAt(0, 0, 0);
            wordGroup.rotateY(Math.PI);
            
            wordStates.set(wordGroup, {
                active: false,
                progress: 0,
                startRadius: textMinRadius,
                targetRadius: textSphereRadius,
                letters: letterMeshes,
                cursor: cursor,
                processingColor: PROCESSING_COLORS[Math.floor(Math.random() * PROCESSING_COLORS.length)],
                originalColor: new THREE.Color(0x3EECFF),
                initialLettersShown: 3,
                originalPosition: { // Salva la posizione originale
                    phi: randomPos.phi,
                    theta: randomPos.theta
                },
                hasCreatedLine: false, // Flag per tracciare se la parola ha già creato una linea
                isOnSurface: false    // Flag per tracciare se la parola è in superficie
            });
            
            wordMeshes.push(wordGroup);
            scene.add(wordGroup);
        });
    });
}

// Modifica la funzione updateWordAnimations
function updateWordAnimations(time) {
    if (activeWords.size < MAX_ACTIVE_WORDS) {
        wordMeshes.forEach(mesh => {
            const state = wordStates.get(mesh);
            if (!state.active && Math.random() < 0.01 && activeWords.size < MAX_ACTIVE_WORDS) {
                state.active = true;
                state.progress = 0;
                state.hasCreatedLine = false;  // Reset il flag quando la parola viene riattivata
                // Quando attiviamo una parola, le diamo una nuova posizione casuale
                const newPos = getRandomSpherePosition();
                state.originalPosition = {
                    phi: newPos.phi,
                    theta: newPos.theta
                };
                
                // Aggiorna la posizione iniziale del gruppo
                mesh.position.setFromSphericalCoords(
                    textMinRadius,
                    newPos.theta,
                    newPos.phi
                );
                mesh.lookAt(0, 0, 0);
                mesh.rotateY(Math.PI);
                
                activeWords.add(mesh);
            }
        });
    }

    activeWords.forEach(wordGroup => {
        const state = wordStates.get(wordGroup);
        if (state.active) {
            state.progress += 0.016 / TOTAL_ANIMATION_TIME;

            if (state.progress >= 1.0) {
                // Reset
                state.active = false;
                state.progress = 0;
                activeWords.delete(wordGroup);
                wordGroup.children.forEach(letter => {
                    letter.material.opacity = 0;
                });
                state.cursor.material.opacity = 0;
                wordGroup.position.setLength(textMinRadius);
            } else {
                const totalProgress = state.progress * TOTAL_ANIMATION_TIME;
                
                if (totalProgress < MOVEMENT_TIME) {
                    const moveOutProgress = totalProgress / MOVEMENT_TIME;
                    // Usa la posizione salvata nello state
                    const radius = state.startRadius + (state.targetRadius - state.startRadius) * easeOutQuad(moveOutProgress);
                    wordGroup.position.setFromSphericalCoords(
                        radius,
                        state.originalPosition.theta,
                        state.originalPosition.phi
                    );
                    wordGroup.lookAt(0, 0, 0);
                    wordGroup.rotateY(Math.PI);
                    
                    // Mostra le prime lettere con semitrasparenza
                    state.letters.forEach((letter, index) => {
                        if (index < state.initialLettersShown) {
                            letter.material.opacity = 0.5; // Cambiato da 0.8 a 0.5
                            letter.material.color = state.processingColor;
                        } else {
                            letter.material.opacity = 0;
                        }
                    });
                    
                    // Posiziona e mostra il cursore dopo l'ultima lettera visibile
                    const lastVisibleLetter = state.letters[state.initialLettersShown - 1];
                    state.cursor.position.x = lastVisibleLetter.position.x + 0.08; // Ridotto lo spazio
                    state.cursor.material.opacity = Math.sin(time * 15) * 0.5 + 0.5; // Lampeggio più veloce e più visibile
                    
                    // Aggiorna il colore del cursore insieme alle lettere
                    state.cursor.material.color = state.processingColor;
                    state.cursor.position.x = lastVisibleLetter.position.x + 0.08;
                    state.cursor.material.opacity = Math.sin(time * 15) * 0.5 + 0.5;
                } 
                else if (totalProgress < MOVEMENT_TIME + PROCESSING_TIME) {
                    // Fase di elaborazione
                    const processingProgress = (totalProgress - MOVEMENT_TIME) / PROCESSING_TIME;
                    wordGroup.position.normalize().multiplyScalar(state.targetRadius);
                    
                    // Marca la parola come "in superficie"
                    state.isOnSurface = true;
                    
                    // Calcola quale lettera dovrebbe essere visibile
                    const remainingLetters = state.letters.length - state.initialLettersShown;
                    const currentLetterIndex = Math.floor(processingProgress * remainingLetters) + state.initialLettersShown;
                    
                    // Mostra le lettere con effetto di digitazione netta ma semitrasparente
                    state.letters.forEach((letter, index) => {
                        if (index <= currentLetterIndex) {
                            letter.material.opacity = 0.5; // Cambiato da 0.8 a 0.5
                            letter.material.color = state.processingColor;
                        } else {
                            letter.material.opacity = 0;
                        }
                    });
                    
                    // Aggiorna la posizione del cursore
                    if (currentLetterIndex < state.letters.length) {
                        const currentLetter = state.letters[currentLetterIndex];
                        state.cursor.position.x = currentLetter.position.x + 0.08;
                        state.cursor.material.opacity = Math.sin(time * 15) * 0.5 + 0.5;
                        state.cursor.visible = true; // Assicurati che sia visibile
                    } else {
                        state.cursor.visible = false;
                    }
                    
                    // Crea una linea solo se:
                    // 1. La parola non ha ancora creato una linea
                    // 2. È passato almeno il 20% del tempo di processing
                    // 3. Ci sono altre parole in superficie
                    if (!state.hasCreatedLine && 
                        processingProgress > 0.2 && 
                        Math.random() < 0.1 && 
                        activeWords.size > 1) {
                        
                        // Filtra solo le parole che sono già in superficie
                        let availableTargets = Array.from(activeWords).filter(w => {
                            const targetState = wordStates.get(w);
                            return w !== wordGroup && 
                                   targetState.isOnSurface && 
                                   targetState.progress * TOTAL_ANIMATION_TIME > MOVEMENT_TIME;
                        });

                        if (availableTargets.length > 0) {
                            const targetWord = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                            const startColor = PROCESSING_COLORS[Math.floor(Math.random() * PROCESSING_COLORS.length)];
                            const endColor = PROCESSING_COLORS[Math.floor(Math.random() * PROCESSING_COLORS.length)];
                            
                            const newLine = new AnimatedLine(wordGroup, targetWord, startColor, endColor);
                            activeLines.add(newLine);
                            
                            // Marca la parola come "ha creato una linea"
                            state.hasCreatedLine = true;
                        }
                    }
                }
                else {
                    // Movimento verso il centro
                    const moveInProgress = (totalProgress - (MOVEMENT_TIME + PROCESSING_TIME)) / MOVEMENT_TIME;
                    const radius = state.targetRadius + (state.startRadius - state.targetRadius) * easeInQuad(moveInProgress);
                    wordGroup.position.normalize().multiplyScalar(radius);
                    
                    // Fade out delle lettere mantenendo la semitrasparenza
                    state.letters.forEach(letter => {
                        letter.material.opacity = (1 - moveInProgress) * 0.5; // Cambiato da 0.8 a 0.5
                    });
                    state.cursor.material.opacity = 0;
                }
            }
        } else {
            state.cursor.visible = false;
        }
    });

    // Aggiorna e rimuovi le linee completate
    activeLines.forEach(line => {
        if (!line.update(time)) {
            line.dispose();
            activeLines.delete(line);
        }
    });
}

// Aggiungi queste funzioni di easing per movimenti più fluidi
function easeOutQuad(t) {
    return t * (2 - t);
}

function easeInQuad(t) {
    return t * t;
}

init();
animate();
window.addEventListener('resize', onWindowResize, false);

// Chiama questa funzione quando vuoi far partire l'animazione di entrata
startEnterAnimation();

// Chiama questa funzione quando vuoi far partire l'animazione di uscita
// startExitAnimation();
