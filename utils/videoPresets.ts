export type Preset = { id: string; label: string; note: string; prompt: string }

const IDENTITE =
  'Garde exactement la même personne, son visage, sa coiffure, sa morphologie et ses vêtements.'

export const PRESETS: Preset[] = [
  {
    id: 'respiration',
    label: 'Respiration',
    note: 'Immobile, micro-mouvement',
    prompt: `${IDENTITE} La personne reste immobile face à la caméra, seul un léger mouvement de respiration anime la poitrine et les épaules. Micro-tremblement naturel de caméra à l’épaule. Aucun déplacement.`,
  },
  {
    id: 'zoom',
    label: 'Zoom visage',
    note: 'Travelling avant',
    prompt: `${IDENTITE} Travelling avant lent et régulier vers le visage, cadrage qui se resserre jusqu’au buste. Le regard reste dirigé vers l’objectif.`,
  },
  {
    id: 'marche',
    label: 'Marche',
    note: 'Avance vers la caméra',
    prompt: `${IDENTITE} La personne avance de quelques pas vers la caméra, hanches souples, épaules détendues, puis s’arrête. La caméra recule légèrement pour garder le cadrage.`,
  },
  {
    id: 'retourne',
    label: 'Se retourne',
    note: 'Passe de face à dos',
    prompt: `${IDENTITE} La personne pivote lentement sur elle-même, de face jusqu’à présenter son dos à l’objectif, puis marque un temps d’arrêt.`,
  },
  {
    id: 'deshabille',
    label: 'Se déshabille',
    note: 'Retire le vêtement',
    prompt: `${IDENTITE} La personne retire son vêtement principal en un geste continu, le fait glisser le long du corps et le laisse tomber. Le corps devient nu et reste visible jusqu’à la fin du plan.`,
  },
  {
    id: 'cambre',
    label: 'Cambre',
    note: 'Dos creusé, pose tenue',
    prompt: `${IDENTITE} La personne creuse les reins, épaules en arrière, menton légèrement relevé, puis tient la pose. Respiration visible, aucun autre mouvement.`,
  },
]

export function findPreset(id?: string | null): Preset | null {
  if (!id) return null
  return PRESETS.find(p => p.id === id) || null
}
