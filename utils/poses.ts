export type Pose = { id: string; label: string; prompt: string }

// Chaque preset ajoute une consigne de pose au prompt du moteur.
// Le visage, la morphologie et le décor restent imposés comme inchangés.
export const POSES: Pose[] = [
  { id: 'ecartees', label: 'Jambes écartées', prompt: "assise sur le bord du support, jambes largement écartées vers l'objectif, buste légèrement renversé en arrière" },
  { id: 'quatre-pattes', label: 'À quatre pattes', prompt: "à quatre pattes, dos creusé, fesses hautes, tête tournée vers l'objectif" },
  { id: 'allongee', label: 'Allongée sur le dos', prompt: "allongée sur le dos, jambes relevées et ouvertes, bras au-dessus de la tête" },
  { id: 'cambree', label: 'Debout cambrée', prompt: "debout, hanches poussées vers l'arrière, dos cambré, mains dans les cheveux" },
  { id: 'assise-ouverte', label: 'Assise jambes ouvertes', prompt: "assise au sol, genoux écartés, appuyée sur les mains derrière elle" },
  { id: 'dos', label: 'De dos, tête tournée', prompt: "de dos, jambes légèrement écartées, buste pivoté pour regarder par-dessus l'épaule" },
  { id: 'ventre', label: 'Sur le ventre', prompt: "allongée sur le ventre, fesses relevées, appuyée sur les avant-bras" },
  { id: 'accoudee', label: 'Accoudée au lit', prompt: "accoudée au bord du lit, hanches hautes, jambes croisées" },
  { id: 'agenouillee', label: 'Agenouillée', prompt: "à genoux, cuisses écartées, mains posées sur les cuisses, épaules en arrière" },
  { id: 'cote', label: 'Sur le côté', prompt: "allongée sur le côté, jambe du dessus pliée et relevée" },
  { id: 'cuisses', label: 'Cuisses relevées', prompt: "sur le dos, cuisses ramenées contre la poitrine, mains aux chevilles" },
  { id: 'mur', label: 'Écartée au mur', prompt: "debout adossée à un mur, une jambe relevée, mains au-dessus de la tête" },
]

export function findPose(id?: string | null): Pose | null {
  if (!id) return null
  return POSES.find(p => p.id === id) || null
}
