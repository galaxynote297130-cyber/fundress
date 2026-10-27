export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['nuxt-auth-utils'],
  css: ['~/assets/main.css'],

  // Toutes ces valeurs restent côté serveur, sauf "public".
  // Elles se règlent dans le fichier .env (voir .env.example).
  runtimeConfig: {
    veniceApiKey: '',                 // NUXT_VENICE_API_KEY
    veniceModel: 'qwen-image-2-edit', // NUXT_VENICE_MODEL
    stripeSecretKey: '',              // NUXT_STRIPE_SECRET_KEY
    stripeWebhookSecret: '',          // NUXT_STRIPE_WEBHOOK_SECRET
    // Connexion Google (optionnelle) : NUXT_OAUTH_GOOGLE_CLIENT_ID / NUXT_OAUTH_GOOGLE_CLIENT_SECRET
    oauth: { google: { clientId: '', clientSecret: '' } },
    public: {
      googleLogin: false,             // NUXT_PUBLIC_GOOGLE_LOGIN=true pour afficher le bouton Google
    },
  },

  // Base de données simple : fichiers dans le dossier .data/ (comptes, crédits, paiements).
  // Pour Cloudflare, remplace par un namespace KV (voir README).
  nitro: {
    storage: {
      db: { driver: 'fs', base: './.data/db' },
    },
  },

  app: {
    head: {
      title: 'FUNDRESS',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1' },
        { name: 'theme-color', content: '#12151c' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600&display=swap' },
      ],
    },
  },
})
