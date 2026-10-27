// ============================================================================
//  BOUTONS DE RETOUCHE — c'est ici que tu configures chaque bouton.
// ============================================================================
//
//  Quand un utilisateur clique sur un bouton, le navigateur envoie seulement
//  son identifiant (ex. "soiree"). Le serveur lit ce fichier, prend le prompt
//  et le modèle du bouton, et appelle Venice. L'utilisateur ne voit jamais
//  le prompt ni le modèle.
//
//  Pour chaque bouton :
//    label    → texte affiché sur le bouton
//    prompt   → instruction envoyée à Venice (en anglais, c'est mieux suivi)
//    model    → modèle Venice (optionnel ; sinon DEFAULT_MODEL)
//    credits  → crédits débités en 1K (optionnel ; 1 par défaut). Doublé en 2K.
//
//  Liste des modèles et prix : https://docs.venice.ai/models/image
//  Règle simple pour ne pas perdre d'argent : 1 crédit ≈ 0,07 € minimum
//  (pack 300). Si le modèle coûte plus de ~0,06 $, mets credits: 2 ou plus.
//
//  Conseils de prompt :
//    - Dire précisément ce qui change ("change the outfit to…")
//    - Dire ce qui ne doit PAS changer ("keep the face, pose, background identical")
//    - Préciser le rendu ("photorealistic, natural lighting")
// ============================================================================

// Modèle par défaut (0,05 $ par image)
export const DEFAULT_MODEL = 'qwen-image-2-edit'

export type Preset = {
  label: string
  prompt: string
  model?: string
  credits?: number
}

// Phrase ajoutée à tous les prompts de tenue, pour garder la personne identique
const KEEP_PERSON = 'Keep the face, facial features, skin tone, hair, pose, body shape, lighting and background exactly identical. Photorealistic, natural fabric folds and shadows.'

export const PRESETS: Record<string, Preset> = {
  soiree: {
    label: 'Tenue de soirée',
    model: 'qwen-image-2-edit',
    credits: 1,
    prompt: `Change only the person's clothing to an elegant evening outfit: a long satin evening gown for a woman, or a black tuxedo with bow tie for a man. ${KEEP_PERSON}`,
  },
  costume: {
    label: 'Costume',
    model: 'qwen-image-2-edit',
    credits: 1,
    prompt: `Change only the person's clothing to a tailored navy blue two-piece suit with a crisp white shirt. ${KEEP_PERSON}`,
  },
  plage: {
    label: 'Tenue de plage',
    model: 'qwen-image-2-edit',
    credits: 1,
    prompt: `Change only the person's clothing to colorful summer beachwear: a light floral sundress for a woman, or a linen short-sleeve shirt with shorts for a man. ${KEEP_PERSON}`,
  },
  mariage: {
    label: 'Invité mariage',
    model: 'qwen-image-2-edit',
    credits: 1,
    prompt: `Change only the person's clothing to elegant wedding guest attire: a pastel cocktail dress for a woman, or a light grey suit with a tie for a man. ${KEEP_PERSON}`,
  },
  decor: {
    label: 'Décor plage',
    model: 'qwen-image-2-edit',
    credits: 1,
    prompt: 'Replace only the background with a tropical Caribbean beach at golden hour, with turquoise water and palm trees. Keep the person, their clothing, face and pose exactly identical. Match the lighting on the person to the new scene. Photorealistic.',
  },
  aquarelle: {
    label: 'Aquarelle',
    model: 'qwen-image-2-edit',
    credits: 1,
    prompt: 'Transform the whole image into a soft hand-painted watercolor illustration, keeping the same composition and keeping the person recognizable.',
  },
}

/** Crédits à débiter pour un bouton (ou pour un texte libre) selon la qualité. */
export function creditsFor(preset: Preset | undefined, resolution: '1K' | '2K') {
  const base = preset?.credits ?? 1
  return resolution === '2K' ? base * 2 : base
}
