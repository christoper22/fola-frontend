<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logoutAdmin = () => {
  authStore.logout()
  router.push('/admin/login')
  // Redirect to admin login page after logout
  // This will be handled by the router.beforeEach guard
}
</script>

<template>
  <div class="admin-layout flex h-screen bg-background-light">
    <!-- Admin Sidebar -->
    <aside
      class="w-64 bg-gray-400 text-text-light p-4 flex flex-col border-r border-border-color animate-fade-in-right shadow-xl"
    >
      <div class="text-3xl font-extrabold mb-8 text-primary-red tracking-wide">Admin Panel</div>
      <nav class="flex-grow">
        <ul>
          <li class="mb-3">
            <RouterLink
              to="/admin/dashboard"
              class="block py-2 px-4 rounded-lg hover:bg-secondary-red hover:text-text-light transition duration-200 transform hover:scale-105"
              active-class="bg-primary-red text-text-light shadow-md"
              >Dashboard</RouterLink
            >
          </li>
          <li class="mb-3">
            <RouterLink
              to="/admin/products"
              class="block py-2 px-4 rounded-lg hover:bg-secondary-red hover:text-text-light transition duration-200 transform hover:scale-105"
              active-class="bg-primary-red text-text-light shadow-md"
              >Manage Products</RouterLink
            >
          </li>
          <li class="mb-3">
            <RouterLink
              to="/admin/profile"
              class="block py-2 px-4 rounded-lg hover:bg-secondary-red hover:text-text-light transition duration-200 transform hover:scale-105"
              active-class="bg-primary-red text-text-light shadow-md"
              >Manage Profile</RouterLink
            >
          </li>
        </ul>
      </nav>
      <div class="mt-auto pt-4 border-t border-border-color">
        <button
          @click="logoutAdmin"
          class="w-full bg-primary-red hover:bg-secondary-red text-text-light font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="bg-gray-200 shadow p-4 flex justify-between items-center border-b border-border-color"
      >
        <h1 class="text-3xl font-semibold text-text-light">Admin Area</h1>
        <!-- Could add admin specific header elements here -->
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <RouterView />
      </main>
      <!-- Admin Footer -->
      <footer class="bg-primary-black text-text-light p-4 text-center border-t border-border-color">
        <p>&copy; 2024 Fola Company Admin. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles for AdminLayout.vue here if needed */
</style>
