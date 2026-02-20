<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

interface Company {
  name: string
  description: string
  address: string
  phone: string
  email: string
  logo?: string
}

const authStore = useAuthStore()
const company = ref<Company>({
  name: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  logo: '',
})
const newLogo = ref<File | null>(null)
const loading = ref(true)
const submitting = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/company')
    if (response.data) {
      company.value = response.data
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Failed to load company profile.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    newLogo.value = target.files[0]
  }
}

const updateProfile = async () => {
  submitting.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const formData = new FormData()
    formData.append('name', company.value.name)
    formData.append('description', company.value.description)
    formData.append('address', company.value.address)
    formData.append('phone', company.value.phone)
    formData.append('email', company.value.email)
    if (newLogo.value) {
      formData.append('logo', newLogo.value)
    }

    const response = await axios.put('http://localhost:5000/api/company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    company.value = response.data
    newLogo.value = null // Clear selected file
    successMessage.value = 'Company profile updated successfully!'
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Failed to update company profile.'
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
    <div v-else class="bg-secondary-black p-8 rounded-lg shadow-lg">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div>
          <label for="name" class="block text-text-dark text-sm font-bold mb-2">Company Name:</label>
          <input
            type="text"
            id="name"
            v-model="company.name"
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
            v-model="company.description"
            rows="5"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div>
          <label for="address" class="block text-text-dark text-sm font-bold mb-2">Address:</label>
          <input
            type="text"
            id="address"
            v-model="company.address"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label for="phone" class="block text-text-dark text-sm font-bold mb-2">Phone:</label>
          <input
            type="text"
            id="phone"
            v-model="company.phone"
            class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label for="email" class="block text-text-dark text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            v-model="company.email"
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
          <div v-if="company.logo" class="mt-4">
            <p class="text-text-dark">Current Logo:</p>
            <img
              :src="`${company.logo}`"
              :alt="company.name"
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
