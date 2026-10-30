import type { H3Event } from 'h3'

/**
 * Accès unique au KV fundress-db.
 * Tolère les différentes formes de binding pour ne pas casser au déploiement.
 */
export function getKV(event: H3Event): any {
  const env = (event.context.cloudflare as any)?.env
  if (!env) return null
  return env['fundress-db'] || env.FUNDRESS_DB || env.KV || null
}
