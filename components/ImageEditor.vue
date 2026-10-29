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
.app{min-height:100dvh;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0)}
.wrap{flex:1;display:flex;flex-direction:column;gap:12px;max-width:1200px;width:100%;margin:0 auto;padding:0 max(14px,env(safe-area-inset-right,0)) calc(24px + env(safe-area-inset-bottom,0)) max(14px,env(safe-area-inset-left,0))}
.cols{display:flex;flex-direction:column;gap:12px}
.stage{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);min-height:260px;padding:12px;display:grid;place-items:center}
.dropzone{display:flex;flex-direction:column;align-items:center;gap:9px;text-align:center}
.ico{color:var(--muted);opacity:.7}
.upload{border:0;border-radius:99px;background:var(--accent);color:var(--accent-ink);font-weight:800;font-size:.82rem;padding:11px 20px}
.dropzone p{margin:0;font-size:.68rem;color:var(--muted)}
.paire{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}
.cadre{position:relative;aspect-ratio:3/4;border-radius:10px;overflow:hidden;background:var(--sunk);display:grid;place-items:center}
.cadre.result{border:1px solid var(--line)}
.cadre.result.done{border-color:var(--accent)}
.cadre img{width:100%;height:100%;object-fit:cover;object-position:center 20%}
.attente{font-size:.74rem;color:var(--muted)}
.trash{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;border:0;background:#e5484d;color:#fff;display:grid;place-items:center}
.dl{position:absolute;left:8px;right:8px;bottom:8px;min-height:36px;border:0;border-radius:9px;background:var(--accent);color:var(--accent-ink);font-weight:700;font-size:.78rem}
.busy{position:absolute;inset:0;display:grid;place-items:center;background:color-mix(in srgb,var(--sunk) 55%,transparent);backdrop-filter:blur(3px)}
.busy span{background:var(--surface);border:1px solid var(--line);padding:9px 14px;border-radius:99px;display:flex;gap:8px;align-items:center;font-size:.78rem}
.dot{width:10px;height:10px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite}
@keyframes pulse{50%{opacity:.25}}
.privacy{display:flex;flex-wrap:wrap;gap:6px;font-size:.72rem;color:var(--muted)}
.privacy span{display:inline-flex;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:99px;padding:5px 10px}
.privacy span::before{content:"✓";color:#22c55e;font-weight:800;margin-right:5px}
.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;background:var(--fg);color:var(--bg);padding:10px 16px;border-radius:12px;z-index:20;max-width:calc(100% - 28px);text-align:center;font-weight:500}
.toast.error{background:var(--danger);color:#fff}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);opacity:0}
@media(min-width:820px){.cols{display:grid;grid-template-columns:140px 1fr 210px;align-items:start}.stage{min-height:360px}}
</style>
