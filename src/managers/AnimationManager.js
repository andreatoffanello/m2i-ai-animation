import * as THREE from 'three';
import { SCENE_ANIMATION_DURATION } from '../constants/animation';
import { easeInBack, easeOutBack } from '../utils/math';

export class AnimationManager {
    constructor() {
        this.isSceneEntering = false;
        this.isSceneExiting = false;
        this.sceneAnimationProgress = 0;
        this.sceneManager = null;
        this.wordManager = null;
    }

    init(sceneManager, wordManager) {
        this.sceneManager = sceneManager;
        this.wordManager = wordManager;
    }

    update() {
        const time = performance.now() * 0.001;

        if (this.isSceneEntering || this.isSceneExiting) {
            this.updateSceneAnimation();
        }

        // Aggiornamenti regolari
        this.sceneManager.updateRotation();
        this.sceneManager.updatePulsation(time);
        this.wordManager.updateWords(time);
    }

    updateSceneAnimation() {
        this.sceneAnimationProgress += 0.016 / SCENE_ANIMATION_DURATION;
        
        if (this.sceneAnimationProgress >= 1.0) {
            if (this.isSceneExiting) {
                this.sceneManager.setVisibility(false);
                this.sceneManager.scene.scale.setScalar(0);
            } else {
                this.sceneManager.scene.scale.setScalar(1);
            }
            
            this.isSceneEntering = false;
            this.isSceneExiting = false;
            return;
        }
        
        const progress = this.isSceneEntering ? 
            easeOutBack(this.sceneAnimationProgress) : 
            1 - easeInBack(this.sceneAnimationProgress);
        
        this.sceneManager.scene.scale.setScalar(progress);
        
        if (this.wordManager) {
            this.wordManager.updateWordsAnimation(progress, this.isSceneEntering);
        }
    }

    startEnterAnimation() {
        this.isSceneEntering = true;
        this.isSceneExiting = false;
        this.sceneAnimationProgress = 0;
        this.sceneManager.setVisibility(true);
        this.sceneManager.scene.scale.setScalar(0);
        
        if (this.wordManager && this.wordManager.isInitialized()) {
            this.wordManager.createTextSphere();
        }
    }

    startExitAnimation() {
        this.isSceneExiting = true;
        this.isSceneEntering = false;
        this.sceneAnimationProgress = 0;
    }

    dispose() {
        this.sceneManager = null;
        this.wordManager = null;
    }
}
