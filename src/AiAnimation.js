import { SceneManager } from './managers/SceneManager';
import { AnimationManager } from './managers/AnimationManager';
import { WordManager } from './managers/WordManager';
import { TextManager } from './utils/TextManager';
import { createOptions } from './constants';

export class AiAnimation {
    constructor(config = {}) {
        console.log('AiAnimation constructor started', config);
        
        const { containerId = 'ai_animation', options = {}, onInitialized } = config;
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with id "${containerId}" not found`);
        }
        console.log('Container found:', this.container);

        this.options = createOptions(options);
        this.onInitialized = onInitialized;
        console.log('Options initialized:', this.options);

        this.textManager = new TextManager(this.options);
        this.wordManager = new WordManager(this.textManager, this.options);
        this.sceneManager = new SceneManager(this.wordManager, this.options);
        this.animationManager = new AnimationManager(this.options);
        console.log('Managers created');

        // Avvia l'inizializzazione immediatamente
        this.init();
    }

    async init() {
        console.log('Starting initialization...');
        
        try {
            // Inizializza la scena
            console.log('Initializing scene...');
            this.sceneManager.init(this.container);
            console.log('Scene initialized');

            // Inizializza il word manager
            console.log('Initializing word manager...');
            await this.wordManager.init(this.sceneManager.scene);
            console.log('Word manager initialized');

            // Inizializza l'animation manager
            console.log('Initializing animation manager...');
            this.animationManager.init(this.sceneManager, this.wordManager);
            console.log('Animation manager initialized');

            // Avvia il loop di animazione
            this.animate();
            console.log('Animation loop started');

            // Chiamiamo il callback quando tutto è pronto
            if (this.onInitialized) {
                console.log('Calling onInitialized callback');
                this.onInitialized();
            }
        } catch (error) {
            console.error('Initialization error:', error);
            throw error; // Rilanciamo l'errore per gestirlo esternamente se necessario
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.animationManager.update();
        this.sceneManager.render();
    }

    startAnimation(text) {
        console.log('Starting animation with text:', text);
        if (!text || typeof text !== 'string') {
            throw new Error('Text parameter is required and must be a string');
        }
        this.wordManager.updateText(text);
        this.animationManager.startEnterAnimation();
    }

    stopAnimation() {
        console.log('Stopping animation');
        this.animationManager.startExitAnimation();
    }

    dispose() {
        this.sceneManager.dispose();
        this.animationManager.dispose();
        this.wordManager.dispose();
    }
}

export default AiAnimation; 