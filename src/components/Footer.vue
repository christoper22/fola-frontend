<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const companyName = ref('Fola Company');
const currentYear = ref(new Date().getFullYear());

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/company');
    if (response.data && response.data.name) {
      companyName.value = response.data.name;
    }
  } catch (error) {
    console.error('Error fetching company name:', error);
  }
});
</script>

<template>
  <footer class="bg-gray-800 text-white p-4 mt-8">
    <div class="container mx-auto text-center">
      <p>&copy; {{ currentYear }} {{ companyName }}. All rights reserved.</p>
    </div>
  </footer>
</template>
