<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post('https://tribus-lms.test/wp-json/jwt-auth/v1/token', {
      username: username.value,
      password: password.value,
    });

    localStorage.setItem('token', response.data.token); // Store the token in localStorage

    /** Making API Requests
     * const token = localStorage.getItem('token');
     * const options = {
     *   headers: {
     *     Authorization: `Bearer ${token}`
     *   }
     * };
     */

    console.log(response.data);

    alert('Login successful!');

  } catch (error) {
    if(error.status === 403) {
      alert('Invalid username or password');
    } else {
      alert('Login failed: ' + error.response.data.message);
    }
    console.log(error);
  }
};
</script>
