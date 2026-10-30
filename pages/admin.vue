<template>
  <div class="ed-app">
    <SiteTop />
    <div class="ed-wrap">
      <h1 class="titre">Journal</h1>

      <div class="zone">
        <label class="lab" for="cle">Clé admin</label>
        <div class="inline">
          <input id="cle" v-model="cle" type="password" class="inp" placeholder="ta clé NUXT_ADMIN_KEY" @keyup.enter="charger" />
          <button class="btn" @click="charger">Ouvrir</button>
        </div>
        <p class="hint">Gardée sur cet appareil uniquement. Elle ne sert qu’à ce journal.</p>
      </div>

      <p v-if="erreur" class="err">{{ erreur }}</p>

      <template v-if="shots.length">
        <div class="tools">
          <button class="chip" :class="{ on: filtre === 'tout' }" @click="filtre = 'tout'">Tout</button>
          <button class="chip" :class="{ on: filtre === 'sans' }" @click="filtre = 'sans'">Sans scène</button>
          <button class="chip" :class="{ on: filtre === 'avec' }" @click="filtre = 'avec'">Avec scène</button>
          <button class="chip vide" @click="charger">Recharger</button>
        </div>

        <div class="list">
          <div v-for="s in visibles" :key="s.id" class="item">
            <div class="l1">
              <span class="mode">{{ s.mode === 'v1' ? 'Base' : 'Photoréaliste' }}</span>
              <span class="mail">{{ s.email }}</span>
            </div>
            <div class="l2">{{ s.pose || 'sans scène' }} · {{ quand(s.at) }}</div>
          </div>
        </div>
        <p class="foot">{{ visibles.length }} entrée(s) · métadonnées seules, aucune image</p>
      </template>

      <p v-else-if="ouvert && !erreur" class="foot">Aucune génération enregistrée.</p>
      <SiteFooter />
    </div>
    <AuthModal />
    <CreditsModal />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Journal — Fundress', link: [{ rel: 'stylesheet', href: '/editor.css' }] })

type Shot = { id: string; email: string; mode: string; pose: string; at: string }

const cle = ref('')
const shots = ref<Shot[]>([])
const erreur = ref('')
const ouvert = ref(false)
const filtre = ref<'tout' | 'sans' | 'avec'>('tout')

const visibles = computed(() =>
  shots.value.filter(s => filtre.value === 'tout' || (filtre.value === 'avec' ? !!s.pose : !s.pose))
)

function quand(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' ' +
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

async function charger() {
  erreur.value = ''
  const k = cle.value.trim()
  if (!k) return
  localStorage.setItem('fundress-admin', k)
  try {
    const r = await $fetch<{ total: number; shots: Shot[] }>('/api/admin/shots', { headers: { 'x-admin-key': k } })
    shots.value = r.shots
    ouvert.value = true
  } catch (e: any) {
    shots.value = []
    erreur.value = e?.data?.statusMessage || 'Clé refusée.'
  }
}

onMounted(() => {
  const k = localStorage.getItem('fundress-admin')
  if (k) { cle.value = k; charger() }
})
</script>

<style scoped>
.titre { font-size: 1.05rem; margin: 4px 0 10px; }
.zone { margin-bottom: 12px; }
.lab { font-size: .64rem; color: var(--muted); display: block; margin-bottom: 4px; }
.inline { display: flex; gap: 6px; }
.inp { flex: 1; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; color: var(--fg); font-size: .74rem; padding: 8px 10px; font-family: inherit; }
.btn { font-size: .74rem; padding: 8px 14px; border: 0; border-radius: 8px; background: var(--accent); color: var(--accent-ink); font-weight: 800; font-family: inherit; }
.hint { font-size: .62rem; color: var(--muted); margin: 5px 0 0; }
.err { font-size: .72rem; color: var(--danger); }
.tools { display: flex; gap: 6px; margin-bottom: 10px; }
.chip { font-size: .66rem; padding: 5px 10px; border-radius: 99px; border: 1px solid var(--line); background: transparent; color: var(--fg); font-family: inherit; }
.chip.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.chip.vide { margin-left: auto; color: var(--muted); }
.list { display: flex; flex-direction: column; gap: 6px; }
.item { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 8px 9px; }
.l1 { display: flex; align-items: center; gap: 6px; }
.mode { font-size: .56rem; background: color-mix(in srgb, var(--accent) 22%, var(--surface)); color: var(--fg); border-radius: 4px; padding: 1px 5px; }
.mail { font-size: .68rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.l2 { font-size: .6rem; color: var(--muted); margin-top: 2px; }
.foot { font-size: .6rem; color: var(--muted); margin: 10px 0 0; }
</style>
