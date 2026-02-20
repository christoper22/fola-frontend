<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/admin/dashboard')
  }
}
</script>

<template>
  <div
    class="admin-login-view relative flex items-center justify-center w-full h-screen overflow-hidden bg-gray-300"
  >
    <!-- Background Image without Animation -->
    <div
      class="absolute inset-0 z-0 bg-cover bg-center"
      style="
        background-image: url('https://images.unsplash.com/photo-1581092335400-f112208b123e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80');
      "
    ></div>

    <!-- Overlay for Readability -->
    <div class="absolute inset-0 z-10 bg-primary-black bg-opacity-70"></div>

    <!-- Login Form Container -->
    <div
      class="relative z-20 bg-secondary-black p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105"
    >
      <h1 class="text-3xl font-bold text-text-light mb-6 text-center">Admin Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-text-dark text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-text-dark text-sm font-bold mb-2"
            >Password:</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="bg-primary-red hover:bg-secondary-red text-text-light font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p v-if="authStore.error" class="mt-4 text-primary-red text-center">{{ authStore.error }}</p>
    </div>
  </div>
</template>
