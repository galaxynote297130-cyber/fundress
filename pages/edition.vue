<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const DESC = "Modifie ta photo avec Fundress : deux moteurs au choix, rendu photoréaliste, téléchargement immédiat. 0,75 € l'image, sans abonnement."

useHead({
  title: 'Édition d\'image — Fundress',
  meta: [{ name: 'description', content: DESC }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})
</script>

<template>
  <ImageEditor />
</template>
