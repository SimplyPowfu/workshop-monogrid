import {  LoadingManager, Timer, AmbientLight, DirectionalLight, type Object3D} from 'three'

import { loadHomeModel } from './loadHomeModels.' 
import { createEngine } from './setup'
import { loadEnvironment } from './enviroment';

export interface Result {
  cleanup: () => void;
  bottle: Object3D;
}

export async function initHomeScene (container: HTMLCanvasElement, rotate: boolean ,onProgress?: (p: number) => void): Promise<Result> {
	
  const { scene, camera, renderer, onResize } = await createEngine(container)
  await loadEnvironment(scene, renderer, false)
  const manager = new LoadingManager();
  manager.onStart = () => {
    onProgress?.(0);
  };
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    if (onProgress) {
      const progressPercent = (itemsLoaded / itemsTotal) * 100;
      onProgress(progressPercent);
    }
  };
  const bottle = await loadHomeModel(scene, manager)

  const ambientLight = new AmbientLight(0xffffff, 4)
  scene.add(ambientLight)

  const directionalLight = new DirectionalLight(0xffffff, 10)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  camera.position.set(0, 0.68, 2)

  window.addEventListener('resize', onResize)

  const timer = new Timer()
  renderer.setAnimationLoop(() => {
    timer.update()
    const delta = timer.getDelta()
    if (rotate)
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