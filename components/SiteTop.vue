<script setup lang="ts">
import { ref, onMounted } from 'vue'

const ageOk = ref(true)

onMounted(() => {
  ageOk.value = !!localStorage.getItem('fundress-age-ok')
})

function acceptAge() {
  localStorage.setItem('fundress-age-ok', '1')
  ageOk.value = true
}
</script>

<template>
  <div v-if="!ageOk" class="gate" role="dialog" aria-label="Vérification d'âge">
    <span><b>18+</b> Ce site contient du contenu adulte.</span>
    <button @click="acceptAge">J'ai 18 ans</button>
  </div>

  <header class="top">
    <NuxtLink to="/" class="logo"><i />FUNDRESS <span class="kicker">AI undress</span></NuxtLink>
    <AccountBar />
  </header>
</template>

<style scoped>
.gate { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 10px max(14px, env(safe-area-inset-right)) 10px max(14px, env(safe-area-inset-left)); background: var(--fg); color: var(--bg); font-size: .82rem; }
.gate b { background: var(--accent); color: var(--accent-ink); border-radius: 6px; padding: 2px 7px; margin-right: 4px; font-size: .74rem; }
.gate button { border: 0; border-radius: 99px; min-height: 32px; padding: 0 14px; background: var(--accent); color: var(--accent-ink); font-weight: 700; font-size: .82rem; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px max(14px, env(safe-area-inset-right)) 8px max(14px, env(safe-area-inset-left)); }
.logo { font-family: var(--f-display); font-weight: 800; font-size: 1.2rem; letter-spacing: -.02em; display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--fg); }
.logo i { width: 20px; height: 20px; border-radius: 6px; background: conic-gradient(from 200deg, var(--mask), var(--accent), var(--mask)); }
.kicker { font-family: var(--f-body); font-size: .62rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: 2px 7px; }
</style>
