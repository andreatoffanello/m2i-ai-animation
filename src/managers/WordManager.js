import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TEXT_SPHERE_RADIUS, TEXT_MIN_RADIUS } from '../constants/scene';
import { PULSE_SPEED, MOVEMENT_TIME, PROCESSING_TIME, TOTAL_ANIMATION_TIME } from '../constants/animation';
import { AnimatedLine } from '../classes/AnimatedLine';

export class WordManager {
    constructor(text) {
        this.text = text;
        this.scene = null;
        this.wordMeshes = [];
        this.wordStates = new Map();
        this.activeWords = new Set();
        this.activeLines = new Set();
        this.font = null;
        
        // Costanti per l'animazione delle parole
        this.MAX_ACTIVE_WORDS = 20;
        this.PROCESSING_COLORS = [
            new THREE.Color("#FBD23D"), // giallo
            new THREE.Color("#3EECFF"), // azzurro
            new THREE.Color("#EF6F34"), // arancione
            new THREE.Color("#5C20DD")  // viola
        ];
    }

    init(scene) {
        this.scene = scene;
        this.loadFont().then(() => {
            this.createTextSphere();
        });
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

    createCursor() {
        const cursorGeometry = new TextGeometry('_', {
            font: this.font,
            size: 0.08,
            height: 0.01
        });
        
        const cursorMaterial = new THREE.MeshBasicMaterial({ 
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        });
        
        const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
        cursor.renderOrder = 999;
        return cursor;
    }

    getRandomSpherePosition() {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        return { phi, theta };
    }

    createTextSphere() {
        // Pulisci prima eventuali parole esistenti
        this.wordMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        this.wordMeshes = [];
        this.wordStates.clear();
        
        // Filtra e prepara le parole
        let words = this.text.split(' ')
            .filter(word => word.length > 4)
            .map(word => word.trim())
            .filter(word => word); // rimuove stringhe vuote
        
        // Se non ci sono parole valide, usa un placeholder
        if (words.length === 0) {
            words = ['placeholder'];
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
                
                // Crea le lettere
                letters.forEach((letter) => {
                    const letterGeometry = new TextGeometry(letter, {
                        font: this.font,
                        size: 0.2,
                        height: 0.01
                    });
                    
                    const letterMaterial = new THREE.MeshBasicMaterial({ 
                        color: new THREE.Color(0x3EECFF),
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
                
                // Aggiungi il cursore
                const cursor = this.createCursor();
                wordGroup.add(cursor);
                
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
                    startRadius: TEXT_MIN_RADIUS,
                    targetRadius: TEXT_SPHERE_RADIUS,
                    letters: letterMeshes,
                    cursor: cursor,
                    processingColor: this.PROCESSING_COLORS[
                        Math.floor(Math.random() * this.PROCESSING_COLORS.length)
                    ],
                    originalColor: new THREE.Color(0x3EECFF),
                    initialLettersShown: 3,
                    originalPosition: randomPos,
                    hasCreatedLine: false,
                    isOnSurface: false
                });
                
                this.wordMeshes.push(wordGroup);
                this.scene.add(wordGroup);
            } catch (error) {
                console.warn(`Failed to create word mesh for "${word}"`, error);
            }
        });
    }

    updateWords(time) {
        // Attiva nuove parole se possibile
        if (this.activeWords.size < this.MAX_ACTIVE_WORDS) {
            this.wordMeshes.forEach(mesh => {
                const state = this.wordStates.get(mesh);
                if (!state.active && Math.random() < 0.01 && 
                    this.activeWords.size < this.MAX_ACTIVE_WORDS) {
                    this.activateWord(mesh, state);
                }
            });
        }

        // Aggiorna le parole attive
        this.activeWords.forEach(wordGroup => {
            const state = this.wordStates.get(wordGroup);
            if (state.active) {
                this.updateWordAnimation(wordGroup, state, time);
            }
        });

        // Aggiorna e rimuovi le linee completate
        this.activeLines.forEach(line => {
            if (!line.update(time)) {
                line.dispose();
                this.activeLines.delete(line);
            }
        });
    }

    updateWordAnimation(wordGroup, state, time) {
        state.progress += 0.016 / TOTAL_ANIMATION_TIME;

        if (state.progress >= 1.0) {
            this.deactivateWord(wordGroup, state);
        } else {
            const totalProgress = state.progress * TOTAL_ANIMATION_TIME;
            
            if (totalProgress < MOVEMENT_TIME) {
                this.handleMovementPhase(wordGroup, state, totalProgress, time);
            } 
            else if (totalProgress < MOVEMENT_TIME + PROCESSING_TIME) {
                this.handleProcessingPhase(wordGroup, state, totalProgress, time);
            }
            else {
                this.handleReturnPhase(wordGroup, state, totalProgress);
            }
        }
    }

    updateWordsAnimation(progress, isEntering) {
        this.wordMeshes.forEach((mesh, index) => {
            const delay = index * 0.1;
            const wordProgress = Math.max(0, Math.min(1, (progress - delay) * 2));
            
            if (isEntering) {
                mesh.position.normalize().multiplyScalar(wordProgress * TEXT_SPHERE_RADIUS);
            } else {
                mesh.position.normalize().multiplyScalar((1 - wordProgress) * TEXT_SPHERE_RADIUS);
            }
            
            const state = this.wordStates.get(mesh);
            state.letters.forEach(letter => {
                letter.material.opacity = wordProgress * 0.5;
            });
        });
    }

    updateText(newText) {
        // Rimuovi tutte le parole e le linee esistenti
        this.wordMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        
        this.activeLines.forEach(line => {
            line.dispose();
            this.scene.remove(line.line);
        });
        
        // Pulisci le strutture dati
        this.wordMeshes = [];
        this.wordStates.clear();
        this.activeWords.clear();
        this.activeLines.clear();
        
        // Imposta il nuovo testo e ricrea la sfera di testo
        this.text = newText;
        this.createTextSphere();
    }

    dispose() {
        // Rimuovi e pulisci tutte le parole
        this.wordMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            mesh.clear(); // Rimuove tutti i figli
        });
        
