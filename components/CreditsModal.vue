<script setup lang="ts">
// Fenêtre d'achat de crédits (redirige vers la page de paiement Stripe)
const { me, packs, buyOpen, buy } = useAccount()
const loading = ref('')
const error = ref('')

const euro = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
const perEdit = (p: { credits: number; price: number }) => euro(Math.round(p.price / p.credits))

async function choose(id: string) {
  error.value = ''
  loading.value = id
  try { await buy(id) } catch (e: any) { error.value = e.message; loading.value = '' }
}
</script>

<template>
  <div v-if="buyOpen" class="modal" @click.self="buyOpen = false">
    <div class="sheet" role="dialog" aria-labelledby="buy-title">
      <h3 id="buy-title">Recharger des crédits</h3>
      <p class="sub">
        Solde actuel : <b>{{ me?.credits ?? 0 }} crédits</b> · 1 crédit par image
      </p>
      <div class="packs">
        <button
          v-for="p in packs" :key="p.id" class="pack" :class="{ best: p.best }"
          :disabled="!!loading" @click="choose(p.id)"
        >
          <span v-if="p.best" class="flag">Le plus choisi</span>
          <b>{{ p.credits }}</b>
          <span class="unit">crédits</span>
          <strong>{{ euro(p.price) }}</strong>
          <small>{{ perEdit(p) }} / image</small>
          <span v-if="loading === p.id" class="wait">Ouverture du paiement…</span>
        </button>
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p class="secure">Paiement sécurisé par Stripe · carte bancaire, Apple Pay, Google Pay</p>
      <button class="close" @click="buyOpen = false">Fermer</button>
    </div>
  </div>
</template>

<style scoped>
.modal { position: fixed; inset: 0; z-index: 40; background: rgba(8, 10, 16, .55); display: flex; align-items: flex-end; justify-content: center; }
.sheet { width: 100%; max-width: 560px; background: var(--surface); border-radius: 18px 18px 0 0; padding: 20px max(16px, env(safe-area-inset-right, 0px)) calc(18px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); display: flex; flex-direction: column; gap: 12px; }
@media (min-width: 600px) { .modal { align-items: center; } .sheet { border-radius: 18px; padding: 24px; } }
h3 { margin: 0; font-family: var(--f-display); font-size: 1.35rem; }
.sub { margin: 0; color: var(--muted); font-size: .9rem; }
.sub b { color: var(--fg); }
.packs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pack { position: relative; display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 18px 6px 12px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg); }
.pack.best { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.pack b { font-family: var(--f-display); font-size: 1.8rem; line-height: 1; font-variant-numeric: tabular-nums; }
.unit { font-size: .8rem; color: var(--muted); margin-bottom: 6px; }
.pack strong { font-size: 1rem; }
.pack small { font-size: .72rem; color: var(--muted); }
.flag { position: absolute; top: -9px; background: var(--accent); color: var(--accent-ink); font-size: .65rem; font-weight: 700; padding: 2px 8px; border-radius: 99px; white-space: nowrap; }
.wait { font-size: .7rem; color: var(--mask); margin-top: 4px; }
.error { margin: 0; color: var(--danger); font-size: .9rem; }
.secure { margin: 0; text-align: center; font-size: .78rem; color: var(--muted); }
.close { min-height: 42px; border: 0; background: none; color: var(--muted); }
</style>
