<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import CartButton from './components/CartButton.vue'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompanyStore } from './stores/company'
import { useStoresStore } from './stores/stores'

const route = useRoute()
const companyStore = useCompanyStore()
const storesStore = useStoresStore()

onMounted(() => {
  companyStore.fetchCompany()
  storesStore.fetchStores()
})

// Daftar route yang tidak mau pakai layout

// Jika route saat ini tidak ada di noLayoutRoutes → tampilkan layout
const showLayout = computed(() => !route.path.startsWith('/admin/'))
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background-light text-text-dark">
    <TheNavbar v-if="showLayout" />
    <main :class="{ 'flex-grow container mx-auto p-4': showLayout, 'flex-grow': !showLayout }">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <CartButton v-if="showLayout" />
    <TheFooter v-if="showLayout" />
  </div>
</template>

<style scoped>
/* Add any specific styles for App.vue here if needed */
</style>