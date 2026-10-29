// a) état
const scene = ref<string | null>(null)

// b) sur <EditorPanel>, ajouter
v-model:scene="scene"
:busy="busy"
:can="!!photo && !busy"
@run="generate"

// c) dans le corps du POST vers /api/edit, ajouter
scene: scene.value
