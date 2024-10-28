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
                // Se stiamo entrando, manteniamo la scala a 1
                this.sceneManager.scene.scale.setScalar(1);
            }
            
            this.isSceneEntering = false;
            this.isSceneExiting = false;
            return;
        }
        
        // Usa gli easing back per entrambe le animazioni
        const progress = this.isSceneEntering ? 
            easeOutBack(this.sceneAnimationProgress) : 
            1 - easeInBack(this.sceneAnimationProgress);
        
        // Applica lo scale a tutta la scena
        this.sceneManager.scene.scale.setScalar(progress);
    }

    startEnterAnimation() {
        this.isSceneEntering = true;
        this.isSceneExiting = false;
        this.sceneAnimationProgress = 0;
        this.sceneManager.setVisibility(true);
        this.sceneManager.scene.scale.setScalar(0);
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
