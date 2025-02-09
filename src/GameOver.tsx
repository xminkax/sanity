"use client";
// const, paint and reset abstract, can I abstract colors and position to function star? delta vs floor repeat
import React, {MutableRefObject, useEffect, useRef} from "react";
import {generatePastelColor, ColorHSL, Position, generateSimilarShadeColorForText} from "@/lib/snake/color";
import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
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
  MeshBasicMaterial, Mesh,
} from "three";

const PARTICLE_COUNT: number = 1000;
const textMeshPosition: { x: number, y: number, z: number } = {
  x: -3.5, y: -0.3, z: 0
}

interface Color {
  r: number,
  g: number,
  b: number
}

function getPastelColor(color): Color {
  return {r: color.r - 0.5 + Math.random() * 0.5, g: color.g, b: color.b} as Color;
}

function getPosition(index: number, velocityA?: number): Position {
  const DISTRIBZ: number = 30;
  const FLOOR_REPEAT: number = 10;
  const pointBasicCoordinate: number = ((2 * Math.PI) / PARTICLE_COUNT) * index;
  const velocity: number = velocityA || 0.5 + Math.random() * 1.5;
  return {
    x: velocity * Math.cos(pointBasicCoordinate),
    y: velocity * Math.sin(pointBasicCoordinate),
    z: Math.random() * DISTRIBZ - FLOOR_REPEAT
  };
}

const GameOver: React.FC = () => {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(
    null,
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene: Scene = new THREE.Scene();
    let textMesh: Mesh;
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current?.width / canvasRef.current?.height,
      0.1,
      1000,
    );
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({canvas: canvasRef.current});

    const particles: BufferGeometry<NormalBufferAttributes> = new THREE.BufferGeometry();
    const resetParticles = (): void => {
      const pos: BufferAttribute | InterleavedBufferAttribute = particles.getAttribute("position");
      const colorHsl: ColorHSL = generatePastelColor();
      const color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

      for (let i: number = 0; i < pos.count; i++) {
        const position: Position = getPosition(i);
        pos.setXYZ(i, position.x, position.y, position.z);

        const pastelColor: Color = getPastelColor(color);
        particles.attributes.color.setXYZ(i, pastelColor.r, pastelColor.g, pastelColor.b);
      }

      textMesh.position.set(textMeshPosition.x, textMeshPosition.y, textMeshPosition.z);
      const textColor: ColorHSL = generateSimilarShadeColorForText(colorHsl);
      textMesh.material.color.setHSL(textColor.h, textColor.s, textColor.l);

      particles.attributes.color.needsUpdate = true;
      pos.needsUpdate = true;
    };

    const animateParticles = (): void => {
      const pos: BufferAttribute | InterleavedBufferAttribute = particles.getAttribute("position");
      if (typeof textMesh !== "undefined") {
        textMesh.position.z = textMesh.position.z + 0.02;
      }
      const EDGE_X = 4;
      for (let i: number = 0; i < pos.count; i++) {
        if (pos.getX(i) > EDGE_X) {
          resetParticles();
          break;
        }
        const position: Position = getPosition(i, 0.008 + Math.random() * 0.003);
        pos.setXYZ(i, pos.getX(i) + position.x, pos.getY(i) + position.y, pos.getZ(i) + 0.005);
      }

      pos.needsUpdate = true;
    };

    const points: number[] = [];
    const colors: number[] = [];
    const colorHsl: ColorHSL = generatePastelColor();
    const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

    for (let a = 0; a < PARTICLE_COUNT; a++) {
      const position: Position = getPosition(a);
      points.push(position.x, position.y, position.z);
      const pastelColor: Color = getPastelColor(color);
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

    scene.background = new THREE.Color().setRGB(0.002, 0.002, 0.002);
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
      textMesh.position.set(textMeshPosition.x, textMeshPosition.y, textMeshPosition.z);
      textMesh.rotation.x = 99.8;

      camera.position.z = 6;
      scene.add(textMesh);
    });

    const render = (): void => {
      requestAnimationFrame(render);
      animateParticles();
      renderer.render(scene, camera);
    };
    render();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        width="600"
        height="400"
        style={{
          border: "0.2rem solid",
          borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
        }}
      />
    </>
  );
};

export default GameOver;
