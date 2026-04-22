<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const router = useRouter();
const auth   = useAuthStore();

const mode     = ref("login");
const name     = ref("");
const email    = ref("");
const password = ref("");
const error    = ref(null);
const loading  = ref(false);

const title = computed(() => mode.value === "login" ? "Sign in" : "Create account");

async function submit() {
  error.value   = null;
  loading.value = true;
  try {
    if (mode.value === "login") {
      await auth.login(email.value, password.value);
    } else {
      await auth.register(name.value, email.value, password.value);
    }
    router.push(auth.isAdmin ? "/admin" : "/my-courses");
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Something went wrong.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="section">
    <div class="container narrow" style="max-width:480px">
      <div class="section-head">
        <span class="eyebrow">Auth</span>
        <h1>{{ title }}</h1>
      </div>

      <div class="card">
        <form @submit.prevent="submit" class="stack">
          <label v-if="mode === 'register'" class="field">
            <span class="small">Full name</span>
            <input v-model="name" class="input" type="text" placeholder="Dr Christopher Appiah-Thompson" required />
          </label>
          <label class="field">
            <span class="small">Email</span>
            <input v-model="email" class="input" type="email" placeholder="admin@myworldclass.org" required />
          </label>
          <label class="field">
            <span class="small">Password</span>
            <input v-model="password" class="input" type="password" placeholder="••••••••" required />
          </label>

          <p v-if="error" class="alert">{{ error }}</p>

          <button class="btn primary" type="submit" :disabled="loading">
            {{ loading ? "Please wait…" : title }}
          </button>
        </form>

        <p class="small" style="margin-top:16px;text-align:center">
          <template v-if="mode === 'login'">
            No account?
            <button class="btn-text" @click="mode = 'register'">Create one</button>
          </template>
          <template v-else>
            Have an account?
            <button class="btn-text" @click="mode = 'login'">Sign in</button>
          </template>
        </p>

        <div class="hint-box">
          <p class="small" style="margin:0"><strong>Admin credentials</strong><br>
          Email: admin@myworldclass.org<br>Password: admin123</p>
        </div>
      </div>
    </div>
  </section>
</template>
