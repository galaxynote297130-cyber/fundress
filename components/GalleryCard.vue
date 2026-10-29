<template>
  <div class="gcard">
    <div class="gwrap">
      <img v-if="src" :src="src" alt="" class="gthumb" />
      <span v-if="item.duree" class="gdur">{{ item.duree }}</span>
    </div>
    <div class="gmeta">
      <span class="gtag">{{ item.kind === 'video' ? 'Vidéo' : 'Image' }} · {{ item.label }}</span>
      <span class="gsub">{{ age }} · {{ item.cout }} crédits</span>
    </div>
    <div class="gacts">
      <a v-if="item.kind === 'video'" :href="item.url" target="_blank" rel="noopener" class="ga">Ouvrir</a>
      <a v-else :href="src" :download="`fundress-${item.id}.png`" class="ga">Télécharger</a>
      <button class="ga" @click="$emit('remove', item.id)">Supprimer</button>
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
