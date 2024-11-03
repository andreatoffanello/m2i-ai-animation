import * as THREE from 'three';
import { PROCESSING_COLORS } from '../constants';

export class GradientIcosahedron {
    constructor(radius = 2.2, detail = 1) {
        this.geometry = new THREE.IcosahedronGeometry(radius, detail);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                noiseFrequency: { value: 0.5 },
                noiseAmplitude: { value: 0.05 },
                color1: { value: new THREE.Color(PROCESSING_COLORS[0]) },
                color2: { value: new THREE.Color(PROCESSING_COLORS[1]) },
                color3: { value: new THREE.Color(PROCESSING_COLORS[2]) },
                color4: { value: new THREE.Color(PROCESSING_COLORS[3]) }
            },
            vertexShader: `
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
            `,
            fragmentShader: `
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
            `,
            transparent: true,
            wireframe: true
        });

        // Stampa info sulla geometria in modo sicuro
        console.log('Icosahedron vertices:', this.geometry.attributes.position.count);
        if (this.geometry.index) {
            console.log('Icosahedron faces:', this.geometry.index.count / 3);
        } else {
            console.log('Icosahedron faces:', this.geometry.attributes.position.count / 3);
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        // Aumentiamo significativamente la velocità di rotazione
        this.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.001, // 5 volte più veloce
            y: (Math.random() - 0.5) * 0.002, // 10 volte più veloce
            z: (Math.random() - 0.5) * 0.0015 // 7.5 volte più veloce
        };
        
        // Cambiamo più frequentemente direzione
        this.directionChangeInterval = 3000; // Ridotto da 5000 a 3000ms
        this.lastDirectionChange = 0;

        // Aggiungiamo un fattore di accelerazione casuale
        this.accelerationFactor = {
            x: 1 + Math.random() * 0.5,
            y: 1 + Math.random() * 0.5,
            z: 1 + Math.random() * 0.5
        };

        // Imposta la scala iniziale
        this.mesh.scale.setScalar(1);
    }

    update(time) {
        // Aggiorna il tempo nello shader
        this.material.uniforms.time.value = time;

        // Cambia direzione periodicamente
        if (time - this.lastDirectionChange > this.directionChangeInterval) {
            this.targetRotation = {
                x: Math.random() * Math.PI * 4, // Raddoppiato il range di rotazione
                y: Math.random() * Math.PI * 4,
                z: Math.random() * Math.PI * 4
            };
            
            // Aggiorna casualmente i fattori di accelerazione
            this.accelerationFactor = {
                x: 1 + Math.random() * 0.5,
                y: 1 + Math.random() * 0.5,
                z: 1 + Math.random() * 0.5
            };
            
            this.lastDirectionChange = time;
        }

        // Rotazione con accelerazione variabile
        this.mesh.rotation.x += this.rotationSpeed.x * this.accelerationFactor.x;
        this.mesh.rotation.y += this.rotationSpeed.y * this.accelerationFactor.y;
        this.mesh.rotation.z += this.rotationSpeed.z * this.accelerationFactor.z;
    }

    dispose() {
        if (this.geometry) {
            this.geometry.dispose();
        }
        if (this.material) {
            this.material.dispose();
        }
    }
} 