import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./LorenzAttractor.frag";
import vertexShader from "./LorenzAttractor.vert";
import { BufferGeometry, PerspectiveCamera, Points, Scene, WebGLRenderer } from "three";

const DELAY_ANIMATION = 5000;

const LorenzAttractor: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const clock = useRef(new THREE.Clock());
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const scene: Scene = new THREE.Scene();
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 70);
    camera.rotation.z = 10;

    const renderer: WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const maxPoints = 30000;
    const positions = new Float32Array(maxPoints * 3);
    const colors = new Float32Array(maxPoints * 3);

    let x: number = 0.1,
      y: number = 0.0,
      z: number = 0.0;
    positions[0] = x;
    positions[1] = y;
    positions[2] = z;
    colors[0] = 0.0;
    colors[1] = 1.0;
    colors[2] = 0.7;
    let count = 1;

    const geometry: BufferGeometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load("spikey.png") },
        pointSize: { value: 10.0 },
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    const points: Points = new THREE.Points(geometry, material);
    scene.add(points);

    // Lorenz system parameters and time step
    const sigma: number = 10.0;
    const rho: number = 28.0;
    const beta: number = 8.0 / 3.0;
    const dt: number = 0.005;
    let time: number = 0;
    const pointsPerFrame: number = 3;

    const animate = () => {
      const deltaTime: number = clock.current.getDelta();
      time += deltaTime;
      animationFrameId.current = requestAnimationFrame(animate);

      let dx, dy, dz;
      for (let j = 0; j < Math.floor((pointsPerFrame * time) / 4); j++) {
        if (count < maxPoints) {
          dx = sigma * (y - x) * dt;
          dy = (x * (rho - z) - y) * dt;
          dz = (x * y - beta * z) * dt;
          x += dx;
          y += dy;
          z += dz;

          positions[count * 3] = x + 0.01 * Math.sin(10 * count * dt);
          positions[count * 3 + 1] = y + 0.01 * Math.sin(10 * count * dt);
          positions[count * 3 + 2] = z;

          colors[count * 3] = 0.0;
          colors[count * 3 + 1] = 1.0;
          colors[count * 3 + 2] = 0.7 + z / 300;

          count++;
        }

        geometry.setDrawRange(0, count);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
      }

      points.rotation.z += 0.0005;
      renderer.render(scene, camera);
    };

    let timeoutId: NodeJS.Timeout | null = setTimeout(() => {
      animate();
      timeoutId = null;
    }, DELAY_ANIMATION);

    const onWindowResize = () => {
      if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (mountRef.current) {
        mountRef.current!.removeChild(renderer.domElement);
      }

      cancelAnimationFrame(animationFrameId.current);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      camera.clear();
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", top: "0", right: "0", zIndex: -1 }} />;
};

export default LorenzAttractor;
