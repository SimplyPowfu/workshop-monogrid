import {  LoadingManager, Timer, AmbientLight, DirectionalLight, type Object3D} from 'three'
 
import { createEngine } from './setup'
import { loadEnvironment } from './enviroment';
import { loadLampModel } from './loadLampshade';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { loadBottlesModel } from './loadBottles';

export interface Result {
  cleanup: () => void;
  bottle: Object3D;
  lampshade: Object3D;
}

export async function initCustomScene (container: HTMLCanvasElement, onProgress?: (p: number) => void): Promise<Result> {
  const { scene, camera, renderer, onResize } = await createEngine(container)
  await loadEnvironment(scene, renderer, true, true)
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
  const bottle = await loadBottlesModel(scene, manager)
  const lampshade = await loadLampModel(scene, manager)

  const ambientLight = new AmbientLight(0xffffff, 4)
  scene.add(ambientLight)

  const directionalLight = new DirectionalLight(0xffffff, 10)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  camera.position.set(0, 0.68, 2)

  window.addEventListener('resize', onResize)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.minDistance = 2
  controls.maxDistance = 2.5
  controls.minPolarAngle = Math.PI / 2 - 0.5
  controls.maxPolarAngle = Math.PI / 2 + 0.2
  controls.target.set(0, 0.7, 0)

  renderer.setAnimationLoop(() => {
    controls.update()
    renderer.render(scene, camera)
  })

  const cleanup = () => {
    renderer.setAnimationLoop(null)
    controls.dispose();
    window.removeEventListener('resize', onResize)
    renderer.dispose()
  }

  return {cleanup, bottle, lampshade}
}