
# FUNDRESS

Retouche de photos par IA, pensée pour le mobile. À gauche **ta photo**, à droite **le résultat**. On décrit le changement (une tenue, un décor, un style), l'app appelle l'API Venice et débite des crédits.

## Fonctionnalités

- **Comptes** : inscription et connexion par email + mot de passe (haché), connexion Google en option
- **Crédits** : 5 offerts à l'inscription, 1 crédit par image 1K, 2 en 2K, remboursés automatiquement si la génération échoue
- **Recharge** : packs payés par Stripe (carte, Apple Pay, Google Pay), crédités au retour du paiement et par webhook, jamais deux fois
- **Éditeur** : bandeau d'exemples avant/après, photo à gauche, résultat à droite, historique des versions, partage vers le téléphone

## Lancer sur ton Mac

Il faut Node.js 20 ou plus récent (https://nodejs.org).

```bash
cd fundress
cp .env.example .env     # puis remplis .env (voir ci-dessous)
npm install
npm run dev
```

Ouvre http://localhost:3000. Pour tester sur ton téléphone (même Wi-Fi), ouvre l'adresse `http://192.168.x.x:3000` affichée dans le terminal.

## Remplir le fichier .env

| Variable | Où la trouver |
|---|---|
| `NUXT_VENICE_API_KEY` | venice.ai > Settings > API |
| `NUXT_SESSION_PASSWORD` | Invente une phrase de 32 caractères ou plus |
| `NUXT_STRIPE_SECRET_KEY` | Stripe > Développeurs > Clés API (`sk_test_…` pour tester) |
| `NUXT_STRIPE_WEBHOOK_SECRET` | Stripe > Développeurs > Webhooks (`whsec_…`) |
| `NUXT_OAUTH_GOOGLE_…` | Optionnel, Google Cloud Console > Identifiants |

## Tester le paiement sans payer

Avec une clé `sk_test_…`, utilise la carte **4242 4242 4242 4242**, une date future et n'importe quel code. Les crédits sont ajoutés dès le retour sur le site.

En ligne, déclare le webhook dans Stripe : `https://ton-domaine/api/stripe/webhook`, événement `checkout.session.completed`. Il crédite le compte même si l'utilisateur ferme la page après avoir payé.

## Connexion Google (optionnel)

1. Google Cloud Console > Identifiants > ID client OAuth (application Web)
2. URI de redirection autorisée : `http://localhost:3000/auth/google` (et `https://ton-domaine/auth/google` en ligne)
3. Remplis les deux variables Google et mets `NUXT_PUBLIC_GOOGLE_LOGIN=true`

## Génération

L'utilisateur ajoute sa photo, décrit la modification dans le champ texte, puis clique sur **Générer** (1 crédit). Le serveur envoie la photo et la description à Venice, avec le filtre de contenu activé (`safe_mode: true`).

Le modèle se règle avec la variable `NUXT_VENICE_MODEL` dans Cloudflare (`qwen-image-2-edit` par défaut).

## Régler les prix

Dans `server/utils/store.ts` :
- `FREE_CREDITS` : crédits offerts à l'inscription
- `COSTS` : crédits par génération (1K / 2K)
- `PACKS` : packs vendus (prix en centimes)

Repère : une génération coûte environ 0,04 $ chez Venice.

## Où sont les données

- **Sur ton Mac** : comptes, crédits et paiements sont dans le dossier `.data/`. Ne le supprime pas, sinon les comptes sont perdus.
- **Sur Cloudflare** : ils sont dans un namespace KV lié au projet sous le nom `DB` (voir ci-dessous).

## Mise en ligne sur Cloudflare Pages

Le stockage KV `fundress-db` existe déjà sur le compte Cloudflare. Le fichier `wrangler.toml` le lie au site (nom `DB`) et active la compatibilité `nodejs_compat` : rien à régler pour ça dans le tableau de bord.

1. **Créer le projet** : Workers & Pages > Create > Pages > Connect to Git, puis choisis le dépôt `fundress`.
   - Framework preset : **Nuxt.js**
   - Build command : `npm run build`
   - Build output directory : `dist`
2. **Variables et secrets** (Settings > Variables and Secrets, en mode *Secret* pour les clés) :
   - `NUXT_VENICE_API_KEY`
   - `NUXT_SESSION_PASSWORD` (32 caractères minimum)
   - `NODE_VERSION` = `22`
   - `NUXT_VENICE_MODEL` (optionnel), `NUXT_STRIPE_SECRET_KEY` et `NUXT_STRIPE_WEBHOOK_SECRET` (si Stripe)
3. **Redéploie** : Deployments > ⋯ > Retry deployment, pour prendre en compte les secrets.

Ensuite, chaque modification envoyée sur GitHub (branche `main`) met le site à jour automatiquement.

## Sécurité

- Les clés Venice et Stripe restent côté serveur, jamais dans le navigateur.
- `.env` et `.data/` sont exclus de Git.
- Le filtre de contenu Venice est activé (`safe_mode: true`).

## Avant d'ouvrir au public

- Ajouter des CGU/CGV et une politique de confidentialité (obligatoires pour vendre des crédits)
- Ajouter « mot de passe oublié » (envoi d'email)
- Limiter les tentatives de connexion

## Fichiers

| Fichier | Rôle |
|---|---|
| `components/ImageEditor.vue` | L'éditeur |
| `components/BeforeAfterStrip.vue` | Bandeau d'exemples (mets tes vrais exemples dans `public/exemples/`) |
| `components/AccountBar.vue` | Crédits et menu du compte |
| `components/AuthModal.vue` | Inscription / connexion |
| `components/CreditsModal.vue` | Achat de crédits |
| `server/api/edit.post.ts` | Génération : vérifie le compte, débite, appelle Venice, rembourse si échec |
| `server/api/auth/*` | Inscription, connexion, déconnexion |
| `server/routes/auth/google.get.ts` | Connexion Google |
| `server/api/credits/*` | Création du paiement Stripe et confirmation |
| `server/api/stripe/webhook.post.ts` | Webhook Stripe |
| `server/utils/store.ts` | Comptes, crédits, packs, prix |
