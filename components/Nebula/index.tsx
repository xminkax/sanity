import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  Clock,
  DirectionalLight,
  FogExp2,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import StarsSystem from "@/components/Particles/Stars";

// You can adjust this if StarsSystem has a different shape
interface IStarsSystem {
  init: () => void;
  animate: (delta: number) => void;
  system?: THREE.Object3D;
}

const Nebula: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const clock = useRef(new THREE.Clock());
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene: Scene = new Scene();
    const camera: PerspectiveCamera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 8;
    camera.rotation.z = Math.PI / 4;

    THREE.ColorManagement.enabled = false;

    const cloudParticles: Mesh[] = [];

    const renderer: WebGLRenderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    sceneRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.fog = new FogExp2(0x000102, 0.01);
    renderer.setClearColor(scene.fog.color);

    const textureLoader: TextureLoader = new TextureLoader();
    const cloudTexture: Texture = textureLoader.load("smoke.png");

    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    const starsSystem: StarsSystem = new StarsSystem(4);
    starsSystem.init();
    if (starsSystem.system) {
      scene.add(starsSystem.system);
    }

    const directionalLight: DirectionalLight = new DirectionalLight(0x6fd5de);
    directionalLight.position.set(2, -2, 1);
    scene.add(directionalLight);

    const geometry: PlaneGeometry = new PlaneGeometry(10, 10);

    const material: MeshLambertMaterial = new MeshLambertMaterial({
      map: cloudTexture,
      color: 0x3c5a99,
      opacity: 0.9,
      transparent: true,
    });

    const createCloud = () => {
      const cloud = new Mesh(geometry, material);
      cloud.receiveShadow = true;
      cloud.castShadow = true;
      cloud.position.set(Math.random() * 18 - 4, Math.random() * 8 - 4, Math.random() * 6 - 6);
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.renderOrder = 2;
      scene.add(cloud);
      cloudParticles.push(cloud);
    };

    for (let i = 0; i < 70; i++) {
      createCloud();
    }

    const orangeLight = new PointLight(0x420a52, 50, 450, 2);
    orangeLight.castShadow = true;
    orangeLight.position.set(2, 4, 2);
    scene.add(orangeLight);

    const pinkLight = new PointLight(0x7d1875, 10, 450, 1.7);
    pinkLight.castShadow = true;
    pinkLight.position.set(2, 4, 2);
    scene.add(pinkLight);

    const blueLight = new PointLight(0x3677ac, 50, 0, 2);
    blueLight.castShadow = true;
    blueLight.position.set(2, 4, 10);
    scene.add(blueLight);

    const purpleLight = new PointLight(0x0a2430, 100, 100, 0.5);
    purpleLight.castShadow = true;
    purpleLight.position.set(4, 1, 0);

    scene.add(purpleLight);

    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      0.6,
      1.0,
      0.3,
    );
    bloomPass.renderToScreen = true;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);

    const animate = () => {
      const delta = clock.current.getDelta();
      animationFrameId.current = requestAnimationFrame(animate);

      starsSystem.animate(delta * 0.1);

      cloudParticles.forEach((cloud) => {
        cloud.rotation.z -= delta * 0.1;
      });

      controls.update();
      composer.render();
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      composer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      cancelAnimationFrame(animationFrameId.current);
      controls.dispose();
      composer.dispose();

      cloudParticles.forEach((cloud) => {
        cloud.geometry.dispose();
        if (Array.isArray(cloud.material)) {
          cloud.material.forEach((mat) => mat.dispose());
        } else {
          cloud.material.dispose();
        }
        scene.remove(cloud);
      });

      geometry.dispose();
      material.dispose();
      cloudTexture.dispose();

      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }

      if (starsSystem.system) {
        scene.remove(starsSystem.system);
      }

      starsSystem.dispose();

      sceneRef.current!.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={sceneRef} style={{position: "fixed", top: "0", right: "0"}}/>;
};

export default Nebula;
