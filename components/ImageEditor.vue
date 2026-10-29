<script setup lang="ts">
// build
import { ref, computed, onMounted } from 'vue'
import { MODES, DEFAULT_MODE } from '~/utils/presets'
import { POSES, findPose } from '~/utils/poses'

const props = defineProps<{ variant?: 'edition' | 'pose'; poseId?: string }>()
const estPose = computed(() => props.variant === 'pose')

const { me, authOpen, buyOpen, refresh, confirmPayment, setCredits } = useAccount()
const route = useRoute()
const MAX_SIDE = 2048
type Slot = { url: string; data: string; name: string }
type Result = { url: string; label: string }

const main = ref<Slot | null>(null)
const over = ref(false)
const busy = ref(false)
const message = ref<{ text: string; error?: boolean } | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const results = ref<Result[]>([])
const current = ref(-1)
const shown = computed(() => results.value[current.value] || null)
const chosen = ref(DEFAULT_MODE)
const pose = ref(
  findPose(props.poseId || String(route.query.pose || '')) || (props.variant === 'pose' ? POSES[0] : null)
)

const cout = computed(() => MODES.find(m => m.id === chosen.value)?.cost || 10)
const canGenerate = computed(() => !!main.value && !!chosen.value && !busy.value)
const goLabel = computed(() => {
  if (busy.value) return 'En cours…'
  if (!main.value) return 'Ajoute une photo'
  if (estPose.value && !pose.value) return 'Choisis une scène'
  if (!me.value) return 'Créer un compte · 1 image offerte'
  if (me.value.credits < cout.value) return 'Crédits insuffisants'
  return 'Créer'
})

let t: ReturnType<typeof setTimeout> | undefined
function notify(text: string, error = false) {
  message.value = { text, error }
  clearTimeout(t)
  t = setTimeout(() => (message.value = null), error ? 5000 : 2500)
}

async function readImage(f: File | Blob, name = 'image'): Promise<Slot> {
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
    const slot = await readImage(f, f.name)
    main.value = slot
    if (!me.value) {
      notify('Photo ajoutée. Crée un compte pour ta génération offerte.')
      authOpen.value = 'register'
    }
  } catch (e: any) { notify(e?.message || 'Impossible de lire cette image.', true) }
}

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  setPhoto(input.files?.[0]); input.value = ''
}
function onDrop(e: DragEvent) {
  over.value = false
  setPhoto(e.dataTransfer?.files?.[0])
}

async function generate() {
  if (busy.value || !main.value) return
  if (estPose.value && !pose.value) return notify('Choisis une scène.', true)
  if (!me.value) { authOpen.value = 'register'; return }
  if (me.value.credits < cout.value) { buyOpen.value = true; return }
  busy.value = true
  try {
    const res = await fetch('/api/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: main.value.data, mode: chosen.value, pose: pose.value?.id }),
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
    const label = pose.value?.label || MODES.find(m => m.id === chosen.value)?.label || 'résultat'
    results.value.push({ url: URL.createObjectURL(blob), label })
    if (results.value.length > 20) URL.revokeObjectURL(results.value.shift()!.url)
    current.value = results.value.length - 1
    notify('Image générée')
  } catch (e: any) { notify(e?.message || 'La génération a échoué.', true) }
  finally { busy.value = false }
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

onMounted(async () => {
  await refresh().catch((e: any) => notify(`Compte indisponible : ${e?.message || 'erreur serveur'}`, true))
  const q = new URLSearchParams(location.search)
  if (q.get('paiement') === 'ok' && q.get('session_id')) {
    try {
      const r = await confirmPayment(q.get('session_id')!)
      notify(r.paid ? `Paiement reçu : +${r.credits} crédits` : 'Paiement en attente de confirmation.')
    } catch (e: any) { notify(e.message, true) }
  } else if (q.get('paiement') === 'annule') {
    notify('Paiement annulé. Aucun montant n’a été débité.')
  } else if (q.get('erreur') === 'google') {
    notify('La connexion avec Google a échoué. Réessaie ou utilise ton email.', true)
  }
  if (q.toString()) history.replaceState(null, '', location.pathname)
})
</script>

<template>
  <div class="app">
    <SiteTop />
    <main class="wrap">
      <RubriquesTabs :active="estPose ? 'pose' : 'edition'" />

      <div class="cols">
        <BeforeAfterStrip compact />

        <section class="stage" @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="onDrop">
          <template v-if="!main">
            <div class="dropzone">
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.4" class="ico"><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M4 17l5-5 4 4 3-2.5 4 3.5" /></svg>
              <button class="upload" type="button" @click="fileInput?.click()">Télécharger une image</button>
              <p>JPG, PNG ou WebP</p>
              <input ref="fileInput" type="file" accept="image/*" class="sr" @change="onPick">
            </div>
          </template>

          <template v-else>
            <div class="paire">
              <div class="cadre">
                <img :src="main.url" alt="Ta photo">
                <button class="trash" type="button" title="Retirer la photo" @click="main = null">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
                </button>
              </div>
              <div class="cadre result" :class="{ done: shown }">
                <img v-if="shown" :src="shown.url" alt="Résultat">
                <span v-else class="attente">Résultat</span>
                <button v-if="shown && !busy" class="dl" type="button" @click="save">Télécharger</button>
                <div v-if="busy" class="busy"><span><i class="dot" />En cours…</span></div>
              </div>
            </div>
          </template>
        </section>

        <EditorPanel
          :variant="estPose ? 'pose' : 'edition'"
          :chosen="chosen"
          :cost="cout"
          :can-generate="canGenerate"
          :go-label="goLabel"
          :pose-id="pose?.id || null"
          @choose="chosen = $event"
          @choose-pose="id => (pose = findPose(id))"
          @generate="generate"
        />
      </div>

      <div class="privacy">
        <span>Paiement sécurisé par Stripe</span><span>Aucun abonnement</span><span>Photo supprimée après usage</span>
      </div>
      <SiteFooter />
    </main>
    <AuthModal />
    <CreditsModal />
    <div v-if="message" class="toast" :class="{ error: message.error }" role="status">{{ message.text }}</div>
  </div>
</template>

<style scoped>
.app { min-height: 100dvh; display: flex; flex-direction: column; padding-top: env(safe-area-inset-top, 0px); }
.wrap { flex: 1; display: flex; flex-direction: column; gap: 12px; max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 max(14px, env(safe-area-inset-right, 0px)) calc(24px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left, 0px)); }
.cols { display: flex; flex-direction: column; gap: 12px; }
.stage { background: var(--surface); border: 1px solid var(--line); border-radius
