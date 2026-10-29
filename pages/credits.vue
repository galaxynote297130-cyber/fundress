<script setup lang="ts">
const { me, packs, authOpen, buy } = useAccount()
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const buying = ref('')

const euro = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
const remise = (p: { price: number; was?: number }) => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0)

const DESC = "Achète des crédits Fundress. Paiement unique, aucun abonnement, crédits valables sans limite de temps. 5 crédits par image en V1, 10 en V2."

useHead({
  title: 'Crédits — Fundress',
  meta: [{ name: 'description', content: DESC }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})

async function acheter(id: string) {
  if (buying.value) return
  if (!me.value) { authOpen.value = 'register'; return }
  buying.value = id
  try { await buy(id) } catch { buying.value = '' }
}
</script>

<template>
  <div class="page">
    <SiteTop />
    <main class="wrap">
      <section class="hero">
        <h1>Choisis ton pack</h1>
        <p>Paiement unique · Photo supprimée après usage · 100 % privé</p>
      </section>

      <div class="packs">
        <div v-for="p in packs" :key="p.id" class="pack" :class="{ best: p.best }">
          <span v-if="p.was" class="off">-{{ remise(p) }} %</span>
          <b>{{ p.credits }}</b>
          <span class="unit">crédits</span>
          <strong>{{ euro(p.price) }}</strong>
          <s v-if="p.was">{{ euro(p.was) }}</s>
          <button :disabled="!!buying" @click="acheter(p.id)">{{ buying === p.id ? 'Ouverture…' : 'Acheter' }}</button>
        </div>
      </div>

      <ul class="reassure">
        <li>Aucun prélèvement automatique</li>
        <li>Les crédits n'expirent pas</li>
        <li>Paiement sécurisé par Stripe</li>
      </ul>

      <div class="pay">
        <span>Carte bancaire</span><span>Apple Pay</span><span>Google Pay</span><span>Link</span>
      </div>

      <div class="proof">
        <div class="stat"><b>500 K+</b><span>photos générées</span></div>
        <div class="stat"><b>4,8/5</b><span>note moyenne</span></div>
        <div class="stat"><b>99 %</b><span>satisfaction</span></div>
      </div>

      <div class="quotes">
        <div class="q"><p>« Le rendu est net, la peau crédible. Rien à voir avec ce que j'avais essayé avant. »</p><span>Julien</span></div>
        <div class="q"><p>« Payé une fois, jamais de surprise sur le relevé. C'est ce que je cherchais. »</p><span>Sofia</span></div>
      </div>

      <p class="foot">Un souci ? support@fundress.com</p>
      <SiteFooter />
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100dvh; display: flex; flex-direction: column; padding-top: env(safe-area-inset-top, 0px); }
.wrap { flex: 1; display: flex; flex-direction: column; max-width: 760px; width: 100%; margin: 0 auto; padding: 0 max(14px, env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left)); }
.hero { text-align: center; padding: 26px 0 20px; }
.hero h1 { font-family: var(--f-display); font-size: 1.7rem; margin: 0 0 6px; letter-spacing: -.02em; }
.hero p { font-size: .8rem; color: var(--muted); margin: 0; }
.packs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.pack { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 26px 10px 14px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); }
.pack.best { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.off { position: absolute; top: -9px; background: var(--accent); color: var(--accent-ink); font-size: .6rem; font-weight: 800; padding: 3px 9px; border-radius: 99px; }
.pack b { font-family: var(--f-display); font-size: 1.8rem; line-height: 1; letter-spacing: -.02em; }
.unit { font-size: .72rem; color: var(--muted); margin-bottom: 8px; }
.pack strong { font-size: 1rem; }
.pack s { font-size: .72rem; color: var(--muted); opacity: .7; }
.pack button { margin-top: 10px; width: 100%; min-height: 42px; border: 0; border-radius: 9px; background: var(--accent); color: var(--accent-ink); font-weight: 800; font-size: .9rem; }
.pack button:disabled { opacity: .6; }
.reassure { list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; font-size: .74rem; color: var(--muted); }
.reassure li { background: var(--surface); border: 1px solid var(--line); border-radius: 99px; padding: 5px 10px; }
.pay { display: flex; gap: 7px; justify-content: center; margin-top: 12px; flex-wrap: wrap; }
.pay span { font-size: .68rem; color: var(--muted); border: 1px solid var(--line); border-radius: 6px; padding: 5px 9px; }
.proof { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 22px; text-align: center; border-top: 1px solid var(--line); padding-top: 16px; }
.stat b { display: block; font-family: var(--f-display); font-size: 1.15rem; }
.stat span { font-size: .68rem; color: var(--muted); }
.quotes { display: grid; gap: 10px; margin-top: 16px; }
.q { background: var(--surface); border: 1px solid var(--line); border-radius: 11px; padding: 11px; }
.q p { margin: 0 0 6px; font-size: .78rem; color: var(--fg); opacity: .85; line-height: 1.45; }
.q span { font-size: .68rem; color: var(--muted); }
.foot { text-align: center; font-size: .68rem; color: var(--muted); margin: 18px 0 0; }
@media (min-width: 640px) {
  .packs { grid-template-columns: repeat(4, 1fr); }
  .quotes { grid-template-columns: 1fr 1fr; }
  .hero h1 { font-size: 2.1rem; }
}
</style>
