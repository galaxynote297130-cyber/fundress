/**
 * Rembourse une génération qui a échoué, une seule fois.
 * Le verrou porte sur le job : un status et un cancel simultanés ne créditent qu'une fois.
 * Renvoie le nouveau solde, ou null si le job avait déjà été remboursé.
 */
export function refundOnce(jobId: string, userId: string, credits: number) {
  return withLock(`refund:${jobId}`, async () => {
    const key = `refunds:${jobId}`
    if (await db().hasItem(key)) return null
    const balance = await addCredits(userId, credits)
    await db().setItem(key, { userId, credits, at: new Date().toISOString() })
    return balance
  })
}

/** Le job a réussi : on le note comme consommé pour bloquer tout remboursement ultérieur. */
export async function markSpent(jobId: string, userId: string, credits: number) {
  const key = `refunds:${jobId}`
  if (await db().hasItem(key)) return
  await db().setItem(key, { userId, credits, at: new Date().toISOString() })
}
