import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SPHERE_RADIUS, PARTICLE_COUNT, PARTICLE_SIZE } from '../constants/scene';
import { PULSE_SPEED, PULSE_AMPLITUDE } from '../constants/animation';
import particleVert from '../shaders/particle.vert?raw';
import particleFrag from '../shaders/particle.frag?raw';
import innerSphereVert from '../shaders/innerSphere.vert?raw';
import innerSphereFrag from '../shaders/innerSphere.frag?raw';
import { loadShader } from '../utils/shaderUtils';
import Scene from '../scene/Scene';
import { GradientIcosahedron } from '../objects/GradientIcosahedron';

export class SceneManager {
    constructor(wordManager) {
        this.wordManager = wordManager;
        this.scene = new Scene(this.wordManager);
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.innerSphere = null;
        this.uniforms = null;
        this.container = null;
        this.renderContainer = null;
        
        this.icosahedron = null;
        
        // Mouse interaction
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = 0;
        this.windowHalfY = 0;
        
        // Aggiungi uniforms per il noise
        this.noiseUniforms = {
            noiseAmplitude: { value: 0.1 },
            noiseFrequency: { value: 1.0 }
        };
    }

    init(container) {
        this.container = container;
        
        // Crea il container interno per il render
        this.renderContainer = document.createElement('div');
        this.renderContainer.style.width = '100%';
        this.renderContainer.style.height = '100%';
        this.renderContainer.style.aspectRatio = '1/1';
        this.container.appendChild(this.renderContainer);
        
        const rect = this.renderContainer.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        this.setupCamera(width, height);
        this.setupRenderer(width, height);
        this.setupMouseControls();
        this.setupParticles();
        this.setupInnerSphere();
        this.setupIcosahedron();
        
        // Nascondi tutto inizialmente
        this.setVisibility(false);
        this.scene.scale.setScalar(0);
        
        this.renderContainer.appendChild(this.renderer.domElement);
    }

    setupCamera(width, height) {
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Forza aspect ratio 1:1
        this.camera.position.z = 5;
        this.windowHalfX = width / 2;
        this.windowHalfY = height / 2;
    }

    setupRenderer(width, height) {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    setupMouseControls() {
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onMouseMove(event) {
        // Calcola la posizione del mouse rispetto al centro della finestra
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        
        this.mouseX = (event.clientX - windowHalfX) / windowHalfX;
        this.mouseY = (event.clientY - windowHalfY) / windowHalfY;
        
        this.targetRotationY = this.mouseX * Math.PI;
        this.targetRotationX = this.mouseY * Math.PI / 2;

        // Calcola la distanza dal centro per l'effetto noise
        const distanceFromCenter = Math.sqrt(this.mouseX * this.mouseX + this.mouseY * this.mouseY);
        
        // Modifica i parametri del noise in base alla distanza
        if (distanceFromCenter < 1) {
            const t = Math.pow(1 - distanceFromCenter, 3);
            
            // Aggiorna i parametri del noise per le particelle
            this.uniforms.noiseFrequency.value = 1.0 + (4.0 - 1.0) * t;
            this.uniforms.noiseAmplitude.value = 0.1 + (0.8 - 0.1) * t;
            
            // Aggiorna i parametri del noise per l'icosaedro
            if (this.icosahedron && this.icosahedron.material.uniforms) {
                this.icosahedron.material.uniforms.noiseFrequency.value = 0.5 + (2.0 - 0.5) * t;
                this.icosahedron.material.uniforms.noiseAmplitude.value = 0.05 + (0.2 - 0.05) * t;
            }
        } else {
            // Ripristina i valori di default
            this.uniforms.noiseFrequency.value = 1.0;
            this.uniforms.noiseAmplitude.value = 0.1;
            
            if (this.icosahedron && this.icosahedron.material.uniforms) {
                this.icosahedron.material.uniforms.noiseFrequency.value = 0.5;
                this.icosahedron.material.uniforms.noiseAmplitude.value = 0.05;
            }
        }
    }

    onMouseLeave() {
        // Ritorna lentamente alla posizione neutrale
        const duration = 1000;
        const startRotationX = this.scene.rotation.x;
        const startRotationY = this.scene.rotation.y;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Funzione di easing
            const easeOutQuad = t => t * (2 - t);
            const eased = easeOutQuad(progress);
            
            this.scene.rotation.x = startRotationX * (1 - eased);
            this.scene.rotation.y = startRotationY * (1 - eased);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateRotation() {
        // Aggiungiamo una leggera interpolazione solo per smussare i movimenti bruschi
        const rotationLerp = 0.3; // Valore alto per un movimento rapido ma leggermente smussato
        
        const deltaX = this.targetRotationX - this.scene.rotation.x;
        const deltaY = this.targetRotationY - this.scene.rotation.y;
        
        this.scene.rotation.x += deltaX * rotationLerp;
        this.scene.rotation.y += deltaY * rotationLerp;
    }

    setupParticles() {
        const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64);
        const positions = geometry.attributes.position.array;
        const normals = geometry.attributes.normal.array;
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
        const particleNormals = new Float32Array(PARTICLE_COUNT * 3);

        const color1 = new THREE.Color("#FBD23D");
        const color2 = new THREE.Color("#3EECFF");
        const color3 = new THREE.Color("#EF6F34");
        const color4 = new THREE.Color("#5C20DD");

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Generazione di punti uniformemente distribuiti sulla sfera
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            
            const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
            const y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
            const z = SPHERE_RADIUS * Math.cos(phi);

            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;

            // Il vettore normale in una sfera è uguale alla posizione normalizzata
            const normal = new THREE.Vector3(x, y, z).normalize();
            particleNormals[i * 3] = normal.x;
            particleNormals[i * 3 + 1] = normal.y;
            particleNormals[i * 3 + 2] = normal.z;

            const color = new THREE.Color().lerpColors(
                color1.clone().lerp(color2, (x + SPHERE_RADIUS) / (2 * SPHERE_RADIUS)),
                color3.clone().lerp(color4, (y + SPHERE_RADIUS) / (2 * SPHERE_RADIUS)),
                (z + SPHERE_RADIUS) / (2 * SPHERE_RADIUS)
            );

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(particleNormals, 3));
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        this.uniforms = {
            time: { value: 1.0 },
            noiseAmplitude: { value: 0.1 },
            noiseFrequency: { value: 1.0 },
            pulseTime: { value: 0.0 },
            particleSize: { value: PARTICLE_SIZE }  // Aggiungiamo questa uniform
        };

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: loadShader(particleVert),
            fragmentShader: loadShader(particleFrag),
            transparent: true,
            vertexColors: true
        });

