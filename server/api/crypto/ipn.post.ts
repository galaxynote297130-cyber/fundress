// Notification de paiement crypto : signature vérifiée, crédit unique
export default defineEventHandler(async (event) => {
  const secret = useRuntimeConfig().nowpaymentsIpnSecret
  const raw = (await readRawBody(event)) || ''
  const sig = getHeader(event, 'x-nowpayments-sig') || ''

  if (!secret || !sig) throw createError({ statusCode: 401, statusMessage: 'Signature absente.' })
  if (!(await verifyIpn(raw, sig, secret).catch(() => false))) {
    throw createError({ statusCode: 401, statusMessage: 'Signature invalide.' })
  }

  const b = JSON.parse(raw)
  const statut = String(b?.payment_status || '')
  if (statut !== 'finished' && statut !== 'confirmed') return { ok: true }

  const [userId, credits] = String(b?.order_id || '').split(':')
  const n = Number(credits)
  if (!userId || !n) return { ok: true }

  await creditPaymentOnce(`nowpay:${b.payment_id}`, userId, n)
  return { ok: true }
})
