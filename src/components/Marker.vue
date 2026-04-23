<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { store } from '@/store/store'

const props = defineProps<{
  id: string
  route: string
}>()

const router = useRouter()

const hotspot = computed(() => store[props.id])

const markerStyle = computed(() => {
  const h = hotspot.value
  if (!h?.visible) return { display: 'none' }
  return {
    transform: `translate(${h.x}px, ${h.y}px) translate(-50%, -50%)`,
  }
})

function onClick () {
  router.push(props.route)
}
</script>

<template>
  <button
    :style="markerStyle"
    class="group fixed left-0 top-0 z-10 cursor-pointer flex
           border-none bg-transparent p-0 items-center justify-center"
    :title="hotspot?.label ?? ''"
    @click="onClick"
  >
    <span
      class="absolute w-4 h-4 rounded-full bg-white/90
             shadow-[0_0_12px_rgba(255,255,255,0.6)]
             transition-transform duration-200
             group-hover:scale-130 group-hover:bg-white"
    />
    <span class="absolute w-4 h-4 rounded-full border-2 border-white/70 animate-ping" />
    <span
      class="absolute top-5 whitespace-nowrap text-white text-xs font-semibold
             pointer-events-none opacity-0 transition-opacity duration-200
             group-hover:opacity-100 [text-shadow:0_1px_4px_rgb(0_0_0_/_0.8)]"
    >
      {{ hotspot?.label ?? '' }}
    </span>
  </button>
</template>
