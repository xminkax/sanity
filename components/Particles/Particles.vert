varying vec3 vColor;
varying float vAlpha;
void main() {
    vColor = color;
    vAlpha = 2.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 3.0;
}