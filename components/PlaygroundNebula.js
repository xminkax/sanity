import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {
  AmbientLight,
  DirectionalLight,
  FogExp2,
  MathUtils,
  MeshLambertMaterial,
  PlaneGeometry,
  TextureLoader,
} from "three";
import {
  BlendFunction,
  BloomEffect,
  ChromaticAberrationEffect,
  ClearPass,
  EffectPass,
  KernelSize,
} from "postprocessing";

const ThreeScene = () => {
  const mountRef = useRef(null);
  let cloudParticles = [];
  let composer;

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;

    const ambient = new AmbientLight(0x555555);
    scene.add(ambient);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;

    scene.fog = new FogExp2(0x2233aa, 0.001);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.useLegacyLights = true;
    renderer.setClearColor(scene.fog.color);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const uniforms = {
      pointTexture: { value: new THREE.TextureLoader().load("spark1.png") },
    };
    // Custom Shader Materials
    const vertexShader = `
attribute float size;

varying vec3 vColor;

void main() {

vColor = color;

vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

gl_PointSize = size * ( 300.0 / -mvPosition.z );

gl_Position = projectionMatrix * mvPosition;

}
      `;

    const fragmentShader = `
uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {

gl_FragColor = vec4( vColor, 1.0 );

gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

}
      `;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader,
      fragmentShader,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    const radius = 200;

    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];
    const sizes = [];

    const color = new THREE.Color();
    // const radius = 200;
    for (let i = 0; i < 6000; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * radius - 1;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * radius;

      // positions.push(x,y,z);

      // let angle = Math.random() * Math.PI * 2;
      // let distance = Math.pow(Math.random(), 0.5) * 50; // Spiral effect
      // let height = (Math.random() - 0.5) * 50;
      // positions[i * 3] = ( Math.random() * 2 - 1 ) * radius;
      // positions[i * 3 + 1] = ( Math.random() * 2 - 1 ) * radius;
      // positions[i * 3 + 2] = ( Math.random() * 2 - 1 ) * radius;

      // color.setHSL( i / particles, 1.0, 0.5 );

      const color = new THREE.Color(0, 0.9, 0.6 + Math.random() * 0.1 + 0.83);
      // colors.push( positions[i * 3] / 30 + 0.5,positions[i * 3+1] / 30 + 0.5, positions[i * 3+2] / 30 + 0.5 );

      colors.push(color.r, color.g, color.b);

      sizes.push(5);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage),
    );

    const particleSystem = new THREE.Points(geometry, shaderMaterial);

    scene.add(particleSystem);

    // Lights
    const directionalLight = new DirectionalLight(0xff8c19);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const orangeLight = new THREE.PointLight(0xcc6600, 20, 450);
    orangeLight.castShadow = true;
    orangeLight.position.set(200, 300, 100);
    scene.add(orangeLight);

    const redLight = new THREE.PointLight(0xd8547e, 10, 450);
    redLight.castShadow = true;
    redLight.position.set(100, 300, 200);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x3677ac, 10, 450);
    blueLight.castShadow = true;
    blueLight.position.set(100, 300, 100);
    scene.add(blueLight);

    // Clouds
    const loader = new TextureLoader();
    let cloudGeo;
    let materialCloudGeo;
    loader.load("cloud3.png", function (texture) {
      cloudGeo = new PlaneGeometry(500, 500);
      materialCloudGeo = new THREE.MeshLambertMaterial({
        emissiveIntensity: 1.5,
        map: texture,
        transparent: true,
      });
      for (let i = 0; i < 30; i++) {
        let cloud = new THREE.Mesh(cloudGeo, materialCloudGeo);
        cloud.receiveShadow = true;
        cloud.castShadow = true;
        cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 500);
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 2 * Math.PI;
        cloud.material.opacity = 1;
        cloudParticles.push(cloud);
        scene.add(cloud);
      }
    });

    // Postprocessing
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, // strength
      1, // radius
      10, // threshold
    );

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      cloudParticles.forEach((cloud) => {
        cloud.rotation.z -= 0.001;
      });
      composer.render();
    };

    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeScene;
