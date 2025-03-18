import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, PointLight, Color } from 'three';
import { OrbitControls } from 'OrbitControls';

export default function initScene(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true });

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const far = 200;
  const near = 1;
  const fov = 60;
  const camera = new PerspectiveCamera(fov, aspect, near, far);

  camera.position.set(15, 15, 20);

  const scene = new Scene();
  scene.background = new Color('#000');

  scene.camera = camera;
  window.scene = scene;

  initLight(scene);
  const control = initControls(camera, canvas);

  function render() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.render(scene, camera);

    TWEEN.update();
    control.update();
    requestAnimationFrame(render);
  }
  render();

  return { scene, camera, renderer, control };
}

function initLight(scene) {
  const ambientLight = new AmbientLight(0x333333);
  scene.add(ambientLight);

  let pointLight = new PointLight(0xffffff, 0.8);
  pointLight.position.set(2000, 1000, 3000);
  scene.add(pointLight);

  let pointLight2 = new PointLight(0xffffff, 0.6);
  pointLight2.position.set(-2000, 1000, -3000);
  scene.add(pointLight2);
}

function initControls(camera, canvas) {
  const control = new OrbitControls(camera, canvas);
  control.rotateSpeed = 0.6;
  control.minDistance = 10;
  control.maxDistance = 100;
  control.maxPolarAngle = Math.PI / 2;
  control.enableDamping = true;
  control.dampingFactor = 0.08;
  return control;
}
