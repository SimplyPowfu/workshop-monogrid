import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
	Scene,
    LoadingManager,
    Mesh,
    Color,
} from 'three'

import lampUrl from '../assets/lampshades.glb?url'

export async function loadLampModel(scene: Scene, manager: LoadingManager) {
    const gltfLoader = new GLTFLoader(manager);
    const gltf = await gltfLoader.loadAsync(lampUrl);
    const lampshade = gltf.scene;
    const lamp1 = lampshade.getObjectByName("lampshade1");
    if (lamp1) {
        lamp1.traverse((child) => {
            if ((child as Mesh).isMesh)
                if (child instanceof Mesh)
                    if (child.name.includes("LampShade001"))
                        child.material.color = new Color('black');
        });
    }
    scene.add(lampshade);
    return lampshade;
}