<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { API_URL } from '@/config'

interface Store {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
}

const authStore = useAuthStore()
const stores = ref<Store[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const newStore = ref({ name: '', address: '', latitude: 0, longitude: 0 })
const editingStore = ref<Store | null>(null)
const deletingStoreId = ref<number | null>(null)

const fetchStores = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/stores`)
    stores.value = response.data
  } catch (err) {
    error.value = 'Failed to load stores.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStores)

const addStore = async () => {
  try {
    await axios.post(`${API_URL}/api/stores`, newStore.value, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    showAddModal.value = false
    newStore.value = { name: '', address: '', latitude: 0, longitude: 0 }
    fetchStores()
  } catch (err) {
    alert('Failed to add store.')
  }
}

const openEditModal = (store: Store) => {
  editingStore.value = { ...store }
  showEditModal.value = true
}

const updateStore = async () => {
  if (!editingStore.value) return
  try {
    await axios.put(`${API_URL}/api/stores/${editingStore.value.id}`, editingStore.value, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    showEditModal.value = false
    editingStore.value = null
    fetchStores()
  } catch (err) {
    alert('Failed to update store.')
  }
}

const openDeleteModal = (id: number) => {
  deletingStoreId.value = id
  showDeleteModal.value = true
}

const deleteStore = async () => {
  if (!deletingStoreId.value) return
  try {
    await axios.delete(`${API_URL}/api/stores/${deletingStoreId.value}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    showDeleteModal.value = false
    deletingStoreId.value = null
    fetchStores()
  } catch (err) {
    alert('Failed to delete store.')
  }
}
</script>

<template>
  <div class="p-6 bg-background-light min-h-screen">
    <h1 class="text-4xl font-bold text-text-light mb-6 border-b-2 border-border-color pb-2">
      Manage Stores
    </h1>

    <button
      @click="showAddModal = true"
      class="bg-gray-500 hover:bg-secondary-red text-white font-bold py-2 px-4 rounded mb-6 transition duration-300"
    >
      Add New Store
    </button>

    <div v-if="loading" class="text-center py-8 text-text-dark">Loading stores...</div>
    <div v-else-if="error" class="text-center py-8 text-primary-red">{{ error }}</div>
    <div v-else>
      <div v-if="stores.length > 0" class="overflow-x-auto bg-secondary-black rounded-lg shadow-lg">
        <table class="min-w-full border border-border-color">
          <thead>
            <tr>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Name</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Address</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Latitude</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Longitude</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="store in stores" :key="store.id" class="hover:bg-primary-black transition duration-200">
              <td class="py-2 px-4 border-b border-border-color text-text-dark">{{ store.name }}</td>
              <td class="py-2 px-4 border-b border-border-color text-text-dark">{{ store.address }}</td>
              <td class="py-2 px-4 border-b border-border-color text-text-dark">{{ store.latitude }}</td>
              <td class="py-2 px-4 border-b border-border-color text-text-dark">{{ store.longitude }}</td>
              <td class="py-2 px-4 border-b border-border-color">
                <button
                  @click="openEditModal(store)"
                  class="bg-amber-200 hover:bg-secondary-red text-text-light py-1 px-3 rounded text-sm mr-2 transition duration-300"
                >Edit</button>
                <button
                  @click="openDeleteModal(store.id)"
                  class="bg-red-200 hover:bg-secondary-red text-text-light py-1 px-3 rounded text-sm transition duration-300"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-text-dark mt-4">No stores found.</p>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-gray-300 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-text-light mb-4">Add Store</h2>
        <form @submit.prevent="addStore" class="space-y-4">
          <input v-model="newStore.name" type="text" placeholder="Name" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <input v-model="newStore.address" type="text" placeholder="Address" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <input v-model.number="newStore.latitude" type="number" placeholder="Latitude" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <input v-model.number="newStore.longitude" type="number" placeholder="Longitude" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <div class="flex justify-end space-x-4">
            <button type="button" @click="showAddModal = false" class="bg-primary-black text-text-light font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
            <button type="submit" class="bg-primary-red text-text-light font-bold py-2 px-4 rounded transition duration-300">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && editingStore" class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-gray-300 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-text-light mb-4">Edit Store</h2>
        <form @submit.prevent="updateStore" class="space-y-4">
          <input v-model="editingStore.name" type="text" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <input v-model="editingStore.address" type="text" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <input v-model.number="editingStore.latitude" type="number" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <input v-model.number="editingStore.longitude" type="number" class="w-full p-2 rounded bg-primary-black text-text-light" required />
          <div class="flex justify-end space-x-4">
            <button type="button" @click="showEditModal = false" class="bg-primary-black text-text-light font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
            <button type="submit" class="bg-primary-red text-text-light font-bold py-2 px-4 rounded transition duration-300">Update</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-secondary-black p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 class="text-2xl font-bold text-text-light mb-4">Confirm Delete</h2>
        <p class="mb-6 text-text-dark">Are you sure you want to delete this store?</p>
        <div class="flex justify-center space-x-4">
          <button @click="showDeleteModal = false" class="bg-primary-black text-text-light font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
          <button @click="deleteStore" class="bg-primary-red text-text-light font-bold py-2 px-4 rounded transition duration-300">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
