<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MODES, DEFAULT_MODE } from '~/utils/presets'

const { me, authOpen, buyOpen, refresh, confirmPayment, setCredits } = useAccount()

const MAX_SIDE = 2048
type Slot = { url: string; data: string; name: string } | null
const main = ref<Slot>(null)
const over = ref(false)
const busy = ref(false)
const message = ref<{ text: string; error?: boolean } | null>(null)
const ageOk = ref(true)

type Result = { url: string; label: string }
const results = ref<Result[]>([])
const current = ref(-1)
const shown = computed(() => results.value[current.value] || null)

const modes = MODES
const chosen = ref(DEFAULT_MODE)

function choose(id: string) {
  chosen.value = id
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
        <div class="hero">
          <h1>Déshabille n'importe quelle photo <em>en un clic.</em></h1>
        </div>

        <BeforeAfterStrip />

        <div class="drops">
          <label
            class="drop" :class="{ filled: main, over }"
            @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="onDrop"
          >
            <input type="file" accept="image/*" class="sr" @change="onPick">
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

        <div v-if="shown && !busy" class="after-bar">
          <button class="ghost" @click="reuse">Retoucher ce résultat</button>
          <button class="ghost" @click="save">Enregistrer</button>
          <button class="ghost" @click="generate">Régénérer</button>
        </div>

        <div v-if="results.length > 1" class="strip">
          <button
            v-for="(r, i) in results" :key="r.url" class="thumb" :class="{ on: i === current }"
            :title="r.label" @click="current = i"
          >
            <img :src="r.url" alt=""><small>{{ r.label }}</small>
          </button>
        </div>

        <div class="privacy">
          <span>Photo non conservée après génération</span>
          <span>Transmise de façon anonymisée</span>
          <span>Sans watermark</span>
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
          <button class="go" :disabled="!canGenerate" @click="generate()">
            {{ goLabel }}
          </button>
        </div>
      </aside>
    </main>

    <AuthModal />
    <CreditsModal />
    <div v-if="message" class="toast" :class="{ error: message.error }" role="status">{{ message.text }}</div>
  </div>
</template>

<style scoped>
.app { min-height: 100dvh; display: flex; flex-direction: column; padding-top: env(safe-area-inset-top, 0px); }
.top { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px max(14px, env(safe-area-inset-right, 0px)) 8px max(14px, env(safe-area-inset-left, 0px)); }
.logo { font-family: var(--f-display); font-weight: 800; font-size: 1.2rem; letter-spacing: -.02em; display: flex; align-items: center; gap: 8px; }
.logo i { width: 20px; height: 20px; border-radius: 6px; background: conic-gradient(from 200deg, var(--mask), var(--accent), var(--mask)); }
.kicker { font-family: var(--f-body); font-size: .62rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: 2px 7px; }

.gate { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 10px max(14px, env(safe-area-inset-right)) 10px max(14px, env(safe-area-inset-left)); background: var(--fg); color: var(--bg); font-size: .82rem; }
.gate b { background: var(--accent); color: var(--accent-ink); border-radius: 6px; padding: 2px 7px; margin-right: 4px; font-size: .74rem; }
.gate button { border: 0; border-radius: 99px; min-height: 32px; padding: 0 14px; background: var(--accent); color: var(--accent-ink); font-weight: 700; font-size: .82rem; }

.layout { flex: 1; display: flex; flex-direction: column; gap: 14px; padding: 0 max(14px, env(safe-area-inset-right, 0px)) calc(210px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left, 0px)); }
.left { display: flex; flex-direction: column; gap: 14px; min-width: 0; }

.hero { display: flex; flex-direction: column; gap: 8px; }
.hero h1 { font-family: var(--f-display); font-size: clamp(1.4rem, 5vw, 2rem); line-height: 1.08; letter-spacing: -.03em; margin: 0; }
.hero h1 em { font-style: normal; color: var(--accent); }

