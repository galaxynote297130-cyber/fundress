<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ main: any; busy: boolean; shown: any }>()
const emit = defineEmits<{ file: [File]; remove: []; save: [] }>()

const over = ref(false)
const input = ref<HTMLInputElement | null>(null)

function pick(e: Event) {
  const el = e.target as HTMLInputElement
  const f = el.files?.[0]
  if (f) emit('file', f)
  el.value = ''
}

function drop(e: DragEvent) {
  over.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) emit('file', f)
}
</script>

<template>
  <section class="ed-stage" :class="{ over }" @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="drop">
    <div v-if="!main" class="ed-zone">
      <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.4" class="ed-ico"><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M4 17l5-5 4 4 3-2.5 4 3.5" /></svg>
      <button class="ed-up" type="button" @click="input?.click()">Télécharger une image</button>
      <p>JPG, PNG ou WebP</p>
      <input ref="input" type="file" accept="image/*" class="ed-sr" @change="pick">
    </div>

    <div v-else class="ed-paire">
      <div class="ed-cadre">
        <img :src="main.url" alt="Ta photo">
        <button class="ed-trash" type="button" title="Retirer" @click="$emit('remove')">✕</button>
      </div>
      <div class="ed-cadre res" :class="{ done: shown }">
        <img v-if="shown" :src="shown.url" alt="Résultat">
        <span v-else class="ed-wait">Résultat</span>
        <button v-if="shown && !busy" class="ed-dl" type="button" @click="$emit('save')">Télécharger</button>
        <div v-if="busy" class="ed-busy"><span><i class="ed-dot" />En cours…</span></div>
      </div>
    </div>
  </section>
</template>
