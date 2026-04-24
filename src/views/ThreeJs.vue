<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed, ref, onMounted, onUnmounted } from 'vue';

  import Marker from '@/components/Marker.vue'
  import { store } from '@/store/store'
  import { initScene } from '@/three/index'
  import type { Object3D } from 'three';
  

  const markerIds = Object.keys(store) as (keyof typeof store)[]
  const cleanup = ref<(() => void) | null>(null)
  const bottles = ref<Object3D | null>(null)
  const route = useRoute()
  const showMarker = computed(() => route.path === '/pub')
  const canvasRef = ref<HTMLCanvasElement | null>(null);

  onMounted(async () => {
    if (canvasRef.value) {
      const result = await initScene(canvasRef.value)
      cleanup.value = result.cleanup
      bottles.value = result.bottles
    }
  });

  onUnmounted(() => {
    cleanup.value?.()
  });
</script>

<template>
  <div class="grain-overlay"></div>
  <canvas ref="canvasRef"></canvas>

  <TransitionGroup name="hotspot-group">
    <template v-if="showMarker && bottles">
      <Marker
        v-for="(id, index) in markerIds"
        :id="id"
        :key="id"
        :route="`/pub/${id}`"
        :bottles="bottles"
        :style="{ '--stagger': index + 1 }"
      />
    </template>
  </TransitionGroup>
  <RouterView v-slot="{ Component }">
    <Transition name="fade">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: block;
    z-index: 0;
    outline: none;
    pointer-events: auto;
  }
</style>