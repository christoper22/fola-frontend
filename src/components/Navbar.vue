<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <nav class="bg-gray-800 p-4" v-if="!authStore.isAdmin">
    <div class="container mx-auto flex justify-between items-center">
      <RouterLink to="/" class="text-white text-2xl font-bold">Fola Company</RouterLink>
      <div class="block lg:hidden">
        <button @click="toggleMenu" class="text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div :class="{'block': isOpen, 'hidden': !isOpen}" class="w-full lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <RouterLink to="/" class="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">Home</RouterLink>
          <RouterLink to="/products" class="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">Products</RouterLink>
          <RouterLink to="/contact" class="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white">Contact</RouterLink>
        </div>
        <div v-if="!authStore.isAuthenticated">
          <RouterLink to="/admin/login" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0">Admin Login</RouterLink>
        </div>
        <div v-else>
          <button @click="authStore.logout()" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>
