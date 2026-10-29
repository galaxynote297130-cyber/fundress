<template>
  <aside class="ed-panel">
    <template v-if="variant === 'pose'">
      <div class="phead"><h3>Scène</h3></div>
      <SceneGrid :scene="scene" @pick="pick" />
    </template>

    <template v-else>
      <div class="phead"><span class="pnum">1</span><h3>Modèle</h3><em v-if="scene">désactivé</em></div>
      <button class="plvl" :class="{ on: mode === 'v1' && !scene, pdim: !!scene || open }" :disabled="open" @click="chooseMode('v1')">
        <span class="pradio"></span>
        <span class="ptxt"><b>V1</b><i>Progressif, garde un sous-vêtement</i></span>
        <span class="pprice">5</span>
      </button>
      <button class="plvl" :class="{ on: mode === 'v2' && !scene, pdim: !!scene || open }" :disabled="open" @click="chooseMode('v2')">
        <span class="pradio"></span>
        <span class="ptxt"><b>V2</b><i>Complet, nu intégral</i></span>
        <span class="pprice">10</span>
      </button>

      <button class="pprompt" :class="{ on: open, pdim: !!scene }" :disabled="!!scene" @click="toggle">Prompt perso</button>
      <textarea v-if="open" :value="text" rows="3" placeholder="Décris le rendu…" @input="$emit('update:text', ($event.target as HTMLTextAreaElement).value)" />

      <div class="phead mt"><span class="pnum">2</span><h3>Scène <em>exclusif</em></h3></div>
      <SceneGrid :scene="scene" @pick="pick" />
    </template>

    <div class="pbar">
      <div class="psum"><b>{{ cost }}</b> crédits<span>{{ recap }}</span></div>
      <button class="pgo" :disabled="!can" @click="$emit('run')">{{ goLabel }}</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
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
  emit('update:open', false)
}
</script>
