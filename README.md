# FUNDRESS

Déshabillage de photo par IA, pensé pour le mobile. Tu envoies une photo, tu choisis un modèle ou une scène, tu télécharges. Un onglet vidéo permet d'animer une photo.

## Fonctionnalités

- **Comptes** : inscription et connexion par email + mot de passe (haché PBKDF2), connexion Google en option
- **Édition photo** : deux moteurs, `v1` Base (5 crédits) et `v2` Photoréaliste (10 crédits), plus un prompt libre
- **Scènes** : 13 presets de scène à 10 crédits, ouverts depuis l'accueil et l'onglet Édition photo
- **Vidéo** : modèle Wan 3.0, 20 crédits, 6 presets obligatoires, format 9:16 ou 16:9, qualité 480p/720p/1080p, durée 5 ou 10 s
- **Crédits** : 10 offerts à l'inscription, packs payés par Stripe, remboursement automatique et unique en cas d'échec
- **Galerie** : personnelle, sur l'appareil uniquement (IndexedDB), effacement automatique au bout d'une heure
- **Journal** : `/admin`, protégé par clé, email + moteur + scène + date, sans aucune image

## Lancer sur ton Mac

Il faut Node.js 20 ou plus récent (https://nodejs.org).
