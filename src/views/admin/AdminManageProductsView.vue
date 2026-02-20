<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios, { isAxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  createdAt: string
}

const authStore = useAuthStore()
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const newProduct = ref({
  name: '',
  description: '',
  price: 0,
  image: null as File | null,
})
const editingProduct = ref<Product | null>(null)
const deletingProductId = ref<number | null>(null)

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/products')
    products.value = response.data.products
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      error.value = err.response?.data?.error || 'Failed to load products.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    if (showAddModal.value) {
      newProduct.value.image = target.files[0]
    } else if (showEditModal.value && editingProduct.value) {
      editingProduct.value.image = target.files[0];
    }
  }
}

const addProduct = async () => {
  try {
    const formData = new FormData()
    formData.append('name', newProduct.value.name)
    formData.append('description', newProduct.value.description)
    formData.append('price', newProduct.value.price.toString())
    if (newProduct.value.image) {
      const imageToAppend = newProduct.value.image;
      if (imageToAppend instanceof File) {
        formData.append('image', imageToAppend);
      }
    }

    await axios.post('http://localhost:5000/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    showAddModal.value = false
    newProduct.value = { name: '', description: '', price: 0, image: null }
    fetchProducts()
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      error.value = err.response?.data?.error || 'Failed to add product.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
    console.error(err)
  }
}

const openEditModal = (product: Product) => {
  editingProduct.value = { ...product } // Create a copy to avoid direct mutation
  showEditModal.value = true
}

const updateProduct = async () => {
  if (!editingProduct.value) return

  try {
    const formData = new FormData()
    formData.append('name', editingProduct.value.name)
    formData.append('description', editingProduct.value.description)
    formData.append('price', editingProduct.value.price.toString())
    if (editingProduct.value.image) {
      const imageToAppend = editingProduct.value.image;
      if (imageToAppend instanceof File) {
        formData.append('image', imageToAppend);
      }
    }

    await axios.put(`http://localhost:5000/api/products/${editingProduct.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    showEditModal.value = false
    editingProduct.value = null
    fetchProducts()
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      error.value = err.response?.data?.error || 'Failed to update product.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
    console.error(err)
  }
}

const openDeleteModal = (productId: number) => {
  deletingProductId.value = productId
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!deletingProductId.value) return

  try {
    await axios.delete(`http://localhost:5000/api/products/${deletingProductId.value}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    showDeleteModal.value = false
    deletingProductId.value = null
    fetchProducts()
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      error.value = err.response?.data?.error || 'Failed to delete product.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
    console.error(err)
  }
}
</script>

<template>
  <div class="admin-manage-products-view p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 border-b-2 pb-2">Manage Products</h1>

    <button
      @click="showAddModal = true"
      class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-6"
    >
      Add New Product
    </button>

    <div v-if="loading" class="text-center py-8">Loading products...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
    <div v-else>
      <div v-if="products.length > 0" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th class="py-2 px-4 border-b text-left">Image</th>
              <th class="py-2 px-4 border-b text-left">Name</th>
              <th class="py-2 px-4 border-b text-left">Price</th>
              <th class="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="py-2 px-4 border-b">
                <img
                  :src="`/uploads/products/${product.image}`"
                  :alt="product.name"
                  class="w-full h-48 object-cover rounded"
                />
              </td>
              <td class="py-2 px-4 border-b">{{ product.name }}</td>
              <td class="py-2 px-4 border-b">${{ product.price.toFixed(2) }}</td>
              <td class="py-2 px-4 border-b">
                <button
                  @click="openEditModal(product)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm mr-2"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(product.id)"
                  class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-gray-600">No products found.</p>
    </div>

    <!-- Add Product Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Add New Product</h2>
        <form @submit.prevent="addProduct" class="space-y-4">
          <div>
            <label for="newProductName" class="block text-gray-700 text-sm font-bold mb-2"
              >Name:</label
            >
            <input
              type="text"
              id="newProductName"
              v-model="newProduct.name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div>
            <label for="newProductDescription" class="block text-gray-700 text-sm font-bold mb-2"
              >Description:</label
            >
            <textarea
              id="newProductDescription"
              v-model="newProduct.description"
              rows="3"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            ></textarea>
          </div>
          <div>
            <label for="newProductPrice" class="block text-gray-700 text-sm font-bold mb-2"
              >Price:</label
            >
            <input
              type="number"
              id="newProductPrice"
              v-model.number="newProduct.price"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              step="0.01"
              required
            />
          </div>
          <div>
            <label for="newProductImage" class="block text-gray-700 text-sm font-bold mb-2"
              >Image:</label
            >
            <input
              type="file"
              id="newProductImage"
              @change="handleImageUpload"
              accept="image/*"
              class="block w-full text-sm text-gray-500"
              required
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showAddModal = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div
      v-if="showEditModal && editingProduct"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Edit Product</h2>
        <form @submit.prevent="updateProduct" class="space-y-4">
          <div>
            <label for="editProductName" class="block text-gray-700 text-sm font-bold mb-2"
              >Name:</label
            >
            <input
              type="text"
              id="editProductName"
              v-model="editingProduct.name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div>
            <label for="editProductDescription" class="block text-gray-700 text-sm font-bold mb-2"
              >Description:</label
            >
            <textarea
              id="editProductDescription"
              v-model="editingProduct.description"
              rows="3"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            ></textarea>
          </div>
          <div>
            <label for="editProductPrice" class="block text-gray-700 text-sm font-bold mb-2"
              >Price:</label
            >
            <input
              type="number"
              id="editProductPrice"
              v-model.number="editingProduct.price"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              step="0.01"
              required
            />
          </div>
          <div>
            <label for="editProductImage" class="block text-gray-700 text-sm font-bold mb-2"
              >Image:</label
            >
            <input
              type="file"
              id="editProductImage"
              @change="handleImageUpload"
              accept="image/*"
              class="block w-full text-sm text-gray-500"
            />
            <div
              v-if="editingProduct.image && typeof editingProduct.image === 'string'"
              class="mt-2"
            >
              <p class="text-gray-600">Current Image:</p>
              <img
                :src="`/uploads/products/${editingProduct.image}`"
                :alt="editingProduct.name"
                class="w-24 h-24 object-cover rounded mt-1"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showEditModal = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Product Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 class="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p class="mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div class="flex justify-center space-x-4">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="deleteProduct"
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
