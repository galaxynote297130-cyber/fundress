<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

useHead({
  title: "Outil de génération de pose — Fundress",
  meta: [{ name: 'description', content: "Choisis une scène, envoie ta photo, le visage et le décor sont conservés." }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})
</script>

<template>
  <ImageEditor variant="pose" />
</template>
