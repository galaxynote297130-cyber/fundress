import { addCredits } from '../../../server/utils/store'

const MODEL = 'wan-3-0-image-to-video'
const COUT = 20

export default defineEventHandler(async (event) => {
  const user = await requireUserSession(event)
  const body = await readBody<{ id: string; download?: string }>(event)
  if (!body?.id) throw createError({ statusCode: 400, statusMessage: 'Identifiant manquant' })

  const res = await fetch('https://api.venice.ai/api/v1/video/retrieve', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${useRuntimeConfig().veniceApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: MODEL, queue_id: body.id })
  })

  const type = res.headers.get('content-type') || ''
  if (type.includes('video/')) return { status: 'done', url: body.download || '' }
  if (!type.includes('json')) return { status: 'processing' }

  const json = await res.json().catch(() => ({} as any))
  const raw = String(json?.status || '')

  if (raw === 'COMPLETED') return { status: 'done', url: body.download || json.download_url || '' }
  if (raw === 'PROCESSING' || raw === 'QUEUED') return { status: 'processing' }

  const restant = await addCredits(user.user.id, COUT)
  return { status: 'failed', refunded: true, restant, message: json?.error || raw }
})
