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
  if (estPose.value && !pose.value) return 'Choisis une scène'
  if (!me.value) return 'Créer un compte · 1 image offerte'
  if (main.value && me.value.credits < cout.value) return 'Crédits insuffisants'
  return 'Générer'
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
  a.href = shown.value.url;
