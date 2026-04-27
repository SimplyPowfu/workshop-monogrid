import {  Timer, AmbientLight, DirectionalLight, type Object3D} from 'three'

import { loadHomeModel } from './loadHomeModels.' 
import { createEngine } from './setup'

export interface Result {
  cleanup: () => void;
  bottle: Object3D;
}

export async function initHomeScene (container: HTMLCanvasElement): Promise<Result> {
	
  const { scene, camera, renderer, onResize } = await createEngine(container)
  window.addEventListener('resize', onResize)
  const bottle = await loadHomeModel(scene)

  const ambientLight = new AmbientLight(0xffffff, 4)
  scene.add(ambientLight)

  const directionalLight = new DirectionalLight(0xffffff, 3)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  camera.position.set(0, 0.68, 2)

  const timer = new Timer()
  renderer.setAnimationLoop(() => {
    timer.update()
	const delta = timer.getDelta()
	bottle.rotation.y -= 1 * delta;
	renderer.render(scene, camera)
  })

  const cleanup = () => {
    renderer.setAnimationLoop(null)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
  }

  return {cleanup, bottle}
}