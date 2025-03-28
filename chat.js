float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;

  for (int i = 0; i < 5; i++) {
    sum += amp * noise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}
float starField(vec2 uv) {
  float star = hash(uv * 40.0);
  return step(0.997, star) * star;
}

vec3 nightSky(vec2 uv) {
  //vec3 skyColor = vec3(0.02, 0.02, 0.1) + vec3(0.2, 0.9, 0.9) * pow(1.0 - uv.y, 2.0);
  vec3 skyColor = vec3(0.2, 0.9, 0.9) + vec3(0.4, 0.1, 0.1) * pow(1.0 - uv.y, 2.0);
  float stars = starField(uv);
  return skyColor + vec3(stars);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord.xy / iResolution.xy;
  uv.x *= iResolution.x / iResolution.y;

  float time = iTime * 0.5;
  float intensity = smoothstep(0.1, 1.1, 1.);


  // Apply oblique direction by rotating UV coordinates
  mat2 rotation = mat2(cos(0.5), -sin(0.5), sin(0.5), cos(0.5));
  uv = rotation * uv;

  // Generate wave height based on fBm
  float wave = fbm(uv * 5.0 + time * vec2(0.5, 0.3));
  vec3 background = nightSky(uv);

  // Map wave height to color
  vec3 color = mix(vec3(0.0, 0.1, 0.3), background, wave);

  fragColor = vec4(mix(background, color, intensity), 1.0);
}
