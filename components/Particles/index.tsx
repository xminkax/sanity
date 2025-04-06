import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import FPSStats from "react-fps-stats";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import ParticlesSystem from "@/components/Particles/Particles";
import StarsSystem from "@/components/Particles/Stars";

const ParticleSystem = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const clock = new THREE.Clock();
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }
    const scene: Scene = new THREE.Scene();
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000,
    );
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current!.appendChild(renderer.domElement);

    const particleSystem:ParticlesSystem = new ParticlesSystem();
    particleSystem.init();
    scene.add(particleSystem.system!);

    const starsSystem: StarsSystem = new StarsSystem();
    starsSystem.init();
    scene.add(starsSystem.system!);

    const skyGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(120, 32, 32);

    const skyMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.BackSide,
      transparent: true,
    });

    const skySphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhysicalMaterial> = new THREE.Mesh(
      skyGeometry,
      skyMaterial,
    );
    skySphere.position.set(4, 10, -1);
    scene.add(skySphere);

    // Create point light
    const pointLight: THREE.PointLight = new THREE.PointLight(0x00ffff, 20, -10);
    pointLight.position.set(-2, 10, -18);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    camera.position.z = 30;

    const handleKeyDown = (event) => {
      if (particleSystem) {
        particleSystem.handleKey(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const animate = () => {
      const delta = clock.getDelta();
      animationFrameId.current = requestAnimationFrame(animate);
      particleSystem.animate();
      starsSystem.animate(delta);
      renderer.render(scene, camera);
    };
    controls.update();
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // === Cleanup ===
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      skyGeometry.dispose();
      skyMaterial.dispose();
      scene.remove(pointLight);
      scene.remove(skySphere);
      controls.dispose();
      particleSystem.dispose();
      starsSystem.dispose();
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      mountRef.current!.removeChild(renderer.domElement);
    };
  }, [clock]);

  return (
    <>
      <FPSStats/>
      <div ref={mountRef} style={{position: "fixed", top: "0", right: "0"}}/>
    </>
  );
};

export default ParticleSystem;
