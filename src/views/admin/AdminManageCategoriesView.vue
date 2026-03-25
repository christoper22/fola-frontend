<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { API_URL } from '@/config'

interface Category {
  id: number
  name: string
  description: string
  createdAt: string
}

const authStore = useAuthStore()
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const newCategory = ref({ name: '', description: '' })
const editingCategory = ref<Category | null>(null)
const deletingCategoryId = ref<number | null>(null)

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`)
    categories.value = response.data
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.error || 'Failed to load categories.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

const addCategory = async () => {
  try {
    await axios.post(`${API_URL}/api/categories`, newCategory.value, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    showAddModal.value = false
    newCategory.value = { name: '', description: '' }
    fetchCategories()
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || 'Failed to add category.')
    } else {
      alert('An unexpected error occurred.')
    }
  }
}

const openEditModal = (category: Category) => {
  editingCategory.value = { ...category }
  showEditModal.value = true
}

const updateCategory = async () => {
  if (!editingCategory.value) return
  try {
    await axios.put(`${API_URL}/api/categories/${editingCategory.value.id}`, {
      name: editingCategory.value.name,
      description: editingCategory.value.description
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    showEditModal.value = false
    editingCategory.value = null
    fetchCategories()
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || 'Failed to update category.')
    } else {
      alert('An unexpected error occurred.')
    }
  }
}

const openDeleteModal = (id: number) => {
  deletingCategoryId.value = id
  showDeleteModal.value = true
}

const deleteCategory = async () => {
  if (!deletingCategoryId.value) return
  try {
    await axios.delete(`${API_URL}/api/categories/${deletingCategoryId.value}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    showDeleteModal.value = false
    deletingCategoryId.value = null
    fetchCategories()
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || 'Failed to delete category.')
    } else {
      alert('An unexpected error occurred.')
    }
  }
}
</script>

<template>
  <div class="p-6 bg-background-light min-h-screen">
    <h1 class="text-4xl font-bold text-text-light mb-6 border-b-2 border-border-color pb-2">
      Manage Categories
    </h1>

    <button
      @click="showAddModal = true"
      class="bg-gray-500 hover:bg-secondary-red text-white font-bold py-2 px-4 rounded mb-6 transition duration-300"
    >
      Add New Category
    </button>

    <div v-if="loading" class="text-center py-8 text-text-dark">Loading categories...</div>
    <div v-else-if="error" class="text-center py-8 text-primary-red">{{ error }}</div>
    <div v-else>
      <div v-if="categories.length > 0" class="overflow-x-auto bg-secondary-black rounded-lg shadow-lg">
        <table class="min-w-full border border-border-color">
          <thead>
            <tr>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Name</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Description</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id" class="hover:bg-primary-black transition duration-200">
              <td class="py-2 px-4 border-b border-border-color text-text-dark">{{ category.name }}</td>
              <td class="py-2 px-4 border-b border-border-color text-text-dark">{{ category.description }}</td>
              <td class="py-2 px-4 border-b border-border-color">
                <button
                  @click="openEditModal(category)"
                  class="bg-amber-200 hover:bg-secondary-red text-text-light py-1 px-3 rounded text-sm mr-2 transition duration-300"
                >Edit</button>
                <button
                  @click="openDeleteModal(category.id)"
                  class="bg-red-200 hover:bg-secondary-red text-text-light py-1 px-3 rounded text-sm transition duration-300"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-text-dark mt-4">No categories found.</p>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-gray-300 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-text-light mb-4">Add Category</h2>
        <form @submit.prevent="addCategory" class="space-y-4">
          <div>
            <label class="block text-text-dark text-sm font-bold mb-2">Name:</label>
            <input v-model="newCategory.name" type="text" class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none" required />
          </div>
          <div>
            <label class="block text-text-dark text-sm font-bold mb-2">Description:</label>
            <textarea v-model="newCategory.description" class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none"></textarea>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="button" @click="showAddModal = false" class="bg-primary-black text-text-light font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
            <button type="submit" class="bg-primary-red text-text-light font-bold py-2 px-4 rounded transition duration-300">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && editingCategory" class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-gray-300 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-text-light mb-4">Edit Category</h2>
        <form @submit.prevent="updateCategory" class="space-y-4">
          <div>
            <label class="block text-text-dark text-sm font-bold mb-2">Name:</label>
            <input v-model="editingCategory.name" type="text" class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none" required />
          </div>
          <div>
            <label class="block text-text-dark text-sm font-bold mb-2">Description:</label>
            <textarea v-model="editingCategory.description" class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none"></textarea>
          </div>
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
        <p class="mb-6 text-text-dark">Are you sure you want to delete this category?</p>
        <div class="flex justify-center space-x-4">
          <button @click="showDeleteModal = false" class="bg-primary-black text-text-light font-bold py-2 px-4 rounded transition duration-300">Cancel</button>
          <button @click="deleteCategory" class="bg-primary-red text-text-light font-bold py-2 px-4 rounded transition duration-300">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
