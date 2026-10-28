<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MODES, DEFAULT_MODE } from '~/utils/presets'

const { me, packs, authOpen, buyOpen, refresh, confirmPayment, setCredits, buy } = useAccount()

const MAX_SIDE = 2048
type Slot = { url: string; data: string; name: string } | null
const main = ref<Slot>(null)
const over = ref(false)
const busy = ref(false)
const message = ref<{ text: string; error?: boolean } | null>(null)
const ageOk = ref(true)
const buying = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

type Result = { url: string; label: string }
const results = ref<Result[]>([])
const current = ref(-1)
const shown = computed(() => results.value[current.value] || null)

const modes = MODES
const chosen = ref(DEFAULT_MODE)

function choose(id: string) {
  chosen.value = id
}

function pick() {
  fileInput.value?.click()
}

const euro = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
const perEdit = (p: { credits: number; price: number }) => euro(Math.round(p.price / p.credits))

async function acheter(id: string) {
  if (buying.value) return
  if (!me.value) { authOpen.value = 'register'; return }
  buying.value = id
  try { await buy(id) } catch (e: any) { notify(e?.message || 'Paiement indisponible.', true); buying.value = '' }
}

const cost = 1
const canGenerate = computed(() => !!main.value && !!chosen.value && !busy.value)
const goLabel = computed(() => {
  if (busy.value) return 'En cours…'
  if (!main.value) return 'Ajoute une photo'
  if (!me.value) return 'Se connecter pour générer'
  if (me.value.credits < cost) return 'Recharger des crédits'
  return 'Générer'
})

let t: ReturnType<typeof setTimeout> | undefined
function notify(text: string, error = false) {
  message.value = { text, error }
  clearTimeout(t)
  t = setTimeout(() => (message.value = null), error ? 5000 : 2500)
}

async function readImage(f: File | Blob, name = 'image'): Promise<NonNullable<Slot>> {
  const bmp = await createImageBitmap(f)
  if (Math.min(bmp.width, bmp.height) < 256) throw new Error('Image trop petite (256 px minimum).')
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  const data = c.toDataURL('image/jpeg', 0.92)
  return { url: data, data, name }
}

async function setPhoto(f?: File | null) {
  if (!f) return
  if (!f.type.startsWith('image/')) return notify("Ce fichier n'est pas une image.", true)
  try {
    main.value = await readImage(f, f.name)
  } catch (e: any) {
    notify(e?.message || 'Impossible de lire cette image.', true)
  }
}

async function tryExample() {
  if (busy.value) return
  try {
    const res = await fetch('/exemple-4-avant.webp.webp')
    if (!res.ok) throw new Error()
    main.value = await readImage(await res.blob(), 'exemple')
    notify('Photo d’exemple chargée')
  } catch {
    notify('Exemple indisponible pour le moment.', true)
  }
}

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  setPhoto(input.files?.[0])
  input.value = ''
}
function onDrop(e: DragEvent) {
  over.value = false
  setPhoto(e.dataTransfer?.files?.[0])
}

async function generate() {
  if (busy.value || !main.value) return
  if (!chosen.value) return notify('Choisis un modèle.', true)
  if (!me.value) { authOpen.value = 'register'; return }
  if (me.value.credits < cost) { buyOpen.value = true; return }
  busy.value = true
  try {
    const res = await fetch('/api/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: main.value.data, mode: chosen.value }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      if (res.status === 401) { await refresh(); authOpen.value = 'login' }
      if (res.status === 402) buyOpen.value = true
      throw new Error(err?.message || err?.statusMessage || `Erreur ${res.status}`)
    }
    const left = res.headers.get('X-Credits')
    if (left !== null) setCredits(Number(left))
    const blob = await res.blob()
    const label = MODES.find(m => m.id === chosen.value)?.label || 'résultat'
    results.value.push({ url: URL.createObjectURL(blob), label })
    if (results.value.length > 20) URL.revokeObjectURL(results.value.shift()!.url)
    current.value = results.value.length - 1
    notify('Image générée')
  } catch (e: any) {
    notify(e?.message || 'La génération a échoué.', true)
  } finally {
    busy.value = false
  }
}

onMounted(async () => {
  ageOk.value = !!localStorage.getItem('fundress-age-ok')
  await refresh().catch((e: any) => notify(`Compte indisponible : ${e?.message || 'erreur serveur'}`, true))
  const q = new URLSearchParams(location.search)
  if (q.get('paiement') === 'ok' && q.get('session_id')) {
    try {
      const r = await confirmPayment(q.get('session_id')!)
      notify(r.paid ? `Paiement reçu : +${r.credits} crédits` : 'Paiement en attente de confirmation.')
    } catch (e: any) { notify(e.message, true) }
  } else if (q.get('paiement') === 'annule') {
    notify("Paiement annulé. Aucun montant n'a été débité.")
  } else if (q.get('erreur') === 'google') {
    notify('La connexion avec Google a échoué. Réessaie ou utilise ton email.', true)
  }
  if (q.toString()) history.replaceState(null, '', location.pathname)
})

