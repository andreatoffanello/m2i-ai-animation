varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
