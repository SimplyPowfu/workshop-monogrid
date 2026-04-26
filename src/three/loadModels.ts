import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  Mesh,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  MeshBasicMaterial
} from 'three'

import bakeUrl from '../assets/night_bake.png?url'
import scenaUrl from '../assets/scena.glb?url'
import bottleUrl from '../assets/bottles.glb?url'

export async function loadModel (scene: Scene) {
	const textureLoader = new TextureLoader();
	const bakeTexture = await textureLoader.loadAsync(bakeUrl)
	bakeTexture.flipY = false
	bakeTexture.colorSpace = SRGBColorSpace

	const gltfLoader = new GLTFLoader()
	let gltf = await gltfLoader.loadAsync(scenaUrl)
	const scena = gltf.scene

	scena.traverse((node) => {
		if (node instanceof Mesh && node.material) {
			node.material.envMapIntensity = 1
			node.material = new MeshBasicMaterial({ map: bakeTexture });
		}
	})
	scene.add(scena)

	gltf = await gltfLoader.loadAsync(bottleUrl);
	const bottles = gltf.scene
	const lampshade = bottles.getObjectByName('Tref012_LampShade001_B_02_BlackFabric_0003') as Mesh
  	lampshade.material.color.set('black')
	scene.add(bottles);
	return { scena, bottles }
}