<script setup lang="ts">
import { ref, computed } from 'vue'
import { POSES } from '~/utils/poses'

// Quatre presets seulement en accueil, les plus parlants.
const CHOIX = ['cum-on-face', 'blowjob', 'cunnilingus', 'creampie']
const liste = computed(() => CHOIX.map(id => POSES.find(p => p.id === id)).filter(Boolean) as typeof POSES)

const broken = ref<Record<string, boolean>>({})
const gradients = [
  'linear-gradient(150deg,#6b5443,#241c16)', 'linear-gradient(150deg,#4b4b52,#1d1d20)',
  'linear-gradient(150deg,#6b4a4a,#231818)', 'linear-gradient(150deg,#5c5c48,#20201a)',
]
</script>

<template>
  <div class="app">
    <SiteTop />

    <main class="wrap">
      <RubriquesTabs active="pose" />

      <BeforeAfterStrip />

      <p class="hint">Choisis une scène et envoie ta photo. Le visage, la morphologie et le décor sont conservés.</p>

      <div class="grid">
        <NuxtLink to="/edition" class="card custom">
          <span class="title">Custom Prompt</span>
          <span class="box">Décris toi-même la scène</span>
        </NuxtLink>

        <NuxtLink v-for="(p, i) in liste" :key="p.id" :to="`/edition?pose=${p.id}`" class="card">
          <span class="title">{{ p.label }}</span>
          <span class="box" :style="{ background: gradients[i % gradients.length] }">
            <img v-if="!broken[p.id]" :src="`/poses/${p.id}.webp`" :alt="p.label" loading="lazy" decoding="async" @error="broken[p.id] = true">
          </span>
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
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.card { display: flex; flex-direction: column; gap: 6px; text-decoration: none; color: var(--fg); background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 7px; }
.card:hover { border-color: var(--accent); }
.card.custom { border-color: #d946a8; }
.card.custom:hover { border-color: #f472c4; }
.title { font-size: .72rem; font-weight: 700; text-align: center; line-height: 1.2; padding: 2px 0 1px; }
.box { display: grid; place-items: center; aspect-ratio: 1 / 1; border-radius: 7px; overflow: hidden; font-size: .68rem; color: var(--muted); text-align: center; padding: 6px; }
.box img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (min-width: 600px) { .grid { grid-template-columns: repeat(3, 1fr); } .title { font-size: .78rem; } }
@media (min-width: 900px) { .grid { grid-template-columns: repeat(5, 1fr); } }
</style>
