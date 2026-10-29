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
  <aside class="ed-panel">
    <span class="ed-ptitle">{{ props.variant === 'pose' ? 'Scène' : 'Édition' }}</span>
    <p class="ed-desc">
      {{ props.variant === 'pose'
        ? "La scène s'applique à ta photo. Le visage et le décor sont conservés."
        : 'Le visage, la pose et le décor sont conservés.' }}
    </p>

    <label v-if="props.variant === 'pose'">
      <span class="ed-lab">Scène</span>
      <select :value="props.poseId || ''" @change="$emit('choosePose', ($event.target as HTMLSelectElement).value)">
        <option v-for="p in POSES" :key="p.id" :value="p.id">{{ p.label }}</option>
      </select>
    </label>

    <div v-else>
      <span class="ed-lab">Description <em class="ed-soon">à venir</em></span>
      <div class="ed-field">Décris ta propre scène…</div>
    </div>

    <div v-if="props.variant !== 'pose'">
      <span class="ed-lab">Modèle</span>
      <div class="ed-modes">
        <button
          v-for="m in MODES" :key="m.id" type="button"
          :class="{ on: props.chosen === m.id }" @click="$emit('choose', m.id)"
        >
          {{ m.label.replace('Fundress ', '') }}<small>{{ m.cost }} crédits</small>
        </button>
      </div>
    </div>

    <button class="ed-create" :disabled="!props.canGenerate" @click="$emit('generate')">{{ goLabel }}</button>
    <p v-if="props.variant === 'pose'" class="ed-prix">{{ props.cost }} crédits par image</p>
    <NuxtLink to="/credits" class="ed-rech">Recharger des crédits</NuxtLink>
  </aside>
</template>
