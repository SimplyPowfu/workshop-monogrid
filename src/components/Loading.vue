<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineProps<{
  progress: number;
  visible: boolean;
  message?: string;
}>();

const showExitButton = ref(false);
onMounted(() => {
  setTimeout(() => {
    showExitButton.value = true;
  }, 3000);
});
</script>

<template>
  <Transition name="fade-loader">
    <div v-if="visible" class="loading-overlay">
      <div class="loader-content">
        <h2 class="loader-brand">PROOF<span>BEAM</span></h2>
        
        <div class="loader-text">{{ message || 'CARICAMENTO' }} {{ progress }}%</div>
        
        <div class="loader-bar-container">
          <div class="loader-bar" :style="{ width: Math.max(1, progress) + '%' }"></div>
        </div>

        <Transition name="fade-button">
          <RouterLink v-if="showExitButton" to="/" class="home-link">
            TORNA ALLA <span>HOMEPAGE</span>
          </RouterLink>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: var(--black);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loader-content {
  width: 280px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader-brand {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--cream);
  margin-bottom: 2.5rem;
  margin-top: 0;
}
.loader-brand span { color: var(--gold); }

.loader-text {
  font-family: 'Oswald', sans-serif;
  color: var(--cream-dim);
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.loader-bar-container {
  width: 100%;
  height: 1px;
  background: rgba(244, 231, 220, 0.05);
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
}

.loader-bar {
  height: 100%;
  background: var(--gold);
  transition: width 0.4s cubic-bezier(0.1, 0.5, 0.5, 1);
}

.home-link {
  font-family: 'Oswald', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--cream-dim);
  text-decoration: none;
  border: 1px solid rgba(244, 231, 220, 0.1);
  padding: 10px 20px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.home-link span { color: var(--gold); }

.home-link:hover {
  opacity: 1;
  border-color: var(--gold);
  background: rgba(126, 31, 51, 0.05);
  transform: translateY(-2px);
}

/* Animazioni */
.fade-loader-leave-active {
  transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-loader-leave-to {
  opacity: 0;
}

.fade-button-enter-active {
  transition: all 1s ease;
}
.fade-button-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>