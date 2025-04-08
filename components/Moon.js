import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import FPSStats from "react-fps-stats";
import { AmbientLight, PlaneGeometry, TextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const VolumetricNebula = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 15;

    const ambient = new AmbientLight(0x555555);
    scene.add(ambient);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Load Nebula Texture
    const textureLoader = new THREE.TextureLoader();
    const nebulaTexture = textureLoader.load("cloud3.png"); // Use a nebula texture

    // Sphere Geometry & Material
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshLambertMaterial({
      map: nebulaTexture,
      transparent: true,
      opacity: 0.5,
      emissive: 0x9932cc, // Purple Nebula Effect
      emissiveIntensity: 1.2,
    });

    // Create Multiple Nebula Layers
    const nebulaGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const sphere = new THREE.Mesh(geometry, material);
      // sphere.scale.setScalar(1 + i * 0.2); // Scale each layer
      sphere.material.opacity = 0.2 + 0.1 * i; // Layer opacity
      nebulaGroup.add(sphere);
    }
    scene.add(nebulaGroup);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // let cloudParticles = [];
    //
    // const loader = new TextureLoader();
    // let cloudGeo;
    // let materialCloudGeo;
    // loader.load("cloud-3s.png", function(texture) {
    //   cloudGeo = new PlaneGeometry(500,500);
    //   materialCloudGeo = new THREE.MeshLambertMaterial({
    //     // emissiveIntensity: 1.5,
    //     color: 0xffffff,
    //     map: texture,
    //     transparent: true,
    //   });
    //   const positions = [
    //     [350,450,0]
    //   ]
    //   for (let i = 0; i < 1; i++) {
    //     let cloud = new THREE.Mesh(cloudGeo, materialCloudGeo);
    //     cloud.receiveShadow = true;
    //     cloud.castShadow = true;
    //     // if(i === positions.length - 1) {
    //     // cloud.position.set(...positions[i]);
    //     // } else {
    //     cloud.position.set(10,-200,-200);
    //     // }
    //     // console.log(cloud.position);
    //     // cloud.rotation.x = 1.16;
    //     // cloud.rotation.y = -0.12;
    //     // cloud.rotation.z = Math.random() * 2 * Math.PI;
    //     cloud.material.opacity = 0.5;
    //     cloudParticles.push(cloud);
    //     scene.add(cloud);
    //   }
    // });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      nebulaGroup.rotation.y += 0.002; // Rotate nebula slowly
      renderer.render(scene, camera);
    };
    animate();

    // Handle Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <FPSStats />
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
    </>
  );
};

export default VolumetricNebula;
