/*
 * @Author: Qiling
 * @Date: 2023-07-04 23:51:39
 * @LastEditors: qiling qiling@qunhemail.com
 * @LastEditTime: 2023-07-08 11:39:45
 * @FilePath: \three\src\main\main.tsx
 * @Description:
 *
 */
import * as THREE from "three";
import Stats from "stats.js";
// 导入dat.gui
import * as dat from "dat.gui";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入动画库
import { gsap } from "gsap";

let scene, renderer, camera, stats, controls;
let model, skeleton, mixer, clock;

let walkAction, runAction;
let action, settings;

let singleStepMode = false;
let sizeOfNextStep = 0;
// 初始化
init();
function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(1, 2, -3);
  camera.lookAt(0, 1, 0);

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
  // 半球光
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);
  // 平行光
  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(-3, 10, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);
  scene.add(camera);

  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    // 反射 有光泽
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const loader = new GLTFLoader();
  loader.load("./models/Soldier.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);

    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    //

    skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;
    scene.add(skeleton);

    const animations = gltf.animations;

    mixer = new THREE.AnimationMixer(model);

    walkAction = mixer.clipAction(animations[3]);
    runAction = mixer.clipAction(animations[1]);

    action = walkAction;

    createPanel();
    activateAllActions();

    animate();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.useLegacyLights = false;

  document.body.appendChild(renderer.domElement);
  stats = new Stats();
  document.body.appendChild(stats.dom);
  renderer.render(scene, camera);
  window.addEventListener("resize", onWindowResize);

  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼，更真实，必须在动画循环里调用update
  controls.enableDamping = true;
}
function createPanel() {
  const panel = new dat.GUI({ width: 310 });
  settings = {
    切换模式: "walk",
  };
  panel.add(settings, "切换模式", ["walk", "run"]).onChange(function () {
    if (settings["切换模式"] === "walk") {
      action = walkAction;
    } else {
      action = runAction;
    }
  });
}
function activateAllActions() {
  action.play();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  activateAllActions();
  let mixerUpdateDelta = clock.getDelta();

  if (singleStepMode) {
    mixerUpdateDelta = sizeOfNextStep;
    sizeOfNextStep = 0;
  }

  mixer.update(mixerUpdateDelta);

  stats.update();

  renderer.render(scene, camera);
}
