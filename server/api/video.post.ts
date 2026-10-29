import { spendCredits } from '../../server/utils/store'
import { findPreset } from '~/utils/videoPresets'

const MODEL = 'wan-3-0-image-to-video'

export default defineEventHandler(async (event) => {
  const user = await requireUserSession(event)
  const body = await readBody<{ image: string; duration: number; ratio?: string; qualite?: string; preset?: string }>(event)
  if (!body?.image) throw createError({ statusCode: 400, statusMessage: 'Photo manquante' })

  const preset = findPreset(body.preset)
  if (!preset) throw createError({ statusCode: 400, statusMessage: 'Choisis un preset.' })

  const duree = body.duration === 10 ? '10s' : '5s'
  const ratio = body.ratio === '16:9' ? '16:9' : '9:16'
  const qualite = ['480p', '720p', '1080p'].includes(body.qualite || '') ? body.qualite! : '720p'
  const key = useRuntimeConfig().veniceApiKey

  let res: any
  try {
    res = await $fetch<any>('https://api.venice.ai/api/v1/video/queue', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: {
        model: MODEL,
        prompt: preset.prompt,
        duration: duree,
        resolution: qualite,
        aspect_ratio: ratio,
        image_url: body.image
      }
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Le service vidéo ne répond pas. Aucun crédit débité.' })
  }

  if (!res?.queue_id) {
    throw createError({ statusCode: 502, statusMessage: 'La vidéo n’a pas pu être lancée. Aucun crédit débité.' })
  }

  const balance = await spendCredits(user.user.id, 20)
  if (balance === null) {
    throw createError({ statusCode: 402, statusMessage: 'Crédits insuffisants. Recharge ton compte pour continuer.' })
  }

  return { id: res.queue_id, download: res.download_url || '', restant: balance }
})
