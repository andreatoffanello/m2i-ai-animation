import { Color } from 'three';

// Definiamo tutte le costanti in un oggetto
export const DEFAULT_OPTIONS = {
    // Animation constants
    SCENE_ANIMATION_DURATION: 2.0,
    MOVEMENT_TIME: 0.6,
    PROCESSING_TIME: 2.5,
    PULSE_SPEED: 2.0,
    PULSE_AMPLITUDE: 0.1,

    // Scene constants
    PARTICLE_SIZE: 0.005,
    PARTICLE_COUNT: 30000,
    SPHERE_RADIUS: 2.0,
    TEXT_SPHERE_RADIUS: 2.3,
    TEXT_MIN_RADIUS: 0.1,

    // Color constants
    PROCESSING_COLORS: [
        "#FBD23D", // giallo
        "#3EECFF", // azzurro
        "#EF6F34", // arancione
        "#5C20DD"  // viola
    ],
    DEFAULT_TEXT_COLOR: "#3EECFF",

    // Word Animation constants
    WORD_ANIMATION: {
        MOVE_OUT_DURATION: 1.0,
        SURFACE_DURATION: 2.0,
        MOVE_IN_DURATION: 1.0,
        TYPING_SPEED: 0.5
    },

    // Other constants
    MAX_ACTIVE_WORDS: 20,
    WORD_DELAY: 100,

    // Noise constants
    NOISE: {
        AMPLITUDE: 0.1,
        FREQUENCY: 1.0
    }
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