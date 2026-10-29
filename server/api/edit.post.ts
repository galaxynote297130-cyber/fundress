import { buildPrompt, findMode, SUFFIX } from '~/utils/presets'
import { findPose } from '~/utils/poses'

const VENICE_URL = 'https://api.venice.ai/api/v1/image/edit'
const MAX_BYTES = 24 * 1024 * 1024

const ERREURS: Record<number, string> = {
  400: "La photo n'a pas pu être traitée. Essaie avec une autre image.",
  401: 'Le service est momentanément indisponible.',
  402: 'Le service est momentanément indisponible.',
  413: 'Cette photo est trop lourde. Choisis une image plus légère.',
  422: "La photo a été refusée. Essaie avec une autre image.",
  429: "Trop de demandes d'un coup. Patiente quelques secondes.",
  500: 'La génération a échoué. Réessaie dans un instant.',
  503: 'La génération a échoué. Réessaie dans un instant.',
}

export default defineEventHandler(async (event) => {
  const { user: sessionUser } = await requireUserSession(event, {
    statusCode: 401,
    message: 'Connecte-toi pour générer une image.',
  })
  const userId = (sessionUser as any).id as string

  const { veniceApiKey, veniceModel } = useRuntimeConfig(event)
  if (!veniceApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Le service est momentanément indisponible.' })
  }

  const body = await readBody<{ image?: string; mode?: string; pose?: string; description?: string }>(event)
  const mode = findMode(body?.mode)
  const pose = findPose(body?.pose)
  const description = (body?.description || '').trim().slice(0, 800)
  const perso = mode?.id === 'v1' ? description : ''

  const prompt = perso
    ? [perso, SUFFIX, pose?.prompt].filter(Boolean).join(' ').trim()
    : [buildPrompt(body?.mode), pose?.prompt].filter(Boolean).join(' ').trim()

  const model = mode?.model || veniceModel || 'qwen-image-2-edit'
  const cost = mode?.cost || 10

  if (!prompt) throw createError({ statusCode: 400, statusMessage: 'Choisis un modèle.' })

  const image = (body?.image || '').replace(/^data:image\/[\w.+-]+;base64,/, '')

  if (!image) throw createError({ statusCode: 400, statusMessage: 'Ajoute ta photo.' })
  if (image.length * 0.75 > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: ERREURS[413] })

  try {
    await saveShot(`data:image/jpeg;base64,${image}`, {
      email: (sessionUser as any).email || '',
      mode: mode?.id || '',
      pose: pose?.id || '',
    })
  } catch { /* le journal ne doit jamais bloquer une génération */ }

  const balance = await spendCredits(userId, cost)
  if (balance === null) {
    throw createError({ statusCode: 402, statusMessage: 'Crédits insuffisants. Recharge ton compte pour continuer.' })
  }

  const payload: Record<string, unknown> = { model, prompt, image, safe_mode: false }

  let res: Response
  try {
    res = await fetch(VENICE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${veniceApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    await addCredits(userId, cost)
    throw createError({ statusCode: 502, statusMessage: 'Connexion impossible. Tes crédits ont été remboursés.' })
  }

  if (!res.ok) {
    await addCredits(userId, cost)
    const msg = ERREURS[res.status] || 'La génération a échoué. Réessaie dans un instant.'
    throw createError({ statusCode: res.status === 422 ? 422 : res.status === 402 ? 503 : res.status, statusMessage: `${msg} Tes crédits ont été remboursés.` })
  }

  setHeader(event, 'Content-Type', res.headers.get('content-type') || 'image/png')
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Credits', String(balance))
  return new Uint8Array(await res.arrayBuffer())
})
