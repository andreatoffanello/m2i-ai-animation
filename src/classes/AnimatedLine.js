import * as THREE from 'three';

export class AnimatedLine {
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
                    
                    gl_FragColor = vec4(color, appearOpacity * fadeOpacity * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true,
            side: THREE.DoubleSide
        });

        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.line.renderOrder = 1;
        this.startWord = startWord;
        this.endWord = endWord;
        this.startTime = performance.now() * 0.001;
        this.duration = 0.5; // durata dell'animazione in secondi
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
        if (this.line.parent) {
            this.line.parent.remove(this.line);
        }
        this.line.geometry.dispose();
        this.line.material.dispose();
    }
}
