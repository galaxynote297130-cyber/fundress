// Compte connecté + solde de crédits (null si personne n'est connecté)
export default defineEventHandler(async (event) => {
  let session
  try {
    session = await getUserSession(event)
  } catch {
    // Cause la plus fréquente : la phrase secrète des sessions manque ou est trop courte
    throw createError({
      statusCode: 500,
      statusMessage: 'Connexion non configurée : vérifie NUXT_SESSION_PASSWORD dans Cloudflare (32 caractères minimum), puis relance le déploiement.',
    })
  }

  const id = (session.user as any)?.id
  if (!id) return { user: null, packs: PACKS, costs: COSTS }

  let user
  try {
    user = await getUser(id)
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Stockage des comptes indisponible : vérifie le stockage KV « DB » dans Cloudflare.' })
  }
  if (!user) {
    await clearUserSession(event)
    return { user: null, packs: PACKS, costs: COSTS }
  }
  return { user: publicUser(user), packs: PACKS, costs: COSTS }
})
