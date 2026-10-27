// Connexion par email + mot de passe
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const user = await getUserByEmail(body?.email || '')
  const ok = user?.passwordHash && await verifyPassword(user.passwordHash, body?.password || '')

  if (!user || !ok) {
    // Même message dans les deux cas : on ne révèle pas si l'email existe.
    throw createError({ statusCode: 401, statusMessage: 'Email ou mot de passe incorrect.' })
  }

  await setUserSession(event, { user: { id: user.id, email: user.email, name: user.name } })
  return publicUser(user)
})
