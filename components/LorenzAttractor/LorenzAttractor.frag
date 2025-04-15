uniform sampler2D pointTexture;
varying vec3 vColor;
void main() {
    vec4 texColor = texture2D(pointTexture, gl_PointCoord);
    gl_FragColor = vec4(vColor * texColor.rgb, 0.5);
}