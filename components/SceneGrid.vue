<template>
  <div class="prail">
    <button
      v-for="p in POSES"
      :key="p.id"
      class="prsc"
      :class="{ on: scene === p.id }"
      @click="$emit('pick', p.id)"
    >
      <img :src="`/poses/${p.id}.webp`" alt="" loading="lazy" />
      <span>{{ p.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { POSES } from '~/utils/poses'
defineProps<{ scene: string | null }>()
defineEmits<{ pick: [string] }>()
</script>
