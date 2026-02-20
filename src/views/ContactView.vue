<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Company {
  address?: string;
  phone?: string;
  email?: string;
}

const company = ref<Company>({});
const name = ref('');
const email = ref('');
const message = ref('');
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const loading = ref(false);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/company');
    company.value = response.data;
  } catch (error) {
    console.error('Error fetching company contact info:', error);
  }
});

const submitForm = async () => {
  loading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    await axios.post('http://localhost:5000/api/messages', {
      name: name.value,
      email: email.value,
      message: message.value,
    });
    successMessage.value = 'Your message has been sent successfully!';
    name.value = '';
    email.value = '';
    message.value = '';
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Failed to send message. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="contact-view p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 border-b-2 pb-2">Contact Us</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Contact Form -->
      <div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Send us a message</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              v-model="name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message:</label>
            <textarea
              id="message"
              v-model="message"
              rows="5"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Sending...' : 'Send Message' }}
          </button>
        </form>

        <p v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</p>
        <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Company Info -->
      <div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Our Contact Information</h2>
        <div class="space-y-2 text-gray-700">
          <p v-if="company.address"><strong>Address:</strong> {{ company.address }}</p>
          <p v-if="company.phone"><strong>Phone:</strong> {{ company.phone }}</p>
          <p v-if="company.email"><strong>Email:</strong> {{ company.email }}</p>
          <p v-else>No contact information available.</p>
        </div>
      </div>
    </div>
  </div>
</template>