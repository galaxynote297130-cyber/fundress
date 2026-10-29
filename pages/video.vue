<template>
  <div class="ed-app">
    <RubriquesTabs />
    <div class="ed-wrap">
      <div class="psplit">
        <div class="pstage">
          <label v-if="!src" class="pdrop">
            <input type="file" accept="image/*" hidden @change="upload" />
            Choisir une photo
          </label>
          <div v-else>
            <img :src="src" alt="" class="pframe" />
            <button class="pclear" @click="reset">Changer</button>
          </div>
          <video v-if="out" :src="out" controls autoplay loop playsinline class="pframe" />
          <div v-if="busy" class="pwait">
            <span>Génération en cours · {{ restant }} s</span>
            <button class="pcancel" @click="cancel">Annuler et rembourser</button>
          </div>
        </div>
        <VideoPanel v-model:duration="duration" v-model:move="move" :can="!!src && !busy" :busy="busy" @run="run" />
      </div>
      <p v-if="error" class="perr">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Édition vidéo — Fundress', link: [{ rel: 'stylesheet', href: '/editor.css' }] })

const src = ref('')
const out = ref('')
const duration = ref(5)
const move = ref('lent')
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
  busy.value = true
  error.value = ''
  stop = false
  restant.value = 240
  try {
    const { id, download } = await $fetch<{ id: string; download: string }>('/api/video', {
      method: 'POST',
      body: { image: src.value, duration: duration.value, move: move.value }
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
