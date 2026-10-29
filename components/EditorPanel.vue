<script setup lang="ts">
import { MODES } from '~/utils/presets'
import { POSES } from '~/utils/poses'

const props = defineProps<{
  variant: 'edition' | 'pose'
  chosen: string
  cost: number
  canGenerate: boolean
  goLabel: string
  poseId: string | null
}>()

defineEmits<{ choose: [string]; choosePose: [string]; generate: [] }>()
</script>

<template>
  <aside class="panel">
    <span class="ptitle">{{ props.variant === 'pose' ? 'Scène' : 'Édition' }}</span>
    <p class="desc">
      {{ props.variant === 'pose'
        ? "La scène s'applique à ta photo. Le visage et le décor sont conservés."
        : 'Le visage, la pose et le décor sont conservés.' }}
    </p>

    <label v-if="props.variant === 'pose'" class="grp">
      <span class="lab">Scène</span>
      <select :value="props.poseId || ''" @change="$emit('choosePose', ($event.target as HTMLSelectElement).value)">
        <option v-for="p in POSES" :key="p.id" :value="p.id">{{ p.label }}</option>
      </select>
    </label>

    <div class="grp">
      <span class="lab">Description <em class="soon">à venir</em></span>
      <div class="field off"><span>Décris ta propre scène…</span></div>
    </div>

    <div class="grp">
      <span class="lab">Modèle</span>
      <div class="modes">
        <button
          v-for="m in MODES" :key="m.id" type="button"
          :class="{ on: props.chosen === m.id }" @click="$emit('choose', m.id)"
        >
          {{ m.label.replace('Fundress ', '') }}<small>{{ m.cost }} crédits</small>
        </button>
      </div>
    </div>

    <button class="create" :disabled="!props.canGenerate" @click="$emit('generate')">{{ goLabel }}</button>
    <NuxtLink to="/credits" class="rech">Recharger des crédits</NuxtLink>
  </aside>
</template>

<style scoped>
.panel { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 10px; display: flex; flex-direction: column; gap: 9px; }
.ptitle { font-size: .74rem; font-weight: 800; color: var(--accent); }
.desc { font-size: .68rem; color: var(--muted); margin: 0; line-height: 1.4; }
.lab { font-size: .7rem; color: var(--fg); font-weight: 700; display: block; margin-bottom: 5px; }
.soon { font-style: normal; font-size: .54rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: 1px 6px; margin-left: 4px; }
select { width: 100%; min-height: 36px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); color: var(--fg); font-family: inherit; font-size: .78rem; padding: 0 8px; }
.field { border: 1px dashed var(--line); border-radius: 8px; background: var(--bg); padding: 9px; min-height: 54px; font-size: .74rem; color: var(--muted); }
.field.off { opacity: .55; }
.modes { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.modes button { border: 1px solid var(--line); background: var(--bg); color: var(--fg); border-radius: 8px; padding: 8px 4px; font-size: .78rem; font-weight: 700; display: flex; flex-direction: column; gap: 2px; align-items: center; font-family: inherit; }
.modes button small { font-size: .6rem; color: var(--muted); font-weight: 400; }
.modes button.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, var(--bg)); color: var(--accent); }
.create { margin-top: auto; min-height: 44px; border: 0; border-radius: 9px; background: var(--accent); color: var(--accent-ink); font-weight: 800; font-size: .88rem; }
.create:disabled { opacity: .5; }
.rech { text-align: center; font-size: .68rem; color: var(--muted); text-decoration: none; }
.rech:hover { color: var(--fg); }
</style>
