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

onMounted(init)
</script>

<template>
  <div class="app">
    <SiteTop />
    <main class="wrap">
      <RubriquesTabs :active="estPose ? 'pose' : 'edition'" />

      <div class="cols">
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

      <div class="privacy">
        <span>Paiement sécurisé par Stripe</span><span>Aucun abonnement</span><span>Photo supprimée après usage</span>
      </div>
      <SiteFooter />
    </main>
    <AuthModal />
    <CreditsModal />
    <div v-if="message" class="toast" :class="{ error: message.error }" role="status">{{ message.text }}</div>
  </div>
</template>

<style scoped>
.app{min-height:100dvh;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0)}
.wrap{flex:1;display:flex;flex-direction:column;gap:12px;max-width:1200px;width:100%;margin:0 auto;padding:0 max(14px,env(safe-area-inset-right,0)) calc(24px + env(safe-area-inset-bottom,0)) max(14px,env(safe-area-inset-left,0))}
.cols{display:flex;flex-direction:column;gap:12px}
.privacy{display:flex;flex-wrap:wrap;gap:6px;font-size:.72rem;color:var(--muted)}
.privacy span{display:inline-flex;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:99px;padding:5px 10px}
.privacy span::before{content:"✓";color:#22c55e;font-weight:800;margin-right:5px}
.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;background:var(--fg);color:var(--bg);padding:10px 16px;border-radius:12px;z-index:20;max-width:calc(100% - 28px);text-align:center;font-weight:500}
.toast.error{background:var(--danger);color:#fff}
@media(min-width:820px){.cols{display:grid;grid-template-columns:180px 1fr 200px;align-items:start}}
</style>
