<script setup lang="ts">
// Bandeau d'exemples avant / après. Chaque vignette mène à l'onglet d'édition.
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
      <NuxtLink v-for="e in items" :key="e.id" to="/edition" class="ba" title="Essayer sur ma photo">
        <div class="frame" :class="{ highlight: !e.alt }">
          <img :
