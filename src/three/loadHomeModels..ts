import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
	Mesh,
    Color,
	MeshPhysicalMaterial,
	Scene
} from 'three'

import bottleUrl from '../assets/bottle.glb?url'

export async function loadHomeModel(scene: Scene) {
    const gltfLoader = new GLTFLoader();
    const gltf = await gltfLoader.loadAsync(bottleUrl);
    const bottle = gltf.scene;
    bottle.traverse((child) => {
        if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;
            if (mesh.name.includes("LIQUID")) {
                mesh.material = new MeshPhysicalMaterial({
                    color: new Color("#521a00"),
                    roughness: 0,
                    metalness: 0,
                    transmission: 1,
                    ior: 1.5,
                    thickness: 0.5,
                    transparent: true,
                });
                mesh.renderOrder = 1;
            }
            if (mesh.name.includes("GLASS")) {
                mesh.material = new MeshPhysicalMaterial({
                    color: 0xffffff,
                    roughness: 0,
                    transmission: 1,
                    ior: 2,
                    thickness: 1,
                    transparent: true,
                    depthWrite: false
                });
                mesh.renderOrder = 0;
            }
        }
    });

    bottle.rotation.y = -89.5;
    bottle.rotation.x = Math.PI / 2;
    bottle.position.y = 0.7;
    scene.add(bottle);
    return bottle;
}