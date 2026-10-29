<template>
  <aside class="ed-panel">
    <h3 class="phead">Durée</h3>
    <div class="pchips">
      <button class="pchip" :class="{ on: duration === 5 }" @click="$emit('update:duration', 5)">5 s</button>
      <button class="pchip" :class="{ on: duration === 10 }" @click="$emit('update:duration', 10)">10 s</button>
    </div>
    <h3 class="phead">Mouvement</h3>
    <div class="pchips">
      <button v-for="m in MOVES" :key="m.id" class="pchip" :class="{ on: move === m.id }" @click="$emit('update:move', m.id)">
        {{ m.label }}
      </button>
    </div>
    <p class="phint">20 crédits par vidéo.</p>
    <button class="pgo" :disabled="!can" @click="$emit('run')">{{ busy ? 'Génération…' : 'Générer la vidéo' }}</button>
  </aside>
</template>

<script setup lang="ts">
const MOVES = [
  { id: 'lent', label: 'Lent' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'marche', label: 'Marche' }
]
defineProps<{ duration: number; move: string; can: boolean; busy: boolean }>()
defineEmits<{ 'update:duration': [number]; 'update:move': [string]; run: [] }>()
</script>
