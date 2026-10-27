// Webhook Stripe : crédite le compte même si l'utilisateur ferme la page après avoir payé.
// À déclarer dans Stripe (Développeurs > Webhooks) : https://ton-domaine/api/stripe/webhook
// Événement : checkout.session.completed
export default defineEventHandler(async (event) => {
  const { stripeWebhookSecret } = useRuntimeConfig(event)
  if (!stripeWebhookSecret) throw createError({ statusCode: 500, statusMessage: 'NUXT_STRIPE_WEBHOOK_SECRET manquant.' })

  const payload = (await readRawBody(event, 'utf8')) || ''
  const sig = getHeader(event, 'stripe-signature') || ''
  if (!(await verifyStripeSignature(payload, sig, stripeWebhookSecret))) {
    throw createError({ statusCode: 400, statusMessage: 'Signature invalide.' })
  }

  const evt = JSON.parse(payload)
  if (evt.type === 'checkout.session.completed' || evt.type === 'checkout.session.async_payment_succeeded') {
    await creditFromSession(evt.data.object)
  }
  return { received: true }
})
