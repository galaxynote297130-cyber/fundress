<script setup lang="ts">
// Bandeau d'exemples avant / après.
// La première vignette alterne entre V1 et V2 quand le balayage est masqué.
// La seconde reste fixe, mise en avant en V2.
// L'alternance ne s'active que si la seconde image existe vraiment.
import { ref, onMounted, onUnmounted } from 'vue'
import { demoScene } from '~/utils/demoScenes'

const DUREE = 5000
const DECALAGE = 1600

const EXEMPLES = [
  { id: 'plage', avant: '/exemple-1-avant.webp', apres: ['/exemple-1-apres.webp', '/exemple-1-apres-v2.webp'], alt: true, badge: '' },
  { id: 'studio', avant: '/exemple-4-avant.webp.webp', apres: ['/exemple-4-apres.webp.webp'], alt: false, badge: 'Fundress V2' },
]

type Item = { id: string; avant: string; apres: string[]; alt: boolean; badge: string; v: number }
const items = ref<Item[]>([])
const minuteries: any[] = []

function precharge(src: string) {
  return new Promise<boolean>(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

onMounted(async () => {
  items.value = EXEMPLES.map(e => ({
    id: e.id,
    avant: e.avant || demoScene(e.id, false),
    apres: e.apres.map(a => a || demoScene(e.id, true)),
    alt: e.alt,
    badge: e.badge,
    v: 0,
  }))

  for (const e of items.value) {
    if (!e.alt) continue
    if (!(await precharge(e.apres[1]))) { e.alt = false; continue }
    const i = items.value.indexOf(e)
    minuteries.push(setTimeout(() => {
      minuteries.push(setInterval(() => { e.v = 1 - e.v }, DUREE))
    }, i * DECALAGE))
  }
})

onUnmounted(() => {
  minuteries.forEach(t => { clearTimeout(t); clearInterval(t) })
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
          <span class="glow" />
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
.ba { flex: 0 0 260px; scroll-snap-align: start;
