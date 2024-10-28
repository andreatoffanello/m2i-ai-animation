import { SceneManager } from './managers/SceneManager';
import { AnimationManager } from './managers/AnimationManager';
import { WordManager } from './managers/WordManager';
import { TextManager } from './utils/TextManager';

export class AiAnimation {
    constructor(config = {}) {
        const { containerId = 'ai_animation' } = config;
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with id "${containerId}" not found`);
        }

        this.textManager = new TextManager();
        this.wordManager = new WordManager(this.textManager);
        this.sceneManager = new SceneManager(this.wordManager);
        this.animationManager = new AnimationManager();

        this.init();
    }

    async init() {
        this.sceneManager.init(this.container);
        await this.wordManager.init(this.sceneManager.scene);
        this.animationManager.init(this.sceneManager, this.wordManager);
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.animationManager.update();
        this.sceneManager.render();
    }

    startAnimation(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Text parameter is required and must be a string');
        }
        this.wordManager.updateText(text);
        this.animationManager.startEnterAnimation();
    }

    stopAnimation() {
        this.animationManager.startExitAnimation();
    }

    dispose() {
        this.sceneManager.dispose();
        this.animationManager.dispose();
        this.wordManager.dispose();
    }
}

export default AiAnimation; 