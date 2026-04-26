<script setup lang="ts">
import { computed, markRaw, watch , ref} from 'vue'
import { useRouter } from 'vue-router'

import { store, animateMaterials } from '@/store/store'
import type { Object3D, Mesh, MeshStandardMaterial } from 'three';

const props = defineProps<{
  id: string
  route: string
  bottles: Object3D | null
}>()

const router = useRouter()
const isClicked = ref(false)
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
  const h = marker.value
  let bottle
  if (h?.objectName === 'Bottle')
    bottle = props.bottles.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0003') as Mesh
  else if (h?.objectName === 'BottleLeft')
    bottle = props.bottles.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0005') as Mesh
  else if (h?.objectName === 'BottleRight')
    bottle = props.bottles.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0004') as Mesh
  else {
    console.warn(`Mesh non trovata`);
    return []
  }

  if (!bottle.material) return []
  const materialsArray = Array.isArray(bottle.material) 
    ? bottle.material 
    : [bottle.material]

  return materialsArray.filter(m => 'emissiveIntensity' in m) as MeshStandardMaterial[]
})

function onClick () {
  isClicked.value = true
  router.push(props.route)
}

function onHoverEnter () {
  animateMaterials(targetMaterials.value, 25)
}

function onHoverLeave () {
  if (isClicked.value || router.currentRoute.value.path.includes(props.route)) return
    animateMaterials(targetMaterials.value, 0)
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