.drops { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.drop { position: relative; flex: 1; aspect-ratio: 3 / 4; border: 2px dashed var(--line); border-radius: var(--r); background: var(--surface); display: grid; place-items: center; overflow: hidden; cursor: pointer; transition: border-color .15s, background .15s; }
.drop:hover, .drop.over { border-color: var(--mask); background: color-mix(in srgb, var(--mask) 8%, var(--surface)); }
.drop:focus-within { outline: 2px solid var(--mask); outline-offset: 2px; }
.drop.filled { border-style: solid; border-color: var(--line); background: var(--sunk); }
.drop.out, .drop.out:hover { cursor: default; border-style: solid; border-color: var(--line); background: var(--sunk); }
.drop.out.done { border-color: var(--accent); }
.drop.out .badge { background: var(--surface); color: var(--muted); }
.after-bar { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.drop img { width: 100%; height: 100%; object-fit: cover; }
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; padding: 12px; }
.badge { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; font-family: var(--f-display); font-weight: 800; font-size: 1.3rem; background: var(--accent); color: var(--accent-ink); }
.empty strong { font-family: var(--f-display); font-size: 1.05rem; line-height: 1.2; margin-top: 4px; }
.empty small { color: var(--muted); font-size: .8rem; line-height: 1.3; }
.tag { position: absolute; left: 8px; bottom: 8px; right: 8px; background: rgba(10, 12, 18, .7); color: #fff; font-size: .75rem; padding: 4px 8px; border-radius: 8px; text-align: center; backdrop-filter: blur(4px); }

.busy { position: absolute; inset: 0; display: grid; place-items: center; background: color-mix(in srgb, var(--sunk) 55%, transparent); backdrop-filter: blur(3px); }
.busy span { background: var(--surface); border: 1px solid var(--line); padding: 10px 16px; border-radius: 99px; display: flex; gap: 8px; align-items: center; font-weight: 500; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); animation: pulse 1s infinite; }
@keyframes pulse { 50% { opacity: .25; } }

.strip { display: flex; gap: 8px; overflow-x: auto; scroll-snap-type: x mandatory; }
.thumb { flex: 0 0 auto; width: 84px; border: 0; padding: 0; background: none; text-align: left; scroll-snap-align: start; display: flex; flex-direction: column; gap: 3px; }
.thumb img { width: 84px; height: 84px; object-fit: cover; border-radius: 8px; border: 2px solid transparent; }
.thumb.on img { border-color: var(--accent); }
.thumb small { font-size: .7rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.privacy { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: .74rem; color: var(--muted); }
.privacy span::before { content: "✓"; color: #22c55e; font-weight: 800; margin-right: 5px; }

.ghost { min-height: 44px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); font-weight: 500; font-size: .9rem; }

.composer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; background: var(--surface); border-top: 1px solid var(--line); box-shadow: 0 -6px 24px rgba(0, 0, 0, .12); display: flex; flex-direction: column; gap: 10px; padding: 12px max(14px, env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left, 0px)); }
.composer-title { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 600; }
.presets { display: flex; flex-wrap: wrap; gap: 6px; }
.preset { flex: 1 1 auto; border: 1px solid var(--line); background: var(--bg); color: var(--fg); border-radius: 99px; min-height: 42px; padding: 0 12px; font-size: .85rem; font-weight: 500; }
.preset.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 700; }

.actions { display: flex; gap: 8px; align-items: center; }
.go { flex: 1; min-height: 48px; border: 0; border-radius: 12px; background: var(--accent); color: var(--accent-ink); font-weight: 700; font-size: 1.05rem; }

.toast { position: fixed; left: 50%; transform: translateX(-50%); bottom: calc(230px + env(safe-area-inset-bottom, 0px)); background: var(--fg); color: var(--bg); padding: 10px 16px; border-radius: 12px; z-index: 20; max-width: calc(100% - 28px); text-align: center; font-weight: 500; }
.toast.error { background: var(--danger); color: #fff; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); opacity: 0; }

@media (min-width: 900px) {
  .layout { flex-direction: row; align-items: flex-start; max-width: 1200px; width: 100%; margin: 0 auto; padding-bottom: 24px; }
  .left { flex: 1; }
  .drop { aspect-ratio: 4 / 3; }
  .composer { position: sticky; top: 12px; width: 340px; border: 1px solid var(--line); border-radius: var(--r); box-shadow: none; padding: 14px; }
  .toast { bottom: 24px; }
}
</style>
