<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

interface Product {
  id: number;
  name: string;
  createdAt: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const authStore = useAuthStore();
const totalProducts = ref(0);
const totalMessages = ref(0);
const latestProducts = ref<Product[]>([]);
const latestMessages = ref<Message[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const animatedTotalProducts = ref(0);
const animatedTotalMessages = ref(0);

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
    const response = await axios.get('http://localhost:5000/api/dashboard/admin', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    totalProducts.value = response.data.totalProducts;
    totalMessages.value = response.data.totalMessages;
    latestProducts.value = response.data.latestProducts;
    latestMessages.value = response.data.latestMessages;
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load admin dashboard data.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

watch(totalProducts, (newValue) => {
  animateValue(0, newValue, 1000, (value) => (animatedTotalProducts.value = value));
});

watch(totalMessages, (newValue) => {
  animateValue(0, newValue, 1000, (value) => (animatedTotalMessages.value = value));
});
</script>

<template>
  <div class="admin-dashboard-view p-6 bg-background-light min-h-screen">
    <h1 class="text-text-light text-4xl font-bold mb-8">Admin Dashboard</h1>

    <div v-if="loading" class="text-center py-10">
      <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="text-center py-10 text-primary-red bg-secondary-black p-4 rounded-lg">{{ error }}</div>
    <div v-else class="space-y-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Total Products Card -->
        <div
          class="bg-secondary-black p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
          style="animation-delay: 0.1s"
        >
          <h2 class="text-2xl font-semibold text-text-light">Total Products</h2>
          <p class="text-5xl font-bold text-primary-red mt-2 animate-count-up">{{ animatedTotalProducts }}</p>
        </div>
        <!-- Total Messages Card -->
        <div
          class="bg-secondary-black p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
          style="animation-delay: 0.2s"
        >
          <h2 class="text-2xl font-semibold text-text-light">Total Messages</h2>
          <p class="text-5xl font-bold text-primary-red mt-2 animate-count-up">{{ animatedTotalMessages }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Latest Products List -->
        <div
          class="bg-secondary-black p-6 rounded-xl shadow-lg animate-fade-in-up"
          style="animation-delay: 0.3s"
        >
          <h2 class="text-2xl font-semibold text-text-light mb-4">Latest Products</h2>
          <ul v-if="latestProducts.length > 0" class="space-y-3">
            <li
              v-for="(product, index) in latestProducts"
              :key="product.id"
              class="flex justify-between items-center border-b border-border-color pb-2 animate-fade-in-up"
              :style="{ 'animation-delay': `${0.4 + index * 0.1}s` }"
            >
              <span class="font-medium text-text-light">{{ product.name }}</span>
              <span class="text-sm text-text-dark">{{ new Date(product.createdAt).toLocaleDateString() }}</span>
            </li>
          </ul>
          <p v-else class="text-text-dark">No latest products.</p>
        </div>

        <!-- Latest Messages List -->
        <div
          class="bg-secondary-black p-6 rounded-xl shadow-lg animate-fade-in-up"
          style="animation-delay: 0.4s"
        >
          <h2 class="text-2xl font-semibold text-text-light mb-4">Latest Messages</h2>
          <ul v-if="latestMessages.length > 0" class="space-y-3">
            <li
              v-for="(message, index) in latestMessages"
              :key="message.id"
              class="border-b border-border-color pb-2 animate-fade-in-up"
              :style="{ 'animation-delay': `${0.5 + index * 0.1}s` }"
            >
              <p class="font-medium text-text-light">{{ message.name }} ({{ message.email }})</p>
              <p class="text-sm text-text-dark">{{ new Date(message.createdAt).toLocaleDateString() }}</p>
            </li>
          </ul>
          <p v-else class="text-text-dark">No latest messages.</p>
        </div>
      </div>
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
