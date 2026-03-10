<script setup lang="ts">
import { formatRupiah } from '@/utils/format'
import { RouterLink } from 'vue-router'
import { API_URL } from '@/config'

interface Category {
  id: number
  name: string
}

interface Size {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  link?: string // Add link field
  category?: Category
  sizes?: Size[]
}

const props = defineProps<{
  product: Product
}>()

const truncateDescription = (description: string, length: number) => {
  return description?.length > length ? description.substring(0, length) + '...' : description
}
</script>

<template>
  <div
    class="bg-secondary-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer border border-border-color"
  >
    <RouterLink :to="`/products/${product.id}`" class="block group">
      <!-- Added group class -->
      <div class="relative overflow-hidden">
        <img
          v-if="product.image"
          :src="`${API_URL}${product.image}`"
          :alt="product.name"
          class="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <div
          class="absolute inset-0 bg-gray-500 bg-opacity-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <span class="text-primary-red text-lg font-bold">View Details</span>
        </div>
      </div>
      <div class="p-4 flex flex-col h-full">
        <div class="flex justify-between items-start mb-1">
            <h3 class="text-text-light text-xl font-semibold">{{ product.name }}</h3>
            <span class="text-xs bg-gray-600 text-white px-2 py-1 rounded">{{ product.category?.name || 'Uncategorized' }}</span>
        </div>
        <div v-if="product.sizes && product.sizes.length > 0" class="flex flex-wrap gap-1 mb-2">
            <span v-for="size in product.sizes" :key="size.id" class="text-[10px] bg-primary-black border border-border-color text-text-dark px-1.5 py-0.5 rounded">{{ size.name }}</span>
        </div>
        <p class="text-text-dark text-sm mb-3 mt-1 flex-grow">
          {{ truncateDescription(product.description, 100) }}
        </p>
        <div class="flex justify-between items-center mt-auto pt-2 border-t border-border-color/30">
          <span class="text-primary-red text-2xl font-bold">{{ formatRupiah(product.price) }}</span>
        </div>
      </div>
    </RouterLink>
    <!-- Go to Link button, outside RouterLink to allow separate click -->
    <div v-if="product.link" class="p-4 pt-0 flex justify-end">
      <a
        :href="product.link"
        target="_blank"
        class="bg-primary-red hover:bg-secondary-red text-text-light p-2 rounded-full transition duration-300 shadow-md"
        aria-label="Go to Link"
        @click.stop
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
          />
          <path
            d="M5 5a2 1 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
          />
        </svg>
      </a>
    </div>
  </div>
</template>
