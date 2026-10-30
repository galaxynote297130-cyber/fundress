<template>
  <footer class="foot">
    <nav>
      <NuxtLink to="/cgu">CGU</NuxtLink>
      <NuxtLink to="/confidentialite">Confidentialité</NuxtLink>
      <NuxtLink to="/mentions-legales">Mentions légales</NuxtLink>
      <a href="mailto:contact@fundress.app">Contact</a>
    </nav>
  </footer>
</template>

<style scoped>
.foot { border-top: 1px solid var(--line); margin-top: 26px; padding-top: 16px; }
nav { display: flex; flex-wrap: wrap; gap: 14px; }
nav a { color: var(--muted); text-decoration: none; font-size: .82rem; font-weight: 500; }
nav a:hover { color: var(--fg); }
</style>
