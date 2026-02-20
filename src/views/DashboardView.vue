<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '@/components/ProductCard.vue';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const totalProducts = ref(0);
const visitorCount = ref(0);
const latestProducts = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/dashboard/public');
    totalProducts.value = response.data.totalProducts;
    visitorCount.value = response.data.visitorCount;
    latestProducts.value = response.data.latestProducts;
  } catch (err) {
    error.value = 'Failed to load dashboard data.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="dashboard-view p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 border-b-2 pb-2">Public Dashboard</h1>

    <div v-if="loading" class="text-center py-8">Loading dashboard data...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-100 p-6 rounded-lg shadow-md text-center">
          <h2 class="text-2xl font-semibold text-blue-800">Total Products</h2>
          <p class="text-5xl font-bold text-blue-600 mt-2">{{ totalProducts }}</p>
        </div>
        <div class="bg-green-100 p-6 rounded-lg shadow-md text-center">
          <h2 class="text-2xl font-semibold text-green-800">Mock Visitor Counter</h2>
          <p class="text-5xl font-bold text-green-600 mt-2">{{ visitorCount }}</p>
        </div>
        <div class="bg-purple-100 p-6 rounded-lg shadow-md text-center">
          <h2 class="text-2xl font-semibold text-purple-800">Latest Products</h2>
          <p class="text-5xl font-bold text-purple-600 mt-2">{{ latestProducts.length }}</p>
        </div>
      </div>

      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-4 border-b-2 pb-2">Latest Products</h2>
        <div v-if="latestProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in latestProducts" :key="product.id" :product="product" />
        </div>
        <p v-else class="text-gray-600">No latest products to display.</p>
      </section>
    </div>
  </div>
</template>
