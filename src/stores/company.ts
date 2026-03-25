import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { API_URL } from '@/config'

interface Company {
  name: string
  description: string
  address: string
  phone: string
  email: string
  logo?: string
}

export const useCompanyStore = defineStore('company', () => {
  const company = ref<Company | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCompany() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/api/company`)
      company.value = response.data
    } catch (err) {
      error.value = 'Failed to load company data.'
    } finally {
      loading.value = false
    }
  }

  return {
    company,
    loading,
    error,
    fetchCompany,
  }
})
