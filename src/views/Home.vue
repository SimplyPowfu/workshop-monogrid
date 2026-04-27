<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Object3D } from 'three';
import { initHomeScene } from '@/three/homeIndex';
import gsap from 'gsap';

const snapSections = ref<HTMLElement[]>([]);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const cleanup = ref<(() => void) | null>(null)
const bottle = ref<Object3D | null>(null)
let snapLocked = false;
let snapLockTimer: number | null = null;
let touchStartY = 0;

const clearSnapLock = () => {
  snapLocked = false;
  if (snapLockTimer) {
    clearTimeout(snapLockTimer);
    snapLockTimer = null;
  }
};

const lockSnap = () => {
  snapLocked = true;
  if (snapLockTimer) clearTimeout(snapLockTimer);
  snapLockTimer = window.setTimeout(clearSnapLock, 700);
};

const getCurrentSectionIndex = () => {
  const y = window.scrollY;
  let closestIdx = 0;
  let closestDistance = Infinity;

  snapSections.value.forEach((section, idx) => {
    const distance = Math.abs(section.offsetTop - y);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIdx = idx;
    }
  });

  return closestIdx;
};

const bottleStates = [
  { x: 0, y: 0.7, rotX: Math.PI / 2, rotZ: 0 },   // [0] hero
  { x: -0.5, y: 0, rotX: 0, rotZ: 0.2  },          // [1] sec-1
  { x: 0.5, y: 0, rotX: 0, rotZ: 0 },         // [2] sec-2
  { x: -0.5, y: 0, rotX: 0, rotZ: 0.2  },          // [3] sec-3
  { x: -0.5, y: 0, rotX: 0, rotZ: 0  }            // [4] cta
];

const scrollToSection = (index: number) => {
  const clampedIndex = Math.max(0, Math.min(index, snapSections.value.length - 1));
  const targetSection = snapSections.value[clampedIndex];
  if (!targetSection) return;

  lockSnap();
  window.scrollTo({
    top: targetSection.offsetTop,
    behavior: 'smooth',
  });

  if (bottle.value && bottleStates[clampedIndex]) {
    const state = bottleStates[clampedIndex];
    
    gsap.killTweensOf(bottle.value.position);
    gsap.killTweensOf(bottle.value.rotation);
    gsap.killTweensOf(bottle.value.scale);

    gsap.to(bottle.value.position, {
      x: state.x,
      y: state.y,
      duration: 0.8,
      ease: "power3.inOut"
    });

    gsap.to(bottle.value.rotation, {
      x: state.rotX,
      z: state.rotZ,
      duration: 0.8,
      ease: "power3.inOut"
    });
  }

  if ('onscrollend' in window) {
    window.addEventListener('scrollend', clearSnapLock, { once: true });
  }
};

const handleWheel = (event: WheelEvent) => {
  if (Math.abs(event.deltaY) < 8) return;
  event.preventDefault(); 
  if (snapLocked) return;

  const direction = event.deltaY > 0 ? 1 : -1;
  const currentIdx = getCurrentSectionIndex();
  const nextIdx = Math.max(0, Math.min(currentIdx + direction, snapSections.value.length - 1));

  if (nextIdx !== currentIdx) scrollToSection(nextIdx);
};

const handleTouchStart = (event: TouchEvent) => {
  if (snapLocked) return;
  touchStartY = event.touches[0].clientY;
};

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault(); 
};

const handleTouchEnd = (event: TouchEvent) => {
  if (snapLocked) return;
  
  const touchEndY = event.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY; 

  if (Math.abs(deltaY) > 40) { 
    const direction = deltaY > 0 ? 1 : -1;
    const currentIdx = getCurrentSectionIndex();
    const nextIdx = Math.max(0, Math.min(currentIdx + direction, snapSections.value.length - 1));

    if (nextIdx !== currentIdx) scrollToSection(nextIdx);
  }
};

