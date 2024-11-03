import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { 
    TEXT_SPHERE_RADIUS, 
    TEXT_MIN_RADIUS,
    PROCESSING_COLORS,
    WORD_ANIMATION,
    MAX_ACTIVE_WORDS,
    WORD_DELAY,
    PULSE_SPEED, 
    MOVEMENT_TIME, 
    PROCESSING_TIME, 
    TOTAL_ANIMATION_TIME 
} from '../constants';

export class WordManager {
    constructor(textManager) {
        if (!textManager) {
            throw new Error('TextManager is required');
        }
        this.textManager = textManager;
        this.text = '';
        this.scene = null;
        this.wordMeshes = [];
        this.wordStates = new Map();
        this.activeWords = new Set();
        this.font = null;
        
        // Usa le costanti importate
        this.MAX_ACTIVE_WORDS = MAX_ACTIVE_WORDS;
        this.PROCESSING_COLORS = PROCESSING_COLORS;
        this._isInitialized = false;

        // Usa la costante WORD_ANIMATION importata
        this.WORD_ANIMATION = WORD_ANIMATION;

        this.words = [];
        this.activeWords = [];
        this.currentIndex = 0;
        this.isAnimating = false;
        this.delayBetweenWords = WORD_DELAY;
    }

    init(scene) {
        console.log('WordManager init');
        this.scene = scene;
        return this.loadFont().then(() => {
            console.log('Font loaded');
            this._isInitialized = true;
        });
    }

    isInitialized() {
        return this._isInitialized;
    }

    getWords() {
        console.log('WordManager getting words');
        return this.textManager.getText();
    }

    async loadFont() {
        const loader = new FontLoader();
        return new Promise((resolve) => {
            loader.load('https://threejs.org/examples/fonts/droid/droid_sans_mono_regular.typeface.json', 
                font => {
                    this.font = font;
                    resolve();
                }
            );
        });
    }

    update(time) {
        // Aggiorna le parole attive
        if (this.wordMeshes && this.wordMeshes.length > 0) {
            this.updateWords(time);
        }
    }

    updateWords(time) {
        // Attiva nuove parole solo se non abbiamo raggiunto il massimo
        if (this.activeWords.size < this.MAX_ACTIVE_WORDS) {
            this.wordMeshes.forEach(mesh => {
                const state = this.wordStates.get(mesh);
                if (!state.active && Math.random() < 0.01) {
                    this.activateWord(mesh);
                }
            });
        }

        // Aggiorna le parole attive
        this.activeWords.forEach(word => {
            const state = this.wordStates.get(word);
            if (state.active) {
                this.updateWordAnimation(word, state, time);
            }
        });
    }

    updateWordAnimation(word, state, time) {
        const totalDuration = this.WORD_ANIMATION.MOVE_OUT_DURATION + 
                            this.WORD_ANIMATION.SURFACE_DURATION + 
                            this.WORD_ANIMATION.MOVE_IN_DURATION;
        
        state.progress += 0.016;
        const progress = state.progress;

        if (progress >= totalDuration) {
            this.deactivateWord(word, state);
            return;
        }

        // Fase 1: Movimento verso l'esterno
        if (progress < this.WORD_ANIMATION.MOVE_OUT_DURATION) {
            const p = progress / this.WORD_ANIMATION.MOVE_OUT_DURATION;
            const eased = this.easeOutBack(p);
            const radius = TEXT_MIN_RADIUS + (TEXT_SPHERE_RADIUS - TEXT_MIN_RADIUS) * eased;
            
            word.position.setFromSphericalCoords(
                radius,
                state.originalPosition.theta,
                state.originalPosition.phi
            );
            word.scale.setScalar(eased);
            
            // Mostra gradualmente le prime lettere
            const initialLettersCount = Math.floor(state.letters.length * 0.3);
            state.letters.forEach((letter, i) => {
                if (i < initialLettersCount) {
                    letter.material.opacity = eased * 0.5;
                } else {
                    letter.material.opacity = 0;
                }
            });
        }
        // Fase 2: Sulla superficie
        else if (progress < this.WORD_ANIMATION.MOVE_OUT_DURATION + this.WORD_ANIMATION.SURFACE_DURATION) {
            const surfaceProgress = (progress - this.WORD_ANIMATION.MOVE_OUT_DURATION) / 
                                  this.WORD_ANIMATION.SURFACE_DURATION;
            
            // Animazione di digitazione
            const typedLetters = Math.floor(surfaceProgress * state.letters.length);
            state.letters.forEach((letter, i) => {
                if (i <= typedLetters) {
                    letter.material.opacity = 0.75;
                } else {
                    letter.material.opacity = 0;
                }
            });
        }
        // Fase 3: Ritorno al centro
        else {
            const moveInProgress = (progress - (this.WORD_ANIMATION.MOVE_OUT_DURATION + 
                                  this.WORD_ANIMATION.SURFACE_DURATION)) / 
                                  this.WORD_ANIMATION.MOVE_IN_DURATION;
            const eased = this.easeInBack(moveInProgress);
            const radius = TEXT_SPHERE_RADIUS - (TEXT_SPHERE_RADIUS - TEXT_MIN_RADIUS) * eased;
            
            word.position.setFromSphericalCoords(
                radius,
                state.originalPosition.theta,
                state.originalPosition.phi
            );
            
            // Fade out di tutte le lettere
            state.letters.forEach(letter => {
                letter.material.opacity = 0.5 * (1 - eased);
            });
        }

        word.lookAt(0, 0, 0);
        word.rotateY(Math.PI);
    }

