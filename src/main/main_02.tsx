/*
 * @Author: Qiling
 * @Date: 2023-07-04 23:51:39
 * @LastEditors: qiling qiling@qunhemail.com
 * @LastEditTime: 2023-07-05 00:55:21
 * @FilePath: \01-three_basic\src\main\main.tsx
 * @Description:
 *
 */
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// console.log(THREE);
// 目的：轨道控制器
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
  color: 0x000000,
});
var line = new THREE.LineSegments(edges, edgesMaterial);
// 网格模型和网格模型对应的轮廓线框插入到场景中
scene.add(cube, line);
// 初始化渲染器
const render = new THREE.WebGLRenderer({ antialias: true });
// 设施渲染尺寸大小
render.setSize(window.innerWidth, window.innerHeight);
// 将webgl中的canvas添加到body
document.body.appendChild(render.domElement);
// 使用渲染器，通过相机将场景渲染到屏幕上

render.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, render.domElement);

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
function handleRender() {
  render.render(scene, camera);
  //   请求下一帧渲染
  requestAnimationFrame(handleRender);
}
handleRender();
