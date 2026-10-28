<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const TITLE = "Fundress — AI Undress · Déshabille n'importe quelle photo"
const DESC = "Déshabille n'importe quelle photo avec l'IA. Envoie une photo, choisis un modèle, télécharge. Contenu adulte 18+, résultat en quelques secondes."

useHead({
  title: TITLE,
  meta: [{ name: 'description', content: DESC }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Fundress',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      description: DESC,
    }),
  }],
})
</script>

<template>
  <PoseGallery />
</template>
