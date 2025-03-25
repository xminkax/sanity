import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';

const LorenzAttractor = () => {
  const clock = new THREE.Clock();
  const mountRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimationStarted(true);
    }, 0); // 3 seconds delay
    // Basic Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, -10, 70);

    const renderer = new THREE.WebGLRenderer({
      canvas: mountRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a dynamic buffer for the drawn points
    const maxPoints = 10000;
    const positions = new Float32Array(maxPoints * 3);
    const colors = new Float32Array(maxPoints * 3);

    // Start at an initial point for the Lorenz attractor
    let x = 0.1, y = 0.0, z = 0.0;
    // Place the first point
    positions[0] = x;
    positions[1] = y;
    positions[2] = z;
    colors[0] = 0.1; // R
    colors[1] = 0.8; // G
    colors[2] = 1.0; // B
    let count = 1; // How many points have been added so far

    // Create BufferGeometry and only draw up to the current count of points
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, count);
    let uniforms = {

      pointTexture: {value: new THREE.TextureLoader().load('spark1.png')}

    };

    // Custom shaders for styling the drawn points
    const vertexShader = `
      // attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        // Set a constant alpha for demonstration (could also vary by vertex)\n
        vAlpha = 0.9;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 3.0;
      }
    `;

    const fragmentShader = `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        // Sample the texture for point sprite shape\n
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        // Multiply texture color with vertex color\n
        gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader,
      fragmentShader,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    // Create the points object and add it to the scene
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Lorenz system parameters and time step
    const sigma = 10.0;
    const rho = 28.0;
    const beta = 8.0 / 3.0;
    const dt = 0.005;
    let time = 0;
    let pointsPerFrame = 2;

    // Animation loop: compute a new point every frame and update the buffer
    const animate = () => {
      // if(!animationStarted){
      //   return;
      // }
      time += 0.05;
      const deltaTime = clock.getDelta();
      requestAnimationFrame(animate);
      // if (animationStarted) {
      for (let j = 0; j < pointsPerFrame; j++) {
        if (count < maxPoints) {
          // Euler integration for Lorenz equations
          const dx = sigma * (y - x) * dt;
          const dy = (x * (rho - z) - y) * dt;
          const dz = (x * y - beta * z) * dt;
          x += dx;
          y += dy;
          z += dz;

          // Append the new point into the positions buffer
          const rippleFactor = 0;
          positions[count * 3] = x + 0.01 * Math.sin(10 * count* dt);
          positions[count * 3 + 1] = y + 0.01 * Math.sin(10 * count * dt);
          let r = x / 30 + 0.5;
          let g = y / 30 + 0.5;
          let b = z / 30 + 0.5;
          if (x < 0) {
            r = 0;
            g = 0.6 + deltaTime * 10;
            b = 1 - deltaTime * 10;
            // colors.push(0, 1, 1); // Cyan
          } else {
            r = 1 - deltaTime * 10;
            g = 0.4 + deltaTime * 10;
            b = 0.6 + deltaTime * 10;
          }
          positions[count * 3 + 2] = z;

          colors[count * 3] = r;
          colors[count * 3 + 1] = g;
          colors[count * 3 + 2] = b;
          count++;

          // Update draw range so that new points are rendered
        }
        geometry.setDrawRange(0, count);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
      }
      // points.rotation.y += 0.0005;
      points.rotation.z += 0.0005;
      renderer.render(scene, camera);
    }
    // };
    const timeoutId = setTimeout(() => {
      animate();
    }, 6000);

    // Handle window resizing
    const onWindowResize = () => {
      // camera.aspect = window.innerWidth / window.innerHeight;
      // camera.updateProjectionMatrix();
      // renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <canvas ref={mountRef} style={{position: "absolute", top: "0", right: "0" ,zIndex: -2}}/>
};

export default LorenzAttractor;
