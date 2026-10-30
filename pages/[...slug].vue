<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const slug = ((route.params.slug as string[] | undefined)?.[0]) || ''
const isHome = slug === ''

const META: Record<string, { title: string; desc: string }> = {
  cgu: {
    title: "Conditions générales d'utilisation — Xpicture",
    desc: "Conditions générales d'utilisation de Xpicture, service de déshabillage de photo par intelligence artificielle.",
  },
  confidentialite: {
    title: 'Confidentialité — Xpicture',
    desc: "Ce que Xpicture stocke réellement : compte, crédits, journal sans image. Les photos ne sont pas conservées sur nos serveurs.",
  },
  'mentions-legales': {
    title: 'Mentions légales — Xpicture',
    desc: "Hébergeur et prestataires du service Xpicture.",
  },
}

if (!isHome && !META[slug]) {
  throw createError({ statusCode: 404, statusMessage: 'Page introuvable' })
}

const HOME_TITLE = "Xpicture — AI Undress · Déshabille n'importe quelle photo"
const HOME_DESC = "Déshabille n'importe quelle photo avec l'IA. Envoie une photo, choisis un modèle, télécharge. Contenu adulte 18+, résultat en quelques secondes."

useHead({
  title: isHome ? HOME_TITLE : META[slug]!.title,
  meta: [{ name: 'description', content: isHome ? HOME_DESC : META[slug]!.desc }],
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})
</script>

