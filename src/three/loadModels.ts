import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  Mesh,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Color,
} from 'three'

import bakeUrl from '../assets/bake.png?url'
import scenaUrl from '../assets/scena.glb?url'
import bottleUrl from '../assets/bottles3.glb?url'

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

	let color;
	gltf = await gltfLoader.loadAsync(bottleUrl);
	const bottles = gltf.scene
	bottles.traverse((node) => {
		if (node instanceof Mesh) {
            if (node.name.includes("LIQUID")) {
				if (node.name === 'LIQUID003')
					color = "#ca7d00";
				else if (node.name === 'Object_2_LIQUID')
					color = "#180e00";
				else
					color = '#ffffff';
                node.material = new MeshPhysicalMaterial({
					color: new Color(color),
                    roughness: 0,
					metalness: 0,
                    transmission: 1,
                    ior: 1.5,
                    thickness: 0.5,
                    transparent: true,
                });
				node.renderOrder = 1;
            }
			if (node.name.includes("GLASS")) {
				if (node.name === 'Object_2_GLASS')
					color = "#175200";
				else
					color = '#ffffff';
				node.material = new MeshPhysicalMaterial({
					color: new Color(color),
					roughness: 0,
					transmission: 1,
					ior: 2,
					thickness: 1,
					transparent: true,
					depthWrite: false
				});
				node.renderOrder = 0;
			}
        }
    });
	scene.add(bottles);
	return { scena, bottles }
}