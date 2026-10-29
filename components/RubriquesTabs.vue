<template>
  <nav class="tabs">
    <NuxtLink to="/" class="tab home" aria-label="Accueil">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
      </svg>
    </NuxtLink>
    <NuxtLink to="/edition" class="tab" :class="{ on: route.path.startsWith('/edition') }">Éditer</NuxtLink>
    <NuxtLink to="/video" class="tab" :class="{ on: route.path.startsWith('/video') }">Vidéo</NuxtLink>
    <NuxtLink to="/galerie" class="tab" :class="{ on: route.path.startsWith('/galerie') }">Galerie</NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.tabs { display: flex; gap: 4px; align-items: center; padding: 7px 8px; border-bottom: 1px solid rgba(255,255,255,.08); }
.tab { flex: 1; min-width: 0; text-align: center; font-size: 11px; padding: 7px 2px; border-radius: 8px; color: #b9b3c9; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tab.on { background: rgba(255,255,255,.1); color: #fff; }
.home { flex: 0 0 30px; padding: 0; display: grid; place-items: center; height: 30px; }
</style>
