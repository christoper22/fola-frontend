<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

const props = defineProps<{
  product: Product
}>()

const truncateDescription = (description: string, length: number) => {
  return description?.length > length ? description.substring(0, length) + '...' : description
}
</script>

<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <img
      :src="`/uploads/products/${product.image}`"
      :alt="product.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm mb-3">{{ truncateDescription(product.description, 100) }}</p>
      <div class="flex justify-between items-center">
        <span class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
        <RouterLink
          :to="`/products/${product.id}`"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          View Details
        </RouterLink>
      </div>
    </div>
  </div>
</template>
