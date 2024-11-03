import { SceneManager } from './managers/SceneManager';
import { AnimationManager } from './managers/AnimationManager';
import { WordManager } from './managers/WordManager';
import { TextManager } from './utils/TextManager';

export default class AiAnimation {
    constructor({ containerId, onInitialized }) {

        this.container = document.getElementById(containerId);
        this.textManager = new TextManager();
        this.wordManager = new WordManager(this.textManager);
        this.sceneManager = new SceneManager(this.wordManager);
        this.animationManager = new AnimationManager(this.sceneManager);

        // Inizializza tutto in modo asincrono
        Promise.all([
            this.wordManager.init(this.sceneManager.scene)
        ]).then(() => {
            this.sceneManager.init(this.container);
            this.setupAnimation();

            // Chiama il callback quando tutto è pronto
            if (onInitialized) onInitialized();
        });
    }


    setupAnimation() {
        this.animationManager.init(
            this.sceneManager, 
            this.wordManager
        );

        this.animate();
    }


    animate = () => {
        requestAnimationFrame(this.animate);
        this.animationManager.update();
        this.sceneManager.render();
    }


    startEnterAnimation(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Text parameter is required and must be a string');
        }

        this.wordManager.updateText(text);
        this.animationManager.startEnterAnimation();

    }


    startExitAnimation() {
        this.animationManager.startExitAnimation();
    }


    dispose() {
        this.sceneManager.dispose();
        this.animationManager.dispose();
        this.wordManager.dispose();
        window.removeEventListener('resize', this.handleResize);
    }

}


