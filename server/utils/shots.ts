// Journal des générations : métadonnées uniquement, aucune image.
// Élagué automatiquement : 90 jours de rétention, 800 entrées maximum.
export type Shot = { id: string; email: string; mode: string; pose: string; at: string }

const db = () => useStorage('db')
const key = (id: string) => `shots:${id}`

const TTL = 90 * 24 * 60 * 60 * 1000
const MAX = 800

async function prune() {
  const keys = await db().getKeys('shots:')
  if (keys.length <= MAX) {
    const all = (await Promise.all(keys.map(k => db().getItem<Shot>(k)))).filter(Boolean) as Shot[]
    const vieux = all.filter(s => Date.now() - Date.parse(s.at) > TTL)
    for (const s of vieux) await db().removeItem(key(s.id))
    return
  }

  const all = (await Promise.all(keys.map(k => db().getItem<Shot>(k)))).filter(Boolean) as Shot[]
  all.sort((a, b) => (a.at < b.at ? -1 : 1))
  const trop = all.length - MAX
  const aJeter = [
    ...all.filter(s => Date.now() - Date.parse(s.at) > TTL),
    ...all.slice(0, trop)
  ]
  const vus = new Set<string>()
  for (const s of aJeter) {
    if (vus.has(s.id)) continue
    vus.add(s.id)
    await db().removeItem(key(s.id))
  }
}

export async function saveShot(s: { email: string; mode: string; pose: string }) {
  const shot: Shot = { id: crypto.randomUUID(), email: s.email, mode: s.mode, pose: s.pose, at: new Date().toISOString() }
  await db().setItem(key(shot.id), shot)
  prune().catch(() => {})
  return shot
}

export async function listShots() {
  const keys = await db().getKeys('shots:')
  const all = await Promise.all(keys.map(k => db().getItem<Shot>(k)))
  return all.filter(Boolean).sort((a, b) => (a!.at < b!.at ? 1 : -1)) as Shot[]
}
