<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store, animateMaterials } from '@/store/store'
import type { Mesh, MeshStandardMaterial } from 'three'

const route = useRoute()
const router = useRouter()
const isReady = ref(false)
const isHidden = ref(false)
const id = route.params.id

const content = computed(() => {
  if (typeof id !== 'string' || !(id in store)) return undefined
  return store[id]
})

const targetMaterials = computed(() => {
  if (typeof id !== 'string' || !(id in store)) return []
  const marker = store[id]
  let bottle
  
  if (marker?.objectName === 'Bottle')
    bottle = marker.objectScene?.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0003') as Mesh
  else if (marker?.objectName === 'BottleLeft')
    bottle = marker.objectScene?.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0001') as Mesh
  else if (marker?.objectName === 'BottleRight')
    bottle = marker.objectScene?.getObjectByName('Tref012_BulbGlass030_D_03_BulbGlass_0002') as Mesh

  if (!bottle || !bottle.material) return []
  
  const materialsArray = Array.isArray(bottle.material) ? bottle.material : [bottle.material]
  return materialsArray.filter(m => 'emissiveIntensity' in m) as MeshStandardMaterial[]
})

watchEffect(() => {
  const ready = content.value && content.value.objectScene && targetMaterials.value.length > 0
  if (ready && !isReady.value) {
    isReady.value = true
    animateMaterials(targetMaterials.value, 25)
  }
})

function close() {
  animateMaterials(targetMaterials.value, 0)
  router.push('/pub')
}

function toggleHide() {
  isHidden.value = !isHidden.value
}
</script>

<template>
  <div class="marker-detail-root">
    
    <div v-if="!isReady" class="loading-overlay">
      <span class="loading-text">Caricamento scena...</span>
    </div>

    <template v-else>
      <div 
        v-if="!isHidden"
        class="modal-overlay"
        @click.self="close"
      >
        <div class="info-card">
          <button class="btn-close" @click="close">✕</button>

          <h2 class="info-title">
            {{ content?.label ?? 'Oggetto' }}
          </h2>

          <p class="info-description">
            {{ content?.description ?? 'Nessuna descrizione disponibile.' }}
          </p>

          <div class="card-footer">
            <button class="btn-pill secondary" @click="toggleHide">
              Nascondi Dettagli
            </button>
          </div>
        </div>
      </div>

      <button 
        v-else
        class="btn-pill primary floating-btn"
        @click="toggleHide"
      >
        Mostra Dettagli
      </button>
    </template>

  </div>
</template>

<style scoped>
.marker-detail-root {
  position: relative;
  z-index: 100;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: env(safe-area-inset-top) 1rem env(safe-area-inset-bottom) 1rem;
  z-index: 150;
  overflow-y: auto;
}

.info-card {
  position: relative;
  background: rgba(30, 30, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.5rem;
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  color: #f3f4f6;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  margin: auto; 
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  flex-shrink: 0;
}

.info-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #9ca3af;
  margin-bottom: 2rem;
  overflow-y: auto; 
  padding-right: 5px;
}

.info-description::-webkit-scrollbar {
  width: 4px;
}
.info-description::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.info-card .btn-pill:hover {
  transform: translateY(-2px);
}

.card-footer {
  display: flex;
  justify-content: flex-start;
  flex-shrink: 0;
  margin-top: auto;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-pill {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.btn-pill.primary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-pill.secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
}

.btn-pill:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateX(-50%) translateY(-2px);
}

.floating-btn {
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 160;
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
}
.floating-btn:hover {
  transform: translateX(-50%) translateY(-2px);
}

/* Animations */
.loading-text {
  color: white;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (max-height: 500px) {
  .info-card {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .info-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    padding-right: 3rem;
  }

  .info-description {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .btn-close {
    top: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
  }

  .floating-btn {
    bottom: 1rem;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>