import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import FPSStats from "react-fps-stats";
import { PerspectiveCamera, Scene, WebGLRenderer} from "three";
import ParticlesSystem from "@/components/Particles/Particles"; // Import OrbitControls

const MAX_STARS = 3000;
const ParticleSystem = () => {
  const mountRef = useRef(null);
  const clock = new THREE.Clock();

  useEffect(() => {
    const scene: Scene = new THREE.Scene();
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    const particleSystem = new ParticlesSystem();
    particleSystem.init();

    scene.add(particleSystem.system);

    const uniforms = {

      pointTexture: {value: new THREE.TextureLoader().load('spark1.png')}

    };
    // Custom Shader Materials
    const vertexShaderStars = `
attribute float size;

varying vec3 vColor;

void main() {

vColor = color;

vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

gl_PointSize = size * ( 50.0 / -mvPosition.z/1.6 );

gl_Position = projectionMatrix * mvPosition;

}
      `;

    const fragmentShaderStars = `
uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {

gl_FragColor = vec4( vColor, 1.0 );

gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

}
      `;

    const shaderMaterial = new THREE.ShaderMaterial({

      uniforms: uniforms,
      vertexShader: vertexShaderStars,
      fragmentShader: fragmentShaderStars,

      blending: THREE.AdditiveBlending,
      alphaTest: true,
      depthTest: false,
      transparent: true,
      vertexColors: true

    });


    const radius = 50;

    const geometryStars = new THREE.BufferGeometry();

    const positions = [];
    const colorsStars = [];
    const sizesStars = [];

    for (let i = 0; i < MAX_STARS; i++) {

      positions[i * 3] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * radius;


      const color = new THREE.Color().setRGB(Math.random() * 0.5 + 0.8, 1.0, 0.9);

      colorsStars.push(color.r, color.g, color.b);

      sizesStars.push(10);

    }

    geometryStars.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometryStars.setAttribute('color', new THREE.Float32BufferAttribute(colorsStars, 3));
    geometryStars.setAttribute('size', new THREE.Float32BufferAttribute(sizesStars, 1).setUsage(THREE.DynamicDrawUsage));

    const starsSystem = new THREE.Points(geometryStars, shaderMaterial);
    //
    //
    scene.add(starsSystem);

    const skyGeometry = new THREE.SphereGeometry(120, 32, 32);
    const skyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff, // Dark blue/black color
      metalness: 0.8,  // High metalness for reflections
      roughness: 0.2,  // Low roughness for glossiness
      side: THREE.BackSide, // Render the inside of the sphere,
      transparent: true,
    });
    const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
    skySphere.position.set(4, 10, -1);
    scene.add(skySphere);

    const pointLight = new THREE.PointLight(0x00ffff, 20, -10);
    pointLight.position.set(-2, 10, -18);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    camera.position.z = 30;

    const keys = {};

    const handleKeyDown = (event) => {
      keys[event.key] = true;
    };

    const handleKeyUp = (event) => {
      keys[event.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const animate = () => {
      const delta = clock.getDelta();
      requestAnimationFrame(animate);
      particleSystem.animate(delta, keys);
      starsSystem.rotation.x += THREE.MathUtils.degToRad(30) * delta * 0.04;
      starsSystem.rotation.y += THREE.MathUtils.degToRad(30) * delta * 0.04;
      renderer.render(scene, camera);
    };
    controls.update();
    animate();

    // === Cleanup ===
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [clock]);

  return <><FPSStats/>
    <div ref={mountRef} style={{position: "fixed", top: "0", right: "0"}}/>
  </>;
};

export default ParticleSystem;
