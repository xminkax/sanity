import * as THREE from "three";

const colors: [number, number, number][] = [
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

const MAX_PARTICLES = 5000;
const SLOWDOWN = 4;

type Keys = { [key: string]: boolean };

class Particles {
  position: number[] = [];
  color: number[] = [];
  velocity: number[] = [];
  gravity: number[] = [];
  life: number[] = [];
  fade: number[] = [];
  opacity: number[] = [];
  size: number[] = [];
  colorCounter: number = 0;
  system: THREE.Points | null = null;

  init(): THREE.Points {
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.size[i] = 32;
      this.life[i] = 1;
      this.opacity[i] = 1;
      this.fade[i] = ((Math.random() * 100) / 1000 + 0.003) / 14;

      this.position[i * 3] = 5;
      this.position[i * 3 + 1] = 11;
      this.position[i * 3 + 2] = 0;

      this.velocity[i * 3] = (Math.random() * 50 - 26.0) * 30.0;
      this.velocity[i * 3 + 1] = (Math.random() * 50 - 25.0) * 30.0;
      this.velocity[i * 3 + 2] = (Math.random() * 50 - 25.0) * 30.0;

      this.gravity[i * 3] = -4;
      this.gravity[i * 3 + 1] = -2;
      this.gravity[i * 3 + 2] = -2;

      const colorIndex = Math.floor(i * (12 / MAX_PARTICLES));
      this.color[i * 3] = colors[colorIndex][0];
      this.color[i * 3 + 1] = colors[colorIndex][1];
      this.color[i * 3 + 2] = colors[colorIndex][2];
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.position, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(this.color, 3));
    geometry.setAttribute("opacity", new THREE.Float32BufferAttribute(this.opacity, 1));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load("spark1.png") },
      },
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
      varying vec3 vColor;
      attribute float size;
      attribute float opacity;
      varying float vOpacity;
      void main() {
        vColor = color;
        vOpacity = opacity; 
        gl_PointSize = size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      varying float vOpacity;
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, vOpacity);
        gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);     
      }
    `,
      transparent: true,
      depthTest: false,
    });

    this.system = new THREE.Points(geometry, material);
    return this.system;
  }

  animate(delta: number, keys: Keys): void {
    if (!this.system) return;

    const position = this.system.geometry.attributes.position.array as Float32Array;
    const opacity = this.system.geometry.attributes.opacity.array as Float32Array;
    const color = this.system.geometry.attributes.color.array as Float32Array;
    this.colorCounter++;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.velocity[i * 3] += this.gravity[i * 3];
      this.velocity[i * 3 + 1] += this.gravity[i * 3 + 1];
      this.velocity[i * 3 + 2] += this.gravity[i * 3 + 2];

      position[i * 3] += this.velocity[i * 3] / (SLOWDOWN*1000);
      position[i * 3 + 1] += this.velocity[i * 3 + 1] /  (SLOWDOWN*1000);
      position[i * 3 + 2] += this.velocity[i * 3 + 2] /  (SLOWDOWN*1000);

      opacity[i] = this.life[i];
      this.life[i] -= this.fade[i];

      if (this.life[i] < 0) {
        const colorIndex = this.colorCounter % colors.length;
        color[i * 3] = colors[colorIndex][0];
        color[i * 3 + 1] = colors[colorIndex][1];
        color[i * 3 + 2] = colors[colorIndex][2];

        this.life[i] = 1;

        position[i * 3] = 5;
        position[i * 3 + 1] = 11;
        position[i * 3 + 2] = 0;

        this.velocity[i * 3] = Math.floor(Math.random() * 120) - 32;
        this.velocity[i * 3 + 1] = Math.floor(Math.random() * 120) - 30;
        this.velocity[i * 3 + 2] = Math.floor(Math.random() * 120) - 30;
      }

      if (keys["ArrowLeft"]) {
        this.velocity[i * 3] -= 10;
      }
      if (keys["ArrowRight"]) {
        this.velocity[i * 3] += 10;
      }
    }

    this.system.geometry.attributes.position.needsUpdate = true;
    this.system.geometry.attributes.opacity.needsUpdate = true;
    this.system.geometry.attributes.color.needsUpdate = true;
  }
}

export default Particles;
