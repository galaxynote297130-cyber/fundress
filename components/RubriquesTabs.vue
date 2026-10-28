<script setup lang="ts">
defineProps<{ active: 'edition' | 'pose' }>()
</script>

<template>
  <nav class="tabs" aria-label="Rubriques">
    <NuxtLink to="/edition" class="tab" :class="{ on: active === 'edition' }">
      <span>Édition d'image</span>
      <strong>Modifier ma photo</strong>
      <small>Fundress V1 et V2</small>
    </NuxtLink>
    <NuxtLink to="/" class="tab" :class="{ on: active === 'pose' }">
      <span>Génération de pose</span>
      <strong>Changer la pose</strong>
      <small>Presets érotiques</small>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.tab { display: block; padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--r); background: var(--surface); text-decoration: none; color: var(--fg); }
.tab span { display: block; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; font-weight: 700; color: var(--muted); margin-bottom: 4px; }
.tab strong { display: block; font-family: var(--f-display); font-size: .92rem; }
.tab small { display: block; font-size: .72rem; color: var(--muted); margin-top: 2px; }
.tab.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, var(--surface)); }
.tab.on span { color: var(--accent); }
@media (max-width: 380px) { .tabs { gap: 6px; } .tab { padding: 8px 9px; } .tab small { display: none; } }
</style>
