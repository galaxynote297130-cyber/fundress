import { ref, computed } from 'vue'

export function useEditor() {
  const MAX_SIDE = 2048
  type Slot = { url: string; data: string; name: string }
  type Result = { url: string; label: string }

  const main = ref<Slot | null>(null)
  const busy = ref(false)
  const message = ref<{ text: string; error?: boolean } | null>(null)
  const results = ref<Result[]>([])
  const current = ref(-1)
  const shown = computed(() => results.value[current.value] || null)
  const { me, authOpen, buyOpen, refresh, confirmPayment, setCredits } = useAccount()
  const { put } = useGallery()

  let t: any
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
    c.width = Math.round(bmp.width * k)
    c.height = Math.round(bmp.height * k)
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
    const data = c.toDataURL('image/jpeg', 0.92)
    return { url: data, data, name }
  }

  async function setPhoto(f?: File | null) {
    if (!f) return
    if (!f.type.startsWith('image/')) return notify("Ce fichier n'est pas une image.", true)
    try {
      main.value = await readImage(f, f.name)
      if (!me.value) {
        notify('Photo ajoutée. Crée un compte pour ta génération offerte.')
        authOpen.value = 'register'
      }
    } catch (e: any) {
      notify(e?.message || 'Impossible de lire cette image.', true)
    }
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
    a.href = shown.value.url
    a.download = file.name
    a.click()
  }

  async function runGenerate(o: { mode: string; pose?: string; description?: string; cout: number; label?: string }) {
    if (busy.value || !main.value) return
    if (!me.value) { authOpen.value = 'register'; return }
    if (me.value.credits < o.cout) { buyOpen.value = true; return }
    busy.value = true
    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: main.value.data,
          mode: o.mode,
          pose: o.pose,
          description: o.description || ''
        })
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
      results.value.push({ url: URL.createObjectURL(blob), label: o.label || 'résultat' })
      if (results.value.length > 20) URL.revokeObjectURL(results.value.shift()!.url)
      current.value = results.value.length - 1
      put({ id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`, kind: 'image', label: o.label || 'image', cout: o.cout, blob }).catch(() => {})
      notify('Image générée · ajoutée à la galerie')
    } catch (e: any) {
      notify(e?.message || 'La génération a échoué.', true)
    } finally {
      busy.value = false
    }
  }

  async function init() {
    await refresh().catch((e: any) => notify(`Compte indisponible : ${e?.message || 'erreur serveur'}`, true))
    const q = new URLSearchParams(location.search)
    if (q.get('paiement') === 'ok' && q.get('session_id')) {
      try {
        const r = await confirmPayment(q.get('session_id')!)
        notify(
          r.paid ? `Paiement reçu : +${r.credits} crédits` : 'Paiement en cours de vérification…',
          !r.paid
        )
        if (r.paid) history.replaceState({}, '', '/edition')
      } catch (e: any) {
        notify(`Vérification du paiement impossible : ${e?.message || 'erreur serveur'}`, true)
      }
    }
  }

  return { me, main, busy, message, results, current, shown, notify, setPhoto, save, runGenerate, init }
}
