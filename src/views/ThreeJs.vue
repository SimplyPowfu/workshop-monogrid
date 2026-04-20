<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HDRJPGLoader } from '@monogrid/gainmap-js';
import GUI from 'lil-gui';

const containerRef = ref<HTMLDivElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);

let timer: THREE.Timer;
let stats: Stats;
let gui: GUI;

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;

// Variabili per gli asset
let hdriDay: THREE.Texture, hdriNight: THREE.Texture;
let bakeDay: THREE.Texture, bakeNight: THREE.Texture;

// Oggetto per le uniformi custom del materiale
const customUniforms = {
    uMix: { value: 0.0 }, // 0 = Giorno, 1 = Notte
    tNight: { value: null as THREE.Texture | null }
};

const params = {
    transition: 0 // Valore per lil-gui
};

const initThree = async () => {
    if (!containerRef.value || !wrapperRef.value) return;

    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;

    // --- SETUP BASE ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#A8A8A8');

    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(3.5, 3, 0);

    renderer = new THREE.WebGLRenderer({ canvas: containerRef.value, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.02;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 3.5;
    controls.minPolarAngle = (Math.PI / 2) - 0.5;
    controls.maxPolarAngle = (Math.PI / 2) + 0.2;
    controls.target.set(0, 3, 0);

    timer = new THREE.Timer();
    stats = new Stats();
    stats.showPanel(0);
    wrapperRef.value.appendChild(stats.dom);

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.2);
    scene.add(ambientLight);

    // --- CARICAMENTO ASINCRONO PRO (Promise.all) ---
    // Questo ci assicura che nulla venga renderizzato prima che Giorno e Notte siano pronti
    const textureLoader = new THREE.TextureLoader();
    const hdrJpgLoader = new HDRJPGLoader(renderer);
    const gltfLoader = new GLTFLoader();

    const loadHDRI = (url: string) => new Promise<THREE.Texture>((resolve, reject) => 
        hdrJpgLoader.load(url, (res) => resolve(res.renderTarget.texture), undefined, reject)
    );
    const loadTex = (url: string) => new Promise<THREE.Texture>((resolve, reject) => 
        textureLoader.load(url, resolve, undefined, reject)
    );
    const loadGLB = (url: string) => new Promise<any>((resolve, reject) => 
        gltfLoader.load(url, resolve, undefined, reject)
    );

    try {
        // ATTENZIONE: Inserisci qui i percorsi corretti per i file della NOTTE
        const [hDay, hNight, bDay, bNight, gltfPub, gltfBottle] = await Promise.all([
            loadHDRI('/models/autumn_park_4k.jpg'),      // HDRI Giorno
            loadHDRI('/models/autumn_park_4k.jpg'),       // HDRI Notte (Metti il tuo file)
            loadTex('/models/bake.png'),                 // Bake Giorno
            loadTex('/models/bake.png'),           // Bake Notte (Metti il tuo file)
            loadGLB('/models/scena.glb'),
            loadGLB('/models/proofBeam.glb')
        ]);

        hdriDay = hDay;
        hdriDay.mapping = THREE.EquirectangularReflectionMapping;
        
        hdriNight = hNight;
        hdriNight.mapping = THREE.EquirectangularReflectionMapping;

        scene.environment = hdriDay;
        scene.background = hdriDay;

        bakeDay = bDay;
        bakeDay.flipY = false;
        bakeDay.colorSpace = THREE.SRGBColorSpace;

        bakeNight = bNight;
        bakeNight.flipY = false;
        bakeNight.colorSpace = THREE.SRGBColorSpace;
        customUniforms.tNight.value = bakeNight;

        const pub = gltfPub.scene;
        pub.traverse((node: any) => {
            if (node.isMesh) {
                const material = new THREE.MeshBasicMaterial({ map: bakeDay });
                
                material.onBeforeCompile = (shader) => {
                    shader.uniforms.tNight = customUniforms.tNight;
                    shader.uniforms.uMix = customUniforms.uMix;

                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <map_pars_fragment>',
                        `
                        #include <map_pars_fragment>
                        uniform sampler2D tNight;
                        uniform float uMix;
                        `
                    );

                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <map_fragment>',
                        `
                        #ifdef USE_MAP
                            vec4 sampledColorDay = texture2D( map, vMapUv );
                            vec4 sampledColorNight = texture2D( tNight, vMapUv );
                            
                            // Interpolazione lineare tra giorno e notte
                            diffuseColor *= mix(sampledColorDay, sampledColorNight, uMix);
                        #endif
                        `
                    );
                };
                node.material = material;
            }
        });
        scene.add(pub);

        // --- SETUP BOTTIGLIA ---
        const bottle = gltfBottle.scene;
        bottle.traverse((node: any) => {
            if (node.isMesh && node.material) {
                node.material.envMapIntensity = 1.0;
            }
        });
        scene.add(bottle);

        // --- SETUP LIL-GUI ---
        gui = new GUI();
        gui.add(params, 'transition', 0, 1).name('Giorno / Notte').onChange((value: number) => {
            // Aggiorna l'uniforme del materiale per la transizione fluida del pub
            customUniforms.uMix.value = value;

            // Logica per scambiare l'HDRI (Riflessi e Sfondo) a metà percorso
            const isNight = value > 0.5;
            scene.environment = isNight ? hdriNight : hdriDay;
            scene.background = isNight ? hdriNight : hdriDay;
            
            // Opzionale: scurire l'ambiente gradualmente verso la notte
            ambientLight.intensity = 0.2 - (value * 0.15); // Passa da 0.2 a 0.05
        });

    } catch (error) {
        console.error("Errore durante il caricamento degli asset:", error);
    }

    renderer.setAnimationLoop((currentTime) => {
        stats.begin();
        timer.update(currentTime);
        controls.update();
        renderer.render(scene, camera);
        stats.end();
    });

    window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
    if (!containerRef.value) return;
    const newWidth = containerRef.value.clientWidth;
    const newHeight = containerRef.value.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
};

onMounted(() => {
    initThree();
});

onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize);
    
    if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
    }

    if (gui) gui.destroy();

    hdriDay?.dispose();
    hdriNight?.dispose();
    bakeDay?.dispose();
    bakeNight?.dispose();

    scene?.traverse((object: any) => {
        if (object.isMesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
                object.material.forEach((m: any) => m.dispose());
            } else {
                object.material.dispose();
            }
        }
    });
    scene?.clear();
});
</script>

<template>
  <div ref="wrapperRef">
    <h1>Day 1 Workshop MONOGRID!</h1>
    <p>clicca per tornare alla <a href="/">Homepage</a></p>
    <canvas ref="containerRef"></canvas>
  </div>
</template>

<style scoped>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>