onMounted(async () => {
  snapSections.value = Array.from(document.querySelectorAll('.snap-section')) as HTMLElement[];
  
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: false });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: false });
  if (canvasRef.value) {
      const result = await initHomeScene(canvasRef.value)
      cleanup.value = result.cleanup
      bottle.value = result.bottle
    }
  const state = bottleStates[0];
  gsap.to(bottle.value.position, {
      x: state.x,
      y: state.y,
      duration: 1.2,
      ease: "power3.inOut"
    });

    gsap.to(bottle.value.rotation, {
      x: state.rotX,
      z: state.rotZ,
      duration: 1.2,
      ease: "power3.inOut"
    });
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
  if (snapLockTimer) clearTimeout(snapLockTimer);
  cleanup.value?.()
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>

  <nav>
    <a href="#" class="nav-logo" @click.prevent="scrollToSection(0)">
      PROOF<span>BEAM</span>
    </a>
    <ul class="nav-links">
      <li><a href="/pub">Catalogo</a></li>
      <li><a href="#" @click.prevent="scrollToSection(3)">Su di Noi</a></li>
      <li><a href="#" @click.prevent="scrollToSection(4)">Contatti</a></li>
    </ul>
  </nav>

  <div id="scroll-container">
    
    <section class="snap-section hero" id="hero">
      <div class="corner tl"></div><div class="corner tr"></div>
      <div class="corner bl"></div><div class="corner br"></div>
      
      <img class="logo" src="/logo.png" alt="Logo Aziendale" />
      <div class="hero-rule"></div>
      
      <div class="scroll-hint">
        <span>Scorri</span>
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <section class="snap-section psec right" id="sec-1">
      <div class="pinfo">
        <div class="pnum">01</div>
        <p class="pcat">Workshop MONOGRID</p>
        <h2 class="pname">Giorno Uno <em>Setup</em></h2>
        <div class="pdivider"></div>
        <p class="pdesc">
          Introduzione ai concetti base e setup della scena. La transizione tra le sezioni è gestita unicamente dai gradienti che si sfumano sul nero assoluto dello sfondo.
        </p>
        <button class="btn-buy">Scopri di più</button>
      </div>
    </section>

    <section class="snap-section psec" id="sec-2">
      <div class="pinfo">
        <div class="pnum">02</div>
        <p class="pcat">Materiali e Modelli</p>
        <h2 class="pname">Importazione <em>.glb</em></h2>
        <div class="pdivider"></div>
        <p class="pdesc">
          L'uso del padding e l'assenza di bordi mantengono pulito il layout senza stacchi netti o "righe d'ombra".
        </p>
        <button class="btn-buy">Esplora Modelli</button>
      </div>
    </section>

    <section class="snap-section psec right" id="sec-3">
      <div class="pinfo">
        <div class="pnum">03</div>
        <p class="pcat">Materiali e Modelli</p>
        <h2 class="pname">Chi siamo? <em>Artigiani</em></h2>
        <div class="pdivider"></div>
        <p class="pdesc">
          L'uso del padding e l'assenza di bordi mantengono pulito il layout senza stacchi netti o "righe d'ombra".
        </p>
        <button class="btn-buy">Esplora Modelli</button>
      </div>
    </section>

    <section class="snap-section cta" id="cta">
      <div class="corner tl"></div><div class="corner tr"></div>
      <div class="corner bl"></div><div class="corner br"></div>
      <p class="hero-tag">Ordini Personalizzati Disponibili</p>
      <h2 class="cta-title">Hai un progetto<br>speciale in mente?</h2>
      <div class="hero-rule"></div>
      <p class="cta-sub">Realizziamo soluzioni su misura</p>
      <button class="btn-buy">Contattaci</button>
    </section>

  </div>
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


#scroll-container {
  min-height: 100vh;
  background: transparent; 
  color: var(--cream);
  font-family: 'Special Elite', cursive;
  position: relative;
  z-index: 2;
}

nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 4rem;
  background: linear-gradient(180deg, rgba(18,9,13,0.95) 0%, transparent 100%);
  pointer-events: auto; 
}

.nav-logo {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--cream);
  text-decoration: none;
}
.nav-logo span { color: var(--gold); }

.nav-links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links a {
  font-family: 'Oswald', sans-serif;
  font-size: 0.90rem;
  letter-spacing: 0.3em;
  color: var(--cream-dim);
  text-decoration: none;
  text-transform: uppercase;
  transition: color .25s;
}
.nav-links a:hover { color: var(--gold); }

.snap-section {
  height: 100vh;
  width: 100%;
}

.corner { position: absolute; width: 55px; height: 55px; opacity: .25; }
.corner.tl { top: 2rem; left: 2rem; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); }
.corner.tr { top: 2rem; right: 2rem; border-top: 2px solid var(--gold); border-right: 2px solid var(--gold); }
.corner.bl { bottom: 2rem; left: 2rem; border-bottom: 2px solid var(--gold); border-left: 2px solid var(--gold); }
.corner.br { bottom: 2rem; right: 2rem; border-bottom: 2px solid var(--gold); border-right: 2px solid var(--gold); }

