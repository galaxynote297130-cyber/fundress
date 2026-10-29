<template>
  <nav class="tabs">
    <NuxtLink to="/" class="tab home" aria-label="Accueil">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
      </svg>
    </NuxtLink>
    <NuxtLink to="/edition" class="tab" :class="{ on: route.path.startsWith('/edition') }">Édition</NuxtLink>
    <NuxtLink to="/video" class="tab" :class="{ on: route.path.startsWith('/video') }">Vidéo</NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.tabs { display: flex; gap: 6px; align-items: center; padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,.08); }
.tab { flex: 1; text-align: center; font-size: 13px; padding: 8px 10px; border-radius: 9px; color: #b9b3c9; text-decoration: none; }
.tab.on { background: rgba(255,255,255,.1); color: #fff; }
.home { flex: 0 0 40px; display: grid; place-items: center; padding: 6px; }
</style>
