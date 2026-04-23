<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed, ref, onMounted, onUnmounted } from 'vue';

  import Marker from '@/components/Marker.vue'
  import { store } from '@/store/store'
  import { initScene } from '@/three/index'
  

  const markerIds = Object.keys(store) as (keyof typeof store)[]
  const cleanup = ref<(() => void) | null>(null)
  const route = useRoute()
  const showHotspots = computed(() => route.path === '/pub')
  const canvasRef = ref<HTMLCanvasElement | null>(null);

  onMounted(async () => {
    if (canvasRef.value)
    cleanup.value = await initScene(canvasRef.value)
  });

  onUnmounted(() => {
    cleanup.value?.()
  });
</script>

<template>
  <div class="grain-overlay"></div>
  <canvas ref="canvasRef" class="particles-canvas"></canvas>

  <TransitionGroup name="hotspot-group">
    <template v-if="showHotspots">
      <Marker
        v-for="(id, index) in markerIds"
        :id="id"
        :key="id"
        :route="`/hotspot/${id}`"
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
    display: block;
    width: 100%;
    height: 100%;
  }
</style>