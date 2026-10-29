<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MODES, DEFAULT_MODE } from '~/utils/presets'
import { POSES, findPose } from '~/utils/poses'

const props = defineProps<{ variant?: 'edition' | 'pose'; poseId?: string }>()
const estPose = computed(() => props.variant === 'pose')
const route = useRoute()

const { me, main, busy, message, shown, notify, setPhoto, save, runGenerate, init } = useEditor()

const chosen = ref(props.variant === 'pose' ? 'v2' : DEFAULT_MODE)
const pose = ref(
  findPose(props.poseId || String(route.query.pose || '')) || (props.variant === 'pose' ? POSES[0] : null)
)

const cout = computed(() => estPose.value ? 10 : (MODES.find(m => m.id === chosen.value)?.cost || 10))
const canGenerate = computed(() => !!main.value && !busy.value)
const goLabel = computed(() => {
  if (busy.value) return 'En cours…'
  if (estPose.value && !pose.value) return 'Choisis une scène'
  if (!me.value) return 'Créer un compte · 1 image offerte'
  if (main.value && me.value.credits < cout.value) return 'Crédits insuffisants'
  return 'Générer'
})

function generate() {
  if (estPose.value && !pose.value) return notify('Choisis une scène.', true)
  runGenerate({ mode: estPose.value ? 'v2' : chosen.value, pose: pose.value?.id, cout: cout.value, label: pose.value?.label })
}

useHead({ link: [{ rel: 'stylesheet', href: '/editor.css' }] })

onMounted(init)
</script>

<template>
  <div class="ed-app">
    <SiteTop />
    <main class="ed-wrap">
      <RubriquesTabs :active="estPose ? 'pose' : 'edition'" />

      <div class="ed-cols">
        <SceneStrip v-if="estPose" :chosen="pose?.id || ''" @choose="id => (pose = findPose(id))" />
        <BeforeAfterStrip v-else compact />

        <EditorStage :main="main" :busy="busy" :shown="shown" @file="setPhoto" @remove="main = null" @save="save" />

        <EditorPanel
          :variant="estPose ? 'pose' : 'edition'"
          :chosen="chosen"
          :cost="cout"
          :can-generate="canGenerate"
          :go-label="goLabel"
          :pose-id="pose?.id || null"
          @choose="chosen = $event"
          @choose-pose="id => (pose = findPose(id))"
          @generate="generate"
        />
      </div>

      <div class="ed-privacy">
        <span>Paiement sécurisé par Stripe</span><span>Aucun abonnement</span><span>Photo supprimée après usage</span>
      </div>
      <SiteFooter />
    </main>
    <AuthModal />
    <CreditsModal />
    <div v-if="message" class="ed-toast" :class="{ error: message.error }" role="status">{{ message.text }}</div>
  </div>
</template>
