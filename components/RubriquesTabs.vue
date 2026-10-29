<script setup lang="ts">
defineProps<{ active: 'accueil' | 'edition' | 'pose' }>()
</script>

<template>
  <nav class="tabs" aria-label="Navigation">
    <NuxtLink to="/" class="tab home" :class="{ on: active === 'accueil' }" aria-label="Accueil" title="Accueil">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></svg>
    </NuxtLink>
    <NuxtLink to="/edition" class="tab" :class="{ on: active === 'edition' }">
      <span>Édition</span>
      <strong>Modifier ma photo</strong>
    </NuxtLink>
    <NuxtLink to="/pose" class="tab" :class="{ on: active === 'pose' }">
      <span>Pose</span>
      <strong>Changer la pose</strong>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabs { display: flex; align-items: stretch; gap: 6px; }
.tab { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 1px; padding: 7px 10px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); text-decoration: none; color: var(--fg); }
.tab span { font-size: .58rem; letter-spacing: .09em; text-transform: uppercase; font-weight: 700; color: var(--muted); }
.tab strong { font-size: .8rem; font-weight: 700; }
.tab.home { flex: 0 0 34px; align-items: center; padding: 0; border-radius: 9px; color: var(--muted); }
.tab.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 9%, var(--surface)); }
.tab.on span, .tab.home.on { color: var(--accent); }
@media (max-width: 400px) {
  .tab strong { font-size: .74rem; }
  .tab.home { flex: 0 0 30px; }
}
</style>
