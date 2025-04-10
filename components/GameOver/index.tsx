import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import {generateSimilarShadeColorForParticles, Color} from "@/lib/snake/color";
import {Press_Start_2P} from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const pastelColors: [number, number, number][] = [
  [1.0, 0.2, 0.5], // Hot pink
  [0.2, 0.8, 1.0], // Electric cyan
  [1.0, 0.7, 0.2], // Vivid orange
  [0.7, 0.3, 1.0], // Vibrant violet
];

type props = {
  resetGame: () => void;
};

const GameOver: React.FC<props> = ({resetGame}: props) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const clock = useRef<THREE.Clock>(new THREE.Clock());
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene: Scene = new Scene();
    const camera: PerspectiveCamera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 20;

    const renderer: WebGLRenderer = new WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    const stars = 2000;
    const positions: number[] = [];
    const colors: number[] = [];
    const geometry: BufferGeometry = new BufferGeometry();
    const acceleration: number[] = [];

    const randomColor: [number, number, number] =
      pastelColors[Math.floor(Math.random() * pastelColors.length)];

    for (let i = 0; i < stars; i++) {
      const x: number = (Math.random() - 0.5) * 40;
      const y: number = (Math.random() - 0.5) * 20;
      const z: number = Math.random() * 10;
      positions.push(x, y, z, x, y, z + 1);

      const pastelColor: Color = generateSimilarShadeColorForParticles(
        new THREE.Color(randomColor[0], randomColor[1], randomColor[2]),
      );
      colors.push(
        pastelColor.r,
        pastelColor.g,
        pastelColor.b,
        pastelColor.r,
        pastelColor.g,
        pastelColor.b,
      );

      acceleration[i] = 0.03;
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
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
        posArray[i * 6 + 2] += delta * 8 + acceleration[i];
        posArray[i * 6 + 5] += delta * 8 + acceleration[i];

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
      if (mount && mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);

      geometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className={`w-full h-64 ${pressStart2P.className}`}>
    <div ref={mountRef} className="absolute  top-0 left-0 w-full"/>
    <div
      className={`game-over-mobile flex flex-col items-center justify-center h-screen absolute left-1/2 -translate-x-1/2`}
    >
      <h1
        className="text-6xl uppercase  mb-8 font-bold text-center text-[wheat]"
        style={{textShadow: "2px 2px 0px rgba(224, 181, 173, 0.8)"}}
      >
        Game over
      </h1>
      <button onClick={resetGame} className="mt-6 px-6 py-3 reset-btn text-2xl">Play</button>
    </div>
  </div>;
};

export default GameOver;
