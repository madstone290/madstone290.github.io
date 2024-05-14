import * as THREE from "three";
import { CSS3DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";
class World {
    constructor() {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.webGLRender = this.createWebGLRenderer();
        this.cssRenderer = this.createCSS3DRenderer();
        this.createControls(this.camera, this.cssRenderer);
        this.addAxesHelper(this.scene);
        this.addLights(this.scene);
    }
    createScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("skyblue");
        return scene;
    }
    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 500;
        const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
        camera.position.set(-200, 200, 200);
        camera.lookAt(0, 0, 0);
        return camera;
    }
    createWebGLRenderer() {
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        return renderer;
    }
    createCSS3DRenderer() {
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.classList.add('for-test-purpose');
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        document.body.appendChild(renderer.domElement);
        return renderer;
    }
    createControls(camera, cssRender) {
        const controls = new OrbitControls(camera, cssRender.domElement);
        controls.minZoom = 0.5;
        controls.maxZoom = 2;
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        this.webGLRender.render(this.scene, this.camera);
        this.cssRenderer.render(this.scene, this.camera);
    }
    addAxesHelper(scene) {
        const axesHelper = new THREE.AxesHelper(100);
        axesHelper.layers.enableAll();
        scene.add(axesHelper);
    }
    addLights(scene) {
        const ambientLight = new THREE.HemisphereLight('white', // bright sky color
        'darkslategrey', // dim ground color
        1);
        ambientLight.layers.enableAll();
        // create a directional light
        const sunLight = new THREE.DirectionalLight('white', 3);
        sunLight.layers.enableAll();
        sunLight.position.set(0, 50, -50);
        sunLight.castShadow = true;
        sunLight.lookAt(0, 0, 0);
        sunLight.shadow.mapSize.width = 512; // default
        sunLight.shadow.mapSize.height = 512; // default
        sunLight.shadow.camera.near = 0.5; // default
        sunLight.shadow.camera.far = 100; // default
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        sunLight.shadow.camera.zoom = 1;
        const helper = new THREE.CameraHelper(sunLight.shadow.camera);
        //sunLight.add(helper);
        scene.add(sunLight);
        scene.add(ambientLight);
    }
}
export { World };
const world = new World();
world.animate();
