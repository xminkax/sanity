uniform sampler2D pointTexture;
varying vec3 vColor;
varying float vOpacity;

void main() {
    gl_FragColor = vec4(vColor, vOpacity);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
}