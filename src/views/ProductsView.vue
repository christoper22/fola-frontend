<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'
import { useRoute, useRouter } from 'vue-router'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  link?: string // Add link field
}

const products = ref<Product[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('') // Add searchQuery ref
const loading = ref(true) // Add loading state

const route = useRoute()
const router = useRouter()

const fetchProducts = async (page: number, search: string = '') => {
  loading.value = true // Set loading to true before fetching
  try {
    const response = await axios.get(
      `http://localhost:5000/api/products?page=${page}&limit=9&name=${search}`,
    )
    products.value = response.data.products
    currentPage.value = response.data.currentPage
    totalPages.value = response.data.totalPages
  } catch (error) {
    products.value = []
    currentPage.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false // Set loading to false after fetching
  }
}

onMounted(() => {
  const page = parseInt(route.query.page as string) || 1
  searchQuery.value = (route.query.name as string) || '' // Initialize searchQuery from route
  fetchProducts(page, searchQuery.value)
})

watch(
  () => route.query,
  (newQuery) => {
    const page = parseInt(newQuery.page as string) || 1
    searchQuery.value = (newQuery.name as string) || ''
    fetchProducts(page, searchQuery.value)
  },
)

const searchProducts = () => {
  router.push({ query: { page: '1', name: searchQuery.value } })
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    router.push({ query: { page: page.toString(), name: searchQuery.value } })
  }
}
</script>

<template>
  <div class="products-view p-6 bg-background-light min-h-screen">
    <h1 class="text-text-light text-4xl font-bold mb-8 text-center">Our Products</h1>

    <div class="mb-8 relative max-w-xl mx-auto">
      <div class="flex shadow-md rounded-lg overflow-hidden border border-border-color">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchProducts"
          placeholder="Search products by name..."
          class="flex-grow p-3 border-none focus:outline-none focus:ring-2 focus:ring-primary-red text-text-light bg-primary-black"
        />
        <button
          @click="searchProducts"
          class="bg-primary-red hover:bg-secondary-red text-text-light font-bold py-3 px-6 transition duration-300"
        >
          Search
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div
      v-else-if="products.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <ProductCard
        v-for="(product, index) in products"
        :key="product.id"
        :product="product"
        class="animate-fade-in-up"
        :style="{ 'animation-delay': `${0.1 + index * 0.05}s` }"
      />
    </div>
    <p v-else class="text-text-dark text-center py-8 bg-secondary-black p-6 rounded-lg shadow-md">
      No products available.
    </p>

    <div
      v-if="totalPages > 1"
      class="flex justify-center mt-12 space-x-2 animate-fade-in-up"
      style="animation-delay: 0.5s"
    >
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-primary-red text-text-light rounded-md hover:bg-secondary-red disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 border border-border-color"
      >
        Previous
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ 'bg-secondary-red': page === currentPage, 'bg-primary-red': page !== currentPage }"
        class="px-4 py-2 text-text-light rounded-md hover:bg-secondary-red transition duration-300 border border-border-color"
      >
        {{ page }}
      </button>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-primary-red text-text-light rounded-md hover:bg-secondary-red disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 border border-border-color"
      >
        Next
      </button>
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
