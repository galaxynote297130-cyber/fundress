// Appels Stripe sans dépendance (API REST), compatibles Node et Cloudflare.

function form(obj: Record<string, string | number>) {
  return new URLSearchParams(Object.entries(obj).map(([k, v]) => [k, String(v)])).toString()
}

async function stripe<T = any>(path: string, init: { method?: string; body?: Record<string, string | number> } = {}) {
  const { stripeSecretKey } = useRuntimeConfig()
  if (!stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: 'Paiement non configuré : ajoute NUXT_STRIPE_SECRET_KEY dans le fichier .env.' })
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: init.method || 'GET',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: init.body ? form(init.body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: `Stripe : ${data?.error?.message || 'erreur inconnue'}` })
  }
  return data as T
}

export async function createCheckout(opts: { origin: string; userId: string; email: string; pack: { id: string; credits: number; price: number; label: string } }) {
  return stripe<{ id: string; url: string }>('/checkout/sessions', {
    method: 'POST',
    body: {
      mode: 'payment',
      success_url: `${opts.origin}/?paiement=ok&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${opts.origin}/?paiement=annule`,
      customer_email: opts.email,
      client_reference_id: opts.userId,
      'line_items[0][quantity]': 1,
      'line_items[0][price_data][currency]': 'eur',
      'line_items[0][price_data][unit_amount]': opts.pack.price,
      'line_items[0][price_data][product_data][name]': `FUNDRESS · ${opts.pack.label}`,
      'metadata[userId]': opts.userId,
      'metadata[credits]': opts.pack.credits,
      'metadata[pack]': opts.pack.id,
    },
  })
}

export function getCheckout(id: string) {
  return stripe<any>(`/checkout/sessions/${encodeURIComponent(id)}`)
}

/** Crédite le compte si la session Stripe est payée (une seule fois par paiement). */
export async function creditFromSession(session: any) {
  if (session?.payment_status !== 'paid') return { credited: false, reason: 'unpaid' }
  const userId = session.metadata?.userId
  const credits = Number(session.metadata?.credits)
  if (!userId || !credits) return { credited: false, reason: 'metadata' }
  const credited = await creditPaymentOnce(session.id, userId, credits)
  return { credited, credits, userId }
}

/** Vérifie la signature d'un webhook Stripe (en-tête Stripe-Signature). */
export async function verifyStripeSignature(payload: string, header: string, secret: string, toleranceSec = 300) {
  const parts = Object.fromEntries(header.split(',').map(p => p.split('=') as [string, string]))
  const t = parts.t
  const sigs = header.split(',').filter(p => p.startsWith('v1=')).map(p => p.slice(3))
  if (!t || !sigs.length) return false
  if (Math.abs(Date.now() / 1000 - Number(t)) > toleranceSec) return false

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`))
  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
  return sigs.some(s => s.length === expected.length && timingSafe(s, expected))
}

function timingSafe(a: string, b: string) {
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}
