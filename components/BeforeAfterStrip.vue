<script setup lang="ts">
// Bandeau d'exemples avant / après.
// La première vignette alterne entre V1 et V2, synchronisée sur le balayage.
// La seconde reste fixe, mise en avant en V2.
import { ref, onMounted, onUnmounted } from 'vue'
import { demoScene } from '~/utils/demoScenes'

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
  <div class="showcase" aria-label="Exemples avant / après">
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
          <span v-if="e.alt" class="ver small">Fundress V{{ e.v + 1 }}</span>
          <span v-else class="ver">{{ e.badge || 'Fundress V2' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
.head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.head span { font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; font-weight: 700; color: var(--accent); }
.head small { font-size: .7rem; color: var(--muted); }
.row { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.row::-webkit-scrollbar { display: none; }
.ba { flex: 0 0 260px; scroll-snap-align: start; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.frame { position: relative; aspect-ratio: 3 / 4; border-radius: 12px; overflow: hidden; background: var(--sunk); }
.frame.highlight { box-shadow: 0 0 0 2px var(--accent); }
.frame > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.after { position: absolute; inset: 0; clip-path: inset(0 0 0 50%); animation: wipe 5s linear infinite; }
.after img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.after img:not(:only-child) { opacity: 0; transition: opacity .3s ease; }
.after img.on { opacity: 1; }
.line { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; background: #fff; box-shadow: 0 0 4px rgba(0, 0, 0, .5); animation: line 5s linear infinite; }
.ba:nth-child(2) .after, .ba:nth-child(2) .line { animation-delay: -1.6s; }
@keyframes wipe {
  0% { clip-path: inset(0 100% 0 0); }
  88%, 100% { clip-path: inset(0 0 0 0); }
}
@keyframes line {
  0% { left: 0; }
  88%, 100% { left: 100%; }
}
.lbl { position: absolute; top: 8px; font-size: .6rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #fff; background: rgba(10, 12, 18, .65); padding: 3px 8px; border-radius: 6px; backdrop-filter: blur(4px); }
.lbl.l { left: 8px; }
.lbl.r { right: 8px; }
.ver { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); font-size: .66rem; font-weight: 800; letter-spacing: .04em; color: var(--accent-ink); background: var(--accent); padding: 4px 12px; border-radius: 99px; white-space: nowrap; }
.ver.small { font-size: .6rem; padding: 3px 9px; }
@media (min-width: 900px) {
  .ba { flex: 1 1 0; max-width: 300px; }
}
@media (prefers-reduced-motion: reduce) {
  .after, .line { animation: none; }
  .after { clip-path: inset(0 0 0 50%); }
  .line { left: 50%; }
}
</style>
