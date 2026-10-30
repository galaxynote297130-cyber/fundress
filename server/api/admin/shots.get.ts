export default defineEventHandler(async (event) => {
  const brut = process.env.NUXT_ADMIN_KEY
  const attendu = (brut || useRuntimeConfig(event).adminKey || '').trim()

  if (!attendu) {
    throw createError({
      statusCode: 500,
      statusMessage: `NUXT_ADMIN_KEY introuvable. brute=${brut === undefined ? 'absente' : 'présente'} config=${useRuntimeConfig(event).adminKey ? 'présente' : 'vide'}`
    })
  }

  const fourni = (getHeader(event, 'x-admin-key') || String(getQuery(event).key || '')).trim()

  if (fourni !== attendu) {
    throw createError({
      statusCode: 401,
      statusMessage: `Clé refusée (reçue : ${fourni.length} caractères, attendue : ${attendu.length}).`
    })
  }

  const shots = await listShots()
  return { total: shots.length, shots: shots.slice(0, 300) }
})
