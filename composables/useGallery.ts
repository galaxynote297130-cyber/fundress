import { ref } from 'vue'

export type Item = {
  id: string
  kind: 'image' | 'video'
  label: string
  cout: number
  duree?: string
  at: number
  blob?: Blob
  url?: string
}

const items = ref<Item[]>([])
const erreur = ref('')
const DB = 'fundress-galerie'
const TTL = 60 * 60 * 1000

function db(): Promise<IDBDatabase> {
  return new Promise((ok, ko) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains('items')) {
        r.result.createObjectStore('items', { keyPath: 'id' })
      }
    }
    r.onsuccess = () => ok(r.result)
    r.onerror = () => ko(r.error)
  })
}

function tx(d: IDBDatabase, mode: IDBTransactionMode, f: (s: IDBObjectStore) => void): Promise<void> {
  return new Promise((ok, ko) => {
    const t = d.transaction('items', mode)
    f(t.objectStore('items'))
    t.oncomplete = () => ok()
    t.onerror = () => ko(t.error)
    t.onabort = () => ko(t.error)
  })
}

export function useGallery() {
  async function list() {
    try {
      erreur.value = ''
      const d = await db()
      const all = await new Promise<Item[]>((ok, ko) => {
        const q = d.transaction('items').objectStore('items').getAll()
        q.onsuccess = () => ok((q.result || []) as Item[])
        q.onerror = () => ko(q.error)
      })
      const now = Date.now()
      const vivants = all.filter(i => now - i.at < TTL)
      const morts = all.filter(i => now - i.at >= TTL)
      if (morts.length) {
        await tx(d, 'readwrite', s => morts.forEach(m => s.delete(m.id))).catch(() => {})
      }
      items.value = vivants.sort((a, b) => b.at - a.at)
    } catch (e: any) {
      erreur.value = "La galerie n'a pas pu s'ouvrir sur cet appareil."
    }
  }

  async function put(i: Omit<Item, 'at'>) {
    const item: Item = { ...i, at: Date.now() }
    items.value = [item, ...items.value]
    try {
      const d = await db()
      await tx(d, 'readwrite', s => s.put(item))
    } catch (e: any) {
      erreur.value = "L'élément n'a pas pu être enregistré dans la galerie."
    }
  }

  async function remove(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    try {
      const d = await db()
      await tx(d, 'readwrite', s => s.delete(id))
    } catch { /* déjà retiré de l'affichage */ }
  }

  async function clear() {
    items.value = []
    try {
      const d = await db()
      await tx(d, 'readwrite', s => s.clear())
    } catch { /* déjà vidé de l'affichage */ }
  }

  return { items, erreur, list, put, remove, clear }
}
