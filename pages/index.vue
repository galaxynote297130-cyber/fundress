<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const TITRE = "Fundress — AI Undress · Déshabille n'importe quelle photo"
const DESC = "Déshabille n'importe quelle photo avec l'IA. Envoie une photo, choisis un modèle, télécharge. Contenu adulte 18+, résultat en quelques secondes."

useHead({
  title: TITRE,
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
  <div class="app">
    <SiteTop />
    <main class="wrap">
      <RubriquesTabs active="accueil" />
      <BeforeAfterStrip />
      <PoseGallery />
      <SiteFooter />
    </main>
  </div>
</template>

<style scoped>
.app { min-height: 100dvh; display: flex; flex-direction: column; padding-top: env(safe-area-inset-top, 0px); }
.wrap { flex: 1; display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 max(14px, env(safe-area-inset-right, 0px)) calc(24px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left, 0px)); }
</style>
