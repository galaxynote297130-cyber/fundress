<template>
  <aside class="ed-panel">
    <div class="phead"><span class="pnum">1</span><h3>Niveau de déshabillage</h3></div>
    <button class="plvl" :class="{ on: mode === 'v1', pdim: open }" :disabled="open" @click="$emit('update:mode', 'v1')">
      <span class="pradio"></span>
      <span class="ptxt"><b>Fundress V1</b><i>Déshabillage progressif, garde un sous-vêtement</i></span>
      <span class="pprice">5</span>
    </button>
    <button class="plvl" :class="{ on: mode === 'v2', pdim: open }" :disabled="open" @click="$emit('update:mode', 'v2')">
      <span class="pradio"></span>
      <span class="ptxt"><b>Fundress V2</b><i>Déshabillage complet, nu intégral</i></span>
      <span class="pprice">10</span>
    </button>

    <button class="pprompt" :class="{ on: open }" @click="toggle">Prompt personnalisé</button>
    <textarea v-if="open" :value="text" rows="3" placeholder="Décris le rendu souhaité…" @input="$emit('update:text', ($event.target as HTMLTextAreaElement).value)" />

    <div class="phead mt"><span class="pnum">2</span><h3>Scène <em>optionnel</em></h3></div>
    <div class="pgrid">
      <button class="psc" :class="{ on: !scene }" @click="$emit('update:scene', null)"><span class="pnone">✕</span>Aucune</button>
      <button v-for="p in POSES" :key="p.id" class="psc" :class="{ on: scene === p.id }" @click="pick(p.id)">
        <img :src="`/poses/${p.id}.webp`" alt="" loading="lazy" />
        {{ p.label }}
      </button>
    </div>

    <div class="pbar">
      <div class="psum"><b>{{ cost }}</b> crédits<span>{{ mode.toUpperCase() }} · {{ sceneLabel }}</span></div>
      <button class="pgo" :disabled="!can" @click="$emit('run')">{{ busy ? 'Génération…' : 'Générer' }}</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { POSES, findPose } from '~/utils/poses'

const props = defineProps<{ mode: 'v1' | 'v2'; text: string; open: boolean; scene: string | null; busy: boolean; can: boolean }>()
const emit = defineEmits<{
  'update:mode': ['v1' | 'v2']
  'update:text': [string]
  'update:open': [boolean]
  'update:scene': [string | null]
  run: []
}>()

const cost = computed(() => (props.mode === 'v2' ? 10 : 5) + (props.scene ? 5 : 0))
const sceneLabel = computed(() => (props.scene ? findPose(props.scene)?.label || 'Aucune scène' : 'Aucune scène'))

function toggle() {
  const next = !props.open
  emit('update:open', next)
  if (next) emit('update:mode', 'v1')
}
function pick(id: string) {
  emit('update:scene', props.scene === id ? null : id)
}
</script>
