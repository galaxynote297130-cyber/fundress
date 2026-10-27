// Renvoie seulement les noms des boutons, jamais les prompts ni les modèles
export default defineEventHandler(() =>
  Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label })),
)
