const LIMIT = 10
const ROUTES = ['/api/edit', '/api/video']

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST' || !ROUTES.includes(event.path)) return

  const session = await getUserSession(event).catch(() => null)
  const email = (session?.user as any)?.email as string | undefined
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'anon'
  const id = email || ip

  const minute = Math.floor(Date.now() / 60000)
  const key = `rl:${id}:${minute}`

  const db = useStorage('db')
  const count = (await db.getItem<number>(key)) || 0
  if (count >= LIMIT) {
    throw createError({ statusCode: 429, statusMessage: 'Trop de générations, réessaie dans une minute' })
  }
  await db.setItem(key, count + 1)
})
