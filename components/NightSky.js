import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const ShaderComponent = () => {
  const canvasRef = useRef(null);
  let renderer, scene, camera, stats;

  let particleSystem, uniforms, geometry;

  const particles = 15000;
  useEffect(() => {
    const initScene = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 300;

      scene = new THREE.Scene();

      uniforms = {

        pointTexture: { value: new THREE.TextureLoader().load( 'spark1.png' ) }

      };
      // Custom Shader Materials
      const vertexShader = `
attribute float size;

varying vec3 vColor;

void main() {

vColor = color;

vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

gl_PointSize = size * ( 300.0 / -mvPosition.z );

gl_Position = projectionMatrix * mvPosition;

}
      `;

      const fragmentShader = `
uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {

gl_FragColor = vec4( vColor, 1.0 );

gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

}
      `;

      const shaderMaterial = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader,
        fragmentShader,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true

      } );


      const radius = 200;

      geometry = new THREE.BufferGeometry();

      const positions = [];
      const colors = [];
      const sizes = [];

      const color = new THREE.Color();
      // const radius = 200;
      for ( let i = 0; i < particles; i ++ ) {

        let angle = Math.random() * Math.PI * 2;
        let distance = Math.pow(Math.random(), 0.5) * 50; // Spiral effect
        let height = (Math.random() - 0.5) * 50;
        positions[i * 3] = ( Math.random() * 2 - 1 ) * radius;
        positions[i * 3 + 1] = ( Math.random() * 2 - 1 ) * radius;
        positions[i * 3 + 2] = ( Math.random() * 2 - 1 ) * radius;


        // color.setHSL( i / particles, 1.0, 0.5 );

        const color = new THREE.Color().setHSL(Math.random() * 0.1 + 0.53, 1, 0.6);
        // colors.push( positions[i * 3] / 30 + 0.5,positions[i * 3+1] / 30 + 0.5, positions[i * 3+2] / 30 + 0.5 );

        colors.push( color.r, color.g, color.b);

        sizes.push( 20 );

      }

      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
      geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
      geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

      particleSystem = new THREE.Points( geometry, shaderMaterial );



      scene.add( particleSystem );

      renderer = new THREE.WebGLRenderer({canvas: canvasRef.current, alpha: true});
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;


      const animate = () => {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.005;

        particleSystem.rotation.z += 0.0002; // Slow rotation
        particleSystem.rotation.x += 0.00001; // Slow rotation
        particleSystem.rotation.y += 0.00001; // Slow rotation

        // const sizes = geometry.attributes.size.array;
        //
        // for ( let i = 0; i < particles; i ++ ) {
        //
        //   sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );
        //
        // }
        //
        // geometry.attributes.size.needsUpdate = true;


        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    };

    initScene();

    return () => {
      // Cleanup function
      if (document.body.contains(renderer.domElement)) {
        document.body.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{position: "absolute", top: "0", right: "0"}}/>
};

export default ShaderComponent;
