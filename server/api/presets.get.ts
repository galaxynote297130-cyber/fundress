// Renvoie le nom et le coût de chaque bouton — jamais le prompt ni le modèle
export default defineEventHandler(() =>
  Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label, credits: p.credits ?? 1 })),
)
