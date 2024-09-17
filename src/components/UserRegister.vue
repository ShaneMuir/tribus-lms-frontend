<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('');
const email = ref('');
const password = ref('');

const register = async () => {
  try {
    const response = await axios.post('https://tribus-lms.test/wp-json/custom/v1/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    console.log(response.data);

    alert('Registration successful!');
  } catch (error) {

    console.log(error);

    alert('Registration failed: ' + error.response.data.message);
  }
};
</script>

<style scoped>
/* Add your styling here */
</style>
