import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import FPSStats from "react-fps-stats";
// import StarsSystem from "@/components/Particles/Stars";
import { DirectionalLight, FogExp2 } from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import PostProcessing from "three/examples/jsm/renderers/common/PostProcessing";
import {BloomEffect, BlendFunction, KernelSize, EffectPass} from 'postprocessing';
import StarsSystem from "@/components/Particles/Stars";

const CloudSceneWithPointLight = () => {
  const sceneRef = useRef(null); // To hold the reference to the scene container
  const rendererRef = useRef(null); // To hold the WebGLRenderer
  const cameraRef = useRef(null); // To hold the camera

  useEffect(() => {
    const clock = new THREE.Clock();
    // Initialize the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 100;
    // camera.rotation.z = 100;
    // camera.rotation.y = -0.12;
    // camera.rotation.y = Math.PI / 4;
    camera.rotation.z = Math.PI / 4;
    // camera.rotation.x = 1.16;
    THREE.ColorManagement.enabled= false;
    const cloudParticles = [];
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.setPixelRatio(window.devicePixelRatio);
    sceneRef.current.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

     scene.fog = new FogExp2(0x000102, 0.01);
       renderer.setClearColor(scene.fog.color);
    // Load cloud texture
    const textureLoader = new THREE.TextureLoader();

    const cloudTexture = textureLoader.load("smoke.png"); // Replace with your cloud texture path
    // cloudTexture.encoding = THREE.sRGBEncoding;
  // renderer.setClearColor(scene.fog.color);
    const ambientLight = new THREE.AmbientLight(0x555555); // Soft white light
    scene.add(ambientLight);

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

gl_PointSize = size * ( 200.0 / -mvPosition.z );

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

    const radius = 5;

    const geometryParticles = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];
    const sizes = [];

    const color = new THREE.Color();
    // const radius = 200;
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * radius - 1;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * radius;

      // positions[i * 3+2].rotation.z = 0.27;
      // positions[i * 3 + 1].rotation.y = -0.12;
      // positions.push(x,y,z);

      // let angle = Math.random() * Math.PI * 2;
      // let distance = Math.pow(Math.random(), 0.5) * 50; // Spiral effect
      // let height = (Math.random() - 0.5) * 50;
      // positions[i * 3] = ( Math.random() * 2 - 1 ) * radius;
      // positions[i * 3 + 1] = ( Math.random() * 2 - 1 ) * radius;
      // positions[i * 3 + 2] = ( Math.random() * 2 - 1 ) * radius;

      // color.setHSL( i / particles, 1.0, 0.5 );

      const color = new THREE.Color(1, 1, 1);
      // colors.push( positions[i * 3] / 30 + 0.5,positions[i * 3+1] / 30 + 0.5, positions[i * 3+2] / 30 + 0.5 );

      colors.push(color.r, color.g, color.b);

      sizes.push(1);
    }

    geometryParticles.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometryParticles.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometryParticles.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage),
    );

    const particleSystem = new THREE.Points(geometryParticles, shaderMaterial);

    particleSystem.renderOrder = 0;
    // scene.add(particleSystem);


    const starsSystem: StarsSystem = new StarsSystem();
    starsSystem.init();
    scene.add(starsSystem.system!);

    // Create a plane geometry and apply the cloud texture
    const geometry = new THREE.PlaneGeometry(10, 10); // Adjust size of the cloud plane
    let material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      // color: 0x8D8A9E,  // Red
      transparent: true, // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      // metalness: 0.1,  // Adjust metallic feel (optional)
    });

    // const directionalLight = new DirectionalLight( 0xffffff);
    const directionalLight = new DirectionalLight(0x6fd5de);
    directionalLight.position.set(2, -2, 1);
    scene.add(directionalLight);

    material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      // color: 0x4284ed,
      color: 0x6D407A,
      opacity: 0.9,
      transparent: true, // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      metalness: 0.1,  // Adjust metallic feel (optional)
    });

    for (let i = 0; i < 15; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random()*10 - 4, Math.random() * 8 - 4, Math.random() * 6 - 6);
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.9;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
      // scene.add(cloud);
    }

    material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      // color: 0x4284ed,
      color: 0x3C5A99,
      opacity: 0.9,
      transparent: true, // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      metalness: 0.1,  // Adjust metallic feel (optional)
    });

    for (let i = 0; i < 35; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random()*2 - 4, Math.random() * 8 - 4, Math.random() * 6 - 6);
      console.log(cloud.position);
      // cloud.rotation.x = 0.27;

      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = 0.12;
      cloud.material.opacity = 1;
      cloudParticles.push(cloud);
      cloud.renderOrder = 0.9;
      scene.add(cloud);
    }

    material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      // color: 0x1356ad,
      // color: 0x6d407a,
      color: 0x3C5A99,
      transparent: true, // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      metalness: 0.1,  // Adjust metallic feel (optional)
    });

    for (let i = 0; i < 35; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random() * 18 - 4, Math.random() * 8 - 4, Math.random() * 6 - 5);
      console.log(cloud.position);

      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = 0.12;
      cloud.material.opacity = 1;
      cloudParticles.push(cloud);
      cloud.renderOrder = 0.9;
      scene.add(cloud);
    }

    const cloudTexture2 = textureLoader.load("cloud-3s.png"); // Replace with your cloud texture path
    material = new THREE.MeshLambertMaterial({
      // emissiveIntensity: 1.2,
      map: cloudTexture2,
      // color: 0x1356ad,
      color: 0x3C5A99,
      transparent: true, // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      metalness: 0.1,  // Adjust metallic feel (optional)
    });

    for (let i = 0; i < 35; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random() * 18 - 4, Math.random() - 4, Math.random() * 6 - 5);
      console.log(cloud.position);
      // cloud.rotation.x = 0.27;

      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = 0.12;
      cloud.material.opacity = 0.9;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
      // scene.add(cloud);
    }


    // cloudPlane.position.set(0, 0, -5);

    // Add the cloud mesh to the scene
    // scene.add(clou);

    // Create a PointLight (Positioned at (0, 0, 5) in the scene)
    // const pointLight = new THREE.PointLight(0xff0000, 1, 100); // Color, intensity, distance
    // pointLight.position.set(0, 0, 5); // Set the light’s position in 3D space
    // scene.add(pointLight);


    // Lighting
    // const light = new THREE.PointLight(0xffffff, 1, 100);
    // light.position.set(10, 10, 10);
    // scene.add(light);

    const orangeLight = new THREE.PointLight(0x420a52, 50, 450, 2);
    orangeLight.castShadow = true;
    orangeLight.position.set(2, 4, 2);
    scene.add(orangeLight);

    const redLight = new THREE.PointLight(0x7d1875, 10, 450, 1.7);
    redLight.castShadow = true;
    redLight.position.set(2, 4, 2);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x3677ac, 50, 0, 2);
    blueLight.castShadow = true;
    blueLight.position.set(2, 4, 2);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x0a2430, 100, 100, 0.5);
    blueLight.castShadow = true;
    blueLight.position.set(2, 4, 10);
    scene.add(purpleLight);


    const purpleLight2 = new THREE.PointLight(0x0000, 150, 100, 0.5);
    blueLight.castShadow = true;
    blueLight.position.set(2, 4, 10);
    // scene.add(purpleLight2);

    // Optionally, add a helper to visualize the PointLight's position
    // scene.add(new THREE.PointLightHelper(orangeLight, 1));
    scene.add(new THREE.PointLightHelper(blueLight, 1));
    // scene.add(new THREE.PointLightHelper(blueLight, 1));

    // Set the camera position
    camera.position.z = 8;
    // camera.rotation.x = 1.16;
    // camera.rotation.y = -0.12;
    // // Gradient material for the background sphere
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iTime: { value: 0 },
      },

      fragmentShader: `
    uniform vec2 iResolution;
    uniform float iTime;
    
float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}
    
    void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        
            vec3 colorTop = vec3(0.258, 0.529, 0.961);
    vec3 colorBottom =  vec3(0.039, 0.090, 0.322);

    float mixValue = easeInOutCubic(uv.y);
    vec3 color = mix(colorBottom, colorTop, mixValue);

        gl_FragColor =vec4(color, 1.0);
    }
`,
      vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
      transparent: true,
    });
    // Create a large sphere to surround the scene (acting as the background)
    const geometryBackground = new THREE.SphereGeometry(500, 60, 60);
    const sphere = new THREE.Mesh(geometryBackground, gradientMaterial);
    sphere.material.side = THREE.BackSide; // Render the sphere on the inside

    // Set the render order of the sphere to be first (behind everything)
    sphere.renderOrder = -2;
   // scene.add(sphere);



    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.9,  // Bloom strength
      1.,  // Bloom radius
      0.3  // Threshold
    );

