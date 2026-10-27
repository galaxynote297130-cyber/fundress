// Inscription par email + mot de passe
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string; name?: string }>(event)
  const email = normalizeEmail(body?.email || '')
  const password = body?.password || ''

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Adresse email invalide.' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Le mot de passe doit faire au moins 8 caractères.' })
  }
  if (await getUserByEmail(email)) {
    throw createError({ statusCode: 409, statusMessage: 'Un compte existe déjà avec cet email. Connecte-toi.' })
  }

  const user = await createUser({ email, name: body?.name, passwordHash: await hashPassword(password) })
  await setUserSession(event, { user: { id: user.id, email: user.email, name: user.name } })
  return publicUser(user)
})
