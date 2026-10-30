<script setup lang="ts">
const route = useRoute()

useHead({
  title: 'Contenu adulte — Fundress',
  meta: [{ name: 'robots', content: 'noindex' }]
})

const busy = ref(false)

async function entrer() {
  busy.value = true
  await $fetch('/api/age', { method: 'POST' }).catch(() => {})
  const next = String(route.query.next || '/')
  location.replace(next.startsWith('/') ? next : '/')
}
</script>

<template>
  <div class="gate">
    <div class="card">
      <span class="badge">18+</span>
      <h1>Contenu adulte</h1>
      <p>
        Fundress transforme des photos par intelligence artificielle. Certains rendus sont
        explicites. Confirme que tu as 18 ans ou plus.
      </p>
      <button :disabled="busy" @click="entrer">
        {{ busy ? 'Un instant…' : "J'ai 18 ans ou plus" }}
      </button>
      <NuxtLink to="/cgu" class="fine">Conditions générales</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.gate { min-height: 100dvh; display: grid; place-items: center; padding: 20px; }
.card { width: 100%; max-width: 380px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 26px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.badge { font-family: var(--f-display); font-weight: 800; font-size: .82rem; background: var(--accent); color: var(--accent-ink); border-radius: 6px; padding: 3px 9px; }
h1 { font-family: var(--f-display); font-size: 1.3rem; margin: 0; }
p { font-size: .84rem; color: var(--muted); line-height: 1.55; margin: 0; }
button { width: 100%; min-height: 42px; border: 0; border-radius: 9px; background: var(--accent); color: var(--accent-ink); font-weight: 800; font-size: .86rem; font-family: inherit; }
button:disabled { opacity: .6; }
.fine { font-size: .7rem; color: var(--muted); text-decoration: none; }
</style>
