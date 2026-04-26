<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { store, animateMaterials } from '@/store/store'
import type { Mesh, MeshStandardMaterial } from 'three'

const route = useRoute()
const router = useRouter()
const isReady = ref(false)
const id = route.params.id

const content = computed(() => {
  if (typeof id !== 'string' || !(id in store)) return undefined
  return store[id]
})

const targetMaterials = computed(() => {
  if (typeof id !== 'string' || !(id in store)) return []
  const marker = computed(() => store[id])
  let bottle
  if (marker.value?.objectName === 'Bottle')
    bottle = marker.value?.objectScene?.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0003') as Mesh
  else if (marker.value?.objectName === 'BottleLeft')
    bottle = marker.value?.objectScene?.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0005') as Mesh
  else if (marker.value?.objectName === 'BottleRight')
    bottle = marker.value?.objectScene?.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0004') as Mesh
  else {
    console.warn(`Mesh non trovata`);
    return []
  }

  if (!bottle) {
    console.warn(`Mesh non trovata per l'oggetto`);
    return []
  }
  if (!bottle.material) return []
  const materialsArray = Array.isArray(bottle.material) 
    ? bottle.material 
    : [bottle.material]

  return materialsArray.filter(m => 'emissiveIntensity' in m) as MeshStandardMaterial[]
})

watchEffect(() => {
  const ready = content.value && content.value.objectScene && targetMaterials.value.length > 0
  if (ready && !isReady.value) {
    isReady.value = true
    animateMaterials(targetMaterials.value, 25)
  }
})

function close () {
  animateMaterials(targetMaterials.value, 0)
  router.push('/pub')
}
</script>

<template>
  <div v-if="!isReady"
    class="fixed inset-0 flex items-center justify-center bg-black">
    <span class="text-white animate-pulse">Caricamento scena...</span>
  </div>

  <div v-else
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="close"
  >
    <div
      class="relative bg-[rgba(30,30,40,0.95)] border border-white/15
               rounded-2xl p-10 max-w-120 w-full text-gray-100 shadow-2xl"
    >
      <button
        class="absolute top-4 right-4 bg-white/10 border border-white/20
                 rounded-full w-9 h-9 text-white cursor-pointer
                 flex items-center justify-center
                 transition-colors hover:bg-white/25"
        @click="close"
      >
        ✕
      </button>

      <h2 class="text-2xl font-bold mb-4 text-white">
        {{ content?.label ?? 'Unknown hotspot' }}
      </h2>

      <p class="text-base leading-relaxed text-gray-400 mb-6">
        {{ content?.description ?? 'No description available' }}
      </p>
    </div>
  </div>
</template>