<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
</script>

<template>
  <div class="admin-dashboard-view p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 border-b-2 pb-2">Admin Dashboard</h1>

    <div v-if="loading" class="text-center py-8">Loading dashboard data...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-blue-100 p-6 rounded-lg shadow-md text-center">
          <h2 class="text-2xl font-semibold text-blue-800">Total Products</h2>
          <p class="text-5xl font-bold text-blue-600 mt-2">{{ totalProducts }}</p>
        </div>
        <div class="bg-green-100 p-6 rounded-lg shadow-md text-center">
          <h2 class="text-2xl font-semibold text-green-800">Total Messages</h2>
          <p class="text-5xl font-bold text-green-600 mt-2">{{ totalMessages }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-gray-700 mb-4">Latest Products</h2>
          <ul v-if="latestProducts.length > 0" class="space-y-2">
            <li v-for="product in latestProducts" :key="product.id" class="flex justify-between items-center border-b pb-2">
              <span>{{ product.name }}</span>
              <span class="text-sm text-gray-500">{{ new Date(product.createdAt).toLocaleDateString() }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-600">No latest products.</p>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-gray-700 mb-4">Latest Messages</h2>
          <ul v-if="latestMessages.length > 0" class="space-y-2">
            <li v-for="message in latestMessages" :key="message.id" class="border-b pb-2">
              <p class="font-medium">{{ message.name }} ({{ message.email }})</p>
              <p class="text-sm text-gray-500">{{ new Date(message.createdAt).toLocaleDateString() }}</p>
            </li>
          </ul>
          <p v-else class="text-gray-600">No latest messages.</p>
        </div>
      </div>
    </div>
  </div>
</template>
