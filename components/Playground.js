import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import FPSStats from "react-fps-stats";
import {DirectionalLight, FogExp2} from "three";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";

const CloudSceneWithPointLight = () => {
  const sceneRef = useRef(null); // To hold the reference to the scene container
  const rendererRef = useRef(null); // To hold the WebGLRenderer
  const cameraRef = useRef(null); // To hold the camera

  useEffect(() => {
    const clock = new THREE.Clock();
    // Initialize the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;
    // camera.rotation.x = 1.16;
    // camera.rotation.y = -0.12;
    const cloudParticles = [];
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setPixelRatio(window.devicePixelRatio);
    sceneRef.current.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

  scene.fog = new FogExp2(0xFFF5E1, 0.005);
 //   renderer.setClearColor(scene.fog.color);
    // Load cloud texture
    const textureLoader = new THREE.TextureLoader();
    const cloudTexture = textureLoader.load('cloud-3s.png'); // Replace with your cloud texture path

    const ambientLight = new THREE.AmbientLight(0x555555); // Soft white light
    scene.add(ambientLight);


    const uniforms = {

      pointTexture: { value: new THREE.TextureLoader().load( 'spark1.png' ) }

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

    const shaderMaterial = new THREE.ShaderMaterial( {

      uniforms: uniforms,
      vertexShader,
      fragmentShader,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true

    } );


    const radius = 20;

    const geometryParticles = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];
    const sizes = [];

    const color = new THREE.Color();
    // const radius = 200;
    for ( let i = 0; i < 20; i ++ ) {

      positions[i * 3] = ( Math.random() * 2 - 1 ) * radius;
      positions[i * 3 + 1] = ( Math.random() * 2 - 1 ) * radius-1;
      positions[i * 3 + 2] = ( Math.random() * 2 - 1 ) * radius;

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

      colors.push( color.r, color.g, color.b);

      sizes.push( 3 );

    }

    geometryParticles.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometryParticles.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometryParticles.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

    const particleSystem = new THREE.Points( geometryParticles, shaderMaterial );


    particleSystem.renderOrder = 0;
    scene.add( particleSystem );


    // Create a plane geometry and apply the cloud texture
    const geometry = new THREE.PlaneGeometry(10, 10); // Adjust size of the cloud plane
    let material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      // color: 0x8D8A9E,  // Red
      transparent: true,  // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      // metalness: 0.1,  // Adjust metallic feel (optional)
    });

    const directionalLight = new DirectionalLight(0x800080);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    for (let i = 0; i < 7; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random() * (-7 + 5) - 5, -1, Math.random() * 6 - 5);
      console.log( cloud.position);
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.5;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
      scene.add(cloud);

    }

    for (let i = 0; i < 7; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random() * (-8 + 4) - 4, 0, Math.random() * 7 - 5);
      console.log( cloud.position);
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.5;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
      scene.add(cloud);

    }

    material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      color: 0x4F8DE1,  // Red
      transparent: true,  // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      // metalness: 0.1,  // Adjust metallic feel (optional)
    });

    //right
    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random() * (7 - 5) + 5, 0, Math.random() * 6 - 5);
      console.log( cloud.position);
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.5;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
      scene.add(cloud);
    }

    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random() * (9 - 4) + 4, -3, Math.random() * 6 - 5);
      console.log( cloud.position);
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.5;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
      scene.add(cloud);
    }

    for (let i = 0; i < 7; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(Math.random() * (7 - 5) + 5, Math.random()-1, Math.random() * 6 - 6);
      console.log( cloud.position);
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.5;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
      scene.add(cloud);
    }

    material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      // color: 0xFF8C42,  // Red
      transparent: true,  // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      // metalness: 0.1,  // Adjust metallic feel (optional)
    });

    for (let i = 0; i < 9; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(0, Math.random() * (6 - 4) + 4, Math.random() * 6 - 5);
      console.log( cloud.position);
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.5;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
     scene.add(cloud);
    }

    material = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      color: 0x4F8DE1,  // Red
      transparent: true,  // Enables transparency for cloud effects
      roughness: 0.8, // Adjust surface roughness
      // metalness: 0.1,  // Adjust metallic feel (optional)
    });


    for (let i = 0; i < 10; i++) {
      const cloud = new THREE.Mesh(geometry, material);
      // cloud.receiveShadow = true;
      // cloud.castShadow = true;
      cloud.position.set(0, Math.random() * (-6 + 4) - 4, Math.random() * 6 - 5);
      console.log( cloud.position);
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.5;
      cloudParticles.push(cloud);
      cloud.renderOrder = 1;
     scene.add(cloud);
    }
    // cloudPlane.position.set(0, 0, -5);

    // Add the cloud mesh to the scene
    // scene.add(clou);

    // Create a PointLight (Positioned at (0, 0, 5) in the scene)
    // const pointLight = new THREE.PointLight(0xff0000, 1, 100); // Color, intensity, distance
    // pointLight.position.set(0, 0, 5); // Set the light’s position in 3D space
    // scene.add(pointLight);

    const orangeLight = new THREE.PointLight(0xcc6600, 20, 100, 2);
    orangeLight.castShadow = true;
    orangeLight.position.set(-2, 4, 0  );
    scene.add(orangeLight);

    const redLight = new THREE.PointLight(0xd8547e, 20, 100, 2);
    redLight.castShadow = true;
    redLight.position.set(-1, 4, 0);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x3677ac, 4, 50, 2);
    blueLight.castShadow = true;
    blueLight.position.set(2, 4, 0);
    scene.add(blueLight);

    // Optionally, add a helper to visualize the PointLight's position
    // scene.add(new THREE.PointLightHelper(orangeLight, 1));
    // scene.add(new THREE.PointLightHelper(redLight, 1));
    // scene.add(new THREE.PointLightHelper(blueLight, 1));

    // Set the camera position
    camera.position.z = 4;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    // Gradient material for the background sphere
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iTime: { value: 0 }
      },

      fragmentShader: `
    uniform vec2 iResolution;
    uniform float iTime;
    
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

    // float starField(vec2 uv) {
    //     float star = hash(uv * 40.0);
    //     return step(0.997, star) * star;
    // }
    
    vec3 nightSky(vec2 uv) {
        vec3 skyColor = vec3(0., 0.6, 0.8) * (0.5 + 0.5 * uv.y) + vec3(0.3, 0.1, 0.1) * pow(1.5 - uv.x, 4.3);



        // float stars = starField(uv);
        return skyColor;
    }
    
    void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv.x *= iResolution.x / iResolution.y;

        float time = iTime * 0.5;
        float intensity = smoothstep(0.9, 1.1, 1.);

mat2 rotation = mat2( sin(0.5), cos(0.5), -cos(0.5), -sin(0.5));
        uv = rotation * uv;

        float wave = fbm(uv * 1.5 * vec2(0.5, 0.3));
        vec3 background = nightSky(uv);
        vec3 color = mix(vec3(0.0, 0.1, 0.3), background, wave);

        gl_FragColor = vec4(mix(background, color, intensity), 1.0);
    }
`,    vertexShader: `
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
    scene.add(sphere);




    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.3 , // strength
      1, // radius
      0.75 // threshold
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);

    // Animation loop to update the scene
    const animate = () => {
      const delta = clock.getDelta();
      requestAnimationFrame(animate);

      cloudParticles.forEach(cloud => {
        cloud.rotation.z -= delta*0.05;
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

    // Handle window resizing
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      // Cleanup on component unmount
      window.removeEventListener('resize', onResize);
      // scene.remove(cloudPlane, pointLight, pointLightHelper);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <FPSStats/>
    <div
      ref={sceneRef}
      style={{position: "fixed", top: "0", right: "0"}}
    ></div></>
  );
};

export default CloudSceneWithPointLight;
