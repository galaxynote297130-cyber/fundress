export type Preset = { id: string; label: string; prompt: string }

export const PRESETS: Preset[] = [
  { id: 'topless',  label: 'Enlever le haut',    prompt: 'Retire le haut et le soutien-gorge. La poitrine est entièrement nue et visible.' },
  { id: 'nue',      label: 'Enlever tout',       prompt: 'Retire tous les vêtements. Le corps est entièrement nu.' },
  { id: 'lingerie', label: 'Garder la lingerie', prompt: 'Garde le soutien-gorge et la culotte, retire tout le reste.' },
  { id: 'bikini',   label: 'Bikini',             prompt: 'Remplace la tenue par un bikini deux pièces.' },
  { id: 'homme',    label: 'Homme torse nu',     prompt: 'Retire le haut. Torse entièrement nu.' },
]

export const SUFFIX =
  "Ne modifie pas le visage, la coiffure, la pose, le cadrage ni l'arrière-plan."

export const DEFAULT_PRESET = 'nue'
export const MAX_PROMPT = 1500

export function clampPrompt(text: string) {
  return text.trim().slice(0, MAX_PROMPT)
}

export function buildPrompt(presetId?: string, userText?: string) {
  const preset = PRESETS.find(p => p.id === presetId)
  const extra = (userText || '').trim()
  if (!preset) return clampPrompt(extra)
  if (!extra) return clampPrompt(`${preset.prompt} ${SUFFIX}`)
  return clampPrompt(`${extra} ${preset.prompt} ${SUFFIX}`)
}
