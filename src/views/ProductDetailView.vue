<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { formatRupiah } from '@/utils/format'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  link?: string // Add link field
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
</script>

<template>
  <div class="product-detail-view bg-background-light min-h-screen p-4 md:p-8">
    <!-- Back Button - Always visible, icon on small screens, text on large -->
    <div class="mb-6">
      <button
        @click="$router.back()"
        class="bg-secondary-black hover:bg-primary-black text-text-dark font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105 border border-border-color"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Back to Products
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div
        class="spinner-border animate-spin inline-block w-10 h-10 border-4 rounded-full"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div
      v-else-if="error"
      class="text-center py-12 text-primary-red bg-secondary-black p-6 rounded-lg shadow-md border border-border-color"
    >
      {{ error }}
    </div>
    <div
      v-else-if="product"
      class="bg-secondary-black rounded-xl shadow-lg overflow-hidden animate-fade-in-up border border-border-color"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
        <!-- Product Image Gallery (Single Image for now) -->
        <div
          class="lg:col-span-1 flex justify-center items-center p-4 bg-primary-black rounded-lg shadow-inner border border-border-color mb-6 lg:mb-0"
        >
          <img
            :src="`${product.image}`"
            :alt="product.name"
            class="max-w-full h-auto object-contain rounded-lg transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        <!-- Product Details -->
        <div class="lg:col-span-1 flex flex-col justify-between">
          <div>
            <h1
              class="text-4xl md:text-5xl font-extrabold text-text-light mb-3 leading-tight animate-fade-in-up"
              style="animation-delay: 0.1s"
            >
              {{ product.name }}
            </h1>
            <p
              class="text-text-dark text-lg leading-relaxed mb-6 animate-fade-in-up"
              style="animation-delay: 0.2s"
            >
              {{ product.description }}
            </p>

            <div class="flex items-baseline mb-8 animate-fade-in-up" style="animation-delay: 0.3s">
              <span class="text-2xl md:text-5xl font-extrabold text-primary-red">{{
                formatRupiah(product.price)
              }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-auto animate-fade-in-up"
            style="animation-delay: 0.4s"
          >
            <a
              v-if="product.link"
              :href="product.link"
              target="_blank"
              class="bg-primary-red hover:bg-white text-black font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-center shadow-lg w-full"
            >
              Go to Link
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center py-12 bg-secondary-black p-6 rounded-lg shadow-md border border-border-color"
    >
      Product not found.
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
