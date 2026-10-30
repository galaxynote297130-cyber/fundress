<script setup lang="ts">
// Fenêtre d'achat de crédits : carte via Stripe, ou crypto
const { me, packs, buyOpen, buy } = useAccount()

const mode = ref<'carte' | 'crypto'>('carte')
const loading = ref('')
const error = ref('')

const euro = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
const perEdit = (p: { credits: number; price: number }) => euro(Math.round(p.price / p.credits))

async function choose(id: string) {
  error.value = ''
  loading.value = id
  try {
    if (mode.value === 'carte') {
      await buy(id)
      return
    }
    const { url } = await $fetch<{ url: string }>('/api/credits/crypto', { method: 'POST', body: { pack: id } })
    location.href = url
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e.message
  } finally {
    loading.value = ''
  }
}
</script>

<template>
  <div v-if="buyOpen" class="modal" @click.self="buyOpen = false">
    <div class="sheet" role="dialog" aria-labelledby="buy-title">
      <h3 id="buy-title">Recharger des crédits</h3>
      <p class="sub">Solde actuel : <b>{{ me?.credits ?? 0 }} crédits</b></p>

      <div class="modes">
        <button :class="{ on: mode === 'carte' }" @click="mode = 'carte'">Carte</button>
        <button :class="{ on: mode === 'crypto' }" @click="mode = 'crypto'">Crypto</button>
      </div>

      <div class="packs">
        <button
          v-for="p in packs"
          :key="p.id"
          class="pack"
          :class="{ best: p.best }"
          :disabled="!!loading"
          @click="choose(p.id)"
        >
          <span v-if="p.best" class="flag">Le plus choisi</span>
          <b>{{ p.credits }}</b>
          <span class="unit">crédits</span>
          <strong>{{ euro(p.price) }}</strong>
          <small>{{ perEdit(p) }} / image</small>
          <span v-if="loading === p.id" class="wait">Ouverture…</span>
        </button>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <p class="secure">
        <template v-if="mode === 'carte'">Paiement sécurisé par Stripe · carte bancaire, Apple Pay, Google Pay</template>
        <template v-else>Paiement en crypto · BTC, ETH, USDT, LTC et autres. Crédité dès confirmation du réseau.</template>
      </p>

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
.modes { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--sunk); border-radius: 12px; padding: 4px; }
.modes button { min-height: 40px; border: 0; border-radius: 9px; background: transparent; color: var(--muted); font-family: inherit; font-weight: 700; font-size: .82rem; }
.modes button.on { background: var(--surface); color: var(--fg); box-shadow: 0 1px 3px rgba(0, 0, 0, .18); }
.packs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pack { position: relative; display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 18px 6px 12px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg); color: var(--fg); font-family: inherit; }
.pack.best { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.pack b { font-family: var(--f-display); font-size: 1.8rem; line-height: 1; font-variant-numeric: tabular-nums; }
.unit { font-size: .8rem; color: var(--muted); margin-bottom: 6px; }
.pack strong { font-size: 1rem; }
.pack small { font-size: .72rem; color: var(--muted); }
.flag { position: absolute; top: -9px; background: var(--accent); color: var(--accent-ink); font-size: .65rem; font-weight: 700; padding: 2px 8px; border-radius: 99px; white-space: nowrap; }
.wait { font-size: .7rem; color: var(--mask); margin-top: 4px; }
.error { margin: 0; color: var(--danger); font-size: .9rem; }
.secure { margin: 0; text-align: center; font-size: .78rem; color: var(--muted); line-height: 1.5; }
.close { min-height: 42px; border: 0; background: none; color: var(--muted); font-family: inherit; }
</style>
