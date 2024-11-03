uniform float time;
uniform float baseOpacity;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    // Normalizza le coordinate per avere un range consistente
    vec2 normalizedPos = vPosition.xy * 2.0;
    
    // Calcola il gradiente usando una funzione più semplice e stabile
    float gradientX = sin(time * 0.5) * 0.5 + 0.5;
    float gradientY = cos(time * 0.5) * 0.5 + 0.5;
    
    // Mix dei colori senza dipendere dalla posizione Z
    vec3 colorMixHorizontal = mix(color1, color2, gradientX);
    vec3 colorMixVertical = mix(color3, color4, gradientY);
    
    // Mix finale con una transizione più morbida
    vec3 finalColor = mix(
        colorMixHorizontal,
        colorMixVertical,
        0.5 + sin(time * 0.6) * 0.5
    );
    
    // Aumenta la luminosità e la saturazione per un effetto fluo
    finalColor = pow(finalColor, vec3(0.85)); // Aumenta la luminosità
    finalColor *= 1.2; // Aumenta l'intensità generale
    
    // Aggiungi un effetto di brillantezza pulsante più intenso
    float brightness = 0.9 + sin(time * 1.0) * 0.2; // Aumentato da 0.1 a 0.2
    finalColor *= brightness;
    
    // Aggiungi un leggero bloom
    float bloomIntensity = 0.15;
    vec3 bloom = finalColor * bloomIntensity;
    finalColor += bloom;
    
    // Assicurati che i colori non superino il range valido
    finalColor = clamp(finalColor, vec3(0.0), vec3(1.0));
    
    gl_FragColor = vec4(finalColor, baseOpacity);
} 