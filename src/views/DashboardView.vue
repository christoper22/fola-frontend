<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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

const animatedTotalProducts = ref(0);
const animatedVisitorCount = ref(0);

const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    callback(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

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

watch(totalProducts, (newValue) => {
  animateValue(0, newValue, 1000, (value) => (animatedTotalProducts.value = value));
});

watch(visitorCount, (newValue) => {
  animateValue(0, newValue, 1000, (value) => (animatedVisitorCount.value = value));
});
</script>

<template>
  <div class="dashboard-view p-6 bg-gray-50 min-h-screen">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Public Dashboard</h1>

    <div v-if="loading" class="text-center py-10">
      <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-100 p-4 rounded-lg">{{ error }}</div>
    <div v-else class="space-y-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Total Products Card -->
        <div
          class="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
          style="animation-delay: 0.1s"
        >
          <h2 class="text-2xl font-semibold text-gray-700">Total Products</h2>
          <p class="text-5xl font-bold text-blue-600 mt-2 animate-count-up">{{ animatedTotalProducts }}</p>
        </div>
        <!-- Visitor Counter Card -->
        <div
          class="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
          style="animation-delay: 0.2s"
        >
          <h2 class="text-2xl font-semibold text-gray-700">Mock Visitor Counter</h2>
          <p class="text-5xl font-bold text-green-600 mt-2 animate-count-up">{{ animatedVisitorCount }}</p>
        </div>
        <!-- Latest Products Card -->
        <div
          class="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
          style="animation-delay: 0.3s"
        >
          <h2 class="text-2xl font-semibold text-gray-700">Latest Products</h2>
          <p class="text-5xl font-bold text-purple-600 mt-2">{{ latestProducts.length }}</p>
        </div>
      </div>

      <section class="animate-fade-in-up" style="animation-delay: 0.4s">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Latest Products</h2>
        <div v-if="latestProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard
            v-for="(product, index) in latestProducts"
            :key="product.id"
            :product="product"
            class="animate-fade-in-up"
            :style="{ 'animation-delay': `${0.5 + index * 0.1}s` }"
          />
        </div>
        <p v-else class="text-gray-600 bg-white p-6 rounded-lg shadow-md">No latest products to display.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.spinner-border {
  border-color: transparent;
  border-top-color: #3498db;
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