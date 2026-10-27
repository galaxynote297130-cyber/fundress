// État du compte partagé entre les composants : utilisateur, crédits, fenêtres ouvertes.
type Me = { id: string; email: string; name: string; credits: number } | null
type Pack = { id: string; credits: number; price: number; label: string; best?: boolean }

export function useAccount() {
  const me = useState<Me>('me', () => null)
  const loaded = useState('me-loaded', () => false)
  const packs = useState<Pack[]>('packs', () => [])
  const costs = useState<Record<string, number>>('costs', () => ({ '1K': 1, '2K': 2 }))
  const authOpen = useState<false | 'login' | 'register'>('auth-open', () => false)
  const buyOpen = useState('buy-open', () => false)
  const { clear } = useUserSession()

  async function api<T>(url: string, opts: any = {}): Promise<T> {
    try {
      return await $fetch<T>(url, opts)
    } catch (e: any) {
      throw new Error(e?.data?.message || e?.data?.statusMessage || e?.statusMessage || 'Une erreur est survenue.')
    }
  }

  async function refresh() {
    try {
      const r = await api<{ user: Me; packs: Pack[]; costs: Record<string, number> }>('/api/me')
      me.value = r.user
      packs.value = r.packs
      costs.value = r.costs
    } finally {
      // Même en cas d'erreur, on affiche les boutons Connexion / S'inscrire
      loaded.value = true
    }
  }

  async function login(email: string, password: string) {
    me.value = await api<Me>('/api/auth/login', { method: 'POST', body: { email, password } })
    authOpen.value = false
  }

  async function register(email: string, password: string, name?: string) {
    me.value = await api<Me>('/api/auth/register', { method: 'POST', body: { email, password, name } })
    authOpen.value = false
  }

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' })
    await clear().catch(() => {})
    me.value = null
  }

  async function buy(packId: string) {
    const { url } = await api<{ url: string }>('/api/credits/checkout', { method: 'POST', body: { pack: packId } })
    window.location.href = url
  }

  async function confirmPayment(sessionId: string) {
    const r = await api<{ paid: boolean; credits: number; balance: number }>('/api/credits/confirm', { query: { session_id: sessionId } })
    if (me.value) me.value = { ...me.value, credits: r.balance }
    return r
  }

  function setCredits(n: number) {
    if (me.value) me.value = { ...me.value, credits: n }
  }

  return { me, loaded, packs, costs, authOpen, buyOpen, refresh, login, register, logout, buy, confirmPayment, setCredits }
}
