<script setup lang="ts">
import { ref } from 'vue'
import { MODES } from '~/utils/presets'
import { POSES } from '~/utils/poses'

const props = defineProps<{
  variant: 'edition' | 'pose'
  chosen: string
  cost: number
  canGenerate: boolean
  goLabel: string
  poseId: string | null
  description: string
}>()

const emit = defineEmits<{ choose: [string]; choosePose: [string]; generate: []; description: [string] }>()

const ouvert = ref(false)

function basculer() {
  if (ouvert.value) {
    ouvert.value = false
    emit('description', '')
    return
  }
  emit('choose', 'v1')
  ouvert.value = true
}
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

    <template v-else>
      <div>
        <span class="ed-lab">Modèle</span>
        <div class="ed-modes">
          <button
            v-for="m in MODES" :key="m.id" type="button"
            :class="{ on: props.chosen === m.id }" :disabled="ouvert" @click="$emit('choose', m.id)"
          >
            {{ m.label.replace('Fundress ', '') }}<small>{{ m.cost }} crédits</small>
          </button>
        </div>
      </div>

      <button class="ed-pbtn" :class="{ on: ouvert }" type="button" @click="basculer">
        <span>Prompt</span>
        <span>{{ ouvert ? '−' : '+' }}</span>
      </button>

      <textarea
        v-if="ouvert" class="ed-field" :value="props.description" maxlength="800" rows="3"
        placeholder="Décris ta propre scène…"
        @input="emit('description', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
    </template>

    <button class="ed-create" :disabled="!props.canGenerate" @click="$emit('generate')">{{ goLabel }}</button>
    <p v-if="props.variant === 'pose'" class="ed-prix">{{ props.cost }} crédits par image</p>
    <NuxtLink to="/credits" class="ed-rech">Recharger des crédits</NuxtLink>
  </aside>
</template>
