import * as THREE from "three";
import fragmentShader from "./Stars.frag";
import vertexShader from "./Stars.vert";
import { Color, TextureLoader } from "three";

const MAX_STARS = 3000;
const RADIUS = 50;

class Stars {
  system: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> | null = null;
  material!: THREE.ShaderMaterial;
  geometry!: THREE.BufferGeometry;
  size: number;

  constructor(size: number) {
    this.size = size;
  }

  init(): void {
    const textureLoader: TextureLoader = new THREE.TextureLoader();

    const uniforms: Record<string, THREE.IUniform> = {
      pointTexture: { value: textureLoader.load("spark1.png") },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.5,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    this.geometry = new THREE.BufferGeometry();

    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const opacities: number[] = [];

    for (let i = 0; i < MAX_STARS; i++) {
      positions.push(
        (Math.random() * 2 - 1) * RADIUS,
        (Math.random() * 2 - 1) * RADIUS,
        (Math.random() * 2 - 1) * RADIUS,
      );

      const color: Color = new THREE.Color(Math.random() * 0.5 + 0.8, 1.0, 0.9);
      colors.push(color.r, color.g, color.b);

      sizes.push(this.size);
      opacities[i] = Math.random() * 0.5 + 0.5;
    }

    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    this.geometry.setAttribute("opacity", new THREE.Float32BufferAttribute(opacities, 1));
    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage),
    );

    this.system = new THREE.Points(this.geometry, this.material);
  }

  animate(delta: number, rotationSpeed: number): void {
    if (!this.system) return;

    const opacities: Float32Array = this.geometry.attributes.opacity.array as Float32Array;

    for (let i = 0; i < MAX_STARS; i++) {
      opacities[i] -= delta * 0.06;
      if (opacities[i] < 0.3) {
        opacities[i] = Math.random() * 0.5 + 0.5;
      }
    }

    this.geometry.attributes.opacity.needsUpdate = true;

    this.system.rotation.x += THREE.MathUtils.degToRad(30) * delta * rotationSpeed;
    this.system.rotation.y += THREE.MathUtils.degToRad(30) * delta * rotationSpeed;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default Stars;
