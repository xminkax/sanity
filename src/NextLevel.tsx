"use client";
// const, paint and reset abstract, textMesh abstract
import React, {MutableRefObject, useEffect, useRef} from "react";
import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import "./fireworks.css";
import {
  BufferGeometry,
  Color,
  MeshBasicMaterial,
  NormalBufferAttributes,
  PerspectiveCamera, Points,
  PointsMaterial,
  Scene,
  Texture,
  WebGLRenderer,
} from "three";
import {ColorHSL, generatePastelColor, generateSimilarShadeColorForParticles, generateSimilarShadeColorForText, Position} from "@/lib/snake/color";

const PARTICLE_COUNT: number = 800;

function getPosition(index): Position {
  const pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * index;
  const velocity = Math.random() * 3 + Math.random() * 1.5;
  return {
    x: velocity * Math.sin(pointBasicCoordinate),
    y: velocity * Math.cos(pointBasicCoordinate),
    z: Math.random() * 5 - 10
  };
}

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
    let textMesh, textMesh2;

    const particles: BufferGeometry<NormalBufferAttributes> = new THREE.BufferGeometry();
    const resetParticles = () => {
      const pos = particles.getAttribute("position");
      const {h, s, l}: ColorHSL = generatePastelColor();
      const color = new THREE.Color().setHSL(h, s, l);

      for (let i = 0; i < pos.count; i++) {
        const position: Position = getPosition(i);
        pos.setXYZ(i, position.x, position.y, position.z);

        const pastelColor: Color = generateSimilarShadeColorForParticles(color);
        particles.attributes.color.setXYZ(i, pastelColor.r, pastelColor.g, pastelColor.b);
      }

      textMesh.position.set(-5, -0.8, 0);
      const textColor: ColorHSL = generateSimilarShadeColorForText({h, s, l});
      textMesh.material.color.setHSL(textColor.h, textColor.s, textColor.l);
      textMesh2.position.set(0.6, -0.8, 0);
      textMesh2.material.color.setHSL(textColor.h, textColor.s, textColor.l);

      particles.attributes.color.needsUpdate = true;
      pos.needsUpdate = true;
    };

    const animateParticles = () => {
      const pos = particles.getAttribute("position");

      if (typeof textMesh !== "undefined") {
        textMesh.position.z = textMesh.position.z + 0.04;
      }
      if (typeof textMesh2 !== "undefined") {
        textMesh2.position.z = textMesh2.position.z + 0.04;
      }

      let pointBasicCoordinate: number, velocity: number, x: number, y: number;
      const EDGE_X = 22;
      for (let i = 0; i < pos.count; i++) {
        if (pos.getX(i) > EDGE_X) {
          resetParticles();
          break;
        }
        velocity = 0.008 + Math.random() * 0.2;
        pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * i;

        x = pos.getX(i) + Math.cos(pointBasicCoordinate) * velocity;
        y =
          pos.getY(i) + Math.sin(pointBasicCoordinate) * Math.cos(pointBasicCoordinate) * velocity;
        pos.setXY(i, x, y);
      }

      pos.needsUpdate = true;
    };

    const points: number[] = [];
    const colors: number[] = [];
    const colorHSL: ColorHSL = generatePastelColor();
    const color: Color = new THREE.Color().setHSL(colorHSL.h, colorHSL.s, colorHSL.l);

    for (let a: number = 0; a < PARTICLE_COUNT; a++) {
      const position: Position = getPosition(a);
      points.push(position.x, position.y, position.z);

      const pastelColor: Color = generateSimilarShadeColorForParticles(color);
      colors.push(pastelColor.r, pastelColor.g, pastelColor.b);
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
      const textGeometry = new TextGeometry("Congrats", {
        font: font,
        size: 0.8,
        depth: 0.1,
      });
      textGeometry.computeBoundingBox();
      const textMaterial = new THREE.MeshBasicMaterial({
        opacity: 0.8,
        transparent: true,
      });
      let textColor: ColorHSL;
      textColor = generateSimilarShadeColorForText(colorHSL);
      textMaterial.color.setHSL(textColor.h, textColor.s, textColor.l);

      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-5, -0.8, 0);
      textMesh.rotation.x = 99.8;

      camera.position.z = 12;
      scene.add(textMesh);

      const textGeometry2: TextGeometry = new TextGeometry("Level up", {
        font: font,
        size: 0.8,
        depth: 0.1,
      });
      textGeometry2.computeBoundingBox();
      const textMaterial2: MeshBasicMaterial = new THREE.MeshBasicMaterial({
        opacity: 0.8,
        transparent: true,
      });
      textColor = generateSimilarShadeColorForText(colorHSL);
      textMaterial2.color.setHSL(textColor.h, textColor.s, textColor.l);
      textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);
      textMesh2.position.set(0.6, -0.8, 0);
      textMesh2.rotation.x = 99.8;

      camera.position.z = 12;
      scene.add(textMesh2);
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
