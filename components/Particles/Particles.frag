varying float vOpacity;
uniform sampler2D pointTexture;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, vOpacity);
  gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
}