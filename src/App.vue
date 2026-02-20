<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Daftar route yang tidak mau pakai layout
const noLayoutRoutes = ['/admin/login']

// Jika route saat ini tidak ada di noLayoutRoutes → tampilkan layout
const showLayout = computed(() => !route.path.startsWith('/admin/'))
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background-light text-text-dark">
    <Navbar v-if="showLayout" />
    <main :class="{ 'flex-grow container mx-auto p-4': showLayout, 'flex-grow': !showLayout }">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Footer v-if="showLayout" />
  </div>
</template>

<style scoped>
/* Add any specific styles for App.vue here if needed */
</style>