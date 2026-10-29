<script setup lang="ts">
// Bandeau d'exemples avant / après.
// La première vignette alterne entre V1 et V2, synchronisée sur le balayage.
// La seconde reste fixe, mise en avant en V2.
import { ref, onMounted, onUnmounted } from 'vue'
import { demoScene } from '~/utils/demoScenes'

const props = defineProps<{ compact?: boolean }>()

const DUREE = 5000
const DECALAGE = 1600

const EXEMPLES = [
  { id: 'plage', avant: '/exemple-1-avant.webp', apres: ['/exemple-1-apres.webp', '/exemple-3-apres.webp'], alt: true, badge: '' },
  { id: 'studio', avant: '/exemple-4-avant.webp.webp', apres: ['/exemple-4-apres.webp.webp'], alt: false, badge: 'Fundress V2' },
]

type Item = { id: string; avant: string; apres: string[]; alt: boolean; badge: string; v: number }
const items = ref<Item[]>([])
const minuteurs: any[] = []

onMounted(() => {
  items.value = EXEMPLES.map(e => ({
    id: e.id,
    avant: e.avant || demoScene(e.id, false),
    apres: e.apres.map(a => a || demoScene(e.id, true)),
    alt: e.alt,
    badge: e.badge,
    v: 0,
  }))
  items.value.forEach((e, i) => {
    if (!e.alt) return
    minuteurs.push(setTimeout(() => {
      minuteurs.push(setInterval(() => { e.v = 1 - e.v }, DUREE))
    }, i * DECALAGE))
  })
})

onUnmounted(() => {
  minuteurs.forEach(t => { clearTimeout(t); clearInterval(t) })
})
</script>

<template>
  <div class="showcase" :class="{ compact: props.compact }" aria-label="Exemples avant / après">
    <div class="head">
      <span>Avant / après</span>
      <small>Deux rendus du même modèle</small>
    </div>
    <div class="row">
      <div v-for="e in items" :key="e.id" class="ba">
        <div class="frame" :class="{ highlight: !e.alt }">
          <img :src="e.avant" alt="Avant" loading="lazy" decoding="async">
          <div class="after">
            <template v-if="e.alt">
              <img :class="{ on: e.v === 0 }" :src="e.apres[0]" alt="" loading="lazy" decoding="async">
              <img :class="{ on: e.v === 1 }" :src="e.apres[1]" alt="" loading="lazy" decoding="async">
            </template>
            <img v-else :src="e.apres[0]" alt="Après" loading="lazy" decoding="async">
          </div>
          <span class="line" />
          <span class="lbl l">Avant</span>
          <span class="lbl r">Après</span>
          <span v-if="e.alt" class="ver small">V{{ e.v + 1 }}</span>
          <span v-else class="ver">V2</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 8px; display: flex; flex-direction: column; gap: 7px; }
.head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.head span { font-size: .6rem; text-transform: uppercase; letter-spacing: .08em; font-weight: 700; color: var(--accent); }
.head small { font-size: .62rem; color: var(--muted); }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ba { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.frame { position: relative; aspect-ratio: 3 / 4; border-radius: 9px; overflow: hidden; background: var(--sunk); }
.frame.highlight { box-shadow: 0 0 0 2px var(--accent); }
.frame > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.after { position: absolute; inset: 0; clip-path: inset(0 0 0 50%); animation: wipe 5s linear infinite; }
.after img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.after img:not(:only-child) { opacity: 0; transition: opacity .3s ease; }
.after img.on { opacity: 1; }
.line { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; background: #fff; box-shadow: 0 0 4px rgba(0, 0, 0, .5); animation: line 5s linear infinite; }
.ba:nth-child(2) .after, .ba:nth-child(2) .line { animation-delay: -1.6s; }
@keyframes wipe {
  0%, 26% { clip-path: inset(0 100% 0 0); }
  88%, 100% { clip-path: inset(0 0 0 0); }
}
@keyframes line {
  0%, 26% { left: 0; }
  88%, 100% { left: 100%; }
}
.lbl { position: absolute; top: 5px; font-size: .5rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #fff; background: rgba(10, 12, 18, .6); padding: 2px 5px; border-radius: 5px; backdrop-filter: blur(4px); }
.lbl.l { left: 5px; }
.lbl.r { right: 5px; }
.ver { position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); font-size: .52rem; font-weight: 800; letter-spacing: .03em; color: var(--accent-ink); background: var(--accent); padding: 2px 7px; border-radius: 99px; white-space: nowrap; }
.ver.small { padding: 2px 6px; }
@media (min-width: 820px) {
  .showcase.compact { gap: 6px; }
  .showcase.compact .head { flex-direction: column; align-items: flex-start; gap: 0; }
  .showcase.compact .head small { display: none; }
  .showcase.compact .row { display: flex; flex-direction: column; gap: 6px; }
  .showcase.compact .ba { flex: 1 1 auto; }
}
@media (prefers-reduced-motion: reduce) {
  .after, .line { animation: none; }
  .after { clip-path: inset(0 0 0 50%); }
  .line { left: 50%; }
}
</style>
