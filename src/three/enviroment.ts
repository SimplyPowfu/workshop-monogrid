import { HDRJPGLoader } from '@monogrid/gainmap-js';
import { WebGLRenderer, EquirectangularReflectionMapping, PMREMGenerator, Scene } from 'three';
import hdrjpgUrl from '../assets/autumn_park_4k.jpg?url'

export async function loadEnvironment (scene: Scene, renderer: WebGLRenderer) {
	if (!scene || !renderer) throw new Error('[ENVIROMENTS] dati mancanti')
  const pmremGenerator = new PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()

  const hdrjpgLoader = new HDRJPGLoader(renderer).setRenderTargetOptions({
    mapping: EquirectangularReflectionMapping
  });
  const result = await hdrjpgLoader.loadAsync(hdrjpgUrl)
  const hdrTexture = result.renderTarget.texture;

  const pmremRenderTarget = pmremGenerator.fromEquirectangular(hdrTexture);
  const envMap = pmremRenderTarget.texture;

  scene.environment = envMap;
  scene.background = envMap;

  result.renderTarget.dispose();
  pmremGenerator.dispose();
}