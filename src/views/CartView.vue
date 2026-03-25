<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useCompanyStore } from '@/stores/company'
import { formatRupiah } from '@/utils/format'
import { API_URL } from '@/config'
import { computed } from 'vue'

const cartStore = useCartStore()
const companyStore = useCompanyStore()

const whatsAppPhoneNumber = computed(() => companyStore.company?.phone)

const generateWhatsAppMessage = () => {
  let message = 'Hello, I would like to order the following items:\n\n'
  cartStore.items.forEach((item) => {
    message += `- ${item.name} (Size: ${item.size}, Qty: ${item.quantity}) - ${formatRupiah(
      item.price * item.quantity,
    )}\n`
  })
  message += `\nTotal: *${formatRupiah(cartStore.totalPrice)}*`
  return encodeURIComponent(message)
}

const getWhatsAppUrl = () => {
  if (whatsAppPhoneNumber.value) {
    return `https://wa.me/${whatsAppPhoneNumber.value}?text=${generateWhatsAppMessage()}`
  }
  return ''
}
</script>

<template>
  <div class="cart-view p-2 sm:p-6 bg-background-light min-h-screen">
    <h1 class="text-text-light text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Your Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-10">
      <p class="text-text-dark text-lg sm:text-xl">Your cart is empty.</p>
      <RouterLink
        to="/products"
        class="text-primary-red hover:underline mt-4 inline-block"
        >Continue Shopping</RouterLink
      >
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <div class="bg-secondary-black shadow-lg rounded-lg p-4 sm:p-6">
        <ul>
          <li
            v-for="item in cartStore.items"
            :key="`${item.id}-${item.size}`"
            class="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-border-color"
          >
            <div class="flex items-center w-full sm:w-auto">
              <img
                :src="`${API_URL}${item.image}`"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded mr-4"
              />
              <div class="flex-grow">
                <h2 class="text-text-light text-lg font-semibold">{{ item.name }}</h2>
                <p class="text-text-dark">Size: {{ item.size }}</p>
                <p class="text-primary-red font-bold">{{ formatRupiah(item.price) }}</p>
              </div>
            </div>
            <div class="flex items-center mt-4 sm:mt-0 w-full sm:w-auto justify-end">
              <div class="flex items-center">
                <button @click="cartStore.updateQuantity(item.id, item.size, item.quantity - 1)" class="bg-gray-700 text-white w-8 h-8 rounded-l">-</button>
                <span class="bg-primary-black text-text-light w-12 h-8 flex items-center justify-center border-t border-b border-border-color">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.id, item.size, item.quantity + 1)" class="bg-gray-700 text-white w-8 h-8 rounded-r">+</button>
              </div>
              <button
                @click="cartStore.removeItem(item.id, item.size)"
                class="text-red-500 hover:text-red-700 ml-4"
              >
                Remove
              </button>
            </div>
          </li>
        </ul>

        <div class="mt-6 text-right">
          <p class="text-text-light text-xl sm:text-2xl">
            Total: <span class="font-bold text-primary-red">{{ formatRupiah(cartStore.totalPrice) }}</span>
          </p>
        </div>

        <div class="mt-8 flex justify-end">
          <a
            :href="getWhatsAppUrl()"
            target="_blank"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full sm:w-auto text-center"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
