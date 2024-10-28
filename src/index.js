import { SceneManager } from './managers/SceneManager';
import { AnimationManager } from './managers/AnimationManager';
import { WordManager } from './managers/WordManager';

class AiAnimation {
    constructor(config = {}) {
        const { containerId = 'ai_animation' } = config;
        
        // Validazione elemento container
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with id "${containerId}" not found`);
        }

        // Inizializzazione managers
        this.sceneManager = new SceneManager();
        this.animationManager = new AnimationManager();
        this.wordManager = new WordManager(''); // Inizializza con stringa vuota

        this.init();
        this.setupEventListeners();
    }

    init() {
        this.sceneManager.init(this.container);
        this.wordManager.init(this.sceneManager.scene);
        this.animationManager.init(
            this.sceneManager, 
            this.wordManager
        );

        this.animate();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.sceneManager.onResize(
                this.container.clientWidth,
                this.container.clientHeight
            );
        });
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

export default AiAnimation;
