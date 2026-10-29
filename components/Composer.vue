<script setup lang="ts">
import { MODES } from '~/utils/presets'

const props = defineProps<{
  chosen: string
  canGenerate: boolean
  goLabel: string
  poseLabel: string | null
  cost: number
  variant?: 'edition' | 'pose'
}>()

defineEmits<{ choose: [string]; generate: []; removePose: [] }>()
</script>

<template>
  <aside class="composer">
    <template v-if="props.variant === 'pose'">
      <span class="composer-title">Scène</span>
      <div class="pose">
        <span>{{ poseLabel || 'Aucune scène choisie' }}</span>
        <button v-if="poseLabel" type="button" title="Retirer la scène" @click="$emit('removePose')">×</button>
      </div>
    </template>

    <label class="ligne">
      <span>Modèle</span>
      <select :value="chosen" @change="$emit('choose', ($event.target as HTMLSelectElement).value)">
        <option v-for="m in MODES" :key="m.id" :value="m.id">{{ m.label }} — {{ m.cost }} crédits</option>
      </select>
    </label>

    <div class="actions">
      <button class="go" :disabled="!canGenerate" @click="$emit('generate')">{{ goLabel }}</button>
    </div>
    <NuxtLink to="/credits" class="recharge">Recharger des crédits</NuxtLink>
  </aside>
</template>

<style scoped>
.composer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; background: var(--surface); border-top: 1px solid var(--line); box-shadow: 0 -6px 24px rgba(0, 0, 0, .12); display: flex; flex-direction: column; gap: 9px; padding: 12px max(14px, env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left)); }
.composer-title { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 600; }
.pose { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--bg); border: 1px solid var(--line); border-radius: 10px; padding: 9px 10px; font-size: .85rem; }
.pose button { border: 0; background: none; color: var(--muted); font-size: 1.1rem; line-height: 1; padding: 0 2px; }
.ligne { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: .8rem; color: var(--muted); }
.ligne select { flex: 1; max-width: 62%; min-height: 38px; border: 1px solid var(--line); border-radius: 9px; background: var(--bg); color: var(--fg); font-family: inherit; font-size: .85rem; padding: 0 8px; }
.actions { display: flex; gap: 8px; align-items: center; }
.go { flex: 1; min-height: 48px; border: 0; border-radius: 12px; background: var(--accent); color: var(--accent-ink); font-weight: 700; font-size: 1.05rem; }
.go:disabled { opacity: .5; }
.recharge { text-align: center; font-size: .72rem; color: var(--muted); text-decoration: none; }
.recharge:hover { color: var(--fg); }
@media (min-width: 900px) {
  .composer { position: sticky; top: 12px; left: auto; right: auto; bottom: auto; width: 340px; border: 1px solid var(--line); border-radius: var(--r); box-shadow: none; padding: 14px; }
  .ligne { flex-direction: column; align-items: stretch; }
  .ligne select { max-width: none; }
}
</style>