.hero-rule {
  width: 110px; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  margin: 1.6rem auto;
  opacity: 0;
  animation: fadeIn .9s ease 1.1s forwards;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.logo {
  width: 500px;
  height: auto;
  max-width: 80vw; 
  object-fit: contain;
  opacity: 0;
  animation: fadeUp .9s ease .1s forwards;
}

.scroll-hint {
  position: absolute;
  bottom: 2.2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
  opacity: 0;
  animation: fadeIn 1s ease 2.2s forwards;
}
.scroll-hint span {
  font-family: 'Oswald', sans-serif;
  font-size: .65rem;
  letter-spacing: .35em;
  color: var(--gold-dim);
  text-transform: uppercase;
}
.scroll-arrow {
  width: 18px; height: 18px;
  border-right: 1.5px solid var(--gold-dim);
  border-bottom: 1.5px solid var(--gold-dim);
  transform: rotate(45deg);
  animation: bounce 1.6s ease infinite;
}

.psec {
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden; 
}

.psec::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(18,9,13,.9) 0%, rgba(18,9,13,.68) 45%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.psec.right::before {
  background: linear-gradient(270deg, rgba(18,9,13,.9) 0%, rgba(18,9,13,.68) 45%, transparent 100%);
}

.pinfo {
  position: relative;
  z-index: 10;
  width: 46%;
  padding: 2.5rem 2.5rem 2.5rem 5rem;
}

.psec.right .pinfo {
  margin-left: auto;
  padding: 2.5rem 5rem 2.5rem 2.5rem;
  text-align: right;
}

.psec.right .pinfo .pdivider { margin-left: auto; }
.psec.right .pinfo .pdesc { margin-left: auto; }
.psec.right .pinfo .btn-buy { float: right; }

.pnum {
  font-family: 'Playfair Display', serif;
  font-size: 5.5rem;
  font-weight: 900;
  color: var(--gold);
  opacity: .12;
  line-height: 1;
  margin-bottom: -.9rem;
  user-select: none;
}

.pcat {
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  letter-spacing: .55em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: .7rem;
}

.pname {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem; 
  font-weight: 700;
  line-height: 1.05;
  color: var(--cream);
  margin-top: 0;
  margin-bottom: .8rem; 
}

.pname em {
  display: block;
  font-style: italic;
  color: var(--gold-light);
  font-size: .88em;
}

.pdivider { width: 55px; height: 2px; background: var(--gold); margin: .9rem 0; }

.pdesc {
  font-family: 'Special Elite', cursive;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--cream-dim);
  margin-bottom: 1.4rem;
  max-width: 400px;
}

.btn-buy {
  display: inline-block;
  padding: .9rem 2.4rem;
  border: 1.5px solid var(--gold);
  color: var(--gold);
  background: transparent;
  font-family: 'Oswald', sans-serif;
  font-size: .78rem;
  letter-spacing: .3em;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: color .3s;
}
.btn-buy::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 100%; height: 100%;
  background: var(--gold);
  transition: left .3s;
  z-index: -1;
}
.btn-buy:hover { color: var(--black); }
.btn-buy:hover::before { left: 0; }

.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background: radial-gradient(ellipse at center, #2b0f18 0%, var(--black) 65%);
  color: var(--cream);
}

.hero-tag {
  font-family: 'Oswald', sans-serif;
  font-weight: 300;
  font-size: clamp(.6rem, 2vw, .78rem);
  letter-spacing: .55em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 1.4rem;
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 5vw, 4.2rem);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--cream);
  margin-bottom: .8rem;
}

.cta-sub {
  font-family: 'Oswald', sans-serif;
  font-weight: 300;
  font-size: clamp(.65rem, 2vw, .82rem);
  letter-spacing: .45em;
  color: var(--gold-dim);
  text-transform: uppercase;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  nav { padding: 1.2rem 2rem; }
  .nav-links { display: none; }

  .psec, .psec.right {
    flex-direction: column;
    justify-content: center;
  }
  
  .psec::before, .psec.right::before {
    background: linear-gradient(180deg, rgba(18,9,13,.9) 0%, rgba(18,9,13,.75) 100%);
  }

  .pinfo, .psec.right .pinfo {
    width: 85%;
    padding: 2rem 0;
    text-align: center;
    margin: 0 auto;
  }

  .pdivider, .psec.right .pinfo .pdivider { margin: .9rem auto; }
  .psec.right .pinfo .btn-buy { float: none; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes bounce {
  0%, 100% { transform: rotate(45deg) translate(0, 0); }
  50%      { transform: rotate(45deg) translate(3px, 3px); }
}
</style>