import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Color } from "three";
import {
  ColorHSL,
  generatePastelColor,
  generateSimilarShadeColorForParticles,
} from "@/lib/snake/color";
import FPSStats from "react-fps-stats";

const WarpStarField = () => {
  const mountRef = useRef(null);
  let resetCounter = 0;
  const clock = new THREE.Clock();
  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Starfield
    const stars = 500;
    const starVertices = [];
    const starColors = [];
    const geometry = new THREE.BufferGeometry();
    const colorHsl: ColorHSL = generatePastelColor();
    const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

    for (let i = 0; i < stars; i++) {
      let x = (Math.random() - 0.5) * 20;
      let y = (Math.random() - 0.5) * 20;
      let z = Math.random() * -50;
      starVertices.push(x, y, z, x, y, z + 1); // Line segment

      const pastelColor: Color = generateSimilarShadeColorForParticles(color);
      // let pastelColor = new THREE.Color(Math.random(), Math.random(), Math.random());
      starColors.push(
        pastelColor.r,
        pastelColor.g,
        pastelColor.b,
        pastelColor.r,
        pastelColor.g,
        pastelColor.b,
      );
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
    const starField = new THREE.LineSegments(geometry, lineMaterial);
    scene.add(starField);

    const resetStars = () => {
      let starVertices = starField.geometry.attributes.position.array;
      let starColors = starField.geometry.attributes.color.array;
      const colorHsl: ColorHSL = generatePastelColor();
      const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);

      for (let i = 0; i < stars; i++) {
        const pastelColor: Color = generateSimilarShadeColorForParticles(color);
        let z = Math.random() * -50;
        // starVertices[i * 6] = x;
        // starVertices[i * 6 + 1] = y;
        starVertices[i * 6 + 2] = z;
        // starVertices[i * 6 + 3] = x;
        // starVertices[i * 6 + 4] = y;
        starVertices[i * 6 + 5] = z + 1;

        // let color = new THREE.Color(Math.random(), Math.random(), Math.random());
        starColors[i * 6] = pastelColor.r;
        starColors[i * 6 + 1] = pastelColor.g;
        starColors[i * 6 + 2] = pastelColor.b;
        starColors[i * 6 + 3] = pastelColor.r;
        starColors[i * 6 + 4] = pastelColor.g;
        starColors[i * 6 + 5] = pastelColor.b;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    };

    // Animate Warp Effect
    const animate = () => {
      const delta = clock.getDelta();
      resetCounter++;
      requestAnimationFrame(animate);
      let positions = starField.geometry.attributes.position.array;
      let colors = starField.geometry.attributes.color.array;
      const colorHsl: ColorHSL = generatePastelColor();
      const color: Color = new THREE.Color().setHSL(colorHsl.h, colorHsl.s, colorHsl.l);
      if (positions[positions.length - 1] > 5) {
        // reset();
        // return;
      }
      for (let i = 0; i < positions.length; i += 6) {
        positions[i + 2] += delta * 10; // Move stars closer
        positions[i + 5] += delta * 10;

        //reset z coordinates
        if (positions[i + 2] > 5) {
          positions[i + 2] = -50;
          positions[i + 5] = -49.8;
          // console.log(i);
          // break;
        }
        if (resetCounter === 200) {
          resetCounter = 0;
          resetStars();
          break;
        }
      }
      starField.geometry.attributes.position.needsUpdate = true;
      starField.geometry.attributes.color.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ position: "absolute", top: "0", right: "0" }} />
      <FPSStats />
    </>
  );
};

export default WarpStarField;
