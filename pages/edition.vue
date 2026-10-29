<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

useHead({
  title: "Outil d'édition d'image — Fundress",
  meta: [{ name: 'description', content: "Deux moteurs au choix, rendu photoréaliste, téléchargement immédiat." }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})
</script>

<template>
  <ImageEditor />
</template>
