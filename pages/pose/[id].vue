<script setup lang="ts">
import { POSES, findPose } from '~/utils/poses'

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const id = String(route.params.id || '')
const pose = findPose(id)
if (!pose) throw createError({ statusCode: 404, statusMessage: 'Scène introuvable' })

useHead({
  title: `${pose.label} — Fundress`,
  meta: [{ name: 'description', content: `Génère un ${pose.label} depuis ta photo. Visage et décor conservés.` }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})

const autres = POSES.filter(p => p.id !== id).slice(0, 3)
</script>

<template>
  <ImageEditor variant="pose" :pose-id="id" />

  <nav class="autres">
    <NuxtLink v-for="p in autres" :key="p.id" :to="`/pose/${p.id}`">{{ p.label }}</NuxtLink>
  </nav>
</template>

<style scoped>
.autres { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; padding: 0 14px 18px; }
.autres a { font-size: .74rem; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: 6px 11px; text-decoration: none; }
.autres a:hover { color: var(--fg); border-color: var(--accent); }
</style>
