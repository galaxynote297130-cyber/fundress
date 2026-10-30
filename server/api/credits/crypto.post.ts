// Crée une facture crypto pour le pack choisi
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, { statusCode: 401, message: 'Connecte-toi pour acheter des crédits.' })
  const { pack: packId } = await readBody<{ pack?: string }>(event)
  const pack = PACKS.find(p => p.id === packId)
  if (!pack) throw createError({ statusCode: 400, statusMessage: 'Pack inconnu.' })

  const origin = getRequestURL(event).origin
  const url = await createCryptoInvoice({
    origin,
    userId: (user as any).id,
    credits: pack.credits,
    amountEur: pack.price / 100
  })
  return { url }
})
