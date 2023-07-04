/*
 * @Author: Qiling
 * @Date: 2023-07-04 23:51:39
 * @LastEditors: qiling qiling@qunhemail.com
 * @LastEditTime: 2023-07-05 00:38:12
 * @FilePath: \01-three_basic\src\main\main.tsx
 * @Description:
 *
 */
import * as THREE from "three";

// console.log(THREE);
// 目的：创建场景
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

scene.add(cube);

// 初始化渲染器
const render = new THREE.WebGLRenderer();
// 设施渲染尺寸大小
render.setSize(window.innerWidth, window.innerHeight);
// 将webgl中的canvas添加到body
document.body.appendChild(render.domElement);
// 使用渲染器，通过相机将场景渲染到屏幕上

render.render(scene, camera);
