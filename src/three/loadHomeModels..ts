import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  Scene
} from 'three'

import bottleUrl from '../assets/bottle2.glb?url'

export async function loadHomeModel (scene: Scene) {
	const gltfLoader = new GLTFLoader()
	const gltf = await gltfLoader.loadAsync(bottleUrl);
	const bottle = gltf.scene
	bottle.rotation.y = -89.5;
	bottle.rotation.x = Math.PI / 2
	bottle.position.y = 0.7
	scene.add(bottle);
	return bottle
}