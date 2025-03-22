"use client";
import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
function getColorFromTime(time) {
  let index = Math.floor(time * colorPalette.length) % colorPalette.length;
  return colorPalette[index];
}
const colorPalette = [
  new THREE.Color(65 / 255, 105 / 255, 225 / 255), // Base Royal Blue
  new THREE.Color(106 / 255, 144 / 255, 241 / 255), // Lighter Blue
  new THREE.Color(31 / 255, 60 / 255, 126 / 255),  // Darker Blue
  new THREE.Color(58 / 255, 107 / 255, 155 / 255), // Muted Blue
  new THREE.Color(76 / 255, 128 / 255, 179 / 255)  // Desaturated Blue
];
function getBlueGradient(t) {
  // t goes from 0 to 1
  let r, g, b;


  if (t < 0.33) {
    // Dark Red → Mid Orange
    let ratio = t / 0.33;
    r = Math.round(139 * (1 - ratio) + 200 * ratio);
    g = Math.round(0 * (1 - ratio) + 40 * ratio);
    b = Math.round(0 * (1 - ratio) + 10 * ratio);
  } else if (t < 0.66) {
    // Mid Orange → Brighter Orange
    let ratio = (t - 0.33) / 0.33;
    r = Math.round(200 * (1 - ratio) + 255 * ratio);
    g = Math.round(40 * (1 - ratio) + 100 * ratio);
    b = Math.round(10 * (1 - ratio) + 20 * ratio);
  } else {
    // Brighter Orange → Yellow
    let ratio = (t - 0.66) / 0.34;
    r = 255;
    g = Math.round(100 * (1 - ratio) + 255 * ratio);
    b = Math.round(20 * (1 - ratio) + 0 * ratio);
  }
  return [r, g, b];
}

const LorenzAttractor = () => {
  const mountRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimationStarted(true);
    }, 10000); // 3 seconds delay
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 80);
    // scene.background = new THREE.Color(0x111111);

    const renderer = new THREE.WebGLRenderer({canvas: mountRef.current, antialias: true, alpha:true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // scene.fog = new THREE.Fog(0xffffff, 1, 1500);
    // mountRef.current.appendChild(renderer.domElement);

    const points = [];
    let x = 1, y = 1.0, z = 1.0;
    const dt = 0.01;
    const sigma = 10.0, rho = 28.0, beta = 8.0 / 3.0;

    const geometry = new THREE.BufferGeometry();
    const maxPoints = 5000;
    const vertices = new Float32Array(maxPoints * 3);
    const colors = new Float32Array(maxPoints * 3);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      vertexColors: true, size: window.innerWidth < 768 ? 0.2 : 0.2, opacity: 1, fog: true
      // transparent: true
    });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let index = 0;
    let time = 0;

    const animate = () => {
      time += 0.05;
      requestAnimationFrame(animate);
      if(animationStarted) {

        if (index < maxPoints) {
          let dx = sigma * (y - x) * dt;
          let dy = (x * (rho - z) - y) * dt;
          let dz = (x * y - beta * z) * dt;
          x += dx;
          y += dy;
          z += dz;
          const rippleFactor = Math.sin(time * 0.05);
          const speed = Math.max(9, Math.min(12, Math.sqrt(dx * dx + dy * dy + dz * dz) * 8)); // Speed at each point
          // console.log(speed / 20);
          const color = new THREE.Color().setHSL(speed / 20, 1, 0.5); // Color based on speed
          vertices[index * 3] = x;
          vertices[index * 3 + 1] = y + rippleFactor * Math.sin(time + index);
          vertices[index * 3 + 2] = z + rippleFactor * Math.cos(time + index);


          // let r = Math.abs(Math.sin(x)) * 255;
          // let g = Math.abs(Math.sin(y)) * 255;
          // let b = Math.abs(Math.sin(z)) * 255;
          // let color = getBlueGradient(index / 1000);
          // // We use `x` to mix blue and orange, and `y` to adjust the intensity of the colors
          // let mix = (x - Math.floor(x)) * 0.5 + 0.5; // Normalize `x` to range between 0 and 1
          //
          // // Blue (0, 0, 255) and Orange (255, 165, 0)
          // // Red goes from 0 (blue) to 255 (orange)
          // let r = mix * 255;   // Red value from blue to orange
          // let g = mix * 165;   // Green value from blue to orange
          // let b = 255 - mix * 255;
          // console.log(x,y,z);
          // 65, 105, 225
          // let r,g,b;

          // Generate the gradient from Cyan (#00FFFF) to Orange (#FFA500)
          let r = Math.min(x / 30 + 0.3, 0.5);//Math.min(Math.max(x/20 + 0.5, 0.5), 0.9);
          let g = 1;
          let b = Math.min(z / 30 + 0.3, 0.5);
          if (r === 0.5) {
            r = 1;
            g = 0.5;
          }
          if (b === 0.5) {
            b = 0.8;
            g = 0.5;
          }

          colors[index * 3] = r; // Ranges red
          colors[index * 3 + 1] = g; // Green for a smooth gradient
          colors[index * 3 + 2] = b; // Blue for contrast
          console.log(r, g, b);
          // hue
          // colors.push(hue, 1 - hue, 0.5); //
          // colors[index * 3 + 3] = 1; // Blue for contrast
          // colors.push(color.r, color.g, color.b);
          // material.opacity = 0.4 + index/5000;
          // material.size = 0.1 + 0.05 * Math.sin(index/5000); // Size puls

          geometry.attributes.position.needsUpdate = true;
          geometry.attributes.color.needsUpdate = true;
          // material.needsUpdate = true;
          index++;
        }

        pointCloud.rotation.z -= 0.001;
        // pointCloud.rotation.x += 0.0001;
        renderer.render(scene, camera);
        controls.update();
      }
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.size = window.innerWidth < 768 ? 0.2 : 0.2;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if(!mountRef.current) {
        return;
      }
      try {
        mountRef.current.removeChild(renderer.domElement);
        window.removeEventListener("resize", handleResize);
        geometry.dispose();
        material.dispose();
        scene.remove(pointCloud);
        renderer.dispose();
      } catch(e) {

      }
    };
  }, [animationStarted]);

  return <canvas
    ref={mountRef}
    style={{position: "absolute", top: "0", right: "0"}}
  />
};

export default LorenzAttractor;
