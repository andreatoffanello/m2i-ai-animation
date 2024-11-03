import * as THREE from 'three';
import { 
    SPHERE_RADIUS,
    PARTICLE_COUNT
} from '../constants';  // invece di '../constants/scene'

export default class Scene extends THREE.Scene {
    constructor(wordManager) {
        super();
        
        this.clock = new THREE.Clock();
        this.wordManager = wordManager;
        this.wordMeshes = [];
        
        // Impostiamo lo stato iniziale
        this.setInitialState();
    }

    setInitialState() {
        console.log('set initial state');
        this.initialScale = 0;
        this.initialOpacity = 0;
    }

    hideAll() {
        if (this.wordMeshes && this.wordMeshes.length > 0) {
            this.wordMeshes.forEach(mesh => {
                mesh.scale.set(0, 0, 0);
                mesh.visible = false;
            });
        }
    }

    // Semplifichiamo questo metodo rimuovendo la griglia
    updateWordMeshes(meshes) {
        this.wordMeshes = meshes;
    }

    update(deltaTime) {
        // Non c'è più niente da aggiornare qui
    }
} 