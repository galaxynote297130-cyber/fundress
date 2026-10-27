// Compte connecté + solde de crédits (null si personne n'est connecté)
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const id = (session.user as any)?.id
  if (!id) return { user: null, packs: PACKS, costs: COSTS }
  const user = await getUser(id)
  if (!user) {
    await clearUserSession(event)
    return { user: null, packs: PACKS, costs: COSTS }
  }
  return { user: publicUser(user), packs: PACKS, costs: COSTS }
})
