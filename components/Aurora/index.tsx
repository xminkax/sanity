import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./IcelandicSky.frag";
import vertexShader from "./IcelandicSky.vert";
import { Mesh, PlaneGeometry, Scene, ShaderMaterial } from "three";

const Aurora: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const animationFrameIdRef = useRef<number>(0);
  const clock = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const scene: Scene = new THREE.Scene();

    const camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry: PlaneGeometry = new PlaneGeometry(2, 2);

    const material: ShaderMaterial = new ShaderMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      transparent: true,
      vertexShader,
      fragmentShader,
    });

    const mesh: Mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    const animate = () => {
      const delta: number = clock.current.getDelta();
      material.uniforms.iTime.value += delta * 0.3;
      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameIdRef.current !== undefined) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);

      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.remove(mesh);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "fixed", top: 0, right: 0 }} />;
};

export default Aurora;
