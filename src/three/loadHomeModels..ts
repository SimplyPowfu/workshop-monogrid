import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
	Mesh,
    Color,
	MeshPhysicalMaterial,
	Scene,
    LoadingManager,
} from 'three'

import bottleUrl from '../assets/bottle4.glb?url'

export async function loadHomeModel(scene: Scene, manager: LoadingManager) {
    const gltfLoader = new GLTFLoader(manager);
    const gltf = await gltfLoader.loadAsync(bottleUrl);
    const bottle = gltf.scene;
    bottle.traverse((child) => {
        if ((child as Mesh).isMesh) {
            if (child instanceof Mesh) {
                if (child.name.includes("LampShade001"))
                    child.material.color = new Color('black'); //serve per personalizzare dopo il paralume con i colori che vuoi
                if (child.name.includes("LIQUID")) {
                    child.material = new MeshPhysicalMaterial({
                        color: new Color("#521a00"),
                        roughness: 0,
                        metalness: 0,
                        transmission: 1,
                        ior: 1.5,
                        thickness: 0.5,
                        transparent: true,
                    });
                    child.renderOrder = 1;
                }
                if (child.name.includes("GLASS")) {
                    child.material = new MeshPhysicalMaterial({
                        color: 0xffffff,
                        roughness: 0,
                        transmission: 1,
                        ior: 2,
                        thickness: 1,
                        transparent: true,
                        depthWrite: false
                    });
                    child.renderOrder = 0;
                }
            }
        }
    });

    bottle.rotation.y = -89.5;
    bottle.rotation.x = Math.PI / 2;
    bottle.position.y = 0.7;
    scene.add(bottle);
    return bottle;
}