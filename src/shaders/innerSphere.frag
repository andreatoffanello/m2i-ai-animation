uniform float time;
uniform float baseOpacity;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Funzione per il rumore di Perlin 3D semplificato
float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
}

void main() {
    // Base color mixing con transizioni più morbide
    vec3 baseColor = mix(
        mix(color1, color2, sin(time * 0.5 + vPosition.x * 2.0) * 0.5 + 0.5),
        mix(color3, color4, cos(time * 0.5 + vPosition.y * 2.0) * 0.5 + 0.5),
        sin(time + vPosition.z * 2.0) * 0.5 + 0.5
    );
    
    // Effetto Fresnel migliorato
    vec3 viewDirection = normalize(vViewPosition);
    float fresnelTerm = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
    
    // Rumore per l'effetto opale più dettagliato
    float noiseVal = noise(vPosition * 8.0 + time * 0.2); // Aumentato la frequenza
    float darkSpots = smoothstep(0.3, 0.7, noiseVal); // Allargato il range
    
    // Aggiungi riflessi scuri più profondi
    vec3 darkReflection = vec3(0.05, 0.05, 0.1) * (1.0 - darkSpots);
    
    // Aggiungi riflessi chiari più brillanti
    vec3 brightReflection = vec3(1.0, 0.98, 0.95) * fresnelTerm * noiseVal * 1.5;
    
    // Effetto iridescente potenziato
    float iridescenceStrength = 0.3; // Aumentato da 0.1 a 0.3
    vec3 iridescence = vec3(
        sin(fresnelTerm * 6.28318 + time),
        sin(fresnelTerm * 6.28318 + time + 2.0944), // 2π/3
        sin(fresnelTerm * 6.28318 + time + 4.18879) // 4π/3
    ) * iridescenceStrength;
    
    // Combina tutti gli effetti
    vec3 finalColor = baseColor;
    finalColor += brightReflection * 0.8; // Aumentato l'effetto dei riflessi chiari
    finalColor *= (1.0 - darkReflection);
    finalColor += iridescence * fresnelTerm; // Aggiunge l'iridescenza modulata dal Fresnel
    
    // Regola l'opacità per mantenere la trasparenza ai bordi
    float alpha = mix(0.2, 0.9, (1.0 - fresnelTerm * 0.7) * (1.0 - darkSpots * 0.4)) * baseOpacity;
    
    gl_FragColor = vec4(finalColor, alpha);
}
