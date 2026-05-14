 <script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import LoadingScreen from '@/components/Loading.vue';
import type { Object3D } from 'three';
import { initCustomScene } from '@/three/lampshadeIndex';
import { Configurator3D } from '@/three/configurator';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const cleanup = ref<(() => void) | null>(null)

const configurator = ref<Configurator3D | null>(null);
const activeBottleIndex = ref(0);
const activeLampIndex = ref(1);

const progress = ref(0);
const isLoading = ref(true);

const bottles = ['Jack', 'Jager', 'Vodka'];
const shades = ['Large', 'Modern', 'Slim', 'Classic'];

onMounted(async () => {
    if (canvasRef.value) {
        const result = await initCustomScene(canvasRef.value, (p) => {
            progress.value = Math.round(p);
        });
        cleanup.value = result.cleanup
        configurator.value = new Configurator3D(result.lampshade, result.bottle);
        
        setTimeout(() => { isLoading.value = false; }, 200);
    }
})

const changeBottle = (index: number) => {
    if (activeBottleIndex.value === index) return;
    configurator.value?.switchBottle(index);
    activeBottleIndex.value = index;
};

const changeLamp = (index: number) => {
    if (activeLampIndex.value === index) return;
    configurator.value?.switchLamp(index);
    activeLampIndex.value = index;
};

onUnmounted(() => cleanup.value?.());
</script>

<template>
    <LoadingScreen :progress="progress" :visible="isLoading" />
    <canvas ref="canvasRef"></canvas>

    <nav>
        <RouterLink to="/" class="nav-logo">PROOF<span>BEAM</span></RouterLink>
    </nav>

    <div class="interface" v-if="!isLoading">
        <div class="config-group">
            <span class="label">Essenza</span>
            <div class="buttons">
                <!-- Aggiungiamo la classe :active -->
                <button 
                    v-for="(name, i) in bottles" 
                    :key="name" 
                    :class="{ active: activeBottleIndex === i }"
                    @click="changeBottle(i)"
                >
                    {{ name }}
                </button>
            </div>
        </div>

        <div class="config-group">
            <span class="label">Paralume</span>
            <div class="buttons">
                <button 
                    v-for="(name, i) in shades" 
                    :key="i" 
                    :class="{ active: activeLampIndex === i }"
                    @click="changeLamp(i)"
                >
                    {{ name }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    canvas {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: 0;
    }

    nav {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 200;
        padding: 2rem 4rem;
        background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%);
    }

    .nav-logo {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        font-weight: 900;
        color: var(--cream);
        text-decoration: none;
        letter-spacing: 0.1em;
    }
    .nav-logo span { color: var(--gold); }

    .interface {
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        width: 100%;
        max-width: 600px;
    }

    .config-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .label {
        color: var(--gold);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-weight: bold;
    }

    .buttons {
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.4);
        padding: 8px;
        border-radius: 40px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    button {
        padding: 0.6rem 1.4rem;
        border-radius: 30px;
        border: 1px solid transparent;
        background: transparent;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        position: relative;
    }

    button:hover {
        color: white;
    }
    button.active {
        background: var(--gold);
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
        nav {
            padding: 1.2rem 1.5rem;
        }
        .nav-logo {
            font-size: 1.4rem;
        }

        .interface {
            bottom: 25px;
            padding: 0 15px;
            gap: 15px;
            left: 0;
            right: 0;
            transform: none;
            max-width: 100%;
            pointer-events: none;
        }
        .config-group {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .label {
            font-size: 0.6rem;
            letter-spacing: 0.15em;
            margin-bottom: 4px;
        }

        .buttons {
            display: inline-flex;
            justify-content: center;
            gap: 8px;
            padding: 6px 15px;
            width: auto;
            max-width: 100%;
            overflow-x: auto;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            border-radius: 40px;
        }
        .buttons::after {
            content: '';
            padding-right: 15px;
        }
        .buttons::-webkit-scrollbar {
            display: none;
        }
        button {
            padding: 0.5rem 1.1rem;
            font-size: 0.75rem;
            flex-shrink: 0;
        }
        .config-group, .buttons, button {
            pointer-events: auto;
        }
    }
</style>