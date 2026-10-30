<template>
  <header class="top">
    <NuxtLink to="/" class="logo"><i />Xpicture <span class="kicker">AI undress</span></NuxtLink>
    <AccountBar />
  </header>
</template>

<style scoped>
.top { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px max(14px, env(safe-area-inset-right)) 8px max(14px, env(safe-area-inset-left)); }
.logo { font-family: var(--f-display); font-weight: 800; font-size: 1.2rem; letter-spacing: -.02em; display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--fg); }
.logo i { width: 20px; height: 20px; border-radius: 6px; background: conic-gradient(from 200deg, var(--mask), var(--accent), var(--mask)); }
.kicker { font-family: var(--f-body); font-size: .62rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: 2px 7px; }
</style>
