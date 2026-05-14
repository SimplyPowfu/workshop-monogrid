import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
	Mesh,
    Color,
	MeshPhysicalMaterial,
	Scene,
    LoadingManager,
} from 'three'

import bottleUrl from '../assets/bottles.glb?url'

export async function loadBottlesModel(scene: Scene, manager: LoadingManager) {
    const gltfLoader = new GLTFLoader(manager);
    const gltf = await gltfLoader.loadAsync(bottleUrl);
    const bottles = gltf.scene;
	bottles.rotation.y = -89.5;
    bottles.traverse((node) => {
		if (node instanceof Mesh) {
			let color;
            if (node.name.includes("LIQUID")) {
				if (node.name === 'LIQUID003')
					color = "#521a00";
				else if (node.name === 'Object_2_LIQUID')
					color = "#180e00";
				else
					color = '#ffffff';
                node.material = new MeshPhysicalMaterial({
					color: new Color(color),
                    roughness: 0,
					metalness: 0,
                    transmission: 1,
                    ior: 1.3,
                    thickness: 0.5,
                    transparent: true,
                });
				node.renderOrder = 1;
            }
			if (node.name.includes("GLASS")) {
				if (node.name === 'Object_2_GLASS')
					color = "#0b2700";
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
    return bottles;
}