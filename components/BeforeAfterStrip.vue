<script setup lang="ts">
// Bandeau d'exemples avant / après. Chaque vignette mène à l'onglet d'édition,
// et l'en-tête mène à l'outil vidéo.
import { ref, onMounted, onUnmounted } from 'vue'
import { demoScene } from '~/utils/demoScenes'

const props = defineProps<{ compact?: boolean }>()

const DUREE = 5000
const DECALAGE = 1600

const EXEMPLES = [
  { id: 'plage', avant: '/exemple-1-avant.webp', apres: ['/exemple-1-apres.webp', '/exemple-3-apres.webp'], alt: true, badge: '', to: '/edition' },
  { id: 'studio', avant: '/exemple-4-avant.webp.webp', apres: ['/exemple-4-apres.webp.webp'], alt: false, badge: 'Fundress V2', to: '/edition' },
]

type Item = { id: string; avant: string; apres: string[]; alt: boolean; badge: string; to: string; v: number }

const items = ref<Item[]>([])
const minuteurs: any[] = []

onMounted(() => {
  items.value = EXEMPLES.map(e => ({
    id: e.id,
    avant: e.avant || demoScene(e.id, false),
    apres: e.apres.map(a => a || demoScene(e.id, true)),
    alt: e.alt,
    badge: e.badge,
    to: e.to,
    v: 0,
  }))

  items.value.forEach((e, i) => {
    if (e.alt === false) return
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
  <div class="showcase" :class="{ compact: props.compact }" aria-label="Exemples avant apres">
    <div class="head">
      <span>Avant / après</span>
      <NuxtLink to="/video" class="vlink">Essayer en vidéo →</NuxtLink>
    </div>
    <div class="row">
      <NuxtLink v-for="e in items" :key="e.id" :to="e.to" :class="e.alt ? 'ba' : 'ba hi'" title="Essayer sur ma photo">
        <div class="frame">
          <img :src="e.avant" alt="Avant" loading="lazy" decoding="async">
          <div class="after">
            <img v-if="e.alt" :class="e.v === 0 ? 'on' : ''" :src="e.apres[0]" alt="" loading="lazy" decoding="async">
            <img v-if="e.alt" :class="e.v === 1 ? 'on' : ''" :src="e.apres[1]" alt="" loading="lazy" decoding="async">
            <img v-else :src="e.apres[0]" alt="Apres" loading="lazy" decoding="async">
          </div>
          <span class="line"></span>
          <span class="lbl l">Avant</span>
          <span class="lbl r">Après</span>
          <span v-if="e.alt" class="ver small">V{{ e.v + 1 }}</span>
          <span v-else class="ver">V2</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.showcase{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:8px;display:flex;flex-direction:column;gap:7px}
.head{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.head span{font-size:.6rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--accent)}
.vlink{font-size:.62rem;color:var(--muted);text-decoration:none;white-space:nowrap}
.vlink:hover{color:var(--accent)}
.row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ba{min-width:0;display:flex;flex-direction:column;gap:5px;text-decoration:none;color:inherit}
.frame{position:relative;aspect-ratio:3/4;border-radius:9px;overflow:hidden;background:var(--sunk)}
.ba.hi .frame,.ba:hover .frame{box-shadow:0 0 0 2px var(--accent)}
.frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 20%}
.after{position:absolute;inset:0;clip-path:inset(0 0 0 50%);animation:wipe 5s linear infinite}
.after img{opacity:0;transition:opacity .3s ease}
.after img.on{opacity:1}
.after img:only-child{opacity:1}
.line{position:absolute;top:0;bottom:0;left:0;width:2px;background:#fff;box-shadow:0 0 4px rgba(0,0,0,.5);animation:line 5s linear infinite}
.ba:nth-child(2) .after,.ba:nth-child(2) .line{animation-delay:-1.6s}
@keyframes wipe{0%,26%{clip-path:inset(0 100% 0 0)}88%,100%{clip-path:inset(0 0 0 0)}}
@keyframes line{0%,26%{left:0}88%,100%{left:100%}}
.lbl{position:absolute;top:5px;font-size:.5rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff;background:rgba(10,12,18,.6);padding:2px 5px;border-radius:5px}
.lbl.l{left:5px}
.lbl.r{right:5px}
.ver{position:absolute;bottom:5px;left:50%;transform:translateX(-50%);font-size:.52rem;font-weight:800;color:var(--accent-ink);background:var(--accent);padding:2px 7px;border-radius:99px;white-space:nowrap}
@media(min-width:820px){
  .row{display:flex;gap:10px}
  .row .ba{flex:0 0 180px;max-width:180px}
  .showcase.compact{padding:10px;gap:8px}
  .showcase.compact .head{flex-direction:column;align-items:flex-start;gap:0}
  .showcase.compact .row{display:flex;flex-direction:column;gap:8px}
  .showcase.compact .row .ba{flex:1 1 auto;max-width:none}
}
@media(prefers-reduced-motion:reduce){.after,.line{animation:none}.after{clip-path:inset(0 0 0 50%)}.line{left:50%}}
</style>
