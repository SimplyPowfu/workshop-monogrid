<script setup lang="ts">

  import { ref, onMounted, onUnmounted } from 'vue'
  import * as THREE from 'three';
  import Stats from 'three/addons/libs/stats.module.js';
  import { GLTFLoader } from 'three/examples/jsm/Addons.js';

  const containerRef = ref<HTMLDivElement | null>(null)
  const wrapperRef = ref<HTMLDivElement | null>(null)

  let timer: THREE.Timer
  let stats: Stats

  let renderer: THREE.WebGLRenderer
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera

  let gltfLoader: GLTFLoader
  let lamp: THREE.Object3D | null = null;

  const initThree = () => {
    if (!containerRef.value || !wrapperRef.value) return ;
    
    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#A8A8A8');
    
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000 );
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 3.5, 0);

    renderer = new THREE.WebGLRenderer({canvas: containerRef.value, antialias: true});
    renderer.setSize(width, height);

    timer = new THREE.Timer()
    stats = new Stats();
    stats.showPanel(0);
    wrapperRef.value.appendChild(stats.dom);

    const geometry = new THREE.BoxGeometry(3,0.1,3);
    const material = new THREE.MeshStandardMaterial({ color: '#00ff00' });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y -= 0.1;
    scene.add(cube);

    gltfLoader = new GLTFLoader();
    gltfLoader.load('/models/proofBeam.glb', (gltf) => {
      lamp = gltf.scene;
      scene.add(lamp);
    })

    const light = new THREE.DirectionalLight('#ffffff', 4)
    light.position.set(5, 5, 2)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
    scene.add(ambientLight)

    renderer.setAnimationLoop((currentTime) => {
      stats.begin();
      timer.update(currentTime);
      const delta = timer.getDelta();
      cube.rotation.y += 1 * delta;
      if (lamp)
        lamp.rotation.y += 1 *  delta;
      renderer.render(scene, camera);
      stats.end();
    });
  }

  onMounted(() => {
    initThree()
  })
  
  onUnmounted(() => {
    if (renderer) {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    if (stats && stats.dom && stats.dom.parentNode) {
      stats.dom.parentNode.removeChild(stats.dom);
    }
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    scene.clear();
  })
</script>

<template>
  <div ref= "wrapperRef">
    <h1>Day 1 Workshop MONOGRID!</h1>
	<p> clicca per tornare alla <a href="/"> Homepage</a></p>
    <canvas ref="containerRef"></canvas>
  </div>
</template>

<style scoped>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
