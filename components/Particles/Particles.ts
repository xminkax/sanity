import * as THREE from "three";
import fragmentShader from "./Stars.frag";
import vertexShader from "./Stars.vert";

const colorsShades: [number, number, number][] = [
  [0.5, 0.6, 0.6],
  [0.6, 0.6, 0.5],
  [0.7, 0.55, 0.4],
  [0.8, 0.5, 0.3],
  [0.9, 0.45, 0.2],
  [1.0, 1.0, 0.6],
  [0.5, 0.6, 0.6],
  [0.6, 0.6, 0.5],
  [0.7, 0.55, 0.4],
  [0.8, 0.5, 0.3],
  [0.9, 0.45, 0.2],
  [1.0, 1.0, 0.6],
];

const MAX_PARTICLES: number = 5000;
const SIZE: number = 32;
const SLOWDOWN: number = 4;

class Particles {
  velocity: number[] = [];
  gravity: number[] = [];
  life: number[] = [];
  fade: number[] = [];
  size: number[] = [];
  colorCounter: number = 0;
  velocitySpeed: number = 1;
  system: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> | null = null;
  material!: THREE.ShaderMaterial;
  geometry!: THREE.BufferGeometry;

  init(): void {
    const positions: number[] = [];
    const colors: number[] = [];
    const opacities: number[] = [];

    this.geometry = new THREE.BufferGeometry();

    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.size[i] = SIZE;
      this.life[i] = 1;
      this.fade[i] = ((Math.random() * 100) / 1000 + 0.003) / 14;
      opacities[i] = 1;

      positions[i * 3] = 5;
      positions[i * 3 + 1] = 18;
      positions[i * 3 + 2] = 0;

      this.velocity[i * 3] = (Math.random() * 50 - 26.0) * 30.0;
      this.velocity[i * 3 + 1] = (Math.random() * 50 - 25.0) * 30.0;
      this.velocity[i * 3 + 2] = (Math.random() * 50 - 25.0) * 30.0;

      this.gravity[i * 3] = -4;
      this.gravity[i * 3 + 1] = -2;
      this.gravity[i * 3 + 2] = -2;

      const colorIndex = Math.floor(i * (12 / MAX_PARTICLES));
      colors[i * 3] = colorsShades[colorIndex][0];
      colors[i * 3 + 1] = colorsShades[colorIndex][1];
      colors[i * 3 + 2] = colorsShades[colorIndex][2];
    }

    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    this.geometry.setAttribute("opacity", new THREE.Float32BufferAttribute(opacities, 1));
    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage),
    );

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load("spark1.png") },
      },
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
    });

    this.system = new THREE.Points(this.geometry, this.material);
  }

  animate(): void {
    if (!this.system) return;

    const positions: Float32Array = this.geometry.attributes.position.array as Float32Array;
    const opacities: Float32Array = this.geometry.attributes.opacity.array as Float32Array;
    const colors: Float32Array = this.geometry.attributes.color.array as Float32Array;
    this.colorCounter++;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.velocity[i * 3] += this.gravity[i * 3] * this.velocitySpeed;
      this.velocity[i * 3 + 1] += this.gravity[i * 3 + 1];
      this.velocity[i * 3 + 2] += this.gravity[i * 3 + 2];

      positions[i * 3] += this.velocity[i * 3] / (SLOWDOWN * 1000);
      positions[i * 3 + 1] += this.velocity[i * 3 + 1] / (SLOWDOWN * 1000);
      positions[i * 3 + 2] += this.velocity[i * 3 + 2] / (SLOWDOWN * 1000);

      opacities[i] = this.life[i];
      this.life[i] -= this.fade[i];

      if (this.life[i] < 0) {
        const colorIndex = this.colorCounter % colorsShades.length;
        colors[i * 3] = colorsShades[colorIndex][0];
        colors[i * 3 + 1] = colorsShades[colorIndex][1];
        colors[i * 3 + 2] = colorsShades[colorIndex][2];

        this.life[i] = 1;

        positions[i * 3] = 5;
        positions[i * 3 + 1] = 18;
        positions[i * 3 + 2] = 0;

        this.velocity[i * 3] = Math.floor(Math.random() * 120) - 32;
        this.velocity[i * 3 + 1] = Math.floor(Math.random() * 120) - 30;
        this.velocity[i * 3 + 2] = Math.floor(Math.random() * 120) - 30;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.opacity.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  handleKey(key: string): void {
    if (key === "ArrowLeft") {
      this.velocitySpeed = 1.1;
    }
    if (key === "ArrowRight") {
      this.velocitySpeed = -1.1;
    }
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default Particles;
