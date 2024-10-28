import * as THREE from 'three';
import { ShaderMaterial, BufferGeometry, Line, Vector3, BufferAttribute, DoubleSide } from 'three';
import flowVertexShader from '../shaders/flowLine.vert';
import flowFragmentShader from '../shaders/flowLine.frag';

export class FlowingGrid {
    constructor(words) {
        this.words = words;
        this.geometry = new BufferGeometry();
        this.material = new ShaderMaterial({
            vertexShader: flowVertexShader,
            fragmentShader: flowFragmentShader,
            transparent: true,
            side: DoubleSide,
            uniforms: {
                time: { value: 0 },
                opacity: { value: 1.0 },
                color1: { value: new THREE.Color("#FBD23D") },
                color2: { value: new THREE.Color("#3EECFF") },
                color3: { value: new THREE.Color("#EF6F34") },
                color4: { value: new THREE.Color("#5C20DD") }
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true
        });

        this.createGridGeometry(words);
        this.mesh = new Line(this.geometry, this.material);
        this.mesh.frustumCulled = false;
    }

    createGridGeometry(words) {
        const points = [];
        
        words.forEach((word, i) => {
            const nearestWords = words
                .map((otherWord, j) => ({
                    index: j,
                    distance: i !== j ? word.position.distanceTo(otherWord.position) : Infinity
                }))
                .sort((a, b) => a.distance - b.distance)
                .slice(1, 4);
            
            nearestWords.forEach(({ index }) => {
                points.push(word.position.clone());
                points.push(words[index].position.clone());
            });
        });

        const positions = new Float32Array(points.length * 3);
        points.forEach((point, i) => {
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
        });

        this.geometry.setAttribute('position', new BufferAttribute(positions, 3));
    }

    update(time) {
        const positions = this.geometry.attributes.position.array;
        let vertexIndex = 0;
        
        this.words.forEach((word, i) => {
            const nearestWords = this.words
                .map((otherWord, j) => ({
                    index: j,
                    distance: i !== j ? word.position.distanceTo(otherWord.position) : Infinity
                }))
                .sort((a, b) => a.distance - b.distance)
                .slice(1, 4);
            
            nearestWords.forEach(({ index }) => {
                positions[vertexIndex] = word.position.x;
                positions[vertexIndex + 1] = word.position.y;
                positions[vertexIndex + 2] = word.position.z;
                vertexIndex += 3;
                
                const targetWord = this.words[index];
                positions[vertexIndex] = targetWord.position.x;
                positions[vertexIndex + 1] = targetWord.position.y;
                positions[vertexIndex + 2] = targetWord.position.z;
                vertexIndex += 3;
            });
        });

        this.geometry.attributes.position.needsUpdate = true;
        
        if (this.material.uniforms) {
            this.material.uniforms.time.value = time;
        }
    }

    dispose() {
        if (this.geometry) {
            this.geometry.dispose();
        }
        if (this.material) {
            this.material.dispose();
        }
        this.geometry = null;
        this.material = null;
        this.mesh = null;
    }
} 