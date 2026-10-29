// Comptes utilisateurs et crédits.
// Stockage : useStorage('db') → dossier .data/db en local (voir nuxt.config.ts).

export const FREE_CREDITS = 10 // crédits offerts à l'inscription

// Coût d'une génération selon le moteur
export const COSTS: Record<string, number> = { v1: 5, v2: 10 }

// Packs vendus via Stripe (prix en centimes d'euro). `was` sert de prix barré.
export const PACKS = [
  { id: 'p5', credits: 5, price: 99, label: '5 crédits' },
  { id: 'p100', credits: 100, price: 899, label: '100 crédits', was: 1798 },
  { id: 'p400', credits: 400, price: 3199, label: '400 crédits', was: 7998 },
  { id: 'p1000', credits: 1000, price: 7499, label: '1000 crédits', was: 24999, best: true },
]

export type User = {
  id: string
  email: string
  name: string
  passwordHash?: string
  googleId?: string
  credits: number
  createdAt: string
}

const db = () => useStorage('db')
const keyId = (id: string) => `users:id:${id}`
const keyEmail = (email: string) => `users:email:${email.toLowerCase()}`

export function normalizeEmail(email: string) {
  return (email || '').trim().toLowerCase()
}

export async function getUser(id: string) {
  return await db().getItem<User>(keyId(id))
}

export async function getUserByEmail(email: string) {
  const id = await db().getItem<string>(keyEmail(normalizeEmail(email)))
  return id ? await getUser(id) : null
}

export async function createUser(data: { email: string; name?: string; passwordHash?: string; googleId?: string }) {
  const user: User = {
    id: crypto.randomUUID(),
    email: normalizeEmail(data.email),
    name: (data.name || data.email.split('@')[0]).slice(0, 60),
    passwordHash: data.passwordHash,
    googleId: data.googleId,
    credits: FREE_CREDITS,
    createdAt: new Date().toISOString(),
  }
  await db().setItem(keyId(user.id), user)
  await db().setItem(keyEmail(user.email), user.id)
  return user
}

export async function saveUser(user: User) {
  await db().setItem(keyId(user.id), user)
}

// Verrou par utilisateur : évite qu'un double clic débite deux fois en même temps.
const locks = new Map<string, Promise<unknown>>()
async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) || Promise.resolve()
  const run = prev.then(fn, fn)
  locks.set(key, run.catch(() => {}))
  return run
}

/** Débite les crédits. Renvoie le nouveau solde, ou null si le solde est insuffisant. */
export function spendCredits(userId: string, n: number) {
  return withLock(userId, async () => {
    const u = await getUser(userId)
    if (!u || u.credits < n) return null
    u.credits -= n
    await saveUser(u)
    return u.credits
  })
}

export function addCredits(userId: string, n: number) {
  return withLock(userId, async () => {
    const u = await getUser(userId)
    if (!u) return null
    u.credits += n
    await saveUser(u)
    return u.credits
  })
}

/** Crédite une seule fois un paiement Stripe (appelé au retour du paiement ET par le webhook). */
export function creditPaymentOnce(sessionId: string, userId: string, credits: number) {
  return withLock(`pay:${sessionId}`, async () => {
    const key = `payments:${sessionId}`
    if (await db().hasItem(key)) return false
    await addCredits(userId, credits)
    await db().setItem(key, { userId, credits, at: new Date().toISOString() })
    return true
  })
}

export function publicUser(u: User) {
  return { id: u.id, email: u.email, name: u.name, credits: u.credits }
}
