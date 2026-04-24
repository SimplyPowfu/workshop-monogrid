<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { store } from '@/store/store'
import type { Object3D } from 'three';

const props = defineProps<{
  id: string
  route: string
  bottles: Object3D | null
}>()

const router = useRouter()

const marker = computed(() => store[props.id])

const markerStyle = computed(() => {
  const h = marker.value
  if (!h?.visible) return { display: 'none' }
  return {
    transform: `translate(${h.x}px, ${h.y}px) translate(-50%, -50%)`,
  }
})

const targetMaterials = computed(() => {
  if (!props.bottles) return []

  // Usa il metodo nativo di Three.js per cercare nei figli dell'Object3D
  const bottle = props.bottles.getObjectByName(props.id) as Mesh
  if (!bottle || !bottle.material) return []

  // Gestione robusta: in Three.js il materiale può essere un array o un oggetto singolo
  const materialsArray = Array.isArray(bottle.material) 
    ? bottle.material 
    : [bottle.material]

  // Filtra solo i materiali che supportano l'emissiveIntensity (Standard o Physical)
  return materialsArray.filter(m => 'emissiveIntensity' in m) as MeshStandardMaterial[]
})

function onClick () {
  router.push(props.route)
}

function onHoverEnter () {
  console.log('Enter')
}

function onHoverLeave () {
  console.log("leave")
}
</script>

<template>
  <button
    :style="markerStyle"
    class="group fixed left-0 top-0 z-10 cursor-pointer flex
            border-none bg-transparent p-0 items-center justify-center"
    :title="marker?.label ?? ''"
    @click="onClick"
    @mouseenter="onHoverEnter" 
    @mouseleave="onHoverLeave"
  >
    <span
      class="absolute w-4 h-4 rounded-full bg-white/90
              shadow-[0_0_12px_rgba(255,255,255,0.6)]
              transition-transform duration-300 ease-out
              group-hover:scale-150 group-hover:bg-white"
    />
    
    </button>
</template>
