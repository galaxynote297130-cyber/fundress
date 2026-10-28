<script setup lang="ts">
import { MODES } from '~/utils/presets'

defineProps<{
  chosen: string
  canGenerate: boolean
  goLabel: string
  poseLabel: string | null
}>()

defineEmits<{ choose: [string]; generate: []; removePose: [] }>()
</script>

<template>
  <aside class="composer">
    <span class="composer-title">Quel modèle souhaites-tu utiliser ?</span>
    <div class="presets">
      <button v-for="m in MODES" :key="m.id" type="button" class="preset" :class="{ on: chosen === m.id }" @click="$emit('choose', m.id)">
        {{ m.label }}
      </button>
    </div>

    <div v-if="poseLabel" class="pose">
      <span>Pose : {{ poseLabel }}</span>
      <button type="button" title="Retirer la pose" @click="$emit('removePose')">×</button>
    </div>

    <div class="actions">
      <button class="go" :disabled="!canGenerate" @click="$emit('generate')">{{ goLabel }}</button>
    </div>
  </aside>
</template>

<style scoped>
.composer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; background: var(--surface); border-top: 1px solid var(--line); box-shadow: 0 -6px 24px rgba(0, 0, 0, .12); display: flex; flex-direction: column; gap: 10px; padding: 12px max(14px, env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left)); }
.composer-title { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 600; }
.presets { display: flex; flex-wrap: wrap; gap: 6px; }
.preset { flex: 1 1 auto; border: 1px solid var(--line); background: var(--bg); color: var(--fg); border-radius: 99px; min-height: 42px; padding: 0 12px; font-size: .85rem; font-weight: 500; }
.preset.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 700; }
.pose { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--bg); border: 1px solid var(--line); border-radius: 10px; padding: 7px 10px; font-size: .8rem; }
.pose button { border: 0; background: none; color: var(--muted); font-size: 1.1rem; line-height: 1; padding: 0 2px; }
.actions { display: flex; gap: 8px; align-items: center; }
.go { flex: 1; min-height: 48px; border: 0; border-radius: 12px; background: var(--accent); color: var(--accent-ink); font-weight: 700; font-size: 1.05rem; }
.go:disabled { opacity: .5; }
@media (min-width: 900px) {
  .composer { position: sticky; top: 12px; left: auto; right: auto; bottom: auto; width: 340px; border: 1px solid var(--line); border-radius: var(--r); box-shadow: none; padding: 14px; }
}
</style>
