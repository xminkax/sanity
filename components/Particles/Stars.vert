attribute float size;
varying vec3 vColor;
varying float vOpacity;
attribute float opacity;

void main() {
  vColor = color;
  vOpacity = opacity;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (50.0 / -mvPosition.z / 1.6);
  gl_Position = projectionMatrix * mvPosition;
}