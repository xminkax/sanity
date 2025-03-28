import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import FPSStats from "react-fps-stats"; // Import OrbitControls
const AuroraScene = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 10;
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2 );
    const uniforms = {
      iTime: { value: 0.0 },
      iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
uniform float iTime;
uniform vec2 iResolution;


#define PI 3.14159265
#define TAU 6.2831853
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.9);}
vec2 tri2(in vec2 p) {
    return vec2(tri(p.x) + tri(p.y), tri(p.y + tri(p.x)));
}


float hash(vec2 p) {
    return fract(sin(dot(p, vec2(27.61, 57.38))) * 43758.5453);
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
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float starField(vec2 uv) {
    float star = hash(uv * 40.0);
    return step(0.997, star) * star;
}

vec3 nightSky(vec2 uv) {
    vec3 skyColor = vec3(0.02, 0.02, 0.1) + vec3(0.2, 0.9, 0.9) * pow(1.0 - uv.y, 2.0);
    // vec3 skyColor = vec3(0.1, 0.02, 0.1) + vec3(0.3, 0.1, 0.3) * pow(1.0 - uv.y, 2.0);
    float stars = starField(uv);
    return skyColor + vec3(stars);
}

float fbmAurora(vec2 p) {
    float z = 1.8;
    float z2 = 2.5;
    float rz = 0.0;
    p *= mm2(p.x * 0.06);  // Apply scaling

    vec2 bp = p;
    for (float i = 0.0; i < 5.0; i++) {
        // Generating some fractal-like noise using a triangular pattern
        vec2 dg = tri2(bp * 1.85) * 0.75;
        dg *= mm2(iTime);  // Add time-based oscillation
        p -= dg / z2;

        // Adjust the scale factors and progression
        bp *= 1.3;
        z2 *= 0.45;
        z *= 0.42;
        p *= 1.21 + (rz - 1.0) * 0.02;

        // Add some distortion based on the pattern
        rz += tri(p.x + tri(p.y)) * z;
        
        // Apply smooth rotation
        p *= mm2(iTime * 0.01);  
    }
    
    // Return the final result with a smooth decay
    return clamp(1.0 / pow(rz * 20.0, 1.3), 0.0, 1.0);
}

void main() {
    
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv.y = pow(uv.y, 0.4) * 0.8; // Curve to form an arc
    uv.x += sin(uv.y * PI) * 0.1; // Create a banded effect
    
    float time = iTime * 0.0002;
    float n = fbmAurora(vec2(uv.x * 1.6, uv.y * 1.0));
   
    
   float wave = sin(uv.y * 1.2 + n * 0.8 * 1.2) * 0.5 + 0.8;

    float intensity = smoothstep(0.2, 0.9,  wave * n);
    
    vec3 auroraColors[5];    
    auroraColors[0] = vec3(0.0, 1.0, 0.9); // Cyan
    auroraColors[1] =  vec3(0.0, 0.8, 0.3);/// Green
    auroraColors[2] = vec3(1.0, 0.6, 0.8);  /// Soft Pink maybe
    auroraColors[3] = vec3(0.0, 0.8, 0.3); // Purple no
    auroraColors[4] = vec3(0.0, 1.0, 0.9);// Yellow-Orange    
    
    float colorMix = fract(uv.y * 3.0 * 0.1);
    vec3 auroraColor = mix(
        mix(auroraColors[0], auroraColors[1], smoothstep(0.0, 0.2, colorMix)),
        mix(auroraColors[2], auroraColors[3], smoothstep(0.5, 1.0, colorMix)),
        smoothstep(0.2, 0.5, colorMix)
    );
    
    auroraColor = mix(auroraColor, auroraColors[4], pow(uv.y,3.0));
  
      vec3 background = nightSky(uv);
  vec3 finalColor = mix(background, auroraColor, intensity);
   
       uv.y = pow(uv.y, 0.8) * 0.6; // Curve to form an arc
    uv.x += sin(uv.y * PI) * 2.2; // Create a banded effect
   time = iTime * 0.4;
       float n2 = fbm(vec2(uv.x * 5.0, uv.y * 10.0 + time));
    
    float wave2 = sin(uv.y * 10.0 + n2 * 3.0 + time * 5.0) * 0.2 + 0.8;
    // float intensity = smoothstep(0.3, 1.0, wave2 * n2);
    float intensity2 = smoothstep(0.2, 0.9, wave2 * n2);
    
    vec3 auroraColors2[5];
   
    auroraColors2[0] = vec3(0.0, 1.0, 1.0);  // Cyan
    auroraColors2[1] =  vec3(1.0, 0.6, 0.8); // Green
    auroraColors2[2] = vec3(0.0, 1.0, 1.0); // Soft Pink maybe
    auroraColors2[3] = vec3(0.0, 1.0, 1.0); // Purple no
    auroraColors2[4] = vec3(0.0, 0.8, 0.3); // Yellow-Orange   
    
    float colorMix2= fract(uv.y * 3.0 + time * 0.1);
    vec3 auroraColor2 = mix(
        mix(auroraColors2[0], auroraColors2[1], smoothstep(0.0, 0.2, colorMix2)),
        mix(auroraColors2[2], auroraColors2[3], smoothstep(0.5, 1.0, colorMix2)),
        smoothstep(0.2, 0.5, colorMix2)
    );
    auroraColor2 = mix(auroraColor2, auroraColors2[4], pow(uv.y, 3.0));
    
    vec3 background2 = nightSky(uv);
    vec3 finalColor2 = mix(finalColor, auroraColor2, intensity2);

    
    gl_FragColor = vec4(finalColor2, 1.0);    
}

      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      const delta = clock.getDelta();
      requestAnimationFrame(animate);
      uniforms.iTime.value += delta*0.3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      document.body.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
      cancelAnimationFrame(animate);
    };
  }, []);

  return <><FPSStats/><div ref={mountRef} style={{position: "fixed", top: "0", right: "0"}}/></>;
};

export default AuroraScene;
