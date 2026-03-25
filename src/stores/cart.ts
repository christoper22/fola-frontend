import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const storedItems = localStorage.getItem('cartItems')
  if (storedItems) {
    items.value = JSON.parse(storedItems)
  }

  watch(
    items,
    (newItems) => {
      localStorage.setItem('cartItems', JSON.stringify(newItems))
    },
    { deep: true },
  )

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  function addItem(item: Omit<CartItem, 'quantity'>, size: string) {
    const existingItem = items.value.find((i) => i.id === item.id && i.size === size)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...item, quantity: 1, size })
    }
  }

  function removeItem(itemId: number, size: string) {
    items.value = items.value.filter((i) => !(i.id === itemId && i.size === size))
  }

  function updateQuantity(itemId: number, size: string, quantity: number) {
    const item = items.value.find((i) => i.id === itemId && i.size === size)
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity
      } else {
        removeItem(itemId, size)
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
