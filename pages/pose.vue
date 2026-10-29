<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

useHead({
  title: "Mise en scène — Fundress",
  meta: [{ name: 'description', content: "Choisis une scène et obtiens un rendu photoréaliste en quelques secondes." }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})
</script>

<template>
  <ImageEditor variant="pose" :pose-id="String(route.query.pose || '')" />
</template>
