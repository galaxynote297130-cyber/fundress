export default defineEventHandler(async (event) => {
  const attendu = useRuntimeConfig(event).adminKey

  if (!attendu) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_ADMIN_KEY absente de l’environnement. Ajoute-la en Production puis relance un déploiement.'
    })
  }

  const fourni = getHeader(event, 'x-admin-key') || String(getQuery(event).key || '')

  if (fourni !== attendu) {
    throw createError({
      statusCode: 401,
      statusMessage: `Clé refusée (reçue : ${fourni.length} caractères, attendue : ${attendu.length}).`
    })
  }

  const shots = await listShots()
  return { total: shots.length, shots: shots.slice(0, 300) }
})
