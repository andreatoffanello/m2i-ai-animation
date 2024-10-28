uniform float opacity;
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

varying vec3 vPosition;
varying float vProgress;
varying vec2 vUv;

vec3 getGradientColor(float t) {
    if (t < 0.33) {
        return mix(color1, color2, smoothstep(0.0, 0.33, t));
    } else if (t < 0.66) {
        return mix(color2, color3, smoothstep(0.33, 0.66, t));
    } else {
        return mix(color3, color4, smoothstep(0.66, 1.0, t));
    }
}

void main() {
    // Colore base dal gradiente
    vec3 baseColor = getGradientColor(vUv.y);
    
    // Effetto flusso dati
    float flowWidth = 0.1;
    float flow = smoothstep(0.0, flowWidth, vProgress) * 
                 (1.0 - smoothstep(flowWidth, 2.0 * flowWidth, vProgress));
    
    // Colore finale con effetto di flusso luminoso
    vec3 finalColor = mix(baseColor, vec3(1.0), flow * 0.5);
    float finalOpacity = (0.3 + flow * 0.7) * opacity;
    
    gl_FragColor = vec4(finalColor, finalOpacity);
} 