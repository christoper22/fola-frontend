<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { formatRupiah } from '@/utils/format'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  link?: string // Add link field
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
  link: '', // Add link field
})
const editingProduct = ref<Product | null>(null)
const deletingProductId = ref<number | null>(null)

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/products')
    products.value = response.data.products
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load products.'
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
      editingProduct.value.image = target.files[0] as any // Cast to any for now
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
      formData.append('image', newProduct.value.image)
    }
    if (newProduct.value.link) {
      formData.append('link', newProduct.value.link)
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
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to add product.'
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
    if (editingProduct.value.image && typeof editingProduct.value.image !== 'string') {
      formData.append('image', editingProduct.value.image)
    }
    if (editingProduct.value.link) {
      formData.append('link', editingProduct.value.link)
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
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to update product.'
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
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to delete product.'
    console.error(err)
  }
}
</script>

<template>
  <div class="admin-manage-products-view p-6 bg-background-light min-h-screen">
    <h1 class="text-4xl font-bold text-text-light mb-6 border-b-2 border-border-color pb-2">Manage Products</h1>

    <button
      @click="showAddModal = true"
      class="bg-primary-red hover:bg-secondary-red text-text-light font-bold py-2 px-4 rounded mb-6 transition duration-300"
    >
      Add New Product
    </button>

    <div v-if="loading" class="text-center py-8 text-text-dark">Loading products...</div>
    <div v-else-if="error" class="text-center py-8 text-primary-red">{{ error }}</div>
    <div v-else>
      <div v-if="products.length > 0" class="overflow-x-auto bg-secondary-black rounded-lg shadow-lg">
        <table class="min-w-full border border-border-color">
          <thead>
            <tr>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Image</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Name</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Price</th>
              <th class="py-3 px-4 border-b border-border-color text-left text-text-light">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="hover:bg-primary-black transition duration-200">
              <td class="py-2 px-4 border-b border-border-color">
                <img
                  :src="`${product.image}`"
                  :alt="product.name"
                  class="w-16 h-16 object-cover rounded"
                />
              </td>
              <td class="py-2 px-4 border-b border-border-color text-text-dark">{{ product.name }}</td>
              <td class="py-2 px-4 border-b border-border-color text-primary-red">{{ formatRupiah(product.price) }}</td>
              <td class="py-2 px-4 border-b border-border-color">
                <button
                  @click="openEditModal(product)"
                  class="bg-primary-red hover:bg-secondary-red text-text-light py-1 px-3 rounded text-sm mr-2 transition duration-300"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(product.id)"
                  class="bg-primary-red hover:bg-secondary-red text-text-light py-1 px-3 rounded text-sm transition duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-text-dark mt-4">No products found.</p>
    </div>

    <!-- Add Product Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div class="bg-secondary-black p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-text-light mb-4">Add New Product</h2>
        <form @submit.prevent="addProduct" class="space-y-4">
          <div>
            <label for="newProductName" class="block text-text-dark text-sm font-bold mb-2"
              >Name:</label
            >
            <input
              type="text"
              id="newProductName"
              v-model="newProduct.name"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label for="newProductDescription" class="block text-text-dark text-sm font-bold mb-2"
              >Description:</label
            >
            <textarea
              id="newProductDescription"
              v-model="newProduct.description"
              rows="3"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div>
            <label for="newProductPrice" class="block text-text-dark text-sm font-bold mb-2"
              >Price:</label
            >
            <input
              type="number"
              id="newProductPrice"
              v-model.number="newProduct.price"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
              step="0.01"
              required
            />
          </div>
          <div>
            <label for="newProductImage" class="block text-text-dark text-sm font-bold mb-2"
              >Image:</label
            >
            <input
              type="file"
              id="newProductImage"
              @change="handleImageUpload"
              accept="image/*"
              class="block w-full text-sm text-text-dark"
              required
            />
          </div>
          <div>
            <label for="newProductLink" class="block text-text-dark text-sm font-bold mb-2"
              >Link (Optional):</label
            >
            <input
              type="url"
              id="newProductLink"
              v-model="newProduct.link"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showAddModal = false"
              class="bg-primary-black hover:bg-secondary-black text-text-light font-bold py-2 px-4 rounded transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-primary-red hover:bg-secondary-red text-text-light font-bold py-2 px-4 rounded transition duration-300"
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
      class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div class="bg-secondary-black p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-text-light mb-4">Edit Product</h2>
        <form @submit.prevent="updateProduct" class="space-y-4">
          <div>
            <label for="editProductName" class="block text-text-dark text-sm font-bold mb-2"
              >Name:</label
            >
            <input
              type="text"
              id="editProductName"
              v-model="editingProduct.name"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label for="editProductDescription" class="block text-text-dark text-sm font-bold mb-2"
              >Description:</label
            >
            <textarea
              id="editProductDescription"
              v-model="editingProduct.description"
              rows="3"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div>
            <label for="editProductPrice" class="block text-text-dark text-sm font-bold mb-2"
              >Price:</label
            >
            <input
              type="number"
              id="editProductPrice"
              v-model.number="editingProduct.price"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
              step="0.01"
              required
            />
          </div>
          <div>
            <label for="editProductImage" class="block text-text-dark text-sm font-bold mb-2"
              >Image:</label
            >
            <input
              type="file"
              id="editProductImage"
              @change="handleImageUpload"
              accept="image/*"
              class="block w-full text-sm text-text-dark"
            />
            <div
              v-if="editingProduct.image && typeof editingProduct.image === 'string'"
              class="mt-2"
            >
              <p class="text-text-dark">Current Image:</p>
              <img
                :src="`${editingProduct.image}`"
                :alt="editingProduct.name"
                class="w-24 h-24 object-cover rounded mt-1"
              />
            </div>
          </div>
          <div>
            <label for="editProductLink" class="block text-text-dark text-sm font-bold mb-2"
              >Link (Optional):</label
            >
            <input
              type="url"
              id="editProductLink"
              v-model="editingProduct.link"
              class="shadow appearance-none border border-border-color rounded w-full py-2 px-3 text-text-light bg-primary-black focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showEditModal = false"
              class="bg-primary-black hover:bg-secondary-black text-text-light font-bold py-2 px-4 rounded transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-primary-red hover:bg-secondary-red text-text-light font-bold py-2 px-4 rounded transition duration-300"
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
      class="fixed inset-0 bg-primary-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div class="bg-secondary-black p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 class="text-2xl font-bold text-text-light mb-4">Confirm Delete</h2>
        <p class="mb-6 text-text-dark">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div class="flex justify-center space-x-4">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="bg-primary-black hover:bg-secondary-black text-text-light font-bold py-2 px-4 rounded transition duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="deleteProduct"
            class="bg-primary-red hover:bg-secondary-red text-text-light font-bold py-2 px-4 rounded transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
