import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import FPSStats from "react-fps-stats"; // Import OrbitControls

let slowdown = 2.0; // Zpomalení částic

let xspeed; // Základní rychlost na ose x

let yspeed; // Základní rychlost na ose y

let zoom = -40.0; // Zoom


let delay; // Zpoždění pro duhový efekt
let col = 0;

class Particle {
  constructor() {
    this.active = false; // Aktivní?
    this.life = 0.0; // Život
    this.fade = 0.0; // Rychlost stárnutí

    this.r = 0.0; // Červená složka barvy
    this.g = 0.0; // Zelená složka barvy
    this.b = 0.0; // Modrá složka barvy

    this.x = 0.0; // X Pozice
    this.y = 0.0; // Y Pozice
    this.z = 0.0; // Z Pozice

    this.xi = 0.0; // X směr a rychlost
    this.yi = 0.0; // Y směr a rychlost
    this.zi = 0.0; // Z směr a rychlost

    this.xg = 0.0;// X gravitace
    this.yg = 0.0;// X gravitace
    this.zg = 0.0;// X gravitace


  }
}

const colors = [
  [1.0, 0.5, 0.5], [1.0, 0.75, 0.5], [1.0, 1.0, 0.5], [0.75, 1.0, 0.5],
  [0.5, 1.0, 0.5], [0.5, 1.0, 0.75], [0.5, 1.0, 1.0], [0.5, 0.75, 1.0],
  [0.5, 0.5, 1.0], [0.75, 0.5, 1.0], [1.0, 0.5, 1.0], [1.0, 0.5, 0.75]
];


