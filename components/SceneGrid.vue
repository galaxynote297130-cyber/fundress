<template>
  <div class="rail">
    <button v-for="p in POSES" :key="p.id" class="sc" :class="{ on: scene === p.id }" @click="$emit('pick', p.id)">
      <img :src="`/poses/${p.id}.webp`" alt="" loading="lazy" />
      <span>{{ p.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { POSES } from '~/utils/poses'
defineProps<{ scene: string | null }>()
defineEmits<{ pick: [string] }>()
</script>

<style scoped>
.rail { display: flex; gap: 8px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 6px; scrollbar-width: none; }
.rail::-webkit-scrollbar { display: none; }
.sc { flex: 0 0 calc(50% - 4px); scroll-snap-align: start; display: flex; flex-direction: column; gap: 6px; padding: 5px; background: var(--bg); border: 1px solid var(--line); border-radius: 10px; color: var(--fg); font-family: inherit; font-size: .72rem; text-align: center; }
.sc.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--bg)); color: #fff; }
.sc img { width: 100%; height: 104px; object-fit: cover; border-radius: 7px; background: var(--sunk); }
</style>
