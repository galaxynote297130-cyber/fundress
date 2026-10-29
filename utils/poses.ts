export type Pose = { id: string; label: string; prompt: string }

// Bloc d'identité repris en tête de chaque preset : sans lui, le moteur réinvente la personne.
const IDENTITE =
  "Garde exactement la même personne que sur la photo source. Ne change ni son visage, ni sa coiffure, ni sa carnation."

// Chaque preset décrit la scène complète. Le prompt est concaténé à celui du moteur.
export const POSES: Pose[] = [
  {
    id: 'cum-on-face',
    label: 'Cum on Face',
    prompt: `${IDENTITE} depuis gros plan à hauteur de sa bouche, elle lève les yeux vers l'objectif, POV gros plan sur son visage, elle regarde l'objectif, langue tirée, quelques traces blanches de sperme sur la joue, fond uni flou, lumière douce.`,
  },
  {
    id: 'blowjob',
    label: 'Blow Job',
    prompt: `${IDENTITE} POV depuis gros plan à hauteur de sa bouche, elle lève les yeux vers l'objectif, langue tirée vers l'extérieur sur l'extrémité d'un pénis dont on ne voit que le gland, fond uni légèrement flou, lumière douce de fenêtre, texture de peau réelle, léger grain.`,
  },
  {
    id: 'look-back',
    label: 'Seductive Look Back',
    prompt: `${IDENTITE} Vue de dos, à quatre pattes, dos cambré, fesses relevées vers l'objectif, tête tournée par-dessus l'épaule, regard vers l'objectif, un gode violet dressé au sol sous elle, fond noir uni, lumière douce, texture de peau réelle.`,
  },
  {
    id: 'creampie',
    label: 'Creampie',
    prompt: `${IDENTITE} Vue plongeante, elle est allongée, jambes ouvertes vers l'objectif, une main à peau très foncée écarte sa cuisse, une coulure blanche visible entre les cuisses, haut du corps dans le cadre, fond uni, lumière douce.`,
  },
  {
    id: 'deep-throat',
    label: 'Deep Throat',
    prompt: `${IDENTITE} POV depuis un homme à peau très foncée, gros plan de face, pénis enfoncé jusqu'à la gorge, yeux levés vers l'objectif, fond uni flou, lumière douce.`,
  },
  {
    id: 'bbc-blowjob',
    label: 'BBC Blowjob',
    prompt: `${IDENTITE} POV depuis un homme noir à peau très foncée, elle est à genoux entre ses cuisses foncées, lèvres autour de l'extrémité, une main à plat sur la cuisse, fond uni flou, lumière douce de fenêtre.`,
  },
  {
    id: 'pov-blowjob',
    label: 'POV Blowjob',
    prompt: `${IDENTITE} Vue en plongée depuis un homme allongé, elle lève les yeux vers l'objectif, bouche ouverte sur l'extrémité, une main sur son torse, fond uni flou, lumière douce.`,
  },
  {
    id: 'closeup-blowjob',
    label: 'Closeup BlowJob',
    prompt: `${IDENTITE} Très gros plan sur sa bouche et l'extrémité, lèvres refermées, netteté marquée sur la peau, fond uni très flou, lumière douce.`,
  },
  {
    id: 'cunnilingus',
    label: 'Cunnilingus',
    prompt: `${IDENTITE} Vue de trois quarts, elle est allongée sur le dos, jambes relevées, un homme à peau très foncée entre ses cuisses, visage de profil contre elle, une main foncée sur son ventre, cadrage à mi-corps, fond uni, lumière douce.`,
  },
  {
    id: 'reverse-cowgirl',
    label: 'Reverse Cowgirl',
    prompt: `${IDENTITE} Assise dos à un homme à peau très foncée, buste de trois quarts vers l'objectif, mains posées sur ses cuisses, cadrage à mi-corps, fond uni, lumière douce.`,
  },
  {
    id: 'cowgirl',
    label: 'Cowgirl',
    prompt: `${IDENTITE} Assise face à un homme à peau très foncée allongé, mains sur son torse, buste droit, cadrage à mi-corps, fond uni, lumière douce.`,
  },
  {
    id: 'fingering',
    label: 'Fingering',
    prompt: `${IDENTITE} Allongée, jambes écartées, deux doigts entre les cuisses, tête renversée, une main sur son ventre, cadrage à mi-corps, fond uni, lumière douce.`,
  },
  {
    id: 'spread-legs',
    label: 'Spread Legs',
    prompt: `${IDENTITE} Allongée sur le dos, jambes largement écartées vers l'objectif, mains sur les cuisses, fond uni, lumière douce de fenêtre, texture de peau réelle.`,
  },
]

export function findPose(id?: string | null): Pose | null {
  if (!id) return null
  return POSES.find(p => p.id === id) || null
}
