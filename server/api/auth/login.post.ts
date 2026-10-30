// Connexion par email + mot de passe
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = normalizeEmail(body?.email || '')
  const ip = ipDe(event)

  const parEmail = await throttle(`login:${email}`, 8, 600)
  const parIp = await throttle(`loginip:${ip}`, 20, 600)

  if (!parEmail || !parIp) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Trop de tentatives. Réessaie dans quelques minutes.'
    })
  }

  const user = await getUserByEmail(email)
  const ok = user?.passwordHash && await checkPassword(user.passwordHash, body?.password || '')

  if (!user || !ok) {
    // Même message dans les deux cas : on ne révèle pas si l'email existe.
    throw createError({ statusCode: 401, statusMessage: 'Email ou mot de passe incorrect.' })
  }

  await setUserSession(event, { user: { id: user.id, email: user.email, name: user.name } })
  return publicUser(user)
})
