"use client";
import React, {MutableRefObject, useEffect, useRef} from "react";
import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import "./fireworks.css";
import {
  BufferAttribute,
  BufferGeometry,
  Color, InterleavedBufferAttribute, Mesh,
  MeshBasicMaterial,
  NormalBufferAttributes,
  PerspectiveCamera, Points,
  PointsMaterial,
  Scene,
  Texture,
  WebGLRenderer,
} from "three";
import {
  ColorHSL,
  generatePastelColor,
  generateSimilarShadeColorForParticles,
  generateSimilarShadeColorForText,
} from "@/lib/snake/color";

const generateTextMesh = (font, text, position) => {
  const textGeometry: TextGeometry = new TextGeometry(text, {
    font: font,
    size: 0.8,
    depth: 0.1,
  });
  textGeometry.computeBoundingBox();
  const textMaterial: MeshBasicMaterial = new THREE.MeshBasicMaterial({
    opacity: 0.8,
    transparent: true,
  });

  const textMesh: Mesh<TextGeometry, MeshBasicMaterial> = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(position.x, position.y, position.z);
  textMesh.rotation.x = 99.8;

  return textMesh;
}

const PARTICLE_COUNT: number = 800;

const Fireworks: React.FC = () => {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(
    null,
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene: Scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.025);
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current?.width / canvasRef.current?.height,
      0.1,
      1000,
    );
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({canvas: canvasRef.current});
    const textMesh: Mesh<TextGeometry, MeshBasicMaterial>[] = [];
    const textMeshSetup = [
        {position: {x: -5, y: -0.8, z: 0}, text: "Congrats"},
        {
          position: {x: 0.6, y: -0.8, z: 0}, text: "Level up"
        }
      ]
    ;
    const particles: BufferGeometry = new THREE.BufferGeometry();

    const resetParticles = () => {
      const particlesPosition: BufferAttribute | InterleavedBufferAttribute = particles.getAttribute("position");
      const {h, s, l}: ColorHSL = generatePastelColor();
      const color = new THREE.Color().setHSL(h, s, l);
      let pointBasicCoordinate: number;
      let velocity: number;

      for (let i = 0; i < particlesPosition.count; i++) {
        pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * i;
        velocity = Math.random() * 2 + Math.random() * 1.5;
        particlesPosition.setXYZ(i, velocity * Math.sin(pointBasicCoordinate), velocity * Math.cos(pointBasicCoordinate), Math.random() * 5 - 10);

        const pastelColor: Color = generateSimilarShadeColorForParticles(color);
        particles.attributes.color.setXYZ(i, pastelColor.r, pastelColor.g, pastelColor.b);
      }

      const textColor: ColorHSL = generateSimilarShadeColorForText({h, s, l});
      for (let i: number = 0; i < textMesh.length; i++) {
        textMesh[i].position.set(textMeshSetup[i].position.x, textMeshSetup[i].position.y, textMeshSetup[i].position.z);
        textMesh[i].material.color.setHSL(textColor.h, textColor.s, textColor.l);
      }

      particles.attributes.color.needsUpdate = true;
      particlesPosition.needsUpdate = true;
    };

    const animateParticles = () => {
      const particlesPosition: BufferAttribute | InterleavedBufferAttribute = particles.getAttribute("position");

      if (textMesh.length > 0) {
        for (let i: number = 0; i < textMesh.length; i++) {
          textMesh[i].position.z = textMesh[i].position.z + 0.04;
        }
      }

      let pointBasicCoordinate: number, velocity: number, x: number, y: number;
      const EDGE_X: number = 22;
      for (let i: number = 0; i < particlesPosition.count; i++) {
        if (particlesPosition.getX(i) > EDGE_X) {
          resetParticles();
          break;
        }
        velocity = 0.008 + Math.random() * 0.2;
        pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * i;

        x = particlesPosition.getX(i) + Math.cos(pointBasicCoordinate) * velocity;
        y =
          particlesPosition.getY(i) + Math.sin(pointBasicCoordinate) * Math.cos(pointBasicCoordinate) * velocity;
        particlesPosition.setXY(i, x, y);
      }

      particlesPosition.needsUpdate = true;
    };

    const points: number[] = [];
    const colors: number[] = [];

    for (let a: number = 0; a < PARTICLE_COUNT; a++) {
      points.push(0, 0, 0);
      colors.push(0, 0, 0);
    }

    particles.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    particles.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const sprite: Texture = new THREE.TextureLoader().load("/disc.png");
    sprite.colorSpace = THREE.SRGBColorSpace;

    const particleMaterial: PointsMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      sizeAttenuation: true,
      alphaTest: 0.5,
      map: sprite,
      transparent: true,
    });

    const particleSystem: Points<BufferGeometry> = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    const loader = new FontLoader();
    loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      for (let i: number = 0; i < textMeshSetup.length; i++) {
        textMesh[i] = generateTextMesh(font, textMeshSetup[i].text, textMeshSetup[i].position);
        scene.add(textMesh[i]);
      }

      camera.position.z = 12;
      resetParticles();
    });
    const render = () => {
      requestAnimationFrame(render);
      animateParticles();
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    render();
  }, []);
  return (
    <div className="next-level">
      <button className="btn btn-next-level">Next level</button>
      <canvas
        ref={canvasRef}
        width="370"
        height="244"
        style={{
          border: "0.2rem solid",
          borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
        }}
      />
    </div>
  );
};

export default Fireworks;