    activateWord(mesh) {
        const state = this.wordStates.get(mesh);
        state.active = true;
        state.progress = 0;
        
        // Reset della posizione iniziale
        mesh.position.setFromSphericalCoords(
            TEXT_MIN_RADIUS,
            state.originalPosition.theta,
            state.originalPosition.phi
        );
        mesh.scale.set(0, 0, 0);
        
        this.activeWords.add(mesh);
    }

    deactivateWord(word, state) {
        state.active = false;
        state.progress = 0;
        this.activeWords.delete(word);
        
        // Nascondi tutte le lettere
        state.letters.forEach(letter => {
            letter.material.opacity = 0;
        });
        
        // Resetta la posizione
        word.position.setFromSphericalCoords(
            TEXT_MIN_RADIUS,
            state.originalPosition.theta,
            state.originalPosition.phi
        );
        word.scale.set(0, 0, 0);
    }

    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    easeInBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
    }

    updateText(text) {
        console.log('Updating text:', text);
        this.text = text;
        
        // Rimuovi le parole esistenti
        if (this.wordMeshes && this.wordMeshes.length > 0) {
            this.wordMeshes.forEach(mesh => {
                if (this.scene) {
                    this.scene.remove(mesh);
                }
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(mat => mat.dispose());
                    } else {
                        mesh.material.dispose();
                    }
                }
            });
        }

        // Pulisci le strutture dati
        this.wordMeshes = [];
        this.wordStates.clear();
        this.activeWords = new Set();

        // Ricrea la sfera di testo
        if (this._isInitialized && this.scene) {
            this.createTextSphere();
        }
    }

    createTextSphere() {
        // Filtra e prepara le parole
        let words = this.text.split(' ')
            .filter(word => word.length > 4)
            .map(word => word.trim())
            .filter(word => word);
        
        // Se non ci sono parole valide, usa un placeholder
        if (words.length === 0) {
            words = this.textManager.getText();
        }
        
        // Crea l'array di 200 parole
        const targetWordCount = 200;
        const finalWords = [];
        while (finalWords.length < targetWordCount) {
            const remainingCount = targetWordCount - finalWords.length;
            const wordsToAdd = words.slice(0, Math.min(words.length, remainingCount));
            finalWords.push(...wordsToAdd);
        }
        
        // Mischia le parole
        this.shuffleArray(finalWords);
        
        // Crea le mesh per ogni parola
        finalWords.forEach((word, index) => {
            try {
                const letters = word.split('');
                const letterMeshes = [];
                let totalWidth = 0;
                
                const wordGroup = new THREE.Group();
                
                // Scegli un colore random dalla palette
                const randomColor = new THREE.Color(
                    PROCESSING_COLORS[Math.floor(Math.random() * PROCESSING_COLORS.length)]
                );
                
                // Crea le lettere
                letters.forEach((letter) => {
                    const letterGeometry = new TextGeometry(letter, {
                        font: this.font,
                        size: 0.3,
                        height: 0.01
                    });
                    
                    const letterMaterial = new THREE.MeshBasicMaterial({ 
                        color: randomColor,  // Usa il colore random
                        transparent: true,
                        opacity: 0.0
                    });
                    
                    const letterMesh = new THREE.Mesh(letterGeometry, letterMaterial);
                    
                    letterGeometry.computeBoundingBox();
                    const letterWidth = letterGeometry.boundingBox.max.x - letterGeometry.boundingBox.min.x;
                    
                    letterMesh.position.x = totalWidth;
                    totalWidth += letterWidth * 1.1;
                    
                    letterMeshes.push(letterMesh);
                    wordGroup.add(letterMesh);
                });
                
                // Centra il gruppo
                wordGroup.children.forEach(letter => {
                    letter.position.x -= totalWidth / 2;
                });
                
                const randomPos = this.getRandomSpherePosition();
                wordGroup.position.setFromSphericalCoords(
                    TEXT_MIN_RADIUS,
                    randomPos.theta,
                    randomPos.phi
                );
                
                wordGroup.lookAt(0, 0, 0);
                wordGroup.rotateY(Math.PI);
                
                this.wordStates.set(wordGroup, {
                    active: false,
                    progress: 0,
                    letters: letterMeshes,
                    originalPosition: randomPos,
                    hasCreatedLine: false,
                    isOnSurface: false
                });
                
                this.wordMeshes.push(wordGroup);
                if (this.scene) {
                    this.scene.add(wordGroup);
                }
            } catch (error) {
                console.warn(`Failed to create word mesh for "${word}"`, error);
            }
        });

        // Dopo aver creato tutte le mesh
        if (this.scene) {
            this.scene.updateWordMeshes(this.wordMeshes);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getRandomSpherePosition() {
        // Usiamo la spirale di Fibonacci per una distribuzione più uniforme
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const i = this.wordMeshes.length; // Usa l'indice corrente
        const n = 200; // Numero totale di punti desiderati
        
        // Calcola la posizione sulla spirale
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / n);
        
        // Aggiungi una piccola variazione casuale per evitare un pattern troppo regolare
        const randomOffset = 0.1; // Ridotto da quello che era prima
        const thetaOffset = (Math.random() - 0.5) * randomOffset;
        const phiOffset = (Math.random() - 0.5) * randomOffset;
        
        // Applica l'offset mantenendo i limiti validi
        const finalTheta = (theta + thetaOffset) % (2 * Math.PI);
        const finalPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + phiOffset));
        
        // Aggiungi una rotazione casuale iniziale per variare il pattern
        const initialRotation = Math.random() * Math.PI * 2;
        
        return {
            theta: finalTheta + initialRotation,
            phi: finalPhi
        };
    }

    updateWordsAnimation(progress, isEntering) {
        if (!this.wordMeshes || this.wordMeshes.length === 0) return;

        // Se stiamo entrando, attiviamo gradualmente le parole
        if (isEntering && progress > 0.5 && this.activeWords.size === 0) {
            // Attiva alcune parole iniziali
            const initialWords = Math.floor(this.MAX_ACTIVE_WORDS * 0.5);
            let activated = 0;
            
            this.wordMeshes.forEach(mesh => {
                if (activated < initialWords && Math.random() < 0.5) {
                    this.activateWord(mesh);
                    activated++;
                }
            });
        }

        // Se stiamo uscendo, disattiviamo tutte le parole
        if (!isEntering && progress < 0.5) {
            this.activeWords.forEach(word => {
                const state = this.wordStates.get(word);
                if (state) {
                    this.deactivateWord(word, state);
                }
            });
        }

        // Aggiorna la visibilità globale
        this.wordMeshes.forEach(mesh => {
            if (!this.activeWords.has(mesh)) {
                mesh.visible = isEntering;
                mesh.scale.setScalar(0);
                const state = this.wordStates.get(mesh);
                if (state) {
                    state.letters.forEach(letter => {
                        letter.material.opacity = 0;
                    });
                }
            }
        });
    }

    processText(text) {
        // ... codice esistente ...
    }

    activateNextWordGroup() {
        if (this.currentIndex >= this.words.length || this.isAnimating) {
            return false;
        }

        this.isAnimating = true;
        const currentWord = this.words[this.currentIndex];
        this.activeWords.add(currentWord);

        // Attiva le parole successive che sono nella stessa posizione Y
        const currentY = currentWord.position.y;
        let groupWords = [currentWord];
        let nextIndex = this.currentIndex + 1;

        while (nextIndex < this.words.length && 
               Math.abs(this.words[nextIndex].position.y - currentY) < 0.1) {
            groupWords.push(this.words[nextIndex]);
            this.activeWords.add(this.words[nextIndex]);
            nextIndex++;
        }

        // Anima ogni parola con un delay progressivo
        groupWords.forEach((word, index) => {
            setTimeout(() => {
                word.activate();
                
                // Se è l'ultima parola del gruppo, sblocca l'animazione
                if (index === groupWords.length - 1) {
                    this.isAnimating = false;
                }
            }, index * this.delayBetweenWords);
        });

        this.currentIndex = nextIndex;
        return true;
    }

    dispose() {
        if (this.wordMeshes) {
            this.wordMeshes.forEach(mesh => {
                if (this.scene) {
                    this.scene.remove(mesh);
                }
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(mat => mat.dispose());
                    } else {
                        mesh.material.dispose();
                    }
                }
            });
        }
    }
}
