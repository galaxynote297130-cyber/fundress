<template>
  <div class="pgrid">
    <button v-for="p in POSES" :key="p.id" class="psc" :class="{ on: scene === p.id }" @click="$emit('pick', p.id)">
      <img :src="`/poses/${p.id}.webp`" alt="" loading="lazy" />
      {{ p.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { POSES } from '~/utils/poses'
defineProps<{ scene: string | null }>()
defineEmits<{ pick: [string] }>()
</script>
