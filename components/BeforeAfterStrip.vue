<script setup lang="ts">
// Bandeau d'exemples avant / après, présenté en versions du modèle.
// Les images sont dans public/, à la racine.
// Si un chemin est vide, une image d'exemple dessinée est utilisée.
// La liste est dupliquée pour obtenir un défilement continu sans coupure.
import { ref, onMounted } from 'vue'
import { demoScene } from '~/utils/demoScenes'

const EXEMPLES = [
  { id: 'plage', label: 'Fundress V1', avant: '/exemple-1-avant.webp', apres: '/exemple-1-apres.webp' },
  { id: 'maison', label: 'Fundress V2', avant: '/exemple-3-avant.webp', apres: '/exemple-3-apres.webp' },
  { id: 'studio', label: 'Fundress V3', avant: '/exemple-4-avant.webp.webp', apres: '/exemple-4-apres.webp.webp' },
]

const items = ref(EXEMPLES.map(e => ({ ...e })))
onMounted(() => {
  const base = EXEMPLES.map(e => ({
    ...e,
    avant: e.avant || demoScene(e.id, false),
    apres: e.apres || demoScene(e.id, true),
  }))
  items.value = [...base, ...base]
})
</script>

<template>
  <div class="showcase" aria-label="Exemples avant / après">
    <div class="marquee">
      <div class="row">
        <div v-for="(e, i) in items" :key="i" class="ba">
          <div class="frame">
            <img v-if="e.avant" :src="e.avant" alt="Avant" loading="lazy" decoding="async">
            <img v-if="e.apres" :src="e.apres" class="after" alt="Après" loading="lazy" decoding="async">
            <span class="line" />
            <span class="lbl l">Avant</span>
            <span class="lbl r">Après</span>
          </div>
          <small>{{ e.label }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 10px 0; overflow: hidden; }
.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
}
.row { display: flex; gap: 12px; width: max-content; padding: 0 6px; animation: slide 30s linear infinite; }
.marquee:hover .row { animation-play-state: paused; }
.ba { flex: 0 0 230px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.frame { position: relative; aspect-ratio: 3 / 4; border-radius: 10px; overflow: hidden; background: var(--sunk); }
.frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.after { clip-path: inset(0 0 0 50%); animation: wipe 5s ease-in-out infinite; }
.line { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: #fff; box-shadow: 0 0 4px rgba(0, 0, 0, .5); animation: line 5s ease-in-out infinite; }
.ba:nth-child(2) .after, .ba:nth-child(2) .line { animation-delay: -1.6s; }
.ba:nth-child(3) .after, .ba:nth-child(3) .line { animation-delay: -3.2s; }
.ba:nth-child(5) .after, .ba:nth-child(5) .line { animation-delay: -1.6s; }
.ba:nth-child(6) .after, .ba:nth-child(6) .line { animation-delay: -3.2s; }
@keyframes slide { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 6px)); } }
@keyframes wipe { 0%, 100% { clip-path: inset(0 0 0 82%); } 50% { clip-path: inset(0 0 0 18%); } }
@keyframes line { 0%, 100% { left: 82%; } 50% { left: 18%; } }
.lbl { position: absolute; top: 7px; font-size: .62rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #fff; background: rgba(10, 12, 18, .6); padding: 2px 7px; border-radius: 5px; }
.lbl.l { left: 7px; }
.lbl.r { right: 7px; }
small { font-size: .78rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }

@media (prefers-reduced-motion: reduce) {
  .row, .after, .line { animation: none; }
}
</style>