        // Rimuovi e pulisci tutte le linee
        this.activeLines.forEach(line => {
            line.dispose();
            this.scene.remove(line.line);
        });
        
        // Pulisci le strutture dati
        this.wordMeshes = [];
        this.wordStates.clear();
        this.activeWords.clear();
        this.activeLines.clear();
        
        // Pulisci i riferimenti
        this.scene = null;
        this.font = null;
        
        // Rimuovi eventuali event listeners se presenti
        // (nel caso ne aggiungessimo in futuro)
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    handleMovementPhase(wordGroup, state, totalProgress, time) {
        const moveOutProgress = totalProgress / MOVEMENT_TIME;
        const radius = state.startRadius + 
            (state.targetRadius - state.startRadius) * this.easeOutQuad(moveOutProgress);
        
        wordGroup.position.setFromSphericalCoords(
            radius,
            state.originalPosition.theta,
            state.originalPosition.phi
        );
        wordGroup.lookAt(0, 0, 0);
        wordGroup.rotateY(Math.PI);
        
        // Mostra le prime lettere con semitrasparenza
        state.letters.forEach((letter, index) => {
            if (index < state.initialLettersShown) {
                letter.material.opacity = 0.5;
                letter.material.color = state.processingColor;
            } else {
                letter.material.opacity = 0;
            }
        });
        
        // Posiziona e mostra il cursore
        const lastVisibleLetter = state.letters[state.initialLettersShown - 1];
        state.cursor.position.x = lastVisibleLetter.position.x + 0.08;
        state.cursor.material.opacity = Math.sin(time * 15) * 0.5 + 0.5;
        state.cursor.material.color = state.processingColor;
    }

