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
  PerspectiveCamera,
  PointsMaterial,
  Scene,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";

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
    let pointBasicCoordinate: number,
      velocity: number,
      x: number,
      y: number,
      z: number,
      color: Color;

    const PARTICLE_COUNT: number = 800;
    const particles: BufferGeometry<NormalBufferAttributes> = new THREE.BufferGeometry();
    const resetParticles = () => {
      const pos = particles.getAttribute("position");
      const [h, s, l] = getColor();
      for (let i = 0; i < pos.count; i++) {
        pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * i;
        velocity = Math.random() * 3 + Math.random() * 1.5;
        y = velocity * Math.cos(pointBasicCoordinate);
        x = velocity * Math.sin(pointBasicCoordinate);
        z = Math.random() * 5 - 10;
        pos.setXYZ(i, x, y, z);

        color = new THREE.Color().setHSL(h, s, l);
        particles.attributes.color.setXYZ(i, color.r - 0.3 + Math.random() * 0.3, color.g, color.b);
      }

      textMesh.position.set(-5, -0.8, 0);
      textMesh.material.color.setHSL(h, s + 0.2, l);

      textMesh2.position.set(0.6, -0.8, 0);
      textMesh2.material.color.setHSL(h, s + 0.2, l);

      particles.attributes.color.needsUpdate = true;
      pos.needsUpdate = true;
    };

    function getColor() {
      return [
        parseFloat(Math.random().toFixed(2)),
        parseFloat(((45 + 20 * Math.random()) / 100).toFixed(2)),
        parseFloat(((50 + 20 * Math.random()) / 100).toFixed(2)),
      ];
    }

    const animateParticles = () => {
      const pos = particles.getAttribute("position");

      if (typeof textMesh !== "undefined") {
        textMesh.position.z = textMesh.position.z + 0.04;
      }
      if (typeof textMesh2 !== "undefined") {
        textMesh2.position.z = textMesh2.position.z + 0.04;
      }

      let pointBasicCoordinate: number, velocity: number, x: number, y: number;

      for (let i = 0; i < pos.count; i++) {
        if (pos.getX(i) > 22) {
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
    const point: Vector3 = new THREE.Vector3();

    for (let a: number = 0; a < PARTICLE_COUNT; a++) {
      pointBasicCoordinate = ((2 * Math.PI) / PARTICLE_COUNT) * a;
      velocity = 0.008 + Math.random() * 0.8;
      x = velocity * Math.cos(pointBasicCoordinate);
      y = velocity * Math.sin(pointBasicCoordinate);
      z = Math.random() * 10 - 20;

      const color = new THREE.Color();
      const [h, s, l] = getColor();
      color.setHSL(h, s, l, THREE.SRGBColorSpace);
      colors.push(1, 1, 1);

      points.push(point.x, point.y, point.z);
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

    const particleSystem = new THREE.Points(particles, particleMaterial);

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
        color: "#24242e",
        opacity: 0.8,
        transparent: true,
      });
      const [h, s, l] = getColor();
      textMaterial.color.setHSL(h, s, l);
      console.log(h, s, l);
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
        color: "#24242e",
        opacity: 0.8,
        transparent: true,
      });
      textMaterial2.color.setHSL(h, s, l);
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
