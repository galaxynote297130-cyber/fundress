<script setup lang="ts">
// Fenêtre d'inscription / connexion
const { authOpen, login, register } = useAccount()
const config = useRuntimeConfig()

const email = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const loading = ref(false)

const isRegister = computed(() => authOpen.value === 'register')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (isRegister.value) await register(email.value, password.value, name.value)
    else await login(email.value, password.value)
    password.value = ''
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
function close() { authOpen.value = false; error.value = '' }
</script>

<template>
  <div v-if="authOpen" class="modal" @click.self="close">
    <form class="sheet" @submit.prevent="submit">
      <div class="tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="!isRegister" @click="authOpen = 'login'; error = ''">Connexion</button>
        <button type="button" role="tab" :aria-selected="isRegister" @click="authOpen = 'register'; error = ''">Inscription</button>
      </div>

      <p v-if="isRegister" class="gift">5 crédits offerts à l'inscription</p>

      <a v-if="config.public.googleLogin" class="google" href="/auth/google">
        <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        Continuer avec Google
      </a>
      <div v-if="config.public.googleLogin" class="or"><span>ou</span></div>

      <label v-if="isRegister" class="field">
        <span>Prénom</span>
        <input id="auth-name" v-model="name" type="text" autocomplete="given-name" placeholder="Gaël">
      </label>
      <label class="field">
        <span>Email</span>
        <input id="auth-email" v-model="email" type="email" autocomplete="email" inputmode="email" required placeholder="toi@exemple.com">
      </label>
      <label class="field">
        <span>Mot de passe</span>
        <input id="auth-password" v-model="password" type="password" :autocomplete="isRegister ? 'new-password' : 'current-password'" required minlength="8" placeholder="8 caractères minimum">
      </label>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <button class="submit" type="submit" :disabled="loading">
        {{ loading ? 'Un instant…' : isRegister ? 'Créer mon compte' : 'Se connecter' }}
      </button>
      <button class="close" type="button" @click="close">Fermer</button>
    </form>
  </div>
</template>

<style scoped>
.modal { position: fixed; inset: 0; z-index: 40; background: rgba(8, 10, 16, .55); display: flex; align-items: flex-end; justify-content: center; }
.sheet { width: 100%; max-width: 440px; background: var(--surface); border-radius: 18px 18px 0 0; padding: 18px max(16px, env(safe-area-inset-right, 0px)) calc(18px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); display: flex; flex-direction: column; gap: 12px; max-height: 92dvh; overflow-y: auto; }
@media (min-width: 600px) { .modal { align-items: center; } .sheet { border-radius: 18px; padding: 22px; } }
.tabs { display: grid; grid-template-columns: 1fr 1fr; background: var(--sunk); border-radius: 12px; padding: 4px; gap: 4px; }
.tabs button { min-height: 42px; border: 0; border-radius: 9px; background: transparent; font-weight: 600; }
.tabs button[aria-selected="true"] { background: var(--surface); box-shadow: 0 1px 3px rgba(0, 0, 0, .15); }
.gift { margin: 0; text-align: center; font-size: .9rem; font-weight: 600; color: var(--accent-ink); background: color-mix(in srgb, var(--accent) 30%, var(--surface)); border-radius: 10px; padding: 8px; }
.google { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; border: 1px solid var(--line); border-radius: 12px; color: var(--fg); text-decoration: none; font-weight: 600; background: var(--surface); }
.or { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: .85rem; }
.or::before, .or::after { content: ""; flex: 1; height: 1px; background: var(--line); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field span { font-size: .85rem; font-weight: 600; color: var(--muted); }
.field input { min-height: 48px; border: 1px solid var(--line); border-radius: 12px; background: var(--bg); padding: 0 12px; font-size: 16px; }
.error { margin: 0; color: var(--danger); font-size: .9rem; }
.submit { min-height: 50px; border: 0; border-radius: 12px; background: var(--accent); color: var(--accent-ink); font-weight: 700; font-size: 1.05rem; }
.close { min-height: 42px; border: 0; background: none; color: var(--muted); }
</style>