    handleProcessingPhase(wordGroup, state, totalProgress, time) {
        const processingProgress = (totalProgress - MOVEMENT_TIME) / PROCESSING_TIME;
        wordGroup.position.normalize().multiplyScalar(state.targetRadius);
        
        state.isOnSurface = true;
        
        const remainingLetters = state.letters.length - state.initialLettersShown;
        const currentLetterIndex = Math.floor(processingProgress * remainingLetters) + 
            state.initialLettersShown;
        
        state.letters.forEach((letter, index) => {
            if (index <= currentLetterIndex) {
                letter.material.opacity = 0.5;
                letter.material.color = state.processingColor;
            } else {
                letter.material.opacity = 0;
            }
        });
        
        if (currentLetterIndex < state.letters.length) {
            const currentLetter = state.letters[currentLetterIndex];
            state.cursor.position.x = currentLetter.position.x + 0.08;
            state.cursor.material.opacity = Math.sin(time * 15) * 0.5 + 0.5;
            state.cursor.visible = true;
        } else {
            state.cursor.visible = false;
        }
        
        this.tryCreateLine(wordGroup, state, processingProgress);
    }

    handleReturnPhase(wordGroup, state, totalProgress) {
        const moveInProgress = (totalProgress - (MOVEMENT_TIME + PROCESSING_TIME)) / MOVEMENT_TIME;
        const radius = state.targetRadius + 
            (state.startRadius - state.targetRadius) * this.easeInQuad(moveInProgress);
        
        wordGroup.position.normalize().multiplyScalar(radius);
        
        state.letters.forEach(letter => {
            letter.material.opacity = (1 - moveInProgress) * 0.5;
        });
        state.cursor.material.opacity = 0;
    }

    tryCreateLine(wordGroup, state, processingProgress) {
        if (!state.hasCreatedLine && 
            processingProgress > 0.2 && 
            Math.random() < 0.1 && 
            this.activeWords.size > 1) {
            
            let availableTargets = Array.from(this.activeWords).filter(w => {
                const targetState = this.wordStates.get(w);
                return w !== wordGroup && 
                       targetState.isOnSurface && 
                       targetState.progress * TOTAL_ANIMATION_TIME > MOVEMENT_TIME;
            });

            if (availableTargets.length > 0) {
                const targetWord = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                const startColor = this.PROCESSING_COLORS[
                    Math.floor(Math.random() * this.PROCESSING_COLORS.length)
                ];
                const endColor = this.PROCESSING_COLORS[
                    Math.floor(Math.random() * this.PROCESSING_COLORS.length)
                ];
                
                const newLine = new AnimatedLine(wordGroup, targetWord, startColor, endColor);
                this.activeLines.add(newLine);
                state.hasCreatedLine = true;
            }
        }
    }

    activateWord(mesh, state) {
        state.active = true;
        state.progress = 0;
        state.hasCreatedLine = false;
        
        const newPos = this.getRandomSpherePosition();
        state.originalPosition = {
            phi: newPos.phi,
            theta: newPos.theta
        };
        
        mesh.position.setFromSphericalCoords(
            TEXT_MIN_RADIUS,
            newPos.theta,
            newPos.phi
        );
        mesh.lookAt(0, 0, 0);
        mesh.rotateY(Math.PI);
        
        this.activeWords.add(mesh);
    }

    deactivateWord(wordGroup, state) {
        state.active = false;
        state.progress = 0;
        state.isOnSurface = false;
        this.activeWords.delete(wordGroup);
        
        wordGroup.children.forEach(letter => {
            if (letter.material) {
                letter.material.opacity = 0;
            }
        });
        state.cursor.material.opacity = 0;
        wordGroup.position.setLength(TEXT_MIN_RADIUS);
    }

    easeInQuad(t) {
        return t * t;
    }

    easeOutQuad(t) {
        return t * (2 - t);
    }
}
