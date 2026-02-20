<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow container mx-auto p-4">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
/* Add any specific styles for App.vue here if needed */
</style>