<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'

interface Company {
  name: string
  description: string
  logo?: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

const company = ref<Company>({ name: 'Loading...', description: 'Loading...' })
const latestProducts = ref<Product[]>([])

onMounted(async () => {
  try {
    const companyRes = await axios.get('http://localhost:5000/api/company')
    company.value = companyRes.data

    const productsRes = await axios.get('http://localhost:5000/api/products/latest')
    latestProducts.value = productsRes.data
  } catch (error) {
    console.error('Error fetching home data:', error)
  }
})
</script>

<template>
  <div class="home-view p-6 bg-white shadow-md rounded-lg">
    <div class="text-center mb-8">
      <img
        v-if="company?.logo"
        :src="`/uploads/products/${company.logo}`"
        :alt="company.name"
        class="mx-auto h-32 w-32 object-contain mb-4"
      />
      <h1 class="text-5xl font-extrabold text-gray-900 mb-2">{{ company?.name }}</h1>
      <p class="text-xl text-gray-600">{{ company?.description }}</p>
    </div>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-4 border-b-2 pb-2">About Us</h2>
      <p class="text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </section>

    <section>
      <h2 class="text-3xl font-bold text-gray-800 mb-4 border-b-2 pb-2">Featured Products</h2>
      <div
        v-if="latestProducts.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ProductCard v-for="product in latestProducts" :key="product.id" :product="product" />
      </div>
      <p v-else class="text-gray-600">No featured products available.</p>
    </section>
  </div>
</template>

<style scoped>
/* Add any specific styles for HomeView.vue here if needed */
</style>
