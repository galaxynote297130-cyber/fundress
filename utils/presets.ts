export type Mode = { id: string; label: string; note: string; model: string; prompt: string; cost: number }

export const MODES: Mode[] = [
  {
    id: 'v1',
    label: 'Base',
    note: 'Modèle de base, rendu direct',
    model: 'qwen-edit-uncensored',
    cost: 5,
    prompt:
      'Retire tous les vêtements. Le corps est entièrement nu et visible, poitrine et bas du corps nus. Conserve le décor et l’arrière-plan d’origine. Rendu brut : grain, texture de peau naturelle, aucune retouche.',
  },
  {
    id: 'v2',
    label: 'Photoréaliste',
    note: 'Lumière douce, texture de peau travaillée',
    model: 'qwen-image-2-edit',
    cost: 10,
    prompt:
      'Retire tous les vêtements. Le corps est entièrement nu et visible, poitrine et bas du corps nus. Conserve le décor, le mobilier et l’arrière-plan d’origine. Rendu photoréaliste : lumière douce naturelle, texture de peau travaillée, contraste marqué.',
  },
]

export const SUFFIX =
  "Ne modifie pas le visage, la coiffure, la pose, le cadrage ni l'arrière-plan."

export const DEFAULT_MODE = 'v2'
export const MAX_PROMPT = 1500

export function clampPrompt(text: string) {
  return text.trim().slice(0, MAX_PROMPT)
}

export function findMode(id?: string) {
  return MODES.find(m => m.id === id)
}

export function buildPrompt(modeId?: string) {
  const mode = findMode(modeId)
  if (!mode) return ''
  return clampPrompt(`${mode.prompt} ${SUFFIX}`)
}
