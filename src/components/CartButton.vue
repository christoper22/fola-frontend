<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { RouterLink } from 'vue-router'

const cartStore = useCartStore()
</script>

<template>
  <RouterLink
    to="/cart"
    class="fixed bottom-4 right-4 bg-primary-red text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 ease-in-out z-50"
  >
    <svg
      class="w-6 h-6 md:w-8 md:h-8 text-black"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      ></path>
    </svg>
    <span
      v-if="cartStore.totalItems > 0"
      class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-green-500 rounded-full"
      >{{ cartStore.totalItems }}</span
    >
  </RouterLink>
</template>