// Set up the effect pass
//     const effectPass = new EffectPass(camera, bloomPass);
    bloomPass.renderToScreen = true;

// Set up the composer with the render pass and effect pass
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);

    // Animation loop to update the scene
    const animate = () => {
      const delta = clock.getDelta();
      requestAnimationFrame(animate);
      starsSystem.animate(delta*0.1);

      // redLight.position.x = Math.sin(Date.now() * 0.001) * 10;
      // redLight.position.y = Math.cos(Date.now() * 0.001) * 10;

      cloudParticles.forEach((cloud) => {
        cloud.rotation.z -= delta * 0.1;
      });

      // Optionally animate the cloud texture (e.g., move the texture for a drifting effect)
      // cloudPlane.material.map.offset.x += 0.01;

      // Optionally animate the light position
      // redLight.position.x = Math.sin(Date.now() * 0.001) * 5;
      // redLight.position.z = Math.cos(Date.now() * 0.001) * 5;
      // blueLight.position.x = Math.sin(Date.now() * 0.001) * 5;
      // blueLight.position.z = Math.cos(Date.now() * 0.001) * 5;
      // console.log(blueLight.position);
      // orangeLight.position.x = Math.sin(Date.now() * 0.001) * 5;
      // orangeLight.position.z = Math.cos(Date.now() * 0.001) * 5;

      controls.update();
      composer.render();
      // renderer.render(scene, camera);
    };

    // Start the animation
    animate();

    // redLight.position.z = Math.cos(Date.now() * 0.001) * 10;
    // Handle window resizing
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      // Cleanup on component unmount
      window.removeEventListener("resize", onResize);
      // scene.remove(cloudPlane, pointLight, pointLightHelper);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <FPSStats />
      <div ref={sceneRef} style={{ position: "fixed", top: "0", right: "0" }}></div>
    </>
  );
};

export default CloudSceneWithPointLight;
