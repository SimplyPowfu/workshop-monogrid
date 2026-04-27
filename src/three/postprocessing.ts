import { WebGLRenderer, Scene, PerspectiveCamera, Vector2 } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function createPostProcessing(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera
) {
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const resolution = new Vector2(window.innerWidth, window.innerHeight);
  const bloomPass = new UnrealBloomPass(resolution, 0.4, 0.5, 0.85);
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return composer;
}