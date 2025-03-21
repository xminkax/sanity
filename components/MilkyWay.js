import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const MilkyWay = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: mountRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const alphaMap = textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/circle.png");


    // Particle system (Milky Way stars)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      let angle = Math.random() * Math.PI * 2;
      let distance = Math.pow(Math.random(), 0.5) * 50; // Spiral effect
      let height = (Math.random() - 0.5) * 10;
      positions[i * 3] = Math.cos(angle) * distance;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * distance;

      const color = new THREE.Color().setHSL(Math.random() * 0.1 + 0.6, 1, 0.8);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      alphaMap: alphaMap,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Camera position
    camera.position.z = 60;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.001; // Slow rotation
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const onWindowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      // mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return <canvas
    ref={mountRef}
    style={{width: '100vw', position: "absolute", top: "0", left: "0"}}
  />
};

export default MilkyWay;