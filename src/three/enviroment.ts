import { HDRJPGLoader } from '@monogrid/gainmap-js';
import { WebGLRenderer, EquirectangularReflectionMapping, PMREMGenerator, Scene, Color, LinearFilter } from 'three';
import hdrjpgUrl from '../assets/autumn_park_4k.jpg?url'
import hdrjpgHomeUrl from '../assets/metro_noord_4k.jpg?url'

export async function loadEnvironment (scene: Scene, renderer: WebGLRenderer, background: Boolean) {
	if (!scene || !renderer) throw new Error('[ENVIROMENTS] dati mancanti')
  const pmremGenerator = new PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()

  const hdrjpgLoader = new HDRJPGLoader(renderer).setRenderTargetOptions({
    mapping: EquirectangularReflectionMapping
  });
  const hdri = background ? hdrjpgUrl : hdrjpgHomeUrl;
  const result = await hdrjpgLoader.loadAsync(hdri)
  const hdrTexture = result.renderTarget.texture;

  renderer.initTexture(hdrTexture)
  
  const pmremRenderTarget = pmremGenerator.fromEquirectangular(hdrTexture);
  const envMap = pmremRenderTarget.texture;

  scene.environment = envMap;
  if (background)
    scene.background = envMap;
  else
    scene.background = new Color('#12090d');

  result.renderTarget.dispose();
  pmremGenerator.dispose();
}