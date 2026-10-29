<script setup lang="ts">
import { ref } from 'vue'
import { POSES } from '~/utils/poses'

defineProps<{ chosen: string }>()
defineEmits<{ choose: [string] }>()

const broken = ref<Record<string, boolean>>({})
const gradients = [
  'linear-gradient(150deg,#6b5443,#241c16)', 'linear-gradient(150deg,#4b4b52,#1d1d20)',
  'linear-gradient(150deg,#6b4a4a,#231818)', 'linear-gradient(150deg,#5c5c48,#20201a)',
  'linear-gradient(150deg,#4a4356,#1b1922)',
]
</script>

<template>
  <aside class="bloc" aria-label="Scènes">
    <span class="head">Scènes</span>
    <div class="liste">
      <button
        v-for="(p, i) in POSES" :key="p.id" type="button" class="sc"
        :class="{ on: chosen === p.id }" @click="$emit('choose', p.id)"
      >
        <span class="thumb" :style="{ background: gradients[i % gradients.length] }">
          <img v-if="!broken[p.id]" :src="`/poses/${p.id}.webp`" :alt="p.label" loading="lazy" decoding="async" @error="broken[p.id] = true">
        </span>
        <span class="nom">{{ p.label }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.bloc{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:8px;display:flex;flex-direction:column;gap:6px}
.head{font-size:.6rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--accent)}
.liste{display:flex;gap:7px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding-bottom:2px}
.liste::-webkit-scrollbar{display:none}
.sc{flex:0 0 104px;scroll-snap-align:start;display:flex;flex-direction:column;gap:4px;background:none;border:0;padding:0;font-family:inherit;cursor:pointer}
.thumb{aspect-ratio:1/1;border-radius:8px;overflow:hidden;border:1px solid transparent;display:block;background:var(--sunk)}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.sc.on .thumb{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.nom{font-size:.56rem;color:var(--muted);text-align:center;line-height:1.2}
.sc.on .nom{color:var(--accent);font-weight:700}
@media(min-width:820px){
  .bloc{padding:10px;gap:8px}
  .liste{flex-direction:column;gap:8px;overflow-x:visible;overflow-y:auto;max-height:calc(100dvh - 220px);scroll-snap-type:y proximity}
  .sc{flex:1 1 auto;scroll-snap-align:start}
  .nom{font-size:.58rem}
}
</style>
