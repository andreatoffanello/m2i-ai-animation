import { Color } from 'three';

// Definiamo tutte le costanti in un oggetto
export const DEFAULT_OPTIONS = {
    // Animation timing constants
    SCENE_ANIMATION_DURATION: 2.0,    // Durata dell'animazione di entrata/uscita della scena completa (in secondi)
    MOVEMENT_TIME: 0.6,               // Tempo impiegato per il movimento delle parole (in secondi)
    PROCESSING_TIME: 2.5,             // Durata della fase di elaborazione/stasi (in secondi)
    PULSE_SPEED: 2.0,                 // Velocità della pulsazione della sfera interna (più alto = più veloce)
    PULSE_AMPLITUDE: 0.1,             // Ampiezza della pulsazione (quanto grande diventa la sfera durante la pulsazione)

    // Scene geometry constants
    PARTICLE_SIZE: 0.005,             // Dimensione delle singole particelle nella sfera esterna
    PARTICLE_COUNT: 30000,            // Numero totale di particelle nella sfera esterna
    SPHERE_RADIUS: 2.0,               // Raggio della sfera di particelle
    TEXT_SPHERE_RADIUS: 2.3,          // Raggio della sfera dove appaiono le parole
    TEXT_MIN_RADIUS: 0.1,             // Raggio minimo quando le parole sono al centro

    // Color palette
    PROCESSING_COLORS: [
        "#FBD23D",                    // Giallo - Colore primario per le particelle e il testo
        "#3EECFF",                    // Azzurro - Colore secondario
        "#EF6F34",                    // Arancione - Colore terziario
        "#5C20DD"                     // Viola - Colore quaternario
    ],
    DEFAULT_TEXT_COLOR: "#3EECFF",    // Colore di default per il testo

    // Word animation timing
    WORD_ANIMATION: {
        MOVE_OUT_DURATION: 1.0,       // Tempo per l'animazione dal centro alla superficie (in secondi)
        SURFACE_DURATION: 2.0,        // Tempo di permanenza sulla superficie (in secondi)
        MOVE_IN_DURATION: 1.0,        // Tempo per l'animazione dalla superficie al centro (in secondi)
        TYPING_SPEED: 0.5             // Velocità dell'effetto di digitazione delle lettere
    },

    // Word behavior
    MAX_ACTIVE_WORDS: 20,             // Numero massimo di parole animate contemporaneamente
    WORD_DELAY: 100,                  // Ritardo tra l'animazione di una parola e la successiva (in millisecondi)

    // Noise effect parameters
    NOISE: {
        AMPLITUDE: 0.1,               // Intensità dell'effetto di distorsione del noise
        FREQUENCY: 1.0                // Frequenza dell'effetto noise (più alto = più dettagliato)
    },

    // Opzione per scegliere il tipo di elemento centrale
    CENTRAL_ELEMENT: 'sphere', // può essere 'sphere' o 'logo'

    // Logo options
    LOGO: {
        SIZE: 1.6,           // Dimensione complessiva del logo
        DEPTH: 0.2,          // Profondità dell'estrusione
        COLOR: '#6952FF',    // Colore del logo
        OPACITY: 1,        // Opacità base del logo
        PULSE: {
            SPEED: 1.5,      // Aumentato da 0.5 a 1.5 per un pulse più veloce
            AMPLITUDE: 0.1    // Aumentato da 0.05 a 0.1 per un pulse più visibile
        }
    },
};

// Funzione per combinare le opzioni di default con quelle personalizzate
export function createOptions(customOptions = {}) {
    return {
        ...DEFAULT_OPTIONS,
        ...customOptions,
        WORD_ANIMATION: {
            ...DEFAULT_OPTIONS.WORD_ANIMATION,
            ...(customOptions.WORD_ANIMATION || {})
        },
        NOISE: {
            ...DEFAULT_OPTIONS.NOISE,
            ...(customOptions.NOISE || {})
        },
        // Aggiungiamo il merge delle opzioni del LOGO
        LOGO: {
            ...DEFAULT_OPTIONS.LOGO,
            ...(customOptions.LOGO || {})
        }
    };
}

// Esportiamo anche le singole costanti per retrocompatibilità
export const {
    SCENE_ANIMATION_DURATION,
    MOVEMENT_TIME,
    PROCESSING_TIME,
    PULSE_SPEED,
    PULSE_AMPLITUDE,
    PARTICLE_SIZE,
    PARTICLE_COUNT,
    SPHERE_RADIUS,
    TEXT_SPHERE_RADIUS,
    TEXT_MIN_RADIUS,
    PROCESSING_COLORS,
    DEFAULT_TEXT_COLOR,
    WORD_ANIMATION,
    MAX_ACTIVE_WORDS,
    WORD_DELAY
} = DEFAULT_OPTIONS;

// Calcoliamo le costanti derivate
export const TOTAL_ANIMATION_TIME = MOVEMENT_TIME * 2 + PROCESSING_TIME;