const ParticleSystem = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // === Initialize the Scene, Camera, and Renderer ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // === Particle system setup ===
    const MAX_PARTICLES = 3000;
    const particles = [];
    const particlesColor = [];
    const particlesVelocity = [];
    const particlesGravity = [];
    const particlesOpacity = [];
    const particlesLife = [];
    const particlesFade = [];
    // const colors = [];
    const opacities = [];
    const sizes = [];
    // let life = 1
    const colors = [
      new THREE.Color(0.16, 0.18, 0.31), // #2A2F4F
      new THREE.Color(0.12, 0.16, 0.27), // #1F2A44
      new THREE.Color(0.22, 0.28, 0.45), // #374873
      new THREE.Color(0.17, 0.23, 0.40), // #2B3A67
      new THREE.Color(0.24, 0.31, 0.52), // #3D4E84
      new THREE.Color(0.13, 0.20, 0.33), // #223355
      new THREE.Color(0.10, 0.13, 0.22), // #1A2138
      new THREE.Color(0.27, 0.36, 0.58), // #465C94
      new THREE.Color(0.29, 0.37, 0.59), // #4A5E97
      new THREE.Color(0.16, 0.20, 0.29), // #28334A
      new THREE.Color(0.12, 0.15, 0.24), // #1E263C
      new THREE.Color(0.22, 0.30, 0.47)  // #394C78
    ];


    const particleGeometry = new THREE.SphereGeometry(1, 4, 4);

    // for (let loop = 0; loop < MAX_PARTICLES; loop++) { // Inicializace částic
    //   particle[loop] = new Particle(); // Ensure each particle is an instance of Particle
    //
    //   particle[loop].active = true; // Aktivace
    //   particle[loop].life = 1.0; // Oživení
    //   particle[loop].fade = Math.random() * 0.1 + 0.003; // Rychlost stárnutí
    //
    //   let colorIndex = Math.floor(loop * (12 / MAX_PARTICLES));
    //   particle[loop].r = colors[colorIndex][0]; // Červená
    //   particle[loop].g = colors[colorIndex][1]; // Zelená
    //   particle[loop].b = colors[colorIndex][2]; // Modrá
    //
    //   particle[loop].xi = (Math.random() * 50 - 26.0) * 10.0; // Rychlost a směr pohybu na ose x
    //   particle[loop].yi = (Math.random() * 50 - 25.0) * 10.0; // Rychlost a směr pohybu na ose y
    //   particle[loop].zi = (Math.random() * 50 - 25.0) * 10.0; // Rychlost a směr pohybu na ose z
    //
    //   particle[loop].xg = 0.0; // Gravitace na ose x
    //   particle[loop].yg = -0.8; // Gravitace na ose y
    //   particle[loop].zg = 0.0; // Gravitace na ose z
    // }
    const geometry = new THREE.BufferGeometry();

    // Particle constructor
    for (let i = 0; i < MAX_PARTICLES; i++) {
      // const material = new THREE.MeshBasicMaterial({
      //   color: colors[i % colors.length],
      //   map: new THREE.TextureLoader().load( 'star.png' ),
      //   transparent: true,
      //   opacity: 1.0
      // });
      // const particle = new THREE.Mesh(particleGeometry, material);

      // particlesColor[i*3] = colors[(i*3) % colors.length];
      // particlesColor[i*3+1] = colors[(i*3+1) % colors.length];
      // particlesColor[i*3+2] = colors[(i*3+2) % colors.length];
      // console.log(colors[Math.floor(i * (12 / MAX_PARTICLES))].r);
      particlesColor[i * 3] = colors[Math.floor(i * (12 / MAX_PARTICLES))].r;
      particlesColor[i * 3 + 1] = colors[Math.floor(i * (12 / MAX_PARTICLES))].g;
      particlesColor[i * 3 + 2] = colors[Math.floor(i * (12 / MAX_PARTICLES))].b;
      //
      // const color = new THREE.Color().setHSL(Math.random() * 0.1 + 0.53, 1, 0.6);
      // // colors.push( positions[i * 3] / 30 + 0.5,positions[i * 3+1] / 30 + 0.5, positions[i * 3+2] / 30 + 0.5 );
      //
      // colors.push( color.r, color.g, color.b);

      particles[i * 3] = 0;
      particles[i * 3+1] = 0;
      particles[i * 3+2] = 0;

      particlesVelocity[i * 3] = (Math.random() * 50 - 26.0) * 10.0;
      particlesVelocity[i * 3+1] = (Math.random() * 50 - 25.0) * 10.0;
      particlesVelocity[i * 3+2] = (Math.random() * 50 - 25.0) * 10.0;

      particlesGravity[i * 3] = 0;
      particlesGravity[i * 3+1] = -0.8;
      particlesGravity[i * 3+2] = 0;

      particlesLife[i * 3] = 1.0;
      particlesFade[i * 3] = ((Math.floor(Math.random() * 100) / 1000) + 0.003)/14 ;
      opacities[i] = 1.0;
      sizes[i] = 30.0;

      // particle.xg = 0;
      // particle.yg = -0.8;
      // particle.zg = 0;
      // particle.xi = (Math.random() * 50 - 26.0) * 10.0;
      // particle.yi = (Math.random() * 50 - 26.0) * 10.0;
      // particle.zi = (Math.random() * 50 - 26.0) * 10.0;

      // particle[loop].xi = (Math.random() * 50 - 26.0) * 10.0; // Rychlost a směr pohybu na ose x
      // particle[loop].yi = (Math.random() * 50 - 25.0) * 10.0; // Rychlost a směr pohybu na ose y
      // particle[loop].zi = (Math.random() * 50 - 25.0) * 10.0; // Rychlost a směr pohybu na ose z

      // particle[loop].xg = 0.0; // Gravitace na ose x
      // particle[loop].yg = -0.8; // Gravitace na ose y
      // particle[loop].zg = 0.0; // Gravitace na ose z


    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(particles, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(particlesColor, 3));
    geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1)); // Add opacity attribute
    geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );
// Custom shader to read opacity from the geometry's opacity attribute
    const vertexShader = `
  attribute float opacity; // The opacity attribute from the geometry
  varying float vOpacity;
  
attribute vec3 color; 
vColor = color;   
  void main() {
    vOpacity = opacity; // Pass the opacity to the fragment shader
    gl_PointSize = size;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

    const fragmentShader = `
  varying float vOpacity;
  varying vec3 vColor; 

  void main() {
    gl_FragColor = vec4(vColor, vOpacity); // Set the color and opacity
  }
