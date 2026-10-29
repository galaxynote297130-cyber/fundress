<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{ main: any; busy: boolean; shown: any }>()
const emit = defineEmits<{ file: [File]; remove: []; save: [] }>()

const over = ref(false)
const input = ref<HTMLInputElement | null>(null)
const voir = ref(false)

watch(() => props.shown, () => { voir.value = false })

const src = computed(() => {
  if (props.shown && !voir.value) return props.shown.url
  return props.main?.url
})

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

    <div v-else class="ed-cadre" :class="{ done: shown && !voir }">
      <img :src="src" alt="Aperçu">
      <button class="ed-trash" type="button" title="Retirer" @click="$emit('remove')">✕</button>
      <div v-if="shown" class="ed-bar">
        <button class="ed-tog" :class="{ on: voir }" type="button" @click="voir = !voir">
          {{ voir ? 'Voir le résultat' : "Voir l'avant" }}
        </button>
        <button class="ed-dl" type="button" @click="$emit('save')">Télécharger</button>
      </div>
      <div v-if="busy" class="ed-busy"><span><i class="ed-dot" />En cours…</span></div>
    </div>
  </section>
</template>
