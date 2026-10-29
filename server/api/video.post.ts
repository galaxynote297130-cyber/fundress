import { spendCredits } from '../../server/utils/store'

const MODEL = 'wan-3-0-image-to-video'
const MOVE_PROMPT: Record<string, string> = {
  lent: 'slow subtle camera drift, gentle natural breathing motion',
  zoom: 'slow cinematic push-in toward the subject',
  marche: 'the subject takes a few steps forward toward the camera'
}

export default defineEventHandler(async (event) => {
  const user = await requireUserSession(event)
  const body = await readBody<{ image: string; duration: number; move: string }>(event)
  if (!body?.image) throw createError({ statusCode: 400, statusMessage: 'Photo manquante' })

  await spendCredits(user.user.id, 20)

  const res = await $fetch<any>('https://api.venice.ai/api/v1/video/queue', {
    method: 'POST',
    headers: { Authorization: `Bearer ${useRuntimeConfig().veniceApiKey}` },
    body: {
      model: MODEL,
      prompt: `Animate this photo. ${MOVE_PROMPT[body.move] || MOVE_PROMPT.lent}. Keep the same woman, her face, her body, her clothes and the background perfectly consistent. No morphing, no warping, no extra limbs.`,
      duration: body.duration === 10 ? '10s' : '5s',
      resolution: '720p',
      image_url: body.image
    }
  })

  return { id: res.queue_id, download: res.download_url || '' }
})
