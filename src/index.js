import { SceneManager } from './managers/SceneManager';
import { AnimationManager } from './managers/AnimationManager';
import { WordManager } from './managers/WordManager';
import { TextManager } from './utils/TextManager';

class AiAnimation {
    constructor(config = {}) {
        const { containerId = 'ai_animation' } = config;
        
        // Validazione elemento container
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with id "${containerId}" not found`);
        }

        // Creiamo prima il TextManager
        this.textManager = new TextManager();
        
        // Passiamo il TextManager al WordManager
        this.wordManager = new WordManager(this.textManager);
        
        // Passiamo il wordManager allo SceneManager
        this.sceneManager = new SceneManager(this.wordManager);
        this.animationManager = new AnimationManager();

        this.init();
        this.setupEventListeners();
    }

    async init() {
        this.sceneManager.init(this.container);
        
        // Aspettiamo che il font sia caricato
        await this.wordManager.init(this.sceneManager.scene);
        
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
