// import en haut du fichier
import { findPose } from '~/utils/poses'

// dans la construction du prompt, avant le suffixe
const pose = findPose(body.scene)
if (pose) prompt += ` ${pose.prompt}`
