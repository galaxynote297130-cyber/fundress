<script setup lang="ts">
defineProps<{ items: { url: string; name: string }[] }>()
defineEmits<{ pick: [number] }>()
</script>

<template>
  <aside class="recent">
    <b class="rh">Utilisé récemment</b>
    <div v-if="items.length" class="thumbs">
      <button v-for="(it, i) in items" :key="it.url" type="button" :title="it.name" @click="$emit('pick', i)">
        <img :src="it.url" alt="">
      </button>
    </div>
    <p v-else class="vide">Tes photos s'afficheront ici.</p>
  </aside>
</template>

<style scoped>
.recent { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 9px; }
.rh { display: block; font-size: .68rem; color: var(--accent); margin-bottom: 8px; }
.thumbs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.thumbs button { padding: 0; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; background: none; cursor: pointer; }
.thumbs button:hover { border-color: var(--accent); }
.thumbs img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; }
.vide { font-size: .66rem; color: var(--muted); margin: 0; line-height: 1.4; }
</style>
