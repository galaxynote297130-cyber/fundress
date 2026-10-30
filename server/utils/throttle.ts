const db = () => useStorage('db')

/**
 * Compteur à fenêtre glissante par tranche de temps.
 * Renvoie false quand le plafond est atteint.
 */
export async function throttle(key: string, max: number, windowSec: number) {
  const bucket = Math.floor(Date.now() / (windowSec * 1000))
  const k = `thr:${key}:${bucket}`
  const count = (await db().getItem<number>(k)) || 0
  if (count >= max) return false
  await db().setItem(k, count + 1)
  return true
}

export function ipDe(event: any) {
  return getRequestIP(event, { xForwardedFor: true }) || 'anon'
}
