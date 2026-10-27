// Crée une page de paiement Stripe pour le pack choisi
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, { statusCode: 401, message: 'Connecte-toi pour acheter des crédits.' })
  const { pack: packId } = await readBody<{ pack?: string }>(event)
  const pack = PACKS.find(p => p.id === packId)
  if (!pack) throw createError({ statusCode: 400, statusMessage: 'Pack inconnu.' })

  const origin = getRequestURL(event).origin
  const session = await createCheckout({ origin, userId: (user as any).id, email: (user as any).email, pack })
  return { url: session.url }
})