<template>
  <ImageEditor v-if="isHome" />
  <div v-else class="page">
    <header><NuxtLink to="/" class="back">← Xpicture</NuxtLink></header>

    <template v-if="slug === 'cgu'">
      <h1>Conditions générales d'utilisation</h1>
      <p class="maj">Dernière mise à jour : 30 octobre 2026.</p>

      <h2>1. Objet</h2>
      <p>Xpicture est un service en ligne qui modifie des photographies à l'aide de modèles d'intelligence artificielle, notamment pour retirer ou changer des vêtements, et qui peut animer une photo en courte vidéo.</p>

      <h2>2. Accès et compte</h2>
      <p>L'usage du service est réservé aux personnes de 18 ans et plus. Un compte est nécessaire pour générer. Tu es responsable de la confidentialité de ton mot de passe.</p>

      <h2>3. Crédits et paiement</h2>
      <p>Les générations sont décomptées en crédits. Des crédits sont offerts à l'inscription. Les packs sont payés à l'unité via Stripe ou en crypto et n'expirent pas. Le débit a lieu au lancement d'une génération et n'est remboursé qu'une fois si elle échoue.</p>

      <h2>4. Droit de rétractation</h2>
      <p>Pour les consommateurs de l'Union européenne : en achetant un pack et en l'utilisant immédiatement, tu reconnais que le service est fourni sans attendre la fin du délai de rétractation de 14 jours. Les crédits déjà consommés ne sont pas remboursables ; les crédits non consommés peuvent l'être sur demande.</p>

      <h2>5. Contenu et propriété</h2>
      <p>Tu conserves la propriété de tes photos. Tu garantis disposer des droits nécessaires sur les images que tu envoies, et que les personnes représentées sont majeures ou que tu détiens leur accord. Tu peux utiliser librement les images générées, y compris à des fins commerciales.</p>

      <h2>6. Nature du résultat</h2>
      <p>Le rendu est une reconstitution estimée par l'IA : il ne correspond pas nécessairement à la réalité anatomique de la personne photographiée.</p>

      <h2>7. Usage raisonnable</h2>
      <p>Les générations sont limitées à 10 par minute et par compte. Les images envoyées sont limitées à 8 Mo.</p>

      <h2>8. Disponibilité</h2>
      <p>Le service dépend de prestataires tiers. Il peut être interrompu ou modifié sans préavis.</p>

      <h2>9. Responsabilité</h2>
      <p>La responsabilité de l'éditeur est limitée au montant payé au cours des douze derniers mois.</p>

      <h2>10. Droit applicable</h2>
      <p>Les présentes conditions sont soumises au droit français.</p>
    </template>

    <template v-else-if="slug === 'mentions-legales'">
      <h1>Mentions légales</h1>
      <p class="maj">Dernière mise à jour : 30 octobre 2026.</p>

      <h2>Éditeur</h2>
      <p>Xpicture, service en ligne de retouche et d'animation de photos par intelligence artificielle.</p>
      <p>Contact : <a href="mailto:contact@xpicture.app">contact@xpicture.app</a></p>

      <h2>Hébergeur</h2>
      <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis — +1 650 319 8930.</p>

      <h2>Prestataires techniques</h2>
      <p>Génération d'images et de vidéos : Venice AI. Paiement : Stripe Payments Europe, Ltd. et NOWPayments.</p>

      <h2>Propriété intellectuelle</h2>
      <p>Le nom, l'interface et le code de Xpicture sont protégés. Les images générées appartiennent à leur auteur.</p>
    </template>

    <template v-else>
      <h1>Confidentialité</h1>
      <p class="maj">Dernière mise à jour : 30 octobre 2026.</p>

      <h2>Responsable du traitement</h2>
      <p>L'éditeur de Xpicture, joignable à <a href="mailto:contact@xpicture.app">contact@xpicture.app</a>.</p>

      <h2>Ce que deviennent tes photos</h2>
      <p>Ta photo est transmise à Venice AI uniquement pour produire le résultat. Elle n'est pas revendue et n'est pas publiée sans ton accord. Aucune image n'est conservée sur nos serveurs : le résultat est renvoyé à ton navigateur.</p>

      <h2>La galerie</h2>
      <p>Tes générations sont enregistrées dans la mémoire locale de ton navigateur, sur ton appareil uniquement. Elles disparaissent au bout d'une heure, et tu peux les supprimer à la main. Elles ne sont visibles par personne d'autre, mais elles disparaissent si tu vides les données du site.</p>

      <h2>Ce qui est stocké sur nos serveurs</h2>
      <p>Ton adresse email, ton nom affiché, l'empreinte chiffrée de ton mot de passe et ton solde de crédits.</p>
      <p>Un journal des générations conserve l'email, le moteur, la scène et la date, sans aucune image. Il sert à mesurer l'usage et à détecter les abus. Il est élagué au bout de 90 jours et plafonné en nombre d'entrées.</p>
      <p>Un marqueur de génération est conservé 24 heures pour éviter les remboursements en double, et un compteur de débit quelques minutes.</p>

      <h2>Bases légales</h2>
      <p>Exécution du contrat pour le compte, les crédits et les générations. Intérêt légitime pour la sécurité et la prévention des abus. Le journal et les compteurs relèvent de ce second point.</p>

      <h2>Cookies</h2>
      <p>Deux cookies seulement : celui de session, qui te garde connecté, et celui de vérification d'âge. Aucun traceur publicitaire, aucun outil de mesure d'audience tiers.</p>

      <h2>Prestataires et transferts hors Union européenne</h2>
      <p>Cloudflare (hébergement), Venice AI (génération), Stripe et NOWPayments (paiement) sont situés hors Union européenne ou y font appel. Les transferts s'appuient sur les clauses contractuelles types de la Commission européenne.</p>

      <h2>Durées de conservation</h2>
      <p>Compte et crédits : jusqu'à la suppression du compte. Journal : 90 jours. Marqueur de remboursement : 24 heures. Compteur de débit : quelques minutes. Galerie : 1 heure, sur ton appareil.</p>

      <h2>Tes droits</h2>
      <p>Accès, rectification, effacement, limitation, opposition et portabilité. Écris à <a href="mailto:contact@xpicture.app">contact@xpicture.app</a>. Tu peux aussi saisir la CNIL, 3 place de Fontenoy, 75007 Paris.</p>
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
p a { color: var(--accent); }
.maj { font-size: .8rem; }
</style>
