<script setup lang="ts">
defineEmits<{ pick: []; example: [] }>()
</script>

<template>
  <div class="banner">
    <div class="media" aria-hidden="true">
      <img src="/exemple-4-avant.webp.webp" alt="">
      <img class="after" src="/exemple-4-apres.webp.webp" alt="">
      <span class="swipe" />
    </div>
    <div class="body">
      <span class="tag">Rendu photoréaliste</span>
      <h1>Ta photo, modifiée en quelques secondes.</h1>
      <h2>Une photo, plusieurs versions.</h2>
      <p>Choisis le rendu qui te plaît, le reste ne bouge pas.</p>
      <div class="cta">
        <button class="primary" @click="$emit('pick')">Modifier ma photo</button>
        <button class="link" @click="$emit('example')">Voir un exemple</button>
      </div>
      <span class="offer">2 crédits offerts à l’inscription</span>
    </div>
  </div>
</template>

<style scoped>
.banner { position: relative; overflow: hidden; border-radius: 16px; border: 1px solid var(--line); background: #12141a; min-height: 230px; display: flex; align-items: flex-end; padding: 16px; }
.media { position: absolute; top: 0; right: 0; bottom: 0; width: 60%; overflow: hidden; }
.media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 22%; }
.media .after { clip-path: inset(0 0 0 50%); animation: balayage 6s ease-in-out infinite; }
.swipe { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: #fff; opacity: .8; animation: curseur 6s ease-in-out infinite; }
.banner::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, #12141a 32%, rgba(18, 20, 26, .88) 52%, rgba(18, 20, 26, .18) 84%); z-index: 1; }
.banner::after { content: ""; position: absolute; inset: 0; background: radial-gradient(120% 95% at 0% 100%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 62%); z-index: 1; }
.body { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 7px; max-width: 60%; }
.tag { align-self: flex-start; font-size: .62rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-ink); background: var(--accent); border-radius: 99px; padding: 3px 10px; }
h1 { font-family: var(--f-display); font-size: clamp(1.3rem, 4.6vw, 1.85rem); line-height: 1.08; letter-spacing: -.03em; margin: 0; }
h2 { font-family: var(--f-display); font-size: clamp(.95rem, 3.2vw, 1.15rem); line-height: 1.15; letter-spacing: -.02em; margin: 0; color: var(--accent); }
p { margin: 0; font-size: .84rem; color: var(--muted); line-height: 1.4; }
.cta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 3px; }
.primary { min-height: 44px; padding: 0 18px; border: 0; border-radius: 12px; background: var(--accent); color: var(--accent-ink); font-weight: 700; font-size: .9rem; }
.link { min-height: 44px; padding: 0 4px; border: 0; background: none; color: var(--fg); font-weight: 600; font-size: .84rem; text-decoration: underline; text-underline-offset: 3px; }
.offer { font-size: .72rem; color: var(--muted); }
@keyframes balayage { 0%, 100% { clip-path: inset(0 0 0 84%); } 50% { clip-path: inset(0 0 0 16%); } }
@keyframes curseur { 0%, 100% { left: 84%; } 50% { left: 16%; } }
@media (max-width: 640px) {
  .banner { min-height: 270px; }
  .media { width: 100%; }
  .media img { object-position: center 16%; }
  .banner::before { background: linear-gradient(180deg, rgba(18, 20, 26, .3), rgba(18, 20, 26, .9) 58%, #12141a 92%); }
  .body { max-width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .media .after, .swipe { animation: none; }
}
</style>
