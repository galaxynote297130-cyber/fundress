<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MODES, DEFAULT_MODE } from '~/utils/presets'
import { POSES, findPose } from '~/utils/poses'

const props = defineProps<{ variant?: 'edition' | 'pose'; poseId?: string }>()
const estPose = computed(() => props.variant === 'pose')
const route = useRoute()

const { me, main, busy, message, shown, notify, setPhoto, save, runGenerate, init } = useEditor()

const chosen = ref<'v1' | 'v2'>(props.variant === 'pose' ? 'v2' : (DEFAULT_MODE as 'v1' | 'v2'))
const description = ref('')
const promptOpen = ref(false)
const pose = ref(
  findPose(props.poseId || String(route.query.pose || '')) || (props.variant === 'pose' ? POSES[0] : null)
)

const cout = computed(() => {
  if (estPose.value) return 10
  if (pose.value) return 10
  return MODES.find(m => m.id === chosen.value)?.cost || 5
})
const recap = computed(() => {
  if (estPose.value) return 'scène fixe'
  if (pose.value) return 'scène · ' + (pose.value.label || '')
  return chosen.value === 'v1' ? 'Base · modèle' : 'Photoréaliste · modèle'
})
const canGenerate = computed(() => !!main.value && !busy.value)
const goLabel = computed(() => {
  if (busy.value) return 'En cours…'
  if (!me.value) return 'Créer un compte · 1 image offerte'
  if (main.value && me.value.credits < cout.value) return 'Crédits insuffisants'
  return 'Générer'
})

function generate() {
  const enScene = estPose.value || !!pose.value
  runGenerate({
    mode: enScene ? 'v2' : chosen.value,
    pose: pose.value?.id,
    description: !enScene && promptOpen.value ? description.value : '',
    cout: cout.value,
    label: pose.value?.label
  })
}

useHead({ link: [{ rel: 'stylesheet', href: '/editor.css' }] })

onMounted(init)
</script>

<template>
  <div class="ed-app">
    <SiteTop />
    <main class="ed-wrap">
      <RubriquesTabs />

      <div class="ed-cols">
        <BeforeAfterStrip v-if="!estPose" compact />

        <EditorStage :main="main" :busy="busy" :shown="shown" @file="setPhoto" @remove="main = null" @save="save" />

        <EditorPanel
          :variant="estPose ? 'pose' : 'edition'"
          v-model:mode="chosen"
          v-model:text="description"
          v-model:open="promptOpen"
          :scene="pose?.id || null"
          :busy="busy"
          :can="canGenerate"
          :go-label="goLabel"
          :cost="cout"
          :recap="recap"
          @update:scene="id => (pose = findPose(id))"
          @run="generate"
        />
      </div>

      <div class="ed-privacy">
        <span>Paiement sécurisé par Stripe</span><span>Aucun abonnement</span><span>Photo conservée 1 h sur ton appareil</span>
      </div>
      <SiteFooter />
    </main>
    <AuthModal />
    <CreditsModal />
    <div v-if="message" class="ed-toast" :class="{ error: message.error }" role="status">{{ message.text }}</div>
  </div>
</template>