function acceptAge() {
  localStorage.setItem('fundress-age-ok', '1')
  ageOk.value = true
}

async function reuse() {
  if (!shown.value) return
  const blob = await (await fetch(shown.value.url)).blob()
  main.value = await readImage(blob, 'résultat')
  window.scrollTo({ top: 0, behavior: 'smooth' })
  notify('Résultat placé à gauche, prêt à être retouché')
}

async function save() {
  if (!shown.value) return
  const blob = await (await fetch(shown.value.url)).blob()
  const file = new File([blob], `fundress-${Date.now()}.png`, { type: blob.type || 'image/png' })
  const nav = navigator as any
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file] }); return } catch { /* annulé */ }
  }
  const a = document.createElement('a')
  a.href = shown.value.url; a.download = file.name; a.click()
}
</script>

<template>
  <div class="app">
    <div v-if="!ageOk" class="gate" role="dialog" aria-label="Vérification d'âge">
      <span><b>18+</b> Ce site contient du contenu adulte.</span>
      <button @click="acceptAge">J'ai 18 ans</button>
    </div>

    <header class="top">
      <div class="logo"><i />FUNDRESS <span class="kicker">AI undress</span></div>
      <AccountBar />
    </header>

    <main class="layout">
      <section class="left">
        <div class="banner">
          <div class="banner-media" aria-hidden="true">
            <img src="/exemple-4-avant.webp.webp" alt="">
            <img class="after" src="/exemple-4-apres.webp.webp" alt="">
            <span class="swipe" />
          </div>
          <div class="banner-body">
            <span class="tag-line">Rendu photoréaliste</span>
            <h1>Ta photo, modifiée en quelques secondes.</h1>
            <h2>Une photo, plusieurs versions.</h2>
            <p>Choisis le rendu qui te plaît, le reste ne bouge pas.</p>
            <div class="cta">
              <button class="primary" @click="pick">Modifier ma photo</button>
              <button class="link" @click="tryExample">Voir un exemple</button>
            </div>
            <span class="offer">2 crédits offerts à l’inscription</span>
          </div>
        </div>

        <BeforeAfterStrip />

        <div class="privacy">
          <span>Paiement sécurisé par Stripe</span>
          <span>Aucun abonnement</span>
          <span>Photo supprimée après usage</span>
        </div>

        <div class="drops">
          <label
            class="drop" :class="{ filled: main, over }"
            @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="onDrop"
          >
            <input ref="fileInput" type="file" accept="image/*" class="sr" @change="onPick">
            <img v-if="main" :src="main.url" alt="Ta photo">
            <span v-else class="empty">
              <span class="badge">1</span>
              <strong>Ta photo</strong>
              <small>Touche pour choisir ou dépose ta photo ici</small>
            </span>
            <span v-if="main" class="tag">Ta photo · changes</span>
          </label>

          <div class="drop out" :class="{ done: shown }">
            <img v-if="shown" :src="shown.url" alt="Résultat">
            <span v-else class="empty">
              <span class="badge">2</span>
              <strong>Résultat</strong>
              <small>Ta photo modifiée apparaîtra ici</small>
            </span>
            <span v-if="shown" class="tag">Résultat</span>
            <div v-if="busy" class="busy"><span><i class="dot" />En cours…</span></div>
          </div>
        </div>

        <div class="after-bar">
          <button class="ghost" :disabled="!shown || busy" @click="save">Télécharger</button>
          <button class="ghost" :disabled="!shown || busy" @click="reuse">Retoucher</button>
          <button class="ghost" :disabled="!shown || busy" @click="generate">Régénérer</button>
        </div>

        <div v-if="results.length > 1" class="strip">
          <button
            v-for="(r, i) in results" :key="r.url" class="thumb" :class="{ on: i === current }"
            :title="r.label" @click="current = i"
          >
            <img :src="r.url" alt=""><small>{{ r.label }}</small>
          </button>
        </div>

        <div class="perks">
          <div class="perk">
            <b>Rendu photoréaliste</b>
            <span>Pose, décor et lumière conservés au pixel près</span>
          </div>
          <div class="perk">
            <b>1 crédit par image</b>
            <span>Pas d'abonnement, les crédits ne périment pas</span>
          </div>
          <div class="perk">
            <b>Prêt en quelques secondes</b>
            <span>Deux modèles au choix, résultat immédiat</span>
          </div>
        </div>

        <div class="pricing">
          <div class="pricing-head">
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

        <SiteFooter />
      </section>

      <aside class="composer">
        <span class="composer-title">Quel modèle souhaites-tu utiliser ?</span>

        <div class="presets">
          <button
            v-for="m in modes" :key="m.id" type="button"
            class="preset" :class="{ on: chosen === m.id }"
            @click="choose(m.id)"
          >
            {{ m.label }}
          </button>
        </div>

        <div class="actions">
          <button class="go" :disabled="!canGenerate
