<script setup lang="ts">
// En-tête : crédits + compte (ou boutons de connexion)
const { me, loaded, authOpen, buyOpen, logout } = useAccount()
const menu = ref(false)
</script>

<template>
  <div class="bar">
    <template v-if="loaded && me">
      <button class="credits" title="Recharger des crédits" @click="buyOpen = true">
        <span class="coin" />
        <b>{{ me.credits }}</b>
        <span class="plus">+</span>
      </button>
      <div class="acct">
        <button class="avatar" :aria-expanded="menu" aria-label="Mon compte" @click="menu = !menu">
          {{ (me.name || me.email).charAt(0).toUpperCase() }}
        </button>
        <div v-if="menu" class="menu" @click="menu = false">
          <p class="who"><strong>{{ me.name }}</strong><small>{{ me.email }}</small></p>
          <button @click="buyOpen = true">Acheter des crédits</button>
          <button @click="logout">Se déconnecter</button>
        </div>
      </div>
    </template>
    <template v-else-if="loaded">
      <button class="link" @click="authOpen = 'login'">Connexion</button>
      <button class="cta" @click="authOpen = 'register'">S'inscrire</button>
    </template>
  </div>
</template>

<style scoped>
.bar { display: flex; align-items: center; gap: 8px; }
.credits { display: flex; align-items: center; gap: 6px; min-height: 38px; padding: 0 4px 0 10px; border-radius: 99px; border: 1px solid var(--line); background: var(--surface); }
.credits b { font-variant-numeric: tabular-nums; }
.coin { width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #ffe08a, var(--accent)); box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--accent) 60%, #000 10%); }
.plus { width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: var(--accent-ink); display: grid; place-items: center; font-weight: 700; }
.acct { position: relative; }
.avatar { width: 38px; height: 38px; border-radius: 50%; border: 0; background: var(--mask); color: #fff; font-weight: 700; }
.menu { position: absolute; right: 0; top: 46px; z-index: 30; min-width: 220px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, .18); padding: 6px; display: flex; flex-direction: column; }
.who { margin: 0; padding: 8px 10px; display: flex; flex-direction: column; border-bottom: 1px solid var(--line); margin-bottom: 4px; }
.who small { color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
.menu button { text-align: left; border: 0; background: none; padding: 10px; border-radius: 8px; min-height: 42px; }
.menu button:hover { background: var(--sunk); }
.link { border: 0; background: none; min-height: 38px; padding: 0 8px; font-weight: 500; }
.cta { min-height: 38px; padding: 0 14px; border: 0; border-radius: 99px; background: var(--fg); color: var(--bg); font-weight: 600; }
</style>
