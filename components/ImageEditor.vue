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

function clear() {
  main.value = null
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
  await refresh().catch((
