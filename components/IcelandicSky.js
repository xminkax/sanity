import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./IcelandicSky.frag";
import vertexShader from "./IcelandicSky.vert";
import FPSStats from "react-fps-stats"; // Import OrbitControls
const AuroraScene = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 10;
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      iTime: { value: 0.0 },
      iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      const delta = clock.getDelta();
      requestAnimationFrame(animate);
      uniforms.iTime.value += delta * 0.8;
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

  return (
    <>
      <FPSStats />
      <div ref={mountRef} style={{ position: "fixed", top: "0", right: "0" }} />
    </>
  );
};

export default AuroraScene;
