<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ main: any; busy: boolean; shown: any }>()
defineEmits<{ file: [File]; remove: []; save: [] }>()

const over = ref(false)
const input = ref<HTMLInputElement | null>(null)

function pick(e: Event) {
  const el = e.target as HTMLInputElement
  const f = el.files?.[0]
  if (f) emit('file', f)
  el.value = ''
}
const emit = defineEmits<{ file: [File]; remove: []; save: [] }>()

function drop(e: DragEvent) {
  over.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) emit('file', f)
}
</script>

<template>
  <section class="stage" :class="{ over }" @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="drop">
    <template v-if="!main">
      <div class="zone">
        <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.4" class="ico"><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M4 17l5-5 4 4 3-2.5 4 3.5" /></svg>
        <button class="up" type="button" @click="input?.click()">Télécharger une image</button>
        <p>JPG, PNG ou WebP</p>
        <input ref="input" type="file" accept="image/*" class="sr" @change="pick">
      </div>
    </template>

    <div v-else class="paire">
      <div class="cadre">
        <img :src="main.url" alt="Ta photo">
        <button class="trash" type="button" title="Retirer" @click="$emit('remove')">✕</button>
      </div>
      <div class="cadre res" :class="{ done: shown }">
        <img v-if="shown" :src="shown.url" alt="Résultat">
        <span v-else class="wait">Résultat</span>
        <button v-if="shown && !busy" class="dl" type="button" @click="$emit('save')">Télécharger</button>
        <div v-if="busy" class="busy"><span><i class="dot" />En cours…</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);min-height:240px;padding:12px;display:grid;place-items:center}
.stage.over{border-color:var(--accent)}
.zone{display:flex;flex-direction:column;align-items:center;gap:9px;text-align:center}
.ico{color:var(--muted);opacity:.7}
.up{border:0;border-radius:99px;background:var(--accent);color:var(--accent-ink);font-weight:800;font-size:.82rem;padding:11px 20px}
.zone p{margin:0;font-size:.68rem;color:var(--muted)}
.paire{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}
.cadre{position:relative;aspect-ratio:3/4;border-radius:10px;overflow:hidden;background:var(--sunk);display:grid;place-items:center}
.cadre.res{border:1px solid var(--line)}
.cadre.res.done{border-color:var(--accent)}
.cadre img{width:100%;height:100%;object-fit:contain;display:block}
.wait{font-size:.74rem;color:var(--muted)}
.trash{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:0;background:#e5484d;color:#fff;font-size:.8rem;font-weight:700}
.dl{position:absolute;left:8px;right:8px;bottom:8px;min-height:36px;border:0;border-radius:9px;background:var(--accent);color:var(--accent-ink);font-weight:700;font-size:.78rem}
.busy{position:absolute;inset:0;display:grid;place-items:center;background:color-mix(in srgb,var(--sunk) 55%,transparent);backdrop-filter:blur(3px)}
.busy span{background:var(--surface);border:1px solid var(--line);padding:9px 14px;border-radius:99px;display:flex;gap:8px;align-items:center;font-size:.78rem}
.dot{width:10px;height:10px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite}
@keyframes pulse{50%{opacity:.25}}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);opacity:0}
</style>
