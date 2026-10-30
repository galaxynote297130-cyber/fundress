export default defineEventHandler(async (event) => {
  const attendu = (process.env.NUXT_ADMIN_KEY || useRuntimeConfig(event).adminKey || '').trim()

  if (!attendu) {
    throw createError({ statusCode: 500, statusMessage: 'Journal non configuré.' })
  }

  const fourni = (getHeader(event, 'x-admin-key') || String(getQuery(event).key || '')).trim()

  if (fourni !== attendu) {
    throw createError({ statusCode: 401, statusMessage: 'Clé refusée.' })
  }

  const shots = await listShots()
  return { total: shots.length, shots: shots.slice(0, 300) }
})
