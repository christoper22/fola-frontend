<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const productId = route.params.id
    const response = await axios.get(`http://localhost:5000/api/products/${productId}`)
    product.value = response.data
  } catch (err) {
    error.value = 'Failed to load product details.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const contactSeller = () => {
  alert('Contact seller functionality would be implemented here!')
  // In a real application, this would navigate to a contact form
  // or open a modal with contact information.
}
</script>

<template>
  <div class="product-detail-view p-6 bg-white shadow-md rounded-lg">
    <div v-if="loading" class="text-center py-8">Loading product...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="md:col-span-1">
        <img
          :src="`/uploads/products/${product.image}`"
          :alt="product.name"
          class="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>
      <div class="md:col-span-1">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">{{ product.name }}</h1>
        <p class="text-gray-600 text-lg mb-6">{{ product.description }}</p>
        <div class="flex items-baseline mb-6">
          <span class="text-5xl font-extrabold text-blue-600">${{ product.price.toFixed(2) }}</span>
        </div>
        <button
          @click="contactSeller"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Contact Seller
        </button>
      </div>
    </div>
    <div v-else class="text-center py-8">Product not found.</div>
  </div>
</template>
