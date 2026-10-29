export type Mode = { id: string; label: string; model: string; prompt: string; cost: number }

export const MODES: Mode[] = [
  {
    id: 'v1',
    label: 'Fundress V1',
    model: 'qwen-edit-uncensored',
    cost: 5,
    prompt:
      'Retire tous les vêtements. Le corps est entièrement nu et visible, poitrine et bas du corps nus. Conserve le décor et l’arrière-plan d’origine. Rendu brut : grain, texture de peau naturelle, aucune retouche.',
  },
  {
    id: 'v2',
    label: 'Fundress V2',
    model: 'qwen-image-2-edit',
    cost: 10,
    prompt:
      'Retire tous les vêtements. Le corps est entièrement nu et visible, poitrine et bas du corps nus. Conserve le décor, le mobilier et l’arrière-plan d’origine. Rendu soigné : peau lissée, lumière douce naturelle, contraste marqué.',
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
