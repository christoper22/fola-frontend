<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStoresStore } from '@/stores/stores'
import { useCompanyStore } from '@/stores/company'
import { storeToRefs } from 'pinia'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css' // Import Leaflet CSS

const companyStore = useCompanyStore()
const { company } = storeToRefs(companyStore)
const companyName = computed(() => company.value?.name || 'Fola Company')
const currentYear = ref(new Date().getFullYear())

const storesStore = useStoresStore()
const { stores } = storeToRefs(storesStore)

const mapInstance = ref<L.Map | null>(null) // Ref to store the map instance
const markerGroupRef = ref<L.FeatureGroup | null>(null) // Ref to store the marker group

onMounted(async () => {
  // Ensure stores are fetched before initializing the map
  await storesStore.fetchStores()

  if (stores.value.length > 0) {
    await nextTick() // Ensure the map container is rendered

    const mapContainer = document.getElementById('map-container')
    if (!mapContainer) {
      console.error('Map container not found.')
      return
    }

    const map = L.map(mapContainer).setView([stores.value[0].latitude, stores.value[0].longitude], 10)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    markerGroupRef.value = L.featureGroup().addTo(map)

    stores.value.forEach(store => {
      L.marker([store.latitude, store.longitude])
        .bindPopup(`<b>${store.name}</b><br>${store.address}`)
        .addTo(markerGroupRef.value!)
    })

    // Fit map to markers
    if (stores.value.length > 0) {
      map.fitBounds(markerGroupRef.value.getBounds())
    }
    mapInstance.value = map
  }
})

const panToStore = (store: Store) => {
  if (mapInstance.value && markerGroupRef.value) {
    mapInstance.value.flyTo([store.latitude, store.longitude], 15) // Fly to the store with zoom level 15
  }
}
</script>

<template>
  <footer class="bg-red-600 text-white p-6 mt-12 shadow-inner border-t border-border-color">
    <div class="container mx-auto">
      <div v-if="stores.length > 0" class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Map Card -->
        <div class="bg-secondary-black p-6 rounded-lg shadow-lg">
          <h3 class="text-2xl font-bold text-center mb-4">Store Locations</h3>
          <div id="map-container" style="height: 400px; width: 100%; border-radius: 0.5rem;"></div>
        </div>
        <!-- Store List Card -->
        <div class="bg-secondary-black p-6 rounded-lg shadow-lg">
          <h3 class="text-2xl font-bold mb-4">Our Stores</h3>
          <ul class="space-y-3">
            <li v-for="store in stores" :key="store.id">
              <button @click="panToStore(store)" class="block w-full text-left text-white hover:text-primary-red transition-colors duration-200 p-2 rounded-md hover:bg-primary-black">
                <span class="font-semibold">{{ store.name }}</span><br>
                <span class="text-sm text-gray-300">{{ store.address }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="text-center">
        <p>&copy; {{ currentYear }} {{ companyName }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
