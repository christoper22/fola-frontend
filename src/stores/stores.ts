import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { API_URL } from '@/config'

export interface Store {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
}

export const useStoresStore = defineStore('stores', () => {
  const stores = ref<Store[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStores() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/api/stores`)
      stores.value = response.data
    } catch (err) {
      error.value = 'Failed to load stores.'
    } finally {
      loading.value = false
    }
  }

  return {
    stores,
    loading,
    error,
    fetchStores,
  }
})
