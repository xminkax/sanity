varying vec3 vColor;
attribute float size;
attribute float opacity;
varying float vOpacity;

void main() {
  vColor = color;
  vOpacity = opacity;
  gl_PointSize = size;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}