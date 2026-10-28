<template>
  <footer class="foot">
    <nav>
      <NuxtLink to="/cgu">CGU</NuxtLink>
      <NuxtLink to="/confidentialite">Confidentialité</NuxtLink>
      <a href="mailto:support@exemple.com">Contact</a>
    </nav>
    <p>Réservé aux personnes de 18 ans et plus · Photo supprimée sous 24 h · Jamais revendue</p>
    <p class="copy">Fundress — déshabillage de photo par IA.</p>
  </footer>
</template>

<style scoped>
.foot { border-top: 1px solid var(--line); margin-top: 26px; padding-top: 16px; }
nav { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 8px; }
nav a { color: var(--muted); text-decoration: none; font-size: .82rem; font-weight: 500; }
nav a:hover { color: var(--fg); }
p { color: var(--muted); font-size: .74rem; line-height: 1.5; margin: 0 0 4px; }
.copy { opacity: .75; }
</style>
