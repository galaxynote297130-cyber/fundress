<template>
  <div class="ed-app">
    <RubriquesTabs />
    <div class="ed-wrap">
      <h1 class="gtitre">Galerie</h1>
      <p class="gintro">
        Tes générations sont rangées ici, sur cet appareil uniquement. Personne d’autre n’y a accès,
        en cas de fermeture du navigateur ou d'un problème de connexion tu pourras y accéder pendant 1 heure.
      </p>
      <div class="gfilters">
        <button class="gf" :class="{ on: filtre === 'tout' }" @click="filtre = 'tout'">Tout</button>
        <button class="gf" :class="{ on: filtre === 'image' }" @click="filtre = 'image'">Images</button>
        <button class="gf" :class="{ on: filtre === 'video' }" @click="filtre = 'video'">Vidéos</button>
        <button v-if="items.length" class="gf vide" @click="clear">Tout supprimer</button>
      </div>

      <div v-if="!items.length" class="gvide">
        <div class="gico">＋</div>
        <b>Rien pour l’instant</b>
        <span>Lance une génération, elle apparaîtra ici.</span>
        <div class="gcta">
          <NuxtLink to="/edition" class="ggo">Éditer une photo</NuxtLink>
          <NuxtLink to="/video" class="ggo ghost">Créer une vidéo</NuxtLink>
        </div>
      </div>

      <div v-else class="ggrid">
        <GalleryCard v-for="i in visibles" :key="i.id" :item="i" @remove="remove" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Galerie — Fundress', link: [{ rel: 'stylesheet', href: '/editor.css' }] })

const { items, list, remove, clear } = useGallery()
const filtre = ref<'tout' | 'image' | 'video'>('tout')
const visibles = computed(() => items.value.filter(i => filtre.value === 'tout' || i.kind === filtre.value))

onMounted(list)
</script>
