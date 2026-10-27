// Chiffrement des mots de passe avec Web Crypto (PBKDF2-SHA256).
// Fonctionne à l'identique sur ton Mac (Node) et sur Cloudflare.
// Format stocké : pbkdf2$<itérations>$<sel base64>$<hash base64>

const ITERATIONS = 100_000 // maximum autorisé par Cloudflare Workers
const enc = new TextEncoder()

const toB64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const fromB64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0))

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256)
}

export async function makePasswordHash(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derive(password, salt, ITERATIONS)
  return `pbkdf2$${ITERATIONS}$${toB64(salt)}$${toB64(hash)}`
}

export async function checkPassword(stored: string, password: string) {
  const [algo, iter, salt, hash] = (stored || '').split('$')
  if (algo !== 'pbkdf2' || !iter || !salt || !hash) return false
  const got = new Uint8Array(await derive(password, fromB64(salt), Number(iter)))
  const expected = fromB64(hash)
  if (got.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ expected[i]
  return diff === 0
}
