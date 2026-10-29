<template>
  <aside class="ed-panel">
    <template v-if="variant === 'pose'">
      <div class="phead"><h3>Scène</h3></div>
      <div class="pgrid">
        <button v-for="p in POSES" :key="p.id" class="psc" :class="{ on: scene === p.id }" @click="pick(p.id)">
          <img :src="`/poses/${p.id}.webp`" alt="" loading="lazy" />
          {{ p.label }}
        </button>
      </div>
    </template>

    <template v-else>
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
    </template>

    <div class="pbar">
      <div class="psum"><b>{{ cost }}</b> crédits<span>{{ recap }}</span></div>
      <button class="pgo" :disabled="!can" @click="$emit('run')">{{ goLabel }}</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { POSES, findPose } from '~/utils/poses'

const props = defineProps<{
  variant: 'edition' | 'pose'
  mode: 'v1' | 'v2'
  text: string
  open: boolean
  scene: string | null
  busy: boolean
  can: boolean
  goLabel: string
}>()

const emit = defineEmits<{
  'update:mode': ['v1' | 'v2']
  'update:text': [string]
  'update:open': [boolean]
  'update:scene': [string | null]
  run: []
}>()

const cost = computed(() => {
  if (props.variant === 'pose') return 10
  return (props.mode === 'v2' ? 10 : 5) + (props.scene ? 5 : 0)
})

const recap = computed(() => {
  if (props.variant === 'pose') return 'scène fixe'
  return props.mode.toUpperCase() + ' · ' + (findPose(props.scene)?.label || 'Aucune scène')
})

function toggle() {
  const next = !props.open
  emit('update:open', next)
  if (next) emit('update:mode', 'v1')
}
function pick(id: string) {
  emit('update:scene', props.scene === id ? null : id)
}
</script>
