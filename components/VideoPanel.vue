<template>
  <aside class="ed-panel panel">
    <h3 class="head">Format</h3>
    <div class="chips">
      <button class="chip fmt" :class="{ on: ratio === '9:16' }" @click="$emit('update:ratio', '9:16')">
        <span class="ico vert"></span>9:16
      </button>
      <button class="chip fmt" :class="{ on: ratio === '16:9' }" @click="$emit('update:ratio', '16:9')">
        <span class="ico horiz"></span>16:9
      </button>
    </div>

    <h3 class="head mt">Qualité</h3>
    <div class="chips">
      <button v-for="q in QUALITES" :key="q" class="chip flex" :class="{ on: qualite === q }" @click="$emit('update:qualite', q)">
        {{ q }}
      </button>
    </div>

    <h3 class="head mt">Durée</h3>
    <div class="chips">
      <button class="chip flex" :class="{ on: duration === 5 }" @click="$emit('update:duration', 5)">5 s</button>
      <button class="chip flex" :class="{ on: duration === 10 }" @click="$emit('update:duration', 10)">10 s</button>
    </div>

    <p class="hint">Wan 3.0 · {{ cout }} crédits</p>
    <button class="go" :disabled="!can" @click="$emit('run')">{{ busy ? 'Génération…' : 'Générer la vidéo' }}</button>
  </aside>
</template>

<script setup lang="ts">
const QUALITES = ['480p', '720p', '1080p']
defineProps<{ duration: number; ratio: string; qualite: string; can: boolean; busy: boolean; cout: number }>()
defineEmits<{
  'update:duration': [number]
  'update:ratio': [string]
  'update:qualite': [string]
  run: []
}>()
</script>

<style scoped>
.head { margin: 0 0 6px; font-size: .74rem; font-weight: 800; }
.head.mt { margin-top: 12px; }
.chips { display: flex; gap: 6px; }
.chip { font-size: .7rem; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--bg); color: var(--fg); font-family: inherit; }
.chip.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 800; }
.fmt { display: flex; align-items: center; justify-content: center; gap: 5px; flex: 1; }
.flex { flex: 1; }
.ico { width: 10px; border: 1.5px solid currentColor; border-radius: 2px; }
.ico.vert { height: 16px; }
.ico.horiz { height: 9px; }
.hint { font-size: .66rem; color: var(--muted); margin: 12px 0 8px; }
.go { width: 100%; min-height: 38px; border: 0; border-radius: 9px; background: var(--accent); color: var(--accent-ink); font-weight: 800; font-size: .8rem; font-family: inherit; }
.go:disabled { opacity: .5; }
</style>
