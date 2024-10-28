uniform float time;
varying vec3 vPosition;
varying float vProgress;
varying vec2 vUv;

void main() {
    vPosition = position;
    
    // Calcola la direzione della linea
    vec3 lineDir = position - vPosition;
    float lineLength = length(lineDir);
    
    // Crea un effetto di flusso che si muove lungo la linea
    vProgress = mod(lineLength + time * 0.5, 1.0);
    
    // Passa le coordinate UV per il gradiente
    vUv = vec2(
        float(gl_VertexID % 2), // 0 per il punto iniziale, 1 per il punto finale
        float(gl_VertexID / 2) / 3.0 // Divide la linea in sezioni per il gradiente
    );
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
} 