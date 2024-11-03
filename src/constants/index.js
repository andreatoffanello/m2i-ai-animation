import { Color } from 'three';

// Animation constants
export const SCENE_ANIMATION_DURATION = 2.0;
export const MOVEMENT_TIME = 0.6;
export const PROCESSING_TIME = 2.5;
export const TOTAL_ANIMATION_TIME = MOVEMENT_TIME * 2 + PROCESSING_TIME;
export const PULSE_SPEED = 2.0;
export const PULSE_AMPLITUDE = 0.1;

// Scene constants
export const PARTICLE_SIZE = 0.005;
export const PARTICLE_COUNT = 30000;
export const SPHERE_RADIUS = 2.0;
export const TEXT_SPHERE_RADIUS = 2.3;
export const TEXT_MIN_RADIUS = 0.1;

// Color constants
export const PROCESSING_COLORS = [
    "#FBD23D", // giallo
    "#3EECFF", // azzurro
    "#EF6F34", // arancione
    "#5C20DD"  // viola
];
export const DEFAULT_TEXT_COLOR = "#3EECFF";

// Word Animation constants
export const WORD_ANIMATION = {
    MOVE_OUT_DURATION: 1.0,    // Tempo per andare dal centro alla superficie
    SURFACE_DURATION: 2.0,      // Tempo sulla superficie
    MOVE_IN_DURATION: 1.0,      // Tempo per tornare al centro
    TYPING_SPEED: 0.5          // Velocità di digitazione
};

// Other constants
export const MAX_ACTIVE_WORDS = 20;
export const WORD_DELAY = 100; // 100ms di delay tra ogni parola 