// Boutons de retouche en un clic.
// Le navigateur n'envoie que l'identifiant (ex. "soiree") : le prompt et le modèle restent ici, sur le serveur.
// Prompts en anglais (mieux suivis par les modèles). Toujours préciser ce qui doit rester identique.

export const DEFAULT_MODEL = 'qwen-image-2-edit'

export type Preset = { label: string; prompt: string; model?: string }

export const PRESETS: Record<string, Preset> = {
  soiree: {
    label: 'Tenue de soirée',
    prompt: 'Change the person\'s outfit to an elegant evening outfit (evening gown or tuxedo, matching their style). Keep the face, hair, pose, body shape, lighting and background exactly identical. Photorealistic, natural fabric folds.',
  },
  costume: {
    label: 'Costume',
    prompt: 'Dress the person in a tailored navy blue suit with a crisp white shirt. Keep the face, hair, pose, lighting and background exactly identical. Photorealistic.',
  },
  plage: {
    label: 'Tenue de plage',
    prompt: 'Change the person\'s outfit to colorful summer beachwear (linen shirt and shorts, or a light sundress). Keep the face, hair, pose and background exactly identical. Photorealistic.',
  },
  mariage: {
    label: 'Mariage',
    prompt: 'Change the person\'s outfit to elegant wedding guest attire. Keep the face, hair, pose, lighting and background exactly identical. Photorealistic.',
  },
  decor: {
    label: 'Décor plage',
    prompt: 'Replace the background with a tropical beach at golden hour. Keep the person, their outfit, pose and lighting on the subject identical. Photorealistic, natural shadows.',
  },
  aquarelle: {
    label: 'Aquarelle',
    prompt: 'Turn the whole photo into a soft watercolor painting, keeping the composition and the person recognizable.',
  },
}
