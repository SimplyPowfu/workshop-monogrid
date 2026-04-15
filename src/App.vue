<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let animationFrameId: number;
  const particles: Array<{ x: number; y: number; r: number; vx: number; vy: number; alpha: number }> = [];

  const initParticles = () => {
    const canvas = canvasRef.value;
    if (!canvas) return; // Se il canvas non c'è, si ferma qui (era questo il tuo problema)
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const numParticles = window.innerWidth < 768 ? 50 : 120;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3, 
        vy: (Math.random() - 0.5) * 0.3, 
        alpha: Math.random() * 0.5 + 0.1 
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126, 31, 51, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  };

  onMounted(() => {
    initParticles();
  });

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
</script>

<template>
  <div class="grain-overlay"></div>
  <canvas ref="canvasRef" class="particles-canvas"></canvas>

  <main>
    <RouterView />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Special+Elite&family=Oswald:wght@300;400;600&display=swap');

:root {
  --black:      #12090d;
  --dark:       #1d1014;
  --gold:       #7e1f33;
  --gold-light: #b0445c;
  --gold-dim:   #5f1828;
  --cream:      #f4e7dc;
  --cream-dim:  #bca69c;
  --red:        #8b263a;
}

body, html {
  background-color: var(--black);
  color: white;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden; 
}

.grain-overlay {
  position: fixed; 
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  z-index: 999;
  pointer-events: none;
  opacity: 0.35;
}

.particles-canvas {
  position: fixed;
  inset: 0;
  z-index: 1; 
  pointer-events: none;
}

main {
  position: relative;
  z-index: 2;
}
</style>