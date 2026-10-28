<script setup lang="ts">
const { me, packs, authOpen, buy } = useAccount()
const buying = ref('')

const euro = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
const perEdit = (p: { credits: number; price: number }) => euro(Math.round(p.price / p.credits))

async function acheter(id: string) {
  if (buying.value) return
  if (!me.value) { authOpen.value = 'register'; return }
  buying.value = id
  try { await buy(id) } catch { buying.value = '' }
}
</script>

<template>
  <div class="pricing">
    <div class="head">
      <b>Des crédits, jamais d’abonnement</b>
      <span>1 crédit = 1 image. Les crédits n’expirent pas.</span>
    </div>
    <div class="packs">
      <button
        v-for="p in packs" :key="p.id" class="pack" :class="{ best: p.best }"
        :disabled="!!buying" @click="acheter(p.id)"
      >
        <span v-if="p.best" class="flag">Le plus choisi</span>
        <b>{{ p.credits }}</b>
        <span class="unit">crédits</span>
        <strong>{{ euro(p.price) }}</strong>
        <small>{{ perEdit(p) }} / image</small>
        <span v-if="buying === p.id" class="wait">Ouverture…</span>
      </button>
    </div>
    <p class="secure">Paiement sécurisé par Stripe · carte bancaire, Apple Pay, Google Pay</p>
  </div>
</template>

<style scoped>
.pricing { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.head { display: flex; flex-direction: column; gap: 2px; }
.head b { font-family: var(--f-display); font-size: 1rem; }
.head span { font-size: .76rem; color: var(--muted); }
.packs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pack { position: relative; display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 16px 6px 11px; border: 1px solid var(--line); border-radius: 12px; background: var(--bg); }
.pack.best { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.pack b { font-family: var(--f-display); font-size: 1.6rem; line-height: 1; }
.unit { font-size: .74rem; color: var(--muted); margin-bottom: 5px; }
.pack strong { font-size: .95rem; }
.pack small { font-size: .68rem; color: var(--muted); }
.flag { position: absolute; top: -9px; background: var(--accent); color: var(--accent-ink); font-size: .62rem; font-weight: 700; padding: 2px 8px; border-radius: 99px; white-space: nowrap; }
.wait { font-size: .66rem; color: var(--muted); margin-top: 3px; }
.secure { margin: 0; text-align: center; font-size: .72rem; color: var(--muted); }
</style>
