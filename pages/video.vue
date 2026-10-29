<template>
  <div class="page">
    <RubriquesTabs />
    <div class="split">
      <div class="stage">
        <label v-if="!src" class="drop">
          <input type="file" accept="image/*" hidden @change="upload" />
          Choisir une photo
        </label>
        <div v-else class="frame">
          <img :src="src" alt="" />
          <button class="clear" @click="reset">Changer</button>
        </div>
        <video v-if="out" :src="out" controls autoplay loop playsinline class="frame" />
      </div>
      <VideoPanel v-model:duration="duration" v-model:move="move" :can="!!src && !busy" :busy="busy" @run="run" />
    </div>
    <p v-if="error" class="err">{{ error }}</p>
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
  try {
    const { id, download } = await $fetch<{ id: string; download: string }>('/api/video', {
      method: 'POST',
      body: { image: src.value, duration: duration.value, move: move.value }
    })
    await poll(id, download)
  } catch (e: any) {
    error.value = e?.data?.message || 'La génération a échoué.'
  } finally {
    busy.value = false
  }
}

async function poll(id: string, download: string) {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 4000))
    const s = await $fetch<{ status: string; url?: string }>('/api/video/status', {
      method: 'POST',
      body: { id, download }
    })
    if (s.status === 'done' && s.url) { out.value = s.url; return }
    if (s.status === 'failed') throw new Error('failed')
  }
  throw new Error('timeout')
}
</script>
