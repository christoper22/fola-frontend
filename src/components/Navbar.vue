<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <nav class="bg-red-600 p-4 shadow-lg border-b border-border-color" v-if="!authStore.isAdmin">
    <div class="container mx-auto flex justify-between items-center">
      <RouterLink to="/" class="text-white text-2xl font-bold">Fola Store</RouterLink>
      <div class="block lg:hidden">
        <button @click="toggleMenu" class="text-white focus:outline-none relative w-8 h-8">
          <span class="sr-only">Open main menu</span>
          <div
            class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <span
              aria-hidden="true"
              class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
              :class="{ 'rotate-45': isOpen, ' -translate-y-1.5': !isOpen }"
            ></span>
            <span
              aria-hidden="true"
              class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
              :class="{ 'opacity-0': isOpen }"
            ></span>
            <span
              aria-hidden="true"
              class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
              :class="{ '-rotate-45': isOpen, ' translate-y-1.5': !isOpen }"
            ></span>
          </div>
        </button>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <RouterLink
            to="/"
            class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-primary-red mr-4 transition-colors duration-200"
            >Home</RouterLink
          >
          <RouterLink
            to="/products"
            class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-primary-red mr-4 transition-colors duration-200"
            >Products</RouterLink
          >
          <RouterLink
            to="/contact"
            class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-primary-red transition-colors duration-200"
            >Contact</RouterLink
          >
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition-opacity ease-linear duration-300"
      leave-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="toggleMenu"
        class="fixed inset-0 bg-primary-black bg-opacity-70 z-40 lg:hidden"
      ></div>
    </transition>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-in-out duration-300 transform"
      leave-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed inset-y-0 left-0 w-64 bg-red-600 p-4 z-50 lg:hidden shadow-lg"
      >
        <div class="flex justify-end mb-4">
          <button @click="toggleMenu" class="text-white focus:outline-none">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div class="text-sm flex flex-col space-y-2">
          <RouterLink
            to="/"
            class="block py-2 px-4 rounded text-white hover:bg-secondary-black hover:text-primary-red"
            @click="toggleMenu"
            >Home</RouterLink
          >
          <RouterLink
            to="/products"
            class="block py-2 px-4 rounded text-white hover:bg-secondary-black hover:text-primary-red"
            @click="toggleMenu"
            >Products</RouterLink
          >
          <RouterLink
            to="/contact"
            class="block py-2 px-4 rounded text-white hover:bg-secondary-black hover:text-primary-red"
            @click="toggleMenu"
            >Contact</RouterLink
          >
        </div>
      </div>
    </transition>
  </nav>
</template>
