import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  Mesh,
  Scene,
  SRGBColorSpace,
  TextureLoader,
} from 'three'

import bakeUrl from '../assets/bake.png?url'
import scenaUrl from '../assets/scena.glb?url'
import bottleUrl from '../assets/bottles.glb?url'

export async function loadModel (scene: Scene) {
	const textureLoader = new TextureLoader();
	const bakeTexture = await textureLoader.loadAsync(bakeUrl)
	bakeTexture.flipY = false
	bakeTexture.colorSpace = SRGBColorSpace

	const gltfLoader = new GLTFLoader()
	let gltf = await gltfLoader.loadAsync(scenaUrl)
	let model = gltf.scene

	model.traverse((node) => {
		if (node instanceof Mesh && node.material) {
			node.material.envMapIntensity = 1.5
		}
	})
	scene.add(model)

	gltf = await gltfLoader.loadAsync(bottleUrl);
	model = gltf.scene

	scene.add(model);
	return model
}