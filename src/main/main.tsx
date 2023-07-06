/*
 * @Author: Qiling
 * @Date: 2023-07-04 23:51:39
 * @LastEditors: qiling qiling@qunhemail.com
 * @LastEditTime: 2023-07-06 22:51:55
 * @FilePath: \three\src\main\main.tsx
 * @Description:
 *
 */
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import { gsap } from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75, // 角度
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);
// 设置相机位置
camera.position.set(0, 0, 10);

scene.add(camera);

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMateril = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// 根据几何材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMateril);
const edges = new THREE.EdgesGeometry(cubeGeometry);
// 立方体线框，不显示中间的斜线
const edgesMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
});
var line = new THREE.LineSegments(edges, edgesMaterial);
const group = new THREE.Group();
group.add(cube, line);
group.position.x = 3;
group.position.y = 3;
scene.add(group);

const gui = new dat.GUI();
gui.add(group.position, "x").min(0).max(5).step(0.1);
const parmas = {
  handleClick: () => {
    gsap.to(group.position, {
      x: 3,
      duration: 2,
      ease: "bounce.in",
      repeat: -1,
    });
  },
};

gui
  .addColor({ color: 0xffff00 }, "color")
  .name("颜色")
  .onChange((color) => {
    cube.material.color.set(color);
  });
gui.add(group, "visible").name("是否可见");
// 点击触发某个事件
gui.add(parmas, "handleClick").name("点击事件");

const folder = gui.addFolder("设置立方体");
folder.add(cube.material, "wireframe").name("是否显示线框");

for (let i = 0; i < 50; i++) {
  const gometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    positionArray[j] = Math.random() * 10 - 5;
  }
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  gometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
  });
  const mesh = new THREE.Mesh(gometry, material);
  scene.add(mesh);
}

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 设施渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将webgl中的canvas添加到body
document.body.appendChild(renderer.domElement);
// 使用渲染器，通过相机将场景渲染到屏幕上

renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，更真实，必须在动画循环里调用update
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

// 设置动画
const animate1 = gsap.to(group.position, {
  y: 0,
  duration: 5,
  ease: "bounce.out",
  repeat: -1,
});
// 控制动画播放和暂停
window.addEventListener("dblclick", () => {
  if (animate1.isActive()) {
    animate1.pause();
  } else {
    animate1.resume();
  }
});
// 控制全屏和退出
window.addEventListener("keydown", (e) => {
  if (e.key === "f") {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }
});

gsap.to(group.rotation, { x: Math.PI * 2, duration: 5, ease: "bounce.out" });
function render() {
  controls.update();
  renderer.render(scene, camera);
  //   请求下一帧渲染
  requestAnimationFrame(render);
}
render();
// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 更新渲染器像素比
  renderer.setPixelRatio(window.devicePixelRatio);
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机投影矩阵
  camera.updateProjectionMatrix();
});
