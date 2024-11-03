import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { DEFAULT_OPTIONS } from '../constants';
import logoVert from '../shaders/logo.vert?raw';
import logoFrag from '../shaders/logo.frag?raw';
import { loadShader } from '../utils/shaderUtils';

export class LogoM {
    constructor(options = {}) {
        const defaultLogoOptions = DEFAULT_OPTIONS.LOGO;
        
        this.options = options;
        this.group = new THREE.Group();
        this.color = new THREE.Color(options.LOGO?.COLOR || defaultLogoOptions.COLOR);
        this.depth = options.LOGO?.DEPTH || defaultLogoOptions.DEPTH;
        this.size = options.LOGO?.SIZE || defaultLogoOptions.SIZE;
        
        this.pulseSpeed = options.LOGO?.PULSE?.SPEED || defaultLogoOptions.PULSE.SPEED;
        this.pulseAmplitude = options.LOGO?.PULSE?.AMPLITUDE || defaultLogoOptions.PULSE.AMPLITUDE;
        this.baseOpacity = options.LOGO?.OPACITY || defaultLogoOptions.OPACITY;
        this.basePulseScale = 1.0;
        
        this.createLogoFromSVG();
    }

    createLogoFromSVG() {
        const svgMarkup = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 479.28 479.28">
                <path id="border" d="M451.28,28v423.28H28V28h423.28M479.28,0H0v479.28h479.28V0h0Z"/>
                <path id="letter" d="M381.52,109.51v260.26h-52.2v-169.28l-69.73,169.28h-39.52l-70.1-169.28v169.28h-52.2V109.51h59.29l82.78,193.52,82.78-193.52h58.91Z"/>
            </svg>
        `;

        const loader = new SVGLoader();
        const svgData = loader.parse(svgMarkup);

        const viewBoxWidth = 479.28;
        const viewBoxHeight = 479.28;
        const scale = this.size / Math.max(viewBoxWidth, viewBoxHeight);

        // Crea shader material
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseOpacity: { value: this.baseOpacity },
                color1: { value: new THREE.Color(this.options.PROCESSING_COLORS?.[0] || '#FBD23D') },
                color2: { value: new THREE.Color(this.options.PROCESSING_COLORS?.[1] || '#3EECFF') },
                color3: { value: new THREE.Color(this.options.PROCESSING_COLORS?.[2] || '#EF6F34') },
                color4: { value: new THREE.Color(this.options.PROCESSING_COLORS?.[3] || '#5C20DD') }
            },
            vertexShader: loadShader(logoVert),
            fragmentShader: loadShader(logoFrag),
            transparent: true,
            side: THREE.DoubleSide
        });

        svgData.paths.forEach((path) => {
            const shapes = SVGLoader.createShapes(path);
            
            shapes.forEach((shape) => {
                const extrudeSettings = {
                    depth: this.depth,
                    bevelEnabled: false,
                    steps: 2,
                    curveSegments: 12
                };

                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                geometry.computeBoundingBox();
                
                const mesh = new THREE.Mesh(geometry, shaderMaterial);
                mesh.scale.set(-scale, -scale, 1);
                
                this.group.add(mesh);
            });
        });

        // Centra il gruppo
        const box = new THREE.Box3().setFromObject(this.group);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        this.group.children.forEach(mesh => {
            mesh.position.x -= center.x;
            mesh.position.y -= center.y;
            mesh.position.z = -this.depth/2;
        });

        this.group.position.set(0, 0, 0);
    }

    update(time) {
        // Aggiorna il tempo nello shader
        this.group.children.forEach(mesh => {
            if (mesh.material.uniforms) {
                mesh.material.uniforms.time.value = time;
                
                // Aggiorna l'opacità con il pulse
                const opacityPulse = this.baseOpacity + Math.sin(time * this.pulseSpeed) * 0.1;
                mesh.material.uniforms.baseOpacity.value = opacityPulse;
            }
        });

        // Applica l'effetto pulse
        const pulseScale = this.basePulseScale + Math.sin(time * this.pulseSpeed) * this.pulseAmplitude;
        this.group.scale.setScalar(pulseScale);
    }

    dispose() {
        this.group.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                object.material.dispose();
            }
        });
    }
} 