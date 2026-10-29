<template>
  <aside class="ed-panel">
    <template v-if="variant === 'pose'">
      <div class="phead"><h3>Scène</h3></div>
      <SceneGrid :scene="scene" @pick="pick" />
    </template>

    <template v-else>
      <div class="pseg">
        <button class="pseg-b" :class="{ on: tab === 'undress' }" @click="modeTab('undress')">Déshabiller</button>
        <button class="pseg-b" :class="{ on: tab === 'scene' }" @click="modeTab('scene')">Scène</button>
      </div>

      <template v-if="tab === 'undress'">
        <button class="plvl" :class="{ on: mode === 'v1', pdim: open }" :disabled="open" @click="chooseMode('v1')">
          <span class="pradio"></span>
          <span class="ptxt"><b>Base</b><i>Modèle de base, rendu direct</i></span>
          <span class="pprice">5</span>
        </button>
        <button class="plvl" :class="{ on: mode === 'v2', pdim: open }" :disabled="open" @click="chooseMode('v2')">
          <span class="pradio"></span>
          <span class="ptxt"><b>Photoréaliste</b><i>Lumière douce, texture de peau travaillée</i></span>
          <span class="pprice">10</span>
        </button>
        <button class="pprompt" :class="{ on: open }" @click="toggle">Prompt perso</button>
        <textarea v-if="open" :value="text" rows="3" placeholder="Décris le rendu…" @input="$emit('update:text', ($event.target as HTMLTextAreaElement).value)" />
      </template>

      <template v-else>
        <SceneGrid :scene="scene" @pick="pick" />
        <p v-if="!scene" class="pnote">Choisis une scène · 10 crédits</p>
      </template>
    </template>

    <div class="pbar">
      <div class="psum"><b>{{ cost }}</b> crédits<span>{{ recap }}</span></div>
      <button class="pgo" :disabled="!can || (tab === 'scene' && !scene)" @click="$emit('run')">{{ goLabel }}</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  variant: 'edition' | 'pose'
  mode: 'v1' | 'v2'
  text: string
  open: boolean
  scene: string | null
  busy: boolean
  can: boolean
  goLabel: string
  cost: number
  recap: string
}>()

const emit = defineEmits<{
  'update:mode': ['v1' | 'v2']
  'update:text': [string]
  'update:open': [boolean]
  'update:scene': [string | null]
  run: []
}>()

const tab = ref<'undress' | 'scene'>(props.scene ? 'scene' : 'undress')

function modeTab(t: 'undress' | 'scene') {
  tab.value = t
  emit('update:open', false)
  if (t === 'undress') emit('update:scene', null)
}
function chooseMode(m: 'v1' | 'v2') {
  emit('update:mode', m)
  emit('update:scene', null)
}
function toggle() {
  const next = !props.open
  emit('update:open', next)
  if (next) {
    emit('update:mode', 'v1')
    emit('update:scene', null)
  }
}
function pick(id: string) {
  if (props.scene === id) return emit('update:scene', null)
  emit('update:scene', id)
}
</script>
