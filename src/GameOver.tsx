"use client";
import React, { MutableRefObject, useEffect, useRef } from "react";
import {
  generatePastelColor,
  ColorHSL,
  Position,
  generateSimilarShadeColorForText,
  generateSimilarShadeColorForParticles,
} from "@/lib/snake/color";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import "./fireworks.css";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  InterleavedBufferAttribute,
  BufferAttribute,
  BufferGeometry,
  NormalBufferAttributes,
  Color,
  PointsMaterial,
  Points,
  MeshBasicMaterial,
  Mesh,
} from "three";
import Image from "next/image";
import Gesture from "@/public/gesture.svg";

const PARTICLE_COUNT: number = 1000;
const textMeshPosition: Position = {
  x: -3.5,
  y: -0.3,
  z: -6,
};

function getPosition(index: number, velocityA?: number): Position {
  const DISTRIBZ: number = 30;
  const FLOOR_REPEAT: number = 10;
  const pointBasicCoordinate: number = ((2 * Math.PI) / PARTICLE_COUNT) * index;
  const velocity: number = velocityA || 0.5 + Math.random() * 1.5;
  return {
    x: velocity * Math.cos(pointBasicCoordinate),
    y: velocity * Math.sin(pointBasicCoordinate),
    z: Math.random() * DISTRIBZ - FLOOR_REPEAT,
  };
}

const GameOver: React.FC = ({gameState}) => {
  let canvasWidth = 330;
  let canvasHeight = 270;
  if (window.innerWidth > 640) {
    canvasWidth = 660;
    canvasHeight = 540;
  }
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(
    null,
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene: Scene = new THREE.Scene();
    let textMesh: Mesh<TextGeometry, MeshBasicMaterial>;
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current?.width / canvasRef.current?.height,
      0.1,
      1000,
    );
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const particles: BufferGeometry<NormalBufferAttributes> = new THREE.BufferGeometry();
    const resetParticles = (): void => {
      const particlesPosition: BufferAttribute | InterleavedBufferAttribute =
        particles.getAttribute("position");
      const colorHsl: ColorHSL = generatePastelColor();
      const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

      for (let i: number = 0; i < particlesPosition.count; i++) {
        const position: Position = getPosition(i);
        particlesPosition.setXYZ(i, position.x, position.y, position.z);

        const pastelColor: Color = generateSimilarShadeColorForParticles(color);
        particles.attributes.color.setXYZ(i, pastelColor.r, pastelColor.g, pastelColor.b);
      }

      textMesh.position.set(textMeshPosition.x, textMeshPosition.y, textMeshPosition.z);
      const textColor: ColorHSL = generateSimilarShadeColorForText(colorHsl);
      textMesh.material.color.setHSL(textColor.h, textColor.s, textColor.l);

      particles.attributes.color.needsUpdate = true;
      particlesPosition.needsUpdate = true;
    };

    const animateParticles = (): void => {
      const particlesPosition: BufferAttribute | InterleavedBufferAttribute =
        particles.getAttribute("position");
      if (typeof textMesh !== "undefined") {
        textMesh.position.z = textMesh.position.z + 0.02;
      }
      const EDGE_X = 5;
      for (let i: number = 0; i < particlesPosition.count; i++) {
        if (particlesPosition.getX(i) > EDGE_X) {
          resetParticles();
          break;
        }
        const position: Position = getPosition(i, 0.008 + Math.random() * 0.003);
        particlesPosition.setXYZ(
          i,
          particlesPosition.getX(i) + position.x,
          particlesPosition.getY(i) + position.y,
          particlesPosition.getZ(i) + 0.001,
        );
      }

      particlesPosition.needsUpdate = true;
    };

    const points: number[] = [];
    const colors: number[] = [];
    const colorHsl: ColorHSL = generatePastelColor();
    const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

    for (let a: number = 0; a < PARTICLE_COUNT; a++) {
      const position: Position = getPosition(a);
      points.push(0,0,0);
      const pastelColor: Color = generateSimilarShadeColorForParticles(color);
      colors.push(pastelColor.r, pastelColor.g, pastelColor.b);
    }

    particles.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    particles.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const particleMaterial: PointsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
    });

    const particleSystem: Points<
      BufferGeometry<NormalBufferAttributes>,
      PointsMaterial
    > = new THREE.Points(particles, particleMaterial);

    // scene.background = new THREE.Color().setRGB(0.002, 0.002, 0.002);
    scene.add(particleSystem);

    const loader: FontLoader = new FontLoader();
    loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("Game Over", {
        font: font,
        size: 1,
        depth: 0.1,
      });
      textGeometry.computeBoundingBox();
      const textMaterial: MeshBasicMaterial = new THREE.MeshBasicMaterial({
        opacity: 0.7,
        transparent: true,
      });
      const textColor: ColorHSL = generateSimilarShadeColorForText(colorHsl);
      textMaterial.color.setHSL(textColor.h, textColor.s, textColor.l);
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-10,-10,-10);
      textMesh.rotation.x = 99.8;

      camera.position.z = 2;
      scene.add(textMesh);
      resetParticles();
      // resetParticles();
    });

    const render = (): void => {
      requestAnimationFrame(render);
      animateParticles();
      renderer.render(scene, camera);
    };
    render();
  }, []);

  return (
    <div style={{zIndex: 2, position: 'relative'}}>
      <div style={{marginLeft: "1rem"}}>1</div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          backgroundColor: "transparent",
          border: "0.2rem solid",
          borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
        }}
      />
      <div className="overlay-game-over">
        <button
          className="home btn-snake game-over px-6 py-3 text-white font-bold text-2xl rounded-lg shadow-md hover:bg-[#32b8bd] transition duration-300
            uppercase"
          onClick={() => gameState(2)}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default GameOver;
