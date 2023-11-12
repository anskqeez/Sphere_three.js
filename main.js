import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64, 64);

const material = new THREE.MeshStandardMaterial({
	color: '#00ff83',
	roughness: 0.5,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 10, 100);
light.position.set(0, 10, 10);
light.intensity = 125;
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;

scene.add(camera);

const canvas = document.querySelector('.canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
function resize() {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
}

window.addEventListener('resize', resize);

const loop = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
};

loop();

const timeLine = gsap.timeline({ defaults: { duration: 1.3 } });
timeLine.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

// timeLine.fromTo('nav', { y: '-100%' }, { y: '0%' });
// timeLine.fromTo('h1', { opacity: '0' }, { opacity: '1' });

let mouseDown = false;
let rgba = [];

function valueOfMouse() {
	return (mouseDown = !mouseDown);
}

window.addEventListener('mousedown', valueOfMouse);
window.addEventListener('mouseup', valueOfMouse);

function mouseMove(e) {
	if (mouseDown) {
		rgba = [
			Math.round((e.pageX / sizes.width) * 255),
			Math.round((e.pageY / sizes.height) * 255),
			150,
		];
		let newColor = new THREE.Color(`rgba(${rgba.join(',')})`);
		gsap.to(mesh.material.color, {
			r: newColor.r,
			g: newColor.g,
			b: newColor.b,
		});
	}
}

window.addEventListener('mousemove', mouseMove);
