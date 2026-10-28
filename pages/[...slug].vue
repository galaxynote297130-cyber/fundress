<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const slug = ((route.params.slug as string[] | undefined)?.[0]) || ''
const isHome = slug === ''

const META: Record<string, { title: string; desc: string }> = {
  cgu: {
    title: "Conditions générales d'utilisation — Fundress",
    desc: "Conditions générales d'utilisation de Fundress, service de déshabillage de photo par intelligence artificielle.",
  },
  confidentialite: {
    title: 'Confidentialité — Fundress',
    desc: "Ce que Fundress fait de tes photos : suppression sous 24 h, aucune revente.",
  },
}

if (!isHome && !META[slug]) {
  throw createError({ statusCode: 404, statusMessage: 'Page introuvable' })
}

const HOME_TITLE = "Fundress — AI Undress · Déshabille n'importe quelle photo"
const HOME_DESC = "Déshabille n'importe quelle photo avec l'IA. Envoie une photo, choisis une tenue, télécharge. Contenu adulte 18+, résultat en quelques secondes."

useHead({
  title: isHome ? HOME_TITLE : META[slug]!.title,
  meta: [{ name: 'description', content: isHome ? HOME_DESC : META[slug]!.desc }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
  script: isHome
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Fundress',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          description: HOME_DESC,
        }),
      }]
    : [],
})
</script>

<template>
  <ImageEditor v-if="isHome" />

  <div v-else class="page">
    <header><NuxtLink to="/" class="back">← Fundress</NuxtLink></header>

    <template v-if="slug === 'cgu'">
      <h1>Conditions générales d'utilisation</h1>
      <p class="maj">Dernière mise à jour : à compléter.</p>

      <h2>1. Objet</h2>
      <p>Fundress est un service en ligne qui modifie des photographies à l'aide de modèles d'intelligence artificielle, notamment pour retirer ou changer des vêtements. Le service est édité par [nom], joignable à [email].</p>

      <h2>2. Accès et compte</h2>
      <p>L'usage du service est réservé aux personnes de 18 ans et plus. Un compte est nécessaire pour générer des images. Tu es responsable de la confidentialité de ton mot de passe.</p>

      <h2>3. Crédits et paiement</h2>
      <p>Les générations sont décomptées en crédits. Cinq crédits sont offerts à l'inscription. Les packs sont payés à l'unité via Stripe et n'expirent pas. Un crédit est débité au lancement d'une génération et remboursé si elle échoue.</p>

      <h2>4. Droit de rétractation</h2>
      <p>Pour les consommateurs de l'Union européenne : en achetant un pack et en l'utilisant immédiatement, tu reconnais que le service est fourni sans attendre la fin du délai de rétractation de 14 jours. Les crédits déjà consommés ne sont pas remboursables ; les crédits non consommés peuvent l'être sur demande.</p>

      <h2>5. Contenu et propriété</h2>
      <p>Tu conserves la propriété de tes photos. Tu garantis disposer des droits nécessaires sur les images que tu envoies. Tu peux utiliser librement les images générées, y compris à des fins commerciales.</p>

      <h2>6. Nature du résultat</h2>
      <p>Le rendu est une reconstitution estimée par l'IA : il ne correspond pas nécessairement à la réalité anatomique de la personne photographiée.</p>

      <h2>7. Disponibilité</h2>
      <p>Le service dépend de prestataires tiers. Il peut être interrompu ou modifié sans préavis.</p>

      <h2>8. Responsabilité</h2>
      <p>La responsabilité de l'éditeur est limitée au montant payé au cours des douze derniers mois.</p>

      <h2>9. Droit applicable</h2>
      <p>Les présentes conditions sont soumises au droit français.</p>
    </template>

    <template v-else>
      <h1>Confidentialité</h1>
      <p class="maj">Dernière mise à jour : à compléter.</p>

      <h2>Ce que nous faisons de tes photos</h2>
      <p>Ta photo est transmise au fournisseur du modèle uniquement pour produire le résultat. Elle n'est pas revendue et n'est pas publiée sans ton accord.</p>
      <p>La photo est transmise sous forme anonymisée. Aucune image n'est revendue.</p>

      <h2>Ce que nous stockons</h2>
      <p>Nous stockons ton adresse email, ton nom affiché, le résultat chiffré de ton mot de passe et ton solde de crédits. Les images générées ne sont pas conservées côté serveur : elles vivent dans ton navigateur pendant la session.</p>

      <h2>Paiements</h2>
      <p>Les paiements sont traités par Stripe. Tes données bancaires ne transitent jamais par nos serveurs.</p>

      <h2>Cookies</h2>
      <p>Un seul cookie est utilisé : celui de session, qui te garde connecté.</p>

      <h2>Tes droits</h2>
      <p>Tu peux demander l'accès, la rectification ou la suppression de ton compte à [email].</p>
    </template>

    <SiteFooter />
  </div>
</template>

<style scoped>
.page { max-width: 700px; margin: 0 auto; padding: 24px max(16px, env(safe-area-inset-right)) 40px max(16px, env(safe-area-inset-left)); }
header { margin-bottom: 20px; }
.back { font-family: var(--f-display); font-weight: 800; text-decoration: none; color: var(--fg); }
h1 { font-family: var(--f-display); font-size: 1.6rem; letter-spacing: -.02em; margin: 0 0 6px; }
h2 { font-family: var(--f-display); font-size: 1rem; margin: 22px 0 6px; }
p { color: var(--muted); line-height: 1.55; margin: 0 0 8px; font-size: .92rem; }
.maj { font-size: .8rem; }
</style>
