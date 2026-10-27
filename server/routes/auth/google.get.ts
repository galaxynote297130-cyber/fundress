// Connexion avec Google (optionnelle).
// Nécessite NUXT_OAUTH_GOOGLE_CLIENT_ID et NUXT_OAUTH_GOOGLE_CLIENT_SECRET dans .env
// URL de redirection à déclarer chez Google : https://ton-domaine/auth/google
export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user: g }) {
    if (!g?.email || g.email_verified === false) {
      return sendRedirect(event, '/?erreur=google')
    }
    let user = await getUserByEmail(g.email)
    if (!user) {
      user = await createUser({ email: g.email, name: g.name, googleId: g.sub })
    } else if (!user.googleId) {
      user.googleId = g.sub
      await saveUser(user)
    }
    await setUserSession(event, { user: { id: user.id, email: user.email, name: user.name } })
    return sendRedirect(event, '/')
  },
  onError(event) {
    return sendRedirect(event, '/?erreur=google')
  },
})
