const API = 'https://api.nowpayments.io/v1/invoice'

function sortKeys(v: any): any {
  if (Array.isArray(v)) return v.map(sortKeys)
  if (v && typeof v === 'object') {
    return Object.keys(v).sort().reduce((a: any, k) => { a[k] = sortKeys(v[k]); return a }, {})
  }
  return v
}

export async function createCryptoInvoice(o: { origin: string; userId: string; credits: number; amountEur: number }) {
  const key = useRuntimeConfig().nowpaymentsApiKey
  if (!key) throw createError({ statusCode: 500, statusMessage: 'Paiement crypto non configuré.' })

  const res = await $fetch<any>(API, {
    method: 'POST',
    headers: { 'x-api-key': key, 'content-type': 'application/json' },
    body: {
      price_amount: o.amountEur,
      price_currency: 'eur',
      order_id: `${o.userId}:${o.credits}`,
      order_description: `${o.credits} crédits Fundress`,
      ipn_callback_url: `${o.origin}/api/crypto/ipn`,
      success_url: `${o.origin}/credits?crypto=ok`,
      cancel_url: `${o.origin}/credits?crypto=non`,
      is_fixed_rate: true
    }
  }).catch(() => null)

  if (!res?.invoice_url) {
    throw createError({ statusCode: 502, statusMessage: 'Le paiement crypto est momentanément indisponible.' })
  }
  return res.invoice_url as string
}

export async function verifyIpn(raw: string, sig: string, secret: string) {
  const sorted = JSON.stringify(sortKeys(JSON.parse(raw)))
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(sorted))
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
  return hex === sig
}
