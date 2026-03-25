<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { formatRupiah } from '@/utils/format'
import { API_URL } from '@/config'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'

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

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedSize = ref<string | null>(null)
const cartStore = useCartStore()

onMounted(async () => {
  try {
    const productId = route.params.id
    const response = await axios.get(`${API_URL}/api/products/${productId}`)
    product.value = response.data
    if (product.value?.sizes && product.value.sizes.length > 0) {
      selectedSize.value = product.value.sizes[0].name
    }
  } catch (err) {
    error.value = 'Failed to load product details.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const addToCart = () => {
  if (product.value && selectedSize.value) {
    cartStore.addItem(
      {
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.image,
      },
      selectedSize.value,
    )
    Swal.fire({
      title: 'Success!',
      text: `${product.value.name} has been added to your cart.`,
      icon: 'success',
      confirmButtonText: 'OK'
    })
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'Please select a size.',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}
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
            d="M10 19l-7-7m0 0ll7 7m-7 7h18"
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
            v-if="product.image"
            :src="`${API_URL}${product.image}`"
            :alt="product.name"
            class="max-w-full h-auto object-contain rounded-lg transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        <!-- Product Details -->
        <div class="lg:col-span-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center space-x-3 mb-2 animate-fade-in-up" style="animation-delay: 0.1s">
                <span class="text-sm bg-gray-600 font-medium text-white px-3 py-1 rounded-full uppercase tracking-wider">{{ product.category?.name || 'Uncategorized' }}</span>
            </div>

            <h1
              class="text-4xl md:text-5xl font-extrabold text-text-light mb-4 leading-tight animate-fade-in-up"
              style="animation-delay: 0.2s"
            >
              {{ product.name }}
            </h1>

            <div v-if="product.sizes && product.sizes.length > 0" class="mb-6 animate-fade-in-up" style="animation-delay: 0.3s">
                <h3 class="text-text-light text-sm font-bold mb-2 uppercase tracking-wide">Select Size</h3>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="size in product.sizes"
                        :key="size.id"
                        @click="selectedSize = size.name"
                        :class="[
                            'border border-border-color px-4 py-2 rounded shadow-sm transition-colors duration-200',
                            selectedSize === size.name
                                ? 'bg-primary-red text-orange-400'
                                : 'bg-primary-black text-text-dark hover:bg-gray-700'
                        ]"
                    >
                        {{ size.name }}
                    </button>
                </div>
            </div>

            <p
              class="text-text-dark text-lg leading-relaxed mb-6 animate-fade-in-up"
              style="animation-delay: 0.4s"
            >
              {{ product.description }}
            </p>

            <div class="flex items-baseline mb-8 animate-fade-in-up" style="animation-delay: 0.5s">
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
            <button
                @click="addToCart"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-center shadow-lg w-full"
            >
                Add to Cart
            </button>
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
