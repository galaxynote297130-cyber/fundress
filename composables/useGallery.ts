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

const DB = 'fundress-galerie'
const TTL = 60 * 60 * 1000

function db(): Promise<IDBDatabase> {
  return new Promise((ok, ko) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => r.result.createObjectStore('items', { keyPath: 'id' })
    r.onsuccess = () => ok(r.result)
    r.onerror = () => ko(r.error)
  })
}

export function useGallery() {
  const items = ref<Item[]>([])

  async function list() {
    const d = await db()
    const all = await new Promise<Item[]>((ok) => {
      const q = d.transaction('items').objectStore('items').getAll()
      q.onsuccess = () => ok((q.result || []) as Item[])
    })
    const now = Date.now()
    for (const v of all) if (now - v.at >= TTL) await remove(v.id)
    items.value = all.filter(i => now - i.at < TTL).sort((a, b) => b.at - a.at)
  }

  async function put(i: Omit<Item, 'at'>) {
    const d = await db()
    await new Promise((ok) => {
      const t = d.transaction('items', 'readwrite')
      t.objectStore('items').put({ ...i, at: Date.now() })
      t.oncomplete = () => ok(null)
    })
    await list()
  }

  async function remove(id: string) {
    const d = await db()
    await new Promise((ok) => {
      const t = d.transaction('items', 'readwrite')
      t.objectStore('items').delete(id)
      t.oncomplete = () => ok(null)
    })
    items.value = items.value.filter(i => i.id !== id)
  }

  async function clear() {
    const d = await db()
    await new Promise((ok) => {
      const t = d.transaction('items', 'readwrite')
      t.objectStore('items').clear()
      t.oncomplete = () => ok(null)
    })
    items.value = []
  }

  return { items, list, put, remove, clear }
}
