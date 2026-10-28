export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['nuxt-auth-utils'],
  css: ['~/assets/main.css'],

  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD ?? '',
    },
    veniceApiKey: '',
    veniceModel: 'qwen-image-2-edit',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    oauth: { google: { clientId: '', clientSecret: '' } },
    public: {
      googleLogin: false,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://fundress.pages.dev',
    },
  },

  nitro: {
    storage: {
      db: process.env.CF_PAGES
        ? { driver: 'cloudflare-kv-binding', binding: 'DB' }
        : { driver: 'fs', base: './.data/db' },
    },
    devStorage: {
      db: { driver: 'fs', base: './.data/db' },
    },
  },

  app: {
    head: {
      title: "Fundress — AI Undress · Déshabille n'importe quelle photo",
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#12151c' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'robots', content: 'index, follow' },
        { name: 'rating', content: 'mature' },
        { name: 'keywords', content: 'undress ai, nudify, déshabiller une photo, ia, nu, nsfw, retouche photo adulte' },
        { name: 'description', content: "Déshabille n'importe quelle photo avec l'IA. Envoie une photo, choisis une tenue, télécharge. Contenu adulte 18+, résultat en quelques secondes." },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Fundress' },
        { property: 'og:title', content: "Fundress — AI Undress · Déshabille n'importe quelle photo" },
        { property: 'og:description', content: "Envoie une photo, choisis une tenue, télécharge. Contenu adulte 18+." },
        { property: 'og:image', content: '/og.png' },
        { property: 'og:locale', content: 'fr_FR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: "Fundress — AI Undress" },
        { name: 'twitter:description', content: "Envoie une photo, choisis une tenue, télécharge." },
        { name: 'twitter:image', content: '/og.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600&display=swap' },
      ],
    },
  },
})
