<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import ProductCard from '@/components/ProductCard.vue';
import { useRoute, useRouter } from 'vue-router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const products = ref<Product[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const route = useRoute();
const router = useRouter();

const fetchProducts = async (page: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/products?page=${page}&limit=9`);
    products.value = response.data.products;
    currentPage.value = response.data.currentPage;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

onMounted(() => {
  const page = parseInt(route.query.page as string) || 1;
  fetchProducts(page);
});

watch(() => route.query.page, (newPage) => {
  const page = parseInt(newPage as string) || 1;
  fetchProducts(page);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    router.push({ query: { page: page.toString() } });
  }
};
</script>

<template>
  <div class="products-view p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 border-b-2 pb-2">Our Products</h1>

    <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
    <p v-else class="text-gray-600 text-center py-8">No products available.</p>

    <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{'bg-blue-700': page === currentPage, 'bg-blue-500': page !== currentPage}"
        class="px-4 py-2 text-white rounded-md hover:bg-blue-600"
      >
        {{ page }}
      </button>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>
