<template>
  <div class="card">
    <div class="wrap">
      <img v-if="src" :src="src" alt="" class="thumb" />
      <span v-if="item.duree" class="dur">{{ item.duree }}</span>
    </div>
    <div class="meta">
      <span class="tag">{{ item.kind === 'video' ? 'Vidéo' : 'Image' }} · {{ item.label }}</span>
      <span class="sub">{{ age }} · {{ item.cout }} crédits</span>
    </div>
    <div class="acts">
      <a v-if="item.kind === 'video'" :href="item.url" target="_blank" rel="noopener" class="a">Ouvrir</a>
      <a v-else :href="src" :download="`fundress-${item.id}.png`" class="a">Télécharger</a>
      <button class="a" @click="$emit('remove', item.id)">Supprimer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item } from '~/composables/useGallery'

const props = defineProps<{ item: Item }>()
defineEmits<{ remove: [string] }>()

const src = computed(() => (props.item.blob ? URL.createObjectURL(props.item.blob) : props.item.url || ''))
const age = computed(() => {
  const m = Math.round((Date.now() - props.item.at) / 60000)
  return m < 1 ? "à l'instant" : `il y a ${m} min`
})
</script>

<style scoped>
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 6px; display: flex; flex-direction: column; gap: 6px; }
.wrap { position: relative; }
.thumb { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 8px; background: var(--sunk); display: block; }
.dur { position: absolute; right: 5px; bottom: 5px; font-size: .58rem; background: #0e0c14cc; color: #fff; border-radius: 4px; padding: 1px 4px; }
.meta { display: flex; flex-direction: column; }
.tag { font-size: .62rem; color: var(--fg); }
.sub { font-size: .6rem; color: var(--muted); }
.acts { display: flex; gap: 5px; }
.a { flex: 1; text-align: center; font-size: .62rem; padding: 5px; border: 1px solid var(--line); border-radius: 6px; color: var(--fg); text-decoration: none; background: transparent; font-family: inherit; }
</style>
