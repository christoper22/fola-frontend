<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { API_URL } from '@/config'
import { useCompanyStore } from '@/stores/company'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const companyStore = useCompanyStore()
const { company, loading, error: errorMessage } = storeToRefs(companyStore)

const localCompany = ref({
  name: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  logo: '',
})

watch(company, (newCompany) => {
  if (newCompany) {
    localCompany.value = { ...newCompany }
  }
}, { immediate: true })


const newLogo = ref<File | null>(null)
const submitting = ref(false)
const successMessage = ref<string | null>(null)

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    newLogo.value = target.files[0] as File
  }
}

const updateProfile = async () => {
  submitting.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const formData = new FormData()
    formData.append('name', localCompany.value.name)
    formData.append('description', localCompany.value.description)
    formData.append('address', localCompany.value.address)
    formData.append('phone', localCompany.value.phone)
    formData.append('email', localCompany.value.email)
    if (newLogo.value) {
      formData.append('logo', newLogo.value)
    }

    const response = await axios.put(`${API_URL}/api/company`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    companyStore.company = response.data
    newLogo.value = null // Clear selected file
    successMessage.value = 'Company profile updated successfully!'
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      errorMessage.value = err.response?.data?.error || 'Failed to update company profile.'
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="admin-manage-profile-view p-6 bg-background-light shadow-md rounded-lg">
    <h1 class="text-4xl font-bold text-text-light mb-6 border-b-2 border-border-color pb-2">Manage Company Profile</h1>

    <div v-if="loading" class="text-center py-8 text-text-dark">Loading profile...</div>
    <div v-else-if="errorMessage && !successMessage" class="text-center py-8 text-primary-red">
      {{ errorMessage }}
    </div>
    <div v-else-if="localCompany" class="bg-secondary-black p-8 rounded-lg shadow-lg">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div>
          <label for="name" class="block text-text-dark text-sm font-bold mb-2">Company Name:</label>
          <input
            type="text"
            id="name"
            v-model="localCompany.name"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label for="description" class="block text-text-dark text-sm font-bold mb-2"
            >Description:</label
          >
          <textarea
            id="description"
            v-model="localCompany.description"
            rows="5"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div>
          <label for="address" class="block text-text-dark text-sm font-bold mb-2">Address:</label>
          <input
            type="text"
            id="address"
            v-model="localCompany.address"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label for="phone" class="block text-text-dark text-sm font-bold mb-2">Phone:</label>
          <input
            type="text"
            id="phone"
            v-model="localCompany.phone"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label for="email" class="block text-text-dark text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            v-model="localCompany.email"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label for="logo" class="block text-text-dark text-sm font-bold mb-2">Company Logo:</label>
          <input
            type="file"
            id="logo"
            @change="handleLogoUpload"
            accept="image/*"
            class="block w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-black file:text-primary-red hover:file:bg-secondary-black"
          />
          <div v-if="localCompany.logo" class="mt-4">
            <p class="text-text-dark">Current Logo:</p>
            <img
              :src="`${API_URL}${localCompany.logo}`"
              :alt="localCompany.name"
              class="h-24 w-24 object-contain mt-2 border border-border-color rounded p-1"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="bg-primary-red hover:bg-secondary-red text-text-light font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>

      <p v-if="successMessage" class="mt-4 text-text-light">{{ successMessage }}</p>
      <p v-if="errorMessage && successMessage === null" class="mt-4 text-primary-red">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
