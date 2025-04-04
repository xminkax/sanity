import * as THREE from "three";
import fragmentShader from "./Stars.frag";
import vertexShader from "./Stars.vert";

const MAX_STARS = 3000;
const RADIUS = 50;

class Stars {
  system: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> | null = null;

  init(): void {
    const textureLoader = new THREE.TextureLoader();

    const uniforms: Record<string, THREE.IUniform> = {
      pointTexture: { value: textureLoader.load("spark1.png") },
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.5,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    const geometryStars = new THREE.BufferGeometry();

    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    for (let i = 0; i < MAX_STARS; i++) {
      positions.push(
        (Math.random() * 2 - 1) * RADIUS,
        (Math.random() * 2 - 1) * RADIUS,
        (Math.random() * 2 - 1) * RADIUS
      );

      const color = new THREE.Color(Math.random() * 0.5 + 0.8, 1.0, 0.9);
      colors.push(color.r, color.g, color.b);

      sizes.push(10);
    }

    geometryStars.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometryStars.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometryStars.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage)
    );

    this.system = new THREE.Points(geometryStars, shaderMaterial);
  }

  animate(delta: number): void {
    if (!this.system) return;

    this.system.rotation.x += THREE.MathUtils.degToRad(30) * delta * 0.04;
    this.system.rotation.y += THREE.MathUtils.degToRad(30) * delta * 0.04;
  }
}

export default Stars;
