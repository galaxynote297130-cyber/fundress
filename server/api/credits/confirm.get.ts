// Au retour de Stripe : vérifie le paiement et crédite le compte (sans attendre le webhook).
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = String(getQuery(event).session_id || '')
  if (!id.startsWith('cs_')) throw createError({ statusCode: 400, statusMessage: 'Paiement introuvable.' })

  const session = await getCheckout(id)
  if (session.metadata?.userId !== (user as any).id) {
    throw createError({ statusCode: 403, statusMessage: 'Ce paiement ne correspond pas à ton compte.' })
  }
  const r = await creditFromSession(session)
  const fresh = await getUser((user as any).id)
  return { paid: session.payment_status === 'paid', credits: Number(session.metadata?.credits || 0), balance: fresh?.credits ?? 0, newlyCredited: r.credited }
})
