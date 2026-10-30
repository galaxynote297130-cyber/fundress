<template>
  <div class="ed-app">
    <SiteTop />
    <div class="ed-wrap">
      <h1 class="titre">Galerie</h1>
      <p class="intro">
        Tes générations sont rangées ici, sur cet appareil uniquement. Personne d’autre n’y a accès,
        en cas de fermeture du navigateur ou d'un problème de connexion tu pourras y accéder pendant 1 heure.
      </p>
      <p v-if="erreur" class="err">{{ erreur }}</p>
      <div class="filters">
        <button class="f" :class="{ on: filtre === 'tout' }" @click="filtre = 'tout'">Tout</button>
        <button class="f" :class="{ on: filtre === 'image' }" @click="filtre = 'image'">Images</button>
        <button class="f" :class="{ on: filtre === 'video' }" @click="filtre = 'video'">Vidéos</button>
        <button v-if="items.length" class="f vide" @click="clear">Tout supprimer</button>
      </div>
      <div v-if="!items.length" class="vide">
        <div class="ico">＋</div>
        <b>Rien pour l’instant</b>
        <span>Lance une génération, elle apparaîtra ici.</span>
        <div class="cta">
          <NuxtLink to="/edition" class="go">Éditer une photo</NuxtLink>
          <NuxtLink to="/video" class="go ghost">Créer une vidéo</NuxtLink>
        </div>
      </div>
      <div v-else class="grid">
        <GalleryCard v-for="i in visibles" :key="i.id" :item="i" @remove="remove" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Galerie — Fundress', link: [{ rel: 'stylesheet', href: '/editor.css' }] })

const { items, erreur, list, remove, clear } = useGallery()
const filtre = ref<'tout' | 'image' | 'video'>('tout')
const visibles = computed(() => items.value.filter(i => filtre.value === 'tout' || i.kind === filtre.value))

onMounted(list)
</script>

<style scoped>
.titre { font-size: 1.05rem; margin: 4px 0 5px; }
.intro { font-size: .72rem; color: var(--muted); line-height: 1.55; margin: 0 0 11px; }
.err { font-size: .72rem; color: var(--danger); }
.filters { display: flex; gap: 6px; margin-bottom: 12px; }
.f { font-size: .68rem; padding: 5px 10px; border-radius: 99px; border: 1px solid var(--line); background: transparent; color: var(--fg); font-family: inherit; }
.f.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.f.vide { margin-left: auto; color: var(--muted); }
.vide { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; padding: 26px 10px; }
.ico { width: 34px; height: 34px; border-radius: 50%; border: 1px dashed var(--line); display: grid; place-items: center; color: var(--muted); }
.vide b { font-size: .78rem; }
.vide span { font-size: .68rem; color: var(--muted); }
.cta { display: flex; gap: 6px; margin-top: 8px; }
.go { font-size: .68rem; padding: 7px 12px; border-radius: 8px; background: var(--accent); color: var(--accent-ink); text-decoration: none; }
.go.ghost { background: transparent; border: 1px solid var(--line); color: var(--fg); }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (min-width: 820px) { .grid { grid-template-columns: repeat(4, 1fr); } }
</style>
