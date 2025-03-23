"use client";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {
  generatePastelColor,
  ColorHSL,
  Position,
  generateSimilarShadeColorForText,
  generateSimilarShadeColorForParticles,
} from "@/lib/snake/color";
import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {MOBILE_SIZE_CANCAS} from "@/constants/snake";
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
  Texture,
} from "three";
import {Press_Start_2P} from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const PARTICLE_COUNT: number = 900;
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

const GameOver: React.FC = ({resetGame}) => {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(
    null,
  );
  let time = 0;

  useEffect(() => {
    const clock = new THREE.Clock();

    if (!canvasRef.current) return;
    const scene: Scene = new THREE.Scene();
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current?.width / canvasRef.current?.height,
      0.1,
      1000,
    );
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({canvas: canvasRef.current, alpha: true});
    renderer.setPixelRatio(1.1);
    renderer.setClearColor("#0d0d1d");

    const particles: BufferGeometry<NormalBufferAttributes> = new THREE.BufferGeometry();
    const resetParticles = (): void => {
      const particlesPosition: BufferAttribute | InterleavedBufferAttribute =
        particles.getAttribute("position");
      const colorHsl: ColorHSL = generatePastelColor();
      const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

      for (let i: number = 0; i < particlesPosition.count; i++) {
        const position: Position = getPosition(i);
        particlesPosition.setXYZ(i, position.x+0.8, position.y, position.z);

        const pastelColor: Color = generateSimilarShadeColorForParticles(color);
        particles.attributes.color.setXYZ(i, pastelColor.r, pastelColor.g, pastelColor.b);
      }

      particles.attributes.color.needsUpdate = true;
      particlesPosition.needsUpdate = true;
    };

    const animateParticles = (): void => {
      time += 0.05;
      const delta = clock.getDelta();
      const particlesPosition: BufferAttribute | InterleavedBufferAttribute =
        particles.getAttribute("position");
      const EDGE_X = 4;
      for (let i: number = 0; i < particlesPosition.count; i++) {
        if (particlesPosition.getX(i) > EDGE_X) {
          resetParticles();
          break;
        }
        const position: Position = getPosition(i, 0.008 + Math.random() * 0.003);
        particlesPosition.setXYZ(
          i,
          particlesPosition.getX(i) + position.x* Math.cos(time * 0.05),
          particlesPosition.getY(i) + position.y* Math.sin(time * 0.05),
          particlesPosition.getZ(i) + delta,
        );
        particleMaterial.size = 0.3 * Math.sin(i/5000);
      }



      particlesPosition.needsUpdate = true;
    };

    const points: number[] = [];
    const colors: number[] = [];
    const colorHsl: ColorHSL = generatePastelColor();
    const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

    for (let a: number = 0; a < PARTICLE_COUNT; a++) {
      points.push(0, 0, 0);
      const pastelColor: Color = generateSimilarShadeColorForParticles(color);
      colors.push(pastelColor.r, pastelColor.g, pastelColor.b);
    }

    particles.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    particles.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const sprite: Texture = new THREE.TextureLoader().load("/disc.png");
    //     sprite.colorSpace = THREE.SRGBColorSpace;

    const particleMaterial: PointsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      sizeAttenuation: true,
      alphaTest: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: sprite,
    });

    const particleSystem: Points<
      BufferGeometry<NormalBufferAttributes>,
      PointsMaterial
    > = new THREE.Points(particles, particleMaterial);

    // scene.background = new THREE.Color().setRGB(0.002, 0.002, 0.002);
    scene.add(particleSystem);

    camera.position.z = 2.8;
    resetParticles();

    const render = (): void => {
      requestAnimationFrame(render);
      animateParticles();
      renderer.render(scene, camera);
    };
    render();
    return () => {

      // canvasRef.current.removeChild(renderer.domElement);
      // window.removeEventListener("resize", handleResize);
      particles.dispose();
      particleMaterial.dispose();
      scene.remove(particleSystem);
      renderer.dispose();

    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{position: "absolute", top: "0", right: "0"}}
    />
  );
};

export default GameOver;
