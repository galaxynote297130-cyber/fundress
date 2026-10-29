import { addCredits } from '../../../server/utils/store'

export default defineEventHandler(async (event) => {
  const user = await requireUserSession(event)
  const body = await readBody<{ id?: string }>(event)

  if (body?.id) {
    try {
      await $fetch('https://api.venice.ai/api/v1/video/complete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${useRuntimeConfig().veniceApiKey}` },
        body: { model: 'wan-3-0-image-to-video', queue_id: body.id }
      })
    } catch { /* la vidéo est abandonnée de toute façon */ }
  }

  const restant = await addCredits(user.user.id, 20)
  return { restant }
})
