export default defineEventHandler(async (event) => {
  const key = getHeader(event, 'x-admin-key') || String(getQuery(event).key || '')
  if (!key || key !== useRuntimeConfig().adminKey) {
    throw createError({ statusCode: 401, statusMessage: 'Clé invalide.' })
  }
  const shots = await listShots()
  return { total: shots.length, shots: shots.slice(0, 300) }
})
