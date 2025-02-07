"use client";
// const, paint and reset abstract, can I abstract colors and position to function star? delta vs floor repeat
import React, {MutableRefObject, useEffect, useRef} from "react";
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
  Vector3,
  PointsMaterial,
  Points,
  Object3DEventMap,
  MeshBasicMaterial,
} from "three";

function getColor(): [number, number, number] {
  return [
    parseFloat(Math.random().toFixed(2)),
    parseFloat(((45 + 20 * Math.random()) / 100).toFixed(2)),
    parseFloat(((50 + 20 * Math.random()) / 100).toFixed(2)),
  ];
}

const Fireworks: React.FC = () => {
  const DISTRIBZ: number = 30;
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(
    null,
  );
  const FLOOR_REPEAT: number = 10;
  const PARTICLE_COUNT: number = 1000;

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene: Scene = new THREE.Scene();
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current?.width / canvasRef.current?.height,
      0.1,
      1000,
    );
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({canvas: canvasRef.current});
    let textMesh,
      pointBasicCoordinate: number,
      velocity: number,
      x: number,
      y: number,
      z: number,
      color: Color;

    const particles: BufferGeometry<NormalBufferAttributes> = new THREE.BufferGeometry();
    const resetParticles = (): void => {
      const pos: BufferAttribute | InterleavedBufferAttribute = particles.getAttribute("position");
      const [h, s, l]: number[] = getColor();
      for (let i: number = 0; i < pos.count; i++) {
        pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * i;
        velocity = 0.5 + Math.random() * 1.5;
        x = velocity * Math.cos(pointBasicCoordinate);
        y = velocity * Math.sin(pointBasicCoordinate);
        z = Math.random() * DISTRIBZ - FLOOR_REPEAT;
        pos.setXYZ(i, x, y, z);

        color = new THREE.Color().setHSL(h, s, l);
        particles.attributes.color.setXYZ(i, color.r - 0.3 + Math.random() * 0.3, color.g, color.b);
      }

      textMesh.position.set(-3.5, -0.3, 0);
      textMesh.material.color.setHSL(h, s + 0.1, l);

      particles.attributes.color.needsUpdate = true;
      pos.needsUpdate = true;
    };

    const animateParticles = (): void => {
      const pos: BufferAttribute | InterleavedBufferAttribute = particles.getAttribute("position");
      let velocity: number, pointBasicCoordinate: number, x: number, y: number, z: number;

      if (typeof textMesh !== "undefined") {
        textMesh.position.z = textMesh.position.z + 0.02;
      }

      for (let i: number = 0; i < pos.count; i++) {
        if (pos.getX(i) > 4) {
          resetParticles();
          break;
        }
        velocity = 0.008 + Math.random() * 0.003;
        pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * i;

        x = pos.getX(i) + Math.cos(pointBasicCoordinate) * velocity;
        y = pos.getY(i) + Math.sin(pointBasicCoordinate) * velocity;
        z = pos.getZ(i) + 0.005;
        pos.setXYZ(i, x, y, z);
      }

      pos.needsUpdate = true;
    };

    const points: number[] = [];
    const colors: number[] = [];
    const point: Vector3 = new THREE.Vector3();

    for (let a = 0; a < PARTICLE_COUNT; a++) {
      pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * a;
      velocity = 0.5 + Math.random() * 1.5;
      point.x = velocity * Math.cos(pointBasicCoordinate);
      point.y = velocity * Math.sin(pointBasicCoordinate);
      point.z = Math.random() * DISTRIBZ - FLOOR_REPEAT;

      color = new THREE.Color();
      color.setRGB(Math.random(), Math.random(), Math.random(), THREE.SRGBColorSpace);
      colors.push(color.r, color.g, color.b);
      points.push(point.x, point.y, point.z);
    }

    particles.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    particles.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const particleMaterial: PointsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
    });

    const particleSystem: Points<
      BufferGeometry<NormalBufferAttributes>,
      PointsMaterial,
      Object3DEventMap
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
        color: "#24242e",
        opacity: 0.7,
        transparent: true,
      });
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-3.5, -0.3, 0);
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
        width="370"
        height="244"
        style={{
          border: "0.2rem solid",
          borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
        }}
      />
    </>
  );
};

export default Fireworks;
