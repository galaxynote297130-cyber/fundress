<template>
  <aside class="ed-panel panel">
    <template v-if="variant === 'pose'">
      <h3 class="head">Scène</h3>
      <SceneGrid :scene="scene" @pick="pick" />
    </template>

    <template v-else>
      <div class="seg">
        <button class="seg-b" :class="{ on: tab === 'undress' }" @click="modeTab('undress')">Déshabiller</button>
        <button class="seg-b" :class="{ on: tab === 'scene' }" @click="modeTab('scene')">Scène</button>
      </div>

      <template v-if="tab === 'undress'">
        <button class="lvl" :class="{ on: mode === 'v1', dim: open }" :disabled="open" @click="chooseMode('v1')">
          <span class="radio"></span>
          <span class="txt"><b>Base</b><i>Modèle de base, rendu direct</i></span>
          <span class="price">5</span>
        </button>
        <button class="lvl" :class="{ on: mode === 'v2', dim: open }" :disabled="open" @click="chooseMode('v2')">
          <span class="radio"></span>
          <span class="txt"><b>Photoréaliste</b><i>Lumière douce, texture de peau travaillée</i></span>
          <span class="price">10</span>
        </button>
        <button class="prompt" :class="{ on: open }" @click="toggle">Prompt perso</button>
        <textarea v-if="open" :value="text" rows="3" placeholder="Décris le rendu…" @input="$emit('update:text', ($event.target as HTMLTextAreaElement).value)" />
      </template>

      <template v-else>
        <SceneGrid :scene="scene" @pick="pick" />
        <p v-if="!scene" class="note">Choisis une scène · 10 crédits</p>
      </template>
    </template>

    <div class="bar">
      <div class="sum"><b>{{ cost }}</b> crédits<span>{{ recap }}</span></div>
      <button class="go" :disabled="!can || (tab === 'scene' && !scene)" @click="$emit('run')">{{ goLabel }}</button>
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

<style scoped>
.head { margin: 0 0 7px; font-size: .74rem; font-weight: 800; }
.seg { display: flex; gap: 4px; margin-bottom: 8px; }
.seg-b { flex: 1; padding: 7px; font-size: .68rem; border: 1px solid var(--line); background: var(--bg); color: var(--muted); border-radius: 8px; font-family: inherit; }
.seg-b.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 800; }
.lvl { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px; margin-bottom: 6px; border: 1px solid var(--line); background: var(--bg); border-radius: 8px; text-align: left; color: var(--fg); font-family: inherit; }
.lvl.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, var(--bg)); }
.lvl.dim { opacity: .45; }
.radio { width: 13px; height: 13px; border-radius: 50%; border: 1.5px solid var(--line); flex: 0 0 13px; }
.lvl.on .radio { border-color: var(--accent); background: var(--accent); }
.txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.txt b { font-size: .76rem; font-weight: 800; }
.txt i { font-size: .64rem; color: var(--muted); font-style: normal; line-height: 1.25; }
.price { font-size: .6rem; color: var(--muted); border: 1px solid var(--line); border-radius: 6px; padding: 2px 5px; }
.prompt { width: 100%; padding: 8px; font-size: .7rem; background: transparent; border: 1px dashed var(--line); color: var(--muted); border-radius: 8px; font-family: inherit; }
.prompt.on { border-color: var(--accent); color: var(--accent); }
.note { font-size: .68rem; color: var(--muted); margin: 6px 0 0; }
.bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 12px; padding-top: 9px; border-top: 1px solid var(--line); }
.sum { font-size: .64rem; color: var(--muted); display: flex; flex-direction: column; }
.sum b { font-size: .9rem; color: var(--fg); }
.go { min-height: 38px; padding: 0 16px; border: 0; border-radius: 9px; background: var(--accent); color: var(--accent-ink); font-weight: 800; font-size: .8rem; font-family: inherit; }
.go:disabled { opacity: .5; }
</style>
