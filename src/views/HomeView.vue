<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'
import { RouterLink } from 'vue-router' // Import RouterLink

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
  link?: string // Ensure link is included if it exists
}

const company = ref<Company>({ name: 'Loading...', description: 'Loading...' })
const latestProducts = ref<Product[]>([])
const loading = ref(true) // Add loading state

onMounted(async () => {
  try {
    const companyRes = await axios.get('http://localhost:5000/api/company')
    company.value = companyRes.data

    const productsRes = await axios.get('http://localhost:5000/api/products/latest')
    latestProducts.value = productsRes.data
  } catch (error) {
    console.error('Error fetching home data:', error)
  } finally {
    loading.value = false // Set loading to false after data is fetched
  }
})
</script>

<template>
  <div class="home-view bg-background-light min-h-screen">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-primary-red to-secondary-red text-text-light py-20 px-6 text-center overflow-hidden"
    >
      <div
        class="absolute inset-0 z-0 opacity-30 animate-background-pan"
        style="
          background-image: url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80');
          background-size: cover;
          background-position: center;
        "
      ></div>
      <div class="relative z-10 container mx-auto animate-fade-in-up" style="animation-delay: 0.1s">
        <img
          v-if="company?.logo"
          :src="`${company.logo}`"
          :alt="company.name"
          class="mx-auto h-24 w-24 object-contain mb-4 rounded-full shadow-lg"
        />
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          {{ company?.name || 'Fola Company' }}
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {{ company?.description || 'Discover our amazing products and services.' }}
        </p>
        <RouterLink
          to="/products"
          class="bg-white text-primary-red hover:bg-primary-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Explore Products
        </RouterLink>
      </div>
    </section>

    <div class="container mx-auto p-6">
      <!-- About Us Section -->
      <section class="my-16 animate-fade-in-up" style="animation-delay: 0.3s">
        <h2 class="text-text-light text-4xl font-bold mb-6 text-center">About Us</h2>
        <div
          class="bg-secondary-black p-8 rounded-lg shadow-xl border border-border-color max-w-4xl mx-auto"
        >
          <p class="text-text-dark leading-relaxed text-lg text-center">
            Fola Company is dedicated to providing high-quality products that meet your everyday
            needs. We believe in innovation, customer satisfaction, and sustainable practices. Our
            mission is to enrich lives through exceptional products and unparalleled service. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="my-16 animate-fade-in-up" style="animation-delay: 0.5s">
        <h2 class="text-text-light text-4xl font-bold mb-8 text-center">Latest Products</h2>
        <div v-if="loading" class="text-center py-8">
          <div
            class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div
          v-else-if="latestProducts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <ProductCard
            v-for="(product, index) in latestProducts"
            :key="product.id"
            :product="product"
            class="animate-fade-in-up"
            :style="{ 'animation-delay': `${0.6 + index * 0.1}s` }"
          />
        </div>
        <p
          v-else
          class="text-text-dark text-center py-8 bg-secondary-black p-6 rounded-lg shadow-md border border-border-color"
        >
          No featured products available.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.spinner-border {
  border-color: transparent;
  border-top-color: var(--color-primary-red);
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
