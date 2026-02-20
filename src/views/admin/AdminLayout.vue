<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const logoutAdmin = () => {
  authStore.logout();
  // Redirect to admin login page after logout
  // This will be handled by the router.beforeEach guard
};
</script>

<template>
  <div class="admin-layout flex h-screen bg-gray-100">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div class="text-2xl font-bold mb-6">Admin Panel</div>
      <nav class="flex-grow">
        <ul>
          <li class="mb-2">
            <RouterLink to="/admin/dashboard" class="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/admin/products" class="block py-2 px-4 rounded hover:bg-gray-700">Manage Products</RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/admin/profile" class="block py-2 px-4 rounded hover:bg-gray-700">Manage Profile</RouterLink>
          </li>
        </ul>
      </nav>
      <div class="mt-auto">
        <button @click="logoutAdmin" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow p-4 flex justify-between items-center">
        <h1 class="text-3xl font-semibold text-gray-800">Admin Area</h1>
        <!-- Could add admin specific header elements here -->
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles for AdminLayout.vue here if needed */
</style>
