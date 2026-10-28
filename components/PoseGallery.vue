<script setup lang="ts">
import { POSES } from '~/utils/poses'

const gradients = [
  'linear-gradient(150deg,#6b5443,#241c16)',
  'linear-gradient(150deg,#4b4b52,#1d1d20)',
  'linear-gradient(150deg,#6b4a4a,#231818)',
  'linear-gradient(150deg,#5c5c48,#20201a)',
  'linear-gradient(150deg,#4a5c5c,#1a2020)',
  'linear-gradient(150deg,#5c4a5c,#201a20)',
  'linear-gradient(150deg,#605042,#1f1a15)',
  'linear-gradient(150deg,#47505c,#191d20)',
  'linear-gradient(150deg,#5c5347,#1f1c17)',
  'linear-gradient(150deg,#4f4a5c,#1c1a20)',
  'linear-gradient(150deg,#6b5b4a,#241d16)',
  'linear-gradient(150deg,#48545c,#191e20)',
]
</script>

<template>
  <div class="app">
    <SiteTop />

    <main class="wrap">
      <RubriquesTabs active="pose" />

      <BeforeAfterStrip />

      <p class="hint">Choisis une pose et envoie ta photo. Le visage, la morphologie et le décor sont conservés.</p>

      <div class="poses">
        <NuxtLink v-for="(p, i) in POSES" :key="p.id" :to="`/edition?pose=${p.id}`" class="pose">
          <span class="mini" :style="{ background: gradients[i % gradients.length] }" />
          <span class="label">{{ p.label }}</span>
        </NuxtLink>
      </div>

      <div class="privacy">
        <span>Paiement sécurisé par Stripe</span>
        <span>Aucun abonnement</span>
        <span>Photo supprimée après usage</span>
      </div>

      <SiteFooter />
    </main>
  </div>
</template>

<style scoped>
.app { min-height: 100dvh; display: flex; flex-direction: column; padding-top: env(safe-area-inset-top, 0px); }
.wrap { flex: 1; display: flex; flex-direction: column; gap: 14px; max-width: 1100px; width: 100%; margin: 0 auto; padding: 0 max(14px, env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left)); }
.hint { font-size: .82rem; color: var(--muted); margin: 0; }
.poses { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.pose { text-decoration: none; color: var(--fg); }
.mini { display: block; aspect-ratio: 3 / 4; border-radius: var(--r); border: 1px solid var(--line); margin-bottom: 6px; }
.label { display: block; font-size: .78rem; text-align: center; color: var(--muted); line-height: 1.25; }
.pose:hover .mini { border-color: var(--accent); }
.pose:hover .label { color: var(--fg); }
.privacy { display: flex; flex-wrap: wrap; gap: 6px; font-size: .72rem; color: var(--muted); }
.privacy span { display: inline-flex; align-items: center; background: var(--surface); border: 1px solid var(--line); border-radius: 99px; padding: 5px 10px; }
.privacy span::before { content: "✓"; color: #22c55e; font-weight: 800; margin-right: 5px; }
@media (min-width: 700px) { .poses { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 900px) { .poses { grid-template-columns: repeat(6, 1fr); } }
</style>
