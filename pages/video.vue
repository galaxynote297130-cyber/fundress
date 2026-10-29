<template>
  <div class="ed-app">
    <RubriquesTabs />
    <div class="ed-wrap">
      <div class="split">
        <div class="stage">
          <label v-if="!src" class="drop">
            <input type="file" accept="image/*" hidden @change="upload" />
            <span class="up">＋</span>
            <b>Ajouter une photo</b>
            <span class="sub">JPG ou PNG · 256 px minimum</span>
          </label>
          <div v-else>
            <img :src="src" alt="" class="frame" />
            <button class="clear" @click="reset">Changer</button>
          </div>
          <video v-if="out" :src="out" controls autoplay loop playsinline class="frame" />
          <div v-if="busy" class="wait">
            <span>Génération en cours · {{ restant }} s</span>
            <button class="cancel" @click="cancel">Annuler et rembourser</button>
          </div>
        </div>
        <VideoPanel
          v-model:duration="duration"
          v-model:ratio="ratio"
          v-model:qualite="qualite"
          :can="!!src && !busy"
          :busy="busy"
          :cout="20"
          @run="run"
        />
      </div>

      <div class="bas">
        <div class="bhead"><span class="dot"></span><h3>Presets vidéo</h3><em>1 obligatoire</em></div>
        <div class="rail">
          <button v-for="p in PRESETS" :key="p.id" class="preset" :class="{ on: preset === p.id }" @click="preset = p.id">
            <span class="pvic">{{ p.label.slice(0, 1) }}</span>
            <b>{{ p.label }}</b>
            <i>{{ p.note }}</i>
          </button>
        </div>
      </div>

      <p v-if="error" class="err">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRESETS } from '~/utils/videoPresets'

useHead({ title: 'Édition vidéo — Fundress', link: [{ rel: 'stylesheet', href: '/editor.css' }] })

const src = ref('')
const out = ref('')
const duration = ref(5)
const ratio = ref('9:16')
const qualite = ref('720p')
const preset = ref<string | null>(null)
const busy = ref(false)
const error = ref('')
const restant = ref(0)
let stop = false

function upload(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  const r = new FileReader()
  r.onload = () => { src.value = String(r.result); out.value = '' }
  r.readAsDataURL(f)
}
function reset() { src.value = ''; out.value = ''; error.value = '' }

async function run() {
  if (!preset.value) return
  busy.value = true
  error.value = ''
  stop = false
  restant.value = 240
  try {
    const { id, download } = await $fetch<{ id: string; download: string }>('/api/video', {
      method: 'POST',
      body: { image: src.value, duration: duration.value, ratio: ratio.value, qualite: qualite.value, preset: preset.value }
    })
    await poll(id, download)
  } catch (e: any) {
    if (!stop) error.value = e?.data?.statusMessage || 'La génération a échoué. Tes crédits ont été rendus.'
  } finally {
    busy.value = false
  }
}

async function cancel() {
  stop = true
  await $fetch('/api/video/cancel', { method: 'POST', body: {} }).catch(() => {})
  busy.value = false
  error.value = 'Vidéo annulée, crédits rendus.'
}

async function poll(id: string, download: string) {
  for (let i = 0; i < 60 && !stop; i++) {
    await new Promise(r => setTimeout(r, 4000))
    if (stop) return
    restant.value = 240 - i * 4
    const s = await $fetch<any>('/api/video/status', { method: 'POST', body: { id, download } })
    if (s.status === 'done' && s.url) { out.value = s.url; return }
    if (s.status === 'failed') throw new Error('failed')
  }
}
</script>

<style scoped>
.split { display: flex; gap: 12px; align-items: flex-start; }
.stage { flex: 1; min-width: 0; }
.drop { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-height: 260px; border: 1px dashed var(--line); border-radius: var(--r); color: var(--fg); cursor: pointer; text-align: center; }
.drop b { font-size: .8rem; font-weight: 500; }
.up { width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: var(--accent-ink); display: grid; place-items: center; font-size: 15px; }
.sub { font-size: .66rem; color: var(--muted); }
.frame { width: 100%; border-radius: 12px; display: block; }
.clear { margin-top: 8px; font-size: .7rem; background: transparent; border: 0; color: var(--muted); }
.wait { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; margin-top: 10px; font-size: .75rem; color: var(--muted); }
.cancel { font-size: .7rem; padding: 6px 10px; border: 1px solid var(--line); background: transparent; color: var(--fg); border-radius: 8px; font-family: inherit; }
.bas { border-top: 1px solid var(--line); padding-top: 10px; }
.bhead { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
.bhead h3 { margin: 0; font-size: .74rem; font-weight: 800; }
.bhead em { font-style: normal; font-size: .6rem; color: var(--muted); }
.dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
.rail { display: flex; gap: 8px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 6px; scrollbar-width: none; }
.rail::-webkit-scrollbar { display: none; }
.preset { flex: 0 0 calc(50% - 4px); scroll-snap-align: start; display: flex; flex-direction: column; gap: 3px; padding: 4px; text-align: left; border: 1px solid var(--line); background: var(--bg); border-radius: 10px; color: var(--fg); font-family: inherit; }
.preset.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--bg)); }
.preset b { font-size: .68rem; font-weight: 500; }
.preset i { font-size: .58rem; color: var(--muted); font-style: normal; }
.pvic { height: 78px; border-radius: 7px; background: var(--sunk); display: grid; place-items: center; color: var(--muted); font-size: 1rem; }
.preset.on .pvic { background: color-mix(in srgb, var(--accent) 25%, var(--sunk)); color: #fff; }
.err { font-size: .72rem; color: var(--danger); }
@media (min-width: 820px) {
  .bas { border-top: 0; padding-top: 0; }
  .rail { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; overflow: visible; }
  .preset { flex: none; }
  .pvic { height: 52px; }
}
</style>
