<script setup lang="ts">
// Bandeau d'exemples avant / après.
// Pour mettre tes vrais résultats Venice : dépose les images dans public/exemples/
// puis renseigne avant / apres ci-dessous (ex. '/exemples/plage-avant.jpg').
// Si un chemin est vide, une image d'exemple dessinée est utilisée.
import { ref, onMounted } from 'vue'
import { demoScene } from '~/utils/demoScenes'

const EXEMPLES = [
  { id: 'plage', label: 'Ciel en coucher de soleil', avant: '', apres: '' },
  { id: 'voiture', label: 'Carrosserie en rouge', avant: '', apres: '' },
  { id: 'maison', label: 'Façade repeinte', avant: '', apres: '' },
]

const items = ref(EXEMPLES.map(e => ({ ...e })))
onMounted(() => {
  items.value = EXEMPLES.map(e => ({
    ...e,
    avant: e.avant || demoScene(e.id, false),
    apres: e.apres || demoScene(e.id, true),
  }))
})
</script>

<template>
  <div class="showcase" aria-label="Exemples avant / après">
    <h2>Exemples avant / après</h2>
    <div class="row">
      <div v-for="e in items" :key="e.id" class="ba">
        <div class="frame">
          <img v-if="e.avant" :src="e.avant" alt="Avant">
          <img v-if="e.apres" :src="e.apres" class="after" alt="Après">
          <span class="line" />
          <span class="lbl l">Avant</span>
          <span class="lbl r">Après</span>
        </div>
        <small>{{ e.label }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
h2 { margin: 0; font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 600; }
.row { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.row::-webkit-scrollbar { display: none; }
.ba { flex: 0 0 150px; scroll-snap-align: start; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.frame { position: relative; aspect-ratio: 4 / 3; border-radius: 8px; overflow: hidden; background: var(--sunk); }
.frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.after { clip-path: inset(0 0 0 50%); animation: wipe 5s ease-in-out infinite; }
.line { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: #fff; box-shadow: 0 0 4px rgba(0, 0, 0, .5); animation: line 5s ease-in-out infinite; }
.ba:nth-child(2) .after, .ba:nth-child(2) .line { animation-delay: -1.6s; }
.ba:nth-child(3) .after, .ba:nth-child(3) .line { animation-delay: -3.2s; }
@keyframes wipe { 0%, 100% { clip-path: inset(0 0 0 82%); } 50% { clip-path: inset(0 0 0 18%); } }
@keyframes line { 0%, 100% { left: 82%; } 50% { left: 18%; } }
.lbl { position: absolute; top: 5px; font-size: .62rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #fff; background: rgba(10, 12, 18, .6); padding: 1px 6px; border-radius: 5px; }
.lbl.l { left: 5px; }
.lbl.r { right: 5px; }
small { font-size: .76rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (min-width: 900px) { .ba { flex: 1 1 0; } }
</style>
