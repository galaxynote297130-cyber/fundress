// Journal des générations : métadonnées uniquement, aucune image.
export type Shot = { id: string; email: string; mode: string; pose: string; at: string }

const db = () => useStorage('db')
const key = (id: string) => `shots:${id}`

export async function saveShot(s: { email: string; mode: string; pose: string }) {
  const shot: Shot = { id: crypto.randomUUID(), email: s.email, mode: s.mode, pose: s.pose, at: new Date().toISOString() }
  await db().setItem(key(shot.id), shot)
  return shot
}

export async function listShots() {
  const keys = await db().getKeys('shots:')
  const all = await Promise.all(keys.map(k => db().getItem<Shot>(k)))
  return all.filter(Boolean).sort((a, b) => (a!.at < b!.at ? 1 : -1)) as Shot[]
}
