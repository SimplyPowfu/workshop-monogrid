import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Inspector } from 'three/addons/inspector/Inspector.js'
import { Timer, Vector3 } from 'three'
import { watch } from 'vue'

import router from '@/router'

import { createAnimation, updateAnimation } from './animations'
import { loadEnvironment } from './enviroment'
import { createMarkers, updateMarkerScreenPositions } from './store'
import { loadModel } from './loadModels'
import { createPostProcessing } from './postprocessing'
import { createEngine } from './setup'

export async function initScene (container: HTMLCanvasElement): Promise<() => void> {
	
  const { scene, camera, renderer, onResize } = await createEngine(container)
  // const inspector = new Inspector()
  // inspector.setRenderer(renderer)
  // container.appendChild(inspector.domElement)

  // Ho usato il tool di monogrid per la scena (non so se esiste un'alternativa per WebGPU)
  await loadEnvironment(scene, renderer)

  const model = await loadModel(scene)
  
  const animations = createAnimation(model)

  const postProcessing = createPostProcessing(renderer, scene, camera)

  camera.position.set(3.5, 3, 0)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.minDistance = 2.5
  controls.maxDistance = 3.5
  controls.minPolarAngle = Math.PI / 2 - 0.5
  controls.maxPolarAngle = Math.PI / 2 + 0.2
  controls.target.set(0, 3, 0)

  const markers = createMarkers(model)

  const _target = new Vector3()
  const defaultFov = camera.fov
  const zoomedFov = 30

  const stopWatch = watch(
    () => router.currentRoute.value.params.id,
    (id) => {
      const marker = id ? markers.find(m => m.id === id) : undefined

      if (marker) {
        marker.object.getWorldPosition(_target)
        _target.y += marker.offsetY
        gsap.to(controls.target, { x: _target.x, y: _target.y, z: _target.z, duration: 1, ease: 'power2.inOut' })
        gsap.to(camera, { fov: zoomedFov, duration: 1, ease: 'power2.inOut', onUpdate: () => camera.updateProjectionMatrix() })
      } else {
        gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1, ease: 'power2.inOut' })
        gsap.to(camera, { fov: defaultFov, duration: 1, ease: 'power2.inOut', onUpdate: () => camera.updateProjectionMatrix() })
      }
    },
    { immediate: true, flush: 'sync' }
  )

  const timer = new Timer()
  renderer.setAnimationLoop(() => {
    timer.update()
    const delta = timer.getDelta()

    controls.update()
    updateAnimation(animations, delta)

    // Three -> Vue: sole coordinate 2D nello store (leggero). Il grafo 3D resta fuori da reactive().
    updateMarkerScreenPositions(markers, camera, container)

    postProcessing.render()
  })

  return () => {
    stopWatch()
    renderer.setAnimationLoop(null)
    window.removeEventListener('resize', onResize)
    controls.dispose()
    renderer.dispose()
  }
}