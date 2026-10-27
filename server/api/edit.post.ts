// Génération : vérifie la connexion, débite les crédits, appelle Venice avec la clé cachée,
// et rembourse automatiquement si Venice échoue.

const VENICE_URL = 'https://api.venice.ai/api/v1/image/edit'
const MAX_BYTES = 24 * 1024 * 1024 // Venice refuse au-delà de 25 Mo

const ERREURS: Record<number, string> = {
  400: 'Requête refusée par Venice (paramètres invalides).',
  401: 'Le service de génération est mal configuré (clé Venice invalide).',
  402: 'Le service de génération est momentanément indisponible (solde Venice épuisé).',
  413: 'Image trop lourde (25 Mo maximum).',
  422: 'Cette demande a été refusée par les règles de contenu.',
  429: 'Trop de demandes. Réessaie dans quelques secondes.',
  500: 'La génération a échoué. Réessaie.',
  503: 'Le service est saturé. Réessaie dans un moment.',
}

export default defineEventHandler(async (event) => {
  const { user: sessionUser } = await requireUserSession(event, {
    statusCode: 401,
    message: 'Connecte-toi pour générer une image.',
  })
  const userId = (sessionUser as any).id as string

  const { veniceApiKey, veniceModel } = useRuntimeConfig(event)
  if (!veniceApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Clé API absente : ajoute NUXT_VENICE_API_KEY dans le fichier .env puis relance le serveur.' })
  }

  const body = await readBody<{ image?: string; prompt?: string; preset?: string; resolution?: string }>(event)
  let prompt = (body?.prompt || '').trim()
  let model = veniceModel || DEFAULT_MODEL
  let preset: Preset | undefined

  // Bouton en un clic : le serveur choisit le prompt, le modèle et le coût
  if (body?.preset) {
    preset = PRESETS[body.preset]
    if (!preset) throw createError({ statusCode: 400, statusMessage: 'Préréglage inconnu.' })
    prompt = prompt ? `${preset.prompt} Additional details: ${prompt}` : preset.prompt
    if (preset.model) model = preset.model
  }
  const image = (body?.image || '').replace(/^data:image\/[\w+.-]+;base64,/, '')
  const resolution = body?.resolution === '2K' ? '2K' : '1K'
  const cost = creditsFor(preset, resolution)

  if (!prompt) throw createError({ statusCode: 400, statusMessage: 'Décris la modification souhaitée.' })
  if (prompt.length > 2500) throw createError({ statusCode: 400, statusMessage: 'Description trop longue.' })
  if (!image) throw createError({ statusCode: 400, statusMessage: 'Ajoute ta photo.' })
  if (image.length * 0.75 > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: ERREURS[413] })

  // 1. Débit des crédits avant l'appel
  const balance = await spendCredits(userId, cost)
  if (balance === null) {
    throw createError({ statusCode: 402, statusMessage: 'Crédits insuffisants. Recharge ton compte pour continuer.' })
  }

  // 2. Appel à Venice, remboursement en cas d'échec
  let res: Response
  try {
    res = await fetch(VENICE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${veniceApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, image, resolution, output_format: 'png', safe_mode: true }),
    })
  } catch {
    await addCredits(userId, cost)
    throw createError({ statusCode: 502, statusMessage: 'Impossible de joindre le service de génération. Tes crédits ont été remboursés.' })
  }

  if (!res.ok) {
    await addCredits(userId, cost)
    const msg = ERREURS[res.status] || `Erreur de génération (${res.status}).`
    throw createError({ statusCode: res.status === 402 ? 503 : res.status, statusMessage: `${msg} Tes crédits ont été remboursés.` })
  }

  setHeader(event, 'Content-Type', res.headers.get('content-type') || 'image/png')
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Credits', String(balance))
  return new Uint8Array(await res.arrayBuffer())
})
