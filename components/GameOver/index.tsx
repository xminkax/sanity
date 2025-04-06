import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {BufferGeometry, Color, LineBasicMaterial, LineSegments, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {generateSimilarShadeColorForParticles} from "@/lib/snake/color";

const pastelColors: [number, number, number][] = [
  [1.0, 0.2, 0.5],   // Hot pink
  [0.2, 0.8, 1.0],   // Electric cyan
  [1.0, 0.7, 0.2],   // Vivid orange
  [0.7, 0.3, 1.0]    // Vibrant violet
];

const GameOver: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const clock = useRef<THREE.Clock>(new THREE.Clock());
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const scene: Scene = new THREE.Scene();
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer: WebGLRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    mountRef.current?.appendChild(renderer.domElement);

    const stars = 2000;
    const positions: number[] = [];
    const opacities: number[] = [];
    const colors: number[] = [];
    const geometry: BufferGeometry = new THREE.BufferGeometry();
    const acceleration: number[] = [];

    const randomColor: [number, number, number] = pastelColors[Math.floor(Math.random() * pastelColors.length)];

    for (let i = 0; i < stars; i++) {
      const x: number = (Math.random() - 0.5) * 40;
      const y: number = (Math.random() - 0.5) * 20;
      const z: number = Math.random() * 10;
      positions.push(x, y, z, x, y, z + 1);
      opacities.push(1, 1);

      const pastelColor: Color = generateSimilarShadeColorForParticles(
        new THREE.Color(randomColor[0], randomColor[1], randomColor[2])
      );
      colors.push(
        pastelColor.r, pastelColor.g, pastelColor.b,
        pastelColor.r, pastelColor.g, pastelColor.b
      );

      acceleration[i] = 0.03;
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("opacity", new THREE.Float32BufferAttribute(opacities, 1));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const lineMaterial: LineBasicMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    });

    const starField: LineSegments = new THREE.LineSegments(geometry, lineMaterial);
    scene.add(starField);

    const animate = () => {
      const delta: number = clock.current.getDelta();
      animationFrameId.current = requestAnimationFrame(animate);

      const posArray: Float32Array = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < stars; i++) {
        acceleration[i] += acceleration[i];
        posArray[i * 6 + 2] += delta * 10 + acceleration[i];
        posArray[i * 6 + 5] += delta * 10 + acceleration[i];

        if (posArray[i * 6 + 5] > 18) {
          const z: number = Math.random() * 5;
          posArray[i * 6 + 5] = z;
          posArray[i * 6 + 2] = z + 1;
          acceleration[i] = 0.0;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
      mountRef.current!.removeChild(renderer.domElement);

      geometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{position: "absolute", top: "0", right: "0"}}/>
  );
};

export default GameOver;
