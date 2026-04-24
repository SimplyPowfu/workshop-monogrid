<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { store } from '@/store/store'

const route = useRoute()
const router = useRouter()

const content = computed(() => {
  const id = route.params.id
  if (typeof id !== 'string' || !(id in store)) return undefined
  return store[id]
})

function close () {
  router.push('/pub')
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
             flex items-center justify-center p-4"
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