`;
// Create the material for the points
    const material = new THREE.ShaderMaterial({
      uniforms: {
        // pointSize: { value: 30 },  // Point size uniform
        pointTexture: { value: new THREE.TextureLoader().load( 'spark1.png' ) }
      },
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
      varying vec3 vColor;
      attribute float size;
    attribute float opacity; // The opacity attribute from the geometry
    // attribute float opacity; // The opacity attribute from the geometry
    varying float vOpacity;
    uniform float pointSize; 

    void main() {
      vColor = color;
      vOpacity = opacity; // Pass the opacity to the fragment shader
      gl_PointSize = size;  // Set a fixed point size (you can adjust this)
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
      fragmentShader: `
    varying float vOpacity;
    uniform sampler2D pointTexture;
    varying vec3 vColor;

    void main() {
gl_FragColor = vec4( vColor, vOpacity );

gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );     
    }
  `,
      transparent: true,  // Enable transparency for the material
      depthTest: false,
    });

// Create the points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;


    // === Set up the camera ===
    camera.position.z = 30;

    // === Event Handling ===
    const keys = {};

    const handleKeyDown = (event) => {
      keys[event.key] = true;
    };

    const handleKeyUp = (event) => {
      keys[event.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // === Animation Loop ===
    const animate = () => {
      requestAnimationFrame(animate);
      col++;

      const positions = geometry.attributes.position.array;
      const opacities = geometry.attributes.opacity.array;
      const colorsReset = geometry.attributes.color.array;

      for (let i = 0; i < MAX_PARTICLES; i++) {
        opacities[i] = particlesLife[i*3];
        particlesLife[i*3] -=particlesFade[i*3];

        particlesVelocity[i * 3] += particlesGravity[i*3];
        particlesVelocity[i * 3+1] += particlesGravity[i*3+1];
        particlesVelocity[i * 3+2] += particlesGravity[i*3+2];

        positions[i * 3] += particlesVelocity[i * 3]/2000;
        positions[i * 3 + 1] += particlesVelocity[i * 3+1]/2000;
        positions[i * 3 + 2] += particlesVelocity[i * 3+2]/2000;

        if (keys[" "]) {
          // particle.velocity.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1); // burst of speed
        }
        if (keys["ArrowUp"]) {
          // particle.velocity.y += 1;
          particlesVelocity[i * 3+1] += particlesGravity[i*3];
        }
        if (keys["ArrowDown"]) {
          particlesVelocity[i * 3+1] -= 1;
        }
        if (keys["ArrowLeft"]) {
          particlesVelocity[i * 3] -= 1;
        }
        if (keys["ArrowRight"]) {
          particlesVelocity[i * 3] += 1;
        }
        if(col === 11) {
          col = 0;
        }

        if (particlesLife[i*3] < 0) {
          colorsReset[i*3] = colors[col].r
          colorsReset[i*3+1] = colors[col].g
          colorsReset[i*3+2] = colors[col].b

          // console.log(particlesLife[i*3]);
          particlesLife[i*3] = 1;

          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;

          particlesVelocity[i * 3] = (Math.floor(Math.random() * 60) - 32);
          particlesVelocity[i * 3+1] = (Math.floor(Math.random() * 60) - 30);
          particlesVelocity[i * 3+2] = (Math.floor(Math.random() * 60) - 30);


        }
      }

      // Mark the position attribute as needing an update
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.opacity.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      // Update particles
      // particles.forEach((particle) => {
      // Apply gravity
      // particle.velocity.add(particle.gravity);
      // particle.life -=particle.fade;
      // particle.material.opacity = particle.life;
      // // console.log(particle.material.opacity);
      //
      // // Update position
      // particle.position.set(particle.position.x+particle.velocity.x/2000, particle.position.y+particle.velocity.y/2000, particle.position.z+particle.velocity.z/2000);
      //
      // // Reset particle when it's out of bounds
      // if (particle.life < 0) {
      //   particle.life = 1;
      //
      //   particle.position.set(0, 0, 0);
      //   particle.velocity.set((Math.floor(Math.random() * 60) - 32), (Math.floor(Math.random() * 60) - 30) ,(Math.floor(Math.random() * 60) - 30));
      //   particle.gravity = new THREE.Vector3(0, -0.8, 0); // downward gravity
      //
      // }

      // Check for key controls (spacebar or arrow keys for speed)

      // });

      renderer.render(scene, camera);
    };
    controls.update();
    animate();

    // === Cleanup ===
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <><FPSStats/><div ref={mountRef} /></>;
};

export default ParticleSystem;
