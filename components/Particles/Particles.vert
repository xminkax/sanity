varying vec3 vColor;
varying float vAlpha;
void main() {
    vColor = color;
    // Set a constant alpha for demonstration (could also vary by vertex)

    vAlpha = 2.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 3.0;
}