        this.particles = new THREE.Points(particleGeometry, material);
        this.scene.add(this.particles);
    }

    setupInnerSphere() {
        const geometry = new THREE.SphereGeometry(0.8, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color("#FBD23D") },
                color2: { value: new THREE.Color("#3EECFF") },
                color3: { value: new THREE.Color("#EF6F34") },
                color4: { value: new THREE.Color("#5C20DD") }
            },
            vertexShader: loadShader(innerSphereVert),
            fragmentShader: loadShader(innerSphereFrag),
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        this.innerSphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.innerSphere);
    }

    setupIcosahedron() {
        this.icosahedron = new GradientIcosahedron(2.2, 1);
        this.scene.add(this.icosahedron.mesh);
    }

    updateParticlesScale(progress) {
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const originalPos = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            ).normalize();
            
            const scale = progress * SPHERE_RADIUS;
            
            positions[i] = originalPos.x * scale;
            positions[i + 1] = originalPos.y * scale;
            positions[i + 2] = originalPos.z * scale;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    updateInnerSphereScale(progress) {
        this.innerSphere.scale.setScalar(progress);
        this.innerSphere.material.opacity = progress;
    }

    updatePulsation(time) {
        this.uniforms.time.value = time;
        this.uniforms.pulseTime.value = time * PULSE_SPEED;
        
        this.innerSphere.material.uniforms.time.value = time * PULSE_SPEED;
        const pulseFactor = 1 + Math.sin(time * PULSE_SPEED) * PULSE_AMPLITUDE;
        this.innerSphere.scale.setScalar(pulseFactor);

        if (this.icosahedron) {
            this.icosahedron.update(time);
        }
    }

    onResize(width, height) {
        const containerSize = Math.min(width, height);
        
        this.windowHalfX = containerSize / 2;
        this.windowHalfY = containerSize / 2;
        
        this.camera.aspect = 1; // Mantieni sempre aspect ratio 1:1
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(containerSize, containerSize);
    }

    render() {
        this.updateRotation(); // Aggiorna la rotazione basata sul mouse
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        // Cleanup resources
        this.particles.geometry.dispose();
        this.particles.material.dispose();
        this.innerSphere.geometry.dispose();
        this.innerSphere.material.dispose();
        this.scene.remove(this.particles);
        this.scene.remove(this.innerSphere);
        
        if (this.icosahedron) {
            this.icosahedron.dispose();
            this.scene.remove(this.icosahedron.mesh);
        }
        
        if (this.renderContainer && this.renderContainer.parentNode) {
            this.renderContainer.parentNode.removeChild(this.renderContainer);
        }
        this.renderContainer = null;
        this.container = null;

        // Rimuovi gli event listener dal document
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseleave', this.onMouseLeave);
    }

    setVisibility(visible) {
        if (this.particles) this.particles.visible = visible;
        if (this.innerSphere) this.innerSphere.visible = visible;
        if (this.scene.wordMeshes) {
            this.scene.wordMeshes.forEach(mesh => mesh.visible = visible);
        }
        if (this.icosahedron) {
            this.icosahedron.mesh.visible = visible;
        }
    }
}
