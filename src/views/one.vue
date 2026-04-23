<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { HDRJPGLoader } from '@monogrid/gainmap-js'

const containerRef = ref<HTMLDivElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

let timer: THREE.Timer
let stats: Stats
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

const initThree = () => {
  if (!containerRef.value || !wrapperRef.value) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  // 1. SCENA E CAMERA
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#A8A8A8')
  
  camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000)
  camera.position.set(3.5, 3, 0)

  // 2. RENDERER (Configurazione HDR)
  renderer = new THREE.WebGLRenderer({ canvas: containerRef.value, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // 3. CONTROLLI (Limitati come richiesto)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.minDistance = 2.5
  controls.maxDistance = 3.5
  controls.minPolarAngle = Math.PI / 2 - 0.5
  controls.maxPolarAngle = Math.PI / 2 + 0.2
  controls.target.set(0, 3, 0)

  // 4. UTILITIES
  timer = new THREE.Timer()
  stats = new Stats()
  wrapperRef.value.appendChild(stats.dom)

  // 5. CARICAMENTO HDRI (Gain Map Monogrid)
  const hdrJpgLoader = new HDRJPGLoader(renderer)
  hdrJpgLoader.load('/models/autumn_park_4k.jpg', (result) => {
    const texture = result.renderTarget.texture
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture
    scene.background = texture
  })

  scene.add(new THREE.AmbientLight('#ffffff', 0.2))

  // 6. CARICAMENTO ASSET
  const textureLoader = new THREE.TextureLoader()
  const gltfLoader = new GLTFLoader()

  // Caricamento Bake Texture
  const bakeTexture = textureLoader.load('/models/bake.png')
  bakeTexture.flipY = false
  bakeTexture.colorSpace = THREE.SRGBColorSpace

  // Caricamento Scena (Pub)
  gltfLoader.load('/models/scena.glb', (gltf) => {
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.material = new THREE.MeshBasicMaterial({ map: bakeTexture })
      }
    })
    scene.add(gltf.scene)
  })

  // Caricamento Bottiglia
  gltfLoader.load('/models/bottles.glb', (gltf) => {
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.material) {
        // Manteniamo il materiale originale di Blender potenziando i riflessi
        node.material.envMapIntensity = 1.5
      }
    })
    scene.add(gltf.scene)
  })

  // 7. ANIMATION LOOP
  renderer.setAnimationLoop((currentTime) => {
    stats.begin()
    timer.update(currentTime)
    controls.update()
    renderer.render(scene, camera)
    stats.end()
  })

  window.addEventListener('resize', onWindowResize)
}

const onWindowResize = () => {
  if (!containerRef.value) return
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

onMounted(() => initThree())

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  renderer?.dispose()
  stats?.dom.remove()
})
</script>

<template>
  <div ref="wrapperRef" class="scene-container">
    <canvas ref="containerRef"></canvas>
  </div>
</template>

<style scoped>
.scene-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>