"use client"
import React, {MutableRefObject, useEffect, useRef} from 'react';
import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import "./fireworks.css";
import {PerspectiveCamera, Scene, WebGLRenderer, BufferGeometry, NormalBufferAttributes} from "three";

function getColor() {
    return [parseFloat(Math.random().toFixed(2)), parseFloat(((45 + 20 * Math.random()) / 100).toFixed(2)), parseFloat(((50 + 20 * Math.random()) / 100).toFixed(2))];
}

const Fireworks: React.FC = () => {
    const DISTRIBZ: number = 30;
    const canvasRef: MutableRefObject<object> = useRef<HTMLCanvasElement | null>(null);
    const FLOOR_REPEAT: number = 5;
    const PARTICLE_COUNT: number = 1000;

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene: Scene = new THREE.Scene();
        const camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, canvasRef.current?.width / canvasRef.current?.height, 0.1, 1000);
        const renderer: WebGLRenderer = new THREE.WebGLRenderer({canvas: canvasRef.current});
        let textMesh;

        const particles: BufferGeometry<NormalBufferAttributes> = new THREE.BufferGeometry();
        const resetParticles = () => {
            // console.log(particles)
            const pos = particles.getAttribute('position');
            const naa = Math.floor(Math.random() * 1);
            // const naa = Math.random();

            // const bla = [[naa, 0, 0], [0, naa, 0], [0, 0, naa]];
            const bla = [[naa, 1, 1], [1, naa, 1], [1, 1, naa]];
            const span = bla[Math.floor(Math.random() * 3)];
            const [h, s, l] = getColor();
            for (let i = 0; i < pos.count; i++) {

                const pointBasicCoordinate = 2 * Math.PI / PARTICLE_COUNT * i;
                const velocity = 0.5 + Math.random() * 1.5;
                const x = velocity * Math.cos(pointBasicCoordinate);
                // const x = -pos.getX(i) - Math.random() * .05;
                const y = velocity * Math.sin(pointBasicCoordinate);
                // const y = pos.getY(i) - Math.random() * .05;
                // const z = pos.getZ(i);
                const z = (Math.random() * DISTRIBZ - FLOOR_REPEAT * 2);
                // console.log(i, x, y);
                pos.setXYZ(i, x, y, z);


                // const color = new THREE.Color();

                const min = 0;
                const max = 0.3;

                const colorInterval = Math.random() * (max - min) + min;
                const hue = Math.random();

                const vx = colorInterval + hue;
                const vy = 1;
                const vz = 1;
                // color.setRGB(vx, vy, vz, THREE.SRGBColorSpace);


                // debugger;
                // colorlala.setXYZ(i, color.r, color.g, color.b);
                // console.log(bla[Math.floor(Math.random() * 3)]);

                // const [newR, newG, newB] = generateSimilarHueColor(span, 40);
                const col = new THREE.Color().setHSL(h, s, l);
                // 0.78,0.9,0.72
                particles.attributes.color.setXYZ(i, col.r - 0.3 + Math.random() * 0.3, col.g, col.b);

                // particles.attributes.color.setXYZ(i, span[]);

                // console.log(newR, newG, newB);
                // debugger
                // colors.push(color.r, color.g, color.b);
            }


            // scene.children[0].material.color.setRGB();
            // particleMaterial.color.setRGB(Math.random(), Math.random(), Math.random());

            // particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            textMesh.position.set(-3.5, -0.3, 0); // Center the text
            // textMesh.material.color.r = span[0];
            textMesh.material.color.setHSL(h, s + 0.1, l);
            // textMesh.material.color.setHex(0x3acfd5);
            // textMesh.material.color.g = span[1];
            // textMesh.material.color.b = span[2];

            particles.attributes.color.needsUpdate = true;
            pos.needsUpdate = true;
            // particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }

        const animateParticles = () => {
            // console.log(particles)
            const pos = particles.getAttribute('position');

            if (typeof textMesh !== 'undefined') {
                textMesh.position.z = textMesh.position.z + 0.02;
            }

            // console.log(posText);

            for (let i = 0; i < pos.count; i++) {
                if (pos.getX(i) > 4) {
                    resetParticles();
                    break;
                }
                // const pointBasicCoordinate = 2 * Math.PI / PARTICLE_COUNT * i;
                const velocity = 0.008 + Math.random() * 0.003;
                const pointBasicCoordinate = 2 * Math.PI / PARTICLE_COUNT * i;

                const x = pos.getX(i) + Math.cos(pointBasicCoordinate) * velocity;
                // const x = 9;
                const y = pos.getY(i) + Math.sin(pointBasicCoordinate) * velocity;
                // const y = 5;
                const z = pos.getZ(i) + 0.005;
                // const z = -8;
                // console.log(i, x, y, z);
                pos.setXYZ(i, x, y, z);
            }

            pos.needsUpdate = true;

        }

        const points = [];
        const colors = [];
        const point = new THREE.Vector3();

        for (let a = 0; a < PARTICLE_COUNT; a++) {
            const pointBasicCoordinate = 2 * Math.PI / PARTICLE_COUNT * a;
            const velocity = 0.5 + Math.random() * 1.5;
            // point.x = 6;
            point.x = velocity * Math.cos(pointBasicCoordinate);
            // point.y = 0;
            point.y = velocity * Math.sin(pointBasicCoordinate);
            // console.log("one", point);
            // point.z = -4;
            point.z = (Math.random() * DISTRIBZ - FLOOR_REPEAT * 2);

            const color = new THREE.Color();

            const min = -0.3;
            const max = 0.3;

            const ran = Math.random() * (max - min) + min;

            const ran2 = Math.random();

            const n = 1000, n2 = n / 2;

            const vx = ran + ran2;
            const vy = 0.2;
            const vz = 1;

            color.setRGB(Math.random(), Math.random(), Math.random(), THREE.SRGBColorSpace);

            colors.push(color.r, color.g, color.b);

            points.push(point.x, point.y, point.z);
        }

        // for (let i = 0; i < PARTICLE_COUNT; i++) {
        //     // point.x = 100*Math.cos(i);
        //     point.x = Math.random() * ELEV - DELTA_ELEV;
        //     // point.y = 100*Math.sin(i);
        //     point.y = Math.random() * DISTRIBX - FLOOR_REPEAT * 2;
        //     console.log("two", point);
        //     point.z = Math.random() * DISTRIBZ - FLOOR_REPEAT * 2;
        //     // point.random();
        //     points.push(point.x, point.y, point.z);
        //
        // }

        // var DISTRIBX = 20;
        // var DISTRIBZ = 20;
        // for (var p = 0; p < PARTICLE_COUNT; p++) {
        //     var y = Math.random() * ELEV - DELTA_ELEV;
        //     var x = Math.random() * DISTRIBX - FLOOR_REPEAT * 2;
        //     var z = Math.random() * DISTRIBZ - FLOOR_REPEAT * 2;
        //
        //     var particle = new THREE.Vector3(x, y, z);
        //     particles.push(particle);
        // }

        particles.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        // const pos = particles.getAttribute("position");
        particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        // console.log("particles", particles.getAttribute("position"), pos.getX(1));

        // const material = new THREE.MeshLambertMaterial({transparent: true});
        // material.color.setRGB(Math.random(), Math.random(), Math.random());

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true
        });

        // particleMaterial.color.setRGB(Math.random(), Math.random(), Math.random());

        const particleSystem = new THREE.Points(particles, particleMaterial);

        scene.background = new THREE.Color().setRGB(0.002, 0.002, 0.002);
        // scene.fog =  new THREE.Fog( "red", 10, 15 );

        scene.add(particleSystem);

        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry('Game Over', {
                font: font,
                size: 1,
                depth: 0.1,
            });
            textGeometry.computeBoundingBox();
            const textMaterial = new THREE.MeshBasicMaterial({color: "#24242e", opacity: 0.7, transparent: true});
            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            // debugger;
            textMesh.position.set(-3.5, -0.3, 0); // Center the text
            textMesh.rotation.x = 99.8;
            // textMesh.rotation.z = 1

            camera.position.z = 6;
            scene.add(textMesh);
        });

        // const canvas = document.createElement('canvas');
        // canvas.width = 256;
        // canvas.height = 128;
        // const ctx = canvas.getContext('2d');
        // ctx.fillStyle = '#007BFF'; // Blue button background
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = '#FFFFFF'; // White text
        // ctx.font = '50px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillText('Click Me!', canvas.width / 2, canvas.height / 2);
        // // Use canvas as texture
        // const texture = new THREE.CanvasTexture(canvas);
        // const buttonGeometry = new THREE.BoxGeometry(1, 0.5, 0.1);
        // const buttonMaterial = new THREE.MeshBasicMaterial({map: texture});
        // const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        // button.position.set(0, -1, 2); // Position in front of the camera
        // scene.add(button);


        // const canvas = document.createElement('canvas');
        // const context = canvas.getContext('2d');
        // canvas.width = 256;
        // canvas.height = 64;
        // context.fillStyle = 'white';
        // context.font = '20px Arial';
        // context.fillText(book.title, 10, 40);
        //
        // const texture = new THREE.CanvasTexture(canvas);
        // const titleMaterial = new THREE.MeshBasicMaterial({ map: texture });
        // const titleMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), titleMaterial);
        // titleMesh.position.set(0, 1, 0.26);
        // bookMesh.add(titleMesh);

        // const root = new THREE.Object3D()
        // root.position.y = 20
        // root.rotation.y = Math.PI / 3
        // scene.add(root)

        // const background = makeElementObject('div', 200, 200)
        //     background.css3dObject.element.textContent = "How can we make the Sphere show behind this transparent DOM surface?"
        //     background.css3dObject.element.setAttribute('contenteditable', '')
        //     background.position.z = 20
        //     background.css3dObject.element.style.opacity = "0.45"
        //     background.css3dObject.element.style.padding = '10px'
        //     const color1 = '#7bb38d'
        //     const color2 = '#71a381'
        //     background.css3dObject.element.style.background = `repeating-linear-gradient(
        //     45deg,
        //     ${color1},
        //     ${color1} 10px,
        //     ${color2} 10px,
        //     ${color2} 20px
        // )`
        //     root.add( background );
        //
        //     const button = makeElementObject('button', 75, 20)
        //     button.css3dObject.element.style.border = '2px solid #fa5a85'
        //     button.css3dObject.element.textContent = "Click me!"
        //     button.css3dObject.element.addEventListener('click', () => alert('You clicked a <button> element in the DOM!'))
        //     button.position.y = 10
        //     button.position.z = 10
        //     button.css3dObject.element.style.background = '#e64e77'
        //     background.add(button)


        // debugger;

        // const geometry = new THREE.BufferGeometry();
        // const vertices = [];
        //
        // for (let i = 0; i < 10000; i++) {
        //
        //     const x = Math.random() * 2000 - 1000;
        //     const y = Math.random() * 2000 - 1000;
        //     const z = Math.random() * 2000 - 1000;
        //
        //     vertices.push(x, y, z);
        //
        // }
        //
        // geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        //
        // const parameters = [
        //     [[1.0, 0.2, 0.5], "pink", 20],
        //     [[0.95, 0.1, 0.5], "pink", 15],
        //     [[0.90, 0.05, 0.5], "pink", 10],
        //     [[0.85, 0, 0.5], "pink", 8],
        //     [[0.80, 0, 0.5], "pink", 5]
        // ];

        // const materials = [];
        //
        // for (let i = 0; i < parameters.length; i++) {
        //
        //     const color = parameters[i][0];
        //     const sprite = parameters[i][1];
        //     const size = parameters[i][2];
        //
        //     materials[i] = new THREE.PointsMaterial({
        //         size: size,
        //         // map: sprite,
        //         blending: THREE.AdditiveBlending,
        //         depthTest: false,
        //         transparent: true
        //     });
        //     materials[i].color.setHSL(color[0], color[1], color[2], THREE.SRGBColorSpace);

        // const particles = new THREE.Points(geometry, materials[i]);

        // particles.rotation.x = Math.random() * 6;
        // particles.rotation.y = Math.random() * 6;
        // particles.rotation.z = Math.random() * 6;

        // scene.add(particles);

        const render = () => {
            requestAnimationFrame(render);

            // console.log(scene);
            // debugger;
            // debugger;

            animateParticles();

            // setTimeout(() => {
            //     animateParticles();
            // }, 3000);
            // resetParticles();

            // update scene.children[0].geometry.getAttribute("position")

            renderer.render(scene, camera);
        };

        render();
    }, []);

    return <>
        {/*<button className="btn btn-game-over">Play again</button>*/}
        <canvas ref={canvasRef} width="370" height="244" style={{
            border: "0.2rem solid",
            borderImage: "linear-gradient(to right, #3acfd5 0%, #3a4ed5 100%) 1",
        }}
        />

    </>

};

export default Fireworks;
